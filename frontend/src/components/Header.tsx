import React from "react";

interface HeaderProps {
  targetKey: "banking" | "support" | "custom";
  targetName: string;
  targetMode: "vulnerable" | "immunized";
  metrics: {
    totalAttacksRun: number;
    threatsNeutralized: number;
    meanTimeToHealMs: number;
    protectionScore: number;
  };
  onSelectTarget: (key: "banking" | "support" | "custom") => void;
  onToggleMode: (mode: "vulnerable" | "immunized") => void;
  onOpenDeck: () => void;
  onOpenProxyModal: () => void;
  onOpenSaaSModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  targetKey,
  targetName,
  targetMode,
  metrics,
  onSelectTarget,
  onToggleMode,
  onOpenDeck,
  onOpenProxyModal,
  onOpenSaaSModal
}) => {
  return (
    <header className="glass-panel" style={{ padding: "20px 28px", marginBottom: "24px", position: "relative" }}>
      {/* Top Bar: Brand, Switcher, Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        
        {/* Brand Crest & Luxury Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Mercedes-Benz Style Star Crest */}
          <div style={{
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.8) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.12)"
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.2">
              <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="1.2" fill="none"/>
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="#ffffff" strokeWidth="0.8" opacity="0.4"/>
              <polygon points="12,2 14.5,10.5 22,12 14.5,13.5 12,22 9.5,13.5 2,12 9.5,10.5" fill="#ffffff" opacity="0.85"/>
            </svg>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 className="font-display text-gradient-chrome" style={{ fontSize: "1.45rem", fontWeight: 700, letterSpacing: "0.08em" }}>
                AGENT SENTRY
              </h1>
              <span className="badge badge-chrome mono" style={{ fontSize: "0.62rem" }}>EDITION 2026</span>
            </div>
            <p className="tracking-luxury" style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Autonomous AI Agent Immune &amp; Observability Fabric &bull; Target: <span style={{ color: "#ffffff", fontWeight: 600 }}>{targetName}</span>
            </p>
          </div>
        </div>

        {/* Executive Action Cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          
          {/* Target Select in Obsidian Glass */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="tracking-luxury" style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
              TARGET AGENT:
            </span>
            <select
              id="target-select"
              value={targetKey}
              onChange={(e) => onSelectTarget(e.target.value as any)}
              style={{
                background: "rgba(10, 12, 16, 0.95)",
                color: "#ffffff",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                padding: "8px 14px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.03em",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="banking">Financial Concierge Agent (Wire Operations)</option>
              <option value="support">Enterprise CRM Agent (Customer Data Vault)</option>
              <option value="custom">Universal Cloud &amp; DevOps Agent (Shell / Cloud Vault)</option>
            </select>
          </div>

          {/* Shield Status Toggle */}
          <button
            id="shield-toggle-btn"
            onClick={() => onToggleMode(targetMode === "vulnerable" ? "immunized" : "vulnerable")}
            className={`btn ${targetMode === "immunized" ? "btn-emerald" : "btn-ruby"}`}
            style={{ padding: "8px 14px" }}
          >
            <span className={`pulse-orb ${targetMode === "immunized" ? "emerald" : "ruby"}`} />
            <span className="tracking-luxury" style={{ fontSize: "0.7rem" }}>
              {targetMode === "immunized" ? "IMMUNE SHIELD ACTIVE" : "DEFENSE OFF (VULNERABLE)"}
            </span>
          </button>

          {/* 1-Line Integration Proxy Button */}
          <button
            onClick={onOpenProxyModal}
            className="btn btn-dark"
            style={{ padding: "8px 14px", fontSize: "0.72rem" }}
            title="How to integrate AgentSentry into any OpenAI / LangChain app tomorrow"
          >
            <span style={{ color: "var(--accent-emerald)" }}>⚡</span>
            <span className="tracking-luxury">DROP-IN PROXY</span>
          </button>

          {/* SaaS Console & API Keys */}
          <button
            id="saas-console-btn"
            onClick={onOpenSaaSModal}
            className="btn btn-dark"
            style={{ padding: "8px 14px", fontSize: "0.72rem" }}
            title="SaaS Enterprise Management & API Keys"
          >
            <span style={{ color: "var(--accent-cyan)" }}>🔑</span>
            <span className="tracking-luxury">SAAS KEYS &amp; QUOTA</span>
          </button>

          {/* Showroom Pitch Deck Button */}
          <button
            id="view-deck-btn"
            onClick={onOpenDeck}
            className="btn btn-chrome"
            style={{ padding: "8px 16px" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect width="18" height="14" x="3" y="3" rx="2"/>
              <path d="m9 8 7 4-7 4V8z"/>
            </svg>
            <span className="tracking-luxury" style={{ fontSize: "0.7rem" }}>PITCH DECK</span>
          </button>
        </div>

      </div>

      {/* MBUX Digital Cockpit Telemetry Strip */}
      <div style={{
        marginTop: "18px",
        paddingTop: "16px",
        borderTop: "1px solid rgba(255, 255, 255, 0.07)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px"
      }}>
        <div style={{ borderLeft: "2px solid rgba(255,255,255,0.15)", paddingLeft: "12px" }}>
          <span className="tracking-luxury" style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
            Protection Index
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "2px" }}>
            <span className="font-display" style={{
              fontSize: "1.45rem",
              fontWeight: 700,
              color: targetMode === "immunized" ? "var(--accent-emerald)" : "var(--accent-ruby)"
            }}>
              {targetMode === "immunized" ? "98.4%" : "34.2%"}
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
              {targetMode === "immunized" ? "MAXIMUM" : "CRITICAL RISK"}
            </span>
          </div>
        </div>

        <div style={{ borderLeft: "2px solid rgba(255,255,255,0.15)", paddingLeft: "12px" }}>
          <span className="tracking-luxury" style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
            Threats Deflected
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "2px" }}>
            <span className="font-display" style={{ fontSize: "1.45rem", fontWeight: 700, color: "#ffffff" }}>
              {metrics.threatsNeutralized}
            </span>
            <span className="mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              / {metrics.totalAttacksRun || 5} Vectors
            </span>
          </div>
        </div>

        <div style={{ borderLeft: "2px solid rgba(255,255,255,0.15)", paddingLeft: "12px" }}>
          <span className="tracking-luxury" style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
            Mean Time to Heal (MTTH)
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "2px" }}>
            <span className="font-display text-gradient-chrome" style={{ fontSize: "1.45rem", fontWeight: 700 }}>
              142
            </span>
            <span className="mono" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              milliseconds
            </span>
          </div>
        </div>

        <div style={{ borderLeft: "2px solid rgba(255,255,255,0.15)", paddingLeft: "12px" }}>
          <span className="tracking-luxury" style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
            Architecture Standard
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "2px" }}>
            <span className="mono" style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>
              ZERO-TRUST
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
              ISO 42001
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
