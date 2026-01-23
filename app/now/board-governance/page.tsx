"use client";

import React, { useState } from "react";

// ============================================================================
// Types
// ============================================================================

type SlideType = "agenda" | "data" | "content";
type ViewMode = "meeting" | "prep"; // In-meeting (minimal) vs Pre-meeting (rich insights)

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
  title: "Q3'25 Earnings Review",
  date: "October 30, 2025",
  totalSlides: 24,
  attendees: 8,
  duration: "1h 45m",
};

const SLIDES: Slide[] = [
  { id: 1, type: "agenda", title: "Q3'25 Earnings Overview", topics: ["Earnings", "Financial"] },
  { id: 2, type: "data", title: "Ad Revenue by Geography", topics: ["Revenue", "Geographic"], sentiment: "positive", hasActions: true, actionCount: 2 },
  { id: 3, type: "data", title: "Family of Apps Revenue", topics: ["Revenue", "Products"] },
  { id: 4, type: "data", title: "Reality Labs Update", topics: ["Products", "Investment"], sentiment: "caution", hasActions: true, actionCount: 1 },
  { id: 5, type: "data", title: "Headcount & Expenses", topics: ["Operations", "Cost"], hasActions: true, actionCount: 3 },
  { id: 6, type: "content", title: "AI Investment Outlook", topics: ["Strategy", "AI"], sentiment: "positive" },
  { id: 7, type: "data", title: "CapEx Guidance", topics: ["Financial", "Investment"] },
  { id: 8, type: "content", title: "Regulatory Update", topics: ["Risk", "Compliance"], riskRelated: true, hasActions: true, actionCount: 2 },
  { id: 9, type: "data", title: "User Growth Metrics", topics: ["Growth", "Products"] },
  { id: 10, type: "content", title: "Q&A Preparation", topics: ["Earnings"] },
];

