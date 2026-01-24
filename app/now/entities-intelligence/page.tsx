"use client";

import React, { useState, useRef, useEffect } from "react";

// ============================================================================
// Types
// ============================================================================

type ViewMode = "structure" | "analysis";
type UserRole = "gc" | "paralegal";
type InsightPanelTab = "structure" | "risks" | "actions";

type Entity = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  type: string;
  shares?: string;
  parentId: string | null;
  ownership?: string;
  riskLevel?: "low" | "medium" | "high";
  hasIssues?: boolean;
  issueCount?: number;
};

type EntityAction = {
  nextBestAction: string;
  peerComparison: string;
  effortLevel: "low" | "medium" | "high";
  impactLevel: "low" | "medium" | "high";
  worthIt: boolean;
  worthItReason: string;
  risks?: string[];
  opportunities?: string[];
};

// ============================================================================
// Sample Data - Bradax Inc Corporate Structure
// ============================================================================

const ENTITIES: Entity[] = [
  { id: "bradax", name: "Bradax Inc", country: "United States", countryCode: "US", type: "Company", parentId: null },
  { id: "bradax-americas", name: "Bradax Americas Inc.", country: "United States", countryCode: "US", type: "Company", shares: "100 Ordinary $1 shares", parentId: "bradax", ownership: "100.00%" },
  { id: "bradax-uk", name: "Bradax UK Group", country: "Great Britain", countryCode: "GB", type: "Holding Company > Subsidiary Co...", parentId: "bradax", ownership: "100.00%", riskLevel: "medium", hasIssues: true, issueCount: 2 },
  { id: "bradax-east", name: "Bradax East Coast Inc.", country: "United States", countryCode: "US", type: "Company", shares: "100 Ordinary $1 shares", parentId: "bradax-americas", ownership: "100.00%" },
  { id: "bradax-south", name: "Bradax South Inc.", country: "United States", countryCode: "US", type: "Company", shares: "100 Ordinary $1 shares", parentId: "bradax-americas", ownership: "100.00%" },
  { id: "bradax-espana", name: "Bradax España", country: "Spain", countryCode: "ES", type: "Holding Company > Subsidiary Co...", parentId: "bradax-uk", ownership: "100.00%" },
  { id: "bradax-ireland", name: "Bradax Ireland Ltd", country: "Ireland", countryCode: "IE", type: "Holding Company > Subsidiary Co...", parentId: "bradax-uk", ownership: "100.00%", riskLevel: "high", hasIssues: true, issueCount: 3 },
  { id: "bradax-daytona", name: "Bradax Daytona Inc", country: "United States", countryCode: "US", type: "Company", shares: "80 Ordinary $1 shares", parentId: "bradax-east", ownership: "80.00%", riskLevel: "medium", hasIssues: true, issueCount: 1 },
  { id: "bradax-florida", name: "Bradax Florida Inc +", country: "United States", countryCode: "US", type: "Company", shares: "60 Ordinary $1 shares", parentId: "bradax-east", ownership: "60.00%" },
  { id: "bradax-ni", name: "Bradax Northern Ireland Ltd", country: "Great Britain", countryCode: "GB", type: "Holding Company > Subsidiary Co...", parentId: "bradax-ireland", ownership: "100.00%" },
  { id: "bradax-tampa", name: "Bradax Tampa Inc", country: "United States", countryCode: "US", type: "Company", shares: "Holding Company > Subsidiary Co...", parentId: "bradax-daytona", ownership: "70.00%" },
];

const STRUCTURE_METRICS = {
  totalEntities: 127,
  jurisdictions: 23,
  ownershipLayers: 6,
  complexityScore: 72,
  riskEntities: 8,
  pendingEvents: 14,
};

const STRUCTURAL_RISKS = [
  { id: 1, type: "ownership-gap", entity: "Bradax Ireland Ltd", severity: "high", description: "Public filing shows 95% ownership but internal records show 100%", delta: "5% discrepancy", suggestedAction: "Reconcile with Companies House records" },
  { id: 2, type: "director-expiry", entity: "Bradax UK Group", severity: "medium", description: "Director term expiring in 30 days without succession plan", deadline: "Feb 23, 2026", suggestedAction: "Schedule board resolution for appointment" },
  { id: 3, type: "compliance-gap", entity: "Bradax España", severity: "medium", description: "Annual return 45 days overdue with Spanish registry", deadline: "Overdue", suggestedAction: "File annual return with Registro Mercantil" },
  { id: 4, type: "structural-change", entity: "Bradax Daytona Inc", severity: "low", description: "Recent ownership change not reflected in group chart", lastUpdated: "Dec 15, 2025", suggestedAction: "Update visualization with new ownership split" },
];

const PEER_BENCHMARKS = [
  { metric: "Avg. Ownership Layers", yours: 6, peerAvg: 4.2, status: "above", note: "More layers = higher complexity" },
  { metric: "Jurisdictions per $1B Revenue", yours: 23, peerAvg: 18, status: "above", note: "Consider consolidation opportunities" },
  { metric: "Entities with Issues", yours: 8, peerAvg: 5, status: "above", note: "Higher than peer median" },
  { metric: "Data Completeness", yours: 87, peerAvg: 92, status: "below", note: "Missing 13% of required fields" },
];

const RECENT_ACTIVITY = [
  { date: "Jan 22, 2026", action: "Ownership change", entity: "Bradax Florida Inc", detail: "Ownership increased from 50% to 60%", user: "J. Martinez" },
  { date: "Jan 20, 2026", action: "Director appointed", entity: "Bradax UK Group", detail: "Sarah Chen appointed as Non-Executive Director", user: "System" },
  { date: "Jan 18, 2026", action: "Filing completed", entity: "Bradax Americas Inc.", detail: "Annual return filed with Delaware DoS", user: "M. Thompson" },
  { date: "Jan 15, 2026", action: "Address updated", entity: "Bradax España", detail: "Registered office moved to new location", user: "J. Martinez" },
];

const QUESTIONS_TO_ASK = [
  "How complex or risky is our structure?",
  "Where are we exposed without realising it?",
  "How do similar organisations structure themselves?",
  "Which entities have compliance gaps?",
];

