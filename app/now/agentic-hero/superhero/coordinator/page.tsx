"use client";
import React, { useState } from "react";
import {
  PipelineBanner,
  AgentNav,
  PipelineStepper,
  AgentPageShell,
  SectionHeader,
  CTAButton,
  MetricCard,
  StatusBadge,
  ActivityItem,
  Icons,
  cn,
} from "../shared";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type ValidatedRisk = {
  name: string;
  owner: string;
  ownerTitle: string;
  response: string;
  scoreChange?: { from: number; to: number };
};

type PendingRisk = {
  name: string;
  owner: string;
  ownerTitle: string;
  note: string;
  daysSent: number;
  reminderSent: boolean;
};

type SurfacedRisk = {
  name: string;
  surfacedBy: string;
  surfacedByTitle: string;
  description: string;
};

const VALIDATED_RISKS: ValidatedRisk[] = [
  {
    name: "Revenue Concentration Risk",
    owner: "Sarah Chen",
    ownerTitle: "CFO",
    response:
      "Confirmed, adjusted score 12\u219215. APAC regulatory changes accelerating.",
    scoreChange: { from: 12, to: 15 },
  },
  {
    name: "Third-Party Cyber Risk",
    owner: "Marcus Webb",
    ownerTitle: "CISO",
    response: "Validated, no changes",
  },
  {
    name: "Regulatory Change \u2014 Data Privacy",
    owner: "James Park",
    ownerTitle: "CLO",
    response: "Confirmed. EU AI Act timeline moved up.",
  },
  {
    name: "Supply Chain Concentration",
    owner: "Diana Reyes",
    ownerTitle: "VP Ops",
    response:
      "Confirmed, adjusted score 14\u219216. New single-source dependency identified.",
    scoreChange: { from: 14, to: 16 },
  },
  {
    name: "Foreign Exchange Volatility",
    owner: "Sarah Chen",
    ownerTitle: "CFO",
    response: "Validated, no changes",
  },
  {
    name: "Key Personnel Retention",
    owner: "Lisa Huang",
    ownerTitle: "CHRO",
    response: "Confirmed. Added context: 3 senior departures in Q4.",
    scoreChange: { from: 11, to: 13 },
  },
  {
    name: "ESG Reporting Compliance",
    owner: "Michael Torres",
    ownerTitle: "CSO",
    response: "Validated, minor update to scope",
  },
  {
    name: "Interest Rate Exposure",
    owner: "David Kim",
    ownerTitle: "Treasurer",
    response: "Validated, no changes",
  },
  {
    name: "Vendor Contract Renewal Risk",
    owner: "Amy Foster",
    ownerTitle: "VP Procurement",
    response: "Confirmed. 2 critical renewals in Q2.",
  },
  {
    name: "Board Composition Gap",
    owner: "Robert Yang",
    ownerTitle: "Corp Secretary",
    response: "Validated. Nominating committee addressing.",
  },
  {
    name: "M&A Integration Timeline",
    owner: "Jennifer Walsh",
    ownerTitle: "COO",
    response:
      "Confirmed, score upgraded 13\u219215. Meridian integration behind schedule.",
    scoreChange: { from: 13, to: 15 },
  },
];

const PENDING_RISKS: PendingRisk[] = [
  {
    name: "APAC Market Expansion Risk",
    owner: "Thomas Lee",
    ownerTitle: "VP APAC",
    note: "Sent 2 days ago, reminder sent today",
    daysSent: 2,
    reminderSent: true,
  },
  {
    name: "AI/ML Model Governance",
    owner: "Rachel Green",
    ownerTitle: "CTO",
    note: "Sent yesterday, no response yet",
    daysSent: 1,
    reminderSent: false,
  },
  {
    name: "Geopolitical Disruption \u2014 EU",
    owner: "Hans Mueller",
    ownerTitle: "VP Europe",
    note: "Sent 2 days ago, reminder sent",
    daysSent: 2,
    reminderSent: true,
  },
];

const SCORE_CHANGES: {
  name: string;
  from: number;
  to: number;
}[] = [
  { name: "Revenue Concentration", from: 12, to: 15 },
  { name: "Supply Chain Concentration", from: 14, to: 16 },
  { name: "Key Personnel Retention", from: 11, to: 13 },
  { name: "M&A Integration Timeline", from: 13, to: 15 },
];

const SURFACED_RISKS: SurfacedRisk[] = [
  {
    name: "Climate Regulatory Risk",
    surfacedBy: "Michael Torres",
    surfacedByTitle: "CSO",
    description:
      "New SEC climate disclosure rules will require significant reporting infrastructure changes by Q3",
  },
  {
    name: "Talent Pipeline Risk in AI/ML",
    surfacedBy: "Rachel Green",
    surfacedByTitle: "CTO",
    description:
      "Critical shortage of ML engineers affecting product roadmap; 4 open positions unfilled >90 days",
  },
];

