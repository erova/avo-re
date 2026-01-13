"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  MoreVertical,
  Sparkles,
  Download,
  Send,
  CheckCircle2,
  ShieldAlert,
  BookOpen,
  Building2,
  Book,
} from "lucide-react";

type ExportState = "idle" | "exporting" | "done";
type AssistStep = "none" | "ambient" | "panel";

type Book = {
  id: string;
  title: string;
  meetingDate: string;
  status: "Published" | "Custom approvals pending";
  org: string;
};

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

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default: "bg-slate-700 text-white hover:bg-slate-600",
    outline: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    default: "h-10 px-4",
    sm: "h-9 px-3 text-xs rounded-lg",
    icon: "h-9 w-9 p-0 rounded-lg",
  };

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

type BadgeProps = {
  variant?: "outline" | "secondary";
};

function Badge({
  variant = "outline",
  className = "",
  children,
}: {
  variant?: "outline" | "secondary";
  className?: string;
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium";

  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    outline: "border border-slate-300 bg-white text-slate-700",
    secondary: "border border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    <span className={[base, variants[variant], className].join(" ")}>
      {children}
    </span>
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

const booksSeed: Book[] = [
  {
    id: "b1",
    title: "Bluestart Ltd. Board of Directors Meeting",
    meetingDate: "February 12, 2026",
    status: "Custom approvals pending",
    org: "Board of Directors",
  },
  {
    id: "b2",
    title: "Bluestart Global Corporation Board Strategy Meeting",
    meetingDate: "February 11, 2026",
    status: "Published",
    org: "Board of Directors",
  },
];

export default function BoardsExportAssistNowPage() {
  const [expandedOrg, setExpandedOrg] = useState<string>("Board of Directors");
  const [selectedBookId, setSelectedBookId] = useState<string>("b1");
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [assistStep, setAssistStep] = useState<AssistStep>("none");
  const [rememberPreference, setRememberPreference] = useState(true);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  // Archive mode: "agent" (default) or "coach"
  const [archiveMode, setArchiveMode] = useState<"agent" | "coach">("agent");

  // Export mode: "agent" (default) or "coach"
  const [exportMode, setExportMode] = useState<"agent" | "coach">("coach");

  // Export assist modal state
  const [showExportAssist, setShowExportAssist] = useState(false);
  const [exportAssistProgress, setExportAssistProgress] = useState<"creating" | "done">("creating");
  const [showExportAssistDetails, setShowExportAssistDetails] = useState(false);

  // Send to Data Room mode: "agent" or "coach"
  const [sendToDataRoomMode, setSendToDataRoomMode] = useState<"agent" | "coach">(
    "coach"
  );

  // Send to Data Room assist modal state
  const [showSendToDataRoomAssist, setShowSendToDataRoomAssist] = useState(false);
  const [sendToDataRoomProgress, setSendToDataRoomProgress] = useState<"creating" | "done">("creating");
  const [showSendToDataRoomDetails, setShowSendToDataRoomDetails] = useState(false);

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptType, setReceiptType] = useState<"archive" | "export" | null>(
    null
  );

  // NEW: Archive simulation + modal preference + "show our work" state
  const [archiveProgress, setArchiveProgress] = useState<
    "idle" | "archiving" | "done"
  >("idle");
  const [archivedBookId, setArchivedBookId] = useState<string | null>(null);
  const [preferCompactNextTime, setPreferCompactNextTime] = useState(true);
  // Reveal timing for archive details
  const [showArchiveDetails, setShowArchiveDetails] = useState(false);

  const [openDetails, setOpenDetails] = useState({
    archive: true,
    dataRoom: true,
    notify: true,
    minutes: false,
  });
  const [showBoardList, setShowBoardList] = useState(false);
  const [showEAList, setShowEAList] = useState(false);

  // Coaching modal state
  const [showCoachArchive, setShowCoachArchive] = useState(false);
  const [coachArchiveProgress, setCoachArchiveProgress] = useState<"archiving" | "done">("archiving");
  const [showCoachDetails, setShowCoachDetails] = useState(false);

  const handleExport = async (bookId?: string) => {
    if (bookId) setSelectedBookId(bookId);

    setOpenMenuFor(null);

    // Let the action complete. No interruption.
    setExportState("exporting");
    setAssistStep("none");

    await sleep(900);

    setExportState("done");

    // Post-export: wire directly to secure sharing assist
    await sleep(250);
    setAssistStep("none");
    await openExportAssist();
  };

  const openExportAssist = async () => {
    setShowExportAssist(true);
    setExportAssistProgress("creating");
    setShowExportAssistDetails(false);

    // In coach mode: we still show a short "Export complete" + then guidance
    // In agent mode: we simulate creating a secure copy in Data Room automatically
    await sleep(exportMode === "agent" ? 1200 : 700);
    setExportAssistProgress("done");
    await sleep(250);
    setShowExportAssistDetails(true);
  };

  const openSendToDataRoomAssist = async () => {
    setShowSendToDataRoomAssist(true);
    setSendToDataRoomProgress("creating");
    setShowSendToDataRoomDetails(false);

    await sleep(sendToDataRoomMode === "agent" ? 1200 : 700);
    setSendToDataRoomProgress("done");
    await sleep(250);
    setShowSendToDataRoomDetails(true);
  };

  const handleSendToDataRoom = async (bookId?: string) => {
    if (bookId) setSelectedBookId(bookId);
    setOpenMenuFor(null);

    // Wire directly to the assist (demo intent)
    await sleep(200);
    await openSendToDataRoomAssist();
  };

  const handleArchive = async (bookId: string) => {
    setSelectedBookId(bookId);
    setArchivedBookId(bookId);
    setOpenMenuFor(null);

    setReceiptType("archive");
    setShowReceipt(true);

    // Phase 1: Archiving in progress
    setArchiveProgress("archiving");
    setShowArchiveDetails(false);

    // Let the "Archiving…" state breathe
    await sleep(2000);

    // Phase 2: Completed
    setArchiveProgress("done");

    // Small pause before revealing details (feels intentional)
    await sleep(300);
    setShowArchiveDetails(true);
  };

  // Coaching mode handler for Archive (archive happens, guidance does NOT auto-run follow-ups)
  const handleArchiveCoach = async (bookId: string) => {
    setSelectedBookId(bookId);
    setOpenMenuFor(null);

    // Start the archive (matches real behavior: it disappears)
    setArchivedBookId(bookId);

    // Open coaching immediately (no perceived delay)
    setCoachArchiveProgress("archiving");
    setShowCoachDetails(false);
    setShowCoachArchive(true);

    // Short, believable archive duration (separate from the agent flow)
    await sleep(900);

    setCoachArchiveProgress("done");
    // Small pause before showing guidance (feels intentional)
    await sleep(250);
    setShowCoachDetails(true);
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] w-full bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
        {/* Prototype framing (spans nav + main) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                What you’re about to see
              </div>
              <p className="mt-1 text-sm text-slate-600">
                A lightweight wireframe of a “Current Books” list. The demo
                focuses on what happens when a user exports a board book to
                their desktop: after the export completes, we wire directly to a secure sharing assist.
              </p>
            </div>
          </div>

          <div className="mt-4 h-px w-full bg-slate-200" />

          <div className="mt-4 rounded-2xl bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-700">
              Prototype note
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Export triggers a post-action, optional assist. Next we’ll route
              “Tell me more” to a Data Room screen.
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Archive behavior:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Coach</span>
                <Switch
                  checked={archiveMode === "agent"}
                  onCheckedChange={(v) => setArchiveMode(v ? "agent" : "coach")}
                />
                <span className="text-xs text-slate-500">Agent</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Export behavior:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Coach</span>
                <Switch
                  checked={exportMode === "agent"}
                  onCheckedChange={(v) => setExportMode(v ? "agent" : "coach")}
                />
                <span className="text-xs text-slate-500">Agent</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Send to Data Room behavior:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Coach</span>
                <Switch
                  checked={sendToDataRoomMode === "agent"}
                  onCheckedChange={(v) =>
                    setSendToDataRoomMode(v ? "agent" : "coach")
                  }
                />
                <span className="text-xs text-slate-500">Agent</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="mt-4 flex w-full gap-4">
          {/* Left Nav (light recreation) */}
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="rounded-2xl border bg-white p-3">
              <div className="flex items-center gap-2 px-2 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
                  <Building2 className="h-4 w-4 text-slate-600" />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-none">
                    Diligent
                  </div>
                  <div className="text-xs text-slate-500">Acme Corporation</div>
                </div>
              </div>

              <Separator className="my-3" />

              <NavItem active icon={<Book className="h-4 w-4" />}>
                Books
              </NavItem>
              <NavItem>Resource Center</NavItem>

              <Separator className="my-3" />

              <NavItem>Minutes</NavItem>
              <NavItem>Data Room</NavItem>
              <NavItem>Questionnaires</NavItem>

              <Separator className="my-3" />

              <NavItem>GRC Reporting</NavItem>
              <NavItem>Learning & Certification</NavItem>
              <NavItem>Templates</NavItem>
              <NavItem>Calendar</NavItem>

              <Separator className="my-3" />

              <NavItem>Site management</NavItem>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Books</h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline">Create book</Button>
                <Button variant="outline">Add announcement</Button>
                <Button variant="outline" className="gap-2">
                  Newest first <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              {/* Org group */}
              <Card className="relative overflow-visible rounded-2xl border p-0">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="text-sm font-semibold">{expandedOrg}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setExpandedOrg((v) =>
                        v === "Board of Directors" ? "" : "Board of Directors"
                      )
                    }
                    aria-label="Toggle group"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition ${
                        expandedOrg ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </Button>
                </div>

                <Separator />

                <AnimatePresence initial={false}>
                  {expandedOrg && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      className="relative"
                    >
                      <div className="divide-y">
                        {booksSeed
                          // Current product behavior: archived book disappears
                          .filter(
                            (b) => !(archivedBookId && b.id === archivedBookId)
                          )
                          .map((b) => {
                            const isSelected = b.id === selectedBookId;

                            return (
                              <div
                                key={b.id}
                                className={`relative flex items-center justify-between gap-3 px-4 py-4 ${
                                  isSelected ? "bg-slate-50" : ""
                                }`}
                                data-assist-anchor={`book-row-${b.id}`}
                              >
                                <button
                                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                  onClick={() => setSelectedBookId(b.id)}
                                >
                                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
                                    <BookOpen className="h-4 w-4 text-slate-600" />
                                  </div>

                                  <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-slate-900">
                                      {b.title}
                                    </div>

                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                      {b.status ===
                                      "Custom approvals pending" ? (
                                        <Badge variant="secondary">
                                          Custom approvals pending
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline">Published</Badge>
                                      )}
                                      <span className="text-slate-300">•</span>
                                      <span>Meeting: {b.meetingDate}</span>
                                    </div>
                                  </div>
                                </button>

                                <div className="flex shrink-0 items-center gap-2">
                                  {/* “GovernAI” anchor stays calm; later we can layer additional assists here */}
                                  <Button
                                    variant="outline"
                                    className="hidden h-10 gap-2 rounded-full border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 md:inline-flex"
                                  >
                                    <Sparkles className="h-3.5 w-3.5 text-slate-500" />
                                    GovernAI
                                  </Button>

                                  <Button
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() => {
                                      setSelectedBookId(b.id);
                                    }}
                                  >
                                    Open book
                                  </Button>

                                  <div className="relative">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      aria-label="More"
                                      onClick={() =>
                                        setOpenMenuFor((v) =>
                                          v === b.id ? null : b.id
                                        )
                                      }
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>

                                    <AnimatePresence>
                                      {openMenuFor === b.id && (
                                        <>
                                          <button
                                            aria-label="Close menu backdrop"
                                            className="fixed inset-0 z-40 cursor-default"
                                            onClick={() => setOpenMenuFor(null)}
                                          />
                                          <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.14 }}
                                            className="absolute right-0 top-10 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                                          >
                                            <MenuItem disabled>Unpublish</MenuItem>
                                            <MenuItem disabled>
                                              Notify users
                                            </MenuItem>

                                            <Separator className="my-2" />

                                            <MenuItem
                                              onClick={() =>
                                                archiveMode === "agent"
                                                  ? handleArchive(b.id)
                                                  : handleArchiveCoach(b.id)
                                              }
                                            >
                                              Archive
                                            </MenuItem>

                                            <MenuItem disabled>Copy book</MenuItem>
                                            <MenuItem disabled>
                                              Book properties
                                            </MenuItem>
                                            <MenuItem disabled>Book access</MenuItem>

                                            <Separator className="my-2" />

                                            <MenuItem
                                              onClick={() => handleSendToDataRoom(b.id)}
                                              className="gap-2"
                                            >
                                              <Send className="h-4 w-4" /> Send to Data Room
                                            </MenuItem>
                                            <MenuItem disabled>Print</MenuItem>

                                            <MenuItem
                                              onClick={() => handleExport(b.id)}
                                              className="gap-2"
                                            >
                                              <Download className="h-4 w-4" />{" "}
                                              Export to PDF
                                            </MenuItem>

                                            <Separator className="my-2" />

                                            <MenuItem disabled>
                                              Docusign status
                                            </MenuItem>
                                            <MenuItem disabled>Take minutes</MenuItem>
                                          </motion.div>
                                        </>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>

                              </div>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>

            {/* Floating export toast */}
            <AnimatePresence>
              {exportState === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.16 }}
                  className="fixed bottom-5 right-5 z-50 w-[320px] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  data-assist-anchor="export-toast"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-slate-600" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900">
                        Export complete
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Downloaded to your desktop. (Wireframe)
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Export → Secure share assist (wired directly) */}
            {/* Send to Data Room assist (wired directly) */}
            <AnimatePresence>
              {showSendToDataRoomAssist && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/30"
                    onClick={() => {
                      setShowSendToDataRoomAssist(false);
                      setShowSendToDataRoomDetails(false);
                      setSendToDataRoomProgress("creating");
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="fixed left-1/2 top-1/2 z-50 w-[760px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold text-slate-900">
                          {sendToDataRoomProgress === "done"
                            ? sendToDataRoomMode === "agent"
                              ? "Secure share ready"
                              : "Send to Data Room"
                            : sendToDataRoomMode === "agent"
                              ? "Preparing secure share…"
                              : "Loading recommended settings…"}
                        </div>

                        <div className="mt-1 text-sm text-slate-600">
                          {sendToDataRoomProgress === "done"
                            ? sendToDataRoomMode === "agent"
                              ? "I prepared the standard board-materials setup and drafted the link notification."
                              : "Most admins use the defaults below for better auditing, access control, and retrieval."
                            : "One moment…"}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close"
                        onClick={() => {
                          setShowSendToDataRoomAssist(false);
                          setShowSendToDataRoomDetails(false);
                          setSendToDataRoomProgress("creating");
                        }}
                      >
                        <span className="text-lg leading-none">×</span>
                      </Button>
                    </div>

                    {sendToDataRoomProgress !== "done" && (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
                          <div className="text-sm text-slate-600">
                            {sendToDataRoomMode === "agent"
                              ? "Applying defaults: content, destination, and protection…"
                              : "Pulling standard admin defaults…"}
                          </div>
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {showSendToDataRoomDetails && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4"
                        >
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white">
                                <ShieldAlert className="h-3.5 w-3.5 text-slate-600" />
                              </span>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-slate-900">
                                  {sendToDataRoomMode === "agent"
                                    ? "Show our work"
                                    : "Recommended settings"}
                                </div>
                                <div className="mt-1 text-xs text-slate-600">
                                  {sendToDataRoomMode === "agent"
                                    ? "Steps 1–2 are prepared. Step 3 requires confirmation before sending."
                                    : "Estimated time: ~5 minutes to share as a secure link with proper permissions."}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              {sendToDataRoomMode === "agent" ? (
                                <>
                                  <WorkRow
                                    title="1) Content selection"
                                    open={true}
                                    onToggle={() => {}}
                                    disabled={true}
                                  >
                                    <div className="text-xs text-slate-600">
                                      Entire book • Include headers/footers • Scale to fit
                                    </div>
                                  </WorkRow>

                                  <WorkRow
                                    title="2) Destination in Data Room"
                                    open={true}
                                    onToggle={() => {}}
                                    disabled={true}
                                  >
                                    <div className="text-xs text-slate-600">
                                      Default location:{" "}
                                      <span className="font-medium text-slate-700">
                                        My data room / Boards Exports / Bluestart Global Corporation Board Strategy Meeting
                                      </span>
                                    </div>
                                    <div className="mt-2">
                                      <Button size="sm">Change location</Button>
                                    </div>
                                  </WorkRow>

                                  <WorkRow
                                    title="3) Send link"
                                    open={true}
                                    onToggle={() => {}}
                                    disabled={true}
                                  >
                                    <div className="text-xs text-slate-600">
                                      Link protection: PIN • Recipients: Board members (18) • EAs (4)
                                    </div>

                                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                                      <div className="text-xs font-medium text-amber-900">
                                        Action needed
                                      </div>
                                      <div className="mt-1 text-xs text-amber-900/80">
                                        Review recipients and message before sending the secure link.
                                      </div>

                                      <div className="mt-2 flex items-center gap-2">
                                        <Button size="sm">Confirm and send</Button>
                                        <Button variant="outline" size="sm">
                                          Review message
                                        </Button>
                                      </div>

                                      <div className="mt-2 text-xs text-amber-900/70">
                                        Note: in “Cautious” mode, nothing sends without human review.
                                      </div>
                                    </div>
                                  </WorkRow>
                                </>
                              ) : (
                                <>
                                  <CoachRow
                                    title="1) Use standard content selection"
                                    body="Most admins send the entire book with headers/footers and ‘scale to fit’."
                                    actionLabel="Apply"
                                    onAction={() => {
                                      setShowSendToDataRoomDetails(false);
                                      setTimeout(
                                        () => setShowSendToDataRoomDetails(true),
                                        150
                                      );
                                    }}
                                  />

                                  <CoachRow
                                    title="2) Use the default destination"
                                    body="Stores exports in the meeting’s default folder for reliable auditing and retrieval."
                                    actionLabel="Use default location"
                                    onAction={() => {
                                      setShowSendToDataRoomDetails(false);
                                      setTimeout(
                                        () => setShowSendToDataRoomDetails(true),
                                        150
                                      );
                                    }}
                                  />

                                  <CoachRow
                                    title="3) Share by secure link"
                                    body="PIN-protected link to Board members + EAs (saved lists) avoids attachments."
                                    actionLabel="Review recipients"
                                    onAction={() => {
                                      setShowSendToDataRoomDetails(false);
                                      setTimeout(
                                        () => setShowSendToDataRoomDetails(true),
                                        150
                                      );
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowSendToDataRoomAssist(false);
                                setShowSendToDataRoomDetails(false);
                                setSendToDataRoomProgress("creating");
                              }}
                            >
                              Done
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showExportAssist && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/30"
                    onClick={() => {
                      setShowExportAssist(false);
                      setShowExportAssistDetails(false);
                      setExportAssistProgress("creating");
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="fixed left-1/2 top-1/2 z-50 w-[720px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold text-slate-900">
                          {exportAssistProgress === "done"
                            ? exportMode === "agent"
                              ? "Secure share ready"
                              : "Export complete"
                            : exportMode === "agent"
                              ? "Creating secure copy…"
                              : "Preparing safer sharing…"}
                        </div>

                        <div className="mt-1 text-sm text-slate-600">
                          {exportAssistProgress === "done"
                            ? exportMode === "agent"
                              ? "I created a secure PDF in Data Room so you can share a link instead of an attachment."
                              : "Most admins share via Data Room for better security controls and an audit trail."
                            : "One moment…"}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close"
                        onClick={() => {
                          setShowExportAssist(false);
                          setShowExportAssistDetails(false);
                          setExportAssistProgress("creating");
                        }}
                      >
                        <span className="text-lg leading-none">×</span>
                      </Button>
                    </div>

                    {exportAssistProgress !== "done" && (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
                          <div className="text-sm text-slate-600">
                            {exportMode === "agent"
                              ? "Creating secure PDF in Data Room…"
                              : "Loading recommended sharing steps…"}
                          </div>
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {showExportAssistDetails && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4"
                        >
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white">
                                <ShieldAlert className="h-3.5 w-3.5 text-slate-600" />
                              </span>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-slate-900">
                                  {exportMode === "agent" ? "What I did" : "Recommended secure sharing"}
                                </div>
                                <div className="mt-1 text-xs text-slate-600">
                                  {exportMode === "agent"
                                    ? "This keeps the file under Diligent security controls (no desktop attachment required)."
                                    : "Estimated time: ~5 minutes to share as a link with proper permissions."}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              {exportMode === "agent" ? (
                                <>
                                  <WorkRow
                                    title="Stored secure PDF in Data Room"
                                    open={true}
                                    onToggle={() => {}}
                                    disabled={true}
                                  >
                                    <div className="text-xs text-slate-600">
                                      Path:{" "}
                                      <span className="font-medium text-slate-700">
                                        2026 / Board materials / board-book-january-secure.pdf
                                      </span>
                                    </div>
                                    <div className="mt-2">
                                      <Button size="sm">Open Data Room</Button>
                                    </div>
                                  </WorkRow>

                                  <WorkRow
                                    title="Prepared link notification"
                                    open={true}
                                    onToggle={() => {}}
                                    disabled={true}
                                  >
                                    <div className="text-xs text-slate-600">
                                      Recipients: Board members (18) • EAs (4)
                                    </div>

                                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                                      <div className="text-xs font-medium text-amber-900">
                                        Action needed
                                      </div>
                                      <div className="mt-1 text-xs text-amber-900/80">
                                        Choose if you’re ready to notify them with a secure link.
                                      </div>

                                      <div className="mt-2 flex items-center gap-2">
                                        <Button size="sm">Use normal template — notify</Button>
                                        <Button variant="outline" size="sm">Review message</Button>
                                      </div>

                                      <div className="mt-2 text-xs text-amber-900/70">
                                        Note: in “Cautious” mode, nothing sends without human review.
                                      </div>
                                    </div>
                                  </WorkRow>
                                </>
                              ) : (
                                <>
                                  <CoachRow
                                    title="1) Create a secure PDF in Data Room"
                                    body="Keeps the file under security controls and makes sharing auditable."
                                    actionLabel="Create secure copy"
                                    onAction={() => {
                                      setShowExportAssistDetails(false);
                                      setTimeout(() => setShowExportAssistDetails(true), 150);
                                    }}
                                  />

                                  <CoachRow
                                    title="2) Share by link with the usual recipients"
                                    body="Use saved lists (Board members + EAs) instead of emailing attachments."
                                    actionLabel="Review recipients"
                                    onAction={() => {
                                      setShowExportAssistDetails(false);
                                      setTimeout(() => setShowExportAssistDetails(true), 150);
                                    }}
                                  />

                                  <CoachRow
                                    title="3) Set permissions & expiry"
                                    body="Limit access, track views, and expire external links when needed."
                                    actionLabel="Review permissions"
                                    onAction={() => {
                                      setShowExportAssistDetails(false);
                                      setTimeout(() => setShowExportAssistDetails(true), 150);
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowExportAssist(false);
                                setShowExportAssistDetails(false);
                                setExportAssistProgress("creating");
                              }}
                            >
                              Done
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showCoachArchive && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/30"
                    onClick={() => {
                      setShowCoachArchive(false);
                      setShowCoachDetails(false);
                      setCoachArchiveProgress("archiving");
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="fixed left-1/2 top-1/2 z-50 w-[720px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold text-slate-900">
                          {coachArchiveProgress === "done" ? "Archive complete" : "Archiving…"}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {coachArchiveProgress === "done"
                            ? "For stronger auditing and better corporate governance, most admins also complete the steps below (≈ 30 minutes)."
                            : "Archiving is underway. This usually takes a moment."}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close"
                        onClick={() => {
                          setShowCoachArchive(false);
                          setShowCoachDetails(false);
                          setCoachArchiveProgress("archiving");
                        }}
                      >
                        <span className="text-lg leading-none">×</span>
                      </Button>
                    </div>

                    {coachArchiveProgress !== "done" && (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
                          <div className="text-sm text-slate-600">Finalizing archive record…</div>
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {showCoachDetails && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4"
                        >
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white">
                                <ShieldAlert className="h-3.5 w-3.5 text-slate-600" />
                              </span>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-slate-900">
                                  Recommended wrap‑up steps
                                </div>
                                <div className="mt-1 text-xs text-slate-600">
                                  Estimated time: ~30 minutes to do this properly right now.
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              <CoachRow
                                title="1) Store the canonical copy in Data Room"
                                body="Keeps the board book under security controls and easy to retrieve later."
                                actionLabel="Open Data Room settings"
                                onAction={() => {
                                  setShowCoachDetails(false);
                                  // simulate that the user completed or navigated to this step
                                  setTimeout(() => setShowCoachDetails(true), 150);
                                }}
                              />

                              <CoachRow
                                title="2) Notify Board Members and EAs"
                                body="Use saved recipient lists instead of exporting and emailing attachments."
                                actionLabel="Review recipients"
                                onAction={() => {
                                  setShowCoachDetails(false);
                                  setTimeout(() => setShowCoachDetails(true), 150);
                                }}
                              />

                              <CoachRow
                                title="3) Link the record to meeting minutes"
                                body="Creates an auditable trail: Minutes → Data Room → Board Book."
                                actionLabel="View minutes linkage"
                                onAction={() => {
                                  setShowCoachDetails(false);
                                  setTimeout(() => setShowCoachDetails(true), 150);
                                }}
                              />
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowCoachArchive(false);
                                setShowCoachDetails(false);
                                setCoachArchiveProgress("archiving");
                              }}
                            >
                              Done
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Agent Receipt (modal) */}
            <AnimatePresence>
              {showReceipt && receiptType === "archive" && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/30"
                    onClick={() => {
                      if (archiveProgress === "done") {
                        setShowReceipt(false);
                        setReceiptType(null);
                        setArchiveProgress("idle");
                        setArchivedBookId(null);
                      }
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="fixed left-1/2 top-1/2 z-50 w-[720px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold text-slate-900">
                          {archiveProgress === "done"
                            ? "Wrap-up complete"
                            : "Archiving…"}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {archiveProgress === "done"
                            ? "I handled the follow-ups and saved you ~19 clicks and about 2 hours."
                            : "Archiving the book and securing the record…"}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        

                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Close"
                          onClick={() => {
                            if (archiveProgress === "done") {
                              setShowReceipt(false);
                              setReceiptType(null);
                              setArchiveProgress("idle");
                              setArchivedBookId(null);
                            }
                          }}
                        >
                          <span className="text-lg leading-none">×</span>
                        </Button>
                      </div>
                    </div>

                    {/* Simulated archiving activity */}
                    {archiveProgress !== "done" && (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="h-2 w-2 rounded-full bg-slate-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.9, repeat: Infinity }}
                          />
                          <motion.div
                            className="h-2 w-2 rounded-full bg-slate-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 0.9,
                              repeat: Infinity,
                              delay: 0.15,
                            }}
                          />
                          <motion.div
                            className="h-2 w-2 rounded-full bg-slate-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 0.9,
                              repeat: Infinity,
                              delay: 0.3,
                            }}
                          />
                          <div className="text-sm text-slate-600">
                            Archiving book and preparing record…
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show our work */}
                    <AnimatePresence>
                      {showArchiveDetails && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4"
                        >
                          <div className="text-xs font-medium text-slate-500">
                            Show our work
                          </div>

                          <div className="mt-2 space-y-2">
                            <WorkRow
                              title="Archived the book"
                              open={openDetails.archive}
                              onToggle={() =>
                                setOpenDetails((v) => ({
                                  ...v,
                                  archive: !v.archive,
                                }))
                              }
                              disabled={archiveProgress !== "done"}
                            >
                              <div className="text-xs text-slate-600">
                                Book archived at{" "}
                                <span className="font-medium text-slate-700">
                                  Feb 12, 2026 · 4:18 PM
                                </span>
                              </div>
                              <div className="mt-2">
                                <Button variant="outline" size="sm">
                                  View archives
                                </Button>
                              </div>
                            </WorkRow>

                            <WorkRow
                              title="Stored the canonical copy in Data Room"
                              open={openDetails.dataRoom}
                              onToggle={() =>
                                setOpenDetails((v) => ({
                                  ...v,
                                  dataRoom: !v.dataRoom,
                                }))
                              }
                              disabled={archiveProgress !== "done"}
                            >
                              <div className="text-xs text-slate-600">
                                Path:{" "}
                                <span className="font-medium text-slate-700">
                                  2026 / Board materials / board-book-january.pdf
                                </span>
                              </div>
                              <div className="mt-2">
                                <Button size="sm">Open Data Room</Button>
                              </div>
                            </WorkRow>

                            <WorkRow
                              title="Preparing to notify Board Members and EAs"
                              open={openDetails.notify}
                              onToggle={() =>
                                setOpenDetails((v) => ({ ...v, notify: !v.notify }))
                              }
                              disabled={archiveProgress !== "done"}
                            >
                              <div className="text-xs text-slate-600">
                                Board members:{" "}
                                <button
                                  className="underline underline-offset-2"
                                  onClick={() =>
                                    setShowBoardList((s) => !s)
                                  }
                                >
                                  18
                                </button>
                              </div>

                              {showBoardList && (
                                <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-600">
                                  Alex Rivera, Priya Shah, Daniel Kim, Sofia Patel,
                                  Morgan Lee…{" "}
                                  <span className="text-slate-400">
                                    (wireframe list)
                                  </span>
                                </div>
                              )}

                              <div className="mt-2 text-xs text-slate-600">
                                EAs:{" "}
                                <button
                                  className="underline underline-offset-2"
                                  onClick={() => setShowEAList((s) => !s)}
                                >
                                  4
                                </button>
                              </div>

                              {showEAList && (
                                <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-600">
                                  Jordan Nguyen, Casey Brooks, Taylor Chen, Riley
                                  Morgan{" "}
                                  <span className="text-slate-400">
                                    (wireframe list)
                                  </span>
                                </div>
                              )}

<div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
  <div className="text-xs font-medium text-amber-900">
    Action needed
  </div>
  <div className="mt-1 text-xs text-amber-900/80">
    Choose if you're ready to notify Board members and EAs.
  </div>

  <div className="mt-2 flex items-center gap-2">
    <Button size="sm">Use normal template — notify Board members</Button>
    <Button variant="outline" size="sm">Review message</Button>
  </div>

  <div className="mt-2 text-xs text-amber-900/70">
    Note: in “Cautious” mode, nothing sends without human review.
  </div>
</div>
                            </WorkRow>

                            <WorkRow
                              title="Linked record to meeting minutes"
                              open={openDetails.minutes}
                              onToggle={() =>
                                setOpenDetails((v) => ({
                                  ...v,
                                  minutes: !v.minutes,
                                }))
                              }
                              disabled={archiveProgress !== "done"}
                            >
                              <div className="text-xs text-slate-600">
                                Added a reference in{" "}
                                <span className="font-medium text-slate-700">
                                  Minutes → Feb 12, 2026
                                </span>{" "}
                                and linked the canonical Data Room file.
                              </div>
                            </WorkRow>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-5 flex items-center justify-between gap-3">
  <label className="flex items-center gap-2 text-xs text-slate-600">
    <input
      type="checkbox"
      checked={preferCompactNextTime}
      onChange={(e) => setPreferCompactNextTime(e.target.checked)}
      className="h-4 w-4 rounded border-slate-300"
    />
    Next time, show this as a small panel
  </label>

  <Button
    variant="outline"
    onClick={() => {
      setShowReceipt(false);
      setReceiptType(null);
      setArchiveProgress("idle");
      setArchivedBookId(null);
    }}
    disabled={archiveProgress !== "done"}
  >
    Close
  </Button>
</div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
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
  open,
  onToggle,
  disabled,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        onClick={onToggle}
        disabled={disabled}
        className={[
          "flex w-full items-center justify-between gap-3 px-4 py-3 text-left",
          disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-50",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-slate-600" />
          <div className="text-sm font-medium text-slate-900">{title}</div>
        </div>
        <div className="text-slate-500">{open ? "▾" : "▸"}</div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="px-4 pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({
  children,
  active,
  icon,
}: {
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-slate-100 text-slate-900 font-semibold border border-slate-200"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
    >
      {icon ? <span className="text-slate-600">{icon}</span> : null}
      <span>{children}</span>
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => {
        if (disabled) return;
        onClick?.();
      }}
      aria-disabled={disabled}
      className={[
        "flex w-full items-center rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50",
        disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}