// Entity-specific action data for popovers
const ENTITY_ACTIONS: Record<string, EntityAction> = {
  "bradax": {
    nextBestAction: "Review group-wide compliance status",
    peerComparison: "Structure is 23% more complex than peer median",
    effortLevel: "high",
    impactLevel: "high",
    worthIt: true,
    worthItReason: "Strategic review needed — complexity driving hidden costs",
    risks: ["Tax inefficiency from layered structure", "Governance gaps in 3 jurisdictions"],
    opportunities: ["Potential €2.1M annual savings through consolidation"],
  },
  "bradax-americas": {
    nextBestAction: "Consolidate dormant subsidiaries",
    peerComparison: "US entity count 15% above peer average",
    effortLevel: "medium",
    impactLevel: "medium",
    worthIt: true,
    worthItReason: "2 dormant entities costing $45K/year in maintenance",
    risks: ["State filing complexity"],
    opportunities: ["Simplify audit scope"],
  },
  "bradax-uk": {
    nextBestAction: "Appoint successor director before Feb 23",
    peerComparison: "UK governance structure aligned with peers",
    effortLevel: "low",
    impactLevel: "high",
    worthIt: true,
    worthItReason: "Director expiry creates immediate compliance risk",
    risks: ["Companies House penalty risk", "Board decision-making gap"],
    opportunities: ["Opportunity to modernize board composition"],
  },
  "bradax-ireland": {
    nextBestAction: "Reconcile ownership discrepancy with CRO",
    peerComparison: "Irish holding structure more complex than 70% of peers",
    effortLevel: "medium",
    impactLevel: "high",
    worthIt: true,
    worthItReason: "5% ownership gap = material misstatement risk",
    risks: ["Regulatory filing discrepancy", "Potential beneficial ownership issues"],
    opportunities: ["Clean data enables better reporting"],
  },
  "bradax-espana": {
    nextBestAction: "File overdue annual return",
    peerComparison: "Spanish entity compliance below peer standard",
    effortLevel: "low",
    impactLevel: "medium",
    worthIt: true,
    worthItReason: "45 days overdue — penalty accruing daily",
    risks: ["€1,200 penalty and counting"],
    opportunities: ["Restore good standing quickly"],
  },
  "bradax-daytona": {
    nextBestAction: "Update org chart with recent ownership change",
    peerComparison: "Minority holding structure common among peers",
    effortLevel: "low",
    impactLevel: "low",
    worthIt: false,
    worthItReason: "Low priority — cosmetic update, no compliance impact",
    risks: [],
    opportunities: ["Better visualization accuracy"],
  },
  "bradax-east": {
    nextBestAction: "No immediate action required",
    peerComparison: "Regional structure well-optimized",
    effortLevel: "low",
    impactLevel: "low",
    worthIt: false,
    worthItReason: "Entity is well-managed — focus elsewhere",
    risks: [],
    opportunities: [],
  },
  "bradax-south": {
    nextBestAction: "Review for potential dormancy",
    peerComparison: "Similar entities often consolidated by peers",
    effortLevel: "medium",
    impactLevel: "low",
    worthIt: false,
    worthItReason: "Effort exceeds benefit — entity may become active",
    risks: [],
    opportunities: ["Potential $12K savings if dissolved"],
  },
  "bradax-florida": {
    nextBestAction: "Monitor minority interest implications",
    peerComparison: "60% ownership below peer control threshold norm",
    effortLevel: "low",
    impactLevel: "medium",
    worthIt: true,
    worthItReason: "Review for consolidation accounting treatment",
    risks: ["Minority rights obligations"],
    opportunities: ["Potential acquisition of remaining 40%"],
  },
  "bradax-ni": {
    nextBestAction: "Confirm post-Brexit compliance",
    peerComparison: "NI entities face unique dual-jurisdiction requirements",
    effortLevel: "medium",
    impactLevel: "medium",
    worthIt: true,
    worthItReason: "Regulatory clarity needed for cross-border operations",
    risks: ["Windsor Framework implications"],
    opportunities: ["Access to both UK and EU markets"],
  },
  "bradax-tampa": {
    nextBestAction: "Review ownership chain for tax efficiency",
    peerComparison: "Deep nesting uncommon — 4 layers to parent",
    effortLevel: "high",
    impactLevel: "medium",
    worthIt: false,
    worthItReason: "Restructuring cost exceeds 3-year tax benefit",
    risks: ["Complex intercompany transactions"],
    opportunities: ["Potential simplification in next restructure"],
  },
};

// ============================================================================
// Diligent Logo Component
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

// ============================================================================
// Country Flag Component
// ============================================================================

function CountryFlag({ code, size = 20 }: { code: string; size?: number }) {
  const flags: Record<string, { bg: string; symbol: string }> = {
    US: { bg: "#002868", symbol: "🇺🇸" },
    GB: { bg: "#012169", symbol: "🇬🇧" },
    IE: { bg: "#169B62", symbol: "🇮🇪" },
    ES: { bg: "#AA151B", symbol: "🇪🇸" },
  };
  const flag = flags[code] || { bg: "#6B7280", symbol: "🏳️" };
  return (
    <span style={{ fontSize: size * 0.8 }}>{flag.symbol}</span>
  );
}

// ============================================================================
// Entity Popover Component
// ============================================================================

