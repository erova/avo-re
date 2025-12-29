"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type RiskLevel = "Low" | "Medium" | "High";
type TimeMode = "current" | "last30";

type CellKey = `${RiskLevel}-${RiskLevel}`; // likelihood-impact

type CellData = {
  likelihood: RiskLevel;
  impact: RiskLevel;
  current: number;
  last30: number;
  mostCommonRisk: string;
  lastUpdatedIso: string; // for humanized label

  // 👇 recurring risks
  recurrence?: {
    periods: number;
    total: number;
    severity: "early" | "escalated";
  };
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

function idx(level: RiskLevel) {
  return level === "Low" ? 0 : level === "Medium" ? 1 : 2;
}

/**
 * 9-step stoplight shading:
 *  - score 1..3 => green (1 light → 3 intense)
 *  - score 4..6 => yellow/amber (4 light → 6 intense)
 *  - score 7..9 => red (7 light → 9 intense)
 *
 * score is derived from likelihood + impact grid (1..9).
 */
function stoplightColor(score: number) {
  const greens = ["#E8FFF0", "#C9F7D8", "#4BCB6A"]; // 1..3
  const ambers = ["#FFF7C2", "#FFE37A", "#FFC247"]; // 4..6
  const reds = ["#FFD5D5", "#FF8E8E", "#D91C1C"]; // 7..9

  const s = clamp(score, 1, 9);

  if (s <= 3) return greens[s - 1];
  if (s <= 6) return ambers[s - 4];
  return reds[s - 7];
}

function stoplightBorder(score: number) {
  // slightly stronger border for higher scores
  const s = clamp(score, 1, 9);
  if (s <= 3) return "#33A353";
  if (s <= 6) return "#C78A00";
  return "#B81414";
}

function textColorForBg(score: number) {
  // darkest text on light BG; white only for the most intense red
  return score >= 9 ? "#FFFFFF" : "#4A2A12";
}

function deltaPillStyle(delta: number) {
  if (delta === 0)
    return { bg: "#E9EEF5", fg: "#3A4656", shadow: "0 6px 18px rgba(15, 23, 42, 0.10)" };
  if (delta > 0)
    return { bg: "#D91C1C", fg: "#FFFFFF", shadow: "0 8px 22px rgba(217, 28, 28, 0.25)" };
  return { bg: "#15803D", fg: "#FFFFFF", shadow: "0 8px 22px rgba(21, 128, 61, 0.20)" };
}

function riskScore(likelihood: RiskLevel, impact: RiskLevel) {
  // Map to 1..9 buckets that match your stoplightColor banding:
  // 1..3 green, 4..6 amber, 7..9 red
  const L = idx(likelihood); // 0=Low,1=Med,2=High
  const I = idx(impact);

  const matrix: number[][] = [
    // Impact:   Low  Med  High
    /* Low */   [1,   4,   6],
    /* Med */   [4,   5,   7],
    /* High */  [6,   7,   9],
  ];

  // NOTE: your idx() is Low->0, Medium->1, High->2
  // likelihood is vertical axis, impact is horizontal axis
  return matrix[L][I];
}

function label(level: RiskLevel) {
  return level;
}

function keyOf(l: RiskLevel, i: RiskLevel): CellKey {
  return `${l}-${i}`;
}

export default function HeatMapDemo({ embedded = false }: { embedded?: boolean }) {
  // Dummy grid matching the production screenshot layout (Likelihood vertical, Impact horizontal)
  const cells: CellData[] = useMemo(
    () => [
      // Likelihood: High row
      {
        likelihood: "High",
        impact: "Low",
        current: 1,
        last30: 2,
        mostCommonRisk: "Third-party access controls",
        lastUpdatedIso: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        likelihood: "High",
        impact: "Medium",
        current: 7,
        last30: 5,
        mostCommonRisk: "Regulatory change tracking",
        lastUpdatedIso: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        likelihood: "High",
        impact: "High",
        current: 6,
        last30: 4,
        mostCommonRisk: "Incident response readiness",
        lastUpdatedIso: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        recurrence: {
          periods: 4,
          total: 4,
          severity: "escalated",
        },
      },

      // Likelihood: Medium row
      {
        likelihood: "Medium",
        impact: "Low",
        current: 4,
        last30: 3,
        mostCommonRisk: "Third-party access controls",
        lastUpdatedIso: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        likelihood: "Medium",
        impact: "Medium",
        current: 21,
        last30: 19,
        mostCommonRisk: "Policy acknowledgement drift",
        lastUpdatedIso: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        likelihood: "Medium",
        impact: "High",
        current: 22,
        last30: 18,
        mostCommonRisk: "Unpatched dependency exposure",
        lastUpdatedIso: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Likelihood: Low row
      {
        likelihood: "Low",
        impact: "Low",
        current: 7,
        last30: 6,
        mostCommonRisk: "Evidence collection delays",
        lastUpdatedIso: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        likelihood: "Low",
        impact: "Medium",
        current: 6,
        last30: 5,
        mostCommonRisk: "Training completion variance",
        lastUpdatedIso: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        recurrence: {
          periods: 3,
          total: 5,
          severity: "early",
        },
      },
      {
        likelihood: "Low",
        impact: "High",
        current: 8,
        last30: 7,
        mostCommonRisk: "Vendor reassessment overdue",
        lastUpdatedIso: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    []
  );

  const byKey = useMemo(() => {
    const m = new Map<CellKey, CellData>();
    for (const c of cells) m.set(keyOf(c.likelihood, c.impact), c);
    return m;
  }, [cells]);

  const [timeMode, setTimeMode] = useState<TimeMode>("current");

  // Hover-hold behavior
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
    }, 160); // “hover-hold” so it doesn’t feel twitchy
  }

  function closePreview() {
    clearHold();
    setActiveKey(null);
    setAnchorRect(null);
  }

  useEffect(() => {
    function onScrollOrResize() {
      if (!activeKey) return;
      // Re-anchor on scroll/resize
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

  const preview = activeKey ? byKey.get(activeKey) : null;

  // Preview panel position: anchored near the active cell (slightly to the right / centered vertically)
  const panelStyle: React.CSSProperties | undefined = useMemo(() => {
    if (!anchorRect) return undefined;

    // We’re inside a light canvas but the page is dark — use fixed and trust viewport.
    const width = 320;
    const height = 154;

    const padding = 10;
    const preferRight = anchorRect.right + padding + width < window.innerWidth;
    const left = preferRight ? anchorRect.right + padding : anchorRect.left - padding - width;

    // keep roughly centered on the cell, clamped in viewport
    const topRaw = anchorRect.top + anchorRect.height / 2 - height / 2;
    const top = clamp(topRaw, 12, window.innerHeight - height - 12);

    return {
      position: "fixed",
      left,
      top,
      width,
      zIndex: 50,
    };
  }, [anchorRect]);

  return (
    <div style={{ width: "100%" }}>
      {/* Internal demo header (hide when embedded in Risk Manager) */}
      {!embedded ? (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Risk Heatmap</div>
          <div style={{ fontSize: 13, color: "#4B5563", marginTop: 4 }}>
            Likelihood on the vertical, impact on the horizontal. Hover-hold previews; click retains the
            existing “apply filters” behavior.
          </div>
        </div>
      ) : null}

      {/* Grid + axes */}
      <div
        style={{
          position: "relative",
          borderRadius: 0,
          border: "none",
          background: "transparent",
          padding: 0,
        }}
        onMouseLeave={closePreview}
      >
        {/* Y-axis label */}
        <div
          style={{
            position: "absolute",
    left: -15,
    top: "35%",
    transform: "rotate(-90deg) translateX(-50%)",
    fontSize: 13,
    fontWeight: 600,
    color: "#1F2937",
    letterSpacing: "0.02em",
          }}
        >
          Likelihood
        </div>

        {/* X-axis label - impactTK*/}
        <div
          style={{
            position: "absolute",
            right: "42.5%",
            bottom: 35,
            color: "#1F2937",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.2,
          }}
        >
          Impact →
        </div>

        {/* Heatmap grid */}
        <div
          style={{
            marginLeft: 34, // room for vertical axis label
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          {likelihoodLevels.map((l) =>
            impactLevels.map((i) => {
              const k = keyOf(l, i);
              const c = byKey.get(k)!;

              const score = riskScore(l, i);
              const bg = stoplightColor(score);
              const border = stoplightBorder(score);
              const fg = textColorForBg(score);

              const value = timeMode === "current" ? c.current : c.last30;
              const delta = c.current - c.last30;

              const isActive = activeKey === k;
              const isDimmed = activeKey !== null && !isActive;

              // pill based on delta
              const pill = deltaPillStyle(delta);

              return (
                <button
                  key={k}
                  data-cell={k}
                  type="button"
                  onMouseEnter={(e) => startHold(k, e.currentTarget)}
                  onMouseMove={(e) => {
                    // keep anchoring stable even if the page reflows slightly
                    if (activeKey === k) setAnchorRect(e.currentTarget.getBoundingClientRect());
                  }}
                  onFocus={(e) => startHold(k, e.currentTarget)}
                  onBlur={closePreview}
                  onClick={() => {
                    // Keep click behavior “commitment”: in product this would apply filters to the table.
                    // Here we just keep it as a no-op placeholder.
                  }}
                  style={{
                    height: 85,
                    borderRadius: 12,
                    border: `1.5px solid ${border}`,
                    background: bg,
                    color: fg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease",
                    opacity: isDimmed ? 0.25 : 1,
                    boxShadow: isActive
                      ? "0 14px 34px rgba(15, 23, 42, 0.14)"
                      : "0 10px 22px rgba(15, 23, 42, 0.08)",
                    transform: isActive ? "translateY(-1px)" : "translateY(0px)",
                    outline: "none",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>
                      {value}
                    </div>

                    {/* Delta pill (show in Current view; in Last 30 Days show “vs current” as well) */}
                    <div
                      style={{
                        marginTop: 10,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 999,
                        padding: "6px 12px",
                        background: pill.bg,
                        color: pill.fg,
                        fontSize: 12,
                        fontWeight: 800,
                        boxShadow: pill.shadow,
                        border: "1px solid white",
                        letterSpacing: 0.2,
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

        {/* X-axis tick labels */}
        <div
          style={{
            marginLeft: 34,
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
            color: "#374151",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <div style={{ textAlign: "left" }}>{label("Low")}</div>
          <div style={{ textAlign: "center" }}>{label("Medium")}</div>
          <div style={{ textAlign: "right" }}>{label("High")}</div>
        </div>

        {/* Timeframe toggle (keep it light + production-ish) */}
        <div style={{ marginLeft: 34, marginTop: 14, display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => setTimeMode("current")}
            style={{
              borderRadius: 999,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 700,
              border: "1px solid rgba(15, 23, 42, 0.18)",
              background: timeMode === "current" ? "#111827" : "#FFFFFF",
              color: timeMode === "current" ? "#FFFFFF" : "#374151",
              boxShadow: timeMode === "current" ? "0 10px 22px rgba(15, 23, 42, 0.12)" : "none",
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
              fontWeight: 700,
              border: "1px solid rgba(15, 23, 42, 0.18)",
              background: timeMode === "last30" ? "#111827" : "#FFFFFF",
              color: timeMode === "last30" ? "#FFFFFF" : "#374151",
              boxShadow: timeMode === "last30" ? "0 10px 22px rgba(15, 23, 42, 0.12)" : "none",
            }}
          >
            Last 30 days
          </button>
        </div>

        

        {/* Hover-hold preview panel */}
        {preview && panelStyle ? (
          <div
            style={{
              ...panelStyle,
              borderRadius: 14,
              border: "1px solid rgba(15, 23, 42, 0.22)",
              background: "#FFFFFF",
              boxShadow: "0 18px 44px rgba(15, 23, 42, 0.18)",
              padding: 14,
            }}
            role="dialog"
            aria-label="Heatmap preview"
          >
            <div style={{ fontSize: 18, fontWeight: 900, color: "#111827", lineHeight: 1.15 }}>
              {label(preview.likelihood)} likelihood · {label(preview.impact)} impact
            </div>

            <div style={{ marginTop: 10, fontSize: 14, color: "#374151" }}>
              <strong>{timeMode === "current" ? preview.current : preview.last30}</strong> risks{" "}
              <span style={{ color: deltaPillStyle(preview.current - preview.last30).bg === "#D91C1C" ? "#D91C1C" : "#15803D", fontWeight: 800 }}>
                {preview.current - preview.last30 === 0
                  ? "· 0"
                  : preview.current - preview.last30 > 0
                  ? `· +${preview.current - preview.last30}`
                  : `· ${preview.current - preview.last30}`}
              </span>{" "}
              <span style={{ color: "#6B7280" }}>vs last period</span>
            </div>

            <div style={{ marginTop: 10, fontSize: 14, color: "#6B7280" }}>
              Most common risk:{" "}
              <span style={{ color: "#374151", fontWeight: 700 }}>
                {preview.mostCommonRisk}
              </span>
            </div>
            {preview.recurrence ? (
  <div style={{ marginTop: 12 }}>
    <div
      style={{
        fontSize: 13,
        fontWeight: 800,
        color: "#111827",
        marginBottom: 4,
      }}
    >
      Pattern detected: Recurring risk
    </div>

    <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>
      {preview.recurrence.severity === "early" ? (
        <>
          This risk has reappeared in{" "}
          <strong>{preview.recurrence.periods}</strong> of the last{" "}
          <strong>{preview.recurrence.total}</strong> review periods, despite
          remaining at lower severity.
        </>
      ) : (
        <>
          This risk has reappeared in{" "}
          <strong>{preview.recurrence.periods}</strong> consecutive review
          periods without sustained reduction.
        </>
      )}
    </div>

    <div
      style={{
        marginTop: 8,
        fontSize: 12,
        color: "#6B7280",
      }}
    >
      <strong>What this may warrant:</strong>
      <ul style={{ marginTop: 4, paddingLeft: 16 }}>
        {preview.recurrence.severity === "early" ? (
          <>
            <li>Added context on why mitigation has not held</li>
            <li>Review of ownership or control design</li>
            <li>Preventative attention before severity increases</li>
          </>
        ) : (
          <>
            <li>Alignment with stakeholders responsible for remediation</li>
            <li>Review of mitigation effectiveness and ownership</li>
            <li>Portfolio-level attention to prevent further escalation</li>
          </>
        )}
      </ul>
    </div>

    <div
      style={{
        marginTop: 10,
        fontSize: 12,
        fontStyle: "italic",
        color: "#4B5563",
      }}
    >
      Ask Diligent to help:{" "}
      {preview.recurrence.severity === "early"
        ? "Why do these risks keep reappearing even though their impact is still moderate?"
        : "Why do high-impact risks in this area continue to recur despite mitigation efforts?"}
    </div>
  </div>
) : null}
            <div style={{ marginTop: 10, fontSize: 12, color: "#9CA3AF" }}>
              Last updated {humanizeAgo(preview.lastUpdatedIso)}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}