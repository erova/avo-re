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

type AgentStatus = {
  name: string;
  lastRun: string;
  nextRun: string;
  note: string;
  state: string;
  criteria: string[];
};

const agents: AgentStatus[] = [
  { name: "Entity Monitor", lastRun: "8 minutes ago", nextRun: "in 22 minutes", note: "No material changes detected", state: "Monitoring active", criteria: ["Entity hierarchy changes", "Vendor risk deltas", "New jurisdiction exposure"] },
  { name: "Policy Drift Watch", lastRun: "31 minutes ago", nextRun: "in 29 minutes", note: "All policies aligned with current controls", state: "Quietly stable", criteria: ["Control-library changes", "Policy exceptions", "Review cadence gaps"] },
  { name: "Third-Party Sentinel", lastRun: "45 minutes ago", nextRun: "in 15 minutes", note: "Vendor posture remains steady", state: "Monitoring active", criteria: ["Critical vendor alerts", "SLA deviations", "Sanctions list updates"] },
  { name: "Investigation Triage", lastRun: "1 hour ago", nextRun: "in 1 hour", note: "No active cases to route", state: "Standing by", criteria: ["Hotline submissions", "Case severity scores", "Duplicate incident checks"] },
  { name: "Board Briefing Prep", lastRun: "2 hours ago", nextRun: "tomorrow, 9:00 AM", note: "Briefing queue is clear", state: "On schedule", criteria: ["Quarterly reporting deadlines", "Open critical risks", "Executive requests"] },
];

const recentApps = [
  { name: "Entities", description: "Reviewed entity map for recent structural updates.", lastUsed: "Jan 16" },
  { name: "Risk Manager", description: "Checked open items; all risks are in normal range.", lastUsed: "Jan 16" },
  { name: "Policy Manager", description: "Confirmed policy review cadence is current.", lastUsed: "Jan 15" },
  { name: "TPM", description: "Validated third-party engagement inventory.", lastUsed: "Jan 14" },
  { name: "Boards", description: "Uploaded latest report to Diligent Data Room", lastUsed: "Jan 12" },
];

const nextActions = [
  { title: "Analyze risk coverage gaps", detail: "Compare entity exposures to current control coverage in a calm review pass." },
  { title: "Review entity–vendor dependencies", detail: "Confirm vendor concentration and identify low-effort diversification options." },
  { title: "Assess audit readiness", detail: "Ensure evidence trails remain complete across priority controls." },
  { title: "Generate improvement recommendations", detail: "Capture small refinements while the system is steady." },
];

const whatsNew = [
  { title: "Diligent Insights: Calm governance in steady-state", detail: "A short read on maintaining confidence between cycles.", href: "https://www.diligent.com/insights" },
  { title: "New AI capability: auto-summaries for quiet periods", detail: "Weekly summaries that highlight what stayed the same.", href: "https://www.diligent.com/ai" },
  { title: "Recently added: lightweight assurance notes", detail: "Capture brief, optional notes without creating new tasks.", href: "https://www.diligent.com/platform" },
];

const activityLog = [
  "All monitoring agents completed successfully.",
  "No escalations in the last 24 hours.",
  "Entity inventory synced without changes.",
  "Third-party watchlist refresh completed.",
  "Policy review cadence confirmed for this week.",
];

function SectionHeader({ title, description, className, titleClassName }: { title: string; description?: string; className?: string; titleClassName?: string }) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div>
        <h2 className={cn("mt-2 text-2xl font-semibold text-gray-900", titleClassName)}>{title}</h2>
        {description ? <p className="mt-2 text-sm text-gray-500">{description}</p> : null}
      </div>
    </div>
  );
}

function SoftTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
      {children}
    </span>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", className)}>{children}</div>
  );
}

