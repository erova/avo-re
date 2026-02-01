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

// Audit-focused agents for the ticker
const agents: AgentStatus[] = [
  {
    name: "Audit Universe Monitor",
    lastRun: "15 minutes ago",
    nextRun: "in 45 minutes",
    note: "No significant organizational changes detected; audit universe current",
    state: "Monitoring active",
    criteria: ["Organizational structure changes", "New business units or subsidiaries", "M&A activity tracking", "Regulatory scope changes"],
  },
  {
    name: "Risk Assessment Engine",
    lastRun: "1 hour ago",
    nextRun: "in 3 hours",
    note: "Risk scores stable across all auditable entities; no escalations needed",
    state: "Quietly stable",
    criteria: ["Entity risk scoring updates", "Control effectiveness changes", "Prior finding status", "Industry risk indicators"],
  },
  {
    name: "Regulatory Watch",
    lastRun: "2 hours ago",
    nextRun: "in 4 hours",
    note: "Monitoring 12 regulatory areas; no new requirements impacting audit plan",
    state: "On schedule",
    criteria: ["New audit standards", "Regulatory examination updates", "Compliance deadline tracking", "Industry guidance changes"],
  },
  {
    name: "Execution Tracker",
    lastRun: "30 minutes ago",
    nextRun: "in 30 minutes",
    note: "4 audits in progress; all on schedule with no blockers identified",
    state: "All audits on track",
    criteria: ["Audit milestone tracking", "Resource utilization", "Timeline adherence", "Stakeholder availability"],
  },
  {
    name: "Findings Manager",
    lastRun: "45 minutes ago",
    nextRun: "in 2 hours",
    note: "23 open findings tracked; 3 due for follow-up this month—all progressing",
    state: "Monitoring remediation",
    criteria: ["Finding remediation status", "Due date tracking", "Management response monitoring", "Escalation triggers"],
  },
];

// Recent Diligent apps for audit executive
const recentApps = [
  {
    name: "Diligent 360",
    description: "Reviewed aggregated non-financial risk view ahead of next week's board meeting.",
    lastUsed: "Jan 16",
    icon: "360",
  },
  {
    name: "Diligent Audit",
    description: "Approved Q2 risk-based audit plan; confirmed coverage across strategic risk areas.",
    lastUsed: "Jan 15",
    icon: "audit",
  },
  {
    name: "Activity Center",
    description: "Built dashboard showing open findings by business unit for audit committee presentation.",
    lastUsed: "Jan 14",
    icon: "activity",
  },
  {
    name: "Impact Reports",
    description: "Generated one-click quarterly audit summary in PowerPoint format for leadership.",
    lastUsed: "Jan 12",
    icon: "reporting",
  },
];

// Contextual next actions for an audit executive
const nextActions = [
  {
    title: "Meeting with General Counsel in 2 weeks",
    detail: "Topics to be prepared for: Litigation hold impact on IT audit scope, regulatory examination findings response, and vendor contract audit timing.",
    app: "Diligent Audit",
    type: "meeting-prep",
  },
  {
    title: "Finalize Q2 audit plan presentation",
    detail: "Audit Committee meeting in 10 days. Draft plan ready for your review—includes resource allocation and timeline adjustments based on board feedback.",
    app: "Impact Reports",
    type: "presentation",
  },
  {
    title: "3 audit findings due for follow-up",
    detail: "High-priority findings from Q3 SOX testing reaching 90-day mark. Review management evidence and determine if remediation is complete.",
    app: "Diligent Audit",
    type: "follow-up",
  },
  {
    title: "Review CFO's budget feedback on audit plan",
    detail: "CFO requested clarification on external audit co-sourcing costs. AI has drafted a response summarizing cost-benefit analysis.",
    app: "Diligent Audit",
    type: "response",
  },
];

// What's new section
const whatsNew = [
  {
    title: "Diligent Audit: Risk-based planning",
    detail: "Enhanced risk scoring now pulls real-time data from enterprise risk management.",
    href: "#",
  },
  {
    title: "ACL Analytics: AI Studio",
    detail: "Explore audit data with natural-language prompts—no coding required.",
    href: "#",
  },
  {
    title: "Activity Center: Board dashboards",
    detail: "New templates for audit committee presentations with one-click refresh.",
    href: "#",
  },
];

