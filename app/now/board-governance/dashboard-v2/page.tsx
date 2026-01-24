"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  AlertCircle, 
  EyeOff, 
  Scale, 
  BarChart3, 
  TrendingUp, 
  Target, 
  ClipboardCheck, 
  Activity, 
  GraduationCap, 
  Bot, 
  Zap, 
  Sparkles,
  Users,
  Radio,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

type PeerGroup = "industry" | "cloud" | "ai";
type TabId = "external" | "trends" | "signals" | "execution" | "maturity" | "education";

// ============================================================================
// Sample Data (same as v1)
// ============================================================================

const URGENT_ITEMS = [
  { id: 1, type: "overdue", title: "AI regulatory go/no-go criteria", owner: "CLO", daysLate: 30, source: "Q2 Board Meeting", suggestedAction: "Generate EU AI Act readiness checklist", actionType: "agent-draft" },
  { id: 2, type: "blind-spot", title: "AI Ethics & Bias - never discussed", riskLevel: "high", externalSignal: "EU AI Act requires documented bias testing", suggestedAction: "Add to next board agenda with briefing", actionType: "agent-draft" },
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

const PEER_GROUPS = [
  { id: "industry" as const, label: "Mega-cap Software", count: 8, isPrimary: true },
  { id: "cloud" as const, label: "Cloud Platforms", count: 5, isPrimary: false },
  { id: "ai" as const, label: "AI Infra", count: 6, isPrimary: false },
];

const PEER_SIGNALS = [
  { company: "Peer A", topic: "AI Governance", context: "Board-level AI oversight committee formed", source: "Q3 Earnings", date: "Oct 15" },
  { company: "Peer B", topic: "Cyber Training", context: "$2.3M board cyber training investment", source: "Press Release", date: "Oct 8" },
  { company: "Peer C", topic: "Succession", context: "CEO succession timeline announced", source: "8-K Filing", date: "Sep 22" },
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

const TOPIC_EVOLUTION = {
  quarters: ["Q4'24", "Q1'25", "Q2'25", "Q3'25"],
  topics: [
    { name: "AI Ethics & Governance", trend: "emerging", mentions: [0, 2, 5, 8], sentiment: "concern", note: "EU AI Act driving urgency" },
    { name: "Geopolitical Risk", trend: "emerging", mentions: [1, 3, 6, 9], sentiment: "concern", note: "Supply chain and market access" },
    { name: "Workforce AI Displacement", trend: "emerging", mentions: [0, 1, 3, 5], sentiment: "mixed", note: "Union concerns, reskilling costs" },
    { name: "Cybersecurity", trend: "steady", mentions: [7, 8, 7, 8], sentiment: "neutral", note: "Consistent focus" },
    { name: "Financial Performance", trend: "steady", mentions: [12, 11, 12, 11], sentiment: "positive", note: "Core agenda item" },
    { name: "Inflation Response", trend: "declining", mentions: [9, 7, 4, 2], sentiment: "positive", note: "Rates stabilizing" },
    { name: "Remote Work Policy", trend: "declining", mentions: [6, 4, 2, 1], sentiment: "neutral", note: "Policies settled" },
    { name: "Crypto Exposure", trend: "declining", mentions: [5, 3, 1, 0], sentiment: "positive", note: "Exited positions" },
  ]
};

const SENTIMENT_SIGNALS = [
  { type: "positive", text: "Best GRR in company history", source: "CEO Update, Q3", meeting: "Q3'25" },
  { type: "positive", text: "AI product launch ahead of schedule", source: "Product Review, Q3", meeting: "Q3'25" },
  { type: "positive", text: "Zero material audit findings", source: "Audit Committee, Q2", meeting: "Q2'25" },
  { type: "concern", text: "New sales 68% to budget — not prominently addressed", source: "Financial Review, Q3", meeting: "Q3'25" },
  { type: "concern", text: "Regulatory timeline concerns raised but no follow-up scheduled", source: "Risk Committee, Q2", meeting: "Q2'25" },
  { type: "concern", text: "Third consecutive quarter succession planning deferred", source: "Talent Review, Q3", meeting: "Q3'25" },
  { type: "concern", text: "Customer churn uptick mentioned once, no deep-dive", source: "CEO Update, Q3", meeting: "Q3'25" },
];

const ACTION_METRICS = {
  raised: 47,
  closed: 31,
  open: 12,
  overdue: 4,
  avgDaysToClose: 34,
  avgDaysLastQ: 28,
};

// Owner accountability data
const OWNER_ACCOUNTABILITY = [
  { name: "CLO", open: 4, overdue: 2, avgDays: 45, closed: 8 },
  { name: "CFO", open: 3, overdue: 0, avgDays: 22, closed: 12 },
  { name: "CISO", open: 2, overdue: 1, avgDays: 38, closed: 6 },
  { name: "CHRO", open: 2, overdue: 1, avgDays: 52, closed: 3 },
  { name: "Corp Sec", open: 1, overdue: 0, avgDays: 18, closed: 9 },
];

// Meeting-to-meeting carryover
const MEETING_CARRYOVER = [
  { meeting: "Q4'24", newItems: 12, carriedOver: 3, closedInMeeting: 8, carryoverRate: 25 },
  { meeting: "Q1'25", newItems: 14, carriedOver: 4, closedInMeeting: 11, carryoverRate: 29 },
  { meeting: "Q2'25", newItems: 11, carriedOver: 5, closedInMeeting: 9, carryoverRate: 36 },
  { meeting: "Q3'25", newItems: 10, carriedOver: 6, closedInMeeting: 7, carryoverRate: 46 },
];

// Committee effectiveness
const COMMITTEE_EFFECTIVENESS = [
  { name: "Audit Committee", items: 18, closed: 16, onTime: 15, effectiveness: 89 },
  { name: "Risk Committee", items: 14, closed: 10, onTime: 8, effectiveness: 71 },
  { name: "Compensation", items: 8, closed: 7, onTime: 6, effectiveness: 86 },
  { name: "Nom/Gov", items: 7, closed: 4, onTime: 3, effectiveness: 57 },
];

// Regulatory radar
const REGULATORY_RADAR = [
  { regulation: "EU AI Act", deadline: "Aug 2025", daysOut: 45, impact: "high", status: "not-discussed", note: "Requires AI system documentation & bias testing" },
  { regulation: "SEC Climate Disclosure", deadline: "Q1 2026", daysOut: 120, impact: "high", status: "in-progress", note: "Scope 1 & 2 emissions reporting required" },
  { regulation: "DORA (EU)", deadline: "Jan 2025", daysOut: 30, impact: "medium", status: "addressed", note: "Digital operational resilience requirements" },
  { regulation: "California Privacy (CPRA)", deadline: "Ongoing", daysOut: null, impact: "medium", status: "in-progress", note: "Enhanced consumer data rights" },
];

// Investor concerns - top themes from earnings calls/investor meetings
const INVESTOR_CONCERNS = [
  { theme: "AI monetization timeline", mentions: 12, trend: "rising", lastRaised: "Q3 Earnings", sentiment: "skeptical" },
  { theme: "Cloud margin pressure", mentions: 8, trend: "steady", lastRaised: "Investor Day", sentiment: "concerned" },
  { theme: "Capital allocation priorities", mentions: 6, trend: "rising", lastRaised: "Q3 Earnings", sentiment: "neutral" },
  { theme: "Regulatory risk exposure", mentions: 5, trend: "rising", lastRaised: "Analyst call", sentiment: "concerned" },
];

// ============================================================================
// Components
// ============================================================================

function DiligentLogo({ height = 28 }: { height?: number }) {
  const aspectRatio = 200 / 222;
  const width = height * aspectRatio;
  return (
    <svg width={width} height={height} viewBox="0 0 200 222" fill="none">
      <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
      <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
      <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
    </svg>
  );
}

function ActionButton({ onAction }: { onAction: (type: string) => void }) {
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
        <Zap size={12} /> Action
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
            <Bot size={16} style={{ color: "#6B7280" }} />
            <div>
              <div style={{ fontWeight: 500, color: "#111827" }}>Create Agent Task</div>
              <div style={{ fontSize: 10, color: "#6B7280" }}>AI will work on this</div>
            </div>
          </button>
          <button 
            onClick={() => { onAction("assign"); setOpen(false); }}
            style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F3F4F6" }}
          >
            <Users size={16} style={{ color: "#6B7280" }} />
            <div>
              <div style={{ fontWeight: 500, color: "#111827" }}>Assign for Review</div>
              <div style={{ fontSize: 10, color: "#6B7280" }}>Send to someone</div>
            </div>
          </button>
          <button 
            onClick={() => { onAction("delegate"); setOpen(false); }}
            style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}
          >
            <Target size={16} style={{ color: "#6B7280" }} />
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

// Tab definitions
const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "external", label: "External Context", icon: <Radio size={14} /> },
  { id: "trends", label: "Topic Trends", icon: <TrendingUp size={14} /> },
  { id: "signals", label: "Signals & Actions", icon: <Target size={14} /> },
  { id: "execution", label: "Execution Tracking", icon: <ClipboardCheck size={14} /> },
  { id: "maturity", label: "Governance Maturity", icon: <Activity size={14} /> },
  { id: "education", label: "Director Education", icon: <GraduationCap size={14} /> },
];

