"use client";

import Link from "next/link";
import React, { useMemo, useRef, useState, useEffect } from "react";
import styles from "../risk-manager/risk-manager.module.css";

import {
  RISK_ROWS,
  type RiskLevel,
  type RiskRow,
} from "@/app/now/risk-heatmap/data/riskSeed";

// ============================================================================
// Types
// ============================================================================

type ViewMode = "3x3" | "5x5" | "compare" | "gaussian" | "cost";
type RiskLevel5 = "Very Low" | "Low" | "Medium" | "High" | "Very High";

type ClusterContext = {
  likelihood: string;
  impact: string;
  count: number;
  delta: number;
  signals: string[];
  title: string;
  subtitle: string;
};

// ============================================================================
// Seed Data
// ============================================================================

// 5x5 current data
const HEATMAP_5X5_CURRENT: Record<string, number> = {
  "Very High-Very Low": 0, "Very High-Low": 1, "Very High-Medium": 2, "Very High-High": 3, "Very High-Very High": 2,
  "High-Very Low": 1, "High-Low": 2, "High-Medium": 5, "High-High": 6, "High-Very High": 4,
  "Medium-Very Low": 3, "Medium-Low": 4, "Medium-Medium": 12, "Medium-High": 8, "Medium-Very High": 5,
  "Low-Very Low": 5, "Low-Low": 6, "Low-Medium": 4, "Low-High": 3, "Low-Very High": 2,
  "Very Low-Very Low": 8, "Very Low-Low": 4, "Very Low-Medium": 3, "Very Low-High": 1, "Very Low-Very High": 0,
};

// 1 year ago data
const HEATMAP_5X5_YEAR_AGO: Record<string, number> = {
  "Very High-Very Low": 1, "Very High-Low": 2, "Very High-Medium": 4, "Very High-High": 5, "Very High-Very High": 4,
  "High-Very Low": 2, "High-Low": 3, "High-Medium": 7, "High-High": 8, "High-Very High": 6,
  "Medium-Very Low": 2, "Medium-Low": 3, "Medium-Medium": 10, "Medium-High": 6, "Medium-Very High": 4,
  "Low-Very Low": 4, "Low-Low": 5, "Low-Medium": 3, "Low-High": 2, "Low-Very High": 1,
  "Very Low-Very Low": 6, "Very Low-Low": 3, "Very Low-Medium": 2, "Very Low-High": 1, "Very Low-Very High": 0,
};

// 3x3 current and comparison
const HEATMAP_3X3_CURRENT: Record<string, number> = {
  "High-Low": 1, "High-Medium": 7, "High-High": 6,
  "Medium-Low": 4, "Medium-Medium": 21, "Medium-High": 22,
  "Low-Low": 7, "Low-Medium": 6, "Low-High": 8,
};

const HEATMAP_3X3_LAST30: Record<string, number> = {
  "High-Low": 2, "High-Medium": 5, "High-High": 4,
  "Medium-Low": 3, "Medium-Medium": 19, "Medium-High": 18,
  "Low-Low": 6, "Low-Medium": 5, "Low-High": 7,
};

// Gaussian bins
const GAUSSIAN_BINS = [
  { range: "0-4", count: 0 }, { range: "5-9", count: 1 }, { range: "10-14", count: 1 },
  { range: "15-19", count: 2 }, { range: "20-24", count: 4 }, { range: "25-29", count: 8 },
  { range: "30-34", count: 15 }, { range: "35-39", count: 28 }, { range: "40-44", count: 42 },
  { range: "45-49", count: 58 }, { range: "50-54", count: 72 }, { range: "55-59", count: 55 },
  { range: "60-64", count: 38 }, { range: "65-69", count: 24 }, { range: "70-74", count: 12 },
  { range: "75-79", count: 6 }, { range: "80-84", count: 3 }, { range: "85-89", count: 2 },
  { range: "90-94", count: 1 }, { range: "95-100", count: 0 },
];

// Cost data
const COST_RISKS = [
  { id: "R-1", name: "Vendor access control", cost: 250, notion: "Large" as const },
  { id: "R-2", name: "Regulatory change tracking", cost: 180, notion: "Medium" as const },
  { id: "R-3", name: "Incident response readiness", cost: 450, notion: "Very Large" as const },
  { id: "R-4", name: "Policy acknowledgement drift", cost: 45, notion: "Small" as const },
  { id: "R-5", name: "Audit evidence delays", cost: 120, notion: "Medium" as const },
  { id: "R-6", name: "BCP coverage gaps", cost: 380, notion: "Large" as const },
  { id: "R-7", name: "Third-party reassessment", cost: 290, notion: "Large" as const },
  { id: "R-8", name: "Data retention compliance", cost: 85, notion: "Small" as const },
  { id: "R-9", name: "Access provisioning delays", cost: 65, notion: "Small" as const },
  { id: "R-10", name: "Training completion variance", cost: 35, notion: "Small" as const },
  { id: "R-11", name: "SOX control mapping drift", cost: 520, notion: "Very Large" as const },
  { id: "R-12", name: "Unpatched dependency exposure", cost: 680, notion: "Very Large" as const },
  { id: "R-13", name: "Evidence collection delays", cost: 95, notion: "Medium" as const },
  { id: "R-14", name: "Region-specific process variance", cost: 150, notion: "Medium" as const },
  { id: "R-15", name: "Documentation hygiene", cost: 25, notion: "Small" as const },
];

