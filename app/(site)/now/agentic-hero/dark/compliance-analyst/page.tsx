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

// Analyst-level agents - hands-on work support
const agents: AgentStatus[] = [
  {
    name: "Policy Drafter",
    lastRun: "15 minutes ago",
    nextRun: "in 30 minutes",
    note: "Draft Insider Trading policy ready for your review—based on template and prior version",
    state: "Draft ready",
    criteria: ["Template application", "Version comparison", "Regulatory alignment", "Language consistency"],
  },
  {
    name: "Attestation Tracker",
    lastRun: "10 minutes ago",
    nextRun: "in 20 minutes",
    note: "42 employees pending Code of Conduct attestation; AI drafted reminder emails for 15 overdue",
    state: "Reminders ready",
    criteria: ["Completion tracking", "Reminder scheduling", "Escalation triggers", "Exception handling"],
  },
  {
    name: "DDQ Response Monitor",
    lastRun: "20 minutes ago",
    nextRun: "in 40 minutes",
    note: "Tracking 8 vendor DDQs; 4 received, 3 pending, 1 overdue by 3 days",
    state: "1 needs follow-up",
    criteria: ["Response tracking", "Completeness validation", "Follow-up drafting", "Risk flag detection"],
  },
  {
    name: "Training Coordinator",
    lastRun: "1 hour ago",
    nextRun: "in 2 hours",
    note: "Anti-bribery module completion at 91% EMEA; 43 employees need reminder",
    state: "Reminders queued",
    criteria: ["Assignment tracking", "Completion monitoring", "LMS sync status", "Regional compliance"],
  },
  {
    name: "Evidence Collector",
    lastRun: "30 minutes ago",
    nextRun: "in 1 hour",
    note: "Gathered supporting docs for 2 third-party risk assessments; ready for your review",
    state: "Docs ready",
    criteria: ["Document aggregation", "Source verification", "Gap identification", "Audit trail"],
  },
];

// Current work queue
const workQueue = {
  policiesInDraft: 2,
  attestationsToFollow: 15,
  ddqsPending: 4,
  trainingReminders: 43,
};

// Tasks for today
const todaysTasks = [
  {
    title: "Review AI-drafted Insider Trading policy",
    detail: "Draft prepared from template with tracked changes from prior version. Validate language and submit to Director for approval.",
    app: "Policy Manager",
    timeEstimate: "45 min",
    aiReady: true,
  },
  {
    title: "Send attestation reminders (15 overdue)",
    detail: "AI drafted personalized reminder emails for Code of Conduct attestation. Review and send to trigger escalation workflow.",
    app: "Policy Manager",
    timeEstimate: "15 min",
    aiReady: true,
  },
  {
    title: "Follow up on overdue vendor DDQ",
    detail: "Acme Consulting DDQ 3 days overdue. AI drafted follow-up email to procurement contact—review and send.",
    app: "Third Party Manager",
    timeEstimate: "10 min",
    aiReady: true,
  },
  {
    title: "Process 2 low-risk vendor approvals",
    detail: "AI screened and scored both vendors as low-risk. Review screening results and approve for auto-onboarding.",
    app: "Third Party Manager",
    timeEstimate: "20 min",
    aiReady: true,
  },
  {
    title: "Review risk assessment documents",
    detail: "Evidence Collector gathered supporting docs for TechVendor Inc risk assessment. Validate completeness before escalating.",
    app: "Third Party Manager",
    timeEstimate: "30 min",
    aiReady: true,
  },
];

// DDQ tracking
const ddqStatus = [
  { vendor: "Acme Consulting", sent: "Jan 10", status: "Overdue", daysOut: 3 },
  { vendor: "GlobalTech Ltd", sent: "Jan 12", status: "Pending", daysOut: 0 },
  { vendor: "SecureOps Inc", sent: "Jan 13", status: "Pending", daysOut: 0 },
  { vendor: "DataFlow Corp", sent: "Jan 8", status: "Received", daysOut: 0 },
  { vendor: "CloudFirst LLC", sent: "Jan 9", status: "Received", daysOut: 0 },
];

// Recent apps
const recentApps = [
  {
    name: "Policy Manager",
    description: "Started draft of Insider Trading policy refresh; AI prepared initial version from template.",
    lastUsed: "2 hours ago",
  },
  {
    name: "Third Party Manager",
    description: "Processed 3 low-risk vendor onboardings; sent DDQ to GlobalTech Ltd.",
    lastUsed: "Yesterday",
  },
  {
    name: "Compliance Education",
    description: "Sent training reminders to 28 employees with overdue anti-bribery modules.",
    lastUsed: "Yesterday",
  },
];

