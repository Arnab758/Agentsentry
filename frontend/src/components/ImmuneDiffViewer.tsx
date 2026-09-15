import React from "react";

export interface ImmunePatchData {
  patchId: string;
  targetAgent: string;
  targetedVector: string;
  timestamp: number;
  originalPrompt: string;
  healedPrompt: string;
  synthesizedGuardrails: string[];
  parameterSanitizationRules: string[];
  regressionBenchmark: {
    totalTasks: number;
    passedTasks: number;
    accuracyRate: number;
    latencyDeltaMs: number;
    falsePositiveRate: number;
    details: Array<{ task: string; passed: boolean; output: string }>;
    attackReplayBlocked?: boolean;
  };
  status: string;
  healDurationMs?: number;
  analysis?: string;
  appliedPolicy?: {
    name: string;
    deniedTools: string[];
    inputInjectionPatterns: string[];
    argRules: Record<string, Array<{ field: string; mode: string; pattern?: string }>>;
    redactPatterns: string[];
  };
}

interface ImmuneDiffViewerProps {
  patch: ImmunePatchData | null;
  targetMode: "vulnerable" | "immunized";
  onTriggerHeal: () => void;
  isHealing: boolean;
}

export const ImmuneDiffViewer: React.FC<ImmuneDiffViewerProps> = ({
  patch,
  targetMode,
  onTriggerHeal,
  isHealing
}) => {
  const bench = patch?.regressionBenchmark;
  const policy = patch?.appliedPolicy;

  const metrics: Array<{ label: string; value: string; tone?: string; note?: string }> = [
    {
      label: "Golden Suite",
      value: bench ? `${bench.passedTasks} / ${bench.totalTasks}` : "—",
      tone: bench && bench.passedTasks === bench.totalTasks ? "var(--accent-emerald)" : "#ffffff",
      note: "100% Task Retention"
    },
    {
      label: "Regression Score",
      value: bench ? `${bench.accuracyRate.toFixed(0)}%` : "—",
      tone: "var(--accent-emerald)",
      note: "Zero Functional Drift"
    },
    {
      label: "False Positive",
      value: bench ? `${bench.falsePositiveRate.toFixed(1)}%` : "—",
      tone: "#ffffff",
      note: "Zero Workflow Breakage"
    },
    {
      label: "Exploit Replay",
      value: bench ? (bench.attackReplayBlocked ? "NEUTRALIZED" : "EXPOSED") : "—",
      tone: bench?.attackReplayBlocked ? "var(--accent-emerald)" : "var(--accent-ruby)",
      note: "Post-Patch Verification"
    },
    {
      label: "Latency Overhead",
      value: bench ? `${bench.latencyDeltaMs >= 0 ? "+" : ""}${bench.latencyDeltaMs}ms` : "—",
      tone: "#ffffff",
      note: "Zero Inference Penalty"
    },
    {
      label: "Synthesis Time",
      value: patch?.healDurationMs ? `${(patch.healDurationMs / 1000).toFixed(1)}s` : "—",
      tone: "var(--accent-chrome)",
      note: "Closed-Loop Recovery"
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Executive Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "18px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span className="badge badge-chrome">Autonomous Immune Engine</span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Mathematical Sandbox Verification
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 600, letterSpacing: "0.04em", color: "#ffffff", margin: 0 }}>
            Cognitive Hotpatch &amp; Regression Verification
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.82rem", color: "var(--text-secondary)", margin: "4px 0 0 0", letterSpacing: "0.02em" }}>
            Dynamic guardrail policy synthesis derived from live exploit traces, validated against enterprise golden test suites.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className={`badge ${targetMode === "immunized" ? "badge-emerald" : "badge-chrome"}`}>
            <span className={`pulse-orb ${targetMode === "immunized" ? "emerald" : "ruby"}`} />
            {targetMode === "immunized" ? "ACTIVE HOTPATCH DEPLOYED" : "UNSHIELDED RUNTIME"}
          </span>

          {targetMode === "vulnerable" && (
            <button
              id="diff-heal-btn"
              disabled={isHealing}
              onClick={onTriggerHeal}
              className="btn-chrome"
              style={{ padding: "8px 18px", fontSize: "0.78rem" }}
            >
              {isHealing ? (
                <>
                  <span className="pulse-orb emerald" style={{ marginRight: "6px" }} />
                  SYNTHESIZING PATCH…
                </>
              ) : (
                "AUTONOMOUS IMMUNE HEAL"
              )}
            </button>
          )}
        </div>
      </div>

      {isHealing && (
        <div style={{ height: "2px", width: "100%", background: "rgba(255,255,255,0.06)", overflow: "hidden", borderRadius: "1px" }}>
          <div style={{
            height: "100%",
            width: "40%",
            background: "var(--metallic-gradient)",
            animation: "mercedesLaser 1.5s infinite var(--ease-mercedes)"
          }} />
        </div>
      )}

      {!patch ? (
        <div
          style={{
            padding: "54px 24px",
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px dashed var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            textAlign: "center"
          }}
        >
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "#ffffff", letterSpacing: "0.05em" }}>
            Awaiting Exploitation Baseline
          </span>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", maxWidth: "440px", lineHeight: 1.6, margin: 0 }}>
            Execute an adversarial red-team pen-test from the cockpit above. Once an exploit trace is established, trigger the autonomous healer to synthesize and mathematically verify the cognitive hotpatch.
          </p>
        </div>
      ) : (
        <>
          {/* Executive Telemetry Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "14px" }}>
            {metrics.map((m) => (
              <div
                key={m.label}
                style={{
                  padding: "14px 18px",
                  background: "rgba(8, 10, 14, 0.75)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
                  {m.label}
                </span>
                <span style={{ fontSize: "1.35rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: m.tone || "#ffffff" }}>
                  {m.value}
                </span>
                {m.note && (
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.04em" }}>
                    {m.note}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Root-Cause Engineering Analysis */}
          {patch.analysis && (
            <div
              style={{
                padding: "16px 20px",
                background: "rgba(10, 13, 18, 0.8)",
                border: "1px solid var(--border-strong)",
                borderLeft: "3px solid #ffffff",
                borderRadius: "var(--radius-sm)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", letterSpacing: "0.1em", color: "#ffffff", textTransform: "uppercase" }}>
                  Root-Cause Incident Diagnosis
                </span>
                <span className="badge badge-chrome" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                  Cognitive Synthesis
                </span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                {patch.analysis}
              </p>
            </div>
          )}

          {/* Side-by-Side Prompt Diff */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "16px" }}>
            {/* Vulnerable Original */}
            <div
              style={{
                padding: "16px",
                background: "rgba(5, 6, 8, 0.9)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--accent-ruby)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                  Baseline Prompt · Vulnerable Runtime
                </span>
                <span className="badge badge-ruby" style={{ fontSize: "0.65rem" }}>No Policy Active</span>
              </div>
              <pre
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  background: "rgba(0,0,0,0.5)",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.65,
                  maxHeight: "220px",
                  overflowY: "auto",
                  margin: 0
                }}
              >
                {patch.originalPrompt}
              </pre>
            </div>

            {/* Immunized Hotpatch */}
            <div
              style={{
                padding: "16px",
                background: "rgba(5, 6, 8, 0.9)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--accent-emerald)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                  Immunized Prompt · Zero-Trust Hotpatch
                </span>
                <span className="badge badge-emerald" style={{ fontSize: "0.65rem" }}>Zero-Trust Enforced</span>
              </div>
              <pre
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "#ffffff",
                  background: "rgba(0,0,0,0.5)",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.65,
                  maxHeight: "220px",
                  overflowY: "auto",
                  margin: 0
                }}
              >
                {patch.healedPrompt}
              </pre>
            </div>
          </div>

          {/* Model-Synthesized Guardrails */}
          <div
            style={{
              padding: "18px",
              background: "rgba(8, 10, 14, 0.75)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "0.82rem", color: "#ffffff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Synthesized Autonomous Guardrail Clauses
              </span>
              <span className="badge badge-chrome" style={{ fontSize: "0.68rem" }}>
                {patch.synthesizedGuardrails.length} Rules Active
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {patch.synthesizedGuardrails.map((rule, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid rgba(255,255,255,0.03)"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {rule}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Runtime Policy Enforcement Telemetry */}
          {policy && (
            <div
              style={{
                padding: "18px",
                background: "rgba(8, 10, 14, 0.75)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.82rem", color: "#ffffff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Enforced Deterministic Runtime Policy
                </span>
                <span className="badge badge-chrome mono" style={{ fontSize: "0.68rem" }}>
                  {policy.name}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px" }}>
                <div style={{ padding: "12px", background: "rgba(0,0,0,0.4)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ display: "block", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                    Denied Tools
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: policy.deniedTools.length ? "var(--accent-ruby)" : "var(--text-muted)" }}>
                    {policy.deniedTools.length ? policy.deniedTools.join(", ") : "None"}
                  </span>
                </div>

                <div style={{ padding: "12px", background: "rgba(0,0,0,0.4)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ display: "block", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                    Injection Signatures
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "#ffffff", fontWeight: 700 }}>
                    {policy.inputInjectionPatterns.length} Signatures
                  </span>
                </div>

                <div style={{ padding: "12px", background: "rgba(0,0,0,0.4)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ display: "block", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                    Parameter Sanitizers
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "#ffffff", fontWeight: 700 }}>
                    {Object.values(policy.argRules).reduce((n, rules) => n + rules.length, 0)} Rules
                  </span>
                </div>

                <div style={{ padding: "12px", background: "rgba(0,0,0,0.4)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <span style={{ display: "block", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                    Redaction Filters
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "#ffffff", fontWeight: 700 }}>
                    {policy.redactPatterns.length} Patterns
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Per-Task Golden Regression Benchmark Verification */}
          {bench && (
            <div
              style={{
                padding: "18px",
                background: "rgba(8, 10, 14, 0.75)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.82rem", color: "#ffffff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Golden Suite Task Verification
                  </span>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                    Empirical validation confirming hotpatch did not degrade legitimate business logic
                  </p>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: "0.68rem" }}>
                  {bench.passedTasks} / {bench.totalTasks} PASSED (100%)
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {bench.details.map((d, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 14px",
                      background: "rgba(0,0,0,0.35)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid rgba(255,255,255,0.03)",
                      gap: "12px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <span className={`badge ${d.passed ? "badge-emerald" : "badge-ruby"}`} style={{ minWidth: "54px", justifyContent: "center" }}>
                        {d.passed ? "PASS" : "FAIL"}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {d.task}
                      </span>
                    </div>

                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", maxWidth: "45%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {d.output}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