// ============================================================================
// Utility Functions
// ============================================================================

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function stoplightColor3(sev: number): string {
  const s = clamp(sev, 1, 9);
  if (s <= 2) return "#E8FFF0";
  if (s <= 4) return "#FFF7C2";
  if (s <= 6) return "#FFE37A";
  if (s <= 7) return "#FFD5D5";
  if (s <= 8) return "#FF8E8E";
  return "#D91C1C";
}

function stoplightColor5(sev: number): string {
  const s = clamp(sev, 1, 25);
  if (s <= 2) return "#E8FFF0";
  if (s <= 4) return "#C9F7D8";
  if (s <= 6) return "#FFF7C2";
  if (s <= 8) return "#FFE37A";
  if (s <= 10) return "#FFC247";
  if (s <= 12) return "#FFAA5C";
  if (s <= 15) return "#FF8E5C";
  if (s <= 18) return "#FFD5D5";
  if (s <= 20) return "#FF8E8E";
  if (s <= 22) return "#EF4444";
  return "#B81414";
}

function textColorFor(sev: number, max: number): string {
  const threshold = max * 0.85;
  return sev >= threshold ? "#FFFFFF" : "#1F2937";
}

function deltaPillStyle(delta: number) {
  if (delta === 0) return { bg: "#E9EEF5", fg: "#3A4656" };
  if (delta > 0) return { bg: "#D91C1C", fg: "#FFFFFF" };
  return { bg: "#15803D", fg: "#FFFFFF" };
}

// ============================================================================
// Components
// ============================================================================

function Pill({ tone, children }: { tone: "neutral" | "low" | "medium" | "high"; children: React.ReactNode }) {
  const cls = tone === "low" ? styles.pillLow : tone === "medium" ? styles.pillMed : tone === "high" ? styles.pillHigh : styles.pillNeutral;
  return <span className={`${styles.pill} ${cls}`}>{children}</span>;
}

function toneForLevel(level: RiskLevel): "low" | "medium" | "high" {
  if (level === "Low") return "low";
  if (level === "Medium") return "medium";
  return "high";
}

// ============================================================================
// HeatMap3x3 with popover
// ============================================================================

