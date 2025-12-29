"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import styles from "./risk-manager.module.css";

import {
  RISK_ROWS,
  type RiskLevel,
  type RiskRow,
} from "@/app/now/risk-heatmap-insights/data/riskSeed";

import type { ClusterContext } from "@/app/now/risk-heatmap-insights/components/HeatMapInsights";

// Grayscale heatmap (insights-focused) inside the simulated product surface.
const HeatMapInsights = dynamic(
  () => import("@/app/now/risk-heatmap-insights/components/HeatMapInsights"),
  { ssr: false }
);

function Pill({
  tone,
  children,
}: {
  tone: "neutral" | "low" | "medium" | "high";
  children: React.ReactNode;
}) {
  const cls =
    tone === "low"
      ? styles.pillLow
      : tone === "medium"
      ? styles.pillMed
      : tone === "high"
      ? styles.pillHigh
      : styles.pillNeutral;

  return <span className={`${styles.pill} ${cls}`}>{children}</span>;
}

function toneForLevel(level: RiskLevel): "low" | "medium" | "high" {
  if (level === "Low") return "low";
  if (level === "Medium") return "medium";
  return "high";
}


type Signal = {
  id: string;
  badge: string; // "Recurrence" | "Velocity" | "Concentration"
  severity: "Critical" | "High" | "Medium" | "Low";
  title: string; // short headline
  changed: string; // factual change line
  why: string; // why it matters
  investigate: string[]; // 2–4 bullets
  // optional: what heatmap/table should jump to
  jump?: { likelihood: "Low" | "Medium" | "High"; impact: "Low" | "Medium" | "High" };
};

const SEVERITY_RANK: Record<Signal["severity"], number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

function severityTone(s: Signal["severity"]) {
  // light color only — wireframe friendly
  if (s === "Critical" || s === "High")
    return {
      ring: "ring-1 ring-red-200",
      badge: "bg-red-50 text-red-800 border-red-200",
      dot: "bg-red-500",
      icon: "⚠︎",
    };
  if (s === "Medium")
    return {
      ring: "ring-1 ring-amber-200",
      badge: "bg-amber-50 text-amber-900 border-amber-200",
      dot: "bg-amber-500",
      icon: "▲",
    };
  return {
    ring: "ring-1 ring-emerald-200",
    badge: "bg-emerald-50 text-emerald-900 border-emerald-200",
    dot: "bg-emerald-500",
    icon: "●",
  };
}

function badgeIcon(badge: string) {
  const k = badge.toLowerCase();
  if (k.includes("cross")) return "⟷";
  if (k.includes("change")) return "↻";
  if (k.includes("spike")) return "⤴";
  if (k.includes("owner")) return "👤";
  if (k.includes("stuck")) return "⏳";
  if (k.includes("quality")) return "≋";
  if (k.includes("evidence")) return "🗂";
  return "✦";
}

function sortSignalsBySeverity(signals: Signal[]) {
  return [...signals].sort(
    (a, b) =>
      (SEVERITY_RANK[a.severity] ?? 99) - (SEVERITY_RANK[b.severity] ?? 99)
  );
}

