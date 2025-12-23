import Link from "next/link";
import HeatMapDemo from "@/app/now/risk-heatmap/components/HeatMapDemo";

export default function RiskHeatmapDemoPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Risk Heatmap Demo</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Hover-hold to preview. Click a cell to keep the existing “filter the table” behavior.
          </p>
        </div>

        <Link
          href="/now/risk-heatmap"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/30 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/40"
        >
          <span aria-hidden>←</span>
          Back to write-up
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-5 shadow-sm">
        <HeatMapDemo />
      </div>
    </section>
  );
}