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

// CCO-level agents - strategic oversight
const agents: AgentStatus[] = [
  {
    name: "Program Health Monitor",
    lastRun: "20 minutes ago",
    nextRun: "in 40 minutes",
    note: "All program elements scoring green; DOJ framework alignment at 94%",
    state: "Program healthy",
    criteria: ["Seven Elements assessment", "Control effectiveness", "Regulatory alignment", "Board readiness indicators"],
  },
  {
    name: "Regulatory Watch",
    lastRun: "1 hour ago",
    nextRun: "in 2 hours",
    note: "Monitoring 8 jurisdictions; no new enforcement actions affecting your program",
    state: "No new alerts",
    criteria: ["DOJ/SEC guidance changes", "Enforcement trends", "Industry settlements", "Regulatory examination prep"],
  },
  {
    name: "Culture Pulse",
    lastRun: "2 hours ago",
    nextRun: "in 4 hours",
    note: "Speak-up channel utilization healthy; training engagement above benchmark",
    state: "Culture indicators positive",
    criteria: ["Hotline utilization rates", "Training completion trends", "Retaliation indicators", "Survey sentiment"],
  },
  {
    name: "Third-Party Risk Aggregator",
    lastRun: "30 minutes ago",
    nextRun: "in 1 hour",
    note: "1,247 third parties monitored; 3 elevated to high-risk requiring attention",
    state: "3 need review",
    criteria: ["Risk tier distribution", "Sanctions/PEP alerts", "Due diligence gaps", "Geographic exposure"],
  },
  {
    name: "Policy Effectiveness Tracker",
    lastRun: "45 minutes ago",
    nextRun: "in 3 hours",
    note: "142 policies current; attestation rate at 96%; 2 policies due for annual review",
    state: "Attestations on track",
    criteria: ["Policy coverage gaps", "Attestation completion", "Comprehension scores", "Review cycle compliance"],
  },
];

// Recent Diligent apps for CCO
const recentApps = [
  {
    name: "Diligent 360",
    description: "Reviewed aggregated compliance risk view for quarterly board presentation.",
    lastUsed: "Jan 16",
    icon: "360",
  },
  {
    name: "Policy Manager",
    description: "Approved updated Code of Conduct; attestation campaign launching Monday.",
    lastUsed: "Jan 15",
    icon: "policy",
  },
  {
    name: "Third Party Manager",
    description: "Reviewed high-risk vendor dashboard; 3 escalations resolved this week.",
    lastUsed: "Jan 14",
    icon: "3pm",
  },
  {
    name: "Vault",
    description: "Reviewed Q4 speak-up metrics; substantiation rate and response times both improving.",
    lastUsed: "Jan 12",
    icon: "vault",
  },
];

// Strategic next actions for CCO
const nextActions = [
  {
    title: "Board compliance presentation in 2 weeks",
    detail: "AI has compiled program metrics across all domains. Review draft slides covering DOJ alignment, culture indicators, and third-party risk posture.",
    app: "Diligent 360",
    type: "presentation",
  },
  {
    title: "3 high-risk third parties require your attention",
    detail: "Elevated risk scores due to new sanctions exposure and adverse media. Review AI risk summaries and approve enhanced due diligence.",
    app: "Third Party Manager",
    type: "escalation",
  },
  {
    title: "Annual Code of Conduct refresh ready for launch",
    detail: "Updated policy approved. 4,200 employees targeted for attestation. Review campaign settings before Monday launch.",
    app: "Policy Manager",
    type: "approval",
  },
  {
    title: "DOJ evaluation guidance update review",
    detail: "New guidance issued last week on compliance program evaluation. AI has mapped changes to your current program—review gap analysis.",
    app: "Compliance Advisory",
    type: "regulatory",
  },
];

// Program health metrics
const programMetrics = {
  policyAttestation: 96,
  trainingCompletion: 91,
  thirdPartyScreened: 98,
  caseResolutionTime: 12, // days average
  cultureScore: 4.2, // out of 5
};

