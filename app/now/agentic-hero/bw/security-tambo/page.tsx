"use client";

/**
 * Security Incident — Tambo Variation
 * 
 * This version uses the Tambo generative UI SDK (@tambo-ai/react) to power
 * the security incident use case. Tambo allows you to:
 * 
 * 1. Register React components with Zod schemas
 * 2. Let an LLM dynamically decide which components to render
 * 3. Stream AI-generated content and props in real-time
 * 4. Manage message threads and component state
 * 
 * Key Tambo concepts used here:
 * - TamboProvider: Wraps the app with API key and registered components
 * - useTamboThread: Access message thread state
 * - useTamboThreadInput: Handle user input and submission
 * - useTamboComponentState: Manage stateful components
 * 
 * @see https://docs.tambo.co for full documentation
 */

import React, { useState } from "react";
import { z } from "zod";
import { TamboProvider, useTamboThread, useTamboThreadInput } from "@tambo-ai/react";

// ============================================================================
// COMPONENT SCHEMAS (Zod definitions for Tambo registration)
// ============================================================================

const incidentCardSchema = z.object({
  id: z.string().optional().default("INC-0000"),
  title: z.string().optional().default("Incident"),
  urgency: z.string().optional().default("medium"),
  detail: z.string().optional().default(""),
  timeAgo: z.string().optional().default(""),
  completedSteps: z.number().optional().default(0),
  totalSteps: z.number().optional().default(1),
});

const actionCardSchema = z.object({
  id: z.string().optional().default("action-0"),
  title: z.string().optional().default("Action"),
  description: z.string().optional().default(""),
  actionLabel: z.string().optional().default("Take Action"),
  hint: z.string().optional(),
});

const receiptStepSchema = z.object({
  id: z.string().optional().default("step-0"),
  status: z.string().optional().default("pending"),
  title: z.string().optional().default("Step"),
  detail: z.string().optional().default(""),
  time: z.string().optional().default(""),
  actor: z.string().optional().default("Agent"),
});

// ============================================================================
// TAMBO-REGISTERED COMPONENTS
// ============================================================================

function IncidentCard({
  id,
  title,
  urgency,
  detail,
  completedSteps,
  totalSteps,
}: z.infer<typeof incidentCardSchema>) {
  const urgencyColors: Record<string, string> = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-slate-100 text-slate-700 border-slate-200",
  };
  
  // Normalize urgency to one of our known values
  const normalizedUrgency = (urgency?.toLowerCase() || "medium");
  const urgencyKey = ["high", "medium", "low"].includes(normalizedUrgency) ? normalizedUrgency : "medium";
  const displayUrgency = urgency || "Medium";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-slate-900">
          {id}: {title}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${urgencyColors[urgencyKey]}`}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-current" />
          {displayUrgency.charAt(0).toUpperCase() + displayUrgency.slice(1)} urgency
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
      <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
        <span>
          Progress: {completedSteps} of {totalSteps} steps
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-700 transition-all"
            style={{ width: `${(completedSteps / (totalSteps || 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  actionLabel,
  hint,
  onClick,
}: z.infer<typeof actionCardSchema> & { onClick?: () => void }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm font-medium text-slate-800">{title}</div>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onClick}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          {actionLabel}
        </button>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
    </div>
  );
}

