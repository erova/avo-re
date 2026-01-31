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

// Auditor-focused agents - hands-on execution support
const agents: AgentStatus[] = [
  {
    name: "Evidence Tracker",
    lastRun: "5 minutes ago",
    nextRun: "in 10 minutes",
    note: "Tracking 8 evidence requests; 5 received, 3 pending—1 overdue from AP team",
    state: "1 needs follow-up",
    criteria: ["Request send/receive tracking", "Response time monitoring", "Completeness validation", "Auto-reminder triggers"],
  },
  {
    name: "Testing Assistant",
    lastRun: "12 minutes ago",
    nextRun: "in 20 minutes",
    note: "Test procedures ready for AC-4 and AC-5; sample sizes calculated based on population",
    state: "Procedures ready",
    criteria: ["Test procedure generation", "Sample size calculation", "Attribute selection", "Prior year reference"],
  },
  {
    name: "Documentation Helper",
    lastRun: "30 minutes ago",
    nextRun: "in 1 hour",
    note: "Gathered 12 relevant policies and 3 prior audit reports for your current testing",
    state: "Materials ready",
    criteria: ["Policy/procedure retrieval", "Prior audit synthesis", "Process flow mapping", "Control matrix updates"],
  },
  {
    name: "Finding Drafter",
    lastRun: "45 minutes ago",
    nextRun: "in 2 hours",
    note: "Draft finding prepared for SOD exception; severity assessed as Medium based on criteria",
    state: "Draft ready",
    criteria: ["Exception documentation", "Severity assessment", "Root cause suggestions", "Recommendation drafting"],
  },
  {
    name: "Interview Prep",
    lastRun: "2 hours ago",
    nextRun: "tomorrow, 8:00 AM",
    note: "Controller interview tomorrow—script prepared with historical context and focus areas",
    state: "Script ready",
    criteria: ["Stakeholder profiling", "Historical context", "Question preparation", "Meeting scheduling"],
  },
];

// Auditor's current engagement context
const currentEngagement = {
  name: "IT General Controls",
  client: "Acme Corp",
  phase: "Fieldwork",
  progress: 67,
  controlsTested: 8,
  controlsTotal: 12,
  dueDate: "Feb 7, 2025",
  manager: "Alex Thompson",
};

// Evidence requests the auditor is tracking
const evidenceRequests = [
  {
    control: "AC-2: Access Provisioning",
    requestedFrom: "James Miller (IT Security)",
    requested: "3 days ago",
    status: "Received",
    items: "User access reports for Q4",
    aiNote: "Evidence complete—ready for testing",
  },
  {
    control: "AC-3: Access Enforcement",
    requestedFrom: "Sarah Lee (IT Operations)",
    requested: "2 days ago",
    status: "Received",
    items: "Authentication logs, MFA configuration",
    aiNote: "Evidence received—sample selected",
  },
  {
    control: "AC-4: Information Flow",
    requestedFrom: "Mike Chen (Network Admin)",
    requested: "4 days ago",
    status: "Overdue",
    items: "Firewall rules, network segmentation docs",
    aiNote: "2 days overdue—suggest follow-up email",
  },
  {
    control: "AC-5: Separation of Duties",
    requestedFrom: "Lisa Park (AP Manager)",
    requested: "1 day ago",
    status: "Pending",
    items: "Role matrix, incompatible duties report",
    aiNote: "On track—due tomorrow",
  },
];

// Today's testing tasks
const todaysTasks = [
  {
    title: "Complete AC-2 testing (3 samples remaining)",
    detail: "Access provisioning test 80% complete. AI selected 3 more samples from new hires in December—evidence already gathered.",
    control: "Diligent Audit",
    type: "testing",
    timeEstimate: "45 min",
    aiReady: true,
  },
  {
    title: "Follow up on overdue evidence request",
    detail: "Firewall rules from Network Admin are 2 days overdue. AI drafted a polite follow-up email—review and send.",
    control: "Diligent Audit",
    type: "follow-up",
    timeEstimate: "5 min",
    aiReady: true,
  },
  {
    title: "Review AI-drafted SOD finding",
    detail: "Exception identified: AP clerk has conflicting access. AI assessed as Medium severity with draft recommendation—validate before submitting to manager.",
    control: "Diligent Audit",
    type: "finding",
    timeEstimate: "20 min",
    aiReady: true,
  },
  {
    title: "Prep for Controller interview tomorrow",
    detail: "AI prepared interview script covering journal entry controls and month-end close. Review questions and add any specific areas you want to probe.",
    control: "Diligent Audit",
    type: "prep",
    timeEstimate: "15 min",
    aiReady: true,
  },
];

