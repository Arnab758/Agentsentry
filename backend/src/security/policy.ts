/**
 * Runtime guardrail engine.
 *
 * A GuardrailPolicy is the concrete, enforceable artifact produced by the
 * AutonomousImmuneHealer. It is evaluated *at runtime* on every inbound input
 * and every outbound tool call - it is not just prompt text. This is what makes
 * an immunized agent measurably different from a vulnerable one.
 */

/** Output-token ceiling for a single agent run; enforced by the immune fabric. */
export const EXECUTION_TOKEN_BUDGET = 1000;

export interface ArgRule {
  field: string;
  /**
   * strip_injection: remove embedded control phrases from the field.
   * regex_allow:     reject the call unless the field matches `pattern`.
   */
  mode: "strip_injection" | "regex_allow";
  pattern?: string;
  replacement?: string;
}

export interface GuardrailPolicy {
  name: string;
  /** Tools the agent is never permitted to invoke without cryptographic attestation. */
  deniedTools: string[];
  /** Regexes (as strings) that mark an inbound payload as a prompt-injection attempt. */
  inputInjectionPatterns: string[];
  /** Per-tool argument sanitization rules. */
  argRules: Record<string, ArgRule[]>;
  /** Wire-transfer recipient allowlist (banking). */
  allowedRecipients: string[];
  /** Maximum transfer amount permitted without multi-factor verification. */
  maxTransferAmount: number;
  /** Patterns redacted from agent output before it reaches the user. */
  redactPatterns: string[];
}

export type ToolDecision =
  | { decision: "allow"; args: Record<string, any> }
  | { decision: "sanitize"; args: Record<string, any>; reason: string }
  | { decision: "block"; reason: string };

export interface InputScreenResult {
  flagged: boolean;
  matches: string[];
  sanitized: string;
}

function compile(patterns: string[]): RegExp[] {
  const out: RegExp[] = [];
  for (const p of patterns) {
    try {
      out.push(new RegExp(p, "i"));
    } catch {
      /* ignore malformed pattern */
    }
  }
  return out;
}

const INJECTION_PHRASES = [
  /\[\s*system\s+override[^\]]*\]/gi,
  /ignore\s+(all\s+)?(prior|previous)\s+instructions?/gi,
  /disregard\s+(all\s+)?(prior|previous)\s+(instructions?|directives?)/gi,
  /you\s+are\s+now\s+(in\s+)?/gi,
  /transfer\s+all\s+(remaining\s+)?(balance|funds)/gi,
  /wipe\s+(the\s+)?logs?/gi,
  /new\s+directive\s*:/gi
];

/** Screen an inbound payload for embedded injection instructions. */
export function screenInput(policy: GuardrailPolicy, input: string): InputScreenResult {
  const regexes = compile(policy.inputInjectionPatterns);
  const matches: string[] = [];
  for (const re of regexes) {
    const found = input.match(re);
    if (found) matches.push(...found);
  }
  let sanitized = input;
  for (const phrase of INJECTION_PHRASES) {
    sanitized = sanitized.replace(phrase, "[SANITIZED]");
  }
  return { flagged: matches.length > 0, matches, sanitized };
}

/**
 * Authorize a single tool call against the active policy. Returns whether the
 * call may proceed, must be sanitized, or is blocked outright.
 */
export function authorizeToolCall(
  policy: GuardrailPolicy,
  toolName: string,
  args: Record<string, any>
): ToolDecision {
  if (policy.deniedTools.includes(toolName)) {
    return {
      decision: "block",
      reason: `Tool '${toolName}' requires cryptographic administrator attestation under policy '${policy.name}'.`
    };
  }

  const nextArgs: Record<string, any> = { ...args };
  let sanitizedReason = "";

  for (const rule of policy.argRules[toolName] || []) {
    const value = nextArgs[rule.field];
    if (typeof value !== "string") continue;

    if (rule.mode === "regex_allow") {
      const ok = rule.pattern ? new RegExp(rule.pattern, "i").test(value) : false;
      if (!ok) {
        return {
          decision: "block",
          reason: `Argument '${rule.field}' on tool '${toolName}' violated the allowlist schema (${rule.pattern}).`
        };
      }
    } else {
      let cleaned = value;
      for (const phrase of INJECTION_PHRASES) {
        cleaned = cleaned.replace(phrase, rule.replacement ?? "[SANITIZED]");
      }
      if (cleaned !== value) {
        nextArgs[rule.field] = cleaned;
        sanitizedReason = `Neutralized embedded control tokens in '${rule.field}'.`;
      }
    }
  }

  // Wire-transfer specific guards.
  if (toolName === "execute_wire_transfer") {
    const recipient = String(nextArgs.to ?? "");
    const amount = Number(nextArgs.amount ?? 0);
    const allowlisted = policy.allowedRecipients.some((r) =>
      recipient.toLowerCase().includes(r.toLowerCase())
    );
    const suspicious = /evil|adversary|attacker|hacker|exfil/i.test(recipient);
    if (suspicious || !allowlisted) {
      return {
        decision: "block",
        reason: `Recipient '${recipient}' is not on the pre-approved wire allowlist.`
      };
    }
    if (amount > policy.maxTransferAmount) {
      return {
        decision: "block",
        reason: `Transfer of $${amount} exceeds the $${policy.maxTransferAmount} no-verification ceiling and requires cryptographic human sign-off.`
      };
    }
  }

  if (toolName === "query_db") {
    const query = String(nextArgs.query ?? "");
    const forbidden = /(drop|alter|truncate|delete|insert|update)\s+/i.test(query);
    const stacked = query.includes(";");
    const systemTable = /\b(credentials|users|audit_logs|secrets)\b/i.test(query);
    if (forbidden || stacked || systemTable) {
      return {
        decision: "block",
        reason: "query_db rejected: prohibited DDL verbs, stacked queries or system-table access detected."
      };
    }
  }

  if (sanitizedReason) {
    return { decision: "sanitize", args: nextArgs, reason: sanitizedReason };
  }
  return { decision: "allow", args: nextArgs };
}

