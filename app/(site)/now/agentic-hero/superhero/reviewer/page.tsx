"use client";
import React, { useState } from "react";
import {
  PipelineBanner,
  AgentNav,
  PipelineStepper,
  AgentPageShell,
  RiskRow,
  RiskEntry,
  SectionHeader,
  CTAButton,
  DocumentPreview,
  ActivityItem,
  MetricCard,
  Icons,
  cn,
} from "../shared";

/* ------------------------------------------------------------------ */
/*  Board Deck Data                                                    */
/* ------------------------------------------------------------------ */

const BOARD_DECKS = [
  {
    title: "Q1 2026 Strategy Deck",
    slides: 18,
    riskSignals: 6,
    thumbnails: [
      "Title & Agenda",
      "Market Overview",
      "Revenue Breakdown",
      "Strategic Priorities",
    ],
  },
  {
    title: "Finance Committee Pack",
    slides: 12,
    riskSignals: 4,
    thumbnails: ["Financial Summary", "Cash Flow", "Forecasts"],
  },
  {
    title: "Audit Committee Report",
    slides: 9,
    riskSignals: 3,
    thumbnails: ["Controls Overview", "Finding Summary", "Remediation"],
  },
  {
    title: "Compensation & HR Update",
    slides: 8,
    riskSignals: 1,
    thumbnails: ["Headcount", "Turnover Trends", "Comp Benchmarks"],
  },
];

/* ------------------------------------------------------------------ */
/*  Risk Data                                                          */
/* ------------------------------------------------------------------ */

type ExtractedRisk = RiskEntry & {
  reasoning: string;
};

