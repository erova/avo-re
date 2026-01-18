"use client";

/**
 * CA Book Builder — Wireframe Kit
 * Simplified grayscale wireframe demonstrating the book editor with smart builder assist.
 * NOTE: simplified for wireframe kit — no external dependencies, no animation libs
 */

import React, { useState } from "react";
import { Card } from "../../../wireframe-primitives/Card";
import { Button } from "../../../wireframe-primitives/Button";
import { Input } from "../../../wireframe-primitives/Input";
import { Divider } from "../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

type Tab = {
  id: string;
  name: string;
  files: string[];
};

const INITIAL_TABS: Tab[] = [
  { id: "t1", name: "Agenda", files: [] },
];

const UPLOAD_OPTIONS = [
  "Import folder",
  "Upload documents",
  "Upload from Google Drive",
  "Import bookmarked PDF",
];

// ─────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────

export default function CaBookBuilderPage() {
  // Book editor state
  const [activeEditorTab, setActiveEditorTab] = useState<"build" | "agenda" | "review">("build");
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS);
  const [selectedTabId, setSelectedTabId] = useState<string>("t1");

  // Upload menu
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);

  // Manual action tracking (triggers assist nudge)
  const [manualActions, setManualActions] = useState<string[]>([]);
  const threshold = 3;

  // Assist state
  // NOTE: simplified — in production would have more sophisticated state machine
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [showAssistPanel, setShowAssistPanel] = useState(false);
  const [assistState, setAssistState] = useState<"idle" | "working" | "done">("idle");

  // Track a manual action
  const trackAction = (action: string) => {
    const newActions = [...manualActions, action];
    setManualActions(newActions);
    if (newActions.length >= threshold && !nudgeDismissed) {
      setShowNudge(true);
    }
  };

  // Add a new tab
  const addTab = () => {
    const newTab: Tab = {
      id: `t${tabs.length + 1}`,
      name: `Tab ${tabs.length + 1}`,
      files: [],
    };
    setTabs([...tabs, newTab]);
    setSelectedTabId(newTab.id);
    trackAction("Add tab");
  };

  // Handle upload selection
  const handleUpload = (option: string) => {
    setUploadMenuOpen(false);
    trackAction(option);
    // Add a mock file to current tab
    setTabs(tabs.map((t) =>
      t.id === selectedTabId
        ? { ...t, files: [...t.files, `${option} - File ${t.files.length + 1}`] }
        : t
    ));
  };

  // Open assist from nudge
  const openAssist = () => {
    setShowNudge(false);
    setShowAssistPanel(true);
  };

  // Run smart builder (simulated)
  const runSmartBuilder = async () => {
    setAssistState("working");
    // NOTE: simplified — just a timeout instead of real work
    await new Promise((r) => setTimeout(r, 1500));
    setAssistState("done");
  };

  const currentTab = tabs.find((t) => t.id === selectedTabId);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-100)" }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <span style={styles.navLabel}>Wireframe</span>
          <span style={styles.navTitle}>CA Book Builder</span>
        </div>
        <div style={styles.navLinks}>
          <a href="/experiments/ca-books" style={styles.navLink}>Books</a>
          <a href="/experiments/ca-bookbuilder" style={styles.navLinkActive}>Book Builder</a>
        </div>
      </nav>

      <div style={styles.layout}>
        {/* Main Editor */}
        <main style={styles.main}>
          <Card>
            {/* Book Header */}
            <div style={styles.editorHeader}>
              <div>
                <p style={styles.editorLabel}>Book Editor</p>
                <h1 style={styles.editorTitle}>Q1 Board Meeting Materials</h1>
                <p style={styles.editorMeta}>Meeting: February 12, 2026</p>
              </div>
              <div style={styles.headerActions}>
                <Button data-variant="primary">Publish book</Button>
                <Button>⋮</Button>
              </div>
            </div>

            <Divider />

            {/* Editor Tabs */}
            <div style={styles.editorTabs}>
              {(["build", "agenda", "review"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveEditorTab(tab)}
                  style={{
                    ...styles.editorTab,
                    ...(activeEditorTab === tab ? styles.editorTabActive : {}),
                  }}
                >
                  {tab === "build" ? "Build book" : tab === "agenda" ? "Build agenda" : "Review book"}
                </button>
              ))}
            </div>

            <Divider />

            {/* Toolbar */}
            <div style={styles.toolbar}>
              <div style={styles.toolbarLeft}>
                <Button onClick={addTab}>+ Add tab</Button>
                <Button onClick={() => trackAction("Add auto agenda")}>✨ Add auto agenda</Button>
                <Button onClick={() => { setShowAssistPanel(true); trackAction("Smart Builder click"); }}>
                  🪄 Smart Builder
                </Button>
              </div>
              <Button
                onClick={() => {
                  // Quick demo: simulate busy admin
                  setManualActions(["Upload documents", "Import folder", "Add tab"]);
                  setShowNudge(true);
                  setNudgeDismissed(false);
                }}
              >
                Simulate "busy admin"
              </Button>
            </div>

            {/* Canvas */}
            <div style={styles.canvas}>
              {/* Tab List */}
              <div style={styles.tabList}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTabId(tab.id)}
                    style={{
                      ...styles.tabItem,
                      ...(selectedTabId === tab.id ? styles.tabItemActive : {}),
                    }}
                  >
                    <span style={styles.tabDrag}>⋮⋮</span>
                    <span>{tab.name}</span>
                    <span style={styles.tabFileCount}>{tab.files.length} files</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {currentTab && (
                <Card style={{ marginTop: "var(--space-4)" }}>
                  <div style={styles.tabHeader}>
                    <div>
                      <p style={styles.tabLabel}>Tab {tabs.indexOf(currentTab) + 1}</p>
                      <p style={styles.tabName}>{currentTab.name}</p>
                    </div>
                    <div style={styles.tabActions}>
                      {/* Upload Dropdown */}
                      <div style={{ position: "relative" }}>
                        <Button onClick={() => setUploadMenuOpen(!uploadMenuOpen)}>
                          ↑ Upload ▾
                        </Button>
                        {uploadMenuOpen && (
                          <>
                            <div style={styles.menuBackdrop} onClick={() => setUploadMenuOpen(false)} />
                            <div style={styles.menu}>
                              {UPLOAD_OPTIONS.map((opt) => (
                                <button
                                  key={opt}
                                  style={styles.menuItem}
                                  onClick={() => handleUpload(opt)}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <Button>⋮</Button>
                    </div>
                  </div>

                  <Divider />

                  {/* Drop Zone */}
                  <div style={styles.dropZone}>
                    {currentTab.files.length === 0 ? (
                      <p style={styles.dropText}>Drop files here or select source</p>
                    ) : (
                      <div style={styles.fileList}>
                        {currentTab.files.map((file, idx) => (
                          <div key={idx} style={styles.fileItem}>
                            <span>📄</span>
                            <span>{file}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Nudge (appears after threshold actions) */}
                  {/* NOTE: simplified nudge — in production would have animation */}
                  {showNudge && !nudgeDismissed && !showAssistPanel && (
                    <div style={styles.nudge}>
                      <button style={styles.nudgeMain} onClick={openAssist}>
                        <span>✨</span>
                        <div>
                          <p style={styles.nudgeTitle}>
                            Looks like you're assembling manually — Smart Book Builder can draft tabs + place materials.
                          </p>
                          <p style={styles.nudgeHint}>
                            Estimated time saved: ~45–90 mins (and fewer missing sections).
                          </p>
                        </div>
                      </button>
                      <button
                        style={styles.nudgeDismiss}
                        onClick={() => setNudgeDismissed(true)}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Action Tracker */}
                  <div style={styles.tracker}>
                    <span style={styles.trackerLabel}>
                      Manual actions: <strong>{manualActions.length}</strong>
                      {" "}· Tabs: <strong>{tabs.length}</strong>
                    </span>
                    {manualActions.length > 0 && (
                      <div style={styles.actionTags}>
                        {manualActions.slice(-4).map((a, i) => (
                          <span key={i} style={styles.actionTag}>{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </Card>

          <p style={styles.footerNote}>
            Wireframe note: This is a simplified grayscale prototype for UX exploration.
          </p>
        </main>

        {/* Assist Panel (slides in from right) */}
        {/* NOTE: simplified panel — in production would have proper animation */}
        {showAssistPanel && (
          <>
            <div style={styles.panelBackdrop} onClick={() => { setShowAssistPanel(false); setAssistState("idle"); }} />
            <aside style={styles.assistPanel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelTitle}>
                    {assistState === "done"
                      ? "Smart Book Builder is ready"
                      : assistState === "working"
                      ? "Building your book…"
                      : "Smart Book Builder"}
                  </p>
                  <p style={styles.panelSubtitle}>
                    {assistState === "done"
                      ? "I prepared a draft structure for review."
                      : assistState === "working"
                      ? "Drafting structure and placing materials…"
                      : "I can draft tabs, place materials, and create agenda links based on your recent actions."}
                  </p>
                </div>
                <Button onClick={() => { setShowAssistPanel(false); setAssistState("idle"); }}>×</Button>
              </div>

              <Divider />

              <div style={styles.panelContent}>
                {/* What I noticed */}
                <div style={styles.noticeBox}>
                  <p style={styles.noticeTitle}>What I noticed</p>
                  <p style={styles.noticeText}>
                    You've done several manual steps that Smart Book Builder can automate.
                  </p>
                  <div style={styles.signalTags}>
                    {manualActions.length >= 2 && <span style={styles.signalTag}>Multiple manual uploads</span>}
                    {tabs.length >= 2 && <span style={styles.signalTag}>Tabs created manually</span>}
                    <span style={styles.signalTag}>Still in Build book</span>
                  </div>
                </div>

                {/* Working indicator */}
                {assistState === "working" && (
                  <div style={styles.workingBox}>
                    <span style={styles.workingDot}>●</span>
                    <span style={styles.workingDot}>●</span>
                    <span style={styles.workingDot}>●</span>
                    <span style={styles.workingText}>Drafting structure • placing materials…</span>
                  </div>
                )}

                {/* Done state */}
                {assistState === "done" && (
                  <div style={styles.resultBox}>
                    <div style={styles.resultItem}>
                      <p style={styles.resultTitle}>✓ Draft structure created</p>
                      <p style={styles.resultText}>Tabs created and materials placed into draft structure.</p>
                      <p style={styles.resultMeta}>Estimated time saved: ~45 minutes</p>
                    </div>
                    <div style={styles.resultItem}>
                      <p style={styles.resultTitle}>✓ Agenda links prepared</p>
                      <p style={styles.resultText}>Suggested mapping of agenda items to materials is ready.</p>
                    </div>
                    <div style={styles.actionNeeded}>
                      <p style={styles.actionTitle}>Action needed</p>
                      <p style={styles.actionText}>Review before applying changes.</p>
                      <div style={styles.actionButtons}>
                        <Button data-variant="primary">Review draft</Button>
                        <Button>Undo</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Idle state actions */}
                {assistState === "idle" && (
                  <div style={styles.assistActions}>
                    <Button onClick={() => { setShowAssistPanel(false); setAssistState("idle"); }}>
                      Not now
                    </Button>
                    <Button data-variant="primary" onClick={runSmartBuilder}>
                      ✨ Assemble draft
                    </Button>
                  </div>
                )}
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inline Styles
// ─────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3) var(--space-6)", borderBottom: "1px solid var(--color-gray-200)", background: "var(--color-white)" },
  navInner: { display: "flex", alignItems: "center", gap: "var(--space-3)" },
  navLabel: { fontSize: "var(--text-xs)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gray-400)" },
  navTitle: { fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-gray-900)" },
  navLinks: { display: "flex", gap: "var(--space-2)" },
  navLink: { padding: "var(--space-1) var(--space-3)", fontSize: "var(--text-xs)", color: "var(--color-gray-600)", textDecoration: "none", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-gray-200)" },
  navLinkActive: { padding: "var(--space-1) var(--space-3)", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-gray-900)", textDecoration: "none", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-gray-300)", background: "var(--color-white)" },

  layout: { maxWidth: "1200px", margin: "0 auto", padding: "var(--space-6)" },
  main: { flex: 1 },

  editorHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "var(--space-4)" },
  editorLabel: { fontSize: "var(--text-xs)", color: "var(--color-gray-500)" },
  editorTitle: { fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-gray-900)", marginTop: "var(--space-1)" },
  editorMeta: { fontSize: "var(--text-sm)", color: "var(--color-gray-600)", marginTop: "var(--space-1)" },
  headerActions: { display: "flex", gap: "var(--space-2)" },

  editorTabs: { display: "flex", gap: "var(--space-6)", padding: "0 var(--space-4)", paddingTop: "var(--space-3)" },
  editorTab: { paddingBottom: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-gray-500)", background: "none", border: "none", borderBottom: "2px solid transparent", cursor: "pointer" },
  editorTabActive: { fontWeight: 600, color: "var(--color-gray-900)", borderBottomColor: "var(--color-gray-700)" },

  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-4)", flexWrap: "wrap", gap: "var(--space-3)" },
  toolbarLeft: { display: "flex", gap: "var(--space-2)", flexWrap: "wrap" },

  canvas: { padding: "var(--space-4)", background: "var(--color-gray-50)", borderRadius: "0 0 var(--radius-lg) var(--radius-lg)" },

  tabList: { display: "flex", flexDirection: "column", gap: "var(--space-2)" },
  tabItem: { display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", background: "var(--color-white)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-lg)", cursor: "pointer", textAlign: "left" },
  tabItemActive: { background: "var(--color-gray-100)", borderColor: "var(--color-gray-300)" },
  tabDrag: { color: "var(--color-gray-400)", fontSize: "var(--text-sm)" },
  tabFileCount: { marginLeft: "auto", fontSize: "var(--text-xs)", color: "var(--color-gray-500)" },

  tabHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3) var(--space-4)" },
  tabLabel: { fontSize: "var(--text-xs)", color: "var(--color-gray-500)" },
  tabName: { fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-gray-900)" },
  tabActions: { display: "flex", gap: "var(--space-2)" },

  dropZone: { margin: "var(--space-4)", padding: "var(--space-6)", border: "2px dashed var(--color-gray-300)", borderRadius: "var(--radius-lg)", background: "var(--color-white)", textAlign: "center" },
  dropText: { fontSize: "var(--text-sm)", color: "var(--color-gray-500)" },
  fileList: { display: "flex", flexDirection: "column", gap: "var(--space-2)", textAlign: "left" },
  fileItem: { display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "var(--space-2)", background: "var(--color-gray-50)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", color: "var(--color-gray-700)" },

  nudge: { margin: "var(--space-4)", padding: "var(--space-3)", background: "var(--color-gray-100)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-3)" },
  nudgeMain: { display: "flex", alignItems: "flex-start", gap: "var(--space-2)", flex: 1, textAlign: "left", background: "none", border: "none", cursor: "pointer" },
  nudgeTitle: { fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-gray-900)" },
  nudgeHint: { fontSize: "var(--text-xs)", color: "var(--color-gray-600)", marginTop: "var(--space-1)" },
  nudgeDismiss: { fontSize: "var(--text-xs)", color: "var(--color-gray-500)", background: "none", border: "none", cursor: "pointer", flexShrink: 0 },

  tracker: { padding: "var(--space-3) var(--space-4)", fontSize: "var(--text-xs)", color: "var(--color-gray-500)" },
  trackerLabel: {},
  actionTags: { display: "flex", flexWrap: "wrap", gap: "var(--space-1)", marginTop: "var(--space-2)" },
  actionTag: { padding: "var(--space-1) var(--space-2)", background: "var(--color-white)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-xl)", fontSize: "var(--text-xs)", color: "var(--color-gray-600)" },

  menuBackdrop: { position: "fixed", inset: 0, zIndex: 40 },
  menu: { position: "absolute", right: 0, top: "100%", marginTop: "var(--space-1)", width: "220px", background: "var(--color-white)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-lg)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 50, padding: "var(--space-2)" },
  menuItem: { display: "block", width: "100%", padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-gray-700)", textAlign: "left", background: "none", border: "none", borderRadius: "var(--radius-md)", cursor: "pointer" },

  panelBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 40 },
  assistPanel: { position: "fixed", right: 0, top: 0, bottom: 0, width: "380px", maxWidth: "100vw", background: "var(--color-white)", borderLeft: "1px solid var(--color-gray-200)", boxShadow: "-4px 0 24px rgba(0,0,0,0.1)", zIndex: 50, display: "flex", flexDirection: "column" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "var(--space-4)", gap: "var(--space-3)" },
  panelTitle: { fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-gray-900)" },
  panelSubtitle: { fontSize: "var(--text-xs)", color: "var(--color-gray-600)", marginTop: "var(--space-1)" },
  panelContent: { flex: 1, overflow: "auto", padding: "var(--space-4)" },

  noticeBox: { padding: "var(--space-3)", background: "var(--color-gray-50)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-lg)" },
  noticeTitle: { fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-gray-900)" },
  noticeText: { fontSize: "var(--text-xs)", color: "var(--color-gray-600)", marginTop: "var(--space-1)" },
  signalTags: { display: "flex", flexWrap: "wrap", gap: "var(--space-1)", marginTop: "var(--space-2)" },
  signalTag: { padding: "var(--space-1) var(--space-2)", background: "var(--color-white)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-xl)", fontSize: "10px", color: "var(--color-gray-600)" },

  workingBox: { display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-4)", padding: "var(--space-3)", background: "var(--color-gray-50)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-lg)" },
  workingDot: { color: "var(--color-gray-400)", fontSize: "var(--text-xs)" },
  workingText: { fontSize: "var(--text-xs)", color: "var(--color-gray-600)" },

  resultBox: { marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" },
  resultItem: { padding: "var(--space-3)", background: "var(--color-white)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-lg)" },
  resultTitle: { fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-gray-900)" },
  resultText: { fontSize: "var(--text-xs)", color: "var(--color-gray-600)", marginTop: "var(--space-1)" },
  resultMeta: { fontSize: "var(--text-xs)", color: "var(--color-gray-500)", marginTop: "var(--space-2)" },

  actionNeeded: { padding: "var(--space-3)", background: "var(--color-gray-100)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-lg)" },
  actionTitle: { fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-gray-900)" },
  actionText: { fontSize: "var(--text-xs)", color: "var(--color-gray-600)", marginTop: "var(--space-1)" },
  actionButtons: { display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)" },

  assistActions: { display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", marginTop: "var(--space-4)" },

  footerNote: { marginTop: "var(--space-10)", fontSize: "var(--text-xs)", color: "var(--color-gray-400)", textAlign: "center" },
};
