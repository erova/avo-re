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
            href="/now/agentic-hero/security?context=diligent"
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Security Incident
          </a>
          <a
            href="/now/agentic-hero/whistleblower?context=diligent"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-slate-50"
          >
            Whistleblower
          </a>
          <a
            href="/now/agentic-hero/compliance?context=diligent"
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Global Compliance
          </a>
          <a
            href="/now/agentic-hero?context=diligent"
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
             <div className="text-xs text-slate-500">Report review</div>
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
             placeholder="Ask a follow-up about WB-1042..."
             contextLabel="WB-1042"
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
   const [selectedOwner, setSelectedOwner] = useState<string>("Morgan Lee (Investigations)");
   const [incidentUiMode, setIncidentUiMode] = useState<"rail" | "inline">("rail");
   const [inlineOpen, setInlineOpen] = useState(false);
   const [showIncidentReceipt, setShowIncidentReceipt] = useState(false);
 
   const signals: Signal[] = useMemo(
     () => [
       {
         id: "sig-1",
         urgency: "high",
         title: "WHISTLEBLOWER REPORT RECEIVED — AUTO-TRIAGE ACTIVATED",
         detail:
           "Anonymous report received via Vault/SpeakUp alleging retaliation related to a recent HR decision.",
         timeAgo: "14 minutes ago",
         incidentId: "WB-1042",
       },
     ],
     []
   );
 
   const receiptSteps = useMemo(
     () => [
       {
         status: "done" as const,
         title: "Ingested report from Vault/SpeakUp",
         detail: "Created case WB-1042 and preserved reporter anonymity.",
         time: "10:18 ET",
         confidence: "High",
         source: "Vault/SpeakUp ingest",
       },
       {
         status: "done" as const,
         title: "Categorized + routed to stakeholders",
         detail: "HR / retaliation; routed to Legal and Corporate Secretary.",
         time: "10:22 ET",
         confidence: "High",
         source: "Routing policy",
       },
       {
         status: "done" as const,
         title: "Validated against current policy",
         detail: "Matched against Code of Conduct and Anti-Retaliation.",
         time: "10:28 ET",
         confidence: "High",
         source: "Policy Manager",
       },
       {
         status: "done" as const,
         title: "Determined investigation threshold",
         detail: "Meets criteria for formal review; no determination made.",
         time: "10:32 ET",
         confidence: "Medium",
         source: "Triage rubric",
       },
       {
         status: "done" as const,
         title: "Prepared fact-gathering plan",
         detail: "Interview plan drafted; Note-Taker enabled.",
         time: "10:36 ET",
         confidence: "Medium",
         source: "Investigation templates",
       },
       {
         status: "pending" as const,
         title: "Assign investigator",
         detail: "Awaiting assignment approval and conflict check.",
         time: "Pending",
         confidence: "—",
         source: "Your approval",
       },
       {
         status: "pending" as const,
         title: "Request additional information (anonymous-safe)",
         detail: "Draft questions ready for review before outreach.",
         time: "Pending",
         confidence: "—",
         source: "Your approval",
       },
       {
         status: "pending" as const,
         title: "Check Board oversight + conflicts",
         detail: "Verify oversight requirements and conflicts of interest.",
         time: "Pending",
         confidence: "—",
         source: "Your decision",
       },
     ],
     []
   );
 
   const receiptModel: ReceiptModel = useMemo(
     () => ({
       id: "WB-1042",
       title: "Whistleblower report — WB-1042",
       summary: [
         "Anonymous whistleblower report ingested and categorized (HR / retaliation).",
         "Allegations cross-referenced against current policy versions.",
         "Fact-gathering plan prepared; Note-Taker ready for interviews.",
         "No outreach or disclosures have been made. Pending actions require approval.",
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
 
   const headline = "You have a new whistleblower report to review, Sarah.";
   const promptPlaceholder = "What should we review in WB-1042?";
 
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
       <div className="mx-auto w-full max-w-6xl px-1">
         <div className="mb-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
           <div className="flex flex-wrap items-center justify-between gap-3">
             <div className="min-w-0">
               <div className="text-xs font-medium uppercase tracking-wide text-sky-700">Prototype control</div>
               <div className="truncate font-medium text-slate-800">
                 Incident updates appear as: {incidentUiMode === "rail" ? "Right rail" : "Inline report"}
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
                 <span className="text-sm font-semibold text-slate-900">Diligent</span>
               </div>
 
               <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                 <Icon name="grid" className="h-4 w-4 text-slate-500" />
                 <span className="font-medium">Ibotta, Inc.</span>
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
                   <div className="text-base font-semibold text-slate-900">Whistleblower Incident Response</div>
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
                         New report received — 5 of 8 steps completed
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
                       <div className="text-xs uppercase tracking-wide text-slate-500">Report review</div>
                       <div className="mt-1 text-base font-semibold text-slate-900">
                         Whistleblower report received (WB-1042)
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
                         Report briefing
                       </div>
                       <div className="mt-2 text-sm text-slate-800">
                         Anonymous whistleblower report received at <strong>10:18 ET</strong>.
                         Categorized as <strong>HR / retaliation</strong>.
                         Policies validated; no determination made.
                       </div>
                     </div>
 
                     <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                       <div className="text-sm font-semibold text-slate-900">
                         Actions already taken
                       </div>
                       <ul className="mt-3 space-y-2 text-sm text-slate-700">
                         <li>✔ Case created in Vault with anonymity preserved</li>
                         <li>✔ Routed to Legal + Corporate Secretary</li>
                         <li>✔ Policies validated against latest versions</li>
                         <li className="flex items-start justify-between gap-3">
                           <span>✔ Fact-gathering plan prepared (Note-Taker enabled)</span>
                           <button
                             onClick={() => setShowCommsPackage(true)}
                             className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                           >
                             View
                           </button>
                         </li>
                         <li>✔ Investigation threshold assessed</li>
                       </ul>
                       <div className="mt-3 text-xs text-slate-500">
                         Reporter anonymity is preserved. No outreach or disclosures have been made.
                       </div>
                     </div>
 
                     <div>
                       <div className="text-sm font-semibold text-slate-900">
                         Decisions needed from you
                       </div>
 
                       <div className="mt-3 space-y-3">
                         <div className="rounded-lg border border-slate-200 bg-white p-3">
                           <div className="text-sm font-medium text-slate-800">
                             Open formal investigation
                           </div>
                           <div className="mt-1 text-sm text-slate-600">
                             Launch a formal investigation and preserve oversight requirements.
                             General Counsel review is strongly recommended.
                           </div>
                           <div className="mt-3 flex items-center gap-2">
                             <button
                               onClick={() => setShowBoardEscalation(true)}
                               className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                             >
                               Open investigation
                             </button>
                             <span className="text-xs text-slate-500">
                               GC will be included by default
                             </span>
                           </div>
                         </div>
 
                         <div className="rounded-lg border border-slate-200 bg-white p-3">
                           <div className="text-sm font-medium text-slate-800">
                             Request additional information
                           </div>
                           <div className="mt-1 text-sm text-slate-600">
                             Draft anonymous-safe questions for the reporter. Review is required before outreach.
                           </div>
                           <div className="mt-3 flex items-center gap-2">
                             <button
                               onClick={() => setShowNotifyRegulator(true)}
                               className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                             >
                               Draft questions
                             </button>
                             <span className="text-xs text-slate-500">
                               Nothing will be sent without approval
                             </span>
                           </div>
                         </div>
 
                         <div className="rounded-lg border border-slate-200 bg-white p-3">
                           <div className="text-sm font-medium text-slate-800">
                             Assign investigator
                           </div>
                           <div className="mt-1 text-sm text-slate-600">
                             Designate a primary investigator responsible for coordination and follow-up.
                           </div>
                           <div className="mt-3 flex items-center gap-2">
                             <button
                               onClick={() => setShowAssignOwner(true)}
                               className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                             >
                               Assign investigator
                             </button>
                             <span className="text-xs text-slate-500">
                               Suggested investigators included
                             </span>
                           </div>
                         </div>
                       </div>
                     </div>
 
                     {/* Prompt (contextual to the incident) */}
                     <div className="rounded-xl border border-slate-200 bg-white p-4">
                       <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                         Ask about this report
                       </div>
                       <div className="mt-2">
                         <PromptComposer
                           placeholder="Ask a follow-up about WB-1042..."
                           contextLabel="WB-1042"
                           dock="rail"
                         />
                       </div>
                     </div>
 
                     <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                       <div className="text-sm font-medium text-slate-900">Monitoring</div>
                       <div className="mt-1 text-sm text-slate-600">
                         I will provide updates <strong>hourly</strong> and immediately as new information becomes available.
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
                         icon="shield"
                         label="Vault"
                         detail="Last: reviewed anonymous report intake and case WB-1042."
                       />
                       <RecentAppRow
                         icon="search"
                         label="Policy Manager"
                         detail="Last: validated Code of Conduct and Anti-Retaliation policies."
                       />
                       <RecentAppRow
                         icon="building"
                         label="Entities"
                         detail="Last: checked reporting entities and stakeholder routing."
                       />
                       <RecentAppRow
                         icon="spark"
                         label="Boards"
                         detail="Last: prepared oversight notes for potential investigation escalation."
                       />
                     </div>
                   </div>
                 </div>
 
                 {/* Small, unobtrusive prototype note */}
                 <div className="mx-auto mt-6 max-w-[1100px] text-xs text-slate-500">
                   Prototype note: This grayscale surface is a staging area for the Whistleblower Incident Response hero flow (agent timeline, reasoning, controls, receipt).
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
           title="Whistleblower report received (WB-1042)"
           onClose={() => setDrawerOpen(false)}
         >
           <div className="space-y-6">
 
             {/* Incident briefing */}
             <div>
               <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                 Report briefing
               </div>
               <div className="mt-2 text-sm text-slate-800">
                 Anonymous whistleblower report received at <strong>10:18 ET</strong>.
                 Categorized as <strong>HR / retaliation</strong>.
                 Policies validated; no determination made.
               </div>
             </div>
 
             {/* Actions already taken */}
             <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
               <div className="text-sm font-semibold text-slate-900">
                 Actions already taken
               </div>
 
               <ul className="mt-3 space-y-2 text-sm text-slate-700">
                 <li>✔ Case created in Vault with anonymity preserved</li>
                 <li>✔ Routed to Legal + Corporate Secretary</li>
                 <li>✔ Policies validated against latest versions</li>
                 <li className="flex items-start justify-between gap-3">
                   <span>✔ Fact-gathering plan prepared (Note-Taker enabled)</span>
                   <button
                     onClick={() => {
                       setShowCommsPackage(true);
                       setDrawerOpen(false);
                     }}
                     className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                   >
                     View
                   </button>
                 </li>
                 <li>✔ Investigation threshold assessed</li>
               </ul>
 
               <div className="mt-3 text-xs text-slate-500">
                 Reporter anonymity is preserved. No outreach or disclosures have been made.
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
                     Open formal investigation
                   </div>
                   <div className="mt-1 text-sm text-slate-600">
                     Launch a formal investigation and preserve oversight requirements.
                     General Counsel review is strongly recommended.
                   </div>
                   <div className="mt-3 flex items-center gap-2">
                     <button
                       onClick={() => {
                         setShowBoardEscalation(true);
                         setDrawerOpen(false);
                       }}
                       className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                     >
                       Open investigation
                     </button>
                     <span className="text-xs text-slate-500">
                       GC will be included by default
                     </span>
                   </div>
                 </div>
 
                 <div className="rounded-lg border border-slate-200 bg-white p-3">
                   <div className="text-sm font-medium text-slate-800">
                     Request additional information
                   </div>
                   <div className="mt-1 text-sm text-slate-600">
                     Draft anonymous-safe questions for the reporter. Review is required before outreach.
                   </div>
                   <div className="mt-3 flex items-center gap-2">
                     <button
                       onClick={() => {
                         setShowNotifyRegulator(true);
                         setDrawerOpen(false);
                       }}
                       className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                     >
                       Draft questions
                     </button>
                     <span className="text-xs text-slate-500">
                       Nothing will be sent without approval
                     </span>
                   </div>
                 </div>
 
                 <div className="rounded-lg border border-slate-200 bg-white p-3">
                   <div className="text-sm font-medium text-slate-800">
                     Assign investigator
                   </div>
                   <div className="mt-1 text-sm text-slate-600">
                     Designate a primary investigator responsible for coordination and follow-up.
                   </div>
                   <div className="mt-3 flex items-center gap-2">
                     <button
                       onClick={() => {
                         setShowAssignOwner(true);
                         setDrawerOpen(false);
                       }}
                       className="rounded-md border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                     >
                       Assign investigator
                     </button>
                     <span className="text-xs text-slate-500">
                       Suggested investigators included
                     </span>
                   </div>
                 </div>
               </div>
             </div>
 
             {/* Guidance */}
             <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
               I will continue monitoring and preparing recommended actions.  
               No outreach or disclosures will be made until you approve next steps.
             </div>
             <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
               <div className="text-sm font-medium text-slate-900">Monitoring</div>
               <div className="mt-1 text-sm text-slate-600">
                 I will provide updates <strong>hourly</strong> and immediately as new information becomes available.
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
                       Formal Investigation
                     </div>
                     <div className="text-lg font-semibold text-slate-900">
                       Whistleblower Report — WB-1042
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
                     What the investigation should cover
                   </h2>
                   <p className="mt-2 text-sm text-slate-600">
                     This formal investigation summary captures the allegation, potential impact,
                     and the fact-gathering plan. It is written for a cross-functional review.
                   </p>
                 </section>
 
                 {/* Draft message */}
                 <section>
                   <h3 className="text-sm font-semibold text-slate-900">
                     Draft investigation brief
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
                       <p><strong>Summary:</strong> Anonymous report alleges retaliation related to a recent HR decision.</p>
                       <p><strong>Status:</strong> Formal review criteria met. No determination has been made.</p>
                       <p><strong>Actions taken:</strong> Report ingested, policies validated, Legal and Corporate Secretary notified.</p>
                       <p><strong>Next steps:</strong> Assign investigator, request anonymous-safe info, complete oversight checks.</p>
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
                         placeholder="e.g., make this shorter, remove jargon, add a clearer next step"
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
                     <div>✔ General Counsel (included)</div>
                     <div>✔ Corporate Secretary (included)</div>
                     <div>✔ Chief People Officer (included)</div>
                   </div>
                 </section>
 
                 {/* Actions */}
                 <section className="flex items-center justify-between border-t border-slate-200 pt-6">
                   <div className="text-xs text-slate-500">
                     Nothing will be initiated without your approval.
                   </div>
                   <div className="flex gap-3">
                     <button
                       onClick={() => setShowBoardEscalation(false)}
                       className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                     >
                       Cancel
                     </button>
                     <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                       Approve & Start
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
                       Request More Information
                     </div>
                     <div className="text-lg font-semibold text-slate-900">
                       Draft Questions — WB-1042
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
                     These questions are anonymous-safe and aligned to the initial allegation.
                     You can edit before sending. General Counsel review is recommended.
                   </p>
                 </section>
 
                 <section>
                   <h3 className="text-sm font-semibold text-slate-900">
                     Draft questions
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
                       <p><strong>Case reference:</strong> WB-1042</p>
                       <p><strong>Scope:</strong> Please share dates, individuals involved, and any documented communications.</p>
                       <p><strong>Details:</strong> What actions do you believe were retaliatory, and what prompted them?</p>
                       <p><strong>Evidence:</strong> Do you have documents or witnesses we should review?</p>
                       <p><strong>Safety:</strong> Is there any immediate risk to you or others?</p>
                     </div>
                     <div className="mt-4 text-xs text-slate-500">
                       Outreach will remain anonymous and no requests will be sent without approval.
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
                         placeholder="e.g., tighten language, remove leading questions, add timing"
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
                     <div>• Ensure questions are anonymous-safe</div>
                     <div>• Confirm scope aligns with allegation</div>
                     <div>• Avoid leading or retaliatory prompts</div>
                     <div>• Confirm counsel review (recommended)</div>
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
                       Fact Gathering (Note-Taker)
                     </div>
                     <div className="text-lg font-semibold text-slate-900">
                       Interview kit — WB-1042
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
                     The agent prepared a fact-gathering kit for interviews and documentation.
                     Nothing has been sent. Review and approve before use.
                   </p>
                 </section>
 
                 {/* Interview guide */}
                 <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                   <div className="flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-slate-900">Interview guide (draft)</h3>
                     <span className="text-xs text-slate-500">Owner: Investigations</span>
                   </div>
                   <div className="mt-3 space-y-2 text-sm text-slate-700">
                     <p><strong>Focus:</strong> Timeline, decision context, and any retaliatory actions.</p>
                     <p><strong>Approach:</strong> Neutral, non-leading questions; preserve anonymity.</p>
                     <p><strong>Next step:</strong> Assign investigator and schedule interviews.</p>
                   </div>
                 </section>
 
                 {/* Note-taker template */}
                 <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                   <div className="flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-slate-900">Note-taker template (draft)</h3>
                     <span className="text-xs text-slate-500">Tag: Legal, HR</span>
                   </div>
                   <div className="mt-3 space-y-2 text-sm text-slate-700">
                     <p><strong>Sections:</strong> Allegation summary, interview notes, evidence list.</p>
                     <p><strong>Controls:</strong> Access restricted; audit trail enabled.</p>
                   </div>
                 </section>
 
                 {/* Evidence checklist */}
                 <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                   <div className="flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-slate-900">Evidence checklist (draft)</h3>
                     <span className="text-xs text-slate-500">Owner: Compliance</span>
                   </div>
                   <div className="mt-3 space-y-2 text-sm text-slate-700">
                     <p><strong>Items:</strong> HR decision docs, related communications, policy references.</p>
                   </div>
                 </section>
 
                 <section className="flex items-center justify-between border-t border-slate-200 pt-6">
                   <div className="text-xs text-slate-500">
                     Review required before interviews or document requests.
                   </div>
                   <div className="flex gap-3">
                     <button
                       onClick={() => setShowCommsPackage(false)}
                       className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                     >
                       Close
                     </button>
                     <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                       Send to Legal for approval
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
               <div className="border-b border-slate-200 px-6 py-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <div className="text-xs uppercase tracking-wide text-slate-500">
                       Assign Investigator
                     </div>
                     <div className="text-lg font-semibold text-slate-900">
                       Primary investigator — WB-1042
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
                     Suggested investigators
                   </h2>
                   <p className="mt-2 text-sm text-slate-600">
                     The agent suggests investigators based on role, availability, and prior cases. You can pick one or add someone else.
                   </p>
                 </section>
 
                 <section className="space-y-3">
                   {[
                     "Morgan Lee (Investigations)",
                     "Priya Shah (Legal)",
                     "Danielle Kim (HR)",
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
                         Primary investigator for coordination, interviews, and stakeholder updates.
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
                       placeholder="Type a name or role (e.g., 'Ombuds', 'Investigations Lead')"
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
                     Assigning an investigator records accountability and enables automated follow-ups.
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
               <PillButton icon={<span className="text-base">＋</span>} label="Open investigation" />
               <PillButton icon={<Icon name="search" className="h-4 w-4" />} label="Search policies" />
               <PillButton icon={<Icon name="shield" className="h-4 w-4" />} label="Draft board-ready summary" />
               <PillButton icon={<Icon name="spark" className="h-4 w-4" />} label="Show agents needing attention" />
             </div>
 
             <div className="mt-4 text-center text-xs text-slate-500">
               AI-generated content may have inaccuracies.{" "}
               <span className="underline decoration-slate-300 underline-offset-2">Learn more</span>
             </div>
           </>
         ) : (
           <div className="mt-3 text-xs text-slate-500">
             Ask follow-up questions about this report without leaving the review panel.
           </div>
         )}
       </div>
     </div>
   );
 }
