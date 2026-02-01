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

// Entity management agents
const agents: AgentStatus[] = [
  {
    name: "Filing Deadline Monitor",
    lastRun: "15 minutes ago",
    nextRun: "in 45 minutes",
    note: "3 filings due this month: Delaware annual report, California SOI, Nevada annual report",
    state: "3 due this month",
    criteria: ["Jurisdiction-specific deadlines", "Fee tracking", "Penalty risk alerts", "Auto-reminder scheduling"],
  },
  {
    name: "Jurisdiction Compliance",
    lastRun: "1 hour ago",
    nextRun: "in 2 hours",
    note: "All 47 entities in good standing; no regulatory changes affecting compliance status",
    state: "All current",
    criteria: ["Good standing verification", "Registered agent status", "Qualification requirements", "Regulatory updates"],
  },
  {
    name: "Data Accuracy Validator",
    lastRun: "30 minutes ago",
    nextRun: "in 1 hour",
    note: "Detected 2 officer changes not yet reflected in Delaware records—flagged for update",
    state: "2 updates needed",
    criteria: ["Officer/director reconciliation", "Address verification", "Ownership structure", "Document currency"],
  },
  {
    name: "KYC Request Fulfiller",
    lastRun: "2 hours ago",
    nextRun: "in 4 hours",
    note: "2 KYC requests pending: Bank of America (due Feb 5), Ernst & Young (due Feb 10)",
    state: "2 requests open",
    criteria: ["Request intake tracking", "Document assembly", "Certification requirements", "Response SLA"],
  },
  {
    name: "Structure Change Assistant",
    lastRun: "4 hours ago",
    nextRun: "tomorrow, 9:00 AM",
    note: "M&A integration tracker: TechSub Inc dissolution 80% complete, 2 steps remaining",
    state: "Integration active",
    criteria: ["M&A transaction support", "Dissolution workflows", "Restructuring tracking", "Cross-border complexity"],
  },
];

// Entity portfolio summary
const entityPortfolio = {
  totalEntities: 47,
  jurisdictions: 12,
  filingsDueThisMonth: 3,
  goodStanding: 47,
  pendingUpdates: 2,
};

// Upcoming filings
const upcomingFilings = [
  {
    entity: "Acme Holdings, Inc.",
    filing: "Annual Report",
    jurisdiction: "Delaware",
    dueDate: "Mar 1, 2025",
    fee: "$225",
    status: "Prepared",
    aiNote: "All data current. Ready to file when approved.",
  },
  {
    entity: "Acme West LLC",
    filing: "Statement of Information",
    jurisdiction: "California",
    dueDate: "Feb 15, 2025",
    fee: "$20",
    status: "Prepared",
    aiNote: "Officer update needed before filing—change detected Jan 10.",
  },
  {
    entity: "Acme Services Corp.",
    filing: "Annual Report",
    jurisdiction: "Nevada",
    dueDate: "Feb 28, 2025",
    fee: "$150",
    status: "Prepared",
    aiNote: "All data current. Ready to file when approved.",
  },
];

// KYC/audit requests
const kycRequests = [
  {
    requestor: "Bank of America",
    type: "KYC Refresh",
    entities: ["Acme Holdings, Inc.", "Acme Finance LLC"],
    received: "Jan 20, 2025",
    due: "Feb 5, 2025",
    status: "In Progress",
    completion: 60,
  },
  {
    requestor: "Ernst & Young",
    type: "Audit Support",
    entities: ["All US entities (12)"],
    received: "Jan 25, 2025",
    due: "Feb 10, 2025",
    status: "Not Started",
    completion: 0,
  },
];

// Today's tasks
const todaysTasks = [
  {
    title: "Update California SOI with officer change",
    detail: "CFO change effective Jan 10 needs to be reflected before Feb 15 filing. AI has prepared the amendment form.",
    app: "Entities",
    timeEstimate: "15 min",
    aiReady: true,
  },
  {
    title: "Complete Bank of America KYC package",
    detail: "60% complete. Remaining: beneficial ownership certification and 2 entity org charts. AI has assembled documents.",
    app: "Entities",
    timeEstimate: "30 min",
    aiReady: true,
  },
  {
    title: "Review Delaware annual report for approval",
    detail: "All data verified current. Review filing summary and authorize submission to Secretary of State.",
    app: "Entities",
    timeEstimate: "10 min",
    aiReady: true,
  },
  {
    title: "Start Ernst & Young audit support package",
    detail: "12 US entities requested. AI can generate org charts and certificates of good standing in bulk.",
    app: "Entities",
    timeEstimate: "45 min",
    aiReady: true,
  },
];

