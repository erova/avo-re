"use client";

import React from "react";
import { TamboProvider, useTamboThread } from "@tambo-ai/react";
import {
  CanvasType,
  WorkflowCanvas,
  DocumentCanvas,
  ReportingCanvas,
  SearchCanvas,
  MeetingCanvas,
  EmailCanvas,
  tamboCanvasComponents,
  SearchResultCard,
  ContractSummaryCard,
  MeetingProposalCard,
  ReportInsightCard,
  EmailDraftCard,
} from "./canvases";

// Grayscale SVG Icons
const Icons = {
  workflow: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  document: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  reporting: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  meeting: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
};

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

type Vision = "near-term" | "future";
type DeviceType = "desktop" | "ipad" | "iphone";

type AgentStatus = {
  name: string;
  lastRun: string;
  nextRun: string;
  note: string;
  state: string;
  criteria: string[];
  futureNote?: string;
  futureCriteria?: string[];
};

const agents: AgentStatus[] = [
  {
    name: "Matter Monitor",
    lastRun: "12 minutes ago",
    nextRun: "in 18 minutes",
    note: "All active matters on track; no new filings detected",
    state: "Monitoring active",
    criteria: ["New court filings", "Deadline proximity alerts", "Matter status changes"],
    futureNote: "Predictive case outcome modeling active; settlement recommendations ready",
    futureCriteria: ["Predicted litigation outcomes", "AI-recommended settlement ranges", "Judge/jurisdiction pattern analysis", "Optimal timing recommendations"],
  },
  {
    name: "Contract Intelligence",
    lastRun: "25 minutes ago",
    nextRun: "in 35 minutes",
    note: "142 contracts monitored; 3 renewals approaching",
    state: "Quietly stable",
    criteria: ["Renewal date tracking", "Obligation deadlines", "Term deviation alerts"],
    futureNote: "Auto-negotiation drafts prepared for 3 renewals; risk clauses flagged",
    futureCriteria: ["AI-drafted negotiation positions", "Market-rate benchmarking", "Autonomous redline suggestions", "Counterparty risk scoring"],
  },
  {
    name: "Regulatory Watch",
    lastRun: "1 hour ago",
    nextRun: "in 30 minutes",
    note: "No new regulations impacting operations this week",
    state: "Monitoring active",
    criteria: ["New regulation alerts", "Enforcement action tracking", "Comment period deadlines"],
    futureNote: "Proactive impact analysis complete for 2 pending regulations",
    futureCriteria: ["Predictive regulatory impact modeling", "Auto-generated compliance roadmaps", "Cross-jurisdictional harmonization", "Regulatory relationship mapping"],
  },
  {
    name: "Corporate Governance",
    lastRun: "2 hours ago",
    nextRun: "in 4 hours",
    note: "Board compliance current; next meeting materials due in 12 days",
    state: "On schedule",
    criteria: ["Board meeting prep deadlines", "D&O compliance checks", "Subsidiary governance audits"],
    futureNote: "AI-drafted board materials ready for review; governance gaps auto-remediated",
    futureCriteria: ["Autonomous board brief generation", "Predictive governance risk scoring", "Real-time subsidiary compliance", "Director liability monitoring"],
  },
  {
    name: "Legal Hold Manager",
    lastRun: "3 hours ago",
    nextRun: "tomorrow, 8:00 AM",
    note: "All holds acknowledged; no custodian gaps",
    state: "Standing by",
    criteria: ["Hold acknowledgment tracking", "Custodian compliance", "Data preservation audits"],
    futureNote: "Predictive hold recommendations for emerging matters; auto-scope optimization",
    futureCriteria: ["Predictive litigation hold triggers", "AI-optimized custodian scoping", "Autonomous preservation verification", "Cost-benefit hold analysis"],
  },
];

const recentApps = {
  "near-term": [
    {
      name: "Boards",
      description: "Finalized Q1 board meeting agenda and uploaded supporting materials to the board book.",
      lastUsed: "Jan 16",
      icon: "boards",
    },
    {
      name: "Entities",
      description: "Verified annual report filings for 3 subsidiaries; all jurisdictions current.",
      lastUsed: "Jan 15",
      icon: "entities",
    },
    {
      name: "Policy Manager",
      description: "Reviewed attestation status for updated Code of Conduct; 94% employee completion.",
      lastUsed: "Jan 14",
      icon: "policy",
    },
    {
      name: "Diligent AI Reporting",
      description: "Generated executive summary of legal department KPIs for leadership review.",
      lastUsed: "Jan 12",
      icon: "reporting",
    },
  ],
  "future": [
    {
      name: "AI Legal Workspace",
      description: "Your autonomous agents handled 12 routine matters this week—review the summary.",
      lastUsed: "Today",
      icon: "ai",
      tag: "AI-Managed",
    },
    {
      name: "Predictive Analytics",
      description: "Updated litigation outcome models reflect recent case law changes.",
      lastUsed: "Today",
      icon: "analytics",
      tag: "Auto-Updated",
    },
    {
      name: "Autonomous Filings",
      description: "3 annual reports auto-filed; 2 more awaiting your approval.",
      lastUsed: "Yesterday",
      icon: "filings",
      tag: "Agent Action",
    },
    {
      name: "Board Intelligence",
      description: "AI-drafted board materials ready for your review before auto-distribution.",
      lastUsed: "Yesterday",
      icon: "boards",
      tag: "Draft Ready",
    },
  ],
};

const nextActions = {
  "near-term": [
    {
      title: "Finalize board book for Q1 meeting",
      detail: "Board meeting in 12 days. Review uploaded materials in Boards and confirm director access.",
      app: "Boards",
    },
    {
      title: "Review subsidiary compliance calendar",
      detail: "Annual reports due in 3 jurisdictions next month. Verify registered agent details in Entities.",
      app: "Entities",
    },
    {
      title: "Follow up on policy attestations",
      detail: "Code of Conduct refresh at 94% completion. Send reminders to outstanding employees via Policy Manager.",
      app: "Policy Manager",
    },
    {
      title: "Generate board governance report",
      detail: "Use AI Reporting to compile attendance, voting patterns, and committee activity for audit committee.",
      app: "AI Reporting",
    },
  ],
  "future": [
    {
      title: "Review AI-generated settlement recommendations",
      detail: "System has analyzed case precedents and generated optimal settlement ranges for 2 active matters.",
      tag: "AI-Generated",
    },
    {
      title: "Approve autonomous contract negotiations",
      detail: "AI has drafted counter-proposals for 3 renewals based on market benchmarks and risk tolerance.",
      tag: "Auto-Draft Ready",
    },
    {
      title: "Validate predictive regulatory impact analysis",
      detail: "Proactive compliance roadmap generated for upcoming SEC rule changes.",
      tag: "Predictive",
    },
    {
      title: "Review AI-drafted board presentation",
      detail: "System has compiled legal metrics, risk summaries, and governance updates into presentation format.",
      tag: "Auto-Generated",
    },
  ],
};