const EXTRACTED_RISKS: ExtractedRisk[] = [
  {
    name: "Revenue Concentration Risk",
    category: "Strategic",
    score: 15,
    confidence: 92,
    source: "Strategy Deck, Slide 12",
    status: "complete",
    reasoning:
      "Top 3 clients represent 42% of annual revenue. Strategy Deck shows no diversification plan through Q2 2026. Historical churn data from CRM suggests one client is at elevated risk of non-renewal.",
  },
  {
    name: "Third-Party Cyber Risk",
    category: "Cybersecurity",
    score: 18,
    confidence: 88,
    source: "Audit Committee Report, Slide 5",
    status: "complete",
    reasoning:
      "Audit findings reference two critical vendors with outstanding SOC 2 gaps. Finance pack confirms increased spend with these vendors. Cross-referenced with Third Party Manager data showing 3 overdue DDQs.",
  },
  {
    name: "Regulatory Change \u2014 Data Privacy",
    category: "Compliance",
    score: 14,
    confidence: 95,
    source: "Strategy Deck, Slide 15",
    status: "complete",
    reasoning:
      "Strategy deck references APAC expansion into jurisdictions with new data privacy frameworks (India DPDP Act, Vietnam PDPD). Current compliance posture does not cover these regimes. Policy Manager shows no localized privacy policies in draft.",
  },
  {
    name: "APAC Market Expansion Risk",
    category: "Strategic",
    score: 12,
    confidence: 85,
    source: "Strategy Deck, Slides 8-10",
    status: "complete",
    isNew: true,
    reasoning:
      "New market entry into Southeast Asia with limited local infrastructure. Strategy deck acknowledges regulatory complexity but no risk mitigation timeline. No existing risk register entry covers this initiative.",
  },
  {
    name: "Supply Chain Concentration",
    category: "Operational",
    score: 16,
    confidence: 91,
    source: "Finance Committee Pack, Slide 7",
    status: "complete",
    reasoning:
      "Finance pack shows 68% of COGS tied to 2 suppliers. Lead times increased 22% YoY. No dual-sourcing strategy mentioned in board materials. Elevated due to geopolitical exposure in supplier regions.",
  },
  {
    name: "Foreign Exchange Volatility",
    category: "Financial",
    score: 11,
    confidence: 89,
    source: "Finance Committee Pack, Slide 4",
    status: "complete",
    reasoning:
      "Unhedged FX exposure grew 15% with APAC expansion plans. Finance committee notes show EUR/USD and JPY/USD sensitivity but no updated hedging mandate. Current hedge ratio covers only 40% of projected international revenue.",
  },
  {
    name: "Key Personnel Retention",
    category: "Operational",
    score: 13,
    confidence: 78,
    source: "Compensation & HR Update, Slide 3",
    status: "complete",
    reasoning:
      "HR update flags 3 C-suite members with vesting cliffs in Q2 2026. Voluntary turnover in engineering up 18%. Compensation benchmarks show below-median total comp for 4 of 8 executive roles. Succession planning incomplete for 2 critical roles.",
  },
  {
    name: "ESG Reporting Compliance",
    category: "Compliance",
    score: 10,
    confidence: 94,
    source: "Audit Committee Report, Slide 8",
    status: "complete",
    reasoning:
      "Audit committee references upcoming CSRD reporting obligations. Current ESG data collection is manual and fragmented across 3 systems. No assurance-ready process in place. SEC climate disclosure rules also require preparation.",
  },
  {
    name: "AI/ML Model Governance",
    category: "Compliance",
    score: 14,
    confidence: 82,
    source: "Strategy Deck, Slide 16",
    status: "complete",
    isNew: true,
    reasoning:
      "Strategy deck introduces 4 new AI initiatives with no mention of governance framework. EU AI Act compliance timeline unclear. No model inventory or risk classification process exists. This is a new risk not in the current register.",
  },
  {
    name: "Interest Rate Exposure",
    category: "Financial",
    score: 9,
    confidence: 96,
    source: "Finance Committee Pack, Slide 3",
    status: "complete",
    reasoning:
      "Variable rate debt represents 35% of total debt structure. Finance committee models show $4.2M annual impact per 50bps rate increase. Current rate environment is elevated but stabilizing. Existing risk entry may be overstated.",
  },
  {
    name: "Geopolitical Disruption \u2014 EU",
    category: "Strategic",
    score: 17,
    confidence: 87,
    source: "Strategy Deck, Slides 6-7",
    status: "complete",
    isNew: true,
    reasoning:
      "Strategy deck references EU regulatory fragmentation and trade policy shifts. 28% of revenue exposed to EU markets. New Digital Markets Act compliance costs not budgeted. No existing risk entry covers EU-specific geopolitical disruption separately from general market risk.",
  },
  {
    name: "Vendor Contract Renewal Risk",
    category: "Operational",
    score: 11,
    confidence: 90,
    source: "Finance Committee Pack, Slide 9",
    status: "complete",
    reasoning:
      "7 critical vendor contracts expire in Q2-Q3 2026. Finance pack shows 3 have no renewal terms negotiated. Two vendors are sole-source with no approved alternatives. Third Party Manager shows renewal workflows not yet initiated.",
  },
  {
    name: "Board Composition Gap",
    category: "Compliance",
    score: 8,
    confidence: 93,
    source: "Compensation & HR Update, Slide 6",
    status: "complete",
    isNew: true,
    reasoning:
      "HR update identifies 2 board members reaching tenure limits in 2026. Current board lacks cybersecurity and AI expertise per skills matrix. Proxy advisor guidelines recommend refreshment. No succession candidates in pipeline.",
  },
  {
    name: "M&A Integration Timeline",
    category: "Strategic",
    score: 15,
    confidence: 86,
    source: "Strategy Deck, Slide 14",
    status: "complete",
    isUpgrade: true,
    reasoning:
      "Strategy deck shows Q4 2025 acquisition integration is 60% complete vs. 85% target. Systems integration delayed by 3 months. Cultural integration survey shows 34% dissatisfaction in acquired entity. Recommending score upgrade from 12 to 15 based on integration delays.",
  },
];

/* ------------------------------------------------------------------ */
/*  Activity Log                                                       */
/* ------------------------------------------------------------------ */

