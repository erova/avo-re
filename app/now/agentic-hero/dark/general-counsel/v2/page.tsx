"use client";

import React from "react";
import { z } from "zod";
import { TamboProvider, useTamboThread } from "@tambo-ai/react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// TAMBO GENERATIVE UI COMPONENTS
// ============================================================================

// Schemas for Tambo components with descriptions for AI guidance
const matterCardSchema = z.object({
  id: z.string().describe("Unique matter ID like MATTER-2024-0847").optional().default("MATTER-0000"),
  title: z.string().describe("Case name, e.g., 'Smith v. Acme Holdings'").optional().default("Legal Matter"),
  status: z.string().describe("Current phase: Discovery, Negotiation, Trial, Closed").optional().default("Active"),
  probability: z.string().describe("Outcome likelihood, e.g., '73% favorable'").optional().default("Assessing"),
  detail: z.string().describe("Brief description of current status or next steps").optional().default(""),
  lastUpdate: z.string().describe("When last updated, e.g., '2 days ago'").optional().default(""),
  nextDeadline: z.string().describe("Next key date, e.g., 'Feb 15'").optional().default(""),
}).describe("Displays a legal matter, lawsuit, or litigation case");

const actionCardSchema = z.object({
  id: z.string().describe("Unique action ID").optional().default("action-0"),
  title: z.string().describe("Action title, e.g., 'Approve Settlement Offer'").optional().default("Action Required"),
  description: z.string().describe("What needs to be done and why").optional().default(""),
  actionLabel: z.string().describe("Button text, e.g., 'Review & Approve'").optional().default("Take Action"),
  urgency: z.string().describe("Priority level: high, medium, low").optional().default("medium"),
  dueDate: z.string().describe("When action is needed by").optional(),
}).describe("Shows an urgent action or decision requiring user approval");

const contractCardSchema = z.object({
  id: z.string().describe("Contract ID like CONTRACT-2847").optional().default("CONTRACT-0000"),
  title: z.string().describe("Contract name, e.g., 'Master Services Agreement'").optional().default("Contract"),
  counterparty: z.string().describe("Other party name, e.g., 'Acme Corp'").optional().default(""),
  renewalDate: z.string().describe("Renewal/expiration date").optional().default(""),
  value: z.string().describe("Contract value, e.g., '$2.4M/year'").optional().default(""),
  status: z.string().describe("Current status: Active, Renewal pending, Expired").optional().default("Active"),
  alertType: z.string().describe("Alert level: warning, info, error").optional().default("info"),
}).describe("Displays contract details with renewal dates and alerts");

const boardItemCardSchema = z.object({
  id: z.string().describe("Board item ID").optional().default("BOARD-0000"),
  title: z.string().describe("Agenda item title").optional().default("Board Item"),
  type: z.string().describe("Item type: Discussion, Resolution, Presentation").optional().default("Discussion"),
  status: z.string().describe("Item status: Scheduled, Draft, Pending, Complete").optional().default("Pending"),
  meetingDate: z.string().describe("Meeting date, e.g., 'Feb 14'").optional().default(""),
  prepStatus: z.string().describe("Preparation status: Complete, In progress, Not started").optional().default("Not started"),
}).describe("Shows a board meeting agenda item with preparation status");

// Tambo UI Components
function MatterCard({ id, title, status, probability, detail, lastUpdate, nextDeadline }: z.infer<typeof matterCardSchema>) {
  const statusColors: Record<string, string> = {
    "Discovery": "bg-[#d29922]/20 text-[#d29922]",
    "Active": "bg-[#58a6ff]/20 text-[#58a6ff]",
    "Negotiation": "bg-[#a371f7]/20 text-[#a371f7]",
    "Closed": "bg-[#3fb950]/20 text-[#3fb950]",
    "At Risk": "bg-[#da3633]/20 text-[#da3633]",
  };
  const colorClass = statusColors[status] || statusColors["Active"];
  
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] text-[#6e7681]">{id}</span>
          <h3 className="text-sm font-semibold text-[#f0f6fc]">{title}</h3>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", colorClass)}>{status}</span>
      </div>
      {detail && <p className="mt-2 text-xs text-[#8b949e]">{detail}</p>}
      <div className="mt-3 flex items-center gap-4 text-[10px] text-[#6e7681]">
        {probability && <span>Outcome: <span className="text-[#3fb950]">{probability}</span></span>}
        {lastUpdate && <span>Updated: {lastUpdate}</span>}
        {nextDeadline && <span>Next: {nextDeadline}</span>}
      </div>
    </div>
  );
}

