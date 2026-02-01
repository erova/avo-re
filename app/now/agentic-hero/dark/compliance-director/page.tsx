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

// Director-level agents - operational management
const agents: AgentStatus[] = [
  {
    name: "Policy Lifecycle Tracker",
    lastRun: "10 minutes ago",
    nextRun: "in 20 minutes",
    note: "142 policies active; 3 in approval workflow, 2 due for annual review next week",
    state: "Workflows active",
    criteria: ["Review cycle deadlines", "Approval bottlenecks", "Version control status", "Distribution gaps"],
  },
  {
    name: "Attestation Monitor",
    lastRun: "15 minutes ago",
    nextRun: "in 30 minutes",
    note: "Code of Conduct at 96% completion; 168 employees pending—reminders scheduled",
    state: "On track",
    criteria: ["Completion rates by policy", "Overdue attestations", "Comprehension scores", "Deadline proximity"],
  },
  {
    name: "Onboarding Queue Manager",
    lastRun: "20 minutes ago",
    nextRun: "in 40 minutes",
    note: "12 third-party requests in queue; 8 low-risk auto-approved, 4 awaiting DDQ responses",
    state: "Queue healthy",
    criteria: ["Intake volume", "SLA compliance", "Risk tier routing", "Questionnaire status"],
  },
  {
    name: "Training Deployment",
    lastRun: "1 hour ago",
    nextRun: "in 2 hours",
    note: "Anti-bribery campaign at 91% EMEA; new privacy module ready for Q2 rollout",
    state: "Campaigns active",
    criteria: ["Campaign completion rates", "Geographic coverage", "Content freshness", "LMS sync status"],
  },
  {
    name: "Deadline Alerter",
    lastRun: "5 minutes ago",
    nextRun: "in 15 minutes",
    note: "No critical deadlines this week; 2 policy reviews due next Friday",
    state: "All clear",
    criteria: ["Regulatory filing dates", "Policy review cycles", "Training deadlines", "Third-party renewals"],
  },
];

// Recent Diligent apps for Director
const recentApps = [
  {
    name: "Policy Manager",
    description: "Configured Code of Conduct attestation workflow; targeting 4,200 employees Monday.",
    lastUsed: "2 hours ago",
    icon: "policy",
  },
  {
    name: "Third Party Manager",
    description: "Reviewed 8 low-risk vendor approvals; escalated 2 to enhanced due diligence.",
    lastUsed: "Yesterday",
    icon: "3pm",
  },
  {
    name: "Compliance Education",
    description: "Deployed anti-bribery refresher to EMEA region; 91% completion so far.",
    lastUsed: "Yesterday",
    icon: "education",
  },
  {
    name: "Activity Center",
    description: "Built attestation completion dashboard for CCO's weekly review.",
    lastUsed: "Jan 14",
    icon: "activity",
  },
];

// Operational next actions for Director
const nextActions = [
  {
    title: "3 policies awaiting your approval",
    detail: "Updated Travel & Expense, Gifts & Entertainment, and Conflicts of Interest policies ready for final sign-off before distribution.",
    app: "Policy Manager",
    type: "approval",
    urgency: "normal",
  },
  {
    title: "4 third-party DDQs overdue",
    detail: "Vendors haven't responded to due diligence questionnaires. AI drafted follow-up emails—review and send to procurement contacts.",
    app: "Third Party Manager",
    type: "follow-up",
    urgency: "high",
  },
  {
    title: "Code of Conduct campaign launching Monday",
    detail: "4,200 employees targeted. Review final settings: reminder schedule, escalation path, and comprehension quiz configuration.",
    app: "Policy Manager",
    type: "launch",
    urgency: "normal",
  },
  {
    title: "Q2 training plan needs finalization",
    detail: "Privacy and data protection modules selected. Confirm deployment regions and LMS integration settings before calendar invite.",
    app: "Compliance Education",
    type: "planning",
    urgency: "normal",
  },
];