// Pending risk assessments awaiting CAE review
const pendingAssessments = [
  {
    entity: "Supply Chain Operations",
    assessment: "Annual Risk Assessment",
    lastAssessed: "Q1 2025",
    riskLevel: "Medium",
    status: "AI draft ready",
    changes: "New vendor onboarding process identified; supply chain disruption risk elevated",
  },
  {
    entity: "IT Infrastructure",
    assessment: "Quarterly Risk Update",
    lastAssessed: "Q4 2024",
    riskLevel: "High",
    status: "Review needed",
    changes: "Cloud migration 60% complete; legacy system decommissioning timeline shifted",
  },
  {
    entity: "Finance & Accounting",
    assessment: "SOX Scoping Review",
    lastAssessed: "Q4 2024",
    riskLevel: "Medium",
    status: "AI draft ready",
    changes: "New ERP module live; 2 additional key controls identified for testing",
  },
];

// Activity log entries
const activityLog = [
  "Audit Management: IT General Controls fieldwork 75% complete—no issues flagged.",
  "Risk Manager: Supply Chain risk score updated from 62 to 68 (vendor concentration).",
  "Findings Tracker: CFO acknowledged remediation plan for revenue recognition finding.",
  "AI Reporting: Weekly audit status digest generated and shared with Audit Committee Chair.",
  "Regulatory Watch: PCAOB inspection alert—no direct impact on current audit plan.",
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
          device === "desktop"
            ? "bg-[#21262d] text-[#f0f6fc]"
            : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        Desktop
      </button>
      <button
        onClick={() => onChange("ipad")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
          device === "ipad"
            ? "bg-[#21262d] text-[#f0f6fc]"
            : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M12 18h.01" />
        </svg>
        iPad
      </button>
      <button
        onClick={() => onChange("iphone")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
          device === "iphone"
            ? "bg-[#21262d] text-[#f0f6fc]"
            : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <path d="M12 18h.01" />
        </svg>
        iPhone
      </button>
    </div>
  );
}

function DevicePreviewBar({ device, onDeviceChange }: { device: DeviceType; onDeviceChange: (d: DeviceType) => void }) {
  return (
    <div className="w-full border-b border-[#30363d] bg-[#161b22]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6e7681]">Device Preview</span>
        </div>
        <DeviceToggle device={device} onChange={onDeviceChange} />
      </div>
    </div>
  );
}

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        <div className="relative rounded-[3rem] border-[14px] border-[#1c1c1e] bg-[#1c1c1e] shadow-2xl">
          <div className="absolute left-1/2 top-2 z-20 h-[25px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
          <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[2.5rem] bg-[#0d1117]">
            <div className="h-full w-full overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
        <div className="absolute -right-[3px] top-[120px] h-[80px] w-[3px] rounded-r-sm bg-[#2c2c2e]" />
        <div className="absolute -left-[3px] top-[100px] h-[35px] w-[3px] rounded-l-sm bg-[#2c2c2e]" />
        <div className="absolute -left-[3px] top-[150px] h-[60px] w-[3px] rounded-l-sm bg-[#2c2c2e]" />
        <div className="absolute -left-[3px] top-[220px] h-[60px] w-[3px] rounded-l-sm bg-[#2c2c2e]" />
      </div>
    </div>
  );
}

function IPadFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        <div className="relative rounded-[2rem] border-[18px] border-[#1c1c1e] bg-[#1c1c1e] shadow-2xl">
          <div className="absolute left-1/2 top-3 z-20 h-[8px] w-[8px] -translate-x-1/2 rounded-full bg-[#2c2c2e]" />
          <div className="relative h-[700px] w-[980px] overflow-hidden rounded-[1rem] bg-[#0d1117]">
            <div className="h-full w-full overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrototypeNav({ 
  device,
  onDeviceChange,
}: { 
  device: DeviceType;
  onDeviceChange: (d: DeviceType) => void;
}) {
  return (
    <>
      <div className="w-full border-b border-[#30363d] bg-[#0d1117]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Prototype</span>
            <span className="text-sm font-semibold text-[#f0f6fc]">Audit Command Center</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 rounded-xl border border-[#30363d] bg-[#0d1117] p-1">
              <span className="rounded-lg bg-[#21262d] px-3 py-1.5 text-xs font-medium text-[#f0f6fc]">
                Near-term Vision
              </span>
            </div>
            <span className="text-[#30363d]">|</span>
            <nav className="flex flex-wrap items-center gap-2">
              <a
                href="/now/agentic-hero/dark/audit-executive"
                className="rounded-full border border-[#58a6ff] bg-[#161b22] px-3 py-1 text-xs font-semibold text-[#58a6ff] hover:bg-[#21262d]"
              >
                Audit Executive
              </a>
              <a
                href="/now/agentic-hero/dark/audit-manager"
                className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]"
              >
                Audit Manager
              </a>
              <a
                href="/now/agentic-hero/dark/auditor"
                className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]"
              >
                Auditor
              </a>
              <a
                href="/now/agentic-hero/dark/audit-qa"
                className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]"
              >
                QA Reviewer
              </a>
            </nav>
          </div>
        </div>
      </div>
      <DevicePreviewBar device={device} onDeviceChange={onDeviceChange} />
    </>
  );
}

