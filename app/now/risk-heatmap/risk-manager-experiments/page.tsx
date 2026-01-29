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

type ViewMode = "3x3" | "5x5" | "compare" | "gaussian" | "cost" | "trend" | "bubble" | "materiality";
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

// Trend data - monthly risk counts over 12 months
const TREND_DATA = [
  { month: "Feb 25", total: 72, high: 12, medium: 38, low: 22, opened: 8, closed: 5 },
  { month: "Mar 25", total: 75, high: 14, medium: 39, low: 22, opened: 9, closed: 6 },
  { month: "Apr 25", total: 78, high: 13, medium: 41, low: 24, opened: 7, closed: 4 },
  { month: "May 25", total: 82, high: 15, medium: 42, low: 25, opened: 10, closed: 6 },
  { month: "Jun 25", total: 79, high: 14, medium: 40, low: 25, opened: 5, closed: 8 },
  { month: "Jul 25", total: 81, high: 13, medium: 43, low: 25, opened: 7, closed: 5 },
  { month: "Aug 25", total: 85, high: 15, medium: 44, low: 26, opened: 9, closed: 5 },
  { month: "Sep 25", total: 88, high: 16, medium: 45, low: 27, opened: 8, closed: 5 },
  { month: "Oct 25", total: 84, high: 14, medium: 44, low: 26, opened: 4, closed: 8 },
  { month: "Nov 25", total: 86, high: 15, medium: 45, low: 26, opened: 6, closed: 4 },
  { month: "Dec 25", total: 82, high: 14, medium: 43, low: 25, opened: 3, closed: 7 },
  { month: "Jan 26", total: 82, high: 14, medium: 47, low: 21, opened: 5, closed: 5 },
];

// Materiality Distribution data - by department, comparing last quarter vs this quarter
const MATERIALITY_DATA = [
  { dept: "CEO Office", lastQtr: { red: 1, yellow: 1, green: 1 }, thisQtr: { red: 1, yellow: 1, green: 2 } },
  { dept: "C&D", lastQtr: { red: 2, yellow: 3, green: 6 }, thisQtr: { red: 2, yellow: 4, green: 6 } },
  { dept: "Investments", lastQtr: { red: 2, yellow: 3, green: 6 }, thisQtr: { red: 2, yellow: 3, green: 4 } },
  { dept: "COO", lastQtr: { red: 2, yellow: 3, green: 1 }, thisQtr: { red: 3, yellow: 3, green: 5 } },
  { dept: "International", lastQtr: { red: 5, yellow: 7, green: 8 }, thisQtr: { red: 8, yellow: 5, green: 2 } },
  { dept: "Finance", lastQtr: { red: 2, yellow: 5, green: 9 }, thisQtr: { red: 2, yellow: 2, green: 5 } },
  { dept: "HR", lastQtr: { red: 1, yellow: 3, green: 4 }, thisQtr: { red: 1, yellow: 2, green: 3 } },
  { dept: "Legal", lastQtr: { red: 2, yellow: 1, green: 0 }, thisQtr: { red: 1, yellow: 1, green: 1 } },
];

