"use client";

import React, { useState } from "react";

// ============================================================================
// Types
// ============================================================================

type SlideType = "agenda" | "data" | "content";
type ViewMode = "meeting" | "prep"; // In-meeting (minimal) vs Pre-meeting (rich insights)
type UserRole = "board-member" | "corp-sec"; // Board Member vs Corporate Secretary

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
  title: "Q3 Board Meeting",
  date: "October 28, 2025",
  totalSlides: 8,
  attendees: 11,
  duration: "3h",
};

const SLIDES: Slide[] = [
  { id: 1, type: "agenda", title: "Agenda", topics: ["Admin"] },
  { id: 2, type: "content", title: "Minutes Approval", topics: ["Governance"] },
  { id: 3, type: "data", title: "Financial Results", topics: ["Financial"] },
  { id: 4, type: "content", title: "CEO Update", topics: ["Strategy", "Performance"], hasActions: true, actionCount: 2 },
  { id: 5, type: "data", title: "Risk Committee Report", topics: ["Risk", "Compliance"], riskRelated: true, hasActions: true, actionCount: 3, sentiment: "caution" },
  { id: 6, type: "content", title: "Cybersecurity Update", topics: ["Risk", "Technology"], riskRelated: true, hasActions: true, actionCount: 2 },
  { id: 7, type: "data", title: "Talent & Succession", topics: ["People"], hasActions: true, actionCount: 1, sentiment: "caution" },
  { id: 8, type: "content", title: "Executive Session", topics: ["Governance"] },
];

const ACTIONS: Action[] = [
  { id: "A-1", text: "Commission independent AI compliance assessment", owner: "CLO", status: "open", dueDate: "Nov 15", sourceSlide: 4 },
  { id: "A-2", text: "Present vendor concentration mitigation plan", owner: "CPO", status: "overdue", dueDate: "Oct 15", sourceSlide: 4 },
  { id: "A-3", text: "Update cyber insurance coverage analysis", owner: "CFO", status: "in-progress", dueDate: "Nov 1", sourceSlide: 4 },
  { id: "A-4", text: "Board briefing on ransomware tabletop results", owner: "CISO", status: "open", dueDate: "Nov 20", sourceSlide: 5 },
  { id: "A-5", text: "Incident response plan board review", owner: "CISO", status: "in-progress", dueDate: "Nov 10", sourceSlide: 5 },
  { id: "A-6", text: "EU AI Act readiness assessment", owner: "CLO", status: "open", dueDate: "Dec 1", sourceSlide: 6 },
  { id: "A-7", text: "Succession planning update for C-suite", owner: "CHRO", status: "overdue", dueDate: "Sep 30", sourceSlide: 7 },
];

