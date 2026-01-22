"use client";

import React, { useMemo, useState } from "react";
import { ReceiptComponent, ReceiptModel } from "@/components/now/agentic-hero/ReceiptComponent";

type HeroPhase = "start" | "incident_detected" | "governance_in_progress" | "needs_review" | "completed" | "board_escalation";

type Signal = {
  id: string;
  urgency: "high" | "medium" | "low";
  title: string;
  detail: string;
  timeAgo: string;
  incidentId?: string;
};

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

function PrototypeNav() {
  return (
    <div className="w-full border-b border-[#30363d] bg-[#0d1117]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Prototype</span>
          <span className="text-sm font-semibold text-[#f0f6fc]">Agentic Hero</span>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          <a href="/now/agentic-hero/dark/security?context=diligent" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Security Incident</a>
          <a href="/now/agentic-hero/dark/security-jsonrender" className="rounded-full border border-[#3fb950]/40 bg-[#3fb950]/10 px-3 py-1 text-xs font-medium text-[#3fb950] hover:bg-[#3fb950]/20">JSON Render</a>
          <a href="/now/agentic-hero/dark/security-tambo" className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-3 py-1 text-xs font-medium text-[#a371f7] hover:bg-[#a371f7]/20">Tambo</a>
          <span className="text-[#30363d]">|</span>
          <a href="/now/agentic-hero/dark/whistleblower?context=diligent" className="rounded-full border border-[#58a6ff] bg-[#161b22] px-3 py-1 text-xs font-semibold text-[#58a6ff] hover:bg-[#21262d]">Whistleblower</a>
          <a href="/now/agentic-hero/dark/compliance?context=diligent" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Global Compliance</a>
          <a href="/now/agentic-hero/dark?context=diligent" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Steady State</a>
        </nav>
      </div>
    </div>
  );
}

function Icon({ name, className }: { name: string; className?: string }) {
  const common = cn("inline-block", className);
  switch (name) {
    case "grid": return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.5"/></svg>;
    case "shield": return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 3 20 7v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4Z" stroke="currentColor" strokeWidth="1.5"/></svg>;
    case "paperclip": return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M8 12.5 14.8 5.7a3 3 0 1 1 4.2 4.2l-8.2 8.2a5 5 0 0 1-7.1-7.1l8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "mic": return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 11a5 5 0 0 0 10 0M12 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "send": return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M20 4 10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M20 4 13 20l-3-7-7-3 17-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
    case "spark": return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 2l1.2 5.3L18 9l-4.8 1.7L12 16l-1.2-5.3L6 9l4.8-1.7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M19 13l.6 2.5L22 16l-2.4.5L19 19l-.6-2.5L16 16l2.4-.5L19 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
    case "bell": return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z" stroke="currentColor" strokeWidth="1.5"/><path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
    case "dots": return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M12 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor"/></svg>;
    case "search": return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="1.5"/><path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "building": return <svg className={common} viewBox="0 0 24 24" fill="none"><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M9 7h2M9 11h2M9 15h2M6 21h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 9h3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    default: return null;
  }
}

function UrgencyBadge({ level }: { level: Signal["urgency"] }) {
  const config = {
    high: { text: "High urgency", bg: "bg-[#da3633]/20", border: "border-[#da3633]/40", dot: "bg-[#da3633]", textColor: "text-[#da3633]" },
    medium: { text: "Medium", bg: "bg-[#d29922]/20", border: "border-[#d29922]/40", dot: "bg-[#d29922]", textColor: "text-[#d29922]" },
    low: { text: "Low", bg: "bg-[#8b949e]/20", border: "border-[#8b949e]/40", dot: "bg-[#8b949e]", textColor: "text-[#8b949e]" },
  };
  const c = config[level];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs", c.bg, c.border, c.textColor)}>
      <span className={cn("inline-block h-2 w-2 rounded-full", c.dot)} />
      {c.text}
    </span>
  );
}