function TopNav({
  activityOpen,
  onToggleActivity,
  activityCount,
}: {
  activityOpen: boolean;
  onToggleActivity: () => void;
  activityCount: number;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-[#30363d] bg-[#0d1117]/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <DiligentLogo className="h-7 w-auto" />
            <span className="text-sm font-semibold text-[#f0f6fc]">Audit Command Center</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleActivity}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border bg-[#161b22] px-3 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]",
              activityOpen ? "border-[#58a6ff]" : "border-[#30363d]"
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6h12M9 12h12M9 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <span className="font-medium">Recent activity</span>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">({activityCount})</span>
          </button>

          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]" aria-label="More">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#3fb950]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function PromptBox() {
  const prompts = [
    "Summarize audit status",
    "Upcoming deadlines",
    "Finding follow-ups due",
    "Risk score changes",
  ];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="mt-2 text-lg font-semibold text-[#f0f6fc]">
            Ask your Audit AI assistant anything.
          </h3>
          <p className="mt-2 text-sm text-[#8b949e]">
            Get audit status updates, review risk assessments, track findings, or prepare for stakeholder meetings—all from one prompt.
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-[#30363d] bg-[#0d1117] p-4">
        <textarea
          className="min-h-[96px] w-full resize-none bg-transparent text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none"
          placeholder="e.g., What topics should I be prepared for in my meeting with the CFO next week? Or: Summarize the status of all high-priority findings."
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {prompts.map((label) => (
            <button
              key={label}
              className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]"
            >
              {label}
            </button>
          ))}
          <div className="flex-1" />
          <button className="rounded-xl border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">
            Clear
          </button>
          <button className="rounded-xl border border-[#58a6ff] bg-[#58a6ff] px-3 py-2 text-sm font-medium text-[#0d1117] hover:bg-[#79b8ff]">
            Run task
          </button>
        </div>
      </div>
    </Card>
  );
}

