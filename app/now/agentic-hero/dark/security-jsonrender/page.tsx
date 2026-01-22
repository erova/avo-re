"use client";

import React, { useState } from "react";
import { z } from "zod";

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

const catalogDefinition = {
  components: {
    IncidentHeader: { props: z.object({ title: z.string(), subtitle: z.string().optional() }), hasChildren: true },
    IncidentCard: { props: z.object({ incidentId: z.string(), title: z.string(), urgency: z.enum(["high", "medium", "low"]), detail: z.string(), progressCurrent: z.number(), progressTotal: z.number() }) },
    ActionPanel: { props: z.object({ title: z.string(), description: z.string() }), hasChildren: true },
    ActionButton: { props: z.object({ label: z.string(), variant: z.enum(["primary", "secondary", "ghost"]), actionId: z.string() }) },
    TimelineStep: { props: z.object({ status: z.enum(["done", "pending", "in_progress"]), title: z.string(), detail: z.string(), timestamp: z.string(), actorType: z.enum(["agent", "human"]) }) },
    Timeline: { props: z.object({ title: z.string() }), hasChildren: true },
    InfoBanner: { props: z.object({ variant: z.enum(["info", "warning", "success", "error"]), message: z.string() }) },
    MetricCard: { props: z.object({ label: z.string(), valuePath: z.string(), format: z.enum(["number", "percent", "currency", "duration"]) }) },
  },
  actions: {
    escalateToBoard: { params: z.object({ incidentId: z.string() }) },
    notifyRegulator: { params: z.object({ incidentId: z.string(), draftId: z.string() }) },
    assignOwner: { params: z.object({ incidentId: z.string(), ownerId: z.string() }) },
    viewReceipt: { params: z.object({ incidentId: z.string() }) },
  },
};

