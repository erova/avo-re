"use client";

/**
 * Security Incident — JSON Render Variation
 * 
 * This version uses the json-render.dev library (@json-render/core + @json-render/react)
 * to power the security incident use case. json-render allows you to:
 * 
 * 1. Define a catalog of allowed components with Zod schemas (guardrails)
 * 2. Have AI generate JSON that maps to your catalog
 * 3. Stream JSON rendering as it arrives from the LLM
 * 4. Bind data using JSON Pointer paths (RFC 6901)
 * 5. Export to standalone React code
 * 
 * Key json-render concepts used here:
 * - createCatalog: Define allowed components with prop schemas
 * - DataProvider: Provide data context for binding
 * - VisibilityProvider: Conditional component display
 * - useDataBinding: Two-way data binding for inputs
 * 
 * @see https://json-render.dev for full documentation
 */

import React, { useState } from "react";
import { z } from "zod";
// json-render imports - uncomment when implementing live features
// import { createCatalog } from "@json-render/core";
// import { DataProvider, VisibilityProvider, useDataBinding } from "@json-render/react";

// ============================================================================
// COMPONENT CATALOG (json-render guardrails)
// ============================================================================

// Define the catalog schema for json-render
// This constrains what the AI can generate

const catalogDefinition = {
  components: {
    IncidentHeader: {
      props: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
      }),
      hasChildren: true,
    },
    IncidentCard: {
      props: z.object({
        incidentId: z.string(),
        title: z.string(),
        urgency: z.enum(["high", "medium", "low"]),
        detail: z.string(),
        progressCurrent: z.number(),
        progressTotal: z.number(),
      }),
    },
    ActionPanel: {
      props: z.object({
        title: z.string(),
        description: z.string(),
      }),
      hasChildren: true,
    },
    ActionButton: {
      props: z.object({
        label: z.string(),
        variant: z.enum(["primary", "secondary", "ghost"]),
        actionId: z.string(),
      }),
    },
    TimelineStep: {
      props: z.object({
        status: z.enum(["done", "pending", "in_progress"]),
        title: z.string(),
        detail: z.string(),
        timestamp: z.string(),
        actorType: z.enum(["agent", "human"]),
      }),
    },
    Timeline: {
      props: z.object({
        title: z.string(),
      }),
      hasChildren: true,
    },
    InfoBanner: {
      props: z.object({
        variant: z.enum(["info", "warning", "success", "error"]),
        message: z.string(),
      }),
    },
    MetricCard: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(), // JSON Pointer for data binding
        format: z.enum(["number", "percent", "currency", "duration"]),
      }),
    },
  },
  actions: {
    escalateToBoard: {
      params: z.object({ incidentId: z.string() }),
    },
    notifyRegulator: {
      params: z.object({ incidentId: z.string(), draftId: z.string() }),
    },
    assignOwner: {
      params: z.object({ incidentId: z.string(), ownerId: z.string() }),
    },
    viewReceipt: {
      params: z.object({ incidentId: z.string() }),
    },
  },
};

// ============================================================================
// SAMPLE JSON STRUCTURE (what AI would generate)
// ============================================================================

