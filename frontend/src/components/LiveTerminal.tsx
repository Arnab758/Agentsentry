import React, { useEffect, useRef } from "react";

export interface TerminalLog {
  id: string;
  time: string;
  stage: string;
  message: string;
  isError?: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  agentResponse?: string;
}

interface LiveTerminalProps {
  logs: TerminalLog[];
  isStreaming: boolean;
  onClearLogs: () => void;
}

export const LiveTerminal: React.FC<LiveTerminalProps> = ({ logs, isStreaming, onClearLogs }) => {
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "510px" }}>
      {/* Executive Console Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: "14px",
        marginBottom: "14px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
          </div>
          <span className="tracking-luxury" style={{ fontSize: "0.72rem", color: "#ffffff", fontWeight: 600 }}>
            LIVE DIAGNOSTIC TELEMETRY
          </span>
          {isStreaming && (
            <span className="badge badge-chrome" style={{ fontSize: "0.62rem" }}>
              <span className="pulse-orb emerald" style={{ width: "5px", height: "5px" }} />
              STREAM ACTIVE
            </span>
          )}
        </div>

        <button
          onClick={onClearLogs}
          className="btn btn-ghost"
          style={{ padding: "4px 12px", fontSize: "0.72rem" }}
        >
          CLEAR CONSOLE
        </button>
      </div>

      {/* Console Feed */}
      <div
        ref={consoleContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          lineHeight: 1.65,
          padding: "4px 6px"
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: "var(--text-muted)", textAlign: "center", marginTop: "150px" }}>
            <p className="tracking-luxury" style={{ fontSize: "0.75rem", letterSpacing: "0.15em" }}>
              DIAGNOSTIC TELEMETRY STANDBY
            </p>
            <p style={{ fontSize: "0.75rem", marginTop: "6px", color: "var(--text-secondary)" }}>
              Select an adversarial vector and launch the red-team swarm to stream live execution telemetry.
            </p>
          </div>
        ) : (
          logs.map((log) => {
            let stageColor = "var(--text-muted)";
            if (log.isError) stageColor = "var(--accent-ruby)";
            else if (log.isSuccess) stageColor = "var(--accent-emerald)";
            else if (log.isWarning) stageColor = "var(--accent-amber)";

            return (
              <div key={log.id} style={{ marginBottom: "12px", wordBreak: "break-word" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", flexShrink: 0 }}>
                    {log.time}
                  </span>
                  <span style={{
                    color: stageColor,
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    padding: "1px 6px",
                    borderRadius: "2px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    letterSpacing: "0.08em",
                    flexShrink: 0
                  }}>
                    {log.stage}
                  </span>
                  <span style={{
                    color: log.isError ? "#fca5a5" : log.isSuccess ? "#86efac" : "var(--text-pearl)",
                    fontSize: "0.78rem"
                  }}>
                    {log.message}
                  </span>
                </div>

                {log.agentResponse && (
                  <div style={{
                    marginTop: "8px",
                    marginLeft: "24px",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    background: log.isError ? "rgba(239, 68, 68, 0.06)" : "rgba(16, 185, 129, 0.06)",
                    borderLeft: `2px solid ${log.isError ? "var(--accent-ruby)" : "var(--accent-emerald)"}`,
                    color: "var(--text-pearl)",
                    fontSize: "0.76rem"
                  }}>
                    <span className="tracking-luxury" style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: log.isError ? "var(--accent-ruby)" : "var(--accent-emerald)",
                      display: "block",
                      marginBottom: "4px"
                    }}>
                      TARGET AGENT RESPONSE:
                    </span>
                    <div style={{ whiteSpace: "pre-wrap" }}>
                      {log.agentResponse}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