// Recent apps
const recentApps = [
  {
    name: "Entities",
    description: "Updated officer records for 3 subsidiaries following January board appointments.",
    lastUsed: "Yesterday",
  },
  {
    name: "Entities",
    description: "Generated org chart for M&A due diligence package—TechSub Inc acquisition.",
    lastUsed: "Jan 14",
  },
  {
    name: "Entities",
    description: "Filed Q4 annual reports for 5 Delaware entities; all confirmed in good standing.",
    lastUsed: "Jan 10",
  },
];

// Activity log
const activityLog = [
  "Filing Monitor: 3 filings due this month—Delaware, California, Nevada.",
  "Data Validator: CFO change detected—California SOI needs update before filing.",
  "KYC Fulfiller: Bank of America package 60% complete—2 items remaining.",
  "Jurisdiction Compliance: All 47 entities verified in good standing.",
  "Structure Assistant: TechSub Inc dissolution at 80%—final steps pending.",
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
              <a href="/now/agentic-hero/dark/compliance-analyst" className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e]">Analyst</a>
              <a href="/now/agentic-hero/dark/compliance-entity" className="rounded-full border border-[#58a6ff] bg-[#161b22] px-3 py-1 text-xs font-semibold text-[#58a6ff]">Corp Secretary</a>
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
          <span className="text-sm font-semibold text-[#f0f6fc]">Corporate Secretary Workspace</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onToggleActivity} className={cn("inline-flex h-10 items-center gap-2 rounded-xl border bg-[#161b22] px-3 text-sm text-[#8b949e]", activityOpen ? "border-[#58a6ff]" : "border-[#30363d]")}>
            <span className="font-medium">Activity</span>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs">({activityCount})</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7]" />
        </div>
      </div>
    </div>
  );
}