const ACTIVITY_FEED: {
  time: string;
  owner: string;
  action: string;
}[] = [
  {
    time: "9:42 AM",
    owner: "Sarah Chen",
    action:
      'CFO Sarah Chen validated "Revenue Concentration Risk" \u2014 adjusted score from 12 to 15',
  },
  {
    time: "9:38 AM",
    owner: "Marcus Webb",
    action:
      'CISO Marcus Webb validated "Third-Party Cyber Risk" \u2014 no changes',
  },
  {
    time: "9:15 AM",
    owner: "Diana Reyes",
    action:
      'VP Ops Diana Reyes validated "Supply Chain Concentration" \u2014 score adjusted 14\u219216',
  },
  {
    time: "9:02 AM",
    owner: "Michael Torres",
    action:
      'CSO Michael Torres surfaced new risk: "Climate Regulatory Risk"',
  },
  {
    time: "8:51 AM",
    owner: "Jennifer Walsh",
    action:
      'COO Jennifer Walsh validated "M&A Integration Timeline" \u2014 Meridian integration behind schedule',
  },
  {
    time: "8:44 AM",
    owner: "Lisa Huang",
    action:
      'CHRO Lisa Huang validated "Key Personnel Retention" \u2014 3 senior departures flagged',
  },
  {
    time: "8:30 AM",
    owner: "Coordinator",
    action:
      "Sent reminder to VP APAC Thomas Lee for APAC Market Expansion Risk (2 days pending)",
  },
  {
    time: "8:22 AM",
    owner: "Rachel Green",
    action:
      'CTO Rachel Green surfaced new risk: "Talent Pipeline Risk in AI/ML"',
  },
  {
    time: "8:10 AM",
    owner: "Robert Yang",
    action:
      'Corp Secretary Robert Yang validated "Board Composition Gap" \u2014 nominating committee addressing',
  },
  {
    time: "7:55 AM",
    owner: "Amy Foster",
    action:
      'VP Procurement Amy Foster validated "Vendor Contract Renewal Risk" \u2014 2 critical Q2 renewals',
  },
];

/* ------------------------------------------------------------------ */
/*  Inline Components                                                  */
/* ------------------------------------------------------------------ */