// Workflow queue summary
const workflowQueues = {
  policiesInApproval: 3,
  attestationsPending: 168,
  thirdPartyInQueue: 12,
  trainingCampaignsActive: 2,
};

// What's new for Directors
const whatsNew = [
  {
    title: "Policy Manager: Configurable workflows",
    detail: "New approval chain builder lets you customize sign-off paths by policy type and region.",
    href: "#",
  },
  {
    title: "Third Party Manager: Auto-approval rules",
    detail: "Set risk thresholds to auto-approve low-risk vendors and focus time on complex cases.",
    href: "#",
  },
  {
    title: "Compliance Education: LMS integration",
    detail: "SCORM packages now sync completion data back automatically for unified reporting.",
    href: "#",
  },
];

// Activity log
const activityLog = [
  "Policy Manager: Travel & Expense policy submitted for your approval by Legal.",
  "Third Party Manager: 4 DDQ responses overdue—follow-up reminders queued.",
  "Compliance Education: Anti-bribery EMEA campaign reached 91% completion.",
  "Attestation Monitor: 32 employees completed Code of Conduct attestation today.",
  "Deadline Alerter: Information Security policy review due next Friday.",
];

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#f0f6fc]">{title}</h2>
      {description && <p className="mt-2 text-sm text-[#8b949e]">{description}</p>}
    </div>
  );
}

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
              <a href="/now/agentic-hero/dark/compliance-cco" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc]">CCO</a>
              <a href="/now/agentic-hero/dark/compliance-director" className="rounded-full border border-[#58a6ff] bg-[#161b22] px-3 py-1 text-xs font-semibold text-[#58a6ff]">Director</a>
              <a href="/now/agentic-hero/dark/compliance-investigations" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc]">Investigations</a>
              <a href="/now/agentic-hero/dark/compliance-analyst" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc]">Analyst</a>
              <a href="/now/agentic-hero/dark/compliance-entity" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc]">Corp Secretary</a>
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
          <span className="text-sm font-semibold text-[#f0f6fc]">Compliance Director Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onToggleActivity} className={cn("inline-flex h-10 items-center gap-2 rounded-xl border bg-[#161b22] px-3 text-sm text-[#8b949e]", activityOpen ? "border-[#58a6ff]" : "border-[#30363d]")}>
            <span className="font-medium">Activity</span>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs">({activityCount})</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f0883e] to-[#da3633]" />
        </div>
      </div>
    </div>
  );
}

