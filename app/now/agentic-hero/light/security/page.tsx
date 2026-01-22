"use client";

import React, { useMemo, useState } from "react";
import { ReceiptComponent, ReceiptModel } from "@/components/now/agentic-hero/ReceiptComponent";
/**
 * Agentic Hero — Start Screen (Grayscale)
 * Drop-in wireframe surface to begin the Incident Governance hero story.
 *
 * Next steps (we’ll build after this screen is in place):
 * - Right-side review panel: Act 2 timeline, Act 3 reasoning, Act 4 controls, Act 5 receipt
 */

type HeroPhase = "start" | "incident_detected" | "governance_in_progress" | "needs_review" | "completed" | "board_escalation";

type Signal = {
  id: string;
  urgency: "high" | "medium" | "low";
  title: string;
  detail: string;
  timeAgo: string;
  incidentId?: string;
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function DiligentLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 222 222" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
        <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
        <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
      </g>
    </svg>
  );
}

function PrototypeNav() {
  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Prototype</span>
          <span className="text-sm font-semibold text-gray-900">Agentic Hero</span>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          <a href="/now/agentic-hero/light/security" className="rounded-full border border-[#EE312E]/30 bg-[#EE312E]/5 px-3 py-1 text-xs font-semibold text-[#EE312E] hover:bg-[#EE312E]/10">Security Incident</a>
          <a href="/now/agentic-hero/light/security-jsonrender" className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">JSON Render</a>
          <a href="/now/agentic-hero/light/security-tambo" className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100">Tambo</a>
          <span className="text-gray-300">|</span>
          <a href="/now/agentic-hero/light/whistleblower" className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">Whistleblower</a>
          <a href="/now/agentic-hero/light/compliance" className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">Global Compliance</a>
          <a href="/now/agentic-hero/light" className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">Steady State</a>
        </nav>
      </div>
    </div>
  );
}

