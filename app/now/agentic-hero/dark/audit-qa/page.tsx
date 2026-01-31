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

// QA-focused agents - quality review and standards compliance
const agents: AgentStatus[] = [
  {
    name: "Standards Compliance",
    lastRun: "10 minutes ago",
    nextRun: "in 20 minutes",
    note: "Evaluated 3 audits today; all aligned with IIA standards, 2 minor documentation gaps noted",
    state: "Reviews current",
    criteria: ["IIA standards alignment", "Methodology compliance", "Documentation completeness", "Evidence sufficiency"],
  },
  {
    name: "Pattern Analyzer",
    lastRun: "1 hour ago",
    nextRun: "in 3 hours",
    note: "Identified recurring issue: sample size justification inconsistent across IT audits",
    state: "Pattern detected",
    criteria: ["Cross-audit trend analysis", "Recurring deficiency detection", "Best practice identification", "Template effectiveness"],
  },
  {
    name: "Feedback Composer",
    lastRun: "30 minutes ago",
    nextRun: "in 2 hours",
    note: "Draft feedback prepared for SOX audit—constructive tone, specific examples included",
    state: "Feedback ready",
    criteria: ["Constructive language", "Specific citation", "Actionable recommendations", "Positive reinforcement"],
  },
  {
    name: "Quality Scorer",
    lastRun: "45 minutes ago",
    nextRun: "in 1 hour",
    note: "Suggested ratings for 2 completed reviews based on framework criteria",
    state: "Ratings ready",
    criteria: ["Framework-based scoring", "Objective assessment", "Comparative benchmarking", "Rating justification"],
  },
  {
    name: "Improvement Tracker",
    lastRun: "2 hours ago",
    nextRun: "in 4 hours",
    note: "8 of 12 Q4 improvement actions implemented; 4 in progress with owners assigned",
    state: "On track",
    criteria: ["Action item monitoring", "Owner accountability", "Deadline tracking", "Effectiveness validation"],
  },
];

// Current QA review cycle context
const currentCycle = {
  name: "Q1 2025 Internal QA Review",
  auditsInScope: 6,
  auditsReviewed: 2,
  auditsInProgress: 1,
  auditsPending: 3,
  dueDate: "Feb 28, 2025",
  framework: "IIA Quality Standards",
};

// Audits in the QA queue
const auditsToReview = [
  {
    name: "IT General Controls",
    auditor: "Sarah Chen",
    manager: "Alex Thompson",
    completed: "Jan 15, 2025",
    riskRating: "High",
    status: "In Review",
    aiAssessment: "Preliminary scan: Strong documentation, one sampling methodology question",
    complianceScore: 92,
  },
  {
    name: "SOX Q4 Testing",
    auditor: "Marcus Williams",
    manager: "Alex Thompson",
    completed: "Jan 10, 2025",
    riskRating: "High",
    status: "Ready for Review",
    aiAssessment: "AI pre-scan complete: Evidence appears thorough, recommend focus on control conclusions",
    complianceScore: null,
  },
  {
    name: "Vendor Risk Assessment",
    auditor: "Elena Rodriguez",
    manager: "Jordan Kim",
    completed: "Jan 8, 2025",
    riskRating: "Medium",
    status: "Ready for Review",
    aiAssessment: "AI pre-scan complete: Good risk coverage, finding severity may need calibration",
    complianceScore: null,
  },
  {
    name: "Revenue Cycle Audit",
    auditor: "Jin Park",
    manager: "Jordan Kim",
    completed: "Dec 20, 2024",
    riskRating: "High",
    status: "Review Complete",
    aiAssessment: "QA complete: Strong overall, sample documentation exemplary",
    complianceScore: 95,
  },
];

// Patterns identified across audits
const patternsIdentified = [
  {
    type: "improvement",
    title: "Sample size justification inconsistent",
    detail: "3 of 5 recent IT audits lack clear rationale for sample sizes. Recommend template update.",
    auditsAffected: 3,
    recommendation: "Add mandatory sample rationale field to workpaper template",
    priority: "Medium",
  },
  {
    type: "best-practice",
    title: "Root cause analysis excellence",
    detail: "Revenue cycle team consistently documenting thorough root cause analysis in findings.",
    auditsAffected: 2,
    recommendation: "Share as example in next methodology training session",
    priority: "Low",
  },
  {
    type: "improvement",
    title: "Control conclusion language",
    detail: "Inconsistent language used for control effectiveness conclusions across SOX audits.",
    auditsAffected: 4,
    recommendation: "Standardize conclusion templates with approved language",
    priority: "High",
  },
];

