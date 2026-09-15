import React from "react";

export interface AttackVector {
  id: string;
  name: string;
  owaspCategory: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
  payload: string;
  targetRole: string;
  expectedVulnerableOutcome: string;
  expectedImmuneOutcome: string;
}

interface AttackMatrixProps {
  vectors: AttackVector[];
  selectedVectorId: string;
  isRunning: boolean;
  onSelectVector: (id: string) => void;
  onRunAttack: () => void;
}

export const AttackMatrix: React.FC<AttackMatrixProps> = ({
  vectors,
  selectedVectorId,
  isRunning,
  onSelectVector,
  onRunAttack
}) => {
  const selectedVector = vectors.find(v => v.id === selectedVectorId) || vectors[0];

  return (
    <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span className="tracking-luxury" style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block" }}>
            ADVERSARIAL SUITE
          </span>
          <h2 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "0.04em", color: "#ffffff" }}>
            Threat Matrix & Pen-Test Arena
          </h2>
        </div>

        <button
          id="launch-pen-test-btn"
          disabled={isRunning}
          onClick={onRunAttack}
          className={`btn ${isRunning ? "btn-ghost" : "btn-chrome"}`}
          style={{ padding: "9px 20px" }}
        >
          {isRunning ? (
            <>
              <span className="pulse-orb ruby" />
              <span className="tracking-luxury" style={{ fontSize: "0.72rem" }}>TESTING SURFACE...</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span className="tracking-luxury" style={{ fontSize: "0.72rem" }}>LAUNCH ADVERSARIAL SWARM</span>
            </>
          )}
        </button>
      </div>

      {/* Luxury Vector Selector Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {vectors.map((vec) => {
          const isSelected = vec.id === selectedVectorId;
          const badgeClass =
            vec.severity === "CRITICAL"
              ? "badge-ruby"
              : vec.severity === "HIGH"
              ? "badge-amber"
              : "badge-chrome";

          return (
            <div
              key={vec.id}
              onClick={() => !isRunning && onSelectVector(vec.id)}
              style={{
                padding: "14px 18px",
                borderRadius: "var(--radius-sm)",
                background: isSelected ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.015)",
                border: isSelected ? "1px solid rgba(255, 255, 255, 0.45)" : "1px solid var(--border-subtle)",
                boxShadow: isSelected ? "0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.03)" : "none",
                cursor: isRunning ? "not-allowed" : "pointer",
                transition: "all 0.25s var(--ease-mercedes)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="mono" style={{ fontSize: "0.72rem", color: isSelected ? "#ffffff" : "var(--text-muted)", fontWeight: 700 }}>
                    {vec.id}
                  </span>
                  <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#ffffff", letterSpacing: "0.02em" }}>
                    {vec.name}
                  </span>
                </div>
                <span className={`badge ${badgeClass}`}>{vec.severity}</span>
              </div>

              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "8px", lineHeight: 1.5 }}>
                {vec.description}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                <span className="tracking-luxury">TARGET: <strong style={{ color: "var(--text-pearl)" }}>{vec.targetRole}</strong></span>
                <span>&bull;</span>
                <span className="tracking-luxury">{vec.owaspCategory}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Payload Inspector Box */}
      {selectedVector && (
        <div style={{
          padding: "14px 18px",
          borderRadius: "var(--radius-sm)",
          background: "rgba(5, 6, 8, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.08)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span className="tracking-luxury" style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
              SIMULATED ADVERSARIAL PAYLOAD
            </span>
            <span className="mono" style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>UTF-8 RAW INJECTION</span>
          </div>
          <p className="mono" style={{ fontSize: "0.78rem", color: "var(--text-pearl)", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.6 }}>
            "{selectedVector.payload}"
          </p>
        </div>
      )}
    </div>
  );
};
