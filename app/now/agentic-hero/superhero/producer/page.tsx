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
  DocumentPreview,
  Icons,
  cn,
} from "../shared";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TOP_RISKS = [
  { name: "Third-Party Cyber Risk", score: 18 },
  { name: "Geopolitical Disruption", score: 17 },
  { name: "Supply Chain Concentration", score: 16 },
  { name: "Revenue Concentration", score: 15 },
  { name: "M&A Integration", score: 15 },
  { name: "AI/ML Model Governance", score: 14 },
  { name: "Data Privacy Regulatory", score: 14 },
  { name: "Key Personnel", score: 13 },
  { name: "APAC Market Expansion", score: 12 },
  { name: "Foreign Exchange", score: 11 },
];

const TREND_DATA = [
  { name: "Third-Party Cyber Risk", q4: 17, q1: 18, direction: "up" as const },
  { name: "Geopolitical Disruption", q4: 15, q1: 17, direction: "up" as const },
  { name: "Supply Chain Concentration", q4: 14, q1: 16, direction: "up" as const },
  { name: "Revenue Concentration", q4: 12, q1: 15, direction: "up" as const },
  { name: "M&A Integration", q4: 15, q1: 15, direction: "unchanged" as const },
  { name: "Key Personnel", q4: 14, q1: 13, direction: "down" as const },
];

const NEW_RISKS = [
  {
    name: "APAC Market Expansion",
    description:
      "Regulatory uncertainty across SE Asian markets creates exposure in planned FY26 expansion. Licensing requirements in 3 target jurisdictions remain unclear.",
  },
  {
    name: "AI/ML Model Governance",
    description:
      "Rapid internal AI adoption without centralized model risk framework. EU AI Act compliance gaps identified in 2 production models.",
  },
  {
    name: "Geopolitical EU",
    description:
      "Escalating EU-US trade tensions and evolving data sovereignty requirements impacting cross-border operations and vendor contracts.",
  },
  {
    name: "Board Composition Gap",
    description:
      "Upcoming retirements create gaps in cybersecurity and AI expertise on audit committee. Succession pipeline lacks qualified candidates.",
  },
];

const OWNERS = [
  { name: "Sarah Chen", role: "CISO", risks: 4, avgScore: 16.2, validated: true },
  { name: "Marcus Rivera", role: "CFO", risks: 3, avgScore: 14.0, validated: true },
  { name: "Priya Patel", role: "COO", risks: 3, avgScore: 14.3, validated: true },
  { name: "James Whitfield", role: "CLO", risks: 3, avgScore: 13.7, validated: false },
  { name: "Aisha Nakamura", role: "CTO", risks: 3, avgScore: 13.0, validated: true },
];

/* ------------------------------------------------------------------ */
/*  Heat Map Grid Data (row=likelihood, col=impact, 0-indexed)         */
/* ------------------------------------------------------------------ */

type HeatDot = { row: number; col: number; color: string; label: string };

const HEAT_DOTS: HeatDot[] = [
  { row: 0, col: 0, color: "#3fb950", label: "FX" },
  { row: 1, col: 1, color: "#3fb950", label: "KP" },
  { row: 2, col: 2, color: "#d29922", label: "MA" },
  { row: 2, col: 3, color: "#d29922", label: "DP" },
  { row: 3, col: 3, color: "#f85149", label: "SC" },
  { row: 3, col: 4, color: "#f85149", label: "GP" },
  { row: 4, col: 4, color: "#f85149", label: "CY" },
];

/* ------------------------------------------------------------------ */
/*  Slide Components                                                   */
/* ------------------------------------------------------------------ */

function SlideTitleSlide() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-8 py-10">
      <div className="mb-6 flex h-8 w-8 items-center justify-center rounded bg-[#f85149]">
        <span className="text-[8px] font-bold text-white">D</span>
      </div>
      <h3 className="text-xl font-bold text-[#f0f6fc] mb-2">
        Enterprise Risk Management Report
      </h3>
      <p className="text-lg text-[#58a6ff] font-medium mb-6">Q1 2026</p>
      <div className="h-px w-24 bg-[#30363d] mb-6" />
      <p className="text-sm text-[#8b949e]">Prepared for Board of Directors</p>
      <p className="text-xs text-[#484f58] mt-1">March 15, 2026</p>
      <div className="mt-8 flex items-center gap-2 text-[10px] text-[#484f58]">
        <span>CONFIDENTIAL</span>
        <span className="text-[#30363d]">|</span>
        <span>Diligent ERM Platform</span>
      </div>
    </div>
  );
}