function MobilePromptButton() {
  return (
    <button className="w-full rounded-2xl border border-[#30363d] bg-[#21262d] p-4 text-left transition hover:bg-[#30363d]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#58a6ff]/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
            <path d="M12 12 2.1 9.1" />
            <path d="m12 12 3.9 7.8" />
            <path d="m12 12 7.8-3.9" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#f0f6fc]">Ask Audit AI</p>
          <p className="text-xs text-[#8b949e]">Tap to start</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7681" strokeWidth="2">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}

function MobileAssessmentsCard() {
  return (
    <div className="rounded-2xl border border-[#f0883e]/30 bg-[#f0883e]/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0883e]/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0883e" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f0f6fc]">3 assessments ready</p>
            <p className="text-xs text-[#8b949e]">AI drafts for review</p>
          </div>
        </div>
        <button className="rounded-xl border border-[#3fb950] bg-[#3fb950]/10 px-3 py-2 text-xs font-medium text-[#3fb950]">
          Review
        </button>
      </div>
    </div>
  );
}

function DashboardContent({ 
  activityOpen, 
  setActivityOpen, 
  hoveredAgent,
  setHoveredAgent,
  popoverPos,
  setPopoverPos,
  popoverHovered,
  setPopoverHovered,
  tickerRef,
  device = "desktop",
}: {
  activityOpen: boolean;
  setActivityOpen: (v: boolean) => void;
  hoveredAgent: AgentStatus | null;
  setHoveredAgent: (a: AgentStatus | null) => void;
  popoverPos: { x: number; y: number };
  setPopoverPos: (p: { x: number; y: number }) => void;
  popoverHovered: boolean;
  setPopoverHovered: (v: boolean) => void;
  tickerRef: React.RefObject<HTMLDivElement | null>;
  device?: DeviceType;
}) {
  const isIphone = device === "iphone";
  const isIpad = device === "ipad";
  const isMobile = isIphone || isIpad;

  return (
    <div className={cn(
      "overflow-hidden rounded-3xl border border-[#30363d] bg-[#161b22] shadow-sm transition-colors duration-300",
      isMobile && "rounded-none border-0"
    )}>
      <div className={cn("px-6", isIphone && "px-4", isIpad && "px-5")}>
        <TopNav
          activityOpen={activityOpen}
          onToggleActivity={() => setActivityOpen(!activityOpen)}
          activityCount={activityLog.length}
        />
        
        {activityOpen ? (
          <div className="-mt-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Recent activity</p>
                </div>
                <button
                  onClick={() => setActivityOpen(false)}
                  className="rounded-lg border border-[#30363d] bg-[#161b22] px-2 py-1 text-xs text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]"
                >
                  Close
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {activityLog.map((entry) => (
                  <div key={entry} className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#21262d] px-3 py-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-[#3fb950]" />
                    <p className="text-sm text-[#8b949e]">{entry}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}

        <header className={cn(
          "rounded-3xl border border-[#30363d] bg-[#0d1117]/80 p-10 shadow-sm transition-colors duration-300",
          isIphone && "p-5 rounded-2xl",
          isIpad && "p-6 rounded-2xl"
        )}>
          <h1 className={cn(
            "text-center text-4xl font-semibold tracking-tight text-[#f0f6fc]",
            isIphone && "text-xl",
            isIpad && "text-2xl"
          )}>
            Your audit program is running smoothly.
          </h1>
          <p className="mt-4 text-center text-sm text-[#8b949e]">
            All audits on schedule, risk scores stable, and findings tracked. A good time to prepare for upcoming stakeholder meetings.
          </p>
        </header>

        {/* Agent ticker - hidden on iPhone */}
        {!isIphone && (
          <div
            className="ticker-strip relative mt-4 rounded-2xl border border-[#30363d] bg-[#21262d] px-4 py-2 transition-colors duration-300"
            ref={tickerRef}
            onMouseLeave={() => {
              if (!popoverHovered) {
                setHoveredAgent(null);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">
                Audit Monitoring Agents
              </span>
              <div className="relative flex-1 overflow-hidden">
                <div className="ticker-track flex w-max items-center gap-6">
                  {[...agents, ...agents].map((agent, idx) => (
                    <div
                      key={`${agent.name}-${idx}`}
                      className="whitespace-nowrap text-sm text-[#8b949e]"
                      onMouseEnter={(event) => {
                        const bounds = tickerRef.current?.getBoundingClientRect();
                        if (!bounds) return;
                        setHoveredAgent(agent);
                        setPopoverPos({
                          x: event.clientX - bounds.left,
                          y: event.clientY - bounds.top,
                        });
                      }}
                    >
                      <span className="font-medium text-[#f0f6fc]">{agent.name}</span>
                      <span className="mx-2 text-[#6e7681]">·</span>
                      <span className="text-[#6e7681]">Last {agent.lastRun}, next {agent.nextRun}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {hoveredAgent && !isMobile ? (
              <div
                className="pointer-events-auto absolute z-20 w-80 rounded-2xl border border-[#30363d] bg-[#161b22] p-4 text-left text-sm shadow-lg transition-colors duration-300"
                style={{
                  left: popoverPos.x,
                  top: popoverPos.y + 16,
                  transform: "translateX(-50%)",
                }}
                onMouseEnter={() => setPopoverHovered(true)}
                onMouseLeave={() => {
                  setPopoverHovered(false);
                  setHoveredAgent(null);
                }}
              >
                <div className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">
                  Agent Criteria
                </div>
                <div className="mt-2 text-base font-semibold text-[#f0f6fc]">{hoveredAgent.name}</div>
                <p className="mt-1 text-sm text-[#8b949e]">{hoveredAgent.note}</p>
                <div className="mt-3 space-y-1 text-xs text-[#8b949e]">
                  {hoveredAgent.criteria.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#6e7681]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href="#"
                    className="inline-flex items-center rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]"
                  >
                    Edit agent
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center rounded-full border border-[#58a6ff] bg-[#58a6ff] px-3 py-1.5 text-xs font-medium text-[#0d1117] hover:bg-[#79b8ff]"
                  >
                    View activity
                  </a>
                </div>
              </div>
            ) : null}
            <style jsx>{`
              .ticker-track {
                animation: ticker 90s linear infinite;
              }
              .ticker-strip:hover .ticker-track {
                animation-play-state: paused;
              }
              @keyframes ticker {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @media (prefers-reduced-motion: reduce) {
                .ticker-track { animation: none; }
              }
            `}</style>
          </div>
        )}

        {/* Prompt box */}
        <div className="mt-8">
          {isIphone ? (
            <MobilePromptButton />
          ) : (
            <PromptBox />
          )}
        </div>

        {/* Pending Risk Assessments - full on desktop/iPad */}
        {!isIphone && (
          <section className="mt-8">
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0883e]/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12l2 2 4-4" stroke="#f0883e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#f0883e" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#f0f6fc]">Risk assessments ready for your review</h3>
                    <p className="text-xs text-[#8b949e]">AI has prepared draft assessments based on latest data inputs</p>
                  </div>
                </div>
                <span className="rounded-full border border-[#f0883e]/30 bg-[#f0883e]/10 px-2 py-0.5 text-xs font-medium text-[#f0883e]">
                  {pendingAssessments.length} pending
                </span>
              </div>
              <div className="divide-y divide-[#30363d]">
                {pendingAssessments.map((assessment) => (
                  <div key={`${assessment.entity}-${assessment.assessment}`} className={cn(
                    "flex items-center justify-between px-5 py-3 hover:bg-[#21262d]/50",
                    isIpad && "flex-col items-start gap-3"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        assessment.riskLevel === "High" ? "bg-[#da3633]" : "bg-[#f0883e]"
                      )} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#f0f6fc]">{assessment.entity}</span>
                          <span className="text-sm text-[#6e7681]">·</span>
                          <span className="text-sm text-[#8b949e]">{assessment.assessment}</span>
                        </div>
                        <div className="mt-0.5 text-xs text-[#6e7681]">
                          {assessment.changes}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#6e7681]">
                          <span className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            assessment.riskLevel === "High"
                              ? "border-[#da3633]/30 bg-[#da3633]/10 text-[#da3633]"
                              : "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]"
                          )}>
                            {assessment.riskLevel} Risk
                          </span>
                          <span>·</span>
                          <span>Last assessed: {assessment.lastAssessed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-[10px] font-medium text-[#3fb950]">
                        {assessment.status}
                      </span>
                      <button className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">
                        Review
                      </button>
                      <button className="rounded-lg border border-[#3fb950] bg-[#3fb950]/10 px-3 py-1.5 text-xs font-medium text-[#3fb950] hover:bg-[#3fb950]/20">
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#30363d] bg-[#0d1117]/30 px-5 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6e7681]">AI assessments incorporate: org changes, regulatory updates, prior findings, and control test results</span>
                  <button className="text-xs font-medium text-[#58a6ff] hover:underline">
                    Review all assessments →
                  </button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Compact assessments for iPhone */}
        {isIphone && (
          <section className="mt-6">
            <MobileAssessmentsCard />
          </section>
        )}

        <section className="mt-10">
          <SectionHeader 
            title="Pick up where you left off"
            description="Continue working in your Diligent applications"
          />
          <div className={cn(
            "mt-5 grid gap-3",
            device === "desktop" && "md:grid-cols-2",
            isIpad && "grid-cols-2"
          )}>
            {recentApps.map((app) => (
              <a
                key={app.name}
                href="#"
                className="group block rounded-2xl border border-[#30363d] bg-[#161b22] px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:border-[#58a6ff]/50 hover:bg-[#21262d]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-[#f0f6fc]">{app.name}</h3>
                      <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-[11px] text-[#8b949e]">{app.lastUsed}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#8b949e]">{app.description}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#6e7681] opacity-0 transition group-hover:opacity-100">
                    Open
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionHeader 
            title={isIphone 
              ? "Get ahead"
              : "Since everything's on track, prepare for what's next"
            } 
          />
          <div className={cn(
            "mt-6 grid gap-6",
            device === "desktop" && "lg:grid-cols-3",
            isIpad && "grid-cols-1"
          )}>
            <div className={cn(device === "desktop" && "lg:col-span-2")}>
              <div className="space-y-3">
                {(isIphone ? nextActions.slice(0, 2) : nextActions).map((action) => (
                  <div
                    key={action.title}
                    className={cn(
                      "rounded-2xl border border-[#30363d] bg-[#161b22] px-5 py-4 shadow-sm transition-colors duration-300",
                      isIphone && "px-4 py-3"
                    )}
                  >
                    <div className={cn(
                      "flex items-start justify-between gap-6",
                      isMobile && "flex-col gap-3"
                    )}>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={cn(
                            "text-base font-semibold text-[#f0f6fc]",
                            isIphone && "text-sm"
                          )}>{action.title}</h3>
                          {action.type === "meeting-prep" && (
                            <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] font-medium text-[#a371f7]">
                              AI Prepared
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          "mt-1 text-sm text-[#8b949e]",
                          isIphone && "text-xs"
                        )}>{action.detail}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-[#6e7681]">
                          <span className="rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-2 py-0.5 text-[11px] text-[#58a6ff]">
                            {action.app}
                          </span>
                          {!isIphone && (
                            <span className="text-[#6e7681]">Ready to complete</span>
                          )}
                        </div>
                      </div>
                      <button className={cn(
                        "shrink-0 rounded-xl border border-[#58a6ff] bg-[#58a6ff]/10 px-3 py-2 text-sm text-[#58a6ff] hover:bg-[#58a6ff]/20",
                        isMobile && "w-full"
                      )}>
                        Open
                      </button>
                    </div>
                  </div>
                ))}
                {isIphone && nextActions.length > 2 && (
                  <button className="w-full rounded-xl border border-[#30363d] bg-[#21262d] px-4 py-3 text-sm text-[#8b949e]">
                    View {nextActions.length - 2} more actions
                  </button>
                )}
              </div>
            </div>
            {/* What's New sidebar - hidden on iPhone */}
            {!isIphone && (
              <div>
                <Card className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">
                    What&apos;s New
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#f0f6fc]">
                    Good to Know &amp; Good to Go
                  </h3>
                  <p className="mt-2 text-sm text-[#8b949e]">
                    Learn more about features and capabilities you already have today.
                  </p>
                  <div className="mt-4 space-y-3">
                    {whatsNew.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="block rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-3 transition hover:border-[#58a6ff]/50 hover:bg-[#21262d]"
                      >
                        <h4 className="text-sm font-semibold text-[#f0f6fc]">{item.title}</h4>
                        <p className="mt-1 text-sm text-[#8b949e]">{item.detail}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#58a6ff]">
                          Open
                        </p>
                      </a>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className={cn(
          "mt-14 border-t border-[#30363d] bg-[#0d1117] px-5 py-5",
          isIphone && "mt-8 px-4 py-4"
        )}>
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">System log</p>
              {!isIphone && (
                <p className="mt-1 text-sm text-[#8b949e]">
                  Recent system activity (last 24 hours)
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {(isIphone ? activityLog.slice(0, 3) : activityLog).map((entry) => (
              <div key={entry} className={cn(
                "flex items-start gap-3 text-sm text-[#8b949e]",
                isIphone && "text-xs"
              )}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3fb950]" />
                <span>{entry}</span>
              </div>
            ))}
          </div>
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

  const dashboardProps = {
    activityOpen,
    setActivityOpen,
    hoveredAgent,
    setHoveredAgent,
    popoverPos,
    setPopoverPos,
    popoverHovered,
    setPopoverHovered,
    tickerRef,
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <PrototypeNav 
        device={device}
        onDeviceChange={setDevice}
      />
      
      {device === "desktop" ? (
        <div className="mx-auto w-full max-w-6xl px-6 py-6">
          <DashboardContent {...dashboardProps} device="desktop" />
        </div>
      ) : device === "ipad" ? (
        <div className="flex justify-center overflow-x-auto bg-[#0d1117] px-4">
          <IPadFrame>
            <DashboardContent {...dashboardProps} device="ipad" />
          </IPadFrame>
        </div>
      ) : (
        <div className="flex justify-center overflow-x-auto bg-[#0d1117] px-4">
          <IPhoneFrame>
            <DashboardContent {...dashboardProps} device="iphone" />
          </IPhoneFrame>
        </div>
      )}
    </div>
  );
}
