"use client";

import React from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Utilities                                                          */
/* ------------------------------------------------------------------ */

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type AgentStatus = "complete" | "active" | "pending" | "needs-review";

export type PipelineStage = {
  id: string;
  name: string;
  agent: string;
  status: AgentStatus;
  href: string;
};

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: "reviewer", name: "The Reviewer", agent: "Risk Extraction", status: "complete", href: "/now/agentic-hero/superhero/reviewer" },
  { id: "coordinator", name: "The Coordinator", agent: "Validation Workflow", status: "complete", href: "/now/agentic-hero/superhero/coordinator" },
  { id: "producer", name: "The Producer", agent: "ERM Deck Creation", status: "active", href: "/now/agentic-hero/superhero/producer" },
  { id: "writer", name: "The Writer", agent: "10K Disclosure Draft", status: "pending", href: "/now/agentic-hero/superhero/writer" },
  { id: "finisher", name: "The Finisher", agent: "Filing Prep", status: "pending", href: "/now/agentic-hero/superhero/finisher" },
];

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

export const Icons = {
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  scan: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  ),
  route: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3" />
    </svg>
  ),
  presentation: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  pen: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  clock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  arrowRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  chevronRight: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  file: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  zap: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  users: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  barChart: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
};

export const AGENT_ICONS: Record<string, React.ReactNode> = {
  reviewer: Icons.scan,
  coordinator: Icons.route,
  producer: Icons.presentation,
  writer: Icons.pen,
  finisher: Icons.check,
};

/* ------------------------------------------------------------------ */
/*  PipelineBanner                                                     */
/* ------------------------------------------------------------------ */