// What's new for CCO
const whatsNew = [
  {
    title: "Diligent 360: Compliance dashboard",
    detail: "New unified view aggregates risk indicators across Policy, 3PM, Vault, and ESG.",
    href: "#",
  },
  {
    title: "Third Party Manager: AI risk scoring",
    detail: "Enhanced scoring model now incorporates real-time sanctions and adverse media.",
    href: "#",
  },
  {
    title: "Vault: Culture analytics",
    detail: "New trend analysis identifies emerging hotspots before they escalate.",
    href: "#",
  },
];

// Activity log - CCO level
const activityLog = [
  "Policy Manager: Code of Conduct attestation campaign configured—launching Monday.",
  "Third Party Manager: 3 vendors elevated to high-risk tier due to sanctions list updates.",
  "Vault: Q4 case metrics report generated—substantiation rate improved 8% YoY.",
  "Compliance Education: Anti-bribery training completion reached 91% across EMEA.",
  "Diligent 360: Board compliance dashboard refreshed with January data.",
];

function SectionHeader({
  title,
  description,
  className,
  titleClassName,
}: {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div>
        <h2 className={cn("mt-2 text-2xl font-semibold text-[#f0f6fc]", titleClassName)}>{title}</h2>
        {description ? <p className="mt-2 text-sm text-[#8b949e]">{description}</p> : null}
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm", className)}>{children}</div>
  );
}

function DeviceToggle({ device, onChange }: { device: DeviceType; onChange: (d: DeviceType) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-[#30363d] bg-[#0d1117] p-1">
      <button
        onClick={() => onChange("desktop")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
          device === "desktop" ? "bg-[#21262d] text-[#f0f6fc]" : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        Desktop
      </button>
      <button
        onClick={() => onChange("ipad")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
          device === "ipad" ? "bg-[#21262d] text-[#f0f6fc]" : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        iPad
      </button>
      <button
        onClick={() => onChange("iphone")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
          device === "iphone" ? "bg-[#21262d] text-[#f0f6fc]" : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        iPhone
      </button>
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
            <div className="flex items-center gap-1 rounded-xl border border-[#30363d] bg-[#0d1117] p-1">
              <span className="rounded-lg bg-[#21262d] px-3 py-1.5 text-xs font-medium text-[#f0f6fc]">Near-term Vision</span>
            </div>
            <span className="text-[#30363d]">|</span>
            <nav className="flex flex-wrap items-center gap-2">
              <a href="/now/agentic-hero/dark/compliance-cco" className="rounded-full border border-[#58a6ff] bg-[#161b22] px-3 py-1 text-xs font-semibold text-[#58a6ff]">CCO</a>
              <a href="/now/agentic-hero/dark/compliance-director" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Director</a>
              <a href="/now/agentic-hero/dark/compliance-investigations" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Investigations</a>
              <a href="/now/agentic-hero/dark/compliance-analyst" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Analyst</a>
              <a href="/now/agentic-hero/dark/compliance-entity" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">Corp Secretary</a>
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
          <span className="text-sm font-semibold text-[#f0f6fc]">CCO Command Center</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onToggleActivity} className={cn("inline-flex h-10 items-center gap-2 rounded-xl border bg-[#161b22] px-3 text-sm text-[#8b949e] hover:bg-[#21262d]", activityOpen ? "border-[#58a6ff]" : "border-[#30363d]")}>
            <span className="font-medium">Recent activity</span>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs">({activityCount})</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#3fb950]" />
        </div>
      </div>
    </div>
  );
}

function PromptBox() {
  const prompts = ["Board presentation prep", "Program health summary", "Third-party risk status", "Culture metrics"];
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-[#f0f6fc]">Ask your Compliance AI assistant anything.</h3>
      <p className="mt-2 text-sm text-[#8b949e]">Get program health updates, prepare board materials, review risk posture, or assess regulatory alignment.</p>
      <div className="mt-4 rounded-2xl border border-[#30363d] bg-[#0d1117] p-4">
        <textarea className="min-h-[80px] w-full resize-none bg-transparent text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none" placeholder="e.g., How does our program align with the latest DOJ guidance? Or: Summarize our third-party risk exposure by region." />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {prompts.map((label) => (
            <button key={label} className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">{label}</button>
          ))}
          <div className="flex-1" />
          <button className="rounded-xl border border-[#58a6ff] bg-[#58a6ff] px-3 py-2 text-sm font-medium text-[#0d1117]">Run task</button>
        </div>
      </div>
    </Card>
  );
}

function ProgramHealthCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3fb950]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Program health at a glance</h3>
            <p className="text-xs text-[#8b949e]">Key metrics across your compliance program</p>
          </div>
        </div>
        <span className="rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-xs font-medium text-[#3fb950]">Healthy</span>
      </div>
      <div className="grid grid-cols-5 divide-x divide-[#30363d]">
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#3fb950]">{programMetrics.policyAttestation}%</p>
          <p className="mt-1 text-xs text-[#8b949e]">Policy Attestation</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#3fb950]">{programMetrics.trainingCompletion}%</p>
          <p className="mt-1 text-xs text-[#8b949e]">Training Complete</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#3fb950]">{programMetrics.thirdPartyScreened}%</p>
          <p className="mt-1 text-xs text-[#8b949e]">3P Screened</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#58a6ff]">{programMetrics.caseResolutionTime}d</p>
          <p className="mt-1 text-xs text-[#8b949e]">Avg Case Resolution</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#58a6ff]">{programMetrics.cultureScore}/5</p>
          <p className="mt-1 text-xs text-[#8b949e]">Culture Score</p>
        </div>
      </div>
    </Card>
  );
}