function PrototypeNav() {
  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Prototype</span>
          <span className="text-sm font-semibold text-gray-900">Agentic Hero</span>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          <a href="/now/agentic-hero/light/security" className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">Security Incident</a>
          <a href="/now/agentic-hero/light/security-jsonrender" className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">JSON Render</a>
          <a href="/now/agentic-hero/light/security-tambo" className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100">Tambo</a>
          <span className="text-gray-300">|</span>
          <a href="/now/agentic-hero/light/whistleblower" className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">Whistleblower</a>
          <a href="/now/agentic-hero/light/compliance" className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">Global Compliance</a>
          <a href="/now/agentic-hero/light" className="rounded-full border border-[#EE312E]/30 bg-[#EE312E]/5 px-3 py-1 text-xs font-semibold text-[#EE312E] hover:bg-[#EE312E]/10">Steady State</a>
        </nav>
      </div>
    </div>
  );
}

function TopNav({ activityOpen, onToggleActivity, activityCount }: { activityOpen: boolean; onToggleActivity: () => void; activityCount: number }) {
  return (
    <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-gray-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <DiligentLogo className="h-7 w-auto" />
            <span className="text-sm font-semibold text-gray-900">GRC Command Center</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleActivity}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-3 text-sm text-gray-700 hover:bg-gray-50",
              activityOpen ? "border-[#EE312E]/50" : "border-gray-200"
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6h12M9 12h12M9 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <span className="font-medium">Recent system activity</span>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-500">({activityCount})</span>
          </button>
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[#EE312E] ring-2 ring-white" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200" />
        </div>
      </div>
    </div>
  );
}

