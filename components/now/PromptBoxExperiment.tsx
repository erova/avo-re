"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Variant = "A" | "B" | "C" | "D";

type Source = {
  id: string;
  name: string;
  description: string;
  freshness: "Realtime" | "Daily" | "Weekly" | "Static" | "Unknown";
  fields: string[];
};

type PromptCategory = "Summarize" | "Analyze" | "Draft" | "Compare" | "Visualize";

type PromptTemplate = {
  id: string;
  category: PromptCategory;
  title: string;
  template: (ctx: { enabledSources: Source[] }) => string;
  requires?: string[];
  preview?: (ctx: { enabledSources: Source[] }) => {
    title: string;
    bullets: string[];
    citations: string[];
  };
};

type Flag = {
  id: string;
  severity: "warn" | "block";
  message: string;
  suggestion?: string;
};

type ReportModule = {
  id: string;
  label: string;
  description: string;
};

const DEFAULT_REPORT_MODULES: ReportModule[] = [
  {
    id: "bio_and_roles",
    label: "Director bio, committee roles, tenure, and other boards",
    description: "Extract biographical details and governance roles from the uploaded material.",
  },
  {
    id: "vote_tallies",
    label: "Vote tallies and meeting results",
    description: "Pull vote outcomes where present and flag missing years/gaps.",
  },
  {
    id: "attendance_independence",
    label: "Attendance + independence indicators",
    description: "Check attendance statements, independence notes, and limits on outside boards.",
  },
  {
    id: "governance_red_flags",
    label: "Governance assessment + red flags",
    description: "Assess independence, overboarding, suitability, and list red flags.",
  },
  {
    id: "apply_policy",
    label: "Apply voting policy (PVA) if included",
    description:
      "Use the uploaded policy; if missing, clearly flag the gap and provide a provisional recommendation.",
  },
  {
    id: "report_output",
    label: "Output: concise report + missing data list",
    description: "Produce a structured report and explicitly list missing inputs.",
  },
];

const LS_MY_PROMPTS_KEY = "avo_promptbox_my_prompts_v2";
const LS_ENABLED_SOURCES_KEY = "avo_promptbox_enabled_sources_v1";

const DEFAULT_SOURCES: Source[] = [
  {
    id: "boards",
    name: "Boards",
    description: "Board books, agendas, minutes, resolutions, actions.",
    freshness: "Daily",
    fields: ["agenda items", "decisions", "owners", "deadlines", "attachments"],
  },
  {
    id: "policies",
    name: "Policies",
    description: "Policy library content and change history.",
    freshness: "Weekly",
    fields: ["policy text", "effective date", "revision history", "owners"],
  },
  {
    id: "third_party",
    name: "Third-Party",
    description: "Vendor risk data, assessments, issues, mitigations.",
    freshness: "Daily",
    fields: ["risk ratings", "findings", "controls", "renewal dates"],
  },
  {
    id: "files",
    name: "Files",
    description: "Uploaded docs for this session (simulated).",
    freshness: "Realtime",
    fields: ["document text", "tables", "headings", "entities"],
  },
];

const DEFAULT_ENABLED_SOURCE_IDS = ["boards", "policies", "third_party"];