const whatsNew = {
  "near-term": [
    {
      title: "Boards: Consent agenda workflows",
      detail: "Streamline routine approvals with new consent agenda templates and e-signatures.",
      href: "#",
    },
    {
      title: "Entities: Jurisdiction alerts",
      detail: "Get notified of filing deadline changes and regulatory updates by jurisdiction.",
      href: "#",
    },
    {
      title: "AI Reporting: Natural language queries",
      detail: "Ask questions in plain English and get instant governance insights.",
      href: "#",
    },
  ],
  "future": [
    {
      title: "Predictive Litigation Outcomes",
      detail: "AI models trained on case law predict outcomes and optimal strategies.",
      href: "#",
    },
    {
      title: "Autonomous Contract Negotiation",
      detail: "AI drafts negotiation positions and redlines based on your playbook.",
      href: "#",
    },
    {
      title: "Proactive Compliance Engine",
      detail: "System anticipates regulatory changes and pre-builds compliance roadmaps.",
      href: "#",
    },
  ],
};

// Near-term: Pending regulatory filings awaiting approval
const pendingFilings = [
  {
    entity: "Acme Holdings, Inc.",
    filing: "Delaware Annual Report",
    jurisdiction: "Delaware",
    dueDate: "Mar 1, 2025",
    status: "Ready to file",
    fee: "$225",
    preparedBy: "Entities",
  },
  {
    entity: "Acme West LLC",
    filing: "Statement of Information",
    jurisdiction: "California",
    dueDate: "Feb 15, 2025",
    status: "Ready to file",
    fee: "$20",
    preparedBy: "Entities",
  },
  {
    entity: "Acme Services Corp.",
    filing: "Annual Report",
    jurisdiction: "Nevada",
    dueDate: "Feb 28, 2025",
    status: "Ready to file",
    fee: "$150",
    preparedBy: "Entities",
  },
];

// Future: Cross-Diligent risk signals requesting GC input
const riskSignals = [
  {
    source: "Risk Manager",
    title: "Litigation exposure assessment needed",
    detail: "Q1 risk register update requires your input on active matter reserves and potential new claims.",
    impact: "High",
    requestedBy: "Chief Risk Officer",
    dueDate: "Jan 24",
  },
  {
    source: "Contract Intelligence",
    title: "Vendor concentration risk identified",
    detail: "3 critical vendors account for 40% of spend. Legal review needed for contingency planning.",
    impact: "Medium",
    requestedBy: "Procurement",
    dueDate: "Jan 28",
  },
  {
    source: "Regulatory Watch",
    title: "SEC rule impact on disclosure obligations",
    detail: "Pending climate disclosure rule may affect 10-K filings. Legal interpretation requested.",
    impact: "High",
    requestedBy: "CFO",
    dueDate: "Feb 1",
  },
];

const activityLog = {
  "near-term": [
    "Boards: Q1 board book updated—3 new documents added by CFO.",
    "Entities: Annual report reminder sent for Delaware subsidiaries (due Feb 28).",
    "Entities: 3 filings prepared and ready for your approval.",
    "Policy Manager: Code of Conduct attestation at 94%—6 employees pending.",
    "AI Reporting: Weekly governance digest generated and emailed to you.",
  ],
  "future": [
    "Risk Manager → Legal: Litigation exposure input requested for Q1 risk register.",
    "Matter Monitor: Predictive model updated—Smith v. Acme settlement probability now 73%.",
    "Contract Intelligence → Risk Manager: Vendor concentration flagged for enterprise risk review.",
    "Your risk input auto-synced to enterprise risk register (3 items updated).",
    "Regulatory Watch: SEC rule impact analysis shared with CFO and Compliance.",
  ],
};

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

function SoftTag({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "ai" | "predictive" }) {
  const styles = {
    default: "border-[#30363d] bg-[#21262d] text-[#8b949e]",
    ai: "border-[#a371f7]/40 bg-[#a371f7]/10 text-[#a371f7]",
    predictive: "border-[#3fb950]/40 bg-[#3fb950]/10 text-[#3fb950]",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium", styles[variant])}>
      {children}
    </span>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm", className)}>{children}</div>
  );
}