function DashboardContent({ activityOpen, setActivityOpen, hoveredAgent, setHoveredAgent, popoverPos, setPopoverPos, popoverHovered, setPopoverHovered, tickerRef, device = "desktop" }: { activityOpen: boolean; setActivityOpen: (v: boolean) => void; hoveredAgent: AgentStatus | null; setHoveredAgent: (a: AgentStatus | null) => void; popoverPos: { x: number; y: number }; setPopoverPos: (p: { x: number; y: number }) => void; popoverHovered: boolean; setPopoverHovered: (v: boolean) => void; tickerRef: React.RefObject<HTMLDivElement | null>; device?: DeviceType }) {
  const isIphone = device === "iphone";
  const isIpad = device === "ipad";
  const isMobile = isIphone || isIpad;

  return (
    <div className={cn("overflow-hidden rounded-3xl border border-[#30363d] bg-[#161b22] shadow-sm", isMobile && "rounded-none border-0")}>
      <div className={cn("px-6", isIphone && "px-4", isIpad && "px-5")}>
        <TopNav activityOpen={activityOpen} onToggleActivity={() => setActivityOpen(!activityOpen)} activityCount={activityLog.length} />
        
        {activityOpen && (
          <div className="-mt-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Recent activity</p><button onClick={() => setActivityOpen(false)} className="text-xs text-[#8b949e]">Close</button></div>
              <div className="mt-3 space-y-2">{activityLog.map((entry) => (<div key={entry} className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#21262d] px-3 py-2"><div className="mt-1 h-2 w-2 rounded-full bg-[#3fb950]" /><p className="text-sm text-[#8b949e]">{entry}</p></div>))}</div>
            </Card>
          </div>
        )}

        <header className={cn("rounded-3xl border border-[#30363d] bg-[#0d1117]/80 p-10", isIphone && "p-5 rounded-2xl")}>
          <h1 className={cn("text-center text-4xl font-semibold text-[#f0f6fc]", isIphone && "text-xl")}>Your compliance program is defensible.</h1>
          <p className="mt-4 text-center text-sm text-[#8b949e]">Culture indicators healthy, attestations current, third-party risk managed. A good time to prepare for your board presentation.</p>
        </header>

        {!isIphone && (
          <div className="ticker-strip relative mt-4 rounded-2xl border border-[#30363d] bg-[#21262d] px-4 py-2" ref={tickerRef} onMouseLeave={() => { if (!popoverHovered) setHoveredAgent(null); }}>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Compliance Agents</span>
              <div className="relative flex-1 overflow-hidden">
                <div className="ticker-track flex w-max items-center gap-6">
                  {[...agents, ...agents].map((agent, idx) => (
                    <div key={`${agent.name}-${idx}`} className="whitespace-nowrap text-sm text-[#8b949e]" onMouseEnter={(e) => { const bounds = tickerRef.current?.getBoundingClientRect(); if (bounds) { setHoveredAgent(agent); setPopoverPos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top }); } }}>
                      <span className="font-medium text-[#f0f6fc]">{agent.name}</span><span className="mx-2 text-[#6e7681]">·</span><span className="text-[#6e7681]">Last {agent.lastRun}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {hoveredAgent && !isMobile && (
              <div className="pointer-events-auto absolute z-20 w-80 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 shadow-lg" style={{ left: popoverPos.x, top: popoverPos.y + 16, transform: "translateX(-50%)" }} onMouseEnter={() => setPopoverHovered(true)} onMouseLeave={() => { setPopoverHovered(false); setHoveredAgent(null); }}>
                <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Agent Criteria</p>
                <p className="mt-2 text-base font-semibold text-[#f0f6fc]">{hoveredAgent.name}</p>
                <p className="mt-1 text-sm text-[#8b949e]">{hoveredAgent.note}</p>
                <div className="mt-3 space-y-1">{hoveredAgent.criteria.map((c) => (<div key={c} className="flex items-start gap-2 text-xs text-[#8b949e]"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#6e7681]" /><span>{c}</span></div>))}</div>
              </div>
            )}
            <style jsx>{`.ticker-track { animation: ticker 90s linear infinite; } .ticker-strip:hover .ticker-track { animation-play-state: paused; } @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
          </div>
        )}

        <div className="mt-8"><PromptBox /></div>
        <div className="mt-8"><ProgramHealthCard /></div>

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
                <div key={action.title} className="rounded-2xl border border-[#30363d] bg-[#161b22] px-5 py-4">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="text-base font-semibold text-[#f0f6fc]">{action.title}</h3>
                      <p className="mt-1 text-sm text-[#8b949e]">{action.detail}</p>
                      <span className="mt-2 inline-block rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-2 py-0.5 text-xs text-[#58a6ff]">{action.app}</span>
                    </div>
                    <button className="shrink-0 rounded-xl border border-[#58a6ff] bg-[#58a6ff]/10 px-3 py-2 text-sm text-[#58a6ff]">Open</button>
                  </div>
                </div>
              ))}
            </div>
            {!isIphone && (
              <Card className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">What&apos;s New</p>
                <h3 className="mt-2 text-lg font-semibold text-[#f0f6fc]">Tools for CCOs</h3>
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
          <div className="mt-4 space-y-2">{activityLog.slice(0, 4).map((entry) => (<div key={entry} className="flex items-start gap-3 text-sm text-[#8b949e]"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#3fb950]" /><span>{entry}</span></div>))}</div>
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

  const props = { activityOpen, setActivityOpen, hoveredAgent, setHoveredAgent, popoverPos, setPopoverPos, popoverHovered, setPopoverHovered, tickerRef };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <PrototypeNav device={device} onDeviceChange={setDevice} />
      <div className="mx-auto w-full max-w-6xl px-6 py-6"><DashboardContent {...props} device={device} /></div>
    </div>
  );
}
