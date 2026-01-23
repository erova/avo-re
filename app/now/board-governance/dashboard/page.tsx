"use client";

import React, { useState } from "react";

// ============================================================================
// Types
// ============================================================================

type TimeRange = "quarter" | "year" | "all";

// ============================================================================
// Sample Data
// ============================================================================

const TOPIC_TIME_ALLOCATION = [
  { topic: "Strategy", thisQ: 35, lastQ: 32, benchmark: 28, trend: "up" },
  { topic: "Financial", thisQ: 28, lastQ: 30, benchmark: 25, trend: "down" },
  { topic: "Risk & Compliance", thisQ: 18, lastQ: 22, benchmark: 24, trend: "down" },
  { topic: "Cybersecurity", thisQ: 8, lastQ: 12, benchmark: 15, trend: "down" },
  { topic: "Talent & Succession", thisQ: 6, lastQ: 8, benchmark: 12, trend: "down" },
  { topic: "ESG", thisQ: 5, lastQ: 6, benchmark: 8, trend: "down" },
];

const SENTIMENT_SIGNALS = [
  { type: "positive", text: "Best GRR in company history", source: "CEO Update, Q3", date: "Oct 2025" },
  { type: "positive", text: "AI product launch ahead of schedule", source: "CEO Update, Q3", date: "Oct 2025" },
  { type: "caution", text: "New sales 68% to budget - not prominently addressed", source: "Financial Review, Q3", date: "Oct 2025" },
  { type: "caution", text: "Regulatory timeline concerns raised but no follow-up scheduled", source: "Risk Committee, Q2", date: "Jul 2025" },
  { type: "negative", text: "Third consecutive quarter succession planning deferred", source: "Talent Review", date: "Oct 2025" },
];

const ACTION_METRICS = {
  raised: 47,
  closed: 31,
  open: 12,
  overdue: 4,
  avgDaysToClose: 34,
  avgDaysToCloseLastQ: 28,
};

const PROMISES_VS_DELIVERY = [
  { promise: "Vendor concentration mitigation plan", promisedQ: "Q2", status: "overdue", daysLate: 45 },
  { promise: "AI regulatory go/no-go criteria", promisedQ: "Q2", status: "overdue", daysLate: 30 },
  { promise: "Cyber insurance coverage review", promisedQ: "Q3", status: "in-progress", daysLate: 0 },
  { promise: "European expansion risk assessment", promisedQ: "Q3", status: "delivered", daysLate: 0 },
  { promise: "Updated succession plan for C-suite", promisedQ: "Q1", status: "overdue", daysLate: 180 },
];

const PEER_BENCHMARK = [
  { metric: "Risk topic coverage", company: 18, peerAvg: 24, peerTop: 32, status: "below" },
  { metric: "Action completion rate", company: 66, peerAvg: 72, peerTop: 89, status: "below" },
  { metric: "Avg days to close actions", company: 34, peerAvg: 28, peerTop: 18, status: "below" },
  { metric: "Cybersecurity deep-dives/year", company: 2, peerAvg: 4, peerTop: 6, status: "below" },
  { metric: "Board meeting frequency", company: 6, peerAvg: 6, peerTop: 8, status: "on-par" },
];

const DOGS_NOT_BARKING = [
  { 
    topic: "Supply Chain Concentration", 
    lastDiscussed: "Q4 2024", 
    externalSignal: "3 peer companies reported supply chain disruptions in Q3",
    riskLevel: "high"
  },
  { 
    topic: "Interest Rate Hedging Strategy", 
    lastDiscussed: "Q1 2025", 
    externalSignal: "Fed signaling rate changes; peer boards discussing quarterly",
    riskLevel: "medium"
  },
  { 
    topic: "AI Ethics & Bias", 
    lastDiscussed: "Never", 
    externalSignal: "EU AI Act requires documented bias testing; 4 peers added to agenda",
    riskLevel: "high"
  },
  { 
    topic: "Climate Risk Disclosure", 
    lastDiscussed: "Q2 2024", 
    externalSignal: "SEC climate rules effective 2026; peer boards averaging 2 sessions/year",
    riskLevel: "medium"
  },
];