function PromptBox() {
  const prompts = ["Policy approval status", "Attestation gaps", "DDQ follow-ups", "Training deployment"];
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-[#f0f6fc]">Manage your compliance operations from one place.</h3>
      <p className="mt-2 text-sm text-[#8b949e]">Track policy workflows, monitor attestations, manage third-party onboarding, and deploy training campaigns.</p>
      <div className="mt-4 rounded-2xl border border-[#30363d] bg-[#0d1117] p-4">
        <textarea className="min-h-[80px] w-full resize-none bg-transparent text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none" placeholder="e.g., Which vendors have overdue DDQ responses? Or: Show me attestation completion by department." />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {prompts.map((p) => <button key={p} className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#8b949e] hover:text-[#f0f6fc]">{p}</button>)}
          <div className="flex-1" />
          <button className="rounded-xl border border-[#58a6ff] bg-[#58a6ff] px-3 py-2 text-sm font-medium text-[#0d1117]">Run task</button>
        </div>
      </div>
    </Card>
  );
}

function QueueSummaryCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0883e]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0883e" strokeWidth="2"><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Your workflow queues</h3>
            <p className="text-xs text-[#8b949e]">Items requiring action across compliance operations</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 divide-x divide-[#30363d]">
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#f0883e]">{workflowQueues.policiesInApproval}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Policies to Approve</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#58a6ff]">{workflowQueues.attestationsPending}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Attestations Pending</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#58a6ff]">{workflowQueues.thirdPartyInQueue}</p>
          <p className="mt-1 text-xs text-[#8b949e]">3P in Queue</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#3fb950]">{workflowQueues.trainingCampaignsActive}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Training Active</p>
        </div>
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
              <div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Recent activity</p><button onClick={() => setActivityOpen(false)} className="text-xs text-[#8b949e]">Close</button></div>
              <div className="mt-3 space-y-2">{activityLog.map((e) => <div key={e} className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#21262d] px-3 py-2"><div className="mt-1 h-2 w-2 rounded-full bg-[#3fb950]" /><p className="text-sm text-[#8b949e]">{e}</p></div>)}</div>
            </Card>
          </div>
        )}

        <header className={cn("rounded-3xl border border-[#30363d] bg-[#0d1117]/80 p-10", isIphone && "p-5 rounded-2xl")}>
          <h1 className={cn("text-center text-4xl font-semibold text-[#f0f6fc]", isIphone && "text-xl")}>Operations running smoothly.</h1>
          <p className="mt-4 text-center text-sm text-[#8b949e]">94% attestation completion, 12 policies current, no overdue third-party reviews. A few approval items need your attention.</p>
        </header>

        {!isIphone && (
          <div className="ticker-strip relative mt-4 rounded-2xl border border-[#30363d] bg-[#21262d] px-4 py-2" ref={tickerRef} onMouseLeave={() => { if (!popoverHovered) setHoveredAgent(null); }}>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Operations Agents</span>
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
        <div className="mt-8"><QueueSummaryCard /></div>

        <section className="mt-10">
          <SectionHeader title="Pick up where you left off" description="Continue working in your Diligent applications" />
          <div className={cn("mt-5 grid gap-3", device === "desktop" && "md:grid-cols-2")}>
            {recentApps.map((app) => (
              <a key={app.name} href="#" className="group block rounded-2xl border border-[#30363d] bg-[#161b22] px-4 py-3 hover:border-[#58a6ff]/50 hover:bg-[#21262d]">
                <div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-[#f0f6fc]">{app.name}</h3><span className="text-xs text-[#6e7681]">{app.lastUsed}</span></div>
                <p className="mt-1 text-sm text-[#8b949e]">{app.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionHeader title="Items needing your attention" />
          <div className={cn("mt-6 grid gap-6", device === "desktop" && "lg:grid-cols-3")}>
            <div className={cn(device === "desktop" && "lg:col-span-2", "space-y-3")}>
              {nextActions.map((action) => (
                <div key={action.title} className={cn("rounded-2xl border bg-[#161b22] px-5 py-4", action.urgency === "high" ? "border-[#da3633]/40" : "border-[#30363d]")}>
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-[#f0f6fc]">{action.title}</h3>
                        {action.urgency === "high" && <span className="rounded-full border border-[#da3633]/30 bg-[#da3633]/10 px-2 py-0.5 text-[10px] text-[#da3633]">Overdue</span>}
                      </div>
                      <p className="mt-1 text-sm text-[#8b949e]">{action.detail}</p>
                      <span className="mt-2 inline-block rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-2 py-0.5 text-xs text-[#58a6ff]">{action.app}</span>
                    </div>
                    <button className={cn("shrink-0 rounded-xl border px-3 py-2 text-sm", action.urgency === "high" ? "border-[#da3633] bg-[#da3633]/10 text-[#da3633]" : "border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff]")}>{action.urgency === "high" ? "Follow up" : "Open"}</button>
                  </div>
                </div>
              ))}
            </div>
            {!isIphone && (
              <Card className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">What&apos;s New</p>
                <h3 className="mt-2 text-lg font-semibold text-[#f0f6fc]">Tools for Directors</h3>
                <div className="mt-4 space-y-3">
                  {whatsNew.map((item) => (
                    <a key={item.title} href={item.href} className="block rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-3 hover:border-[#58a6ff]/50">
                      <h4 className="text-sm font-semibold text-[#f0f6fc]">{item.title}</h4>
                      <p className="mt-1 text-sm text-[#8b949e]">{item.detail}</p>
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </section>

        <footer className="mt-14 border-t border-[#30363d] bg-[#0d1117] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">System log</p>
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