function EntityPopover({ 
  entity, 
  action, 
  userRole,
  onClose,
  onAction 
}: { 
  entity: Entity; 
  action: EntityAction;
  userRole: UserRole;
  onClose: () => void;
  onAction: (actionType: string, entity: Entity) => void;
}) {
  const effortColors = { low: "#059669", medium: "#D97706", high: "#DC2626" };
  const impactColors = { low: "#9CA3AF", medium: "#3B82F6", high: "#7C3AED" };
  
  return (
    <div 
      style={{
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: 8,
        width: 320,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 10px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
        zIndex: 1000,
        overflow: "hidden"
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ 
        padding: "12px 16px", 
        background: "linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)",
        color: "#fff"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{entity.name}</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>{entity.country}</div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, opacity: 0.7 }}
          >
            ×
          </button>
        </div>
      </div>
      
      {/* Next Best Action */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>NEXT BEST ACTION</div>
        <div style={{ 
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 12px", 
          background: "#F0FDF4", 
          borderRadius: 8,
          border: "1px solid #D1FAE5"
        }}>
          <span style={{ fontSize: 16 }}>🤖</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#166534" }}>{action.nextBestAction}</div>
          </div>
          <button 
            onClick={() => onAction("agent", entity)}
            style={{
              padding: "6px 12px", background: "#15803D", color: "#fff",
              border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer"
            }}
          >
            Run
          </button>
        </div>
      </div>
      
      {/* Peer Comparison */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>VS PEERS</div>
        <div style={{ 
          padding: "8px 12px", 
          background: "#F9FAFB", 
          borderRadius: 6,
          fontSize: 11,
          color: "#374151",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <span style={{ fontSize: 14 }}>📊</span>
          <span>{action.peerComparison}</span>
        </div>
        <button 
          onClick={() => onAction("peer-compare", entity)}
          style={{
            marginTop: 8,
            padding: "6px 10px", 
            background: "none", 
            color: "#3B82F6",
            border: "1px solid #3B82F6", 
            borderRadius: 6, 
            fontSize: 10, 
            fontWeight: 500, 
            cursor: "pointer",
            width: "100%"
          }}
        >
          View detailed peer analysis →
        </button>
      </div>
      
      {/* Effort vs Impact - "Is the juice worth the squeeze" */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>IS IT WORTH IT?</div>
        
        <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          {/* Effort */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 4 }}>EFFORT</div>
            <div style={{ 
              padding: "6px 10px", 
              borderRadius: 6,
              background: `${effortColors[action.effortLevel]}15`,
              border: `1px solid ${effortColors[action.effortLevel]}30`
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: effortColors[action.effortLevel] }}>
                {action.effortLevel.charAt(0).toUpperCase() + action.effortLevel.slice(1)}
              </div>
            </div>
          </div>
          
          {/* vs */}
          <div style={{ display: "flex", alignItems: "center", paddingTop: 16 }}>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>→</span>
          </div>
          
          {/* Impact */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 4 }}>IMPACT</div>
            <div style={{ 
              padding: "6px 10px", 
              borderRadius: 6,
              background: `${impactColors[action.impactLevel]}15`,
              border: `1px solid ${impactColors[action.impactLevel]}30`
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: impactColors[action.impactLevel] }}>
                {action.impactLevel.charAt(0).toUpperCase() + action.impactLevel.slice(1)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Verdict */}
        <div style={{ 
          padding: "10px 12px", 
          borderRadius: 8,
          background: action.worthIt ? "#ECFDF5" : "#FEF3C7",
          border: `1px solid ${action.worthIt ? "#A7F3D0" : "#FDE68A"}`,
          display: "flex",
          alignItems: "flex-start",
          gap: 8
        }}>
          <span style={{ fontSize: 16 }}>{action.worthIt ? "✅" : "⏸️"}</span>
          <div>
            <div style={{ 
              fontSize: 12, 
              fontWeight: 600, 
              color: action.worthIt ? "#047857" : "#92400E",
              marginBottom: 2
            }}>
              {action.worthIt ? "Worth the effort" : "Consider deferring"}
            </div>
            <div style={{ fontSize: 10, color: action.worthIt ? "#065F46" : "#78350F" }}>
              {action.worthItReason}
            </div>
          </div>
        </div>
      </div>
      
      {/* GC-specific: Share with C-Suite */}
      {userRole === "gc" && (action.risks?.length || action.opportunities?.length) && (
        <div style={{ padding: "12px 16px", background: "#F5F3FF" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#5B21B6", marginBottom: 8 }}>BOARD PREP</div>
          
          {action.risks && action.risks.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: "#DC2626", fontWeight: 600, marginBottom: 4 }}>RISKS TO FLAG</div>
              {action.risks.map((risk, i) => (
                <div key={i} style={{ fontSize: 10, color: "#7F1D1D", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
                  <span>•</span> {risk}
                </div>
              ))}
            </div>
          )}
          
          {action.opportunities && action.opportunities.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: "#059669", fontWeight: 600, marginBottom: 4 }}>OPPORTUNITIES</div>
              {action.opportunities.map((opp, i) => (
                <div key={i} style={{ fontSize: 10, color: "#065F46", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
                  <span>•</span> {opp}
                </div>
              ))}
            </div>
          )}
          
          <button 
            onClick={() => onAction("share-csuite", entity)}
            style={{
              width: "100%",
              padding: "10px 14px", 
              background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)", 
              color: "#fff",
              border: "none", 
              borderRadius: 8, 
              fontSize: 12, 
              fontWeight: 600, 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
          >
            <span>📤</span>
            Share with C-Suite for Board Review
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Entity Card Component (for org chart)
// ============================================================================

function EntityCard({ 
  entity, 
  isSelected, 
  onClick,
  userRole,
  onAction
}: { 
  entity: Entity; 
  isSelected: boolean; 
  onClick: () => void;
  userRole: UserRole;
  onAction: (actionType: string, entity: Entity) => void;
}) {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverLocked, setPopoverLocked] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRoot = entity.parentId === null;
  const action = ENTITY_ACTIONS[entity.id];
  
  const handleMouseEnter = () => {
    if (!popoverLocked) {
      timeoutRef.current = setTimeout(() => {
        setShowPopover(true);
      }, 400);
    }
  };
  
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!popoverLocked) {
      setShowPopover(false);
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showPopover) {
      setPopoverLocked(true);
    } else {
      onClick();
    }
  };
  
  const handleClosePopover = () => {
    setShowPopover(false);
    setPopoverLocked(false);
  };
  
  return (
    <div 
      style={{ position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        onClick={handleClick}
        style={{
          background: "#fff",
          border: isSelected ? "2px solid #1E3A5F" : entity.hasIssues ? "1px solid #FCA5A5" : "1px solid #E5E7EB",
          borderRadius: 6,
          padding: "10px 14px",
          minWidth: 180,
          maxWidth: 200,
          cursor: "pointer",
          boxShadow: isSelected ? "0 4px 12px rgba(30, 58, 95, 0.2)" : showPopover ? "0 4px 16px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.08)",
          position: "relative",
          transition: "all 0.15s ease",
          transform: showPopover ? "scale(1.02)" : "scale(1)"
        }}
      >
        {entity.hasIssues && (
          <div style={{
            position: "absolute",
            top: -6,
            right: -6,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: entity.riskLevel === "high" ? "#DC2626" : "#F59E0B",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {entity.issueCount}
          </div>
        )}
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div style={{ 
            fontSize: 12, 
            fontWeight: 600, 
            color: isRoot ? "#1E3A5F" : "#111827",
            lineHeight: 1.3
          }}>
            {entity.name}
          </div>
          <CountryFlag code={entity.countryCode} size={16} />
        </div>
        
        <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>
          {entity.country}
        </div>
        <div style={{ fontSize: 10, color: "#9CA3AF" }}>
          {entity.type}
        </div>
        {entity.shares && (
          <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>
            {entity.shares}
          </div>
        )}
        
        {/* Quick action indicator on hover */}
        {showPopover && !popoverLocked && (
          <div style={{
            position: "absolute",
            bottom: -4,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9,
            color: "#7C3AED",
            fontWeight: 500,
            background: "#F5F3FF",
            padding: "2px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap"
          }}>
            Click for actions
          </div>
        )}
      </div>
      
      {/* Popover */}
      {showPopover && action && (
        <EntityPopover 
          entity={entity}
          action={action}
          userRole={userRole}
          onClose={handleClosePopover}
          onAction={(actionType, ent) => {
            onAction(actionType, ent);
            handleClosePopover();
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function EntitiesIntelligencePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("structure");
  const [userRole, setUserRole] = useState<UserRole>("gc");
  const [selectedEntity, setSelectedEntity] = useState<string | null>("bradax-ireland");
  const [insightPanelTab, setInsightPanelTab] = useState<InsightPanelTab>("structure");
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [promptValue, setPromptValue] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEntity, setShareEntity] = useState<Entity | null>(null);

  const selectedEntityData = ENTITIES.find(e => e.id === selectedEntity);

  // Handle actions from entity popovers
  const handleEntityAction = (actionType: string, entity: Entity) => {
    if (actionType === "share-csuite") {
      setShareEntity(entity);
      setShowShareModal(true);
    } else if (actionType === "agent") {
      // Could open AI panel with pre-filled prompt
      setAiPanelOpen(true);
      setInsightPanelTab("actions");
      const action = ENTITY_ACTIONS[entity.id];
      if (action) {
        setPromptValue(`Run action: ${action.nextBestAction} for ${entity.name}`);
      }
    } else if (actionType === "peer-compare") {
      setAiPanelOpen(true);
      setInsightPanelTab("structure");
      setSelectedEntity(entity.id);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0F", display: "flex", flexDirection: "column" }}>
      
      {/* ================================================================ */}
      {/* PROTOTYPE CONTEXT BANNER */}
      {/* ================================================================ */}
      
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
          <span style={{ fontSize: 15, color: "#F9FAFB", fontWeight: 500 }}>Entity Structure Intelligence</span>
        </div>
        
        {/* Toggle Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* User Toggle */}
          <button 
            onClick={() => setUserRole("gc")}
            style={{ 
              padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: "transparent",
              border: userRole === "gc" ? "1px solid #6B7280" : "1px solid transparent",
              color: userRole === "gc" ? "#F9FAFB" : "#6B7280",
            }}
          >
            General Counsel
          </button>
          <button 
            onClick={() => setUserRole("paralegal")}
            style={{ 
              padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: "transparent",
              border: userRole === "paralegal" ? "1px solid #6B7280" : "1px solid transparent",
              color: userRole === "paralegal" ? "#F9FAFB" : "#6B7280",
            }}
          >
            Corporate Paralegal
          </button>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 8px" }} />

          <button 
            onClick={() => setViewMode("structure")}
            style={{ 
              padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: "transparent",
              border: viewMode === "structure" ? "1px solid #22C55E" : "1px solid transparent",
              color: viewMode === "structure" ? "#22C55E" : "#6B7280",
            }}
          >
            Structure View
          </button>
          <button 
            onClick={() => setViewMode("analysis")}
            style={{ 
              padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: "transparent",
              border: viewMode === "analysis" ? "1px solid #22C55E" : "1px solid transparent",
              color: viewMode === "analysis" ? "#22C55E" : "#6B7280",
            }}
          >
            Analysis Mode
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
              {userRole === "gc" 
                ? "A General Counsel reviewing corporate structure with EntitiesAI surfacing hidden risks, compliance gaps, and benchmarks against peer organizations."
                : "A Corporate Paralegal maintaining entity records, with AI highlighting data discrepancies and filing deadlines."}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#D1D5DB", marginBottom: 4 }}>What you can do</div>
            <div style={{ lineHeight: 1.5 }}>
              Click on any entity to see detailed insights. Toggle between <strong style={{ color: "#F9FAFB" }}>GC</strong> and <strong style={{ color: "#F9FAFB" }}>Paralegal</strong> views for different perspectives.
              Ask questions in the AI panel below.
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#D1D5DB", marginBottom: 4 }}>Why it matters</div>
            <div style={{ lineHeight: 1.5 }}>
              {userRole === "gc"
                ? "Reduce hidden governance and regulatory risk. Gain institutional knowledge without Big-4 spend."
                : "Data becomes more valuable as you correct and enrich it. AI spots issues before they become problems."}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {/* ================================================================ */}
      {/* MAIN APPLICATION CHROME */}
      {/* ================================================================ */}
      
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        maxWidth: 1400, 
        margin: "0 auto", 
        width: "100%", 
        background: "#fff", 
        boxShadow: "0 0 40px rgba(0,0,0,0.15)",
        borderRadius: "8px 8px 0 0",
        overflow: "hidden"
      }}>
        
        {/* App Header */}
        <header style={{ 
          height: 44, background: "#1E3A5F", borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <DiligentLogo height={24} />
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 12, marginLeft: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>EntitiesAI</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ padding: "5px 10px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 4, fontSize: 12, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 12 }}>📊</span> Reports
            </button>
            <button style={{ padding: "5px 10px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 4, fontSize: 12, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 12 }}>📁</span> Documents
            </button>
            <button 
              style={{ 
                padding: "5px 10px", 
                background: aiPanelOpen ? "#7C3AED" : "rgba(255,255,255,0.1)", 
                border: "none", 
                borderRadius: 4, fontSize: 12, 
                color: "#fff", 
                cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                fontWeight: 600
              }}
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
            >
              <span style={{ fontSize: 10 }}>✦</span> EntitiesAI
            </button>
            <div style={{ 
              width: 28, height: 28, borderRadius: "50%", 
              background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 600, color: "#fff", marginLeft: 8
            }}>
              JM
            </div>
          </div>
        </header>

        {/* Secondary Toolbar - Group Structure Visualization Title */}
        <div style={{ 
          height: 40, background: "#FAFAFA", borderBottom: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Group Structure Visualisation - Bradax Inc</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ padding: "4px 8px", background: "none", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 11, color: "#6B7280", cursor: "pointer" }}>
              ⬇ Export
            </button>
            <button style={{ padding: "4px 8px", background: "none", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 11, color: "#6B7280", cursor: "pointer" }}>
              🔍 Search
            </button>
            <button style={{ padding: "4px 8px", background: "none", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 11, color: "#6B7280", cursor: "pointer" }}>
              ✏️ Edit
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
          
          {/* Left Sidebar - Navigation */}
          <aside style={{ width: 56, background: "#1E3A5F", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 4 }}>
            {[
              { icon: "📊", label: "Dashboard", active: false },
              { icon: "🏢", label: "Entities", active: true },
              { icon: "🔍", label: "Search", active: false },
              { icon: "⭐", label: "Favorites", active: false },
              { icon: "📋", label: "Reports", active: false },
              { icon: "📁", label: "Docs", active: false },
            ].map((item, i) => (
              <button
                key={i}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: item.active ? "rgba(255,255,255,0.15)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}
          </aside>

          {/* Main Visualization Area */}
          <main style={{ flex: 1, display: "flex", flexDirection: "column", background: "#E8E8E8", position: "relative", minHeight: 0, overflow: "hidden" }}>
            
            {/* Org Chart Visualization */}
            <div style={{ 
              flex: 1, 
              padding: 24,
              overflowX: "auto",
              overflowY: "auto",
            }}>
              {/* Root Entity */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <EntityCard 
                  entity={ENTITIES[0]} 
                  isSelected={selectedEntity === ENTITIES[0].id}
                  onClick={() => setSelectedEntity(ENTITIES[0].id)}
                  userRole={userRole}
                  onAction={handleEntityAction}
                />
                
                {/* Connection line down */}
                <div style={{ width: 2, height: 24, background: "#9CA3AF" }} />
                
                {/* Horizontal connector */}
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ display: "flex" }}>
                      {/* Left branch line */}
                      <div style={{ width: 200, height: 2, background: "#9CA3AF" }} />
                      {/* Right branch line */}
                      <div style={{ width: 200, height: 2, background: "#9CA3AF" }} />
                    </div>
                    
                    {/* Level 2 entities */}
                    <div style={{ display: "flex", gap: 100, marginTop: 0 }}>
                      {/* Americas branch */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 2, height: 24, background: "#9CA3AF" }} />
                        <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>100.00%</div>
                        <EntityCard 
                          entity={ENTITIES[1]} 
                          isSelected={selectedEntity === ENTITIES[1].id}
                          onClick={() => setSelectedEntity(ENTITIES[1].id)}
                          userRole={userRole}
                          onAction={handleEntityAction}
                        />
                        
                        {/* Americas children */}
                        <div style={{ width: 2, height: 24, background: "#9CA3AF" }} />
                        <div style={{ display: "flex" }}>
                          <div style={{ width: 100, height: 2, background: "#9CA3AF" }} />
                          <div style={{ width: 100, height: 2, background: "#9CA3AF" }} />
                        </div>
                        <div style={{ display: "flex", gap: 24 }}>
                          {/* East Coast */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: 2, height: 24, background: "#9CA3AF" }} />
                            <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>100.00%</div>
                            <EntityCard 
                              entity={ENTITIES[3]} 
                              isSelected={selectedEntity === ENTITIES[3].id}
                              onClick={() => setSelectedEntity(ENTITIES[3].id)}
                              userRole={userRole}
                              onAction={handleEntityAction}
                            />
                            
                            {/* East Coast children */}
                            <div style={{ width: 2, height: 24, background: "#9CA3AF" }} />
                            <div style={{ display: "flex" }}>
                              <div style={{ width: 60, height: 2, background: "#9CA3AF" }} />
                              <div style={{ width: 60, height: 2, background: "#9CA3AF" }} />
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ width: 2, height: 20, background: "#9CA3AF" }} />
                                <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 4 }}>80.00%</div>
                                <EntityCard 
                                  entity={ENTITIES[7]} 
                                  isSelected={selectedEntity === ENTITIES[7].id}
                                  onClick={() => setSelectedEntity(ENTITIES[7].id)}
                                  userRole={userRole}
                                  onAction={handleEntityAction}
                                />
                                {/* Tampa child */}
                                <div style={{ width: 2, height: 20, background: "#9CA3AF" }} />
                                <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 4 }}>70.00%</div>
                                <EntityCard 
                                  entity={ENTITIES[10]} 
                                  isSelected={selectedEntity === ENTITIES[10].id}
                                  onClick={() => setSelectedEntity(ENTITIES[10].id)}
                                  userRole={userRole}
                                  onAction={handleEntityAction}
                                />
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ width: 2, height: 20, background: "#9CA3AF" }} />
                                <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 4 }}>60.00%</div>
                                <EntityCard 
                                  entity={ENTITIES[8]} 
                                  isSelected={selectedEntity === ENTITIES[8].id}
                                  onClick={() => setSelectedEntity(ENTITIES[8].id)}
                                  userRole={userRole}
                                  onAction={handleEntityAction}
                                />
                              </div>
                            </div>
                          </div>
                          {/* South */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: 2, height: 24, background: "#9CA3AF" }} />
                            <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>100.00%</div>
                            <EntityCard 
                              entity={ENTITIES[4]} 
                              isSelected={selectedEntity === ENTITIES[4].id}
                              onClick={() => setSelectedEntity(ENTITIES[4].id)}
                              userRole={userRole}
                              onAction={handleEntityAction}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* UK branch */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 2, height: 24, background: "#9CA3AF" }} />
                        <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>100.00%</div>
                        <EntityCard 
                          entity={ENTITIES[2]} 
                          isSelected={selectedEntity === ENTITIES[2].id}
                          onClick={() => setSelectedEntity(ENTITIES[2].id)}
                          userRole={userRole}
                          onAction={handleEntityAction}
                        />
                        
                        {/* UK children */}
                        <div style={{ width: 2, height: 24, background: "#9CA3AF" }} />
                        <div style={{ display: "flex" }}>
                          <div style={{ width: 100, height: 2, background: "#9CA3AF" }} />
                          <div style={{ width: 100, height: 2, background: "#9CA3AF" }} />
                        </div>
                        <div style={{ display: "flex", gap: 24 }}>
                          {/* España */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: 2, height: 24, background: "#9CA3AF" }} />
                            <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>100.00%</div>
                            <EntityCard 
                              entity={ENTITIES[5]} 
                              isSelected={selectedEntity === ENTITIES[5].id}
                              onClick={() => setSelectedEntity(ENTITIES[5].id)}
                              userRole={userRole}
                              onAction={handleEntityAction}
                            />
                          </div>
                          {/* Ireland */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: 2, height: 24, background: "#9CA3AF" }} />
                            <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>100.00%</div>
                            <EntityCard 
                              entity={ENTITIES[6]} 
                              isSelected={selectedEntity === ENTITIES[6].id}
                              onClick={() => setSelectedEntity(ENTITIES[6].id)}
                              userRole={userRole}
                              onAction={handleEntityAction}
                            />
                            {/* NI child */}
                            <div style={{ width: 2, height: 20, background: "#9CA3AF" }} />
                            <div style={{ fontSize: 9, color: "#6B7280", marginBottom: 4 }}>100.00%</div>
                            <EntityCard 
                              entity={ENTITIES[9]} 
                              isSelected={selectedEntity === ENTITIES[9].id}
                              onClick={() => setSelectedEntity(ENTITIES[9].id)}
                              userRole={userRole}
                              onAction={handleEntityAction}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom toolbar */}
            <div style={{ 
              height: 40, background: "#fff", borderTop: "1px solid #E5E7EB",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}>
              <button style={{ padding: "4px 8px", background: "none", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 11, color: "#6B7280" }}>↗</button>
              <button style={{ padding: "4px 8px", background: "none", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 11, color: "#6B7280" }}>⬇</button>
              <button style={{ padding: "4px 8px", background: "none", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 11, color: "#6B7280" }}>⬆</button>
              <button style={{ padding: "4px 8px", background: "none", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 11, color: "#6B7280" }}>✕</button>
              <span style={{ margin: "0 8px", color: "#9CA3AF" }}>—</span>
              <span style={{ fontSize: 12, color: "#6B7280" }}>70%</span>
              <span style={{ color: "#9CA3AF" }}>▼</span>
              <button style={{ padding: "4px 8px", background: "none", border: "1px solid #E5E7EB", borderRadius: 4, fontSize: 11, color: "#6B7280" }}>+</button>
            </div>
          </main>

          {/* Right Sidebar - AI Intelligence Panel */}
          {aiPanelOpen && (
            <aside style={{ width: 360, background: "#FFFFFF", borderLeft: "1px solid #E5E7EB", display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
              
              {/* Panel Header */}
              <div style={{ 
                padding: "12px 16px", borderBottom: "1px solid #E5E7EB",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#F5F3FF"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>✨</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#5B21B6" }}>
                    {userRole === "gc" ? "Structure Intel" : "Data Quality"}
                  </span>
                  <span style={{ 
                    fontSize: 9, padding: "2px 6px", borderRadius: 4,
                    background: userRole === "gc" ? "#E0E7FF" : "#FEF3C7",
                    color: userRole === "gc" ? "#4338CA" : "#B45309",
                    fontWeight: 600
                  }}>
                    {userRole === "gc" ? "GC VIEW" : "PARALEGAL"}
                  </span>
                </div>
                <button 
                  onClick={() => setAiPanelOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18 }}
                >
                  ×
                </button>
              </div>

              {/* Tab Navigation */}
              <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
                {[
                  { id: "structure" as const, label: "Structure" },
                  { id: "risks" as const, label: "Risks", count: STRUCTURAL_RISKS.length },
                  { id: "actions" as const, label: "Actions" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setInsightPanelTab(tab.id)}
                    style={{
                      flex: 1, padding: "10px 8px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: "none", border: "none",
                      color: insightPanelTab === tab.id ? "#5B21B6" : "#6B7280",
                      borderBottom: insightPanelTab === tab.id ? "2px solid #5B21B6" : "2px solid transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4
                    }}
                  >
                    {tab.label}
                    {tab.count && (
                      <span style={{ 
                        fontSize: 10, padding: "1px 5px", borderRadius: 8,
                        background: insightPanelTab === tab.id ? "#7C3AED" : "#FEE2E2",
                        color: insightPanelTab === tab.id ? "#fff" : "#DC2626"
                      }}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Panel Content */}
              <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
                
                {/* STRUCTURE TAB */}
                {insightPanelTab === "structure" && (
                  <div>
                    {/* Selected Entity Context */}
                    {selectedEntityData && (
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>SELECTED ENTITY</div>
                        <div style={{ padding: 12, background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{selectedEntityData.name}</span>
                            <CountryFlag code={selectedEntityData.countryCode} size={18} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
                            <div>
                              <span style={{ color: "#6B7280" }}>Country:</span>
                              <span style={{ color: "#111827", marginLeft: 4 }}>{selectedEntityData.country}</span>
                            </div>
                            <div>
                              <span style={{ color: "#6B7280" }}>Type:</span>
                              <span style={{ color: "#111827", marginLeft: 4 }}>{selectedEntityData.type}</span>
                            </div>
                            {selectedEntityData.ownership && (
                              <div>
                                <span style={{ color: "#6B7280" }}>Ownership:</span>
                                <span style={{ color: "#111827", marginLeft: 4 }}>{selectedEntityData.ownership}</span>
                              </div>
                            )}
                          </div>
                          {selectedEntityData.hasIssues && (
                            <div style={{ marginTop: 10, padding: 8, background: "#FEF2F2", borderRadius: 6, fontSize: 11, color: "#991B1B", display: "flex", alignItems: "center", gap: 6 }}>
                              <span>⚠</span>
                              <span>{selectedEntityData.issueCount} issue{selectedEntityData.issueCount! > 1 ? "s" : ""} requiring attention</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Complexity Metrics */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>COMPLEXITY INDICATORS</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ padding: 12, background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB", textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 700, color: "#1E3A5F" }}>{STRUCTURE_METRICS.totalEntities}</div>
                          <div style={{ fontSize: 10, color: "#6B7280" }}>Total Entities</div>
                        </div>
                        <div style={{ padding: 12, background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB", textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 700, color: "#1E3A5F" }}>{STRUCTURE_METRICS.jurisdictions}</div>
                          <div style={{ fontSize: 10, color: "#6B7280" }}>Jurisdictions</div>
                        </div>
                        <div style={{ padding: 12, background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB", textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 700, color: STRUCTURE_METRICS.ownershipLayers > 5 ? "#D97706" : "#1E3A5F" }}>{STRUCTURE_METRICS.ownershipLayers}</div>
                          <div style={{ fontSize: 10, color: "#6B7280" }}>Ownership Layers</div>
                        </div>
                        <div style={{ padding: 12, background: STRUCTURE_METRICS.complexityScore > 70 ? "#FEF3C7" : "#ECFDF5", borderRadius: 8, border: `1px solid ${STRUCTURE_METRICS.complexityScore > 70 ? "#FDE68A" : "#A7F3D0"}`, textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 700, color: STRUCTURE_METRICS.complexityScore > 70 ? "#B45309" : "#047857" }}>{STRUCTURE_METRICS.complexityScore}</div>
                          <div style={{ fontSize: 10, color: "#6B7280" }}>Complexity Score</div>
                        </div>
                      </div>
                    </div>

                    {/* Peer Benchmarks */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>VS PEER BENCHMARKS</div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {PEER_BENCHMARKS.map((b, i) => (
                          <div key={i} style={{ 
                            padding: 10, borderRadius: 6,
                            background: b.status === "above" ? "#FEF2F2" : "#ECFDF5",
                            border: `1px solid ${b.status === "above" ? "#FECACA" : "#A7F3D0"}`
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 500, color: "#111827" }}>{b.metric}</span>
                              <span style={{ fontSize: 11, fontWeight: 600, color: b.status === "above" ? "#DC2626" : "#059669" }}>
                                {b.yours} vs {b.peerAvg} avg
                              </span>
                            </div>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>{b.note}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* RISKS TAB */}
                {insightPanelTab === "risks" && (
                  <div>
                    {/* Risk Summary */}
                    <div style={{ marginBottom: 16, padding: 12, background: "#FEF2F2", borderRadius: 8, border: "1px solid #FECACA" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>⚠️</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#DC2626" }}>{STRUCTURAL_RISKS.length} structural risks detected</div>
                          <div style={{ fontSize: 11, color: "#991B1B" }}>Across {STRUCTURE_METRICS.riskEntities} entities</div>
                        </div>
                      </div>
                    </div>

                    {/* Risk List */}
                    <div style={{ display: "grid", gap: 10 }}>
                      {STRUCTURAL_RISKS.map((risk) => (
                        <div key={risk.id} style={{ 
                          padding: 12, borderRadius: 8,
                          background: "#fff",
                          border: `1px solid ${risk.severity === "high" ? "#FECACA" : risk.severity === "medium" ? "#FDE68A" : "#E5E7EB"}`
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ 
                                fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 600,
                                background: risk.severity === "high" ? "#FEE2E2" : risk.severity === "medium" ? "#FEF3C7" : "#F3F4F6",
                                color: risk.severity === "high" ? "#DC2626" : risk.severity === "medium" ? "#B45309" : "#6B7280"
                              }}>
                                {risk.severity.toUpperCase()}
                              </span>
                              <span style={{ fontSize: 10, color: "#6B7280" }}>{risk.entity}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 12, color: "#111827", marginBottom: 8 }}>{risk.description}</div>
                          {risk.delta && (
                            <div style={{ fontSize: 10, color: "#DC2626", marginBottom: 8 }}>
                              ⚡ {risk.delta}
                            </div>
                          )}
                          
                          {/* Suggested Action */}
                          <div style={{ 
                            padding: 8, background: "#F0FDF4", borderRadius: 6,
                            border: "1px solid #D1FAE5", display: "flex", alignItems: "center", gap: 8
                          }}>
                            <span style={{ fontSize: 11 }}>🤖</span>
                            <span style={{ fontSize: 11, color: "#166534", flex: 1 }}>{risk.suggestedAction}</span>
                            <button style={{
                              padding: "4px 10px", background: "#15803D", color: "#fff",
                              border: "none", borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: "pointer"
                            }}>
                              Fix
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTIONS TAB */}
                {insightPanelTab === "actions" && (
                  <div>
                    {/* Agent Actions */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                        What would you like to do?
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                        EntitiesAI can help you manage your corporate structure
                      </div>

                      <div style={{ display: "grid", gap: 10 }}>
                        {/* Quick action */}
                        <div style={{ 
                          padding: 14, background: "#F9FAFB", borderRadius: 10, 
                          border: "1px solid #E5E7EB"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>
                              Run compliance check
                            </div>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#ECFDF5", color: "#059669", fontWeight: 600 }}>
                              INSTANT
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                            Check all entities for missing filings, expired directors, and data gaps
                          </div>
                          <button style={{ 
                            padding: "8px 14px", background: "#7C3AED", color: "#fff",
                            border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer"
                          }}>
                            Run Check
                          </button>
                        </div>

                        {/* Agent draft action */}
                        <div style={{ 
                          padding: 14, background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)", 
                          borderRadius: 10, border: "1px solid #DDD6FE"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "#5B21B6", fontWeight: 600 }}>
                              Generate structure report
                            </div>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#EDE9FE", color: "#7C3AED", fontWeight: 600 }}>
                              AGENT DRAFT
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                            Create a board-ready report showing ownership complexity and risk exposure
                          </div>
                          <button style={{ 
                            padding: "8px 14px", background: "#fff", color: "#7C3AED",
                            border: "1px solid #7C3AED", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer"
                          }}>
                            Generate
                          </button>
                        </div>

                        {/* Peer comparison */}
                        <div style={{ 
                          padding: 14, background: "#FFFBEB", 
                          borderRadius: 10, border: "1px solid #FDE68A"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 13, color: "#92400E", fontWeight: 600 }}>
                              Compare to peer structures
                            </div>
                            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#FEF3C7", color: "#B45309", fontWeight: 600 }}>
                              ANALYSIS
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                            See how similar organizations structure themselves for regulatory and tax efficiency
                          </div>
                          <button style={{ 
                            padding: "8px 14px", background: "#F59E0B", color: "#fff",
                            border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer"
                          }}>
                            Analyze
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>RECENT ACTIVITY</div>
                      <div style={{ display: "grid", gap: 6 }}>
                        {RECENT_ACTIVITY.map((activity, i) => (
                          <div key={i} style={{ 
                            padding: 10, background: "#F9FAFB", borderRadius: 6, 
                            border: "1px solid #E5E7EB", fontSize: 11
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontWeight: 600, color: "#111827" }}>{activity.action}</span>
                              <span style={{ color: "#9CA3AF" }}>{activity.date}</span>
                            </div>
                            <div style={{ color: "#374151" }}>{activity.entity}</div>
                            <div style={{ color: "#6B7280", marginTop: 2 }}>{activity.detail}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Prompt Input */}
              <div style={{ padding: 12, borderTop: "1px solid #E5E7EB" }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 6 }}>Quick questions:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {QUESTIONS_TO_ASK.slice(0, 2).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setPromptValue(q)}
                        style={{
                          padding: "4px 8px", background: "#F3F4F6", 
                          border: "none", borderRadius: 4,
                          fontSize: 10, color: "#6B7280", cursor: "pointer"
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ 
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                  background: "#F5F3FF", borderRadius: 8, border: "1px solid #DDD6FE"
                }}>
                  <span style={{ fontSize: 14 }}>✨</span>
                  <input 
                    type="text" 
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder="Ask about this structure..."
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

          {/* Filter Panel (Right side, only when AI panel closed) */}
          {!aiPanelOpen && (
            <aside style={{ width: 240, background: "#FFFFFF", borderLeft: "1px solid #E5E7EB", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Edit</span>
                <button style={{ 
                  padding: "6px 16px", background: "#3B82F6", color: "#fff",
                  border: "none", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer"
                }}>
                  Apply
                </button>
              </div>
              
              {/* Tabs */}
              <div style={{ display: "flex", marginBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
                {["Filter", "Group", "Sort", "Attributes (3)"].map((tab, i) => (
                  <button
                    key={i}
                    style={{
                      flex: 1, padding: "8px 4px", background: "none", border: "none",
                      fontSize: 11, color: i === 0 ? "#3B82F6" : "#6B7280", cursor: "pointer",
                      borderBottom: i === 0 ? "2px solid #3B82F6" : "none"
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Filter Options */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>Add a filter</span>
                  <span style={{ fontSize: 11, color: "#3B82F6", cursor: "pointer" }}>Reset ↻</span>
                </div>
                <input 
                  type="text"
                  placeholder="Search..."
                  style={{
                    width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB",
                    borderRadius: 4, fontSize: 12, marginBottom: 8
                  }}
                />
                <div style={{ display: "grid", gap: 4 }}>
                  {["Country", "Company Status", "Company Type", "Entity Type", "Name", "Registration No.", "Dead Record", "Managed By"].map((filter, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 12px", background: "#F9FAFB", borderRadius: 4,
                        fontSize: 12, color: i < 3 ? "#3B82F6" : "#374151", cursor: "pointer"
                      }}
                    >
                      {filter}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Share with C-Suite Modal */}
      {showShareModal && shareEntity && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000
          }}
          onClick={() => setShowShareModal(false)}
        >
          <div 
            style={{
              background: "#fff",
              borderRadius: 16,
              width: 520,
              maxHeight: "80vh",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ 
              padding: "20px 24px", 
              background: "linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)",
              color: "#fff"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>Share with C-Suite</div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Prepare executive briefing for Board review</div>
                </div>
                <button 
                  onClick={() => setShowShareModal(false)}
                  style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 20 }}
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div style={{ padding: "24px" }}>
              {/* Entity Summary */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>REGARDING</div>
                <div style={{ 
                  padding: 16, 
                  background: "#F9FAFB", 
                  borderRadius: 8,
                  border: "1px solid #E5E7EB"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>{shareEntity.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{shareEntity.country} · {shareEntity.type}</div>
                    </div>
                    <CountryFlag code={shareEntity.countryCode} size={24} />
                  </div>
                </div>
              </div>
              
              {/* Briefing content */}
              {ENTITY_ACTIONS[shareEntity.id] && (
                <>
                  {/* Risks */}
                  {ENTITY_ACTIONS[shareEntity.id].risks && ENTITY_ACTIONS[shareEntity.id].risks!.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#DC2626", marginBottom: 8 }}>RISKS TO FLAG AT BOARD</div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {ENTITY_ACTIONS[shareEntity.id].risks!.map((risk, i) => (
                          <div 
                            key={i}
                            style={{ 
                              padding: 12, 
                              background: "#FEF2F2", 
                              borderRadius: 8,
                              border: "1px solid #FECACA",
                              fontSize: 13,
                              color: "#991B1B",
                              display: "flex",
                              alignItems: "center",
                              gap: 8
                            }}
                          >
                            <span>⚠️</span>
                            {risk}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Opportunities */}
                  {ENTITY_ACTIONS[shareEntity.id].opportunities && ENTITY_ACTIONS[shareEntity.id].opportunities!.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#059669", marginBottom: 8 }}>OPPORTUNITIES / PROPOSALS</div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {ENTITY_ACTIONS[shareEntity.id].opportunities!.map((opp, i) => (
                          <div 
                            key={i}
                            style={{ 
                              padding: 12, 
                              background: "#ECFDF5", 
                              borderRadius: 8,
                              border: "1px solid #A7F3D0",
                              fontSize: 13,
                              color: "#065F46",
                              display: "flex",
                              alignItems: "center",
                              gap: 8
                            }}
                          >
                            <span>💡</span>
                            {opp}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Recommendation */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>RECOMMENDATION</div>
                    <div style={{ 
                      padding: 16, 
                      background: ENTITY_ACTIONS[shareEntity.id].worthIt ? "#F0FDF4" : "#FFFBEB", 
                      borderRadius: 8,
                      border: `1px solid ${ENTITY_ACTIONS[shareEntity.id].worthIt ? "#D1FAE5" : "#FDE68A"}`
                    }}>
                      <div style={{ 
                        fontSize: 14, 
                        fontWeight: 600, 
                        color: ENTITY_ACTIONS[shareEntity.id].worthIt ? "#047857" : "#92400E",
                        marginBottom: 4
                      }}>
                        {ENTITY_ACTIONS[shareEntity.id].worthIt ? "Recommend action" : "Consider deferring"}
                      </div>
                      <div style={{ fontSize: 12, color: ENTITY_ACTIONS[shareEntity.id].worthIt ? "#065F46" : "#78350F" }}>
                        {ENTITY_ACTIONS[shareEntity.id].worthItReason}
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Recipients */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>SHARE WITH</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    { name: "CEO", initials: "MT", selected: true },
                    { name: "CFO", initials: "JK", selected: true },
                    { name: "COO", initials: "SL", selected: false },
                    { name: "CHRO", initials: "AP", selected: false },
                  ].map((person, i) => (
                    <button
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: person.selected ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        background: person.selected ? "#F5F3FF" : "#fff",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: "50%", 
                        background: person.selected ? "#7C3AED" : "#E5E7EB",
                        color: person.selected ? "#fff" : "#6B7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 600
                      }}>
                        {person.initials}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{person.name}</span>
                      {person.selected && <span style={{ color: "#7C3AED" }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Add note */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>ADD A NOTE (optional)</div>
                <textarea
                  placeholder="Add context for the executive team..."
                  style={{
                    width: "100%",
                    height: 80,
                    padding: 12,
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    fontSize: 13,
                    resize: "none",
                    outline: "none"
                  }}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div style={{ 
              padding: "16px 24px", 
              background: "#F9FAFB",
              borderTop: "1px solid #E5E7EB",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <button 
                onClick={() => setShowShareModal(false)}
                style={{
                  padding: "10px 20px",
                  background: "none",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#6B7280",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <button 
                  style={{
                    padding: "10px 20px",
                    background: "#fff",
                    border: "1px solid #7C3AED",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#7C3AED",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <span>📋</span> Save as Draft
                </button>
                <button 
                  onClick={() => {
                    setShowShareModal(false);
                    // Show success state
                  }}
                  style={{
                    padding: "10px 24px",
                    background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <span>📤</span> Send Briefing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
