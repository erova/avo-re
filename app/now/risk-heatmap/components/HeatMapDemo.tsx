"use client";

import { useRef, useState } from "react";
import { ColorMode, RiskLevel, getCellClasses } from "./palette";

const likelihoodLevels = ["High", "Medium", "Low"] as const;
const impactLevels = ["Low", "Medium", "High"] as const;

type Likelihood = (typeof likelihoodLevels)[number];
type Impact = (typeof impactLevels)[number];
type TimeMode = "current" | "last30";

type Cell = {
  id: string;
  likelihood: Likelihood;
  impact: Impact;
  level: RiskLevel; // 1–9 severity, where 9 = highest
  currentCount: number;
  last30Count: number;

  drivers: string[];
  owners: string[];
  status: { draft: number; assessment: number; response: number; approval: number };
};

const cells: Cell[] = [
  // High likelihood row (top)
  {
    id: "high-low",
    likelihood: "High",
    impact: "Low",
    level: 6,
    currentCount: 1,
    last30Count: 2,
    drivers: ["Vendor", "Policy", "Controls"],
    owners: ["IT Risk", "Compliance"],
    status: { draft: 0, assessment: 1, response: 0, approval: 0 },
  },
  {
    id: "high-med",
    likelihood: "High",
    impact: "Medium",
    level: 8,
    currentCount: 7,
    last30Count: 5,
    drivers: ["Third-Party", "InfoSec", "Regulatory"],
    owners: ["Vendor Mgmt", "Security"],
    status: { draft: 2, assessment: 3, response: 2, approval: 0 },
  },
  {
    id: "high-high",
    likelihood: "High",
    impact: "High",
    level: 9,
    currentCount: 6,
    last30Count: 4,
    drivers: ["InfoSec", "Data", "Incident"],
    owners: ["Security", "CISO Office"],
    status: { draft: 1, assessment: 2, response: 2, approval: 1 },
  },

  // Medium likelihood row
  {
    id: "med-low",
    likelihood: "Medium",
    impact: "Low",
    level: 3,
    currentCount: 4,
    last30Count: 3,
    drivers: ["Process", "Policy", "Training"],
    owners: ["Ops Risk", "HR"],
    status: { draft: 2, assessment: 1, response: 1, approval: 0 },
  },
  {
    id: "med-med",
    likelihood: "Medium",
    impact: "Medium",
    level: 5,
    currentCount: 21,
    last30Count: 19,
    drivers: ["Third-Party", "Controls", "Audit"],
    owners: ["Compliance", "Internal Audit", "IT Risk"],
    status: { draft: 7, assessment: 8, response: 5, approval: 1 },
  },
  {
    id: "med-high",
    likelihood: "Medium",
    impact: "High",
    level: 7,
    currentCount: 22,
    last30Count: 18,
    drivers: ["Regulatory", "Security", "Resilience"],
    owners: ["Security", "BCP", "Compliance"],
    status: { draft: 6, assessment: 9, response: 6, approval: 1 },
  },

  // Low likelihood row
  {
    id: "low-low",
    likelihood: "Low",
    impact: "Low",
    level: 1,
    currentCount: 7,
    last30Count: 6,
    drivers: ["Process", "Training", "Documentation"],
    owners: ["Ops Risk"],
    status: { draft: 4, assessment: 2, response: 1, approval: 0 },
  },
  {
    id: "low-med",
    likelihood: "Low",
    impact: "Medium",
    level: 2,
    currentCount: 6,
    last30Count: 5,
    drivers: ["Controls", "Audit", "Policy"],
    owners: ["Internal Audit", "Compliance"],
    status: { draft: 3, assessment: 2, response: 1, approval: 0 },
  },
  {
    id: "low-high",
    likelihood: "Low",
    impact: "High",
    level: 4,
    currentCount: 8,
    last30Count: 7,
    drivers: ["Regulatory", "Vendor", "Data"],
    owners: ["Compliance", "Vendor Mgmt"],
    status: { draft: 3, assessment: 3, response: 2, approval: 0 },
  },
];

