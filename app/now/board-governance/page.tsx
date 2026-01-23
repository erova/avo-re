"use client";

import React, { useState } from "react";

// ============================================================================
// Types
// ============================================================================

type SlideType = "agenda" | "data" | "content";

type Slide = {
  id: number;
  type: SlideType;
  title: string;
  topics: string[];
  hasActions?: boolean;
  actionCount?: number;
  sentiment?: "positive" | "neutral" | "caution";
  riskRelated?: boolean;
};

type Action = {
  id: string;
  text: string;
  owner: string;
  status: "open" | "in-progress" | "closed" | "overdue";
  dueDate: string;
  sourceSlide: number;
};

// ============================================================================
// Sample Data
// ============================================================================

const MEETING_INFO = {
  title: "SLT Meeting",
  date: "December 17, 2025",
  totalSlides: 19,
  attendees: 12,
  duration: "2h 15m",
};

const SLIDES: Slide[] = [
  { id: 1, type: "agenda", title: "Agenda", topics: ["Welcome", "Commercial", "Strategy", "OKRs"] },
  { id: 2, type: "content", title: "Welcome and Congratulations", topics: ["People"], sentiment: "positive" },
  { id: 3, type: "data", title: "People & Commercial Update", topics: ["Commercial", "People"], hasActions: true, actionCount: 2 },
  { id: 4, type: "data", title: "Q4 Momentum", topics: ["Commercial", "Finance"], sentiment: "positive" },
  { id: 5, type: "data", title: "Regional Performance", topics: ["Commercial"], hasActions: true, actionCount: 1 },
  { id: 6, type: "content", title: "Road to 2026", topics: ["Strategy"], hasActions: true, actionCount: 3 },
  { id: 7, type: "data", title: "Strategic Priorities", topics: ["Strategy"] },
  { id: 8, type: "data", title: "OKR Review - Company", topics: ["OKRs", "Performance"], sentiment: "caution", hasActions: true, actionCount: 2 },
  { id: 9, type: "data", title: "OKR Review - Product", topics: ["OKRs", "Product"] },
  { id: 10, type: "data", title: "OKR Review - GTM", topics: ["OKRs", "Commercial"], sentiment: "positive" },
  { id: 11, type: "content", title: "Risk Update", topics: ["Risk", "Compliance"], riskRelated: true, hasActions: true, actionCount: 1 },
  { id: 12, type: "content", title: "Breakout Groups - Ignite!", topics: ["Culture"] },
];

const ACTIONS: Action[] = [
  { id: "A-1", text: "Follow up on EMEA pipeline concerns", owner: "Sarah M.", status: "open", dueDate: "Jan 3", sourceSlide: 3 },
  { id: "A-2", text: "Schedule deep-dive on APAC growth", owner: "James K.", status: "in-progress", dueDate: "Jan 10", sourceSlide: 3 },
  { id: "A-3", text: "Investigate DMI underperformance", owner: "Michael R.", status: "overdue", dueDate: "Dec 20", sourceSlide: 5 },
  { id: "A-4", text: "Finalize 2026 strategic pillars", owner: "CEO", status: "open", dueDate: "Jan 15", sourceSlide: 6 },
  { id: "A-5", text: "Board presentation on strategy", owner: "Sarah M.", status: "open", dueDate: "Jan 20", sourceSlide: 6 },
  { id: "A-6", text: "Resource allocation review", owner: "CFO", status: "in-progress", dueDate: "Jan 5", sourceSlide: 6 },
  { id: "A-7", text: "Address OKR scoring methodology", owner: "James K.", status: "open", dueDate: "Jan 8", sourceSlide: 8 },
  { id: "A-8", text: "Escalate product delays to board", owner: "CTO", status: "closed", dueDate: "Dec 18", sourceSlide: 8 },
  { id: "A-9", text: "Update risk register with new items", owner: "Risk Lead", status: "open", dueDate: "Jan 12", sourceSlide: 11 },
];

