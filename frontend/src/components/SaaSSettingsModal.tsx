import React, { useState, useEffect } from "react";

export interface ApiKeyRecord {
  id: string;
  keyPrefix: string;
  name: string;
  environment: "production" | "staging";
  createdDate: string;
  lastUsed: string;
  status: "ACTIVE" | "REVOKED";
}

interface SaaSSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaaSSettingsModal: React.FC<SaaSSettingsModalProps> = ({ isOpen, onClose }) => {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [quota, setQuota] = useState({
    plan: "Enterprise Autonomous Shield",
    totalAllowance: 100000,
    usedAllowance: 14280,
    percentUsed: 14.3
  });
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<"production" | "staging">("production");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/saas/keys")
      .then(res => res.json())
      .then(data => {
        if (data.keys) setKeys(data.keys);
        if (data.quota) setQuota(data.quota);
      })
      .catch(console.error);
  }, [isOpen]);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch("/api/saas/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName || "Agent Cluster Key", environment: newKeyEnv })
      });
      const data = await res.json();
      if (data.success && data.key) {
        setKeys(prev => [data.key, ...prev]);
        setNewKeyName("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  if (!isOpen) return null;

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
        maxWidth: "920px",
        maxHeight: "90vh",
        overflowY: "auto",
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span className="badge badge-emerald">SAAS ENTERPRISE CONSOLE</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent-cyan)" }}>
                ORG: ORG-AGENT-SEC-US-EAST
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 600, color: "#ffffff", margin: 0, letterSpacing: "0.04em" }}>
              AgentSentry SaaS & API Management
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
              Manage multi-tenant API credentials, monitor monthly proxy invocation quotas, and audit enterprise SLAs.
            </p>
          </div>

          <button onClick={onClose} className="btn-dark" style={{ padding: "6px 14px", fontSize: "0.78rem" }}>
            ✕ CLOSE
          </button>
        </div>

        {/* Quota & Plan Summary Card */}
        <div style={{ padding: "18px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Current Subscription Tier
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" }}>
                  {quota.plan}
                </span>
                <span className="badge badge-emerald" style={{ fontSize: "0.7rem" }}>$499 / MONTH (ACTIVE)</span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Monthly Quota Usage
              </span>
              <div style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--accent-cyan)", marginTop: "2px" }}>
                {quota.usedAllowance.toLocaleString()} / {quota.totalAllowance.toLocaleString()} invocations ({quota.percentUsed}%)
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${quota.percentUsed}%`, height: "100%", background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))", borderRadius: "3px" }} />
          </div>
        </div>

        {/* Generate API Key Form */}
        <div style={{ padding: "16px", background: "rgba(4, 5, 8, 0.6)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#ffffff", display: "block", marginBottom: "10px" }}>
            + Issue New Cryptographic API Key
          </span>
          <form onSubmit={handleGenerateKey} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Key label (e.g. Banking Agent Cluster US-East)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              style={{
                flex: 1,
                minWidth: "260px",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-sm)",
                color: "#ffffff",
                fontSize: "0.8rem",
                fontFamily: "var(--font-mono)"
              }}
            />
            <select
              value={newKeyEnv}
              onChange={(e) => setNewKeyEnv(e.target.value as any)}
              style={{
                padding: "8px 12px",
                background: "rgba(10, 12, 16, 0.9)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-sm)",
                color: "#ffffff",
                fontSize: "0.8rem"
              }}
            >
              <option value="production">Production Environment</option>
              <option value="staging">Staging / Sandbox</option>
            </select>
            <button
              type="submit"
              disabled={isGenerating}
              className="btn-chrome"
              style={{ padding: "8px 16px", fontSize: "0.78rem" }}
            >
              {isGenerating ? "Generating..." : "Issue API Key"}
            </button>
          </form>
        </div>

        {/* API Keys Table */}
        <div style={{ background: "rgba(4, 5, 8, 0.6)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.01)" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Active SaaS Credentials
            </span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)", fontSize: "0.72rem" }}>
                <th style={{ padding: "10px 16px" }}>KEY LABEL</th>
                <th style={{ padding: "10px 16px" }}>SECRET TOKEN PREFIX</th>
                <th style={{ padding: "10px 16px" }}>ENV</th>
                <th style={{ padding: "10px 16px" }}>STATUS</th>
                <th style={{ padding: "10px 16px", textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "12px 16px", color: "#ffffff", fontWeight: 600 }}>{k.name}</td>
                  <td style={{ padding: "12px 16px", color: "var(--accent-cyan)" }}>{k.keyPrefix}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`badge ${k.environment === "production" ? "badge-emerald" : "badge-cyan"}`} style={{ fontSize: "0.68rem" }}>
                      {k.environment.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ color: "var(--accent-emerald)", fontSize: "0.72rem", fontWeight: 600 }}>
                      ● {k.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button
                      onClick={() => copyToClipboard(k.keyPrefix, k.id)}
                      className="btn-dark"
                      style={{ padding: "4px 10px", fontSize: "0.7rem" }}
                    >
                      {copiedKeyId === k.id ? "✔ Copied" : "Copy"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Enterprise Tier Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "16px" }}>
          <div style={{ padding: "14px", background: "rgba(255,255,255,0.01)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 600, display: "block" }}>COMMUNITY CORE</span>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", display: "block", margin: "2px 0 6px 0" }}>$0 / mo</span>
            <ul style={{ fontSize: "0.74rem", color: "var(--text-secondary)", margin: 0, paddingLeft: "16px", lineHeight: 1.5 }}>
              <li>10,000 proxy calls / mo</li>
              <li>Community heuristic filters</li>
              <li>Local sandbox verification</li>
            </ul>
          </div>

          <div style={{ padding: "14px", background: "rgba(255,255,255,0.01)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--accent-cyan)", fontSize: "0.72rem", fontWeight: 600, display: "block" }}>PRO TEAM</span>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", display: "block", margin: "2px 0 6px 0" }}>$99 / mo</span>
            <ul style={{ fontSize: "0.74rem", color: "var(--text-secondary)", margin: 0, paddingLeft: "16px", lineHeight: 1.5 }}>
              <li>Unlimited proxy calls</li>
              <li>Autonomous immune hotpatching</li>
              <li>Real-time Slack & Discord alerts</li>
            </ul>
          </div>

          <div style={{ padding: "14px", background: "rgba(0, 240, 255, 0.03)", borderRadius: "var(--radius-sm)", border: "1px solid var(--accent-cyan)" }}>
            <span style={{ color: "var(--accent-emerald)", fontSize: "0.72rem", fontWeight: 600, display: "block" }}>ENTERPRISE SHIELD (CURRENT)</span>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", display: "block", margin: "2px 0 6px 0" }}>$499 / mo</span>
            <ul style={{ fontSize: "0.74rem", color: "var(--text-secondary)", margin: 0, paddingLeft: "16px", lineHeight: 1.5 }}>
              <li>Dedicated isolated VPC proxy</li>
              <li>Automated SOC 2 & EU AI Act reports</li>
              <li>99.99% Uptime & &lt;15ms SLA</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