function SlideHeatMap() {
  const labels = ["Very Low", "Low", "Medium", "High", "Very High"];
  return (
    <div className="flex h-full flex-col px-6 py-5">
      <h4 className="text-sm font-semibold text-[#f0f6fc] mb-4">
        Risk Heat Map — Likelihood vs Impact
      </h4>
      <div className="flex flex-1 items-end gap-2">
        {/* Y-axis label */}
        <div className="flex flex-col items-end justify-between pb-6 pr-2" style={{ height: 220 }}>
          {[...labels].reverse().map((l) => (
            <span key={l} className="text-[8px] text-[#484f58] leading-none whitespace-nowrap">
              {l}
            </span>
          ))}
        </div>
        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-1" style={{ width: "100%" }}>
            {Array.from({ length: 25 }).map((_, idx) => {
              const row = 4 - Math.floor(idx / 5); // 4=top (Very High likelihood)
              const col = idx % 5;
              const dot = HEAT_DOTS.find((d) => d.row === row && d.col === col);
              // Background intensity based on combined risk
              const intensity = row + col;
              const bgColor =
                intensity >= 7
                  ? "rgba(248,81,73,0.15)"
                  : intensity >= 5
                    ? "rgba(210,153,34,0.12)"
                    : intensity >= 3
                      ? "rgba(88,166,255,0.08)"
                      : "rgba(63,185,80,0.06)";
              return (
                <div
                  key={idx}
                  className="relative flex items-center justify-center rounded"
                  style={{
                    height: 40,
                    backgroundColor: bgColor,
                    border: "1px solid rgba(48,54,61,0.5)",
                  }}
                >
                  {dot && (
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[7px] font-bold text-[#0d1117]"
                      style={{ backgroundColor: dot.color }}
                    >
                      {dot.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* X-axis labels */}
          <div className="mt-1.5 grid grid-cols-5 gap-1">
            {labels.map((l) => (
              <span key={l} className="text-center text-[8px] text-[#484f58]">
                {l}
              </span>
            ))}
          </div>
          <p className="mt-1 text-center text-[8px] text-[#484f58]">Impact →</p>
        </div>
      </div>
      <p className="text-[8px] text-[#484f58] mt-1">← Likelihood</p>
    </div>
  );
}

function SlideTopRisks() {
  const maxScore = 20;
  return (
    <div className="flex h-full flex-col px-6 py-5">
      <h4 className="text-sm font-semibold text-[#f0f6fc] mb-4">
        Top 10 Risks — Ranked by Score
      </h4>
      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
        {TOP_RISKS.map((r) => {
          const pct = (r.score / maxScore) * 100;
          const barColor =
            r.score >= 17
              ? "#f85149"
              : r.score >= 15
                ? "#d29922"
                : r.score >= 13
                  ? "#58a6ff"
                  : "#3fb950";
          return (
            <div key={r.name} className="flex items-center gap-2">
              <span className="w-[140px] truncate text-[10px] text-[#8b949e] flex-shrink-0">
                {r.name}
              </span>
              <div className="flex-1 h-4 rounded bg-[#21262d] overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
              <span className="w-6 text-right text-[10px] font-mono font-semibold text-[#f0f6fc] flex-shrink-0">
                {r.score}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[8px] text-[#484f58] mt-2">
        Score = Likelihood (1-5) x Impact (1-5). Max = 25.
      </p>
    </div>
  );
}

function SlideTrendComparison() {
  return (
    <div className="flex h-full flex-col px-6 py-5">
      <h4 className="text-sm font-semibold text-[#f0f6fc] mb-4">
        Trend Comparison — Q4 2025 vs Q1 2026
      </h4>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Q4 Column */}
        <div>
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#484f58]">
            Q4 2025
          </div>
          <div className="space-y-1.5">
            {TREND_DATA.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between rounded-lg bg-[#21262d] px-3 py-2"
              >
                <span className="text-[10px] text-[#8b949e] truncate mr-2">
                  {r.name}
                </span>
                <span className="text-[10px] font-mono font-semibold text-[#f0f6fc]">
                  {r.q4}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Q1 Column */}
        <div>
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#484f58]">
            Q1 2026
          </div>
          <div className="space-y-1.5">
            {TREND_DATA.map((r) => {
              const arrow =
                r.direction === "up"
                  ? "\u2191"
                  : r.direction === "down"
                    ? "\u2193"
                    : "\u2192";
              const arrowColor =
                r.direction === "up"
                  ? "text-[#f85149]"
                  : r.direction === "down"
                    ? "text-[#3fb950]"
                    : "text-[#8b949e]";
              return (
                <div
                  key={r.name}
                  className="flex items-center justify-between rounded-lg bg-[#21262d] px-3 py-2"
                >
                  <span className="text-[10px] text-[#8b949e] truncate mr-2">
                    {r.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-semibold text-[#f0f6fc]">
                      {r.q1}
                    </span>
                    <span className={cn("text-xs font-semibold", arrowColor)}>
                      {arrow}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="text-[8px] text-[#484f58] mt-2">
        Arrows indicate score movement from prior quarter.
      </p>
    </div>
  );
}

function SlideNewEmerging() {
  return (
    <div className="flex h-full flex-col px-6 py-5">
      <h4 className="text-sm font-semibold text-[#f0f6fc] mb-4">
        New & Emerging Risks
      </h4>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {NEW_RISKS.map((r) => (
          <div
            key={r.name}
            className="rounded-lg border border-[#58a6ff]/20 bg-[#58a6ff]/5 p-3 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#58a6ff]" />
              <span className="text-[11px] font-semibold text-[#f0f6fc]">
                {r.name}
              </span>
            </div>
            <p className="text-[9px] text-[#8b949e] leading-relaxed flex-1">
              {r.description}
            </p>
          </div>
        ))}
      </div>
      <p className="text-[8px] text-[#484f58] mt-2">
        4 new risks identified via AI-assisted horizon scanning and board committee input.
      </p>
    </div>
  );
}

function SlideOwnerAccountability() {
  return (
    <div className="flex h-full flex-col px-6 py-5">
      <h4 className="text-sm font-semibold text-[#f0f6fc] mb-4">
        Risk Owner Accountability
      </h4>
      {/* Table header */}
      <div className="grid grid-cols-[1fr_60px_60px_70px_80px] gap-2 px-3 py-1.5 text-[9px] font-medium uppercase tracking-wider text-[#484f58]">
        <span>Owner</span>
        <span className="text-center"># Risks</span>
        <span className="text-center">Avg Score</span>
        <span className="text-center">Validated</span>
        <span className="text-right">Status</span>
      </div>
      <div className="flex-1 space-y-1">
        {OWNERS.map((o) => (
          <div
            key={o.name}
            className="grid grid-cols-[1fr_60px_60px_70px_80px] gap-2 items-center rounded-lg bg-[#21262d] px-3 py-2.5"
          >
            <div>
              <span className="text-[11px] font-medium text-[#f0f6fc]">
                {o.name}
              </span>
              <span className="ml-1.5 text-[9px] text-[#484f58]">{o.role}</span>
            </div>
            <span className="text-center text-[11px] font-mono text-[#f0f6fc]">
              {o.risks}
            </span>
            <span
              className={cn(
                "text-center text-[11px] font-mono",
                o.avgScore >= 15 ? "text-[#d29922]" : "text-[#f0f6fc]"
              )}
            >
              {o.avgScore.toFixed(1)}
            </span>
            <span className="text-center">
              {o.validated ? (
                <span className="inline-flex items-center gap-1 text-[9px] text-[#3fb950]">
                  <span className="text-[#3fb950]">{Icons.check}</span> Yes
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] text-[#d29922]">
                  {Icons.clock} Pending
                </span>
              )}
            </span>
            <span className="text-right">
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-[9px] font-medium",
                  o.validated
                    ? "bg-[#3fb950]/10 text-[#3fb950] border border-[#3fb950]/30"
                    : "bg-[#d29922]/10 text-[#d29922] border border-[#d29922]/30"
                )}
              >
                {o.validated ? "Complete" : "Awaiting"}
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className="text-[8px] text-[#484f58] mt-2">
        All owners validated via Coordinator agent workflow. 1 pending CLO sign-off.
      </p>
    </div>
  );
}

function SlideMethodology() {
  return (
    <div className="flex h-full flex-col px-6 py-5">
      <h4 className="text-sm font-semibold text-[#f0f6fc] mb-4">
        Appendix — Methodology
      </h4>
      <div className="space-y-4 flex-1">
        <div>
          <h5 className="text-[11px] font-semibold text-[#f0f6fc] mb-1">
            Scoring Framework
          </h5>
          <p className="text-[10px] text-[#8b949e] leading-relaxed">
            Risks scored on a 5x5 matrix: Likelihood (1-5) multiplied by Impact (1-5)
            yielding a composite score of 1-25. Thresholds: Critical {"\u2265"}20, High
            {"\u2265"}15, Medium {"\u2265"}10, Low {"<"}10.
          </p>
        </div>
        <div>
          <h5 className="text-[11px] font-semibold text-[#f0f6fc] mb-1">
            Data Sources
          </h5>
          <p className="text-[10px] text-[#8b949e] leading-relaxed">
            14 internal documents (board minutes, audit reports, management commentary),
            3 regulatory filings, 8 third-party intelligence feeds, and 6 owner
            interview transcripts processed by The Reviewer agent.
          </p>
        </div>
        <div>
          <h5 className="text-[11px] font-semibold text-[#f0f6fc] mb-1">
            AI Extraction Process
          </h5>
          <p className="text-[10px] text-[#8b949e] leading-relaxed">
            Natural language processing extracted 47 risk signals from source
            documents. Signals were deduplicated, categorized, and scored by The
            Reviewer, then validated by 5 risk owners through The Coordinator workflow.
            Average confidence: 91%.
          </p>
        </div>
        <div>
          <h5 className="text-[11px] font-semibold text-[#f0f6fc] mb-1">
            Limitations
          </h5>
          <p className="text-[10px] text-[#8b949e] leading-relaxed">
            Scoring reflects management&apos;s judgment as of March 1, 2026. Emerging
            risks with {"<"}6 months of data carry wider confidence intervals. External
            geopolitical scenarios modeled to 12-month horizon only.
          </p>
        </div>
      </div>
      <p className="text-[8px] text-[#484f58] mt-2">
        Full methodology documentation available in Diligent ERM platform.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide Array                                                        */
/* ------------------------------------------------------------------ */

const SLIDES: { title: string; component: React.ReactNode }[] = [
  { title: "Title Slide", component: <SlideTitleSlide /> },
  { title: "Risk Heat Map", component: <SlideHeatMap /> },
  { title: "Top 10 Risks Ranked", component: <SlideTopRisks /> },
  { title: "Trend Comparison", component: <SlideTrendComparison /> },
  { title: "New & Emerging Risks", component: <SlideNewEmerging /> },
  { title: "Risk Owner Accountability", component: <SlideOwnerAccountability /> },
  { title: "Appendix — Methodology", component: <SlideMethodology /> },
];

/* ------------------------------------------------------------------ */
/*  Producer Page                                                      */
/* ------------------------------------------------------------------ */

export default function ProducerPage() {
  const [deckVersion, setDeckVersion] = useState<"board" | "csuite">("board");
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <PipelineBanner />
      <AgentNav activeAgent="producer" />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <AgentPageShell
          agentId="producer"
          title="The Producer"
          subtitle="ERM Deck Creation — Building board-ready presentation"
          status="active"
        >
          {/* Pipeline Stepper */}
          <PipelineStepper currentStage="producer" />

          {/* -------------------------------------------------------- */}
          {/*  Deck Metadata Row                                       */}
          {/* -------------------------------------------------------- */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#30363d] bg-[#161b22] px-5 py-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#8b949e]">
              <span className="font-medium text-[#f0f6fc]">16 risks included</span>
              <span className="text-[#30363d]">&middot;</span>
              <span>3 new since Q4</span>
              <span className="text-[#30363d]">&middot;</span>
              <span>2 score changes</span>
              <span className="text-[#30363d]">&middot;</span>
              <span>
                Board meeting:{" "}
                <span className="font-medium text-[#f0f6fc]">March 15</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeckVersion("csuite")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  deckVersion === "csuite"
                    ? "bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30"
                    : "bg-[#21262d] text-[#8b949e] border border-[#30363d] hover:text-[#f0f6fc]"
                )}
              >
                C-Suite Version
              </button>
              <button
                onClick={() => setDeckVersion("board")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  deckVersion === "board"
                    ? "bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30"
                    : "bg-[#21262d] text-[#8b949e] border border-[#30363d] hover:text-[#f0f6fc]"
                )}
              >
                Board Version
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/*  Deck Preview — Slide Carousel                           */}
          {/* -------------------------------------------------------- */}
          <SectionHeader
            title="Deck Preview"
            subtitle={`${SLIDES.length} slides \u00b7 ${deckVersion === "board" ? "Board" : "C-Suite"} version`}
            action={
              <span className="text-[10px] text-[#484f58]">
                Slide {currentSlide + 1} of {SLIDES.length}
              </span>
            }
          />

          {/* Active Slide */}
          <div className="relative rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden">
            {/* Slide title bar */}
            <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-[#8b949e]">{Icons.presentation}</span>
                <span className="text-xs font-medium text-[#f0f6fc]">
                  {SLIDES[currentSlide].title}
                </span>
              </div>
              <span className="rounded-full bg-[#21262d] border border-[#30363d] px-2 py-0.5 text-[10px] text-[#8b949e]">
                Slide {currentSlide + 1}
              </span>
            </div>

            {/* Slide Content */}
            <div className="relative" style={{ minHeight: 380 }}>
              {SLIDES[currentSlide].component}
            </div>

            {/* Prev / Next Arrows */}
            <button
              onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
              disabled={currentSlide === 0}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#30363d] bg-[#161b22] transition-colors",
                currentSlide === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-[#21262d] hover:border-[#58a6ff]/50 cursor-pointer"
              )}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#8b949e]"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentSlide((s) => Math.min(SLIDES.length - 1, s + 1))
              }
              disabled={currentSlide === SLIDES.length - 1}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#30363d] bg-[#161b22] transition-colors",
                currentSlide === SLIDES.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-[#21262d] hover:border-[#58a6ff]/50 cursor-pointer"
              )}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#8b949e]"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === currentSlide
                    ? "w-6 bg-[#58a6ff]"
                    : "w-2 bg-[#30363d] hover:bg-[#484f58]"
                )}
              />
            ))}
          </div>

          {/* Thumbnail Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4">
            {SLIDES.map((slide, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={cn(
                  "flex-shrink-0 w-32 rounded-lg border p-2 transition-colors",
                  i === currentSlide
                    ? "border-[#58a6ff] bg-[#58a6ff]/10"
                    : "border-[#30363d] bg-[#161b22] hover:border-[#484f58]"
                )}
              >
                <div className="h-16 rounded bg-[#0d1117] border border-[#21262d] flex items-center justify-center mb-1.5">
                  <span className="text-[9px] text-[#484f58] text-center px-1 leading-tight">
                    {slide.title}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[9px] truncate block text-center",
                    i === currentSlide ? "text-[#58a6ff]" : "text-[#484f58]"
                  )}
                >
                  {i + 1}. {slide.title}
                </span>
              </button>
            ))}
          </div>

          {/* -------------------------------------------------------- */}
          {/*  Change Highlights                                        */}
          {/* -------------------------------------------------------- */}
          <SectionHeader
            title="What changed from Q4 2025"
            subtitle="Summary of changes included in this deck"
          />

          <div className="grid grid-cols-3 gap-4">
            {/* New Risks */}
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#58a6ff]/15">
                  <span className="text-[10px] font-bold text-[#58a6ff]">+4</span>
                </div>
                <h4 className="text-sm font-semibold text-[#f0f6fc]">New Risks</h4>
              </div>
              <div className="space-y-2">
                {[
                  "APAC Market Expansion",
                  "AI/ML Model Governance",
                  "Geopolitical EU",
                  "Board Composition Gap",
                ].map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#58a6ff]" />
                    <span className="text-xs text-[#8b949e]">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Removed Risks */}
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#484f58]/20">
                  <span className="text-[10px] font-bold text-[#484f58]">-1</span>
                </div>
                <h4 className="text-sm font-semibold text-[#f0f6fc]">
                  Removed Risks
                </h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#484f58] flex-shrink-0" />
                  <div>
                    <span className="text-xs text-[#8b949e] line-through">
                      Pandemic Preparedness
                    </span>
                    <p className="text-[10px] text-[#484f58] mt-0.5">
                      Deactivated per audit committee
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Changes */}
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#d29922]/15">
                  <span className="text-[10px] font-bold text-[#d29922]">
                    {"\u0394"}2
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#f0f6fc]">
                  Score Changes
                </h4>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#d29922]" />
                  <div className="flex-1">
                    <span className="text-xs text-[#8b949e]">
                      Revenue Concentration
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] font-mono text-[#484f58]">12</span>
                      <span className="text-[10px] text-[#f85149]">{"\u2192"}</span>
                      <span className="text-[10px] font-mono font-semibold text-[#f85149]">
                        15
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#d29922]" />
                  <div className="flex-1">
                    <span className="text-xs text-[#8b949e]">
                      Supply Chain Concentration
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] font-mono text-[#484f58]">14</span>
                      <span className="text-[10px] text-[#f85149]">{"\u2192"}</span>
                      <span className="text-[10px] font-mono font-semibold text-[#f85149]">
                        16
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/*  CTA Row                                                  */}
          {/* -------------------------------------------------------- */}
          <div className="flex items-center gap-3 pt-2">
            <CTAButton variant="primary">Approve deck</CTAButton>
            <CTAButton
              variant="secondary"
              href="/now/agentic-hero/superhero/writer"
            >
              Begin 10K disclosure {"\u2192"}
            </CTAButton>
          </div>
        </AgentPageShell>
      </main>
    </div>
  );
}