function IncidentCard({ incidentId, title, urgency, detail, progressCurrent, progressTotal }: { incidentId: string; title: string; urgency: "high" | "medium" | "low"; detail: string; progressCurrent: number; progressTotal: number }) {
  const urgencyStyles = {
    high: "bg-[#da3633]/20 border-[#da3633]/40 text-[#da3633]",
    medium: "bg-[#d29922]/20 border-[#d29922]/40 text-[#d29922]",
    low: "bg-[#8b949e]/20 border-[#8b949e]/40 text-[#8b949e]",
  };
  return (
    <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-[#f0f6fc]">Active incident</span>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${urgencyStyles[urgency]}`}>
          <span className="h-2 w-2 rounded-full bg-current" />
          {urgency.charAt(0).toUpperCase() + urgency.slice(1)} urgency
        </span>
      </div>
      <div className="mt-3 rounded-xl border border-[#30363d] bg-[#21262d] p-4">
        <div className="text-sm font-semibold text-[#f0f6fc]">{title}</div>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[#8b949e]">
          <span className="font-medium text-[#f0f6fc]">Agent progress: {progressCurrent} of {progressTotal} steps completed</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#30363d]">
              <div className="h-full rounded-full bg-[#3fb950] transition-all" style={{ width: `${(progressCurrent / progressTotal) * 100}%` }} />
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-[#8b949e]">{detail} <span className="text-[#6e7681]">Incident ID:</span> <span className="font-medium text-[#f0f6fc]">{incidentId}</span></p>
      </div>
    </div>
  );
}

function TimelineStep({ status, title, detail, timestamp, actorType }: { status: "done" | "pending" | "in_progress"; title: string; detail: string; timestamp: string; actorType: "agent" | "human" }) {
  const statusConfig = {
    done: { icon: "✓", bg: "bg-[#3fb950]/20", text: "text-[#3fb950]" },
    pending: { icon: "○", bg: "bg-[#8b949e]/20", text: "text-[#8b949e]" },
    in_progress: { icon: "◐", bg: "bg-[#58a6ff]/20", text: "text-[#58a6ff]" },
  };
  const config = statusConfig[status];
  return (
    <div className="flex gap-3 py-3">
      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${config.bg} ${config.text}`}>{config.icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#f0f6fc]">{title}</span>
          <span className="text-xs text-[#6e7681]">{timestamp}</span>
        </div>
        <p className="mt-0.5 text-sm text-[#8b949e]">{detail}</p>
        <span className={`mt-1.5 inline-block rounded px-2 py-0.5 text-xs ${actorType === "agent" ? "bg-[#a371f7]/20 text-[#a371f7]" : "bg-[#d29922]/20 text-[#d29922]"}`}>{actorType === "agent" ? "Agent" : "Human"}</span>
      </div>
    </div>
  );
}

const componentMap: Record<string, React.ComponentType<any>> = { IncidentCard, TimelineStep };

function renderJsonUI(node: any): React.ReactNode {
  if (!node || !node.type) return null;
  const Component = componentMap[node.type];
  if (!Component) return null;
  const children = node.children?.map((child: any, index: number) => <React.Fragment key={index}>{renderJsonUI(child)}</React.Fragment>);
  return <Component {...node.props}>{children}</Component>;
}

function JsonRenderChatInput({ showRawJson, setShowRawJson }: { showRawJson: boolean; setShowRawJson: (v: boolean) => void }) {
  const [localInput, setLocalInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; json?: any }>>([]);
  const [loading, setLoading] = useState(false);

  const getDemoResponse = (query: string): { content: string; json?: any } => {
    const q = query.toLowerCase();
    if (q.includes("status") || q.includes("incident") || q.includes("details")) {
      return { content: "Here's the incident rendered from JSON:", json: { type: "IncidentCard", props: { incidentId: "INC-2847", title: "SECURITY INCIDENT — CloudStorage Solutions", urgency: "high", detail: "Unusual access pattern detected across third-party integration.", progressCurrent: 5, progressTotal: 8 } } };
    }
    if (q.includes("timeline") || q.includes("steps")) {
      return { content: "Timeline rendered from JSON structure:", json: { type: "Timeline", props: { title: "Response Timeline" }, children: [{ type: "TimelineStep", props: { status: "done", title: "Created incident record", detail: "Logged INC-2847", timestamp: "09:14 ET", actorType: "agent" } }, { type: "TimelineStep", props: { status: "done", title: "Preserved evidence", detail: "Snapshot logs secured", timestamp: "09:33 ET", actorType: "agent" } }, { type: "TimelineStep", props: { status: "pending", title: "Board escalation", detail: "Awaiting approval", timestamp: "Pending", actorType: "human" } }] } };
    }
    return { content: `Try asking about:\n• "What's the incident status?"\n• "Show me the timeline"` };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = localInput.trim();
    if (!messageText || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setLocalInput("");
    setLoading(true);
    setTimeout(() => {
      const response = getDemoResponse(messageText);
      setMessages((prev) => [...prev, { role: "assistant", content: response.content, json: response.json }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-[#6e7681]">Ask the Diligent Agent</div>
        <button onClick={() => setShowRawJson(!showRawJson)} className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium transition ${showRawJson ? "bg-[#3fb950]/20 text-[#3fb950] hover:bg-[#3fb950]/30" : "bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]"}`}>
          <span className={`h-2 w-2 rounded-full ${showRawJson ? "bg-[#3fb950]" : "bg-[#6e7681]"}`} />
          {showRawJson ? "JSON On" : "JSON Off"}
        </button>
      </div>
      {messages.length > 0 && (
        <div className="mt-3 max-h-[50vh] overflow-y-auto space-y-3 border-b border-[#30363d] pb-3 mb-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`rounded-lg p-3 text-sm ${msg.role === "user" ? "bg-[#21262d] text-[#f0f6fc] ml-8" : "bg-[#3fb950]/10 text-[#3fb950] mr-8"}`}>
              <div className="text-xs font-medium mb-1 opacity-60">{msg.role === "user" ? "You" : "Diligent Agent"}</div>
              <div className="whitespace-pre-wrap text-[#8b949e]">{msg.content}</div>
              {msg.json && (
                <div className="mt-3">
                  {showRawJson && <pre className="mb-2 rounded bg-[#0d1117] p-2 text-xs text-[#8b949e] overflow-auto max-h-32">{JSON.stringify(msg.json, null, 2)}</pre>}
                  {renderJsonUI(msg.json)}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="rounded-lg bg-[#3fb950]/10 p-3 text-sm text-[#3fb950] mr-8"><div className="text-xs font-medium mb-1 opacity-60">Diligent Agent</div><span className="animate-pulse">Generating JSON...</span></div>}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input type="text" value={localInput} onChange={(e) => setLocalInput(e.target.value)} placeholder="Try: What's the incident status?" className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]" disabled={loading} />
        <button type="submit" disabled={loading || !localInput.trim()} className="rounded-lg bg-[#58a6ff] px-4 py-2 text-sm font-medium text-[#0d1117] hover:bg-[#79b8ff] disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "..." : "Send"}</button>
      </form>
      <p className="mt-2 text-xs text-[#6e7681]">{showRawJson ? "Showing JSON source alongside rendered components." : "Toggle JSON to see the underlying structure."}</p>
    </div>
  );
}

function ActionCardWithClick({ title, description, actionLabel, hint, onClick }: { title: string; description: string; actionLabel: string; hint?: string; onClick?: () => void }) {
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

export default function SecurityJsonRenderPage() {
  const [showRawJson, setShowRawJson] = useState(false);
  const [showBoardEscalation, setShowBoardEscalation] = useState(false);
  const [showNotifyRegulator, setShowNotifyRegulator] = useState(false);
  const [showAssignOwner, setShowAssignOwner] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState("Priya Shah (Security)");

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
            <a href="/now/agentic-hero/dark/security-tambo" className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/20 px-3 py-1 text-xs font-medium text-[#a371f7] hover:bg-[#a371f7]/30">Tambo</a>
            <a href="/now/agentic-hero/dark/security-jsonrender" className="rounded-full border border-[#3fb950]/40 bg-[#3fb950]/20 px-3 py-1 text-xs font-semibold text-[#3fb950]">JSON Render</a>
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
                <div className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-sm text-[#8b949e]">
                  <svg className="h-4 w-4 text-[#6e7681]" viewBox="0 0 24 24" fill="none"><path d="M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.5"/></svg>
                  <span className="font-medium">Ibotta, Inc.</span>
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
                      <span className="text-sm font-semibold text-[#3fb950]">JSON Render UI</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#3fb950]/20 px-2 py-0.5 text-xs text-[#3fb950]">✓ Catalog Active</span>
                    </div>
                  </div>
                  <JsonRenderChatInput showRawJson={showRawJson} setShowRawJson={setShowRawJson} />
                  <details className="mt-4 rounded-xl border border-[#30363d] bg-[#21262d] p-3">
                    <summary className="cursor-pointer text-xs font-medium text-[#8b949e]">{Object.keys(catalogDefinition.components).length} components in catalog</summary>
                    <div className="mt-3 space-y-2">
                      {Object.keys(catalogDefinition.components).map((name) => (
                        <div key={name} className="rounded-lg border border-[#30363d] bg-[#161b22] p-2"><span className="font-mono text-xs text-[#f0f6fc]">{name}</span></div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <IncidentCard incidentId="INC-2847" title="SECURITY INCIDENT DETECTED — AUTO-RESPONSE ACTIVATED" urgency="high" detail="ServiceNow incident logged by CloudStorage Solutions (3rd party provider). Unusual access pattern detected." progressCurrent={5} progressTotal={8} />
                <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#f0f6fc]">Decisions Needed</h2>
                  <p className="mt-1 text-sm text-[#8b949e]">These actions require your approval before proceeding.</p>
                  <div className="mt-4 space-y-3">
                    <ActionCardWithClick title="Escalate to Board" description="Prepare a Board-ready summary and recommended next steps." actionLabel="Prepare Board Escalation" hint="GC will be included by default" onClick={() => setShowBoardEscalation(true)} />
                    <ActionCardWithClick title="Notify Regulator" description="Prepare a draft regulatory notification based on current findings." actionLabel="Review Draft Notice" hint="Nothing submitted without approval" onClick={() => setShowNotifyRegulator(true)} />
                    <ActionCardWithClick title="Assign Incident Owner" description="Designate a primary owner responsible for coordination and follow-up." actionLabel="Assign Owner" hint="Suggested owners included" onClick={() => setShowAssignOwner(true)} />
                  </div>
                </div>
                <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#f0f6fc]">Response Timeline</h2>
                  <p className="mt-1 text-sm text-[#8b949e]">Steps completed by the agent and pending human decisions.</p>
                  <div className="mt-4 divide-y divide-[#30363d]">
                    <TimelineStep status="done" title="Created incident record" detail="Logged INC-2847 and associated it to CloudStorage Solutions." timestamp="09:14 ET" actorType="agent" />
                    <TimelineStep status="done" title="Identified affected subsidiaries" detail="Mapped impacted entities and likely jurisdictions." timestamp="09:22 ET" actorType="agent" />
                    <TimelineStep status="done" title="Preserved evidence" detail="Snapshot logs, preserved audit trail, restricted access." timestamp="09:33 ET" actorType="agent" />
                    <TimelineStep status="pending" title="Prepare Board escalation" detail="Requires your review; GC included by default." timestamp="Pending" actorType="human" />
                  </div>
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
