"use client";

import React, { useState } from "react";
import { z } from "zod";
import { TamboProvider, useTamboThread, useTamboThreadInput } from "@tambo-ai/react";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function DiligentLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 222 222" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
        <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
        <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
      </g>
    </svg>
  );
}

const incidentCardSchema = z.object({ id: z.string().optional().default("INC-0000"), title: z.string().optional().default("Incident"), urgency: z.string().optional().default("medium"), detail: z.string().optional().default(""), timeAgo: z.string().optional().default(""), completedSteps: z.number().optional().default(0), totalSteps: z.number().optional().default(1) });
const actionCardSchema = z.object({ id: z.string().optional().default("action-0"), title: z.string().optional().default("Action"), description: z.string().optional().default(""), actionLabel: z.string().optional().default("Take Action"), hint: z.string().optional() });
const receiptStepSchema = z.object({ id: z.string().optional().default("step-0"), status: z.string().optional().default("pending"), title: z.string().optional().default("Step"), detail: z.string().optional().default(""), time: z.string().optional().default(""), actor: z.string().optional().default("Agent") });

function IncidentCard({ id, title, urgency, detail, timeAgo, completedSteps, totalSteps }: z.infer<typeof incidentCardSchema>) {
  const urgencyColors: Record<string, string> = {
    high: "bg-[#da3633]/20 text-[#da3633] border-[#da3633]/40",
    medium: "bg-[#d29922]/20 text-[#d29922] border-[#d29922]/40",
    low: "bg-[#8b949e]/20 text-[#8b949e] border-[#8b949e]/40",
  };
  const normalizedUrgency = (urgency?.toLowerCase() || "medium");
  const urgencyKey = ["high", "medium", "low"].includes(normalizedUrgency) ? normalizedUrgency : "medium";
  const displayUrgency = urgency || "Medium";
  return (
    <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-[#f0f6fc]">{id}: {title}</span>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${urgencyColors[urgencyKey]}`}>
          <span className="inline-block h-2 w-2 rounded-full bg-current" />
          {displayUrgency.charAt(0).toUpperCase() + displayUrgency.slice(1)} urgency
        </span>
      </div>
      <p className="mt-2 text-sm text-[#8b949e]">{detail}</p>
      <div className="mt-4 flex items-center gap-3 text-xs text-[#6e7681]">
        <span>Progress: {completedSteps} of {totalSteps} steps</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#30363d]">
          <div className="h-full rounded-full bg-[#3fb950] transition-all" style={{ width: `${(completedSteps / (totalSteps || 1)) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, actionLabel, hint, onClick }: z.infer<typeof actionCardSchema> & { onClick?: () => void }) {
  return (
    <div className="rounded-lg border border-[#30363d] bg-[#21262d] p-4">
      <div className="text-sm font-medium text-[#f0f6fc]">{title}</div>
      <p className="mt-1 text-sm text-[#8b949e]">{description}</p>
      <div className="mt-3 flex items-center gap-2">
        <button onClick={onClick} className="rounded-md bg-[#58a6ff] px-3 py-1.5 text-sm font-medium text-[#0d1117] hover:bg-[#79b8ff]">{actionLabel}</button>
        {hint && <span className="text-xs text-[#6e7681]">{hint}</span>}
      </div>
    </div>
  );
}

function ReceiptStep({ status, title, detail, time, actor }: z.infer<typeof receiptStepSchema>) {
  const statusIcons: Record<string, string> = { done: "✓", completed: "✓", pending: "○", in_progress: "◐", active: "◐" };
  const normalizedStatus = status?.toLowerCase().replace(/[_-]/g, "_") || "pending";
  const statusIcon = statusIcons[normalizedStatus] || statusIcons[status] || "○";
  const isDone = ["done", "completed"].includes(normalizedStatus);
  const isInProgress = ["in_progress", "active"].includes(normalizedStatus);
  return (
    <div className="flex gap-3 py-2">
      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${isDone ? "bg-[#3fb950]/20 text-[#3fb950]" : isInProgress ? "bg-[#58a6ff]/20 text-[#58a6ff]" : "bg-[#8b949e]/20 text-[#8b949e]"}`}>{statusIcon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#f0f6fc]">{title}</span>
          <span className="text-xs text-[#6e7681]">{time}</span>
        </div>
        <p className="mt-0.5 text-xs text-[#8b949e]">{detail}</p>
        <span className="mt-1 inline-block rounded bg-[#21262d] px-1.5 py-0.5 text-[10px] text-[#8b949e]">{actor}</span>
      </div>
    </div>
  );
}

const tamboComponents = [
  { name: "IncidentCard", description: "Displays a security incident with ID, title, urgency level, details, and progress.", component: IncidentCard, propsSchema: incidentCardSchema },
  { name: "ActionCard", description: "Shows a decision card with title, description, and action button.", component: ActionCard, propsSchema: actionCardSchema },
  { name: "ReceiptStep", description: "Shows a single step with status icon, title, detail, timestamp, and actor.", component: ReceiptStep, propsSchema: receiptStepSchema },
];

function TamboChatInputWithHooks() {
  const [localInput, setLocalInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; component?: React.ReactNode }>>([]);
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const tamboThread = useTamboThread();

  const getDemoResponse = (query: string): { content: string; component?: React.ReactNode } => {
    const q = query.toLowerCase();
    if (q.includes("status") || q.includes("incident") || q.includes("details")) {
      return { content: "Here's the current incident status:", component: <IncidentCard id="INC-2847" title="Security Incident — CloudStorage Solutions" urgency="high" detail="Unusual access pattern detected across third-party integration." timeAgo="3 hours ago" completedSteps={5} totalSteps={8} /> };
    }
    if (q.includes("decision") || q.includes("approval") || q.includes("action") || q.includes("need")) {
      return { content: "Here are the pending decisions:", component: <div className="space-y-3 mt-2"><ActionCard id="action-1" title="Escalate to Board" description="Prepare a Board-ready summary with recommended next steps." actionLabel="Prepare Escalation" hint="GC will be included" /><ActionCard id="action-2" title="Notify Regulator" description="Draft regulatory notification based on current findings." actionLabel="Review Draft" hint="Nothing sent without approval" /></div> };
    }
    if (q.includes("timeline") || q.includes("steps") || q.includes("done") || q.includes("completed")) {
      return { content: "Here's the response timeline so far:", component: <div className="divide-y divide-[#30363d] rounded-lg border border-[#30363d] bg-[#161b22] p-3 mt-2"><ReceiptStep id="step-1" status="done" title="Created incident record" detail="Logged INC-2847 and linked to CloudStorage Solutions." time="09:14 ET" actor="Agent" /><ReceiptStep id="step-2" status="done" title="Preserved evidence" detail="Snapshot logs, audit trail secured." time="09:33 ET" actor="Agent" /><ReceiptStep id="step-3" status="pending" title="Board escalation" detail="Awaiting your approval." time="Pending" actor="Human" /></div> };
    }
    return { content: `Try asking about:\n• "What's the incident status?"\n• "What decisions need approval?"\n• "Show me the timeline"` };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = localInput.trim();
    if (!messageText || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setLocalInput("");
    setLoading(true);
    if (demoMode) {
      setTimeout(() => { const response = getDemoResponse(messageText); setMessages((prev) => [...prev, { role: "assistant", content: response.content, component: response.component }]); setLoading(false); }, 800);
    } else {
      try {
        const response = await tamboThread.sendThreadMessage(messageText);
        const content = (response as any)?.content;
        let textContent = typeof content === "string" ? content : "";
        setMessages((prev) => [...prev, { role: "assistant", content: textContent || "Tambo responded." }]);
        setLoading(false);
      } catch (err) {
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Unknown error"}. Try demo mode.` }]);
        setLoading(false);
      }
    }
  };

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-[#6e7681]">Ask the Diligent Agent</div>
        <div className="inline-flex rounded-full border border-[#30363d] bg-[#21262d] p-0.5">
          <button onClick={() => setDemoMode(true)} className={`rounded-full px-3 py-1 text-xs font-medium transition ${demoMode ? "bg-[#161b22] text-[#f0f6fc] shadow-sm" : "text-[#6e7681] hover:text-[#8b949e]"}`}>Demo</button>
          <button onClick={() => setDemoMode(false)} className={`rounded-full px-3 py-1 text-xs font-medium transition ${!demoMode ? "bg-[#161b22] text-[#f0f6fc] shadow-sm" : "text-[#6e7681] hover:text-[#8b949e]"}`}>Live</button>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="mt-3 max-h-[50vh] overflow-y-auto space-y-3 border-b border-[#30363d] pb-3 mb-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`rounded-lg p-3 text-sm ${msg.role === "user" ? "bg-[#21262d] text-[#f0f6fc] ml-8" : "bg-[#58a6ff]/10 text-[#58a6ff] mr-8"}`}>
              <div className="text-xs font-medium mb-1 opacity-60">{msg.role === "user" ? "You" : "Diligent Agent"}</div>
              <div className="whitespace-pre-wrap text-[#8b949e]">{msg.content}</div>
              {msg.component && <div className="mt-3">{msg.component}</div>}
            </div>
          ))}
          {loading && <div className="rounded-lg bg-[#58a6ff]/10 p-3 text-sm text-[#58a6ff] mr-8"><div className="text-xs font-medium mb-1 opacity-60">Diligent Agent</div><span className="animate-pulse">Thinking...</span></div>}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input type="text" value={localInput} onChange={(e) => setLocalInput(e.target.value)} placeholder="Try: What's the incident status?" className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]" disabled={loading} />
        <button type="submit" disabled={loading || !localInput.trim()} className="rounded-lg bg-[#58a6ff] px-4 py-2 text-sm font-medium text-[#0d1117] hover:bg-[#79b8ff] disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "..." : "Send"}</button>
      </form>
      <p className="mt-2 text-xs text-[#6e7681]">{demoMode ? "Demo mode: simulated responses with dynamic components." : "Live mode: responses from Tambo AI."}</p>
    </div>
  );
}

function TamboChatInputDemoOnly() {
  const [localInput, setLocalInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; component?: React.ReactNode }>>([]);
  const [loading, setLoading] = useState(false);

  const getDemoResponse = (query: string): { content: string; component?: React.ReactNode } => {
    const q = query.toLowerCase();
    if (q.includes("status") || q.includes("incident")) return { content: "Here's the current incident status:", component: <IncidentCard id="INC-2847" title="Security Incident — CloudStorage Solutions" urgency="high" detail="Unusual access pattern detected." timeAgo="3 hours ago" completedSteps={5} totalSteps={8} /> };
    if (q.includes("decision") || q.includes("action")) return { content: "Here are the pending decisions:", component: <div className="space-y-3 mt-2"><ActionCard id="action-1" title="Escalate to Board" description="Prepare a Board-ready summary." actionLabel="Prepare Escalation" hint="GC will be included" /></div> };
    if (q.includes("timeline") || q.includes("steps")) return { content: "Here's the response timeline:", component: <div className="divide-y divide-[#30363d] rounded-lg border border-[#30363d] bg-[#161b22] p-3 mt-2"><ReceiptStep id="step-1" status="done" title="Created incident record" detail="Logged INC-2847" time="09:14 ET" actor="Agent" /></div> };
    return { content: `Try asking about: "What's the incident status?", "What decisions need approval?", or "Show me the timeline"` };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = localInput.trim();
    if (!messageText || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setLocalInput("");
    setLoading(true);
    setTimeout(() => { const response = getDemoResponse(messageText); setMessages((prev) => [...prev, { role: "assistant", content: response.content, component: response.component }]); setLoading(false); }, 800);
  };

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-[#6e7681]">Ask the Diligent Agent</div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#d29922]/20 px-2.5 py-1 text-xs font-medium text-[#d29922]"><span className="h-2 w-2 rounded-full bg-[#d29922]" />Demo Only</span>
      </div>
      {messages.length > 0 && (
        <div className="mt-3 max-h-[50vh] overflow-y-auto space-y-3 border-b border-[#30363d] pb-3 mb-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`rounded-lg p-3 text-sm ${msg.role === "user" ? "bg-[#21262d] text-[#f0f6fc] ml-8" : "bg-[#58a6ff]/10 text-[#58a6ff] mr-8"}`}>
              <div className="text-xs font-medium mb-1 opacity-60">{msg.role === "user" ? "You" : "Diligent Agent"}</div>
              <div className="whitespace-pre-wrap text-[#8b949e]">{msg.content}</div>
              {msg.component && <div className="mt-3">{msg.component}</div>}
            </div>
          ))}
          {loading && <div className="rounded-lg bg-[#58a6ff]/10 p-3 text-sm text-[#58a6ff] mr-8"><div className="text-xs font-medium mb-1 opacity-60">Diligent Agent</div><span className="animate-pulse">Thinking...</span></div>}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input type="text" value={localInput} onChange={(e) => setLocalInput(e.target.value)} placeholder="Try: What's the incident status?" className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]" disabled={loading} />
        <button type="submit" disabled={loading || !localInput.trim()} className="rounded-lg bg-[#58a6ff] px-4 py-2 text-sm font-medium text-[#0d1117] hover:bg-[#79b8ff] disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "..." : "Send"}</button>
      </form>
      <p className="mt-2 text-xs text-[#6e7681]">Demo mode: simulated responses. Configure NEXT_PUBLIC_TAMBO_API_KEY for live mode.</p>
    </div>
  );
}

function TamboChatInput({ hasTamboProvider }: { hasTamboProvider: boolean }) {
  if (!hasTamboProvider) return <TamboChatInputDemoOnly />;
  return <TamboChatInputWithHooks />;
}

function SecurityTamboContent({ hasTamboProvider = true }: { hasTamboProvider?: boolean }) {
  const [showBoardEscalation, setShowBoardEscalation] = useState(false);
  const [showNotifyRegulator, setShowNotifyRegulator] = useState(false);
  const [showAssignOwner, setShowAssignOwner] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState("Priya Shah (Security)");

  const sampleIncident = { id: "INC-2847", title: "Security Incident Detected", urgency: "high" as const, detail: "ServiceNow incident logged by CloudStorage Solutions (3rd party provider). Unusual access pattern detected.", timeAgo: "3 hours ago", completedSteps: 5, totalSteps: 8 };
  const sampleSteps = [
    { id: "step-1", status: "done" as const, title: "Created incident record", detail: "Logged INC-2847 and associated it to CloudStorage Solutions.", time: "09:14 ET", actor: "Agent" as const },
    { id: "step-2", status: "done" as const, title: "Identified affected subsidiaries", detail: "Mapped impacted entities and likely jurisdictions.", time: "09:22 ET", actor: "Agent" as const },
    { id: "step-3", status: "done" as const, title: "Preserved evidence", detail: "Snapshot logs, preserved audit trail, restricted access.", time: "09:33 ET", actor: "Agent" as const },
    { id: "step-4", status: "pending" as const, title: "Prepare Board escalation", detail: "Requires your review; GC included by default.", time: "Pending", actor: "Human" as const },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] pb-8">
      <div className="w-full border-b border-[#30363d] bg-[#0d1117]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Prototype</span>
            <span className="text-sm font-semibold text-[#f0f6fc]">Agentic Hero</span>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <a href="/now/agentic-hero/dark/security" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Security Incident</a>
            <a href="/now/agentic-hero/dark/security-tambo" className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/20 px-3 py-1 text-xs font-semibold text-[#a371f7]">Tambo</a>
            <a href="/now/agentic-hero/dark/security-jsonrender" className="rounded-full border border-[#3fb950]/40 bg-[#3fb950]/20 px-3 py-1 text-xs font-medium text-[#3fb950] hover:bg-[#3fb950]/30">JSON Render</a>
            <span className="text-[#30363d]">|</span>
            <a href="/now/agentic-hero/dark/whistleblower" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Whistleblower</a>
            <a href="/now/agentic-hero/dark/compliance" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Compliance</a>
            <a href="/now/agentic-hero/dark" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Steady State</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-6xl px-6">
        <div className="overflow-hidden rounded-3xl border border-[#30363d] bg-[#161b22] shadow-sm relative">
          <div className="border-b border-[#30363d] bg-[#0d1117]">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <DiligentLogo className="h-7 w-auto" />
                  <span className="text-sm font-semibold text-[#f0f6fc]">GRC Command Center</span>
                </div>
                </div>
              <div className="flex items-center gap-2 text-[#8b949e]">
                <div className="relative">
                  <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#da3633] ring-2 ring-[#0d1117]" />
                  <button className="rounded-full border border-[#30363d] bg-[#161b22] p-2 hover:bg-[#21262d] hover:text-[#f0f6fc]"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z" stroke="currentColor" strokeWidth="1.5"/><path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg></button>
                </div>
                <button className="rounded-full border border-[#30363d] bg-[#161b22] p-2 hover:bg-[#21262d] hover:text-[#f0f6fc]"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor"/></svg></button>
                <div className="ml-1 h-8 w-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#3fb950]" />
              </div>
            </div>
          </div>

          <div className="px-6 pt-8 pb-2 text-center">
            <h1 className="text-2xl font-semibold text-[#f0f6fc]">You have an active Security Review, Sarah.</h1>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-6">
                  <div className="rounded-xl border border-[#3fb950]/40 bg-[#3fb950]/10 p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#3fb950]">Tambo Generative UI</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#3fb950]/20 px-2 py-0.5 text-xs text-[#3fb950]">✓ Connected</span>
                    </div>
                  </div>
                  <TamboChatInput hasTamboProvider={hasTamboProvider} />
                  <details className="mt-4 rounded-xl border border-[#30363d] bg-[#21262d] p-3">
                    <summary className="cursor-pointer text-xs font-medium text-[#8b949e]">{tamboComponents.length} registered components</summary>
                    <div className="mt-3 space-y-2">
                      {tamboComponents.map((comp) => (
                        <div key={comp.name} className="rounded-lg border border-[#30363d] bg-[#161b22] p-2">
                          <div className="font-mono text-xs text-[#f0f6fc]">{comp.name}</div>
                          <p className="mt-0.5 text-[11px] text-[#6e7681]">{comp.description}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <IncidentCard {...sampleIncident} />
                <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#f0f6fc]">Decisions Needed</h2>
                  <p className="mt-1 text-sm text-[#8b949e]">These actions require your approval before proceeding.</p>
                  <div className="mt-4 space-y-3">
                    <ActionCard id="action-1" title="Escalate to Board" description="Prepare a Board-ready summary and recommended next steps." actionLabel="Prepare Board Escalation" hint="GC will be included by default" onClick={() => setShowBoardEscalation(true)} />
                    <ActionCard id="action-2" title="Notify Regulator" description="Prepare a draft regulatory notification based on current findings." actionLabel="Review Draft Notice" hint="Nothing submitted without approval" onClick={() => setShowNotifyRegulator(true)} />
                    <ActionCard id="action-3" title="Assign Incident Owner" description="Designate a primary owner responsible for coordination and follow-up." actionLabel="Assign Owner" hint="Suggested owners included" onClick={() => setShowAssignOwner(true)} />
                  </div>
                </div>
                <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#f0f6fc]">Response Timeline</h2>
                  <p className="mt-1 text-sm text-[#8b949e]">Steps completed by the agent and pending human decisions.</p>
                  <div className="mt-4 divide-y divide-[#30363d]">{sampleSteps.map((step) => <ReceiptStep key={step.id} {...step} />)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBoardEscalation && <FullPageModal title="Board Escalation" subtitle="Security Incident — INC-2847" onClose={() => setShowBoardEscalation(false)}>
        <section><h2 className="text-sm font-semibold text-[#f0f6fc]">What the Board needs to know</h2><p className="mt-2 text-sm text-[#8b949e]">This escalation summarizes the incident, potential impact, and immediate actions taken.</p></section>
        <section><h3 className="text-sm font-semibold text-[#f0f6fc]">Draft Board Message</h3><div className="mt-3 rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-sm text-[#8b949e] space-y-2"><p><strong className="text-[#f0f6fc]">Summary:</strong> A security incident involving a third‑party data processor was detected and contained.</p><p><strong className="text-[#f0f6fc]">Status:</strong> Investigation ongoing. No confirmed data exfiltration at this time.</p><p><strong className="text-[#f0f6fc]">Actions taken:</strong> Incident logged, evidence preserved, Legal and Security engaged.</p><p><strong className="text-[#f0f6fc]">Next steps:</strong> Continued monitoring, regulator assessment, follow‑up briefing.</p></div></section>
        <ModalFooter onCancel={() => setShowBoardEscalation(false)} actionLabel="Approve & Send" />
      </FullPageModal>}

      {showNotifyRegulator && <FullPageModal title="Regulatory Notification" subtitle="Draft Notice — INC-2847" onClose={() => setShowNotifyRegulator(false)}>
        <section><h2 className="text-sm font-semibold text-[#f0f6fc]">Draft (review required)</h2><p className="mt-2 text-sm text-[#8b949e]">This draft is based on current findings. General Counsel review is recommended.</p></section>
        <section><h3 className="text-sm font-semibold text-[#f0f6fc]">Draft Notice</h3><div className="mt-3 rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-sm text-[#8b949e] space-y-2"><p><strong className="text-[#f0f6fc]">Incident reference:</strong> INC-2847</p><p><strong className="text-[#f0f6fc]">Summary:</strong> A security incident involving a third‑party data processor was detected. Investigation is ongoing.</p><p><strong className="text-[#f0f6fc]">Potential impact:</strong> No confirmed data exfiltration at this time.</p><p><strong className="text-[#f0f6fc]">Next update:</strong> We will provide a follow‑up update within 72 hours.</p></div></section>
        <ModalFooter onCancel={() => setShowNotifyRegulator(false)} actionLabel="Approve & Submit" />
      </FullPageModal>}

      {showAssignOwner && <FullPageModal title="Assign Incident Owner" subtitle="Primary owner — INC-2847" onClose={() => setShowAssignOwner(false)}>
        <section><h2 className="text-sm font-semibold text-[#f0f6fc]">Suggested owners</h2><p className="mt-2 text-sm text-[#8b949e]">The agent suggests owners based on role, availability, and prior incidents.</p></section>
        <section className="space-y-3">
          {["Priya Shah (Security)", "Danielle Kim (Legal)", "Marcus Reed (IT Operations)"].map((name) => (
            <button key={name} onClick={() => setSelectedOwner(name)} className={cn("w-full rounded-xl border p-4 text-left transition", selectedOwner === name ? "border-[#58a6ff] bg-[#21262d]" : "border-[#30363d] bg-[#161b22] hover:bg-[#21262d]")}>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-[#f0f6fc]">{name}</div>
                <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-full border", selectedOwner === name ? "border-[#58a6ff]" : "border-[#6e7681]")}>{selectedOwner === name && <span className="h-2.5 w-2.5 rounded-full bg-[#58a6ff]" />}</span>
              </div>
              <div className="mt-1 text-sm text-[#8b949e]">Primary coordinator for follow-ups and stakeholder updates.</div>
            </button>
          ))}
        </section>
        <ModalFooter onCancel={() => setShowAssignOwner(false)} actionLabel={`Assign ${selectedOwner.split(" ")[0]}`} />
      </FullPageModal>}
    </div>
  );
}

export default function SecurityTamboPage() {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  if (!apiKey) return <SecurityTamboContent hasTamboProvider={false} />;
  return <TamboProvider apiKey={apiKey} components={tamboComponents}><SecurityTamboContent hasTamboProvider={true} /></TamboProvider>;
}

function FullPageModal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0d1117] overflow-y-auto">
      <div className="border-b border-[#30363d] px-6 py-4">
        <div className="flex items-center justify-between max-w-[900px] mx-auto">
          <div><div className="text-xs uppercase tracking-wide text-[#6e7681]">{title}</div><div className="text-lg font-semibold text-[#f0f6fc]">{subtitle}</div></div>
          <button onClick={onClose} className="rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">Exit</button>
        </div>
      </div>
      <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">{children}</div>
    </div>
  );
}

function ModalFooter({ onCancel, actionLabel }: { onCancel: () => void; actionLabel: string }) {
  return (
    <section className="flex items-center justify-between border-t border-[#30363d] pt-6">
      <div className="text-xs text-[#6e7681]">Nothing will be sent without your approval.</div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="rounded-md border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">Cancel</button>
        <button className="rounded-md bg-[#58a6ff] px-4 py-2 text-sm font-medium text-[#0d1117] hover:bg-[#79b8ff]">{actionLabel}</button>
      </div>
    </section>
  );
}