// QA tasks for today
const todaysTasks = [
  {
    title: "Complete IT General Controls review",
    detail: "Review in progress since yesterday. AI flagged sampling methodology for closer look—validate and finalize rating.",
    audit: "Diligent Audit",
    type: "review",
    timeEstimate: "1.5 hours",
    aiReady: true,
  },
  {
    title: "Start SOX Q4 Testing review",
    detail: "AI pre-scan complete. High-risk audit—focus areas: control conclusions, exception handling, management response quality.",
    audit: "Internal Controls",
    type: "review",
    timeEstimate: "2 hours",
    aiReady: true,
  },
  {
    title: "Deliver feedback to Sarah Chen",
    detail: "IT General Controls feedback ready. AI composed constructive draft highlighting strengths and one improvement area.",
    audit: "Diligent Audit",
    type: "feedback",
    timeEstimate: "30 min",
    aiReady: true,
  },
  {
    title: "Update QA trend report for CAE",
    detail: "Monthly pattern analysis due Friday. AI compiled initial dashboard with 3 trends and recommendations.",
    audit: "Activity Center",
    type: "reporting",
    timeEstimate: "45 min",
    aiReady: true,
  },
];

// Improvement actions being tracked
const improvementActions = [
  {
    action: "Update sampling template with rationale field",
    owner: "Methodology Team",
    source: "Q4 QA Review",
    dueDate: "Feb 15, 2025",
    status: "In Progress",
  },
  {
    action: "Conduct root cause analysis training",
    owner: "Alex Thompson",
    source: "Q4 QA Review",
    dueDate: "Feb 28, 2025",
    status: "Scheduled",
  },
  {
    action: "Standardize control conclusion language",
    owner: "Methodology Team",
    source: "Q3 QA Review",
    dueDate: "Jan 31, 2025",
    status: "Overdue",
  },
];

// What's new for QA reviewers
const whatsNew = [
  {
    title: "Diligent Audit: QA templates",
    detail: "Prebuilt QA checklists aligned to IIA standards for consistent quality reviews.",
    href: "#",
  },
  {
    title: "Activity Center: Trend analysis",
    detail: "New dashboards show recurring issues and best practices across the audit portfolio.",
    href: "#",
  },
  {
    title: "Impact Reports: QA summaries",
    detail: "Generate formatted QA reports with findings, ratings, and improvement actions.",
    href: "#",
  },
];