export function PipelineBanner() {
  return (
    <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-6 py-2.5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#3fb950]" />
          <span className="text-xs font-semibold text-[#f0f6fc]">Q1 2026 Board Cycle</span>
        </div>
        <div className="h-3 w-px bg-[#30363d]" />
        <span className="text-xs text-[#8b949e]">Enterprise Risk Management Pipeline</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-4 rounded-full",
                  i <= 2 ? "bg-[#3fb950]" : i === 3 ? "bg-[#58a6ff]" : "bg-[#30363d]"
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#8b949e]">3/5 stages</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#3fb950]">
          {Icons.clock}
          <span>6 weeks → 3 days</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AgentNav                                                           */
/* ------------------------------------------------------------------ */

export function AgentNav({ activeAgent }: { activeAgent: string }) {
  return (
    <nav className="flex items-center gap-1 border-b border-[#30363d] bg-[#0d1117] px-6">
      <Link
        href="/now/agentic-hero/superhero"
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors border-b-2",
          activeAgent === "hub"
            ? "border-[#58a6ff] text-[#f0f6fc]"
            : "border-transparent text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded bg-[#21262d]">{Icons.shield}</span>
        Hub
      </Link>
      {PIPELINE_STAGES.map((stage) => (
        <Link
          key={stage.id}
          href={stage.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors border-b-2",
            activeAgent === stage.id
              ? "border-[#58a6ff] text-[#f0f6fc]"
              : "border-transparent text-[#8b949e] hover:text-[#f0f6fc]"
          )}
        >
          <StatusDot status={stage.status} />
          <span className="flex h-5 w-5 items-center justify-center">{AGENT_ICONS[stage.id]}</span>
          {stage.name}
        </Link>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  StatusDot                                                          */
/* ------------------------------------------------------------------ */

function StatusDot({ status }: { status: AgentStatus }) {
  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full flex-shrink-0",
        status === "complete" && "bg-[#3fb950]",
        status === "active" && "bg-[#58a6ff] animate-pulse",
        status === "pending" && "bg-[#484f58]",
        status === "needs-review" && "bg-[#d29922]"
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  PipelineStepper                                                    */
/* ------------------------------------------------------------------ */

export function PipelineStepper({ currentStage }: { currentStage?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      {PIPELINE_STAGES.map((stage, i) => (
        <React.Fragment key={stage.id}>
          <Link href={stage.href} className="group flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                stage.status === "complete" && "bg-[#3fb950]/20 text-[#3fb950]",
                stage.status === "active" && "bg-[#58a6ff]/20 text-[#58a6ff] ring-2 ring-[#58a6ff]/40",
                stage.status === "pending" && "bg-[#21262d] text-[#484f58]",
                stage.status === "needs-review" && "bg-[#d29922]/20 text-[#d29922]"
              )}
            >
              {stage.status === "complete" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div>
              <div className={cn(
                "text-xs font-semibold",
                stage.id === currentStage ? "text-[#f0f6fc]" : "text-[#8b949e]",
                "group-hover:text-[#f0f6fc] transition-colors"
              )}>
                {stage.name}
              </div>
              <div className="text-[10px] text-[#484f58]">{stage.agent}</div>
            </div>
          </Link>
          {i < PIPELINE_STAGES.length - 1 && (
            <div className={cn(
              "mx-2 h-px flex-1",
              PIPELINE_STAGES[i].status === "complete" ? "bg-[#3fb950]/40" : "bg-[#30363d]"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AgentCard                                                          */
/* ------------------------------------------------------------------ */

export function AgentCard({
  stage,
  metric,
  metricLabel,
  onClick,
}: {
  stage: PipelineStage;
  metric: string;
  metricLabel: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={stage.href}
      onClick={onClick}
      className="group flex flex-col rounded-xl border border-[#30363d] bg-[#161b22] p-4 transition-colors hover:border-[#58a6ff]/50"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            stage.status === "complete" && "bg-[#3fb950]/20 text-[#3fb950]",
            stage.status === "active" && "bg-[#58a6ff]/20 text-[#58a6ff]",
            stage.status === "pending" && "bg-[#21262d] text-[#484f58]",
            stage.status === "needs-review" && "bg-[#d29922]/20 text-[#d29922]"
          )}>
            {AGENT_ICONS[stage.id]}
          </div>
          <StatusBadge status={stage.status} />
        </div>
        <span className="text-[#484f58] group-hover:text-[#8b949e] transition-colors">{Icons.chevronRight}</span>
      </div>
      <div className="text-sm font-semibold text-[#f0f6fc]">{stage.name}</div>
      <div className="text-xs text-[#8b949e] mb-3">{stage.agent}</div>
      <div className="mt-auto border-t border-[#21262d] pt-3">
        <div className="text-lg font-bold text-[#f0f6fc]">{metric}</div>
        <div className="text-[10px] text-[#484f58]">{metricLabel}</div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  MetricCard                                                         */
/* ------------------------------------------------------------------ */

export function MetricCard({
  label,
  value,
  trend,
  trendDirection,
}: {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58]">{label}</div>
      <div className="mt-1 text-2xl font-bold text-[#f0f6fc]">{value}</div>
      {trend && (
        <div className={cn(
          "mt-1 text-xs",
          trendDirection === "up" && "text-[#3fb950]",
          trendDirection === "down" && "text-[#da3633]",
          trendDirection === "neutral" && "text-[#8b949e]"
        )}>
          {trend}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StatusBadge                                                        */
/* ------------------------------------------------------------------ */

export function StatusBadge({ status }: { status: AgentStatus }) {
  const config: Record<AgentStatus, { label: string; classes: string }> = {
    complete: { label: "Complete", classes: "bg-[#3fb950]/10 text-[#3fb950] border-[#3fb950]/30" },
    active: { label: "Active", classes: "bg-[#58a6ff]/10 text-[#58a6ff] border-[#58a6ff]/30 animate-pulse" },
    pending: { label: "Pending", classes: "bg-[#21262d] text-[#484f58] border-[#30363d]" },
    "needs-review": { label: "Needs Review", classes: "bg-[#d29922]/10 text-[#d29922] border-[#d29922]/30" },
  };
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", c.classes)}>
      {c.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ActivityItem                                                       */
/* ------------------------------------------------------------------ */

export function ActivityItem({
  time,
  agentId,
  action,
}: {
  time: string;
  agentId: string;
  action: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="mt-0.5 text-[10px] text-[#484f58] whitespace-nowrap w-16 flex-shrink-0">{time}</span>
      <div className={cn(
        "flex h-5 w-5 items-center justify-center rounded flex-shrink-0",
        "bg-[#21262d] text-[#8b949e]"
      )}>
        {AGENT_ICONS[agentId] || Icons.zap}
      </div>
      <span className="text-xs text-[#8b949e]">{action}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DocumentPreview                                                    */
/* ------------------------------------------------------------------ */

export function DocumentPreview({
  title,
  type,
  children,
}: {
  title: string;
  type?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[#8b949e]">{Icons.file}</span>
          <span className="text-xs font-medium text-[#f0f6fc]">{title}</span>
        </div>
        {type && (
          <span className="rounded-full bg-[#21262d] border border-[#30363d] px-2 py-0.5 text-[10px] text-[#8b949e]">
            {type}
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RiskRow                                                            */
/* ------------------------------------------------------------------ */

export type RiskEntry = {
  name: string;
  category: "Strategic" | "Financial" | "Operational" | "Compliance" | "Cybersecurity";
  score: number;
  owner?: string;
  status: AgentStatus;
  confidence?: number;
  source?: string;
  isNew?: boolean;
  isUpgrade?: boolean;
};

const categoryColors: Record<string, string> = {
  Strategic: "text-[#bc8cff] bg-[#bc8cff]/10 border-[#bc8cff]/30",
  Financial: "text-[#58a6ff] bg-[#58a6ff]/10 border-[#58a6ff]/30",
  Operational: "text-[#d29922] bg-[#d29922]/10 border-[#d29922]/30",
  Compliance: "text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/30",
  Cybersecurity: "text-[#f85149] bg-[#f85149]/10 border-[#f85149]/30",
};

export function RiskRow({
  risk,
  expanded,
  onToggle,
  reasoning,
}: {
  risk: RiskEntry;
  expanded?: boolean;
  onToggle?: () => void;
  reasoning?: string;
}) {
  const scoreColor =
    risk.score >= 20 ? "text-[#f85149]" :
    risk.score >= 15 ? "text-[#d29922]" :
    risk.score >= 10 ? "text-[#58a6ff]" :
    "text-[#3fb950]";

  return (
    <div className="border-b border-[#21262d] last:border-b-0">
      <div
        className="flex items-center gap-4 px-4 py-3 hover:bg-[#161b22]/50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#f0f6fc] truncate">{risk.name}</span>
            {risk.isNew && (
              <span className="rounded-full bg-[#58a6ff]/10 border border-[#58a6ff]/30 px-1.5 py-0 text-[9px] text-[#58a6ff] font-medium">
                NEW
              </span>
            )}
            {risk.isUpgrade && (
              <span className="rounded-full bg-[#d29922]/10 border border-[#d29922]/30 px-1.5 py-0 text-[9px] text-[#d29922] font-medium">
                UPGRADE
              </span>
            )}
          </div>
        </div>
        <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px]", categoryColors[risk.category])}>
          {risk.category}
        </span>
        <span className={cn("text-sm font-mono font-semibold w-8 text-right", scoreColor)}>{risk.score}</span>
        {risk.owner && <span className="text-xs text-[#8b949e] w-20 truncate">{risk.owner}</span>}
        <StatusBadge status={risk.status} />
        {risk.confidence !== undefined && (
          <span className="text-[10px] text-[#484f58] w-10 text-right">{risk.confidence}%</span>
        )}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={cn("text-[#484f58] transition-transform flex-shrink-0", expanded && "rotate-180")}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {expanded && reasoning && (
        <div className="px-4 pb-3 ml-4">
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
            <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-1">AI Reasoning</div>
            <p className="text-xs text-[#8b949e] leading-relaxed">{reasoning}</p>
            {risk.source && (
              <div className="mt-2 text-[10px] text-[#484f58]">Source: {risk.source}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Header                                                     */
/* ------------------------------------------------------------------ */

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-[#f0f6fc]">{title}</h2>
        {subtitle && <p className="text-xs text-[#8b949e] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Button                                                         */
/* ------------------------------------------------------------------ */

export function CTAButton({ children, href, variant = "primary" }: { children: React.ReactNode; href?: string; variant?: "primary" | "secondary" }) {
  const classes = cn(
    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
    variant === "primary" && "bg-[#58a6ff] text-[#0d1117] hover:bg-[#79c0ff]",
    variant === "secondary" && "border border-[#30363d] bg-[#21262d] text-[#f0f6fc] hover:border-[#58a6ff]/50"
  );
  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }
  return <button className={classes}>{children}</button>;
}

/* ------------------------------------------------------------------ */
/*  Agent Page Shell                                                   */
/* ------------------------------------------------------------------ */

export function AgentPageShell({
  agentId,
  title,
  subtitle,
  status,
  children,
}: {
  agentId: string;
  title: string;
  subtitle: string;
  status: AgentStatus;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Agent Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            status === "complete" && "bg-[#3fb950]/20 text-[#3fb950]",
            status === "active" && "bg-[#58a6ff]/20 text-[#58a6ff]",
            status === "pending" && "bg-[#21262d] text-[#484f58]",
            status === "needs-review" && "bg-[#d29922]/20 text-[#d29922]"
          )}>
            <span className="scale-125">{AGENT_ICONS[agentId]}</span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#f0f6fc]">{title}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-[#8b949e] mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
