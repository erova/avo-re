"use client";

import React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type AgentStatus = {
  name: string;
  lastRun: string;
  nextRun: string;
  note: string;
  state: string;
  criteria: string[];
};

const agents: AgentStatus[] = [
  {
    name: "Entity Monitor",
    lastRun: "8 minutes ago",
    nextRun: "in 22 minutes",
    note: "No material changes detected",
    state: "Monitoring active",
    criteria: ["Entity hierarchy changes", "Vendor risk deltas", "New jurisdiction exposure"],
  },
  {
    name: "Policy Drift Watch",
    lastRun: "31 minutes ago",
    nextRun: "in 29 minutes",
    note: "All policies aligned with current controls",
    state: "Quietly stable",
    criteria: ["Control-library changes", "Policy exceptions", "Review cadence gaps"],
  },
  {
    name: "Third-Party Sentinel",
    lastRun: "45 minutes ago",
    nextRun: "in 15 minutes",
    note: "Vendor posture remains steady",
    state: "Monitoring active",
    criteria: ["Critical vendor alerts", "SLA deviations", "Sanctions list updates"],
  },
  {
    name: "Investigation Triage",
    lastRun: "1 hour ago",
    nextRun: "in 1 hour",
    note: "No active cases to route",
    state: "Standing by",
    criteria: ["Hotline submissions", "Case severity scores", "Duplicate incident checks"],
  },
  {
    name: "Board Briefing Prep",
    lastRun: "2 hours ago",
    nextRun: "tomorrow, 9:00 AM",
    note: "Briefing queue is clear",
    state: "On schedule",
    criteria: ["Quarterly reporting deadlines", "Open critical risks", "Executive requests"],
  },
];

const recentApps = [
  {
    name: "Entities",
    description: "Reviewed entity map for recent structural updates.",
    lastUsed: "Jan 16",
  },
  {
    name: "Risk Manager",
    description: "Checked open items; all risks are in normal range.",
    lastUsed: "Jan 16",
  },
  {
    name: "Policy Manager",
    description: "Confirmed policy review cadence is current.",
    lastUsed: "Jan 15",
  },
  {
    name: "TPM",
    description: "Validated third-party engagement inventory.",
    lastUsed: "Jan 14",
  },
  {
    name: "Boards",
    description: "Uploaded latest report to Diligent Data Room",
    lastUsed: "Jan 12",
  },
];

const nextActions = [
  {
    title: "Analyze risk coverage gaps",
    detail: "Compare entity exposures to current control coverage in a calm review pass.",
  },
  {
    title: "Review entity–vendor dependencies",
    detail: "Confirm vendor concentration and identify low-effort diversification options.",
  },
  {
    title: "Assess audit readiness",
    detail: "Ensure evidence trails remain complete across priority controls.",
  },
  {
    title: "Generate improvement recommendations",
    detail: "Capture small refinements while the system is steady.",
  },
];

const whatsNew = [
  {
    title: "Diligent Insights: Calm governance in steady-state",
    detail: "A short read on maintaining confidence between cycles.",
    href: "https://www.diligent.com/insights",
  },
  {
    title: "New AI capability: auto-summaries for quiet periods",
    detail: "Weekly summaries that highlight what stayed the same.",
    href: "https://www.diligent.com/ai",
  },
  {
    title: "Recently added: lightweight assurance notes",
    detail: "Capture brief, optional notes without creating new tasks.",
    href: "https://www.diligent.com/platform",
  },
];

const activityLog = [
  "All monitoring agents completed successfully.",
  "No escalations in the last 24 hours.",
  "Entity inventory synced without changes.",
  "Third-party watchlist refresh completed.",
  "Policy review cadence confirmed for this week.",
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
        <h2 className={cn("mt-2 text-2xl font-semibold text-slate-900", titleClassName)}>{title}</h2>
        {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      </div>
    </div>
  );
}

function SoftTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", className)}>{children}</div>
  );
}

function PrototypeNav() {
  return (
    <div className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Prototype</span>
          <span className="text-sm font-semibold text-slate-900">Agentic Hero</span>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          <a
            href="/now/agentic-hero/bw/security?context=diligent"
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Security Incident
          </a>
          <a
            href="/now/agentic-hero/bw/whistleblower?context=diligent"
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Whistleblower
          </a>
          <a
            href="/now/agentic-hero/bw/compliance?context=diligent"
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Global Compliance
          </a>
          <a
            href="/now/agentic-hero/bw?context=diligent"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-slate-50"
          >
            Steady State
          </a>
        </nav>
      </div>
    </div>
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
    <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900" />
            <span className="text-sm font-semibold text-slate-900">Diligent</span>
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="font-medium">Ibotta, Inc.</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleActivity}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-3 text-sm text-slate-700 hover:bg-slate-50",
              activityOpen ? "border-slate-900" : "border-slate-200"
            )}
            aria-label={`Recent system activity (${activityCount})`}
            title={`Recent system activity (${activityCount})`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6h12M9 12h12M9 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <span className="font-medium">Recent system activity</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">({activityCount})</span>
          </button>

          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" aria-label="Notifications">
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-slate-900 ring-2 ring-white" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" aria-label="More">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          <div className="h-10 w-10 rounded-full bg-slate-200" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function PromptBox() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Prompt Diligent AI to get to work.</h3>
          <p className="mt-2 text-sm text-slate-600">
            Use downtime to analyze gaps, generate recommendations, or map coverage—nothing runs without your action.
          </p>
        </div>
        <SoftTag>Optional</SoftTag>
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <textarea
          className="min-h-[96px] w-full resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          placeholder="e.g., Show me coverage gaps across entities and third parties, and recommend the top 3 actions"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[
            "Analyze coverage gaps",
            "Map entity–vendor links",
            "Assess audit readiness",
            "Generate recommendations",
          ].map((label) => (
            <button
              key={label}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              {label}
            </button>
          ))}
          <div className="flex-1" />
          <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Clear
          </button>
          <button className="rounded-xl border border-slate-900 bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
            Run task
          </button>
        </div>
      </div>
    </Card>
  );
}

