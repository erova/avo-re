"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  RISK_ROWS,
  HEATMAP_LAST30_COUNTS,
  type RiskLevel,
  type RiskRow,
} from "@/app/now/risk-heatmap-insights/data/riskSeed";

type TimeMode = "current" | "last30";
type CellKey = `${RiskLevel}-${RiskLevel}`;

export type ClusterContext = {
  likelihood: RiskLevel;
  impact: RiskLevel;
  count: number;
  delta: number;
  mostCommonRisk: string;
  lastUpdatedIso: string;
  signals: string[];
  title: string;
  subtitle: string;
};

export type HeatMapDemoProps = {
  embedded?: boolean;
  onOpenActions?: (ctx: ClusterContext) => void;
  onApplyFilters?: (likelihood: RiskLevel, impact: RiskLevel) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function humanizeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const minutes = Math.floor(diffMs / (60 * 1000));
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days >= 1) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (hours >= 1) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (minutes >= 1) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  return "just now";
}

function keyOf(l: RiskLevel, i: RiskLevel): CellKey {
  return `${l}-${i}`;
}

function levelNum(l: RiskLevel) {
  return l === "Low" ? 1 : l === "Medium" ? 2 : 3;
}

function severityScore(l: RiskLevel, i: RiskLevel) {
  return levelNum(l) * levelNum(i); // 1..9
}

function stoplightColor(sev: number) {
  const greens = ["#E8FFF0", "#C9F7D8"]; // 1..2
  const ambers = ["#FFF7C2", "#FFE37A", "#FFC247"]; // 3..5
  const reds = ["#FFD5D5", "#FF8E8E", "#D91C1C", "#B81414"]; // 6..9
  const s = clamp(sev, 1, 9);
  if (s <= 2) return greens[s - 1];
  if (s <= 5) return ambers[s - 3];
  return reds[s - 6];
}

function stoplightBorder(sev: number) {
  const s = clamp(sev, 1, 9);
  if (s <= 2) return "#33A353";
  if (s <= 5) return "#C78A00";
  return "#B81414";
}

function textColorForBg(sev: number) {
  return sev >= 8 ? "#FFFFFF" : "#1F2937";
}

function deltaPillStyle(delta: number) {
  // Use a consistent light border so pills read cleanly on all stoplight tiles.
  const whiteBorder = "1px solid rgba(255,255,255,0.70)";

  if (delta === 0)
    return {
      bg: "#E9EEF5",
      fg: "#3A4656",
      shadow: "0 6px 18px rgba(15, 23, 42, 0.10)",
      border: whiteBorder,
    };

  if (delta > 0)
    return {
      bg: "#D91C1C",
      fg: "#FFFFFF",
      shadow: "0 8px 22px rgba(217, 28, 28, 0.25)",
      border: whiteBorder,
    };

  return {
    bg: "#15803D",
    fg: "#FFFFFF",
    shadow: "0 8px 22px rgba(21, 128, 61, 0.20)",
    border: whiteBorder,
  };
}

function mostCommonRiskName(rows: RiskRow[]) {
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(r.riskName, (counts.get(r.riskName) ?? 0) + 1);
  let best = "—";
  let bestN = 0;
  for (const [name, n] of counts.entries()) {
    if (n > bestN) {
      best = name;
      bestN = n;
    }
  }
  return best;
}

function buildClusterContext(
  rows: RiskRow[],
  likelihood: RiskLevel,
  impact: RiskLevel
): ClusterContext {
  const cellRows = rows.filter((r) => r.likelihood === likelihood && r.impact === impact);

  const count = cellRows.length;
  const last30 = HEATMAP_LAST30_COUNTS[keyOf(likelihood, impact)] ?? count;
  const delta = count - last30;

  const recurringCount = cellRows.filter((r) => r.recurring).length;
  const staleCount = cellRows.filter((r) => r.stale).length;

  const mostCommon = mostCommonRiskName(cellRows);
  const lastUpdatedIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const signals = [
    recurringCount ? `Recurrence detected: ${recurringCount} of ${count} risks reappeared` : null,
    delta > 0 ? `Rising cluster: +${delta} vs last period` : delta < 0 ? `Improving cluster: ${delta} vs last period` : null,
    staleCount ? `Staleness: ${staleCount} risks not recently reviewed` : null,
    mostCommon !== "—" ? `Most common: ${mostCommon}` : null,
  ].filter(Boolean) as string[];

  const title =
    recurringCount && delta > 0
      ? "Recurring + trending up"
      : recurringCount
      ? "Recurring pattern"
      : delta > 0
      ? "Trending upward"
      : "Cluster summary";

  const subtitle = `${likelihood} likelihood · ${impact} impact · ${count} risks (${
    delta === 0 ? "0" : delta > 0 ? `+${delta}` : `${delta}`
  } vs last period)`;

  return {
    likelihood,
    impact,
    count,
    delta,
    mostCommonRisk: mostCommon,
    lastUpdatedIso,
    signals,
    title,
    subtitle,
  };
}