function HeatMap3x3({
  onCellClick,
  onCellHover,
  onCellLeave,
  activeCell,
}: {
  onCellClick: (l: RiskLevel, i: RiskLevel) => void;
  onCellHover: (ctx: ClusterContext | null, rect: DOMRect | null) => void;
  onCellLeave: () => void;
  activeCell: string | null;
}) {
  const likelihoodLevels: RiskLevel[] = ["High", "Medium", "Low"];
  const impactLevels: RiskLevel[] = ["Low", "Medium", "High"];
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHover = useRef<{ ctx: ClusterContext; rect: DOMRect } | null>(null);

  const levelNum = (l: RiskLevel) => (l === "Low" ? 1 : l === "Medium" ? 2 : 3);

  const clearHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    pendingHover.current = null;
  };

  const startHold = (ctx: ClusterContext, el: HTMLElement) => {
    clearHold();
    const rect = el.getBoundingClientRect();
    pendingHover.current = { ctx, rect };
    holdTimer.current = setTimeout(() => {
      if (pendingHover.current) {
        onCellHover(pendingHover.current.ctx, pendingHover.current.rect);
      }
    }, 150);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: -18, top: "35%", transform: "rotate(-90deg) translateX(-50%)", fontSize: 12, fontWeight: 700, color: "#1F2937" }}>
        Likelihood
      </div>
      <div style={{ marginLeft: 32, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {likelihoodLevels.map((l) =>
          impactLevels.map((i) => {
            const k = `${l}-${i}`;
            const count = HEATMAP_3X3_CURRENT[k] ?? 0;
            const last30 = HEATMAP_3X3_LAST30[k] ?? count;
            const delta = count - last30;
            const sev = levelNum(l) * levelNum(i);
            const bg = stoplightColor3(sev);
            const fg = textColorFor(sev, 9);
            const pill = deltaPillStyle(delta);
            const isActive = activeCell === k;

            const ctx: ClusterContext = {
              likelihood: l, impact: i, count, delta,
              signals: delta > 0 ? [`Rising cluster: +${delta} vs last period`] : delta < 0 ? [`Improving: ${delta} vs last period`] : [],
              title: `${l} likelihood · ${i} impact`,
              subtitle: `${count} risks (${delta === 0 ? "0" : delta > 0 ? `+${delta}` : delta} vs last period)`,
            };

            return (
              <button
                key={k}
                type="button"
                onClick={() => onCellClick(l, i)}
                onMouseEnter={(e) => startHold(ctx, e.currentTarget)}
                onMouseLeave={() => {
                  clearHold();
                  onCellLeave();
                }}
                style={{
                  height: 72, borderRadius: 10, border: "1px solid rgba(15,23,42,0.1)",
                  background: `linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), ${bg}`,
                  color: fg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: isActive ? "0 12px 32px rgba(15,23,42,0.18)" : "0 4px 12px rgba(15,23,42,0.08)",
                  outline: isActive ? "2px solid #111827" : "none", outlineOffset: 2,
                  transform: isActive ? "translateY(-2px)" : "none", transition: "all 140ms ease",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 900 }}>{count}</div>
                {delta !== 0 && (
                  <div style={{ marginTop: 4, fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: pill.bg, color: pill.fg }}>
                    {delta > 0 ? `+${delta}` : delta}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
      <div style={{ marginLeft: 32, marginTop: 8, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, fontSize: 11, fontWeight: 600, color: "#6B7280" }}>
        <div style={{ textAlign: "left" }}>Low</div>
        <div style={{ textAlign: "center" }}>Medium</div>
        <div style={{ textAlign: "right" }}>High</div>
      </div>
      <div style={{ marginLeft: 32, marginTop: 4, textAlign: "center", fontSize: 12, fontWeight: 700, color: "#1F2937" }}>Impact →</div>
    </div>
  );
}

// ============================================================================
// HeatMap5x5 with popover
// ============================================================================

function HeatMap5x5({
  data,
  compareData,
  showComparison = false,
  onCellClick,
  onCellHover,
  onCellLeave,
  activeCell,
  highlightKey,
  onHoverKeyChange,
}: {
  data: Record<string, number>;
  compareData?: Record<string, number>;
  showComparison?: boolean;
  onCellClick?: (l: RiskLevel5, i: RiskLevel5) => void;
  onCellHover?: (ctx: ClusterContext | null, rect: DOMRect | null) => void;
  onCellLeave?: () => void;
  activeCell?: string | null;
  highlightKey?: string | null; // For synced highlighting in compare view
  onHoverKeyChange?: (key: string | null) => void; // Callback when hover changes
}) {
  const likelihoodLevels: RiskLevel5[] = ["Very High", "High", "Medium", "Low", "Very Low"];
  const impactLevels: RiskLevel5[] = ["Very Low", "Low", "Medium", "High", "Very High"];
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHover = useRef<{ ctx: ClusterContext; rect: DOMRect } | null>(null);
  const levelNum = (l: RiskLevel5) => ({ "Very Low": 1, "Low": 2, "Medium": 3, "High": 4, "Very High": 5 }[l]);

  const clearHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    pendingHover.current = null;
  };

  const startHold = (ctx: ClusterContext, el: HTMLElement, key: string) => {
    // Always notify hover key change for sync
    onHoverKeyChange?.(key);
    
    if (!onCellHover) return;
    clearHold();
    const rect = el.getBoundingClientRect();
    pendingHover.current = { ctx, rect };
    holdTimer.current = setTimeout(() => {
      if (pendingHover.current) {
        onCellHover(pendingHover.current.ctx, pendingHover.current.rect);
      }
    }, 150);
  };

  const handleLeave = () => {
    clearHold();
    onHoverKeyChange?.(null);
    onCellLeave?.();
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: -18, top: "40%", transform: "rotate(-90deg) translateX(-50%)", fontSize: 11, fontWeight: 700, color: "#1F2937" }}>
        Likelihood
      </div>
      <div style={{ marginLeft: 32, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
        {likelihoodLevels.map((l) =>
          impactLevels.map((i) => {
            const k = `${l}-${i}`;
            const count = data[k] ?? 0;
            const oldCount = compareData?.[k] ?? count;
            const delta = showComparison ? count - oldCount : 0;
            const sev = levelNum(l) * levelNum(i);
            const bg = stoplightColor5(sev);
            const fg = textColorFor(sev, 25);
            const pill = deltaPillStyle(delta);
            const isActive = activeCell === k;
            const isHighlighted = highlightKey === k;

            const ctx: ClusterContext = {
              likelihood: l, impact: i, count, delta,
              signals: delta > 0 ? [`Rising: +${delta} vs last year`] : delta < 0 ? [`Improved: ${delta} vs last year`] : [],
              title: `${l} likelihood · ${i} impact`,
              subtitle: `${count} risks`,
            };

            return (
              <button
                key={k}
                type="button"
                onClick={() => onCellClick?.(l, i)}
                onMouseEnter={(e) => startHold(ctx, e.currentTarget, k)}
                onMouseLeave={handleLeave}
                style={{
                  height: 56, borderRadius: 8, border: "1px solid rgba(15,23,42,0.1)",
                  background: `linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), ${bg}`,
                  color: fg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: onCellClick ? "pointer" : "default",
                  boxShadow: (isActive || isHighlighted) ? "0 12px 32px rgba(15,23,42,0.18)" : "0 4px 12px rgba(15,23,42,0.08)",
                  outline: (isActive || isHighlighted) ? "2px solid #111827" : "none", outlineOffset: 2,
                  opacity: count === 0 ? 0.4 : 1, 
                  transition: "all 140ms ease",
                  transform: isHighlighted ? "translateY(-2px)" : "none",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 900 }}>{count}</div>
                {showComparison && delta !== 0 && (
                  <div style={{ marginTop: 2, fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 999, background: pill.bg, color: pill.fg }}>
                    {delta > 0 ? `+${delta}` : delta}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
      <div style={{ marginLeft: 32, marginTop: 6, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, fontSize: 9, fontWeight: 600, color: "#6B7280" }}>
        {impactLevels.map((l) => <div key={l} style={{ textAlign: "center" }}>{l}</div>)}
      </div>
      <div style={{ marginLeft: 32, marginTop: 4, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#1F2937" }}>Impact →</div>
    </div>
  );
}

// ============================================================================
// GaussianChart with click on bins
// ============================================================================

function GaussianChart({
  onBinClick,
  onBinHover,
  onBinLeave,
  activeBin,
}: {
  onBinClick: (range: string, count: number) => void;
  onBinHover: (ctx: ClusterContext | null, rect: DOMRect | null) => void;
  onBinLeave: () => void;
  activeBin: string | null;
}) {
  const maxCount = Math.max(...GAUSSIAN_BINS.map((b) => b.count));
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHover = useRef<{ ctx: ClusterContext; rect: DOMRect } | null>(null);

  const clearHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    pendingHover.current = null;
  };

  const startHold = (ctx: ClusterContext, el: HTMLElement) => {
    clearHold();
    const rect = el.getBoundingClientRect();
    pendingHover.current = { ctx, rect };
    holdTimer.current = setTimeout(() => {
      if (pendingHover.current) {
        onBinHover(pendingHover.current.ctx, pendingHover.current.rect);
      }
    }, 150);
  };

  return (
    <div style={{ position: "relative", height: 280 }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 40, width: 36, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", paddingRight: 6, fontSize: 10, color: "#9CA3AF" }}>
        <span>{maxCount}</span>
        <span>{Math.round(maxCount / 2)}</span>
        <span>0</span>
      </div>
      <div style={{ marginLeft: 40, display: "flex", alignItems: "flex-end", height: "calc(100% - 40px)", gap: 3, borderBottom: "2px solid #E5E7EB", borderLeft: "2px solid #E5E7EB" }}>
        {GAUSSIAN_BINS.map((bin, idx) => {
          const heightPct = maxCount > 0 ? (bin.count / maxCount) * 100 : 0;
          const start = parseInt(bin.range.split("-")[0]);
          const isLow = start < 30;
          const isMed = start >= 30 && start < 70;
          const bg = isLow ? "#22C55E" : isMed ? "#F59E0B" : "#EF4444";
          const bgLight = isLow ? "#4ADE80" : isMed ? "#FBBF24" : "#F87171";
          const isActive = activeBin === bin.range;
          const zone = isLow ? "Low" : isMed ? "Medium" : "High";

          const ctx: ClusterContext = {
            likelihood: zone, impact: bin.range, count: bin.count, delta: 0,
            signals: [`Score range: ${bin.range}`, `Zone: ${zone} risk`],
            title: `Risk Score ${bin.range}`,
            subtitle: `${bin.count} risks in this range`,
          };

          return (
            <button
              key={bin.range}
              type="button"
              onClick={() => onBinClick(bin.range, bin.count)}
              onMouseEnter={(e) => startHold(ctx, e.currentTarget)}
              onMouseLeave={() => { clearHold(); onBinLeave(); }}
              style={{
                flex: 1, maxWidth: 28, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
                background: "transparent", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              {bin.count > 0 && <div style={{ fontSize: 9, fontWeight: 700, color: "#374151", marginBottom: 2 }}>{bin.count}</div>}
              <div
                style={{
                  width: "100%", height: `${heightPct}%`, minHeight: bin.count > 0 ? 4 : 0,
                  background: `linear-gradient(to top, ${bg}, ${bgLight})`, borderRadius: "3px 3px 0 0",
                  boxShadow: isActive ? `0 0 0 2px #111827, 0 -4px 16px ${bg}50` : bin.count > 10 ? `0 -4px 16px ${bg}50` : "none",
                }}
              />
            </button>
          );
        })}
      </div>
      <div style={{ marginLeft: 40, display: "flex", paddingTop: 4, gap: 3 }}>
        {GAUSSIAN_BINS.map((bin, idx) => (
          <div key={bin.range} style={{ flex: 1, maxWidth: 28, textAlign: "center", fontSize: 8, color: "#9CA3AF" }}>
            {idx % 4 === 0 ? bin.range.split("-")[0] : ""}
          </div>
        ))}
      </div>
      <div style={{ marginLeft: 40, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#374151", marginTop: 4 }}>Risk Score →</div>
    </div>
  );
}

// ============================================================================
// CostNotionChart with click
// ============================================================================

function CostNotionChart({
  onCellClick,
  onCellHover,
  onCellLeave,
  activeCell,
}: {
  onCellClick: (notion: string, costBucket: string) => void;
  onCellHover: (ctx: ClusterContext | null, rect: DOMRect | null) => void;
  onCellLeave: () => void;
  activeCell: string | null;
}) {
  const notionLevels = ["Very Large", "Large", "Medium", "Small"] as const;
  const costBuckets = [
    { label: "$0-100K", min: 0, max: 100 },
    { label: "$100K-250K", min: 100, max: 250 },
    { label: "$250K-500K", min: 250, max: 500 },
    { label: "$500K+", min: 500, max: Infinity },
  ];
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHover = useRef<{ ctx: ClusterContext; rect: DOMRect } | null>(null);

  const clearHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    pendingHover.current = null;
  };

  const startHold = (ctx: ClusterContext, el: HTMLElement) => {
    clearHold();
    const rect = el.getBoundingClientRect();
    pendingHover.current = { ctx, rect };
    holdTimer.current = setTimeout(() => {
      if (pendingHover.current) {
        onCellHover(pendingHover.current.ctx, pendingHover.current.rect);
      }
    }, 150);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: -12, top: "40%", transform: "rotate(-90deg) translateX(-50%)", fontSize: 11, fontWeight: 700, color: "#1F2937" }}>
        Notion (Size)
      </div>
      <div style={{ marginLeft: 75, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {notionLevels.map((notion, nIdx) =>
          costBuckets.map((bucket) => {
            const k = `${notion}-${bucket.label}`;
            const cellRisks = COST_RISKS.filter((r) => r.notion === notion && r.cost >= bucket.min && r.cost < bucket.max);
            const count = cellRisks.length;
            const isActive = activeCell === k;
            const notionScore = notionLevels.indexOf(notion);
            const costScore = costBuckets.indexOf(bucket);
            const severity = (4 - notionScore) + costScore;
            const bg = severity <= 2 ? "#E8FFF0" : severity <= 4 ? "#FFF7C2" : severity <= 5 ? "#FFD5D5" : "#FF8E8E";

            const ctx: ClusterContext = {
              likelihood: notion, impact: bucket.label, count, delta: 0,
              signals: cellRisks.map((r) => r.name),
              title: `${notion} · ${bucket.label}`,
              subtitle: `${count} risks`,
            };

            return (
              <button
                key={k}
                type="button"
                onClick={() => onCellClick(notion, bucket.label)}
                onMouseEnter={(e) => startHold(ctx, e.currentTarget)}
                onMouseLeave={() => { clearHold(); onCellLeave(); }}
                style={{
                  height: 60, borderRadius: 10, border: "1px solid rgba(15,23,42,0.12)",
                  background: `linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%), ${bg}`,
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  boxShadow: isActive ? "0 12px 32px rgba(15,23,42,0.16)" : "0 4px 12px rgba(15,23,42,0.06)",
                  outline: isActive ? "2px solid #111827" : "none", outlineOffset: 2,
                  opacity: count === 0 ? 0.3 : 1, transition: "all 140ms ease",
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 900, color: "#1F2937" }}>{count}</div>
              </button>
            );
          })
        )}
      </div>
      {/* Y-axis labels */}
      {notionLevels.map((notion, idx) => (
        <div key={notion} style={{ position: "absolute", left: 0, width: 70, textAlign: "right", fontSize: 10, fontWeight: 600, color: "#6B7280", top: idx * 68 + 24 }}>
          {notion}
        </div>
      ))}
      <div style={{ marginLeft: 75, marginTop: 8, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, fontSize: 10, fontWeight: 600, color: "#6B7280" }}>
        {costBuckets.map((b) => <div key={b.label} style={{ textAlign: "center" }}>{b.label}</div>)}
      </div>
      <div style={{ marginLeft: 75, marginTop: 4, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#1F2937" }}>Remediation Cost →</div>
    </div>
  );
}

// ============================================================================
// Popover Panel
// ============================================================================

function PopoverPanel({
  ctx,
  rect,
  onOpenTray,
  onFilter,
}: {
  ctx: ClusterContext;
  rect: DOMRect;
  onOpenTray: () => void;
  onFilter: () => void;
}) {
  const width = 320;
  const height = 280;
  const padding = 12;
  const preferRight = rect.right + padding + width < window.innerWidth;
  const left = preferRight ? rect.right + padding : rect.left - padding - width;
  const topRaw = rect.top + rect.height / 2 - height / 2;
  const top = clamp(topRaw, 12, window.innerHeight - height - 12);

  return (
    <div
      style={{
        position: "fixed", left, top, width, zIndex: 100,
        borderRadius: 14, border: "1px solid rgba(15,23,42,0.22)", background: "#FFFFFF",
        boxShadow: "0 18px 44px rgba(15,23,42,0.18)", padding: 14,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 950, color: "#111827" }}>{ctx.title}</div>
      <div style={{ marginTop: 6, fontSize: 13, color: "#374151" }}>
        <strong>{ctx.count}</strong> risks
        {ctx.delta !== 0 && (
          <span style={{ fontWeight: 900, color: ctx.delta > 0 ? "#D91C1C" : "#15803D", marginLeft: 6 }}>
            {ctx.delta > 0 ? `+${ctx.delta}` : ctx.delta}
          </span>
        )}
        <span style={{ color: "#6B7280" }}> vs last period</span>
      </div>

      {ctx.signals.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 950, color: "#111827", marginBottom: 6 }}>Signals</div>
          <div style={{ display: "grid", gap: 6 }}>
            {ctx.signals.slice(0, 3).map((s) => (
              <div key={s} style={{ fontSize: 12, color: "#374151", padding: "8px 10px", background: "#F9FAFB", borderRadius: 10, border: "1px solid rgba(15,23,42,0.1)" }}>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
        <button
          type="button"
          onClick={onOpenTray}
          style={{ height: 36, borderRadius: 10, border: "1px solid rgba(15,23,42,0.14)", background: "#111827", color: "#FFFFFF", fontSize: 13, fontWeight: 950, cursor: "pointer" }}
        >
          ➜ Open guidance & actions
        </button>
        <button
          type="button"
          onClick={onFilter}
          style={{ height: 34, borderRadius: 10, border: "1px solid rgba(15,23,42,0.12)", background: "#FFFFFF", color: "#111827", fontSize: 12, fontWeight: 900, cursor: "pointer" }}
        >
          🧲 Filter table
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: "#9CA3AF" }}>
        Updated 7 days ago
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

// Context-aware next best actions
function getNextBestActions(ctx: ClusterContext | null): { icon: string; text: string; sub: string; id: string }[] {
  if (!ctx) return [];
  
  const actions: { icon: string; text: string; sub: string; id: string }[] = [];
  
  // Always include filter & triage
  actions.push({ id: "filter", icon: "⚡", text: "Filter & triage", sub: `Review all ${ctx.count} risks in table` });
  
  // High severity or high count actions
  if (ctx.likelihood === "High" || ctx.likelihood === "Very High" || ctx.count >= 10) {
    actions.push({ id: "escalate", icon: "↗", text: "Escalate to leadership", sub: "Draft executive summary" });
    actions.push({ id: "schedule", icon: "📅", text: "Schedule review meeting", sub: "Bring stakeholders together" });
  }
  
  // Rising trend actions
  if (ctx.delta > 0) {
    actions.push({ id: "investigate", icon: "🔍", text: "Investigate root cause", sub: `+${ctx.delta} new risks need attention` });
    actions.push({ id: "alert", icon: "🔔", text: "Set up monitoring alerts", sub: "Get notified of further changes" });
  }
  
  // Improving trend actions  
  if (ctx.delta < 0) {
    actions.push({ id: "document", icon: "📝", text: "Document success factors", sub: "Capture what worked" });
    actions.push({ id: "replicate", icon: "🔄", text: "Replicate to other clusters", sub: "Apply learnings elsewhere" });
  }
  
  // Medium count actions
  if (ctx.count >= 5 && ctx.count < 20) {
    actions.push({ id: "assign", icon: "👤", text: "Assign risk owners", sub: "Distribute accountability" });
    actions.push({ id: "prioritize", icon: "📊", text: "Run prioritization", sub: "Stack rank by business impact" });
  }
  
  // Low likelihood / stable
  if ((ctx.likelihood === "Low" || ctx.likelihood === "Very Low") && ctx.delta === 0) {
    actions.push({ id: "archive", icon: "📦", text: "Review for archival", sub: "Consider closing stable low risks" });
  }
  
  // Large clusters
  if (ctx.count >= 20) {
    actions.push({ id: "segment", icon: "✂️", text: "Segment into sub-clusters", sub: "Break down for targeted action" });
    actions.push({ id: "automate", icon: "🤖", text: "Identify automation candidates", sub: "Reduce manual overhead" });
  }
  
  // Always include send to decision-maker if not already too many
  if (actions.length < 4) {
    actions.push({ id: "send", icon: "✉️", text: "Send to decision-maker", sub: "Draft a concise note" });
  }
  
  // Return top 4 most relevant
  return actions.slice(0, 4);
}

export default function RiskManagerExperimentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("3x3");
  const [likelihood, setLikelihood] = useState<string | null>(null);
  const [impact, setImpact] = useState<string | null>(null);
  const [tableVersion, setTableVersion] = useState(0);

  const [trayOpen, setTrayOpen] = useState(false);
  const [trayContext, setTrayContext] = useState<ClusterContext | null>(null);

  const [popoverCtx, setPopoverCtx] = useState<ClusterContext | null>(null);
  const [popoverRect, setPopoverRect] = useState<DOMRect | null>(null);
  
  // For year comparison: sync hover between both heatmaps
  const [compareHoverKey, setCompareHoverKey] = useState<string | null>(null);

  const [agentPrompt, setAgentPrompt] = useState("");
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentResult, setAgentResult] = useState<{ title: string; bullets: string[] } | null>(null);

  const rowsSeed: RiskRow[] = RISK_ROWS;

  const filteredRows = useMemo(() => {
    return rowsSeed.filter((r) => {
      if (likelihood && r.likelihood !== likelihood) return false;
      if (impact && r.impact !== impact) return false;
      return true;
    });
  }, [likelihood, impact, rowsSeed]);

  const activeFiltersCount = (likelihood ? 1 : 0) + (impact ? 1 : 0);

  // Close the popover (called when mouse leaves the entire viz container)
  const closePopover = () => {
    setPopoverCtx(null);
    setPopoverRect(null);
  };

  // When a cell is hovered long enough, show the popover
  const handleCellHover = (ctx: ClusterContext | null, rect: DOMRect | null) => {
    if (ctx && rect) {
      setPopoverCtx(ctx);
      setPopoverRect(rect);
    }
  };

  // Map 5-level to 3-level for table filtering (since RISK_ROWS only has 3 levels)
  const map5to3 = (level: string): RiskLevel => {
    if (level === "Very Low" || level === "Low") return "Low";
    if (level === "Medium") return "Medium";
    return "High";
  };

  const handleFilter = (l: string, i: string) => {
    // For 3x3, use exact values; for 5x5, map to 3-level
    const mappedL = map5to3(l);
    const mappedI = map5to3(i);
    setLikelihood(mappedL);
    setImpact(mappedI);
    setTableVersion((v) => v + 1);
    setPopoverCtx(null);
    setPopoverRect(null);
  };

  const openTray = (ctx: ClusterContext) => {
    // Calculate actual table count for this filter
    const mappedL = map5to3(ctx.likelihood);
    const mappedI = map5to3(ctx.impact);
    const tableCount = rowsSeed.filter(r => r.likelihood === mappedL && r.impact === mappedI).length;
    
    // Enrich context with table count - use table count for actions
    const enrichedCtx: ClusterContext = {
      ...ctx,
      count: tableCount, // Use actual table count for next best actions
      subtitle: tableCount === ctx.count 
        ? `${tableCount} risks` 
        : `${tableCount} risks in table`,
    };
    
    setTrayContext(enrichedCtx);
    setTrayOpen(true);
    setAgentResult(null);
    setAgentPrompt(`Context: ${ctx.title}\n${tableCount} risks matching this filter.\n\nReview this cluster and propose next best actions.`);
    setPopoverCtx(null);
    setPopoverRect(null);
    
    // Also apply the filter so table shows the matching risks
    setLikelihood(mappedL);
    setImpact(mappedI);
    setTableVersion((v) => v + 1);
  };

  const closeTray = () => {
    setTrayOpen(false);
    setTrayContext(null);
  };

  const runAgent = async () => {
    if (!trayContext) return;
    setAgentRunning(true);
    await new Promise((r) => setTimeout(r, 500));
    setAgentResult({
      title: `Analysis: ${trayContext.title}`,
      bullets: [
        `${trayContext.count} risks identified in this cluster`,
        trayContext.delta > 0 ? `Trending upward (+${trayContext.delta})` : trayContext.delta < 0 ? `Improving (${trayContext.delta})` : "Stable pattern",
        "Recommend: review top 2-3 drivers, assign owners",
      ],
    });
    setAgentRunning(false);
  };

  const views = [
    { id: "3x3" as ViewMode, label: "3×3 Heatmap" },
    { id: "5x5" as ViewMode, label: "5×5 Heatmap" },
    { id: "compare" as ViewMode, label: "Year Compare" },
    { id: "gaussian" as ViewMode, label: "Gaussian" },
    { id: "cost" as ViewMode, label: "Cost × Notion" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">Risk Manager — Experimental Views</h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Interactive prototype with multiple visualization modes. Click cells to filter the table or open the guidance tray.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/now/risk-heatmap/risk-manager" className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/40 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/40">
              <span aria-hidden>←</span> Back to original
            </Link>
            <Link href="/now/risk-heatmap/experiments" className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/40 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/40">
              Standalone experiments
            </Link>
          </div>
        </div>
      </div>

      {/* Simulated product canvas */}
      <div className={`${styles.rmSim} ${trayOpen ? styles.rmSimWithTray : ""} mt-10`}>
        <div className={`${styles.simContent} ${trayOpen ? styles.simContentDimmed : ""}`}>
          {/* Top bar */}
          <div className={styles.topbar}>
            <div>
              <div className={styles.appKicker}>Risk Manager</div>
              <div className={styles.appTitle}>Risk</div>
            </div>
            <div className={styles.topbarRight}>
              <div className={styles.updated}>Last updated <strong>3 days ago</strong></div>
              <button className={styles.secondaryBtn} type="button">Export</button>
            </div>
          </div>

          {/* View mode tabs */}
          <div style={{ padding: "12px 14px", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {views.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setViewMode(v.id)}
                style={{
                  padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer",
                  border: viewMode === v.id ? "1px solid #111827" : "1px solid rgba(15,23,42,0.14)",
                  background: viewMode === v.id ? "#111827" : "#fff",
                  color: viewMode === v.id ? "#fff" : "#374151",
                }}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Visualization card - wrapped in hover container */}
          <div 
            style={{ margin: "0 14px", position: "relative" }}
            onMouseLeave={closePopover}
          >
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>
                    {viewMode === "3x3" && "Risk Heatmap (3×3)"}
                    {viewMode === "5x5" && "Risk Heatmap (5×5)"}
                    {viewMode === "compare" && "Year-over-Year Comparison"}
                    {viewMode === "gaussian" && "Risk Score Distribution"}
                    {viewMode === "cost" && "Cost × Notion Matrix"}
                  </div>
                  <div className={styles.cardMeta}>Hover-hold to preview · Click to filter or open actions</div>
                </div>
              </div>

              <div className={styles.cardBodyHeatmap}>
                {viewMode === "3x3" && (
                  <HeatMap3x3
                    onCellClick={(l, i) => handleFilter(l, i)}
                    onCellHover={handleCellHover}
                    onCellLeave={() => {}}
                    activeCell={popoverCtx ? `${popoverCtx.likelihood}-${popoverCtx.impact}` : null}
                  />
                )}

                {viewMode === "5x5" && (
                  <HeatMap5x5
                    data={HEATMAP_5X5_CURRENT}
                    onCellClick={(l, i) => handleFilter(l, i)}
                    onCellHover={handleCellHover}
                    onCellLeave={() => {}}
                    activeCell={popoverCtx ? `${popoverCtx.likelihood}-${popoverCtx.impact}` : null}
                  />
                )}

                {viewMode === "compare" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10 }}>
                        Today (94 risks)
                        {compareHoverKey && (
                          <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: "#6B7280" }}>
                            · {HEATMAP_5X5_CURRENT[compareHoverKey] ?? 0} in this cell
                          </span>
                        )}
                      </div>
                      <HeatMap5x5 
                        data={HEATMAP_5X5_CURRENT} 
                        onCellClick={(l, i) => handleFilter(l, i)} 
                        onCellHover={handleCellHover} 
                        onCellLeave={() => {}}
                        highlightKey={compareHoverKey}
                        onHoverKeyChange={setCompareHoverKey}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10 }}>
                        1 Year Ago (99 risks)
                        {compareHoverKey && (
                          <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: "#6B7280" }}>
                            · {HEATMAP_5X5_YEAR_AGO[compareHoverKey] ?? 0} in this cell
                            {(() => {
                              const now = HEATMAP_5X5_CURRENT[compareHoverKey] ?? 0;
                              const then = HEATMAP_5X5_YEAR_AGO[compareHoverKey] ?? 0;
                              const diff = now - then;
                              if (diff === 0) return null;
                              return (
                                <span style={{ fontWeight: 700, color: diff > 0 ? "#D91C1C" : "#15803D", marginLeft: 4 }}>
                                  ({diff > 0 ? `+${diff}` : diff} change)
                                </span>
                              );
                            })()}
                          </span>
                        )}
                      </div>
                      <HeatMap5x5 
                        data={HEATMAP_5X5_YEAR_AGO} 
                        highlightKey={compareHoverKey}
                        onHoverKeyChange={setCompareHoverKey}
                      />
                    </div>
                  </div>
                )}

                {viewMode === "gaussian" && (
                  <GaussianChart
                    onBinClick={(range, count) => {
                      const start = parseInt(range.split("-")[0]);
                      const zone = start < 30 ? "Low" : start < 70 ? "Medium" : "High";
                      setLikelihood(zone as RiskLevel);
                      setImpact(null);
                      setTableVersion((v) => v + 1);
                    }}
                    onBinHover={handleCellHover}
                    onBinLeave={() => {}}
                    activeBin={null}
                  />
                )}

                {viewMode === "cost" && (
                  <CostNotionChart
                    onCellClick={(notion, cost) => {
                      const map = { "Very Large": "High", "Large": "High", "Medium": "Medium", "Small": "Low" } as const;
                      setLikelihood(map[notion as keyof typeof map] as RiskLevel);
                      setImpact(null);
                      setTableVersion((v) => v + 1);
                    }}
                    onCellHover={handleCellHover}
                    onCellLeave={() => {}}
                  activeCell={popoverCtx ? `${popoverCtx.likelihood}-${popoverCtx.impact}` : null}
                />
              )}
            </div>
            </div>

            {/* Popover - rendered inside the hover container so hovering it doesn't trigger container's onMouseLeave */}
            {popoverCtx && popoverRect && (
              <PopoverPanel
                ctx={popoverCtx}
                rect={popoverRect}
                onOpenTray={() => openTray(popoverCtx)}
                onFilter={() => handleFilter(popoverCtx.likelihood, popoverCtx.impact)}
              />
            )}
          </div>

          {/* Table region */}
          <div className={styles.tableWrap} key={tableVersion} style={{ marginTop: 14 }}>
            <div className={styles.tableTop}>
              <div>
                <div className={styles.tableTitle}>Risks</div>
                <div className={styles.tableSub}>
                  Showing <strong>{filteredRows.length}</strong> of <strong>{rowsSeed.length}</strong>
                  {activeFiltersCount > 0 && <span className={styles.tableSubMuted}> · {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied</span>}
                </div>
              </div>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => { setLikelihood(null); setImpact(null); setTableVersion((v) => v + 1); }}
                disabled={!activeFiltersCount}
              >
                Clear
              </button>
            </div>

            <div className={styles.chipsRow}>
              {likelihood && (
                <button type="button" className={styles.chip} onClick={() => { setLikelihood(null); setTableVersion((v) => v + 1); }}>
                  Likelihood: {likelihood} <span aria-hidden>×</span>
                </button>
              )}
              {impact && (
                <button type="button" className={styles.chip} onClick={() => { setImpact(null); setTableVersion((v) => v + 1); }}>
                  Impact: {impact} <span aria-hidden>×</span>
                </button>
              )}
              {!activeFiltersCount && <span className={styles.chipsEmpty}>No filters applied</span>}
            </div>

            <div className={styles.tableScroller} style={{ maxHeight: 300 }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Risk Name</th>
                    <th>Risk ID</th>
                    <th>Likelihood</th>
                    <th>Impact</th>
                    <th>Risk Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.slice(0, 15).map((r) => (
                    <tr key={r.riskId}>
                      <td className={styles.cellPrimary}><div className={styles.riskName}>{r.riskName}</div></td>
                      <td className={styles.mono}>{r.riskId}</td>
                      <td><Pill tone={toneForLevel(r.likelihood)}>{r.likelihood}</Pill></td>
                      <td><Pill tone={toneForLevel(r.impact)}>{r.impact}</Pill></td>
                      <td>{r.riskType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.tableFooter}>Showing {Math.min(15, filteredRows.length)} of {filteredRows.length} results</div>
          </div>
        </div>

        {/* Backdrop */}
        {trayOpen && <button type="button" aria-label="Close" className={styles.trayBackdrop} onClick={closeTray} />}

        {/* Right tray */}
        <div className={`${styles.actionTray} ${trayOpen ? styles.actionTrayOpen : ""}`}>
          <div className={styles.trayHeader}>
            <div>
              <div className={styles.trayTitle}>{trayContext?.title ?? "Guidance"}</div>
              <div className={styles.traySub}>{trayContext?.subtitle ?? "Select a cell to see guidance."}</div>
            </div>
            <button type="button" className={styles.trayClose} onClick={closeTray}>×</button>
          </div>

          <div className={styles.trayBody}>
            {trayContext?.signals && trayContext.signals.length > 0 && (
              <div className={styles.traySection}>
                <div className={styles.traySectionTitle}>Signals</div>
                <div className={styles.signalList}>
                  {trayContext.signals.map((s) => (
                    <div key={s} className={styles.signalRow}>
                      <span className={styles.signalIcon}>✦</span>
                      <span className={styles.signalText}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.traySection}>
              <div className={styles.traySectionTitle}>Next best actions</div>
              <div className={styles.actionList}>
                {getNextBestActions(trayContext).map((action) => (
                  <button 
                    key={action.id}
                    className={styles.actionRow} 
                    type="button" 
                    onClick={() => {
                      if (action.id === "filter" && trayContext) {
                        handleFilter(trayContext.likelihood, trayContext.impact);
                        closeTray();
                      }
                      // Other actions would have their own handlers in a real app
                    }}
                  >
                    <span className={styles.actionIcon}>{action.icon}</span>
                    <span className={styles.actionText}>{action.text}<span className={styles.actionSub}>{action.sub}</span></span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.traySection}>
              <div className={styles.trayFooterLabel}>
                <span className={styles.traySparkleIcon}>✨</span>
                Prompt Diligent AI
              </div>
              <div className={styles.trayComposer}>
                <textarea
                  className={styles.trayComposerInput}
                  value={agentPrompt}
                  onChange={(e) => { setAgentPrompt(e.target.value); setAgentResult(null); }}
                  rows={4}
                  placeholder="Ask about this cluster..."
                />
                <button type="button" className={styles.traySendBtn} onClick={runAgent} disabled={agentRunning || !agentPrompt.trim()}>
                  {agentRunning ? "..." : "Send"}
                </button>
              </div>
              {agentResult && (
                <div className={styles.agentResultCard} style={{ marginTop: 12 }}>
                  <div className={styles.agentResultTitle}>{agentResult.title}</div>
                  <ul className={styles.agentBullets}>
                    {agentResult.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