const TOPIC_ATTENTION = [
  { topic: "Commercial", meetings: 8, avgMinutes: 24, trend: "stable" },
  { topic: "Strategy", meetings: 6, avgMinutes: 18, trend: "up" },
  { topic: "Risk", meetings: 3, avgMinutes: 8, trend: "down" },
  { topic: "People", meetings: 7, avgMinutes: 12, trend: "stable" },
  { topic: "Compliance", meetings: 2, avgMinutes: 5, trend: "down" },
];

// ============================================================================
// Components
// ============================================================================

function StatusBadge({ status }: { status: Action["status"] }) {
  const colors = {
    open: { bg: "#EFF6FF", fg: "#1D4ED8", border: "#BFDBFE" },
    "in-progress": { bg: "#FEF3C7", fg: "#B45309", border: "#FDE68A" },
    closed: { bg: "#ECFDF5", fg: "#047857", border: "#A7F3D0" },
    overdue: { bg: "#FEF2F2", fg: "#DC2626", border: "#FECACA" },
  };
  const c = colors[status];
  return (
    <span style={{ 
      fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
      background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
      textTransform: "capitalize"
    }}>
      {status === "in-progress" ? "In Progress" : status}
    </span>
  );
}

function SentimentIndicator({ sentiment }: { sentiment: Slide["sentiment"] }) {
  if (!sentiment) return null;
  const config = {
    positive: { icon: "↑", color: "#059669", bg: "#ECFDF5", label: "Positive signal" },
    neutral: { icon: "→", color: "#6B7280", bg: "#F3F4F6", label: "Neutral" },
    caution: { icon: "⚠", color: "#D97706", bg: "#FEF3C7", label: "Needs attention" },
  };
  const c = config[sentiment];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: c.color }}>
      <span style={{ 
        width: 18, height: 18, borderRadius: 4, background: c.bg,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10
      }}>
        {c.icon}
      </span>
      {c.label}
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function BoardGovernancePage() {
  const [currentSlide, setCurrentSlide] = useState(4);
  const [governAiOpen, setGovernAiOpen] = useState(true);
  const [aiPanelMode, setAiPanelMode] = useState<"context" | "meeting" | "actions">("context");

  const slide = SLIDES[currentSlide - 1] || SLIDES[0];
  const slideActions = ACTIONS.filter(a => a.sourceSlide === currentSlide);
  const allOpenActions = ACTIONS.filter(a => a.status !== "closed");
  const overdueActions = ACTIONS.filter(a => a.status === "overdue");

  // Meeting-level stats
  const totalActions = ACTIONS.length;
  const closedActions = ACTIONS.filter(a => a.status === "closed").length;
  const completionRate = Math.round((closedActions / totalActions) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation Bar */}
      <header style={{ 
        height: 48, background: "#FFFFFF", borderBottom: "1px solid #E5E7EB",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px",
        position: "sticky", top: 0, zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#374151", fontSize: 14 }}>
            <span style={{ fontSize: 18 }}>‹</span> Home
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>{MEETING_INFO.title} ({MEETING_INFO.date.split(",")[0]}...)</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ padding: "6px 12px", background: "none", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span>🖥</span> Present
          </button>
          <button style={{ padding: "6px 12px", background: "none", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span>👁</span> Follow
          </button>
          <button 
            onClick={() => setGovernAiOpen(!governAiOpen)}
            style={{ 
              padding: "6px 12px", 
              background: governAiOpen ? "#7C3AED" : "none", 
              border: governAiOpen ? "1px solid #7C3AED" : "1px solid #E5E7EB", 
              borderRadius: 6, fontSize: 13, 
              color: governAiOpen ? "#FFFFFF" : "#7C3AED", 
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              fontWeight: 600
            }}
          >
            <span>✨</span> GovernAI
          </button>
          <div style={{ width: 1, height: 24, background: "#E5E7EB" }} />
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>🔍</button>
          <div style={{ 
            width: 20, height: 20, borderRadius: "50%", background: "#EF4444", color: "#fff",
            fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            5
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>❓</button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Left Sidebar - Navigation */}
        <aside style={{ width: 220, background: "#FFFFFF", borderRight: "1px solid #E5E7EB", padding: "12px 0", flexShrink: 0 }}>
          <div style={{ padding: "0 12px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Navigation</span>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>≡</button>
            </div>
          </div>

          {/* GovernAI Section */}
          <div style={{ padding: "8px 12px", background: "#F5F3FF", margin: "0 8px", borderRadius: 8, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>✨</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#5B21B6" }}>GovernAI</span>
            </div>
            <div style={{ display: "grid", gap: 4 }}>
              <div style={{ fontSize: 11, color: "#6B7280", display: "flex", justifyContent: "space-between" }}>
                <span>Meeting Health</span>
                <span style={{ fontWeight: 600, color: "#059669" }}>Good</span>
              </div>
              <div style={{ fontSize: 11, color: "#6B7280", display: "flex", justifyContent: "space-between" }}>
                <span>Open Actions</span>
                <span style={{ fontWeight: 600, color: overdueActions.length > 0 ? "#DC2626" : "#374151" }}>
                  {allOpenActions.length} {overdueActions.length > 0 && `(${overdueActions.length} overdue)`}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#6B7280", display: "flex", justifyContent: "space-between" }}>
                <span>Topics Covered</span>
                <span style={{ fontWeight: 600, color: "#374151" }}>4 of 5</span>
              </div>
            </div>
          </div>

          {/* Meeting Tab */}
          <div style={{ padding: "0 8px" }}>
            <div style={{ 
              padding: "10px 12px", background: "#F3F4F6", borderRadius: 6, 
              fontSize: 12, color: "#374151", fontWeight: 500
            }}>
              Tab 1: {MEETING_INFO.title} ({MEETING_INFO.date})
            </div>
          </div>

          {/* Slide Thumbnails */}
          <div style={{ marginTop: 16, padding: "0 8px", maxHeight: 400, overflowY: "auto" }}>
            {SLIDES.slice(0, 8).map((s) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(s.id)}
                style={{
                  width: "100%", padding: "8px", marginBottom: 4, borderRadius: 6,
                  background: currentSlide === s.id ? "#E0E7FF" : "transparent",
                  border: currentSlide === s.id ? "1px solid #818CF8" : "1px solid transparent",
                  cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 8
                }}
              >
                <span style={{ 
                  width: 20, height: 20, borderRadius: 4, background: "#E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 600, color: "#6B7280"
                }}>
                  {s.id}
                </span>
                <span style={{ fontSize: 11, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.title}
                </span>
                {s.hasActions && (
                  <span style={{ 
                    width: 16, height: 16, borderRadius: "50%", background: "#FEF3C7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700, color: "#B45309"
                  }}>
                    {s.actionCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Slide Viewer */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", background: "#E5E7EB", padding: 16 }}>
          {/* Toolbar */}
          <div style={{ 
            display: "flex", justifyContent: "space-between", alignItems: "center", 
            marginBottom: 12, padding: "0 8px"
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["📋", "✋", "✏️", "✏️", "✏️", "◇"].map((icon, i) => (
                <button key={i} style={{ 
                  width: 32, height: 32, borderRadius: 6, background: "#fff", border: "1px solid #E5E7EB",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {icon}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ padding: "6px 12px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12 }}>🖨️</button>
              <button style={{ padding: "6px 12px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12 }}>📤</button>
            </div>
          </div>

          {/* Slide Content */}
          <div style={{ 
            flex: 1, background: "#FFFFFF", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "flex", flexDirection: "column", overflow: "hidden"
          }}>
            {/* Red banner */}
            <div style={{ height: 60, background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)", position: "relative" }}>
              <div style={{ 
                position: "absolute", right: 0, top: 0, bottom: 0, width: 200,
                background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 100%)"
              }} />
            </div>

            {/* Slide body */}
            <div style={{ flex: 1, padding: 32 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                Q4 momentum is huge, and we're up 21% vs. the same time last year
              </h1>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>Let's finish out the year strong!</p>

              {/* Data table */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#6B7280" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", color: "#fff", fontWeight: 600 }}>Bookings</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", color: "#fff", fontWeight: 600 }}>Q4 QTD</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", color: "#fff", fontWeight: 600 }}>Q4 CMT</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", color: "#fff", fontWeight: 600 }}>QTD % of CMT</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", color: "#fff", fontWeight: 600 }}>TGT</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", color: "#fff", fontWeight: 600 }}>QTD % of TGT</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", color: "#fff", fontWeight: 600 }}>PY QTD</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", color: "#fff", fontWeight: 600 }}>YoY</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { region: "AMS", q4qtd: "$5.49", q4cmt: "$8.13", qtdPct: "68%", tgt: "$9.17", tgtPct: "60%", pyQtd: "$4.71", yoy: "17%" },
                    { region: "EMEA", q4qtd: "$4.13", q4cmt: "$5.93", qtdPct: "70%", tgt: "$7.15", tgtPct: "58%", pyQtd: "$3.27", yoy: "26%" },
                    { region: "APAC", q4qtd: "$1.16", q4cmt: "$1.87", qtdPct: "62%", tgt: "$2.21", tgtPct: "53%", pyQtd: "$1.15", yoy: "2%" },
                    { region: "MDO", q4qtd: "$1.90", q4cmt: "$2.59", qtdPct: "73%", tgt: "$2.80", tgtPct: "68%", pyQtd: "$1.45", yoy: "31%" },
                    { region: "DMI", q4qtd: "$0.41", q4cmt: "$0.79", qtdPct: "52%", tgt: "$0.75", tgtPct: "55%", pyQtd: "$0.29", yoy: "43%" },
                  ].map((row, i) => (
                    <tr key={row.region} style={{ background: i % 2 === 0 ? "#F9FAFB" : "#fff" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600, background: "#6B7280", color: "#fff" }}>{row.region}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>{row.q4qtd}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>{row.q4cmt}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>{row.qtdPct}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>{row.tgt}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>{row.tgtPct}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>{row.pyQtd}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: "#059669", fontWeight: 600 }}>{row.yoy}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "#FEE2E2" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700, background: "#DC2626", color: "#fff" }}>TOTAL</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>$12.45</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>$19.31</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>67%</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>$22.09</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>59%</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>$10.86</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#059669" }}>21%</td>
                  </tr>
                </tbody>
              </table>

              {/* Footer */}
              <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, background: "#DC2626", borderRadius: 4 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Diligent</span>
                </div>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>Note: Data as of 12/17</span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>© 2025 Diligent Corporation</span>
              </div>
            </div>
          </div>

          {/* Page Navigation */}
          <div style={{ 
            display: "flex", alignItems: "center", justifyContent: "space-between", 
            marginTop: 12, padding: "0 8px"
          }}>
            <button 
              onClick={() => setCurrentSlide(3)}
              style={{ fontSize: 12, color: "#6B7280", background: "none", border: "none", cursor: "pointer" }}
            >
              Back to page 3
            </button>
            
            {/* Scrubber */}
            <div style={{ flex: 1, margin: "0 24px", position: "relative" }}>
              <div style={{ height: 4, background: "#D1D5DB", borderRadius: 2 }} />
              <div 
                style={{ 
                  position: "absolute", 
                  left: `${((currentSlide - 1) / (MEETING_INFO.totalSlides - 1)) * 100}%`,
                  top: "50%", transform: "translate(-50%, -50%)",
                  width: 14, height: 14, borderRadius: "50%", background: "#3B82F6", border: "2px solid #fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)", cursor: "pointer"
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button 
                onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                style={{ width: 28, height: 28, borderRadius: 4, background: "#fff", border: "1px solid #E5E7EB", cursor: "pointer" }}
              >
                ‹
              </button>
              <span style={{ fontSize: 13, color: "#374151", minWidth: 50, textAlign: "center" }}>
                {currentSlide} / {MEETING_INFO.totalSlides}
              </span>
              <button 
                onClick={() => setCurrentSlide(Math.min(MEETING_INFO.totalSlides, currentSlide + 1))}
                style={{ width: 28, height: 28, borderRadius: 4, background: "#fff", border: "1px solid #E5E7EB", cursor: "pointer" }}
              >
                ›
              </button>
              <div style={{ width: 1, height: 20, background: "#E5E7EB", margin: "0 8px" }} />
              <button style={{ padding: "4px 8px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 12 }}>🔍−</button>
              <span style={{ fontSize: 12, color: "#6B7280" }}>125%</span>
              <button style={{ padding: "4px 8px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 12 }}>🔍+</button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - GovernAI Panel */}
        {governAiOpen && (
          <aside style={{ width: 320, background: "#FFFFFF", borderLeft: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>
            {/* Panel Header */}
            <div style={{ 
              padding: "12px 16px", borderBottom: "1px solid #E5E7EB",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>✨</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#5B21B6" }}>GovernAI Insights</span>
              </div>
              <button 
                onClick={() => setGovernAiOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18 }}
              >
                ×
              </button>
            </div>

            {/* Panel Mode Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
              {[
                { id: "context" as const, label: "This Slide" },
                { id: "meeting" as const, label: "Meeting" },
                { id: "actions" as const, label: "Actions" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAiPanelMode(tab.id)}
                  style={{
                    flex: 1, padding: "10px 8px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: "none", border: "none",
                    color: aiPanelMode === tab.id ? "#5B21B6" : "#6B7280",
                    borderBottom: aiPanelMode === tab.id ? "2px solid #5B21B6" : "2px solid transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
              {aiPanelMode === "context" && (
                <div>
                  {/* Slide Context */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>SLIDE CONTEXT</div>
                    <div style={{ padding: 12, background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 }}>{slide.title}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                        {slide.topics.map(t => (
                          <span key={t} style={{ 
                            fontSize: 10, padding: "2px 6px", borderRadius: 4, 
                            background: "#E0E7FF", color: "#4338CA"
                          }}>
                            {t}
                          </span>
                        ))}
                      </div>
                      {slide.sentiment && <SentimentIndicator sentiment={slide.sentiment} />}
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>AI INSIGHT</div>
                    <div style={{ 
                      padding: 12, background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)", 
                      borderRadius: 8, border: "1px solid #DDD6FE"
                    }}>
                      <div style={{ fontSize: 12, color: "#5B21B6", lineHeight: 1.5 }}>
                        <strong>Strong Q4 performance</strong> — 21% YoY growth is well above industry benchmark (12%). 
                        This slide reinforces the positive commercial signals from the past 3 meetings.
                      </div>
                      <div style={{ marginTop: 8, fontSize: 11, color: "#7C3AED" }}>
                        💡 Consider: How is this growth reflected in updated risk exposure for scaling operations?
                      </div>
                    </div>
                  </div>

                  {/* Slide Actions */}
                  {slideActions.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>
                        ACTIONS FROM THIS SLIDE ({slideActions.length})
                      </div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {slideActions.map(action => (
                          <div key={action.id} style={{ 
                            padding: 10, background: "#fff", borderRadius: 8, 
                            border: "1px solid #E5E7EB"
                          }}>
                            <div style={{ fontSize: 12, color: "#111827", marginBottom: 6 }}>{action.text}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: "#6B7280" }}>{action.owner} · {action.dueDate}</span>
                              <StatusBadge status={action.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Decisions */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>RELATED DECISIONS</div>
                    <div style={{ 
                      padding: 10, background: "#FEF3C7", borderRadius: 8, 
                      border: "1px solid #FDE68A", fontSize: 12, color: "#92400E"
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Link to Risk Manager</div>
                      <div>3 open risks related to commercial growth in EMEA and scaling operations.</div>
                      <button style={{ 
                        marginTop: 8, fontSize: 11, color: "#B45309", background: "none", 
                        border: "none", cursor: "pointer", textDecoration: "underline"
                      }}>
                        View in Risk Manager →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {aiPanelMode === "meeting" && (
                <div>
                  {/* Meeting Health */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>MEETING HEALTH</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ padding: 12, background: "#ECFDF5", borderRadius: 8, border: "1px solid #A7F3D0" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>Good</div>
                        <div style={{ fontSize: 11, color: "#047857" }}>Overall Health</div>
                      </div>
                      <div style={{ padding: 12, background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{completionRate}%</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>Action Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Topic Attention */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>TOPIC ATTENTION</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {TOPIC_ATTENTION.map(t => (
                        <div key={t.topic} style={{ 
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 10px", background: "#F9FAFB", borderRadius: 6
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{t.topic}</div>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>{t.meetings} meetings · ~{t.avgMinutes} min avg</div>
                          </div>
                          <div style={{ 
                            fontSize: 14, 
                            color: t.trend === "up" ? "#059669" : t.trend === "down" ? "#DC2626" : "#6B7280"
                          }}>
                            {t.trend === "up" ? "↑" : t.trend === "down" ? "↓" : "→"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dogs Not Barking */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>🐕 DOGS NOT BARKING</div>
                    <div style={{ 
                      padding: 12, background: "#FEF2F2", borderRadius: 8, 
                      border: "1px solid #FECACA"
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#991B1B", marginBottom: 4 }}>
                        Risk topic attention declining
                      </div>
                      <div style={{ fontSize: 11, color: "#7F1D1D", lineHeight: 1.5 }}>
                        Risk and Compliance topics have received 40% less airtime over the past 3 meetings. 
                        Consider scheduling a dedicated risk review.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {aiPanelMode === "actions" && (
                <div>
                  {/* Action Summary */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>ACTION SUMMARY</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      <div style={{ padding: 10, background: "#EFF6FF", borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#1D4ED8" }}>{ACTIONS.filter(a => a.status === "open").length}</div>
                        <div style={{ fontSize: 10, color: "#1E40AF" }}>Open</div>
                      </div>
                      <div style={{ padding: 10, background: "#FEF3C7", borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#B45309" }}>{ACTIONS.filter(a => a.status === "in-progress").length}</div>
                        <div style={{ fontSize: 10, color: "#92400E" }}>In Progress</div>
                      </div>
                      <div style={{ padding: 10, background: "#FEF2F2", borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#DC2626" }}>{overdueActions.length}</div>
                        <div style={{ fontSize: 10, color: "#991B1B" }}>Overdue</div>
                      </div>
                    </div>
                  </div>

                  {/* Overdue Actions */}
                  {overdueActions.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#DC2626", marginBottom: 8 }}>⚠️ OVERDUE</div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {overdueActions.map(action => (
                          <div key={action.id} style={{ 
                            padding: 10, background: "#FEF2F2", borderRadius: 8, 
                            border: "1px solid #FECACA"
                          }}>
                            <div style={{ fontSize: 12, color: "#991B1B", fontWeight: 500, marginBottom: 6 }}>{action.text}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: "#7F1D1D" }}>{action.owner} · Due: {action.dueDate}</span>
                              <StatusBadge status={action.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Actions */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>ALL ACTIONS ({ACTIONS.length})</div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {ACTIONS.filter(a => a.status !== "overdue").map(action => (
                        <div key={action.id} style={{ 
                          padding: 10, background: "#fff", borderRadius: 8, 
                          border: "1px solid #E5E7EB"
                        }}>
                          <div style={{ fontSize: 12, color: "#111827", marginBottom: 6 }}>{action.text}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: "#6B7280" }}>{action.owner} · {action.dueDate}</span>
                            <StatusBadge status={action.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Panel Footer - AI Prompt */}
            <div style={{ padding: 12, borderTop: "1px solid #E5E7EB" }}>
              <div style={{ 
                display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                background: "#F5F3FF", borderRadius: 8, border: "1px solid #DDD6FE"
              }}>
                <span style={{ fontSize: 14 }}>✨</span>
                <input 
                  type="text" 
                  placeholder="Ask GovernAI about this meeting..."
                  style={{ 
                    flex: 1, background: "none", border: "none", outline: "none",
                    fontSize: 13, color: "#5B21B6"
                  }}
                />
                <button style={{ 
                  padding: "4px 10px", background: "#7C3AED", color: "#fff",
                  border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer"
                }}>
                  Ask
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