function ValidatedRiskCard({ risk }: { risk: ValidatedRisk }) {
  return (
    <div className="rounded-lg border-l-[3px] border-l-[#3fb950] border border-[#30363d] bg-[#161b22] p-4 transition-colors hover:border-[#3fb950]/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#f0f6fc] mb-1">
            {risk.name}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-xs text-[#8b949e]">
              {Icons.users}
              <span>
                {risk.ownerTitle} {risk.owner}
              </span>
            </span>
          </div>
          <p className="text-xs text-[#8b949e] leading-relaxed italic">
            &ldquo;{risk.response}&rdquo;
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-[10px] font-medium text-[#3fb950]">
            Validated
          </span>
        </div>
      </div>
      {risk.scoreChange && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-[#0d1117] border border-[#21262d] px-3 py-1.5">
          <span className="text-[10px] uppercase tracking-wider text-[#484f58] font-medium">
            Score
          </span>
          <span className="text-xs font-mono text-[#8b949e]">
            {risk.scoreChange.from}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f85149"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span className="text-xs font-mono font-semibold text-[#f85149]">
            {risk.scoreChange.to}
          </span>
          <span className="text-[10px] text-[#f85149]">
            (+{risk.scoreChange.to - risk.scoreChange.from})
          </span>
        </div>
      )}
    </div>
  );
}

function PendingRiskCard({ risk }: { risk: PendingRisk }) {
  return (
    <div className="rounded-lg border-l-[3px] border-l-[#d29922] border border-[#30363d] bg-[#161b22] p-4 transition-colors hover:border-[#d29922]/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#f0f6fc] mb-1">
            {risk.name}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-xs text-[#8b949e]">
              {Icons.users}
              <span>
                {risk.ownerTitle} {risk.owner}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-[#d29922]">
              {Icons.clock}
              <span>{risk.note}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="inline-flex items-center rounded-full border border-[#d29922]/30 bg-[#d29922]/10 px-2 py-0.5 text-[10px] font-medium text-[#d29922]">
            Pending
          </span>
          {risk.reminderSent && (
            <span className="inline-flex items-center rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-[10px] text-[#8b949e]">
              Reminder sent
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SurfacedRiskCard({ risk }: { risk: SurfacedRisk }) {
  return (
    <div className="rounded-lg border-l-[3px] border-l-[#58a6ff] border border-[#30363d] bg-[#161b22] p-4 transition-colors hover:border-[#58a6ff]/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[#f0f6fc]">
              {risk.name}
            </span>
            <span className="rounded-full bg-[#58a6ff]/10 border border-[#58a6ff]/30 px-1.5 py-0 text-[9px] text-[#58a6ff] font-medium">
              NEW
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-xs text-[#8b949e]">
              {Icons.users}
              <span>
                Surfaced by {risk.surfacedByTitle} {risk.surfacedBy}
              </span>
            </span>
          </div>
          <p className="text-xs text-[#8b949e] leading-relaxed">
            &ldquo;{risk.description}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function CoordinatorPage() {
  const [showAllValidated, setShowAllValidated] = useState(false);
  const visibleValidated = showAllValidated
    ? VALIDATED_RISKS
    : VALIDATED_RISKS.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Pipeline Banner */}
      <PipelineBanner />

      {/* Agent Navigation */}
      <AgentNav activeAgent="coordinator" />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        <AgentPageShell
          agentId="coordinator"
          title="The Coordinator"
          subtitle="Validation workflow & owner routing — 11 of 14 risks validated, 3 awaiting response"
          status="active"
        >
          {/* Pipeline Stepper */}
          <PipelineStepper currentStage="coordinator" />

          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              label="Validated"
              value="11"
              trend="+3 today"
              trendDirection="up"
            />
            <MetricCard
              label="Pending"
              value="3"
              trend="1 reminder sent"
              trendDirection="neutral"
            />
            <MetricCard
              label="Score Changes"
              value="4"
              trend="Avg +2.3 pts"
              trendDirection="up"
            />
            <MetricCard
              label="New Surfaced"
              value="2"
              trend="From owner feedback"
              trendDirection="neutral"
            />
          </div>

          {/* -------------------------------------------------------- */}
          {/*  Validation Dashboard                                     */}
          {/* -------------------------------------------------------- */}
          <div className="space-y-8">
            {/* Validated Risks */}
            <div>
              <SectionHeader
                title="Validated Risks"
                subtitle="11 risks confirmed by their owners"
                action={
                  <button
                    onClick={() => setShowAllValidated(!showAllValidated)}
                    className="text-xs text-[#58a6ff] hover:text-[#79c0ff] transition-colors"
                  >
                    {showAllValidated ? "Show less" : "Show all 11"}
                  </button>
                }
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleValidated.map((risk) => (
                  <ValidatedRiskCard key={risk.name} risk={risk} />
                ))}
              </div>
              {!showAllValidated && (
                <div className="mt-3 text-center">
                  <button
                    onClick={() => setShowAllValidated(true)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-1.5 text-xs text-[#8b949e] hover:border-[#58a6ff]/50 hover:text-[#f0f6fc] transition-colors"
                  >
                    +{VALIDATED_RISKS.length - 6} more validated risks
                    {Icons.chevronRight}
                  </button>
                </div>
              )}
            </div>

            {/* Pending Owner Review */}
            <div>
              <SectionHeader
                title="Pending Owner Review"
                subtitle="3 risks awaiting validation from risk owners"
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PENDING_RISKS.map((risk) => (
                  <PendingRiskCard key={risk.name} risk={risk} />
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/*  Risk Scoring Summary                                     */}
          {/* -------------------------------------------------------- */}
          <div>
            <SectionHeader
              title="Risk Scoring Summary"
              subtitle="Risks with score adjustments after owner validation"
            />
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_80px_40px_80px_80px] items-center gap-4 border-b border-[#30363d] bg-[#0d1117] px-5 py-2.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#484f58]">
                  Risk
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] text-center">
                  Before
                </span>
                <span />
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] text-center">
                  After
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] text-right">
                  Change
                </span>
              </div>
              {/* Table rows */}
              {SCORE_CHANGES.map((item) => {
                const delta = item.to - item.from;
                return (
                  <div
                    key={item.name}
                    className="grid grid-cols-[1fr_80px_40px_80px_80px] items-center gap-4 border-b border-[#21262d] last:border-b-0 px-5 py-3 hover:bg-[#21262d]/40 transition-colors"
                  >
                    <span className="text-sm text-[#f0f6fc]">{item.name}</span>
                    <span className="text-sm font-mono text-[#8b949e] text-center">
                      {item.from}
                    </span>
                    <span className="flex justify-center text-[#f85149]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-mono font-semibold text-[#f85149] text-center">
                      {item.to}
                    </span>
                    <div className="flex items-center justify-end gap-1">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f85149"
                        strokeWidth="2.5"
                      >
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                      <span className="text-xs font-semibold text-[#f85149]">
                        +{delta}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/*  Newly Surfaced Risks                                     */}
          {/* -------------------------------------------------------- */}
          <div>
            <SectionHeader
              title="Newly Surfaced Risks"
              subtitle="Risks flagged by owners that were not in the original extraction"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {SURFACED_RISKS.map((risk) => (
                <SurfacedRiskCard key={risk.name} risk={risk} />
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/*  Owner Activity Feed                                      */}
          {/* -------------------------------------------------------- */}
          <div>
            <SectionHeader
              title="Owner Activity Feed"
              subtitle="Chronological log of owner responses and coordinator actions"
            />
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] divide-y divide-[#21262d]">
              {ACTIVITY_FEED.map((entry, i) => (
                <div key={i} className="px-4">
                  <ActivityItem
                    time={entry.time}
                    agentId="coordinator"
                    action={entry.action}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/*  CTA                                                      */}
          {/* -------------------------------------------------------- */}
          <div className="flex justify-end pt-2">
            <CTAButton href="/now/agentic-hero/superhero/producer">
              Generate ERM deck {Icons.arrowRight}
            </CTAButton>
          </div>
        </AgentPageShell>
      </main>
    </div>
  );
}
