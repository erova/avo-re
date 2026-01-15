"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import styles from "./risk-manager.module.css";

import {
  RISK_ROWS,
  type RiskLevel,
  type RiskRow,
} from "@/app/now/risk-heatmap/data/riskSeed";

import type { ClusterContext } from "@/app/now/risk-heatmap/components/HeatMapDemo";

// Reuse your interactive heatmap demo inside the simulated product surface.
const HeatMapDemo = dynamic(
  () => import("@/app/now/risk-heatmap/components/HeatMapDemo"),
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

export default function RiskManagerInSituPage() {
  // Table filters (wired to heatmap click)
  const [likelihood, setLikelihood] = useState<RiskLevel | null>(null);
  const [impact, setImpact] = useState<RiskLevel | null>(null);

  // Forces table remount (hard refresh) when user clicks a new heatmap cell.
  const [tableVersion, setTableVersion] = useState(0);

  // Right tray state
  const [trayOpen, setTrayOpen] = useState(false);
  const [trayContext, setTrayContext] = useState<ClusterContext | null>(null);

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
            Risk Heatmap Simulation
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Production-like simulation of the Risk Manager surface to test scanability,
            trust, and progressive disclosure in context.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/now/risk-heatmap"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/40 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/40"
            >
              <span aria-hidden>←</span>
              Back to write-up
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

        {/* Workflow strip */}
        <div className={styles.workflowStrip}>
          <div className={styles.workflowLabel}>Workflow status</div>
          <div className={styles.workflowPills}>
            <Pill tone="neutral">Draft 12</Pill>
            <Pill tone="neutral">In review 18</Pill>
            <Pill tone="neutral">Approved 27</Pill>
            <Pill tone="neutral">Monitoring 9</Pill>
          </div>
        </div>

        {/* Main content */}
        <div className={styles.mainGrid}>
          {/* Left: donut placeholder */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Risk distribution</div>
              <div className={styles.cardMeta}>By severity</div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.donutShell} aria-hidden="true">
                <div className={styles.donutRing} />
                <div className={styles.donutCenter}>
                  <div className={styles.donutNumber}>66</div>
                  <div className={styles.donutLabel}>Total risks</div>
                </div>
              </div>

              <div className={styles.legendCol}>
                <div className={styles.legendRow}>
                  <span className={`${styles.dot} ${styles.dotHigh}`} />
                  <span className={styles.legendText}>High</span>
                  <span className={styles.legendValue}>21</span>
                </div>
                <div className={styles.legendRow}>
                  <span className={`${styles.dot} ${styles.dotMed}`} />
                  <span className={styles.legendText}>Medium</span>
                  <span className={styles.legendValue}>32</span>
                </div>
                <div className={styles.legendRow}>
                  <span className={`${styles.dot} ${styles.dotLow}`} />
                  <span className={styles.legendText}>Low</span>
                  <span className={styles.legendValue}>13</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: heatmap */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Risk heatmap</div>
                <div className={styles.cardMeta}>
                  Likelihood × Impact · stoplight model · hover-hold preview
                </div>
              </div>

              <div className={styles.headerActions}>
                <Pill tone="neutral">Color: Stoplight</Pill>
                <Pill tone="neutral">Range: Current</Pill>
              </div>
            </div>

            <div className={styles.cardBodyHeatmap}>
              <HeatMapDemo
                embedded
                onOpenActions={openTray}
                onApplyFilters={applyCellFilters}
              />
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