// REPLACEMENT BEGINS
"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  MoreVertical,
  Sparkles,
  Upload,
  Folder,
  FileUp,
  Cloud,
  Bookmark,
  CheckCircle2,
  ShieldAlert,
  Wand2,
  Plus,
  Layers,
} from "lucide-react";

/* ---------- Reused primitives (match your existing context-assist styling) ---------- */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
};

function Button({
  variant = "default",
  size = "default",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-slate-700 text-white hover:bg-slate-600",
    outline: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  } as const;
  const sizes = {
    default: "h-10 px-4",
    sm: "h-9 px-3 text-xs rounded-lg",
    icon: "h-9 w-9 p-0 rounded-lg",
  } as const;

  return (
    <button
      className={[base, variants[variant], sizes[size], className].join(" ")}
      disabled={disabled}
      {...props}
    />
  );
}

function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200 bg-white text-slate-900",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

function Separator({ className = "" }: { className?: string }) {
  return <div className={["h-px w-full bg-slate-200", className].join(" ")} />;
}

function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full border border-slate-300 transition",
        checked ? "bg-slate-700" : "bg-slate-200",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-5 w-5 transform rounded-full bg-white transition",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}

function MenuItem({
  children,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
    >
      {icon ? <span className="text-slate-500">{icon}</span> : null}
      {children}
    </button>
  );
}

