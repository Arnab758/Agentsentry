export interface TraceNode {
  id: string;
  type: "INPUT" | "REASONING" | "TOOL_CALL" | "INTERCEPTION" | "IMMUNE_HEAL" | "OUTPUT";
  label: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED" | "HEALED";
  timestamp: number;
  latencyMs: number;
  tokens: {
    input: number;
    output: number;
  };
  details: Record<string, any>;
}

export interface TraceEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface ExecutionTrace {
  traceId: string;
  targetAgent: string;
  attackVectorId?: string;
  timestamp: number;
  totalLatencyMs: number;
  totalTokens: number;
  securityVerdict: "SAFE" | "COMPROMISED" | "IMMUNIZED_BLOCKED";
  vulnerabilityScore: number; // 0 to 100
  nodes: TraceNode[];
  edges: TraceEdge[];
  rawTranscript: Array<{ role: string; content: string; time: string }>;
}

export class AgentTracer {
  private traces: Map<string, ExecutionTrace> = new Map();

  createTrace(targetAgent: string, attackVectorId?: string): ExecutionTrace {
    const traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const trace: ExecutionTrace = {
      traceId,
      targetAgent,
      attackVectorId,
      timestamp: Date.now(),
      totalLatencyMs: 0,
      totalTokens: 0,
      securityVerdict: "SAFE",
      vulnerabilityScore: 0,
      nodes: [],
      edges: [],
      rawTranscript: []
    };
    this.traces.set(traceId, trace);
    return trace;
  }

  getTrace(traceId: string): ExecutionTrace | undefined {
    return this.traces.get(traceId);
  }

  getAllTraces(): ExecutionTrace[] {
    return Array.from(this.traces.values()).reverse();
  }

  addNode(traceId: string, node: TraceNode): void {
    const trace = this.traces.get(traceId);
    if (!trace) return;

    trace.nodes.push(node);
    trace.totalLatencyMs += node.latencyMs;
    trace.totalTokens += (node.tokens.input + node.tokens.output);

    if (trace.nodes.length > 1) {
      const prevNode = trace.nodes[trace.nodes.length - 2];
      trace.edges.push({
        from: prevNode.id,
        to: node.id,
        animated: node.status === "BLOCKED" || node.status === "HEALED"
      });
    }
  }

  recordTranscript(traceId: string, role: string, content: string): void {
    const trace = this.traces.get(traceId);
    if (!trace) return;
    trace.rawTranscript.push({
      role,
      content,
      time: new Date().toLocaleTimeString()
    });
  }

  finalizeTrace(traceId: string, verdict: "SAFE" | "COMPROMISED" | "IMMUNIZED_BLOCKED", score: number): ExecutionTrace | undefined {
    const trace = this.traces.get(traceId);
    if (!trace) return;
    trace.securityVerdict = verdict;
    trace.vulnerabilityScore = score;
    return trace;
  }
}

export const globalTracer = new AgentTracer();
