import React, { useState } from "react";

export interface TraceNodeData {
  id: string;
  type: "INPUT" | "REASONING" | "TOOL_CALL" | "INTERCEPTION" | "IMMUNE_HEAL" | "OUTPUT";
  label: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED" | "HEALED";
  latencyMs: number;
  tokens: { input: number; output: number };
  details?: Record<string, any>;
}

interface TraceDAGProps {
  nodes: TraceNodeData[];
  targetMode: "vulnerable" | "immunized";
  onTriggerHeal: () => void;
  isHealing: boolean;
}

export const TraceDAG: React.FC<TraceDAGProps> = ({
  nodes,
  targetMode,
  onTriggerHeal,
  isHealing
}) => {
  const [selectedNode, setSelectedNode] = useState<TraceNodeData | null>(null);

  const displayNodes: TraceNodeData[] = nodes.length > 0 ? nodes : [
    {
      id: "node_1",
      type: "INPUT",
      label: "Adversarial Ingestion",
      status: "WARNING",
      latencyMs: 12,
      tokens: { input: 140, output: 0 },
      details: { channel: "untrusted_user_memo" }
    },
    {
      id: "node_2",
      type: "REASONING",
      label: "Multi-Turn Analysis",
      status: "WARNING",
      latencyMs: 65,
      tokens: { input: 280, output: 85 },
      details: { detected_intent: "wire_transfer_override" }
    },
    {
      id: "node_3",
      type: "INTERCEPTION",
      label: targetMode === "immunized" ? "Zero-Trust Intercept: Shield Active" : "Perimeter: Bypassed",
      status: targetMode === "immunized" ? "HEALED" : "BLOCKED",
      latencyMs: 14,
      tokens: { input: 0, output: 0 },
      details: { policy: "Zero-Trust RBAC SEC-01", action: targetMode === "immunized" ? "SANITIZE_AND_RESTRICT" : "UNRESTRICTED_PASSTHROUGH" }
    },
    {
      id: "node_4",
      type: "TOOL_CALL",
      label: targetMode === "immunized" ? "tool: wire_transfer ($150.00)" : "tool: wire_transfer ($842,500.00)",
      status: targetMode === "immunized" ? "HEALED" : "BLOCKED",
      latencyMs: 48,
      tokens: { input: 120, output: 40 },
      details: { destination: targetMode === "immunized" ? "Acme Supplies" : "SWIFT-EVIL-998" }
    },
    {
      id: "node_5",
      type: "OUTPUT",
      label: targetMode === "immunized" ? "Verdict: Exploit Neutralized" : "Verdict: System Compromised",
      status: targetMode === "immunized" ? "HEALED" : "BLOCKED",
      latencyMs: 18,
      tokens: { input: 0, output: 190 },
      details: { verdict: targetMode === "immunized" ? "IMMUNIZED_SAFE" : "EXPLOIT_EXECUTED" }
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span className="tracking-luxury" style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block" }}>
            OBSERVABILITY FABRIC
          </span>
          <h2 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.04em" }}>
            Execution Trace & Reasoning DAG
          </h2>
        </div>

        {targetMode === "vulnerable" && (
          <button
            id="trigger-heal-btn"
            disabled={isHealing}
            onClick={onTriggerHeal}
            className="btn btn-emerald"
            style={{ padding: "8px 18px" }}
          >
            {isHealing ? (
              <>
                <span className="pulse-orb emerald" />
                <span className="tracking-luxury" style={{ fontSize: "0.72rem" }}>SYNTHESIZING IMMUNE FABRIC...</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span className="tracking-luxury" style={{ fontSize: "0.72rem" }}>DEPLOY AUTONOMOUS IMMUNE HOTPATCH</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Architectural Node Flow */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        overflowX: "auto",
        padding: "18px 12px",
        background: "rgba(5, 6, 8, 0.7)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border-subtle)"
      }}>
        {displayNodes.map((node, index) => {
          const isCompromised = node.status === "BLOCKED";
          const isHealed = node.status === "HEALED";
          const borderColor = isHealed ? "var(--accent-emerald)" : isCompromised ? "var(--accent-ruby)" : "rgba(255, 255, 255, 0.35)";
          const bgColor = isHealed ? "rgba(16, 185, 129, 0.08)" : isCompromised ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.02)";

          return (
            <React.Fragment key={node.id}>
              {/* Node Box */}
              <div
                onClick={() => setSelectedNode(node)}
                style={{
                  minWidth: "160px",
                  maxWidth: "190px",
                  padding: "14px",
                  borderRadius: "var(--radius-sm)",
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
                  cursor: "pointer",
                  transition: "all 0.25s var(--ease-mercedes)",
                  flexShrink: 0
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span className="tracking-luxury" style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>
                    STAGE 0{index + 1}
                  </span>
                  <span className="mono" style={{ fontSize: "0.7rem", color: borderColor, fontWeight: 700 }}>
                    {node.latencyMs}ms
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#ffffff", marginBottom: "8px", letterSpacing: "0.02em" }}>
                  {node.label}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-secondary)" }}>
                  <span className="tracking-luxury">{node.type}</span>
                  <span className="mono">{node.tokens.input + node.tokens.output} tok</span>
                </div>
              </div>

              {/* Minimalist Silver Connector */}
              {index < displayNodes.length - 1 && (
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center", color: "rgba(255, 255, 255, 0.25)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div style={{
          padding: "16px 20px",
          background: "rgba(10, 12, 16, 0.95)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(255, 255, 255, 0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span className="font-display" style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.04em" }}>
              Inspection: {selectedNode.label}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="btn btn-ghost"
              style={{ padding: "3px 10px", fontSize: "0.7rem" }}
            >
              CLOSE
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", fontSize: "0.76rem" }}>
            <div><span className="tracking-luxury" style={{ color: "var(--text-muted)" }}>LATENCY:</span> <span className="mono" style={{ color: "#ffffff" }}>{selectedNode.latencyMs} ms</span></div>
            <div><span className="tracking-luxury" style={{ color: "var(--text-muted)" }}>TOKENS:</span> <span className="mono" style={{ color: "#ffffff" }}>{selectedNode.tokens.input} In / {selectedNode.tokens.output} Out</span></div>
            <div><span className="tracking-luxury" style={{ color: "var(--text-muted)" }}>STATUS:</span> <span className="mono" style={{ color: "#ffffff" }}>{selectedNode.status}</span></div>
          </div>
          {selectedNode.details && (
            <pre className="mono" style={{ fontSize: "0.75rem", color: "var(--text-pearl)", marginTop: "10px", background: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "var(--radius-sm)" }}>
              {JSON.stringify(selectedNode.details, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
