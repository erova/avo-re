"use client";

import React, { useMemo, useState } from "react";
import type { RiskRow, RiskLevel } from "@/app/now/risk-heatmap-insights/data/riskSeed";

type Dimension = "Business Unit" | "Region" | "Risk Type";

function parseOrgParts(orgPath: string) {
  const parts = orgPath.split("/").map((s) => s.trim());
  return {
    company: parts[0] ?? "Unknown",
    bu: parts[1] ?? "Unknown BU",
    sub: parts.slice(2).join(" / ") || "Unknown",
  };
}

function inferRegion(r: RiskRow): string {
  const p = (r.orgPath ?? "").toLowerCase();
  if (p.includes("eu") || p.includes("emea")) return "EMEA";
  if (p.includes("apac") || p.includes("asia") || p.includes("pac")) return "APAC";
  if (p.includes("latam") || p.includes("brazil") || p.includes("mex")) return "LATAM";
  return "North America";
}

// Canonical fictional company BUs — always render these
const CANONICAL_BUS = [
  "Consumer Banking",
  "Commercial Banking",
  "Wealth Management",
  "Risk & Compliance",
  "Technology & Operations",
] as const;

const BU_RENAME_MAP: Record<string, string> = {
  Platform: "Technology & Operations",
  "Core Platform": "Technology & Operations",
  Operations: "Technology & Operations",
  Governance: "Risk & Compliance",
  Compliance: "Risk & Compliance",
  "Audit & Risk": "Risk & Compliance",

  SRE: "Technology & Operations",
  Engineering: "Technology & Operations",
  "Vendor Mgmt": "Commercial Banking",
  "Vendor Management": "Commercial Banking",
  "EU Ops": "Commercial Banking",
  Boards: "Wealth Management",
  Entities: "Wealth Management",

  "Consumer Banking": "Consumer Banking",
  "Commercial Banking": "Commercial Banking",
  "Wealth Management": "Wealth Management",
  "Risk & Compliance": "Risk & Compliance",
  "Technology & Operations": "Technology & Operations",
};

function deriveBusinessUnit(r: RiskRow): string {
  const parts = parseOrgParts(r.orgPath ?? "");
  const buRaw = parts.bu;
  const subRaw = parts.sub;

  if (BU_RENAME_MAP[buRaw]) return BU_RENAME_MAP[buRaw];
  if (BU_RENAME_MAP[subRaw]) return BU_RENAME_MAP[subRaw];

  const sub = subRaw.toLowerCase();
  if (sub.includes("board") || sub.includes("entity")) return "Wealth Management";
  if (sub.includes("vendor") || sub.includes("third") || sub.includes("subprocessor"))
    return "Commercial Banking";
  if (
    sub.includes("audit") ||
    sub.includes("sox") ||
    sub.includes("compliance") ||
    sub.includes("policy")
  )
    return "Risk & Compliance";
  if (
    sub.includes("sre") ||
    sub.includes("engineering") ||
    sub.includes("platform") ||
    sub.includes("dependency")
  )
    return "Technology & Operations";

  const bu = buRaw.toLowerCase();
  if (bu.includes("govern") || bu.includes("compliance") || bu.includes("audit"))
    return "Risk & Compliance";
  if (bu.includes("platform") || bu.includes("ops") || bu.includes("operation"))
    return "Technology & Operations";

  return "Consumer Banking";
}

function getBucketValue(r: RiskRow, dimension: Dimension): string {
  if (dimension === "Business Unit") return deriveBusinessUnit(r);
  if (dimension === "Risk Type") return r.riskType ?? "Unknown";
  return inferRegion(r);
}

type StackCounts = Record<RiskLevel, number>;
type Bucket = {
  key: string;
  total: number;
  stacks: StackCounts;

  // “ghost line” baseline
  prevTotal: number;
  delta: number;
};

// ---- visuals (real colors; chart is the star) ----
const LEVEL_ORDER: RiskLevel[] = ["Low", "Medium", "High"];

// Saturated (for small legends / emphasis)
const LEVEL_COLOR: Record<RiskLevel, string> = {
  Low: "#16A34A", // green-600
  Medium: "#D97706", // amber-600
  High: "#DC2626", // red-600
};