function PlatformSignalsRows({
  signals,
  onSelect,
}: {
  signals: Signal[];
  onSelect?: (s: Signal) => void;
}) {
  const shown = signals.slice(0, 3);
  const remaining = Math.max(0, signals.length - shown.length);

  return (
    <div>
      {/* Column headers (desktop) */}
      <div
        className={
          "hidden md:grid grid-cols-12 gap-3 border-y border-neutral-200 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
        }
      >
        <div className="col-span-2">Signal</div>
        <div className="col-span-4">What changed</div>
        <div className="col-span-3">Why it matters</div>
        <div className="col-span-3">Suggested investigation</div>
      </div>

      {/* Rows */}
      <div className="mt-3">
        {shown.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect?.(s)}
            className="w-full text-left border-b border-neutral-200 py-3 hover:bg-neutral-50"
          >
            <div className="grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-3">
              {/* Signal */}
              <div className="md:col-span-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-800">
                    {s.badge}
                  </span>
                  <span className="text-xs font-semibold text-neutral-600">
                    {s.severity}
                  </span>
                </div>
              </div>

              {/* What changed */}
              <div className="md:col-span-4">
                <div className="text-sm font-semibold text-neutral-900">{s.title}</div>
                <div className="mt-1 text-sm text-neutral-600">{s.changed}</div>
              </div>

              {/* Why */}
              <div className="md:col-span-3">
                <div className="text-sm text-neutral-700">{s.why}</div>
              </div>

              {/* Investigate */}
              <div className="md:col-span-3">
                <div className="text-sm text-neutral-700">
                  {s.investigate.slice(0, 3).map((b, idx) => (
                    <div key={b}>
                      {idx === 0 ? "• " : "• "}
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
        <div>Tip: click a signal row to open the action tray.</div>
        {remaining > 0 ? (
          <div className="text-neutral-500">
            + {remaining} more signal{remaining === 1 ? "" : "s"}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function RiskHeatmapInsightsPage() {
  // Table filters (wired to heatmap click)
  const [likelihood, setLikelihood] = useState<RiskLevel | null>(null);
  const [impact, setImpact] = useState<RiskLevel | null>(null);

  // Forces table remount (hard refresh) when user clicks a new heatmap cell.
  const [tableVersion, setTableVersion] = useState(0);

  // Right tray state
  const [trayOpen, setTrayOpen] = useState(false);
  const [trayContext, setTrayContext] = useState<ClusterContext | null>(null);

  // Platform signals UI (compact): step through buckets or show all
  const [signalsBucketIdx, setSignalsBucketIdx] = useState(0);
  const [signalsShowAll, setSignalsShowAll] = useState(false);
  const [signalsExpanded, setSignalsExpanded] = useState(true);

  // Stage 2: prompt + stubbed output (no backend)
  const [agentPrompt, setAgentPrompt] = useState("");
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentDraftedAt, setAgentDraftedAt] = useState<number | null>(null);
  const [agentResult, setAgentResult] = useState<{
    title: string;
    bullets: string[];
    suggestedActions: { label: string; detail: string }[];
  } | null>(null);

  const rowsSeed: RiskRow[] = RISK_ROWS;

  // Donut should reflect the same dataset the heatmap + table use.
  const totalRisks = rowsSeed.length;
  const residualCounts = useMemo(() => {
    const out = { High: 0, Medium: 0, Low: 0 } as Record<RiskLevel, number>;
    for (const r of rowsSeed) out[r.residual] += 1;
    return out;
  }, [rowsSeed]);

  const filteredRows = useMemo(() => {
    return rowsSeed.filter((r) => {
      if (likelihood && r.likelihood !== likelihood) return false;
      if (impact && r.impact !== impact) return false;
      return true;
    });
  }, [likelihood, impact, rowsSeed]);

  const activeFiltersCount = (likelihood ? 1 : 0) + (impact ? 1 : 0);

  const applyCellFilters = (l: RiskLevel, i: RiskLevel) => {
    setLikelihood(l);
    setImpact(i);
    setTableVersion((v) => v + 1); // hard remount table region
  };

  // --- Platform Signals (wireframe) ---
  // 4 buckets visible at once. Each row opens the tray; some rows also jump the table to a cluster.
  const PLATFORM_SIGNAL_BUCKETS: {
    id: string;
    title: string;
    description: string;
    signals: Signal[];
  }[] = [
    {
      id: "cross-silo",
      title: "Cross-Organizational patterns (2)",
      description: "Signals that span BUs, org paths, or shared dependencies.",
      signals: [
        {
          id: "xs-1",
          badge: "Cross-silo",
          severity: "High",
          title: "Same control theme appears across 3 org paths",
          changed:
            "Medium likelihood · Medium impact shows up in multiple BUs in the current period.",
          why: "Suggests systemic process drift (not a local one-off).",
          investigate: [
            "Slice by Org/BU and compare vs baseline",
            "Check shared vendor / shared policy driver",
            "Confirm whether ownership sits outside Risk Manager",
          ],
        },
        {
          id: "xs-2",
          badge: "Cross-silo",
          severity: "Medium",
          title: "Recurring evidence gaps linked to one shared workflow",
          changed:
            "Low likelihood · Medium impact repeats when the same workflow step is used.",
          why: "A single broken handoff can create recurring clusters everywhere.",
          investigate: [
            "Validate the workflow step + upstream source",
            "Check who owns the step (and SLA)",
            "Look for duplicate/merged records inflating counts",
          ],
          jump: { likelihood: "Low", impact: "Medium" },
        },
      ],
    },
    {
      id: "why-now",
      title: "Temporal signals (2)",
      description: "What changed recently that could explain the pattern.",
      signals: [
        {
          id: "wn-1",
          badge: "Change",
          severity: "Medium",
          title: "Cluster velocity increased after a recent policy update",
          changed:
            "High likelihood · Medium impact increased faster than baseline over last 30 days.",
          why: "Could be real drift—or a detection/artifact caused by change.",
          investigate: [
            "Compare before/after the policy/control change",
            "Check if detection thresholds/rules changed",
            "Confirm whether new items are unique vs duplicates",
          ],
          jump: { likelihood: "High", impact: "Medium" },
        },
        {
          id: "wn-2",
          badge: "Spike",
          severity: "Low",
          title: "A new source system started contributing to the queue",
          changed:
            "A higher share of new risks originate from one feed/source this period.",
          why: "Source shifts can change mix/quality and create noisy clusters.",
          investigate: [
            "Identify the feed + normalization mapping",
            "Check data quality (missing fields / inconsistent categories)",
            "Decide whether to exclude or quarantine noisy input",
          ],
        },
      ],
    },
    {
      id: "workflow",
      title: "Workflow & accountability (2)",
      description: "Signals about ownership gaps, stuck items, and handoffs.",
      signals: [
        {
          id: "wf-1",
          badge: "Ownership",
          severity: "High",
          title: "High-impact items lack an accountable owner",
          changed:
            "A meaningful share of High impact risks are Unassigned in the current period.",
          why: "No owner = no remediation. Patterns persist and escalate.",
          investigate: [
            "Identify the default routing rule (or missing rule)",
            "Pre-assign owners by Org/BU (stable recipients)",
            "Add escalation path for cross-BU dependencies",
          ],
        },
        {
          id: "wf-2",
          badge: "Stuck",
          severity: "Medium",
          title: "In-review items are not progressing",
          changed:
            "The same cluster remains in review across multiple cycles.",
          why: "Backlog pressure reduces review quality and confidence.",
          investigate: [
            "Check review cadence and SLAs",
            "Look for a single blocker control or evidence gap",
            "Escalate to the consistent decision-maker",
          ],
        },
      ],
    },
    {
      id: "confidence",
      title: "Confidence & data quality (2)",
      description: "Signals that suggest noise, duplication, or weak evidence.",
      signals: [
        {
          id: "cq-1",
          badge: "Quality",
          severity: "Medium",
          title: "Duplicates likely inflating one cluster",
          changed:
            "Similar titles/IDs appear repeatedly within the same likelihood/impact cell.",
          why: "Inflated counts can lead to unnecessary escalation.",
          investigate: [
            "Deduplicate by key fields (riskId, title, orgPath)",
            "Validate normalization rules",
            "Confirm evidence completeness for top drivers",
          ],
        },
        {
          id: "cq-2",
          badge: "Evidence",
          severity: "Low",
          title: "Evidence is stale for top drivers",
          changed:
            "Top drivers have not been updated recently vs review cadence.",
          why: "Stale evidence weakens decision-making and audit readiness.",
          investigate: [
            "Request updated evidence from owners",
            "Add a watch rule for stale evidence",
            "Confirm the minimum evidence bar by severity",
          ],
        },
      ],
    },
  ];

  const PLATFORM_SIGNAL_BUCKETS_SORTED = PLATFORM_SIGNAL_BUCKETS.map((b) => {
    const ordered = sortSignalsBySeverity(b.signals);
    const top = ordered[0]?.severity ?? "Low";
    return { ...b, signals: ordered, _topSeverity: top } as const;
  }).sort((a, b) => {
    const ra = SEVERITY_RANK[a._topSeverity] ?? 99;
    const rb = SEVERITY_RANK[b._topSeverity] ?? 99;
    return ra - rb;
  });

  const activeBucket = PLATFORM_SIGNAL_BUCKETS_SORTED[Math.min(signalsBucketIdx, PLATFORM_SIGNAL_BUCKETS_SORTED.length - 1)];
  const bucketCount = PLATFORM_SIGNAL_BUCKETS_SORTED.length;

  const goPrevBucket = () =>
    setSignalsBucketIdx((i) => (i - 1 + bucketCount) % bucketCount);

  const goNextBucket = () =>
    setSignalsBucketIdx((i) => (i + 1) % bucketCount);

  // Flattened list (handy if you want it later)
  const PLATFORM_SIGNALS: Signal[] = PLATFORM_SIGNAL_BUCKETS_SORTED.flatMap((b) => b.signals);

  const openFromSignal = (s: Signal) => {
    // Optional: jump table/cluster first
    if (s.jump) {
      applyCellFilters(s.jump.likelihood, s.jump.impact);
      setTableVersion((v) => v + 1);
    }

    // If the signal maps to a cluster, open the tray in that context.
    // Otherwise, open a generic tray so the user can choose Actions / Draft to agent.
    const l = s.jump?.likelihood ?? "Medium";
    const i = s.jump?.impact ?? "Medium";
    const clusterRows = rowsSeed.filter((r) => r.likelihood === l && r.impact === i);
    const clusterCount = clusterRows.length;

    // Find most common risk name
    const riskCounts = new Map<string, number>();
    for (const r of clusterRows) {
      riskCounts.set(r.riskName, (riskCounts.get(r.riskName) ?? 0) + 1);
    }
    let mostCommonRisk = "—";
    let bestCount = 0;
    for (const [name, count] of riskCounts.entries()) {
      if (count > bestCount) {
        mostCommonRisk = name;
        bestCount = count;
      }
    }

    const ctx: ClusterContext = {
      title: s.title,
      subtitle: `${l} likelihood · ${i} impact · ${clusterCount} risks`,
      likelihood: l,
      impact: i,
      count: clusterCount,
      delta: s.severity === "High" ? 2 : s.severity === "Medium" ? 1 : 0,
      mostCommonRisk,
      lastUpdatedIso: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      signals: [
        `${s.badge}: ${s.changed}`,
        `Why it matters: ${s.why}`,
        ...s.investigate.slice(0, 2).map((x) => `Investigate: ${x}`),
      ],
    };

    openTray(ctx);
  };

  const openFromBucket = (bucketId: string) => {
    const bucket = PLATFORM_SIGNAL_BUCKETS_SORTED.find((b) => b.id === bucketId);
    if (!bucket) return;

    // Synthesize a tray context that represents the bucket (not a heatmap cell).
    const ctx: ClusterContext = {
      title: bucket.title,
      subtitle: `${bucket.signals.length} signal${bucket.signals.length === 1 ? "" : "s"} · platform-detected patterns`,
      likelihood: "Medium",
      impact: "Medium",
      count: bucket.signals.length,
      delta: 0,
      mostCommonRisk: bucket.signals[0]?.title ?? "—",
      lastUpdatedIso: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      signals: bucket.signals.slice(0, 6).map((s) => `${s.badge}: ${s.title} — ${s.changed}`),
    };

    openTray(ctx);
  };

  const makeAgentResult = (ctx: ClusterContext) => {
    const cluster = `${ctx.likelihood} likelihood · ${ctx.impact} impact`;

    const bullets: string[] = [];

    if (ctx.signals?.length) {
      bullets.push(`Signals: ${ctx.signals.slice(0, 3).join(" · ")}`);
    } else {
      bullets.push("Signals: none provided (still worth a quick scan).");
    }

    bullets.push(
      `Judgement: ${
        ctx.delta > 0 ? "rising" : ctx.delta < 0 ? "improving" : "stable"
      } pattern (${ctx.delta > 0 ? "+" + ctx.delta : String(ctx.delta)} vs last period).`
    );

    bullets.push(
      "Next: filter the table to this cluster, then pick 1–2 drivers + owners."
    );

    const suggestedActions = [
      {
        label: "Escalate to owner",
        detail: `Draft a short stakeholder note referencing ${cluster}.`,
      },
      {
        label: "Add reviewer note",
        detail: "Capture context + hypotheses so the next review has continuity.",
      },
      {
        label: "Filter & triage",
        detail: "Filter table to this cluster, select risks, update workflow/owners.",
      },
      {
        label: "Tune watch rule",
        detail: "Create a watch to surface early warnings before High/High.",
      },
    ];

    return {
      title: `Agent draft for: ${ctx.title}`,
      bullets,
      suggestedActions,
    };
  };

  const runAgent = async () => {
    if (!trayContext) return;
    setAgentRunning(true);

    // Simulated latency + deterministic output
    await new Promise((r) => setTimeout(r, 450));

    setAgentResult(makeAgentResult(trayContext));
    setAgentRunning(false);
  };

  const draftPromptFor = (
    kind: "escalate" | "note" | "triage" | "tune" | "macro" | "sendBoss"
  ) => {
    if (!trayContext) return;

    const base = `Context: ${trayContext.title} (${trayContext.likelihood} likelihood / ${trayContext.impact} impact, ${trayContext.count} risks, Δ ${trayContext.delta}).`;

    const byKind: Record<typeof kind, string> = {
      escalate:
        "Draft a stakeholder-ready summary (<=120 words): what changed, why it matters, 1–2 drivers, next step.",
      sendBoss:
        "Draft a concise message to leadership: what pattern was detected, why it matters, what decision/support is needed.",
      note:
        "Draft an internal reviewer note: why this might be recurring, what to validate, and what context to capture.",
      triage:
        "Provide a triage checklist for this cluster: identify drivers, assign owners, and pick the next workflow action.",
      tune:
        "Propose a simple agent/watch rule to reduce recurrence and surface early warnings.",
      macro:
        "Recommend 3 macro slices (type, BU, region, owner) and the questions each answers.",
    };

    setAgentPrompt(`${base}\n\n${byKind[kind]}`);
    setAgentDraftedAt(Date.now());
    setAgentResult(null);
  };

  const openTray = (ctx: ClusterContext) => {
    setTrayContext(ctx);
    setTrayOpen(true);
    setAgentRunning(false);
    setAgentResult(null);

    const prompt = `Context: ${ctx.title} (${ctx.likelihood} likelihood / ${ctx.impact} impact, ${ctx.count} risks, Δ ${ctx.delta}).\n\nReview this cluster and propose:\n- what stands out / why now\n- what looks recurring vs newly emerging\n- next best actions (group + individual)\nReturn as a short checklist.`;

    setAgentPrompt(prompt);
    setAgentDraftedAt(Date.now());
  };

  const closeTray = () => {
    setTrayOpen(false);
    setTrayContext(null);
    setAgentRunning(false);
    setAgentResult(null);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      {/* avo.re wrapper context */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">
            Risk Heatmap — Insights
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            A separate experiment: de-emphasize the heatmap interaction and focus the
            story on platform-detected signals + suggested actions.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/now/risk-heatmap"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/40 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/40"
            >
              <span aria-hidden>←</span>
              Back to write-up
            </Link>
            <Link
              href="/now/risk-heatmap/risk-manager"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/20 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/30"
            >
              Back to in-situ →
            </Link>
          </div>
        </div>

        <div className="text-xs text-neutral-500">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/30 px-3 py-2">
            <div className="font-semibold text-neutral-300">Prototype surface</div>
            <div className="mt-1">Light-mode canvas inside avo.re</div>
          </div>
        </div>
      </div>
      {/* Simulated product canvas (localized styles) */}
      <div className={`${styles.rmSim} ${trayOpen ? styles.rmSimWithTray : ""} mt-10`}>
        <div className={`${styles.simContent} ${trayOpen ? styles.simContentDimmed : ""}`}>
        {/* App top bar */}
        <div className={styles.topbar}>
          <div>
            <div className={styles.appKicker}>Risk Manager</div>
            <div className={styles.appTitle}>Risk</div>
          </div>

          <div className={styles.topbarRight}>
            <div className={styles.updated}>
              Last updated <strong>3 days ago</strong>
            </div>
            <button className={styles.secondaryBtn} type="button">
              Export
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`} type="button">
            Risk
          </button>
          <button className={styles.tab} type="button" aria-disabled="true">
            Control
          </button>
          <button className={styles.tab} type="button" aria-disabled="true">
            Process
          </button>
          <button className={styles.tab} type="button" aria-disabled="true">
            Objective
          </button>
        </div>

       


        {/* Main content */}

        {/* Platform signals (compact): stepper OR show-all */}
        <div
          className="mx-[10px] mt-3 rounded-2xl border border-neutral-200 bg-neutral-50 shadow-[0_18px_44px_rgba(15,23,42,0.10)]"
          aria-label="Platform signals"
        >
          <div
            className={styles.card}
            style={{
              margin: 0,
              background: "transparent",
              border: "none",
              boxShadow: "none",
            }}
          >
            <div
              className={styles.cardHeader}
              style={{
                background: "#EEF2FF", // subtle indigo tint to lift the section
                borderBottom: "1px solid rgba(15, 23, 42, 0.10)",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            >
              <div>
                <div className={styles.cardTitle}>Platform signals</div>
                <div className={styles.cardMeta}>
                  This is a platform layer (not the heatmap). It tells you what to investigate and why.
                </div>
              </div>

              <div className={styles.headerActions}>
                <Pill tone="neutral">Reporting Studio</Pill>
                <Pill tone="neutral">Last run: 2 hours ago</Pill>
                <Pill tone="neutral">Scope: Current period</Pill>

                <button
                  type="button"
                  onClick={() => setSignalsExpanded((v) => !v)}
                  className="ml-1 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                  aria-expanded={signalsExpanded}
                  aria-controls="platform-signals-body"
                >
                  {signalsExpanded ? (
                    <>
                      <span aria-hidden>▾</span>
                      Collapse
                    </>
                  ) : (
                    <>
                      <span aria-hidden>▸</span>
                      Expand
                    </>
                  )}
                </button>
              </div>
            </div>

            <div
              className={styles.cardBody}
              id="platform-signals-body"
              style={{
                background: "#F8FAFF", // very light canvas so signals don't get lost in white
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
              }}
            >
              {/* Standalone feel: slightly deeper canvas + more left/right breathing room */}
              <div>
                {!signalsExpanded ? (
                  <div className="text-sm text-neutral-600">
                    Hidden for now. Expand to review platform-detected patterns and recommended investigations.
                  </div>
                ) : (
                  <>
                    {/* Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                          onClick={goPrevBucket}
                        >
                          <span aria-hidden>‹</span>
                          Prev
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                          onClick={goNextBucket}
                        >
                          Next
                          <span aria-hidden>›</span>
                        </button>

                        <div className="ml-1 text-xs text-neutral-500">
                          {signalsBucketIdx + 1} of {bucketCount}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                        onClick={() => setSignalsShowAll((v) => !v)}
                      >
                        {signalsShowAll ? "Show one" : "Show all"}
                      </button>
                    </div>

                    {/* Bucket index chips (severity dots) */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {PLATFORM_SIGNAL_BUCKETS_SORTED.map((b, i) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSignalsBucketIdx(i)}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                            signalsBucketIdx === i
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${severityTone(b._topSeverity).dot}`}
                            aria-hidden
                          />
                          {b.title}
                        </button>
                      ))}
                    </div>

                    {/* Stepper view */}
                    {!signalsShowAll ? (
                      <div className="mt-4 rounded-xl border border-neutral-200 bg-white">
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 px-4 py-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-neutral-900">
                              {activeBucket.title}
                            </div>
                            <div className="mt-0.5 text-sm text-neutral-600">
                              {activeBucket.description}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-800">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  severityTone(activeBucket._topSeverity).dot
                                }`}
                                aria-hidden
                              />
                              {activeBucket.signals.length} signal
                              {activeBucket.signals.length === 1 ? "" : "s"}
                            </span>
                            <button
                              type="button"
                              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                              onClick={() => openFromBucket(activeBucket.id)}
                            >
                              Open options →
                            </button>
                          </div>
                        </div>

                        <div
                          className="px-2 py-3"
                          style={{ display: "flex", flexDirection: "column", gap: 12 }}
                        >
                          {activeBucket.signals.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => openFromSignal(s)}
                              className={`w-full text-left rounded-lg px-3 py-3 hover:bg-neutral-50 ${
                                severityTone(s.severity).ring
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                        severityTone(s.severity).badge
                                      }`}
                                    >
                                      <span aria-hidden>{badgeIcon(s.badge)}</span>
                                      {s.badge}
                                    </span>
                                    <span className="text-xs font-semibold text-neutral-600">
                                      {s.severity}
                                    </span>
                                    <span className="text-xs text-neutral-500" aria-hidden>
                                      {severityTone(s.severity).icon}
                                    </span>
                                  </div>
                                  <div className="mt-2 text-sm font-semibold text-neutral-900">
                                    {s.title}
                                  </div>
                                  <div className="mt-1 text-sm text-neutral-600">
                                    {s.changed}
                                  </div>
                                </div>

                                <div className="shrink-0 text-xs font-semibold text-neutral-500">
                                  View →
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="px-4 pb-3 pt-2 text-xs text-neutral-600">
                          Tip: click a signal to open the tray (and optionally jump the table).
                        </div>
                      </div>
                    ) : (
                      /* Show-all view (still compact) */
                      <div className="mt-4 rounded-xl border border-neutral-200 bg-white">
                        {PLATFORM_SIGNAL_BUCKETS_SORTED.map((b, idx) => (
                          <div
                            key={b.id}
                            className={idx ? "border-t border-neutral-200" : ""}
                          >
                            <button
                              type="button"
                              onClick={() => openFromBucket(b.id)}
                              className="w-full text-left px-4 py-3 hover:bg-neutral-50"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-neutral-900">
                                    {b.title}
                                  </div>
                                  <div className="mt-0.5 truncate text-sm text-neutral-600">
                                    {b.description}
                                  </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-800">
                                    <span
                                      className={`h-2 w-2 rounded-full ${
                                        severityTone(b._topSeverity).dot
                                      }`}
                                      aria-hidden
                                    />
                                    {b.signals.length}
                                  </span>
                                  <span className="text-xs text-neutral-500">Options →</span>
                                </div>
                              </div>
                            </button>

                            <div className="px-4 pb-3">
                              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                {b.signals.map((s) => (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => openFromSignal(s)}
                                    className={`rounded-xl border border-neutral-200 bg-white px-3 py-3 text-left hover:bg-neutral-50 ${
                                      severityTone(s.severity).ring
                                    }`}
                                  >
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                          severityTone(s.severity).badge
                                        }`}
                                      >
                                        <span aria-hidden>{badgeIcon(s.badge)}</span>
                                        {s.badge}
                                      </span>
                                      <span className="text-xs font-semibold text-neutral-600">
                                        {s.severity}
                                      </span>
                                      <span className="text-xs text-neutral-500" aria-hidden>
                                        {severityTone(s.severity).icon}
                                      </span>
                                    </div>
                                    <div className="mt-2 text-sm font-semibold text-neutral-900">
                                      {s.title}
                                    </div>
                                    <div className="mt-1 text-sm text-neutral-600">
                                      {s.changed}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

               {/* Donut + Heatmap (restore original 2-up layout; heatmap stays grayscale) */}
               <div className={styles.mainGrid}>
          {/* Left: donut placeholder */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Risk distribution</div>
                <div className={styles.cardMeta}>By severity</div>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.donutShell} aria-hidden="true">
                <div className={styles.donutRing} />
                <div className={styles.donutCenter}>
                  <div className={styles.donutNumber}>{totalRisks}</div>
                  <div className={styles.donutLabel}>Total risks</div>
                </div>
              </div>

              <div className={styles.legendCol}>
                <div className={styles.legendRow}>
                  <span className={`${styles.dot} ${styles.dotHigh}`} />
                  <span className={styles.legendText}>High</span>
                  <span className={styles.legendValue}>{residualCounts.High}</span>
                </div>
                <div className={styles.legendRow}>
                  <span className={`${styles.dot} ${styles.dotMed}`} />
                  <span className={styles.legendText}>Medium</span>
                  <span className={styles.legendValue}>{residualCounts.Medium}</span>
                </div>
                <div className={styles.legendRow}>
                  <span className={`${styles.dot} ${styles.dotLow}`} />
                  <span className={styles.legendText}>Low</span>
                  <span className={styles.legendValue}>{residualCounts.Low}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: heatmap (grayscale) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Heatmap</div>
                <div className={styles.cardMeta}>
                  Secondary evidence · click opens tray · filters table
                </div>
              </div>

              <div className={styles.headerActions}>
                <Pill tone="neutral">Color: Gray</Pill>
                <Pill tone="neutral">Range: Current</Pill>
              </div>
            </div>

            <div className={styles.cardBodyHeatmap}>
              <div style={{ filter: "grayscale(1) saturate(0.2)", opacity: 0.98 }}>
                <HeatMapInsights
                  embedded
                  onOpenActions={openTray}
                  onApplyFilters={applyCellFilters}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table region */}
        <div className={styles.tableWrap} key={tableVersion}>
          <div className={styles.tableTop}>
            <div>
              <div className={styles.tableTitle}>Risks</div>
              <div className={styles.tableSub}>
                Showing <strong>{filteredRows.length}</strong> of{" "}
                <strong>{rowsSeed.length}</strong>
                {activeFiltersCount ? (
                  <span className={styles.tableSubMuted}>
                    {" "}
                    · {activeFiltersCount} filter
                    {activeFiltersCount === 1 ? "" : "s"} applied
                  </span>
                ) : null}
              </div>
            </div>

            <div className={styles.tableTools}>
              <div className={styles.filterControls}>
                <label className={styles.filterLabel}>
                  Likelihood
                  <select
                    className={styles.select}
                    value={likelihood ?? ""}
                    onChange={(e) =>
                      setLikelihood((e.target.value || null) as RiskLevel | null)
                    }
                  >
                    <option value="">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>

                <label className={styles.filterLabel}>
                  Impact
                  <select
                    className={styles.select}
                    value={impact ?? ""}
                    onChange={(e) =>
                      setImpact((e.target.value || null) as RiskLevel | null)
                    }
                  >
                    <option value="">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>
              </div>

              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => {
                  setLikelihood(null);
                  setImpact(null);
                  setTableVersion((v) => v + 1);
                }}
                disabled={!activeFiltersCount}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Chips row */}
          <div className={styles.chipsRow} aria-label="Active filters">
            {likelihood ? (
              <button
                type="button"
                className={styles.chip}
                onClick={() => {
                  setLikelihood(null);
                  setTableVersion((v) => v + 1);
                }}
              >
                Likelihood: {likelihood} <span aria-hidden>×</span>
              </button>
            ) : null}
            {impact ? (
              <button
                type="button"
                className={styles.chip}
                onClick={() => {
                  setImpact(null);
                  setTableVersion((v) => v + 1);
                }}
              >
                Impact: {impact} <span aria-hidden>×</span>
              </button>
            ) : null}
            {!activeFiltersCount ? (
              <span className={styles.chipsEmpty}>No filters applied</span>
            ) : null}
          </div>

          <div className={styles.tableScroller}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Risk Name</th>
                  <th>Risk ID</th>
                  <th>Inherent Risk</th>
                  <th>Residual Risk</th>
                  <th>Workflow Status</th>
                  <th>Likelihood</th>
                  <th>Impact</th>
                  <th>Risk Type</th>
                  <th>Risk Category</th>
                  <th>Org / BU / Subsidiary</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r.riskId}>
                    <td className={styles.cellPrimary}>
                      <div className={styles.riskName}>{r.riskName}</div>
                      <div className={styles.riskMeta}>Owner: Unassigned</div>
                    </td>
                    <td className={styles.mono}>{r.riskId}</td>
                    <td>
                      <Pill tone={toneForLevel(r.inherent)}>{r.inherent}</Pill>
                    </td>
                    <td>
                      <Pill tone={toneForLevel(r.residual)}>{r.residual}</Pill>
                    </td>
                    <td>
                      <Pill tone="neutral">{r.workflowStatus}</Pill>
                    </td>
                    <td>
                      <Pill tone={toneForLevel(r.likelihood)}>{r.likelihood}</Pill>
                    </td>
                    <td>
                      <Pill tone={toneForLevel(r.impact)}>{r.impact}</Pill>
                    </td>
                    <td>{r.riskType}</td>
                    <td>{r.riskCategory}</td>
                    <td>{r.orgPath}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        <div className={styles.tableFooter}>
            Showing {filteredRows.length} results · table is filter-ready and can be
            driven by heatmap selections.
          </div>
        </div>

        </div>

        {trayOpen ? (
          <button
            type="button"
            aria-label="Close guidance tray"
            className={styles.trayBackdrop}
            onClick={closeTray}
          />
        ) : null}

        {/* Right-side guidance tray */}
        <div
          className={`${styles.actionTray} ${trayOpen ? styles.actionTrayOpen : ""}`}
          aria-hidden={!trayOpen}
        >
          <div className={styles.trayHeader}>
            <div>
              <div className={styles.trayTitle}>
                {trayContext ? trayContext.title : "Guidance & actions"}
              </div>
              <div className={styles.traySub}>
                {trayContext
                  ? trayContext.subtitle
                  : "Select a heatmap cell or platform signal to see guidance."}
              </div>
            </div>
            <button
              type="button"
              className={styles.trayClose}
              onClick={closeTray}
              aria-label="Close panel"
            >
              ×
            </button>
          </div>

          <div className={styles.trayBody}>
            {/* Overview */}
            <div className={styles.traySection}>
              <div className={styles.traySectionTitle}>Overview</div>
              {trayContext?.signals?.length ? (
                <div className={styles.signalList}>
                  {trayContext.signals.map((s) => (
                    <div key={s} className={styles.signalRow}>
                      <span className={styles.signalIcon}>✦</span>
                      <span className={styles.signalText}>{s}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.trayMuted}>No signals available.</div>
              )}

              <div className={styles.traySectionTitle} style={{ marginTop: 14 }}>
                Quick context
              </div>
              <div className={styles.trayMuted}>
                This is a cluster/pattern view. Actions can be applied to the group (triage /
                assign / request updates) or to specific risks once filtered in the table.
              </div>
            </div>

            {/* Next best actions */}
            <div className={styles.traySection}>
              <div className={styles.traySectionTitle}>Next best actions</div>

              <div className={styles.actionList}>
                <button
                  className={styles.actionRow}
                  type="button"
                  onClick={() => draftPromptFor("sendBoss")}
                  disabled={!trayContext}
                >
                  <span className={styles.actionIcon}>↗</span>
                  <span className={styles.actionText}>
                    Send to decision-maker
                    <span className={styles.actionSub}>
                      Draft a concise note to your consistent stakeholder.
                    </span>
                  </span>
                </button>

                <button
                  className={styles.actionRow}
                  type="button"
                  onClick={() => draftPromptFor("triage")}
                  disabled={!trayContext}
                >
                  <span className={styles.actionIcon}>⚡</span>
                  <span className={styles.actionText}>
                    Filter & triage
                    <span className={styles.actionSub}>
                      Jump to the table and work owners/workflow.
                    </span>
                  </span>
                </button>

                <button
                  className={styles.actionRow}
                  type="button"
                  onClick={() => draftPromptFor("note")}
                  disabled={!trayContext}
                >
                  <span className={styles.actionIcon}>✎</span>
                  <span className={styles.actionText}>
                    Add reviewer note
                    <span className={styles.actionSub}>
                      Capture context so the next review has continuity.
                    </span>
                  </span>
                </button>

                <button
                  className={styles.actionRow}
                  type="button"
                  onClick={() => draftPromptFor("tune")}
                  disabled={!trayContext}
                >
                  <span className={styles.actionIcon}>⟲</span>
                  <span className={styles.actionText}>
                    Tune watch rule
                    <span className={styles.actionSub}>
                      Reduce recurrence before it becomes High/High.
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Prompt Diligent AI */}
            <div className={styles.traySection}>
              <div className={styles.trayFooterLabel}>
                <span className={styles.traySparkleIcon} aria-hidden>
                  ✨
                </span>
                Prompt Diligent AI
              </div>

              <div className={styles.trayComposer}>
                <textarea
                  className={styles.trayComposerInput}
                  value={agentPrompt}
                  onChange={(e) => {
                    setAgentPrompt(e.target.value);
                    setAgentDraftedAt(Date.now());
                    setAgentResult(null);
                  }}
                  rows={6}
                  style={{ minHeight: 140 }}
                  placeholder={
                    trayContext
                      ? `Ask about ${trayContext.title.toLowerCase()}…`
                      : "Select a heatmap cell or signal to start…"
                  }
                  disabled={!trayContext}
                />

                <button
                  type="button"
                  className={styles.traySendBtn}
                  onClick={runAgent}
                  disabled={!trayContext || agentRunning || !agentPrompt.trim()}
                  aria-label="Send"
                >
                  {agentRunning ? "…" : "Send"}
                </button>
              </div>

              <div className={styles.trayFooterMeta}>
                {agentDraftedAt ? <>Prompt updated just now</> : <>Prompt ready</>}
              </div>

              {agentResult ? (
                <div className={styles.agentResultCard}>
                  <div className={styles.agentResultTitle}>{agentResult.title}</div>

                  <ul className={styles.agentBullets}>
                    {agentResult.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}