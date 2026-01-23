"use client";

import React, { useState } from "react";

// ============================================================================
// Types
// ============================================================================

type TimeRange = "quarter" | "year" | "all";

// ============================================================================
// Sample Data
// ============================================================================

const URGENT_ITEMS = [
  { id: 1, type: "overdue", title: "Vendor concentration mitigation plan", owner: "CPO", daysLate: 45, source: "Q2 Board Meeting" },
  { id: 2, type: "overdue", title: "AI regulatory go/no-go criteria", owner: "CLO", daysLate: 30, source: "Q2 Board Meeting" },
  { id: 3, type: "overdue", title: "C-suite succession plan update", owner: "CHRO", daysLate: 180, source: "Q1 Board Meeting" },
  { id: 4, type: "blind-spot", title: "AI Ethics & Bias - never discussed", riskLevel: "high", externalSignal: "EU AI Act requires documented bias testing" },
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

const DOGS_NOT_BARKING = [
  { topic: "Supply Chain Concentration", lastDiscussed: "Q4 2024", externalSignal: "3 peers reported disruptions in Q3", riskLevel: "high" },
  { topic: "AI Ethics & Bias", lastDiscussed: "Never", externalSignal: "EU AI Act requires bias testing; 4 peers added to agenda", riskLevel: "high" },
  { topic: "Interest Rate Hedging", lastDiscussed: "Q1 2025", externalSignal: "Fed signaling changes; peers discussing quarterly", riskLevel: "medium" },
  { topic: "Climate Risk Disclosure", lastDiscussed: "Q2 2024", externalSignal: "SEC rules effective 2026; peers avg 2 sessions/year", riskLevel: "medium" },
];

const PEER_SIGNALS = [
  { company: "Competitor A", topic: "AI Governance", context: "Board-level AI oversight committee formed", source: "Q3 Earnings", date: "Oct 15" },
  { company: "Competitor B", topic: "Cyber Training", context: "$2.3M board cyber training investment", source: "Press Release", date: "Oct 8" },
  { company: "Competitor C", topic: "Succession", context: "CEO succession timeline announced", source: "8-K Filing", date: "Sep 22" },
];

const TOPIC_ALLOCATION = [
  { topic: "Strategy", pct: 35, benchmark: 28, status: "above" },
  { topic: "Financial", pct: 28, benchmark: 25, status: "above" },
  { topic: "Risk & Compliance", pct: 18, benchmark: 24, status: "below" },
  { topic: "Cybersecurity", pct: 8, benchmark: 15, status: "below" },
  { topic: "Talent", pct: 6, benchmark: 12, status: "below" },
];

const PROMISES_VS_DELIVERY = [
  { promise: "Vendor mitigation plan", promisedQ: "Q2", status: "overdue", days: 45 },
  { promise: "AI go/no-go criteria", promisedQ: "Q2", status: "overdue", days: 30 },
  { promise: "Cyber insurance review", promisedQ: "Q3", status: "in-progress", days: 0 },
  { promise: "EU expansion risk assessment", promisedQ: "Q3", status: "delivered", days: 0 },
];

const MATURITY_COMPONENTS = [
  { id: "risk", name: "Risk Oversight", weight: 25, scores: [58, 62, 68, 64], description: "Coverage of key risk topics, frequency of deep-dives" },
  { id: "action", name: "Action Execution", weight: 25, scores: [65, 68, 72, 66], description: "Promises kept, items closed on time, follow-through" },
  { id: "engagement", name: "Board Engagement", weight: 20, scores: [64, 66, 73, 72], description: "Director participation, quality of discussion, prep" },
  { id: "peer", name: "Peer Alignment", weight: 15, scores: [61, 64, 71, 70], description: "How you compare to industry peers on key metrics" },
  { id: "compliance", name: "Compliance Posture", weight: 15, scores: [60, 65, 70, 68], description: "Regulatory readiness, disclosure quality, audit findings" },
];

const MATURITY_QUARTERS = ["Q4'24", "Q1'25", "Q2'25", "Q3'25"];

const DIRECTOR_EDUCATION = [
  { name: "Michael Torres", role: "Board Chair", credits: 20, required: 20, status: "complete", topics: ["ESG", "Risk Mgmt"] },
  { name: "Patricia Moore", role: "Risk Committee Chair", credits: 22, required: 20, status: "complete", topics: ["Cyber", "AI", "Regulatory"] },
  { name: "Sarah Chen", role: "Audit Committee Chair", credits: 18, required: 20, status: "on-track", topics: ["Cybersecurity", "AI Governance"] },
  { name: "David Thompson", role: "Director", credits: 12, required: 20, status: "on-track", topics: ["Financial Reporting"] },
  { name: "Angela Martinez", role: "Nom/Gov Chair", credits: 15, required: 20, status: "on-track", topics: ["Board Composition"] },
  { name: "James Wilson", role: "Director", credits: 10, required: 20, status: "on-track", topics: ["M&A", "Strategy"] },
  { name: "Jennifer Walsh", role: "Compensation Chair", credits: 8, required: 20, status: "behind", topics: ["Executive Comp"] },
  { name: "William Chang", role: "Director", credits: 6, required: 20, status: "behind", topics: [] },
  { name: "Robert Kim", role: "Director", credits: 4, required: 20, status: "at-risk", topics: [] },
  { name: "Elizabeth Brown", role: "Director", credits: 2, required: 20, status: "at-risk", topics: [] },
  { name: "Thomas Anderson", role: "Director", credits: 0, required: 20, status: "at-risk", topics: [] },
];

// ============================================================================
// Diligent Logo Component
// ============================================================================

function DiligentLogo({ height = 28 }: { height?: number }) {
  const aspectRatio = 200 / 222; // width/height from original viewBox crop
  const width = height * aspectRatio;
  return (
    <svg width={width} height={height} viewBox="0 0 200 222" fill="none">
      <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
      <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
      <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
    </svg>
  );
}

// ============================================================================
// Action Button Component
// ============================================================================

function ActionButton({ 
  onAction 
}: { 
  onAction: (type: string) => void;
}) {
  const [open, setOpen] = useState(false);
  
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "4px 8px", background: "none", border: "1px solid #E5E7EB",
          borderRadius: 4, fontSize: 11, color: "#6B7280", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 4
        }}
      >
        <span>⚡</span> Action
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: 4,
          background: "#fff", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          border: "1px solid #E5E7EB", overflow: "hidden", zIndex: 100, minWidth: 200
        }}>
          <button 
            onClick={() => { onAction("agent"); setOpen(false); }}
            style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F3F4F6" }}
          >
            <span style={{ fontSize: 14 }}>🤖</span>
            <div>
              <div style={{ fontWeight: 500, color: "#111827" }}>Create Agent Task</div>
              <div style={{ fontSize: 10, color: "#6B7280" }}>AI will work on this</div>
            </div>
          </button>
          <button 
            onClick={() => { onAction("assign"); setOpen(false); }}
            style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F3F4F6" }}
          >
            <span style={{ fontSize: 14 }}>👤</span>
            <div>
              <div style={{ fontWeight: 500, color: "#111827" }}>Assign for Review</div>
              <div style={{ fontSize: 10, color: "#6B7280" }}>Send to someone</div>
            </div>
          </button>
          <button 
            onClick={() => { onAction("delegate"); setOpen(false); }}
            style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 14 }}>↗️</span>
            <div>
              <div style={{ fontWeight: 500, color: "#111827" }}>Delegate</div>
              <div style={{ fontSize: 10, color: "#6B7280" }}>Make it someone else's problem</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function GovernanceDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("quarter");
  const [promptValue, setPromptValue] = useState("");
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [expandedCountdownWeek, setExpandedCountdownWeek] = useState<number | null>(2); // Current week
  const [showAllDirectors, setShowAllDirectors] = useState(false);

  const handleAction = (type: string, item?: string) => {
    setSelectedItem(item || null);
    if (type === "agent") {
      setShowAgentModal(true);
    }
  };

  // Calculate overall maturity scores
  const overallScores = MATURITY_QUARTERS.map((_, qIdx) => {
    return Math.round(
      MATURITY_COMPONENTS.reduce((sum, comp) => sum + (comp.scores[qIdx] * comp.weight / 100), 0)
    );
  });

  // Director education summary
  const directorSummary = {
    complete: DIRECTOR_EDUCATION.filter(d => d.status === "complete").length,
    onTrack: DIRECTOR_EDUCATION.filter(d => d.status === "on-track").length,
    behind: DIRECTOR_EDUCATION.filter(d => d.status === "behind").length,
    atRisk: DIRECTOR_EDUCATION.filter(d => d.status === "at-risk").length,
  };

  return (
    <div style={{ height: "calc(100vh - 56px)", background: "#0D0D0F", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      
      {/* ================================================================ */}
      {/* PROTOTYPE CONTEXT BANNER (above app UI) */}
      {/* ================================================================ */}
      
      <div style={{ flexShrink: 0, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: "#7C3AED", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", background: "rgba(124,58,237,0.15)", padding: "4px 10px", borderRadius: 4 }}>
              Prototype
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#F9FAFB" }}>GovernAI Effectiveness Dashboard</span>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                What you're seeing
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
                A real-time view of governance effectiveness — overdue commitments, blind spots, upcoming prep tasks, and how your board compares to peers.
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                What you can do
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
                Take action on any item with the ⚡ button — create an AI agent task, assign for review, or delegate. Ask GovernAI questions in the prompt below.
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                Why it matters
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
                Boards that proactively address gaps and track follow-through outperform peers. This dashboard surfaces what needs attention before it becomes a problem.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* APP CHROME WRAPPER */}
      {/* ================================================================ */}
      
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        maxWidth: 1152, 
        margin: "24px auto 0 auto", 
        width: "calc(100% - 48px)",
        background: "#fff",
        borderRadius: "12px 12px 0 0",
        boxShadow: "0 -4px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
        overflow: "hidden",
        minHeight: 0
      }}>
        
        {/* GOVERNAI APP HEADER with drop shadow */}
        <header style={{ 
          flexShrink: 0,
          background: "#1E3A5F", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          position: "relative",
          zIndex: 10
        }}>
          <div style={{ padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <DiligentLogo height={32} />
              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 12, marginLeft: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "-0.3px" }}>
                  GovernAI
                </div>
                <div style={{ fontSize: 9, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Effective Intelligence
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 18 }}>🔔</button>
              <div style={{ 
                width: 32, height: 32, borderRadius: "50%", 
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 600, color: "#fff"
              }}>
                JD
              </div>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* MAIN CONTENT */}
        {/* ================================================================ */}
        
        <main style={{ flex: 1, overflowY: "auto", background: "#F3F4F6", minHeight: 0 }}>
          <div style={{ padding: "24px", paddingBottom: 24 }}>
          
          {/* ============================================================ */}
          {/* TIER 1: URGENT - What needs attention RIGHT NOW */}
          {/* ============================================================ */}
          
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🚨</span>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Needs Attention Now</h2>
              <span style={{ fontSize: 11, color: "#DC2626", fontWeight: 600, background: "#FEF2F2", padding: "2px 8px", borderRadius: 6 }}>
                {URGENT_ITEMS.length} items
              </span>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {URGENT_ITEMS.map((item) => (
                <div 
                  key={item.id}
                  style={{ 
                    padding: 16, borderRadius: 10, background: "#fff",
                    border: "2px solid #FCA5A5",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ 
                      fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 600,
                      background: item.type === "overdue" ? "#FEE2E2" : "#FEF3C7",
                      color: item.type === "overdue" ? "#DC2626" : "#B45309"
                    }}>
                      {item.type === "overdue" ? `${item.daysLate}d OVERDUE` : "BLIND SPOT"}
                    </span>
                    <ActionButton onAction={(type) => handleAction(type, item.title)} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>
                    {item.type === "overdue" ? `Owner: ${item.owner} · ${item.source}` : item.externalSignal}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* TIER 1B: Countdown to Board Meeting - EXPANDED */}
          {/* ============================================================ */}
          
          <section style={{ marginBottom: 24 }}>
            <div style={{ 
              background: "linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)", 
              borderRadius: 12, padding: 20, color: "#fff" 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Countdown to Board Meeting</h3>
                  <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 0 0" }}>November 4, 2025</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "center", padding: "8px 20px", background: "rgba(255,255,255,0.1)", borderRadius: 8 }}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>12</div>
                    <div style={{ fontSize: 10, color: "#94A3B8" }}>days to go</div>
                  </div>
                </div>
              </div>
              
              {/* Week selector */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[4, 3, 2, 1].map((week) => {
                  const actions = COUNTDOWN_ACTIONS.filter(a => a.weeksOut === week);
                  const done = actions.filter(a => a.status === "done").length;
                  const total = actions.length;
                  const isSelected = expandedCountdownWeek === week;
                  const allDone = done === total;
                  
                  return (
                    <button
                      key={week}
                      onClick={() => setExpandedCountdownWeek(isSelected ? null : week)}
                      style={{ 
                        flex: 1, padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                        background: isSelected ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                        border: isSelected ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: allDone ? "#86EFAC" : "#94A3B8", fontWeight: 600 }}>
                          {allDone && "✓ "}{week}W OUT
                        </span>
                        <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{done}/{total}</span>
                      </div>
                      <div style={{ 
                        height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2 
                      }}>
                        <div style={{ 
                          height: "100%", borderRadius: 2,
                          width: `${(done / total) * 100}%`,
                          background: allDone ? "#22C55E" : "#60A5FA"
                        }} />
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Expanded action list */}
              {expandedCountdownWeek && (
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 12, fontWeight: 600 }}>
                    TASKS FOR {expandedCountdownWeek} WEEKS OUT
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {COUNTDOWN_ACTIONS.filter(a => a.weeksOut === expandedCountdownWeek).map((action, i) => (
                      <div 
                        key={i}
                        style={{ 
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "10px 12px", borderRadius: 6,
                          background: action.status === "done" ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${action.status === "done" ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ 
                            width: 20, height: 20, borderRadius: "50%", 
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: action.status === "done" ? "#22C55E" : action.status === "in-progress" ? "#F59E0B" : "rgba(255,255,255,0.1)",
                            fontSize: 10
                          }}>
                            {action.status === "done" ? "✓" : action.status === "in-progress" ? "⏳" : "○"}
                          </span>
                          <div>
                            <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{action.action}</div>
                            <div style={{ fontSize: 11, color: "#94A3B8" }}>Owner: {action.owner} · Due: {action.dueDate}</div>
                          </div>
                        </div>
                        <ActionButton onAction={(type) => handleAction(type, action.action)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ============================================================ */}
          {/* TIER 2: CONTEXT - What to know before the meeting */}
          {/* ============================================================ */}
          
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>📡</span>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>External Context</h2>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Dogs Not Barking */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>🐕 Dogs Not Barking</h3>
                  <ActionButton onAction={(type) => handleAction(type, "Dogs Not Barking analysis")} />
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {DOGS_NOT_BARKING.slice(0, 3).map((d, i) => (
                    <div key={i} style={{ 
                      padding: 10, borderRadius: 6,
                      background: d.riskLevel === "high" ? "#FEF2F2" : "#FFFBEB",
                      border: `1px solid ${d.riskLevel === "high" ? "#FECACA" : "#FDE68A"}`
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: d.riskLevel === "high" ? "#991B1B" : "#92400E" }}>
                          {d.topic}
                        </span>
                        <span style={{ fontSize: 9, color: "#6B7280" }}>Last: {d.lastDiscussed}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "#6B7280" }}>{d.externalSignal}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Peer Signals */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Peer Governance Signals</h3>
                  <ActionButton onAction={(type) => handleAction(type, "Peer benchmarking")} />
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {PEER_SIGNALS.map((p, i) => (
                    <div key={i} style={{ padding: 10, borderRadius: 6, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#E0E7FF", color: "#4338CA", fontWeight: 600 }}>
                          {p.topic}
                        </span>
                        <span style={{ fontSize: 9, color: "#9CA3AF" }}>{p.date}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#111827", marginBottom: 2 }}>{p.context}</div>
                      <div style={{ fontSize: 10, color: "#6B7280" }}>{p.company} · {p.source}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* GOVERNANCE MATURITY - FULL WIDTH */}
          {/* ============================================================ */}
          
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>📈</span>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Governance Maturity</h2>
            </div>
            
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              {/* Overall Score Row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #E5E7EB" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Overall Governance Score</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 48, fontWeight: 800, color: "#D97706" }}>{overallScores[3]}</span>
                    <span style={{ fontSize: 14, color: "#DC2626", fontWeight: 500 }}>↓ {overallScores[2] - overallScores[3]} from Q2</span>
                  </div>
                </div>
                
                {/* Mini trend */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
                  {overallScores.map((score, i) => {
                    const isLast = i === overallScores.length - 1;
                    const prev = i > 0 ? overallScores[i-1] : score;
                    const isDown = score < prev;
                    return (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: isLast ? (isDown ? "#DC2626" : "#059669") : "#6B7280", marginBottom: 4 }}>
                          {score}
                        </div>
                        <div style={{ 
                          width: 32, height: score * 0.6, borderRadius: 4,
                          background: isLast 
                            ? (isDown ? "linear-gradient(180deg, #FCA5A5, #DC2626)" : "linear-gradient(180deg, #86EFAC, #059669)")
                            : "#E5E7EB"
                        }} />
                        <div style={{ fontSize: 9, color: "#6B7280", marginTop: 4 }}>{MATURITY_QUARTERS[i]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Component Breakdown */}
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12, fontWeight: 600 }}>SCORE COMPONENTS</div>
              <div style={{ display: "grid", gap: 12 }}>
                {MATURITY_COMPONENTS.map((comp) => {
                  const currentScore = comp.scores[3];
                  const prevScore = comp.scores[2];
                  const trend = currentScore - prevScore;
                  return (
                    <div key={comp.id} style={{ display: "grid", gridTemplateColumns: "200px 1fr 80px 100px", alignItems: "center", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{comp.name}</div>
                        <div style={{ fontSize: 10, color: "#6B7280" }}>{comp.description}</div>
                      </div>
                      
                      {/* Progress bar with quarters */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {comp.scores.map((score, i) => {
                          const isLast = i === comp.scores.length - 1;
                          return (
                            <div key={i} style={{ flex: 1 }}>
                              <div style={{ 
                                height: 24, borderRadius: 4,
                                background: isLast 
                                  ? (score < comp.scores[i-1] ? "#FEE2E2" : "#ECFDF5")
                                  : "#F3F4F6",
                                display: "flex", alignItems: "center", justifyContent: "center"
                              }}>
                                <span style={{ 
                                  fontSize: 11, fontWeight: 600,
                                  color: isLast 
                                    ? (score < comp.scores[i-1] ? "#DC2626" : "#059669")
                                    : "#6B7280"
                                }}>
                                  {score}
                                </span>
                              </div>
                              <div style={{ fontSize: 8, color: "#9CA3AF", textAlign: "center", marginTop: 2 }}>{MATURITY_QUARTERS[i]}</div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div style={{ textAlign: "center" }}>
                        <span style={{ 
                          fontSize: 11, fontWeight: 600,
                          color: trend > 0 ? "#059669" : trend < 0 ? "#DC2626" : "#6B7280"
                        }}>
                          {trend > 0 ? `+${trend}` : trend}
                        </span>
                      </div>
                      
                      <div style={{ 
                        fontSize: 10, color: "#6B7280", textAlign: "right"
                      }}>
                        Weight: {comp.weight}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* TIER 3: TRACKING - Execution */}
          {/* ============================================================ */}
          
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>📊</span>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Execution Tracking</h2>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Promises vs Delivery */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Promises vs Delivery</h3>
                  <ActionButton onAction={(type) => handleAction(type, "Execution report")} />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {PROMISES_VS_DELIVERY.map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < PROMISES_VS_DELIVERY.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#111827" }}>{p.promise}</div>
                        <div style={{ fontSize: 10, color: "#6B7280" }}>Promised: {p.promisedQ}</div>
                      </div>
                      <span style={{
                        fontSize: 10, padding: "3px 8px", borderRadius: 4, fontWeight: 600,
                        background: p.status === "delivered" ? "#ECFDF5" : p.status === "in-progress" ? "#FEF3C7" : "#FEE2E2",
                        color: p.status === "delivered" ? "#047857" : p.status === "in-progress" ? "#B45309" : "#DC2626"
                      }}>
                        {p.status === "delivered" ? "✓ Delivered" : p.status === "in-progress" ? "In Progress" : `${p.days}d late`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Topic Allocation */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Board Attention vs Benchmark</h3>
                  <ActionButton onAction={(type) => handleAction(type, "Attention analysis")} />
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {TOPIC_ALLOCATION.map((t, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                        <span style={{ color: "#374151", fontWeight: 500 }}>{t.topic}</span>
                        <span style={{ color: t.status === "below" ? "#DC2626" : "#059669", fontWeight: 600 }}>
                          {t.pct}% {t.status === "below" ? "↓" : "↑"} (peer: {t.benchmark}%)
                        </span>
                      </div>
                      <div style={{ height: 6, background: "#E5E7EB", borderRadius: 3, position: "relative" }}>
                        <div style={{ 
                          height: "100%", borderRadius: 3,
                          width: `${t.pct}%`,
                          background: t.status === "below" ? "#F87171" : "#4ADE80"
                        }} />
                        {/* Benchmark marker */}
                        <div style={{ 
                          position: "absolute", top: -2, left: `${t.benchmark}%`,
                          width: 2, height: 10, background: "#374151", borderRadius: 1
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* DIRECTOR EDUCATION - EXPANDED */}
          {/* ============================================================ */}
          
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>🎓</span>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Director Education</h2>
                <span style={{ fontSize: 11, color: "#6B7280" }}>({DIRECTOR_EDUCATION.length} directors)</span>
              </div>
              <ActionButton onAction={(type) => handleAction(type, "Director education report")} />
            </div>
            
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              {/* Summary Row */}
              <div style={{ display: "flex", gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ flex: 1, padding: 12, background: "#ECFDF5", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#047857" }}>{directorSummary.complete}</div>
                  <div style={{ fontSize: 10, color: "#047857", fontWeight: 500 }}>Complete</div>
                </div>
                <div style={{ flex: 1, padding: 12, background: "#EFF6FF", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#1D4ED8" }}>{directorSummary.onTrack}</div>
                  <div style={{ fontSize: 10, color: "#1D4ED8", fontWeight: 500 }}>On Track</div>
                </div>
                <div style={{ flex: 1, padding: 12, background: "#FEF3C7", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#B45309" }}>{directorSummary.behind}</div>
                  <div style={{ fontSize: 10, color: "#B45309", fontWeight: 500 }}>Behind</div>
                </div>
                <div style={{ flex: 1, padding: 12, background: "#FEE2E2", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#DC2626" }}>{directorSummary.atRisk}</div>
                  <div style={{ fontSize: 10, color: "#DC2626", fontWeight: 500 }}>At Risk</div>
                </div>
              </div>
              
              {/* Director List */}
              <div style={{ display: "grid", gap: 8 }}>
                {(showAllDirectors ? DIRECTOR_EDUCATION : DIRECTOR_EDUCATION.slice(0, 6)).map((d, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      display: "grid", gridTemplateColumns: "180px 1fr 80px 80px", alignItems: "center", gap: 16,
                      padding: "10px 12px", borderRadius: 8,
                      background: d.status === "at-risk" ? "#FEF2F2" : d.status === "behind" ? "#FFFBEB" : "#F9FAFB",
                      border: `1px solid ${d.status === "at-risk" ? "#FECACA" : d.status === "behind" ? "#FDE68A" : "#E5E7EB"}`
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: "#6B7280" }}>{d.role}</div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#E5E7EB", borderRadius: 3 }}>
                        <div style={{ 
                          height: "100%", borderRadius: 3,
                          width: `${(d.credits / d.required) * 100}%`,
                          background: d.status === "complete" ? "#059669" : d.status === "on-track" ? "#3B82F6" : d.status === "behind" ? "#F59E0B" : "#DC2626"
                        }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", minWidth: 40 }}>{d.credits}/{d.required}</span>
                    </div>
                    
                    <div style={{ fontSize: 10, color: "#6B7280" }}>
                      {d.topics.length > 0 ? d.topics.slice(0, 2).join(", ") : "No courses"}
                    </div>
                    
                    <span style={{
                      fontSize: 9, padding: "3px 8px", borderRadius: 4, fontWeight: 600, textAlign: "center",
                      background: d.status === "complete" ? "#ECFDF5" : d.status === "on-track" ? "#EFF6FF" : d.status === "behind" ? "#FEF3C7" : "#FEE2E2",
                      color: d.status === "complete" ? "#047857" : d.status === "on-track" ? "#1D4ED8" : d.status === "behind" ? "#B45309" : "#DC2626"
                    }}>
                      {d.status.toUpperCase().replace("-", " ")}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Show More */}
              {DIRECTOR_EDUCATION.length > 6 && (
                <button
                  onClick={() => setShowAllDirectors(!showAllDirectors)}
                  style={{
                    width: "100%", marginTop: 12, padding: "10px",
                    background: "none", border: "1px solid #E5E7EB", borderRadius: 8,
                    fontSize: 12, color: "#6B7280", cursor: "pointer", fontWeight: 500
                  }}
                >
                  {showAllDirectors ? "Show Less" : `Show ${DIRECTOR_EDUCATION.length - 6} More Directors`}
                </button>
              )}
            </div>
          </section>

        </div>
        </main>
        
        {/* ================================================================ */}
        {/* PROMPT BAR - Fixed at bottom of app chrome */}
        {/* ================================================================ */}
        
        <div style={{ 
          flexShrink: 0,
          background: "#F3F4F6",
          padding: "16px 24px 24px 24px",
          borderTop: "1px solid #E5E7EB",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.05)"
        }}>
          <div style={{ 
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px",
            background: "#fff", 
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <input
              type="text"
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Ask GovernAI anything... e.g., 'Why is our risk coverage declining?' or 'Draft an agenda item for AI ethics'"
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontSize: 14, color: "#111827"
              }}
            />
            <button style={{
              padding: "8px 16px", background: "#1E3A5F", color: "#fff",
              border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
              Ask
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, paddingLeft: 44 }}>
            {["Why is governance score declining?", "Draft board agenda for AI risk", "Compare us to peers on cyber"].map((q) => (
              <button
                key={q}
                onClick={() => setPromptValue(q)}
                style={{
                  padding: "4px 10px", background: "#fff", 
                  border: "1px solid #E5E7EB", borderRadius: 6,
                  fontSize: 11, color: "#6B7280", cursor: "pointer"
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* AGENT MODAL */}
      {/* ================================================================ */}
      
      {showAgentModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: 24, width: 480,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>🤖 Create Agent Task</h3>
              <button 
                onClick={() => setShowAgentModal(false)}
                style={{ background: "none", border: "none", fontSize: 20, color: "#9CA3AF", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>What should the agent do?</div>
              <div style={{ padding: 12, background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>
                  {selectedItem || "Analyze and provide recommendations"}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Agent autonomy</div>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { level: "Draft for review", desc: "Agent creates draft, you approve before action" },
                  { level: "Execute with notification", desc: "Agent acts, you get notified of results" },
                  { level: "Fully autonomous", desc: "Agent handles end-to-end, reports on completion" },
                ].map((opt, i) => (
                  <label key={i} style={{ 
                    display: "flex", alignItems: "flex-start", gap: 10, padding: 10, 
                    background: "#F9FAFB", borderRadius: 6, cursor: "pointer",
                    border: i === 0 ? "2px solid #1E3A5F" : "1px solid #E5E7EB"
                  }}>
                    <input type="radio" name="autonomy" defaultChecked={i === 0} style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{opt.level}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setShowAgentModal(false)}
                style={{ flex: 1, padding: "10px", background: "#F3F4F6", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAgentModal(false)}
                style={{ flex: 1, padding: "10px", background: "#1E3A5F", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Create Agent Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