// Bubble chart data - individual risks with likelihood, impact, and size (cost/age)
const BUBBLE_RISKS = [
  { id: "R-1", name: "Unpatched dependency exposure", likelihood: 4.2, impact: 4.8, cost: 680, age: 145, type: "Cyber" },
  { id: "R-2", name: "Incident response readiness", likelihood: 3.8, impact: 4.5, cost: 450, age: 92, type: "Cyber" },
  { id: "R-3", name: "SOX control mapping drift", likelihood: 3.5, impact: 4.2, cost: 520, age: 178, type: "Compliance" },
  { id: "R-4", name: "Vendor access controls", likelihood: 4.0, impact: 3.8, cost: 250, age: 67, type: "Third-party" },
  { id: "R-5", name: "BCP coverage gaps", likelihood: 2.8, impact: 4.0, cost: 380, age: 234, type: "Resilience" },
  { id: "R-6", name: "Third-party reassessment", likelihood: 3.2, impact: 3.5, cost: 290, age: 112, type: "Third-party" },
  { id: "R-7", name: "Regulatory change tracking", likelihood: 3.0, impact: 3.8, cost: 180, age: 45, type: "Compliance" },
  { id: "R-8", name: "Region-specific variance", likelihood: 2.5, impact: 3.2, cost: 150, age: 89, type: "Operational" },
  { id: "R-9", name: "Audit evidence delays", likelihood: 2.8, impact: 3.0, cost: 120, age: 56, type: "Audit" },
  { id: "R-10", name: "Evidence collection delays", likelihood: 2.2, impact: 2.8, cost: 95, age: 34, type: "Audit" },
  { id: "R-11", name: "Data retention compliance", likelihood: 1.8, impact: 2.5, cost: 85, age: 78, type: "Compliance" },
  { id: "R-12", name: "Access provisioning delays", likelihood: 2.0, impact: 2.2, cost: 65, age: 23, type: "Operational" },
  { id: "R-13", name: "Policy acknowledgement drift", likelihood: 1.5, impact: 2.0, cost: 45, age: 156, type: "Governance" },
  { id: "R-14", name: "Training completion variance", likelihood: 1.2, impact: 1.8, cost: 35, age: 45, type: "Governance" },
  { id: "R-15", name: "Documentation hygiene", likelihood: 1.0, impact: 1.5, cost: 25, age: 12, type: "Governance" },
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
// Trend Line Chart
// ============================================================================

function TrendChart({
  onPointHover,
  onPointLeave,
  activeMonth,
}: {
  onPointHover: (ctx: ClusterContext | null, rect: DOMRect | null) => void;
  onPointLeave: () => void;
  activeMonth: string | null;
}) {
  const [trendMode, setTrendMode] = useState<"total" | "severity" | "velocity">("total");
  const maxTotal = Math.max(...TREND_DATA.map(d => d.total));
  const maxVelocity = Math.max(...TREND_DATA.map(d => Math.max(d.opened, d.closed)));
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHover = useRef<{ ctx: ClusterContext; rect: DOMRect } | null>(null);

  const clearHold = () => {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
    pendingHover.current = null;
  };

  const startHold = (ctx: ClusterContext, el: HTMLElement) => {
    clearHold();
    const rect = el.getBoundingClientRect();
    pendingHover.current = { ctx, rect };
    holdTimer.current = setTimeout(() => {
      if (pendingHover.current) onPointHover(pendingHover.current.ctx, pendingHover.current.rect);
    }, 150);
  };

  // Calculate trend line (simple linear regression for total)
  const n = TREND_DATA.length;
  const sumX = TREND_DATA.reduce((s, _, i) => s + i, 0);
  const sumY = TREND_DATA.reduce((s, d) => s + d.total, 0);
  const sumXY = TREND_DATA.reduce((s, d, i) => s + i * d.total, 0);
  const sumX2 = TREND_DATA.reduce((s, _, i) => s + i * i, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const trendDirection = slope > 0.5 ? "Rising" : slope < -0.5 ? "Declining" : "Stable";

  return (
    <div>
      {/* Mode toggles */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        {[
          { id: "total" as const, label: "Total Risks" },
          { id: "severity" as const, label: "By Severity" },
          { id: "velocity" as const, label: "Velocity" },
        ].map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => setTrendMode(m.id)}
            style={{
              padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: trendMode === m.id ? "1px solid #111827" : "1px solid rgba(15,23,42,0.14)",
              background: trendMode === m.id ? "#111827" : "#fff",
              color: trendMode === m.id ? "#fff" : "#374151",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ position: "relative", height: 260 }}>
        {/* Y-axis */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 40, width: 36, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", paddingRight: 6, fontSize: 10, color: "#9CA3AF" }}>
          <span>{trendMode === "velocity" ? maxVelocity : maxTotal}</span>
          <span>{trendMode === "velocity" ? Math.round(maxVelocity / 2) : Math.round(maxTotal / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div style={{ marginLeft: 44, height: "calc(100% - 40px)", position: "relative", borderBottom: "2px solid #E5E7EB", borderLeft: "2px solid #E5E7EB" }}>
          {/* Trend line for total mode */}
          {trendMode === "total" && (
            <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} preserveAspectRatio="none">
              <line
                x1="0%"
                y1={`${100 - ((intercept / maxTotal) * 100)}%`}
                x2="100%"
                y2={`${100 - (((slope * (n - 1) + intercept) / maxTotal) * 100)}%`}
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            </svg>
          )}

          {/* Data points */}
          <div style={{ display: "flex", height: "100%", alignItems: "flex-end", gap: 2 }}>
            {TREND_DATA.map((d, idx) => {
              const isActive = activeMonth === d.month;
              const ctx: ClusterContext = {
                likelihood: "Medium", impact: d.month, count: d.total, delta: idx > 0 ? d.total - TREND_DATA[idx - 1].total : 0,
                signals: [
                  `High: ${d.high} · Medium: ${d.medium} · Low: ${d.low}`,
                  `Opened: ${d.opened} · Closed: ${d.closed}`,
                  idx > 0 ? `Change: ${d.total - TREND_DATA[idx - 1].total > 0 ? "+" : ""}${d.total - TREND_DATA[idx - 1].total} from last month` : "First month in range",
                ],
                title: d.month,
                subtitle: `${d.total} total risks`,
              };

              if (trendMode === "velocity") {
                return (
                  <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 2 }}>
                    <div style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                      <div
                        onMouseEnter={(e) => startHold(ctx, e.currentTarget)}
                        onMouseLeave={() => { clearHold(); onPointLeave(); }}
                        style={{
                          width: 14, height: `${(d.opened / maxVelocity) * 180}px`, minHeight: 4,
                          background: "linear-gradient(to top, #EF4444, #F87171)", borderRadius: "3px 3px 0 0",
                          cursor: "pointer",
                        }}
                        title={`Opened: ${d.opened}`}
                      />
                      <div
                        onMouseEnter={(e) => startHold(ctx, e.currentTarget)}
                        onMouseLeave={() => { clearHold(); onPointLeave(); }}
                        style={{
                          width: 14, height: `${(d.closed / maxVelocity) * 180}px`, minHeight: 4,
                          background: "linear-gradient(to top, #22C55E, #4ADE80)", borderRadius: "3px 3px 0 0",
                          cursor: "pointer",
                        }}
                        title={`Closed: ${d.closed}`}
                      />
                    </div>
                  </div>
                );
              }

              if (trendMode === "severity") {
                const totalH = (d.high / maxTotal) * 180;
                const totalM = (d.medium / maxTotal) * 180;
                const totalL = (d.low / maxTotal) * 180;
                return (
                  <div
                    key={d.month}
                    onMouseEnter={(e) => startHold(ctx, e.currentTarget)}
                    onMouseLeave={() => { clearHold(); onPointLeave(); }}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", cursor: "pointer" }}
                  >
                    <div style={{ width: "80%", maxWidth: 28, display: "flex", flexDirection: "column" }}>
                      <div style={{ height: totalH, background: "#EF4444", borderRadius: "3px 3px 0 0" }} />
                      <div style={{ height: totalM, background: "#F59E0B" }} />
                      <div style={{ height: totalL, background: "#22C55E", borderRadius: "0 0 3px 3px" }} />
                    </div>
                  </div>
                );
              }

              // Total mode - line chart with points
              const heightPct = (d.total / maxTotal) * 100;
              return (
                <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", position: "relative" }}>
                  <div
                    onMouseEnter={(e) => startHold(ctx, e.currentTarget)}
                    onMouseLeave={() => { clearHold(); onPointLeave(); }}
                    style={{
                      position: "absolute",
                      bottom: `${heightPct}%`,
                      width: 12, height: 12, borderRadius: "50%",
                      background: isActive ? "#111827" : "#3B82F6",
                      border: "2px solid #fff",
                      boxShadow: isActive ? "0 0 0 3px #111827" : "0 2px 8px rgba(59,130,246,0.4)",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  />
                  {idx > 0 && (
                    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
                      <line
                        x1="-50%"
                        y1={`${100 - (TREND_DATA[idx - 1].total / maxTotal) * 100}%`}
                        x2="50%"
                        y2={`${100 - heightPct}%`}
                        stroke="#3B82F6"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis labels */}
        <div style={{ marginLeft: 44, display: "flex", paddingTop: 6 }}>
          {TREND_DATA.map((d, idx) => (
            <div key={d.month} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#6B7280", fontWeight: idx === TREND_DATA.length - 1 ? 700 : 400 }}>
              {d.month.split(" ")[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <div style={{ padding: 12, borderRadius: 10, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>Current</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{TREND_DATA[TREND_DATA.length - 1].total}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>12-mo Change</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: TREND_DATA[TREND_DATA.length - 1].total > TREND_DATA[0].total ? "#D91C1C" : "#15803D" }}>
            {TREND_DATA[TREND_DATA.length - 1].total - TREND_DATA[0].total > 0 ? "+" : ""}{TREND_DATA[TREND_DATA.length - 1].total - TREND_DATA[0].total}
          </div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>Avg/Month</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{Math.round(sumY / n)}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>Trend</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: trendDirection === "Rising" ? "#D91C1C" : trendDirection === "Declining" ? "#15803D" : "#6B7280" }}>
            {trendDirection === "Rising" ? "↑" : trendDirection === "Declining" ? "↓" : "→"}
          </div>
        </div>
      </div>

      {/* Velocity legend */}
      {trendMode === "velocity" && (
        <div style={{ marginTop: 12, display: "flex", gap: 16, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#EF4444" }} />
            <span style={{ fontSize: 12, color: "#374151" }}>Opened</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#22C55E" }} />
            <span style={{ fontSize: 12, color: "#374151" }}>Closed</span>
          </div>
        </div>
      )}

      {/* Severity legend */}
      {trendMode === "severity" && (
        <div style={{ marginTop: 12, display: "flex", gap: 16, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#EF4444" }} />
            <span style={{ fontSize: 12, color: "#374151" }}>High</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#F59E0B" }} />
            <span style={{ fontSize: 12, color: "#374151" }}>Medium</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#22C55E" }} />
            <span style={{ fontSize: 12, color: "#374151" }}>Low</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Bubble Chart
// ============================================================================

function BubbleChart({
  onBubbleClick,
  onBubbleHover,
  onBubbleLeave,
  activeBubble,
}: {
  onBubbleClick: (risk: typeof BUBBLE_RISKS[0]) => void;
  onBubbleHover: (ctx: ClusterContext | null, rect: DOMRect | null) => void;
  onBubbleLeave: () => void;
  activeBubble: string | null;
}) {
  const [sizeMode, setSizeMode] = useState<"cost" | "age">("cost");
  const [filterType, setFilterType] = useState<string | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHover = useRef<{ ctx: ClusterContext; rect: DOMRect } | null>(null);

  const clearHold = () => {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
    pendingHover.current = null;
  };

  const startHold = (ctx: ClusterContext, el: HTMLElement) => {
    clearHold();
    const rect = el.getBoundingClientRect();
    pendingHover.current = { ctx, rect };
    holdTimer.current = setTimeout(() => {
      if (pendingHover.current) onBubbleHover(pendingHover.current.ctx, pendingHover.current.rect);
    }, 150);
  };

  const types = [...new Set(BUBBLE_RISKS.map(r => r.type))];
  const filteredRisks = filterType ? BUBBLE_RISKS.filter(r => r.type === filterType) : BUBBLE_RISKS;
  
  const maxSize = sizeMode === "cost" 
    ? Math.max(...BUBBLE_RISKS.map(r => r.cost))
    : Math.max(...BUBBLE_RISKS.map(r => r.age));

  const typeColors: Record<string, string> = {
    "Cyber": "#EF4444",
    "Compliance": "#8B5CF6",
    "Third-party": "#F59E0B",
    "Resilience": "#3B82F6",
    "Operational": "#6B7280",
    "Audit": "#10B981",
    "Governance": "#EC4899",
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", alignSelf: "center" }}>Size by:</span>
          {[
            { id: "cost" as const, label: "Cost ($K)" },
            { id: "age" as const, label: "Age (days)" },
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSizeMode(m.id)}
              style={{
                padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer",
                border: sizeMode === m.id ? "1px solid #111827" : "1px solid rgba(15,23,42,0.14)",
                background: sizeMode === m.id ? "#111827" : "#fff",
                color: sizeMode === m.id ? "#fff" : "#374151",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setFilterType(null)}
            style={{
              padding: "4px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, cursor: "pointer",
              border: filterType === null ? "1px solid #111827" : "1px solid rgba(15,23,42,0.14)",
              background: filterType === null ? "#111827" : "#fff",
              color: filterType === null ? "#fff" : "#374151",
            }}
          >
            All
          </button>
          {types.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              style={{
                padding: "4px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, cursor: "pointer",
                border: filterType === t ? `1px solid ${typeColors[t]}` : "1px solid rgba(15,23,42,0.14)",
                background: filterType === t ? typeColors[t] : "#fff",
                color: filterType === t ? "#fff" : "#374151",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ position: "relative", height: 320, border: "1px solid #E5E7EB", borderRadius: 12, background: "#FAFAFA", overflow: "hidden" }}>
        {/* Grid lines */}
        <svg style={{ position: "absolute", inset: 0 }}>
          {[1, 2, 3, 4].map(i => (
            <line key={`h${i}`} x1="0" y1={`${i * 20}%`} x2="100%" y2={`${i * 20}%`} stroke="#E5E7EB" strokeWidth="1" />
          ))}
          {[1, 2, 3, 4].map(i => (
            <line key={`v${i}`} x1={`${i * 20}%`} y1="0" x2={`${i * 20}%`} y2="100%" stroke="#E5E7EB" strokeWidth="1" />
          ))}
        </svg>

        {/* Quadrant labels */}
        <div style={{ position: "absolute", top: 8, right: 12, fontSize: 10, color: "#DC2626", fontWeight: 700 }}>High L + High I</div>
        <div style={{ position: "absolute", bottom: 8, left: 12, fontSize: 10, color: "#15803D", fontWeight: 700 }}>Low L + Low I</div>

        {/* Bubbles */}
        {filteredRisks.map((risk) => {
          const x = ((risk.likelihood - 0.5) / 5) * 100; // 0.5-5.5 -> 0-100%
          const y = 100 - ((risk.impact - 0.5) / 5) * 100; // Invert Y
          const sizeValue = sizeMode === "cost" ? risk.cost : risk.age;
          const size = 16 + (sizeValue / maxSize) * 40; // 16-56px
          const isActive = activeBubble === risk.id;

          const ctx: ClusterContext = {
            likelihood: risk.likelihood.toFixed(1),
            impact: risk.impact.toFixed(1),
            count: 1,
            delta: 0,
            signals: [
              `Remediation cost: $${risk.cost}K`,
              `Age: ${risk.age} days`,
              `Type: ${risk.type}`,
            ],
            title: risk.name,
            subtitle: `L: ${risk.likelihood.toFixed(1)} · I: ${risk.impact.toFixed(1)}`,
          };

          return (
            <button
              key={risk.id}
              type="button"
              onClick={() => onBubbleClick(risk)}
              onMouseEnter={(e) => startHold(ctx, e.currentTarget)}
              onMouseLeave={() => { clearHold(); onBubbleLeave(); }}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle at 30% 30%, ${typeColors[risk.type]}AA, ${typeColors[risk.type]})`,
                border: isActive ? "3px solid #111827" : "2px solid rgba(255,255,255,0.8)",
                boxShadow: isActive 
                  ? `0 0 0 4px ${typeColors[risk.type]}40, 0 8px 24px rgba(0,0,0,0.2)`
                  : `0 4px 12px ${typeColors[risk.type]}30`,
                cursor: "pointer",
                transition: "all 150ms ease",
                zIndex: isActive ? 10 : 1,
              }}
              title={risk.name}
            />
          );
        })}

        {/* Axis labels */}
        <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", fontSize: 11, fontWeight: 700, color: "#374151" }}>
          Likelihood →
        </div>
        <div style={{ position: "absolute", left: 4, top: "50%", transform: "rotate(-90deg) translateX(-50%)", transformOrigin: "left center", fontSize: 11, fontWeight: 700, color: "#374151" }}>
          Impact →
        </div>
      </div>

      {/* Legend & Stats */}
      <div style={{ marginTop: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Risk Types</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {types.map(t => {
              const count = BUBBLE_RISKS.filter(r => r.type === t).length;
              return (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: typeColors[t] }} />
                  <span style={{ fontSize: 11, color: "#6B7280" }}>{t} ({count})</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Size Legend ({sizeMode === "cost" ? "$K" : "days"})</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#9CA3AF" }} />
            <span style={{ fontSize: 10, color: "#6B7280" }}>Small</span>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#9CA3AF" }} />
            <span style={{ fontSize: 10, color: "#6B7280" }}>Medium</span>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#9CA3AF" }} />
            <span style={{ fontSize: 10, color: "#6B7280" }}>Large</span>
          </div>
        </div>
      </div>

      {/* Top risks callout */}
      <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>Top 3 Highest Exposure</div>
        <div style={{ display: "grid", gap: 4 }}>
          {[...BUBBLE_RISKS].sort((a, b) => (b.likelihood * b.impact) - (a.likelihood * a.impact)).slice(0, 3).map((r, i) => (
            <div key={r.id} style={{ fontSize: 11, color: "#7F1D1D", display: "flex", gap: 8 }}>
              <span style={{ fontWeight: 700 }}>{i + 1}.</span>
              <span>{r.name}</span>
              <span style={{ marginLeft: "auto", fontWeight: 600 }}>L:{r.likelihood} × I:{r.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Materiality Distribution Chart
// ============================================================================

function MaterialityChart({
  onBarClick,
  onBarHover,
  onBarLeave,
}: {
  onBarClick?: (dept: string, period: "lastQtr" | "thisQtr") => void;
  onBarHover?: (ctx: ClusterContext | null, rect: DOMRect | null) => void;
  onBarLeave?: () => void;
}) {
  const maxValue = Math.max(
    ...MATERIALITY_DATA.flatMap(d => [
      d.lastQtr.red + d.lastQtr.yellow + d.lastQtr.green,
      d.thisQtr.red + d.thisQtr.yellow + d.thisQtr.green,
    ])
  );
  const chartHeight = 240;
  const barWidth = 28;
  const groupGap = 16;
  const barGap = 4;

  const getBarHeight = (value: number) => (value / maxValue) * chartHeight;

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Y-axis labels */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", height: chartHeight, paddingBottom: 4 }}>
          {[25, 20, 15, 10, 5, 0].map(v => (
            <span key={v} style={{ fontSize: 10, color: "#6B7280" }}>{v}</span>
          ))}
        </div>

        {/* Chart area */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* Grid lines */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: chartHeight }}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div 
                key={i} 
                style={{ 
                  position: "absolute", 
                  top: `${(i / 5) * 100}%`, 
                  left: 0, 
                  right: 0, 
                  borderTop: "1px solid #E5E7EB" 
                }} 
              />
            ))}
          </div>

          {/* Bars */}
          <div style={{ display: "flex", justifyContent: "space-around", height: chartHeight, alignItems: "flex-end", position: "relative" }}>
            {MATERIALITY_DATA.map((dept, idx) => {
              const lastTotal = dept.lastQtr.red + dept.lastQtr.yellow + dept.lastQtr.green;
              const thisTotal = dept.thisQtr.red + dept.thisQtr.yellow + dept.thisQtr.green;

              return (
                <div key={dept.dept} style={{ display: "flex", gap: barGap, alignItems: "flex-end" }}>
                  {/* Last Quarter Bar */}
                  <div
                    style={{ 
                      width: barWidth, 
                      display: "flex", 
                      flexDirection: "column",
                      cursor: "pointer",
                    }}
                    onClick={() => onBarClick?.(dept.dept, "lastQtr")}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      onBarHover?.({
                        likelihood: dept.dept,
                        impact: "Last Qtr",
                        count: lastTotal,
                        delta: thisTotal - lastTotal,
                        signals: [`Red: ${dept.lastQtr.red}`, `Yellow: ${dept.lastQtr.yellow}`, `Green: ${dept.lastQtr.green}`],
                        title: `${dept.dept} - Last Quarter`,
                        subtitle: `${lastTotal} total residual risks`,
                      }, rect);
                    }}
                    onMouseLeave={() => onBarLeave?.()}
                  >
                    {/* Green segment */}
                    <div style={{ 
                      width: "100%", 
                      height: getBarHeight(dept.lastQtr.green), 
                      background: "#22C55E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {dept.lastQtr.green > 0 && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>{dept.lastQtr.green}</span>
                      )}
                    </div>
                    {/* Yellow segment */}
                    <div style={{ 
                      width: "100%", 
                      height: getBarHeight(dept.lastQtr.yellow), 
                      background: "#FBBF24",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {dept.lastQtr.yellow > 0 && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>{dept.lastQtr.yellow}</span>
                      )}
                    </div>
                    {/* Red segment */}
                    <div style={{ 
                      width: "100%", 
                      height: getBarHeight(dept.lastQtr.red), 
                      background: "#DC2626",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {dept.lastQtr.red > 0 && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>{dept.lastQtr.red}</span>
                      )}
                    </div>
                  </div>

                  {/* This Quarter Bar */}
                  <div
                    style={{ 
                      width: barWidth, 
                      display: "flex", 
                      flexDirection: "column",
                      cursor: "pointer",
                    }}
                    onClick={() => onBarClick?.(dept.dept, "thisQtr")}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      onBarHover?.({
                        likelihood: dept.dept,
                        impact: "This Qtr",
                        count: thisTotal,
                        delta: thisTotal - lastTotal,
                        signals: [`Red: ${dept.thisQtr.red}`, `Yellow: ${dept.thisQtr.yellow}`, `Green: ${dept.thisQtr.green}`],
                        title: `${dept.dept} - This Quarter`,
                        subtitle: `${thisTotal} total residual risks`,
                      }, rect);
                    }}
                    onMouseLeave={() => onBarLeave?.()}
                  >
                    {/* Green segment */}
                    <div style={{ 
                      width: "100%", 
                      height: getBarHeight(dept.thisQtr.green), 
                      background: "#22C55E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {dept.thisQtr.green > 0 && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>{dept.thisQtr.green}</span>
                      )}
                    </div>
                    {/* Yellow segment */}
                    <div style={{ 
                      width: "100%", 
                      height: getBarHeight(dept.thisQtr.yellow), 
                      background: "#FBBF24",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {dept.thisQtr.yellow > 0 && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>{dept.thisQtr.yellow}</span>
                      )}
                    </div>
                    {/* Red segment */}
                    <div style={{ 
                      width: "100%", 
                      height: getBarHeight(dept.thisQtr.red), 
                      background: "#DC2626",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {dept.thisQtr.red > 0 && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>{dept.thisQtr.red}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8 }}>
            {MATERIALITY_DATA.map((dept) => (
              <div key={dept.dept} style={{ textAlign: "center", width: barWidth * 2 + barGap }}>
                <div style={{ fontSize: 8, color: "#9CA3AF", marginBottom: 2 }}>
                  <span>Last Qtr</span>
                  <span style={{ margin: "0 4px" }}></span>
                  <span>This Qtr</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}>{dept.dept}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 14, background: "#DC2626", borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: "#374151" }}>High Risk</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 14, background: "#FBBF24", borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: "#374151" }}>Medium Risk</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 14, background: "#22C55E", borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: "#374151" }}>Low Risk</span>
        </div>
      </div>

      {/* Summary callout */}
      <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "#FEF3C7", border: "1px solid #FCD34D" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>Key Observations</div>
        <div style={{ display: "grid", gap: 4, fontSize: 11, color: "#78350F" }}>
          <div>• <strong>International</strong> shows highest red risk increase (+3 this quarter)</div>
          <div>• <strong>Finance</strong> improved significantly (green risks down but overall profile better)</div>
          <div>• <strong>COO</strong> added more low-risk items while maintaining high-risk count</div>
        </div>
      </div>
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
    { id: "materiality" as ViewMode, label: "Materiality" },
    { id: "gaussian" as ViewMode, label: "Gaussian" },
    { id: "cost" as ViewMode, label: "Cost × Notion" },
    { id: "trend" as ViewMode, label: "Trend Line" },
    { id: "bubble" as ViewMode, label: "Bubble Chart" },
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
                    {viewMode === "materiality" && "Materiality Distribution of Residual Risk"}
                    {viewMode === "gaussian" && "Risk Score Distribution"}
                    {viewMode === "cost" && "Cost × Notion Matrix"}
                    {viewMode === "trend" && "Risk Trend Over Time"}
                    {viewMode === "bubble" && "Risk Exposure Bubble Chart"}
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

                {viewMode === "materiality" && (
                  <MaterialityChart
                    onBarClick={(dept, period) => {
                      // Could filter by department
                      setTableVersion((v) => v + 1);
                    }}
                    onBarHover={handleCellHover}
                    onBarLeave={() => {}}
                  />
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

                {viewMode === "trend" && (
                  <TrendChart
                    onPointHover={handleCellHover}
                    onPointLeave={() => {}}
                    activeMonth={popoverCtx?.impact ?? null}
                  />
                )}

                {viewMode === "bubble" && (
                  <BubbleChart
                    onBubbleClick={(risk) => {
                      // Could open detail view or filter
                      setLikelihood(risk.likelihood >= 3 ? "High" : risk.likelihood >= 2 ? "Medium" : "Low");
                      setImpact(risk.impact >= 3 ? "High" : risk.impact >= 2 ? "Medium" : "Low");
                      setTableVersion((v) => v + 1);
                    }}
                    onBubbleHover={handleCellHover}
                    onBubbleLeave={() => {}}
                    activeBubble={null}
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