function ReceiptStep({
  status,
  title,
  detail,
  time,
  actor,
}: z.infer<typeof receiptStepSchema>) {
  const statusIcons: Record<string, string> = {
    done: "✓",
    completed: "✓",
    pending: "○",
    in_progress: "◐",
    "in-progress": "◐",
    active: "◐",
  };
  
  // Normalize status
  const normalizedStatus = status?.toLowerCase().replace(/[_-]/g, "_") || "pending";
  const statusIcon = statusIcons[normalizedStatus] || statusIcons[status] || "○";
  const isDone = ["done", "completed"].includes(normalizedStatus);
  const isInProgress = ["in_progress", "in-progress", "active"].includes(normalizedStatus);

  return (
    <div className="flex gap-3 py-2">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
          isDone
            ? "bg-green-100 text-green-700"
            : isInProgress
            ? "bg-blue-100 text-blue-700"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {statusIcon}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-800">{title}</span>
          <span className="text-xs text-slate-500">{time}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-600">{detail}</p>
        <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
          {actor}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// TAMBO COMPONENT REGISTRY
// ============================================================================

const tamboComponents = [
  {
    name: "IncidentCard",
    description:
      "ALWAYS use this component when the user asks about incident status, incident details, or asks to 'show an incident card'. Displays a security incident with ID, title, urgency level (high/medium/low), details, and progress. Required props: id (string like 'INC-2847'), title (string), urgency ('high', 'medium', or 'low'), detail (description string), completedSteps (number), totalSteps (number).",
    component: IncidentCard,
    propsSchema: incidentCardSchema,
  },
  {
    name: "ActionCard",
    description:
      "ALWAYS use this component when the user asks about actions, decisions, approvals, or next steps. Shows a decision card with title, description, and action button. Required props: id (string), title (string), description (string), actionLabel (button text), hint (optional helper text).",
    component: ActionCard,
    propsSchema: actionCardSchema,
  },
  {
    name: "ReceiptStep",
    description:
      "ALWAYS use this component when the user asks about timeline, steps, or progress. Shows a single step with status icon, title, detail, timestamp, and actor. Required props: id (string), status ('done', 'pending', or 'in_progress'), title (string), detail (string), time (timestamp string), actor ('Agent' or 'Human').",
    component: ReceiptStep,
    propsSchema: receiptStepSchema,
  },
];

// ============================================================================
// CHAT INPUT COMPONENT (uses Tambo hooks)
// ============================================================================

// Chat component that uses Tambo hooks (must be inside TamboProvider)
function TamboChatInputWithHooks({ onFallbackToDemo }: { onFallbackToDemo?: () => void }) {
  const [localInput, setLocalInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; component?: React.ReactNode }>>([]);
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  
  // Tambo hooks - these require TamboProvider
  const tamboThreadInput = useTamboThreadInput();
  const tamboThread = useTamboThread();
  const tamboAvailable = true;

  // Demo responses that render actual components
  const getDemoResponse = (query: string): { content: string; component?: React.ReactNode } => {
    const q = query.toLowerCase();
    
    if (q.includes("status") || q.includes("incident") || q.includes("details")) {
      return {
        content: "Here's the current incident status:",
        component: (
          <IncidentCard
            id="INC-2847"
            title="Security Incident — CloudStorage Solutions"
            urgency="high"
            detail="Unusual access pattern detected across third-party integration. Evidence preserved, Legal and Security notified."
            timeAgo="3 hours ago"
            completedSteps={5}
            totalSteps={8}
          />
        ),
      };
    }
    
    if (q.includes("decision") || q.includes("approval") || q.includes("action") || q.includes("need")) {
      return {
        content: "Here are the pending decisions that need your approval:",
        component: (
          <div className="space-y-3 mt-2">
            <ActionCard
              id="action-1"
              title="Escalate to Board"
              description="Prepare a Board-ready summary with recommended next steps."
              actionLabel="Prepare Escalation"
              hint="GC will be included"
            />
            <ActionCard
              id="action-2"
              title="Notify Regulator"
              description="Draft regulatory notification based on current findings."
              actionLabel="Review Draft"
              hint="Nothing sent without approval"
            />
          </div>
        ),
      };
    }
    
    if (q.includes("timeline") || q.includes("steps") || q.includes("done") || q.includes("completed")) {
      return {
        content: "Here's the response timeline so far:",
        component: (
          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white p-3 mt-2">
            <ReceiptStep
              id="step-1"
              status="done"
              title="Created incident record"
              detail="Logged INC-2847 and linked to CloudStorage Solutions."
              time="09:14 ET"
              actor="Agent"
            />
            <ReceiptStep
              id="step-2"
              status="done"
              title="Preserved evidence"
              detail="Snapshot logs, audit trail secured."
              time="09:33 ET"
              actor="Agent"
            />
            <ReceiptStep
              id="step-3"
              status="pending"
              title="Board escalation"
              detail="Awaiting your approval."
              time="Pending"
              actor="Human"
            />
          </div>
        ),
      };
    }
    
    if (q.includes("owner") || q.includes("assign")) {
      return {
        content: "I recommend assigning an incident owner:",
        component: (
          <ActionCard
            id="action-owner"
            title="Assign Incident Owner"
            description="Suggested: Priya Shah (Security) based on expertise and availability."
            actionLabel="Assign Priya"
            hint="Or choose someone else"
          />
        ),
      };
    }
    
    // Default response
    return {
      content: `I understand you're asking about "${query}". Try asking about:\n• "What's the incident status?"\n• "What decisions need approval?"\n• "Show me the timeline"\n• "Who should I assign as owner?"`,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = localInput.trim();
    if (!messageText || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setLocalInput("");
    setLoading(true);

    if (demoMode) {
      // Demo mode: simulate AI response
      setTimeout(() => {
        const response = getDemoResponse(messageText);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.content,
            component: response.component,
          },
        ]);
        setLoading(false);
      }, 800);
    } else {
      // Live mode: use Tambo
      if (!tamboThreadInput) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Tambo is not available. The API key may not be configured. Please use demo mode.",
          },
        ]);
        setLoading(false);
        return;
      }
      
      try {
        // Use sendThreadMessage which returns the response directly
        console.log("[Tambo] Sending message:", messageText);
        const response = await tamboThread.sendThreadMessage(messageText);
        console.log("[Tambo] Response received:", response);
        console.log("[Tambo] Response keys:", Object.keys(response || {}));
        
        // Extract text content from response
        let textContent = "";
        const content = (response as any)?.content;
        
        if (typeof content === "string") {
          textContent = content;
        } else if (Array.isArray(content)) {
          textContent = content
            .map((part: any) => {
              if (typeof part === "string") return part;
              if (part.text) return part.text;
              if (part.content) return part.content;
              return "";
            })
            .filter(Boolean)
            .join("\n");
        } else if (content && typeof content === "object" && "text" in content) {
          textContent = (content as any).text;
        }
        
        // Get component from response - Tambo returns metadata, not a React element
        const componentData = (response as any)?.component;
        console.log("[Tambo] Text content:", textContent);
        console.log("[Tambo] Component data:", componentData);
        
        // Try to render a component if Tambo specified one
        let renderedComponent: React.ReactNode = null;
        if (componentData?.componentName && componentData?.props) {
          // Map component name to our registered components
          const componentMap: Record<string, React.FC<any>> = {
            IncidentCard,
            ActionCard,
            ReceiptStep,
          };
          const Component = componentMap[componentData.componentName];
          if (Component) {
            renderedComponent = <Component {...componentData.props} />;
          }
        }
        
        // Fallback: If Tambo didn't render a component but the query/response suggests one,
        // render it ourselves based on the context
        if (!renderedComponent) {
          const queryLower = messageText.toLowerCase();
          const responseLower = textContent.toLowerCase();
          
          // If asking about incident and response mentions incident details
          if ((queryLower.includes("incident") || queryLower.includes("status")) && 
              (responseLower.includes("incident") || responseLower.includes("urgency"))) {
            // Extract incident ID from query or response
            const idMatch = (messageText + " " + textContent).match(/INC-\d+/i);
            const incidentId = idMatch ? idMatch[0].toUpperCase() : "INC-2847";
            
            // Try to extract urgency from response
            let urgency = "high";
            if (responseLower.includes("low")) urgency = "low";
            else if (responseLower.includes("medium") || responseLower.includes("moderate")) urgency = "medium";
            else if (responseLower.includes("critical") || responseLower.includes("high")) urgency = "high";
            
            // Extract progress if mentioned
            const progressMatch = textContent.match(/(\d+)\s*(?:of|\/)\s*(\d+)/);
            const completedSteps = progressMatch ? parseInt(progressMatch[1]) : 3;
            const totalSteps = progressMatch ? parseInt(progressMatch[2]) : 5;
            
            renderedComponent = (
              <IncidentCard
                id={incidentId}
                title="Security Incident"
                urgency={urgency}
                detail={textContent.split('\n')[0] || "Active security incident requiring attention."}
                timeAgo="Recently"
                completedSteps={completedSteps}
                totalSteps={totalSteps}
              />
            );
          }
        }
        
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: textContent || "Tambo responded.",
            component: renderedComponent,
          },
        ]);
        setLoading(false);
      } catch (err) {
        console.error("Tambo error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error connecting to Tambo: ${err instanceof Error ? err.message : "Unknown error"}. Try demo mode.`,
          },
        ]);
        setLoading(false);
      }
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Ask the Diligent Agent
        </div>
        {/* Toggle switch between Demo and Live */}
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-0.5">
          <button
            onClick={() => setDemoMode(true)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              demoMode
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Demo
          </button>
          <button
            onClick={() => tamboAvailable && setDemoMode(false)}
            disabled={!tamboAvailable}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              !demoMode
                ? "bg-white text-slate-900 shadow-sm"
                : tamboAvailable
                  ? "text-slate-500 hover:text-slate-700"
                  : "text-slate-300 cursor-not-allowed"
            }`}
            title={!tamboAvailable ? "Tambo API key not configured" : ""}
          >
            Live {!tamboAvailable && "(no key)"}
          </button>
        </div>
      </div>
      
      {/* Message history */}
      {messages.length > 0 && (
        <div className="mt-3 max-h-[50vh] overflow-y-auto space-y-3 border-b border-slate-100 pb-3 mb-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-3 text-sm ${
                msg.role === "user"
                  ? "bg-slate-100 text-slate-800 ml-8"
                  : "bg-blue-50 text-blue-900 mr-8"
              }`}
            >
              <div className="text-xs font-medium mb-1 opacity-60">
                {msg.role === "user" ? "You" : "Diligent Agent"}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {/* Render dynamic component */}
              {msg.component && (
                <div className="mt-3">{msg.component}</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900 mr-8">
              <div className="text-xs font-medium mb-1 opacity-60">Diligent Agent</div>
              <span className="animate-pulse">Thinking...</span>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text"
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          placeholder="Try: What's the incident status?"
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !localInput.trim()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
      <p className="mt-2 text-xs text-slate-500">
        {demoMode 
          ? "Demo mode: simulated responses with dynamic components."
          : "Live mode: responses from Tambo AI (requires valid API key)."}
      </p>
    </div>
  );
}

