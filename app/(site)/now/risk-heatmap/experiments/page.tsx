"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";

// ============================================================================
// Types & Constants
// ============================================================================

type RiskLevel3 = "Low" | "Medium" | "High";
type RiskLevel5 = "Very Low" | "Low" | "Medium" | "High" | "Very High";

type ViewMode = "3x3" | "5x5" | "compare" | "gaussian" | "cost";

// 5x5 seed data - realistic distribution across 25 cells
const HEATMAP_5X5_CURRENT: Record<string, number> = {
  "Very High-Very Low": 0,
  "Very High-Low": 1,
  "Very High-Medium": 2,
  "Very High-High": 3,
  "Very High-Very High": 2,
  "High-Very Low": 1,
  "High-Low": 2,
  "High-Medium": 5,
  "High-High": 6,
  "High-Very High": 4,
  "Medium-Very Low": 3,
  "Medium-Low": 4,
  "Medium-Medium": 12,
  "Medium-High": 8,
  "Medium-Very High": 5,
  "Low-Very Low": 5,
  "Low-Low": 6,
  "Low-Medium": 4,
  "Low-High": 3,
  "Low-Very High": 2,
  "Very Low-Very Low": 8,
  "Very Low-Low": 4,
  "Very Low-Medium": 3,
  "Very Low-High": 1,
  "Very Low-Very High": 0,
};

// 1 year ago data for comparison
const HEATMAP_5X5_YEAR_AGO: Record<string, number> = {
  "Very High-Very Low": 1,
  "Very High-Low": 2,
  "Very High-Medium": 4,
  "Very High-High": 5,
  "Very High-Very High": 4,
  "High-Very Low": 2,
  "High-Low": 3,
  "High-Medium": 7,
  "High-High": 8,
  "High-Very High": 6,
  "Medium-Very Low": 2,
  "Medium-Low": 3,
  "Medium-Medium": 10,
  "Medium-High": 6,
  "Medium-Very High": 4,
  "Low-Very Low": 4,
  "Low-Low": 5,
  "Low-Medium": 3,
  "Low-High": 2,
  "Low-Very High": 1,
  "Very Low-Very Low": 6,
  "Very Low-Low": 3,
  "Very Low-Medium": 2,
  "Very Low-High": 1,
  "Very Low-Very High": 0,
};

// ============================================================================
// Utility Functions
// ============================================================================

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function levelNum5(l: RiskLevel5): number {
  const map: Record<RiskLevel5, number> = {
    "Very Low": 1,
    "Low": 2,
    "Medium": 3,
    "High": 4,
    "Very High": 5,
  };
  return map[l];
}

function severityScore5(l: RiskLevel5, i: RiskLevel5): number {
  return levelNum5(l) * levelNum5(i); // 1..25
}

// Extended stoplight palette for 5x5 (25 severity levels)
function stoplightColor5(sev: number): string {
  const s = clamp(sev, 1, 25);
  // Green zone: 1-4
  if (s <= 2) return "#E8FFF0";
  if (s <= 4) return "#C9F7D8";
  // Yellow/Amber zone: 5-10
  if (s <= 6) return "#FFF7C2";
  if (s <= 8) return "#FFE37A";
  if (s <= 10) return "#FFC247";
  // Orange zone: 11-15
  if (s <= 12) return "#FFAA5C";
  if (s <= 15) return "#FF8E5C";
  // Red zone: 16-25
  if (s <= 18) return "#FFD5D5";
  if (s <= 20) return "#FF8E8E";
  if (s <= 22) return "#EF4444";
  return "#B81414";
}

function textColorFor5(sev: number): string {
  return sev >= 20 ? "#FFFFFF" : "#1F2937";
}

function deltaPillStyle(delta: number) {
  if (delta === 0)
    return { bg: "#E9EEF5", fg: "#3A4656" };
  if (delta > 0)
    return { bg: "#D91C1C", fg: "#FFFFFF" };
  return { bg: "#15803D", fg: "#FFFFFF" };
}

// ============================================================================
// 5x5 Heatmap Component
// ============================================================================

