"use client";

import React from "react";

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

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type DeviceType = "desktop" | "ipad" | "iphone";

type AgentStatus = {
  name: string;
  lastRun: string;
  nextRun: string;
  note: string;
  state: string;
  criteria: string[];
};

// Investigations-focused agents
const agents: AgentStatus[] = [
  {
    name: "Intake Classifier",
    lastRun: "5 minutes ago",
    nextRun: "in 10 minutes",
    note: "2 new reports received today; auto-classified as Conflict of Interest and Harassment",
    state: "2 new in triage",
    criteria: ["Report categorization", "Priority scoring", "Routing logic", "Duplicate detection"],
  },
  {
    name: "Case Priority Scorer",
    lastRun: "10 minutes ago",
    nextRun: "in 20 minutes",
    note: "All active cases scored; 1 elevated to high-priority due to executive involvement",
    state: "1 high priority",
    criteria: ["Severity assessment", "Retaliation risk", "Regulatory exposure", "Reputational impact"],
  },
  {
    name: "Investigation Timeline",
    lastRun: "15 minutes ago",
    nextRun: "in 30 minutes",
    note: "8 active investigations on track; 1 approaching SLA deadline in 3 days",
    state: "1 near SLA",
    criteria: ["Milestone tracking", "SLA compliance", "Bottleneck detection", "Resource allocation"],
  },
  {
    name: "Retaliation Monitor",
    lastRun: "1 hour ago",
    nextRun: "in 2 hours",
    note: "Monitoring 12 reporters from closed cases; no adverse employment actions detected",
    state: "No alerts",
    criteria: ["Employment status changes", "Performance review anomalies", "Access revocations", "Manager change patterns"],
  },
  {
    name: "Trend Analyzer",
    lastRun: "2 hours ago",
    nextRun: "in 4 hours",
    note: "Q4 trend: Harassment reports up 15% in Sales region—flagged for CCO review",
    state: "Trend flagged",
    criteria: ["Category patterns", "Geographic hotspots", "Repeat reporter analysis", "Substantiation rates"],
  },
];

// Cases in triage/active
const casesQueue = [
  {
    id: "CASE-2025-042",
    category: "Conflict of Interest",
    reportedVia: "Web Portal",
    received: "2 hours ago",
    status: "New - Triage",
    priority: "Medium",
    aiNote: "Auto-classified. Reporter disclosed financial relationship with vendor. Recommend assignment to Procurement liaison.",
  },
  {
    id: "CASE-2025-041",
    category: "Harassment",
    reportedVia: "Hotline",
    received: "6 hours ago",
    status: "New - Triage",
    priority: "High",
    aiNote: "Sensitive: Involves SVP. Recommend immediate assignment and legal hold consideration.",
  },
  {
    id: "CASE-2025-038",
    category: "Expense Fraud",
    reportedVia: "Manager Referral",
    received: "3 days ago",
    status: "Active - Interviews",
    priority: "Medium",
    aiNote: "Interview 2 of 3 complete. Evidence suggests $12K in duplicate reimbursements. SLA: 7 days remaining.",
  },
  {
    id: "CASE-2025-035",
    category: "Code of Conduct",
    reportedVia: "Web Portal",
    received: "5 days ago",
    status: "Active - Documentation",
    priority: "Low",
    aiNote: "Investigation complete. Drafting findings report. Recommend closure with coaching.",
  },
];

// Case metrics
const caseMetrics = {
  newInTriage: 2,
  activeInvestigations: 8,
  avgResolutionDays: 12,
  substantiationRate: 34,
  reporterSatisfaction: 4.1,
};

// Recent apps
const recentApps = [
  {
    name: "Vault",
    description: "Reviewed 2 new intake reports; assigned harassment case to senior investigator.",
    lastUsed: "1 hour ago",
  },
  {
    name: "Case Management",
    description: "Updated expense fraud case with interview notes; scheduled final witness.",
    lastUsed: "Yesterday",
  },
  {
    name: "Activity Center",
    description: "Generated Q4 case metrics dashboard for CCO monthly review.",
    lastUsed: "Jan 14",
  },
];

// Next actions
const nextActions = [
  {
    title: "2 new reports require triage",
    detail: "AI has classified and scored both cases. Review AI recommendations, assign investigators, and set preliminary timelines.",
    app: "Vault",
    urgency: "high",
  },
  {
    title: "Harassment case requires immediate attention",
    detail: "High-priority case involving SVP. Consider legal hold, interview scheduling, and confidentiality protocols before proceeding.",
    app: "Vault",
    urgency: "high",
  },
  {
    title: "Case 2025-038 approaching SLA",
    detail: "Expense fraud investigation at 7 days remaining. Final witness interview scheduled for tomorrow—prepare closing documentation.",
    app: "Case Management",
    urgency: "normal",
  },
  {
    title: "Sales region trend requires escalation",
    detail: "Harassment reports up 15% in Sales. AI compiled pattern analysis and recommended CCO briefing—review before escalation.",
    app: "Activity Center",
    urgency: "normal",
  },
];