// This is an example of the JSON that json-render would receive from the AI
// In production, this would be streamed from an LLM
const sampleJsonUI = {
  type: "IncidentHeader",
  props: {
    title: "Security Incident Review",
    subtitle: "INC-2847 requires your attention",
  },
  children: [
    {
      type: "IncidentCard",
      props: {
        incidentId: "INC-2847",
        title: "SECURITY INCIDENT DETECTED — AUTO-RESPONSE ACTIVATED",
        urgency: "high",
        detail:
          "ServiceNow incident logged by CloudStorage Solutions (3rd party provider). Unusual access pattern detected across a third-party integration.",
        progressCurrent: 5,
        progressTotal: 8,
      },
    },
    {
      type: "ActionPanel",
      props: {
        title: "Decisions Needed",
        description:
          "The following actions require your approval before the agent can proceed.",
      },
      children: [
        {
          type: "ActionButton",
          props: {
            label: "Prepare Board Escalation",
            variant: "primary",
            actionId: "escalateToBoard",
          },
        },
        {
          type: "ActionButton",
          props: {
            label: "Review Draft Notice",
            variant: "primary",
            actionId: "notifyRegulator",
          },
        },
        {
          type: "ActionButton",
          props: {
            label: "Assign Owner",
            variant: "secondary",
            actionId: "assignOwner",
          },
        },
      ],
    },
    {
      type: "Timeline",
      props: { title: "Response Timeline" },
      children: [
        {
          type: "TimelineStep",
          props: {
            status: "done",
            title: "Created incident record",
            detail: "Logged INC-2847 and associated it to CloudStorage Solutions.",
            timestamp: "09:14 ET",
            actorType: "agent",
          },
        },
        {
          type: "TimelineStep",
          props: {
            status: "done",
            title: "Identified affected subsidiaries",
            detail: "Mapped impacted entities and likely jurisdictions.",
            timestamp: "09:22 ET",
            actorType: "agent",
          },
        },
        {
          type: "TimelineStep",
          props: {
            status: "done",
            title: "Preserved evidence",
            detail: "Snapshot logs, preserved audit trail, restricted access.",
            timestamp: "09:33 ET",
            actorType: "agent",
          },
        },
        {
          type: "TimelineStep",
          props: {
            status: "pending",
            title: "Prepare Board escalation",
            detail: "Requires your review; GC included by default.",
            timestamp: "Pending",
            actorType: "human",
          },
        },
      ],
    },
  ],
};

// ============================================================================
// CATALOG COMPONENTS (what json-render renders)
// ============================================================================

function IncidentHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function IncidentCard({
  incidentId,
  title,
  urgency,
  detail,
  progressCurrent,
  progressTotal,
}: {
  incidentId: string;
  title: string;
  urgency: "high" | "medium" | "low";
  detail: string;
  progressCurrent: number;
  progressTotal: number;
}) {
  const urgencyStyles = {
    high: "bg-red-50 border-red-200 text-red-800",
    medium: "bg-amber-50 border-amber-200 text-amber-800",
    low: "bg-slate-50 border-slate-200 text-slate-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-slate-900">
          Active incident
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${urgencyStyles[urgency]}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {urgency.charAt(0).toUpperCase() + urgency.slice(1)} urgency
        </span>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-700">
              Agent progress: {progressCurrent} of {progressTotal} steps
              completed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-slate-700 transition-all"
                style={{
                  width: `${(progressCurrent / progressTotal) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          {detail}{" "}
          <span className="text-slate-500">Incident ID:</span>{" "}
          <span className="font-medium text-slate-700">{incidentId}</span>
        </p>
      </div>
    </div>
  );
}

function ActionPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <div className="mt-4 flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

function ActionButton({
  label,
  variant,
  actionId,
}: {
  label: string;
  variant: "primary" | "secondary" | "ghost";
  actionId: string;
}) {
  const variantStyles = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 border-slate-900",
    secondary:
      "bg-white text-slate-900 hover:bg-slate-50 border-slate-300",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 border-transparent",
  };

  return (
    <button
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${variantStyles[variant]}`}
      onClick={() => console.log(`Action triggered: ${actionId}`)}
    >
      {label}
    </button>
  );
}

function Timeline({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function TimelineStep({
  status,
  title,
  detail,
  timestamp,
  actorType,
}: {
  status: "done" | "pending" | "in_progress";
  title: string;
  detail: string;
  timestamp: string;
  actorType: "agent" | "human";
}) {
  const statusConfig = {
    done: { icon: "✓", bg: "bg-green-100", text: "text-green-700" },
    pending: { icon: "○", bg: "bg-slate-100", text: "text-slate-500" },
    in_progress: { icon: "◐", bg: "bg-blue-100", text: "text-blue-700" },
  };

  const config = statusConfig[status];

  return (
    <div className="flex gap-3 py-3">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${config.bg} ${config.text}`}
      >
        {config.icon}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-800">{title}</span>
          <span className="text-xs text-slate-500">{timestamp}</span>
        </div>
        <p className="mt-0.5 text-sm text-slate-600">{detail}</p>
        <span
          className={`mt-1.5 inline-block rounded px-2 py-0.5 text-xs ${
            actorType === "agent"
              ? "bg-purple-50 text-purple-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {actorType === "agent" ? "Agent" : "Human"}
        </span>
      </div>
    </div>
  );
}

function InfoBanner({
  variant,
  message,
}: {
  variant: "info" | "warning" | "success" | "error";
  message: string;
}) {
  const variantStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div className={`rounded-xl border p-4 ${variantStyles[variant]}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ============================================================================
// JSON RENDERER (interprets JSON structure)
// ============================================================================

const componentMap: Record<string, React.ComponentType<any>> = {
  IncidentHeader,
  IncidentCard,
  ActionPanel,
  ActionButton,
  Timeline,
  TimelineStep,
  InfoBanner,
};

function renderJsonUI(node: any): React.ReactNode {
  if (!node || !node.type) return null;

  const Component = componentMap[node.type];
  if (!Component) {
    console.warn(`Unknown component type: ${node.type}`);
    return null;
  }

  const children = node.children?.map((child: any, index: number) => (
    <React.Fragment key={index}>{renderJsonUI(child)}</React.Fragment>
  ));

  return <Component {...node.props}>{children}</Component>;
}

// ============================================================================
// HELPER
// ============================================================================

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// CHAT COMPONENT
// ============================================================================

function JsonRenderChatInput({
  showRawJson,
  setShowRawJson,
}: {
  showRawJson: boolean;
  setShowRawJson: (v: boolean) => void;
}) {
  const [localInput, setLocalInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; json?: any }>>([]);
  const [loading, setLoading] = useState(false);

  // Demo responses that return JSON structures
  const getDemoResponse = (query: string): { content: string; json?: any } => {
    const q = query.toLowerCase();
    
    if (q.includes("status") || q.includes("incident") || q.includes("details")) {
      return {
        content: "Here's the incident rendered from JSON:",
        json: {
          type: "IncidentCard",
          props: {
            incidentId: "INC-2847",
            title: "SECURITY INCIDENT — CloudStorage Solutions",
            urgency: "high",
            detail: "Unusual access pattern detected across third-party integration.",
            progressCurrent: 5,
            progressTotal: 8,
          },
        },
      };
    }
    
    if (q.includes("timeline") || q.includes("steps")) {
      return {
        content: "Timeline rendered from JSON structure:",
        json: {
          type: "Timeline",
          props: { title: "Response Timeline" },
          children: [
            { type: "TimelineStep", props: { status: "done", title: "Created incident record", detail: "Logged INC-2847", timestamp: "09:14 ET", actorType: "agent" }},
            { type: "TimelineStep", props: { status: "done", title: "Preserved evidence", detail: "Snapshot logs secured", timestamp: "09:33 ET", actorType: "agent" }},
            { type: "TimelineStep", props: { status: "pending", title: "Board escalation", detail: "Awaiting approval", timestamp: "Pending", actorType: "human" }},
          ],
        },
      };
    }
    
    return {
      content: `I understand you're asking about "${query}". Try asking about:\n• "What's the incident status?"\n• "Show me the timeline"`,
    };
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
      setMessages((prev) => [...prev, { role: "assistant", content: response.content, json: response.json }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Ask the Diligent Agent
        </div>
        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium transition ${
            showRawJson
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${showRawJson ? "bg-emerald-500" : "bg-slate-400"}`} />
          {showRawJson ? "JSON On" : "JSON Off"}
        </button>
      </div>
      
      {messages.length > 0 && (
        <div className="mt-3 max-h-[50vh] overflow-y-auto space-y-3 border-b border-slate-100 pb-3 mb-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-3 text-sm ${
                msg.role === "user"
                  ? "bg-slate-100 text-slate-800 ml-8"
                  : "bg-emerald-50 text-emerald-900 mr-8"
              }`}
            >
              <div className="text-xs font-medium mb-1 opacity-60">
                {msg.role === "user" ? "You" : "Diligent Agent"}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.json && (
                <div className="mt-3">
                  {showRawJson && (
                    <pre className="mb-2 rounded bg-slate-800 p-2 text-xs text-slate-300 overflow-auto max-h-32">
                      {JSON.stringify(msg.json, null, 2)}
                    </pre>
                  )}
                  {renderJsonUI(msg.json)}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900 mr-8">
              <div className="text-xs font-medium mb-1 opacity-60">Diligent Agent</div>
              <span className="animate-pulse">Generating JSON...</span>
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
        {showRawJson ? "Showing JSON source alongside rendered components." : "Toggle JSON to see the underlying structure."}
      </p>
    </div>
  );
}

// ============================================================================
// ACTION CARD WITH CLICK HANDLER
// ============================================================================

function ActionCardWithClick({
  title,
  description,
  actionLabel,
  hint,
  onClick,
}: {
  title: string;
  description: string;
  actionLabel: string;
  hint?: string;
  onClick?: () => void;
}) {
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

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function SecurityJsonRenderPage() {
  const [showRawJson, setShowRawJson] = useState(false);
  const [showBoardEscalation, setShowBoardEscalation] = useState(false);
  const [showNotifyRegulator, setShowNotifyRegulator] = useState(false);
  const [showAssignOwner, setShowAssignOwner] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState("Priya Shah (Security)");

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
            <a href="/now/agentic-hero/security" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">Security Incident</a>
            <a href="/now/agentic-hero/security-tambo" className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100">Tambo</a>
            <a href="/now/agentic-hero/security-jsonrender" className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">JSON Render</a>
            <span className="text-slate-300">|</span>
            <a href="/now/agentic-hero/whistleblower" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">Whistleblower</a>
            <a href="/now/agentic-hero/compliance" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">Compliance</a>
            <a href="/now/agentic-hero" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">Steady State</a>
          </nav>
        </div>
      </div>

      {/* Wireframe surface container */}
      <div className="mx-auto mt-6 w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm relative px-1">
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
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-900">
                    JSON Render UI
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200 px-2 py-0.5 text-xs text-emerald-800">
                    ✓ Catalog Active
                  </span>
                </div>
              </div>

              {/* Chat component */}
              <JsonRenderChatInput showRawJson={showRawJson} setShowRawJson={setShowRawJson} />

              {/* Catalog info - collapsible */}
              <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <summary className="cursor-pointer text-xs font-medium text-slate-600">
                  {Object.keys(catalogDefinition.components).length} components in catalog
                </summary>
                <div className="mt-3 space-y-2">
                  {Object.keys(catalogDefinition.components).map((name) => (
                    <div key={name} className="rounded-lg border border-slate-200 bg-white p-2">
                      <span className="font-mono text-xs text-slate-900">{name}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>

          {/* RIGHT COLUMN - Incident context */}
          <div className="lg:col-span-7 space-y-6">
            {/* Incident card */}
            <IncidentCard
              incidentId="INC-2847"
              title="SECURITY INCIDENT DETECTED — AUTO-RESPONSE ACTIVATED"
              urgency="high"
              detail="ServiceNow incident logged by CloudStorage Solutions (3rd party provider). Unusual access pattern detected."
              progressCurrent={5}
              progressTotal={8}
            />

            {/* Actions section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Decisions Needed
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                These actions require your approval before proceeding.
              </p>
              <div className="mt-4 space-y-3">
                <ActionCardWithClick
                  title="Escalate to Board"
                  description="Prepare a Board-ready summary and recommended next steps."
                  actionLabel="Prepare Board Escalation"
                  hint="GC will be included by default"
                  onClick={() => setShowBoardEscalation(true)}
                />
                <ActionCardWithClick
                  title="Notify Regulator"
                  description="Prepare a draft regulatory notification based on current findings."
                  actionLabel="Review Draft Notice"
                  hint="Nothing submitted without approval"
                  onClick={() => setShowNotifyRegulator(true)}
                />
                <ActionCardWithClick
                  title="Assign Incident Owner"
                  description="Designate a primary owner responsible for coordination and follow-up."
                  actionLabel="Assign Owner"
                  hint="Suggested owners included"
                  onClick={() => setShowAssignOwner(true)}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Response Timeline</h2>
              <p className="mt-1 text-sm text-slate-600">
                Steps completed by the agent and pending human decisions.
              </p>
              <div className="mt-4 divide-y divide-slate-100">
                <TimelineStep status="done" title="Created incident record" detail="Logged INC-2847 and associated it to CloudStorage Solutions." timestamp="09:14 ET" actorType="agent" />
                <TimelineStep status="done" title="Identified affected subsidiaries" detail="Mapped impacted entities and likely jurisdictions." timestamp="09:22 ET" actorType="agent" />
                <TimelineStep status="done" title="Preserved evidence" detail="Snapshot logs, preserved audit trail, restricted access." timestamp="09:33 ET" actorType="agent" />
                <TimelineStep status="pending" title="Prepare Board escalation" detail="Requires your review; GC included by default." timestamp="Pending" actorType="human" />
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
              <button onClick={() => setShowBoardEscalation(false)} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Exit</button>
            </div>
          </div>
          <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">
            <section>
              <h2 className="text-sm font-semibold text-slate-900">What the Board needs to know</h2>
              <p className="mt-2 text-sm text-slate-600">This escalation summarizes the incident, potential impact, and immediate actions taken.</p>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Draft Board Message</h3>
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 space-y-2">
                <p><strong>Summary:</strong> A security incident involving a third‑party data processor was detected and contained.</p>
                <p><strong>Status:</strong> Investigation ongoing. No confirmed data exfiltration at this time.</p>
                <p><strong>Actions taken:</strong> Incident logged, evidence preserved, Legal and Security engaged.</p>
                <p><strong>Next steps:</strong> Continued monitoring, regulator assessment, follow‑up briefing.</p>
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
              <button onClick={() => setShowNotifyRegulator(false)} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Exit</button>
            </div>
          </div>
          <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">
            <section>
              <h2 className="text-sm font-semibold text-slate-900">Draft (review required)</h2>
              <p className="mt-2 text-sm text-slate-600">This draft is based on current findings. General Counsel review is recommended.</p>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Draft Notice</h3>
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 space-y-2">
                <p><strong>Incident reference:</strong> INC-2847</p>
                <p><strong>Summary:</strong> A security incident involving a third‑party data processor was detected. Investigation is ongoing.</p>
                <p><strong>Potential impact:</strong> No confirmed data exfiltration at this time.</p>
                <p><strong>Next update:</strong> We will provide a follow‑up update within 72 hours.</p>
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
              <button onClick={() => setShowAssignOwner(false)} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Exit</button>
            </div>
          </div>
          <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">
            <section>
              <h2 className="text-sm font-semibold text-slate-900">Suggested owners</h2>
              <p className="mt-2 text-sm text-slate-600">The agent suggests owners based on role, availability, and prior incidents.</p>
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
                  <div className="mt-1 text-sm text-slate-600">Primary coordinator for follow-ups and stakeholder updates.</div>
                </button>
              ))}
            </section>
            <section className="flex items-center justify-between border-t border-slate-200 pt-6">
              <div className="text-xs text-slate-500">Assigning an owner records accountability.</div>
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
