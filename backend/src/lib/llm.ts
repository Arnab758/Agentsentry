import "dotenv/config";
import Groq from "groq-sdk";

/**
 * Central LLM access layer for AgentSentry.
 *
 * Every "agent", "attacker" and "healer" in this project routes through here.
 * All latency and token statistics reported by the API are measured from real
 * Groq inference calls - nothing in this module is simulated.
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: RawToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface RawToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export interface LLMToolDef {
  type: "function";
  function: { name: string; description: string; parameters: Record<string, any> };
}

export interface LLMUsage {
  input: number;
  output: number;
}

export interface ParsedToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  rawArgs: string;
}

export interface LLMResult {
  content: string;
  toolCalls: ParsedToolCall[];
  usage: LLMUsage;
  latencyMs: number;
  model: string;
  finishReason: string;
}

export const MODELS = {
  agent: process.env.AGENT_MODEL || "openai/gpt-oss-120b",
  fast: process.env.FAST_MODEL || "openai/gpt-oss-20b",
  /** Purpose-built prompt-injection classifier used as the semantic firewall. */
  guard: process.env.GUARD_MODEL || "meta-llama/llama-prompt-guard-2-22m"
};

let client: Groq | null = null;

export function isLLMConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0);
}

function getClient(): Groq {
  if (!isLLMConfigured()) {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to backend/.env to enable live model inference."
    );
  }
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY as string });
  }
  return client;
}

export interface CallLLMOptions {
  messages: LLMMessage[];
  model?: string;
  tools?: LLMToolDef[];
  temperature?: number;
  maxTokens?: number;
  /** Ask the provider for a JSON object response. */
  json?: boolean;
}

function safeParseArgs(raw: string): Record<string, any> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Single inference call. Returns the assistant message, parsed tool calls and
 * real token/latency telemetry.
 */
export async function callLLM(opts: CallLLMOptions): Promise<LLMResult> {
  const groq = getClient();
  const model = opts.model || MODELS.agent;
  const started = Date.now();

  const payload: Record<string, any> = {
    model,
    messages: opts.messages as any,
    temperature: opts.temperature ?? 0.2,
    max_tokens: opts.maxTokens ?? 1024
  };
  if (opts.tools && opts.tools.length > 0) {
    payload.tools = opts.tools;
    payload.tool_choice = "auto";
  }
  if (opts.json) {
    payload.response_format = { type: "json_object" };
  }

  const completion = (await groq.chat.completions.create(payload as any)) as any;
  const latencyMs = Date.now() - started;
  const choice = completion.choices?.[0];
  const message = choice?.message || {};

  const toolCalls: ParsedToolCall[] = (message.tool_calls || []).map((tc: RawToolCall) => ({
    id: tc.id,
    name: tc.function?.name,
    rawArgs: tc.function?.arguments || "",
    args: safeParseArgs(tc.function?.arguments || "")
  }));

  return {
    content: message.content || "",
    toolCalls,
    usage: {
      input: completion.usage?.prompt_tokens ?? 0,
      output: completion.usage?.completion_tokens ?? 0
    },
    latencyMs,
    model,
    finishReason: choice?.finish_reason || "stop"
  };
}

/**
 * Inference call that is forced to return a JSON object, then parsed. Used by
 * the healer to synthesize structured guardrail policies from an exploit trace.
 */
export async function callJSON<T>(opts: CallLLMOptions): Promise<{ data: T; usage: LLMUsage; latencyMs: number; model: string }> {
  const result = await callLLM({ ...opts, json: true });
  const cleaned = result.content
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  let data: T;
  try {
    data = JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error(`Model did not return parseable JSON: ${cleaned.slice(0, 200)}`);
    }
    data = JSON.parse(match[0]) as T;
  }
  return { data, usage: result.usage, latencyMs: result.latencyMs, model: result.model };
}

/**
 * Semantic firewall. Runs the purpose-built Meta Llama Prompt Guard 2
 * classifier over an inbound payload and returns the model's injection
 * probability in [0,1]. This is a real classifier, not a heuristic.
 */
export async function classifyInjection(text: string): Promise<{ score: number; latencyMs: number }> {
  try {
    const res = await callLLM({
      model: MODELS.guard,
      temperature: 0,
      maxTokens: 8,
      messages: [{ role: "user", content: text.slice(0, 2000) }]
    });
    const score = parseFloat((res.content || "").trim());
    return { score: Number.isFinite(score) ? score : 0, latencyMs: res.latencyMs };
  } catch {
    // The firewall must never take the agent down; degrade to regex-only.
    return { score: 0, latencyMs: 0 };
  }
}

export function totalTokens(...usages: LLMUsage[]): LLMUsage {
  return usages.reduce(
    (acc, u) => ({ input: acc.input + u.input, output: acc.output + u.output }),
    { input: 0, output: 0 }
  );
}