// Activity log - QA level
const activityLog = [
  "Standards Compliance: IT General Controls evaluated—92% compliance score suggested.",
  "Pattern Analyzer: Sample size justification pattern identified across 3 IT audits.",
  "Feedback Composer: Draft feedback prepared for Sarah Chen (IT General Controls).",
  "Quality Scorer: Revenue Cycle Audit rated 95%—exemplary sample documentation noted.",
  "Improvement Tracker: Sampling template update moved to In Progress by Methodology Team.",
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
            <span className="text-sm font-semibold text-[#f0f6fc]">QA Reviewer Dashboard</span>
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
                className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-medium text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]"
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
                className="rounded-full border border-[#58a6ff] bg-[#161b22] px-3 py-1 text-xs font-semibold text-[#58a6ff] hover:bg-[#21262d]"
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
            <span className="text-sm font-semibold text-[#f0f6fc]">Quality Assurance Hub</span>
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
            <span className="font-medium">Activity</span>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">({activityCount})</span>
          </button>

          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]" aria-label="Notifications">
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[#f0883e] ring-2 ring-[#0d1117]" />
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

          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#a371f7] to-[#f0883e]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function CycleHeader({ isCompact = false }: { isCompact?: boolean }) {
  const progressPercent = Math.round((currentCycle.auditsReviewed / currentCycle.auditsInScope) * 100);
  
  if (isCompact) {
    return (
      <div className="rounded-2xl border border-[#30363d] bg-[#0d1117]/80 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6e7681]">Current QA Cycle</p>
            <h2 className="text-lg font-semibold text-[#f0f6fc]">{currentCycle.name}</h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-[#a371f7]">{progressPercent}%</p>
            <p className="text-xs text-[#8b949e]">{currentCycle.auditsReviewed}/{currentCycle.auditsInScope} reviewed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#30363d] bg-[#0d1117]/80 p-8 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Current QA Cycle</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#f0f6fc]">{currentCycle.name}</h1>
          <p className="mt-1 text-sm text-[#8b949e]">Framework: {currentCycle.framework} · Due {currentCycle.dueDate}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/10 px-4 py-2 text-center">
            <p className="text-2xl font-semibold text-[#3fb950]">{currentCycle.auditsReviewed}</p>
            <p className="text-xs text-[#8b949e]">Complete</p>
          </div>
          <div className="rounded-xl border border-[#f0883e]/30 bg-[#f0883e]/10 px-4 py-2 text-center">
            <p className="text-2xl font-semibold text-[#f0883e]">{currentCycle.auditsInProgress}</p>
            <p className="text-xs text-[#8b949e]">In Review</p>
          </div>
          <div className="rounded-xl border border-[#8b949e]/30 bg-[#8b949e]/10 px-4 py-2 text-center">
            <p className="text-2xl font-semibold text-[#8b949e]">{currentCycle.auditsPending}</p>
            <p className="text-xs text-[#8b949e]">Pending</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#8b949e]">Review Cycle Progress</span>
          <span className="font-medium text-[#f0f6fc]">{currentCycle.auditsReviewed} of {currentCycle.auditsInScope} audits reviewed</span>
        </div>
        <div className="mt-2 h-3 w-full rounded-full bg-[#30363d]">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-[#a371f7] to-[#3fb950]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-[#8b949e]">
          QA cycle on track. Audit quality remains high—focus on consistency improvements.
        </p>
      </div>
    </div>
  );
}

function PromptBox() {
  const prompts = [
    "Evaluate audit quality",
    "Draft feedback",
    "Identify patterns",
    "Update QA checklist",
  ];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="mt-2 text-lg font-semibold text-[#f0f6fc]">
            Your QA assistant is ready to help.
          </h3>
          <p className="mt-2 text-sm text-[#8b949e]">
            Evaluate audits against standards, draft constructive feedback, identify cross-audit patterns, or update QA frameworks.
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-[#30363d] bg-[#0d1117] p-4">
        <textarea
          className="min-h-[96px] w-full resize-none bg-transparent text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none"
          placeholder="e.g., What patterns do you see across the IT audits this quarter? Or: Help me draft feedback for Sarah's IT General Controls audit."
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a371f7]/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a371f7" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#f0f6fc]">Ask QA Assistant</p>
          <p className="text-xs text-[#8b949e]">Tap to get help</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7681" strokeWidth="2">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}

function MobileAuditsCard() {
  const pending = auditsToReview.filter(a => a.status === "Ready for Review").length;
  
  return (
    <div className="rounded-2xl border border-[#a371f7]/30 bg-[#a371f7]/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a371f7]/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a371f7" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f0f6fc]">{auditsToReview.length} audits</p>
            <p className="text-xs text-[#8b949e]">{pending} ready for review</p>
          </div>
        </div>
        <button className="rounded-xl border border-[#a371f7] bg-[#a371f7]/10 px-3 py-2 text-xs font-medium text-[#a371f7]">
          View
        </button>
      </div>
    </div>
  );
}

function PatternsCard({ isCompact = false }: { isCompact?: boolean }) {
  if (isCompact) {
    const improvements = patternsIdentified.filter(p => p.type === "improvement").length;
    return (
      <div className="rounded-2xl border border-[#f0883e]/30 bg-[#f0883e]/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0883e]/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0883e" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f0f6fc]">{patternsIdentified.length} patterns</p>
              <p className="text-xs text-[#8b949e]">{improvements} need attention</p>
            </div>
          </div>
          <button className="rounded-xl border border-[#f0883e] bg-[#f0883e]/10 px-3 py-2 text-xs font-medium text-[#f0883e]">
            View
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0883e]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0883e" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f0f6fc]">Patterns identified across audits</h3>
            <p className="text-xs text-[#8b949e]">AI analyzed recent audits for trends</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-[#30363d]">
        {patternsIdentified.map((pattern, idx) => (
          <div key={`${pattern.title}-${idx}`} className="px-5 py-3 hover:bg-[#21262d]/50">
            <div className="flex items-start gap-4">
              <div className={cn(
                "mt-1 h-2 w-2 rounded-full",
                pattern.type === "improvement" ? "bg-[#f0883e]" : "bg-[#3fb950]"
              )} />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-[#f0f6fc]">{pattern.title}</span>
                  <span className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                    pattern.type === "improvement"
                      ? "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]"
                      : "border-[#3fb950]/30 bg-[#3fb950]/10 text-[#3fb950]"
                  )}>
                    {pattern.type === "improvement" ? "Improvement" : "Best Practice"}
                  </span>
                  <span className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                    pattern.priority === "High" ? "border-[#da3633]/30 bg-[#da3633]/10 text-[#da3633]" :
                    pattern.priority === "Medium" ? "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]" :
                    "border-[#8b949e]/30 bg-[#8b949e]/10 text-[#8b949e]"
                  )}>
                    {pattern.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#8b949e]">{pattern.detail}</p>
                <div className="mt-2 rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2">
                  <p className="text-xs text-[#6e7681]">
                    <span className="font-medium text-[#8b949e]">Recommendation:</span> {pattern.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
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
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">QA activity</p>
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
                    <div className="mt-1 h-2 w-2 rounded-full bg-[#a371f7]" />
                    <p className="text-sm text-[#8b949e]">{entry}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}

        {/* QA Cycle header */}
        <CycleHeader isCompact={isIphone} />

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
                QA Agents
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
                  Agent Capabilities
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
                    className="inline-flex items-center rounded-full border border-[#58a6ff] bg-[#58a6ff] px-3 py-1.5 text-xs font-medium text-[#0d1117] hover:bg-[#79b8ff]"
                  >
                    Use now
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

        {/* Audits to review - the QA reviewer's primary queue */}
        {!isIphone && (
          <section className="mt-8">
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#a371f7]/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12l2 2 4-4" stroke="#a371f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#a371f7" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#f0f6fc]">Audits in QA queue</h3>
                    <p className="text-xs text-[#8b949e]">AI has pre-scanned each audit for focus areas</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-[#30363d]">
                {auditsToReview.map((audit, idx) => (
                  <div key={`${audit.name}-${idx}`} className={cn(
                    "flex items-center justify-between px-5 py-3 hover:bg-[#21262d]/50",
                    isIpad && "flex-col items-start gap-3"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        audit.status === "Review Complete" ? "bg-[#3fb950]" :
                        audit.status === "In Review" ? "bg-[#f0883e]" : "bg-[#8b949e]"
                      )} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-[#f0f6fc]">{audit.name}</span>
                          <span className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            audit.riskRating === "High"
                              ? "border-[#da3633]/30 bg-[#da3633]/10 text-[#da3633]"
                              : "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]"
                          )}>
                            {audit.riskRating} Risk
                          </span>
                        </div>
                        <div className="mt-0.5 text-xs text-[#6e7681]">
                          {audit.auditor} · Manager: {audit.manager} · Completed {audit.completed}
                        </div>
                        <div className="mt-1 text-xs text-[#8b949e] italic">
                          AI: {audit.aiAssessment}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {audit.complianceScore && (
                        <span className="rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-xs font-medium text-[#3fb950]">
                          {audit.complianceScore}%
                        </span>
                      )}
                      <span className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        audit.status === "Review Complete" ? "border-[#3fb950]/30 bg-[#3fb950]/10 text-[#3fb950]" :
                        audit.status === "In Review" ? "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]" :
                        "border-[#8b949e]/30 bg-[#8b949e]/10 text-[#8b949e]"
                      )}>
                        {audit.status}
                      </span>
                      {audit.status !== "Review Complete" && (
                        <button className="rounded-lg border border-[#a371f7] bg-[#a371f7]/10 px-3 py-1.5 text-xs font-medium text-[#a371f7] hover:bg-[#a371f7]/20">
                          {audit.status === "In Review" ? "Continue" : "Start Review"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Mobile audits card */}
        {isIphone && (
          <section className="mt-6 space-y-3">
            <MobileAuditsCard />
            <PatternsCard isCompact />
          </section>
        )}

        {/* Patterns identified - desktop/iPad only */}
        {!isIphone && (
          <section className="mt-8">
            <PatternsCard />
          </section>
        )}

        {/* Today's QA tasks */}
        <section className="mt-10">
          <SectionHeader 
            title={isIphone ? "Today's tasks" : "Your QA tasks for today"}
            description={!isIphone ? "AI has prepared materials for each review" : undefined}
          />
          <div className={cn(
            "mt-6 grid gap-6",
            device === "desktop" && "lg:grid-cols-3",
            isIpad && "grid-cols-1"
          )}>
            <div className={cn(device === "desktop" && "lg:col-span-2")}>
              <div className="space-y-3">
                {(isIphone ? todaysTasks.slice(0, 2) : todaysTasks).map((task) => (
                  <div
                    key={task.title}
                    className={cn(
                      "rounded-2xl border border-[#30363d] bg-[#161b22] px-5 py-4 shadow-sm",
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
                          )}>{task.title}</h3>
                          {task.aiReady && (
                            <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] font-medium text-[#a371f7]">
                              AI Ready
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          "mt-1 text-sm text-[#8b949e]",
                          isIphone && "text-xs"
                        )}>{task.detail}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-[#6e7681]">
                          <span className="rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-2 py-0.5 text-[11px] text-[#58a6ff]">
                            {task.audit}
                          </span>
                          <span>·</span>
                          <span>~{task.timeEstimate}</span>
                        </div>
                      </div>
                      <button className={cn(
                        "shrink-0 rounded-xl border border-[#a371f7] bg-[#a371f7]/10 px-3 py-2 text-sm text-[#a371f7] hover:bg-[#a371f7]/20",
                        isMobile && "w-full"
                      )}>
                        Start
                      </button>
                    </div>
                  </div>
                ))}
                {isIphone && todaysTasks.length > 2 && (
                  <button className="w-full rounded-xl border border-[#30363d] bg-[#21262d] px-4 py-3 text-sm text-[#8b949e]">
                    View {todaysTasks.length - 2} more tasks
                  </button>
                )}
              </div>
            </div>
            {/* Improvement actions sidebar - hidden on iPhone */}
            {!isIphone && (
              <div>
                <Card className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">
                    Improvement Tracker
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#f0f6fc]">
                    Open Actions
                  </h3>
                  <p className="mt-2 text-sm text-[#8b949e]">
                    Process improvements from prior QA reviews.
                  </p>
                  <div className="mt-4 space-y-3">
                    {improvementActions.map((action) => (
                      <div
                        key={action.action}
                        className={cn(
                          "rounded-xl border bg-[#0d1117] px-4 py-3",
                          action.status === "Overdue" ? "border-[#da3633]/30" : "border-[#30363d]"
                        )}
                      >
                        <h4 className="text-sm font-medium text-[#f0f6fc]">{action.action}</h4>
                        <div className="mt-2 flex items-center gap-2 text-xs text-[#6e7681]">
                          <span>{action.owner}</span>
                          <span>·</span>
                          <span>Due {action.dueDate}</span>
                        </div>
                        <div className="mt-2">
                          <span className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            action.status === "Overdue" ? "border-[#da3633]/30 bg-[#da3633]/10 text-[#da3633]" :
                            action.status === "In Progress" ? "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]" :
                            "border-[#3fb950]/30 bg-[#3fb950]/10 text-[#3fb950]"
                          )}>
                            {action.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* What's new - desktop only */}
        {device === "desktop" && (
          <section className="mt-12">
            <SectionHeader title="What's New" description="AI capabilities for QA reviewers" />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {whatsNew.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group block rounded-2xl border border-[#30363d] bg-[#161b22] px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:border-[#a371f7]/50 hover:bg-[#21262d]"
                >
                  <h3 className="text-sm font-semibold text-[#f0f6fc]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#8b949e]">{item.detail}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#a371f7] opacity-0 transition group-hover:opacity-100">
                    Learn more
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className={cn(
          "mt-14 border-t border-[#30363d] bg-[#0d1117] px-5 py-5",
          isIphone && "mt-8 px-4 py-4"
        )}>
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Activity log</p>
              {!isIphone && (
                <p className="mt-1 text-sm text-[#8b949e]">
                  QA activity today
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
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a371f7]" />
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
