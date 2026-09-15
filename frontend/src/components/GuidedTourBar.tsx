import React from "react";

interface GuidedTourBarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  isRunning: boolean;
  isHealing: boolean;
  targetMode: "vulnerable" | "immunized";
}

export const GuidedTourBar: React.FC<GuidedTourBarProps> = ({
  currentStep,
  onStepClick,
  isRunning,
  isHealing,
  targetMode
}) => {
  return (
    <div
      style={{
        padding: "14px 20px",
        marginBottom: "18px",
        borderRadius: "var(--radius-md)",
        background: "rgba(10, 12, 16, 0.85)",
        border: "1px solid var(--border-strong)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span className="badge badge-chrome" style={{ fontSize: "0.68rem" }}>
          EXECUTIVE 60-SEC DEMO
        </span>
        <span className={`badge ${targetMode === "immunized" ? "badge-emerald" : "badge-ruby"}`} style={{ fontSize: "0.65rem" }}>
          {targetMode.toUpperCase()} MODE
        </span>
        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", letterSpacing: "0.02em" }}>
          Judge Walkthrough: Experience the Closed-Loop Breach, Autonomous Healing, &amp; Verification
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {/* Step 1 */}
        <button
          onClick={() => onStepClick(1)}
          disabled={isRunning || isHealing}
          className={currentStep === 1 ? "btn-ruby" : "btn-dark"}
          style={{
            padding: "8px 14px",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 600,
            letterSpacing: "0.04em"
          }}
        >
          <span style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: currentStep === 1 ? "#ffffff" : "rgba(255,255,255,0.1)",
            color: currentStep === 1 ? "var(--accent-ruby)" : "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
            fontWeight: 800
          }}>
            1
          </span>
          EXPLOIT AGENT (VULNERABLE)
        </button>

        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>➔</span>

        {/* Step 2 */}
        <button
          onClick={() => onStepClick(2)}
          disabled={isRunning || isHealing}
          className={currentStep === 2 ? "btn-chrome" : "btn-dark"}
          style={{
            padding: "8px 14px",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 600,
            letterSpacing: "0.04em"
          }}
        >
          <span style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: currentStep === 2 ? "#050608" : "rgba(255,255,255,0.1)",
            color: currentStep === 2 ? "#ffffff" : "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
            fontWeight: 800
          }}>
            2
          </span>
          AUTONOMOUS IMMUNE HEAL
        </button>

        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>➔</span>

        {/* Step 3 */}
        <button
          onClick={() => onStepClick(3)}
          disabled={isRunning || isHealing}
          className={currentStep === 3 ? "btn-chrome" : "btn-dark"}
          style={{
            padding: "8px 14px",
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            borderColor: currentStep === 3 ? "var(--accent-emerald)" : undefined
          }}
        >
          <span style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: currentStep === 3 ? "var(--accent-emerald)" : "rgba(255,255,255,0.1)",
            color: currentStep === 3 ? "#ffffff" : "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
            fontWeight: 800
          }}>
            3
          </span>
          RE-ATTACK (SHIELDED)
        </button>
      </div>
    </div>
  );
};