// Activity log
const activityLog = [
  "Vault: New report received—auto-classified as Conflict of Interest.",
  "Vault: New report received—classified as Harassment, elevated to high priority.",
  "Case Management: Interview notes added to CASE-2025-038 (Expense Fraud).",
  "Trend Analyzer: Sales region harassment pattern flagged for CCO review.",
  "Retaliation Monitor: Weekly scan complete—no adverse actions detected.",
];

function cn2(...classes: Array<string | false | null | undefined>) { return classes.filter(Boolean).join(" "); }

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn2("rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm", className)}>{children}</div>;
}

function DeviceToggle({ device, onChange }: { device: DeviceType; onChange: (d: DeviceType) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-[#30363d] bg-[#0d1117] p-1">
      {(["desktop", "ipad", "iphone"] as const).map((d) => (
        <button key={d} onClick={() => onChange(d)} className={cn2("rounded-lg px-3 py-1.5 text-xs font-medium", device === d ? "bg-[#21262d] text-[#f0f6fc]" : "text-[#8b949e]")}>{d.charAt(0).toUpperCase() + d.slice(1)}</button>
      ))}
    </div>
  );
}

function PrototypeNav({ device, onDeviceChange }: { device: DeviceType; onDeviceChange: (d: DeviceType) => void }) {
  return (
    <>
      <div className="w-full border-b border-[#30363d] bg-[#0d1117]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Prototype</span>
            <span className="text-sm font-semibold text-[#f0f6fc]">Compliance Command Center</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-1"><span className="rounded-lg bg-[#21262d] px-3 py-1.5 text-xs font-medium text-[#f0f6fc]">Near-term Vision</span></div>
            <span className="text-[#30363d]">|</span>
            <nav className="flex flex-wrap items-center gap-2">
              <a href="/now/agentic-hero/dark/compliance-cco" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e]">CCO</a>
              <a href="/now/agentic-hero/dark/compliance-director" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e]">Director</a>
              <a href="/now/agentic-hero/dark/compliance-investigations" className="rounded-full border border-[#58a6ff] bg-[#161b22] px-3 py-1 text-xs font-semibold text-[#58a6ff]">Investigations</a>
              <a href="/now/agentic-hero/dark/compliance-analyst" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e]">Analyst</a>
              <a href="/now/agentic-hero/dark/compliance-entity" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e]">Corp Secretary</a>
            </nav>
          </div>
        </div>
      </div>
      <div className="w-full border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-2">
          <span className="text-xs text-[#6e7681]">Device Preview</span>
          <DeviceToggle device={device} onChange={onDeviceChange} />
        </div>
      </div>
    </>
  );
}

function TopNav({ activityOpen, onToggleActivity, activityCount }: { activityOpen: boolean; onToggleActivity: () => void; activityCount: number }) {
  return (
    <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-[#30363d] bg-[#0d1117]/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <DiligentLogo className="h-7 w-auto" />
          <span className="text-sm font-semibold text-[#f0f6fc]">Investigations Lead Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onToggleActivity} className={cn2("inline-flex h-10 items-center gap-2 rounded-xl border bg-[#161b22] px-3 text-sm text-[#8b949e]", activityOpen ? "border-[#58a6ff]" : "border-[#30363d]")}>
            <span className="font-medium">Activity</span>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs">({activityCount})</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#a371f7] to-[#da3633]" />
        </div>
      </div>
    </div>
  );
}