// Activity log
const activityLog = [
  "Policy Drafter: Insider Trading policy draft ready for your review.",
  "Attestation Tracker: 15 reminder emails drafted for overdue attestations.",
  "DDQ Monitor: Acme Consulting DDQ now 3 days overdue—follow-up drafted.",
  "Training Coordinator: 43 EMEA employees need anti-bribery reminder.",
  "Evidence Collector: TechVendor Inc supporting docs aggregated.",
];

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm", className)}>{children}</div>;
}

function DeviceToggle({ device, onChange }: { device: DeviceType; onChange: (d: DeviceType) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-[#30363d] bg-[#0d1117] p-1">
      {(["desktop", "ipad", "iphone"] as const).map((d) => (
        <button key={d} onClick={() => onChange(d)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", device === d ? "bg-[#21262d] text-[#f0f6fc]" : "text-[#8b949e]")}>{d.charAt(0).toUpperCase() + d.slice(1)}</button>
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
              <a href="/now/agentic-hero/dark/compliance-investigations" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e]">Investigations</a>
              <a href="/now/agentic-hero/dark/compliance-analyst" className="rounded-full border border-[#58a6ff] bg-[#161b22] px-3 py-1 text-xs font-semibold text-[#58a6ff]">Analyst</a>
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
          <span className="text-sm font-semibold text-[#f0f6fc]">Compliance Analyst Workspace</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onToggleActivity} className={cn("inline-flex h-10 items-center gap-2 rounded-xl border bg-[#161b22] px-3 text-sm text-[#8b949e]", activityOpen ? "border-[#58a6ff]" : "border-[#30363d]")}>
            <span className="font-medium">Activity</span>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs">({activityCount})</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3fb950] to-[#58a6ff]" />
        </div>
      </div>
    </div>
  );
}

function PromptBox() {
  const prompts = ["Draft policy section", "Send reminders", "Follow up DDQ", "Check training status"];
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-[#f0f6fc]">Your AI assistant is ready to help.</h3>
      <p className="mt-2 text-sm text-[#8b949e]">Draft policies, send attestation reminders, follow up on DDQs, or coordinate training campaigns.</p>
      <div className="mt-4 rounded-2xl border border-[#30363d] bg-[#0d1117] p-4">
        <textarea className="min-h-[80px] w-full resize-none bg-transparent text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none" placeholder="e.g., Help me draft the approval workflow section for the new policy. Or: Which vendors haven't responded to their DDQs?" />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {prompts.map((p) => <button key={p} className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#8b949e] hover:text-[#f0f6fc]">{p}</button>)}
          <div className="flex-1" />
          <button className="rounded-xl border border-[#58a6ff] bg-[#58a6ff] px-3 py-2 text-sm font-medium text-[#0d1117]">Run task</button>
        </div>
      </div>
    </Card>
  );
}

function WorkQueueCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3fb950]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2"><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Your work queue</h3>
            <p className="text-xs text-[#8b949e]">Items AI has prepared for you</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 divide-x divide-[#30363d]">
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#58a6ff]">{workQueue.policiesInDraft}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Policies in Draft</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#f0883e]">{workQueue.attestationsToFollow}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Attestation Reminders</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#da3633]">{workQueue.ddqsPending}</p>
          <p className="mt-1 text-xs text-[#8b949e]">DDQs Pending</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#f0883e]">{workQueue.trainingReminders}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Training Reminders</p>
        </div>
      </div>
    </Card>
  );
}

function DDQTrackerCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#58a6ff]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc]">DDQ response tracking</h3>
            <p className="text-xs text-[#8b949e]">Vendor questionnaire status</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-[#30363d]">
        {ddqStatus.map((d) => (
          <div key={d.vendor} className="flex items-center justify-between px-5 py-2.5 hover:bg-[#21262d]/50">
            <div className="flex items-center gap-3">
              <div className={cn("h-2 w-2 rounded-full", d.status === "Overdue" ? "bg-[#da3633]" : d.status === "Pending" ? "bg-[#f0883e]" : "bg-[#3fb950]")} />
              <span className="text-sm text-[#f0f6fc]">{d.vendor}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6e7681]">Sent {d.sent}</span>
              <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", d.status === "Overdue" ? "border-[#da3633]/30 bg-[#da3633]/10 text-[#da3633]" : d.status === "Pending" ? "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]" : "border-[#3fb950]/30 bg-[#3fb950]/10 text-[#3fb950]")}>{d.status}</span>
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
    <div className={cn("overflow-hidden rounded-3xl border border-[#30363d] bg-[#161b22]", isMobile && "rounded-none border-0")}>
      <div className={cn("px-6", isIphone && "px-4")}>
        <TopNav activityOpen={activityOpen} onToggleActivity={() => setActivityOpen(!activityOpen)} activityCount={activityLog.length} />

        {activityOpen && (
          <div className="-mt-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Today&apos;s activity</p><button onClick={() => setActivityOpen(false)} className="text-xs text-[#8b949e]">Close</button></div>
              <div className="mt-3 space-y-2">{activityLog.map((e) => <div key={e} className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#21262d] px-3 py-2"><div className="mt-1 h-2 w-2 rounded-full bg-[#3fb950]" /><p className="text-sm text-[#8b949e]">{e}</p></div>)}</div>
            </Card>
          </div>
        )}

        <header className={cn("rounded-3xl border border-[#30363d] bg-[#0d1117]/80 p-10", isIphone && "p-5 rounded-2xl")}>
          <h1 className={cn("text-center text-4xl font-semibold text-[#f0f6fc]", isIphone && "text-xl")}>Your work queue is manageable.</h1>
          <p className="mt-4 text-center text-sm text-[#8b949e]">2 policies in draft, 15 attestations pending, 4 DDQs awaiting response. AI has prepared materials for each task.</p>
        </header>

        {!isIphone && (
          <div className="ticker-strip relative mt-4 rounded-2xl border border-[#30363d] bg-[#21262d] px-4 py-2" ref={tickerRef} onMouseLeave={() => { if (!popoverHovered) setHoveredAgent(null); }}>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Analyst Assistants</span>
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
                <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Assistant Capabilities</p>
                <p className="mt-2 font-semibold text-[#f0f6fc]">{hoveredAgent.name}</p>
                <p className="mt-1 text-sm text-[#8b949e]">{hoveredAgent.note}</p>
                <div className="mt-3 space-y-1">{hoveredAgent.criteria.map((c) => <div key={c} className="flex items-start gap-2 text-xs text-[#8b949e]"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#6e7681]" />{c}</div>)}</div>
              </div>
            )}
            <style jsx>{`.ticker-track { animation: ticker 90s linear infinite; } .ticker-strip:hover .ticker-track { animation-play-state: paused; } @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
          </div>
        )}

        <div className="mt-8"><PromptBox /></div>
        <div className="mt-8"><WorkQueueCard /></div>
        <div className="mt-8"><DDQTrackerCard /></div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-[#f0f6fc]">Your tasks for today</h2>
          <p className="mt-2 text-sm text-[#8b949e]">AI has prepared materials for each task</p>
          <div className="mt-5 space-y-3">
            {todaysTasks.map((task) => (
              <div key={task.title} className="rounded-2xl border border-[#30363d] bg-[#161b22] px-5 py-4">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[#f0f6fc]">{task.title}</h3>
                      {task.aiReady && <span className="rounded-full border border-[#3fb950]/40 bg-[#3fb950]/10 px-2 py-0.5 text-[10px] text-[#3fb950]">AI Ready</span>}
                    </div>
                    <p className="mt-1 text-sm text-[#8b949e]">{task.detail}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-2 py-0.5 text-xs text-[#58a6ff]">{task.app}</span>
                      <span className="text-xs text-[#6e7681]">~{task.timeEstimate}</span>
                    </div>
                  </div>
                  <button className="shrink-0 rounded-xl border border-[#58a6ff] bg-[#58a6ff]/10 px-3 py-2 text-sm text-[#58a6ff]">Start</button>
                </div>
              </div>
            ))}
          </div>
        </section>

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

        <footer className="mt-14 border-t border-[#30363d] bg-[#0d1117] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Activity log</p>
          <div className="mt-4 space-y-2">{activityLog.slice(0, 4).map((e) => <div key={e} className="flex items-start gap-3 text-sm text-[#8b949e]"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#3fb950]" />{e}</div>)}</div>
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