function CoachRow({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-900">{title}</div>
          <div className="mt-1 text-xs text-slate-600">{body}</div>
        </div>
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

function WorkRow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-4 py-3">
        <CheckCircle2 className="h-4 w-4 text-slate-600" />
        <div className="text-sm font-medium text-slate-900">{title}</div>
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function TopTab({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "pb-3 text-sm font-medium transition",
        active
          ? "text-slate-900 border-b-2 border-slate-700"
          : "text-slate-500 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ---------- Prototype ---------- */

type Mode = "coach" | "agent";
type BuilderState = "idle" | "working" | "done";
type AssistPlacement = "panel" | "footer";
type AssistEntry = "nudge" | "button";

export default function ContextAssistSmartBuilderPage() {
  // Simulated work signals
  const [manualCount, setManualCount] = useState(0);
  const [tabsCount, setTabsCount] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  // UI state
  const [activeTopTab, setActiveTopTab] = useState<"build" | "agenda" | "review">(
    "build"
  );
  const [openUploadMenu, setOpenUploadMenu] = useState(false);

  // Assist
  const [mode, setMode] = useState<Mode>("coach");
  const [assistPlacement, setAssistPlacement] = useState<AssistPlacement>(
    "panel"
  );
  const [showNudge, setShowNudge] = useState(false);
  const [dismissedNudge, setDismissedNudge] = useState(false);
  const [showAssist, setShowAssist] = useState(false);
  const [assistEntry, setAssistEntry] = useState<AssistEntry>("nudge");
  const [builderState, setBuilderState] = useState<BuilderState>("idle");

  const threshold = 4; // demo threshold

  const detectedSignals = useMemo(() => {
    const signals: string[] = [];
    if (manualCount >= 2) signals.push("Multiple manual uploads");
    if (tabsCount >= 2) signals.push("Tabs created manually");
    if (uploadedDocs.length >= 3) signals.push("Materials coming from mixed sources");
    if (activeTopTab === "build") signals.push("Still in Build book");
    return signals;
  }, [manualCount, tabsCount, uploadedDocs.length, activeTopTab]);

  const bumpManual = (label: string) => {
    setManualCount((c) => {
      const next = c + 1;
      if (next >= threshold) setShowNudge(true);
      return next;
    });
    setUploadedDocs((d) => [...d, label]);
  };

  const addTab = () => {
    setTabsCount((c) => {
      const next = c + 1;
      setManualCount((m) => {
        const nm = m + 1;
        if (nm >= threshold) setShowNudge(true);
        return nm;
      });
      return next;
    });
  };

  const openAssistFromNudge = async () => {
    setAssistEntry("nudge");
    setAssistPlacement("panel");
    setShowAssist(true);
    if (mode === "agent") {
      setBuilderState("working");
      await sleep(1200);
      setBuilderState("done");
    } else {
      setBuilderState("idle");
    }
  };

  const openAssistFromButton = () => {
    // Intent already expressed — keep this neutral.
    setAssistEntry("button");
    setAssistPlacement("panel");
    setBuilderState("idle");
    setShowAssist(true);
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] w-full bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
        {/* Prototype framing banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                What you’re about to see
              </div>
              <p className="mt-1 text-sm text-slate-600">
                A wireframe of the <span className="font-medium">Book editor → Build book</span>{" "}
                surface. As the admin assembles a book manually, the system notices and nudges
                <span className="font-medium"> Smart Book Builder</span> contextually.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Coach</span>
                <Switch
                  checked={mode === "agent"}
                  onCheckedChange={(v) => setMode(v ? "agent" : "coach")}
                />
                <span className="text-xs text-slate-500">Agent</span>
              </div>

              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setAssistPlacement("panel")}
                  className={[
                    "rounded-full px-3 py-1 text-xs font-medium transition",
                    assistPlacement === "panel"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900",
                  ].join(" ")}
                >
                  Right panel
                </button>
                <button
                  type="button"
                  onClick={() => setAssistPlacement("footer")}
                  className={[
                    "rounded-full px-3 py-1 text-xs font-medium transition",
                    assistPlacement === "footer"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900",
                  ].join(" ")}
                >
                  Sticky footer
                </button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Book editor shell */}
        <Card className="overflow-visible p-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="min-w-0">
              <div className="text-sm text-slate-500">Book editor</div>
              <div className="mt-1 truncate text-lg font-semibold">Q1 Avore Book</div>
              <div className="mt-1 text-sm text-slate-600">Meeting: January 8, 2026</div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {/* Publish belongs in header (end of workflow) */}
              <Button className="rounded-xl">Publish book</Button>
              <Button variant="ghost" size="icon" aria-label="More">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Top tabs */}
          <div className="px-6">
            <div className="flex items-center gap-6 pt-3">
              <TopTab active={activeTopTab === "build"} onClick={() => setActiveTopTab("build")}>
                Build book
              </TopTab>
              <TopTab active={activeTopTab === "agenda"} onClick={() => setActiveTopTab("agenda")}>
                Build agenda
              </TopTab>
              <TopTab active={activeTopTab === "review"} onClick={() => setActiveTopTab("review")}>
                Review book
              </TopTab>
            </div>
          </div>

          <Separator className="mt-3" />

          {/* Build book controls */}
          <div className="flex items-center justify-between gap-3 px-6 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="gap-2" onClick={addTab}>
                <Plus className="h-4 w-4 text-slate-500" />
                Add tab
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => bumpManual("Auto agenda prompt")}
              >
                <Sparkles className="h-4 w-4 text-slate-500" />
                Add auto agenda
              </Button>

              {/* Smart Builder belongs in the build toolbar (start/middle of workflow). */}
              <Button
                variant="outline"
                className="gap-2"
                onClick={openAssistFromButton}
              >
                <Wand2 className="h-4 w-4 text-slate-500" />
                Smart Builder
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => {
                // quick shortcut to make demo easier
                setManualCount(threshold);
                setShowNudge(true);
                setDismissedNudge(false);
                setUploadedDocs((d) => (d.length ? d : ["Upload documents", "Import folder", "Google Drive"]));
              }}
            >
              <Layers className="h-4 w-4" />
              Simulate “busy admin”
            </Button>
          </div>

          {/* Canvas */}
          <div className="px-6 pb-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {/* Tab card */}
              <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">⋮⋮</span>
                    <div>
                      <div className="text-xs text-slate-500">Tab 1</div>
                      <div className="text-sm font-semibold text-slate-900">Tab 1</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" aria-label="Tab options">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Add file">
                      <FileUp className="h-4 w-4" />
                    </Button>

                    {/* Upload dropdown */}
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setOpenUploadMenu((v) => !v)}
                      >
                        <Upload className="h-4 w-4 text-slate-500" />
                        Upload
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      </Button>

                      <AnimatePresence>
                        {openUploadMenu && (
                          <>
                            <button
                              aria-label="Close upload menu backdrop"
                              className="fixed inset-0 z-40 cursor-default"
                              onClick={() => setOpenUploadMenu(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              transition={{ duration: 0.14 }}
                              className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                            >
                              <MenuItem
                                icon={<Folder className="h-4 w-4" />}
                                onClick={() => {
                                  setOpenUploadMenu(false);
                                  bumpManual("Import folder");
                                }}
                              >
                                Import folder
                              </MenuItem>

                              <MenuItem
                                icon={<FileUp className="h-4 w-4" />}
                                onClick={() => {
                                  setOpenUploadMenu(false);
                                  bumpManual("Upload documents");
                                }}
                              >
                                Upload documents
                              </MenuItem>

                              <MenuItem
                                icon={<Cloud className="h-4 w-4" />}
                                onClick={() => {
                                  setOpenUploadMenu(false);
                                  bumpManual("Upload from Google Drive");
                                }}
                              >
                                Upload documents from Google Drive
                              </MenuItem>

                              <MenuItem
                                icon={<Bookmark className="h-4 w-4" />}
                                onClick={() => {
                                  setOpenUploadMenu(false);
                                  bumpManual("Import bookmarked PDF");
                                }}
                              >
                                Import bookmarked PDF
                              </MenuItem>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button variant="ghost" size="icon" aria-label="More">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Drop zone */}
                <div className="p-4">
                  <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4">
                    <div className="text-sm text-slate-600">Drop files here or select source</div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setOpenUploadMenu(true)}
                      >
                        <Upload className="h-4 w-4 text-slate-500" />
                        Upload
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      </Button>
                    </div>
                  </div>

                  {/* Sticky nudge anchored where the work happens */}
                  <AnimatePresence>
                    {showNudge && !dismissedNudge && !showAssist && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.16 }}
                        className="mt-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={openAssistFromNudge}
                            className="flex min-w-0 items-start gap-2 text-left"
                          >
                            <Sparkles className="mt-0.5 h-4 w-4 text-indigo-600" />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-indigo-900">
                                Looks like you’re assembling manually — Smart Book Builder can draft tabs + place materials.
                              </div>
                              <div className="mt-1 text-xs text-indigo-900/70">
                                Estimated time saved: ~45–90 mins (and fewer missing sections).
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            className="shrink-0 text-xs text-indigo-900/60 hover:text-indigo-900"
                            onClick={() => setDismissedNudge(true)}
                          >
                            Dismiss
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-slate-500">
                      Manual assembly signals: <span className="font-medium text-slate-700">{manualCount}</span>
                      {" "}• Tabs: <span className="font-medium text-slate-700">{tabsCount}</span>
                      {" "}• Uploaded items: <span className="font-medium text-slate-700">{uploadedDocs.length}</span>
                    </div>
                  </div>

                  {uploadedDocs.length > 0 && (
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-medium text-slate-700">Recent manual actions</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {uploadedDocs.slice(-4).map((x, idx) => (
                          <span
                            key={`${x}-${idx}`}
                            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
                          >
                            {x}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Assist surface (right panel or sticky footer) */}
        <AnimatePresence>
          {showAssist && assistPlacement === "panel" && (
            <motion.aside
              key="assist-panel"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.18 }}
              className="fixed right-4 top-24 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white shadow-lg"
              role="dialog"
              aria-modal="false"
              aria-label="Context assist"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">
                    {assistEntry === "button" ? "Smart Book Builder" : mode === "agent" ? (builderState === "done" ? "Smart Book Builder is ready" : builderState === "working" ? "Building your book…" : "Let me assemble this for you") : "Smart Book Builder can help here"}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {assistEntry === "button"
                      ? "(Placeholder) This is where the builder would open."
                      : mode === "agent"
                      ? builderState === "done"
                        ? "I prepared a draft structure for review."
                        : "I can draft tabs, place materials, and create agenda links based on your recent actions."
                      : "You’re assembling manually. Most admins switch here to reduce repetitive uploads and rework."}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close"
                  onClick={() => {
                    setShowAssist(false);
                    setBuilderState("idle");
                  }}
                >
                  <span className="text-lg leading-none">×</span>
                </Button>
              </div>

              <div className="max-h-[calc(100vh-9rem)] overflow-auto px-4 py-4">
                {assistEntry !== "button" && mode === "agent" && builderState === "working" && (
                  <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="h-2 w-2 rounded-full bg-slate-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                      />
                      <motion.div
                        className="h-2 w-2 rounded-full bg-slate-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.div
                        className="h-2 w-2 rounded-full bg-slate-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: 0.3 }}
                      />
                      <div className="text-xs text-slate-600">
                        Drafting structure • placing materials • preparing agenda links…
                      </div>
                    </div>
                  </div>
                )}

                {assistEntry !== "button" && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white">
                        <ShieldAlert className="h-3.5 w-3.5 text-slate-600" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900">What I noticed</div>
                        <div className="mt-1 text-xs text-slate-600">
                          You’ve done several manual steps that Smart Book Builder can automate.
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {detectedSignals.map((s) => (
                            <span
                              key={s}
                              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {assistEntry === "button" ? (
                  <div className="mt-3">
                    <Button
                      className="w-full gap-2"
                      onClick={() => {
                        setShowAssist(false);
                      }}
                    >
                      <Wand2 className="h-4 w-4" />
                      Open builder
                    </Button>
                    <div className="mt-2 text-xs text-slate-500">
                      This path is intentionally neutral (no persuasion after intent).
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    {mode === "coach" ? (
                      <>
                        <CoachRow
                          title="Draft tabs from your materials"
                          body="Import once, then let the system create the structure and place files."
                          actionLabel="Preview"
                          onAction={() => {}}
                        />
                        <CoachRow
                          title="Auto-link agenda to documents"
                          body="Avoid manual linking from each agenda item to the correct file."
                          actionLabel="Show how"
                          onAction={() => {}}
                        />
                        <CoachRow
                          title="Reduce missing sections"
                          body="Smart Builder flags empty tabs/sections before you publish."
                          actionLabel="Learn"
                          onAction={() => {}}
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAssist(false);
                              setBuilderState("idle");
                            }}
                          >
                            Not now
                          </Button>
                          <Button
                            className="gap-2"
                            onClick={() => {
                              // placeholder for launching the builder
                              setShowAssist(false);
                              setBuilderState("idle");
                            }}
                          >
                            <Wand2 className="h-4 w-4" />
                            Open Smart Builder
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {builderState !== "done" ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowAssist(false);
                                setBuilderState("idle");
                              }}
                            >
                              Not now
                            </Button>
                            <Button
                              className="gap-2"
                              onClick={async () => {
                                setBuilderState("working");
                                await sleep(1200);
                                setBuilderState("done");
                              }}
                            >
                              <Sparkles className="h-4 w-4" />
                              Assemble draft
                            </Button>
                          </div>
                        ) : (
                          <>
                            <WorkRow title="Draft structure created">
                              <div className="text-xs text-slate-600">
                                Tabs created and existing materials placed into the draft structure.
                              </div>
                              <div className="mt-2 text-xs text-slate-600">
                                Estimated time saved:{" "}
                                <span className="font-medium text-slate-700">~45 minutes</span>
                              </div>
                            </WorkRow>

                            <WorkRow title="Agenda links prepared">
                              <div className="text-xs text-slate-600">
                                A suggested mapping of agenda items to materials is ready for review.
                              </div>
                            </WorkRow>

                            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                              <div className="text-xs font-semibold text-amber-900">Action needed</div>
                              <div className="mt-1 text-xs text-amber-900/80">
                                Review before applying changes.
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <Button size="sm">Review draft</Button>
                                <Button variant="outline" size="sm">
                                  Undo
                                </Button>
                              </div>
                              <div className="mt-2 text-xs text-amber-900/70">
                                Note: in “Cautious” mode, changes don’t apply without your review.
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.aside>
          )}

          {showAssist && assistPlacement === "footer" && (
            <motion.div
              key="assist-footer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.18 }}
              className="fixed bottom-4 left-1/2 z-50 w-[900px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white shadow-lg"
              role="dialog"
              aria-modal="false"
              aria-label="Context assist"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {mode === "agent" ? "Want me to assemble a draft?" : "Smart Book Builder can save time here"}
                    </div>
                    <div className="truncate text-xs text-slate-600">
                      {mode === "agent"
                        ? "Draft structure, place materials, prep agenda links — you review before applying."
                        : "You’re doing repeated manual steps. Most admins switch here to avoid rework."}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAssist(false);
                      setBuilderState("idle");
                    }}
                  >
                    Dismiss
                  </Button>

                  {mode === "agent" ? (
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={async () => {
                        setAssistEntry("nudge");
                        setBuilderState("working");
                        await sleep(1200);
                        setBuilderState("done");
                      }}
                    >
                      <Sparkles className="h-4 w-4" />
                      Assemble
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        // Footer stays minimal; Details switches to right panel
                        setAssistPlacement("panel");
                      }}
                    >
                      Details
                    </Button>
                  )}
                </div>
              </div>

              {mode === "agent" && builderState === "done" && (
                <div className="border-t border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-slate-600" />
                    Draft created. Review before applying.
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}