function PromptBox() {
  const [inputValue, setInputValue] = React.useState("");
  return (
    <div>
      {/* Prompt box with gradient top border */}
      <div className="overflow-hidden rounded-2xl shadow-sm" style={{ background: "linear-gradient(to right, #f472b6, #a78bfa, #60a5fa, #2dd4bf)" }}>
        <div className="mt-[2px] rounded-b-2xl bg-white p-5">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="min-h-[48px] w-full resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
            placeholder="What should we review?"
          />
          <div className="mt-2 flex items-center justify-between">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 11a5 5 0 0 0 10 0M12 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <button 
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all",
                  inputValue.trim() 
                    ? "border-[#EE312E] bg-[#EE312E] text-white hover:bg-[#d62b28]" 
                    : "border-gray-200 text-gray-300"
                )}
                disabled={!inputValue.trim()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Quick action buttons below the input */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {[
          { icon: "＋", label: "Add New Entities" },
          { icon: "🔍", label: "Search Policies" },
          { icon: "📊", label: "Create Cyber Risk Report" },
          { icon: "🔔", label: "Show Agents Needing Attention" },
        ].map((item) => (
          <button
            key={item.label}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-gray-400">
        AI-generated content may have inaccuracies. <a href="#" className="underline hover:text-gray-600">Learn more</a>
      </p>
    </div>
  );
}

export default function Page() {
  const [activityOpen, setActivityOpen] = React.useState(false);
  const [hoveredAgent, setHoveredAgent] = React.useState<AgentStatus | null>(null);
  const [popoverPos, setPopoverPos] = React.useState({ x: 0, y: 0 });
  const [popoverHovered, setPopoverHovered] = React.useState(false);
  const tickerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <PrototypeNav />
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6">
            <TopNav activityOpen={activityOpen} onToggleActivity={() => setActivityOpen((v) => !v)} activityCount={activityLog.length} />
            
            {activityOpen && (
              <div className="-mt-4 mb-6">
                <Card className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Recent system activity</p>
                    <button onClick={() => setActivityOpen(false)} className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">Close</button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {activityLog.map((entry) => (
                      <div key={entry} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                        <p className="text-sm text-gray-600">{entry}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            <header className="rounded-3xl border border-gray-200 bg-white/80 p-10 shadow-sm">
              <h1 className="text-center text-4xl font-semibold tracking-tight text-gray-900">
                Everything looks good right now.
              </h1>
              <p className="mt-4 text-center text-sm text-gray-500">
                Calm periods are a good time to validate coverage, map dependencies, and generate recommendations.
              </p>
            </header>

            {/* Agent ticker pinned strip */}
            <div
              className="ticker-strip relative mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2"
              ref={tickerRef}
              onMouseLeave={() => { if (!popoverHovered) setHoveredAgent(null); }}
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-gray-400">GRC Workforce Agents</span>
                <div className="relative flex-1 overflow-hidden">
                  <div className="ticker-track flex w-max items-center gap-6">
                    {[...agents, ...agents].map((agent, idx) => (
                      <div
                        key={`${agent.name}-${idx}`}
                        className="whitespace-nowrap text-sm text-gray-600"
                        onMouseEnter={(e) => {
                          const bounds = tickerRef.current?.getBoundingClientRect();
                          if (!bounds) return;
                          setHoveredAgent(agent);
                          setPopoverPos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
                        }}
                      >
                        <span className="font-medium text-gray-900">{agent.name}</span>
                        <span className="mx-2 text-gray-300">·</span>
                        <span className="text-gray-400">Last {agent.lastRun}, next {agent.nextRun}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {hoveredAgent && (
                <div
                  className="pointer-events-auto absolute z-20 w-80 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-lg"
                  style={{ left: popoverPos.x, top: popoverPos.y + 16, transform: "translateX(-50%)" }}
                  onMouseEnter={() => setPopoverHovered(true)}
                  onMouseLeave={() => { setPopoverHovered(false); setHoveredAgent(null); }}
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Agent criteria</div>
                  <div className="mt-2 text-base font-semibold text-gray-900">{hoveredAgent.name}</div>
                  <p className="mt-1 text-sm text-gray-500">{hoveredAgent.note}</p>
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    {hoveredAgent.criteria.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a href="#" className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">Edit agent</a>
                    <a href="#" className="inline-flex items-center rounded-full bg-[#EE312E] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#d62b28]">View activity</a>
                  </div>
                </div>
              )}
              <style jsx>{`
                .ticker-track { animation: ticker 90s linear infinite; }
                .ticker-strip:hover .ticker-track { animation-play-state: paused; }
                @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }
              `}</style>
            </div>

            <div className="mt-8">
              <PromptBox />
            </div>

            <section className="mt-10">
              <SectionHeader title="Pick up where you left off" />
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {recentApps.map((app) => (
                  <a key={app.name} href="#" className="group block rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{app.name}</h3>
                          <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-500">{app.lastUsed}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{app.description}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-gray-400 opacity-0 transition group-hover:opacity-100">Open</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <SectionHeader title="Since everything's under control, why not get ahead of a few things?" />
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="space-y-3">
                    {nextActions.map((action) => (
                      <div key={action.title} className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                        <div className="flex items-start justify-between gap-6">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">{action.title}</h3>
                            <p className="mt-1 text-sm text-gray-500">{action.detail}</p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                              <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500">Optional</span>
                              <span>Low pressure</span>
                            </div>
                          </div>
                          <button className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">Start</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Card className="p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">What's new</p>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">Good to Know & Good to Go</h3>
                    <p className="mt-2 text-sm text-gray-500">Learn more about features and capabilities you already have today.</p>
                    <div className="mt-4 space-y-3">
                      {whatsNew.map((item) => (
                        <a key={item.title} href={item.href} className="block rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:bg-gray-50">
                          <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                          <p className="mt-1 text-sm text-gray-500">{item.detail}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#EE312E]">Open</p>
                        </a>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            <footer className="mt-14 border-t border-gray-200 bg-gray-50 px-5 py-5">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">System log</p>
                  <p className="mt-1 text-sm text-gray-500">Recent system activity (last 24 hours)</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {activityLog.map((entry) => (
                  <div key={entry} className="flex items-start gap-3 text-sm text-gray-500">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
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