export default function HeatMapDemo({
  embedded = false,
  onOpenActions,
  onApplyFilters,
}: HeatMapDemoProps) {
  const rows = RISK_ROWS;

  const [timeMode, setTimeMode] = useState<TimeMode>("current");
  const [hoverKey, setHoverKey] = useState<CellKey | null>(null);
  const holdTimer = useRef<number | null>(null);
  const [activeKey, setActiveKey] = useState<CellKey | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  function clearHold() {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }

  function startHold(key: CellKey, el: HTMLElement) {
    clearHold();
    holdTimer.current = window.setTimeout(() => {
      setActiveKey(key);
      setAnchorRect(el.getBoundingClientRect());
    }, 160);
  }

  function closePreview() {
    clearHold();
    setActiveKey(null);
    setAnchorRect(null);
  }

  useEffect(() => {
    function onScrollOrResize() {
      if (!activeKey) return;
      const target = document.querySelector<HTMLElement>(`[data-cell="${activeKey}"]`);
      if (target) setAnchorRect(target.getBoundingClientRect());
    }
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [activeKey]);

  const likelihoodLevels: RiskLevel[] = ["High", "Medium", "Low"];
  const impactLevels: RiskLevel[] = ["Low", "Medium", "High"];

  const previewCtx = useMemo(() => {
    if (!activeKey) return null;
    const [l, i] = activeKey.split("-") as [RiskLevel, RiskLevel];
    return buildClusterContext(rows, l, i);
  }, [activeKey, rows]);

  const panelStyle: React.CSSProperties | undefined = useMemo(() => {
    if (!anchorRect) return undefined;
    const width = 360;
    const height = 280;
    const padding = 10;
    const preferRight = anchorRect.right + padding + width < window.innerWidth;
    const left = preferRight ? anchorRect.right + padding : anchorRect.left - padding - width;
    const topRaw = anchorRect.top + anchorRect.height / 2 - height / 2;
    const top = clamp(topRaw, 12, window.innerHeight - height - 12);
    return { position: "fixed", left, top, width, zIndex: 50 };
  }, [anchorRect]);

  return (
    <div style={{ width: "100%" }}>
      <style jsx global>{`
        @keyframes hmSheenMove {
          0% { transform: translateX(-140%) skewX(-12deg); opacity: 0; }
          10% { opacity: 0.55; }
          50% { opacity: 0.35; }
          100% { transform: translateX(140%) skewX(-12deg); opacity: 0; }
        }

        .hm-sheen {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            110deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.22) 35%,
            rgba(255,255,255,0.55) 50%,
            rgba(255,255,255,0.18) 65%,
            rgba(255,255,255,0) 100%
          );
          animation: hmSheenMove 950ms ease-out 1;
          mix-blend-mode: overlay;
        }
      `}</style>
      {!embedded ? (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Risk Heatmap</div>
          <div style={{ fontSize: 13, color: "#4B5563", marginTop: 4 }}>
            Likelihood vertical, impact horizontal. Hover-hold previews; click filters the table.
          </div>
        </div>
      ) : null}

      <div style={{ position: "relative" }} onMouseLeave={closePreview}>
        <div
          style={{
            position: "absolute",
            left: -15,
            top: "35%",
            transform: "rotate(-90deg) translateX(-50%)",
            fontSize: 13,
            fontWeight: 700,
            color: "#1F2937",
            letterSpacing: "0.02em",
          }}
        >
          Likelihood
        </div>

        <div
          style={{
            position: "absolute",
            right: "42.5%",
            bottom: 35,
            color: "#1F2937",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          Impact →
        </div>

        <div
          style={{
            marginLeft: 34,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            alignItems: "stretch",
          }}
        >
          {likelihoodLevels.map((l) =>
            impactLevels.map((i) => {
              const k = keyOf(l, i);
              const count = rows.filter((r) => r.likelihood === l && r.impact === i).length;
              const last30 = HEATMAP_LAST30_COUNTS[k] ?? count;
              const delta = count - last30;

              const sev = severityScore(l, i);
              const bg = stoplightColor(sev);
              const border = stoplightBorder(sev);
              const fg = textColorForBg(sev);

              const isActive = activeKey === k;
              const isDimmed = activeKey !== null && !isActive;
              const pill = deltaPillStyle(delta);

              return (
                <button
                  key={k}
                  data-cell={k}
                  type="button"
                  onMouseEnter={(e) => {
                    setHoverKey(k);
                    startHold(k, e.currentTarget);
                  }}
                  onMouseMove={(e) => {
                    if (activeKey === k) setAnchorRect(e.currentTarget.getBoundingClientRect());
                  }}
                  onFocus={(e) => startHold(k, e.currentTarget)}
                  onBlur={() => {
                    setHoverKey(null);
                    closePreview();
                  }}
                  onMouseLeave={() => setHoverKey(null)}
                  onClick={() => onApplyFilters?.(l, i)}
                  style={{
                    height: 78,                 // slightly shorter = less page push
                    borderRadius: 12,
                    border: "1px solid rgba(15, 23, 42, 0.10)",
                  
                    // keep stoplight bg, but add a subtle "surface" highlight
                    background: `linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.10) 34%, rgba(255,255,255,0) 100%), ${bg}`,
                  
                    color: fg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    cursor: "pointer",
                  
                    // subtle elevation + inset edge so it reads as a tile
                    boxShadow: isActive
                      ? "0 18px 44px rgba(15, 23, 42, 0.16), inset 0 0 0 1px rgba(15, 23, 42, 0.12)"
                      : "0 10px 22px rgba(15, 23, 42, 0.10), inset 0 0 0 1px rgba(15, 23, 42, 0.08)",
                  
                    // active tie-in without the “spinning plate”
                    outline: isActive ? "2px solid rgba(15, 23, 42, 0.65)" : "none",
                    outlineOffset: 2,
                  
                    transition: "transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease, outline-color 140ms ease",
                    opacity: isDimmed ? 0.22 : 1,
                    transform: isActive ? "translateY(-1px)" : "translateY(0px)",
                  }}
                >
                  {hoverKey === k || isActive ? (
                    <span
                      aria-hidden="true"
                      className="hm-sheen"
                    />
                  ) : null}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{count}</div>
                    <div
                      style={{
                        marginTop: 9,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 999,
                        padding: "6px 12px",
                        background: pill.bg,
                        color: pill.fg,
                        fontSize: 12,
                        fontWeight: 900,
                        boxShadow: pill.shadow,
                        border: pill.border,
                        minWidth: 44,
                      }}
                    >
                      {delta === 0 ? "0" : delta > 0 ? `+${delta}` : `${delta}`}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div
          style={{
            marginLeft: 34,
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            color: "#374151",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <div style={{ textAlign: "left" }}>Low</div>
          <div style={{ textAlign: "center" }}>Medium</div>
          <div style={{ textAlign: "right" }}>High</div>
        </div>

        <div style={{ marginLeft: 34, marginTop: 12, display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => setTimeMode("current")}
            style={{
              borderRadius: 999,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 800,
              border: "1px solid rgba(15, 23, 42, 0.18)",
              background: timeMode === "current" ? "#111827" : "#FFFFFF",
              color: timeMode === "current" ? "#FFFFFF" : "#374151",
            }}
          >
            Current
          </button>
          <button
            type="button"
            onClick={() => setTimeMode("last30")}
            style={{
              borderRadius: 999,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 800,
              border: "1px solid rgba(15, 23, 42, 0.18)",
              background: timeMode === "last30" ? "#111827" : "#FFFFFF",
              color: timeMode === "last30" ? "#FFFFFF" : "#374151",
            }}
          >
            Last 30 days
          </button>
        </div>

        {previewCtx && panelStyle ? (
          <div
            style={{
              ...panelStyle,
              borderRadius: 14,
              border: "1px solid rgba(15, 23, 42, 0.22)",
              background: "#FFFFFF",
              boxShadow: "0 18px 44px rgba(15, 23, 42, 0.18)",
              padding: 14,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 950, color: "#111827" }}>
              {previewCtx.likelihood} likelihood · {previewCtx.impact} impact
            </div>

            <div style={{ marginTop: 8, fontSize: 13, color: "#374151" }}>
              <strong>{previewCtx.count}</strong> risks{" "}
              <span
                style={{
                  fontWeight: 900,
                  color: previewCtx.delta > 0 ? "#D91C1C" : previewCtx.delta < 0 ? "#15803D" : "#3A4656",
                }}
              >
                {previewCtx.delta === 0 ? "· 0" : previewCtx.delta > 0 ? `· +${previewCtx.delta}` : `· ${previewCtx.delta}`}
              </span>{" "}
              <span style={{ color: "#6B7280" }}>vs last period</span>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 950, color: "#111827", marginBottom: 6 }}>
                Signals
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {previewCtx.signals.length ? (
                  previewCtx.signals.map((s) => (
                    <div
                      key={s}
                      style={{
                        borderRadius: 10,
                        border: "1px solid rgba(15,23,42,0.10)",
                        background: "#F9FAFB",
                        padding: "8px 10px",
                        fontSize: 12,
                        color: "#374151",
                      }}
                    >
                      {s}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: 12, color: "#6B7280" }}>No notable signals detected.</div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              <button
                type="button"
                onClick={() => onOpenActions?.(previewCtx)}
                style={{
                  height: 36,
                  borderRadius: 10,
                  border: "1px solid rgba(15,23,42,0.14)",
                  background: "#111827",
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 950,
                  cursor: "pointer",
                }}
              >
                ➜ Open guidance & actions
              </button>

              <button
                type="button"
                onClick={() => onApplyFilters?.(previewCtx.likelihood, previewCtx.impact)}
                style={{
                  height: 34,
                  borderRadius: 10,
                  border: "1px solid rgba(15,23,42,0.12)",
                  background: "#FFFFFF",
                  color: "#111827",
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                🧲 Filter table
              </button>
            </div>

            <div style={{ marginTop: 10, fontSize: 12, color: "#9CA3AF" }}>
              Updated {humanizeAgo(previewCtx.lastUpdatedIso)}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}