function PromptBox() {
  const prompts = ["Case status summary", "Triage new reports", "SLA tracking", "Trend analysis"];
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-[#f0f6fc]">Manage your investigations caseload.</h3>
      <p className="mt-2 text-sm text-[#8b949e]">Triage reports, track case progress, monitor SLAs, and analyze speak-up trends.</p>
      <div className="mt-4 rounded-2xl border border-[#30363d] bg-[#0d1117] p-4">
        <textarea className="min-h-[80px] w-full resize-none bg-transparent text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none" placeholder="e.g., Which cases are approaching SLA deadlines? Or: Show me harassment report trends by region." />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {prompts.map((p) => <button key={p} className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#8b949e] hover:text-[#f0f6fc]">{p}</button>)}
          <div className="flex-1" />
          <button className="rounded-xl border border-[#58a6ff] bg-[#58a6ff] px-3 py-2 text-sm font-medium text-[#0d1117]">Run task</button>
        </div>
      </div>
    </Card>
  );
}

function CaseMetricsCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#a371f7]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a371f7" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Caseload at a glance</h3>
            <p className="text-xs text-[#8b949e]">Your investigations metrics</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 divide-x divide-[#30363d]">
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#da3633]">{caseMetrics.newInTriage}</p>
          <p className="mt-1 text-xs text-[#8b949e]">New in Triage</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#f0883e]">{caseMetrics.activeInvestigations}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Active Cases</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#58a6ff]">{caseMetrics.avgResolutionDays}d</p>
          <p className="mt-1 text-xs text-[#8b949e]">Avg Resolution</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#58a6ff]">{caseMetrics.substantiationRate}%</p>
          <p className="mt-1 text-xs text-[#8b949e]">Substantiated</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#3fb950]">{caseMetrics.reporterSatisfaction}/5</p>
          <p className="mt-1 text-xs text-[#8b949e]">Reporter Score</p>
        </div>
      </div>
    </Card>
  );
}

function CasesQueueCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#da3633]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#da3633" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Cases requiring action</h3>
            <p className="text-xs text-[#8b949e]">AI has triaged and scored each case</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-[#30363d]">
        {casesQueue.map((c) => (
          <div key={c.id} className="px-5 py-3 hover:bg-[#21262d]/50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={cn2("mt-1 h-2 w-2 rounded-full", c.priority === "High" ? "bg-[#da3633]" : c.priority === "Medium" ? "bg-[#f0883e]" : "bg-[#8b949e]")} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[#f0f6fc]">{c.id}</span>
                    <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-[10px] text-[#8b949e]">{c.category}</span>
                    <span className={cn2("rounded-full border px-2 py-0.5 text-[10px] font-medium", c.priority === "High" ? "border-[#da3633]/30 bg-[#da3633]/10 text-[#da3633]" : c.priority === "Medium" ? "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]" : "border-[#8b949e]/30 bg-[#8b949e]/10 text-[#8b949e]")}>{c.priority}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#6e7681]">{c.reportedVia} · {c.received} · {c.status}</p>
                  <p className="mt-1 text-xs text-[#8b949e] italic">AI: {c.aiNote}</p>
                </div>
              </div>
              <button className={cn2("shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium", c.status.includes("New") ? "border-[#da3633] bg-[#da3633]/10 text-[#da3633]" : "border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff]")}>{c.status.includes("New") ? "Triage" : "Continue"}</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DashboardContent({ activityOpen, setActivityOpen, hoveredAgent, setHoveredAgent, popoverPos, setPopoverPos, popoverHovered, setPopoverHovered, tickerRef, device = "desktop" }: { activityOpen: boolean; setActivityOpen: (v: boolean) => void; hoveredAgent: AgentStatus | null; setHoveredAgent: (a: AgentStatus | null) => void; popoverPos: { x: number; y: number }; setPopoverPos: (p: { x: number; y: number }) => void; popoverHovered: boolean; setPopoverHovered: (v: boolean) => void; tickerRef: React.RefObject<HTMLDivElement | null>; device?: DeviceType }) {
  const isIphone = device === "iphone";
  const isMobile = device === "iphone" || device === "ipad";

  return (
    <div className={cn2("overflow-hidden rounded-3xl border border-[#30363d] bg-[#161b22]", isMobile && "rounded-none border-0")}>
      <div className={cn2("px-6", isIphone && "px-4")}>
        <TopNav activityOpen={activityOpen} onToggleActivity={() => setActivityOpen(!activityOpen)} activityCount={activityLog.length} />

        {activityOpen && (
          <div className="-mt-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Recent activity</p><button onClick={() => setActivityOpen(false)} className="text-xs text-[#8b949e]">Close</button></div>
              <div className="mt-3 space-y-2">{activityLog.map((e) => <div key={e} className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#21262d] px-3 py-2"><div className="mt-1 h-2 w-2 rounded-full bg-[#a371f7]" /><p className="text-sm text-[#8b949e]">{e}</p></div>)}</div>
            </Card>
          </div>
        )}

        <header className={cn2("rounded-3xl border border-[#30363d] bg-[#0d1117]/80 p-10", isIphone && "p-5 rounded-2xl")}>
          <h1 className={cn2("text-center text-4xl font-semibold text-[#f0f6fc]", isIphone && "text-xl")}>Speak-up channel healthy.</h1>
          <p className="mt-4 text-center text-sm text-[#8b949e]">2 new reports in triage, 8 active investigations on track, no retaliation indicators. One high-priority case needs immediate attention.</p>
        </header>

        {!isIphone && (
          <div className="ticker-strip relative mt-4 rounded-2xl border border-[#30363d] bg-[#21262d] px-4 py-2" ref={tickerRef} onMouseLeave={() => { if (!popoverHovered) setHoveredAgent(null); }}>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Investigations Agents</span>
              <div className="relative flex-1 overflow-hidden">
                <div className="ticker-track flex w-max items-center gap-6">
                  {[...agents, ...agents].map((agent, idx) => (
                    <div key={`${agent.name}-${idx}`} className="whitespace-nowrap text-sm" onMouseEnter={(e) => { const b = tickerRef.current?.getBoundingClientRect(); if (b) { setHoveredAgent(agent); setPopoverPos({ x: e.clientX - b.left, y: e.clientY - b.top }); } }}>
                      <span className="font-medium text-[#f0f6fc]">{agent.name}</span><span className="mx-2 text-[#6e7681]">·</span><span className="text-[#6e7681]">Last {agent.lastRun}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {hoveredAgent && !isMobile && (
              <div className="absolute z-20 w-80 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 shadow-lg" style={{ left: popoverPos.x, top: popoverPos.y + 16, transform: "translateX(-50%)" }} onMouseEnter={() => setPopoverHovered(true)} onMouseLeave={() => { setPopoverHovered(false); setHoveredAgent(null); }}>
                <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Agent Criteria</p>
                <p className="mt-2 font-semibold text-[#f0f6fc]">{hoveredAgent.name}</p>
                <p className="mt-1 text-sm text-[#8b949e]">{hoveredAgent.note}</p>
                <div className="mt-3 space-y-1">{hoveredAgent.criteria.map((c) => <div key={c} className="flex items-start gap-2 text-xs text-[#8b949e]"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#6e7681]" />{c}</div>)}</div>
              </div>
            )}
            <style jsx>{`.ticker-track { animation: ticker 90s linear infinite; } .ticker-strip:hover .ticker-track { animation-play-state: paused; } @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
          </div>
        )}

        <div className="mt-8"><PromptBox /></div>
        <div className="mt-8"><CaseMetricsCard /></div>
        <div className="mt-8"><CasesQueueCard /></div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-[#f0f6fc]">Pick up where you left off</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {recentApps.map((app) => (
              <a key={app.name} href="#" className="block rounded-2xl border border-[#30363d] bg-[#161b22] px-4 py-3 hover:border-[#58a6ff]/50 hover:bg-[#21262d]">
                <div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-[#f0f6fc]">{app.name}</h3><span className="text-xs text-[#6e7681]">{app.lastUsed}</span></div>
                <p className="mt-1 text-sm text-[#8b949e]">{app.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[#f0f6fc]">Items needing your attention</h2>
          <div className="mt-6 space-y-3">
            {nextActions.map((action) => (
              <div key={action.title} className={cn2("rounded-2xl border bg-[#161b22] px-5 py-4", action.urgency === "high" ? "border-[#da3633]/40" : "border-[#30363d]")}>
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[#f0f6fc]">{action.title}</h3>
                      {action.urgency === "high" && <span className="rounded-full border border-[#da3633]/30 bg-[#da3633]/10 px-2 py-0.5 text-[10px] text-[#da3633]">Urgent</span>}
                    </div>
                    <p className="mt-1 text-sm text-[#8b949e]">{action.detail}</p>
                    <span className="mt-2 inline-block rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-2 py-0.5 text-xs text-[#58a6ff]">{action.app}</span>
                  </div>
                  <button className={cn2("shrink-0 rounded-xl border px-3 py-2 text-sm", action.urgency === "high" ? "border-[#da3633] bg-[#da3633]/10 text-[#da3633]" : "border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff]")}>Open</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-14 border-t border-[#30363d] bg-[#0d1117] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">System log</p>
          <div className="mt-4 space-y-2">{activityLog.slice(0, 4).map((e) => <div key={e} className="flex items-start gap-3 text-sm text-[#8b949e]"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#a371f7]" />{e}</div>)}</div>
        </footer>
      </div>
    </div>
  );
}

export default function Page() {
  const [device, setDevice] = React.useState<DeviceType>("desktop");
  const [activityOpen, setActivityOpen] = React.useState(false);
  const [hoveredAgent, setHoveredAgent] = React.useState<AgentStatus | null>(null);
  const [popoverPos, setPopoverPos] = React.useState({ x: 0, y: 0 });
  const [popoverHovered, setPopoverHovered] = React.useState(false);
  const tickerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <PrototypeNav device={device} onDeviceChange={setDevice} />
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <DashboardContent activityOpen={activityOpen} setActivityOpen={setActivityOpen} hoveredAgent={hoveredAgent} setHoveredAgent={setHoveredAgent} popoverPos={popoverPos} setPopoverPos={setPopoverPos} popoverHovered={popoverHovered} setPopoverHovered={setPopoverHovered} tickerRef={tickerRef} device={device} />
      </div>
    </div>
  );
}