function HeatMap5x5({
  data,
  compareData,
  showComparison = false,
}: {
  data: Record<string, number>;
  compareData?: Record<string, number>;
  showComparison?: boolean;
}) {
  const likelihoodLevels: RiskLevel5[] = ["Very High", "High", "Medium", "Low", "Very Low"];
  const impactLevels: RiskLevel5[] = ["Very Low", "Low", "Medium", "High", "Very High"];

  const [hoverKey, setHoverKey] = useState<string | null>(null);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative" }}>
        {/* Y-axis label */}
        <div
          style={{
            position: "absolute",
            left: -20,
            top: "40%",
            transform: "rotate(-90deg) translateX(-50%)",
            fontSize: 12,
            fontWeight: 700,
            color: "#1F2937",
          }}
        >
          Likelihood
        </div>

        {/* Grid */}
        <div
          style={{
            marginLeft: 40,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 6,
          }}
        >
          {likelihoodLevels.map((l) =>
            impactLevels.map((i) => {
              const k = `${l}-${i}`;
              const count = data[k] ?? 0;
              const oldCount = compareData?.[k] ?? count;
              const delta = showComparison ? count - oldCount : 0;

              const sev = severityScore5(l, i);
              const bg = stoplightColor5(sev);
              const fg = textColorFor5(sev);
              const pill = deltaPillStyle(delta);
              const isHovered = hoverKey === k;

              return (
                <button
                  key={k}
                  type="button"
                  onMouseEnter={() => setHoverKey(k)}
                  onMouseLeave={() => setHoverKey(null)}
                  style={{
                    height: 64,
                    borderRadius: 8,
                    border: "1px solid rgba(15, 23, 42, 0.10)",
                    background: `linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.10) 34%, rgba(255,255,255,0) 100%), ${bg}`,
                    color: fg,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: isHovered
                      ? "0 12px 32px rgba(15, 23, 42, 0.18)"
                      : "0 4px 12px rgba(15, 23, 42, 0.08)",
                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                    transition: "all 140ms ease",
                    opacity: count === 0 ? 0.4 : 1,
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 900 }}>{count}</div>
                  {showComparison && delta !== 0 && (
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: 999,
                        background: pill.bg,
                        color: pill.fg,
                      }}
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* X-axis labels */}
        <div
          style={{
            marginLeft: 40,
            marginTop: 8,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 6,
            fontSize: 10,
            fontWeight: 600,
            color: "#6B7280",
          }}
        >
          {impactLevels.map((l) => (
            <div key={l} style={{ textAlign: "center" }}>{l}</div>
          ))}
        </div>

        {/* X-axis title */}
        <div
          style={{
            marginLeft: 40,
            marginTop: 6,
            textAlign: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#1F2937",
          }}
        >
          Impact →
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Comparison View Component (Today vs 1 Year Ago)
// ============================================================================

function ComparisonView() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Risk Profile: Today vs 1 Year Ago</h3>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          Side-by-side comparison showing how your risk landscape has shifted over the past year.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
            Today
            <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, color: "#6B7280" }}>
              94 total risks
            </span>
          </div>
          <HeatMap5x5 data={HEATMAP_5X5_CURRENT} />
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
            1 Year Ago
            <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, color: "#6B7280" }}>
              99 total risks
            </span>
          </div>
          <HeatMap5x5 data={HEATMAP_5X5_YEAR_AGO} />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
          Change Summary
        </div>
        <HeatMap5x5
          data={HEATMAP_5X5_CURRENT}
          compareData={HEATMAP_5X5_YEAR_AGO}
          showComparison
        />
      </div>
    </div>
  );
}

// ============================================================================
// Gaussian Distribution View
// ============================================================================