const PEER_EARNINGS_MENTIONS = [
  { company: "Competitor A", topic: "AI Governance", context: "CEO addressed board-level AI oversight committee formation", source: "Q3 Earnings Call", date: "Oct 15, 2025" },
  { company: "Competitor B", topic: "Cybersecurity", context: "Disclosed $2.3M investment in board cyber training program", source: "Press Release", date: "Oct 8, 2025" },
  { company: "Competitor A", topic: "Regulatory Risk", context: "CFO detailed EU AI Act compliance roadmap to analysts", source: "Q3 Earnings Call", date: "Oct 15, 2025" },
  { company: "Competitor C", topic: "Succession Planning", context: "Announced CEO succession timeline and board search committee", source: "8-K Filing", date: "Sep 22, 2025" },
  { company: "Competitor B", topic: "Climate Risk", context: "Board approved science-based emissions targets", source: "Press Release", date: "Sep 15, 2025" },
];

const DIRECTOR_EDUCATION = [
  { name: "Sarah Chen", role: "Audit Committee Chair", creditsCompleted: 18, creditsRequired: 20, topics: ["Cybersecurity", "AI Governance"], status: "on-track" },
  { name: "Michael Torres", role: "Board Chair", creditsCompleted: 20, creditsRequired: 20, topics: ["ESG", "Risk Management"], status: "complete" },
  { name: "Jennifer Walsh", role: "Compensation Chair", creditsCompleted: 8, creditsRequired: 20, topics: ["Executive Comp"], status: "behind" },
  { name: "Robert Kim", role: "Director", creditsCompleted: 4, creditsRequired: 20, topics: [], status: "at-risk" },
  { name: "Patricia Moore", role: "Risk Committee Chair", creditsCompleted: 22, creditsRequired: 20, topics: ["Cyber", "Regulatory", "AI"], status: "complete" },
  { name: "David Thompson", role: "Director", creditsCompleted: 12, creditsRequired: 20, topics: ["Financial Reporting"], status: "on-track" },
];

const GOVERNANCE_MATURITY_TREND = [
  { meeting: "Q4 2024", overall: 62, riskOversight: 58, actionExecution: 65, boardEngagement: 64, peerAlignment: 61 },
  { meeting: "Q1 2025", overall: 65, riskOversight: 62, actionExecution: 68, boardEngagement: 66, peerAlignment: 64 },
  { meeting: "Q2 2025", overall: 71, riskOversight: 68, actionExecution: 72, boardEngagement: 73, peerAlignment: 71 },
  { meeting: "Q3 2025", overall: 68, riskOversight: 64, actionExecution: 66, boardEngagement: 72, peerAlignment: 70 },
];

const COUNTDOWN_ACTIONS = [
  { weeksOut: 4, action: "Distribute board book draft for early review", owner: "Corp Sec", status: "done", dueDate: "Oct 7" },
  { weeksOut: 4, action: "Confirm all committee reports are submitted", owner: "Committee Chairs", status: "done", dueDate: "Oct 7" },
  { weeksOut: 3, action: "Send pre-read materials to directors", owner: "Corp Sec", status: "done", dueDate: "Oct 14" },
  { weeksOut: 3, action: "Schedule CEO prep session for board Q&A", owner: "Chief of Staff", status: "in-progress", dueDate: "Oct 14" },
  { weeksOut: 2, action: "Finalize board book with all appendices", owner: "Corp Sec", status: "upcoming", dueDate: "Oct 21" },
  { weeksOut: 2, action: "Brief CEO on open loops from last meeting", owner: "Corp Sec", status: "upcoming", dueDate: "Oct 21" },
  { weeksOut: 1, action: "Confirm director attendance and logistics", owner: "EA", status: "upcoming", dueDate: "Oct 28" },
  { weeksOut: 1, action: "Prepare real-time action tracking template", owner: "Corp Sec", status: "upcoming", dueDate: "Oct 28" },
];