/** Simple grayscale icons (inline SVG) so this file stays self-contained. */
function Icon({ name, className }: { name: string; className?: string }) {
  const common = cn("inline-block", className);
  switch (name) {
    case "grid":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 0h6v6h-6v-6Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "shield":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3 20 7v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "paperclip":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M8 12.5 14.8 5.7a3 3 0 1 1 4.2 4.2l-8.2 8.2a5 5 0 0 1-7.1-7.1l8-8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "mic":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7 11a5 5 0 0 0 10 0M12 16v4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "send":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 4 10 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M20 4 13 20l-3-7-7-3 17-6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "spark":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l1.2 5.3L18 9l-4.8 1.7L12 16l-1.2-5.3L6 9l4.8-1.7L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M19 13l.6 2.5L22 16l-2.4.5L19 19l-.6-2.5L16 16l2.4-.5L19 13Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bell":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "dots":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
            fill="currentColor"
          />
        </svg>
      );
    case "chev":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "search":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "building":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M9 7h2M9 11h2M9 15h2M6 21h14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M15 9h3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function PillButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 active:translate-y-[1px]"
    >
      <span className="text-gray-500">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

function UrgencyBadge({ level }: { level: Signal["urgency"] }) {
  const config = {
    high: { text: "High urgency", bg: "bg-[#EE312E]/10", border: "border-[#EE312E]/30", dot: "bg-[#EE312E]", textColor: "text-[#EE312E]" },
    medium: { text: "Medium", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", textColor: "text-amber-700" },
    low: { text: "Low", bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-400", textColor: "text-gray-600" },
  };
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${c.bg} ${c.border} ${c.textColor}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${c.dot}`} />
      {c.text}
    </span>
  );
}

function RightDrawer({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className={cn(
          "absolute inset-0 z-40 bg-black/20 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 z-50 h-full w-[420px] max-w-[92vw] border-l border-gray-200 bg-white shadow-xl transition-transform flex flex-col",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="min-w-0">
            <div className="text-xs text-gray-500">Incident review</div>
            <div className="truncate text-sm font-semibold text-gray-900">{title}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        <div className="border-t border-gray-200 p-3 bg-white">
          <PromptComposer
            placeholder="Ask a follow-up about INC-2847..."
            contextLabel="INC-2847"
            dock="rail"
          />
        </div>
      </aside>
    </>
  );
}

export default function Page() {
  const [heroPhase, setHeroPhase] = useState<HeroPhase>("start");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showBoardEscalation, setShowBoardEscalation] = useState(false);
  const [showNotifyRegulator, setShowNotifyRegulator] = useState(false);
  const [showCommsPackage, setShowCommsPackage] = useState(false);
  const [showAssignOwner, setShowAssignOwner] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<string>("Priya Shah (Security)");
  const [incidentUiMode, setIncidentUiMode] = useState<"rail" | "inline">("rail");
  const [inlineOpen, setInlineOpen] = useState(false);
  const [showIncidentReceipt, setShowIncidentReceipt] = useState(false);

  const signals: Signal[] = useMemo(
    () => [
      {
        id: "sig-1",
        urgency: "high",
        title: "SECURITY INCIDENT DETECTED — AUTO-RESPONSE ACTIVATED",
        detail:
          "ServiceNow incident logged by CloudStorage Solutions (3rd party provider).",
        timeAgo: "3 hours ago",
        incidentId: "INC-2847",
      },
    ],
    []
  );

  const receiptSteps = useMemo(
    () => [
      {
        status: "done" as const,
        title: "Created incident record",
        detail: "Logged INC-2847 and associated it to CloudStorage Solutions.",
        time: "09:14 ET",
        confidence: "High",
        source: "ServiceNow ingest",
      },
      {
        status: "done" as const,
        title: "Identified affected subsidiaries",
        detail: "Mapped impacted entities and likely jurisdictions.",
        time: "09:22 ET",
        confidence: "Medium",
        source: "Entity graph + contracts",
      },
      {
        status: "done" as const,
        title: "Preserved evidence",
        detail: "Snapshot logs, preserved audit trail, restricted access.",
        time: "09:33 ET",
        confidence: "High",
        source: "Cloud logs + retention policy",
      },
      {
        status: "done" as const,
        title: "Notified Legal + Security (internal)",
        detail: "Sent an internal incident heads-up and created a response channel.",
        time: "09:41 ET",
        confidence: "High",
        source: "Teams + email",
      },
      {
        status: "done" as const,
        title: "Drafted external comms package",
        detail: "Press release + IR email + Teams post drafted; shared with Marketing for review.",
        time: "10:06 ET",
        confidence: "Medium",
        source: "Comms templates",
      },
      {
        status: "pending" as const,
        title: "Prepare Board escalation",
        detail: "Requires your review; GC included by default.",
        time: "Pending",
        confidence: "—",
        source: "Your approval",
      },
      {
        status: "pending" as const,
        title: "Draft regulator notification",
        detail: "Draft ready for review; nothing submitted without approval.",
        time: "Pending",
        confidence: "—",
        source: "Your approval",
      },
      {
        status: "pending" as const,
        title: "Assign incident owner",
        detail: "Select a primary owner to coordinate follow-ups.",
        time: "Pending",
        confidence: "—",
        source: "Your decision",
      },
    ],
    []
  );

  const receiptModel: ReceiptModel = useMemo(
    () => ({
      id: "INC-2847",
      title: "Security incident — INC-2847",
      summary: [
        "Unusual access pattern detected across a third-party integration (CloudStorage Solutions).",
        "Evidence preserved and internal response activated (Legal + Security notified).",
        "External comms package drafted and shared with Marketing for review.",
        "No external notifications have been sent. Pending actions require your approval.",
      ],
      completedSteps: 5,
      totalSteps: 8,
      steps: receiptSteps.map((s, idx) => {
        const status = s.status === "done" ? "done" : "pending";
        const actor = s.status === "done" ? "Agent" : "Human";
        return {
          id: `step-${idx}`,
          status,
          title: s.title,
          detail: s.detail,
          time: s.time,
          actor,
        };
      }),
    }),
    [receiptSteps]
  );

  const headline = "You have an active security incident to review, Sarah.";
  const promptPlaceholder = "What should we review?";

  function openIncidentReview() {
    setHeroPhase("incident_detected");
    if (incidentUiMode === "rail") {
      setDrawerOpen(true);
    } else {
      setInlineOpen(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="pb-6">
        <PrototypeNav />
      </div>
      {/* Prototype controls (outside the wireframe surface) */}
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-gray-700 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wide text-sky-700">Prototype control</div>
              <div className="truncate font-medium text-gray-800">
                Incident updates appear as: {incidentUiMode === "rail" ? "Right rail" : "Inline report"}
              </div>
              <div className="mt-0.5 text-xs text-gray-500">
                This control is not part of the product UI.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIncidentUiMode("rail");
                  setInlineOpen(false);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm shadow-sm",
                  incidentUiMode === "rail"
                    ? "border-[#EE312E] bg-[#EE312E] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                Right rail
              </button>
              <button
                onClick={() => {
                  setIncidentUiMode("inline");
                  setDrawerOpen(false);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm shadow-sm",
                  incidentUiMode === "inline"
                    ? "border-[#EE312E] bg-[#EE312E] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                Inline report
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm relative">
        {/* Top chrome */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <DiligentLogo className="h-7 w-auto" />
                <span className="text-sm font-semibold text-gray-900">GRC Command Center</span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700">
                <Icon name="grid" className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Ibotta, Inc.</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <div className="relative">
                <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#EE312E]" />
                <button className="rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50">
                  <Icon name="bell" className="h-5 w-5" />
                </button>
              </div>
              <button className="rounded-full border border-gray-200 bg-white p-2 hover:bg-gray-50">
                <Icon name="dots" className="h-5 w-5" />
              </button>
              <div className="ml-1 h-8 w-8 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Hero area */}
        <div className="bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <h1 className="text-center text-4xl font-semibold tracking-tight text-gray-800">
              {headline}
            </h1>

            {/* Active incident (kept above the prompt) */}
            <div className="mx-auto mt-6 max-w-[860px]">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold text-gray-900">Active incident</div>
                  <UrgencyBadge level={signals[0].urgency} />
                </div>

                <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {signals[0].title}
                  </div>
                  {/* Agent progress preview */}
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-gray-700">
                        Agent progress: 5 of 8 steps completed
                      </div>
                      <button
                        onClick={() => {
                          setShowIncidentReceipt(true);
                          setDrawerOpen(false);
                          setInlineOpen(false);
                        }}
                        className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
                      >
                        View completed steps
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full w-[62%] rounded-full bg-gray-700" />
                      </div>
                      <span className="text-gray-500">≈ 12 min saved</span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {signals[0].detail}{" "}
                    <span className="text-gray-500">Incident ID:</span>{" "}
                    <span className="font-medium text-gray-700">{signals[0].incidentId}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    {(drawerOpen || inlineOpen) ? (
                      <>
                        <span className="text-xs text-gray-500">
                          Reviewing now
                        </span>
                        <button
                          onClick={() => {
                            setDrawerOpen(false);
                            setInlineOpen(false);
                          }}
                          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          Close review
                        </button>
                      </>
                    ) : (
                      <>
                        <GhostButton>Assign</GhostButton>
                        <button
                          onClick={openIncidentReview}
                          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-100"
                        >
                          Review
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Inline incident report (pushes content down) */}
            {incidentUiMode === "inline" && inlineOpen && (
              <div className="mx-auto mt-6 max-w-[860px]">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wide text-gray-500">Incident review</div>
                      <div className="mt-1 text-base font-semibold text-gray-900">
                        Security incident detected (INC-2847)
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Inline mode keeps you in the main workspace while the agent surfaces what changed.
                      </div>
                    </div>
                    <button
                      onClick={() => setInlineOpen(false)}
                      className="shrink-0 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-5 space-y-6">
                    {/* Reuse the same sections from the rail (lightweight summary) */}
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Incident briefing
                      </div>
                      <div className="mt-2 text-sm text-gray-800">
                        A security incident involving <strong>CloudStorage Solutions</strong> was detected at
                        <strong> 09:14 ET</strong>. This incident affects a regulated third-party data processor.
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="text-sm font-semibold text-gray-900">
                        Actions already taken
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-gray-700">
                        <li>✔ Incident record created (INC-2847)</li>
                        <li>✔ Affected subsidiaries identified</li>
                        <li>✔ Evidence preserved and secured</li>
                        <li>✔ Legal and Security teams notified internally</li>
                        <li className="flex items-start justify-between gap-3">
                          <span>✔ Drafted external comms package (press release + IR email + Teams post) and shared with Marketing for review</span>
                          <button
                            onClick={() => setShowCommsPackage(true)}
                            className="shrink-0 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            View
                          </button>
                        </li>
                      </ul>
                      <div className="mt-3 text-xs text-gray-500">
                        These actions are reversible. No external notifications have been sent or published.
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Decisions needed from you
                      </div>

                      <div className="mt-3 space-y-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                          <div className="text-sm font-medium text-gray-800">
                            Escalate to Board
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            Prepare a Board-ready summary and recommended next steps.
                            General Counsel review is strongly recommended.
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => setShowBoardEscalation(true)}
                              className="rounded-md border border-gray-300 bg-[#EE312E] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#d62b28]"
                            >
                              Prepare Board Escalation
                            </button>
                            <span className="text-xs text-gray-500">
                              GC will be included by default
                            </span>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                          <div className="text-sm font-medium text-gray-800">
                            Notify Regulator
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            Prepare a draft regulatory notification based on current findings. Review is required before sending.
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => setShowNotifyRegulator(true)}
                              className="rounded-md border border-gray-300 bg-[#EE312E] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#d62b28]"
                            >
                              Review Draft Notice
                            </button>
                            <span className="text-xs text-gray-500">
                              Nothing will be submitted without approval
                            </span>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-3">
                          <div className="text-sm font-medium text-gray-800">
                            Assign Incident Owner
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            Designate a primary owner responsible for coordination and follow-up.
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => setShowAssignOwner(true)}
                              className="rounded-md border border-gray-300 bg-[#EE312E] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#d62b28]"
                            >
                              Assign owner
                            </button>
                            <span className="text-xs text-gray-500">
                              Suggested owners included
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Prompt (contextual to the incident) */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Ask about this incident
                      </div>
                      <div className="mt-2">
                        <PromptComposer
                          placeholder="Ask a follow-up about INC-2847..."
                          contextLabel="INC-2847"
                          dock="rail"
                        />
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="text-sm font-medium text-gray-900">Monitoring</div>
                      <div className="mt-1 text-sm text-gray-600">
                        I’ll provide updates <strong>hourly</strong> and immediately as new information becomes available.
                      </div>
                      <div className="mt-3 flex items-center justify-end">
                        <button
                          onClick={() => setInlineOpen(false)}
                          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          Close report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Prompt composer (single instance) */}
            {!drawerOpen && !(incidentUiMode === "inline" && inlineOpen) && (
              <div className="mx-auto mt-8 max-w-[860px]">
                <PromptComposer placeholder={promptPlaceholder} dock="main" />
              </div>
            )}

            {!(incidentUiMode === "inline" && inlineOpen) && (
              <>
                {/* Lower grid */}
                <div className="mx-auto mt-10 grid max-w-[860px] grid-cols-1 gap-6">
                  {/* Recent Apps */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="text-lg font-semibold text-gray-900">Recent Apps</div>

                    <div className="mt-4 space-y-3">
                      <RecentAppRow
                        icon="shield"
                        label="AI Risk Essentials"
                        detail="Last: generated a cyber risk summary for Q1 Board materials."
                      />
                      <RecentAppRow
                        icon="building"
                        label="Entities"
                        detail="Last: updated subsidiary ownership notes for CloudStorage Solutions."
                      />
                      <RecentAppRow
                        icon="search"
                        label="Policy Manager"
                        detail="Last: searched incident response policy and notification thresholds."
                      />
                      <RecentAppRow
                        icon="spark"
                        label="Reporting Studio"
                        detail="Last: drafted an executive-facing incident timeline snapshot."
                      />
                    </div>
                  </div>
                </div>

                {/* Small, unobtrusive prototype note */}
                <div className="mx-auto mt-6 max-w-[1100px] text-xs text-gray-500">
                  Prototype note: This grayscale surface is a staging area for the Incident Governance hero flow (agent timeline, reasoning, controls, receipt).
                </div>
              </>
            )}
          </div>
        </div>

        {/* Incident Receipt (Full-Page) */}
        {showIncidentReceipt && (
          <div className="absolute inset-0 z-50 bg-white">
            <ReceiptComponent
              model={receiptModel}
              onClose={() => setShowIncidentReceipt(false)}
            />
          </div>
        )}
        {/* Right-side drawer (Act 1 revised) */}
        <RightDrawer
          open={drawerOpen}
          title="Security incident detected (INC-2847)"
          onClose={() => setDrawerOpen(false)}
        >
          <div className="space-y-6">

            {/* Incident briefing */}
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Incident briefing
              </div>
              <div className="mt-2 text-sm text-gray-800">
                A security incident involving <strong>CloudStorage Solutions</strong> was detected at
                <strong> 09:14 ET</strong>. This incident affects a regulated third-party data processor.
              </div>
            </div>

            {/* Actions already taken */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm font-semibold text-gray-900">
                Actions already taken
              </div>

              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>✔ Incident record created (INC-2847)</li>
                <li>✔ Affected subsidiaries identified</li>
                <li>✔ Evidence preserved and secured</li>
                <li>✔ Legal and Security teams notified internally</li>
                <li className="flex items-start justify-between gap-3">
                  <span>✔ Drafted external comms package (press release + IR email + Teams post) and shared with Marketing for review</span>
                  <button
                    onClick={() => {
                      setShowCommsPackage(true);
                      setDrawerOpen(false);
                    }}
                    className="shrink-0 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    View
                  </button>
                </li>
              </ul>

            <div className="mt-3 text-xs text-gray-500">
                These actions are reversible. No external notifications have been sent or published.
              </div>
              <div className="mt-3 flex items-center justify-end">
                <button
                  onClick={() => {
                    setShowIncidentReceipt(true);
                    setDrawerOpen(false);
                    setInlineOpen(false);
                  }}
                  className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  View completed steps (receipt)
                </button>
              </div>
            </div>

            {/* Decisions needed */}
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Decisions needed from you
              </div>

            <div className="mt-3 space-y-3">
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="text-sm font-medium text-gray-800">
                    Escalate to Board
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    Prepare a Board-ready summary and recommended next steps.
                    General Counsel review is strongly recommended.
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowBoardEscalation(true);
                        setDrawerOpen(false);
                      }}
                      className="rounded-md border border-gray-300 bg-[#EE312E] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#d62b28]"
                    >
                      Prepare Board Escalation
                    </button>
                    <span className="text-xs text-gray-500">
                      GC will be included by default
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="text-sm font-medium text-gray-800">
                    Notify Regulator
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    Prepare a draft regulatory notification based on current findings. Review is required before sending.
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowNotifyRegulator(true);
                        setDrawerOpen(false);
                      }}
                      className="rounded-md border border-gray-300 bg-[#EE312E] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#d62b28]"
                    >
                      Review Draft Notice
                    </button>
                    <span className="text-xs text-gray-500">
                      Nothing will be submitted without approval
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="text-sm font-medium text-gray-800">
                    Assign Incident Owner
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    Designate a primary owner responsible for coordination and follow-up.
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowAssignOwner(true);
                        setDrawerOpen(false);
                      }}
                      className="rounded-md border border-gray-300 bg-[#EE312E] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#d62b28]"
                    >
                      Assign owner
                    </button>
                    <span className="text-xs text-gray-500">
                      Suggested owners included
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guidance */}
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-600">
              I will continue monitoring and preparing recommended actions.  
              No external notifications will be sent until you approve next steps.
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="text-sm font-medium text-gray-900">Monitoring</div>
              <div className="mt-1 text-sm text-gray-600">
                I’ll provide updates <strong>hourly</strong> and immediately as new information becomes available.
              </div>
              <div className="mt-3 flex items-center justify-end">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    setInlineOpen(false);
                  }}
                  className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Close panel
                </button>
              </div>
            </div>

          </div>
        </RightDrawer>
        {/* Board Escalation Full-Page Workflow */}
        {showBoardEscalation && (
          <div className="absolute inset-0 z-50 bg-white">
            <div className="h-full overflow-y-auto">
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      Board Escalation
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      Security Incident — INC-2847
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBoardEscalation(false)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Exit
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">
                {/* Context */}
                <section>
                  <h2 className="text-sm font-semibold text-gray-900">
                    What the Board needs to know
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    This escalation summarizes the incident, potential impact,
                    and immediate actions taken. It is written for non-technical
                    Board members.
                  </p>
                </section>

                {/* Draft message */}
                <section>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Draft Board Message
                  </h3>

                  {/* Light formatting toolbar (visual only) */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-t-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600">
                    <span className="font-medium text-gray-700">Formatting</span>
                    <span className="text-gray-300">|</span>
                    <button className="rounded-md border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50">B</button>
                    <button className="rounded-md border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50 italic">I</button>
                    <button className="rounded-md border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50">• List</button>
                    <button className="rounded-md border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50">Link</button>
                    <span className="text-gray-400">(visual only)</span>
                  </div>

                  {/* Editable-looking body */}
                  <div className="rounded-b-xl border border-t-0 border-gray-200 bg-white p-4 text-sm text-gray-700">
                    <div className="space-y-2">
                      <p><strong>Summary:</strong> A security incident involving a third‑party data processor was detected and contained.</p>
                      <p><strong>Status:</strong> Investigation ongoing. No confirmed data exfiltration at this time.</p>
                      <p><strong>Actions taken:</strong> Incident logged, evidence preserved, Legal and Security engaged.</p>
                      <p><strong>Next steps:</strong> Continued monitoring, regulator assessment, follow‑up briefing.</p>
                    </div>
                  </div>

                  {/* Prompt-to-revise */}
                  <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Ask the agent to revise
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400"
                        placeholder="e.g., make this shorter, remove jargon, add a clearer next step"
                      />
                      <button className="rounded-md bg-[#EE312E] px-3 py-2 text-sm font-medium text-white hover:bg-[#d62b28]">
                        Apply
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      This is a prototype — the “Apply” action is illustrative.
                    </div>
                  </div>
                </section>

                {/* Recipients */}
                <section>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Recipients
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <div>✔ Board of Directors (18)</div>
                    <div>✔ Executive Assistants (4)</div>
                    <div>✔ General Counsel (included)</div>
                  </div>
                </section>

                {/* Actions */}
                <section className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="text-xs text-gray-500">
                    Nothing will be sent without your approval.
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBoardEscalation(false)}
                      className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="rounded-md bg-[#EE312E] px-4 py-2 text-sm font-medium text-white hover:bg-[#d62b28]">
                      Approve & Send
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
        {/* Notify Regulator Full-Page Workflow */}
        {showNotifyRegulator && (
          <div className="absolute inset-0 z-50 bg-white">
            <div className="h-full overflow-y-auto">
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      Regulatory Notification
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      Draft Notice — INC-2847
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotifyRegulator(false)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Exit
                  </button>
                </div>
              </div>

              <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">
                <section>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Draft (review required)
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    This draft is based on current findings and is intentionally conservative.
                    You can edit before sending. General Counsel review is recommended.
                  </p>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Draft Notice
                  </h3>

                  {/* Light formatting toolbar (visual only) */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-t-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600">
                    <span className="font-medium text-gray-700">Formatting</span>
                    <span className="text-gray-300">|</span>
                    <button className="rounded-md border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50">B</button>
                    <button className="rounded-md border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50 italic">I</button>
                    <button className="rounded-md border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50">• List</button>
                    <button className="rounded-md border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50">Link</button>
                    <span className="text-gray-400">(visual only)</span>
                  </div>

                  {/* Editable-looking body */}
                  <div className="rounded-b-xl border border-t-0 border-gray-200 bg-white p-4 text-sm text-gray-700">
                    <div className="space-y-2">
                      <p><strong>Incident reference:</strong> INC-2847</p>
                      <p><strong>Summary:</strong> A security incident involving a third‑party data processor was detected. Investigation is ongoing.</p>
                      <p><strong>Potential impact:</strong> No confirmed data exfiltration at this time. Scope assessment in progress.</p>
                      <p><strong>Actions taken:</strong> Evidence preserved, internal response activated, Legal and Security engaged.</p>
                      <p><strong>Next update:</strong> We will provide a follow‑up update within 72 hours or sooner as facts are confirmed.</p>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Placeholders, jurisdictions, and required fields would be validated before submission.
                    </div>
                  </div>

                  {/* Prompt-to-revise */}
                  <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Ask the agent to revise
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400"
                        placeholder="e.g., add jurisdictions, tighten language, emphasize unknowns"
                      />
                      <button className="rounded-md bg-[#EE312E] px-3 py-2 text-sm font-medium text-white hover:bg-[#d62b28]">
                        Apply
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      This is a prototype — the “Apply” action is illustrative.
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Review checklist
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <div>• Confirm jurisdiction(s) and reporting deadline</div>
                    <div>• Confirm whether personal data is implicated</div>
                    <div>• Confirm approved statement of impact</div>
                    <div>• Confirm counsel review (recommended)</div>
                  </div>
                </section>

                <section className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="text-xs text-gray-500">
                    Nothing will be submitted without your approval.
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowNotifyRegulator(false)}
                      className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="rounded-md bg-[#EE312E] px-4 py-2 text-sm font-medium text-white hover:bg-[#d62b28]">
                      Approve &amp; Submit
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
        {/* External Comms Package (Drafts) */}
        {showCommsPackage && (
          <div className="absolute inset-0 z-50 bg-white">
            <div className="h-full overflow-y-auto">
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      External Comms Package
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      Drafts for review — INC-2847
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCommsPackage(false)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Exit
                  </button>
                </div>
              </div>

              <div className="mx-auto max-w-[950px] px-6 py-8 space-y-8">
                <section>
                  <h2 className="text-sm font-semibold text-gray-900">
                    What’s included
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    The agent drafted a conservative comms package to reduce scramble if questions arise.
                    Nothing has been sent or published. Marketing owns final review.
                  </p>
                </section>

                {/* Press release */}
                <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Press release (draft)</h3>
                    <span className="text-xs text-gray-500">Owner: Marketing</span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <p><strong>Headline:</strong> Company Provides Update on Third‑Party Security Incident</p>
                    <p><strong>Body:</strong> We recently identified a security incident involving a third‑party service provider. Our investigation is ongoing and we have engaged internal and external experts. At this time, we have no confirmed evidence of data exfiltration.</p>
                    <p><strong>Next update:</strong> We will provide additional information as facts are confirmed.</p>
                  </div>
                </section>

                {/* IR email */}
                <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Investor Relations email (draft)</h3>
                    <span className="text-xs text-gray-500">Tag: CFO, IRO</span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <p><strong>Subject:</strong> Security incident update — investigation underway</p>
                    <p><strong>Message:</strong> We identified an incident involving a third‑party provider and activated our response process. We do not have confirmed evidence of data exfiltration at this time. We will share further updates as facts are confirmed.</p>
                  </div>
                </section>

                {/* Teams post */}
                <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Teams announcement (draft)</h3>
                    <span className="text-xs text-gray-500">Channel: Exec Staff</span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <p><strong>Post:</strong> Heads up: we detected a security incident involving a third‑party provider and activated our response. Investigation is ongoing; no confirmed data exfiltration at this time. Please route external questions to IR/Comms.</p>
                  </div>
                </section>

                <section className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="text-xs text-gray-500">
                    Marketing review required before any publishing or external distribution.
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCommsPackage(false)}
                      className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button className="rounded-md bg-[#EE312E] px-4 py-2 text-sm font-medium text-white hover:bg-[#d62b28]">
                      Send to Marketing for approval
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Assign Incident Owner (Full-Page) */}
        {showAssignOwner && (
          <div className="absolute inset-0 z-50 bg-white">
            <div className="h-full overflow-y-auto">
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      Assign Incident Owner
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      Primary owner — INC-2847
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAssignOwner(false)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Exit
                  </button>
                </div>
              </div>

              <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">
                <section>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Suggested owners
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    The agent suggests owners based on role, availability, and prior incidents. You can pick one or add someone else.
                  </p>
                </section>

                <section className="space-y-3">
                  {[
                    "Priya Shah (Security)",
                    "Danielle Kim (Legal)",
                    "Marcus Reed (IT Operations)",
                  ].map((name) => (
                    <button
                      key={name}
                      onClick={() => setSelectedOwner(name)}
                      className={cn(
                        "w-full rounded-xl border p-4 text-left transition",
                        selectedOwner === name
                          ? "border-gray-400 bg-gray-50"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-gray-900">{name}</div>
                        <span
                          className={cn(
                            "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                            selectedOwner === name ? "border-gray-900" : "border-gray-300"
                          )}
                        >
                          {selectedOwner === name ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#EE312E]" />
                          ) : null}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Primary coordinator for follow-ups, assignments, and stakeholder updates.
                      </div>
                    </button>
                  ))}
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Add someone else
                  </h3>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400"
                      placeholder="Type a name or role (e.g., 'CISO', 'Security Lead')"
                    />
                    <button className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Add
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Prototype note: selection and search are illustrative.
                  </div>
                </section>

                <section className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="text-xs text-gray-500">
                    Assigning an owner records accountability and enables automated follow-ups.
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAssignOwner(false)}
                      className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="rounded-md bg-[#EE312E] px-4 py-2 text-sm font-medium text-white hover:bg-[#d62b28]">
                      Assign {selectedOwner.split(" ")[0]}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecentAppRow({
  icon,
  label,
  detail,
}: {
  icon: string;
  label: string;
  detail: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 text-left hover:bg-gray-50">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="mt-0.5 text-xs text-gray-500">{detail}</div>
      </div>
    </button>
  );
}

function PromptComposer({
  placeholder,
  contextLabel,
  dock,
}: {
  placeholder: string;
  contextLabel?: string;
  dock: "main" | "rail";
}) {
  const [inputValue, setInputValue] = React.useState("");
  
  return (
    <div>
      {/* Prompt box with gradient top border */}
      <div className="overflow-hidden rounded-2xl shadow-sm" style={{ background: "linear-gradient(to right, #f472b6, #a78bfa, #60a5fa, #2dd4bf)" }}>
        <div className="mt-[2px] rounded-b-2xl bg-white p-4">
          {contextLabel ? (
            <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Prompting in context
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
                <span className="font-medium">{contextLabel}</span>
              </div>
            </div>
          ) : null}
          
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="min-h-[48px] w-full resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
            placeholder={placeholder}
          />
          <div className="mt-2 flex items-center justify-between">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
              <Icon name="paperclip" className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                <Icon name="mic" className="h-5 w-5" />
              </button>
              <button 
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all",
                  inputValue.trim() 
                    ? "border-[#EE312E] bg-[#EE312E] text-white hover:bg-[#d62b28]" 
                    : "border-gray-200 text-gray-300"
                )}
                disabled={!inputValue.trim()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {dock === "main" ? (
        <>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <PillButton icon={<span className="text-base">＋</span>} label="Add New Entities" />
            <PillButton icon={<Icon name="search" className="h-4 w-4" />} label="Search Policies" />
            <PillButton icon={<Icon name="shield" className="h-4 w-4" />} label="Create Cyber Risk Report" />
            <PillButton icon={<Icon name="spark" className="h-4 w-4" />} label="Show Agents Needing Attention" />
          </div>
          <div className="mt-3 text-center text-xs text-gray-400">
            AI-generated content may have inaccuracies.{" "}
            <span className="underline hover:text-gray-600">Learn more</span>
          </div>
        </>
      ) : (
        <div className="mt-3 text-xs text-gray-500">
          Ask follow-up questions about this incident without leaving the review panel.
        </div>
      )}
    </div>
  );
}