const TOPIC_ATTENTION = [
  { topic: "Risk & Compliance", meetings: 4, avgMinutes: 22, trend: "stable" },
  { topic: "Strategy", meetings: 4, avgMinutes: 35, trend: "up" },
  { topic: "Financial", meetings: 4, avgMinutes: 28, trend: "stable" },
  { topic: "Cybersecurity", meetings: 2, avgMinutes: 12, trend: "down" },
  { topic: "Succession", meetings: 1, avgMinutes: 8, trend: "down" },
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
  const [currentSlide, setCurrentSlide] = useState(4); // Start on Enterprise Risk Summary
  const [viewMode, setViewMode] = useState<ViewMode>("prep"); // prep = rich insights, meeting = minimal
  const [userRole, setUserRole] = useState<UserRole>("board-member"); // board-member or corp-sec
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
    <div style={{ minHeight: "100vh", background: "#0D0D0F", display: "flex", flexDirection: "column" }}>
      {/* Demo Banner - Aligned with UI below */}
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
          <span style={{ fontSize: 15, color: "#F9FAFB", fontWeight: 500 }}>Board Governance Intelligence</span>
        </div>
        
        {/* Toggle Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* User Toggle */}
          <button 
            onClick={() => setUserRole("board-member")}
            style={{ 
              padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: userRole === "board-member" ? "transparent" : "transparent",
              border: userRole === "board-member" ? "1px solid #6B7280" : "1px solid transparent",
              color: userRole === "board-member" ? "#F9FAFB" : "#6B7280",
            }}
          >
            Board Member
          </button>
          <button 
            onClick={() => setUserRole("corp-sec")}
            style={{ 
              padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: userRole === "corp-sec" ? "transparent" : "transparent",
              border: userRole === "corp-sec" ? "1px solid #6B7280" : "1px solid transparent",
              color: userRole === "corp-sec" ? "#F9FAFB" : "#6B7280",
            }}
          >
            Corporate Secretary
          </button>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 8px" }} />

          {/* Context Toggle */}
          <button 
            onClick={() => setViewMode("meeting")}
            style={{ 
              padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: viewMode === "meeting" ? "transparent" : "transparent",
              border: viewMode === "meeting" ? "1px solid #6B7280" : "1px solid transparent",
              color: viewMode === "meeting" ? "#F9FAFB" : "#6B7280",
            }}
          >
            In Meeting
          </button>
          <button 
            onClick={() => setViewMode("prep")}
            style={{ 
              padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: viewMode === "prep" ? "transparent" : "transparent",
              border: viewMode === "prep" ? "1px solid #22C55E" : "1px solid transparent",
              color: viewMode === "prep" ? "#22C55E" : "#6B7280",
            }}
          >
            Prep Mode
          </button>
        </div>
      </div>

      {/* Prototype Explainer */}
      <div style={{ 
        maxWidth: 1400, width: "100%", margin: "0 auto",
        padding: "12px 0", 
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{ 
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24,
          fontSize: 12, color: "#9CA3AF"
        }}>
          <div>
            <div style={{ fontWeight: 600, color: "#D1D5DB", marginBottom: 4 }}>What you're seeing</div>
            <div style={{ lineHeight: 1.5 }}>
              {userRole === "board-member" 
                ? "A board member preparing for a meeting, reviewing the CEO's slide with GovernAI surfacing context that isn't in the presentation."
                : "A Corporate Secretary preparing executives, seeing what questions board members might ask and gaps to address."}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#D1D5DB", marginBottom: 4 }}>What you can do</div>
            <div style={{ lineHeight: 1.5 }}>
              Toggle between <strong style={{ color: "#F9FAFB" }}>Board Member</strong> and <strong style={{ color: "#F9FAFB" }}>Corporate Secretary</strong> to see different perspectives. 
              Switch to <strong style={{ color: "#F9FAFB" }}>In Meeting</strong> mode to see the minimal view.
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#D1D5DB", marginBottom: 4 }}>Why it matters</div>
            <div style={{ lineHeight: 1.5 }}>
              {userRole === "board-member"
                ? "Boards shift from reactive to prepared — knowing what to ask before walking in the room."
                : "Management avoids being caught off-guard — seeing what diligent board members will probe."}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer below context bar */}
      <div style={{ height: 16 }} />

      {/* Board Book Reader Chrome */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 1400, margin: "0 auto", width: "100%", background: "#fff", boxShadow: "0 0 40px rgba(0,0,0,0.15)" }}>
        {/* Top Navigation Bar */}
        <header style={{ 
          height: 44, background: "#FFFFFF", borderBottom: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13 }}>
              <span style={{ fontSize: 16 }}>‹</span> Home
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>SLT Meeting (December...</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ padding: "5px 10px", background: "none", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 12, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 12 }}>🖥</span> Present
            </button>
            <button style={{ padding: "5px 10px", background: "none", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 12, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 12 }}>📧</span> Follow
            </button>
            <button 
              style={{ 
                padding: "5px 10px", 
                background: viewMode === "prep" ? "#7C3AED" : "none", 
                border: viewMode === "prep" ? "1px solid #7C3AED" : "1px solid #E5E7EB", 
                borderRadius: 4, fontSize: 12, 
                color: viewMode === "prep" ? "#fff" : "#7C3AED", 
                cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                fontWeight: 600
              }}
            >
              <span style={{ fontSize: 10 }}>✦</span> GovernAI
            </button>
            <div style={{ width: 1, height: 20, background: "#E5E7EB" }} />
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#6B7280" }}>↗</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#6B7280" }}>🔍</button>
            <div style={{ 
              width: 18, height: 18, borderRadius: "50%", background: "#EF4444", color: "#fff",
              fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              5
            </div>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#6B7280" }}>?</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#6B7280" }}>⚙</button>
          </div>
        </header>

        {/* Secondary Toolbar */}
        <div style={{ 
          height: 40, background: "#FAFAFA", borderBottom: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px",
        }}>
          {/* Left icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 14 }}>☰</button>
            <button style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 14 }}>↗</button>
            <button style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 14 }}>👤</button>
            <button style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 14 }}>🔍</button>
          </div>
          
          {/* Right toolbar icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {["📋", "✋", "✏️", "✏️", "✏️", "△", "↩", "↪", "🗑", "📎", "🖨", "↗"].map((icon, i) => (
              <button key={i} style={{ 
                width: 28, height: 28, background: "none", border: "none",
                cursor: "pointer", color: i < 6 ? "#B45309" : "#6B7280", fontSize: 12
              }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

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
        <main style={{ flex: 1, display: "flex", flexDirection: "column", background: "#E8E8E8", padding: 16 }}>

          {/* Slide Content - CEO Strategic Update */}
          <div style={{ 
            flex: 1, background: "#FFFFFF", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "flex", flexDirection: "column", overflow: "hidden", padding: 32
          }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>CEO Update</p>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>
                Q3 Momentum & Strategic Priorities
              </h1>
            </div>

            {/* Key Messages */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
              <div style={{ padding: 20, background: "#ECFDF5", borderRadius: 12, borderLeft: "4px solid #059669" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#047857", marginBottom: 8 }}>Revenue Growth</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#059669", marginBottom: 4 }}>+18% YoY</div>
                <div style={{ fontSize: 12, color: "#047857" }}>Exceeding guidance by 3 points</div>
              </div>
              <div style={{ padding: 20, background: "#EFF6FF", borderRadius: 12, borderLeft: "4px solid #3B82F6" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8", marginBottom: 8 }}>AI Product Launch</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#3B82F6", marginBottom: 4 }}>On Track</div>
                <div style={{ fontSize: 12, color: "#1D4ED8" }}>Enterprise pilot expanding to 50 customers</div>
              </div>
            </div>

            {/* Strategic Priorities */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 16 }}>Strategic Priorities for Q4</div>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { num: "1", title: "Scale AI Product Suite", desc: "Expand enterprise pilot, prepare for GA launch in Q1", status: "On Track", statusColor: "#059669" },
                  { num: "2", title: "European Market Expansion", desc: "New partnerships in Germany and France", status: "On Track", statusColor: "#059669" },
                  { num: "3", title: "Operational Efficiency", desc: "Continue margin improvement initiatives", status: "On Track", statusColor: "#059669" },
                  { num: "4", title: "Talent Investment", desc: "Key hires in AI/ML and product engineering", status: "In Progress", statusColor: "#D97706" },
                ].map((item) => (
                  <div key={item.num} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "#F9FAFB", borderRadius: 8 }}>
                    <div style={{ 
                      width: 28, height: 28, borderRadius: "50%", background: "#E5E7EB",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "#374151", flexShrink: 0
                    }}>
                      {item.num}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{item.desc}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: item.statusColor }}>{item.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                Confidential — Board of Directors
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>4</div>
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
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#5B21B6" }}>
                      {userRole === "board-member" ? "Board Prep" : "Exec Prep"}
                    </span>
                    <span style={{ 
                      fontSize: 9, padding: "2px 6px", borderRadius: 4,
                      background: userRole === "board-member" ? "#E0E7FF" : "#FEF3C7",
                      color: userRole === "board-member" ? "#4338CA" : "#B45309",
                      fontWeight: 600
                    }}>
                      {userRole === "board-member" ? "DIRECTOR" : "CORP SEC"}
                    </span>
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
                    { id: "context" as const, label: "This Slide", count: null },
                    { id: "meeting" as const, label: "Overview", count: null },
                    { id: "actions" as const, label: "Actions", count: userRole === "board-member" ? 3 : 4 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setAiPanelMode(tab.id)}
                      style={{
                        flex: 1, padding: "10px 8px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        background: "none", border: "none",
                        color: aiPanelMode === tab.id ? "#5B21B6" : "#6B7280",
                        borderBottom: aiPanelMode === tab.id ? "2px solid #5B21B6" : "2px solid transparent",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4
                      }}
                    >
                      {tab.label}
                      {tab.count && (
                        <span style={{ 
                          fontSize: 10, padding: "1px 5px", borderRadius: 8,
                          background: aiPanelMode === tab.id ? "#7C3AED" : "#E5E7EB",
                          color: aiPanelMode === tab.id ? "#fff" : "#6B7280"
                        }}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

            {/* Panel Content */}
            <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
              {aiPanelMode === "context" && (
                <div>
                  {/* Board Member View */}
                  {userRole === "board-member" && (
                    <>
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

                      {/* What's NOT on this slide */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#DC2626", marginBottom: 8 }}>⚠ NOT MENTIONED ON THIS SLIDE</div>
                        <div style={{ 
                          padding: 12, background: "#FEF2F2", 
                          borderRadius: 8, border: "1px solid #FECACA"
                        }}>
                          <div style={{ fontSize: 12, color: "#991B1B", lineHeight: 1.5 }}>
                            <strong>AI regulatory risk is Critical</strong> — EU AI Act compliance assessment is incomplete, 
                            yet AI product launch is listed as "On Track."
                          </div>
                          <div style={{ marginTop: 10, padding: 8, background: "#fff", borderRadius: 6, fontSize: 11, color: "#7F1D1D" }}>
                            Risk register shows AI Regulatory Compliance trending ↑ with "Mitigation in progress" status.
                          </div>
                        </div>
                      </div>
                      
                      {/* Open Loop from Last Meeting */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>OPEN LOOP FROM Q2</div>
                        <div style={{ 
                          padding: 12, background: "#FEF3C7", borderRadius: 8, 
                          border: "1px solid #FDE68A", fontSize: 12, color: "#92400E", lineHeight: 1.5
                        }}>
                          <div style={{ marginBottom: 8 }}>
                            <span style={{ fontWeight: 600 }}>Board asked:</span> "What is the go/no-go criteria for the AI launch 
                            given regulatory uncertainty?"
                          </div>
                          <div style={{ fontWeight: 500 }}>
                            Status: <span style={{ color: "#DC2626" }}>Not addressed in this deck</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Suggested Questions */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>SUGGESTED QUESTIONS</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          <div style={{ padding: 10, background: "#F5F3FF", borderRadius: 6, fontSize: 12, color: "#5B21B6", borderLeft: "3px solid #7C3AED" }}>
                            "What's our exposure if EU AI Act enforcement begins before GA launch?"
                          </div>
                          <div style={{ padding: 10, background: "#F5F3FF", borderRadius: 6, fontSize: 12, color: "#5B21B6", borderLeft: "3px solid #7C3AED" }}>
                            "Is the European expansion timeline realistic given GDPR enforcement trends?"
                          </div>
                        </div>
                      </div>

                      {/* Related */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>RELATED</div>
                        <div style={{ 
                          padding: 10, background: "#EFF6FF", borderRadius: 8, 
                          border: "1px solid #BFDBFE", fontSize: 12, color: "#1E40AF"
                        }}>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>Risk Register</div>
                          <div>3 Critical risks directly related to priorities on this slide.</div>
                          <button style={{ 
                            marginTop: 8, fontSize: 11, color: "#1D4ED8", background: "none", 
                            border: "none", cursor: "pointer", textDecoration: "underline"
                          }}>
                            View risk details →
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Corporate Secretary View */}
                  {userRole === "corp-sec" && (
                    <>
                      {/* Readiness Status */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>SLIDE READINESS</div>
                        <div style={{ 
                          padding: 12, background: "#FEF2F2", borderRadius: 8, 
                          border: "1px solid #FECACA"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <div style={{ 
                              width: 32, height: 32, borderRadius: "50%", background: "#FEE2E2",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 14
                            }}>⚠️</div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "#DC2626" }}>Needs Preparation</div>
                              <div style={{ fontSize: 11, color: "#991B1B" }}>2 likely questions not addressed</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Questions to Expect */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#DC2626", marginBottom: 8 }}>🎯 EXPECT THESE QUESTIONS</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          <div style={{ 
                            padding: 12, background: "#FEF2F2", borderRadius: 8, 
                            border: "1px solid #FECACA"
                          }}>
                            <div style={{ fontSize: 12, color: "#991B1B", fontWeight: 500, marginBottom: 6 }}>
                              "What's our exposure if EU AI Act enforcement begins before GA launch?"
                            </div>
                            <div style={{ fontSize: 11, color: "#7F1D1D", marginBottom: 8 }}>
                              Likely from: Audit Committee Chair, based on Q2 discussion
                            </div>
                            <div style={{ 
                              padding: 8, background: "#fff", borderRadius: 6, 
                              fontSize: 11, color: "#374151", borderLeft: "3px solid #F59E0B"
                            }}>
                              <strong>Prep note:</strong> CLO should have contingency timeline ready. Current deck doesn't address this.
                            </div>
                          </div>
                          <div style={{ 
                            padding: 12, background: "#FEF2F2", borderRadius: 8, 
                            border: "1px solid #FECACA"
                          }}>
                            <div style={{ fontSize: 12, color: "#991B1B", fontWeight: 500, marginBottom: 6 }}>
                              "What happened to the go/no-go criteria we asked for?"
                            </div>
                            <div style={{ fontSize: 11, color: "#7F1D1D", marginBottom: 8 }}>
                              Open loop from Q2 — still not in deck
                            </div>
                            <div style={{ 
                              padding: 8, background: "#fff", borderRadius: 6, 
                              fontSize: 11, color: "#374151", borderLeft: "3px solid #F59E0B"
                            }}>
                              <strong>Prep note:</strong> CEO needs talking points. Consider adding appendix slide.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Narrative vs Reality */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>NARRATIVE VS. RISK REGISTER</div>
                        <div style={{ 
                          padding: 12, background: "#FEF3C7", borderRadius: 8, 
                          border: "1px solid #FDE68A", fontSize: 12
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #FDE68A" }}>
                            <span style={{ color: "#92400E" }}>Slide says:</span>
                            <span style={{ fontWeight: 600, color: "#059669" }}>AI Launch "On Track"</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#92400E" }}>Risk register says:</span>
                            <span style={{ fontWeight: 600, color: "#DC2626" }}>AI Regulatory = Critical ↑</span>
                          </div>
                          <div style={{ marginTop: 10, fontSize: 11, color: "#B45309" }}>
                            Board members using GovernAI will see this discrepancy.
                          </div>
                        </div>
                      </div>

                    </>
                  )}
                </div>
              )}

              {aiPanelMode === "meeting" && (
                <div>
                  {/* Meeting Health */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>PREP STATUS</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ padding: 12, background: "#FEF3C7", borderRadius: 8, border: "1px solid #FDE68A" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#B45309" }}>Needs Attn</div>
                        <div style={{ fontSize: 11, color: "#92400E" }}>2 overdue actions</div>
                      </div>
                      <div style={{ padding: 12, background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>3</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>Open loops from Q2</div>
                      </div>
                    </div>
                  </div>

                  {/* Are We Talking About This Enough? */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>TOPIC COVERAGE (LAST 4 MEETINGS)</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {[
                        { topic: "Risk & Compliance", meetings: "4/4", avgMinutes: 22, trend: "stable", note: null },
                        { topic: "Strategy", meetings: "4/4", avgMinutes: 35, trend: "up", note: null },
                        { topic: "Financial", meetings: "4/4", avgMinutes: 28, trend: "stable", note: null },
                        { topic: "Cybersecurity", meetings: "2/4", avgMinutes: 12, trend: "down", note: "Gap" },
                        { topic: "Succession", meetings: "1/4", avgMinutes: 8, trend: "down", note: "Gap" },
                      ].map(t => (
                        <div key={t.topic} style={{ 
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 10px", background: t.note ? "#FEF2F2" : "#F9FAFB", borderRadius: 6,
                          border: t.note ? "1px solid #FECACA" : "1px solid transparent"
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: t.note ? "#991B1B" : "#111827" }}>{t.topic}</div>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>{t.meetings} meetings · ~{t.avgMinutes} min avg</div>
                          </div>
                          {t.note && (
                            <span style={{ fontSize: 10, fontWeight: 600, color: "#DC2626", background: "#FEE2E2", padding: "2px 6px", borderRadius: 4 }}>
                              {t.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dogs Not Barking */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>🐕 QUESTIONS TO CONSIDER</div>
                    <div style={{ 
                      padding: 12, background: "#FEF2F2", borderRadius: 8, 
                      border: "1px solid #FECACA"
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#991B1B", marginBottom: 4 }}>
                        Cybersecurity coverage declining
                      </div>
                      <div style={{ fontSize: 11, color: "#7F1D1D", lineHeight: 1.5 }}>
                        Only 12 min avg over last 2 meetings, despite 3 critical cyber risks on register. 
                        Is this getting enough attention?
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {aiPanelMode === "actions" && (
                <div>
                  {/* Board Member Actions */}
                  {userRole === "board-member" && (
                    <>
                      {/* Agent Actions Header */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                          What would you like to do?
                        </div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>
                          GovernAI can help you prepare for this meeting
                        </div>
                      </div>

                      {/* Agent Actions */}
                      <div style={{ display: "grid", gap: 10 }}>
                        {/* One-click action */}
                        <div style={{ 
                          padding: 14, background: "#F9FAFB", borderRadius: 10, 
                          border: "1px solid #E5E7EB"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>
                              Add questions to my meeting notes
                            </div>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#ECFDF5", color: "#059669", fontWeight: 600 }}>
                              INSTANT
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                            Save the 2 suggested questions to your personal meeting notes
                          </div>
                          <button style={{ 
                            padding: "8px 14px", background: "#7C3AED", color: "#fff",
                            border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6
                          }}>
                            <span>✓</span> Add to Notes
                          </button>
                        </div>

                        {/* Agent draft action */}
                        <div style={{ 
                          padding: 14, background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)", 
                          borderRadius: 10, border: "1px solid #DDD6FE"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "#5B21B6", fontWeight: 600 }}>
                              Draft follow-up memo to CEO
                            </div>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#EDE9FE", color: "#7C3AED", fontWeight: 600 }}>
                              AGENT DRAFT
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                            Agent drafts a memo requesting clarification on AI regulatory go/no-go criteria. You review before sending.
                          </div>
                          <button style={{ 
                            padding: "8px 14px", background: "#fff", color: "#7C3AED",
                            border: "1px solid #7C3AED", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6
                          }}>
                            <span>✨</span> Generate Draft
                          </button>
                        </div>

                        {/* Autonomous agent action */}
                        <div style={{ 
                          padding: 14, background: "#FFFBEB", 
                          borderRadius: 10, border: "1px solid #FDE68A"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "#92400E", fontWeight: 600 }}>
                              Alert me if risk isn't discussed
                            </div>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#FEF3C7", color: "#B45309", fontWeight: 600 }}>
                              AUTONOMOUS
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                            During the meeting, agent monitors topics and alerts you if AI regulatory risk isn't covered by slide 6.
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button style={{ 
                              padding: "8px 14px", background: "#F59E0B", color: "#fff",
                              border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer"
                            }}>
                              Enable
                            </button>
                            <button style={{ 
                              padding: "8px 14px", background: "#fff", color: "#6B7280",
                              border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, cursor: "pointer"
                            }}>
                              Settings
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{ margin: "20px 0", borderTop: "1px solid #E5E7EB" }} />

                      {/* Meeting Action Items */}
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>
                        MEETING ACTION ITEMS ({ACTIONS.length})
                      </div>
                      <div style={{ display: "grid", gap: 6 }}>
                        {ACTIONS.slice(0, 3).map(action => (
                          <div key={action.id} style={{ 
                            padding: 10, background: "#fff", borderRadius: 8, 
                            border: "1px solid #E5E7EB", fontSize: 12
                          }}>
                            <div style={{ color: "#111827", marginBottom: 4 }}>{action.text}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 10, color: "#6B7280" }}>{action.owner}</span>
                              <StatusBadge status={action.status} />
                            </div>
                          </div>
                        ))}
                        <button style={{ 
                          padding: "8px", background: "none", border: "1px dashed #D1D5DB", 
                          borderRadius: 6, fontSize: 11, color: "#6B7280", cursor: "pointer"
                        }}>
                          View all {ACTIONS.length} items →
                        </button>
                      </div>
                    </>
                  )}

                  {/* Corporate Secretary Actions */}
                  {userRole === "corp-sec" && (
                    <>
                      {/* Urgent Banner */}
                      <div style={{ 
                        padding: 12, background: "#FEF2F2", borderRadius: 10, 
                        border: "1px solid #FECACA", marginBottom: 16
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16 }}>⚠️</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#DC2626" }}>2 urgent prep items</div>
                            <div style={{ fontSize: 11, color: "#991B1B" }}>Address before meeting starts</div>
                          </div>
                        </div>
                      </div>

                      {/* Agent Actions */}
                      <div style={{ display: "grid", gap: 10 }}>
                        {/* Draft slide action - URGENT */}
                        <div style={{ 
                          padding: 14, background: "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)", 
                          borderRadius: 10, border: "1px solid #FECACA"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "#991B1B", fontWeight: 600 }}>
                              Draft appendix slide
                            </div>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#FEE2E2", color: "#DC2626", fontWeight: 600 }}>
                              URGENT
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#7F1D1D", marginBottom: 12 }}>
                            Create "AI Launch Go/No-Go Criteria" slide addressing the Q2 open loop. Uses risk register data.
                          </div>
                          <button style={{ 
                            padding: "8px 14px", background: "#DC2626", color: "#fff",
                            border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6
                          }}>
                            <span>✨</span> Generate Slide
                          </button>
                        </div>

                        {/* Talking points action - URGENT */}
                        <div style={{ 
                          padding: 14, background: "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)", 
                          borderRadius: 10, border: "1px solid #FECACA"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "#991B1B", fontWeight: 600 }}>
                              Generate CEO talking points
                            </div>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#FEE2E2", color: "#DC2626", fontWeight: 600 }}>
                              URGENT
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#7F1D1D", marginBottom: 12 }}>
                            Prepare talking points for regulatory risk questions. References CLO's latest compliance assessment.
                          </div>
                          <button style={{ 
                            padding: "8px 14px", background: "#DC2626", color: "#fff",
                            border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6
                          }}>
                            <span>✨</span> Generate Draft
                          </button>
                        </div>

                        {/* Send reminders action */}
                        <div style={{ 
                          padding: 14, background: "#F9FAFB", 
                          borderRadius: 10, border: "1px solid #E5E7EB"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>
                              Send prep reminders
                            </div>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#ECFDF5", color: "#059669", fontWeight: 600 }}>
                              INSTANT
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                            Notify CLO and CRO they need to prepare regulatory talking points before the meeting.
                          </div>
                          <button style={{ 
                            padding: "8px 14px", background: "#7C3AED", color: "#fff",
                            border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6
                          }}>
                            <span>📧</span> Send Reminders
                          </button>
                        </div>

                        {/* Autonomous monitoring */}
                        <div style={{ 
                          padding: 14, background: "#FFFBEB", 
                          borderRadius: 10, border: "1px solid #FDE68A"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "#92400E", fontWeight: 600 }}>
                              Auto-capture action items
                            </div>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#FEF3C7", color: "#B45309", fontWeight: 600 }}>
                              AUTONOMOUS
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>
                            Agent listens during meeting and drafts action items for your review afterward.
                          </div>
                          <div style={{ 
                            display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", 
                            background: "#fff", borderRadius: 6, marginBottom: 8, fontSize: 11
                          }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", animation: "pulse 2s infinite" }} />
                            <span style={{ color: "#059669", fontWeight: 500 }}>Enabled</span>
                            <span style={{ color: "#6B7280" }}>·</span>
                            <span style={{ color: "#6B7280" }}>You approve before finalizing</span>
                          </div>
                          <button style={{ 
                            padding: "6px 10px", background: "none", color: "#6B7280",
                            border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 11, cursor: "pointer"
                          }}>
                            Configure →
                          </button>
                        </div>
                      </div>
                    </>
                  )}
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
    </div>
  );
}