// ============================================================================
// Components
// ============================================================================

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendLabel,
  color = "#111827" 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  color?: string;
}) {
  return (
    <div style={{ 
      padding: 20, background: "#fff", borderRadius: 12, 
      border: "1px solid #E5E7EB", height: "100%"
    }}>
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#9CA3AF" }}>{subtitle}</div>}
      {trend && trendLabel && (
        <div style={{ 
          marginTop: 8, fontSize: 11, fontWeight: 600,
          color: trend === "up" ? "#059669" : trend === "down" ? "#DC2626" : "#6B7280",
          display: "flex", alignItems: "center", gap: 4
        }}>
          <span>{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
          {trendLabel}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: "#6B7280" }}>{subtitle}</p>}
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function GovernanceDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("quarter");

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0F", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ 
        padding: "16px 0",
        maxWidth: 1400,
        width: "100%",
        margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ 
            fontSize: 11, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", 
            letterSpacing: "1.5px" 
          }}>
            Prototype
          </span>
          <span style={{ fontSize: 15, color: "#F9FAFB", fontWeight: 500 }}>GovernAI Dashboard</span>
        </div>
        
        {/* Time Range Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[
            { id: "quarter" as const, label: "This Quarter" },
            { id: "year" as const, label: "This Year" },
            { id: "all" as const, label: "All Time" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              style={{ 
                padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: "pointer",
                background: timeRange === t.id ? "transparent" : "transparent",
                border: timeRange === t.id ? "1px solid #6B7280" : "1px solid transparent",
                color: timeRange === t.id ? "#F9FAFB" : "#6B7280",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Explainer */}
      <div style={{ 
        padding: "12px 0", 
        maxWidth: 1400,
        width: "100%",
        margin: "0 auto",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        fontSize: 12, color: "#9CA3AF"
      }}>
        <strong style={{ color: "#D1D5DB" }}>What you're seeing:</strong> A governance effectiveness dashboard for the Corporate Secretary or General Counsel — 
        tracking board attention, management execution, and emerging oversight gaps.
      </div>
      
      {/* Spacer */}
      <div style={{ height: 16 }} />

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", paddingBottom: 32 }}>
          
          {/* Row 1: Key Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
            <MetricCard 
              title="Governance Health Score" 
              value="68" 
              subtitle="out of 100"
              trend="down"
              trendLabel="from 74 last quarter"
              color="#D97706"
            />
            <MetricCard 
              title="Actions Closed" 
              value={`${ACTION_METRICS.closed}/${ACTION_METRICS.raised}`}
              subtitle={`${Math.round((ACTION_METRICS.closed / ACTION_METRICS.raised) * 100)}% completion rate`}
              trend="down"
              trendLabel="from 78% last quarter"
              color="#3B82F6"
            />
            <MetricCard 
              title="Overdue Items" 
              value={ACTION_METRICS.overdue}
              subtitle="requiring escalation"
              color="#DC2626"
            />
            <MetricCard 
              title="Dogs Not Barking" 
              value={DOGS_NOT_BARKING.filter(d => d.riskLevel === "high").length}
              subtitle="high-priority blind spots"
              color="#DC2626"
            />
          </div>

          {/* Row 2: Topic Allocation + Sentiment */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
            {/* Topic Time Allocation */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 24 }}>
              <SectionHeader 
                title="Board Attention Allocation" 
                subtitle="% of meeting time by topic vs. peer benchmark"
              />
              <div style={{ display: "grid", gap: 12 }}>
                {TOPIC_TIME_ALLOCATION.map((t) => (
                  <div key={t.topic}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{t.topic}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{t.thisQ}%</span>
                        <span style={{ 
                          fontSize: 10, color: t.thisQ >= t.benchmark ? "#059669" : "#DC2626"
                        }}>
                          {t.thisQ >= t.benchmark ? "↑" : "↓"} vs {t.benchmark}% peer avg
                        </span>
                      </div>
                    </div>
                    <div style={{ position: "relative", height: 8, background: "#F3F4F6", borderRadius: 4 }}>
                      <div style={{ 
                        position: "absolute", left: 0, top: 0, height: "100%", 
                        width: `${t.thisQ}%`, 
                        background: t.thisQ >= t.benchmark ? "#3B82F6" : "#F59E0B",
                        borderRadius: 4 
                      }} />
                      <div style={{ 
                        position: "absolute", left: `${t.benchmark}%`, top: -2, 
                        width: 2, height: 12, background: "#6B7280"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment Signals */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 24 }}>
              <SectionHeader 
                title="Sentiment Signals" 
                subtitle="Key language patterns from meeting materials"
              />
              <div style={{ display: "grid", gap: 10 }}>
                {SENTIMENT_SIGNALS.map((s, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: 12, borderRadius: 8,
                      background: s.type === "positive" ? "#ECFDF5" : s.type === "caution" ? "#FEF3C7" : "#FEF2F2",
                      border: `1px solid ${s.type === "positive" ? "#A7F3D0" : s.type === "caution" ? "#FDE68A" : "#FECACA"}`
                    }}
                  >
                    <div style={{ 
                      fontSize: 12, fontWeight: 500, marginBottom: 4,
                      color: s.type === "positive" ? "#047857" : s.type === "caution" ? "#92400E" : "#991B1B"
                    }}>
                      {s.type === "positive" ? "✓" : s.type === "caution" ? "⚠" : "✗"} {s.text}
                    </div>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>
                      {s.source} · {s.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Promises vs Delivery + Peer Benchmark */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
            {/* Promises vs Delivery */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 24 }}>
              <SectionHeader 
                title="Management Execution" 
                subtitle="Promises vs. Delivery tracking"
              />
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <th style={{ textAlign: "left", padding: "8px 0", color: "#6B7280", fontWeight: 600 }}>Commitment</th>
                    <th style={{ textAlign: "center", padding: "8px 0", color: "#6B7280", fontWeight: 600, width: 80 }}>Promised</th>
                    <th style={{ textAlign: "center", padding: "8px 0", color: "#6B7280", fontWeight: 600, width: 100 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PROMISES_VS_DELIVERY.map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "10px 0", color: "#111827" }}>{p.promise}</td>
                      <td style={{ padding: "10px 0", textAlign: "center", color: "#6B7280" }}>{p.promisedQ}</td>
                      <td style={{ padding: "10px 0", textAlign: "center" }}>
                        <span style={{
                          padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                          background: p.status === "delivered" ? "#ECFDF5" : p.status === "in-progress" ? "#FEF3C7" : "#FEF2F2",
                          color: p.status === "delivered" ? "#047857" : p.status === "in-progress" ? "#B45309" : "#DC2626"
                        }}>
                          {p.status === "delivered" ? "Delivered" : p.status === "in-progress" ? "In Progress" : `${p.daysLate}d overdue`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Peer Benchmark */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 24 }}>
              <SectionHeader 
                title="Peer Benchmark" 
                subtitle="Governance effectiveness vs. industry peers"
              />
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <th style={{ textAlign: "left", padding: "8px 0", color: "#6B7280", fontWeight: 600 }}>Metric</th>
                    <th style={{ textAlign: "center", padding: "8px 0", color: "#6B7280", fontWeight: 600, width: 60 }}>You</th>
                    <th style={{ textAlign: "center", padding: "8px 0", color: "#6B7280", fontWeight: 600, width: 60 }}>Avg</th>
                    <th style={{ textAlign: "center", padding: "8px 0", color: "#6B7280", fontWeight: 600, width: 60 }}>Top</th>
                    <th style={{ textAlign: "center", padding: "8px 0", color: "#6B7280", fontWeight: 600, width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {PEER_BENCHMARK.map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "10px 0", color: "#111827" }}>{p.metric}</td>
                      <td style={{ 
                        padding: "10px 0", textAlign: "center", fontWeight: 600,
                        color: p.status === "below" ? "#DC2626" : "#111827"
                      }}>
                        {p.company}{p.metric.includes("%") || p.metric.includes("rate") ? "%" : ""}
                      </td>
                      <td style={{ padding: "10px 0", textAlign: "center", color: "#6B7280" }}>
                        {p.peerAvg}{p.metric.includes("%") || p.metric.includes("rate") ? "%" : ""}
                      </td>
                      <td style={{ padding: "10px 0", textAlign: "center", color: "#059669", fontWeight: 500 }}>
                        {p.peerTop}{p.metric.includes("%") || p.metric.includes("rate") ? "%" : ""}
                      </td>
                      <td style={{ padding: "10px 0", textAlign: "center" }}>
                        {p.status === "below" && (
                          <span style={{ fontSize: 10, color: "#DC2626" }}>↓ Below</span>
                        )}
                        {p.status === "on-par" && (
                          <span style={{ fontSize: 10, color: "#6B7280" }}>→ On par</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 4: Dogs Not Barking */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 24 }}>
            <SectionHeader 
              title="🐕 Dogs Not Barking Index" 
              subtitle="Topics with declining attention that external signals suggest should be discussed"
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {DOGS_NOT_BARKING.map((d, i) => (
                <div 
                  key={i}
                  style={{ 
                    padding: 16, borderRadius: 10,
                    background: d.riskLevel === "high" ? "#FEF2F2" : "#FEF3C7",
                    border: `1px solid ${d.riskLevel === "high" ? "#FECACA" : "#FDE68A"}`
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ 
                      fontSize: 14, fontWeight: 600, 
                      color: d.riskLevel === "high" ? "#991B1B" : "#92400E"
                    }}>
                      {d.topic}
                    </div>
                    <span style={{
                      fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 600,
                      background: d.riskLevel === "high" ? "#FEE2E2" : "#FEF3C7",
                      color: d.riskLevel === "high" ? "#DC2626" : "#B45309"
                    }}>
                      {d.riskLevel === "high" ? "HIGH PRIORITY" : "MONITOR"}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>
                    Last discussed: <strong>{d.lastDiscussed}</strong>
                  </div>
                  <div style={{ 
                    fontSize: 12, padding: 10, background: "#fff", borderRadius: 6,
                    color: d.riskLevel === "high" ? "#991B1B" : "#92400E",
                    lineHeight: 1.5
                  }}>
                    <strong>External signal:</strong> {d.externalSignal}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 5: Peer Earnings Mentions + Director Education */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32, marginBottom: 32 }}>
            {/* Peer Earnings/Press Mentions */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 24 }}>
              <SectionHeader 
                title="📡 Peer Governance Signals" 
                subtitle="GRC topics mentioned in peer earnings calls & press releases"
              />
              <div style={{ display: "grid", gap: 10 }}>
                {PEER_EARNINGS_MENTIONS.map((p, i) => (
                  <div 
                    key={i}
                    style={{ 
                      padding: 12, borderRadius: 8, background: "#F9FAFB",
                      border: "1px solid #E5E7EB"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <span style={{ 
                        fontSize: 10, padding: "2px 6px", borderRadius: 4,
                        background: "#E0E7FF", color: "#4338CA", fontWeight: 600
                      }}>
                        {p.topic}
                      </span>
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>{p.date}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#111827", marginBottom: 4, lineHeight: 1.4 }}>
                      {p.context}
                    </div>
                    <div style={{ fontSize: 10, color: "#6B7280" }}>
                      {p.company} · {p.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Director Continuing Education */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 24 }}>
              <SectionHeader 
                title="🎓 Director Education Progress" 
                subtitle="Continuing education credits (annual requirement: 20 credits)"
              />
              <div style={{ display: "grid", gap: 8 }}>
                {DIRECTOR_EDUCATION.map((d, i) => (
                  <div 
                    key={i}
                    style={{ 
                      padding: 12, borderRadius: 8,
                      background: d.status === "at-risk" ? "#FEF2F2" : d.status === "behind" ? "#FEF3C7" : "#F9FAFB",
                      border: `1px solid ${d.status === "at-risk" ? "#FECACA" : d.status === "behind" ? "#FDE68A" : "#E5E7EB"}`
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{d.name}</div>
                        <div style={{ fontSize: 10, color: "#6B7280" }}>{d.role}</div>
                      </div>
                      <span style={{
                        fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 600,
                        background: d.status === "complete" ? "#ECFDF5" : d.status === "on-track" ? "#EFF6FF" : d.status === "behind" ? "#FEF3C7" : "#FEE2E2",
                        color: d.status === "complete" ? "#047857" : d.status === "on-track" ? "#1D4ED8" : d.status === "behind" ? "#B45309" : "#DC2626"
                      }}>
                        {d.status === "complete" ? "Complete" : d.status === "on-track" ? "On Track" : d.status === "behind" ? "Behind" : "At Risk"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ position: "relative", height: 6, background: "#E5E7EB", borderRadius: 3 }}>
                          <div style={{ 
                            position: "absolute", left: 0, top: 0, height: "100%", 
                            width: `${Math.min((d.creditsCompleted / d.creditsRequired) * 100, 100)}%`,
                            background: d.status === "complete" ? "#059669" : d.status === "on-track" ? "#3B82F6" : d.status === "behind" ? "#F59E0B" : "#DC2626",
                            borderRadius: 3
                          }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", minWidth: 50 }}>
                        {d.creditsCompleted}/{d.creditsRequired}
                      </span>
                    </div>
                    {d.topics.length > 0 && (
                      <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {d.topics.map((t, j) => (
                          <span key={j} style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "#E5E7EB", color: "#6B7280" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 6: Governance Maturity Trend */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 24, marginBottom: 32 }}>
            <SectionHeader 
              title="📈 Governance Maturity Trend" 
              subtitle="Score progression across last 4 board meetings"
            />
            <div style={{ display: "flex", gap: 24 }}>
              {/* Chart area */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 180, paddingBottom: 24, borderBottom: "1px solid #E5E7EB" }}>
                  {GOVERNANCE_MATURITY_TREND.map((m, i) => {
                    const isLatest = i === GOVERNANCE_MATURITY_TREND.length - 1;
                    const prevScore = i > 0 ? GOVERNANCE_MATURITY_TREND[i - 1].overall : m.overall;
                    const trend = m.overall > prevScore ? "up" : m.overall < prevScore ? "down" : "same";
                    return (
                      <div key={m.meeting} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ 
                          fontSize: 14, fontWeight: 700, marginBottom: 8,
                          color: isLatest ? (trend === "down" ? "#DC2626" : "#059669") : "#6B7280"
                        }}>
                          {m.overall}
                          {isLatest && <span style={{ fontSize: 10, marginLeft: 4 }}>{trend === "up" ? "↑" : trend === "down" ? "↓" : ""}</span>}
                        </div>
                        <div style={{ 
                          width: "100%", 
                          height: `${m.overall * 1.5}px`,
                          background: isLatest 
                            ? (trend === "down" ? "linear-gradient(180deg, #FCA5A5 0%, #DC2626 100%)" : "linear-gradient(180deg, #86EFAC 0%, #059669 100%)")
                            : "linear-gradient(180deg, #93C5FD 0%, #3B82F6 100%)",
                          borderRadius: "4px 4px 0 0",
                          opacity: isLatest ? 1 : 0.6
                        }} />
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 8 }}>{m.meeting}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Breakdown */}
              <div style={{ width: 280, paddingLeft: 24, borderLeft: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 12 }}>Q3 2025 BREAKDOWN</div>
                {[
                  { label: "Risk Oversight", value: 64, prev: 68 },
                  { label: "Action Execution", value: 66, prev: 72 },
                  { label: "Board Engagement", value: 72, prev: 73 },
                  { label: "Peer Alignment", value: 70, prev: 71 },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#374151" }}>{item.label}</span>
                      <span style={{ 
                        fontSize: 12, fontWeight: 600, 
                        color: item.value < item.prev ? "#DC2626" : "#059669"
                      }}>
                        {item.value} <span style={{ fontSize: 10, fontWeight: 400 }}>({item.value < item.prev ? "↓" : "↑"} from {item.prev})</span>
                      </span>
                    </div>
                    <div style={{ position: "relative", height: 4, background: "#E5E7EB", borderRadius: 2 }}>
                      <div style={{ 
                        position: "absolute", left: 0, top: 0, height: "100%", 
                        width: `${item.value}%`,
                        background: item.value < item.prev ? "#F87171" : "#4ADE80",
                        borderRadius: 2
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 7: Countdown to Next Meeting */}
          <div style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>🗓️ Countdown to Next Board Meeting</h2>
                <p style={{ fontSize: 13, color: "#A5B4FC" }}>November 4, 2025 — 12 days away</p>
              </div>
              <div style={{ 
                padding: "12px 20px", background: "rgba(255,255,255,0.1)", borderRadius: 8,
                textAlign: "center"
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>12</div>
                <div style={{ fontSize: 11, color: "#A5B4FC" }}>days to go</div>
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[4, 3, 2, 1].map((week) => {
                const weekActions = COUNTDOWN_ACTIONS.filter(a => a.weeksOut === week);
                const allDone = weekActions.every(a => a.status === "done");
                const hasInProgress = weekActions.some(a => a.status === "in-progress");
                return (
                  <div 
                    key={week}
                    style={{ 
                      padding: 16, borderRadius: 10,
                      background: allDone ? "rgba(34, 197, 94, 0.1)" : hasInProgress ? "rgba(251, 191, 36, 0.1)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${allDone ? "rgba(34, 197, 94, 0.3)" : hasInProgress ? "rgba(251, 191, 36, 0.3)" : "rgba(255,255,255,0.1)"}`
                    }}
                  >
                    <div style={{ 
                      fontSize: 11, fontWeight: 600, color: "#A5B4FC", marginBottom: 8,
                      display: "flex", alignItems: "center", gap: 6
                    }}>
                      {allDone && <span style={{ color: "#4ADE80" }}>✓</span>}
                      {week} {week === 1 ? "WEEK" : "WEEKS"} OUT
                    </div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {weekActions.map((a, i) => (
                        <div 
                          key={i}
                          style={{ 
                            padding: 8, borderRadius: 6, 
                            background: "rgba(255,255,255,0.05)",
                            opacity: a.status === "done" ? 0.6 : 1
                          }}
                        >
                          <div style={{ 
                            fontSize: 11, color: "#fff", marginBottom: 4,
                            textDecoration: a.status === "done" ? "line-through" : "none"
                          }}>
                            {a.action}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 9, color: "#A5B4FC" }}>{a.owner}</span>
                            {a.status === "done" && <span style={{ fontSize: 9, color: "#4ADE80" }}>✓ Done</span>}
                            {a.status === "in-progress" && <span style={{ fontSize: 9, color: "#FBBF24" }}>In progress</span>}
                            {a.status === "upcoming" && <span style={{ fontSize: 9, color: "#6B7280" }}>{a.dueDate}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