function RightDrawer({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <div className={cn("absolute inset-0 z-40 bg-black/50 transition-opacity", open ? "opacity-100" : "pointer-events-none opacity-0")} onClick={onClose} />
      <aside className={cn("absolute right-0 top-0 z-50 h-full w-[420px] max-w-[92vw] border-l border-[#30363d] bg-[#161b22] shadow-xl transition-transform flex flex-col", open ? "translate-x-0" : "translate-x-full")} aria-hidden={!open}>
        <div className="flex items-center justify-between border-b border-[#30363d] px-4 py-3">
          <div className="min-w-0">
            <div className="text-xs text-[#6e7681]">Report review</div>
            <div className="truncate text-sm font-semibold text-[#f0f6fc]">{title}</div>
          </div>
          <button onClick={onClose} className="rounded-md border border-[#30363d] bg-[#161b22] px-2 py-1 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        <div className="border-t border-[#30363d] p-3 bg-[#0d1117]">
          <PromptComposer placeholder="Ask a follow-up about WB-1042..." contextLabel="WB-1042" dock="rail" />
        </div>
      </aside>
    </>
  );
}

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showBoardEscalation, setShowBoardEscalation] = useState(false);
  const [showNotifyRegulator, setShowNotifyRegulator] = useState(false);
  const [showCommsPackage, setShowCommsPackage] = useState(false);
  const [showAssignOwner, setShowAssignOwner] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<string>("Morgan Lee (Investigations)");
  const [incidentUiMode, setIncidentUiMode] = useState<"rail" | "inline">("rail");
  const [inlineOpen, setInlineOpen] = useState(false);
  const [showIncidentReceipt, setShowIncidentReceipt] = useState(false);

  const signals: Signal[] = useMemo(() => [{
    id: "sig-1", urgency: "high",
    title: "WHISTLEBLOWER REPORT RECEIVED — AUTO-TRIAGE ACTIVATED",
    detail: "Anonymous report received via Vault/SpeakUp alleging retaliation related to a recent HR decision.",
    timeAgo: "14 minutes ago", incidentId: "WB-1042",
  }], []);

  const receiptSteps = useMemo(() => [
    { status: "done" as const, title: "Ingested report from Vault/SpeakUp", detail: "Created case WB-1042 and preserved reporter anonymity.", time: "10:18 ET" },
    { status: "done" as const, title: "Categorized + routed to stakeholders", detail: "HR / retaliation; routed to Legal and Corporate Secretary.", time: "10:22 ET" },
    { status: "done" as const, title: "Validated against current policy", detail: "Matched against Code of Conduct and Anti-Retaliation.", time: "10:28 ET" },
    { status: "done" as const, title: "Determined investigation threshold", detail: "Meets criteria for formal review; no determination made.", time: "10:32 ET" },
    { status: "done" as const, title: "Prepared fact-gathering plan", detail: "Interview plan drafted; Note-Taker enabled.", time: "10:36 ET" },
    { status: "pending" as const, title: "Assign investigator", detail: "Awaiting assignment approval and conflict check.", time: "Pending" },
    { status: "pending" as const, title: "Request additional information", detail: "Draft questions ready for review before outreach.", time: "Pending" },
    { status: "pending" as const, title: "Check Board oversight + conflicts", detail: "Verify oversight requirements and conflicts of interest.", time: "Pending" },
  ], []);

  const receiptModel: ReceiptModel = useMemo(() => ({
    id: "WB-1042", title: "Whistleblower report — WB-1042",
    summary: ["Anonymous whistleblower report ingested and categorized (HR / retaliation).", "Allegations cross-referenced against current policy versions.", "Fact-gathering plan prepared; Note-Taker ready for interviews.", "No outreach or disclosures have been made."],
    completedSteps: 5, totalSteps: 8,
    steps: receiptSteps.map((s, idx) => ({ id: `step-${idx}`, status: s.status, title: s.title, detail: s.detail, time: s.time, actor: s.status === "done" ? "Agent" : "Human" })),
  }), [receiptSteps]);

  const headline = "You have a new whistleblower report to review, Sarah.";

  function openIncidentReview() {
    if (incidentUiMode === "rail") setDrawerOpen(true);
    else setInlineOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#0d1117] pb-8">
      <div className="pb-6"><PrototypeNav /></div>
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-3 rounded-2xl border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-4 py-3 text-sm text-[#8b949e] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wide text-[#58a6ff]">Prototype control</div>
              <div className="truncate font-medium text-[#f0f6fc]">Incident updates appear as: {incidentUiMode === "rail" ? "Right rail" : "Inline report"}</div>
              <div className="mt-0.5 text-xs text-[#6e7681]">This control is not part of the product UI.</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setIncidentUiMode("rail"); setInlineOpen(false); }} className={cn("rounded-full border px-3 py-1.5 text-sm shadow-sm", incidentUiMode === "rail" ? "border-[#58a6ff] bg-[#58a6ff] text-[#0d1117]" : "border-[#30363d] bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]")}>Right rail</button>
              <button onClick={() => { setIncidentUiMode("inline"); setDrawerOpen(false); }} className={cn("rounded-full border px-3 py-1.5 text-sm shadow-sm", incidentUiMode === "inline" ? "border-[#58a6ff] bg-[#58a6ff] text-[#0d1117]" : "border-[#30363d] bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]")}>Inline report</button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-[#30363d] bg-[#161b22] shadow-sm relative">
        <div className="border-b border-[#30363d] bg-[#0d1117]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <DiligentLogo className="h-7 w-auto" />
                <span className="text-sm font-semibold text-[#f0f6fc]">GRC Command Center</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-sm text-[#8b949e]">
                <Icon name="grid" className="h-4 w-4 text-[#6e7681]" />
                <span className="font-medium">Ibotta, Inc.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#8b949e]">
              <div className="relative">
                <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#da3633] ring-2 ring-[#0d1117]" />
                <button className="rounded-full border border-[#30363d] bg-[#161b22] p-2 hover:bg-[#21262d] hover:text-[#f0f6fc]"><Icon name="bell" className="h-5 w-5" /></button>
              </div>
              <button className="rounded-full border border-[#30363d] bg-[#161b22] p-2 hover:bg-[#21262d] hover:text-[#f0f6fc]"><Icon name="dots" className="h-5 w-5" /></button>
              <div className="ml-1 h-8 w-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#3fb950]" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#0d1117] to-[#161b22]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <h1 className="text-center text-4xl font-semibold tracking-tight text-[#f0f6fc]">{headline}</h1>

            <div className="mx-auto mt-6 max-w-[860px]">
              <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold text-[#f0f6fc]">Whistleblower Incident Response</div>
                  <UrgencyBadge level={signals[0].urgency} />
                </div>
                <div className="mt-3 rounded-2xl border border-[#30363d] bg-[#21262d] p-4">
                  <div className="text-sm font-semibold text-[#f0f6fc]">{signals[0].title}</div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[#8b949e]">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-[#f0f6fc]">New report received — 5 of 8 steps completed</div>
                      <button onClick={() => { setShowIncidentReceipt(true); setDrawerOpen(false); setInlineOpen(false); }} className="rounded-full border border-[#30363d] bg-[#161b22] px-2.5 py-1 text-[11px] font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">View completed steps</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-[#30363d]"><div className="h-full w-[62%] rounded-full bg-[#3fb950]" /></div>
                      <span className="text-[#6e7681]">≈ 12 min saved</span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-[#8b949e]">{signals[0].detail} <span className="text-[#6e7681]">Case ID:</span> <span className="font-medium text-[#f0f6fc]">{signals[0].incidentId}</span></div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    {(drawerOpen || inlineOpen) ? (
                      <>
                        <span className="text-xs text-[#6e7681]">Reviewing now</span>
                        <button onClick={() => { setDrawerOpen(false); setInlineOpen(false); }} className="rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm text-[#8b949e] shadow-sm hover:bg-[#21262d] hover:text-[#f0f6fc]">Close review</button>
                      </>
                    ) : (
                      <>
                        <button className="rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm text-[#8b949e] shadow-sm hover:bg-[#21262d] hover:text-[#f0f6fc]">Assign</button>
                        <button onClick={openIncidentReview} className="rounded-md border border-[#58a6ff] bg-[#161b22] px-3 py-1.5 text-sm font-medium text-[#58a6ff] shadow-sm hover:bg-[#21262d]">Review</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {incidentUiMode === "inline" && inlineOpen && (
              <div className="mx-auto mt-6 max-w-[860px]">
                <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wide text-[#6e7681]">Report review</div>
                      <div className="mt-1 text-base font-semibold text-[#f0f6fc]">Whistleblower report received (WB-1042)</div>
                      <div className="mt-1 text-sm text-[#8b949e]">Inline mode keeps you in the main workspace while the agent surfaces what changed.</div>
                    </div>
                    <button onClick={() => setInlineOpen(false)} className="shrink-0 rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">Close</button>
                  </div>
                  <div className="mt-5 space-y-6">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-[#6e7681]">Report briefing</div>
                      <div className="mt-2 text-sm text-[#8b949e]">Anonymous whistleblower report received at <strong className="text-[#f0f6fc]">10:18 ET</strong>. Categorized as <strong className="text-[#f0f6fc]">HR / retaliation</strong>. Policies validated; no determination made.</div>
                    </div>
                    <div className="rounded-xl border border-[#30363d] bg-[#21262d] p-4">
                      <div className="text-sm font-semibold text-[#f0f6fc]">Actions already taken</div>
                      <ul className="mt-3 space-y-2 text-sm text-[#8b949e]">
                        <li>✔ Case created in Vault with anonymity preserved</li>
                        <li>✔ Routed to Legal + Corporate Secretary</li>
                        <li>✔ Policies validated against latest versions</li>
                        <li className="flex items-start justify-between gap-3"><span>✔ Fact-gathering plan prepared (Note-Taker enabled)</span><button onClick={() => setShowCommsPackage(true)} className="shrink-0 rounded-md border border-[#30363d] bg-[#161b22] px-2 py-1 text-xs text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">View</button></li>
                        <li>✔ Investigation threshold assessed</li>
                      </ul>
                      <div className="mt-3 text-xs text-[#6e7681]">Reporter anonymity is preserved. No outreach or disclosures have been made.</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#f0f6fc]">Decisions needed from you</div>
                      <div className="mt-3 space-y-3">
                        <ActionCard title="Open formal investigation" description="Launch a formal investigation and preserve oversight requirements." actionLabel="Open investigation" hint="GC will be included by default" onClick={() => setShowBoardEscalation(true)} />
                        <ActionCard title="Request additional information" description="Draft anonymous-safe questions for the reporter." actionLabel="Draft questions" hint="Nothing will be sent without approval" onClick={() => setShowNotifyRegulator(true)} />
                        <ActionCard title="Assign investigator" description="Designate a primary investigator responsible for coordination." actionLabel="Assign investigator" hint="Suggested investigators included" onClick={() => setShowAssignOwner(true)} />
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                      <div className="text-xs font-medium uppercase tracking-wide text-[#6e7681]">Ask about this report</div>
                      <div className="mt-2"><PromptComposer placeholder="Ask a follow-up about WB-1042..." contextLabel="WB-1042" dock="rail" /></div>
                    </div>
                    <div className="rounded-lg border border-[#30363d] bg-[#21262d] p-3">
                      <div className="text-sm font-medium text-[#f0f6fc]">Monitoring</div>
                      <div className="mt-1 text-sm text-[#8b949e]">I will provide updates <strong className="text-[#f0f6fc]">hourly</strong> and immediately as new information becomes available.</div>
                      <div className="mt-3 flex items-center justify-end"><button onClick={() => setInlineOpen(false)} className="rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm text-[#8b949e] shadow-sm hover:bg-[#21262d] hover:text-[#f0f6fc]">Close report</button></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!drawerOpen && !(incidentUiMode === "inline" && inlineOpen) && (
              <div className="mx-auto mt-8 max-w-[860px]"><PromptComposer placeholder="What should we review in WB-1042?" dock="main" /></div>
            )}

            {!(incidentUiMode === "inline" && inlineOpen) && (
              <>
                <div className="mx-auto mt-10 grid max-w-[860px] grid-cols-1 gap-6">
                  <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm">
                    <div className="text-lg font-semibold text-[#f0f6fc]">Recent Apps</div>
                    <div className="mt-4 space-y-3">
                      <RecentAppRow icon="shield" label="Vault" detail="Last: reviewed anonymous report intake and case WB-1042." />
                      <RecentAppRow icon="search" label="Policy Manager" detail="Last: validated Code of Conduct and Anti-Retaliation policies." />
                      <RecentAppRow icon="building" label="Entities" detail="Last: checked reporting entities and stakeholder routing." />
                      <RecentAppRow icon="spark" label="Boards" detail="Last: prepared oversight notes for potential investigation escalation." />
                    </div>
                  </div>
                </div>
                <div className="mx-auto mt-6 max-w-[1100px] text-xs text-[#6e7681]">Prototype note: This dark mode surface shows the Whistleblower Incident Response hero flow.</div>
              </>
            )}
          </div>
        </div>

        {showIncidentReceipt && <div className="absolute inset-0 z-50 bg-[#0d1117]"><ReceiptComponent model={receiptModel} onClose={() => setShowIncidentReceipt(false)} /></div>}
        
        <RightDrawer open={drawerOpen} title="Whistleblower report received (WB-1042)" onClose={() => setDrawerOpen(false)}>
          <div className="space-y-6">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-[#6e7681]">Report briefing</div>
              <div className="mt-2 text-sm text-[#8b949e]">Anonymous whistleblower report received at <strong className="text-[#f0f6fc]">10:18 ET</strong>. Categorized as <strong className="text-[#f0f6fc]">HR / retaliation</strong>. Policies validated; no determination made.</div>
            </div>
            <div className="rounded-xl border border-[#30363d] bg-[#21262d] p-4">
              <div className="text-sm font-semibold text-[#f0f6fc]">Actions already taken</div>
              <ul className="mt-3 space-y-2 text-sm text-[#8b949e]">
                <li>✔ Case created in Vault with anonymity preserved</li>
                <li>✔ Routed to Legal + Corporate Secretary</li>
                <li>✔ Policies validated against latest versions</li>
                <li className="flex items-start justify-between gap-3"><span>✔ Fact-gathering plan prepared (Note-Taker enabled)</span><button onClick={() => { setShowCommsPackage(true); setDrawerOpen(false); }} className="shrink-0 rounded-md border border-[#30363d] bg-[#161b22] px-2 py-1 text-xs text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">View</button></li>
                <li>✔ Investigation threshold assessed</li>
              </ul>
              <div className="mt-3 text-xs text-[#6e7681]">Reporter anonymity is preserved. No outreach or disclosures have been made.</div>
              <div className="mt-3 flex items-center justify-end"><button onClick={() => { setShowIncidentReceipt(true); setDrawerOpen(false); }} className="rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">View completed steps (receipt)</button></div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#f0f6fc]">Decisions needed from you</div>
              <div className="mt-3 space-y-3">
                <ActionCard title="Open formal investigation" description="Launch a formal investigation and preserve oversight requirements." actionLabel="Open investigation" hint="GC will be included by default" onClick={() => { setShowBoardEscalation(true); setDrawerOpen(false); }} />
                <ActionCard title="Request additional information" description="Draft anonymous-safe questions for the reporter." actionLabel="Draft questions" hint="Nothing will be sent without approval" onClick={() => { setShowNotifyRegulator(true); setDrawerOpen(false); }} />
                <ActionCard title="Assign investigator" description="Designate a primary investigator responsible for coordination." actionLabel="Assign investigator" hint="Suggested investigators included" onClick={() => { setShowAssignOwner(true); setDrawerOpen(false); }} />
              </div>
            </div>
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3 text-sm text-[#8b949e]">I will continue monitoring and preparing recommended actions. No outreach or disclosures will be made until you approve next steps.</div>
            <div className="rounded-lg border border-[#30363d] bg-[#21262d] p-3">
              <div className="text-sm font-medium text-[#f0f6fc]">Monitoring</div>
              <div className="mt-1 text-sm text-[#8b949e]">I will provide updates <strong className="text-[#f0f6fc]">hourly</strong> and immediately as new information becomes available.</div>
              <div className="mt-3 flex items-center justify-end"><button onClick={() => { setDrawerOpen(false); setInlineOpen(false); }} className="rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm text-[#8b949e] shadow-sm hover:bg-[#21262d] hover:text-[#f0f6fc]">Close panel</button></div>
            </div>
          </div>
        </RightDrawer>

        {showBoardEscalation && <FullPageModal title="Formal Investigation" subtitle="Whistleblower Report — WB-1042" onClose={() => setShowBoardEscalation(false)}>
          <section><h2 className="text-sm font-semibold text-[#f0f6fc]">What the investigation should cover</h2><p className="mt-2 text-sm text-[#8b949e]">This formal investigation summary captures the allegation, potential impact, and the fact-gathering plan.</p></section>
          <section><h3 className="text-sm font-semibold text-[#f0f6fc]">Draft investigation brief</h3><FormattingToolbar /><div className="rounded-b-xl border border-t-0 border-[#30363d] bg-[#0d1117] p-4 text-sm text-[#8b949e] space-y-2"><p><strong className="text-[#f0f6fc]">Summary:</strong> Anonymous report alleges retaliation related to a recent HR decision.</p><p><strong className="text-[#f0f6fc]">Status:</strong> Formal review criteria met. No determination has been made.</p><p><strong className="text-[#f0f6fc]">Actions taken:</strong> Report ingested, policies validated, Legal and Corporate Secretary notified.</p><p><strong className="text-[#f0f6fc]">Next steps:</strong> Assign investigator, request anonymous-safe info, complete oversight checks.</p></div><RevisionPrompt /></section>
          <section><h3 className="text-sm font-semibold text-[#f0f6fc]">Recipients</h3><div className="mt-3 space-y-2 text-sm text-[#8b949e]"><div>✔ General Counsel (included)</div><div>✔ Corporate Secretary (included)</div><div>✔ Chief People Officer (included)</div></div></section>
          <ModalFooter onCancel={() => setShowBoardEscalation(false)} actionLabel="Approve & Start" />
        </FullPageModal>}

        {showNotifyRegulator && <FullPageModal title="Request More Information" subtitle="Draft Questions — WB-1042" onClose={() => setShowNotifyRegulator(false)}>
          <section><h2 className="text-sm font-semibold text-[#f0f6fc]">Draft (review required)</h2><p className="mt-2 text-sm text-[#8b949e]">These questions are anonymous-safe and aligned to the initial allegation.</p></section>
          <section><h3 className="text-sm font-semibold text-[#f0f6fc]">Draft questions</h3><FormattingToolbar /><div className="rounded-b-xl border border-t-0 border-[#30363d] bg-[#0d1117] p-4 text-sm text-[#8b949e] space-y-2"><p><strong className="text-[#f0f6fc]">Case reference:</strong> WB-1042</p><p><strong className="text-[#f0f6fc]">Scope:</strong> Please share dates, individuals involved, and any documented communications.</p><p><strong className="text-[#f0f6fc]">Details:</strong> What actions do you believe were retaliatory?</p><p><strong className="text-[#f0f6fc]">Evidence:</strong> Do you have documents or witnesses we should review?</p><p><strong className="text-[#f0f6fc]">Safety:</strong> Is there any immediate risk to you or others?</p></div><RevisionPrompt /></section>
          <section><h3 className="text-sm font-semibold text-[#f0f6fc]">Review checklist</h3><div className="mt-3 space-y-2 text-sm text-[#8b949e]"><div>• Ensure questions are anonymous-safe</div><div>• Confirm scope aligns with allegation</div><div>• Avoid leading or retaliatory prompts</div><div>• Confirm counsel review (recommended)</div></div></section>
          <ModalFooter onCancel={() => setShowNotifyRegulator(false)} actionLabel="Approve & Send" />
        </FullPageModal>}

        {showCommsPackage && <FullPageModal title="Fact Gathering (Note-Taker)" subtitle="Interview kit — WB-1042" onClose={() => setShowCommsPackage(false)}>
          <section><h2 className="text-sm font-semibold text-[#f0f6fc]">What's included</h2><p className="mt-2 text-sm text-[#8b949e]">The agent prepared a fact-gathering kit for interviews and documentation.</p></section>
          <CommsCard title="Interview guide (draft)" owner="Investigations"><p><strong className="text-[#f0f6fc]">Focus:</strong> Timeline, decision context, and any retaliatory actions.</p><p><strong className="text-[#f0f6fc]">Approach:</strong> Neutral, non-leading questions; preserve anonymity.</p></CommsCard>
          <CommsCard title="Note-taker template (draft)" owner="Legal, HR"><p><strong className="text-[#f0f6fc]">Sections:</strong> Allegation summary, interview notes, evidence list.</p><p><strong className="text-[#f0f6fc]">Controls:</strong> Access restricted; audit trail enabled.</p></CommsCard>
          <CommsCard title="Evidence checklist (draft)" owner="Compliance"><p><strong className="text-[#f0f6fc]">Items:</strong> HR decision docs, related communications, policy references.</p></CommsCard>
          <ModalFooter onCancel={() => setShowCommsPackage(false)} actionLabel="Send to Legal for approval" hint="Review required before interviews or document requests." />
        </FullPageModal>}

        {showAssignOwner && <FullPageModal title="Assign Investigator" subtitle="Primary investigator — WB-1042" onClose={() => setShowAssignOwner(false)}>
          <section><h2 className="text-sm font-semibold text-[#f0f6fc]">Suggested investigators</h2><p className="mt-2 text-sm text-[#8b949e]">The agent suggests investigators based on role, availability, and prior cases.</p></section>
          <section className="space-y-3">
            {["Morgan Lee (Investigations)", "Priya Shah (Legal)", "Danielle Kim (HR)"].map((name) => (
              <button key={name} onClick={() => setSelectedOwner(name)} className={cn("w-full rounded-xl border p-4 text-left transition", selectedOwner === name ? "border-[#58a6ff] bg-[#21262d]" : "border-[#30363d] bg-[#161b22] hover:bg-[#21262d]")}>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-[#f0f6fc]">{name}</div>
                  <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-full border", selectedOwner === name ? "border-[#58a6ff]" : "border-[#6e7681]")}>{selectedOwner === name && <span className="h-2.5 w-2.5 rounded-full bg-[#58a6ff]" />}</span>
                </div>
                <div className="mt-1 text-sm text-[#8b949e]">Primary investigator for coordination, interviews, and stakeholder updates.</div>
              </button>
            ))}
          </section>
          <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Add someone else</h3>
            <div className="mt-3 flex items-center gap-2">
              <input className="flex-1 rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]" placeholder="Type a name or role" />
              <button className="rounded-md border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">Add</button>
            </div>
          </section>
          <ModalFooter onCancel={() => setShowAssignOwner(false)} actionLabel={`Assign ${selectedOwner.split(" ")[0]}`} hint="Assigning an investigator records accountability and enables automated follow-ups." />
        </FullPageModal>}
      </div>
    </div>
  );
}

function ActionCard({ title, description, actionLabel, hint, onClick }: { title: string; description: string; actionLabel: string; hint?: string; onClick?: () => void }) {
  return (
    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
      <div className="text-sm font-medium text-[#f0f6fc]">{title}</div>
      <div className="mt-1 text-sm text-[#8b949e]">{description}</div>
      <div className="mt-3 flex items-center gap-2">
        <button onClick={onClick} className="rounded-md border border-[#58a6ff] bg-[#58a6ff] px-3 py-1.5 text-sm font-medium text-[#0d1117] hover:bg-[#79b8ff]">{actionLabel}</button>
        {hint && <span className="text-xs text-[#6e7681]">{hint}</span>}
      </div>
    </div>
  );
}

function RecentAppRow({ icon, label, detail }: { icon: string; label: string; detail: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-3 text-left hover:bg-[#21262d]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#30363d] bg-[#21262d] text-[#8b949e]"><Icon name={icon} className="h-5 w-5" /></div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-[#f0f6fc]">{label}</div>
        <div className="mt-0.5 text-xs text-[#6e7681]">{detail}</div>
      </div>
    </button>
  );
}

function PromptComposer({ placeholder, contextLabel, dock }: { placeholder: string; contextLabel?: string; dock: "main" | "rail" }) {
  return (
    <div className="rounded-2xl border border-[#30363d] bg-[#161b22] shadow-sm">
      {contextLabel && (
        <div className="flex items-center justify-between border-b border-[#30363d] px-4 py-2">
          <div className="text-xs font-medium uppercase tracking-wide text-[#6e7681]">Prompting in context</div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#8b949e]"><span className="font-medium">{contextLabel}</span></div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]"><Icon name="paperclip" className="h-5 w-5" /></button>
          <div className="flex-1"><div className="text-sm text-[#6e7681]">{placeholder}</div><div className="mt-1 h-5 w-full rounded bg-[#21262d]" /></div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]"><Icon name="mic" className="h-5 w-5" /></button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#58a6ff] bg-[#58a6ff] text-[#0d1117] hover:bg-[#79b8ff]"><Icon name="send" className="h-5 w-5" /></button>
        </div>
        {dock === "main" ? (
          <>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <PillButton icon={<span className="text-base">＋</span>} label="Open investigation" />
              <PillButton icon={<Icon name="search" className="h-4 w-4" />} label="Search policies" />
              <PillButton icon={<Icon name="shield" className="h-4 w-4" />} label="Draft board-ready summary" />
              <PillButton icon={<Icon name="spark" className="h-4 w-4" />} label="Show agents needing attention" />
            </div>
            <div className="mt-4 text-center text-xs text-[#6e7681]">AI-generated content may have inaccuracies. <span className="underline decoration-[#6e7681]/50 underline-offset-2">Learn more</span></div>
          </>
        ) : (<div className="mt-3 text-xs text-[#6e7681]">Ask follow-up questions about this report without leaving the review panel.</div>)}
      </div>
    </div>
  );
}

function PillButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <button className="inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#8b949e] shadow-sm hover:bg-[#21262d] hover:text-[#f0f6fc] active:translate-y-[1px]"><span className="text-[#6e7681]">{icon}</span><span className="whitespace-nowrap">{label}</span></button>;
}

function FullPageModal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 bg-[#0d1117]">
      <div className="h-full overflow-y-auto">
        <div className="border-b border-[#30363d] px-6 py-4">
          <div className="flex items-center justify-between">
            <div><div className="text-xs uppercase tracking-wide text-[#6e7681]">{title}</div><div className="text-lg font-semibold text-[#f0f6fc]">{subtitle}</div></div>
            <button onClick={onClose} className="rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">Exit</button>
          </div>
        </div>
        <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">{children}</div>
      </div>
    </div>
  );
}

function FormattingToolbar() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-t-xl border border-[#30363d] bg-[#161b22] px-3 py-2 text-xs text-[#8b949e]">
      <span className="font-medium text-[#f0f6fc]">Formatting</span><span className="text-[#6e7681]">|</span>
      <button className="rounded-md border border-[#30363d] bg-[#0d1117] px-2 py-1 hover:bg-[#21262d] hover:text-[#f0f6fc]">B</button>
      <button className="rounded-md border border-[#30363d] bg-[#0d1117] px-2 py-1 hover:bg-[#21262d] hover:text-[#f0f6fc] italic">I</button>
      <button className="rounded-md border border-[#30363d] bg-[#0d1117] px-2 py-1 hover:bg-[#21262d] hover:text-[#f0f6fc]">• List</button>
      <button className="rounded-md border border-[#30363d] bg-[#0d1117] px-2 py-1 hover:bg-[#21262d] hover:text-[#f0f6fc]">Link</button>
      <span className="text-[#6e7681]">(visual only)</span>
    </div>
  );
}

function RevisionPrompt() {
  return (
    <div className="mt-4 rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-[#6e7681]">Ask the agent to revise</div>
      <div className="mt-2 flex items-center gap-2">
        <input className="flex-1 rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]" placeholder="e.g., make this shorter, remove jargon, add a clearer next step" />
        <button className="rounded-md bg-[#58a6ff] px-3 py-2 text-sm font-medium text-[#0d1117] hover:bg-[#79b8ff]">Apply</button>
      </div>
      <div className="mt-2 text-xs text-[#6e7681]">This is a prototype — the "Apply" action is illustrative.</div>
    </div>
  );
}

function CommsCard({ title, owner, children }: { title: string; owner: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#30363d] bg-[#21262d] p-5">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-[#f0f6fc]">{title}</h3><span className="text-xs text-[#6e7681]">Owner: {owner}</span></div>
      <div className="mt-3 space-y-2 text-sm text-[#8b949e]">{children}</div>
    </section>
  );
}

function ModalFooter({ onCancel, actionLabel, hint }: { onCancel: () => void; actionLabel: string; hint?: string }) {
  return (
    <section className="flex items-center justify-between border-t border-[#30363d] pt-6">
      <div className="text-xs text-[#6e7681]">{hint || "Nothing will be sent without your approval."}</div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="rounded-md border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">Cancel</button>
        <button className="rounded-md bg-[#58a6ff] px-4 py-2 text-sm font-medium text-[#0d1117] hover:bg-[#79b8ff]">{actionLabel}</button>
      </div>
    </section>
  );
}