function ColorModeToggle({
  mode,
  onChange,
}: {
  mode: ColorMode;
  onChange: (m: ColorMode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/70 p-1 text-xs backdrop-blur">
      <button
        type="button"
        onClick={() => onChange("stoplight")}
        className={`px-3 py-1 rounded-full transition ${
          mode === "stoplight"
            ? "bg-foreground text-background shadow-sm"
            : "text-foreground hover:bg-muted"
        }`}
      >
        Stoplight (RYG)
      </button>
      <button
        type="button"
        onClick={() => onChange("modern")}
        className={`px-3 py-1 rounded-full transition ${
          mode === "modern"
            ? "bg-foreground text-background shadow-sm"
            : "text-foreground hover:bg-muted"
        }`}
      >
        Modern
      </button>
    </div>
  );
}

function TimeModeToggle({
  mode,
  onChange,
}: {
  mode: TimeMode;
  onChange: (m: TimeMode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/70 p-1 text-xs backdrop-blur">
      <button
        type="button"
        onClick={() => onChange("current")}
        className={`px-3 py-1 rounded-full transition ${
          mode === "current"
            ? "bg-foreground text-background shadow-sm"
            : "text-foreground hover:bg-muted"
        }`}
      >
        Current
      </button>
      <button
        type="button"
        onClick={() => onChange("last30")}
        className={`px-3 py-1 rounded-full transition ${
          mode === "last30"
            ? "bg-foreground text-background shadow-sm"
            : "text-foreground hover:bg-muted"
        }`}
      >
        Last 30 Days
      </button>
    </div>
  );
}

function StatusBar({
  status,
}: {
  status: { draft: number; assessment: number; response: number; approval: number };
}) {
  const total = status.draft + status.assessment + status.response + status.approval || 1;

  const segments = [
    { key: "Draft", value: status.draft, cls: "bg-slate-400/70" },
    { key: "Assessment", value: status.assessment, cls: "bg-slate-700/80" },
    { key: "Response", value: status.response, cls: "bg-slate-900/80" },
    { key: "Approval", value: status.approval, cls: "bg-indigo-500/70" },
  ].filter((s) => s.value > 0);

  return (
    <div className="space-y-1">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((s) => (
          <div
            key={s.key}
            className={s.cls}
            style={{ width: `${(s.value / total) * 100}%` }}
            title={`${s.key}: ${s.value}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
        {segments.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1">
            <span className={`inline-block h-2 w-2 rounded-sm ${s.cls}`} />
            {s.key} <span className="font-medium text-foreground/80">{s.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HoverPreviewPanel({
  open,
  side,
  anchorLabel,
  count,
  delta,
  drivers,
  owners,
  status,
}: {
  open: boolean;
  side: "left" | "right";
  anchorLabel: string;
  count: number;
  delta: number;
  drivers: string[];
  owners: string[];
  status: { draft: number; assessment: number; response: number; approval: number };
}) {
  const panelPos = side === "right" ? "left-full ml-3" : "right-full mr-3";
  const arrowPos = side === "right" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2";

  return (
    <div
      className={[
        "absolute top-1/2 -translate-y-1/2 z-50 w-[340px]",
        panelPos,
        "rounded-xl border bg-background/95 shadow-xl backdrop-blur",
        "p-4",
        "transition-all duration-150",
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-1 pointer-events-none",
      ].join(" ")}
    >
      <div
        className={[
          "absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-background/95",
          "border",
          side === "right" ? "border-l border-t" : "border-r border-b",
          arrowPos,
        ].join(" ")}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold leading-tight">{anchorLabel}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{count}</span> risks
            {delta !== 0 && (
              <>
                {" "}
                ·{" "}
                <span
                  className={[
                    "font-mono tabular-nums font-semibold",
                    delta > 0 ? "text-red-700" : "text-emerald-700",
                  ].join(" ")}
                >
                  {delta > 0 ? `+${delta}` : `${delta}`}
                </span>{" "}
                vs last 30 days
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
        >
          View risks ({count})
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <div className="text-xs font-semibold text-foreground/90">Workflow status</div>
          <div className="mt-2">
            <StatusBar status={status} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-semibold text-foreground/90">Top drivers</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {drivers.slice(0, 3).map((d) => (
                <span
                  key={d}
                  className="rounded-full border bg-muted px-2 py-0.5 text-[11px] text-foreground/90"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-foreground/90">Top owners</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {owners.slice(0, 3).map((o) => (
                <span
                  key={o}
                  className="rounded-full border bg-muted px-2 py-0.5 text-[11px] text-foreground/90"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground">
          Tip: click the cell to apply filters and refresh the table (existing behavior).
        </div>
      </div>
    </div>
  );
}

export default function HeatmapDemo() {
  // IMPORTANT: these strings must match your palette.ts ColorMode union exactly
  const [colorMode, setColorMode] = useState<ColorMode>("stoplight");
  const [timeMode, setTimeMode] = useState<TimeMode>("current");

  const [previewOpenFor, setPreviewOpenFor] = useState<string | null>(null);
  const [animateCellId, setAnimateCellId] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  function clearHoverTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleEnter(id: string) {
    clearHoverTimer();
    timerRef.current = window.setTimeout(() => {
      setPreviewOpenFor(id);
      setAnimateCellId(id);
      window.setTimeout(() => setAnimateCellId((prev) => (prev === id ? null : prev)), 450);
    }, 250);
  }

  function handleLeave(id: string) {
    clearHoverTimer();
    setPreviewOpenFor((prev) => (prev === id ? null : prev));
  }

  const anyPanelOpen = previewOpenFor !== null;

  return (
    <section className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Risk Heatmap (Dummy Data)</h2>
          <p className="text-xs text-muted-foreground max-w-xl">
            Likelihood on the vertical, impact on the horizontal. Hover-hold previews; click retains the existing “apply
            filters” behavior.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <ColorModeToggle mode={colorMode} onChange={setColorMode} />
          <TimeModeToggle mode={timeMode} onChange={setTimeMode} />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col justify-center text-xs font-medium text-muted-foreground">
          <span className="rotate-180 [writing-mode:vertical-rl]">Likelihood</span>
        </div>

        <div className="flex flex-col gap-3">
          {likelihoodLevels.map((likelihood) => (
            <div key={likelihood} className="flex gap-3">
              {impactLevels.map((impact) => {
                const cell = cells.find((c) => c.likelihood === likelihood && c.impact === impact)!;

                const value = timeMode === "current" ? cell.currentCount : cell.last30Count;
                const delta = cell.currentCount - cell.last30Count;

                const isActive = previewOpenFor === cell.id;
                const dimOthers = anyPanelOpen && !isActive;

                const base = getCellClasses(colorMode, cell.level);

                // clean active state (no shimmer)
                const activeHighlight = isActive
                  ? [
                      "outline outline-2 outline-white/70",
                      "outline-offset-[3px]",
                      "shadow-[0_14px_34px_rgba(0,0,0,0.25)]",
                      "scale-[1.01]",
                    ].join(" ")
                  : "";

                const dimClass = dimOthers ? "opacity-30 grayscale-[0.2]" : "opacity-100";
                const popClass = animateCellId === cell.id ? "animate-[pulsePop_450ms_ease-out]" : "";

                const side: "left" | "right" = impact === "High" ? "left" : "right";
                const anchorLabel = `${cell.likelihood} Likelihood · ${cell.impact} Impact`;

                return (
                  <div
                    key={cell.id}
                    className="relative"
                    onMouseEnter={() => handleEnter(cell.id)}
                    onMouseLeave={() => handleLeave(cell.id)}
                  >
                    <HoverPreviewPanel
                      open={isActive}
                      side={side}
                      anchorLabel={anchorLabel}
                      count={value}
                      delta={timeMode === "current" ? delta : 0}
                      drivers={cell.drivers}
                      owners={cell.owners}
                      status={cell.status}
                    />

                    <button
                      type="button"
                      className={[
                        base,
                        "relative transform transition-all duration-200",
                        activeHighlight,
                        dimClass,
                        popClass,
                      ].join(" ")}
                    >
                      <div className="flex flex-col items-center justify-center gap-1 leading-tight">
                        <span className="text-sm md:text-base font-semibold">{value}</span>

                        {timeMode === "current" && delta !== 0 && (
                          <span
                            className={[
                              "inline-flex items-center justify-center",
                              "h-6 min-w-[40px] px-2.5",
                              "rounded-full",
                              "text-[12px] md:text-[13px] font-mono tabular-nums font-semibold",
                              "shadow-md",
                              delta > 0
                                ? "bg-red-600 text-white shadow-[0_1px_0_rgba(0,0,0,0.35)]"
                                : "bg-emerald-600 text-white shadow-[0_1px_0_rgba(0,0,0,0.35)]",
                            ].join(" ")}
                          >
                            {delta > 0 ? `+${delta}` : `${delta}`}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            {impactLevels.map((impact) => (
              <span key={impact}>{impact}</span>
            ))}
          </div>
          <div className="text-right text-[10px] text-muted-foreground">Impact →</div>
        </div>
      </div>

      <div className="text-[11px] text-muted-foreground">
        Preview is hover-hold (to avoid accidental triggers). Click keeps the same “filter table” mental model.
      </div>
    </section>
  );
}