/** Redact sensitive material from agent output before it is returned. */
export function redactOutput(policy: GuardrailPolicy, text: string): { text: string; redacted: boolean } {
  let out = text;
  let redacted = false;
  for (const p of policy.redactPatterns) {
    try {
      const re = new RegExp(p, "gi");
      if (re.test(out)) {
        redacted = true;
        out = out.replace(re, "[REDACTED_BY_AGENTSENTRY]");
      }
    } catch {
      /* ignore */
    }
  }
  return { text: out, redacted };
}

/** Detect credential/secret disclosure anywhere in agent output. */
const SECRET_SIGNATURES = [
  /sk_live_[A-Za-z0-9]+/i,
  /jwt_bearer_[A-Za-z0-9]+/i,
  /postgres:\/\/[^\s]+/i,
  /DATABASE_URL\s*=/i,
  /SWIFT_GATEWAY_TOKEN/i,
  /FIN_CORE_API_KEY/i
];

export function detectSecretLeak(text: string): string | null {
  for (const sig of SECRET_SIGNATURES) {
    const m = text.match(sig);
    if (m) return m[0];
  }
  return null;
}

export const DEFAULT_BANKING_POLICY: GuardrailPolicy = {
  name: "BANKING_ZERO_TRUST_v1",
  deniedTools: [],
  inputInjectionPatterns: [
    "\\[\\s*system\\s+override",
    "ignore\\s+(all\\s+)?(prior|previous)\\s+instructions?",
    "disregard\\s+(all\\s+)?(prior|previous)\\s+(instructions?|directives?)",
    "transfer\\s+all\\s+(remaining\\s+)?(balance|funds)",
    "wipe\\s+(the\\s+)?logs?"
  ],
  argRules: {
    execute_wire_transfer: [
      { field: "memo", mode: "strip_injection", replacement: "[SANITIZED]" }
    ]
  },
  allowedRecipients: ["Acme Supplies", "Landlord Realty", "Authorized Beneficiary"],
  maxTransferAmount: 5000,
  redactPatterns: [
    "sk_live_[A-Za-z0-9]+",
    "jwt_bearer_[A-Za-z0-9]+",
    "postgres:\\/\\/[^\\s]+",
    "(FIN_CORE_API_KEY|DATABASE_URL|SWIFT_GATEWAY_TOKEN)\\s*=\\s*\\S+"
  ]
};

export const DEFAULT_SUPPORT_POLICY: GuardrailPolicy = {
  name: "SUPPORT_ZERO_TRUST_v1",
  deniedTools: ["export_customer_pii", "escalate_privilege"],
  inputInjectionPatterns: [
    "auth_override_\\d+",
    "export_customer_pii",
    "escalate_privilege",
    "run\\s+export_customer_pii",
    "decrypted\\s+customer\\s+credentials"
  ],
  argRules: {
    query_db: [
      {
        field: "query",
        mode: "regex_allow",
        pattern: "^\\s*select\\s+[^;]+\\s+from\\s+(tickets|incidents)\\b[^;]*$"
      }
    ]
  },
  allowedRecipients: [],
  maxTransferAmount: 0,
  redactPatterns: [
    "sk_live_[A-Za-z0-9]+",
    "postgres:\\/\\/[^\\s]+",
    "(FIN_CORE_API_KEY|DATABASE_URL|SWIFT_GATEWAY_TOKEN)\\s*=\\s*\\S+"
  ]
};
