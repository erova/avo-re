"use client";

import Link from "next/link";
import { useMemo } from "react";

import {
  RISK_ROWS,
  type RiskLevel,
  type RiskRow,
} from "@/app/now/risk-heatmap-insights/data/riskSeed";

import PatternViz from "@/app/now/risk-heatmap-insights/components/PatternViz";

export default function RiskHeatmapInsightsPatternsPage() {
  const rowsSeed: RiskRow[] = RISK_ROWS;

  const totalRisks = rowsSeed.length;

  const residualCounts = useMemo(() => {
    const out = { High: 0, Medium: 0, Low: 0 } as Record<RiskLevel, number>;
    for (const r of rowsSeed) out[r.residual] += 1;
    return out;
  }, [rowsSeed]);

  const workflowCounts = useMemo(() => {
    const out = { Draft: 0, "In review": 0, Approved: 0, Monitoring: 0 } as Record<
      "Draft" | "In review" | "Approved" | "Monitoring",
      number
    >;
    for (const r of rowsSeed) out[r.workflowStatus] += 1;
    return out;
  }, [rowsSeed]);

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">
            Risk Heatmap — Patterns
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Platform-style pattern visualizations (Risk / Controls / Tests) inside the Risk Manager shell.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/now/risk-heatmap-insights"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/40 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/40"
            >
              <span aria-hidden>←</span>
              Back to Insights
            </Link>
            <Link
              href="/now/risk-heatmap/risk-manager"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/20 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/30"
            >
              Back to in-situ →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-800 bg-white text-neutral-900 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-4">
          <div>
            <div className="text-[11px] font-semibold tracking-wide text-neutral-500">Risk Manager</div>
            <div className="text-[18px] font-semibold text-neutral-900">Risk</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-neutral-500">
              Last updated <strong className="text-neutral-700">3 days ago</strong>
            </div>
            <button
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
              type="button"
            >
              Export
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-neutral-200 bg-white px-3 py-2">
          <Link
            href="/now/risk-heatmap-insights"
            className="rounded-full px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
          >
            Risk
          </Link>
          <button
            className="cursor-not-allowed rounded-full px-3 py-2 text-sm font-semibold text-neutral-400"
            type="button"
            aria-disabled="true"
          >
            Control
          </button>
          <button
            className="cursor-not-allowed rounded-full px-3 py-2 text-sm font-semibold text-neutral-400"
            type="button"
            aria-disabled="true"
          >
            Process
          </button>
          <button
            className="cursor-not-allowed rounded-full px-3 py-2 text-sm font-semibold text-neutral-400"
            type="button"
            aria-disabled="true"
          >
            Objective
          </button>

          <span className="flex-1" />

          <span
            className="rounded-full bg-neutral-900 px-3 py-2 text-sm font-semibold text-white"
            aria-current="page"
          >
            Patterns
          </span>
        </div>

        <div className="p-4">
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 px-5 py-4">
              <div>
                <div className="text-base font-semibold text-neutral-900">Pattern visualizations</div>
                <div className="mt-1 text-sm text-neutral-600">
                  Total risks: <strong className="text-neutral-800">{totalRisks}</strong> · Residual: High {residualCounts.High}, Medium {residualCounts.Medium}, Low {residualCounts.Low}
                </div>
              </div>

              
            </div>

            <div className="p-5">
              <PatternViz rows={rowsSeed} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}