// Recent workpaper activity
const recentWorkpapers = [
  {
    name: "AC-2 Access Provisioning",
    status: "In Progress",
    lastEdit: "2 hours ago",
    completion: 80,
  },
  {
    name: "AC-3 Access Enforcement",
    status: "In Progress",
    lastEdit: "Yesterday",
    completion: 60,
  },
  {
    name: "AC-1 Account Management",
    status: "Submitted",
    lastEdit: "Jan 14",
    completion: 100,
  },
  {
    name: "CM-1 Configuration Mgmt",
    status: "Submitted",
    lastEdit: "Jan 13",
    completion: 100,
  },
];

// What's new for auditors
const whatsNew = [
  {
    title: "Diligent Audit: Offline & mobile",
    detail: "Capture evidence and test results on-site without connectivity—syncs automatically later.",
    href: "#",
  },
  {
    title: "ACL Analytics: Natural language",
    detail: "Use AI Studio to explore data and build tests with plain English prompts.",
    href: "#",
  },
  {
    title: "Assessments: PBC requests",
    detail: "Orchestrate evidence requests through structured workflows—reduce email coordination.",
    href: "#",
  },
];

// Activity log - auditor level
const activityLog = [
  "AC-2 Testing: Completed 2 sample tests—no exceptions noted.",
  "Evidence Tracker: Sarah Lee submitted authentication logs for AC-3.",
  "Finding Drafter: SOD exception documented—draft finding ready for your review.",
  "Documentation Helper: Retrieved 3 prior audit reports related to access controls.",
  "Interview Prep: Controller interview script prepared for tomorrow.",
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
            <span className="text-sm font-semibold text-[#f0f6fc]">Auditor Dashboard</span>
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
                className="rounded-full border border-[#58a6ff] bg-[#161b22] px-3 py-1 text-xs font-semibold text-[#58a6ff] hover:bg-[#21262d]"
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
            <span className="text-sm font-semibold text-[#f0f6fc]">Auditor Workspace</span>
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

          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3fb950] to-[#58a6ff]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function EngagementHeader({ isCompact = false }: { isCompact?: boolean }) {
  if (isCompact) {
    return (
      <div className="rounded-2xl border border-[#30363d] bg-[#0d1117]/80 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6e7681]">Current Engagement</p>
            <h2 className="text-lg font-semibold text-[#f0f6fc]">{currentEngagement.name}</h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-[#3fb950]">{currentEngagement.progress}%</p>
            <p className="text-xs text-[#8b949e]">{currentEngagement.controlsTested}/{currentEngagement.controlsTotal} controls</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#30363d] bg-[#0d1117]/80 p-8 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6e7681]">Current Engagement</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#f0f6fc]">{currentEngagement.name}</h1>
          <p className="mt-1 text-sm text-[#8b949e]">{currentEngagement.client} · Manager: {currentEngagement.manager}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-[#6e7681]">Phase</p>
              <p className="text-sm font-medium text-[#f0f6fc]">{currentEngagement.phase}</p>
            </div>
            <div>
              <p className="text-xs text-[#6e7681]">Due</p>
              <p className="text-sm font-medium text-[#f0f6fc]">{currentEngagement.dueDate}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#8b949e]">Fieldwork Progress</span>
          <span className="font-medium text-[#f0f6fc]">{currentEngagement.controlsTested} of {currentEngagement.controlsTotal} controls tested</span>
        </div>
        <div className="mt-2 h-3 w-full rounded-full bg-[#30363d]">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-[#3fb950] to-[#58a6ff]"
            style={{ width: `${currentEngagement.progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-[#8b949e]">
          Your fieldwork is progressing well. On track to complete by {currentEngagement.dueDate}.
        </p>
      </div>
    </div>
  );
}

function PromptBox() {
  const prompts = [
    "Draft a finding",
    "Prepare test steps",
    "Send evidence request",
    "Interview questions",
  ];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="mt-2 text-lg font-semibold text-[#f0f6fc]">
            Your AI audit assistant is ready to help.
          </h3>
          <p className="mt-2 text-sm text-[#8b949e]">
            Draft findings, prepare test procedures, send evidence requests, or get help with interview prep—all from one prompt.
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-[#30363d] bg-[#0d1117] p-4">
        <textarea
          className="min-h-[96px] w-full resize-none bg-transparent text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none"
          placeholder="e.g., Help me draft a finding for the segregation of duties exception I found. Or: What questions should I ask the Controller about journal entry approvals?"
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3fb950]/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
            <path d="M12 12 2.1 9.1" />
            <path d="m12 12 3.9 7.8" />
            <path d="m12 12 7.8-3.9" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#f0f6fc]">Ask Audit AI</p>
          <p className="text-xs text-[#8b949e]">Tap to get help</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7681" strokeWidth="2">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}

function MobileEvidenceCard() {
  const overdue = evidenceRequests.filter(r => r.status === "Overdue").length;
  const pending = evidenceRequests.filter(r => r.status === "Pending").length;
  
  return (
    <div className={cn(
      "rounded-2xl border p-4",
      overdue > 0 ? "border-[#da3633]/30 bg-[#da3633]/5" : "border-[#3fb950]/30 bg-[#3fb950]/5"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            overdue > 0 ? "bg-[#da3633]/20" : "bg-[#3fb950]/20"
          )}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={overdue > 0 ? "#da3633" : "#3fb950"} strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f0f6fc]">{evidenceRequests.length} evidence requests</p>
            <p className="text-xs text-[#8b949e]">{overdue > 0 ? `${overdue} overdue` : `${pending} pending`}</p>
          </div>
        </div>
        <button className={cn(
          "rounded-xl border px-3 py-2 text-xs font-medium",
          overdue > 0 
            ? "border-[#da3633] bg-[#da3633]/10 text-[#da3633]"
            : "border-[#3fb950] bg-[#3fb950]/10 text-[#3fb950]"
        )}>
          {overdue > 0 ? "Follow up" : "View"}
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
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Today&apos;s activity</p>
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

        {/* Engagement header */}
        <EngagementHeader isCompact={isIphone} />

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
                Audit Assistants
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
                  Assistant Capabilities
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

        {/* Evidence requests tracking - the auditor's key queue */}
        {!isIphone && (
          <section className="mt-8">
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#58a6ff]/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#58a6ff" strokeWidth="2"/>
                      <path d="M14 2v6h6" stroke="#58a6ff" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#f0f6fc]">Evidence requests</h3>
                    <p className="text-xs text-[#8b949e]">Track what you&apos;re waiting on from auditees</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-xs font-medium text-[#3fb950]">
                    {evidenceRequests.filter(r => r.status === "Received").length} received
                  </span>
                  {evidenceRequests.filter(r => r.status === "Overdue").length > 0 && (
                    <span className="rounded-full border border-[#da3633]/30 bg-[#da3633]/10 px-2 py-0.5 text-xs font-medium text-[#da3633]">
                      {evidenceRequests.filter(r => r.status === "Overdue").length} overdue
                    </span>
                  )}
                </div>
              </div>
              <div className="divide-y divide-[#30363d]">
                {evidenceRequests.map((req, idx) => (
                  <div key={`${req.control}-${idx}`} className={cn(
                    "flex items-center justify-between px-5 py-3 hover:bg-[#21262d]/50",
                    isIpad && "flex-col items-start gap-3"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        req.status === "Received" ? "bg-[#3fb950]" :
                        req.status === "Overdue" ? "bg-[#da3633]" : "bg-[#f0883e]"
                      )} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#f0f6fc]">{req.control}</span>
                        </div>
                        <div className="mt-0.5 text-xs text-[#8b949e]">
                          {req.items}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#6e7681]">
                          <span>{req.requestedFrom}</span>
                          <span>·</span>
                          <span>Requested {req.requested}</span>
                        </div>
                        <div className="mt-1 text-xs text-[#8b949e] italic">
                          AI: {req.aiNote}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        req.status === "Received" ? "border-[#3fb950]/30 bg-[#3fb950]/10 text-[#3fb950]" :
                        req.status === "Overdue" ? "border-[#da3633]/30 bg-[#da3633]/10 text-[#da3633]" :
                        "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]"
                      )}>
                        {req.status}
                      </span>
                      {req.status === "Overdue" && (
                        <button className="rounded-lg border border-[#da3633] bg-[#da3633]/10 px-3 py-1.5 text-xs font-medium text-[#da3633] hover:bg-[#da3633]/20">
                          Send reminder
                        </button>
                      )}
                      {req.status === "Received" && (
                        <button className="rounded-lg border border-[#3fb950] bg-[#3fb950]/10 px-3 py-1.5 text-xs font-medium text-[#3fb950] hover:bg-[#3fb950]/20">
                          Start testing
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#30363d] bg-[#0d1117]/30 px-5 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6e7681]">Evidence Tracker monitors response times and drafts follow-up emails automatically</span>
                  <button className="text-xs font-medium text-[#58a6ff] hover:underline">
                    Send new request →
                  </button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Mobile evidence card */}
        {isIphone && (
          <section className="mt-6">
            <MobileEvidenceCard />
          </section>
        )}

        {/* Today's tasks */}
        <section className="mt-10">
          <SectionHeader 
            title={isIphone ? "Today's tasks" : "Your tasks for today"}
            description={!isIphone ? "AI has prepared materials for each task" : undefined}
          />
          <div className="mt-5 space-y-3">
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
                        <span className="rounded-full border border-[#3fb950]/40 bg-[#3fb950]/10 px-2 py-0.5 text-[10px] font-medium text-[#3fb950]">
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
                        {task.control}
                      </span>
                      <span>·</span>
                      <span>~{task.timeEstimate}</span>
                    </div>
                  </div>
                  <button className={cn(
                    "shrink-0 rounded-xl border border-[#58a6ff] bg-[#58a6ff]/10 px-3 py-2 text-sm text-[#58a6ff] hover:bg-[#58a6ff]/20",
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
        </section>

        {/* Workpapers in progress */}
        <section className="mt-12">
          <SectionHeader 
            title="Your workpapers"
            description={!isIphone ? "Continue working on your documentation" : undefined}
          />
          <div className={cn(
            "mt-6 grid gap-6",
            device === "desktop" && "lg:grid-cols-3",
            isIpad && "grid-cols-1"
          )}>
            <div className={cn(device === "desktop" && "lg:col-span-2")}>
              <div className={cn(
                "grid gap-3",
                device === "desktop" && "md:grid-cols-2",
                isIpad && "grid-cols-2"
              )}>
                {recentWorkpapers.map((wp) => (
                  <a
                    key={wp.name}
                    href="#"
                    className="group block rounded-2xl border border-[#30363d] bg-[#161b22] px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:border-[#58a6ff]/50 hover:bg-[#21262d]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-[#f0f6fc]">{wp.name}</h3>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            wp.status === "Submitted" 
                              ? "border-[#3fb950]/30 bg-[#3fb950]/10 text-[#3fb950]"
                              : "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]"
                          )}>
                            {wp.status}
                          </span>
                          <span className="text-xs text-[#6e7681]">{wp.lastEdit}</span>
                        </div>
                        <div className="mt-2">
                          <div className="h-1.5 w-full rounded-full bg-[#30363d]">
                            <div 
                              className={cn(
                                "h-1.5 rounded-full",
                                wp.completion === 100 ? "bg-[#3fb950]" : "bg-[#58a6ff]"
                              )}
                              style={{ width: `${wp.completion}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-[#6e7681] opacity-0 transition group-hover:opacity-100">
                        Open
                      </span>
                    </div>
                  </a>
                ))}
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
                    Tools for Auditors
                  </h3>
                  <p className="mt-2 text-sm text-[#8b949e]">
                    AI assistants designed to help you work more efficiently.
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
                          Learn more
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
              <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Activity log</p>
              {!isIphone && (
                <p className="mt-1 text-sm text-[#8b949e]">
                  Your work activity today
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
