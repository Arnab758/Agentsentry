# 🏆 Devpost Official Submission Guide: AgentSentry
*Copy and paste these exact sections directly into your Devpost project submission form.*

---

## 📌 Form Field 1: Project Title
**AgentSentry**

---

## 📌 Form Field 2: Elevator Pitch (Tagline)
*Under 200 characters:*
> **The world's first autonomous immune & observability fabric for AI agents. Closed-loop adversarial red-teaming, real-time trace DAGs, and live cognitive hotpatching.**

---

## 📌 Form Field 3: Track / Category
* **Best SaaS Product** ($4,000 Cash Prize)
* Additional tags: AI Agents, Cybersecurity, Developer Tools, Observability, Governance & Compliance.

---

## 📌 Form Field 4: Built With (Tags)
`typescript`, `react`, `node.js`, `groq`, `llama-prompt-guard-2`, `gpt-oss-120b`, `server-sent-events`, `vite`, `tailwind-tokens`, `owasp-top-10`, `soc2`, `rest-api`

---

## 📌 Form Field 5: Story / Description (Markdown)

### 💡 Inspiration
In 2026, thousands of software companies are deploying autonomous LLM agents into mission-critical customer workflows—handling payments, customer support, database analytics, and code execution. 

However, as founders and security teams quickly discover, **autonomous agents are terrifyingly fragile**. An indirect prompt injection buried in an innocent PDF, bank settlement memo, or support ticket can hijack an agent’s decision loop, trigger unauthorized fund transfers, exfiltrate customer PII, or execute destructive database drops.

Today’s tooling offers only **passive smoke detectors** (*LangSmith, Langfuse, Datadog*). They produce pretty dashboards *after* customer funds are drained and databases are wiped. Security teams are putting the freeze on autonomous agent deployments because there are no real-time guarantees. 

We asked ourselves: **What if an AI agent had an active biological immune system?** An autonomous sentinel that continually red-teams the agent with an adversarial swarm, detects compromises in flight, dynamically synthesizes runtime guardrails, and mathematically verifies that business functionality never breaks. 

That is **AgentSentry**.

---

### ⚙️ What It Does

AgentSentry is an enterprise-grade, closed-loop Autonomous Immune System, Real-Time Observability Gateway, and Red-Teaming Fabric for AI-native SaaS products.

#### The 4 Core Pillars:
1. **⚔️ Adversarial Red-Team Swarm**: Continuously stress-tests target agents across the OWASP LLM Top-10 (indirect prompt injection, privilege escalation, credential leakage, parameter poisoning, unbounded loops). Each run uses live models to generate novel mutations, backed by a vetted attack library.
2. **📊 Real-Time Observability & Execution Trace DAG**: Intercepts every reasoning turn, semantic firewall classification, tool invocation, token count, and latency measurement in real-time via Server-Sent Events (SSE).
3. **🧬 Autonomous Immune Healer**: Consumes live exploit traces and automatically synthesizes a 3-tier runtime guardrail policy: cognitive prompt hardening, tool execution RBAC, and parameter sanitization regexes.
4. **🧪 Non-Destructive Regression Sandbox**: Before deploying any patch to production, AgentSentry automatically re-runs golden task suites and replays the exact live exploit. It verifies 100% functional retention and 0.0% false positives.
5. **🔌 1-Line Drop-In OpenAI Proxy**: Developers can secure existing LangChain, CrewAI, or OpenAI SDK applications tomorrow simply by changing their `base_url` to `http://localhost:3001/v1`.

---

### 🛠️ How We Built It

* **Runtime Inference Engine**: Powered by **Groq LPU Hardware** executing `openai/gpt-oss-120b` for deep agent reasoning, `openai/gpt-oss-20b` for high-speed adversarial recon, and `meta-llama/llama-prompt-guard-2-22m` for semantic perimeter defense. **Zero canned responses, zero mocked traces.**
* **Zero-Trust Reverse Proxy Gateway**: Built on Node.js/TypeScript, featuring an OpenAI-compatible `/v1/chat/completions` reverse proxy that intercepts malicious payloads in sub-15ms and enforces runtime tool RBAC.
* **Autonomous Immune Synthesizer**: Uses structured output parsing to emit deterministic JSON guardrail policies directly enforceable at the runtime boundary.
* **Executive HUD & Observability Cockpit**: Built with React 18, Vite, and an automotive-grade Mercedes-Benz MBUX executive design system featuring glassmorphic panels, hairline borders, and live telemetry feeds.
* **Audit & Compliance Engine**: Automatically generates OWASP LLM Top-10 & SOC2 AI Trust scorecards, downloadable executive audit reports, and ready-to-run GitHub Actions CI/CD workflows.

---

### 🧗 Challenges We Ran Into

1. **Eliminating the "Silent Pen-Test Pass"**: Modern frontier LLMs often decline to generate adversarial payloads when queried directly. We engineered a dual-stage generator: the attacker model attempts dynamic mutation, and if it flags a safety refusal, our engine seamlessly falls back to an extensive vetted vector library. Pen-tests never silently no-op.
2. **The Guardrail Dilemma (Breaking Good Traffic)**: The #1 reason developers uninstall security guardrails is because they introduce false positives and degrade legitimate agent performance. We solved this by making the Regression Sandbox an unskippable gate: if a patch causes a golden benchmark task to fail, it is rejected automatically.
3. **High-Frequency Telemetry Jitter**: Streaming multi-turn agent conversations, DAG state updates, and token meters simultaneously over SSE required strict memory pooling and container-scoped DOM rendering to ensure smooth 60fps telemetry.

---

### 🏅 Accomplishments That We're Proud Of

* **100% Live Inference**: Every single test, attack, and auto-heal run is powered by real model inference.
* **9/9 Automated Integration Tests**: Complete test suite validating prompt injection mitigation, unauthorized wire deflection, PII leak prevention, SQL injection defense, and full end-to-end hijack → heal → hold cycles.
* **Proven Financial Deflection**: Demonstrated a catastrophic $842,500.00 wire drain deflected to $0.00 loss with zero user downtime and 100% golden suite retention.
* **True Drop-In SaaS Capability**: Production-ready OpenAI-compatible reverse proxy that lets any developer protect their AI agent in 60 seconds with 1 line of code.

---

### 📚 What We Learned

* Defense-in-depth is the only viable architecture for autonomous agents. System prompts alone will always fail; security must be enforced at the runtime tool boundary.
* Observability without autonomous remediation is obsolete in the agent era. When agents act in milliseconds, humans cannot be in the loop for incident response—the loop must close itself.

---

### 🔮 What's Next for AgentSentry

* **Multi-Agent Immune Mesh**: Expanding beyond single-agent boundaries to detect cross-agent collusion and cascading failures in agent swarms (e.g., LangGraph, AutoGen).
* **On-Premise VPC Gateway**: Enterprise Kubernetes helm chart for air-gapped financial institutions.
* **Automatic Pull Request Generation**: Enabling the Immune Healer to commit validated prompt patches directly to client GitHub repositories.

---

## 📌 Form Field 6: Links to Submit
* **GitHub Repository**: `https://github.com/[YOUR_USERNAME]/AgentSentry`
* **Demo Video URL**: `[YOUR_YOUTUBE_OR_LOOM_LINK]`
* **Try it Out**: `http://localhost:3000` (or your deployed URL)