function safeJsonParse<T>(value: string | null, fallback: T): T {
  try {
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function track(event: string, payload: Record<string, any>) {
  try {
    window.dispatchEvent(new CustomEvent("avo_promptbox_event", { detail: { event, payload } }));
  } catch {
    // noop
  }
  // eslint-disable-next-line no-console
  console.log("[PromptBoxExperiment]", event, payload);
}

function joinSources(enabledSources: Source[]) {
  if (!enabledSources.length) return "no sources selected";
  return enabledSources.map((s) => s.name).join(", ");
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function buildTemplates(): PromptTemplate[] {
  return [
    {
      id: "sum_changes",
      category: "Summarize",
      title: "Summarize policy changes (with a table)",
      template: ({ enabledSources }) => {
        const sources = joinSources(enabledSources);
        return `Using only these sources: ${sources}.
Summarize key changes in the policy set since last quarter. Provide:
1) Executive summary (3 bullets)
2) Changes table with columns: Policy, What changed, Impact, Owner, Effective date`;
      },
      requires: ["policies"],
      preview: ({ enabledSources }) => ({
        title: "You’ll get: change summary + comparison table",
        bullets: [
          "Executive summary (3 bullets)",
          "Changes table (Policy / What changed / Impact / Owner / Effective date)",
          `Scope: ${joinSources(enabledSources)}`,
        ],
        citations: ["Policies (revision history)"],
      }),
    },
    {
      id: "risk_top5",
      category: "Analyze",
      title: "Top 5 risks across selected sources",
      template: ({ enabledSources }) => {
        const sources = joinSources(enabledSources);
        return `Using only these sources: ${sources}.
Identify the top 5 risks mentioned across the selected sources. For each risk:
- Why it matters (1–2 sentences)
- Evidence (cite source/doc sections)
- Recommended mitigation (practical next step)
Also include a risk heat level (High/Med/Low).`;
      },
      preview: ({ enabledSources }) => ({
        title: "You’ll get: ranked risks + mitigation plan",
        bullets: [
          "Top 5 risks ranked by severity",
          "Evidence snippets with citations",
          "Mitigation recommendations and owners (if available)",
          `Scope: ${joinSources(enabledSources)}`,
        ],
        citations: ["Boards / Policies / Third-Party (as selected)"],
      }),
    },
    {
      id: "draft_msg",
      category: "Draft",
      title: "Draft a stakeholder update (crisp, non-alarmist)",
      template: ({ enabledSources }) => {
        const sources = joinSources(enabledSources);
        return `Using only these sources: ${sources}.
Draft a message to stakeholders summarizing:
- The top 3 risks / issues
- What’s changing
- Next steps and asks
Make it crisp and non-alarmist. Include a short subject line and a 3-bullet TL;DR.`;
      },
      preview: ({ enabledSources }) => ({
        title: "You’ll get: a ready-to-send message",
        bullets: [
          "Subject line + TL;DR bullets",
          "Short context paragraph",
          "Top 3 items with next steps and owners (if available)",
          `Scope: ${joinSources(enabledSources)}`,
        ],
        citations: ["Boards / Policies / Files (as applicable)"],
      }),
    },
    {
      id: "compare_docs",
      category: "Compare",
      title: "Compare two documents (decisions, owners, deadlines)",
      template: ({ enabledSources }) => {
        const sources = joinSources(enabledSources);
        return `Using only these sources: ${sources}.
Compare Document A vs Document B. Explain differences in:
- Decisions / approvals
- Owners / responsibilities
- Deadlines / timelines
- Risk posture
End with a 5-bullet 'what changed' summary.

Ask me which two docs to compare if not specified.`;
      },
      requires: ["files"],
      preview: ({ enabledSources }) => ({
        title: "You’ll get: diff-style comparison + summary",
        bullets: ["Side-by-side comparison", "Key differences", "5-bullet what-changed summary"],
        citations: ["Files (Doc A / Doc B)"],
      }),
    },
    {
      id: "viz_risk_heatmap",
      category: "Visualize",
      title: "Visualize risks (heatmap spec)",
      template: ({ enabledSources }) => {
        const sources = joinSources(enabledSources);
        return `Using only these sources: ${sources}.
Create a visualization-ready specification (no actual chart rendering):
- Risk list (max 10) with severity (High/Med/Low) and likelihood (High/Med/Low)
- A 3x3 heatmap mapping (severity x likelihood)
- Suggested labels and a short legend
If data is missing, explicitly list the gaps.`;
      },
      preview: ({ enabledSources }) => ({
        title: "You’ll get: a heatmap-ready spec + legend",
        bullets: ["Top risks with severity/likelihood", "3x3 mapping table", "Legend + gaps list"],
        citations: ["Boards / Policies / Third-Party / Files (as selected)"],
      }),
    },
  ];
}

function detectScopeIssues(text: string): Flag[] {
  const t = normalize(text);
  if (!t) return [];

  const rules: Array<{
    id: string;
    test: (t: string) => boolean;
    severity: "warn" | "block";
    message: string;
    suggestion?: string;
  }> = [
    {
      id: "web_browsing",
      test: (x) => x.includes("browse the web") || x.includes("search the web") || x.includes("google"),
      severity: "block",
      message: "This demo can’t browse the web.",
      suggestion: "Ask using Boards/Policies/Third-Party/Files only.",
    },
    {
      id: "email",
      test: (x) => x.includes("gmail") || x.includes("outlook") || x.includes("inbox"),
      severity: "warn",
      message: "This demo doesn’t have Email as a source.",
      suggestion: "Paste/email content as a File, then ask again.",
    },
    {
      id: "calendar",
      test: (x) => x.includes("calendar") || x.includes("invite"),
      severity: "warn",
      message: "This demo doesn’t have Calendar as a source.",
      suggestion: "Paste meeting notes as a File, then ask again.",
    },
  ];

  return rules.filter((r) => r.test(t)).map((r) => ({ id: r.id, severity: r.severity, message: r.message, suggestion: r.suggestion }));
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  title?: string;
}) {
  const base = "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm transition border";
  const styles =
    variant === "primary"
      ? "bg-white text-black border-white hover:opacity-90"
      : variant === "secondary"
      ? "bg-transparent text-white border-white/25 hover:border-white/50"
      : "bg-transparent text-white/80 border-transparent hover:text-white hover:bg-white/5";
  const dis = disabled ? "opacity-50 cursor-not-allowed" : "";
  return (
    <button className={`${base} ${styles} ${dis}`} onClick={disabled ? undefined : onClick} title={title} type="button">
      {children}
    </button>
  );
}

function Chip({
  selected,
  children,
  onClick,
  title,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition
        ${
          selected
            ? "border-white/60 bg-white/10 text-white"
            : "border-white/20 bg-transparent text-white/80 hover:border-white/40 hover:text-white"
        }`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-xs uppercase tracking-widest text-white/60 mb-2">{children}</div>;
}

function Divider() {
  return <div className="h-px bg-white/10 my-4" />;
}

function PaperclipIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21.44 11.05l-8.49 8.49a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.19 9.19a2 2 0 11-2.83-2.83l8.49-8.49" />
    </svg>
  );
}

export default function PromptBoxExperiment({
  variant = "D",
  stickyPrompt = false,
  title = "Capability-aware Prompt Box",
  description = "Start simple. Reveal help only when you need it.",
}: {
  variant?: Variant;
  stickyPrompt?: boolean;
  title?: string;
  description?: string;
}) {
  const templates = useMemo(() => buildTemplates(), []);

  const [sources] = useState<Source[]>(DEFAULT_SOURCES);
  const [enabledSourceIds, setEnabledSourceIds] = useState<string[]>(DEFAULT_ENABLED_SOURCE_IDS);
  const enabledSources = useMemo(() => sources.filter((s) => enabledSourceIds.includes(s.id)), [sources, enabledSourceIds]);

  const [hasFile, setHasFile] = useState<boolean>(false);
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
  const [fileName] = useState<string>("2025JPMC_Voting_Policy.xlsx");
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    "bio_and_roles",
    "governance_red_flags",
    "apply_policy",
    "report_output",
  ]);

  // Assist mode: false = minimal, true = assist tools open
  const [assistOpen, setAssistOpen] = useState<boolean>(false);
  const [promptTab, setPromptTab] = useState<"Suggested" | "My Prompts">("Suggested");

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id ?? "");
  const selectedTemplate = useMemo(() => templates.find((t) => t.id === selectedTemplateId), [templates, selectedTemplateId]);

  const [prompt, setPrompt] = useState<string>("");
  const [isHesitating, setIsHesitating] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<{ prompt: string; ts: number } | null>(null);

  const promptRef = useRef<HTMLTextAreaElement | null>(null);

  const [myPrompts, setMyPrompts] = useState<Array<{ id: string; title: string; text: string; createdAt: number; lastUsed: number }>>([]);

  useEffect(() => {
    const storedEnabled = safeJsonParse<string[]>(
      window.localStorage.getItem(LS_ENABLED_SOURCES_KEY),
      DEFAULT_ENABLED_SOURCE_IDS
    );
    if (Array.isArray(storedEnabled) && storedEnabled.length) {
      setEnabledSourceIds(storedEnabled.filter((id) => sources.some((s) => s.id === id)));
    }

    const raw = safeJsonParse<any[]>(window.localStorage.getItem(LS_MY_PROMPTS_KEY), []);
    const migrated = (Array.isArray(raw) ? raw : [])
      .map((s) => {
        const createdAt = typeof s?.createdAt === "number" ? s.createdAt : Date.now();
        const lastUsed = typeof s?.lastUsed === "number" ? s.lastUsed : createdAt;
        return {
          id: String(s?.id ?? `my_${createdAt}`),
          title: String(s?.title ?? "My prompt"),
          text: String(s?.text ?? ""),
          createdAt,
          lastUsed,
        };
      })
      .filter((s) => s.text.trim().length > 0)
      .slice(0, 50);

    setMyPrompts(migrated);

    if (variant === "D") {
      setEnabledSourceIds((prev) => (prev.includes("files") ? prev : [...prev, "files"]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LS_ENABLED_SOURCES_KEY, JSON.stringify(enabledSourceIds));
  }, [enabledSourceIds]);

  useEffect(() => {
    if (!hasFile) {
      setIsReadingFile(false);
      return;
    }
    setIsReadingFile(true);
    const t = window.setTimeout(() => setIsReadingFile(false), 1200);
    return () => window.clearTimeout(t);
  }, [hasFile]);

  // Hesitation nudge: if the user starts typing then pauses, suggest tools without implying "help".
  useEffect(() => {
    if (assistOpen) {
      setIsHesitating(false);
      return;
    }

    const trimmed = prompt.trim();
    if (trimmed.length === 0) {
      setIsHesitating(false);
      return;
    }

    // Only nudge on short, early prompts (keeps it subtle)
    if (trimmed.length >= 40) {
      setIsHesitating(false);
      return;
    }

    setIsHesitating(false);
    const t = window.setTimeout(() => {
      setIsHesitating(true);
    }, 1200);

    return () => window.clearTimeout(t);
  }, [prompt, assistOpen]);

  const flags = useMemo(() => detectScopeIssues(prompt), [prompt]);

  function getAssistNudgeText(): string {
    const trimmed = prompt.trim();

    // If user attached a file but hasn't written anything yet, encourage the file workflow.
    if (hasFile && trimmed.length === 0) return "I can help analyze this file";

    // If prompt includes out-of-scope signals, reframe toward known sources/capabilities.
    if (flags.length > 0) return "This works best with known sources";

    // If user has typed a little then paused, offer suggestions.
    if (isHesitating) return "Want suggestions based on your sources?";

    // Default capability discovery message.
    return "Assist tools available";
  }
  const canSubmit = normalize(prompt).length > 10 && !flags.some((f) => f.severity === "block");

  const suggestedTemplates = useMemo(() => {
    const score = (t: PromptTemplate) => {
      const req = t.requires ?? [];
      const missing = req.filter((id) => !enabledSourceIds.includes(id)).length;
      let s = 100 - missing * 25;
      if (hasFile && enabledSourceIds.includes("files") && t.category === "Compare") s += 10;
      if (hasFile && t.category === "Analyze") s += 5;
      if (t.category === "Summarize") s += 1;
      return s;
    };
    return [...templates].sort((a, b) => score(b) - score(a)).slice(0, 5);
  }, [templates, enabledSourceIds, hasFile]);

  function toggleSource(id: string) {
    setEnabledSourceIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      track("toggle_source", { id, enabled: next.includes(id), next });
      return next;
    });
  }

  function applyTemplate(tid: string) {
    const t = templates.find((x) => x.id === tid);
    if (!t) return;
    setSelectedTemplateId(t.id);
    setPrompt(t.template({ enabledSources }));
    track("apply_template", { tid: t.id });
    promptRef.current?.focus();
  }

  function toggleModule(id: string) {
    setSelectedModuleIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function addMyPrompt() {
    const now = Date.now();
    const titleLine = prompt.split("\n")[0]?.slice(0, 60) || "My prompt";
    const id = `my_${now}`;
    const next = [{ id, title: titleLine, text: prompt, createdAt: now, lastUsed: now }, ...myPrompts].slice(0, 50);
    setMyPrompts(next);
    window.localStorage.setItem(LS_MY_PROMPTS_KEY, JSON.stringify(next));
    track("add_my_prompt", { id });
  }

  function removeMyPrompt(id: string) {
    const next = myPrompts.filter((p) => p.id !== id);
    setMyPrompts(next);
    window.localStorage.setItem(LS_MY_PROMPTS_KEY, JSON.stringify(next));
    track("remove_my_prompt", { id });
  }

  function useMyPrompt(id: string) {
    const p = myPrompts.find((x) => x.id === id);
    if (!p) return;
    setPrompt(p.text);
    const now = Date.now();
    const next = myPrompts.map((x) => (x.id === id ? { ...x, lastUsed: now } : x));
    setMyPrompts(next);
    window.localStorage.setItem(LS_MY_PROMPTS_KEY, JSON.stringify(next));
    track("use_my_prompt", { id });
    promptRef.current?.focus();
  }

  function onSubmit() {
    // Auto-open Assist on empty/too-short submit (Variant B+)
    if (!assistOpen && prompt.trim().length < 10) {
      setAssistOpen(true);
      track("auto_open_assist_on_empty", { variant });
      return;
    }
    const ts = Date.now();
    setSubmitted({ prompt, ts });
    track("submit_prompt", { variant, enabledSourceIds, promptLength: prompt.length, flags });
  }

  return (
    <div className={stickyPrompt ? "w-full pb-[360px]" : "w-full"}>
      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold text-white">{title}</div>
        <div className="text-sm text-white/70">{description}</div>
      </div>


      {/* Assist mode: sources + prompts + file checklist */}
      {assistOpen && (
        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-white/10 bg-transparent p-4">
            <SectionTitle>Available sources</SectionTitle>

            <div className="mt-3 flex flex-wrap gap-2">
              {/* Attach chip inline with pills */}
              {variant === "D" && (
                <Chip
                  selected={hasFile}
                  onClick={() => {
                    const next = !hasFile;
                    setHasFile(next);
                    track("toggle_file", { hasFile: next, fileName });
                    if (next) {
                      setEnabledSourceIds((prev) => (prev.includes("files") ? prev : [...prev, "files"]));
                      setPromptTab("Suggested");
                    }
                  }}
                  title={hasFile ? `Attached: ${fileName}` : "Attach a file (simulated)"}
                >
                  <PaperclipIcon className="h-3.5 w-3.5" />
                  <span className="ml-1">{hasFile ? "Files • Attached" : "Attach"}</span>
                </Chip>
              )}

              {sources.map((s) => (
                <Chip
                  key={s.id}
                  selected={enabledSourceIds.includes(s.id)}
                  onClick={() => toggleSource(s.id)}
                  title={`${s.description}\nFreshness: ${s.freshness}\nFields: ${s.fields.join(", ")}`}
                >
                  {s.name}
                  <span className="text-[10px] opacity-70">• {s.freshness}</span>
                </Chip>
              ))}
            </div>

            <div className="mt-3 text-xs text-white/60">This demo can only use selected sources (no web browsing).</div>
          </div>

          {/* What to run only appears after attach */}
          {variant === "D" && hasFile && (
            <div className="rounded-xl border border-white/10 bg-transparent p-4">
              <SectionTitle>What to run</SectionTitle>

              {isReadingFile ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-white/50 animate-pulse" />
                      <span>Reading file…</span>
                    </div>
                    <span className="text-xs text-white/50">~1s</span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-white/30" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-2 text-xs uppercase tracking-widest text-white/60 mb-2">
                    I can run all of these — tick what you want me to review
                  </div>

                  <div className="space-y-2">
                    {DEFAULT_REPORT_MODULES.map((m) => {
                      const checked = selectedModuleIds.includes(m.id);
                      return (
                        <label
                          key={m.id}
                          className="flex items-start gap-3 rounded-xl border border-white/10 bg-transparent p-3 hover:bg-white/[0.02] cursor-pointer"
                        >
                          <input type="checkbox" className="mt-1" checked={checked} onChange={() => toggleModule(m.id)} />
                          <div>
                            <div className="text-sm text-white/90">{m.label}</div>
                            <div className="text-xs text-white/60 mt-1">{m.description}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-transparent p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle>Choose a prompt</SectionTitle>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPromptTab("Suggested")}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    promptTab === "Suggested"
                      ? "border-white/60 bg-white/10 text-white"
                      : "border-white/20 bg-transparent text-white/80 hover:border-white/40 hover:text-white"
                  }`}
                >
                  Suggested
                </button>
                <button
                  type="button"
                  onClick={() => setPromptTab("My Prompts")}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    promptTab === "My Prompts"
                      ? "border-white/60 bg-white/10 text-white"
                      : "border-white/20 bg-transparent text-white/80 hover:border-white/40 hover:text-white"
                  }`}
                >
                  My Prompts
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {promptTab === "Suggested" && (
                <>
                  {suggestedTemplates.map((t) => {
                    const req = t.requires ?? [];
                    const missing = req.filter((id) => !enabledSourceIds.includes(id));
                    const isMismatched = missing.length > 0;

                    return (
                      <div
                        key={t.id}
                        className={`rounded-xl border p-3 transition ${
                          t.id === selectedTemplateId ? "border-white/30 bg-white/5" : "border-white/10 bg-transparent hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm text-white font-medium">{t.title}</div>
                            <div className="text-xs text-white/60 mt-1">Suggested based on enabled sources.</div>
                            {isMismatched && (
                              <div className="text-xs text-white/60 mt-1">
                                Best with: <span className="text-white/80">{missing.join(", ")}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              applyTemplate(t.id);
                              track("apply_suggested_template", { tid: t.id, enabledSourceIds });
                            }}
                          >
                            Use
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {promptTab === "My Prompts" && (
                <>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={addMyPrompt} disabled={!prompt.trim()} title="Save the current prompt (stored locally)">
                      Save current
                    </Button>
                  </div>

                  {myPrompts.length === 0 ? (
                    <div className="text-sm text-white/60">Save a prompt you like and it’ll appear here (local to this browser).</div>
                  ) : (
                    <div className="space-y-2">
                      {[...myPrompts]
                        .sort((a, b) => b.lastUsed - a.lastUsed)
                        .map((p) => (
                          <div key={p.id} className="rounded-xl border border-white/10 bg-transparent p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm text-white font-medium">{p.title}</div>
                                <div className="text-xs text-white/60 mt-1">
                                  Last used: {new Date(p.lastUsed).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-white/60 mt-1 line-clamp-2">{p.text}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" onClick={() => useMyPrompt(p.id)}>
                                  Use
                                </Button>
                                <Button variant="ghost" onClick={() => removeMyPrompt(p.id)}>
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-3 text-xs text-white/60">Suggested prompts reduce blank-canvas. My Prompts are your saved shortcuts.</div>
          </div>

          {submitted && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <SectionTitle>Result (mock)</SectionTitle>
              <div className="text-sm text-white/80">This is intentionally a mock “result” so the experiment focuses on the prompt UX.</div>
              <div className="mt-3 text-xs text-white/60">Submitted at: {new Date(submitted.ts).toLocaleString()}</div>
              <div className="mt-3 text-sm text-white/90 whitespace-pre-wrap">{submitted.prompt}</div>
            </div>
          )}
        </div>
      )}

      {/* Step 1: minimal prompt (always visible) - moved to bottom */}
      <div
        className={
          stickyPrompt
            ? "sticky bottom-0 z-20 mt-6 w-full border-t border-white/10 bg-black/70 backdrop-blur px-4 py-4"
            : "mt-6 rounded-xl border border-white/10 bg-transparent p-4"
        }
      >
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <SectionTitle>Prompt</SectionTitle>

          {/* Assist bar (Variant B+): Visible as capability discovery (not "help") */}
          {!assistOpen && (
            <div className="text-xs text-white/60">
              {getAssistNudgeText()} ·{" "}
              <button
                type="button"
                onClick={() => {
                  setIsHesitating(false);
                  setAssistOpen(true);
                  track("open_assist", {
                    variant,
                    reason: isHesitating
                      ? "hesitation"
                      : prompt.trim().length === 0
                      ? "empty"
                      : flags.length > 0
                      ? "out_of_scope"
                      : "default",
                  });
                }}
                className="underline underline-offset-4 hover:text-white"
              >
                Show tools
              </button>
            </div>
          )}
        </div>

        <textarea
          ref={promptRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={10}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none focus:border-white/30"
          placeholder="Ask something…"
        />

        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          <Button variant="primary" onClick={onSubmit} disabled={!canSubmit}>
            Submit
          </Button>
        </div>

        {assistOpen && flags.length > 0 && (
          <div className="mt-3 space-y-2">
            {flags.map((f) => (
              <div
                key={f.id}
                className={`rounded-xl border p-3 ${
                  f.severity === "block" ? "border-red-400/30 bg-red-500/10" : "border-yellow-400/30 bg-yellow-500/10"
                }`}
              >
                <div className="text-sm text-white font-medium">{f.severity === "block" ? "Blocked" : "Heads up"}</div>
                <div className="text-sm text-white/80 mt-1">{f.message}</div>
                {f.suggestion && <div className="text-xs text-white/70 mt-2">{f.suggestion}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 text-xs text-white/50">
        Variant: <span className="text-white/70">{variant}</span>
      </div>
    </div>
  );
}

export function PromptBoxExperimentTabs({
  defaultMode = "standard",
}: {
  defaultMode?: "standard" | "sticky";
}) {
  const [active, setActive] = React.useState<"standard" | "sticky">(defaultMode);

  const tabs: Array<{ id: "standard" | "sticky"; label: string; blurb: string }> = [
    { id: "standard", label: "Standard", blurb: "Inline prompt (scroll)" },
    { id: "sticky", label: "Sticky prompt", blurb: "Prompt dock stays visible" },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold text-white">Prompt Box Variants</div>
        <div className="text-sm text-white/70">Two layouts: standard vs sticky prompt dock.</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
              active === t.id
                ? "border-white/60 bg-white/10 text-white"
                : "border-white/20 bg-transparent text-white/80 hover:border-white/40 hover:text-white"
            }`}
            title={t.blurb}
          >
            <span className="font-medium">{t.label}</span>
            <span className="text-[10px] opacity-70">• {t.blurb}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 h-px w-full bg-white/10" />
      <div className="mt-6">
        <PromptBoxExperiment variant="D" stickyPrompt={active === "sticky"} />
      </div>
    </div>
  );
}