"use client";

import React from "react";
import {
  PipelineBanner,
  AgentNav,
  PipelineStepper,
  AgentCard,
  MetricCard,
  ActivityItem,
  SectionHeader,
  CTAButton,
  PIPELINE_STAGES,
  Icons,
} from "./shared";

/* ------------------------------------------------------------------ */
/*  Activity Data                                                      */
/* ------------------------------------------------------------------ */

const activities = [
  { time: "10:42 AM", agentId: "producer", action: "Producer started generating ERM deck — 16 risks included, 3 new since Q4" },
  { time: "10:38 AM", agentId: "coordinator", action: "Coordinator completed validation — 11 of 14 risks confirmed by owners" },
  { time: "10:35 AM", agentId: "coordinator", action: "VP Operations responded — confirmed 'Supply Chain Concentration Risk' with adjusted score" },
  { time: "10:22 AM", agentId: "coordinator", action: "CFO confirmed 'Revenue Concentration Risk' — adjusted score from 12 to 15" },
  { time: "10:15 AM", agentId: "coordinator", action: "Coordinator sent validation requests to 8 business owners" },
  { time: "9:48 AM", agentId: "reviewer", action: "Reviewer completed extraction — 14 risk entries created in AI Risk Essentials" },
  { time: "9:30 AM", agentId: "reviewer", action: "Reviewer started scanning Q1 2026 board materials — 47 slides across 4 decks" },
  { time: "9:00 AM", agentId: "reviewer", action: "Pipeline initiated for Q1 2026 Board Cycle" },
];

/* ------------------------------------------------------------------ */
/*  Quick Actions                                                      */
/* ------------------------------------------------------------------ */

const quickActions = [
  { label: "Review extracted risks", href: "/now/agentic-hero/superhero/reviewer", icon: Icons.scan },
  { label: "Approve ERM deck", href: "/now/agentic-hero/superhero/producer", icon: Icons.presentation },
  { label: "Send disclosure to counsel", href: "/now/agentic-hero/superhero/writer", icon: Icons.pen },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HubPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PipelineBanner />
      <AgentNav activeAgent="hub" />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">

          {/* Pipeline Stepper */}
          <PipelineStepper currentStage="producer" />

          {/* Cycle Context */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#8b949e]">
            <span className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
              Q1 2026 Board Cycle
            </span>
            <span className="text-[#30363d]">&middot;</span>
            <span>47 board slides scanned</span>
            <span className="text-[#30363d]">&middot;</span>
            <span>14 risks extracted</span>
            <span className="text-[#30363d]">&middot;</span>
            <span>11 validated</span>
            <span className="text-[#30363d]">&middot;</span>
            <span>ERM deck in progress</span>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Slides Scanned" value="47" trend="+12 vs Q4" trendDirection="up" />
            <MetricCard label="Risks Extracted" value="14" trend="4 new, 2 upgrades" trendDirection="neutral" />
            <MetricCard label="Validated" value="79%" trend="11 of 14 confirmed" trendDirection="up" />
            <MetricCard label="Time Saved" value="~6 wks" trend="Compressed to 3 days" trendDirection="up" />
          </div>

          {/* Agent Cards Grid */}
          <SectionHeader title="Pipeline Agents" subtitle="Click any agent to view their work" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <AgentCard
              stage={PIPELINE_STAGES[0]}
              metric="14"
              metricLabel="risks extracted from 47 slides"
            />
            <AgentCard
              stage={PIPELINE_STAGES[1]}
              metric="11/14"
              metricLabel="risks validated by owners"
            />
            <AgentCard
              stage={PIPELINE_STAGES[2]}
              metric="7"
              metricLabel="deck slides being generated"
            />
            <AgentCard
              stage={PIPELINE_STAGES[3]}
              metric="—"
              metricLabel="awaiting validated risks"
            />
            <AgentCard
              stage={PIPELINE_STAGES[4]}
              metric="—"
              metricLabel="awaiting 10K draft"
            />
          </div>

          {/* Time Savings Banner */}
          <div className="rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/5 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3fb950]/20 text-[#3fb950]">
                {Icons.zap}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#f0f6fc]">Estimated 6 weeks manual → 3 days with agents</div>
                <div className="text-xs text-[#8b949e] mt-0.5">
                  Board material review, risk validation, deck creation, 10K drafting, and filing prep — automated end-to-end
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-[#3fb950]">95%</div>
          </div>

          {/* Bottom Grid: Activity + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Feed */}
            <div className="lg:col-span-2 rounded-xl border border-[#30363d] bg-[#161b22] p-4">
              <SectionHeader title="Recent Activity" subtitle="Agent actions across the pipeline" />
              <div className="divide-y divide-[#21262d]">
                {activities.map((a, i) => (
                  <ActivityItem key={i} time={a.time} agentId={a.agentId} action={a.action} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <SectionHeader title="Quick Actions" />
              <div className="space-y-3">
                {quickActions.map((qa, i) => (
                  <CTAButton key={i} href={qa.href} variant="secondary">
                    <span className="text-[#8b949e]">{qa.icon}</span>
                    {qa.label}
                    <span className="ml-auto text-[#484f58]">{Icons.arrowRight}</span>
                  </CTAButton>
                ))}
              </div>

              {/* Diligent Stack */}
              <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 mt-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-3">Diligent Stack</div>
                <div className="space-y-2">
                  {["Boards", "AI Risk Essentials", "Entities"].map((product) => (
                    <div key={product} className="flex items-center gap-2 text-xs text-[#8b949e]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
                      {product}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline Summary */}
              <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-3">Pipeline Summary</div>
                <div className="space-y-2 text-xs text-[#8b949e]">
                  <div className="flex justify-between">
                    <span>Board meeting</span>
                    <span className="text-[#f0f6fc]">March 15, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>10K filing deadline</span>
                    <span className="text-[#f0f6fc]">March 31, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pipeline started</span>
                    <span className="text-[#f0f6fc]">Today, 9:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. completion</span>
                    <span className="text-[#3fb950]">Feb 13, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