// ============================================================================
// Main Page
// ============================================================================

export default function GovernanceDashboardV2Page() {
  const [peerGroup, setPeerGroup] = useState<PeerGroup>("industry");
  const [promptValue, setPromptValue] = useState("");
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [expandedCountdownWeek, setExpandedCountdownWeek] = useState<number | null>(2);
  const [showAllDirectors, setShowAllDirectors] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("external");

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
      {/* PROTOTYPE CONTEXT BANNER */}
      {/* ================================================================ */}
      
      <div style={{ flexShrink: 0, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: "#7C3AED", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", background: "rgba(124,58,237,0.15)", padding: "4px 10px", borderRadius: 4 }}>
                Prototype v2
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#F9FAFB" }}>GovernAI Effectiveness Dashboard: Microsoft</span>
              <span style={{ fontSize: 11, color: "#6B7280" }}>— Tabbed layout (less busy)</span>
            </div>
            <Link 
              href="/now/board-governance/dashboard"
              style={{ fontSize: 11, color: "#7C3AED", textDecoration: "none" }}
            >
              ← View detailed version
            </Link>
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
        
        {/* GOVERNAI APP HEADER */}
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
            
            <div style={{ 
                width: 32, height: 32, borderRadius: "50%", 
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 600, color: "#fff"
              }}>
                JD
              </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* MAIN CONTENT */}
        {/* ================================================================ */}
        
        <main style={{ flex: 1, overflowY: "auto", background: "#fff", minHeight: 0 }}>
          <div style={{ padding: "24px" }}>
          
          {/* ============================================================ */}
          {/* URGENT ITEMS - Always visible */}
          {/* ============================================================ */}
          
          <section style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <AlertCircle size={16} style={{ color: "#DC2626" }} />
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>Needs Attention Now</h2>
              <span style={{ fontSize: 10, color: "#DC2626", fontWeight: 600, background: "#FEF2F2", padding: "2px 6px", borderRadius: 4 }}>
                {URGENT_ITEMS.length}
              </span>
            </div>
            
            <div style={{ display: "grid", gap: 6 }}>
              {URGENT_ITEMS.map((item) => (
                <div 
                  key={item.id}
                  style={{ 
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px", borderRadius: 8, background: "#fff",
                    border: "1px solid #FCA5A5"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ 
                      fontSize: 8, padding: "2px 5px", borderRadius: 3, fontWeight: 600,
                      background: item.type === "overdue" ? "#FEE2E2" : "#FEF3C7",
                      color: item.type === "overdue" ? "#DC2626" : "#B45309"
                    }}>
                      {item.type === "overdue" ? `${item.daysLate}d LATE` : "BLIND SPOT"}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{item.title}</span>
                  </div>
                  <button 
                    onClick={() => handleAction("agent", item.suggestedAction)}
                    style={{
                      padding: "4px 10px", background: "#15803D", color: "#fff",
                      border: "none", borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    <Bot size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} /> Deploy Agent
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* COUNTDOWN - Softer blue background */}
          {/* ============================================================ */}
          
          <section style={{ marginBottom: 20 }}>
            <div style={{ 
              background: "#EFF6FF", 
              borderRadius: 10, 
              padding: 16,
              border: "1px solid #BFDBFE"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1E3A5F", margin: 0 }}>Countdown to Board Meeting</h3>
                  <p style={{ fontSize: 11, color: "#64748B", margin: "2px 0 0 0" }}>November 4, 2025</p>
                </div>
                <div style={{ textAlign: "center", padding: "6px 16px", background: "rgba(30, 58, 95, 0.15)", borderRadius: 6, border: "1px solid rgba(30, 58, 95, 0.2)" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#1E3A5F" }}>12</div>
                  <div style={{ fontSize: 9, color: "#64748B" }}>days</div>
                </div>
              </div>
              
              {/* Week selector - compact */}
              <div style={{ display: "flex", gap: 6 }}>
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
                        flex: 1, padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                        background: isSelected ? "rgba(30, 58, 95, 0.15)" : "#fff",
                        border: `1px solid ${isSelected ? "rgba(30, 58, 95, 0.3)" : "#DBEAFE"}`,
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: 10, color: isSelected ? "#1E3A5F" : (allDone ? "#059669" : "#64748B"), fontWeight: 600 }}>
                        {allDone && "✓ "}{week}W
                      </div>
                      <div style={{ fontSize: 11, color: "#1E3A5F", fontWeight: 700 }}>{done}/{total}</div>
                    </button>
                  );
                })}
              </div>
              
              {/* Expanded tasks */}
              {expandedCountdownWeek && (
                <div style={{ marginTop: 12, background: "#fff", borderRadius: 6, padding: 12, border: "1px solid #DBEAFE" }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    {COUNTDOWN_ACTIONS.filter(a => a.weeksOut === expandedCountdownWeek).map((action, i) => (
                      <div 
                        key={i}
                        style={{ 
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "8px 10px", borderRadius: 4,
                          background: action.status === "done" ? "#F0FDF4" : "#F9FAFB",
                          border: `1px solid ${action.status === "done" ? "#D1FAE5" : "#E5E7EB"}`
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ 
                            width: 16, height: 16, borderRadius: "50%", 
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: action.status === "done" ? "#22C55E" : action.status === "in-progress" ? "#F59E0B" : "#E5E7EB",
                            fontSize: 8, color: "#fff"
                          }}>
                            {action.status === "done" ? "✓" : action.status === "in-progress" ? "⏳" : ""}
                          </span>
                          <span style={{ fontSize: 11, color: "#374151" }}>{action.action}</span>
                        </div>
                        <span style={{ fontSize: 10, color: "#6B7280" }}>{action.owner}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ============================================================ */}
          {/* TABS */}
          {/* ============================================================ */}
          
          <div style={{ 
            display: "flex", 
            gap: 0, 
            marginBottom: 0,
            borderBottom: "1px solid #E5E7EB",
          }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "10px 16px",
                  background: activeTab === tab.id ? "#fff" : "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderBottom: activeTab === tab.id ? "1px solid #fff" : "1px solid #E5E7EB",
                  borderRadius: "8px 8px 0 0",
                  marginBottom: -1,
                  marginRight: -1,
                  fontSize: 12,
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  color: activeTab === tab.id ? "#111827" : "#6B7280",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ============================================================ */}
          {/* TAB CONTENT */}
          {/* ============================================================ */}
          
          <div style={{ padding: "20px 0" }}>
            
            {/* EXTERNAL CONTEXT TAB */}
            {activeTab === "external" && (
              <div style={{ display: "grid", gap: 16 }}>
                {/* Top row - 2 columns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Dogs Not Barking */}
                  <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 6 }}><EyeOff size={14} /> Dogs Not Barking</h3>
                      <ActionButton onAction={(type) => handleAction(type, "Dogs Not Barking analysis")} />
                    </div>
                    <p style={{ fontSize: 10, color: "#6B7280", margin: "0 0 12px 0", fontStyle: "italic" }}>
                      Meaningful silence: monitoring what's not happening as signal
                    </p>
                    <div style={{ display: "grid", gap: 8 }}>
                      {DOGS_NOT_BARKING.map((d, i) => (
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
                  <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Peer Governance Signals</h3>
                      <ActionButton onAction={(type) => handleAction(type, "Peer benchmarking")} />
                    </div>
                    {/* Peer Group Selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
                      {PEER_GROUPS.map((pg) => (
                        <div key={pg.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {pg.isPrimary && (
                            <span style={{ fontSize: 9, color: "#6B7280", marginRight: 2 }}>Primary:</span>
                          )}
                          <button
                            onClick={() => setPeerGroup(pg.id)}
                            style={{
                              padding: "4px 8px", borderRadius: 4, fontSize: 10, fontWeight: 500, cursor: "pointer",
                              background: peerGroup === pg.id ? "#1E3A5F" : "#F3F4F6",
                              border: "none",
                              color: peerGroup === pg.id ? "#fff" : "#6B7280",
                            }}
                          >
                            {pg.label} ({pg.count})
                          </button>
                        </div>
                      ))}
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
                
                {/* Bottom row - 2 columns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Regulatory Radar */}
                  <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 6 }}><Scale size={14} /> Regulatory Radar</h3>
                        <p style={{ fontSize: 10, color: "#6B7280", margin: "2px 0 0 0" }}>Upcoming regulations requiring board attention</p>
                      </div>
                      <ActionButton onAction={(type) => handleAction(type, "Regulatory readiness")} />
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {REGULATORY_RADAR.map((r, i) => (
                        <div key={i} style={{ 
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: 10, borderRadius: 6,
                          background: r.status === "not-discussed" ? "#FEF2F2" : r.status === "in-progress" ? "#FFFBEB" : "#F0FDF4",
                          border: `1px solid ${r.status === "not-discussed" ? "#FECACA" : r.status === "in-progress" ? "#FDE68A" : "#D1FAE5"}`
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{r.regulation}</span>
                              <span style={{ 
                                fontSize: 8, padding: "2px 5px", borderRadius: 3, fontWeight: 600,
                                background: r.impact === "high" ? "#FEE2E2" : "#FEF3C7",
                                color: r.impact === "high" ? "#DC2626" : "#B45309"
                              }}>
                                {r.impact.toUpperCase()}
                              </span>
                            </div>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>{r.note}</div>
                          </div>
                          <div style={{ textAlign: "right", marginLeft: 12 }}>
                            {r.daysOut !== null ? (
                              <>
                                <div style={{ 
                                  fontSize: 16, fontWeight: 700, 
                                  color: r.daysOut <= 30 ? "#DC2626" : r.daysOut <= 60 ? "#B45309" : "#374151" 
                                }}>
                                  {r.daysOut}d
                                </div>
                                <div style={{ fontSize: 9, color: "#6B7280" }}>{r.deadline}</div>
                              </>
                            ) : (
                              <div style={{ fontSize: 10, color: "#6B7280" }}>{r.deadline}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Investor Concerns */}
                  <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 6 }}><BarChart3 size={14} /> Investor Concerns</h3>
                        <p style={{ fontSize: 10, color: "#6B7280", margin: "2px 0 0 0" }}>Top themes from earnings calls & investor meetings</p>
                      </div>
                      <ActionButton onAction={(type) => handleAction(type, "Investor sentiment analysis")} />
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {INVESTOR_CONCERNS.map((c, i) => (
                        <div key={i} style={{ 
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: 10, borderRadius: 6, background: "#F9FAFB", border: "1px solid #E5E7EB"
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                              <span style={{ fontSize: 12, fontWeight: 500, color: "#111827" }}>{c.theme}</span>
                              {c.trend === "rising" && (
                                <span style={{ fontSize: 9, color: "#DC2626", fontWeight: 600 }}>↑ Rising</span>
                              )}
                            </div>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>
                              Last raised: {c.lastRaised} · Sentiment: {c.sentiment}
                            </div>
                          </div>
                          <div style={{ textAlign: "right", marginLeft: 12 }}>
                            <div style={{ 
                              fontSize: 18, fontWeight: 700, 
                              color: c.mentions >= 10 ? "#DC2626" : c.mentions >= 6 ? "#B45309" : "#374151" 
                            }}>
                              {c.mentions}
                            </div>
                            <div style={{ fontSize: 9, color: "#6B7280" }}>mentions</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOPIC TRENDS TAB */}
            {activeTab === "trends" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Topic Evolution Over Time</h3>
                    <p style={{ fontSize: 10, color: "#6B7280", margin: "4px 0 0 0" }}>How board attention has shifted across the last 4 meetings</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 10 }}>
                    <span style={{ color: "#059669" }}>● Emerging</span>
                    <span style={{ color: "#6B7280" }}>● Steady</span>
                    <span style={{ color: "#9CA3AF" }}>● Declining</span>
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "180px repeat(4, 1fr) 100px", gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>TOPIC</div>
                  {TOPIC_EVOLUTION.quarters.map(q => (
                    <div key={q} style={{ fontSize: 10, color: "#6B7280", textAlign: "center", fontWeight: 500 }}>{q}</div>
                  ))}
                  <div style={{ fontSize: 10, color: "#6B7280", textAlign: "right", fontWeight: 500 }}>TREND</div>
                </div>
                
                <div style={{ display: "grid", gap: 6 }}>
                  {TOPIC_EVOLUTION.topics.map((topic, i) => (
                    <div key={i} style={{ 
                      display: "grid", gridTemplateColumns: "180px repeat(4, 1fr) 100px", gap: 8, alignItems: "center",
                      padding: "8px 0",
                      borderBottom: i < TOPIC_EVOLUTION.topics.length - 1 ? "1px solid #F3F4F6" : "none"
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#111827" }}>{topic.name}</div>
                        <div style={{ fontSize: 10, color: "#9CA3AF" }}>{topic.note}</div>
                      </div>
                      {topic.mentions.map((count, qi) => {
                        const maxMentions = Math.max(...TOPIC_EVOLUTION.topics.flatMap(t => t.mentions));
                        const intensity = count / maxMentions;
                        return (
                          <div key={qi} style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: 6,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 12, fontWeight: 600,
                              background: count === 0 ? "#F9FAFB" : 
                                topic.trend === "emerging" ? `rgba(5, 150, 105, ${0.1 + intensity * 0.4})` :
                                topic.trend === "declining" ? `rgba(156, 163, 175, ${0.1 + intensity * 0.2})` :
                                `rgba(59, 130, 246, ${0.1 + intensity * 0.3})`,
                              color: count === 0 ? "#D1D5DB" :
                                topic.trend === "emerging" ? "#047857" :
                                topic.trend === "declining" ? "#6B7280" :
                                "#1D4ED8"
                            }}>
                              {count}
                            </div>
                          </div>
                        );
                      })}
                      <div style={{ textAlign: "right" }}>
                        <span style={{
                          fontSize: 10, padding: "4px 10px", borderRadius: 4, fontWeight: 600,
                          background: topic.trend === "emerging" ? "#ECFDF5" : topic.trend === "declining" ? "#F3F4F6" : "#EFF6FF",
                          color: topic.trend === "emerging" ? "#047857" : topic.trend === "declining" ? "#6B7280" : "#1D4ED8"
                        }}>
                          {topic.trend === "emerging" ? "↑ EMERGING" : topic.trend === "declining" ? "↓ FADING" : "— STEADY"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SIGNALS & ACTIONS TAB */}
            {activeTab === "signals" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Narrative vs Reality</h3>
                    <p style={{ fontSize: 10, color: "#6B7280", margin: "4px 0 0 0" }}>Is the board "walking its talk"? Signals from recent meetings with suggested actions.</p>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ padding: "8px 16px", background: "#ECFDF5", borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#047857" }}>
                        {SENTIMENT_SIGNALS.filter(s => s.type === "positive").length}
                      </div>
                      <div style={{ fontSize: 9, color: "#047857" }}>Positive</div>
                    </div>
                    <div style={{ padding: "8px 16px", background: "#FEF2F2", borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#DC2626" }}>
                        {SENTIMENT_SIGNALS.filter(s => s.type === "concern").length}
                      </div>
                      <div style={{ fontSize: 9, color: "#DC2626" }}>Red flags</div>
                    </div>
                  </div>
                </div>
                
                {/* Action velocity summary */}
                <div style={{ display: "flex", gap: 24, padding: "12px 16px", background: "#F9FAFB", borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 11 }}>
                    <span style={{ color: "#6B7280" }}>Action Velocity:</span>
                    <span style={{ marginLeft: 8 }}><strong>{ACTION_METRICS.raised}</strong> raised</span>
                    <span style={{ marginLeft: 8 }}><strong>{ACTION_METRICS.closed}</strong> closed</span>
                    <span style={{ marginLeft: 8, color: "#DC2626" }}><strong>{ACTION_METRICS.overdue}</strong> overdue</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>
                    Avg {ACTION_METRICS.avgDaysToClose}d to close (was {ACTION_METRICS.avgDaysLastQ}d last quarter)
                  </div>
                </div>
                
                {/* Signals with actions */}
                <div style={{ display: "grid", gap: 10 }}>
                  {SENTIMENT_SIGNALS.map((signal, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center",
                      padding: "12px 16px", borderRadius: 8,
                      background: signal.type === "positive" ? "#F0FDF4" : "#FEF2F2",
                      border: `1px solid ${signal.type === "positive" ? "#D1FAE5" : "#FECACA"}`
                    }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ 
                            fontSize: 9, padding: "2px 6px", borderRadius: 3, fontWeight: 600,
                            background: signal.type === "positive" ? "#D1FAE5" : "#FECACA",
                            color: signal.type === "positive" ? "#047857" : "#DC2626"
                          }}>
                            {signal.type === "positive" ? "POSITIVE" : "RED FLAG"}
                          </span>
                          <span style={{ fontSize: 10, color: "#6B7280" }}>{signal.meeting}</span>
                        </div>
                        <div style={{ fontSize: 13, color: "#111827", fontWeight: 500, marginBottom: 2 }}>
                          {signal.text}
                        </div>
                        <div style={{ fontSize: 10, color: "#6B7280" }}>{signal.source}</div>
                      </div>
                      
                      {/* Suggested action */}
                      <div style={{ 
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 12px", 
                        background: "#fff", 
                        borderRadius: 6,
                        border: "1px solid #E5E7EB"
                      }}>
                        <Bot size={14} style={{ color: "#374151" }} />
                        <span style={{ fontSize: 11, color: "#374151" }}>
                          {signal.type === "positive" 
                            ? "Share with stakeholders" 
                            : signal.text.includes("succession") 
                              ? "Schedule succession review"
                              : signal.text.includes("sales") || signal.text.includes("budget")
                                ? "Request deep-dive analysis"
                                : signal.text.includes("churn")
                                  ? "Generate churn report"
                                  : "Add to next agenda"
                          }
                        </span>
                        <button 
                          onClick={() => handleAction("agent", signal.text)}
                          style={{
                            padding: "4px 10px",
                            background: "#1E3A5F",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 600,
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          }}
                        >
                          Deploy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXECUTION TRACKING TAB */}
            {activeTab === "execution" && (
              <div style={{ display: "grid", gap: 16 }}>
                {/* Top row - 2 columns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Promises vs Delivery */}
                  <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
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
                  
                  {/* Owner Accountability */}
                  <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Owner Accountability</h3>
                      <ActionButton onAction={(type) => handleAction(type, "Owner report")} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, fontSize: 10, color: "#6B7280", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #E5E7EB" }}>
                      <span style={{ fontWeight: 600 }}>OWNER</span>
                      <span style={{ fontWeight: 600, textAlign: "center", width: 50 }}>OPEN</span>
                      <span style={{ fontWeight: 600, textAlign: "center", width: 60 }}>OVERDUE</span>
                      <span style={{ fontWeight: 600, textAlign: "right", width: 60 }}>AVG DAYS</span>
                    </div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {OWNER_ACCOUNTABILITY.map((o, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, alignItems: "center", padding: "6px 0", borderBottom: i < OWNER_ACCOUNTABILITY.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#111827" }}>{o.name}</span>
                          <span style={{ fontSize: 11, textAlign: "center", width: 50, color: "#374151", fontWeight: 500 }}>{o.open}</span>
                          <span style={{ 
                            fontSize: 11, textAlign: "center", width: 60, fontWeight: 600,
                            color: o.overdue > 0 ? "#DC2626" : "#059669"
                          }}>
                            {o.overdue > 0 ? o.overdue : "—"}
                          </span>
                          <span style={{ 
                            fontSize: 11, textAlign: "right", width: 60,
                            color: o.avgDays > 40 ? "#DC2626" : o.avgDays > 30 ? "#B45309" : "#059669"
                          }}>
                            {o.avgDays}d
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Middle row - Meeting Carryover full width */}
                <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Meeting-to-Meeting Carryover</h3>
                      <p style={{ fontSize: 10, color: "#6B7280", margin: "2px 0 0 0" }}>Are we closing loops or just rolling items forward?</p>
                    </div>
                    <ActionButton onAction={(type) => handleAction(type, "Carryover analysis")} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    {MEETING_CARRYOVER.map((m, i) => {
                      const isLast = i === MEETING_CARRYOVER.length - 1;
                      const isWorsening = i > 0 && m.carryoverRate > MEETING_CARRYOVER[i-1].carryoverRate;
                      return (
                        <div key={i} style={{ 
                          padding: 12, borderRadius: 6, textAlign: "center",
                          background: isLast ? (isWorsening ? "#FEF2F2" : "#F0FDF4") : "#F9FAFB",
                          border: `1px solid ${isLast ? (isWorsening ? "#FECACA" : "#D1FAE5") : "#E5E7EB"}`
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>{m.meeting}</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: isLast ? (isWorsening ? "#DC2626" : "#059669") : "#374151" }}>
                            {m.carryoverRate}%
                          </div>
                          <div style={{ fontSize: 9, color: "#6B7280", marginTop: 4 }}>carryover rate</div>
                          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8, fontSize: 10 }}>
                            <span><strong>{m.newItems}</strong> new</span>
                            <span><strong>{m.carriedOver}</strong> carried</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Bottom row - 2 columns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Committee Effectiveness */}
                  <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Committee Effectiveness</h3>
                      <ActionButton onAction={(type) => handleAction(type, "Committee report")} />
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {COMMITTEE_EFFECTIVENESS.map((c, i) => (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                            <span style={{ color: "#374151", fontWeight: 500 }}>{c.name}</span>
                            <span style={{ 
                              fontWeight: 600,
                              color: c.effectiveness >= 80 ? "#059669" : c.effectiveness >= 60 ? "#B45309" : "#DC2626"
                            }}>
                              {c.effectiveness}%
                            </span>
                          </div>
                          <div style={{ height: 6, background: "#E5E7EB", borderRadius: 3 }}>
                            <div style={{ 
                              height: "100%", borderRadius: 3,
                              width: `${c.effectiveness}%`,
                              background: c.effectiveness >= 80 ? "#4ADE80" : c.effectiveness >= 60 ? "#FCD34D" : "#F87171"
                            }} />
                          </div>
                          <div style={{ fontSize: 9, color: "#6B7280", marginTop: 4 }}>
                            {c.closed}/{c.items} closed · {c.onTime} on time
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Board Attention vs Benchmark */}
                  <div style={{ padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Board Attention vs Peer Benchmark</h3>
                    </div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 12 }}>
                      Comparing to: {PEER_GROUPS.find(pg => pg.id === peerGroup)?.label}
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
              </div>
            )}

            {/* GOVERNANCE MATURITY TAB */}
            {activeTab === "maturity" && (
              <div>
                {/* Overall Score Row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Overall Governance Score</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 40, fontWeight: 800, color: "#D97706" }}>{overallScores[3]}</span>
                      <span style={{ fontSize: 12, color: "#DC2626", fontWeight: 500 }}>↓ {overallScores[2] - overallScores[3]} from Q2</span>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 50 }}>
                    {overallScores.map((score, i) => {
                      const isLast = i === overallScores.length - 1;
                      const prev = i > 0 ? overallScores[i-1] : score;
                      const isDown = score < prev;
                      return (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: isLast ? (isDown ? "#DC2626" : "#059669") : "#6B7280", marginBottom: 2 }}>
                            {score}
                          </div>
                          <div style={{ 
                            width: 24, height: score * 0.5, borderRadius: 3,
                            background: isLast 
                              ? (isDown ? "linear-gradient(180deg, #FCA5A5, #DC2626)" : "linear-gradient(180deg, #86EFAC, #059669)")
                              : "#E5E7EB"
                          }} />
                          <div style={{ fontSize: 8, color: "#6B7280", marginTop: 2 }}>{MATURITY_QUARTERS[i]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Header row with quarter labels */}
                <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 60px 80px", alignItems: "center", gap: 12, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>COMPONENT</div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {["Q4 2024", "Q1 2025", "Q2 2025", "Q3 2025"].map((q, i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#6B7280", fontWeight: 500 }}>
                        {q}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600, textAlign: "center" }}>CHANGE</div>
                  <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600, textAlign: "right" }}>WEIGHT</div>
                </div>
                
                {/* Components */}
                <div style={{ display: "grid", gap: 10 }}>
                  {MATURITY_COMPONENTS.map((comp) => {
                    const currentScore = comp.scores[3];
                    const prevScore = comp.scores[2];
                    const trend = currentScore - prevScore;
                    return (
                      <div key={comp.id} style={{ display: "grid", gridTemplateColumns: "180px 1fr 60px 80px", alignItems: "center", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "#111827" }}>{comp.name}</div>
                          <div style={{ fontSize: 9, color: "#6B7280" }}>{comp.description}</div>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          {comp.scores.map((score, i) => {
                            const isLast = i === comp.scores.length - 1;
                            return (
                              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                                <div style={{ 
                                  height: 20, borderRadius: 3,
                                  background: isLast 
                                    ? (score < comp.scores[i-1] ? "#FEE2E2" : "#ECFDF5")
                                    : "#F3F4F6",
                                  display: "flex", alignItems: "center", justifyContent: "center"
                                }}>
                                  <span style={{ 
                                    fontSize: 10, fontWeight: 600,
                                    color: isLast 
                                      ? (score < comp.scores[i-1] ? "#DC2626" : "#059669")
                                      : "#6B7280"
                                  }}>
                                    {score}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div style={{ textAlign: "center" }}>
                          <span style={{ 
                            fontSize: 10, fontWeight: 600,
                            color: trend > 0 ? "#059669" : trend < 0 ? "#DC2626" : "#6B7280"
                          }}>
                            {trend > 0 ? `+${trend}` : trend}
                          </span>
                        </div>
                        
                        <div style={{ fontSize: 9, color: "#6B7280", textAlign: "right" }}>
                          Weight: {comp.weight}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DIRECTOR EDUCATION TAB */}
            {activeTab === "education" && (
              <div>
                {/* Summary Row */}
                <div style={{ display: "flex", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E5E7EB" }}>
                  <div style={{ flex: 1, padding: 10, background: "#ECFDF5", borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#047857" }}>{directorSummary.complete}</div>
                    <div style={{ fontSize: 9, color: "#047857", fontWeight: 500 }}>Complete</div>
                  </div>
                  <div style={{ flex: 1, padding: 10, background: "#EFF6FF", borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#1D4ED8" }}>{directorSummary.onTrack}</div>
                    <div style={{ fontSize: 9, color: "#1D4ED8", fontWeight: 500 }}>On Track</div>
                  </div>
                  <div style={{ flex: 1, padding: 10, background: "#FEF3C7", borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#B45309" }}>{directorSummary.behind}</div>
                    <div style={{ fontSize: 9, color: "#B45309", fontWeight: 500 }}>Behind</div>
                  </div>
                  <div style={{ flex: 1, padding: 10, background: "#FEE2E2", borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#DC2626" }}>{directorSummary.atRisk}</div>
                    <div style={{ fontSize: 9, color: "#DC2626", fontWeight: 500 }}>At Risk</div>
                  </div>
                </div>
                
                {/* Director List */}
                <div style={{ display: "grid", gap: 6 }}>
                  {(showAllDirectors ? DIRECTOR_EDUCATION : DIRECTOR_EDUCATION.slice(0, 6)).map((d, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        display: "grid", gridTemplateColumns: "160px 1fr 70px 70px", alignItems: "center", gap: 12,
                        padding: "8px 10px", borderRadius: 6,
                        background: d.status === "at-risk" ? "#FEF2F2" : d.status === "behind" ? "#FFFBEB" : "#F9FAFB",
                        border: `1px solid ${d.status === "at-risk" ? "#FECACA" : d.status === "behind" ? "#FDE68A" : "#E5E7EB"}`
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{d.name}</div>
                        <div style={{ fontSize: 9, color: "#6B7280" }}>{d.role}</div>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ flex: 1, height: 5, background: "#E5E7EB", borderRadius: 2 }}>
                          <div style={{ 
                            height: "100%", borderRadius: 2,
                            width: `${Math.min((d.credits / d.required) * 100, 100)}%`,
                            background: d.status === "complete" ? "#059669" : d.status === "on-track" ? "#3B82F6" : d.status === "behind" ? "#F59E0B" : "#DC2626"
                          }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#374151", minWidth: 35 }}>{d.credits}/{d.required}</span>
                      </div>
                      
                      <div style={{ fontSize: 9, color: "#6B7280" }}>
                        {d.topics.length > 0 ? d.topics.slice(0, 2).join(", ") : "—"}
                      </div>
                      
                      <span style={{
                        fontSize: 8, padding: "2px 6px", borderRadius: 3, fontWeight: 600, textAlign: "center",
                        background: d.status === "complete" ? "#ECFDF5" : d.status === "on-track" ? "#EFF6FF" : d.status === "behind" ? "#FEF3C7" : "#FEE2E2",
                        color: d.status === "complete" ? "#047857" : d.status === "on-track" ? "#1D4ED8" : d.status === "behind" ? "#B45309" : "#DC2626"
                      }}>
                        {d.status.toUpperCase().replace("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>
                
                {DIRECTOR_EDUCATION.length > 6 && (
                  <button
                    onClick={() => setShowAllDirectors(!showAllDirectors)}
                    style={{
                      width: "100%", marginTop: 10, padding: "8px",
                      background: "none", border: "1px solid #E5E7EB", borderRadius: 6,
                      fontSize: 11, color: "#6B7280", cursor: "pointer", fontWeight: 500
                    }}
                  >
                    {showAllDirectors ? "Show Less" : `Show ${DIRECTOR_EDUCATION.length - 6} More`}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
        </main>
        
        {/* ================================================================ */}
        {/* PROMPT BAR */}
        {/* ================================================================ */}
        
        <div style={{ 
          flexShrink: 0,
          background: "#F3F4F6",
          padding: "12px 24px 20px 24px",
          borderTop: "1px solid #E5E7EB",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.05)"
        }}>
          <div style={{ 
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px",
            background: "#fff", 
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <Sparkles size={18} style={{ color: "#6B7280" }} />
            <input
              type="text"
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Ask GovernAI anything..."
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontSize: 13, color: "#111827"
              }}
            />
            <button style={{
              padding: "6px 14px", background: "#1E3A5F", color: "#fff",
              border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer"
            }}>
              Ask
            </button>
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
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 8 }}><Bot size={20} /> Create Agent Task</h3>
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