function PromptBox() {
  const prompts = ["Generate org chart", "Filing status", "KYC package", "Entity lookup"];
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-[#f0f6fc]">Manage your entity portfolio from one place.</h3>
      <p className="mt-2 text-sm text-[#8b949e]">Track filings, generate org charts, fulfill KYC requests, and maintain corporate records.</p>
      <div className="mt-4 rounded-2xl border border-[#30363d] bg-[#0d1117] p-4">
        <textarea className="min-h-[80px] w-full resize-none bg-transparent text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none" placeholder="e.g., Generate an org chart for our European subsidiaries. Or: Which entities have filings due in the next 60 days?" />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {prompts.map((p) => <button key={p} className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#8b949e] hover:text-[#f0f6fc]">{p}</button>)}
          <div className="flex-1" />
          <button className="rounded-xl border border-[#58a6ff] bg-[#58a6ff] px-3 py-2 text-sm font-medium text-[#0d1117]">Run task</button>
        </div>
      </div>
    </Card>
  );
}

function PortfolioCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#58a6ff]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Entity portfolio at a glance</h3>
            <p className="text-xs text-[#8b949e]">Your corporate structure summary</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 divide-x divide-[#30363d]">
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#58a6ff]">{entityPortfolio.totalEntities}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Total Entities</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#58a6ff]">{entityPortfolio.jurisdictions}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Jurisdictions</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#f0883e]">{entityPortfolio.filingsDueThisMonth}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Filings Due</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#3fb950]">{entityPortfolio.goodStanding}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Good Standing</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-semibold text-[#f0883e]">{entityPortfolio.pendingUpdates}</p>
          <p className="mt-1 text-xs text-[#8b949e]">Updates Needed</p>
        </div>
      </div>
    </Card>
  );
}

function FilingsCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0883e]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0883e" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Upcoming filings</h3>
            <p className="text-xs text-[#8b949e]">Regulatory filings due this quarter</p>
          </div>
        </div>
        <span className="rounded-full border border-[#f0883e]/30 bg-[#f0883e]/10 px-2 py-0.5 text-xs font-medium text-[#f0883e]">{upcomingFilings.length} pending</span>
      </div>
      <div className="divide-y divide-[#30363d]">
        {upcomingFilings.map((f) => (
          <div key={`${f.entity}-${f.jurisdiction}`} className="px-5 py-3 hover:bg-[#21262d]/50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[#f0883e]" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#f0f6fc]">{f.entity}</span>
                    <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-[10px] text-[#8b949e]">{f.jurisdiction}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#6e7681]">{f.filing} · Due {f.dueDate} · Fee: {f.fee}</p>
                  <p className="mt-1 text-xs text-[#8b949e] italic">AI: {f.aiNote}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-[10px] font-medium text-[#3fb950]">{f.status}</span>
                <button className="rounded-lg border border-[#3fb950] bg-[#3fb950]/10 px-3 py-1.5 text-xs font-medium text-[#3fb950]">File</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function KYCCard() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#a371f7]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a371f7" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc]">KYC & audit requests</h3>
            <p className="text-xs text-[#8b949e]">External information requests</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-[#30363d]">
        {kycRequests.map((k) => (
          <div key={k.requestor} className="px-5 py-3 hover:bg-[#21262d]/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#f0f6fc]">{k.requestor}</span>
                  <span className="rounded-full border border-[#a371f7]/30 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] text-[#a371f7]">{k.type}</span>
                </div>
                <p className="mt-0.5 text-xs text-[#6e7681]">{k.entities.join(", ")} · Due {k.due}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 w-24 rounded-full bg-[#30363d]">
                    <div className={cn("h-1.5 rounded-full", k.completion > 0 ? "bg-[#a371f7]" : "bg-[#8b949e]")} style={{ width: `${k.completion}%` }} />
                  </div>
                  <span className="text-xs text-[#6e7681]">{k.completion}%</span>
                </div>
              </div>
              <button className={cn("shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium", k.status === "In Progress" ? "border-[#a371f7] bg-[#a371f7]/10 text-[#a371f7]" : "border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff]")}>{k.status === "In Progress" ? "Continue" : "Start"}</button>
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
              <div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Recent activity</p><button onClick={() => setActivityOpen(false)} className="text-xs text-[#8b949e]">Close</button></div>
              <div className="mt-3 space-y-2">{activityLog.map((e) => <div key={e} className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#21262d] px-3 py-2"><div className="mt-1 h-2 w-2 rounded-full bg-[#58a6ff]" /><p className="text-sm text-[#8b949e]">{e}</p></div>)}</div>
            </Card>
          </div>
        )}

        <header className={cn("rounded-3xl border border-[#30363d] bg-[#0d1117]/80 p-10", isIphone && "p-5 rounded-2xl")}>
          <h1 className={cn("text-center text-4xl font-semibold text-[#f0f6fc]", isIphone && "text-xl")}>Entity records current.</h1>
          <p className="mt-4 text-center text-sm text-[#8b949e]">All 47 entities in good standing, 3 filings due this month (all prepared), and 2 KYC requests in progress.</p>
        </header>

        {!isIphone && (
          <div className="ticker-strip relative mt-4 rounded-2xl border border-[#30363d] bg-[#21262d] px-4 py-2" ref={tickerRef} onMouseLeave={() => { if (!popoverHovered) setHoveredAgent(null); }}>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Entity Agents</span>
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
                <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Agent Capabilities</p>
                <p className="mt-2 font-semibold text-[#f0f6fc]">{hoveredAgent.name}</p>
                <p className="mt-1 text-sm text-[#8b949e]">{hoveredAgent.note}</p>
                <div className="mt-3 space-y-1">{hoveredAgent.criteria.map((c) => <div key={c} className="flex items-start gap-2 text-xs text-[#8b949e]"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#6e7681]" />{c}</div>)}</div>
              </div>
            )}
            <style jsx>{`.ticker-track { animation: ticker 90s linear infinite; } .ticker-strip:hover .ticker-track { animation-play-state: paused; } @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
          </div>
        )}

        <div className="mt-8"><PromptBox /></div>
        <div className="mt-8"><PortfolioCard /></div>
        <div className="mt-8"><FilingsCard /></div>
        <div className="mt-8"><KYCCard /></div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-[#f0f6fc]">Your tasks for today</h2>
          <div className="mt-5 space-y-3">
            {todaysTasks.slice(0, 3).map((task) => (
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
            {recentApps.map((app, i) => (
              <a key={i} href="#" className="block rounded-2xl border border-[#30363d] bg-[#161b22] px-4 py-3 hover:border-[#58a6ff]/50 hover:bg-[#21262d]">
                <div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-[#f0f6fc]">{app.name}</h3><span className="text-xs text-[#6e7681]">{app.lastUsed}</span></div>
                <p className="mt-1 text-sm text-[#8b949e]">{app.description}</p>
              </a>
            ))}
          </div>
        </section>

        <footer className="mt-14 border-t border-[#30363d] bg-[#0d1117] px-5 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">System log</p>
          <div className="mt-4 space-y-2">{activityLog.slice(0, 4).map((e) => <div key={e} className="flex items-start gap-3 text-sm text-[#8b949e]"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#58a6ff]" />{e}</div>)}</div>
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
