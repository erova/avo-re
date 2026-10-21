"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Moon,
  Rocket,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  UserCircle
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

type PeerGroup = "industry" | "cloud" | "ai";
type TabId = "trends" | "maturity" | "external" | "signals" | "execution" | "education";

type ChangeItem = {
  id: string;
  date: string;
  type: "action" | "risk" | "compliance" | "topic" | "score";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  entity?: string;
};

// ============================================================================
// Light Mode Color Palette
// ============================================================================

const colors = {
  bg: {
    page: "#F8FAFC",
    card: "#FFFFFF",
    cardHover: "#F9FAFB",
    input: "#F3F4F6",
    elevated: "#F9FAFB",
  },
  border: {
    default: "#E5E7EB",
    subtle: "#F3F4F6",
    accent: "#D1D5DB",
  },
  text: {
    primary: "#111827",
    secondary: "#4B5563",
    muted: "#9CA3AF",
  },
  accent: {
    blue: "#2563EB",
    blueMuted: "rgba(37, 99, 235, 0.1)",
    green: "#16A34A",
    greenMuted: "rgba(22, 163, 74, 0.1)",
    red: "#DC2626",
    redMuted: "rgba(220, 38, 38, 0.1)",
    yellow: "#D97706",
    yellowMuted: "rgba(217, 119, 6, 0.1)",
    purple: "#7C3AED",
    purpleMuted: "rgba(124, 58, 237, 0.1)",
    indigo: "#4F46E5",
    indigoMuted: "rgba(79, 70, 229, 0.1)",
  }
};

// ============================================================================
// What's Changed Data
// ============================================================================

const CHANGES_SINCE_LAST_VISIT: ChangeItem[] = [
  { id: "c1", date: "Jan 22, 2026", type: "action", title: "AI regulatory go/no-go criteria", description: "Now 30 days overdue - escalated to urgent", impact: "high", entity: "CLO" },
  { id: "c2", date: "Jan 20, 2026", type: "risk", title: "EU AI Act deadline approaching", description: "45 days until compliance deadline", impact: "high", entity: "Regulatory" },
  { id: "c3", date: "Jan 18, 2026", type: "score", title: "Governance score decreased", description: "Overall score dropped from 70 to 68 (-2)", impact: "medium", entity: "Maturity" },
  { id: "c4", date: "Jan 17, 2026", type: "topic", title: "AI Ethics added to emerging topics", description: "Now tracked across 4 peer companies", impact: "medium", entity: "Trends" },
  { id: "c5", date: "Jan 15, 2026", type: "compliance", title: "Director education gap identified", description: "3 directors at risk of non-compliance", impact: "high", entity: "Education" },
];

const LAST_VISIT_DATE = "Jan 12, 2026";

// ============================================================================
// Delight Components - Saluting Robot & Confetti
// ============================================================================

const CONFETTI_COLORS = ['#16A34A', '#2563EB', '#D97706', '#DC2626', '#7C3AED', '#EC4899'];
const CONFETTI_SHAPES = ['●', '■', '▲', '★', '♦', '◆'];

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  shape: string;
  rotation: number;
  scale: number;
  delay: number;
}

function SalutingRobot({ phase }: { phase: 'enter' | 'salute' | 'nod' | 'celebrate' }) {
  const bodyLight = "#d9d5e3";
  const eyeYellow = "#FFCE5F";
  const eyeOrange = "#FFB27A";
  
  return (
    <svg width="200" height="220" viewBox="0 0 200 220" fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="robotBodyLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2dfe8"/>
          <stop offset="50%" stopColor="#d9d5e3"/>
          <stop offset="100%" stopColor="#ccc8d7"/>
        </linearGradient>
        <linearGradient id="robotBodyDarkLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f2937"/>
          <stop offset="100%" stopColor="#1a2443"/>
        </linearGradient>
        <linearGradient id="robotArmGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d9d5e3"/>
          <stop offset="100%" stopColor="#b0adc0"/>
        </linearGradient>
        <filter id="robotShadowLight" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.2"/>
        </filter>
      </defs>
      
      <g style={{
        transformOrigin: '100px 15px',
        animation: phase === 'celebrate' ? 'antenna-wiggle 0.25s ease-in-out infinite' : 'none'
      }}>
        <rect x="96" y="8" width="8" height="18" rx="4" fill={bodyLight}/>
        <circle cx="100" cy="6" r="9" fill="#EE312E" style={{
          animation: phase === 'celebrate' ? 'antenna-glow 0.4s ease-in-out infinite' : 'none'
        }}/>
        <circle cx="98" cy="4" r="3" fill="#fff" opacity="0.4"/>
      </g>
      
      <g style={{
        transformOrigin: '100px 55px',
        animation: phase === 'nod' ? 'head-nod 0.35s ease-in-out' : 'none'
      }} filter="url(#robotShadowLight)">
        <rect x="40" y="24" width="120" height="75" rx="18" fill="url(#robotBodyLight)"/>
        <rect x="50" y="32" width="100" height="58" rx="12" fill="url(#robotBodyDarkLight)"/>
        
        <g style={{
          transformOrigin: '100px 55px',
          animation: phase === 'celebrate' ? 'eyes-squint 0.25s ease-out forwards' : 'none'
        }}>
          <ellipse cx="72" cy="55" rx="15" ry="16" fill={phase === 'celebrate' ? "#16A34A" : eyeYellow} style={{
            animation: phase === 'celebrate' ? 'eye-bright 0.3s ease-in-out infinite' : 'none'
          }}/>
          <ellipse cx="69" cy="52" rx="6" ry="7" fill={eyeOrange} opacity="0.6"/>
          <circle cx="68" cy="50" r="4" fill="#fff" opacity="0.8"/>
          
          <ellipse cx="128" cy="55" rx="15" ry="16" fill={phase === 'celebrate' ? "#16A34A" : eyeYellow} style={{
            animation: phase === 'celebrate' ? 'eye-bright 0.3s ease-in-out 0.1s infinite' : 'none'
          }}/>
          <ellipse cx="125" cy="52" rx="6" ry="7" fill={eyeOrange} opacity="0.6"/>
          <circle cx="124" cy="50" r="4" fill="#fff" opacity="0.8"/>
        </g>
        
        {phase === 'celebrate' ? (
          <path d="M80 78 Q100 90 120 78" stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round"/>
        ) : (
          <rect x="82" y="78" width="36" height="5" rx="2.5" fill="#374151"/>
        )}
      </g>
      
      <g filter="url(#robotShadowLight)">
        <rect x="45" y="102" width="110" height="85" rx="14" fill="url(#robotBodyLight)"/>
        <rect x="55" y="112" width="90" height="60" rx="10" fill="url(#robotBodyDarkLight)"/>
        
        <g transform="translate(70, 118) scale(0.22)">
          <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
          <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
          <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
        </g>
      </g>
      
      <g>
        <ellipse cx="35" cy="115" rx="12" ry="14" fill={bodyLight}/>
        <rect x="20" y="118" width="26" height="50" rx="10" fill="url(#robotArmGradLight)"/>
        <rect x="16" y="165" width="34" height="22" rx="8" fill={bodyLight}/>
        <rect x="14" y="182" width="10" height="12" rx="4" fill={bodyLight}/>
        <rect x="26" y="184" width="8" height="10" rx="4" fill={bodyLight}/>
        <rect x="36" y="182" width="10" height="12" rx="4" fill={bodyLight}/>
      </g>
      
      <g 
        style={{ 
          transformOrigin: '155px 118px',
          animation: phase === 'salute' || phase === 'nod' || phase === 'celebrate'
            ? 'arm-raise 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' 
            : 'none'
        }}
      >
        <ellipse cx="165" cy="115" rx="12" ry="14" fill={bodyLight}/>
        <rect x="154" y="118" width="26" height="50" rx="10" fill="url(#robotArmGradLight)"/>
        <g style={{
          transformOrigin: '167px 168px',
          animation: phase === 'salute' || phase === 'nod' || phase === 'celebrate'
            ? 'forearm-bend 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' 
            : 'none'
        }}>
          <rect x="150" y="165" width="34" height="22" rx="8" fill={bodyLight}/>
          <rect x="152" y="182" width="28" height="14" rx="5" fill={bodyLight}/>
        </g>
      </g>
      
      <g>
        <rect x="58" y="185" width="32" height="32" rx="8" fill="url(#robotArmGradLight)"/>
        <rect x="110" y="185" width="32" height="32" rx="8" fill="url(#robotArmGradLight)"/>
      </g>
      
      {phase === 'celebrate' && (
        <>
          <text x="0" y="30" fontSize="22" style={{ animation: 'sparkle-burst 0.5s ease-out infinite' }}>✨</text>
          <text x="180" y="25" fontSize="22" style={{ animation: 'sparkle-burst 0.5s ease-out 0.1s infinite' }}>✨</text>
          <text x="-10" y="120" fontSize="20" style={{ animation: 'sparkle-burst 0.5s ease-out 0.2s infinite' }}>✨</text>
          <text x="190" y="115" fontSize="20" style={{ animation: 'sparkle-burst 0.5s ease-out 0.15s infinite' }}>✨</text>
        </>
      )}
      
      <style>{`
        @keyframes arm-raise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-70deg); }
        }
        @keyframes forearm-bend {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-110deg); }
        }
        @keyframes head-nod {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(6deg); }
        }
        @keyframes eyes-squint {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0.35); }
        }
        @keyframes eye-bright {
          0%, 100% { fill: #16A34A; }
          50% { fill: #22C55E; }
        }
        @keyframes antenna-glow {
          0%, 100% { filter: drop-shadow(0 0 4px #EE312E); }
          50% { filter: drop-shadow(0 0 12px #FF6B6B); }
        }
        @keyframes antenna-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes sparkle-burst {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.6; transform: scale(1.5) rotate(20deg); }
        }
      `}</style>
    </svg>
  );
}