function GaussianView() {
  // Extreme bell curve - very dramatic difference between tails and peak
  // Counts per 5-point bin from 0-100 (21 bins total)
  const binCounts = [
    0, 1, 1, 2, 4,       // 0-24: tiny tail
    8, 15, 28, 42, 58,   // 25-49: steep rise
    72,                   // 50-54: tall peak
    55, 38, 24, 12, 6,   // 55-79: steep fall
    3, 2, 1, 0, 0        // 80-100: tiny tail
  ];

  const bins = binCounts.map((count, idx) => {
    const start = idx * 5;
    const end = start + 4;
    return {
      range: `${start}`,
      fullRange: `${start}-${end}`,
      count,
      start,
      end,
    };
  });

  const totalRisks = bins.reduce((sum, b) => sum + b.count, 0);
  const maxCount = Math.max(...bins.map((b) => b.count));

  // Calculate zone totals
  const lowCount = bins.filter(b => b.start < 30).reduce((sum, b) => sum + b.count, 0);
  const medCount = bins.filter(b => b.start >= 30 && b.start < 70).reduce((sum, b) => sum + b.count, 0);
  const highCount = bins.filter(b => b.start >= 70).reduce((sum, b) => sum + b.count, 0);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Gaussian Risk Distribution</h3>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          Risk scores distributed along a normal curve. Most risks cluster around medium severity (50-60).
        </p>
      </div>

      {/* Bell curve visualization - taller for more drama */}
      <div style={{ position: "relative", height: 340, marginBottom: 16 }}>
        {/* Y-axis */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 50, width: 40, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", paddingRight: 8 }}>
          <span style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>{maxCount}</span>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>{Math.round(maxCount * 0.75)}</span>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>{Math.round(maxCount * 0.5)}</span>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>{Math.round(maxCount * 0.25)}</span>
          <span style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>0</span>
        </div>

        {/* Chart area */}
        <div
          style={{
            marginLeft: 48,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            height: "calc(100% - 50px)",
            gap: 4,
            paddingRight: 12,
            borderBottom: "2px solid #E5E7EB",
            borderLeft: "2px solid #E5E7EB",
          }}
        >
          {bins.map((bin, idx) => {
            // Linear scale - the data itself has the dramatic differences
            const heightPct = maxCount > 0 ? (bin.count / maxCount) * 100 : 0;
            
            // Color zones
            const isLow = bin.start < 30;
            const isMed = bin.start >= 30 && bin.start < 70;
            const bg = isLow ? "#22C55E" : isMed ? "#F59E0B" : "#EF4444";
            const bgLight = isLow ? "#4ADE80" : isMed ? "#FBBF24" : "#F87171";

            return (
              <div
                key={bin.range}
                style={{
                  flex: 1,
                  maxWidth: 32,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  height: "100%",
                  justifyContent: "flex-end",
                }}
              >
                {bin.count > 0 && (
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#374151" }}>
                    {bin.count}
                  </div>
                )}
                <div
                  style={{
                    width: "100%",
                    height: `${heightPct}%`,
                    minHeight: bin.count > 0 ? 4 : 0,
                    background: `linear-gradient(to top, ${bg}, ${bgLight})`,
                    borderRadius: "3px 3px 0 0",
                    boxShadow: bin.count > 10 ? `0 -4px 16px ${bg}50` : "none",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div
          style={{
            marginLeft: 48,
            display: "flex",
            justifyContent: "center",
            paddingTop: 6,
            gap: 4,
          }}
        >
          {bins.map((bin, idx) => (
            <div 
              key={bin.range} 
              style={{ 
                flex: 1, 
                maxWidth: 32,
                textAlign: "center", 
                fontSize: 9, 
                color: "#6B7280",
                fontWeight: idx % 4 === 0 ? 700 : 400,
              }}
            >
              {idx % 4 === 0 ? bin.range : ""}
            </div>
          ))}
        </div>

        {/* X-axis title */}
        <div style={{ marginLeft: 48, textAlign: "center", fontSize: 12, fontWeight: 700, color: "#374151", marginTop: 8 }}>
          Risk Score →
        </div>
      </div>

      {/* Zone legend */}
      <div style={{ marginLeft: 48, display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "#22C55E" }} />
          <span style={{ fontSize: 12, color: "#374151" }}>Low Risk (0-29)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "#F59E0B" }} />
          <span style={{ fontSize: 12, color: "#374151" }}>Medium Risk (30-69)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "#EF4444" }} />
          <span style={{ fontSize: 12, color: "#374151" }}>High Risk (70-100)</span>
        </div>
      </div>

      {/* Stats summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        {[
          { label: "Total Risks", value: totalRisks, color: "#111827", bg: "#F9FAFB", border: "#E5E7EB" },
          { label: "Low (0-29)", value: lowCount, color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0" },
          { label: "Medium (30-69)", value: medCount, color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
          { label: "High (70-100)", value: highCount, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: 14,
              borderRadius: 12,
              background: stat.bg,
              border: `1px solid ${stat.border}`,
            }}
          >
            <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, marginTop: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
              {Math.round((stat.value / totalRisks) * 100)}% of total
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Cost/Money vs Notion View
// ============================================================================

function CostNotionView() {
  // Generate risks with cost and notion (qualitative size)
  const risks = useMemo(() => {
    const items: {
      id: string;
      name: string;
      cost: number; // in thousands
      notion: "Small" | "Medium" | "Large" | "Very Large";
      type: string;
    }[] = [
      { id: "R-1", name: "Vendor access control", cost: 250, notion: "Large", type: "Cyber" },
      { id: "R-2", name: "Regulatory change tracking", cost: 180, notion: "Medium", type: "Compliance" },
      { id: "R-3", name: "Incident response readiness", cost: 450, notion: "Very Large", type: "Cyber" },
      { id: "R-4", name: "Policy acknowledgement drift", cost: 45, notion: "Small", type: "Governance" },
      { id: "R-5", name: "Audit evidence delays", cost: 120, notion: "Medium", type: "Audit" },
      { id: "R-6", name: "BCP coverage gaps", cost: 380, notion: "Large", type: "Resilience" },
      { id: "R-7", name: "Third-party reassessment", cost: 290, notion: "Large", type: "Third-party" },
      { id: "R-8", name: "Data retention compliance", cost: 85, notion: "Small", type: "Compliance" },
      { id: "R-9", name: "Access provisioning delays", cost: 65, notion: "Small", type: "Operational" },
      { id: "R-10", name: "Training completion variance", cost: 35, notion: "Small", type: "Governance" },
      { id: "R-11", name: "SOX control mapping drift", cost: 520, notion: "Very Large", type: "Compliance" },
      { id: "R-12", name: "Unpatched dependency exposure", cost: 680, notion: "Very Large", type: "Cyber" },
      { id: "R-13", name: "Evidence collection delays", cost: 95, notion: "Medium", type: "Audit" },
      { id: "R-14", name: "Region-specific process variance", cost: 150, notion: "Medium", type: "Operational" },
      { id: "R-15", name: "Documentation hygiene", cost: 25, notion: "Small", type: "Governance" },
    ];
    return items;
  }, []);

  const notionLevels: ("Small" | "Medium" | "Large" | "Very Large")[] = ["Very Large", "Large", "Medium", "Small"];
  const costBuckets = [
    { label: "$0-100K", min: 0, max: 100 },
    { label: "$100K-250K", min: 100, max: 250 },
    { label: "$250K-500K", min: 250, max: 500 },
    { label: "$500K+", min: 500, max: Infinity },
  ];

  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Cost vs Notion (Qualitative Size)</h3>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          X-axis shows estimated remediation cost; Y-axis shows qualitative impact size.
        </p>
      </div>

      <div style={{ position: "relative" }}>
        {/* Y-axis label */}
        <div
          style={{
            position: "absolute",
            left: -15,
            top: "40%",
            transform: "rotate(-90deg) translateX(-50%)",
            fontSize: 12,
            fontWeight: 700,
            color: "#1F2937",
          }}
        >
          Notion (Size)
        </div>

        {/* Grid */}
        <div
          style={{
            marginLeft: 80,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          {notionLevels.map((notion) =>
            costBuckets.map((bucket) => {
              const k = `${notion}-${bucket.label}`;
              const cellRisks = risks.filter(
                (r) => r.notion === notion && r.cost >= bucket.min && r.cost < bucket.max
              );
              const count = cellRisks.length;
              const isHovered = hoveredCell === k;

              // Color based on position (top-right = worse)
              const notionScore = notionLevels.indexOf(notion); // 0 = Very Large (worst)
              const costScore = costBuckets.indexOf(bucket); // 3 = $500K+ (worst)
              const severity = (4 - notionScore) + costScore; // 1-7 range
              const bg =
                severity <= 2 ? "#E8FFF0" :
                severity <= 4 ? "#FFF7C2" :
                severity <= 5 ? "#FFD5D5" :
                "#FF8E8E";

              return (
                <div
                  key={k}
                  onMouseEnter={() => setHoveredCell(k)}
                  onMouseLeave={() => setHoveredCell(null)}
                  style={{
                    height: 72,
                    borderRadius: 10,
                    border: "1px solid rgba(15, 23, 42, 0.12)",
                    background: `linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%), ${bg}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: isHovered
                      ? "0 12px 32px rgba(15, 23, 42, 0.16)"
                      : "0 4px 12px rgba(15, 23, 42, 0.06)",
                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                    transition: "all 140ms ease",
                    opacity: count === 0 ? 0.3 : 1,
                    position: "relative",
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#1F2937" }}>{count}</div>
                  {isHovered && count > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -40,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#111827",
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: 6,
                        fontSize: 11,
                        whiteSpace: "nowrap",
                        zIndex: 10,
                      }}
                    >
                      {cellRisks.map((r) => r.name).join(", ")}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Y-axis labels (inline) */}
          {notionLevels.map((notion) => (
            <React.Fragment key={`label-${notion}`}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  width: 75,
                  textAlign: "right",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6B7280",
                  marginTop: notionLevels.indexOf(notion) * 80 + 28,
                }}
              >
                {notion}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* X-axis labels */}
        <div
          style={{
            marginLeft: 80,
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            fontSize: 11,
            fontWeight: 600,
            color: "#6B7280",
          }}
        >
          {costBuckets.map((b) => (
            <div key={b.label} style={{ textAlign: "center" }}>{b.label}</div>
          ))}
        </div>

        {/* X-axis title */}
        <div
          style={{
            marginLeft: 80,
            marginTop: 8,
            textAlign: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#1F2937",
          }}
        >
          Estimated Remediation Cost →
        </div>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginTop: 24,
        }}
      >
        <div style={{ padding: 12, borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <div style={{ fontSize: 11, color: "#991B1B", fontWeight: 600 }}>High Cost + Large Notion</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#DC2626", marginTop: 4 }}>
            {risks.filter((r) => r.cost >= 250 && (r.notion === "Large" || r.notion === "Very Large")).length}
          </div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: "#FEF3C7", border: "1px solid #FDE68A" }}>
          <div style={{ fontSize: 11, color: "#92400E", fontWeight: 600 }}>Medium Priority</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#D97706", marginTop: 4 }}>
            {risks.filter((r) => r.cost >= 100 && r.cost < 250).length}
          </div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
          <div style={{ fontSize: 11, color: "#065F46", fontWeight: 600 }}>Low Cost + Small Notion</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669", marginTop: 4 }}>
            {risks.filter((r) => r.cost < 100 && r.notion === "Small").length}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function RiskHeatmapExperiments() {
  const [viewMode, setViewMode] = useState<ViewMode>("5x5");

  const views: { id: ViewMode; label: string; description: string }[] = [
    { id: "5x5", label: "5×5 Heatmap", description: "Extended 5-level scale" },
    { id: "compare", label: "Year Comparison", description: "Today vs 1 year ago" },
    { id: "gaussian", label: "Gaussian", description: "Bell curve distribution" },
    { id: "cost", label: "Cost × Notion", description: "Financial impact view" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">
            Risk Heatmap Experiments
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Alternative visualizations for risk data: 5×5 grids, year-over-year comparison,
            gaussian distribution, and cost-based views.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/now/risk-heatmap/risk-manager"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/40 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/40"
            >
              <span aria-hidden>←</span>
              Back to Risk Manager
            </Link>
          </div>
        </div>
      </div>

      {/* View mode tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setViewMode(v.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              viewMode === v.id
                ? "bg-white text-neutral-900"
                : "border border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        {viewMode === "5x5" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>5×5 Risk Heatmap</h3>
              <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                Extended scale with 5 likelihood and 5 impact levels for more granular risk positioning.
              </p>
            </div>
            <HeatMap5x5 data={HEATMAP_5X5_CURRENT} />
          </div>
        )}

        {viewMode === "compare" && <ComparisonView />}
        {viewMode === "gaussian" && <GaussianView />}
        {viewMode === "cost" && <CostNotionView />}
      </div>
    </section>
  );
}