export default function Page() {
  const [activityOpen, setActivityOpen] = React.useState(false);
  const [hoveredAgent, setHoveredAgent] = React.useState<AgentStatus | null>(null);
  const [popoverPos, setPopoverPos] = React.useState({ x: 0, y: 0 });
  const [popoverHovered, setPopoverHovered] = React.useState(false);
  const tickerRef = React.useRef<HTMLDivElement | null>(null);
  return (
    <div className="min-h-screen bg-slate-50">
      <PrototypeNav />
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6">
            <TopNav
              activityOpen={activityOpen}
              onToggleActivity={() => setActivityOpen((v) => !v)}
              activityCount={activityLog.length}
            />
            {activityOpen ? (
              <div className="-mt-4 mb-6">
                <Card className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recent system activity</p>
                    <button
                      onClick={() => setActivityOpen(false)}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Close
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {activityLog.map((entry) => (
                      <div key={entry} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                        <p className="text-sm text-slate-700">{entry}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : null}
            <header className="rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-sm">
              <h1 className="text-center text-4xl font-semibold tracking-tight text-slate-900">
                Everything looks good right now.
              </h1>
              <p className="mt-4 text-center text-sm text-slate-500">
                Calm periods are a good time to validate coverage, map dependencies, and generate recommendations.
              </p>
            </header>
            {/* Agent ticker pinned strip */}
            <div
              className="ticker-strip relative mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
              ref={tickerRef}
              onMouseLeave={() => {
                if (!popoverHovered) {
                  setHoveredAgent(null);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  Active agents
                </span>
                <div className="relative flex-1 overflow-hidden">
                  <div className="ticker-track flex w-max items-center gap-6">
                    {[...agents, ...agents].map((agent, idx) => (
                      <div
                        key={`${agent.name}-${idx}`}
                        className="whitespace-nowrap text-sm text-slate-700"
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
                        <span className="font-medium">{agent.name}</span>
                        <span className="mx-2 text-slate-400">·</span>
                        <span className="text-slate-500">Last {agent.lastRun}, next {agent.nextRun}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {hoveredAgent ? (
                <div
                  className="pointer-events-auto absolute z-20 w-80 rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-700 shadow-lg"
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
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Agent criteria</div>
                  <div className="mt-2 text-base font-semibold text-slate-900">{hoveredAgent.name}</div>
                  <p className="mt-1 text-sm text-slate-600">{hoveredAgent.note}</p>
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    {hoveredAgent.criteria.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href="#"
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit agent
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
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
            <div className="mt-8">
              <PromptBox />
            </div>



            <section className="mt-10">
              <SectionHeader title="Pick up where you left off" />
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {recentApps.map((app) => (
                  <a
                    key={app.name}
                    href="#"
                    className="group block rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">{app.name}</h3>
                          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600">{app.lastUsed}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{app.description}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-slate-400 opacity-0 transition group-hover:opacity-100">Open</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <SectionHeader title="Since everything’s under control, why not get ahead of a few things?" />
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="space-y-3">
                    {nextActions.map((action) => (
                      <div
                        key={action.title}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">{action.title}</h3>
                            <p className="mt-1 text-sm text-slate-600">{action.detail}</p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">Optional</span>
                              <span>Low pressure</span>
                            </div>
                          </div>
                          <button className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            Start
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Card className="p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">What’s new</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">Good to Know & Good to Go</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Learn more about features and capabilities you already have today.
                    </p>
                    <div className="mt-4 space-y-3">
                      {whatsNew.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          className="block rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:bg-slate-50"
                        >
                          <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                          <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">Open</p>
                        </a>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            <footer className="mt-14 border-t border-slate-200 bg-slate-50 px-5 py-5">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">System log</p>
                  <p className="mt-1 text-sm text-slate-600">Recent system activity (last 24 hours)</p>
                </div>
                
              </div>
              <div className="mt-4 grid gap-2">
                {activityLog.map((entry) => (
                  <div key={entry} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span>{entry}</span>
                  </div>
                ))}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
