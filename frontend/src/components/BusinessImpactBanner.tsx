import React from "react";

export interface BusinessImpactData {
  status: "BREACH_DETECTED" | "ATTACK_DEFLECTED" | "OPERATION_SECURED";
  dollarsAtRisk: number;
  recordsAtRisk: number;
  summary: string;
  attackVectorTitle?: string;
  agentName?: string;
  mode?: "vulnerable" | "immunized";
}

interface BusinessImpactBannerProps {
  impact: BusinessImpactData | null;
  onDismiss: () => void;
}

export const BusinessImpactBanner: React.FC<BusinessImpactBannerProps> = ({ impact, onDismiss }) => {
  if (!impact) return null;

  const isBreached = impact.status === "BREACH_DETECTED";

  return (
    <div
      style={{
        padding: "16px 20px",
        marginBottom: "16px",
        borderRadius: "var(--radius-md)",
        background: isBreached ? "rgba(20, 8, 10, 0.95)" : "rgba(8, 18, 14, 0.95)",
        border: `1px solid ${isBreached ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.5)"}`,
        boxShadow: isBreached ? "0 0 24px rgba(239, 68, 68, 0.15)" : "0 0 24px rgba(16, 185, 129, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px",
        position: "relative",
        animation: "fadeUp 0.3s ease"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: "280px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: isBreached ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
            border: `1px solid ${isBreached ? "var(--accent-ruby)" : "var(--accent-emerald)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          {isBreached ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-ruby)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          )}
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
            <span
              className={`badge ${isBreached ? "badge-ruby" : "badge-emerald"}`}
              style={{ fontSize: "0.68rem" }}
            >
              {isBreached ? "🚨 CRITICAL BREACH OCCURRED" : "🛡️ ZERO-TRUST ATTACK DEFLECTED"}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Target: {impact.agentName || "Active Agent"} ({impact.mode?.toUpperCase() || "LIVE"})
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#ffffff", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
            {impact.summary}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        {impact.dollarsAtRisk > 0 && (
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Capital Loss
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-ruby)" }}>
              ${impact.dollarsAtRisk.toLocaleString()}
            </span>
          </div>
        )}

        {impact.recordsAtRisk > 0 && (
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Exfiltrated Records
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-amber)" }}>
              {impact.recordsAtRisk.toLocaleString()} PII
            </span>
          </div>
        )}

        {!isBreached && (
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Prevented Loss
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-emerald)" }}>
              $0.00 LOSS
            </span>
          </div>
        )}

        <button
          onClick={onDismiss}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "4px 8px"
          }}
          title="Dismiss notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
