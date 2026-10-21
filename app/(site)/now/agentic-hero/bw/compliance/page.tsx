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
 
function PrototypeNav() {
  return (
    <div className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Prototype</span>
          <span className="text-sm font-semibold text-slate-900">Agentic Hero</span>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          <a
            href="/now/agentic-hero/bw/security?context=diligent"
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Security Incident
          </a>
          <a
            href="/now/agentic-hero/bw/whistleblower?context=diligent"
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Whistleblower
          </a>
          <a
            href="/now/agentic-hero/bw/compliance?context=diligent"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-slate-50"
          >
            Global Compliance
          </a>
          <a
            href="/now/agentic-hero/bw?context=diligent"
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Steady State
          </a>
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
       className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50 active:translate-y-[1px]"
     >
       <span className="text-slate-500">{icon}</span>
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
       className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
     >
       {children}
     </button>
   );
 }
 
 function UrgencyBadge({ level }: { level: Signal["urgency"] }) {
   const text =
     level === "high" ? "High urgency" : level === "medium" ? "Medium" : "Low";
   return (
     <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
       {level === "high" ? (
         <span className="inline-block h-2 w-2 rounded-full bg-slate-700" />
       ) : (
         <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
       )}
       {text}
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
           "absolute right-0 top-0 z-50 h-full w-[420px] max-w-[92vw] border-l border-slate-200 bg-white shadow-xl transition-transform flex flex-col",
           open ? "translate-x-0" : "translate-x-full"
         )}
         aria-hidden={!open}
       >
         <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
           <div className="min-w-0">
             <div className="text-xs text-slate-500">Compliance review</div>
             <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
           </div>
           <button
             onClick={onClose}
             className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
           >
             Close
           </button>
         </div>
 
         <div className="flex-1 overflow-y-auto p-4">{children}</div>
         <div className="border-t border-slate-200 p-3 bg-white">
           <PromptComposer
             placeholder="Ask a follow-up about GCT-2031..."
             contextLabel="GCT-2031"
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
         title: "STATE CHANGE DETECTED — ENTITY RISK POSTURE UPDATED",
        detail:
          "A third-party linked to a specific subsidiary changed status. The system updated the entity-level risk node and rolled the impact up to the enterprise risk profile.",
         timeAgo: "27 minutes ago",
         incidentId: "GCT-2031",
       },
     ],
     []
   );
 
   const receiptSteps = useMemo(
     () => [
       {
         status: "done" as const,
         title: "Ingested entity hierarchy (legal blueprint)",
         detail: "Mapped global entity tree and identified entity nodes across jurisdictions.",
         time: "10:12 ET",
         confidence: "High",
         source: "Entities ingest",
       },
       {
         status: "done" as const,
         title: "Mapped third-party engagements to entity nodes",
         detail: "Linked vendor contracts and engagements to specific subsidiaries and regional offices.",
         time: "10:19 ET",
         confidence: "High",
         source: "TPM contract repository",
       },
       {
         status: "done" as const,
         title: "Detected cross-jurisdictional state change",
         detail: "Sentry detected a state change affecting a third party linked to a specific entity (sanction / rating / disruption).",
         time: "10:27 ET",
         confidence: "Medium",
         source: "Sentry monitoring",
       },
       {
         status: "done" as const,
         title: "Contextualized risk + calculated enterprise ripple-up",
         detail: "Calculated entity-level impact and how risk bubbles up to parent enterprise profile.",
         time: "10:34 ET",
         confidence: "Medium",
         source: "Contextualist",
       },
       {
         status: "done" as const,
         title: "Created risk event + drafted executive synthesis",
         detail: "Created a Risk Event in Risk Manager and drafted a board-ready summary.",
         time: "10:42 ET",
         confidence: "Medium",
         source: "Strategist",
       },
       {
         status: "pending" as const,
         title: "Notify risk owners (targeted)",
         detail: "Route only verified, high-impact changes to the correct risk owners.",
         time: "Pending",
         confidence: "—",
         source: "Your approval",
       },
       {
         status: "pending" as const,
         title: "Open mitigation playbook",
         detail: "Initiate mitigation tasks and set tracking reminders for affected entity/vendor intersection.",
         time: "Pending",
         confidence: "—",
         source: "Risk Manager workflow",
       },
       {
         status: "pending" as const,
         title: "Publish executive report",
         detail: "Publish enterprise risk profile update for leadership oversight.",
         time: "Pending",
         confidence: "—",
         source: "Boards / reporting",
       },
     ],
     []
   );
 
   const receiptModel: ReceiptModel = useMemo(
     () => ({
       id: "GCT-2031",
      title: "Enterprise posture updated — GCT-2031",
       summary: [
        "Entity hierarchy modeled as a live operating map (Entities).",
        "Third-party engagements linked to entity nodes to prevent orphaned exposure (TPM).",
        "State change triggered node-level recalculation and enterprise roll-up (Risk Manager).",
        "Notifications and publications are staged for approval to prevent alert fatigue.",
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
 
   const headline = "You have a global compliance signal to review, Sarah.";
   const promptPlaceholder = "What should we review in GCT-2031?";
 
   function openIncidentReview() {
     setHeroPhase("incident_detected");
     if (incidentUiMode === "rail") {
       setDrawerOpen(true);
     } else {
       setInlineOpen(true);
     }
   }
 
   return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="pb-6">
        <PrototypeNav />
      </div>
       {/* Prototype controls (outside the wireframe surface) */}
       <div className="mx-auto w-full max-w-6xl px-6">
         <div className="mb-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
           <div className="flex flex-wrap items-center justify-between gap-3">
             <div className="min-w-0">
               <div className="text-xs font-medium uppercase tracking-wide text-sky-700">Prototype control</div>
               <div className="truncate font-medium text-slate-800">
                 Signal updates appear as: {incidentUiMode === "rail" ? "Right rail" : "Inline report"}
               </div>
               <div className="mt-0.5 text-xs text-slate-500">
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
                     ? "border-slate-900 bg-slate-900 text-white"
                     : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
                     ? "border-slate-900 bg-slate-900 text-white"
                     : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                 )}
               >
                 Inline report
               </button>
             </div>
           </div>
         </div>
       </div>
       <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm relative">
         {/* Top chrome */}
         <div className="border-b border-slate-200 bg-white">
           <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
             <div className="flex items-center gap-3">
               <div className="flex items-center gap-2">
                 <div className="h-8 w-8 rounded-md bg-slate-900" />
                 <span className="text-sm font-semibold text-slate-900">GRC Command Center</span>
               </div>
 
               </div>
 
             <div className="flex items-center gap-2 text-slate-600">
               <div className="relative">
                 <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-slate-900" />
                 <button className="rounded-full border border-slate-200 bg-white p-2 hover:bg-slate-50">
                   <Icon name="bell" className="h-5 w-5" />
                 </button>
               </div>
               <button className="rounded-full border border-slate-200 bg-white p-2 hover:bg-slate-50">
                 <Icon name="dots" className="h-5 w-5" />
               </button>
               <div className="ml-1 h-8 w-8 rounded-full bg-slate-200" />
             </div>
           </div>
         </div>
 
         {/* Hero area */}
         <div className="bg-gradient-to-b from-slate-50 to-white">
           <div className="mx-auto max-w-6xl px-6 py-10">
             <h1 className="text-center text-4xl font-semibold tracking-tight text-slate-800">
               {headline}
             </h1>
 
             {/* Active incident (kept above the prompt) */}
             <div className="mx-auto mt-6 max-w-[860px]">
               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                 <div className="flex items-center justify-between">
                  <div className="text-base font-semibold text-slate-900">
                    Risk-aware digital twin across entities and suppliers
                  </div>
                   <UrgencyBadge level={signals[0].urgency} />
                 </div>
 
                 <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                   <div className="text-sm font-semibold text-slate-900">
                     {signals[0].title}
                   </div>
                   {/* Agent progress preview */}
                   <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-600">
                     <div className="flex items-center gap-3">
                       <div className="font-medium text-slate-700">
                         Agent progress: 5 of 8 steps completed
                       </div>
                       <button
                         onClick={() => {
                           setShowIncidentReceipt(true);
                           setDrawerOpen(false);
                           setInlineOpen(false);
                         }}
                         className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                       >
                         View completed steps
                       </button>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
                         <div className="h-full w-[62%] rounded-full bg-slate-700" />
                       </div>
                       <span className="text-slate-500">≈ 12 min saved</span>
                     </div>
                   </div>
                   <div className="mt-1 text-sm text-slate-600">
                     {signals[0].detail}{" "}
                     <span className="text-slate-500">Case ID:</span>{" "}
                     <span className="font-medium text-slate-700">{signals[0].incidentId}</span>
                   </div>
 
                   <div className="mt-4 flex items-center justify-end gap-2">
                     {(drawerOpen || inlineOpen) ? (
                       <>
                         <span className="text-xs text-slate-500">
                           Reviewing now
                         </span>
                         <button
                           onClick={() => {
                             setDrawerOpen(false);
                             setInlineOpen(false);
                           }}
                           className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                         >
                           Close review
                         </button>
                       </>
                     ) : (
                       <>
                         <GhostButton>Assign</GhostButton>
                         <button
                           onClick={openIncidentReview}
                           className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-100"
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
                 <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                   <div className="flex items-start justify-between gap-3">
                     <div className="min-w-0">
                       <div className="text-xs uppercase tracking-wide text-slate-500">Compliance review</div>
                       <div className="mt-1 text-base font-semibold text-slate-900">
                         Global compliance signal detected (GCT-2031)
                       </div>
                       <div className="mt-1 text-sm text-slate-600">
                         Inline mode keeps you in the main workspace while the agent surfaces what changed.
                       </div>
                     </div>
                     <button
                       onClick={() => setInlineOpen(false)}
                       className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                     >
                       Close
                     </button>
                   </div>
 
                   <div className="mt-5 space-y-6">
                     {/* Reuse the same sections from the rail (lightweight summary) */}
                     <div>
                       <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                         Monitoring briefing
                       </div>
                      <div className="mt-2 text-sm text-slate-800">
                        This workspace represents a living map of your legal structure and external dependencies.
                        When a supplier's state changes, the system updates the impacted entity node,
                        recalculates ripple-up risk to the parent organization, and drafts targeted actions without
                        requiring spreadsheet reconciliation.
                      </div>
                     </div>
 
                     <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                       <div className="text-sm font-semibold text-slate-900">
                         Actions already taken
                       </div>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        <li>✔ Entity hierarchy ingested and modeled as jurisdictional nodes (Entities)</li>
                        <li>✔ Third-party engagements mapped to entity nodes (TPM)</li>
                        <li>✔ Verified state change detected for a linked partner (Sentry)</li>
                        <li>✔ Node impact calculated + enterprise roll-up generated (Contextualist)</li>
                        <li className="flex items-start justify-between gap-3">
                          <span>✔ Risk Event created with executive synthesis draft (Strategist)</span>
                           <button
                             onClick={() => setShowBoardEscalation(true)}
                             className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                           >
                             View
                           </button>
                         </li>
                       </ul>
              <div className="mt-3 text-xs text-slate-500">
                No notifications have been sent and nothing has been published. Pending actions require approval.
              </div>
                     </div>
 
                     <div>
                       <div className="text-sm font-semibold text-slate-900">
                         Decisions needed from you
                       </div>
 
              <div className="mt-3 space-y-3">
                         <div className="rounded-lg border border-slate-200 bg-white p-3">
                           <div className="text-sm font-medium text-slate-800">
                             Notify risk owners
              </div>
                          <div className="mt-1 text-sm text-slate-600">
                            Send targeted notifications tied to the impacted entity node and third-party engagement.
                          </div>
                           <div className="mt-3 flex items-center gap-2">
                             <button
                               onClick={() => setShowNotifyRegulator(true)}
                               className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                             >
                               Notify owners
                             </button>
                            <span className="text-xs text-slate-500">
                              Prevents generic alerts
                            </span>
                           </div>
                         </div>
 
                         <div className="rounded-lg border border-slate-200 bg-white p-3">
                           <div className="text-sm font-medium text-slate-800">
                             Open mitigation plan
                           </div>
                          <div className="mt-1 text-sm text-slate-600">
                            Create governance mitigation tasks linked to the entity/vendor intersection and track progress.
                          </div>
                           <div className="mt-3 flex items-center gap-2">
                             <button
                               onClick={() => setShowCommsPackage(true)}
                               className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                             >
                               Open plan
                             </button>
                            <span className="text-xs text-slate-500">
                              System of work, not record
                            </span>
                           </div>
                         </div>
 
                         <div className="rounded-lg border border-slate-200 bg-white p-3">
                           <div className="text-sm font-medium text-slate-800">
                             Publish executive summary
                           </div>
                          <div className="mt-1 text-sm text-slate-600">
                            Publish an enterprise-level roll-up that highlights the most critical entity-third party intersections.
                          </div>
                           <div className="mt-3 flex items-center gap-2">
                             <button
                               onClick={() => setShowBoardEscalation(true)}
                               className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                             >
                               Publish summary
                             </button>
                            <span className="text-xs text-slate-500">
                              Board-ready language
                            </span>
                           </div>
                         </div>
                       </div>
                     </div>
 
                     {/* Prompt (contextual to the incident) */}
                     <div className="rounded-xl border border-slate-200 bg-white p-4">
                       <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                         Ask about this signal
                       </div>
                       <div className="mt-2">
                         <PromptComposer
                           placeholder="Ask a follow-up about GCT-2031..."
                           contextLabel="GCT-2031"
                           dock="rail"
                         />
                       </div>
                     </div>
 
                     <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                       <div className="text-sm font-medium text-slate-900">Monitoring</div>
                       <div className="mt-1 text-sm text-slate-600">
                         I’ll provide updates <strong>hourly</strong> and immediately as new information becomes available.
                       </div>
                       <div className="mt-3 flex items-center justify-end">
                         <button
                           onClick={() => setInlineOpen(false)}
                           className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
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
                   <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                     <div className="text-lg font-semibold text-slate-900">Recent Apps</div>
 
                     <div className="mt-4 space-y-3">
                       <RecentAppRow
                         icon="building"
                         label="Entities"
                         detail="Reviewed entity hierarchy and jurisdictional nodes."
                       />
                       <RecentAppRow
                         icon="search"
                         label="TPM"
                         detail="Validated third-party engagement mapping to entity nodes."
                       />
                       <RecentAppRow
                         icon="shield"
                         label="Risk Manager"
                         detail="Created risk event and updated enterprise profile."
                       />
                       <RecentAppRow
                         icon="spark"
                         label="Boards"
                         detail="Prepared executive synthesis draft."
                       />
                     </div>
                   </div>
                 </div>
 
                 {/* Small, unobtrusive prototype note */}
                 <div className="mx-auto mt-6 max-w-[1100px] text-xs text-slate-500">
                   Prototype note: This grayscale surface is a staging area for the Global Compliance Tracking hero flow (agent timeline, reasoning, controls, receipt).
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
           title="Global compliance signal detected (GCT-2031)"
           onClose={() => setDrawerOpen(false)}
         >
           <div className="space-y-6">
 
             {/* Incident briefing */}
             <div>
               <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                 Monitoring briefing
               </div>
              <div className="mt-2 text-sm text-slate-800">
                This workspace represents a living map of your legal structure and external dependencies.
                When a supplier's state changes, the system updates the impacted entity node,
                recalculates ripple-up risk to the parent organization, and drafts targeted actions without
                requiring spreadsheet reconciliation.
              </div>
             </div>
 
             {/* Actions already taken */}
             <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
               <div className="text-sm font-semibold text-slate-900">
                 Actions already taken
               </div>
 
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>✔ Entity hierarchy ingested and modeled as jurisdictional nodes (Entities)</li>
                <li>✔ Third-party engagements mapped to entity nodes (TPM)</li>
                <li>✔ Verified state change detected for a linked partner (Sentry)</li>
                <li>✔ Node impact calculated + enterprise roll-up generated (Contextualist)</li>
                <li className="flex items-start justify-between gap-3">
                  <span>✔ Risk Event created with executive synthesis draft (Strategist)</span>
                   <button
                     onClick={() => {
                       setShowBoardEscalation(true);
                       setDrawerOpen(false);
                     }}
                     className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                   >
                     View
                   </button>
                 </li>
               </ul>
 
             <div className="mt-3 text-xs text-slate-500">
                 No notifications have been sent and nothing has been published. Pending actions require approval.
               </div>
               <div className="mt-3 flex items-center justify-end">
                 <button
                   onClick={() => {
                     setShowIncidentReceipt(true);
                     setDrawerOpen(false);
                     setInlineOpen(false);
                   }}
                   className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                 >
                   View completed steps (receipt)
                 </button>
               </div>
             </div>
 
             {/* Decisions needed */}
             <div>
               <div className="text-sm font-semibold text-slate-900">
                 Decisions needed from you
               </div>
 
             <div className="mt-3 space-y-3">
                 <div className="rounded-lg border border-slate-200 bg-white p-3">
                   <div className="text-sm font-medium text-slate-800">
                     Notify risk owners
                   </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Send targeted notifications tied to the impacted entity node and third-party engagement.
                  </div>
                   <div className="mt-3 flex items-center gap-2">
                     <button
                       onClick={() => {
                         setShowNotifyRegulator(true);
                         setDrawerOpen(false);
                       }}
                       className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                     >
                       Notify owners
                     </button>
                    <span className="text-xs text-slate-500">
                      Prevents generic alerts
                    </span>
                   </div>
                 </div>
 
                 <div className="rounded-lg border border-slate-200 bg-white p-3">
                   <div className="text-sm font-medium text-slate-800">
                     Open mitigation plan
                   </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Create governance mitigation tasks linked to the entity/vendor intersection and track progress.
                  </div>
                   <div className="mt-3 flex items-center gap-2">
                     <button
                       onClick={() => {
                         setShowCommsPackage(true);
                         setDrawerOpen(false);
                       }}
                       className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                     >
                       Open plan
                     </button>
                    <span className="text-xs text-slate-500">
                      System of work, not record
                    </span>
                   </div>
                 </div>
 
                 <div className="rounded-lg border border-slate-200 bg-white p-3">
                   <div className="text-sm font-medium text-slate-800">
                     Publish executive summary
                   </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Publish an enterprise-level roll-up that highlights the most critical entity-third party intersections.
                  </div>
                   <div className="mt-3 flex items-center gap-2">
                     <button
                       onClick={() => {
                         setShowBoardEscalation(true);
                         setDrawerOpen(false);
                       }}
                       className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                     >
                       Publish summary
                     </button>
                    <span className="text-xs text-slate-500">
                      Board-ready language
                    </span>
                   </div>
                 </div>
               </div>
             </div>
 
             {/* Guidance */}
             <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
               I will continue monitoring and preparing recommended actions.  
               No notifications or publications will occur until you approve next steps.
             </div>
             <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
               <div className="text-sm font-medium text-slate-900">Monitoring</div>
               <div className="mt-1 text-sm text-slate-600">
                 I’ll provide updates <strong>hourly</strong> and immediately as new information becomes available.
               </div>
               <div className="mt-3 flex items-center justify-end">
                 <button
                   onClick={() => {
                     setDrawerOpen(false);
                     setInlineOpen(false);
                   }}
                   className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
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
               <div className="border-b border-slate-200 px-6 py-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <div className="text-xs uppercase tracking-wide text-slate-500">
                       Enterprise Risk Profile
                     </div>
                     <div className="text-lg font-semibold text-slate-900">
                       Enterprise update — GCT-2031
                     </div>
                   </div>
                   <button
                     onClick={() => setShowBoardEscalation(false)}
                     className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                   >
                     Exit
                   </button>
                 </div>
               </div>
 
               {/* Content */}
               <div className="mx-auto max-w-[900px] px-6 py-8 space-y-8">
                 {/* Context */}
                 <section>
                   <h2 className="text-sm font-semibold text-slate-900">
                     What leadership needs to know
                   </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    This is a roll-up view across the organizational ecosystem. It highlights where third-party changes
                    intersect with critical entity nodes, and translates compliance signals into strategic enterprise risk.
                  </p>
                 </section>
 
                 {/* Draft message */}
                 <section>
                   <h3 className="text-sm font-semibold text-slate-900">
                     Draft enterprise update
                   </h3>
 
                   {/* Light formatting toolbar (visual only) */}
                   <div className="mt-3 flex flex-wrap items-center gap-2 rounded-t-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                     <span className="font-medium text-slate-700">Formatting</span>
                     <span className="text-slate-300">|</span>
                     <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">B</button>
                     <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50 italic">I</button>
                     <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">• List</button>
                     <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">Link</button>
                     <span className="text-slate-400">(visual only)</span>
                   </div>
 
                   {/* Editable-looking body */}
                   <div className="rounded-b-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-700">
                     <div className="space-y-2">
                       <p><strong>Summary of change:</strong> A monitored third-party linked to a regional subsidiary changed state, triggering enterprise risk recalculation.</p>
                       <p><strong>Impacted entity node + jurisdiction:</strong> Regional subsidiary node in LATAM (regulated jurisdiction).</p>
                       <p><strong>Linked third party + engagement:</strong> Critical logistics provider with active fulfillment contract.</p>
                       <p><strong>Ripple-up impact (why it matters to enterprise):</strong> Disruption increases enterprise supply risk and impacts revenue continuity planning.</p>
                       <p><strong>Recommended mitigation steps:</strong> Notify owners, open mitigation tracking, and confirm regulatory exposure.</p>
                     </div>
                   </div>
 
                   {/* Prompt-to-revise */}
                   <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                     <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                       Ask the agent to revise
                     </div>
                     <div className="mt-2 flex items-center gap-2">
                       <input
                         className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400"
                         placeholder="e.g., make this shorter, emphasize enterprise impact, add mitigation detail"
                       />
                       <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
                         Apply
                       </button>
                     </div>
                     <div className="mt-2 text-xs text-slate-500">
                       This is a prototype — the “Apply” action is illustrative.
                     </div>
                   </div>
                 </section>
 
                 {/* Recipients */}
                 <section>
                   <h3 className="text-sm font-semibold text-slate-900">
                     Recipients
                   </h3>
                   <div className="mt-3 space-y-2 text-sm text-slate-700">
                     <div>✔ Enterprise leadership (12)</div>
                     <div>✔ Regional risk owners (6)</div>
                     <div>✔ General Counsel (included)</div>
                   </div>
                 </section>
 
                 {/* Actions */}
                 <section className="flex items-center justify-between border-t border-slate-200 pt-6">
                   <div className="text-xs text-slate-500">
                     Nothing will be published without your approval.
                   </div>
                   <div className="flex gap-3">
                     <button
                       onClick={() => setShowBoardEscalation(false)}
                       className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                     >
                       Cancel
                     </button>
                     <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                       Publish summary
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
               <div className="border-b border-slate-200 px-6 py-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <div className="text-xs uppercase tracking-wide text-slate-500">
                       Notify Risk Owners
                     </div>
                     <div className="text-lg font-semibold text-slate-900">
                       Draft notification — GCT-2031
                     </div>
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
                   <h2 className="text-sm font-semibold text-slate-900">
                     Draft (review required)
                   </h2>
                   <p className="mt-2 text-sm text-slate-600">
                     This draft is context-aware and targeted to risk owners directly responsible for the impacted entity/third party intersection.
                     Review is required before sending.
                   </p>
                 </section>
 
                 <section>
                   <h3 className="text-sm font-semibold text-slate-900">
                     Draft Notification
                   </h3>
 
                   {/* Light formatting toolbar (visual only) */}
                   <div className="mt-3 flex flex-wrap items-center gap-2 rounded-t-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                     <span className="font-medium text-slate-700">Formatting</span>
                     <span className="text-slate-300">|</span>
                     <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">B</button>
                     <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50 italic">I</button>
                     <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">• List</button>
                     <button className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50">Link</button>
                     <span className="text-slate-400">(visual only)</span>
                   </div>
 
                   {/* Editable-looking body */}
                   <div className="rounded-b-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-700">
                     <div className="space-y-2">
                       <p><strong>Why you’re receiving this:</strong> You own risk coverage for the impacted entity/vendor engagement.</p>
                       <p><strong>What changed:</strong> A third-party state change (sanction / credit / disruption) was detected.</p>
                       <p><strong>Impacted entity + jurisdiction:</strong> Regional subsidiary node within a regulated jurisdiction.</p>
                       <p><strong>Immediate impact:</strong> Enterprise risk posture recalculated; ripple-up impact recorded in Risk Manager.</p>
                       <p><strong>Requested action:</strong> Review the draft mitigation plan and confirm next steps.</p>
                     </div>
                     <div className="mt-4 text-xs text-slate-500">
                       Recipients are limited to verified owners for this entity/vendor intersection.
                     </div>
                   </div>
 
                   {/* Prompt-to-revise */}
                   <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                     <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                       Ask the agent to revise
                     </div>
                     <div className="mt-2 flex items-center gap-2">
                       <input
                         className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400"
                         placeholder="e.g., shorten, clarify impact, add due dates"
                       />
                       <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
                         Apply
                       </button>
                     </div>
                     <div className="mt-2 text-xs text-slate-500">
                       This is a prototype — the “Apply” action is illustrative.
                     </div>
                   </div>
                 </section>
 
                 <section>
                   <h3 className="text-sm font-semibold text-slate-900">
                     Review checklist
                   </h3>
                   <div className="mt-3 space-y-2 text-sm text-slate-700">
                     <div>• Verified owner list (targeted recipients only)</div>
                     <div>• Confirmed high-impact change and evidence</div>
                     <div>• Confirmed enterprise ripple-up summary</div>
                     <div>• Confirmed timing and priority for follow-up</div>
                   </div>
                 </section>
 
                 <section className="flex items-center justify-between border-t border-slate-200 pt-6">
                   <div className="text-xs text-slate-500">
                     Nothing will be sent without your approval.
                   </div>
                   <div className="flex gap-3">
                     <button
                       onClick={() => setShowNotifyRegulator(false)}
                       className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                     >
                       Cancel
                     </button>
                     <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                       Approve &amp; Send
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
               <div className="border-b border-slate-200 px-6 py-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <div className="text-xs uppercase tracking-wide text-slate-500">
                       Mitigation Plan
                     </div>
                     <div className="text-lg font-semibold text-slate-900">
                       Mitigation tasks + tracking — GCT-2031
                     </div>
                   </div>
                   <button
                     onClick={() => setShowCommsPackage(false)}
                     className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                   >
                     Exit
                   </button>
                 </div>
               </div>
 
               <div className="mx-auto max-w-[950px] px-6 py-8 space-y-8">
                 <section>
                   <h2 className="text-sm font-semibold text-slate-900">
                     What’s included
                   </h2>
                   <p className="mt-2 text-sm text-slate-600">
                     This plan creates governance tasks (not technical fixes), tracking reminders, and evidence requests
                     for the impacted entity/vendor intersection.
                   </p>
                 </section>
 
                 {/* Governance tasks */}
                 <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                   <div className="flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-slate-900">Governance tasks (draft)</h3>
                     <span className="text-xs text-slate-500">Owner: Risk Manager</span>
                   </div>
                   <div className="mt-3 space-y-2 text-sm text-slate-700">
                     <p><strong>Task:</strong> Validate entity/vendor risk classification and confirm primary owners.</p>
                     <p><strong>Task:</strong> Review contract obligations and jurisdictional compliance requirements.</p>
                     <p><strong>Task:</strong> Document current exposure and dependencies at the entity level.</p>
                   </div>
                 </section>
 
                 {/* Tracking reminders */}
                 <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                   <div className="flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-slate-900">Tracking reminders (draft)</h3>
                     <span className="text-xs text-slate-500">Cadence: Weekly</span>
                   </div>
                   <div className="mt-3 space-y-2 text-sm text-slate-700">
                     <p><strong>Reminder:</strong> Confirm status updates from the third party and regional subsidiary.</p>
                     <p><strong>Reminder:</strong> Track mitigation progress against enterprise risk thresholds.</p>
                   </div>
                 </section>
 
                 {/* Evidence requests */}
                 <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                   <div className="flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-slate-900">Evidence requests (draft)</h3>
                     <span className="text-xs text-slate-500">Source: Entity owners</span>
                   </div>
                   <div className="mt-3 space-y-2 text-sm text-slate-700">
                     <p><strong>Request:</strong> Updated compliance attestation from the third party.</p>
                     <p><strong>Request:</strong> Entity-level risk acceptance or mitigation plan confirmation.</p>
                   </div>
                 </section>
 
                 <section className="flex items-center justify-between border-t border-slate-200 pt-6">
                   <div className="text-xs text-slate-500">
                     Nothing will be created without your approval.
                   </div>
                   <div className="flex gap-3">
                     <button
                       onClick={() => setShowCommsPackage(false)}
                       className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                     >
                       Close
                     </button>
                     <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                       Create mitigation plan
                     </button>
                   </div>
                 </section>
               </div>
             </div>
           </div>
         )}
 
        {/* Assign Risk Owner (Full-Page) */}
         {showAssignOwner && (
           <div className="absolute inset-0 z-50 bg-white">
             <div className="h-full overflow-y-auto">
               {/* Header */}
               <div className="border-b border-slate-200 px-6 py-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <div className="text-xs uppercase tracking-wide text-slate-500">
                      Assign Risk Owner
                     </div>
                     <div className="text-lg font-semibold text-slate-900">
                      Primary owner — GCT-2031
                     </div>
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
                   <h2 className="text-sm font-semibold text-slate-900">
                     Suggested owners
                   </h2>
                   <p className="mt-2 text-sm text-slate-600">
                    The agent suggests owners based on role, availability, and prior risk events. You can pick one or add someone else.
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
                           ? "border-slate-400 bg-slate-50"
                           : "border-slate-200 bg-white hover:bg-slate-50"
                       )}
                     >
                       <div className="flex items-center justify-between gap-3">
                         <div className="text-sm font-medium text-slate-900">{name}</div>
                         <span
                           className={cn(
                             "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                             selectedOwner === name ? "border-slate-900" : "border-slate-300"
                           )}
                         >
                           {selectedOwner === name ? (
                             <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                           ) : null}
                         </span>
                       </div>
                       <div className="mt-1 text-sm text-slate-600">
                         Primary coordinator for follow-ups, assignments, and stakeholder updates.
                       </div>
                     </button>
                   ))}
                 </section>
 
                 <section className="rounded-xl border border-slate-200 bg-white p-5">
                   <h3 className="text-sm font-semibold text-slate-900">
                     Add someone else
                   </h3>
                   <div className="mt-3 flex items-center gap-2">
                     <input
                       className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400"
                       placeholder="Type a name or role (e.g., 'CISO', 'Security Lead')"
                     />
                     <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                       Add
                     </button>
                   </div>
                   <div className="mt-2 text-xs text-slate-500">
                     Prototype note: selection and search are illustrative.
                   </div>
                 </section>
 
                 <section className="flex items-center justify-between border-t border-slate-200 pt-6">
                   <div className="text-xs text-slate-500">
                     Assigning an owner records accountability and enables automated follow-ups.
                   </div>
                   <div className="flex gap-3">
                     <button
                       onClick={() => setShowAssignOwner(false)}
                       className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                     >
                       Cancel
                     </button>
                     <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
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
     <button className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left hover:bg-slate-50">
       <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
         <Icon name={icon} className="h-5 w-5" />
       </div>
       <div className="min-w-0">
         <div className="text-sm font-medium text-slate-800">{label}</div>
         <div className="mt-0.5 text-xs text-slate-500">{detail}</div>
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
   return (
     <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm")}>
       {contextLabel ? (
         <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
           <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
             Prompting in context
           </div>
           <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
             <span className="font-medium">{contextLabel}</span>
           </div>
         </div>
       ) : null}
 
       <div className="p-4">
         <div className="flex items-center gap-3">
           <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
             <Icon name="paperclip" className="h-5 w-5" />
           </button>
 
           <div className="flex-1">
             <div className="text-sm text-slate-400">{placeholder}</div>
             <div className="mt-1 h-5 w-full rounded bg-slate-50" />
           </div>
 
           <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
             <Icon name="mic" className="h-5 w-5" />
           </button>
           <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-900 text-white hover:bg-slate-800">
             <Icon name="send" className="h-5 w-5" />
           </button>
         </div>
 
         {dock === "main" ? (
           <>
             <div className="mt-4 flex flex-wrap justify-center gap-3">
               <PillButton icon={<span className="text-base">＋</span>} label="Show ripple-up impact" />
               <PillButton icon={<Icon name="search" className="h-4 w-4" />} label="View entity map" />
               <PillButton icon={<Icon name="shield" className="h-4 w-4" />} label="Draft board-ready summary" />
               <PillButton icon={<Icon name="spark" className="h-4 w-4" />} label="Show unresolved risk events" />
             </div>
 
             <div className="mt-4 text-center text-xs text-slate-500">
               AI-generated content may have inaccuracies.{" "}
               <span className="underline decoration-slate-300 underline-offset-2">Learn more</span>
             </div>
           </>
         ) : (
           <div className="mt-3 text-xs text-slate-500">
             Ask follow-up questions about this signal without leaving the review panel.
           </div>
         )}
       </div>
     </div>
   );
 }