const ACTIONS: Action[] = [
  { id: "A-1", text: "Review APAC growth drivers for investor call", owner: "CFO", status: "open", dueDate: "Nov 5", sourceSlide: 2 },
  { id: "A-2", text: "Prepare Europe regulatory impact analysis", owner: "Legal", status: "in-progress", dueDate: "Nov 10", sourceSlide: 2 },
  { id: "A-3", text: "Reality Labs cost reduction plan", owner: "CTO", status: "overdue", dueDate: "Oct 25", sourceSlide: 4 },
  { id: "A-4", text: "Headcount freeze communication", owner: "CHRO", status: "open", dueDate: "Nov 1", sourceSlide: 5 },
  { id: "A-5", text: "Expense reduction targets by division", owner: "CFO", status: "open", dueDate: "Nov 8", sourceSlide: 5 },
  { id: "A-6", text: "Update board on hiring pause", owner: "CEO", status: "in-progress", dueDate: "Nov 3", sourceSlide: 5 },
  { id: "A-7", text: "EU DSA compliance status update", owner: "Legal", status: "open", dueDate: "Nov 15", sourceSlide: 8 },
  { id: "A-8", text: "Antitrust litigation reserve review", owner: "CFO", status: "closed", dueDate: "Oct 28", sourceSlide: 8 },
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
  const [currentSlide, setCurrentSlide] = useState(2);
  const [viewMode, setViewMode] = useState<ViewMode>("prep"); // prep = rich insights, meeting = minimal
  const [notesOpen, setNotesOpen] = useState(true);
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
          {/* View Mode Toggle */}
          <div style={{ 
            display: "flex", background: "#F3F4F6", borderRadius: 8, padding: 2,
            border: "1px solid #E5E7EB"
          }}>
            <button 
              onClick={() => setViewMode("meeting")}
              style={{ 
                padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: viewMode === "meeting" ? "#fff" : "transparent",
                border: "none", color: viewMode === "meeting" ? "#111827" : "#6B7280",
                boxShadow: viewMode === "meeting" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
              }}
            >
              In Meeting
            </button>
            <button 
              onClick={() => setViewMode("prep")}
              style={{ 
                padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: viewMode === "prep" ? "#fff" : "transparent",
                border: "none", color: viewMode === "prep" ? "#7C3AED" : "#6B7280",
                boxShadow: viewMode === "prep" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
              }}
            >
              ✨ Prep Mode
            </button>
          </div>

          <div style={{ width: 1, height: 24, background: "#E5E7EB" }} />
          
          <button style={{ padding: "6px 12px", background: "none", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span>🖥</span> Present
          </button>
          <button style={{ padding: "6px 12px", background: "none", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span>👁</span> Follow
          </button>
          
          <div style={{ width: 1, height: 24, background: "#E5E7EB" }} />
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>🔍</button>
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

          {/* GovernAI Section - Only in Prep Mode */}
          {viewMode === "prep" && (
            <div style={{ padding: "8px 12px", background: "#F5F3FF", margin: "0 8px", borderRadius: 8, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>✨</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#5B21B6" }}>Meeting Prep</span>
              </div>
              <div style={{ display: "grid", gap: 4 }}>
                <div style={{ fontSize: 11, color: "#6B7280", display: "flex", justifyContent: "space-between" }}>
                  <span>Open Actions</span>
                  <span style={{ fontWeight: 600, color: overdueActions.length > 0 ? "#DC2626" : "#374151" }}>
                    {allOpenActions.length} {overdueActions.length > 0 && `(${overdueActions.length} overdue)`}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", display: "flex", justifyContent: "space-between" }}>
                  <span>Topics to Watch</span>
                  <span style={{ fontWeight: 600, color: "#D97706" }}>2 flags</span>
                </div>
              </div>
            </div>
          )}

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

          {/* Slide Content - Meta Ad Revenue */}
          <div style={{ 
            flex: 1, background: "#FFFFFF", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "flex", flexDirection: "column", overflow: "hidden", padding: 32
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 400, color: "#1a1a1a", marginBottom: 4 }}>
                  Advertising Revenue by User Geography
                </h1>
                <p style={{ fontSize: 14, color: "#666" }}>In Millions</p>
              </div>
              {/* Meta Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                  <path d="M16 0C11.6 0 8.4 3.6 6 7.2C3.6 3.6 0.4 0 0 0V20H4V8C6 12 9 16 12 16C15 16 16 12 16 12C16 12 17 16 20 16C23 16 26 12 28 8V20H32V0C31.6 0 28.4 3.6 26 7.2C23.6 3.6 20.4 0 16 0Z" fill="#0668E1"/>
                </svg>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a" }}>Meta</span>
              </div>
            </div>

            {/* Stacked Bar Chart */}
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 12, paddingBottom: 40, position: "relative" }}>
              {[
                { q: "Q3'23", total: "$33,643", us: 14956, eu: 7721, apac: 6829, row: 4137 },
                { q: "Q4'23", total: "$38,706", us: 17784, eu: 9159, apac: 7316, row: 4447 },
                { q: "Q1'24", total: "$35,635", us: 15451, eu: 8327, apac: 7338, row: 4519 },
                { q: "Q2'24", total: "$38,329", us: 16593, eu: 9135, apac: 7721, row: 4880 },
                { q: "Q3'24", total: "$39,885", us: 17389, eu: 9358, apac: 8050, row: 5088 },
                { q: "Q4'24", total: "$46,783", us: 20982, eu: 11154, apac: 9012, row: 5635 },
                { q: "Q1'25", total: "$41,392", us: 18259, eu: 9527, apac: 8224, row: 5382 },
                { q: "Q2'25", total: "$46,563", us: 20045, eu: 11366, apac: 9148, row: 6004 },
                { q: "Q3'25", total: "$50,082", us: 21331, eu: 12072, apac: 10020, row: 6659 },
              ].map((d, i) => {
                const max = 50082;
                const scale = 280 / max;
                return (
                  <div key={d.q} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {/* Total label */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{d.total}</div>
                    
                    {/* Stacked bars */}
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                      {/* Rest of World */}
                      <div style={{ height: d.row * scale, background: "#B8C5D6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 9, color: "#1a1a1a" }}>${(d.row / 1000).toFixed(0)}K</span>
                      </div>
                      {/* Asia-Pacific */}
                      <div style={{ height: d.apac * scale, background: "#7A99C5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 9, color: "#fff" }}>${(d.apac / 1000).toFixed(0)}K</span>
                      </div>
                      {/* Europe */}
                      <div style={{ height: d.eu * scale, background: "#4A6FA5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 9, color: "#fff" }}>${(d.eu / 1000).toFixed(0)}K</span>
                      </div>
                      {/* US & Canada */}
                      <div style={{ height: d.us * scale, background: "#1a365d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 9, color: "#fff" }}>${(d.us / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    
                    {/* Quarter label */}
                    <div style={{ fontSize: 11, color: "#666", marginTop: 8 }}>{d.q}</div>
                  </div>
                );
              })}

              {/* Legend */}
              <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { color: "#B8C5D6", label: "Rest of World" },
                  { color: "#7A99C5", label: "Asia-Pacific" },
                  { color: "#4A6FA5", label: "Europe" },
                  { color: "#1a365d", label: "US & Canada" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 16, height: 16, background: item.color }} />
                    <span style={{ fontSize: 12, color: "#1a1a1a" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <div style={{ fontSize: 10, color: "#999", lineHeight: 1.4, marginTop: 16 }}>
              Our revenue by user geography is geographically apportioned based on our estimation of the geographic location of our users when they perform a revenue-generating activity. This allocation differs from our revenue disaggregated by geography disclosure in our condensed consolidated financial statements where revenue is geographically apportioned based on the addresses of our customers.
            </div>

            {/* Page number */}
            <div style={{ textAlign: "right", marginTop: 8, fontSize: 12, color: "#666" }}>2</div>
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

        {/* Right Sidebar - Different content based on view mode */}
        {notesOpen && (
          <aside style={{ width: 320, background: "#FFFFFF", borderLeft: "1px solid #E5E7EB", display: "flex", flexDirection: "column" }}>
            {/* Panel Header */}
            <div style={{ 
              padding: "12px 16px", borderBottom: "1px solid #E5E7EB",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {viewMode === "prep" ? (
                  <>
                    <span style={{ fontSize: 16 }}>✨</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#5B21B6" }}>Meeting Prep</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 16 }}>📝</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Notes</span>
                  </>
                )}
              </div>
              <button 
                onClick={() => setNotesOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18 }}
              >
                ×
              </button>
            </div>

            {/* In-Meeting Mode: Simple Notes */}
            {viewMode === "meeting" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: 16, borderBottom: "1px solid #E5E7EB" }}>
                  <button style={{ 
                    width: "100%", padding: "10px 12px", background: "#F9FAFB", 
                    border: "1px dashed #D1D5DB", borderRadius: 8, color: "#6B7280",
                    fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}>
                    <span>+</span> Add note
                  </button>
                </div>
                
                {/* Empty state */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, color: "#9CA3AF" }}>
                  <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.5 }}>📝</div>
                  <div style={{ fontSize: 13, textAlign: "center" }}>No page notes</div>
                  <div style={{ fontSize: 12, textAlign: "center", marginTop: 4 }}>Click above to add a note to this slide</div>
                </div>

                {/* Subtle action indicator if there are actions */}
                {slideActions.length > 0 && (
                  <div style={{ padding: 12, borderTop: "1px solid #E5E7EB", background: "#FFFBEB" }}>
                    <div style={{ fontSize: 11, color: "#92400E", display: "flex", alignItems: "center", gap: 6 }}>
                      <span>⚡</span>
                      <span>{slideActions.length} open action{slideActions.length > 1 ? "s" : ""} from this slide</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Prep Mode: Full GovernAI Panel */}
            {viewMode === "prep" && (
              <>
                {/* Panel Mode Tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
                  {[
                    { id: "context" as const, label: "This Slide" },
                    { id: "meeting" as const, label: "Overview" },
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
                        <strong>Strong geographic diversification</strong> — Q3'25 shows $50B total ad revenue, up 49% from Q3'23. 
                        US/Canada remains dominant (43%) but international growth is accelerating.
                      </div>
                      <div style={{ marginTop: 8, fontSize: 11, color: "#7C3AED" }}>
                        💡 Prep question: What regulatory risks in EU/APAC could impact this growth trajectory?
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
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Related from Last Meeting</div>
                      <div>Board asked for APAC growth analysis and Europe regulatory impact assessment.</div>
                      <button style={{ 
                        marginTop: 8, fontSize: 11, color: "#B45309", background: "none", 
                        border: "none", cursor: "pointer", textDecoration: "underline"
                      }}>
                        View action items →
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

            {/* Panel Footer - AI Prompt (Prep mode only) */}
            <div style={{ padding: 12, borderTop: "1px solid #E5E7EB" }}>
              <div style={{ 
                display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                background: "#F5F3FF", borderRadius: 8, border: "1px solid #DDD6FE"
              }}>
                <span style={{ fontSize: 14 }}>✨</span>
                <input 
                  type="text" 
                  placeholder="Ask about this meeting..."
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
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