function ActionCard({ title, description, actionLabel, urgency, dueDate, onClick }: z.infer<typeof actionCardSchema> & { onClick?: () => void }) {
  const urgencyColors: Record<string, string> = {
    high: "border-[#da3633]/40 bg-[#da3633]/10",
    medium: "border-[#d29922]/40 bg-[#d29922]/10",
    low: "border-[#30363d] bg-[#21262d]",
  };
  const borderClass = urgencyColors[urgency] || urgencyColors["medium"];
  
  return (
    <div className={cn("rounded-xl border p-4", borderClass)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-[#f0f6fc]">{title}</h3>
          <p className="mt-1 text-xs text-[#8b949e]">{description}</p>
        </div>
        {dueDate && <span className="shrink-0 text-[10px] text-[#6e7681]">{dueDate}</span>}
      </div>
      <button 
        onClick={onClick} 
        className="mt-3 rounded-lg bg-[#58a6ff] px-3 py-1.5 text-xs font-medium text-[#0d1117] hover:bg-[#79b8ff]"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function ContractCard({ id, title, counterparty, renewalDate, value, status, alertType }: z.infer<typeof contractCardSchema>) {
  const alertColors: Record<string, string> = {
    warning: "border-[#d29922]/40 bg-[#d29922]/5",
    urgent: "border-[#da3633]/40 bg-[#da3633]/5",
    info: "border-[#30363d] bg-[#161b22]",
  };
  const borderClass = alertColors[alertType] || alertColors["info"];
  
  return (
    <div className={cn("rounded-xl border p-4", borderClass)}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] text-[#6e7681]">{id}</span>
          <h3 className="text-sm font-semibold text-[#f0f6fc]">{title}</h3>
          {counterparty && <p className="text-xs text-[#8b949e]">{counterparty}</p>}
        </div>
        <span className="rounded bg-[#58a6ff]/20 px-2 py-0.5 text-[10px] text-[#58a6ff]">{status}</span>
      </div>
      <div className="mt-3 flex items-center gap-4 text-[10px] text-[#6e7681]">
        {renewalDate && <span>Renewal: <span className="text-[#d29922]">{renewalDate}</span></span>}
        {value && <span>Value: {value}</span>}
      </div>
    </div>
  );
}

function BoardItemCard({ id, title, type, status, meetingDate, prepStatus }: z.infer<typeof boardItemCardSchema>) {
  const prepColors: Record<string, string> = {
    "Complete": "text-[#3fb950]",
    "In progress": "text-[#d29922]",
    "Not started": "text-[#da3633]",
  };
  const prepColor = prepColors[prepStatus] || "text-[#6e7681]";
  
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#a371f7]/20 px-1.5 py-0.5 text-[10px] text-[#a371f7]">{type}</span>
            <span className="text-[10px] text-[#6e7681]">{id}</span>
          </div>
          <h3 className="mt-1 text-sm font-semibold text-[#f0f6fc]">{title}</h3>
        </div>
        <span className="text-[10px] text-[#6e7681]">{status}</span>
      </div>
      <div className="mt-3 flex items-center gap-4 text-[10px] text-[#6e7681]">
        {meetingDate && <span>Meeting: {meetingDate}</span>}
        <span>Prep: <span className={prepColor}>{prepStatus}</span></span>
      </div>
    </div>
  );
}

// Tambo component registry
const tamboComponents = [
  { 
    name: "MatterCard", 
    description: "Displays a legal matter, lawsuit, or litigation case. Use when user asks about active matters, cases, litigation status, lawsuits, or legal proceedings.", 
    component: MatterCard, 
    propsSchema: matterCardSchema 
  },
  { 
    name: "ActionCard", 
    description: "Shows an urgent action or decision requiring approval. Use when user asks about pending actions, approvals needed, urgent items, or decisions to make.", 
    component: ActionCard, 
    propsSchema: actionCardSchema 
  },
  { 
    name: "ContractCard", 
    description: "Displays contract details with renewal dates. Use when user asks about contracts, agreements, renewals, expirations, or vendor relationships.", 
    component: ContractCard, 
    propsSchema: contractCardSchema 
  },
  { 
    name: "BoardItemCard", 
    description: "Shows a board meeting agenda item. Use when user asks about board meetings, agenda items, board preparation, or meeting status.", 
    component: BoardItemCard, 
    propsSchema: boardItemCardSchema 
  },
];

// SVG Icons (grayscale)
const Icons = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  workflow: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  document: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  reporting: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  meeting: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  chevronRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  collapse: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
    </svg>
  ),
  expand: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 5l7 7-7 7M6 5l7 7-7 7" />
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  alert: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  clock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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

// Sidebar navigation
const navItems = [
  { id: "home", icon: Icons.home, label: "Home" },
  { id: "workflow", icon: Icons.workflow, label: "Workflows" },
  { id: "document", icon: Icons.document, label: "Documents" },
  { id: "reporting", icon: Icons.reporting, label: "Reports" },
  { id: "meeting", icon: Icons.meeting, label: "Schedule" },
  { id: "email", icon: Icons.email, label: "Email" },
];

// Sample data
const pendingActions = [
  { id: "1", title: "Approve Delaware Annual Report", entity: "Acme Holdings, Inc.", due: "Mar 1", type: "filing", priority: "high" },
  { id: "2", title: "Review Acme Corp Renewal", entity: "Third Party Manager", due: "Mar 15", type: "contract", priority: "medium" },
  { id: "3", title: "Sign Board Resolution", entity: "Governance", due: "Feb 10", type: "approval", priority: "high" },
];

const activeMatters = [
  { id: "1", title: "Smith v. Acme Holdings", status: "Discovery", probability: "73% favorable", lastUpdate: "2 days ago" },
  { id: "2", title: "IP Licensing Dispute", status: "Negotiation", probability: "In progress", lastUpdate: "1 week ago" },
  { 
    id: "3", 
    title: "Overdue Equity Grant Approval", 
    status: "Needs attention", 
    probability: "18+ months overdue", 
    lastUpdate: "AI suggestion",
    isAISuggestion: true,
    suggestion: "Most companies your size discuss Equity Grants quarterly. Consider adding to Board agenda."
  },
];

// Team activity stream
const teamActivity = [
  { 
    id: "1",
    actor: "CFO Office",
    action: "Updated placeholder financial numbers to v0.8",
    target: "Q1 Board Materials",
    time: "12 min ago",
    type: "update"
  },
  { 
    id: "2",
    actor: "Chief Risk Officer",
    action: "Approved materials added by agent",
    target: "Board Deck - Risk Section",
    time: "34 min ago",
    type: "approval"
  },
  { 
    id: "3",
    actor: "3 Board Members",
    action: "Opened pre-read and last meeting's minutes",
    target: "February Board Materials",
    time: "1 hr ago",
    type: "view"
  },
  { 
    id: "4",
    actor: "Corporate Secretary",
    action: "Uploaded signed resolution",
    target: "Governance Documents",
    time: "2 hrs ago",
    type: "upload"
  },
];

// Agent ticker data with hover details
type AgentInfo = {
  name: string;
  status: string;
  lastRun: string;
  note: string;
  criteria: string[];
};

const agentTickerItems: AgentInfo[] = [
  { 
    name: "Matter Monitor", 
    status: "All active matters on track", 
    lastRun: "12 min ago",
    note: "Tracks all active legal matters and litigation, alerting you to status changes and deadlines.",
    criteria: ["Deadline approaching within 7 days", "Status changed by opposing counsel", "Court filing received", "Settlement offer received"]
  },
  { 
    name: "Contract Intelligence", 
    status: "142 contracts monitored; 2 renewals approaching", 
    lastRun: "25 min ago",
    note: "Monitors contract portfolio for renewals, expirations, and key obligation dates.",
    criteria: ["Renewal within 90 days", "Auto-renewal clause approaching", "Termination notice period", "Price escalation clause trigger"]
  },
  { 
    name: "Regulatory Watch", 
    status: "No new regulations impacting operations", 
    lastRun: "1 hr ago",
    note: "Scans regulatory sources for changes affecting your industry and jurisdictions.",
    criteria: ["New SEC guidance", "GDPR/privacy updates", "Industry-specific regulations", "Cross-border compliance changes"]
  },
  { 
    name: "Corporate Governance", 
    status: "Board compliance current; materials due in 12 days", 
    lastRun: "2 hrs ago",
    note: "Ensures governance requirements are met: board materials, filings, resolutions.",
    criteria: ["Board meeting materials deadline", "Annual filing due", "Director term expiring", "Committee charter review"]
  },
  { 
    name: "Legal Hold Manager", 
    status: "All holds acknowledged; no custodian gaps", 
    lastRun: "3 hrs ago",
    note: "Manages litigation holds, custodian acknowledgments, and preservation compliance.",
    criteria: ["New hold required", "Custodian not acknowledged", "Hold reminder overdue", "Preservation gap detected"]
  },
];

const agentActivity = [
  { agent: "Matter Monitor", message: "All 3 active matters on track", time: "12 min ago", type: "success" },
  { agent: "Contract Intel", message: "Acme Corp renewal approaching — review recommended", time: "25 min ago", type: "warning" },
  { agent: "Regulatory Watch", message: "No new regulations this week", time: "1 hr ago", type: "success" },
];

// Agent ticker component with hover details
function AgentTicker({ 
  hoveredAgent, 
  setHoveredAgent, 
  popoverPos, 
  setPopoverPos,
  popoverHovered,
  setPopoverHovered,
  tickerRef 
}: {
  hoveredAgent: AgentInfo | null;
  setHoveredAgent: (a: AgentInfo | null) => void;
  popoverPos: { x: number; y: number };
  setPopoverPos: (p: { x: number; y: number }) => void;
  popoverHovered: boolean;
  setPopoverHovered: (v: boolean) => void;
  tickerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div 
      className="ticker-strip relative border-b border-[#30363d] bg-[#161b22] px-3 py-1.5"
      ref={tickerRef}
      onMouseLeave={() => { if (!popoverHovered) setHoveredAgent(null); }}
    >
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#6e7681]">
          Agents
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track flex w-max items-center gap-6">
            {[...agentTickerItems, ...agentTickerItems].map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap text-xs transition hover:text-[#58a6ff]"
                onMouseEnter={(e) => {
                  const bounds = tickerRef.current?.getBoundingClientRect();
                  if (bounds) {
                    setHoveredAgent(item);
                    setPopoverPos({ x: e.clientX - bounds.left, y: bounds.height });
                  }
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
                <span className="font-medium text-[#f0f6fc]">{item.name}</span>
                <span className="text-[#6e7681]">·</span>
                <span className="text-[#8b949e]">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover popover */}
      {hoveredAgent && (
        <div 
          className="pointer-events-auto absolute z-50 w-80 rounded-xl border border-[#30363d] bg-[#161b22] p-4 shadow-xl"
          style={{ 
            left: Math.min(Math.max(popoverPos.x, 160), window.innerWidth - 340), 
            top: popoverPos.y + 8, 
            transform: "translateX(-50%)" 
          }}
          onMouseEnter={() => setPopoverHovered(true)}
          onMouseLeave={() => { setPopoverHovered(false); setHoveredAgent(null); }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#3fb950]" />
            <p className="text-xs uppercase tracking-wider text-[#6e7681]">Agent Details</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-[#f0f6fc]">{hoveredAgent.name}</p>
          <p className="mt-1 text-xs text-[#8b949e]">{hoveredAgent.note}</p>
          <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-[#6e7681]">Monitors for</p>
          <div className="mt-2 space-y-1">
            {hoveredAgent.criteria.map((c) => (
              <div key={c} className="flex items-start gap-2 text-xs text-[#8b949e]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6e7681]" />
                <span>{c}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#30363d] pt-3">
            <span className="text-[10px] text-[#6e7681]">Last run: {hoveredAgent.lastRun}</span>
            <span className="rounded bg-[#3fb950]/20 px-1.5 py-0.5 text-[10px] text-[#3fb950]">Healthy</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .ticker-track {
          animation: ticker 60s linear infinite;
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
  );
}

// Compact icon-only sidebar
function NavSidebar({ active, onSelect, collapsed, onToggleCollapse }: { 
  active: string; 
  onSelect: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <div className={cn(
      "flex h-full flex-col border-r border-[#30363d] bg-[#0d1117] transition-all",
      collapsed ? "w-14" : "w-48"
    )}>
      <div className="flex items-center gap-2 border-b border-[#30363d] p-3">
        <DiligentLogo className="h-7 w-7 shrink-0" />
        {!collapsed && <span className="text-sm font-semibold text-[#f0f6fc]">Legal</span>}
      </div>
      
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 transition",
              active === item.id
                ? "bg-[#21262d] text-[#f0f6fc]"
                : "text-[#8b949e] hover:bg-[#161b22] hover:text-[#f0f6fc]"
            )}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="border-t border-[#30363d] p-2">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center rounded-lg p-2 text-[#6e7681] hover:bg-[#161b22] hover:text-[#8b949e]"
        >
          {collapsed ? Icons.expand : Icons.collapse}
        </button>
      </div>

      <div className="border-t border-[#30363d] p-3">
        <div className={cn(
          "flex items-center gap-2",
          collapsed && "justify-center"
        )}>
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7]" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#f0f6fc]">Sarah Johnson</p>
              <p className="truncate text-[10px] text-[#6e7681]">General Counsel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Center column: Work queue and content
function WorkPanel() {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden border-r border-[#30363d] bg-[#0d1117]">
      {/* Header */}
      <div className="border-b border-[#30363d] px-4 py-3">
        <h2 className="text-sm font-semibold text-[#f0f6fc]">Your Queue</h2>
        <p className="text-xs text-[#6e7681]">Items needing your attention</p>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 border-b border-[#30363d] p-3">
          {[
            { label: "Pending", value: "3", color: "#f0883e" },
            { label: "Active Matters", value: "3", color: "#58a6ff" },
            { label: "Board Meeting", value: "12d", color: "#a371f7" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-[#161b22] p-2 text-center">
              <p className="text-lg font-semibold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] text-[#6e7681]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Pending Actions */}
        <div className="border-b border-[#30363d] p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#6e7681]">Pending Actions</p>
          <div className="space-y-2">
            {pendingActions.map((action) => (
              <button
                key={action.id}
                className="group flex w-full items-start gap-3 rounded-lg border border-[#30363d] bg-[#161b22] p-3 text-left transition hover:border-[#58a6ff]/30 hover:bg-[#21262d]"
              >
                <div className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded",
                  action.priority === "high" ? "bg-[#da3633]/20 text-[#da3633]" : "bg-[#d29922]/20 text-[#d29922]"
                )}>
                  {Icons.alert}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[#f0f6fc]">{action.title}</p>
                  <p className="truncate text-[10px] text-[#6e7681]">{action.entity}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#6e7681]">
                  {Icons.clock}
                  <span>{action.due}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Matters */}
        <div className="border-b border-[#30363d] p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#6e7681]">Active Matters</p>
          <div className="space-y-2">
            {activeMatters.map((matter: {
              id: string;
              title: string;
              status: string;
              probability: string;
              lastUpdate: string;
              isAISuggestion?: boolean;
              suggestion?: string;
            }) => (
              <button
                key={matter.id}
                className={cn(
                  "group flex w-full flex-col rounded-lg border p-3 text-left transition",
                  matter.isAISuggestion 
                    ? "border-[#a371f7]/30 bg-[#a371f7]/5 hover:border-[#a371f7]/50 hover:bg-[#a371f7]/10"
                    : "border-[#30363d] bg-[#161b22] hover:border-[#58a6ff]/30 hover:bg-[#21262d]"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-medium text-[#f0f6fc]">{matter.title}</p>
                      {matter.isAISuggestion && (
                        <span className="shrink-0 rounded-full bg-[#a371f7]/20 px-1.5 py-0.5 text-[9px] font-medium text-[#a371f7]">
                          AI Insight
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[10px] text-[#6e7681]">{matter.status} · {matter.lastUpdate}</p>
                  </div>
                  <span className={cn(
                    "shrink-0 rounded px-2 py-0.5 text-[10px]",
                    matter.isAISuggestion 
                      ? "bg-[#da3633]/10 text-[#da3633]"
                      : "bg-[#3fb950]/10 text-[#3fb950]"
                  )}>
                    {matter.probability}
                  </span>
                </div>
                {matter.suggestion && (
                  <p className="mt-2 text-[10px] leading-relaxed text-[#a371f7]">
                    {matter.suggestion}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Team Activity Stream */}
        <div className="border-b border-[#30363d] p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#6e7681]">Team Activity</p>
          <div className="space-y-2">
            {teamActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-2 rounded-lg bg-[#161b22] p-2"
              >
                <div className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                  activity.type === "approval" ? "bg-[#3fb950]/20 text-[#3fb950]" :
                  activity.type === "view" ? "bg-[#58a6ff]/20 text-[#58a6ff]" :
                  activity.type === "update" ? "bg-[#d29922]/20 text-[#d29922]" :
                  "bg-[#8b949e]/20 text-[#8b949e]"
                )}>
                  {activity.type === "approval" ? "✓" : 
                   activity.type === "view" ? "👁" :
                   activity.type === "update" ? "↻" : "↑"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#f0f6fc]">
                    <span className="font-medium">{activity.actor}</span>
                    <span className="text-[#8b949e]"> {activity.action}</span>
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#58a6ff]">{activity.target}</p>
                </div>
                <span className="shrink-0 text-[10px] text-[#6e7681]">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Activity */}
        <div className="p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#6e7681]">Agent Activity</p>
          <div className="space-y-2">
            {agentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg bg-[#161b22] p-2"
              >
                <span className={cn(
                  "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                  activity.type === "success" ? "bg-[#3fb950]" : "bg-[#d29922]"
                )} />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium text-[#8b949e]">{activity.agent}</p>
                  <p className="text-xs text-[#f0f6fc]">{activity.message}</p>
                </div>
                <span className="shrink-0 text-[10px] text-[#6e7681]">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Right column: AI Assistant

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
      <div className="mt-2 space-y-2">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6e7681]">Employee Directory</span>
            <span className="text-xs text-[#3fb950]">98% match</span>
          </div>
          <h4 className="mt-1 text-sm font-semibold text-[#f0f6fc]">{name} - Deputy General Counsel</h4>
          <p className="mt-1 text-xs text-[#8b949e]">Specializes in corporate governance and compliance. Primary contact for regulatory filings.</p>
          <div className="mt-2 flex gap-2">
            <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-[10px] text-[#8b949e]">View Profile</button>
            <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-[10px] text-[#8b949e]">Schedule Meeting</button>
          </div>
        </div>
      </div>
    );
  }
  
  // PRIORITY 2: Detect email/draft intent from query
  if (q.includes("email") || q.includes("draft") || q.includes("send") || q.includes("compose")) {
    return (
      <div className="mt-2 space-y-2">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 6-10 7L2 6" />
              </svg>
              <span className="text-sm font-medium text-[#f0f6fc]">Email Draft</span>
            </div>
            <span className="rounded-full border border-[#d29922]/30 bg-[#d29922]/10 px-2 py-0.5 text-[10px] font-medium text-[#d29922]">DRAFT</span>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex"><span className="w-12 text-[#6e7681]">To:</span><span className="text-[#f0f6fc]">CFO, Board Secretary</span></div>
            <div className="flex"><span className="w-12 text-[#6e7681]">Subj:</span><span className="font-medium text-[#f0f6fc]">Q1 Board Materials - Pre-Read</span></div>
          </div>
          <div className="mt-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
            <p className="line-clamp-2 text-xs text-[#8b949e]">&ldquo;Please find the attached pre-read materials for our upcoming Q1 board meeting...&rdquo;</p>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#58a6ff]/30 bg-[#58a6ff]/5 px-2.5 py-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <span className="text-xs text-[#f0f6fc]">Q1 Financial Summary</span>
            <span className="text-[10px] text-[#58a6ff]">Secure Link</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#30363d]">Edit</button>
            <button className="rounded-lg bg-[#58a6ff] px-3 py-1.5 text-xs font-medium text-[#0d1117]">Send</button>
          </div>
        </div>
      </div>
    );
  }
  
  // PRIORITY 3: Detect meeting/schedule intent from query
  if (q.includes("schedule") || q.includes("set up time") || q.includes("calendar")) {
    return (
      <div className="mt-2 space-y-2">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-sm font-medium text-[#f0f6fc]">Meeting Proposed</span>
            <span className="text-xs text-[#3fb950]">All available</span>
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#f0f6fc]">3:30 PM <span className="text-sm font-normal text-[#8b949e]">Tomorrow</span></div>
          <p className="mt-1 text-xs text-[#58a6ff]">Moved low-priority call to open this slot</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-lg bg-[#3fb950] px-3 py-1.5 text-xs font-medium text-[#0d1117]">Confirm</button>
            <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e]">Other Times</button>
          </div>
        </div>
      </div>
    );
  }
  
  // PRIORITY 4: Detect report/trend/analytics content
  if (q.includes("report") || q.includes("trend") || q.includes("analytic") || q.includes("insight") || q.includes("pattern") || q.includes("attendance") || q.includes("voting")) {
    return (
      <div className="mt-2 space-y-2">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6e7681]">Board Analytics</span>
            <span className="text-xs text-[#3fb950]">+8% YoY</span>
          </div>
          <h4 className="mt-1 text-sm font-semibold text-[#f0f6fc]">Board Attendance Trends</h4>
          <p className="mt-1 text-xs text-[#8b949e]">Attendance has increased 8% over the last 4 quarters. Average meeting duration down 12%.</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="text-center"><span className="text-xl font-semibold text-[#3fb950]">94%</span><p className="text-[10px] text-[#6e7681]">Attendance</p></div>
            <div className="text-center"><span className="text-xl font-semibold text-[#58a6ff]">97%</span><p className="text-[10px] text-[#6e7681]">Consensus</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
          <h4 className="text-sm font-semibold text-[#f0f6fc]">Voting Patterns</h4>
          <p className="mt-1 text-xs text-[#8b949e]">97% consensus rate on strategic initiatives. 3 items required multiple votes.</p>
          <div className="mt-2 flex gap-2">
            <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-[10px] text-[#8b949e]">View Full Report</button>
            <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-[10px] text-[#8b949e]">Export PDF</button>
          </div>
        </div>
      </div>
    );
  }
  
  // PRIORITY 5: Detect matter/litigation content
  if (text.includes("matter") || text.includes("litigation") || text.includes("case") || text.includes("lawsuit") || text.includes("acme corp v")) {
    return (
      <div className="mt-2 space-y-2">
        <MatterCard 
          id="MATTER-2024-0847" 
          title="ACME Corp v. WidgetCo" 
          status="Discovery" 
          probability="73% favorable" 
          detail="Breach of contract lawsuit. Next hearing scheduled in 10 days." 
          lastUpdate="2 days ago" 
          nextDeadline="Feb 15" 
        />
      </div>
    );
  }
  
  // PRIORITY 5: Detect urgent action content
  if (text.includes("urgent") || text.includes("approval") || text.includes("settlement")) {
    return (
      <div className="mt-2 space-y-2">
        <ActionCard 
          id="action-urgent-1" 
          title="Approve Litigation Settlement Offer" 
          description="Settlement offer received in ACME Corp v. WidgetCo. Immediate approval recommended for compliance." 
          actionLabel="Review & Approve" 
          urgency="high" 
          dueDate="June 12, 2024" 
        />
      </div>
    );
  }
  
  // PRIORITY 6: Detect contract content
  if (text.includes("contract") || text.includes("renewal") || text.includes("expir") || text.includes("vendor")) {
    return (
      <div className="mt-2 space-y-2">
        <ContractCard 
          id="CONTRACT-2847" 
          title="Master Services Agreement" 
          counterparty="Acme Corp" 
          renewalDate="Mar 15, 2025" 
          value="$2.4M/year" 
          status="Renewal pending" 
          alertType="warning" 
        />
      </div>
    );
  }
  
  // PRIORITY 7: Detect board content (only if explicitly asked about board)
  if (q.includes("board") || q.includes("agenda") || q.includes("directors") || q.includes("governance")) {
    return (
      <div className="mt-2 space-y-2">
        <BoardItemCard 
          id="BOARD-Q1-01" 
          title="Financial Results Review" 
          type="Discussion" 
          status="Scheduled" 
          meetingDate="Feb 14" 
          prepStatus="Complete" 
        />
        <BoardItemCard 
          id="BOARD-Q1-02" 
          title="Equity Grant Approval" 
          type="Resolution" 
          status="Draft" 
          meetingDate="Feb 14" 
          prepStatus="In progress" 
        />
      </div>
    );
  }
  
  return undefined;
}

// Version with Tambo hooks - only rendered inside TamboProvider
function AIAssistantPanelWithTambo() {
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{
    role: "user" | "assistant";
    content: string;
    component?: React.ReactNode;
    results?: Array<{ title: string; source: string; snippet: string; confidence: number }>;
    actions?: Array<{ label: string }>;
  }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [demoMode, setDemoMode] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const tamboThread = useTamboThread();

  React.useEffect(() => {
    // Scroll within container only, not the whole page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getDemoResponse = (query: string): { content: string; component?: React.ReactNode; results?: Array<{ title: string; source: string; snippet: string; confidence: number }>; actions?: Array<{ label: string }> } => {
    const q = query.toLowerCase();
    if (q.includes("matter") || q.includes("litigation") || q.includes("smith")) {
      return {
        content: "Here's the current status of your active matters:",
        component: (
          <div className="mt-2 space-y-2">
            <MatterCard id="MATTER-2024-0847" title="Smith v. Acme Holdings" status="Discovery" probability="73% favorable" detail="Document production deadline approaching. Opposing counsel requested extension." lastUpdate="2 days ago" nextDeadline="Feb 15" />
            <MatterCard id="MATTER-2024-0912" title="IP Licensing Dispute" status="Negotiation" probability="Settlement likely" detail="Counter-proposal received. Awaiting your review of revised terms." lastUpdate="1 week ago" nextDeadline="Feb 28" />
          </div>
        ),
        actions: [{ label: "View all matters" }, { label: "Start timeline" }],
      };
    }
    if (q.includes("contract") || q.includes("expir") || q.includes("renewal") || q.includes("acme")) {
      return {
        content: "I found 2 contracts requiring attention this quarter:",
        component: (
          <div className="mt-2 space-y-2">
            <ContractCard id="CONTRACT-2847" title="Master Services Agreement" counterparty="Acme Corp" renewalDate="Mar 15, 2025" value="$2.4M/year" status="Renewal pending" alertType="warning" />
            <ContractCard id="CONTRACT-3012" title="Software License Agreement" counterparty="TechVendor Inc" renewalDate="Apr 1, 2025" value="$180K/year" status="Auto-renew" alertType="info" />
          </div>
        ),
        results: [{ title: "Master Services Agreement — Acme Corp", source: "Contract Manager", snippet: "Relationship owner: Sarah Chen. Contract value: $2.4M annually...", confidence: 98 }],
        actions: [{ label: "Schedule meeting with Sarah" }, { label: "Start renewal workflow" }],
      };
    }
    if (q.includes("board") || q.includes("meeting") || q.includes("agenda") || q.includes("material")) {
      return {
        content: "Your next board meeting is in 12 days. Here's the current preparation status:",
        component: (
          <div className="mt-2 space-y-2">
            <BoardItemCard id="BOARD-Q1-01" title="Financial Results Review" type="Discussion" status="Scheduled" meetingDate="Feb 14" prepStatus="Complete" />
            <BoardItemCard id="BOARD-Q1-02" title="Equity Grant Approval" type="Resolution" status="Draft" meetingDate="Feb 14" prepStatus="In progress" />
            <BoardItemCard id="BOARD-Q1-03" title="Risk Assessment Update" type="Presentation" status="Pending" meetingDate="Feb 14" prepStatus="Not started" />
          </div>
        ),
        actions: [{ label: "View full agenda" }, { label: "Generate materials" }, { label: "Schedule prep call" }],
      };
    }
    if (q.includes("equity") || q.includes("grant")) {
      return {
        content: "The equity grant approval has been overdue. Here's what I recommend:",
        component: (
          <div className="mt-2 space-y-2">
            <ActionCard id="action-1" title="Add to Board Agenda" description="Most companies your size discuss equity grants quarterly. It's been 18+ months since the last approval." actionLabel="Add to Agenda" urgency="high" dueDate="Next meeting" />
            <BoardItemCard id="BOARD-EQ-01" title="Equity Grant Approval" type="Resolution" status="Overdue" meetingDate="TBD" prepStatus="Not started" />
          </div>
        ),
        actions: [{ label: "Draft resolution" }, { label: "View nominees" }],
      };
    }
    if (q.includes("who") || q.includes("owner") || q.includes("relationship")) {
      return {
        content: "Sarah Chen (Procurement) is the primary owner of the Acme Corp vendor relationship.",
        results: [
          { title: "Master Services Agreement — Acme Corp", source: "Third Party Manager", snippet: "Relationship owner: Sarah Chen. Contract value: $2.4M annually...", confidence: 98 },
          { title: "Vendor Risk Assessment", source: "Risk Manager", snippet: "Primary contact: Sarah Chen. Risk score: Medium (65/100)...", confidence: 92 },
        ],
        actions: [{ label: "Schedule meeting with Sarah" }, { label: "View contract" }, { label: "Start renewal workflow" }],
      };
    }
    return {
      content: "I can help you with:\n• Active legal matters and litigation status\n• Contract renewals and deadlines\n• Board meeting preparation\n• Finding relationship owners",
      actions: [{ label: "Show active matters" }, { label: "Contract renewals" }, { label: "Board prep status" }],
    };
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsLoading(true);
    if (demoMode) {
      setTimeout(() => {
        const response = getDemoResponse(userMessage);
        setMessages(prev => [...prev, { role: "assistant", content: response.content, component: response.component, results: response.results, actions: response.actions }]);
        setIsLoading(false);
      }, 800);
    } else {
      try {
        const response = await tamboThread.sendThreadMessage(userMessage);
        // Tambo response.content can be string or array of {type, text} objects
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
        // Generate cards based on response content keywords
        const liveComponent = generateCardsFromContent(textContent, userMessage);
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: textContent || "I found some relevant information.", 
          component: liveComponent,
        }]);
        setIsLoading(false);
      } catch (err) {
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Unknown error"}. Try demo mode.` }]);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-full w-[380px] flex-col bg-[#161b22]">
      <div className="flex items-center justify-between border-b border-[#30363d] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7]"><DiligentLogo className="h-3 w-3" /></div>
          <span className="text-sm font-semibold text-[#f0f6fc]">AI Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-[#30363d] bg-[#21262d] p-0.5">
            <button onClick={() => setDemoMode(true)} className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium transition", demoMode ? "bg-[#161b22] text-[#f0f6fc]" : "text-[#6e7681] hover:text-[#8b949e]")}>Demo</button>
            <button onClick={() => setDemoMode(false)} className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium transition", !demoMode ? "bg-[#161b22] text-[#f0f6fc]" : "text-[#6e7681] hover:text-[#8b949e]")}>Live</button>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-[#3fb950]"><span className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />{demoMode ? "Demo" : "Live"}</span>
        </div>
      </div>
      <div className="border-b border-[#30363d] bg-[#a371f7]/5 px-4 py-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-[#a371f7]">Tambo Generative UI</span>
          <span className="text-[10px] text-[#6e7681]">{tamboComponents.length} components</span>
        </div>
      </div>
      <div ref={messagesContainerRef} className="flex-1 overflow-auto p-3">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#21262d]">{Icons.search}</div>
            <p className="text-sm font-medium text-[#f0f6fc]">Ask anything</p>
            <p className="mt-1 text-xs text-[#6e7681]">Search across all your Diligent data</p>
            <div className="mt-4 space-y-2">
              {["Show my active matters", "Contracts expiring this quarter", "Board meeting prep status", "Tell me about equity grants"].map((suggestion) => (
                <button key={suggestion} onClick={() => setInputValue(suggestion)} className="block w-full rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-2 text-left text-xs text-[#8b949e] transition hover:border-[#58a6ff]/30 hover:text-[#f0f6fc]">{suggestion}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.role === "user" ? (
                  <div className="flex justify-end"><div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#30363d] px-3 py-2"><p className="text-sm text-[#f0f6fc]">{msg.content}</p></div></div>
                ) : (
                  <div className="space-y-2">
                    <div className="rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2"><p className="whitespace-pre-wrap text-xs text-[#f0f6fc]">{msg.content}</p></div>
                    {msg.component && <div className="pl-2">{msg.component}</div>}
                    {msg.results && msg.results.length > 0 && (
                      <div className="space-y-1.5 pl-2">
                        {msg.results.map((result, ridx) => (
                          <button key={ridx} className="w-full rounded-lg border border-[#30363d] bg-[#21262d] p-2 text-left transition hover:border-[#58a6ff]/30">
                            <div className="flex items-center justify-between"><span className="text-[10px] text-[#6e7681]">{result.source}</span><span className="text-[10px] text-[#3fb950]">{result.confidence}%</span></div>
                            <p className="mt-1 text-xs font-medium text-[#f0f6fc]">{result.title}</p>
                            <p className="mt-0.5 text-[10px] text-[#8b949e]">{result.snippet}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pl-2">
                        {msg.actions.map((action, aidx) => (
                          <button key={aidx} onClick={() => setInputValue(action.label)} className="rounded-full border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-[10px] text-[#8b949e] transition hover:border-[#58a6ff]/50 hover:text-[#f0f6fc]">{action.label}</button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (<div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2"><div className="h-2 w-2 animate-pulse rounded-full bg-[#58a6ff]" /><span className="text-xs text-[#8b949e]">Thinking...</span></div>)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="border-t border-[#30363d] p-3">
        <div className="flex items-center gap-2">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} disabled={isLoading} className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:outline-none disabled:opacity-50" placeholder="Ask anything..." />
          <button onClick={handleSubmit} disabled={!inputValue.trim() || isLoading} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#58a6ff] text-white transition hover:bg-[#79b8ff] disabled:opacity-50">{Icons.send}</button>
        </div>
        <p className="mt-1 text-[10px] text-[#6e7681]">{demoMode ? "Demo mode: simulated responses with Tambo components" : "Live mode: powered by Tambo AI"}</p>
      </div>
    </div>
  );
}

// Demo-only version (no Tambo hooks)
function AIAssistantPanelDemoOnly() {
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{
    role: "user" | "assistant";
    content: string;
    component?: React.ReactNode;
    results?: Array<{ title: string; source: string; snippet: string; confidence: number }>;
    actions?: Array<{ label: string }>;
  }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Scroll within container only, not the whole page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getDemoResponse = (query: string): { content: string; component?: React.ReactNode; results?: Array<{ title: string; source: string; snippet: string; confidence: number }>; actions?: Array<{ label: string }> } => {
    const q = query.toLowerCase();
    
    if (q.includes("matter") || q.includes("litigation") || q.includes("smith")) {
      return {
        content: "Here's the current status of your active matters:",
        component: (
          <div className="mt-2 space-y-2">
            <MatterCard id="MATTER-2024-0847" title="Smith v. Acme Holdings" status="Discovery" probability="73% favorable" detail="Document production deadline approaching." lastUpdate="2 days ago" nextDeadline="Feb 15" />
          </div>
        ),
        actions: [{ label: "View all matters" }],
      };
    }
    
    if (q.includes("contract") || q.includes("expir") || q.includes("renewal")) {
      return {
        content: "I found contracts requiring attention:",
        component: <ContractCard id="CONTRACT-2847" title="Master Services Agreement" counterparty="Acme Corp" renewalDate="Mar 15, 2025" value="$2.4M/year" status="Renewal pending" alertType="warning" />,
        actions: [{ label: "Start renewal workflow" }],
      };
    }
    
    if (q.includes("board") || q.includes("meeting")) {
      return {
        content: "Board meeting is in 12 days:",
        component: <BoardItemCard id="BOARD-Q1-01" title="Financial Results Review" type="Discussion" status="Scheduled" meetingDate="Feb 14" prepStatus="Complete" />,
        actions: [{ label: "View full agenda" }],
      };
    }
    
    return { content: "Try asking about: matters, contracts, or board meetings", actions: [] };
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsLoading(true);
    setTimeout(() => {
      const response = getDemoResponse(userMessage);
      setMessages(prev => [...prev, { role: "assistant", ...response }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex h-full w-[380px] flex-col bg-[#161b22]">
      <div className="flex items-center justify-between border-b border-[#30363d] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7]">
            <DiligentLogo className="h-3 w-3" />
          </div>
          <span className="text-sm font-semibold text-[#f0f6fc]">AI Assistant</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[#d29922]/20 px-2 py-0.5 text-[10px] text-[#d29922]">Demo Only</span>
      </div>

      <div className="border-b border-[#30363d] bg-[#a371f7]/5 px-4 py-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-[#a371f7]">Tambo Generative UI</span>
          <span className="text-[10px] text-[#6e7681]">Configure API key for live mode</span>
        </div>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-auto p-3">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#21262d]">{Icons.search}</div>
            <p className="text-sm font-medium text-[#f0f6fc]">Ask anything</p>
            <div className="mt-4 space-y-2">
              {["Show my active matters", "Contracts expiring", "Board meeting prep"].map((s) => (
                <button key={s} onClick={() => setInputValue(s)} className="block w-full rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-2 text-left text-xs text-[#8b949e] hover:border-[#58a6ff]/30">{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.role === "user" ? (
                  <div className="flex justify-end"><div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#30363d] px-3 py-2"><p className="text-sm text-[#f0f6fc]">{msg.content}</p></div></div>
                ) : (
                  <div className="space-y-2">
                    <div className="rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2"><p className="text-xs text-[#f0f6fc]">{msg.content}</p></div>
                    {msg.component && <div className="pl-2">{msg.component}</div>}
                    {msg.actions && msg.actions.length > 0 && <div className="flex flex-wrap gap-1.5 pl-2">{msg.actions.map((a, i) => <button key={i} onClick={() => setInputValue(a.label)} className="rounded-full border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-[10px] text-[#8b949e] hover:border-[#58a6ff]/50">{a.label}</button>)}</div>}
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2"><div className="h-2 w-2 animate-pulse rounded-full bg-[#58a6ff]" /><span className="text-xs text-[#8b949e]">Thinking...</span></div>}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-[#30363d] p-3">
        <div className="flex items-center gap-2">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} disabled={isLoading} className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:outline-none disabled:opacity-50" placeholder="Ask anything..." />
          <button onClick={handleSubmit} disabled={!inputValue.trim() || isLoading} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#58a6ff] text-white hover:bg-[#79b8ff] disabled:opacity-50">{Icons.send}</button>
        </div>
      </div>
    </div>
  );
}

// Wrapper that switches based on TamboProvider availability
function AIAssistantPanel({ hasTamboProvider }: { hasTamboProvider: boolean }) {
  if (!hasTamboProvider) return <AIAssistantPanelDemoOnly />;
  return <AIAssistantPanelWithTambo />;
}

// Top navigation bar
function TopBar() {
  return (
    <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-4 py-2">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#6e7681]">Prototype</span>
        <span className="text-sm font-semibold text-[#f0f6fc]">General Counsel Command Center</span>
      </div>
      
      {/* Version Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#6e7681]">Model:</span>
        <div className="flex rounded-lg border border-[#30363d] bg-[#161b22] p-0.5">
          <a href="/now/agentic-hero/dark/general-counsel" className="rounded-md px-2.5 py-1 text-xs text-[#8b949e] hover:text-[#f0f6fc]">
            Unified Chat
          </a>
          <a href="/now/agentic-hero/dark/general-counsel/v2" className="rounded-md bg-[#58a6ff] px-2.5 py-1 text-xs font-medium text-white">
            Split Panel
          </a>
          <a href="/now/agentic-hero/dark/general-counsel/v3" className="rounded-md px-2.5 py-1 text-xs text-[#8b949e] hover:text-[#f0f6fc]">
            Chat Thread
          </a>
        </div>
      </div>
    </div>
  );
}

// Main layout content
function PageContent({ hasTamboProvider }: { hasTamboProvider: boolean }) {
  const [activeNav, setActiveNav] = React.useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  
  // Ticker hover state
  const [hoveredAgent, setHoveredAgent] = React.useState<AgentInfo | null>(null);
  const [popoverPos, setPopoverPos] = React.useState({ x: 0, y: 0 });
  const [popoverHovered, setPopoverHovered] = React.useState(false);
  const tickerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex h-screen flex-col bg-[#0d1117]">
      <TopBar />
      {/* Tambo Instructions */}
      <div className="border-b border-[#30363d] bg-[#161b22]/80 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#a371f7]/20">
            <span className="text-[10px]">✨</span>
          </div>
          <p className="text-xs text-[#8b949e]">
            <span className="font-medium text-[#f0f6fc]">Tambo Live:</span> Try &quot;who is Sarah Chen&quot;, &quot;schedule a meeting&quot;, &quot;show me a report&quot;, &quot;contracts expiring&quot;
          </p>
        </div>
      </div>
      <AgentTicker 
        hoveredAgent={hoveredAgent}
        setHoveredAgent={setHoveredAgent}
        popoverPos={popoverPos}
        setPopoverPos={setPopoverPos}
        popoverHovered={popoverHovered}
        setPopoverHovered={setPopoverHovered}
        tickerRef={tickerRef}
      />
      <div className="flex flex-1 overflow-hidden">
        <NavSidebar 
          active={activeNav} 
          onSelect={setActiveNav}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <WorkPanel />
        <AIAssistantPanel hasTamboProvider={hasTamboProvider} />
      </div>
    </div>
  );
}

// Main export with TamboProvider
export default function Page() {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  if (!apiKey) return <PageContent hasTamboProvider={false} />;
  return <TamboProvider apiKey={apiKey} components={tamboComponents}><PageContent hasTamboProvider={true} /></TamboProvider>;
}
