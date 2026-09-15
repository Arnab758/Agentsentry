import { LLMUsage } from "../lib/llm.js";

export interface AgentToolCall {
  tool: string;
  args: Record<string, any>;
  result: any;
  blocked?: boolean;
  blockReason?: string;
}

/**
 * Result of one target-agent execution. `usage` and `latencyMs` are measured
 * from real model inference for this run.
 */
export interface AgentExecutionResult {
  response: string;
  toolCalls: AgentToolCall[];
  isCompromised: boolean;
  securityEvent?: string;
  executionSteps: string[];
  usage?: LLMUsage;
  latencyMs?: number;
  blockedCalls?: number;
  /** Prompt-injection probability reported by the semantic firewall, if enabled. */
  injectionScore?: number;
}
