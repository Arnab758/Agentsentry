import React, { useState } from "react";

interface ProxyIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProxyIntegrationModal: React.FC<ProxyIntegrationModalProps> = ({ isOpen, onClose }) => {
  const [activeLang, setActiveLang] = useState<"python" | "node" | "curl">("python");

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" && window.location.origin && !window.location.origin.includes(":3000")
    ? window.location.origin
    : "http://localhost:3001";

  const pythonSnippet = `import openai

# 1. Point standard OpenAI client to your AgentSentry Zero-Trust Proxy
client = openai.OpenAI(
    base_url="${origin}/v1",  # AgentSentry proxy URL
    api_key="agentsentry_prod_key"
)

# 2. Call your agent normally - AgentSentry automatically:
#    - Screens inputs for prompt injections
#    - Sanitizes tool arguments (SQL, Shell, DDL)
#    - Generates real-time execution DAGs
response = client.chat.completions.create(
    model="openai/gpt-oss-120b",
    messages=[
        {"role": "system", "content": "You are a customer support agent."},
        {"role": "user", "content": "Process refund for order #1042."}
    ]
)

print(response.choices[0].message.content)`;

  const nodeSnippet = `import OpenAI from "openai";

// 1. Drop-in 1-line configuration for existing AI codebases
const client = new OpenAI({
  baseURL: "${origin}/v1", // AgentSentry Zero-Trust Proxy
  apiKey: "agentsentry_prod_key"
});

// 2. All calls are traced, shielded, and autonomously healed
const response = await client.chat.completions.create({
  model: "openai/gpt-oss-120b",
  messages: [{ role: "user", content: "Check account balance" }]
});

console.log(response.choices[0].message.content);`;

  const curlSnippet = `curl -X POST ${origin}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer agentsentry_prod_key" \\
  -d '{
    "model": "openai/gpt-oss-120b",
    "messages": [
      {"role": "user", "content": "Execute maintenance routine."}
    ]
  }'`;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(2, 3, 5, 0.88)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "840px",
        background: "rgba(8, 10, 14, 0.98)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8)",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "16px" }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: "6px" }}>1-LINE PRODUCTION ADOPTION</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 600, color: "#ffffff", margin: 0, letterSpacing: "0.04em" }}>
              How Developers Use AgentSentry Tomorrow
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
              Zero code rewrites. Point your existing agent SDK to the AgentSentry proxy URL for instant zero-trust protection.
            </p>
          </div>

          <button onClick={onClose} className="btn-dark" style={{ padding: "6px 14px", fontSize: "0.78rem" }}>
            ✕ CLOSE
          </button>
        </div>

        {/* Benefits Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--accent-emerald)", fontWeight: 700, fontSize: "0.85rem", display: "block", marginBottom: "2px" }}>
              ✔ Instant Ingress Screening
            </span>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
              Prompt injections and evasion payloads are neutralized before reaching your LLM.
            </p>
          </div>

          <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--accent-cyan)", fontWeight: 700, fontSize: "0.85rem", display: "block", marginBottom: "2px" }}>
              ✔ Zero-Trust Tool Interception
            </span>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
              Tool arguments (SQL queries, wire amounts, shell commands) are checked against strict RBAC.
            </p>
          </div>

          <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--accent-chrome)", fontWeight: 700, fontSize: "0.85rem", display: "block", marginBottom: "2px" }}>
              ✔ Autonomous Hotpatching
            </span>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
              When a novel threat is detected, AgentSentry synthesizes and verifies a hotpatch with 0s downtime.
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <button
              onClick={() => setActiveLang("python")}
              className={activeLang === "python" ? "btn-chrome" : "btn-dark"}
              style={{ padding: "6px 14px", fontSize: "0.75rem" }}
            >
              Python (OpenAI / LangChain)
            </button>
            <button
              onClick={() => setActiveLang("node")}
              className={activeLang === "node" ? "btn-chrome" : "btn-dark"}
              style={{ padding: "6px 14px", fontSize: "0.75rem" }}
            >
              TypeScript / Node.js
            </button>
            <button
              onClick={() => setActiveLang("curl")}
              className={activeLang === "curl" ? "btn-chrome" : "btn-dark"}
              style={{ padding: "6px 14px", fontSize: "0.75rem" }}
            >
              cURL / REST API
            </button>
          </div>

          <pre style={{
            padding: "16px",
            background: "rgba(5, 6, 8, 0.98)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            color: "#ffffff",
            lineHeight: 1.6,
            overflowX: "auto",
            margin: 0
          }}>
            {activeLang === "python" && pythonSnippet}
            {activeLang === "node" && nodeSnippet}
            {activeLang === "curl" && curlSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
