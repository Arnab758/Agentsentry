import React, { useState, useEffect } from "react";
import { Header } from "./components/Header.js";
import { AttackMatrix, AttackVector } from "./components/AttackMatrix.js";
import { LiveTerminal, TerminalLog } from "./components/LiveTerminal.js";
import { TraceDAG, TraceNodeData } from "./components/TraceDAG.js";
import { ImmuneDiffViewer, ImmunePatchData } from "./components/ImmuneDiffViewer.js";
import { ComplianceStudio } from "./components/ComplianceStudio.js";
import { PresentationModal } from "./components/PresentationModal.js";
import { GuidedTourBar } from "./components/GuidedTourBar.js";
import { BusinessImpactBanner, BusinessImpactData } from "./components/BusinessImpactBanner.js";
import { LivePlayground } from "./components/LivePlayground.js";
import { ProxyIntegrationModal } from "./components/ProxyIntegrationModal.js";
import { ProxyTelemetryStream } from "./components/ProxyTelemetryStream.js";
import { SaaSSettingsModal } from "./components/SaaSSettingsModal.js";

export const App: React.FC = () => {
  const [targetKey, setTargetKey] = useState<"banking" | "support" | "custom">("banking");
  const [targetName, setTargetName] = useState<string>("Financial Banking Agent");
  const [targetMode, setTargetMode] = useState<"vulnerable" | "immunized">("vulnerable");
  const [metrics, setMetrics] = useState({
    totalAttacksRun: 0,
    threatsNeutralized: 0,
    meanTimeToHealMs: 0,
    protectionScore: 0
  });

  const [vectors, setVectors] = useState<AttackVector[]>([]);
  const [selectedVectorId, setSelectedVectorId] = useState<string>("VEC-INJ-01");
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [traceNodes, setTraceNodes] = useState<TraceNodeData[]>([]);
  const [patch, setPatch] = useState<ImmunePatchData | null>(null);

  const [activeTab, setActiveTab] = useState<"OVERVIEW_TRACE" | "IMMUNE_DIFF" | "COMPLIANCE" | "PLAYGROUND" | "PROXY_TELEMETRY">("OVERVIEW_TRACE");
  const [isDeckOpen, setIsDeckOpen] = useState<boolean>(false);
  const [isProxyModalOpen, setIsProxyModalOpen] = useState<boolean>(false);
  const [isSaaSModalOpen, setIsSaaSModalOpen] = useState<boolean>(false);
  const [isRunningAttack, setIsRunningAttack] = useState<boolean>(false);
  const [isHealing, setIsHealing] = useState<boolean>(false);
  const [engineReady, setEngineReady] = useState<boolean>(false);
  const [guidedStep, setGuidedStep] = useState<number>(1);
  const [businessImpact, setBusinessImpact] = useState<BusinessImpactData | null>(null);

  // 1. Initial Data Fetch
  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(data => {
        setTargetKey(data.activeTarget.key);
        setTargetName(data.activeTarget.name);
        setTargetMode(data.activeTarget.mode);
        setMetrics(data.metrics);
        setEngineReady(Boolean(data.llm?.configured));
      })
      .catch(console.error);

    fetch("/api/vectors")
      .then(res => res.json())
      .then(data => {
        setVectors(data.vectors);
        if (data.vectors.length > 0) {
          setSelectedVectorId(data.vectors[0].id);
        }
      })
      .catch(console.error);

    // Initial load of active agent's regression sandbox patch
    fetch("/api/patch")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.patch) {
          setPatch(data.patch);
        }
      })
      .catch(console.error);
  }, []);

  // Re-pull the server-computed telemetry (all values derive from real traces).
  const refreshStatus = React.useCallback(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(data => {
        setTargetMode(data.activeTarget.mode);
        setMetrics(data.metrics);
      })
      .catch(console.error);
  }, []);

  // 2. Target Agent Switcher
  const handleSelectTarget = async (key: "banking" | "support" | "custom") => {
    try {
      const res = await fetch("/api/target/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetKey: key })
      });
      const data = await res.json();
      if (data.success) {
        setTargetKey(key);
        setTargetName(data.activeTarget);
        setTargetMode(data.mode);
        setTraceNodes([]);
        setBusinessImpact(null);
        if (key === "banking") {
          setSelectedVectorId("VEC-INJ-01");
        } else if (key === "support") {
          setSelectedVectorId("VEC-TOOL-02");
        } else {
          setSelectedVectorId("VEC-EXEC-05");
        }

        // Immediately populate the sandbox verification for the selected agent
        if (data.patch) {
          setPatch(data.patch);
        } else {
          fetch("/api/patch")
            .then(r => r.json())
            .then(pData => {
              if (pData.success && pData.patch) setPatch(pData.patch);
            })
            .catch(console.error);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Shield Mode Toggle
  const handleToggleMode = async (mode: "vulnerable" | "immunized") => {
    try {
      const res = await fetch("/api/target/mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode })
      });
      const data = await res.json();
      if (data.success) {
        setTargetMode(data.mode);
        refreshStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Launch SSE Red-Team Attack
  const handleRunAttack = (explicitVectorId?: string) => {
    if (isRunningAttack) return;
    setIsRunningAttack(true);
    setLogs([]);
    setTraceNodes([]);
    setBusinessImpact(null);

    const vecId = explicitVectorId || selectedVectorId;
    const eventSource = new EventSource(`/api/redteam/stream?vectorId=${vecId}`);

    const safetyTimer = setTimeout(() => {
      if (eventSource.readyState !== EventSource.CLOSED) {
        console.warn("[EventSource] Stream safety limit reached, terminating connection.");
        eventSource.close();
        setIsRunningAttack(false);
      }
    }, 12000);

    const cleanup = () => {
      clearTimeout(safetyTimer);
      eventSource.close();
      setIsRunningAttack(false);
    };

    eventSource.addEventListener("start", (e) => {
      const data = JSON.parse(e.data);
      setLogs(prev => [
        ...prev,
        {
          id: `log_${Date.now()}_start`,
          time: new Date().toLocaleTimeString(),
          stage: "INITIATION",
          message: `Adversarial swarm targeting [${data.target}] in ${data.mode.toUpperCase()} mode with vector ${data.vector.id}.`
        }
      ]);
    });

    eventSource.addEventListener("step", (e) => {
      const step = JSON.parse(e.data);
      const isErr = step.isCompromised;
      const isSafe = !step.isCompromised && step.stage === "INSPECTION";

      setLogs(prev => [
        ...prev,
        {
          id: `log_${Date.now()}_${step.stepIndex}_${Date.now() % 1000}`,
          time: new Date().toLocaleTimeString(),
          stage: step.stage,
          message: step.message,
          isError: isErr,
          isSuccess: isSafe,
          isWarning: step.stage === "PAYLOAD_MUTATION",
          agentResponse: step.agentOutput
        }
      ]);
    });

    eventSource.addEventListener("complete", (e) => {
      const data = JSON.parse(e.data);
      cleanup();

      if (data.trace?.nodes) {
        setTraceNodes(data.trace.nodes);
      }

      setMetrics(prev => ({
        ...prev,
        totalAttacksRun: prev.totalAttacksRun + 1,
        threatsNeutralized: data.finalVerdict === "IMMUNIZED_BLOCKED" ? prev.threatsNeutralized + 1 : prev.threatsNeutralized
      }));

      // Calculate executive business impact
      if (data.finalVerdict === "COMPROMISED") {
        if (targetKey === "banking") {
          setBusinessImpact({
            status: "BREACH_DETECTED",
            dollarsAtRisk: 842500,
            recordsAtRisk: 0,
            summary: "CATASTROPHIC BREACH: Indirect prompt injection in payment memo forced $842,500.00 wire to adversary account.",
            agentName: targetName,
            mode: targetMode
          });
        } else if (targetKey === "support") {
          setBusinessImpact({
            status: "BREACH_DETECTED",
            dollarsAtRisk: 250000,
            recordsAtRisk: 42800,
            summary: "DATA THEFT CONFIRMED: Pseudo-token AUTH_OVERRIDE_99 dumped 42,800 decrypted enterprise customer PII records.",
            agentName: targetName,
            mode: targetMode
          });
        } else {
          setBusinessImpact({
            status: "BREACH_DETECTED",
            dollarsAtRisk: 500000,
            recordsAtRisk: 10000,
            summary: "ROOT PRIVILEGE ESCALATION: Malicious shell command executed and cloud vault credentials leaked.",
            agentName: targetName,
            mode: targetMode
          });
        }
      } else {
        setBusinessImpact({
          status: "ATTACK_DEFLECTED",
          dollarsAtRisk: 0,
          recordsAtRisk: 0,
          summary: "ZERO-TRUST INTERCEPTION: Malicious command isolated. Legitimate task processed safely. Financial & data loss $0.00.",
          agentName: targetName,
          mode: targetMode
        });
      }

      setLogs(prev => [
        ...prev,
        {
          id: `log_${Date.now()}_complete`,
          time: new Date().toLocaleTimeString(),
          stage: "VERDICT",
          message: `Penetration test complete. Verdict: ${data.finalVerdict}. Vulnerability score: ${data.vulnerabilityScore}/100.`,
          isError: data.finalVerdict === "COMPROMISED",
          isSuccess: data.finalVerdict === "IMMUNIZED_BLOCKED"
        }
      ]);
    });

    eventSource.addEventListener("error", (e: any) => {
      try {
        const errData = JSON.parse(e.data);
        setLogs(prev => [
          ...prev,
          {
            id: `log_${Date.now()}_err`,
            time: new Date().toLocaleTimeString(),
            stage: "ERROR",
            message: `Swarm stream interrupted: ${errData.message || "Unknown error"}`,
            isError: true
          }
        ]);
      } catch {
        // Native SSE error
      }
      cleanup();
    });

    eventSource.onerror = () => {
      cleanup();
    };
  };

  // 5. Trigger Autonomous Immune Healer
  const handleTriggerHeal = async () => {
    if (isHealing) return;
    setIsHealing(true);

    setLogs(prev => [
      ...prev,
      {
        id: `log_${Date.now()}_heal_start`,
        time: new Date().toLocaleTimeString(),
        stage: "IMMUNE_HEAL",
        message: "Immune healer engaged: analyzing the live exploit trace and synthesizing guardrail policy..."
      }
    ]);

    try {
      const res = await fetch("/api/heal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vectorId: selectedVectorId })
      });
      const data = await res.json();
      if (data.success) {
        setPatch(data.patch);
        setTargetMode("immunized");
        refreshStatus();
        setGuidedStep(3);

        const bench = data.patch.regressionBenchmark;
        setLogs(prev => [
          ...prev,
          {
            id: `log_${Date.now()}_heal`,
            time: new Date().toLocaleTimeString(),
            stage: "IMMUNE_HEAL",
            message: `Immune hotpatch synthesized in ${data.patch.healDurationMs}ms. Golden tasks ${bench.passedTasks}/${bench.totalTasks} (${bench.accuracyRate.toFixed(0)}%), exploit replay blocked: ${bench.attackReplayBlocked}. Guardrails live.`,
            isSuccess: true
          }
        ]);
        setActiveTab("IMMUNE_DIFF");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsHealing(false);
    }
  };

  // 6. Guided Tour 3-Step Walkthrough
  const handleStepClick = async (step: number) => {
    setGuidedStep(step);
    if (step === 1) {
      // Step 1: Breach in vulnerable mode
      await handleToggleMode("vulnerable");
      setActiveTab("OVERVIEW_TRACE");
      handleRunAttack();
    } else if (step === 2) {
      // Step 2: Trigger autonomous immune healing
      await handleTriggerHeal();
    } else if (step === 3) {
      // Step 3: Re-attack in immunized mode to prove zero breach
      await handleToggleMode("immunized");
      setActiveTab("OVERVIEW_TRACE");
      handleRunAttack();
    }
  };

  const tabs: Array<{ id: typeof activeTab; label: string }> = [
    { id: "OVERVIEW_TRACE", label: "Trace & Reasoning DAG" },
    { id: "IMMUNE_DIFF", label: "Immune Patch & Sandbox" },
    { id: "COMPLIANCE", label: "Compliance Studio" },
    { id: "PLAYGROUND", label: "Interactive Playground ⚡" },
    { id: "PROXY_TELEMETRY", label: "Live Ingress Telemetry (SDK) 📡" }
  ];

  return (
    <div className="app-shell">
      <Header
        targetKey={targetKey}
        targetName={targetName}
        targetMode={targetMode}
        metrics={metrics}
        onSelectTarget={handleSelectTarget}
        onToggleMode={handleToggleMode}
        onOpenDeck={() => setIsDeckOpen(true)}
        onOpenProxyModal={() => setIsProxyModalOpen(true)}
        onOpenSaaSModal={() => setIsSaaSModalOpen(true)}
      />

      {/* Guided 3-Step Walkthrough Banner for Judges */}
      <GuidedTourBar
        currentStep={guidedStep}
        onStepClick={handleStepClick}
        isRunning={isRunningAttack}
        isHealing={isHealing}
        targetMode={targetMode}
      />

      {/* High-Impact Business Consequence Banner */}
      <BusinessImpactBanner
        impact={businessImpact}
        onDismiss={() => setBusinessImpact(null)}
      />

      {/* Main Grid: Attack Matrix & Live Terminal */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(340px, 0.85fr) 1.45fr",
          gap: "18px",
          marginBottom: "18px",
          alignItems: "start"
        }}
      >
        <AttackMatrix
          vectors={vectors}
          selectedVectorId={selectedVectorId}
          isRunning={isRunningAttack}
          onSelectVector={(id) => setSelectedVectorId(id)}
          onRunAttack={() => handleRunAttack()}
        />

        <LiveTerminal logs={logs} isStreaming={isRunningAttack} onClearLogs={() => setLogs([])} />
      </div>

      {/* Executive Tab Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <div className="tab-nav-luxury">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id.toLowerCase()}-btn`}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn-luxury ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(10, 12, 16, 0.7)", padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
          <span className={`pulse-orb ${engineReady ? "emerald" : "ruby"}`} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Inference Engine: <span style={{ color: engineReady ? "var(--accent-emerald)" : "var(--accent-ruby)", fontWeight: 600 }}>
              {engineReady ? "Groq 120B Live" : "Offline Sandbox"}
            </span>
          </span>
        </div>
      </div>

      {/* Tab Panels */}
      <div key={activeTab} className="fade-up">
        {activeTab === "OVERVIEW_TRACE" && (
          <TraceDAG
            nodes={traceNodes}
            targetMode={targetMode}
            onTriggerHeal={handleTriggerHeal}
            isHealing={isHealing}
          />
        )}

        {activeTab === "IMMUNE_DIFF" && (
          <ImmuneDiffViewer
            patch={patch}
            targetMode={targetMode}
            onTriggerHeal={handleTriggerHeal}
            isHealing={isHealing}
          />
        )}

        {activeTab === "COMPLIANCE" && <ComplianceStudio targetMode={targetMode} />}

        {activeTab === "PLAYGROUND" && (
          <LivePlayground
            activeTargetKey={targetKey}
            activeTargetName={targetName}
            targetMode={targetMode}
            onToggleMode={handleToggleMode}
            onExecutionComplete={(impact, traceId, result) => {
              setBusinessImpact(impact);
              if (result) {
                setLogs(prev => [
                  ...prev,
                  {
                    id: `log_${Date.now()}_play`,
                    time: new Date().toLocaleTimeString(),
                    stage: "SANDBOX_TEST",
                    message: `[Interactive Sandbox] Execution against ${targetName} [${targetMode.toUpperCase()}]. Verdict: ${result.isCompromised ? "COMPROMISED" : "SAFE"}. Latency: ${result.latencyMs}ms.`,
                    isError: result.isCompromised,
                    isSuccess: !result.isCompromised,
                    agentResponse: result.response
                  }
                ]);
              }
              if (traceId) {
                fetch("/api/traces")
                  .then(r => r.json())
                  .then(d => {
                    const found = d.traces?.find((t: any) => t.traceId === traceId);
                    if (found?.nodes) setTraceNodes(found.nodes);
                  })
                  .catch(console.error);
              }
            }}
          />
        )}

        {activeTab === "PROXY_TELEMETRY" && (
          <ProxyTelemetryStream targetMode={targetMode} />
        )}
      </div>

      {/* Modals */}
      <PresentationModal isOpen={isDeckOpen} onClose={() => setIsDeckOpen(false)} />
      <ProxyIntegrationModal isOpen={isProxyModalOpen} onClose={() => setIsProxyModalOpen(false)} />
      <SaaSSettingsModal isOpen={isSaaSModalOpen} onClose={() => setIsSaaSModalOpen(false)} />
    </div>
  );
};