// More saturated fills so the chart reads without squinting
const LEVEL_FILL: Record<RiskLevel, string> = {
  Low: "rgba(22,163,74,0.22)",
  Medium: "rgba(217,119,6,0.22)",
  High: "rgba(220,38,38,0.22)",
};

const LEVEL_FILL_ACTIVE: Record<RiskLevel, string> = {
  Low: "rgba(22,163,74,0.32)",
  Medium: "rgba(217,119,6,0.32)",
  High: "rgba(220,38,38,0.32)",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// deterministic “previous snapshot” generator (stubbed, but stable)
function stableHash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
function pseudoPrevFromCurrent(key: string, current: number) {
  // yields a baseline within ~70–95% of current, sometimes higher (so you see both directions)
  const h = stableHash(key);
  const swing = (h % 31) - 15; // -15..+15
  const pct = 0.82 + swing / 200; // ~0.745..0.895
  const prev = Math.round(current * pct);
  return clamp(prev, 0, Math.max(0, current + 8));
}

export default function PatternViz({ rows }: { rows: RiskRow[] }) {
  const [dimension, setDimension] = useState<Dimension>("Business Unit");
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [pinnedKey, setPinnedKey] = useState<string | null>(null);

  const buckets = useMemo(() => {
    // initialize canonical BU buckets so they always show
    const init = new Map<string, Bucket>();

    const seedKeys: string[] =
      dimension === "Business Unit"
        ? [...CANONICAL_BUS]
        : [];

    for (const k of seedKeys) {
      init.set(k, {
        key: k,
        total: 0,
        stacks: { Low: 0, Medium: 0, High: 0 },
        prevTotal: 0,
        delta: 0,
      });
    }

    for (const r of rows) {
      const k = getBucketValue(r, dimension);
      if (!init.has(k)) {
        init.set(k, {
          key: k,
          total: 0,
          stacks: { Low: 0, Medium: 0, High: 0 },
          prevTotal: 0,
          delta: 0,
        });
      }
      const b = init.get(k)!;
      b.total += 1;

      // stack by residual (feels closer to “what matters”)
      const lvl: RiskLevel = (r.residual ?? "Medium") as RiskLevel;
      b.stacks[lvl] += 1;
    }

    // compute ghost baselines + delta
    for (const b of init.values()) {
      const prev = pseudoPrevFromCurrent(`${dimension}:${b.key}`, b.total);
      b.prevTotal = prev;
      b.delta = b.total - prev;
    }

    const out = Array.from(init.values());

    // order: canonical BUs first (if BU view), then by delta/total
    if (dimension === "Business Unit") {
      const canonicalIndex = new Map<string, number>(
        CANONICAL_BUS.map((k, i) => [k, i])
      );
      out.sort((a, b) => {
        const ai = canonicalIndex.has(a.key) ? canonicalIndex.get(a.key)! : 999;
        const bi = canonicalIndex.has(b.key) ? canonicalIndex.get(b.key)! : 999;
        if (ai !== bi) return ai - bi;
        // tie-break
        return b.total - a.total;
      });
    } else {
      out.sort((a, b) => (b.delta !== a.delta ? b.delta - a.delta : b.total - a.total));
    }

    return out;
  }, [rows, dimension]);

  const activeBucket = useMemo(() => {
    if (!buckets.length) return null;

    const preferredKey = pinnedKey ?? hoverKey;
    if (preferredKey) {
      const found = buckets.find((b) => b.key === preferredKey);
      if (found) return found;
    }

    // default to "most changed up" (what most likely triggered attention)
    const bestUp = [...buckets].sort((a, b) => {
      const ap = Math.max(0, a.delta);
      const bp = Math.max(0, b.delta);
      if (bp !== ap) return bp - ap;
      if (b.total !== a.total) return b.total - a.total;
      return a.key.localeCompare(b.key);
    })[0];

    return bestUp ?? buckets[0];
  }, [buckets, hoverKey, pinnedKey]);

  const maxTotal = useMemo(() => {
    let m = 1;
    for (const b of buckets) {
      m = Math.max(m, b.total, b.prevTotal);
    }
    return m;
  }, [buckets]);

  // “Why now” summary (stubbed but useful)
  const trigger = useMemo(() => {
    const totalDelta = buckets.reduce((acc, b) => acc + Math.max(0, b.delta), 0);
    const downDelta = buckets.reduce((acc, b) => acc + Math.max(0, -b.delta), 0);
    const movedBuckets = buckets.filter((b) => b.delta !== 0).length;

    const confidence =
      movedBuckets >= 4 || totalDelta >= 6
        ? "High"
        : movedBuckets >= 2 || totalDelta >= 3
        ? "Medium"
        : "Low";

    return {
      movedBuckets,
      totalDelta,
      downDelta,
      confidence,
      line: `Triggered by: Overnight refresh · Δ buckets ${movedBuckets} · Up ${totalDelta} · Down ${downDelta} · Confidence ${confidence}`,
    };
  }, [buckets]);

  const controlsBtn = (label: Dimension) => {
    const active = dimension === label;
    return (
      <button
        type="button"
        onClick={() => setDimension(label)}
        style={{
          borderRadius: 999,
          padding: "8px 12px",
          fontSize: 13,
          fontWeight: 700,
          border: active ? "1px solid #111827" : "1px solid rgba(15,23,42,0.18)",
          background: active ? "#111827" : "#FFFFFF",
          color: active ? "#FFFFFF" : "#374151",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div>
      {/* header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 auto", minWidth: 260 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>
            Signals → Charts (with baseline)
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: "#6B7280" }}>
            {trigger.line}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {controlsBtn("Business Unit")}
          {controlsBtn("Region")}
          {controlsBtn("Risk Type")}
        </div>
      </div>

      {/* viz */}
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
        <div
          style={{
            border: "1px solid rgba(15,23,42,0.12)",
            borderRadius: 16,
            background: "#FFFFFF",
            padding: 14,
          }}
        >
          {/* legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Residual:</div>
            {LEVEL_ORDER.map((lvl) => (
              <div key={lvl} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span
                  aria-hidden
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: LEVEL_COLOR[lvl],
                    boxShadow: `0 0 0 2px rgba(255,255,255,0.9)`,
                    display: "inline-block",
                    border: "1px solid rgba(15,23,42,0.10)",
                  }}
                />
                <span style={{ fontSize: 12, color: "#374151", fontWeight: 700 }}>{lvl}</span>
              </div>
            ))}

            <span style={{ flex: 1 }} />

            <div style={{ fontSize: 12, color: "#6B7280" }}>
              <span style={{ fontWeight: 800, color: "#374151" }}>Ghost</span>{" "}
              = previous snapshot
            </div>
          </div>

          {/* bars (horizontal) */}
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 10,
            }}
          >
            {buckets.map((b) => {
              const active = (pinnedKey ?? hoverKey) === b.key;

              const currentW = Math.round((b.total / maxTotal) * 100);
              const prevW = Math.round((b.prevTotal / maxTotal) * 100);

              const stackPct: Record<RiskLevel, number> = {
                Low: b.total ? (b.stacks.Low / b.total) * 100 : 0,
                Medium: b.total ? (b.stacks.Medium / b.total) * 100 : 0,
                High: b.total ? (b.stacks.High / b.total) * 100 : 0,
              };

              const deltaTone =
                b.delta > 0 ? "#DC2626" : b.delta < 0 ? "#16A34A" : "#6B7280";

              return (
                <div
                  key={b.key}
                  onMouseEnter={() => setHoverKey(b.key)}
                  onMouseLeave={() => setHoverKey(null)}
                  onClick={() =>
                    setPinnedKey((prev) => (prev === b.key ? null : b.key))
                  }
                  style={{
                    borderRadius: 14,
                    border:
                      active && b.delta !== 0
                        ? `1px solid ${deltaTone}`
                        : active
                        ? "1px solid rgba(15,23,42,0.30)"
                        : "1px solid rgba(15,23,42,0.12)",
                    padding: 12,
                    background:
                      active && b.delta !== 0
                        ? "rgba(124,58,237,0.04)"
                        : active
                        ? "rgba(15,23,42,0.02)"
                        : "#FFFFFF",
                    boxShadow:
                      pinnedKey === b.key
                        ? "0 0 0 2px rgba(124,58,237,0.45)"
                        : active
                        ? "0 12px 28px rgba(15,23,42,0.12)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "220px 1fr 90px",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    {/* label */}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 900,
                          color: "#111827",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={b.key}
                      >
                        {b.key}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12, color: "#6B7280", fontWeight: 700 }}>
                        Prev {b.prevTotal} · Now {b.total}
                      </div>
                    </div>

                    {/* bar */}
                    <div
                      style={{
                        position: "relative",
                        height: 28,
                        borderRadius: 12,
                        border: "1px solid rgba(15,23,42,0.12)",
                        background: "#FFFFFF",
                        overflow: "hidden",
                      }}
                      aria-label={`Baseline ${b.prevTotal}, current ${b.total}`}
                    >
                      {/* subtle grid */}
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage:
                            "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px)",
                          backgroundSize: "44px 100%",
                          opacity: 0.55,
                          pointerEvents: "none",
                        }}
                      />

                      {/* ghost baseline */}
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          left: 8,
                          top: 6,
                          bottom: 6,
                          width: `calc(${prevW}% - 16px)`,
                          borderRadius: 10,
                          border: "2px dashed rgba(55,65,81,0.45)",
                          background: "transparent",
                          pointerEvents: "none",
                        }}
                      />

                      {/* current stacked bar */}
                      <div
                        style={{
                          position: "absolute",
                          left: 8,
                          top: 6,
                          bottom: 6,
                          width: `calc(${currentW}% - 16px)`,
                          borderRadius: 10,
                          overflow: "hidden",
                          border: active
                            ? "1px solid rgba(15,23,42,0.22)"
                            : "1px solid rgba(15,23,42,0.16)",
                          display: "flex",
                          boxShadow: active
                            ? "0 12px 28px rgba(15,23,42,0.12)"
                            : "0 8px 18px rgba(15,23,42,0.07)",
                          background: "rgba(15,23,42,0.02)",
                        }}
                      >
                        <div
                          style={{
                            width: `${stackPct.Low}%`,
                            background: active ? LEVEL_FILL_ACTIVE.Low : LEVEL_FILL.Low,
                            borderRight:
                              stackPct.Low > 0 ? `1px solid ${LEVEL_COLOR.Low}` : undefined,
                          }}
                        />
                        <div
                          style={{
                            width: `${stackPct.Medium}%`,
                            background: active ? LEVEL_FILL_ACTIVE.Medium : LEVEL_FILL.Medium,
                            borderRight:
                              stackPct.Medium > 0
                                ? `1px solid ${LEVEL_COLOR.Medium}`
                                : undefined,
                          }}
                        />
                        <div
                          style={{
                            width: `${stackPct.High}%`,
                            background: active ? LEVEL_FILL_ACTIVE.High : LEVEL_FILL.High,
                            borderRight:
                              stackPct.High > 0 ? `1px solid ${LEVEL_COLOR.High}` : undefined,
                          }}
                        />
                      </div>
                    </div>

                    {/* delta */}
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 900,
                          color: deltaTone,
                        }}
                        title={`Previous: ${b.prevTotal} · Current: ${b.total}`}
                      >
                        {b.delta === 0
                          ? "0"
                          : b.delta > 0
                          ? `+${b.delta}`
                          : `${b.delta}`}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 11, color: "#6B7280", fontWeight: 800 }}>
                        Δ vs baseline
                      </div>
                      {b.delta !== 0 && (
                        <div
                          style={{
                            marginTop: 2,
                            fontSize: 10,
                            fontWeight: 800,
                            color: "#6B7280",
                          }}
                        >
                          Overnight
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* note */}
          <div style={{ marginTop: 12, fontSize: 12, color: "#6B7280" }}>
            Hover a row: dashed outline is yesterday’s snapshot; colored fill is today.
          </div>
          {activeBucket ? (
  <div
    style={{
      marginTop: 14,
      borderTop: "1px solid rgba(15,23,42,0.10)",
      paddingTop: 14,
    }}
  >
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(124,58,237,0.18)",
        background:
          "linear-gradient(180deg, rgba(124,58,237,0.06), rgba(236,72,153,0.03))",
        padding: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 320px" }}>
          <div
            aria-hidden
            style={{
              width: 22,
              height: 22,
              borderRadius: 8,
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(15,23,42,0.10)",
              background: "rgba(255,255,255,0.75)",
              boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
            }}
          >
            <span style={{ color: "#7C3AED" }}>✦</span>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>
              Platform signal: Why you’re seeing this now
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: "#374151", maxWidth: 820 }}>
              <strong>{activeBucket.key}{pinnedKey ? " (pinned)" : ""}</strong> changed{" "}
              {activeBucket.delta === 0
                ? "0"
                : activeBucket.delta > 0
                ? `+${activeBucket.delta}`
                : `${activeBucket.delta}`}{" "}
              vs baseline after the overnight refresh. Ghost outline = yesterday; fill = today.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#111827",
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid rgba(15,23,42,0.14)",
              background: "rgba(255,255,255,0.70)",
            }}
          >
            Linked to chart
          </span>

          <span
            style={{
              fontSize: 12,
              fontWeight: 900,
              color: "#111827",
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid rgba(15,23,42,0.14)",
              background: "rgba(255,255,255,0.70)",
            }}
          >
            Confidence: {trigger.confidence}
          </span>

          <span
            style={{
              fontSize: 12,
              fontWeight: 900,
              color: "#111827",
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid rgba(15,23,42,0.14)",
              background: "rgba(255,255,255,0.70)",
            }}
          >
            Scope: Current
          </span>
        </div>
      </div>

      {/* Recommended actions */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.06, color: "#6B7280" }}>
          RECOMMENDED ACTIONS
        </div>

        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {[
            { t: "Triage & slice", d: `Open a pre-filtered view by ${dimension} to isolate drivers.` },
            { t: "Draft stakeholder update", d: "Generate a short message for Risk Leadership + Audit prep." },
            { t: "Tune early warning", d: "Suggest a watch rule to surface this pattern sooner." },
            { t: "Remix for reporting", d: "Turn this into a reusable snippet for weekly reporting." },
          ].map((a) => (
            <button
              key={a.t}
              type="button"
              style={{
                textAlign: "left",
                borderRadius: 14,
                border: "1px solid rgba(15,23,42,0.12)",
                background: "rgba(255,255,255,0.82)",
                padding: 12,
                cursor: "pointer",
                boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>{a.t}</div>
                <div style={{ marginTop: 4, fontSize: 12, color: "#374151", fontWeight: 700 }}>{a.d}</div>
              </div>
              <span aria-hidden style={{ color: "#111827", fontWeight: 900, fontSize: 18 }}>→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div style={{ marginTop: 12, borderTop: "1px solid rgba(15,23,42,0.10)", paddingTop: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.06, color: "#6B7280" }}>
          PROMPT DILIGENT AI
        </div>

        <div style={{ marginTop: 10 }}>
          <textarea
            defaultValue={`Review the pattern for ${activeBucket.key} and propose: (1) what stands out, (2) root cause, (3) risk if unresolved, (4) next best actions, (5) who should be notified.`}
            style={{
              width: "100%",
              minHeight: 92,
              resize: "vertical",
              borderRadius: 14,
              border: "1px solid rgba(15,23,42,0.14)",
              padding: 12,
              fontSize: 13,
              lineHeight: 1.35,
              color: "#111827",
              background: "rgba(255,255,255,0.90)",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: "1px solid rgba(124,58,237,0.35)",
                background:
                  "linear-gradient(180deg, rgba(124,58,237,0.10), rgba(236,72,153,0.06))",
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 900,
                color: "#6D28D9",
                cursor: "pointer",
              }}
            >
              <span aria-hidden style={{ color: "#7C3AED" }}>✦</span>
              Ask Diligent AI to draft next steps
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
) : null}
        </div>
      </div>
    </div>
  );
}