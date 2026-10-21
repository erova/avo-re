"use client";

import React from "react";
import { z } from "zod";

// Utility
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Canvas Types
export type CanvasType = 
  | "none" 
  | "workflow" 
  | "document" 
  | "reporting" 
  | "search" 
  | "meeting" 
  | "email";

// ============================================================================
// TAMBO COMPONENT SCHEMAS & UI COMPONENTS
// These components can be rendered by Tambo AI or used in demo mode
// ============================================================================

// 1. WorkflowStepCard - For Workflow Canvas progress & context
const workflowStepSchema = z.object({
  id: z.string().nullish().default("step-0"),
  title: z.string().nullish().default("Step"),
  description: z.string().nullish().default(""),
  status: z.string().describe("Status: pending, in_progress, or complete").nullish().default("pending"),
  source: z.string().nullish(),
  sourceType: z.string().nullish(),
});

export function WorkflowStepCard({ title, description, status, source, sourceType }: z.infer<typeof workflowStepSchema>) {
  const statusConfig: Record<string, { icon: string; color: string; bg: string }> = {
    pending: { icon: "○", color: "text-[#6e7681]", bg: "bg-[#6e7681]/20" },
    in_progress: { icon: "◐", color: "text-[#58a6ff]", bg: "bg-[#58a6ff]/20" },
    complete: { icon: "✓", color: "text-[#3fb950]", bg: "bg-[#3fb950]/20" },
    completed: { icon: "✓", color: "text-[#3fb950]", bg: "bg-[#3fb950]/20" },
    done: { icon: "✓", color: "text-[#3fb950]", bg: "bg-[#3fb950]/20" },
    active: { icon: "◐", color: "text-[#58a6ff]", bg: "bg-[#58a6ff]/20" },
  };
  const normalizedStatus = (status || "pending").toLowerCase().replace(/[\s-]/g, "_");
  const config = statusConfig[normalizedStatus] || statusConfig.pending;
  
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs", config.bg, config.color)}>
        {config.icon}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#f0f6fc]">{title}</span>
          {source && (
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-[10px] text-[#8b949e]">
              {sourceType || "Source"}: {source}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-[#8b949e]">{description}</p>
      </div>
    </div>
  );
}

// 2. DocumentDraftCard - For Document Canvas AI drafts
const documentDraftSchema = z.object({
  id: z.string().nullish().default("doc-0"),
  title: z.string().nullish().default("Draft Document"),
  documentType: z.string().nullish().default("Document"),
  preview: z.string().nullish().default(""),
  suggestions: z.array(z.string()).nullish().default([]),
  lastEdited: z.string().nullish(),
});

export function DocumentDraftCard({ title, documentType, preview, suggestions, lastEdited }: z.infer<typeof documentDraftSchema>) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="rounded bg-[#58a6ff]/20 px-2 py-0.5 text-[10px] text-[#58a6ff]">{documentType}</span>
          <h4 className="mt-1 text-sm font-semibold text-[#f0f6fc]">{title}</h4>
        </div>
        {lastEdited && <span className="text-[10px] text-[#6e7681]">{lastEdited}</span>}
      </div>
      {preview && (
        <div className="mt-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
          <p className="line-clamp-4 text-xs text-[#8b949e]">{preview}</p>
        </div>
      )}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#6e7681]">AI Suggestions</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, i) => (
              <button key={i} className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-1 text-[10px] text-[#8b949e] hover:border-[#58a6ff]/50 hover:text-[#f0f6fc]">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 3. ReportInsightCard - For Reporting Canvas AI analysis
const reportInsightSchema = z.object({
  id: z.string().nullish().default("insight-0"),
  title: z.string().nullish().default("Insight"),
  insight: z.string().nullish().default(""),
  metric: z.string().nullish(),
  change: z.string().nullish(),
  changeType: z.string().describe("Change type: positive, negative, or neutral").nullish().default("neutral"),
  period: z.string().nullish(),
});

export function ReportInsightCard({ title, insight, metric, change, changeType, period }: z.infer<typeof reportInsightSchema>) {
  const changeColors: Record<string, string> = {
    positive: "text-[#3fb950]",
    negative: "text-[#da3633]",
    neutral: "text-[#8b949e]",
    up: "text-[#3fb950]",
    down: "text-[#da3633]",
    increase: "text-[#3fb950]",
    decrease: "text-[#da3633]",
  };
  
  return (
    <div className="rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/5 p-4">
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold text-[#f0f6fc]">{title}</h4>
        {period && <span className="text-[10px] text-[#6e7681]">{period}</span>}
      </div>
      <p className="mt-2 text-xs text-[#8b949e]">{insight}</p>
      {(metric || change) && (
        <div className="mt-3 flex items-center gap-4">
          {metric && <span className="text-lg font-semibold text-[#f0f6fc]">{metric}</span>}
          {change && <span className={cn("text-sm", changeColors[(changeType || "neutral").toLowerCase()] || changeColors.neutral)}>{change}</span>}
        </div>
      )}
    </div>
  );
}

// 4. SearchResultCard - For AI Search Canvas cross-system results
const searchResultSchema = z.object({
  id: z.string().nullish().default("result-0"),
  title: z.string().nullish().default("Result"),
  source: z.string().nullish().default("Unknown"),
  sourceIcon: z.string().nullish().default("📄"),
  snippet: z.string().nullish().default(""),
  relevance: z.number().nullish().default(0),
  lastModified: z.string().nullish(),
  owner: z.string().nullish(),
});

export function SearchResultCard({ title, source, sourceIcon, snippet, relevance, lastModified, owner }: z.infer<typeof searchResultSchema>) {
  const safeRelevance = relevance ?? 0;
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 transition hover:border-[#f0883e]/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{sourceIcon || "📄"}</span>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">{source || "Unknown"}</span>
            {lastModified && <span className="text-xs text-[#6e7681]">· {lastModified}</span>}
          </div>
          <h4 className="mt-2 font-medium text-[#f0f6fc]">{title || "Result"}</h4>
          <p className="mt-1 text-sm text-[#8b949e]">{snippet || ""}</p>
          {owner && <p className="mt-2 text-xs text-[#58a6ff]">Owner: {owner}</p>}
        </div>
        {safeRelevance > 0 && (
          <span className="shrink-0 rounded-full border border-[#3fb950]/40 bg-[#3fb950]/10 px-2 py-0.5 text-xs font-medium text-[#3fb950]">
            {safeRelevance}% match
          </span>
        )}
      </div>
    </div>
  );
}

// 5. ContractSummaryCard - For search results involving contracts
const contractSummarySchema = z.object({
  id: z.string().nullish().default("contract-0"),
  title: z.string().nullish().default("Contract"),
  counterparty: z.string().nullish().default(""),
  value: z.string().nullish(),
  renewalDate: z.string().nullish(),
  owner: z.string().nullish(),
  riskScore: z.string().nullish(),
  status: z.string().nullish().default("Active"),
});

export function ContractSummaryCard({ title, counterparty, value, renewalDate, owner, riskScore, status }: z.infer<typeof contractSummarySchema>) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-[#f0f6fc]">{title}</h4>
          {counterparty && <p className="text-xs text-[#8b949e]">{counterparty}</p>}
        </div>
        <span className="rounded bg-[#58a6ff]/20 px-2 py-0.5 text-[10px] text-[#58a6ff]">{status}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {value && (
          <div><span className="text-[#6e7681]">Value:</span> <span className="text-[#f0f6fc]">{value}</span></div>
        )}
        {renewalDate && (
          <div><span className="text-[#6e7681]">Renewal:</span> <span className="text-[#d29922]">{renewalDate}</span></div>
        )}
        {owner && (
          <div><span className="text-[#6e7681]">Owner:</span> <span className="text-[#58a6ff]">{owner}</span></div>
        )}
        {riskScore && (
          <div><span className="text-[#6e7681]">Risk:</span> <span className="text-[#f0f6fc]">{riskScore}</span></div>
        )}
      </div>
    </div>
  );
}

// 6. MeetingProposalCard - For Meeting Scheduler AI suggestions
const meetingProposalSchema = z.object({
  id: z.string().nullish().default("meeting-0"),
  time: z.string().nullish().default("3:00 PM"),
  date: z.string().nullish().default("Tomorrow"),
  available: z.boolean().nullish().default(true),
  aiNote: z.string().nullish(),
  conflict: z.string().nullish(),
  attendeesAvailable: z.number().nullish(),
  totalAttendees: z.number().nullish(),
});

export function MeetingProposalCard({ time, date, available, aiNote, conflict, attendeesAvailable, totalAttendees }: z.infer<typeof meetingProposalSchema>) {
  const safeTime = time || "3:00 PM";
  const safeDate = date || "Tomorrow";
  const safeAvailable = available ?? true;
  
  return (
    <div className={cn(
      "rounded-xl border p-4 transition",
      safeAvailable 
        ? "border-[#30363d] bg-[#161b22] hover:border-[#a371f7]/50 cursor-pointer"
        : "border-[#30363d] bg-[#161b22] opacity-50"
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-[#f0f6fc]">{safeTime}</p>
          <p className="text-sm text-[#8b949e]">{safeDate}</p>
        </div>
        {safeAvailable ? (
          <span className="rounded-full border border-[#3fb950]/40 bg-[#3fb950]/10 px-2 py-0.5 text-xs text-[#3fb950]">
            {attendeesAvailable && totalAttendees ? `${attendeesAvailable}/${totalAttendees} available` : "Available"}
          </span>
        ) : (
          <span className="rounded-full border border-[#da3633]/40 bg-[#da3633]/10 px-2 py-0.5 text-xs text-[#da3633]">
            Conflict
          </span>
        )}
      </div>
      {aiNote && (
        <p className="mt-2 rounded-lg bg-[#a371f7]/10 px-3 py-2 text-xs text-[#a371f7]">
          <span className="font-medium">AI:</span> {aiNote}
        </p>
      )}
      {conflict && (
        <p className="mt-2 text-xs text-[#da3633]">{conflict}</p>
      )}
    </div>
  );
}

// 7. SecureAttachmentCard - For Email Canvas board material links
const secureAttachmentSchema = z.object({
  id: z.string().nullish().default("attach-0"),
  title: z.string().nullish().default("Document"),
  documentType: z.string().nullish().default("File"),
  isSecure: z.boolean().nullish().default(true),
  accessLevel: z.string().nullish().default("Board Members"),
});

export function SecureAttachmentCard({ title, documentType, isSecure, accessLevel }: z.infer<typeof secureAttachmentSchema>) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#58a6ff]/30 bg-[#58a6ff]/5 px-3 py-2">
      <div className="flex items-center gap-2">
        {isSecure && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )}
        <div>
          <span className="text-sm text-[#f0f6fc]">{title}</span>
          <span className="ml-2 text-xs text-[#6e7681]">{documentType}</span>
        </div>
      </div>
      <span className="text-[10px] text-[#8b949e]">{accessLevel}</span>
    </div>
  );
}

// 8. EmailDraftCard - For drafting emails with secure attachments
const emailDraftSchema = z.object({
  id: z.string().nullish().default("email-0"),
  to: z.string().nullish().describe("Recipients, e.g., 'CFO, Board Secretary'").default(""),
  cc: z.string().nullish(),
  subject: z.string().nullish().describe("Email subject line").default(""),
  preview: z.string().nullish().describe("First few lines of the email body").default(""),
  attachments: z.array(z.string()).nullish().describe("List of attached document names").default([]),
  isSecure: z.boolean().nullish().default(true),
  status: z.string().nullish().describe("Draft status: draft, ready, sent").default("draft"),
}).describe("Shows an email draft with recipients, subject, preview, and secure attachments");

export function EmailDraftCard({ to, cc, subject, preview, attachments, isSecure, status }: z.infer<typeof emailDraftSchema>) {
  // Handle null/undefined values
  const safeTo = to || "";
  const safeSubject = subject || "Email Draft";
  const safePreview = preview || "";
  const safeAttachments = attachments || [];
  const safeIsSecure = isSecure ?? true;
  const safeStatus = status || "draft";
  
  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: "DRAFT", color: "text-[#d29922]", bg: "bg-[#d29922]/10 border-[#d29922]/30" },
    ready: { label: "READY", color: "text-[#3fb950]", bg: "bg-[#3fb950]/10 border-[#3fb950]/30" },
    sent: { label: "SENT", color: "text-[#8b949e]", bg: "bg-[#8b949e]/10 border-[#8b949e]/30" },
  };
  const config = statusConfig[safeStatus] || statusConfig.draft;
  
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
          </svg>
          <span className="text-sm font-medium text-[#f0f6fc]">Email Draft</span>
        </div>
        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", config.bg, config.color)}>
          {config.label}
        </span>
      </div>
      
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex">
          <span className="w-12 text-[#6e7681]">To:</span>
          <span className="text-[#f0f6fc]">{safeTo}</span>
        </div>
        {cc && (
          <div className="flex">
            <span className="w-12 text-[#6e7681]">CC:</span>
            <span className="text-[#8b949e]">{cc}</span>
          </div>
        )}
        <div className="flex">
          <span className="w-12 text-[#6e7681]">Subj:</span>
          <span className="font-medium text-[#f0f6fc]">{safeSubject}</span>
        </div>
      </div>
      
      {safePreview && (
        <div className="mt-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
          <p className="line-clamp-3 text-xs text-[#8b949e]">&ldquo;{safePreview}&rdquo;</p>
        </div>
      )}
      
      {safeAttachments && safeAttachments.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {safeAttachments.map((att, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-[#58a6ff]/30 bg-[#58a6ff]/5 px-2.5 py-1.5">
              {safeIsSecure && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
              <span className="text-xs text-[#f0f6fc]">{att}</span>
              <span className="text-[10px] text-[#58a6ff]">Secure Link</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex items-center gap-2">
        <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">
          Edit Draft
        </button>
        <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">
          Attach More
        </button>
        <button className="rounded-lg bg-[#58a6ff] px-3 py-1.5 text-xs font-medium text-[#0d1117] hover:bg-[#79b8ff]">
          Send
        </button>
      </div>
    </div>
  );
}

// Export Tambo component registry
export const tamboCanvasComponents = [
  { name: "WorkflowStepCard", description: "Shows a workflow step with status. Use when discussing workflows or multi-step processes.", component: WorkflowStepCard, propsSchema: workflowStepSchema },
  { name: "DocumentDraftCard", description: "Displays an AI-generated document draft. Use when user asks to draft memos, letters, or documents.", component: DocumentDraftCard, propsSchema: documentDraftSchema },
  { name: "ReportInsightCard", description: "Shows data insights with metrics. Use when user asks about trends, analytics, or reports.", component: ReportInsightCard, propsSchema: reportInsightSchema },
  { name: "SearchResultCard", description: "Displays a search result from Diligent systems. Use when user searches for people, documents, or information.", component: SearchResultCard, propsSchema: searchResultSchema },
  { name: "ContractSummaryCard", description: "Shows contract details. Use when user asks about contracts, agreements, renewals, or vendors.", component: ContractSummaryCard, propsSchema: contractSummarySchema },
  { name: "MeetingProposalCard", description: "Displays a proposed meeting time. Use when user wants to schedule meetings or calls.", component: MeetingProposalCard, propsSchema: meetingProposalSchema },
  { name: "SecureAttachmentCard", description: "Shows a secure document link. Use when attaching board materials to emails.", component: SecureAttachmentCard, propsSchema: secureAttachmentSchema },
  { name: "EmailDraftCard", description: "Shows an email draft with recipients, subject, preview, and secure attachments. Use when user asks to draft, send, or compose an email.", component: EmailDraftCard, propsSchema: emailDraftSchema },
];

interface CanvasProps {
  onClose: () => void;
  initialPrompt?: string;
}

// Shared Canvas Shell
function CanvasShell({ 
  children, 
  onClose, 
  title, 
  subtitle,
  accentColor = "#58a6ff",
}: { 
  children: React.ReactNode; 
  onClose: () => void; 
  title: string;
  subtitle?: string;
  accentColor?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0d1117]">
      {/* Canvas Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#30363d] bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#f0f6fc]">{title}</h1>
            {subtitle && <p className="text-sm text-[#8b949e]">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span 
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{ 
              backgroundColor: `${accentColor}20`,
              color: accentColor,
              border: `1px solid ${accentColor}40`
            }}
          >
            Deep Work Mode
          </span>
        </div>
      </div>
      {/* Canvas Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

// ============================================
// WORKFLOW CANVAS
// ============================================
const workflowSteps = [
  { id: 1, label: "Define Objective", description: "What do you need to accomplish?" },
  { id: 2, label: "Gather Context", description: "AI pulls relevant documents and data" },
  { id: 3, label: "Draft & Review", description: "Collaborate with AI on the output" },
  { id: 4, label: "Finalize & Act", description: "Complete the workflow" },
];

const suggestedWorkflows = [
  { 
    title: "Prepare Board Materials", 
    description: "Compile agenda, resolutions, and supporting docs for upcoming board meeting",
    icon: "📋",
    estimatedTime: "45 min",
  },
  { 
    title: "Contract Renewal Review", 
    description: "Analyze expiring contracts, identify risks, prepare negotiation positions",
    icon: "📝",
    estimatedTime: "30 min",
  },
  { 
    title: "Regulatory Response", 
    description: "Draft response to regulatory inquiry with supporting documentation",
    icon: "⚖️",
    estimatedTime: "1 hr",
  },
  { 
    title: "M&A Due Diligence Checklist", 
    description: "Generate customized DD checklist and track completion",
    icon: "🔍",
    estimatedTime: "2 hrs",
  },
];

export function WorkflowCanvas({ onClose, initialPrompt }: CanvasProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [objective, setObjective] = React.useState(initialPrompt || "");
  const [isWorking, setIsWorking] = React.useState(false);
  const [gatheredContext, setGatheredContext] = React.useState<string[]>([]);

  const handleStartWorkflow = () => {
    if (!objective.trim()) return;
    setIsWorking(true);
    // Simulate AI gathering context
    setTimeout(() => {
      setGatheredContext([
        "Q1 Board Meeting Agenda (Draft) - Boards",
        "Financial Summary Q1 2025 - CFO Office",
        "Legal Department KPIs - AI Reporting",
        "Outstanding Litigation Summary - Matter Monitor",
        "Regulatory Update Memo - Compliance",
      ]);
      setCurrentStep(2);
      setIsWorking(false);
    }, 2000);
  };

  return (
    <CanvasShell 
      onClose={onClose} 
      title="Workflow Canvas" 
      subtitle="Complex, multi-step work without distractions"
      accentColor="#a371f7"
    >
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {workflowSteps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2",
                currentStep === step.id 
                  ? "bg-[#a371f7]/20 text-[#a371f7]" 
                  : currentStep > step.id
                    ? "bg-[#3fb950]/20 text-[#3fb950]"
                    : "bg-[#21262d] text-[#6e7681]"
              )}>
                <span className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  currentStep === step.id 
                    ? "bg-[#a371f7] text-white" 
                    : currentStep > step.id
                      ? "bg-[#3fb950] text-white"
                      : "bg-[#30363d] text-[#8b949e]"
                )}>
                  {currentStep > step.id ? "✓" : step.id}
                </span>
                <span className="text-sm font-medium">{step.label}</span>
              </div>
              {idx < workflowSteps.length - 1 && (
                <div className={cn(
                  "h-0.5 w-8",
                  currentStep > step.id ? "bg-[#3fb950]" : "bg-[#30363d]"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Define Objective */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <h2 className="text-xl font-semibold text-[#f0f6fc]">What do you need to accomplish?</h2>
              <p className="mt-2 text-sm text-[#8b949e]">
                Describe your goal in natural language. The AI will break it down into steps and gather relevant context.
              </p>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="mt-4 min-h-[120px] w-full resize-none rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-[#f0f6fc] placeholder:text-[#6e7681] focus:border-[#a371f7] focus:outline-none"
                placeholder="e.g., Prepare the board materials for next week's meeting, including the legal update, litigation summary, and governance scorecard..."
              />
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#6e7681]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span>AI will estimate time and complexity</span>
                </div>
                <button
                  onClick={handleStartWorkflow}
                  disabled={!objective.trim() || isWorking}
                  className="rounded-xl border border-[#a371f7] bg-[#a371f7] px-4 py-2 text-sm font-medium text-white hover:bg-[#8b5cf6] disabled:opacity-50"
                >
                  {isWorking ? "Analyzing..." : "Start Workflow"}
                </button>
              </div>
            </div>

            {/* Suggested Workflows */}
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#6e7681]">
                Or start with a template
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {suggestedWorkflows.map((workflow) => (
                  <button
                    key={workflow.title}
                    onClick={() => setObjective(workflow.description)}
                    className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 text-left transition hover:border-[#a371f7]/50 hover:bg-[#21262d]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{workflow.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#f0f6fc]">{workflow.title}</h4>
                        <p className="mt-1 text-sm text-[#8b949e]">{workflow.description}</p>
                        <p className="mt-2 text-xs text-[#6e7681]">~{workflow.estimatedTime}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Gather Context - Using WorkflowStepCard */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#f0f6fc]">Context Gathered</h2>
                  <p className="mt-2 text-sm text-[#8b949e]">
                    AI has identified relevant documents and data for your workflow.
                  </p>
                </div>
                <span className="rounded-full border border-[#3fb950]/40 bg-[#3fb950]/10 px-3 py-1 text-xs font-medium text-[#3fb950]">
                  {gatheredContext.length} sources found
                </span>
              </div>
              
              {/* Using WorkflowStepCard for each gathered item */}
              <div className="mt-4 space-y-3">
                {gatheredContext.map((item, idx) => {
                  const [title, source] = item.split(" - ");
                  return (
                    <WorkflowStepCard
                      key={idx}
                      id={`context-${idx}`}
                      title={title}
                      description="Document retrieved and ready for review"
                      status="complete"
                      source={source}
                      sourceType="From"
                    />
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button className="rounded-xl border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">
                  + Add more sources
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setCurrentStep(1)}
                  className="rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#8b949e] hover:bg-[#21262d]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="rounded-xl border border-[#a371f7] bg-[#a371f7] px-4 py-2 text-sm font-medium text-white hover:bg-[#8b5cf6]"
                >
                  Continue to Draft
                </button>
              </div>
            </div>

            {/* Objective reminder */}
            <div className="rounded-xl border border-[#30363d] bg-[#21262d] p-4">
              <p className="text-xs uppercase tracking-wider text-[#6e7681]">Your objective</p>
              <p className="mt-1 text-sm text-[#f0f6fc]">{objective}</p>
            </div>
          </div>
        )}

        {/* Step 3: Draft & Review */}
        {currentStep === 3 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Editor */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#f0f6fc]">AI Draft</h2>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#30363d]">
                      Regenerate
                    </button>
                    <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#30363d]">
                      Edit manually
                    </button>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none rounded-xl border border-[#30363d] bg-[#0d1117] p-6">
                  <h3>Board Meeting Legal Update - Q1 2025</h3>
                  <p className="text-[#8b949e]">
                    This update summarizes key legal matters, regulatory developments, and governance items for the Board&apos;s attention.
                  </p>
                  <h4>1. Active Litigation Summary</h4>
                  <p className="text-[#8b949e]">
                    Three active matters are currently being monitored. The Smith v. Acme case has a 73% probability of favorable settlement based on recent case law analysis...
                  </p>
                  <h4>2. Regulatory Watch</h4>
                  <p className="text-[#8b949e]">
                    No new regulations impacting operations this quarter. Two pending rules are being monitored with proactive compliance roadmaps prepared...
                  </p>
                  <h4>3. Governance Scorecard</h4>
                  <p className="text-[#8b949e]">
                    Board attendance: 94% · Committee compliance: Current · D&O certifications: Up to date...
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#8b949e] hover:bg-[#21262d]"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="rounded-xl border border-[#a371f7] bg-[#a371f7] px-4 py-2 text-sm font-medium text-white hover:bg-[#8b5cf6]"
                  >
                    Approve & Continue
                  </button>
                </div>
              </div>
            </div>

            {/* AI Chat Sidebar */}
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#f0f6fc]">AI Assistant</h3>
              <div className="mb-4 space-y-3">
                <div className="rounded-xl bg-[#a371f7]/10 p-3 text-sm text-[#a371f7]">
                  I&apos;ve drafted the board update based on your sources. Would you like me to add more detail to any section?
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask for changes..."
                  className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:border-[#a371f7] focus:outline-none"
                />
                <button className="rounded-lg bg-[#a371f7] px-3 py-2 text-sm text-white">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Finalize */}
        {currentStep === 4 && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="rounded-2xl border border-[#3fb950]/30 bg-[#3fb950]/5 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3fb950]/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#f0f6fc]">Workflow Complete</h2>
              <p className="mt-2 text-[#8b949e]">Your board materials are ready for distribution.</p>
            </div>

            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <h3 className="mb-4 font-semibold text-[#f0f6fc]">Next Actions</h3>
              <div className="space-y-3">
                <button className="flex w-full items-center justify-between rounded-xl border border-[#30363d] bg-[#21262d] px-4 py-3 text-left hover:bg-[#30363d]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📤</span>
                    <span className="text-sm text-[#f0f6fc]">Upload to Board Book</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7681" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
                <button className="flex w-full items-center justify-between rounded-xl border border-[#30363d] bg-[#21262d] px-4 py-3 text-left hover:bg-[#30363d]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📧</span>
                    <span className="text-sm text-[#f0f6fc]">Email preview to CFO</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7681" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
                <button className="flex w-full items-center justify-between rounded-xl border border-[#30363d] bg-[#21262d] px-4 py-3 text-left hover:bg-[#30363d]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📅</span>
                    <span className="text-sm text-[#f0f6fc]">Schedule review meeting</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7681" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-3 text-sm text-[#8b949e] hover:bg-[#21262d]"
            >
              Return to Command Center
            </button>
          </div>
        )}
      </div>
    </CanvasShell>
  );
}

// ============================================
// DOCUMENT CANVAS
// ============================================
const documentTemplates = [
  { id: "memo", name: "Legal Memo", icon: "📝" },
  { id: "contract", name: "Contract Review", icon: "📄" },
  { id: "resolution", name: "Board Resolution", icon: "📋" },
  { id: "policy", name: "Policy Draft", icon: "📜" },
  { id: "letter", name: "Legal Letter", icon: "✉️" },
  { id: "brief", name: "Executive Brief", icon: "📊" },
];

export function DocumentCanvas({ onClose, initialPrompt }: CanvasProps) {
  const [documentType, setDocumentType] = React.useState<string | null>(null);
  const [content, setContent] = React.useState("");
  const [situation, setSituation] = React.useState(initialPrompt || "");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [aiSuggestions, setAiSuggestions] = React.useState<string[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setContent(`**LEGAL MEMORANDUM**

**TO:** Board of Directors
**FROM:** Office of General Counsel  
**DATE:** ${new Date().toLocaleDateString()}
**RE:** ${situation || "Response to Regulatory Inquiry"}

---

**EXECUTIVE SUMMARY**

This memorandum addresses the recent regulatory inquiry and outlines our recommended response strategy. Based on our analysis of the relevant regulations and precedents, we recommend a cooperative approach with full documentation.

**BACKGROUND**

[AI has drafted initial content based on your situation. Edit as needed...]

**ANALYSIS**

The applicable regulatory framework under Section 12(b) requires...

**RECOMMENDATION**

We recommend the following course of action:
1. Prepare comprehensive response documentation
2. Schedule preliminary call with regulatory counsel
3. Implement enhanced compliance monitoring

**CONCLUSION**

Subject to board approval, we are prepared to proceed with the recommended response strategy.`);
      setAiSuggestions([
        "Add specific statutory citations",
        "Include timeline for response",
        "Reference similar past inquiries",
        "Add risk assessment section",
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <CanvasShell 
      onClose={onClose} 
      title="Document Canvas" 
      subtitle="Draft, create, and review with AI assistance"
      accentColor="#58a6ff"
    >
      <div className="flex h-full">
        {/* Main Editor Area */}
        <div className="flex-1 p-6">
          {!documentType ? (
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-2 text-xl font-semibold text-[#f0f6fc]">What would you like to create?</h2>
              <p className="mb-6 text-sm text-[#8b949e]">Choose a template or describe the situation to respond to.</p>
              
              {/* Situation Input */}
              <div className="mb-6 rounded-2xl border border-[#30363d] bg-[#161b22] p-4">
                <label className="mb-2 block text-sm font-medium text-[#f0f6fc]">
                  Describe the situation (optional)
                </label>
                <textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  className="min-h-[80px] w-full resize-none rounded-xl border border-[#30363d] bg-[#0d1117] p-3 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:outline-none"
                  placeholder="e.g., We received a regulatory inquiry about our data handling practices and need to draft a formal response..."
                />
              </div>
              
              {/* Document Templates */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {documentTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setDocumentType(template.id)}
                    className="flex items-center gap-3 rounded-xl border border-[#30363d] bg-[#161b22] p-4 text-left transition hover:border-[#58a6ff]/50 hover:bg-[#21262d]"
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <span className="font-medium text-[#f0f6fc]">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : !content ? (
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex items-center gap-3">
                <button
                  onClick={() => setDocumentType(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#30363d] text-[#8b949e] hover:bg-[#21262d]"
                >
                  ←
                </button>
                <h2 className="text-xl font-semibold text-[#f0f6fc]">
                  {documentTemplates.find(t => t.id === documentType)?.name}
                </h2>
              </div>
              
              <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
                <p className="mb-4 text-sm text-[#8b949e]">
                  {situation 
                    ? "AI will generate a draft based on your situation description."
                    : "AI will generate a template you can customize."}
                </p>
                {situation && (
                  <div className="mb-4 rounded-xl border border-[#30363d] bg-[#0d1117] p-3">
                    <p className="text-xs uppercase tracking-wider text-[#6e7681]">Situation</p>
                    <p className="mt-1 text-sm text-[#f0f6fc]">{situation}</p>
                  </div>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full rounded-xl border border-[#58a6ff] bg-[#58a6ff] py-3 text-sm font-medium text-white hover:bg-[#79b8ff] disabled:opacity-50"
                >
                  {isGenerating ? "Generating draft..." : "Generate Draft with AI"}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setContent(""); setDocumentType(null); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#30363d] text-[#8b949e] hover:bg-[#21262d]"
                  >
                    ←
                  </button>
                  <h2 className="text-lg font-semibold text-[#f0f6fc]">
                    {documentTemplates.find(t => t.id === documentType)?.name}
                  </h2>
                  <span className="rounded-full border border-[#3fb950]/40 bg-[#3fb950]/10 px-2 py-0.5 text-xs text-[#3fb950]">
                    Draft
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#30363d]">
                    Export
                  </button>
                  <button className="rounded-lg border border-[#58a6ff] bg-[#58a6ff] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#79b8ff]">
                    Save to Boards
                  </button>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-[calc(100%-60px)] w-full resize-none rounded-xl border border-[#30363d] bg-[#0d1117] p-6 font-mono text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* AI Suggestions Sidebar - Using DocumentDraftCard pattern */}
        {content && (
          <div className="w-72 border-l border-[#30363d] bg-[#161b22] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#f0f6fc]">AI Suggestions</h3>
            
            {/* Document info card */}
            <DocumentDraftCard
              id="current-draft"
              title={documentTemplates.find(t => t.id === documentType)?.name || "Document"}
              documentType="Draft"
              preview=""
              suggestions={aiSuggestions}
              lastEdited="Just now"
            />
            
            <div className="mt-4 border-t border-[#30363d] pt-4">
              <p className="mb-2 text-xs text-[#6e7681]">Ask AI to modify</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Make it more formal..."
                  className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-xs text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none"
                />
                <button className="rounded-lg bg-[#58a6ff] px-2 text-white">→</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CanvasShell>
  );
}

// ============================================
// REPORTING CANVAS
// ============================================
const reportingQueries = [
  { 
    query: "Board attendance trends over the last 4 quarters",
    category: "Governance",
    icon: "📊",
  },
  { 
    query: "Voting patterns by director on key resolutions",
    category: "Governance", 
    icon: "🗳️",
  },
  { 
    query: "Compare our board composition to peer group",
    category: "Benchmarking",
    icon: "📈",
  },
  { 
    query: "Committee meeting frequency vs industry average",
    category: "Benchmarking",
    icon: "📉",
  },
  { 
    query: "Director tenure and succession planning gaps",
    category: "Planning",
    icon: "👥",
  },
  { 
    query: "ESG disclosure compliance by region",
    category: "Compliance",
    icon: "🌍",
  },
];

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export function ReportingCanvas({ onClose, initialPrompt }: CanvasProps) {
  const [query, setQuery] = React.useState(initialPrompt || "");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [results, setResults] = React.useState<{
    title: string;
    insight: string;
    chartData: ChartData[];
    details: string[];
  } | null>(null);

  const handleAnalyze = (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setIsAnalyzing(true);
    setTimeout(() => {
      setResults({
        title: "Board Attendance Analysis - Q1-Q4 2024",
        insight: "Overall attendance improved 8% year-over-year, with Audit Committee showing strongest engagement at 98% average attendance.",
        chartData: [
          { label: "Q1", value: 92, color: "#58a6ff" },
          { label: "Q2", value: 88, color: "#58a6ff" },
          { label: "Q3", value: 95, color: "#58a6ff" },
          { label: "Q4", value: 97, color: "#3fb950" },
        ],
        details: [
          "Board meetings: 94% average attendance (8 meetings)",
          "Audit Committee: 98% average (4 meetings)",
          "Compensation Committee: 91% average (4 meetings)",
          "Nominating Committee: 89% average (3 meetings)",
          "2 directors below 75% threshold - flagged for discussion",
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <CanvasShell 
      onClose={onClose} 
      title="Reporting Canvas" 
      subtitle="Trends, patterns, and insights from your governance data"
      accentColor="#3fb950"
    >
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Query Input */}
        <div className="mb-6 rounded-2xl border border-[#30363d] bg-[#161b22] p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1 rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-3 text-[#f0f6fc] placeholder:text-[#6e7681] focus:border-[#3fb950] focus:outline-none"
              placeholder="Ask about trends, patterns, or comparisons... e.g., 'Show me voting patterns for ESG resolutions'"
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={!query.trim() || isAnalyzing}
              className="rounded-xl border border-[#3fb950] bg-[#3fb950] px-6 py-3 text-sm font-medium text-white hover:bg-[#2ea043] disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        {/* Results or Suggested Queries - Using ReportInsightCard */}
        {results ? (
          <div className="space-y-6">
            {/* Insight Card using Tambo component */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <ReportInsightCard
                  id="report-insight"
                  title={results.title}
                  insight={results.insight}
                  metric="94%"
                  change="+8% YoY"
                  changeType="positive"
                  period="Q1-Q4 2024"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#30363d]">
                  Export PDF
                </button>
                <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#30363d]">
                  Add to Board Book
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <h3 className="mb-4 font-semibold text-[#f0f6fc]">Attendance by Quarter</h3>
              <div className="flex h-48 items-end justify-around gap-4">
                {results.chartData.map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-16 rounded-t-lg transition-all"
                      style={{ 
                        height: `${item.value * 1.5}px`,
                        backgroundColor: item.color,
                      }}
                    />
                    <span className="text-sm text-[#8b949e]">{item.label}</span>
                    <span className="text-xs font-medium text-[#f0f6fc]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <h3 className="mb-4 font-semibold text-[#f0f6fc]">Key Findings</h3>
              <div className="space-y-2">
                {results.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[#8b949e]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3fb950]" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* New Query */}
            <button
              onClick={() => setResults(null)}
              className="w-full rounded-xl border border-[#30363d] bg-[#21262d] py-3 text-sm text-[#8b949e] hover:bg-[#30363d]"
            >
              Ask another question
            </button>
          </div>
        ) : (
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#6e7681]">
              Suggested analyses
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {reportingQueries.map((item) => (
                <button
                  key={item.query}
                  onClick={() => handleAnalyze(item.query)}
                  className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#161b22] p-4 text-left transition hover:border-[#3fb950]/50 hover:bg-[#21262d]"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-[#f0f6fc]">{item.query}</p>
                    <p className="mt-1 text-xs text-[#6e7681]">{item.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </CanvasShell>
  );
}

// ============================================
// AI SEARCH CANVAS - Uses Tambo SearchResultCard & ContractSummaryCard
// ============================================
const searchExamples = [
  "Who owns the vendor relationship with Acme Corp?",
  "Where is the signed NDA with TechPartners?",
  "Find all contracts expiring in Q2 2025",
  "Who approved the last policy change for data retention?",
  "What matters involve intellectual property claims?",
  "Find board resolutions related to M&A activity",
];

// Demo data that would come from Tambo in live mode
const demoSearchResults = {
  "acme": {
    summary: "Sarah Chen (Procurement) is the primary owner of the Acme Corp vendor relationship. The contract is valued at $2.4M annually and is up for renewal on March 15, 2025.",
    results: [
      { id: "result-1", title: "Master Services Agreement - Acme Corp", source: "Third Party Manager", sourceIcon: "📋", snippet: "...relationship owner: Sarah Chen (Procurement). Contract value: $2.4M annually. Renewal date: March 15, 2025...", relevance: 98, lastModified: "Jan 10, 2025", owner: "Sarah Chen" },
      { id: "result-2", title: "Vendor Risk Assessment - Acme Corp", source: "Risk Manager", sourceIcon: "⚠️", snippet: "...primary contact: Sarah Chen. Risk score: Medium (65/100). Last assessment: Q4 2024...", relevance: 92, lastModified: "Dec 15, 2024" },
    ],
    contract: { id: "CONTRACT-2847", title: "Acme Corp MSA", counterparty: "Acme Corp", value: "$2.4M/year", renewalDate: "Mar 15, 2025", owner: "Sarah Chen", riskScore: "Medium (65/100)", status: "Active" },
  },
  "contracts expiring": {
    summary: "Found 4 contracts expiring in Q2 2025. Total value at risk: $3.8M. Recommend initiating renewal discussions for high-value contracts immediately.",
    results: [
      { id: "result-3", title: "Master Services Agreement - Acme Corp", source: "Third Party Manager", sourceIcon: "📋", snippet: "Renewal date: March 15, 2025. Auto-renew: No. 60-day notice required.", relevance: 95, lastModified: "Jan 10, 2025", owner: "Sarah Chen" },
      { id: "result-4", title: "Software License - TechVendor", source: "Third Party Manager", sourceIcon: "💻", snippet: "Renewal date: April 1, 2025. Auto-renew: Yes. Cancel by March 1.", relevance: 90, lastModified: "Dec 1, 2024", owner: "IT Procurement" },
    ],
    contract: null,
  },
  "default": {
    summary: "I found several relevant documents across your Diligent systems. Select a result to view details.",
    results: [
      { id: "result-5", title: "Search Result", source: "Boards", sourceIcon: "📊", snippet: "Relevant content found matching your query...", relevance: 85, lastModified: "Recent" },
    ],
    contract: null,
  },
};

export function SearchCanvas({ onClose, initialPrompt }: CanvasProps) {
  const [query, setQuery] = React.useState(initialPrompt || "");
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchData, setSearchData] = React.useState<{
    summary: string;
    results: Array<{ id: string; title: string; source: string; sourceIcon: string; snippet: string; relevance: number; lastModified: string; owner?: string }>;
    contract: { id: string; title: string; counterparty: string; value: string; renewalDate: string; owner: string; riskScore: string; status: string } | null;
  } | null>(null);

  const handleSearch = (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setIsSearching(true);
    
    // In live mode, this would be a Tambo API call
    // For demo, we match keywords to return appropriate Tambo components
    setTimeout(() => {
      const lowerQuery = searchQuery.toLowerCase();
      if (lowerQuery.includes("acme") || lowerQuery.includes("who owns")) {
        setSearchData(demoSearchResults["acme"]);
      } else if (lowerQuery.includes("expir") || lowerQuery.includes("contract")) {
        setSearchData(demoSearchResults["contracts expiring"]);
      } else {
        setSearchData(demoSearchResults["default"]);
      }
      setIsSearching(false);
    }, 1500);
  };

  return (
    <CanvasShell 
      onClose={onClose} 
      title="AI Search" 
      subtitle="Find anything across all your Diligent data"
      accentColor="#f0883e"
    >
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Search Input */}
        <div className="mb-6 rounded-2xl border border-[#30363d] bg-[#161b22] p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <svg 
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6e7681]"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] py-3 pl-12 pr-4 text-[#f0f6fc] placeholder:text-[#6e7681] focus:border-[#f0883e] focus:outline-none"
                placeholder="Ask a question... e.g., 'Who owns the relationship with Acme Corp?'"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={!query.trim() || isSearching}
              className="rounded-xl border border-[#f0883e] bg-[#f0883e] px-6 py-3 text-sm font-medium text-white hover:bg-[#db7c37] disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
          <p className="mt-3 text-xs text-[#6e7681]">
            Searching across: Boards, Entities, Policy Manager, Third Party Manager, Risk Manager, Activity Center
          </p>
        </div>

        {/* Results using Tambo components */}
        {searchData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#8b949e]">
                Found <span className="font-medium text-[#f0f6fc]">{searchData.results.length} results</span> across multiple sources
              </p>
              <button
                onClick={() => setSearchData(null)}
                className="text-xs text-[#f0883e] hover:underline"
              >
                New search
              </button>
            </div>
            
            {/* AI Summary */}
            <ReportInsightCard 
              id="search-summary"
              title="AI Summary"
              insight={searchData.summary}
              changeType="neutral"
            />

            {/* Contract Card (if applicable) */}
            {searchData.contract && (
              <ContractSummaryCard {...searchData.contract} />
            )}
            
            {/* Search Result Cards */}
            <div className="space-y-3">
              {searchData.results.map((result, idx) => (
                <SearchResultCard key={idx} {...result} />
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button className="rounded-full border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm text-[#8b949e] hover:border-[#58a6ff]/50 hover:text-[#f0f6fc]">
                Export results
              </button>
              <button className="rounded-full border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm text-[#8b949e] hover:border-[#58a6ff]/50 hover:text-[#f0f6fc]">
                Schedule meeting with owner
              </button>
              <button className="rounded-full border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm text-[#8b949e] hover:border-[#58a6ff]/50 hover:text-[#f0f6fc]">
                Start renewal workflow
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#6e7681]">
              Try asking
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchExamples.map((example) => (
                <button
                  key={example}
                  onClick={() => handleSearch(example)}
                  className="rounded-full border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm text-[#8b949e] transition hover:border-[#f0883e]/50 hover:text-[#f0f6fc]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </CanvasShell>
  );
}

// ============================================
// MEETING SCHEDULER CANVAS
// ============================================
interface TimeSlot {
  time: string;
  date: string;
  available: boolean;
  conflict?: string;
  aiNote?: string;
}

interface Attendee {
  name: string;
  email: string;
  role: string;
  available: boolean;
}

export function MeetingCanvas({ onClose, initialPrompt }: CanvasProps) {
  const [meetingType, setMeetingType] = React.useState("");
  const [attendees, setAttendees] = React.useState<Attendee[]>([]);
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const suggestedSlots: TimeSlot[] = [
    { 
      time: "3:30 PM", 
      date: "Tomorrow (Feb 3)", 
      available: true,
      aiNote: "Optimal slot - I moved your low-priority sales call to Thursday to open this time."
    },
    { 
      time: "10:00 AM", 
      date: "Wednesday (Feb 5)", 
      available: true,
      aiNote: "All attendees available. Board prep typically completed by this time."
    },
    { 
      time: "2:00 PM", 
      date: "Wednesday (Feb 5)", 
      available: true,
    },
    { 
      time: "11:00 AM", 
      date: "Thursday (Feb 6)", 
      available: false,
      conflict: "Conflicts with Audit Committee call"
    },
  ];

  const handleFindTime = () => {
    if (!meetingType.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setAttendees([
        { name: "Sarah Chen", email: "schen@company.com", role: "CFO", available: true },
        { name: "Michael Torres", email: "mtorres@company.com", role: "Corporate Secretary", available: true },
        { name: "Jennifer Park", email: "jpark@company.com", role: "Board Chair", available: true },
      ]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSchedule = () => {
    setShowConfirmation(true);
  };

  return (
    <CanvasShell 
      onClose={onClose} 
      title="Schedule Meeting" 
      subtitle="AI finds the best time for everyone"
      accentColor="#a371f7"
    >
      <div className="mx-auto max-w-4xl px-6 py-8">
        {showConfirmation ? (
          <div className="mx-auto max-w-md space-y-6">
            <div className="rounded-2xl border border-[#3fb950]/30 bg-[#3fb950]/5 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3fb950]/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#f0f6fc]">Meeting Scheduled</h2>
              <p className="mt-2 text-[#8b949e]">
                {meetingType} · {selectedSlot?.date} at {selectedSlot?.time}
              </p>
            </div>

            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
              <p className="text-sm text-[#8b949e]">
                <span className="font-medium text-[#a371f7]">AI Note:</span> Calendar invites sent to all attendees. 
                I&apos;ve also rescheduled your sales call with TechCorp to Thursday at 2:00 PM to accommodate this meeting.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl border border-[#30363d] bg-[#21262d] py-3 text-sm text-[#8b949e] hover:bg-[#30363d]"
            >
              Return to Command Center
            </button>
          </div>
        ) : !attendees.length ? (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <h2 className="text-xl font-semibold text-[#f0f6fc]">What meeting do you need to schedule?</h2>
              <p className="mt-2 text-sm text-[#8b949e]">
                Describe the meeting and who should attend. AI will find the best available time.
              </p>
              <textarea
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="mt-4 min-h-[100px] w-full resize-none rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-[#f0f6fc] placeholder:text-[#6e7681] focus:border-[#a371f7] focus:outline-none"
                placeholder="e.g., Board materials review meeting with CFO and Corporate Secretary. Need 1 hour, preferably this week."
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleFindTime}
                  disabled={!meetingType.trim() || isAnalyzing}
                  className="rounded-xl border border-[#a371f7] bg-[#a371f7] px-6 py-2 text-sm font-medium text-white hover:bg-[#8b5cf6] disabled:opacity-50"
                >
                  {isAnalyzing ? "Finding times..." : "Find Available Times"}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-[#6e7681]">Quick schedule</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Board prep sync with leadership",
                  "Contract review with outside counsel",
                  "Compliance check-in with CCO",
                  "Matter status update with litigation team",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setMeetingType(suggestion)}
                    className="rounded-xl border border-[#30363d] bg-[#21262d] px-4 py-3 text-left text-sm text-[#8b949e] transition hover:border-[#a371f7]/50 hover:text-[#f0f6fc]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Attendees */}
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
              <h3 className="mb-4 font-semibold text-[#f0f6fc]">Attendees</h3>
              <div className="space-y-3">
                {attendees.map((attendee) => (
                  <div 
                    key={attendee.email}
                    className="flex items-center justify-between rounded-xl border border-[#30363d] bg-[#21262d] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7] text-sm font-medium text-white">
                        {attendee.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#f0f6fc]">{attendee.name}</p>
                        <p className="text-xs text-[#6e7681]">{attendee.role}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      attendee.available 
                        ? "border border-[#3fb950]/40 bg-[#3fb950]/10 text-[#3fb950]"
                        : "border border-[#da3633]/40 bg-[#da3633]/10 text-[#da3633]"
                    )}>
                      {attendee.available ? "Available" : "Busy"}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-xs text-[#58a6ff] hover:underline">
                + Add attendee
              </button>
            </div>

            {/* Time Slots - Using MeetingProposalCard */}
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
              <h3 className="mb-4 font-semibold text-[#f0f6fc]">Suggested Times</h3>
              <div className="space-y-3">
                {suggestedSlots.map((slot, idx) => (
                  <div 
                    key={idx}
                    onClick={() => slot.available && setSelectedSlot(slot)}
                    className={cn(
                      selectedSlot === slot && "ring-2 ring-[#a371f7] rounded-xl"
                    )}
                  >
                    <MeetingProposalCard
                      id={`slot-${idx}`}
                      time={slot.time}
                      date={slot.date}
                      available={slot.available}
                      aiNote={slot.aiNote}
                      conflict={slot.conflict}
                      attendeesAvailable={slot.available ? 3 : undefined}
                      totalAttendees={3}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule Button */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-[#30363d] bg-[#21262d] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#f0f6fc]">{meetingType}</p>
                    <p className="text-xs text-[#6e7681]">
                      {selectedSlot 
                        ? `${selectedSlot.date} at ${selectedSlot.time}` 
                        : "Select a time slot above"}
                    </p>
                  </div>
                  <button
                    onClick={handleSchedule}
                    disabled={!selectedSlot}
                    className="rounded-xl border border-[#a371f7] bg-[#a371f7] px-6 py-2 text-sm font-medium text-white hover:bg-[#8b5cf6] disabled:opacity-50"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CanvasShell>
  );
}

// ============================================
// EMAIL DRAFT CANVAS
// ============================================
interface BoardMaterial {
  id: string;
  title: string;
  type: string;
  secureLink: boolean;
}

const availableMaterials: BoardMaterial[] = [
  { id: "1", title: "Q1 2025 Board Book", type: "Board Book", secureLink: true },
  { id: "2", title: "Legal Department Update", type: "Presentation", secureLink: true },
  { id: "3", title: "Litigation Summary", type: "Report", secureLink: true },
  { id: "4", title: "Governance Scorecard", type: "Dashboard", secureLink: true },
  { id: "5", title: "Contract Renewal Schedule", type: "Spreadsheet", secureLink: true },
];

const emailTemplates = [
  { 
    id: "board-prep",
    name: "Board Meeting Prep",
    subject: "Board Meeting Materials - Q1 2025",
    description: "Send board materials with secure access link"
  },
  { 
    id: "director-update",
    name: "Director Update",
    subject: "Legal Department Update",
    description: "Brief directors on key legal matters"
  },
  { 
    id: "committee-notice",
    name: "Committee Notice",
    subject: "Audit Committee Meeting Notice",
    description: "Formal committee meeting notification"
  },
];

export function EmailCanvas({ onClose, initialPrompt }: CanvasProps) {
  const [recipient, setRecipient] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [attachedMaterials, setAttachedMaterials] = React.useState<BoardMaterial[]>([]);
  const [showMaterialPicker, setShowMaterialPicker] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const handleSelectTemplate = (template: typeof emailTemplates[0]) => {
    setSubject(template.subject);
    setIsGenerating(true);
    setTimeout(() => {
      setBody(`Dear Board Members,

I hope this message finds you well. As we prepare for our upcoming Q1 2025 Board Meeting, I wanted to share the relevant materials for your review.

Please find the secure access links below. These materials are confidential and accessible only through your authenticated Diligent Boards portal—no attachments are included to ensure information security.

[SECURE BOARD MATERIALS WILL BE LINKED HERE]

Key items for your attention:
• Legal Department Update - Review of active matters and regulatory developments
• Governance Scorecard - Current board and committee compliance status
• Q1 Financial Summary - Prepared by the CFO's office

Please don't hesitate to reach out if you have any questions prior to the meeting.

Best regards,
[Your Name]
General Counsel`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleAttachMaterial = (material: BoardMaterial) => {
    if (!attachedMaterials.find(m => m.id === material.id)) {
      setAttachedMaterials([...attachedMaterials, material]);
    }
    setShowMaterialPicker(false);
  };

  const handleRemoveMaterial = (materialId: string) => {
    setAttachedMaterials(attachedMaterials.filter(m => m.id !== materialId));
  };

  const handleSend = () => {
    setIsSent(true);
  };

  return (
    <CanvasShell 
      onClose={onClose} 
      title="Draft Email" 
      subtitle="Compose emails with secure Board material references"
      accentColor="#58a6ff"
    >
      <div className="mx-auto max-w-4xl px-6 py-8">
        {isSent ? (
          <div className="mx-auto max-w-md space-y-6">
            <div className="rounded-2xl border border-[#3fb950]/30 bg-[#3fb950]/5 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3fb950]/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#f0f6fc]">Email Sent</h2>
              <p className="mt-2 text-[#8b949e]">
                Your message has been delivered securely.
              </p>
            </div>

            <div className="rounded-xl border border-[#58a6ff]/30 bg-[#58a6ff]/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#58a6ff]/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f0f6fc]">Security Note</p>
                  <p className="mt-1 text-sm text-[#8b949e]">
                    {attachedMaterials.length} board materials were shared via secure links. 
                    Recipients will access materials through Diligent Boards with full audit trail.
                    No confidential files were attached to the email.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl border border-[#30363d] bg-[#21262d] py-3 text-sm text-[#8b949e] hover:bg-[#30363d]"
            >
              Return to Command Center
            </button>
          </div>
        ) : !subject ? (
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-2 text-xl font-semibold text-[#f0f6fc]">What would you like to send?</h2>
            <p className="mb-6 text-sm text-[#8b949e]">
              Choose a template or describe what you need. Board materials will be shared via secure links—never as attachments.
            </p>

            {/* Templates */}
            <div className="space-y-3">
              {emailTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="flex w-full items-start gap-4 rounded-xl border border-[#30363d] bg-[#161b22] p-4 text-left transition hover:border-[#58a6ff]/50 hover:bg-[#21262d]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#58a6ff]/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <path d="m22 6-10 7L2 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#f0f6fc]">{template.name}</h4>
                    <p className="text-sm text-[#8b949e]">{template.description}</p>
                    <p className="mt-1 text-xs text-[#6e7681]">Subject: {template.subject}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom */}
            <div className="mt-6 rounded-xl border border-[#30363d] bg-[#161b22] p-4">
              <p className="mb-3 text-sm text-[#8b949e]">Or start from scratch:</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:outline-none"
                  placeholder="Enter email subject..."
                />
                <button
                  onClick={() => subject && setSubject(subject)}
                  disabled={!subject}
                  className="rounded-lg border border-[#58a6ff] bg-[#58a6ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#79b8ff] disabled:opacity-50"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Email Composer */}
            <div className="lg:col-span-2 space-y-4">
              {/* To */}
              <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
                <label className="mb-2 block text-xs font-medium text-[#6e7681]">To</label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:outline-none"
                  placeholder="board@company.com"
                />
              </div>

              {/* Subject */}
              <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
                <label className="mb-2 block text-xs font-medium text-[#6e7681]">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none"
                />
              </div>

              {/* Body */}
              <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
                <label className="mb-2 block text-xs font-medium text-[#6e7681]">Message</label>
                {isGenerating ? (
                  <div className="flex h-64 items-center justify-center">
                    <p className="text-sm text-[#8b949e]">AI is drafting your email...</p>
                  </div>
                ) : (
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[300px] w-full resize-none rounded-lg border border-[#30363d] bg-[#0d1117] p-3 text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none"
                  />
                )}
              </div>

              {/* Attached Materials - Using SecureAttachmentCard */}
              {attachedMaterials.length > 0 && (
                <div className="rounded-xl border border-[#58a6ff]/30 bg-[#58a6ff]/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-sm font-medium text-[#58a6ff]">Secure Board Material Links</span>
                  </div>
                  <div className="space-y-2">
                    {attachedMaterials.map((material) => (
                      <div key={material.id} className="relative">
                        <SecureAttachmentCard
                          id={material.id}
                          title={material.title}
                          documentType={material.type}
                          isSecure={material.secureLink}
                          accessLevel="Board Members"
                        />
                        <button 
                          onClick={() => handleRemoveMaterial(material.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-[#da3633]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[#8b949e]">
                    Recipients will receive secure links to access these materials in Diligent Boards. No files attached.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowMaterialPicker(true)}
                  className="rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]"
                >
                  + Attach Board Material
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSubject(""); setBody(""); setAttachedMaterials([]); }}
                    className="rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#8b949e] hover:bg-[#21262d]"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!recipient || !body}
                    className="rounded-lg border border-[#58a6ff] bg-[#58a6ff] px-6 py-2 text-sm font-medium text-white hover:bg-[#79b8ff] disabled:opacity-50"
                  >
                    Send Securely
                  </button>
                </div>
              </div>
            </div>

            {/* AI Sidebar */}
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#f0f6fc]">AI Writing Assistant</h3>
              <div className="space-y-2">
                {[
                  "Make it more formal",
                  "Add urgency",
                  "Shorten the message",
                  "Add action items",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    className="w-full rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-2 text-left text-sm text-[#8b949e] hover:border-[#58a6ff]/50 hover:text-[#f0f6fc]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="mt-4 border-t border-[#30363d] pt-4">
                <input
                  type="text"
                  placeholder="Ask AI to edit..."
                  className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-xs text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Material Picker Modal */}
        {showMaterialPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-[#f0f6fc]">Select Board Material</h3>
                <button 
                  onClick={() => setShowMaterialPicker(false)}
                  className="text-[#8b949e] hover:text-[#f0f6fc]"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {availableMaterials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => handleAttachMaterial(material)}
                    disabled={attachedMaterials.some(m => m.id === material.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-3 text-left transition hover:border-[#58a6ff]/50 disabled:opacity-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#f0f6fc]">{material.title}</p>
                      <p className="text-xs text-[#6e7681]">{material.type}</p>
                    </div>
                    {material.secureLink && (
                      <span className="rounded-full border border-[#3fb950]/40 bg-[#3fb950]/10 px-2 py-0.5 text-xs text-[#3fb950]">
                        Secure
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </CanvasShell>
  );
}