function RobotConfettiBurst({ onComplete }: { onComplete: () => void }) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [showRobot, setShowRobot] = useState(true);
  const [robotPhase, setRobotPhase] = useState<'enter' | 'salute' | 'nod' | 'celebrate'>('enter');
  
  useEffect(() => {
    const saluteTimer = setTimeout(() => setRobotPhase('salute'), 300);
    const nodTimer = setTimeout(() => setRobotPhase('nod'), 700);
    const celebrateTimer = setTimeout(() => {
      setRobotPhase('celebrate');
      const newParticles: ConfettiParticle[] = [];
      for (let i = 0; i < 45; i++) {
        newParticles.push({
          id: i,
          x: 50 + (Math.random() - 0.5) * 40,
          y: 30 + (Math.random() - 0.5) * 10,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
          rotation: Math.random() * 360,
          scale: 0.6 + Math.random() * 0.6,
          delay: Math.random() * 0.2,
        });
      }
      setParticles(newParticles);
    }, 1000);
    const hideRobotTimer = setTimeout(() => setShowRobot(false), 2200);
    const completeTimer = setTimeout(onComplete, 2800);
    
    return () => {
      clearTimeout(saluteTimer);
      clearTimeout(nodTimer);
      clearTimeout(celebrateTimer);
      clearTimeout(hideRobotTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 1000,
      overflow: 'hidden',
    }}>
      {showRobot && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '32%',
          transform: 'translate(-50%, -50%)',
          animation: robotPhase === 'enter' 
            ? 'robot-pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            : robotPhase === 'celebrate'
              ? 'robot-wiggle 0.4s ease-in-out 2'
              : 'none',
          zIndex: 1001,
          filter: 'drop-shadow(0 12px 40px rgba(37, 99, 235, 0.3))',
        }}>
          <SalutingRobot phase={robotPhase} />
        </div>
      )}
      
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: p.color,
            fontSize: `${18 * p.scale}px`,
            animation: `confetti-burst-${p.id % 8} 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s forwards`,
            opacity: 0,
          }}
        >
          {p.shape}
        </div>
      ))}
      
      <style>{`
        @keyframes robot-pop-in {
          0% { transform: translate(-50%, -50%) scale(0) rotate(-15deg); opacity: 0; }
          70% { transform: translate(-50%, -50%) scale(1.1) rotate(3deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes robot-wiggle {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) rotate(-4deg) scale(1.02); }
          75% { transform: translate(-50%, -50%) rotate(4deg) scale(1.02); }
        }
        @keyframes confetti-burst-0 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(350px) translateX(-140px) rotate(720deg); opacity: 0; }
        }
        @keyframes confetti-burst-1 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) translateX(120px) rotate(-540deg); opacity: 0; }
        }
        @keyframes confetti-burst-2 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(320px) translateX(-80px) rotate(480deg); opacity: 0; }
        }
        @keyframes confetti-burst-3 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(380px) translateX(160px) rotate(-600deg); opacity: 0; }
        }
        @keyframes confetti-burst-4 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(360px) translateX(-120px) rotate(360deg); opacity: 0; }
        }
        @keyframes confetti-burst-5 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(340px) translateX(100px) rotate(-420deg); opacity: 0; }
        }
        @keyframes confetti-burst-6 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(390px) translateX(-60px) rotate(540deg); opacity: 0; }
        }
        @keyframes confetti-burst-7 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(350px) translateX(80px) rotate(-480deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function SuccessToast({ 
  message, 
  subMessage,
  onClose 
}: { 
  message: string; 
  subMessage?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 100,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1001,
      animation: 'toast-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 20px',
        background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(22, 163, 74, 0.3), 0 0 0 1px rgba(255,255,255,0.1)',
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Rocket size={18} style={{ color: '#fff' }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{message}</div>
          {subMessage && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{subMessage}</div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes toast-in {
          0% { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.9); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// Updated success messages - more team-oriented language
const AGENT_SUCCESS_MESSAGES = [
  { message: "On it!", subMessage: "Your assistant is working on this now" },
  { message: "Delegated!", subMessage: "Riley will have this ready soon" },
  { message: "Handed off!", subMessage: "Your governance assistant is on the case" },
  { message: "Got it!", subMessage: "Working on this in the background" },
  { message: "Task assigned!", subMessage: "You'll be notified when it's ready" },
];

// ============================================================================
// Sample Data
// ============================================================================

const URGENT_ITEMS = [
  { id: 1, type: "overdue", title: "AI regulatory go/no-go criteria", owner: "CLO", daysLate: 30, source: "Q2 Board Meeting", suggestedAction: "Generate EU AI Act readiness checklist", actionType: "agent-draft", assistant: "Compliance" },
  { id: 2, type: "blind-spot", title: "AI Ethics & Bias - never discussed", riskLevel: "high", externalSignal: "EU AI Act requires documented bias testing", suggestedAction: "Add to next board agenda with briefing", actionType: "agent-draft", assistant: "Research" },
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

const ACTION_METRICS = { raised: 47, closed: 31, open: 12, overdue: 4, avgDaysToClose: 34, avgDaysLastQ: 28 };
const OWNER_ACCOUNTABILITY = [
  { name: "CLO", open: 4, overdue: 2, avgDays: 45, closed: 8 },
  { name: "CFO", open: 3, overdue: 0, avgDays: 22, closed: 12 },
  { name: "CISO", open: 2, overdue: 1, avgDays: 38, closed: 6 },
  { name: "CHRO", open: 2, overdue: 1, avgDays: 52, closed: 3 },
  { name: "Corp Sec", open: 1, overdue: 0, avgDays: 18, closed: 9 },
];
const MEETING_CARRYOVER = [
  { meeting: "Q4'24", newItems: 12, carriedOver: 3, closedInMeeting: 8, carryoverRate: 25 },
  { meeting: "Q1'25", newItems: 14, carriedOver: 4, closedInMeeting: 11, carryoverRate: 29 },
  { meeting: "Q2'25", newItems: 11, carriedOver: 5, closedInMeeting: 9, carryoverRate: 36 },
  { meeting: "Q3'25", newItems: 10, carriedOver: 6, closedInMeeting: 7, carryoverRate: 46 },
];
const COMMITTEE_EFFECTIVENESS = [
  { name: "Audit Committee", items: 18, closed: 16, onTime: 15, effectiveness: 89 },
  { name: "Risk Committee", items: 14, closed: 10, onTime: 8, effectiveness: 71 },
  { name: "Compensation", items: 8, closed: 7, onTime: 6, effectiveness: 86 },
  { name: "Nom/Gov", items: 7, closed: 4, onTime: 3, effectiveness: 57 },
];
const REGULATORY_RADAR = [
  { regulation: "EU AI Act", deadline: "Aug 2025", daysOut: 45, impact: "high", status: "not-discussed", note: "Requires AI system documentation & bias testing" },
  { regulation: "SEC Climate Disclosure", deadline: "Q1 2026", daysOut: 120, impact: "high", status: "in-progress", note: "Scope 1 & 2 emissions reporting required" },
  { regulation: "DORA (EU)", deadline: "Jan 2025", daysOut: 30, impact: "medium", status: "addressed", note: "Digital operational resilience requirements" },
  { regulation: "California Privacy (CPRA)", deadline: "Ongoing", daysOut: null, impact: "medium", status: "in-progress", note: "Enhanced consumer data rights" },
];
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
          padding: "4px 8px", background: "transparent", border: `1px solid ${colors.border.default}`,
          borderRadius: 4, fontSize: 11, color: colors.text.secondary, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 4
        }}
      >
        <Zap size={12} /> Action
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: 4,
          background: colors.bg.card, borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          border: `1px solid ${colors.border.default}`, overflow: "hidden", zIndex: 100, minWidth: 200
        }}>
          <button onClick={() => { onAction("agent"); setOpen(false); }}
            style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${colors.border.subtle}` }}>
            <UserCircle size={16} style={{ color: colors.accent.green }} />
            <div>
              <div style={{ fontWeight: 500, color: colors.text.primary }}>Delegate to Assistant</div>
              <div style={{ fontSize: 10, color: colors.text.muted }}>Hand off to your AI teammate</div>
            </div>
          </button>
          <button onClick={() => { onAction("assign"); setOpen(false); }}
            style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${colors.border.subtle}` }}>
            <Users size={16} style={{ color: colors.text.secondary }} />
            <div>
              <div style={{ fontWeight: 500, color: colors.text.primary }}>Assign to Colleague</div>
              <div style={{ fontSize: 10, color: colors.text.muted }}>Route to a team member</div>
            </div>
          </button>
          <button onClick={() => { onAction("delegate"); setOpen(false); }}
            style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Target size={16} style={{ color: colors.text.secondary }} />
            <div>
              <div style={{ fontWeight: 500, color: colors.text.primary }}>Add to Backlog</div>
              <div style={{ fontSize: 10, color: colors.text.muted }}>Track for later</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "trends", label: "Topic Trends", icon: <TrendingUp size={14} /> },
  { id: "maturity", label: "Governance Maturity", icon: <Activity size={14} /> },
  { id: "external", label: "External Context", icon: <Radio size={14} /> },
  { id: "signals", label: "Signals & Actions", icon: <Target size={14} /> },
  { id: "execution", label: "Execution Tracking", icon: <ClipboardCheck size={14} /> },
  { id: "education", label: "Director Education", icon: <GraduationCap size={14} /> },
];

// ============================================================================
// Main Page - v3 Light Mode
// ============================================================================

export default function GovernanceDashboardV3LightPage() {
  const [peerGroup, setPeerGroup] = useState<PeerGroup>("industry");
  const [promptValue, setPromptValue] = useState("");
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedAssistant, setSelectedAssistant] = useState<string>("Governance");
  const [expandedCountdownWeek, setExpandedCountdownWeek] = useState<number | null>(2);
  const [showAllDirectors, setShowAllDirectors] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("trends");
  
  const [showChangeBanner, setShowChangeBanner] = useState(true);
  const [changeBannerExpanded, setChangeBannerExpanded] = useState(false);
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [successToast, setSuccessToast] = useState<{ message: string; subMessage?: string } | null>(null);

  const handleAction = (type: string, item?: string, assistant?: string) => {
    setSelectedItem(item || null);
    setSelectedAssistant(assistant || "Governance");
    if (type === "agent") setShowAgentModal(true);
  };
  
  const handleDelegateTask = useCallback((taskDescription?: string) => {
    const msg = AGENT_SUCCESS_MESSAGES[Math.floor(Math.random() * AGENT_SUCCESS_MESSAGES.length)];
    setShowConfetti(true);
    setSuccessToast(msg);
    setShowAgentModal(false);
    console.log('Task delegated:', taskDescription || 'general task');
  }, []);

  const overallScores = MATURITY_QUARTERS.map((_, qIdx) => 
    Math.round(MATURITY_COMPONENTS.reduce((sum, comp) => sum + (comp.scores[qIdx] * comp.weight / 100), 0))
  );

  const directorSummary = {
    complete: DIRECTOR_EDUCATION.filter(d => d.status === "complete").length,
    onTrack: DIRECTOR_EDUCATION.filter(d => d.status === "on-track").length,
    behind: DIRECTOR_EDUCATION.filter(d => d.status === "behind").length,
    atRisk: DIRECTOR_EDUCATION.filter(d => d.status === "at-risk").length,
  };

  const highImpactChanges = CHANGES_SINCE_LAST_VISIT.filter(c => c.impact === "high").length;

  return (
    <div style={{ height: "calc(100vh - 56px)", background: colors.bg.page, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      
      {/* PROTOTYPE CONTEXT BANNER */}
      <div style={{ flexShrink: 0, padding: "12px 0", borderBottom: `1px solid ${colors.border.subtle}` }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: colors.accent.purple, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", background: colors.accent.purpleMuted, padding: "4px 10px", borderRadius: 4 }}>
                Prototype v3
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: colors.text.primary }}>GovernAI Effectiveness Dashboard: Microsoft</span>
              <span style={{ fontSize: 11, color: colors.text.muted }}>— Light mode</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Link href="/now/board-governance/dashboard-v3" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: colors.text.secondary, textDecoration: "none", padding: "4px 10px", background: colors.bg.elevated, borderRadius: 4, border: `1px solid ${colors.border.default}` }}>
                <Moon size={12} /> Dark mode
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* APP CHROME WRAPPER */}
      <div style={{ 
        flex: 1, display: "flex", flexDirection: "column", maxWidth: 1152, 
        margin: "24px auto 0 auto", width: "calc(100% - 48px)",
        background: colors.bg.card, borderRadius: "12px 12px 0 0",
        boxShadow: "0 -4px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
        overflow: "hidden", minHeight: 0
      }}>
        
        {/* HEADER */}
        <header style={{ flexShrink: 0, background: "#1E3A5F", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", position: "relative", zIndex: 10 }}>
          <div style={{ padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <DiligentLogo height={32} />
              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 12, marginLeft: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "-0.3px" }}>GovernAI</div>
                <div style={{ fontSize: 9, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px" }}>Effective Intelligence</div>
              </div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff" }}>JD</div>
          </div>
        </header>

        {/* "WHAT'S CHANGED" BANNER */}
        {showChangeBanner && CHANGES_SINCE_LAST_VISIT.length > 0 && (
          <div style={{ 
            flexShrink: 0,
            background: `linear-gradient(90deg, ${colors.accent.indigoMuted} 0%, ${colors.accent.purpleMuted} 100%)`, 
            borderBottom: `1px solid ${colors.accent.indigo}20`,
          }}>
            <div 
              style={{ 
                padding: "10px 24px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                cursor: "pointer"
              }}
              onClick={() => setChangeBannerExpanded(!changeBannerExpanded)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Clock size={16} style={{ color: colors.accent.indigo }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary }}>
                  {CHANGES_SINCE_LAST_VISIT.length} change{CHANGES_SINCE_LAST_VISIT.length > 1 ? "s" : ""} since {LAST_VISIT_DATE}
                </span>
                {highImpactChanges > 0 && (
                  <span style={{ 
                    background: colors.accent.redMuted, 
                    color: colors.accent.red, 
                    padding: "2px 8px", 
                    borderRadius: 4, 
                    fontWeight: 600,
                    fontSize: 11
                  }}>
                    {highImpactChanges} high impact
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowChangeBanner(false); }}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center",
                    padding: 4
                  }}
                >
                  <X size={16} style={{ color: colors.text.muted }} />
                </button>
                {changeBannerExpanded ? <ChevronUp size={16} style={{ color: colors.text.muted }} /> : <ChevronDown size={16} style={{ color: colors.text.muted }} />}
              </div>
            </div>

            {changeBannerExpanded && (
              <div style={{ padding: "0 24px 16px 24px" }}>
                <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
                  {CHANGES_SINCE_LAST_VISIT.map((change) => (
                    <div 
                      key={change.id}
                      style={{ 
                        background: colors.bg.card, 
                        borderRadius: 8, 
                        padding: "12px 16px", 
                        minWidth: 280,
                        border: change.impact === "high" ? `1px solid ${colors.accent.red}30` : `1px solid ${colors.border.default}`,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ 
                          fontSize: 10, 
                          fontWeight: 600, 
                          color: change.impact === "high" ? colors.accent.red : change.impact === "medium" ? colors.accent.yellow : colors.text.muted,
                          textTransform: "uppercase",
                          background: change.impact === "high" ? colors.accent.redMuted : change.impact === "medium" ? colors.accent.yellowMuted : colors.bg.elevated,
                          padding: "2px 6px",
                          borderRadius: 4
                        }}>
                          {change.type}
                        </span>
                        <span style={{ fontSize: 10, color: colors.text.muted }}>{change.date}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: colors.text.primary, marginBottom: 4 }}>{change.title}</div>
                      <div style={{ fontSize: 11, color: colors.text.secondary }}>{change.description}</div>
                      {change.entity && (
                        <div style={{ fontSize: 10, color: colors.text.muted, marginTop: 6 }}>{change.entity}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, overflowY: "auto", background: colors.bg.card, minHeight: 0 }}>
          <div style={{ padding: "24px" }}>
          
          {/* URGENT ITEMS */}
          <section style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <AlertCircle size={16} style={{ color: colors.accent.red }} />
              <h2 style={{ fontSize: 13, fontWeight: 700, color: colors.text.primary, margin: 0 }}>Needs Attention Now</h2>
              <span style={{ fontSize: 10, color: colors.accent.red, fontWeight: 600, background: colors.accent.redMuted, padding: "2px 6px", borderRadius: 4 }}>{URGENT_ITEMS.length}</span>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {URGENT_ITEMS.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: colors.bg.elevated, border: `1px solid ${colors.accent.red}20` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 8, padding: "2px 5px", borderRadius: 3, fontWeight: 600, background: item.type === "overdue" ? colors.accent.redMuted : colors.accent.yellowMuted, color: item.type === "overdue" ? colors.accent.red : colors.accent.yellow }}>
                      {item.type === "overdue" ? `${item.daysLate}d LATE` : "BLIND SPOT"}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: colors.text.primary }}>{item.title}</span>
                  </div>
                  <button onClick={() => handleAction("agent", item.suggestedAction, item.assistant)} style={{ padding: "4px 10px", background: colors.accent.green, color: "#fff", border: "none", borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "transform 0.1s ease" }} onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")} onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                    <UserCircle size={12} /> Delegate
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* COUNTDOWN */}
          <section style={{ marginBottom: 20 }}>
            <div style={{ background: colors.accent.blueMuted, borderRadius: 10, padding: 16, border: `1px solid ${colors.accent.blue}20` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.text.primary, margin: 0 }}>Countdown to Board Meeting</h3>
                  <p style={{ fontSize: 11, color: colors.text.muted, margin: "2px 0 0 0" }}>November 4, 2025</p>
                </div>
                <div style={{ textAlign: "center", padding: "6px 16px", background: colors.bg.card, borderRadius: 6, border: `1px solid ${colors.accent.blue}20` }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: colors.accent.blue }}>12</div>
                  <div style={{ fontSize: 9, color: colors.text.muted }}>days</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[4, 3, 2, 1].map((week) => {
                  const actions = COUNTDOWN_ACTIONS.filter(a => a.weeksOut === week);
                  const done = actions.filter(a => a.status === "done").length;
                  const total = actions.length;
                  const isSelected = expandedCountdownWeek === week;
                  const allDone = done === total;
                  return (
                    <button key={week} onClick={() => setExpandedCountdownWeek(isSelected ? null : week)}
                      style={{ flex: 1, padding: "8px 10px", borderRadius: 6, cursor: "pointer", background: isSelected ? colors.bg.card : colors.bg.elevated, border: `1px solid ${isSelected ? colors.accent.blue : colors.border.default}20`, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: isSelected ? colors.accent.blue : (allDone ? colors.accent.green : colors.text.muted), fontWeight: 600 }}>{allDone && "✓ "}{week}W</div>
                      <div style={{ fontSize: 11, color: colors.text.primary, fontWeight: 700 }}>{done}/{total}</div>
                    </button>
                  );
                })}
              </div>
              {expandedCountdownWeek && (
                <div style={{ marginTop: 12, background: colors.bg.card, borderRadius: 6, padding: 12, border: `1px solid ${colors.border.default}` }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    {COUNTDOWN_ACTIONS.filter(a => a.weeksOut === expandedCountdownWeek).map((action, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 4, background: action.status === "done" ? colors.accent.greenMuted : colors.bg.elevated, border: `1px solid ${action.status === "done" ? colors.accent.green : colors.border.default}20` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: action.status === "done" ? colors.accent.green : action.status === "in-progress" ? colors.accent.yellow : colors.border.default, fontSize: 8, color: "#fff" }}>
                            {action.status === "done" ? "✓" : action.status === "in-progress" ? "⏳" : ""}
                          </span>
                          <span style={{ fontSize: 11, color: colors.text.primary }}>{action.action}</span>
                        </div>
                        <span style={{ fontSize: 10, color: colors.text.muted }}>{action.owner}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* TABS */}
          <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${colors.border.default}` }}>
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ 
                  padding: "10px 16px", 
                  background: activeTab === tab.id ? colors.bg.card : colors.bg.elevated, 
                  border: `1px solid ${colors.border.default}`,
                  borderBottom: `1px solid ${activeTab === tab.id ? colors.bg.card : colors.border.default}`,
                  borderRadius: "8px 8px 0 0", 
                  marginBottom: -1,
                  marginRight: -1, 
                  fontSize: 12, 
                  fontWeight: activeTab === tab.id ? 600 : 500, 
                  color: activeTab === tab.id ? colors.text.primary : colors.text.muted, 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 6, 
                  whiteSpace: "nowrap"
                }}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div style={{ padding: "20px 0" }}>
            
            {/* TOPIC TRENDS */}
            {activeTab === "trends" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0 }}>Topic Evolution Over Time</h3>
                    <p style={{ fontSize: 10, color: colors.text.muted, margin: "4px 0 0 0" }}>How board attention has shifted across the last 4 meetings</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 10 }}>
                    <span style={{ color: colors.accent.green }}>● Emerging</span>
                    <span style={{ color: colors.text.secondary }}>● Steady</span>
                    <span style={{ color: colors.text.muted }}>● Declining</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "180px repeat(4, 1fr) 100px", gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${colors.border.default}` }}>
                  <div style={{ fontSize: 10, color: colors.text.muted, fontWeight: 600 }}>TOPIC</div>
                  {TOPIC_EVOLUTION.quarters.map(q => <div key={q} style={{ fontSize: 10, color: colors.text.muted, textAlign: "center", fontWeight: 500 }}>{q}</div>)}
                  <div style={{ fontSize: 10, color: colors.text.muted, textAlign: "right", fontWeight: 500 }}>TREND</div>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {TOPIC_EVOLUTION.topics.map((topic, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "180px repeat(4, 1fr) 100px", gap: 8, alignItems: "center", padding: "8px 0", borderBottom: i < TOPIC_EVOLUTION.topics.length - 1 ? `1px solid ${colors.border.subtle}` : "none" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: colors.text.primary }}>{topic.name}</div>
                        <div style={{ fontSize: 10, color: colors.text.muted }}>{topic.note}</div>
                      </div>
                      {topic.mentions.map((count, qi) => {
                        const maxMentions = Math.max(...TOPIC_EVOLUTION.topics.flatMap(t => t.mentions));
                        const intensity = count / maxMentions;
                        return (
                          <div key={qi} style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600,
                              background: count === 0 ? colors.bg.elevated : topic.trend === "emerging" ? `rgba(22, 163, 74, ${0.1 + intensity * 0.25})` : topic.trend === "declining" ? `rgba(156, 163, 175, ${0.1 + intensity * 0.15})` : `rgba(37, 99, 235, ${0.1 + intensity * 0.2})`,
                              color: count === 0 ? colors.text.muted : topic.trend === "emerging" ? colors.accent.green : topic.trend === "declining" ? colors.text.secondary : colors.accent.blue }}>
                              {count}
                            </div>
                          </div>
                        );
                      })}
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 10, padding: "4px 10px", borderRadius: 4, fontWeight: 600,
                          background: topic.trend === "emerging" ? colors.accent.greenMuted : topic.trend === "declining" ? colors.bg.elevated : colors.accent.blueMuted,
                          color: topic.trend === "emerging" ? colors.accent.green : topic.trend === "declining" ? colors.text.muted : colors.accent.blue }}>
                          {topic.trend === "emerging" ? "↑ EMERGING" : topic.trend === "declining" ? "↓ FADING" : "— STEADY"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GOVERNANCE MATURITY */}
            {activeTab === "maturity" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${colors.border.default}` }}>
                  <div>
                    <div style={{ fontSize: 12, color: colors.text.muted, marginBottom: 4 }}>Overall Governance Score</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 40, fontWeight: 800, color: colors.accent.yellow }}>{overallScores[3]}</span>
                      <span style={{ fontSize: 12, color: colors.accent.red, fontWeight: 500 }}>↓ {overallScores[2] - overallScores[3]} from Q2</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 50 }}>
                    {overallScores.map((score, i) => {
                      const isLast = i === overallScores.length - 1;
                      const prev = i > 0 ? overallScores[i-1] : score;
                      const isDown = score < prev;
                      return (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: isLast ? (isDown ? colors.accent.red : colors.accent.green) : colors.text.muted, marginBottom: 2 }}>{score}</div>
                          <div style={{ width: 24, height: score * 0.5, borderRadius: 3, background: isLast ? (isDown ? `linear-gradient(180deg, ${colors.accent.red}60, ${colors.accent.red})` : `linear-gradient(180deg, ${colors.accent.green}60, ${colors.accent.green})`) : colors.bg.elevated }} />
                          <div style={{ fontSize: 8, color: colors.text.muted, marginTop: 2 }}>{MATURITY_QUARTERS[i]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 60px 80px", alignItems: "center", gap: 12, marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${colors.border.default}` }}>
                  <div style={{ fontSize: 10, color: colors.text.muted, fontWeight: 600 }}>COMPONENT</div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {["Q4 2024", "Q1 2025", "Q2 2025", "Q3 2025"].map((q, i) => <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: colors.text.muted, fontWeight: 500 }}>{q}</div>)}
                  </div>
                  <div style={{ fontSize: 10, color: colors.text.muted, fontWeight: 600, textAlign: "center" }}>CHANGE</div>
                  <div style={{ fontSize: 10, color: colors.text.muted, fontWeight: 600, textAlign: "right" }}>WEIGHT</div>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {MATURITY_COMPONENTS.map((comp) => {
                    const trend = comp.scores[3] - comp.scores[2];
                    return (
                      <div key={comp.id} style={{ display: "grid", gridTemplateColumns: "180px 1fr 60px 80px", alignItems: "center", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: colors.text.primary }}>{comp.name}</div>
                          <div style={{ fontSize: 9, color: colors.text.muted }}>{comp.description}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          {comp.scores.map((score, i) => {
                            const isLast = i === comp.scores.length - 1;
                            return (
                              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                                <div style={{ height: 20, borderRadius: 3, background: isLast ? (score < comp.scores[i-1] ? colors.accent.redMuted : colors.accent.greenMuted) : colors.bg.elevated, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <span style={{ fontSize: 10, fontWeight: 600, color: isLast ? (score < comp.scores[i-1] ? colors.accent.red : colors.accent.green) : colors.text.muted }}>{score}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: trend > 0 ? colors.accent.green : trend < 0 ? colors.accent.red : colors.text.muted }}>{trend > 0 ? `+${trend}` : trend}</span>
                        </div>
                        <div style={{ fontSize: 9, color: colors.text.muted, textAlign: "right" }}>Weight: {comp.weight}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EXTERNAL CONTEXT */}
            {activeTab === "external" && (
              <div style={{ display: "grid", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Dogs Not Barking */}
                  <div style={{ padding: 16, border: `1px solid ${colors.border.default}`, borderRadius: 8, background: colors.bg.elevated }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0, display: "flex", alignItems: "center", gap: 6 }}><EyeOff size={14} /> Dogs Not Barking</h3>
                      <ActionButton onAction={(type) => handleAction(type, "Dogs Not Barking analysis")} />
                    </div>
                    <p style={{ fontSize: 10, color: colors.text.muted, margin: "0 0 12px 0", fontStyle: "italic" }}>Meaningful silence: monitoring what&apos;s not happening as signal</p>
                    <div style={{ display: "grid", gap: 8 }}>
                      {DOGS_NOT_BARKING.map((d, i) => (
                        <div key={i} style={{ padding: 10, borderRadius: 6, background: d.riskLevel === "high" ? colors.accent.redMuted : colors.accent.yellowMuted, border: `1px solid ${d.riskLevel === "high" ? colors.accent.red : colors.accent.yellow}20` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: d.riskLevel === "high" ? colors.accent.red : colors.accent.yellow }}>{d.topic}</span>
                            <span style={{ fontSize: 9, color: colors.text.muted }}>Last: {d.lastDiscussed}</span>
                          </div>
                          <div style={{ fontSize: 10, color: colors.text.secondary }}>{d.externalSignal}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Peer Signals */}
                  <div style={{ padding: 16, border: `1px solid ${colors.border.default}`, borderRadius: 8, background: colors.bg.elevated }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0 }}>Peer Governance Signals</h3>
                      <ActionButton onAction={(type) => handleAction(type, "Peer benchmarking")} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
                      {PEER_GROUPS.map((pg) => (
                        <div key={pg.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {pg.isPrimary && <span style={{ fontSize: 9, color: colors.text.muted, marginRight: 2 }}>Primary:</span>}
                          <button onClick={() => setPeerGroup(pg.id)} style={{ padding: "4px 8px", borderRadius: 4, fontSize: 10, fontWeight: 500, cursor: "pointer", background: peerGroup === pg.id ? colors.accent.blue : colors.bg.card, border: "none", color: peerGroup === pg.id ? "#fff" : colors.text.muted }}>
                            {pg.label} ({pg.count})
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {PEER_SIGNALS.map((p, i) => (
                        <div key={i} style={{ padding: 10, borderRadius: 6, background: colors.bg.card, border: `1px solid ${colors.border.default}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: colors.accent.blueMuted, color: colors.accent.blue, fontWeight: 600 }}>{p.topic}</span>
                            <span style={{ fontSize: 9, color: colors.text.muted }}>{p.date}</span>
                          </div>
                          <div style={{ fontSize: 11, color: colors.text.primary, marginBottom: 2 }}>{p.context}</div>
                          <div style={{ fontSize: 10, color: colors.text.muted }}>{p.company} · {p.source}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Regulatory Radar */}
                  <div style={{ padding: 16, border: `1px solid ${colors.border.default}`, borderRadius: 8, background: colors.bg.elevated }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0, display: "flex", alignItems: "center", gap: 6 }}><Scale size={14} /> Regulatory Radar</h3>
                        <p style={{ fontSize: 10, color: colors.text.muted, margin: "2px 0 0 0" }}>Upcoming regulations requiring board attention</p>
                      </div>
                      <ActionButton onAction={(type) => handleAction(type, "Regulatory readiness")} />
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {REGULATORY_RADAR.map((r, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, borderRadius: 6, background: r.status === "not-discussed" ? colors.accent.redMuted : r.status === "in-progress" ? colors.accent.yellowMuted : colors.accent.greenMuted, border: `1px solid ${r.status === "not-discussed" ? colors.accent.red : r.status === "in-progress" ? colors.accent.yellow : colors.accent.green}20` }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: colors.text.primary }}>{r.regulation}</span>
                              <span style={{ fontSize: 8, padding: "2px 5px", borderRadius: 3, fontWeight: 600, background: r.impact === "high" ? colors.accent.redMuted : colors.accent.yellowMuted, color: r.impact === "high" ? colors.accent.red : colors.accent.yellow }}>{r.impact.toUpperCase()}</span>
                            </div>
                            <div style={{ fontSize: 10, color: colors.text.secondary }}>{r.note}</div>
                          </div>
                          <div style={{ textAlign: "right", marginLeft: 12 }}>
                            {r.daysOut !== null ? (
                              <>
                                <div style={{ fontSize: 16, fontWeight: 700, color: r.daysOut <= 30 ? colors.accent.red : r.daysOut <= 60 ? colors.accent.yellow : colors.text.primary }}>{r.daysOut}d</div>
                                <div style={{ fontSize: 9, color: colors.text.muted }}>{r.deadline}</div>
                              </>
                            ) : (
                              <div style={{ fontSize: 10, color: colors.text.muted }}>{r.deadline}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Investor Concerns */}
                  <div style={{ padding: 16, border: `1px solid ${colors.border.default}`, borderRadius: 8, background: colors.bg.elevated }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0, display: "flex", alignItems: "center", gap: 6 }}><BarChart3 size={14} /> Investor Concerns</h3>
                        <p style={{ fontSize: 10, color: colors.text.muted, margin: "2px 0 0 0" }}>Top themes from earnings calls & investor meetings</p>
                      </div>
                      <ActionButton onAction={(type) => handleAction(type, "Investor sentiment analysis")} />
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {INVESTOR_CONCERNS.map((c, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, borderRadius: 6, background: colors.bg.card, border: `1px solid ${colors.border.default}` }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                              <span style={{ fontSize: 12, fontWeight: 500, color: colors.text.primary }}>{c.theme}</span>
                              {c.trend === "rising" && <span style={{ fontSize: 9, color: colors.accent.red, fontWeight: 600 }}>↑ Rising</span>}
                            </div>
                            <div style={{ fontSize: 10, color: colors.text.muted }}>Last raised: {c.lastRaised} · Sentiment: {c.sentiment}</div>
                          </div>
                          <div style={{ textAlign: "right", marginLeft: 12 }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: c.mentions >= 10 ? colors.accent.red : c.mentions >= 6 ? colors.accent.yellow : colors.text.primary }}>{c.mentions}</div>
                            <div style={{ fontSize: 9, color: colors.text.muted }}>mentions</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SIGNALS & ACTIONS */}
            {activeTab === "signals" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0 }}>Narrative vs Reality</h3>
                    <p style={{ fontSize: 10, color: colors.text.muted, margin: "4px 0 0 0" }}>Is the board &quot;walking its talk&quot;? Signals from recent meetings with suggested actions.</p>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ padding: "8px 16px", background: colors.accent.greenMuted, borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: colors.accent.green }}>{SENTIMENT_SIGNALS.filter(s => s.type === "positive").length}</div>
                      <div style={{ fontSize: 9, color: colors.accent.green }}>Positive</div>
                    </div>
                    <div style={{ padding: "8px 16px", background: colors.accent.redMuted, borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: colors.accent.red }}>{SENTIMENT_SIGNALS.filter(s => s.type === "concern").length}</div>
                      <div style={{ fontSize: 9, color: colors.accent.red }}>Red flags</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 24, padding: "12px 16px", background: colors.bg.elevated, borderRadius: 8, marginBottom: 16, border: `1px solid ${colors.border.default}` }}>
                  <div style={{ fontSize: 11, color: colors.text.secondary }}>
                    <span style={{ color: colors.text.muted }}>Action Velocity:</span>
                    <span style={{ marginLeft: 8 }}><strong>{ACTION_METRICS.raised}</strong> raised</span>
                    <span style={{ marginLeft: 8 }}><strong>{ACTION_METRICS.closed}</strong> closed</span>
                    <span style={{ marginLeft: 8, color: colors.accent.red }}><strong>{ACTION_METRICS.overdue}</strong> overdue</span>
                  </div>
                  <div style={{ fontSize: 11, color: colors.text.muted }}>Avg {ACTION_METRICS.avgDaysToClose}d to close (was {ACTION_METRICS.avgDaysLastQ}d last quarter)</div>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {SENTIMENT_SIGNALS.map((signal, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center", padding: "12px 16px", borderRadius: 8, background: signal.type === "positive" ? colors.accent.greenMuted : colors.accent.redMuted, border: `1px solid ${signal.type === "positive" ? colors.accent.green : colors.accent.red}20` }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, fontWeight: 600, background: signal.type === "positive" ? `${colors.accent.green}20` : `${colors.accent.red}20`, color: signal.type === "positive" ? colors.accent.green : colors.accent.red }}>{signal.type === "positive" ? "POSITIVE" : "RED FLAG"}</span>
                          <span style={{ fontSize: 10, color: colors.text.muted }}>{signal.meeting}</span>
                        </div>
                        <div style={{ fontSize: 13, color: colors.text.primary, fontWeight: 500, marginBottom: 2 }}>{signal.text}</div>
                        <div style={{ fontSize: 10, color: colors.text.muted }}>{signal.source}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: colors.bg.card, borderRadius: 6, border: `1px solid ${colors.border.default}` }}>
                        <UserCircle size={14} style={{ color: colors.accent.green }} />
                        <span style={{ fontSize: 11, color: colors.text.secondary }}>{signal.type === "positive" ? "Share update" : signal.text.includes("succession") ? "Schedule review" : signal.text.includes("sales") || signal.text.includes("budget") ? "Request analysis" : signal.text.includes("churn") ? "Generate report" : "Add to agenda"}</span>
                        <button onClick={() => handleAction("agent", signal.type === "positive" ? "Share update" : signal.text.includes("succession") ? "Schedule review" : signal.text.includes("sales") || signal.text.includes("budget") ? "Request analysis" : signal.text.includes("churn") ? "Generate report" : "Add to agenda")} style={{ padding: "4px 10px", background: colors.accent.blue, color: "#fff", border: "none", borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "transform 0.1s ease" }} onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")} onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>Delegate</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXECUTION TRACKING */}
            {activeTab === "execution" && (
              <div style={{ display: "grid", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Promises vs Delivery */}
                  <div style={{ padding: 16, border: `1px solid ${colors.border.default}`, borderRadius: 8, background: colors.bg.elevated }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0 }}>Promises vs Delivery</h3>
                      <ActionButton onAction={(type) => handleAction(type, "Execution report")} />
                    </div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {PROMISES_VS_DELIVERY.map((p, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < PROMISES_VS_DELIVERY.length - 1 ? `1px solid ${colors.border.subtle}` : "none" }}>
                          <div>
                            <div style={{ fontSize: 12, color: colors.text.primary }}>{p.promise}</div>
                            <div style={{ fontSize: 10, color: colors.text.muted }}>Promised: {p.promisedQ}</div>
                          </div>
                          <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, fontWeight: 600, background: p.status === "delivered" ? colors.accent.greenMuted : p.status === "in-progress" ? colors.accent.yellowMuted : colors.accent.redMuted, color: p.status === "delivered" ? colors.accent.green : p.status === "in-progress" ? colors.accent.yellow : colors.accent.red }}>
                            {p.status === "delivered" ? "✓ Delivered" : p.status === "in-progress" ? "In Progress" : `${p.days}d late`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Owner Accountability */}
                  <div style={{ padding: 16, border: `1px solid ${colors.border.default}`, borderRadius: 8, background: colors.bg.elevated }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0 }}>Owner Accountability</h3>
                      <ActionButton onAction={(type) => handleAction(type, "Owner report")} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, fontSize: 10, color: colors.text.muted, marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${colors.border.default}` }}>
                      <span style={{ fontWeight: 600 }}>OWNER</span>
                      <span style={{ fontWeight: 600, textAlign: "center", width: 50 }}>OPEN</span>
                      <span style={{ fontWeight: 600, textAlign: "center", width: 60 }}>OVERDUE</span>
                      <span style={{ fontWeight: 600, textAlign: "right", width: 60 }}>AVG DAYS</span>
                    </div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {OWNER_ACCOUNTABILITY.map((o, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, alignItems: "center", padding: "6px 0", borderBottom: i < OWNER_ACCOUNTABILITY.length - 1 ? `1px solid ${colors.border.subtle}` : "none" }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: colors.text.primary }}>{o.name}</span>
                          <span style={{ fontSize: 11, textAlign: "center", width: 50, color: colors.text.secondary, fontWeight: 500 }}>{o.open}</span>
                          <span style={{ fontSize: 11, textAlign: "center", width: 60, fontWeight: 600, color: o.overdue > 0 ? colors.accent.red : colors.accent.green }}>{o.overdue > 0 ? o.overdue : "—"}</span>
                          <span style={{ fontSize: 11, textAlign: "right", width: 60, color: o.avgDays > 40 ? colors.accent.red : o.avgDays > 30 ? colors.accent.yellow : colors.accent.green }}>{o.avgDays}d</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Meeting Carryover */}
                <div style={{ padding: 16, border: `1px solid ${colors.border.default}`, borderRadius: 8, background: colors.bg.elevated }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0 }}>Meeting-to-Meeting Carryover</h3>
                      <p style={{ fontSize: 10, color: colors.text.muted, margin: "2px 0 0 0" }}>Are we closing loops or just rolling items forward?</p>
                    </div>
                    <ActionButton onAction={(type) => handleAction(type, "Carryover analysis")} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    {MEETING_CARRYOVER.map((m, i) => {
                      const isLast = i === MEETING_CARRYOVER.length - 1;
                      const isWorsening = i > 0 && m.carryoverRate > MEETING_CARRYOVER[i-1].carryoverRate;
                      return (
                        <div key={i} style={{ padding: 12, borderRadius: 6, textAlign: "center", background: isLast ? (isWorsening ? colors.accent.redMuted : colors.accent.greenMuted) : colors.bg.card, border: `1px solid ${isLast ? (isWorsening ? colors.accent.red : colors.accent.green) : colors.border.default}20` }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: colors.text.muted, marginBottom: 8 }}>{m.meeting}</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: isLast ? (isWorsening ? colors.accent.red : colors.accent.green) : colors.text.primary }}>{m.carryoverRate}%</div>
                          <div style={{ fontSize: 9, color: colors.text.muted, marginTop: 4 }}>carryover rate</div>
                          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8, fontSize: 10, color: colors.text.secondary }}>
                            <span><strong>{m.newItems}</strong> new</span>
                            <span><strong>{m.carriedOver}</strong> carried</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Committee Effectiveness */}
                  <div style={{ padding: 16, border: `1px solid ${colors.border.default}`, borderRadius: 8, background: colors.bg.elevated }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0 }}>Committee Effectiveness</h3>
                      <ActionButton onAction={(type) => handleAction(type, "Committee report")} />
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {COMMITTEE_EFFECTIVENESS.map((c, i) => (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                            <span style={{ color: colors.text.secondary, fontWeight: 500 }}>{c.name}</span>
                            <span style={{ fontWeight: 600, color: c.effectiveness >= 80 ? colors.accent.green : c.effectiveness >= 60 ? colors.accent.yellow : colors.accent.red }}>{c.effectiveness}%</span>
                          </div>
                          <div style={{ height: 6, background: colors.bg.card, borderRadius: 3 }}>
                            <div style={{ height: "100%", borderRadius: 3, width: `${c.effectiveness}%`, background: c.effectiveness >= 80 ? colors.accent.green : c.effectiveness >= 60 ? colors.accent.yellow : colors.accent.red }} />
                          </div>
                          <div style={{ fontSize: 9, color: colors.text.muted, marginTop: 4 }}>{c.closed}/{c.items} closed · {c.onTime} on time</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Board Attention vs Benchmark */}
                  <div style={{ padding: 16, border: `1px solid ${colors.border.default}`, borderRadius: 8, background: colors.bg.elevated }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, margin: 0 }}>Board Attention vs Peer Benchmark</h3>
                    </div>
                    <div style={{ fontSize: 10, color: colors.text.muted, marginBottom: 12 }}>Comparing to: {PEER_GROUPS.find(pg => pg.id === peerGroup)?.label}</div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {TOPIC_ALLOCATION.map((t, i) => (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                            <span style={{ color: colors.text.secondary, fontWeight: 500 }}>{t.topic}</span>
                            <span style={{ color: t.status === "below" ? colors.accent.red : colors.accent.green, fontWeight: 600 }}>{t.pct}% {t.status === "below" ? "↓" : "↑"} (peer: {t.benchmark}%)</span>
                          </div>
                          <div style={{ height: 6, background: colors.bg.card, borderRadius: 3, position: "relative" }}>
                            <div style={{ height: "100%", borderRadius: 3, width: `${t.pct}%`, background: t.status === "below" ? colors.accent.red : colors.accent.green }} />
                            <div style={{ position: "absolute", top: -2, left: `${t.benchmark}%`, width: 2, height: 10, background: colors.text.secondary, borderRadius: 1 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DIRECTOR EDUCATION */}
            {activeTab === "education" && (
              <div>
                <div style={{ display: "flex", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${colors.border.default}` }}>
                  <div style={{ flex: 1, padding: 10, background: colors.accent.greenMuted, borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: colors.accent.green }}>{directorSummary.complete}</div>
                    <div style={{ fontSize: 9, color: colors.accent.green, fontWeight: 500 }}>Complete</div>
                  </div>
                  <div style={{ flex: 1, padding: 10, background: colors.accent.blueMuted, borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: colors.accent.blue }}>{directorSummary.onTrack}</div>
                    <div style={{ fontSize: 9, color: colors.accent.blue, fontWeight: 500 }}>On Track</div>
                  </div>
                  <div style={{ flex: 1, padding: 10, background: colors.accent.yellowMuted, borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: colors.accent.yellow }}>{directorSummary.behind}</div>
                    <div style={{ fontSize: 9, color: colors.accent.yellow, fontWeight: 500 }}>Behind</div>
                  </div>
                  <div style={{ flex: 1, padding: 10, background: colors.accent.redMuted, borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: colors.accent.red }}>{directorSummary.atRisk}</div>
                    <div style={{ fontSize: 9, color: colors.accent.red, fontWeight: 500 }}>At Risk</div>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {(showAllDirectors ? DIRECTOR_EDUCATION : DIRECTOR_EDUCATION.slice(0, 6)).map((d, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 70px 70px", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 6, background: d.status === "at-risk" ? colors.accent.redMuted : d.status === "behind" ? colors.accent.yellowMuted : colors.bg.elevated, border: `1px solid ${d.status === "at-risk" ? colors.accent.red : d.status === "behind" ? colors.accent.yellow : colors.border.default}20` }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: colors.text.primary }}>{d.name}</div>
                        <div style={{ fontSize: 9, color: colors.text.muted }}>{d.role}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ flex: 1, height: 5, background: colors.bg.card, borderRadius: 2 }}>
                          <div style={{ height: "100%", borderRadius: 2, width: `${Math.min((d.credits / d.required) * 100, 100)}%`, background: d.status === "complete" ? colors.accent.green : d.status === "on-track" ? colors.accent.blue : d.status === "behind" ? colors.accent.yellow : colors.accent.red }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: colors.text.secondary, minWidth: 35 }}>{d.credits}/{d.required}</span>
                      </div>
                      <div style={{ fontSize: 9, color: colors.text.muted }}>{d.topics.length > 0 ? d.topics.slice(0, 2).join(", ") : "—"}</div>
                      <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, fontWeight: 600, textAlign: "center", background: d.status === "complete" ? colors.accent.greenMuted : d.status === "on-track" ? colors.accent.blueMuted : d.status === "behind" ? colors.accent.yellowMuted : colors.accent.redMuted, color: d.status === "complete" ? colors.accent.green : d.status === "on-track" ? colors.accent.blue : d.status === "behind" ? colors.accent.yellow : colors.accent.red }}>
                        {d.status.toUpperCase().replace("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>
                {DIRECTOR_EDUCATION.length > 6 && (
                  <button onClick={() => setShowAllDirectors(!showAllDirectors)} style={{ width: "100%", marginTop: 10, padding: "8px", background: "none", border: `1px solid ${colors.border.default}`, borderRadius: 6, fontSize: 11, color: colors.text.muted, cursor: "pointer", fontWeight: 500 }}>
                    {showAllDirectors ? "Show Less" : `Show ${DIRECTOR_EDUCATION.length - 6} More`}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
        </main>
        
        {/* PROMPT BAR */}
        <div style={{ flexShrink: 0, background: colors.bg.elevated, padding: "12px 24px 20px 24px", borderTop: `1px solid ${colors.border.default}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: colors.bg.card, borderRadius: 10, border: `1px solid ${colors.border.default}` }}>
            <Sparkles size={18} style={{ color: colors.text.muted }} />
            <input type="text" value={promptValue} onChange={(e) => setPromptValue(e.target.value)} placeholder="Ask GovernAI anything..." style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: colors.text.primary }} />
            <button style={{ padding: "6px 14px", background: colors.accent.blue, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Ask</button>
          </div>
        </div>
      </div>

      {/* AGENT MODAL - Updated language */}
      {showAgentModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: colors.bg.card, borderRadius: 16, padding: 24, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: `1px solid ${colors.border.default}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.text.primary, margin: 0, display: "flex", alignItems: "center", gap: 8 }}><UserCircle size={20} style={{ color: colors.accent.green }} /> Delegate Task</h3>
              <button onClick={() => setShowAgentModal(false)} style={{ background: "none", border: "none", fontSize: 20, color: colors.text.muted, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: colors.text.muted, marginBottom: 8 }}>What needs to be done?</div>
              <div style={{ padding: 12, background: colors.bg.elevated, borderRadius: 8, border: `1px solid ${colors.border.default}` }}>
                <div style={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>{selectedItem || "Analyze and provide recommendations"}</div>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: colors.text.muted, marginBottom: 8 }}>Assign to</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { id: "Governance", name: "Riley", role: "Governance Assistant", icon: "📋" },
                  { id: "Compliance", name: "Morgan", role: "Compliance Analyst", icon: "⚖️" },
                  { id: "Research", name: "Jordan", role: "Research Assistant", icon: "🔍" },
                  { id: "Analytics", name: "Casey", role: "Data Analyst", icon: "📊" },
                ].map((assistant) => (
                  <button
                    key={assistant.id}
                    onClick={() => setSelectedAssistant(assistant.id)}
                    style={{
                      padding: 12,
                      background: selectedAssistant === assistant.id ? colors.accent.greenMuted : colors.bg.elevated,
                      border: selectedAssistant === assistant.id ? `2px solid ${colors.accent.green}` : `1px solid ${colors.border.default}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>{assistant.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary }}>{assistant.name}</span>
                    </div>
                    <div style={{ fontSize: 10, color: colors.text.muted }}>{assistant.role}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: colors.text.muted, marginBottom: 8 }}>How much autonomy?</div>
              <div style={{ display: "grid", gap: 8 }}>
                {[{ level: "Draft for my review", desc: "I'll approve before any action is taken" }, { level: "Handle it, keep me posted", desc: "Take action but notify me of results" }, { level: "You've got this", desc: "Handle end-to-end, report when done" }].map((opt, i) => (
                  <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 10, background: colors.bg.elevated, borderRadius: 6, cursor: "pointer", border: i === 0 ? `2px solid ${colors.accent.blue}` : `1px solid ${colors.border.default}` }}>
                    <input type="radio" name="autonomy" defaultChecked={i === 0} style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: colors.text.primary }}>{opt.level}</div>
                      <div style={{ fontSize: 11, color: colors.text.muted }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowAgentModal(false)} style={{ flex: 1, padding: "10px", background: colors.bg.elevated, border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", color: colors.text.secondary }}>Cancel</button>
              <button onClick={() => handleDelegateTask(selectedItem || undefined)} style={{ flex: 1, padding: "10px", background: colors.accent.green, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "transform 0.1s ease" }} onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")} onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}>Delegate to {selectedAssistant === "Governance" ? "Riley" : selectedAssistant === "Compliance" ? "Morgan" : selectedAssistant === "Research" ? "Jordan" : "Casey"}</button>
            </div>
          </div>
        </div>
      )}
      
      {/* CELEBRATION / DELIGHT LAYER */}
      {showConfetti && (
        <RobotConfettiBurst onComplete={() => setShowConfetti(false)} />
      )}
      
      {successToast && (
        <SuccessToast 
          message={successToast.message} 
          subMessage={successToast.subMessage}
          onClose={() => setSuccessToast(null)} 
        />
      )}
    </div>
  );
}
