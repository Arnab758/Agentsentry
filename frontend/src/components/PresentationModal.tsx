import React, { useState, useEffect } from "react";

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SlideData {
  title: string;
  subtitle: string;
  badge: string;
  content: React.ReactNode;
}

const SLIDES: SlideData[] = [
  {
    title: "AgentSentry",
    subtitle: "The Autonomous AI Agent Immune & Observability Fabric",
    badge: "SLIDE 01 / 10 • EXECUTIVE VISION",
    content: (
      <div style={{ textAlign: "center", padding: "24px 20px" }}>
        <div style={{
          display: "inline-flex",
          padding: "18px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--border-strong)",
          boxShadow: "0 0 32px rgba(255, 255, 255, 0.08)",
          marginBottom: "16px"
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "#ffffff" }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.5rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "#ffffff",
          margin: "0 0 8px 0"
        }}>
          AGENT<span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>SENTRY</span>
        </h1>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "1rem",
          color: "var(--text-secondary)",
          maxWidth: "620px",
          margin: "0 auto 20px auto",
          letterSpacing: "0.03em",
          lineHeight: 1.6
        }}>
          Autonomous Red-Teaming, Real-Time Trace Observability &amp; Closed-Loop Cognitive Hotpatching for AI-Native Enterprise SaaS.
        </p>
        <div style={{ display: "inline-flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <span className="badge badge-chrome">AI BUILDERS HACKATHON 2026</span>
          <span className="badge badge-emerald">BEST SAAS PRODUCT TRACK</span>
          <span className="badge badge-chrome">100% LIVE INFERENCE • GROQ LPU</span>
        </div>
      </div>
    )
  },
  {
    title: "Problem Statement",
    subtitle: "The Fragility & Catastrophic Risks of Autonomous Agents in Production",
    badge: "SLIDE 02 / 10 • PROBLEM STATEMENT",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginTop: "14px" }}>
        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderLeft: "3px solid var(--accent-ruby)", borderRadius: "var(--radius-sm)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--accent-ruby)", marginBottom: "8px" }}>
            1. Indirect Prompt Injection
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            Adversaries embed stealth override commands into normal PDFs, bank memos, and support tickets that hijack the LLM’s decision cycle and re-route corporate capital.
          </p>
        </div>
        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderLeft: "3px solid var(--accent-amber)", borderRadius: "var(--radius-sm)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--accent-amber)", marginBottom: "8px" }}>
            2. Excessive Agency &amp; Tool Abuse
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            Agents equipped with function calling (SQL queries, wire transfers, bash execution) lack deterministic runtime security barriers and execute irreversible destructive actions.
          </p>
        </div>
        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderLeft: "3px solid #ffffff", borderRadius: "var(--radius-sm)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "#ffffff", marginBottom: "8px" }}>
            3. Passive Smoke Detectors
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            Current tools (LangSmith, Langfuse, Datadog) only log post-mortem disaster traces after customer funds are gone. The market has smoke detectors, but zero autonomous firefighters.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Solution Overview",
    subtitle: "A Closed-Loop Autonomous Immune System for AI-Native Applications",
    badge: "SLIDE 03 / 10 • SOLUTION OVERVIEW",
    content: (
      <div>
        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 16px 0" }}>
          AgentSentry is an active, biological immune system for AI agents. It continuously pen-tests target agents with an adversarial swarm, detects compromises in flight, dynamically synthesizes runtime guardrails, and mathematically validates that good traffic never breaks.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          <div style={{ padding: "14px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--accent-ruby)", fontWeight: 700, display: "block", marginBottom: "4px" }}>01. ADVERSARIAL SWARM</span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-pearl)", fontWeight: 600 }}>Multi-Turn Red-Teaming</span>
            <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>Autonomous attacker probes OWASP Top-10 vulnerabilities with live model mutations.</p>
          </div>
          <div style={{ padding: "14px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "0.7rem", color: "#ffffff", fontWeight: 700, display: "block", marginBottom: "4px" }}>02. OBSERVABILITY DAG</span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-pearl)", fontWeight: 600 }}>Real-Time Interception</span>
            <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>SSE streaming of tool payloads, token consumption, and latencies.</p>
          </div>
          <div style={{ padding: "14px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--accent-emerald)", fontWeight: 700, display: "block", marginBottom: "4px" }}>03. IMMUNE HEALER</span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-pearl)", fontWeight: 600 }}>Dynamic Synthesis</span>
            <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>Synthesizes runtime tool RBAC and parameter regexes directly from exploit traces.</p>
          </div>
          <div style={{ padding: "14px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--accent-chrome)", fontWeight: 700, display: "block", marginBottom: "4px" }}>04. REGRESSION SANDBOX</span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-pearl)", fontWeight: 600 }}>100% Golden Retention</span>
            <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>Empirically verifies 0% false positives before deploying zero-downtime hotpatches.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Target Users & Customer Personas",
    subtitle: "Empowering AI Founders, Enterprise DevSecOps, & Autonomous Builders",
    badge: "SLIDE 04 / 10 • TARGET USERS",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "14px" }}>
        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ffffff" }} />
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "#ffffff", margin: 0 }}>AI-Native SaaS Founders</h4>
          </div>
          <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: "8px" }}>NexFellow &amp; YC Startups</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Startups deploying autonomous agents that handle user money, databases, or support tickets. They need instant enterprise compliance to close B2B enterprise deals without getting blocked by security audits.
          </p>
        </div>

        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-emerald)" }} />
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "#ffffff", margin: 0 }}>Enterprise DevSecOps &amp; CISOs</h4>
          </div>
          <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: "8px" }}>Fintech, Healthcare &amp; Legal</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Security engineers tasked with governing LLM agent applications. They demand SOC2/OWASP compliance scorecards, audit traces, automated CI/CD security gates, and mathematical zero-downtime regression guarantees.
          </p>
        </div>

        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-amber)" }} />
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "#ffffff", margin: 0 }}>Autonomous Growth Agents</h4>
          </div>
          <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: "8px" }}>Tin Computer Ecosystem</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Autonomous systems granted write access to GitHub repositories, Stripe, and ad accounts. AgentSentry acts as the essential safety guardrail preventing runaway execution loops or catastrophic destructive modifications.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Product Features",
    subtitle: "Enterprise-Grade Capabilities Engineered for Day-One Production Use",
    badge: "SLIDE 05 / 10 • PRODUCT FEATURES",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "12px" }}>
        <div style={{ padding: "14px 18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "#ffffff", margin: "0 0 4px 0" }}>
            1. Multi-Target Red-Team Swarm
          </h4>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            Covers OWASP LLM Top-10 vectors across Financial Banking, Support CRM, and Cloud/DevOps agents with live payload mutation and vetted fallback libraries.
          </p>
        </div>

        <div style={{ padding: "14px 18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "#ffffff", margin: "0 0 4px 0" }}>
            2. 1-Line Drop-In OpenAI Proxy
          </h4>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            OpenAI-compatible reverse proxy (<code style={{ color: "#ffffff" }}>/v1/chat/completions</code>). Developers integrate existing LangChain or CrewAI agents tomorrow simply by changing their <code style={{ color: "#ffffff" }}>base_url</code>.
          </p>
        </div>

        <div style={{ padding: "14px 18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "#ffffff", margin: "0 0 4px 0" }}>
            3. Real-Time Observability &amp; Trace DAG
          </h4>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            Zero-latency SSE diagnostic telemetry stream and interactive node execution graph tracking reasoning, tool invocations, token accounting, and latencies.
          </p>
        </div>

        <div style={{ padding: "14px 18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "#ffffff", margin: "0 0 4px 0" }}>
            4. Governance, Scorecards &amp; CI/CD
          </h4>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            One-click executive audit report generator and exportable GitHub Action workflow for continuous automated security testing in pull requests.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Technical Architecture",
    subtitle: "Zero-Trust Decoupled Reverse Proxy Gateway Sitting at the Runtime Boundary",
    badge: "SLIDE 06 / 10 • TECHNICAL ARCHITECTURE",
    content: (
      <div style={{ marginTop: "10px", padding: "14px", background: "rgba(5, 6, 8, 0.95)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
        <pre style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#ffffff", lineHeight: 1.55, overflowX: "auto", margin: 0 }}>
{`[Client / User Request] ──► [AgentSentry Reverse Proxy Gateway: /v1/chat/completions]
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        [Pre-Inference Perimeter]             [Security Telemetry Engine]
        ├── Llama-Prompt-Guard-2              ├── Real-Time SSE Streamer
        └── Regex & Token Sanitizer           └── Trace DAG Logger
                   │
                   ▼ (If Clean)
        [Target Agent Execution Loop: Groq LPU gpt-oss-120b]
                   │
                   ▼ (Tool Call Attempted)
        [Runtime Tool RBAC Interceptor]
        ├── Block Unauthorized Recipient / File Access
        ├── Enforce Execution Budget (Loop Limits <= 2)
        └── Mask PII in Tool Response
                   │
                   ▼ (If Breach Detected)
        [Autonomous Immune Healer] ──► [Regression Sandbox] ──► [Hot-Promote Policy]`}
        </pre>
      </div>
    )
  },
  {
    title: "AI Technologies Used",
    subtitle: "Powered by Groq LPUs & Frontier Open-Weight Security Models",
    badge: "SLIDE 07 / 10 • AI TECHNOLOGIES USED",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "14px" }}>
        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <span className="badge badge-chrome" style={{ marginBottom: "8px" }}>REASONING ENGINE</span>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#ffffff", margin: "4px 0" }}>openai/gpt-oss-120b</h4>
          <p style={{ fontSize: "0.76rem", color: "var(--accent-chrome)", marginBottom: "8px" }}>Groq LPU Inference</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Drives complex multi-turn target agent reasoning, function calling tool loops, and autonomous immune policy synthesis with structured JSON output parsing.
          </p>
        </div>

        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <span className="badge badge-ruby" style={{ marginBottom: "8px" }}>ADVERSARIAL ATTACKER</span>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#ffffff", margin: "4px 0" }}>openai/gpt-oss-20b</h4>
          <p style={{ fontSize: "0.76rem", color: "var(--accent-ruby)", marginBottom: "8px" }}>High-Speed Mutation</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Generates novel adversarial payloads, evasion mutations, and social engineering attacks in sub-500ms bursts to rigorously stress-test agent boundaries.
          </p>
        </div>

        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <span className="badge badge-emerald" style={{ marginBottom: "8px" }}>SEMANTIC FIREWALL</span>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#ffffff", margin: "4px 0" }}>llama-prompt-guard-2</h4>
          <p style={{ fontSize: "0.76rem", color: "var(--accent-emerald)", marginBottom: "8px" }}>Meta 22M Classifier</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Dedicated pre-inference injection classifier that intercepts malicious payloads before they ever reach the primary reasoning model, minimizing token cost.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Impact & Value Proposition",
    subtitle: "Transforming Catastrophic Financial Breaches into Verified $0.00 Losses",
    badge: "SLIDE 08 / 10 • IMPACT & VALUE PROPOSITION",
    content: (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px", marginBottom: "16px" }}>
          <div style={{ padding: "18px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--accent-ruby)", fontWeight: 700, letterSpacing: "0.1em" }}>WITHOUT AGENTSENTRY</span>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "1.5rem", color: "var(--accent-ruby)", margin: "6px 0" }}>$842,500.00 DRAIN</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Prompt injection in settlement memo persuades agent to execute unauthorized wire transfer. PII leaked, database dropped, enterprise compliance failed.
            </p>
          </div>

          <div style={{ padding: "18px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--accent-emerald)", fontWeight: 700, letterSpacing: "0.1em" }}>WITH AGENTSENTRY FABRIC</span>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "1.5rem", color: "var(--accent-emerald)", margin: "6px 0" }}>$0.00 PREVENTED LOSS</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Payload quarantined in flight. Legitimate $150 payment processed safely. Zero downtime, 100% golden suite task retention, 0% false positives.
            </p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", textAlign: "center" }}>
          <div style={{ padding: "12px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", fontWeight: 700, color: "#ffffff" }}>98.4%</span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block", textTransform: "uppercase" }}>Protection Index</span>
          </div>
          <div style={{ padding: "12px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", fontWeight: 700, color: "var(--accent-emerald)" }}>&lt; 15ms</span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block", textTransform: "uppercase" }}>Proxy Overhead</span>
          </div>
          <div style={{ padding: "12px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", fontWeight: 700, color: "var(--accent-chrome)" }}>1-Line</span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block", textTransform: "uppercase" }}>Drop-In Integration</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "SaaS Business Model & Sponsor Synergy",
    subtitle: "High-Margin Infrastructure with Usage-Based Scaling & Sponsor Alignment",
    badge: "SLIDE 09 / 10 • SAAS BUSINESS MODEL",
    content: (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "10px", marginBottom: "14px" }}>
          <div style={{ padding: "14px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--text-secondary)", margin: "0 0 2px 0" }}>Developer</h4>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", fontWeight: 700, color: "#ffffff" }}>$99<span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>/mo</span></span>
            <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "6px 0 0 0" }}>Up to 3 agents, nightly red-team scans, standard trace DAG.</p>
          </div>
          <div style={{ padding: "14px", background: "rgba(15, 18, 24, 0.9)", border: "1px solid #ffffff", borderRadius: "var(--radius-sm)" }}>
            <span className="badge badge-chrome" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>FLAGSHIP</span>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "#ffffff", margin: "2px 0" }}>Team SaaS</h4>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", fontWeight: 700, color: "#ffffff" }}>$499<span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>/mo</span></span>
            <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "6px 0 0 0" }}>Unlimited agents, real-time closed-loop healing, SOC2/OWASP exports.</p>
          </div>
          <div style={{ padding: "14px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--text-secondary)", margin: "0 0 2px 0" }}>Enterprise</h4>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", fontWeight: 700, color: "#ffffff" }}>Custom</span>
            <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "6px 0 0 0" }}>On-prem VPC deployment, custom attack models, dedicated SLAs.</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ padding: "12px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <strong style={{ fontSize: "0.78rem", color: "#ffffff" }}>NexFellow Synergy:</strong>
            <p style={{ fontSize: "0.74rem", color: "var(--text-secondary)", margin: "4px 0 0 0", lineHeight: 1.5 }}>
              Empowers early-stage builders to launch agentic products with enterprise-level security guarantees, building user trust immediately.
            </p>
          </div>
          <div style={{ padding: "12px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <strong style={{ fontSize: "0.78rem", color: "#ffffff" }}>Tin Computer Synergy:</strong>
            <p style={{ fontSize: "0.74rem", color: "var(--text-secondary)", margin: "4px 0 0 0", lineHeight: 1.5 }}>
              Provides real-time safety guardrails for autonomous growth agents connecting to code, Stripe, and ad channels, preventing destructive operations.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Future Roadmap",
    subtitle: "30-60-90 Day Execution Plan Toward Sovereign Agent Governance",
    badge: "SLIDE 10 / 10 • FUTURE ROADMAP",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginTop: "14px" }}>
        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent-emerald)", fontWeight: 700 }}>DAYS 1 - 30</span>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "#ffffff", margin: "6px 0" }}>Framework Integrations</h4>
          <ul style={{ fontSize: "0.76rem", color: "var(--text-secondary)", padding: 0, listStyle: "none", margin: 0, display: "flex", flexDirection: "column", gap: "6px", lineHeight: 1.5 }}>
            <li>• Native LangGraph &amp; CrewAI SDK middleware</li>
            <li>• 1-click Vercel AI SDK integration plugin</li>
            <li>• Hosted developer cloud sandbox beta</li>
          </ul>
        </div>

        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#ffffff", fontWeight: 700 }}>DAYS 31 - 60</span>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "#ffffff", margin: "6px 0" }}>Multi-Agent Mesh Defense</h4>
          <ul style={{ fontSize: "0.76rem", color: "var(--text-secondary)", padding: 0, listStyle: "none", margin: 0, display: "flex", flexDirection: "column", gap: "6px", lineHeight: 1.5 }}>
            <li>• Cross-agent prompt poisoning detection</li>
            <li>• Cascading failure &amp; collusion prevention</li>
            <li>• Automated Git PR generation for prompt patches</li>
          </ul>
        </div>

        <div style={{ padding: "18px", background: "rgba(10, 12, 16, 0.8)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent-chrome)", fontWeight: 700 }}>DAYS 61 - 90</span>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "#ffffff", margin: "6px 0" }}>Enterprise Sovereign VPC</h4>
          <ul style={{ fontSize: "0.76rem", color: "var(--text-secondary)", padding: 0, listStyle: "none", margin: 0, display: "flex", flexDirection: "column", gap: "6px", lineHeight: 1.5 }}>
            <li>• Air-gapped Kubernetes Helm chart</li>
            <li>• Hardware Security Module (HSM) key attestation</li>
            <li>• Automated SOC2 Type II compliance evidence export</li>
          </ul>
        </div>
      </div>
    )
  }
];

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentSlide = SLIDES[currentSlideIndex];

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
        maxWidth: "980px",
        height: "620px",
        display: "flex",
        flexDirection: "column",
        padding: "24px 30px",
        background: "rgba(8, 10, 14, 0.96)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.08)"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "14px"
        }}>
          <div>
            <span className="badge badge-chrome" style={{ marginBottom: "4px" }}>{currentSlide.badge}</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 600, color: "#ffffff", margin: 0, letterSpacing: "0.04em" }}>
              {currentSlide.title}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "3px 0 0 0" }}>
              {currentSlide.subtitle}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => window.open("/presentation_deck.html", "_blank")}
              className="btn btn-ghost"
              style={{ padding: "6px 12px", fontSize: "0.72rem" }}
              title="Open printable standalone deck"
            >
              PRINT / EXPORT PDF ↗
            </button>
            <button
              onClick={onClose}
              className="btn-dark"
              style={{ padding: "6px 14px", fontSize: "0.75rem" }}
            >
              ✕ CLOSE
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          {currentSlide.content}
        </div>

        {/* Footer & Controls */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: "14px"
        }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {SLIDES.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                style={{
                  width: idx === currentSlideIndex ? "30px" : "14px",
                  height: "3px",
                  borderRadius: "2px",
                  background: idx === currentSlideIndex ? "#ffffff" : "rgba(255,255,255,0.18)",
                  boxShadow: idx === currentSlideIndex ? "0 0 8px rgba(255,255,255,0.4)" : "none",
                  cursor: "pointer",
                  transition: "all 0.25s var(--ease-mercedes)"
                }}
              />
            ))}
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "8px" }}>
              {currentSlideIndex + 1} of {SLIDES.length}
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex(prev => prev - 1)}
              className="btn-dark"
              style={{ padding: "7px 16px", fontSize: "0.75rem", opacity: currentSlideIndex === 0 ? 0.4 : 1 }}
            >
              ← PREVIOUS
            </button>
            <button
              disabled={currentSlideIndex === SLIDES.length - 1}
              onClick={() => setCurrentSlideIndex(prev => prev + 1)}
              className="btn-chrome"
              style={{ padding: "7px 18px", fontSize: "0.75rem", opacity: currentSlideIndex === SLIDES.length - 1 ? 0.4 : 1 }}
            >
              NEXT SLIDE →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