function VisionToggle({ vision, onChange }: { vision: Vision; onChange: (v: Vision) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-[#30363d] bg-[#0d1117] p-1">
      <button
        onClick={() => onChange("near-term")}
        className={cn(
          "rounded-lg px-3 py-1.5 text-xs font-medium transition",
          vision === "near-term"
            ? "bg-[#21262d] text-[#f0f6fc]"
            : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        Near-term Vision
      </button>
      <button
        onClick={() => onChange("future")}
        className={cn(
          "rounded-lg px-3 py-1.5 text-xs font-medium transition",
          vision === "future"
            ? "bg-[#a371f7]/20 text-[#a371f7]"
            : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        1 Year+ Vision
      </button>
    </div>
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
        {/* iPhone bezel */}
        <div className="relative rounded-[3rem] border-[14px] border-[#1c1c1e] bg-[#1c1c1e] shadow-2xl">
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-2 z-20 h-[25px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
          {/* Screen */}
          <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[2.5rem] bg-[#0d1117]">
            <div className="h-full w-full overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
        {/* Side button */}
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
        {/* iPad bezel */}
        <div className="relative rounded-[2rem] border-[18px] border-[#1c1c1e] bg-[#1c1c1e] shadow-2xl">
          {/* Camera */}
          <div className="absolute left-1/2 top-3 z-20 h-[8px] w-[8px] -translate-x-1/2 rounded-full bg-[#2c2c2e]" />
          {/* Screen */}
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
  vision, 
  onVisionChange,
  device,
  onDeviceChange,
}: { 
  vision: Vision; 
  onVisionChange: (v: Vision) => void;
  device: DeviceType;
  onDeviceChange: (d: DeviceType) => void;
}) {
  return (
    <>
      {/* Top bar with version selector */}
      <div className="w-full border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6e7681]">Prototype</span>
            <span className="text-sm font-semibold text-[#f0f6fc]">General Counsel Command Center</span>
          </div>
          
          {/* Version Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6e7681]">Model:</span>
              <div className="flex rounded-lg border border-[#30363d] bg-[#0d1117] p-0.5">
                <a
                  href="/now/agentic-hero/dark/general-counsel"
                  className="rounded-md bg-[#58a6ff] px-3 py-1.5 text-xs font-medium text-white"
                >
                  Canvas Overlay
                </a>
                <a
                  href="/now/agentic-hero/dark/general-counsel/v2"
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc]"
                >
                  Split Workspace
                </a>
                <a
                  href="/now/agentic-hero/dark/general-counsel/v3"
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc]"
                >
                  Chat Thread
                </a>
              </div>
            </div>
            <span className="text-[#30363d]">|</span>
            <VisionToggle vision={vision} onChange={onVisionChange} />
          </div>
        </div>
      </div>

      {/* Device selector - closer to content */}
      <div className="flex justify-center bg-[#0d1117] py-4">
        <div className="flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] p-1">
          {[
            { id: "desktop" as DeviceType, icon: "🖥️", label: "Desktop" },
            { id: "ipad" as DeviceType, icon: "📱", label: "iPad" },
            { id: "iphone" as DeviceType, icon: "📱", label: "iPhone" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => onDeviceChange(d.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition",
                device === d.id
                  ? "bg-[#21262d] text-[#f0f6fc]"
                  : "text-[#8b949e] hover:text-[#f0f6fc]"
              )}
            >
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function TopNav({
  activityOpen,
  onToggleActivity,
  activityCount,
  vision,
}: {
  activityOpen: boolean;
  onToggleActivity: () => void;
  activityCount: number;
  vision: Vision;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-[#30363d] bg-[#0d1117]/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <DiligentLogo className="h-7 w-auto" />
            <span className="text-sm font-semibold text-[#f0f6fc]">Legal Command Center</span>
          </div>
          {vision === "future" && (
            <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#a371f7]">
              Future Vision
            </span>
          )}
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
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[#da3633] ring-2 ring-[#0d1117]" />
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

          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

// Canvas action buttons configuration
const canvasActions: Array<{ id: CanvasType; label: string; icon: React.ReactNode; description: string }> = [
  { 
    id: "workflow", 
    label: "Start Workflow", 
    icon: Icons.workflow, 
    description: "Complex multi-step tasks",
  },
  { 
    id: "document", 
    label: "Draft Document", 
    icon: Icons.document, 
    description: "Create or review docs",
  },
  { 
    id: "reporting", 
    label: "Run Report", 
    icon: Icons.reporting, 
    description: "Trends & analytics",
  },
  { 
    id: "search", 
    label: "AI Search", 
    icon: Icons.search, 
    description: "Find anything",
  },
  { 
    id: "meeting", 
    label: "Schedule", 
    icon: Icons.meeting, 
    description: "AI finds time",
  },
  { 
    id: "email", 
    label: "Draft Email", 
    icon: Icons.email, 
    description: "Secure sharing",
  },
];

// Tambo-enabled prompt box with chat functionality
// Generate card components based on Tambo response content
function generateCardsFromContent(content: string, query: string): React.ReactNode | undefined {
  const text = (content + " " + query).toLowerCase();
  const q = query.toLowerCase(); // Use query alone for intent detection
  
  // PRIORITY 1: Detect explicit search intent from query (who, find, where, search)
  if (q.includes("who") || q.includes("find") || q.includes("where is") || q.includes("search for") || q.includes("look up")) {
    // Extract name from query if present
    const nameMatch = query.match(/who is (\w+ \w+|\w+)/i) || query.match(/find (\w+ \w+|\w+)/i);
    const name = nameMatch ? nameMatch[1] : "Sarah Chen";
    return (
      <div className="mt-3 space-y-2">
        <SearchResultCard 
          id="search-1"
          title={`${name} - Deputy General Counsel`}
          source="Employee Directory"
          sourceIcon="👤"
          snippet="Specializes in corporate governance and compliance. Primary contact for regulatory filings."
          relevance={98}
          lastModified="Active employee"
          owner="Legal"
        />
      </div>
    );
  }
  
  // PRIORITY 2: Detect email/draft intent from query
  if (q.includes("email") || q.includes("draft") || q.includes("send") || q.includes("compose")) {
    return (
      <div className="mt-3 space-y-2">
        <EmailDraftCard 
          id="email-1"
          to="CFO, Board Secretary"
          subject="Q1 Board Materials - Pre-Read"
          preview="Please find the attached pre-read materials for our upcoming Q1 board meeting on February 14. The financial summary and risk assessment are ready for your review..."
          attachments={["Q1 Financial Summary", "Risk Assessment Update"]}
          isSecure={true}
          status="draft"
        />
      </div>
    );
  }
  
  // PRIORITY 3: Detect meeting/schedule intent from query
  if (q.includes("schedule") || q.includes("meeting") || q.includes("calendar") || q.includes("set up time")) {
    return (
      <div className="mt-3 space-y-2">
        <MeetingProposalCard 
          id="meeting-1"
          time="3:30 PM"
          date="Tomorrow"
          available={true}
          aiNote="Moved low-priority call to open this slot"
          attendeesAvailable={3}
          totalAttendees={3}
        />
      </div>
    );
  }
  
  // PRIORITY 4: Detect contract content from query or response
  if (text.includes("contract") || text.includes("renewal") || text.includes("agreement") || text.includes("vendor")) {
    return (
      <div className="mt-3 space-y-2">
        <ContractSummaryCard 
          id="contract-1"
          title="Master Services Agreement"
          counterparty="Acme Corp"
          value="$2.4M/year"
          renewalDate="Mar 15, 2025"
          owner="Sarah Chen"
          riskScore="65"
          status="Renewal pending"
        />
      </div>
    );
  }
  
  // PRIORITY 5: Detect matter/litigation content
  if (text.includes("matter") || text.includes("litigation") || text.includes("case") || text.includes("lawsuit")) {
    return (
      <div className="mt-3 space-y-2">
        <SearchResultCard 
          id="matter-1"
          title="Smith v. Acme Holdings"
          source="Matter Manager"
          sourceIcon="⚖️"
          snippet="Discovery phase. Document production deadline approaching. 73% favorable outlook."
          relevance={98}
          lastModified="2 days ago"
        />
      </div>
    );
  }
  
  // PRIORITY 6: Detect board/governance content (only if no specific intent above)
  if (q.includes("board") || q.includes("agenda") || q.includes("directors") || q.includes("governance")) {
    return (
      <div className="mt-3 space-y-2">
        <ReportInsightCard 
          id="board-insight"
          title="Board Meeting Status"
          insight="All agenda items finalized. 72% of directors have reviewed materials."
          metric="72%"
          change="+8% from last meeting"
          changeType="positive"
        />
      </div>
    );
  }
  
  return undefined;
}

function TamboPromptBoxWithHooks({ vision, onOpenCanvas }: { vision: Vision; onOpenCanvas: (canvas: CanvasType) => void }) {
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; content: string; component?: React.ReactNode }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [demoMode, setDemoMode] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const tamboThread = useTamboThread();

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if query should open a canvas instead of chat
  const detectCanvasIntent = (query: string): CanvasType | null => {
    const q = query.toLowerCase();
    if (q.includes("workflow") || q.includes("prepare board materials")) return "workflow";
    if (q.includes("draft") && (q.includes("document") || q.includes("memo") || q.includes("letter"))) return "document";
    if (q.includes("report") || q.includes("trend") || q.includes("attendance pattern") || q.includes("voting pattern")) return "reporting";
    if (q.includes("schedule") && (q.includes("meeting") || q.includes("call"))) return "meeting";
    if (q.includes("draft email") || q.includes("send email")) return "email";
    return null;
  };

  const getDemoResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("matter") || q.includes("litigation") || q.includes("smith")) {
      return "I found 2 active matters:\n\n• Smith v. Acme Holdings (Discovery phase, 73% favorable)\n  → Document production deadline: Feb 15\n\n• IP Licensing Dispute (Negotiation, settlement likely)\n  → Counter-proposal awaiting your review";
    }
    if (q.includes("contract") || q.includes("acme") || q.includes("renewal")) {
      return "Sarah Chen (Procurement) owns the Acme Corp relationship.\n\n• Master Services Agreement: $2.4M/year\n• Renewal date: March 15, 2025\n• Status: Renewal pending\n\nWould you like me to schedule a meeting with Sarah?";
    }
    if (q.includes("board") || q.includes("meeting")) {
      return "Your next board meeting is in 12 days (Feb 14).\n\nPreparation status:\n✓ Financial Results Review — Complete\n○ Equity Grant Approval — In progress\n○ Risk Assessment Update — Not started\n\nShould I open the workflow canvas to prepare materials?";
    }
    if (q.includes("who") || q.includes("owner")) {
      return "I searched across Third Party Manager, Entities, and Risk Manager.\n\nSarah Chen (Procurement) is the primary owner:\n• 98% confidence from Contract Manager\n• 92% confidence from Risk Manager";
    }
    return "I can help you with:\n• Active legal matters and litigation status\n• Contract renewals and vendor relationships\n• Board meeting preparation\n• Finding relationship owners across systems";
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue.trim();
    
    // Check if this should open a canvas
    const canvasIntent = detectCanvasIntent(userMessage);
    if (canvasIntent) {
      onOpenCanvas(canvasIntent);
      setInputValue("");
      return;
    }

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsLoading(true);

    if (demoMode) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: getDemoResponse(userMessage) }]);
        setIsLoading(false);
      }, 800);
    } else {
      try {
        const response = await tamboThread.sendThreadMessage(userMessage);
        const rawContent = (response as unknown as Record<string, unknown>)?.content;
        let textContent = "";
        if (typeof rawContent === "string") {
          textContent = rawContent;
        } else if (Array.isArray(rawContent)) {
          textContent = rawContent
            .filter((c): c is { type: string; text: string } => c && typeof c === "object" && "text" in c)
            .map((c) => c.text)
            .join("\n");
        }
        // Generate cards based on response content
        const liveComponent = generateCardsFromContent(textContent, userMessage);
        setMessages(prev => [...prev, { role: "assistant", content: textContent || "I found some relevant information.", component: liveComponent }]);
        setIsLoading(false);
      } catch (err) {
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Unknown error"}. Try demo mode.` }]);
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#f0f6fc]">
            {vision === "near-term" ? "What do you need to do?" : "Direct your autonomous Legal AI workforce."}
          </h3>
          <p className="mt-1 text-sm text-[#8b949e]">
            Ask questions or choose an action below. Work entirely within Diligent.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-[#30363d] bg-[#21262d] p-0.5">
            <button onClick={() => setDemoMode(true)} className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium transition", demoMode ? "bg-[#161b22] text-[#f0f6fc]" : "text-[#6e7681] hover:text-[#8b949e]")}>Demo</button>
            <button onClick={() => setDemoMode(false)} className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium transition", !demoMode ? "bg-[#161b22] text-[#f0f6fc]" : "text-[#6e7681] hover:text-[#8b949e]")}>Live</button>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[#a371f7]/10 px-2 py-0.5 text-[10px] text-[#a371f7]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a371f7]" />Tambo
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="mt-4 max-h-[400px] space-y-3 overflow-y-auto rounded-xl border border-[#30363d] bg-[#0d1117] p-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === "user" ? "flex justify-end" : ""}>
              {msg.role === "user" ? (
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#30363d] px-3 py-2">
                  <p className="whitespace-pre-wrap text-sm text-[#f0f6fc]">{msg.content}</p>
                </div>
              ) : (
                <div className="w-full space-y-2">
                  <div className="rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2">
                    <p className="whitespace-pre-wrap text-sm text-[#f0f6fc]">{msg.content}</p>
                  </div>
                  {msg.component && <div>{msg.component}</div>}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#58a6ff]" />
              <span className="text-xs text-[#8b949e]">Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#0d1117] p-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={isLoading}
          className="flex-1 bg-transparent px-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none"
          placeholder="Ask a question or describe what you need..."
        />
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isLoading}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#58a6ff] text-white transition hover:bg-[#79b8ff] disabled:opacity-50"
        >
          {Icons.send}
        </button>
      </div>

      {/* Canvas Action Buttons */}
      <div className="mt-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6e7681]">Or start with</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {canvasActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onOpenCanvas(action.id)}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-[#30363d] bg-[#21262d] p-3 text-[#8b949e] transition hover:border-[#58a6ff]/50 hover:bg-[#30363d] hover:text-[#f0f6fc]"
            >
              <span className="flex h-8 w-8 items-center justify-center">{action.icon}</span>
              <span className="text-xs font-medium text-[#f0f6fc]">{action.label}</span>
              <span className="hidden text-[10px] text-[#6e7681] sm:block">{action.description}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Demo-only version (no Tambo hooks)
function TamboPromptBoxDemoOnly({ vision, onOpenCanvas }: { vision: Vision; onOpenCanvas: (canvas: CanvasType) => void }) {
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectCanvasIntent = (query: string): CanvasType | null => {
    const q = query.toLowerCase();
    if (q.includes("workflow") || q.includes("prepare board materials")) return "workflow";
    if (q.includes("draft") && (q.includes("document") || q.includes("memo") || q.includes("letter"))) return "document";
    if (q.includes("report") || q.includes("trend") || q.includes("attendance pattern") || q.includes("voting pattern")) return "reporting";
    if (q.includes("schedule") && (q.includes("meeting") || q.includes("call"))) return "meeting";
    if (q.includes("draft email") || q.includes("send email")) return "email";
    return null;
  };

  const getDemoResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("matter") || q.includes("litigation") || q.includes("smith")) {
      return "I found 2 active matters:\n\n• Smith v. Acme Holdings (Discovery phase, 73% favorable)\n  → Document production deadline: Feb 15\n\n• IP Licensing Dispute (Negotiation, settlement likely)\n  → Counter-proposal awaiting your review";
    }
    if (q.includes("contract") || q.includes("acme") || q.includes("renewal")) {
      return "Sarah Chen (Procurement) owns the Acme Corp relationship.\n\n• Master Services Agreement: $2.4M/year\n• Renewal date: March 15, 2025\n• Status: Renewal pending\n\nWould you like me to schedule a meeting with Sarah?";
    }
    if (q.includes("board") || q.includes("meeting")) {
      return "Your next board meeting is in 12 days (Feb 14).\n\nPreparation status:\n✓ Financial Results Review — Complete\n○ Equity Grant Approval — In progress\n○ Risk Assessment Update — Not started\n\nShould I open the workflow canvas to prepare materials?";
    }
    if (q.includes("who") || q.includes("owner")) {
      return "I searched across Third Party Manager, Entities, and Risk Manager.\n\nSarah Chen (Procurement) is the primary owner:\n• 98% confidence from Contract Manager\n• 92% confidence from Risk Manager";
    }
    return "I can help you with:\n• Active legal matters and litigation status\n• Contract renewals and vendor relationships\n• Board meeting preparation\n• Finding relationship owners across systems";
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue.trim();
    
    const canvasIntent = detectCanvasIntent(userMessage);
    if (canvasIntent) {
      onOpenCanvas(canvasIntent);
      setInputValue("");
      return;
    }

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: getDemoResponse(userMessage) }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#f0f6fc]">
            {vision === "near-term" ? "What do you need to do?" : "Direct your autonomous Legal AI workforce."}
          </h3>
          <p className="mt-1 text-sm text-[#8b949e]">
            Ask questions or choose an action below. Work entirely within Diligent.
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[#d29922]/10 px-2 py-1 text-[10px] text-[#d29922]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d29922]" />Demo
        </span>
      </div>

      {messages.length > 0 && (
        <div className="mt-4 max-h-[300px] space-y-3 overflow-y-auto rounded-xl border border-[#30363d] bg-[#0d1117] p-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === "user" ? "flex justify-end" : ""}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2",
                msg.role === "user" ? "rounded-br-md bg-[#30363d]" : "rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5"
              )}>
                <p className="whitespace-pre-wrap text-sm text-[#f0f6fc]">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#58a6ff]" />
              <span className="text-xs text-[#8b949e]">Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#0d1117] p-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={isLoading}
          className="flex-1 bg-transparent px-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none"
          placeholder="Ask a question or describe what you need..."
        />
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isLoading}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#58a6ff] text-white transition hover:bg-[#79b8ff] disabled:opacity-50"
        >
          {Icons.send}
        </button>
      </div>

      <div className="mt-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6e7681]">Or start with</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {canvasActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onOpenCanvas(action.id)}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-[#30363d] bg-[#21262d] p-3 text-[#8b949e] transition hover:border-[#58a6ff]/50 hover:bg-[#30363d] hover:text-[#f0f6fc]"
            >
              <span className="flex h-8 w-8 items-center justify-center">{action.icon}</span>
              <span className="text-xs font-medium text-[#f0f6fc]">{action.label}</span>
              <span className="hidden text-[10px] text-[#6e7681] sm:block">{action.description}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Wrapper that switches based on TamboProvider availability
function PromptBox({ vision, onOpenCanvas, hasTamboProvider }: { vision: Vision; onOpenCanvas: (canvas: CanvasType) => void; hasTamboProvider: boolean }) {
  if (!hasTamboProvider) return <TamboPromptBoxDemoOnly vision={vision} onOpenCanvas={onOpenCanvas} />;
  return <TamboPromptBoxWithHooks vision={vision} onOpenCanvas={onOpenCanvas} />;
}

// Mobile-optimized prompt button for iPhone
function MobilePromptButton({ vision, onOpenCanvas }: { vision: Vision; onOpenCanvas: (canvas: CanvasType) => void }) {
  return (
    <div className="space-y-3">
      <button 
        onClick={() => onOpenCanvas("search")}
        className={cn(
          "w-full rounded-2xl border p-4 text-left transition",
          vision === "future"
            ? "border-[#a371f7]/30 bg-[#a371f7]/5 hover:bg-[#a371f7]/10"
            : "border-[#30363d] bg-[#21262d] hover:bg-[#30363d]"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            vision === "future" ? "bg-[#a371f7]/20" : "bg-[#58a6ff]/20"
          )}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={vision === "future" ? "#a371f7" : "#58a6ff"} strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
              <path d="M12 12 2.1 9.1" />
              <path d="m12 12 3.9 7.8" />
              <path d="m12 12 7.8-3.9" />
            </svg>
          </div>
          <div className="flex-1">
            <p className={cn(
              "text-sm font-semibold",
              vision === "future" ? "text-[#a371f7]" : "text-[#f0f6fc]"
            )}>
              {vision === "future" ? "Direct AI Workforce" : "Ask Diligent AI"}
            </p>
            <p className="text-xs text-[#8b949e]">Tap to start</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7681" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </button>
      {/* Quick actions for mobile */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "workflow" as CanvasType, icon: Icons.workflow, label: "Workflow" },
          { id: "document" as CanvasType, icon: Icons.document, label: "Document" },
          { id: "meeting" as CanvasType, icon: Icons.meeting, label: "Schedule" },
        ].map((action) => (
          <button
            key={action.id}
            onClick={() => onOpenCanvas(action.id)}
            className="flex flex-col items-center gap-1 rounded-xl border border-[#30363d] bg-[#21262d] p-2 text-[#8b949e] transition hover:bg-[#30363d] hover:text-[#f0f6fc]"
          >
            <span className="flex h-6 w-6 items-center justify-center">{action.icon}</span>
            <span className="text-[10px]">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Compact filings card for iPhone
function MobileFilingsCard() {
  return (
    <div className="rounded-2xl border border-[#f0883e]/30 bg-[#f0883e]/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0883e]/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0883e" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M9 15l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f0f6fc]">3 filings ready</p>
            <p className="text-xs text-[#8b949e]">$395 total fees</p>
          </div>
        </div>
        <button className="rounded-xl border border-[#3fb950] bg-[#3fb950]/10 px-3 py-2 text-xs font-medium text-[#3fb950]">
          Review
        </button>
      </div>
    </div>
  );
}

// Compact risk signals card for iPhone
function MobileRiskSignalsCard() {
  return (
    <div className="rounded-2xl border border-[#a371f7]/30 bg-[#a371f7]/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a371f7]/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a371f7" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f0f6fc]">3 risk signals</p>
            <p className="text-xs text-[#8b949e]">Your input needed</p>
          </div>
        </div>
        <button className="rounded-xl border border-[#a371f7] bg-[#a371f7]/10 px-3 py-2 text-xs font-medium text-[#a371f7]">
          Review
        </button>
      </div>
    </div>
  );
}

// Dashboard content component to allow reuse in device frames
function DashboardContent({ 
  vision, 
  activityOpen, 
  setActivityOpen, 
  currentActivityLog,
  currentNextActions,
  currentWhatsNew,
  hoveredAgent,
  setHoveredAgent,
  popoverPos,
  setPopoverPos,
  popoverHovered,
  setPopoverHovered,
  tickerRef,
  device = "desktop",
  onOpenCanvas,
  hasTamboProvider = false,
}: {
  vision: Vision;
  activityOpen: boolean;
  setActivityOpen: (v: boolean) => void;
  currentActivityLog: string[];
  currentNextActions: typeof nextActions["near-term"] | typeof nextActions["future"];
  currentWhatsNew: typeof whatsNew["near-term"];
  hoveredAgent: AgentStatus | null;
  setHoveredAgent: (a: AgentStatus | null) => void;
  popoverPos: { x: number; y: number };
  setPopoverPos: (p: { x: number; y: number }) => void;
  popoverHovered: boolean;
  setPopoverHovered: (v: boolean) => void;
  tickerRef: React.RefObject<HTMLDivElement | null>;
  device?: DeviceType;
  onOpenCanvas: (canvas: CanvasType) => void;
  hasTamboProvider?: boolean;
}) {
  const isIphone = device === "iphone";
  const isIpad = device === "ipad";
  const isMobile = isIphone || isIpad;
  return (
    <div className={cn(
      "overflow-hidden rounded-3xl border shadow-sm transition-colors duration-300",
      vision === "future" 
        ? "border-[#a371f7]/30 bg-[#161b22]" 
        : "border-[#30363d] bg-[#161b22]",
      isMobile && "rounded-none border-0"
    )}>
      <div className={cn("px-6", isIphone && "px-4", isIpad && "px-5")}>
        <TopNav
          activityOpen={activityOpen}
          onToggleActivity={() => setActivityOpen(!activityOpen)}
          activityCount={currentActivityLog.length}
          vision={vision}
        />
        {activityOpen ? (
          <div className="-mt-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Recent activity</p>
                  {vision === "future" && (
                    <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] text-[#a371f7]">AI-Enhanced</span>
                  )}
                </div>
                <button
                  onClick={() => setActivityOpen(false)}
                  className="rounded-lg border border-[#30363d] bg-[#161b22] px-2 py-1 text-xs text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]"
                >
                  Close
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {currentActivityLog.map((entry) => (
                  <div key={entry} className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#21262d] px-3 py-2">
                    <div className={cn(
                      "mt-1 h-2 w-2 rounded-full",
                      vision === "future" ? "bg-[#a371f7]" : "bg-[#3fb950]"
                    )} />
                    <p className="text-sm text-[#8b949e]">{entry}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}

        <header className={cn(
          "rounded-3xl border p-10 shadow-sm transition-colors duration-300",
          vision === "future"
            ? "border-[#a371f7]/30 bg-gradient-to-br from-[#0d1117] to-[#a371f7]/5"
            : "border-[#30363d] bg-[#0d1117]/80",
          isIphone && "p-5 rounded-2xl",
          isIpad && "p-6 rounded-2xl"
        )}>
          <h1 className={cn(
            "text-center text-4xl font-semibold tracking-tight text-[#f0f6fc]",
            isIphone && "text-xl",
            isIpad && "text-2xl"
          )}>
            {vision === "near-term" 
              ? "Your legal portfolio is in good shape."
              : "Your AI legal workforce is optimizing outcomes."
            }
          </h1>
          <p className="mt-4 text-center text-sm text-[#8b949e]">
            {vision === "near-term"
              ? "All matters on track, contracts monitored, and compliance current. A good time to prepare and review."
              : "Predictive models are active, autonomous recommendations are ready, and proactive analysis is complete."
            }
          </p>
          {vision === "future" && (
            <div className={cn(
              "mt-6 flex justify-center gap-4",
              isIphone && "mt-4 flex-wrap gap-2",
              isIpad && "gap-3"
            )}>
              <div className={cn(
                "rounded-xl border border-[#a371f7]/30 bg-[#a371f7]/10 px-4 py-2 text-center",
                isIphone && "flex-1 min-w-[90px] px-2"
              )}>
                <p className={cn("text-2xl font-semibold text-[#a371f7]", isIphone && "text-xl")}>3</p>
                <p className={cn("text-xs text-[#8b949e]", isIphone && "text-[10px]")}>AI Actions</p>
              </div>
              <div className={cn(
                "rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/10 px-4 py-2 text-center",
                isIphone && "flex-1 min-w-[90px] px-2"
              )}>
                <p className={cn("text-2xl font-semibold text-[#3fb950]", isIphone && "text-xl")}>73%</p>
                <p className={cn("text-xs text-[#8b949e]", isIphone && "text-[10px]")}>Confidence</p>
              </div>
              <div className={cn(
                "rounded-xl border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-4 py-2 text-center",
                isIphone && "flex-1 min-w-[90px] px-2"
              )}>
                <p className={cn("text-2xl font-semibold text-[#58a6ff]", isIphone && "text-xl")}>$240K</p>
                <p className={cn("text-xs text-[#8b949e]", isIphone && "text-[10px]")}>Savings</p>
              </div>
            </div>
          )}
        </header>

        {/* Agent ticker - hidden on iPhone */}
        {!isIphone && (
          <div
            className={cn(
              "ticker-strip relative mt-4 rounded-2xl border px-4 py-2 transition-colors duration-300",
              vision === "future"
                ? "border-[#a371f7]/30 bg-[#a371f7]/5"
                : "border-[#30363d] bg-[#21262d]"
            )}
            ref={tickerRef}
            onMouseLeave={() => {
              if (!popoverHovered) {
                setHoveredAgent(null);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "shrink-0 text-xs font-medium uppercase tracking-[0.2em]",
                vision === "future" ? "text-[#a371f7]" : "text-[#6e7681]"
              )}>
                {vision === "future" ? "AI Legal Agents" : "Legal Monitoring Agents"}
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
              className={cn(
                "pointer-events-auto absolute z-20 w-80 rounded-2xl border p-4 text-left text-sm shadow-lg transition-colors duration-300",
                vision === "future"
                  ? "border-[#a371f7]/30 bg-[#161b22]"
                  : "border-[#30363d] bg-[#161b22]"
              )}
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
              <div className="flex items-center justify-between">
                <div className={cn(
                  "text-xs uppercase tracking-[0.2em]",
                  vision === "future" ? "text-[#a371f7]" : "text-[#6e7681]"
                )}>
                  {vision === "future" ? "AI Agent Capabilities" : "Agent Criteria"}
                </div>
                {vision === "future" && (
                  <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] text-[#a371f7]">Autonomous</span>
                )}
              </div>
              <div className="mt-2 text-base font-semibold text-[#f0f6fc]">{hoveredAgent.name}</div>
              <p className="mt-1 text-sm text-[#8b949e]">
                {vision === "future" && hoveredAgent.futureNote ? hoveredAgent.futureNote : hoveredAgent.note}
              </p>
              <div className="mt-3 space-y-1 text-xs text-[#8b949e]">
                {(vision === "future" && hoveredAgent.futureCriteria ? hoveredAgent.futureCriteria : hoveredAgent.criteria).map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className={cn(
                      "mt-1 h-1.5 w-1.5 rounded-full",
                      vision === "future" ? "bg-[#a371f7]" : "bg-[#6e7681]"
                    )} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href="#"
                  className="inline-flex items-center rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]"
                >
                  {vision === "future" ? "Configure AI" : "Edit agent"}
                </a>
                <a
                  href="#"
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium",
                    vision === "future"
                      ? "border-[#a371f7] bg-[#a371f7] text-white hover:bg-[#8b5cf6]"
                      : "border-[#58a6ff] bg-[#58a6ff] text-[#0d1117] hover:bg-[#79b8ff]"
                  )}
                >
                  {vision === "future" ? "Review AI output" : "View activity"}
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

        {/* Prompt box - full on desktop/iPad, compact button on iPhone */}
        <div className="mt-8">
          {isIphone ? (
            <MobilePromptButton vision={vision} onOpenCanvas={onOpenCanvas} />
          ) : (
            <PromptBox vision={vision} onOpenCanvas={onOpenCanvas} hasTamboProvider={hasTamboProvider} />
          )}
        </div>

        {/* Near-term: Pending Filings Approval - compact on iPhone */}
        {vision === "near-term" && !isIphone && (
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
                    <h3 className="text-sm font-semibold text-[#f0f6fc]">Regulatory filings ready for your approval</h3>
                    <p className="text-xs text-[#8b949e]">Prepared by Entities · Review and approve to submit</p>
                  </div>
                </div>
                <span className="rounded-full border border-[#f0883e]/30 bg-[#f0883e]/10 px-2 py-0.5 text-xs font-medium text-[#f0883e]">
                  {pendingFilings.length} pending
                </span>
              </div>
              <div className="divide-y divide-[#30363d]">
                {pendingFilings.map((filing) => (
                  <div key={`${filing.entity}-${filing.filing}`} className={cn(
                    "flex items-center justify-between px-5 py-3 hover:bg-[#21262d]/50",
                    isIpad && "flex-col items-start gap-3"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-[#f0883e]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#f0f6fc]">{filing.entity}</span>
                          <span className="text-sm text-[#6e7681]">·</span>
                          <span className="text-sm text-[#8b949e]">{filing.filing}</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-[#6e7681]">
                          <span>{filing.jurisdiction}</span>
                          <span>·</span>
                          <span>Due {filing.dueDate}</span>
                          <span>·</span>
                          <span>Fee: {filing.fee}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">
                        Review
                      </button>
                      <button className="rounded-lg border border-[#3fb950] bg-[#3fb950]/10 px-3 py-1.5 text-xs font-medium text-[#3fb950] hover:bg-[#3fb950]/20">
                        Approve & Submit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#30363d] bg-[#0d1117]/30 px-5 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6e7681]">Total filing fees: $395</span>
                  <button className="text-xs font-medium text-[#58a6ff] hover:underline">
                    Approve all filings →
                  </button>
                </div>
              </div>
            </Card>
          </section>
        )}
        
        {/* Near-term: Compact filings for iPhone */}
        {vision === "near-term" && isIphone && (
          <section className="mt-6">
            <MobileFilingsCard />
          </section>
        )}

        {/* Future: Cross-Diligent Risk Signals - full on desktop/iPad */}
        {vision === "future" && !isIphone && (
          <section className="mt-8">
            <Card className="p-0 overflow-hidden border-[#a371f7]/20">
              <div className="flex items-center justify-between border-b border-[#a371f7]/20 bg-gradient-to-r from-[#a371f7]/5 to-transparent px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#a371f7]/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#a371f7" strokeWidth="2"/>
                      <path d="M12 16v-4M12 8h.01" stroke="#a371f7" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#f0f6fc]">Cross-Diligent risk signals awaiting your input</h3>
                    <p className="text-xs text-[#8b949e]">Your legal perspective is needed across the enterprise</p>
                  </div>
                </div>
                <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-xs font-medium text-[#a371f7]">
                  {riskSignals.length} requests
                </span>
              </div>
              <div className="divide-y divide-[#30363d]">
                {riskSignals.map((signal) => (
                  <div key={signal.title} className="px-5 py-4 hover:bg-[#a371f7]/5">
                    <div className={cn(
                      "flex items-start justify-between gap-4",
                      isIpad && "flex-col"
                    )}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-2 py-0.5 text-[10px] font-medium text-[#58a6ff]">
                            {signal.source}
                          </span>
                          <span className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            signal.impact === "High" 
                              ? "border-[#da3633]/30 bg-[#da3633]/10 text-[#da3633]"
                              : "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]"
                          )}>
                            {signal.impact} Impact
                          </span>
                        </div>
                        <h4 className="mt-2 text-sm font-medium text-[#f0f6fc]">{signal.title}</h4>
                        <p className="mt-1 text-sm text-[#8b949e]">{signal.detail}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-[#6e7681]">
                          <span>Requested by {signal.requestedBy}</span>
                          <span>·</span>
                          <span>Due {signal.dueDate}</span>
                        </div>
                      </div>
                      <button className={cn(
                        "shrink-0 rounded-xl border border-[#a371f7] bg-[#a371f7]/10 px-3 py-2 text-sm font-medium text-[#a371f7] hover:bg-[#a371f7]/20",
                        isIpad && "w-full mt-3"
                      )}>
                        Contribute
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#a371f7]/20 bg-gradient-to-r from-[#a371f7]/5 to-transparent px-5 py-3">
                <p className="text-xs text-[#8b949e]">
                  <span className="text-[#a371f7]">AI Insight:</span> Your legal risk assessments will automatically propagate to Risk Manager, updating the enterprise risk register in real-time.
                </p>
              </div>
            </Card>
          </section>
        )}

        {/* Future: Compact risk signals for iPhone */}
        {vision === "future" && isIphone && (
          <section className="mt-6">
            <MobileRiskSignalsCard />
          </section>
        )}

        <section className="mt-10">
          <SectionHeader 
            title={vision === "future" 
              ? "Your AI workspace at a glance" 
              : "Pick up where you left off"
            }
            description={vision === "near-term" 
              ? "Continue working in your Diligent applications"
              : undefined
            }
          />
          <div className={cn(
            "mt-5 grid gap-3",
            device === "desktop" && "md:grid-cols-2",
            isIpad && "grid-cols-2"
          )}>
            {recentApps[vision].map((app) => (
              <a
                key={app.name}
                href="#"
                className={cn(
                  "group block rounded-2xl border px-4 py-3 shadow-sm transition hover:-translate-y-[1px]",
                  vision === "future"
                    ? "border-[#a371f7]/20 bg-[#161b22] hover:border-[#a371f7]/40 hover:bg-[#a371f7]/5"
                    : "border-[#30363d] bg-[#161b22] hover:border-[#58a6ff]/50 hover:bg-[#21262d]"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-[#f0f6fc]">{app.name}</h3>
                      {"tag" in app && (
                        <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] font-medium text-[#a371f7]">{app.tag}</span>
                      )}
                      <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-[11px] text-[#8b949e]">{app.lastUsed}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#8b949e]">{app.description}</p>
                  </div>
                  <span className={cn(
                    "text-xs uppercase tracking-[0.2em] opacity-0 transition group-hover:opacity-100",
                    vision === "future" ? "text-[#a371f7]" : "text-[#6e7681]"
                  )}>
                    {vision === "future" ? "Review" : "Open"}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionHeader 
            title={vision === "future" 
              ? "AI-recommended actions awaiting your approval"
              : isIphone 
                ? "Get ahead"
                : "Since everything's under control, get ahead of a few things"
            } 
          />
          <div className={cn(
            "mt-6 grid gap-6",
            device === "desktop" && "lg:grid-cols-3",
            isIpad && "grid-cols-1"
          )}>
            <div className={cn(device === "desktop" && "lg:col-span-2")}>
              <div className="space-y-3">
                {/* Show only first 2 actions on iPhone */}
                {(isIphone ? currentNextActions.slice(0, 2) : currentNextActions).map((action) => (
                  <div
                    key={action.title}
                    className={cn(
                      "rounded-2xl border px-5 py-4 shadow-sm transition-colors duration-300",
                      vision === "future"
                        ? "border-[#a371f7]/20 bg-[#161b22]"
                        : "border-[#30363d] bg-[#161b22]",
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
                          {"tag" in action && (
                            <SoftTag variant="ai">{action.tag}</SoftTag>
                          )}
                        </div>
                        <p className={cn(
                          "mt-1 text-sm text-[#8b949e]",
                          isIphone && "text-xs"
                        )}>{action.detail}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-[#6e7681]">
                          {"app" in action && (
                            <span className="rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-2 py-0.5 text-[11px] text-[#58a6ff]">
                              {action.app}
                            </span>
                          )}
                          {vision === "near-term" && !isIphone && (
                            <span className="text-[#6e7681]">Ready to complete</span>
                          )}
                        </div>
                      </div>
                      <button className={cn(
                        "shrink-0 rounded-xl border px-3 py-2 text-sm",
                        vision === "future"
                          ? "border-[#a371f7] bg-[#a371f7]/10 text-[#a371f7] hover:bg-[#a371f7]/20"
                          : "border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff] hover:bg-[#58a6ff]/20",
                        isMobile && "w-full"
                      )}>
                        {vision === "future" ? "Approve" : "Open in app"}
                      </button>
                    </div>
                  </div>
                ))}
                {isIphone && currentNextActions.length > 2 && (
                  <button className="w-full rounded-xl border border-[#30363d] bg-[#21262d] px-4 py-3 text-sm text-[#8b949e]">
                    View {currentNextActions.length - 2} more actions
                  </button>
                )}
              </div>
            </div>
            {/* What's New sidebar - hidden on iPhone */}
            {!isIphone && (
              <div>
                <Card className="p-5">
                  <p className={cn(
                    "text-xs uppercase tracking-[0.2em]",
                    vision === "future" ? "text-[#a371f7]" : "text-[#6e7681]"
                  )}>
                    {vision === "future" ? "Coming Capabilities" : "What's New"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#f0f6fc]">
                    {vision === "future" ? "On the AI Roadmap" : "Good to Know & Good to Go"}
                  </h3>
                  <p className="mt-2 text-sm text-[#8b949e]">
                    {vision === "future"
                      ? "Advanced AI capabilities in development for your legal workflow."
                      : "Learn more about features and capabilities you already have today."
                    }
                  </p>
                  <div className="mt-4 space-y-3">
                    {currentWhatsNew.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className={cn(
                          "block rounded-xl border px-4 py-3 transition",
                          vision === "future"
                            ? "border-[#a371f7]/20 bg-[#0d1117] hover:border-[#a371f7]/40 hover:bg-[#a371f7]/5"
                            : "border-[#30363d] bg-[#0d1117] hover:border-[#58a6ff]/50 hover:bg-[#21262d]"
                        )}
                      >
                        <h4 className="text-sm font-semibold text-[#f0f6fc]">{item.title}</h4>
                        <p className="mt-1 text-sm text-[#8b949e]">{item.detail}</p>
                        <p className={cn(
                          "mt-3 text-xs uppercase tracking-[0.2em]",
                          vision === "future" ? "text-[#a371f7]" : "text-[#58a6ff]"
                        )}>
                          {vision === "future" ? "Learn More" : "Open"}
                        </p>
                      </a>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Footer - simplified on iPhone */}
        <footer className={cn(
          "mt-14 border-t border-[#30363d] bg-[#0d1117] px-5 py-5",
          isIphone && "mt-8 px-4 py-4"
        )}>
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">System log</p>
              {!isIphone && (
                <p className="mt-1 text-sm text-[#8b949e]">
                  {vision === "future" 
                    ? "AI agent activity (last 24 hours)"
                    : "Recent system activity (last 24 hours)"
                  }
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {/* Show only 3 entries on iPhone */}
            {(isIphone ? currentActivityLog.slice(0, 3) : currentActivityLog).map((entry) => (
              <div key={entry} className={cn(
                "flex items-start gap-3 text-sm text-[#8b949e]",
                isIphone && "text-xs"
              )}>
                <span className={cn(
                  "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                  vision === "future" ? "bg-[#a371f7]" : "bg-[#3fb950]"
                )} />
                <span>{entry}</span>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

// Main page content component
function PageContent({ hasTamboProvider = false }: { hasTamboProvider?: boolean }) {
  const [vision, setVision] = React.useState<Vision>("near-term");
  const [device, setDevice] = React.useState<DeviceType>("desktop");
  const [activityOpen, setActivityOpen] = React.useState(false);
  const [hoveredAgent, setHoveredAgent] = React.useState<AgentStatus | null>(null);
  const [popoverPos, setPopoverPos] = React.useState({ x: 0, y: 0 });
  const [popoverHovered, setPopoverHovered] = React.useState(false);
  const tickerRef = React.useRef<HTMLDivElement | null>(null);
  
  // Canvas state
  const [activeCanvas, setActiveCanvas] = React.useState<CanvasType>("none");
  const [canvasPrompt, setCanvasPrompt] = React.useState("");

  const handleOpenCanvas = (canvas: CanvasType, prompt?: string) => {
    setActiveCanvas(canvas);
    setCanvasPrompt(prompt || "");
  };

  const handleCloseCanvas = () => {
    setActiveCanvas("none");
    setCanvasPrompt("");
  };

  const currentActivityLog = activityLog[vision];
  const currentNextActions = nextActions[vision];
  const currentWhatsNew = whatsNew[vision];

  const dashboardProps = {
    vision,
    activityOpen,
    setActivityOpen,
    currentActivityLog,
    currentNextActions,
    currentWhatsNew,
    hoveredAgent,
    setHoveredAgent,
    popoverPos,
    setPopoverPos,
    popoverHovered,
    setPopoverHovered,
    tickerRef,
    onOpenCanvas: handleOpenCanvas,
    hasTamboProvider,
  };

  // Render active canvas
  const renderCanvas = () => {
    switch (activeCanvas) {
      case "workflow":
        return <WorkflowCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      case "document":
        return <DocumentCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      case "reporting":
        return <ReportingCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      case "search":
        return <SearchCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      case "meeting":
        return <MeetingCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      case "email":
        return <EmailCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Canvas overlay */}
      {activeCanvas !== "none" && renderCanvas()}
      
      {/* Main dashboard (hidden when canvas is active) */}
      {activeCanvas === "none" && (
        <>
          <PrototypeNav 
            vision={vision} 
            onVisionChange={setVision} 
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
        </>
      )}
    </div>
  );
}

// Main export with TamboProvider
export default function Page() {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  if (!apiKey) return <PageContent hasTamboProvider={false} />;
  return <TamboProvider apiKey={apiKey} components={tamboCanvasComponents}><PageContent hasTamboProvider={true} /></TamboProvider>;
}
