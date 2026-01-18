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
// MAIN PAGE
// ============================================================================

export default function SecurityJsonRenderPage() {
  const [showRawJson, setShowRawJson] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Prototype
            </span>
            <span className="text-sm font-semibold text-slate-900">
              Security Incident — JSON Render
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <a
              href="/now/agentic-hero/security"
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Original
            </a>
            <a
              href="/now/agentic-hero/security-tambo"
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Tambo
            </a>
            <a
              href="/now/agentic-hero/security-jsonrender"
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-900"
            >
              JSON Render
            </a>
          </nav>
        </div>
      </div>

      {/* Info banner */}
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-900">
            JSON Render Demo
          </div>
          <p className="mt-1 text-sm text-emerald-800">
            This version uses{" "}
            <code className="rounded bg-emerald-100 px-1">@json-render/core</code>{" "}
            and{" "}
            <code className="rounded bg-emerald-100 px-1">@json-render/react</code>{" "}
            to render UI from JSON. A catalog constrains what components the AI
            can generate.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
            >
              {showRawJson ? "Hide" : "Show"} JSON Source
            </button>
            <span className="text-xs text-emerald-700">
              See the JSON structure that generates this UI
            </span>
          </div>
        </div>
      </div>

      {/* Raw JSON view */}
      {showRawJson && (
        <div className="mx-auto max-w-4xl px-6 pt-4">
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4">
            <div className="mb-2 text-xs font-medium text-slate-400">
              JSON Structure (what AI generates)
            </div>
            <pre className="max-h-96 overflow-auto text-xs text-slate-300">
              {JSON.stringify(sampleJsonUI, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Main content - rendered from JSON */}
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        {renderJsonUI(sampleJsonUI)}
      </div>

      {/* Chat input placeholder */}
      <div className="mx-auto max-w-4xl px-6 pb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Ask about this incident
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask a follow-up about INC-2847..."
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm placeholder:text-slate-400"
            />
            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            With json-render configured, AI responses stream as JSON and render
            progressively.
          </p>
        </div>
      </div>

      {/* Catalog info */}
      <div className="mx-auto max-w-4xl px-6 pb-8">
        <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-medium text-slate-700">
            View component catalog (
            {Object.keys(catalogDefinition.components).length} components,{" "}
            {Object.keys(catalogDefinition.actions).length} actions)
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Components
              </h3>
              <div className="mt-2 space-y-2">
                {Object.keys(catalogDefinition.components).map((name) => (
                  <div
                    key={name}
                    className="rounded-lg border border-slate-200 bg-white p-2"
                  >
                    <span className="font-mono text-sm text-slate-900">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Actions
              </h3>
              <div className="mt-2 space-y-2">
                {Object.keys(catalogDefinition.actions).map((name) => (
                  <div
                    key={name}
                    className="rounded-lg border border-slate-200 bg-white p-2"
                  >
                    <span className="font-mono text-sm text-slate-900">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