const ACTIVITY_LOG = [
  {
    time: "9:30 AM",
    agentId: "reviewer",
    action: "Started scanning Q1 2026 board materials",
  },
  {
    time: "9:35 AM",
    agentId: "reviewer",
    action: "Found 6 risk signals in Strategy Deck",
  },
  {
    time: "9:38 AM",
    agentId: "reviewer",
    action: "Found 4 risk signals in Finance Committee Pack",
  },
  {
    time: "9:41 AM",
    agentId: "reviewer",
    action:
      "Cross-referenced with existing risk register in AI Risk Essentials",
  },
  {
    time: "9:45 AM",
    agentId: "reviewer",
    action: "Identified 4 new risks and 2 potential upgrades",
  },
  {
    time: "9:48 AM",
    agentId: "reviewer",
    action:
      "Pre-populated 14 entries in AI Risk Essentials \u2014 ready for validation",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ReviewerPage() {
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <PipelineBanner />
      <AgentNav activeAgent="reviewer" />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <AgentPageShell
          agentId="reviewer"
          title="The Reviewer"
          subtitle="Board deck scanning & risk extraction"
          status="complete"
        >
          {/* ---- Two Panel Layout ---- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ---- Left Panel: Board Material Scanner ---- */}
            <div>
              <SectionHeader
                title="Board Materials Scanned"
                subtitle="47 slides scanned across 4 decks"
              />

              <div className="space-y-3">
                {BOARD_DECKS.map((deck) => (
                  <div
                    key={deck.title}
                    className="rounded-xl border border-[#30363d] bg-[#161b22] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#8b949e]">{Icons.file}</span>
                        <span className="text-sm font-medium text-[#f0f6fc]">
                          {deck.title}
                        </span>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-[10px] font-medium text-[#3fb950]">
                        Scanned
                      </span>
                    </div>

                    {/* Slide Thumbnails */}
                    <div className="flex gap-2 mb-3">
                      {deck.thumbnails.map((label) => (
                        <div
                          key={label}
                          className="flex-1 rounded bg-[#21262d] px-2 py-3 flex items-center justify-center"
                        >
                          <span className="text-[9px] text-[#484f58] text-center leading-tight truncate">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Deck Metadata */}
                    <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                      <span>{deck.slides} slides</span>
                      <span className="h-3 w-px bg-[#30363d]" />
                      <span className="text-[#d29922]">
                        {deck.riskSignals} risk signal
                        {deck.riskSignals !== 1 ? "s" : ""} found
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Comparison */}
              <div className="mt-4 rounded-xl border border-[#30363d] bg-[#161b22] p-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-3">
                  Cross-Reference Summary
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-lg bg-[#0d1117] border border-[#30363d] p-3 text-center">
                    <div className="text-lg font-bold text-[#3fb950]">8</div>
                    <div className="text-[10px] text-[#8b949e]">
                      Match existing risks
                    </div>
                  </div>
                  <div className="flex-1 rounded-lg bg-[#0d1117] border border-[#30363d] p-3 text-center">
                    <div className="text-lg font-bold text-[#58a6ff]">4</div>
                    <div className="text-[10px] text-[#8b949e]">
                      Are new
                    </div>
                  </div>
                  <div className="flex-1 rounded-lg bg-[#0d1117] border border-[#30363d] p-3 text-center">
                    <div className="text-lg font-bold text-[#d29922]">2</div>
                    <div className="text-[10px] text-[#8b949e]">
                      Potential upgrades
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ---- Right Panel: Extracted Risks ---- */}
            <div>
              <SectionHeader
                title="Extracted Risks"
                subtitle="14 risk entries suggested for AI Risk Essentials"
              />

              <div className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden">
                {EXTRACTED_RISKS.map((risk, i) => (
                  <RiskRow
                    key={risk.name}
                    risk={risk}
                    expanded={expandedRisk === i}
                    onToggle={() =>
                      setExpandedRisk(expandedRisk === i ? null : i)
                    }
                    reasoning={risk.reasoning}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ---- Agent Actions Log ---- */}
          <div className="mt-6">
            <SectionHeader title="Agent Actions Log" />
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] px-4 divide-y divide-[#21262d]">
              {ACTIVITY_LOG.map((item, i) => (
                <ActivityItem
                  key={i}
                  time={item.time}
                  agentId={item.agentId}
                  action={item.action}
                />
              ))}
            </div>
          </div>

          {/* ---- CTA ---- */}
          <div className="mt-6 flex justify-end">
            <CTAButton href="/now/agentic-hero/superhero/coordinator">
              Send to owners for validation {"\u2192"}
            </CTAButton>
          </div>
        </AgentPageShell>
      </main>
    </div>
  );
}