// Demo-only chat input (when TamboProvider is not available)
function TamboChatInputDemoOnly() {
  const [localInput, setLocalInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; component?: React.ReactNode }>>([]);
  const [loading, setLoading] = useState(false);
  
  const getDemoResponse = (query: string): { content: string; component?: React.ReactNode } => {
    const q = query.toLowerCase();
    if (q.includes("status") || q.includes("incident") || q.includes("details")) {
      return {
        content: "Here's the current incident status:",
        component: (
          <IncidentCard
            id="INC-2847"
            title="Security Incident — CloudStorage Solutions"
            urgency="high"
            detail="Unusual access pattern detected across third-party integration. Evidence preserved, Legal and Security notified."
            timeAgo="3 hours ago"
            completedSteps={5}
            totalSteps={8}
          />
        ),
      };
    }
    if (q.includes("decision") || q.includes("approval") || q.includes("action") || q.includes("need")) {
      return {
        content: "Here are the pending decisions that need your approval:",
        component: (
          <div className="space-y-3 mt-2">
            <ActionCard id="action-1" title="Escalate to Board" description="Prepare a Board-ready summary with recommended next steps." actionLabel="Prepare Escalation" hint="GC will be included" />
            <ActionCard id="action-2" title="Notify Regulator" description="Draft regulatory notification based on current findings." actionLabel="Review Draft" hint="Nothing sent without approval" />
          </div>
        ),
      };
    }
    if (q.includes("timeline") || q.includes("steps") || q.includes("done") || q.includes("completed")) {
      return {
        content: "Here's the response timeline so far:",
        component: (
          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white p-3 mt-2">
            <ReceiptStep id="step-1" status="done" title="Created incident record" detail="Logged INC-2847 and linked to CloudStorage Solutions." time="09:14 ET" actor="Agent" />
            <ReceiptStep id="step-2" status="done" title="Preserved evidence" detail="Snapshot logs, audit trail secured." time="09:33 ET" actor="Agent" />
            <ReceiptStep id="step-3" status="pending" title="Board escalation" detail="Awaiting your approval." time="Pending" actor="Human" />
          </div>
        ),
      };
    }
    return { content: `Try asking about: "What's the incident status?", "What decisions need approval?", or "Show me the timeline"` };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = localInput.trim();
    if (!messageText || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setLocalInput("");
    setLoading(true);
    setTimeout(() => {
      const response = getDemoResponse(messageText);
      setMessages((prev) => [...prev, { role: "assistant", content: response.content, component: response.component }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Ask the Diligent Agent</div>
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Demo Only (No API Key)
        </span>
      </div>
      {messages.length > 0 && (
        <div className="mt-3 max-h-[50vh] overflow-y-auto space-y-3 border-b border-slate-100 pb-3 mb-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`rounded-lg p-3 text-sm ${msg.role === "user" ? "bg-slate-100 text-slate-800 ml-8" : "bg-blue-50 text-blue-900 mr-8"}`}>
              <div className="text-xs font-medium mb-1 opacity-60">{msg.role === "user" ? "You" : "Diligent Agent"}</div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.component && <div className="mt-3">{msg.component}</div>}
            </div>
          ))}
          {loading && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900 mr-8">
              <div className="text-xs font-medium mb-1 opacity-60">Diligent Agent</div>
              <span className="animate-pulse">Thinking...</span>
            </div>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input type="text" value={localInput} onChange={(e) => setLocalInput(e.target.value)} placeholder="Try: What's the incident status?" className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300" disabled={loading} />
        <button type="submit" disabled={loading || !localInput.trim()} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "..." : "Send"}</button>
      </form>
      <p className="mt-2 text-xs text-slate-500">Demo mode: simulated responses. Configure NEXT_PUBLIC_TAMBO_API_KEY for live mode.</p>
    </div>
  );
}

// Wrapper that chooses the right chat component based on context
function TamboChatInput({ hasTamboProvider }: { hasTamboProvider: boolean }) {
  if (!hasTamboProvider) {
    return <TamboChatInputDemoOnly />;
  }
  return <TamboChatInputWithHooks />;
}

// ============================================================================
// INNER PAGE CONTENT (wrapped by TamboProvider)
// ============================================================================

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function SecurityTamboContent({ hasTamboProvider = true }: { hasTamboProvider?: boolean }) {
  // Modal states
  const [showBoardEscalation, setShowBoardEscalation] = useState(false);
  const [showNotifyRegulator, setShowNotifyRegulator] = useState(false);
  const [showAssignOwner, setShowAssignOwner] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState("Priya Shah (Security)");

  // Sample data for demonstration
  const sampleIncident = {
    id: "INC-2847",
    title: "Security Incident Detected",
    urgency: "high" as const,
    detail:
      "ServiceNow incident logged by CloudStorage Solutions (3rd party provider). Unusual access pattern detected.",
    timeAgo: "3 hours ago",
    completedSteps: 5,
    totalSteps: 8,
  };

  const sampleActions = [
    {
      id: "action-1",
      title: "Escalate to Board",
      description:
        "Prepare a Board-ready summary and recommended next steps.",
      actionLabel: "Prepare Board Escalation",
      hint: "GC will be included by default",
    },
    {
      id: "action-2",
      title: "Notify Regulator",
      description:
        "Prepare a draft regulatory notification based on current findings.",
      actionLabel: "Review Draft Notice",
      hint: "Nothing submitted without approval",
    },
    {
      id: "action-3",
      title: "Assign Incident Owner",
      description:
        "Designate a primary owner responsible for coordination and follow-up.",
      actionLabel: "Assign Owner",
      hint: "Suggested owners included",
    },
  ];

  const sampleSteps = [
    {
      id: "step-1",
      status: "done" as const,
      title: "Created incident record",
      detail: "Logged INC-2847 and associated it to CloudStorage Solutions.",
      time: "09:14 ET",
      actor: "Agent" as const,
    },
    {
      id: "step-2",
      status: "done" as const,
      title: "Identified affected subsidiaries",
      detail: "Mapped impacted entities and likely jurisdictions.",
      time: "09:22 ET",
      actor: "Agent" as const,
    },
    {
      id: "step-3",
      status: "done" as const,
      title: "Preserved evidence",
      detail: "Snapshot logs, preserved audit trail, restricted access.",
      time: "09:33 ET",
      actor: "Agent" as const,
    },
    {
      id: "step-4",
      status: "pending" as const,
      title: "Prepare Board escalation",
      detail: "Requires your review; GC included by default.",
      time: "Pending",
      actor: "Human" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Prototype Nav */}
      <div className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Prototype</span>
            <span className="text-sm font-semibold text-slate-900">Agentic Hero</span>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <a href="/now/agentic-hero/bw/security" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">Security Incident</a>
            <a href="/now/agentic-hero/bw/security-jsonrender" className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">JSON Render</a>
            <a href="/now/agentic-hero/bw/security-tambo" className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-900">Tambo</a>
            <span className="text-slate-300">|</span>
            <a href="/now/agentic-hero/bw/whistleblower" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">Whistleblower</a>
            <a href="/now/agentic-hero/bw/compliance" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">Compliance</a>
            <a href="/now/agentic-hero/bw" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">Steady State</a>
          </nav>
        </div>
      </div>

      {/* Wireframe surface container */}
      <div className="mx-auto mt-6 w-full max-w-6xl px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm relative">
        {/* Diligent chrome */}
        <div className="border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-slate-900" />
                <span className="text-sm font-semibold text-slate-900">Diligent</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none"><path d="M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.5"/></svg>
                <span className="font-medium">Ibotta, Inc.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="relative">
                <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-slate-900" />
                <button className="rounded-full border border-slate-200 bg-white p-2 hover:bg-slate-50">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z" stroke="currentColor" strokeWidth="1.5"/><path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <button className="rounded-full border border-slate-200 bg-white p-2 hover:bg-slate-50">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor"/></svg>
              </button>
              <div className="ml-1 h-8 w-8 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>

        {/* Hero heading */}
        <div className="px-6 pt-8 pb-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            You have an active Security Review, Sarah.
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN - Chat (sticky) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-6">
              {/* Info banner - compact */}
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-900">
                    Tambo Generative UI
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-200 px-2 py-0.5 text-xs text-green-800">
                    ✓ Connected
                  </span>
                </div>
              </div>

              {/* Chat component */}
              <TamboChatInput hasTamboProvider={hasTamboProvider} />

              {/* Registered components - collapsible */}
              <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <summary className="cursor-pointer text-xs font-medium text-slate-600">
                  {tamboComponents.length} registered components
                </summary>
                <div className="mt-3 space-y-2">
                  {tamboComponents.map((comp) => (
                    <div
                      key={comp.name}
                      className="rounded-lg border border-slate-200 bg-white p-2"
                    >
                      <div className="font-mono text-xs text-slate-900">
                        {comp.name}
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500">{comp.description}</p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>

          {/* RIGHT COLUMN - Incident context */}
          <div className="lg:col-span-7 space-y-6">
            {/* Incident card */}
            <IncidentCard {...sampleIncident} />

            {/* Actions section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Decisions Needed
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                These actions require your approval before proceeding.
              </p>
              <div className="mt-4 space-y-3">
                <ActionCard
                  id="action-1"
                  title="Escalate to Board"
                  description="Prepare a Board-ready summary and recommended next steps."
                  actionLabel="Prepare Board Escalation"
                  hint="GC will be included by default"
                  onClick={() => setShowBoardEscalation(true)}
                />
                <ActionCard
                  id="action-2"
                  title="Notify Regulator"
                  description="Prepare a draft regulatory notification based on current findings."
                  actionLabel="Review Draft Notice"
                  hint="Nothing submitted without approval"
                  onClick={() => setShowNotifyRegulator(true)}
                />
                <ActionCard
                  id="action-3"
                  title="Assign Incident Owner"
                  description="Designate a primary owner responsible for coordination and follow-up."
                  actionLabel="Assign Owner"
                  hint="Suggested owners included"
                  onClick={() => setShowAssignOwner(true)}
                />
              </div>
            </div>

            {/* Receipt timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Response Timeline
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Steps completed by the agent and pending human decisions.
              </p>
              <div className="mt-4 divide-y divide-slate-100">
                {sampleSteps.map((step) => (
                  <ReceiptStep key={step.id} {...step} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
      </div>

      {/* Board Escalation Modal */}
      {showBoardEscalation && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between max-w-[900px] mx-auto">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Board Escalation</div>
                <div className="text-lg font-semibold text-slate-900">Security Incident — INC-2847</div>
              </div>
              <button
                onClick={() => setShowBoardEscalation(false)}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Exit
              </button>
            </div>
          </div>
          <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">
            <section>
              <h2 className="text-sm font-semibold text-slate-900">What the Board needs to know</h2>
              <p className="mt-2 text-sm text-slate-600">
                This escalation summarizes the incident, potential impact, and immediate actions taken. It is written for non-technical Board members.
              </p>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Draft Board Message</h3>
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-t-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                <span className="font-medium text-slate-700">Formatting</span>
                <span className="text-slate-300">|</span>
                <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">B</button>
                <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50 italic">I</button>
                <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">• List</button>
              </div>
              <div className="rounded-b-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-700 space-y-2">
                <p><strong>Summary:</strong> A security incident involving a third‑party data processor was detected and contained.</p>
                <p><strong>Status:</strong> Investigation ongoing. No confirmed data exfiltration at this time.</p>
                <p><strong>Actions taken:</strong> Incident logged, evidence preserved, Legal and Security engaged.</p>
                <p><strong>Next steps:</strong> Continued monitoring, regulator assessment, follow‑up briefing.</p>
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Ask the agent to revise</div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                    placeholder="e.g., make this shorter, remove jargon, add a clearer next step"
                  />
                  <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">Apply</button>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Recipients</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div>✔ Board of Directors (18)</div>
                <div>✔ Executive Assistants (4)</div>
                <div>✔ General Counsel (included)</div>
              </div>
            </section>
            <section className="flex items-center justify-between border-t border-slate-200 pt-6">
              <div className="text-xs text-slate-500">Nothing will be sent without your approval.</div>
              <div className="flex gap-3">
                <button onClick={() => setShowBoardEscalation(false)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Approve & Send</button>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Notify Regulator Modal */}
      {showNotifyRegulator && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between max-w-[900px] mx-auto">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Regulatory Notification</div>
                <div className="text-lg font-semibold text-slate-900">Draft Notice — INC-2847</div>
              </div>
              <button
                onClick={() => setShowNotifyRegulator(false)}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Exit
              </button>
            </div>
          </div>
          <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">
            <section>
              <h2 className="text-sm font-semibold text-slate-900">Draft (review required)</h2>
              <p className="mt-2 text-sm text-slate-600">
                This draft is based on current findings and is intentionally conservative. You can edit before sending. General Counsel review is recommended.
              </p>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Draft Notice</h3>
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-t-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                <span className="font-medium text-slate-700">Formatting</span>
                <span className="text-slate-300">|</span>
                <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">B</button>
                <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50 italic">I</button>
                <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">• List</button>
              </div>
              <div className="rounded-b-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-700 space-y-2">
                <p><strong>Incident reference:</strong> INC-2847</p>
                <p><strong>Summary:</strong> A security incident involving a third‑party data processor was detected. Investigation is ongoing.</p>
                <p><strong>Potential impact:</strong> No confirmed data exfiltration at this time. Scope assessment in progress.</p>
                <p><strong>Actions taken:</strong> Evidence preserved, internal response activated, Legal and Security engaged.</p>
                <p><strong>Next update:</strong> We will provide a follow‑up update within 72 hours or sooner as facts are confirmed.</p>
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Ask the agent to revise</div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                    placeholder="e.g., add jurisdictions, tighten language, emphasize unknowns"
                  />
                  <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">Apply</button>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Review checklist</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div>• Confirm jurisdiction(s) and reporting deadline</div>
                <div>• Confirm whether personal data is implicated</div>
                <div>• Confirm approved statement of impact</div>
                <div>• Confirm counsel review (recommended)</div>
              </div>
            </section>
            <section className="flex items-center justify-between border-t border-slate-200 pt-6">
              <div className="text-xs text-slate-500">Nothing will be submitted without your approval.</div>
              <div className="flex gap-3">
                <button onClick={() => setShowNotifyRegulator(false)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Approve & Submit</button>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Assign Owner Modal */}
      {showAssignOwner && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between max-w-[900px] mx-auto">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Assign Incident Owner</div>
                <div className="text-lg font-semibold text-slate-900">Primary owner — INC-2847</div>
              </div>
              <button
                onClick={() => setShowAssignOwner(false)}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Exit
              </button>
            </div>
          </div>
          <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">
            <section>
              <h2 className="text-sm font-semibold text-slate-900">Suggested owners</h2>
              <p className="mt-2 text-sm text-slate-600">
                The agent suggests owners based on role, availability, and prior incidents. You can pick one or add someone else.
              </p>
            </section>
            <section className="space-y-3">
              {["Priya Shah (Security)", "Danielle Kim (Legal)", "Marcus Reed (IT Operations)"].map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedOwner(name)}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left transition",
                    selectedOwner === name ? "border-slate-400 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-slate-900">{name}</div>
                    <span className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                      selectedOwner === name ? "border-slate-900" : "border-slate-300"
                    )}>
                      {selectedOwner === name && <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">Primary coordinator for follow-ups, assignments, and stakeholder updates.</div>
                </button>
              ))}
            </section>
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900">Add someone else</h3>
              <div className="mt-3 flex items-center gap-2">
                <input
                  className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
                  placeholder="Type a name or role (e.g., 'CISO', 'Security Lead')"
                />
                <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Add</button>
              </div>
            </section>
            <section className="flex items-center justify-between border-t border-slate-200 pt-6">
              <div className="text-xs text-slate-500">Assigning an owner records accountability and enables automated follow-ups.</div>
              <div className="flex gap-3">
                <button onClick={() => setShowAssignOwner(false)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Assign {selectedOwner.split(" ")[0]}</button>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN PAGE EXPORT (wrapped in TamboProvider)
// ============================================================================

export default function SecurityTamboPage() {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  
  // If no API key, render without TamboProvider (demo mode only)
  if (!apiKey) {
    return <SecurityTamboContent hasTamboProvider={false} />;
  }
  
  return (
    <TamboProvider
      apiKey={apiKey}
      components={tamboComponents}
    >
      <SecurityTamboContent hasTamboProvider={true} />
    </TamboProvider>
  );
}
