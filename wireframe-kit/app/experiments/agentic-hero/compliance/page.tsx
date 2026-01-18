"use client";

/**
 * Global Compliance — Wireframe Kit
 * Simplified grayscale wireframe demonstrating compliance signal UX.
 * NOTE: simplified for wireframe kit — no external dependencies
 */

import React, { useState } from "react";
import { Card } from "../../../../wireframe-primitives/Card";
import { Button } from "../../../../wireframe-primitives/Button";
import { Input } from "../../../../wireframe-primitives/Input";
import { Divider } from "../../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const SIGNAL = {
  id: "GCT-2031",
  title: "STATE CHANGE DETECTED — ENTITY RISK POSTURE UPDATED",
  detail: "A third-party linked to a regional subsidiary changed status. The system updated the entity-level risk node and rolled the impact up to the enterprise risk profile.",
  urgency: "high" as const,
  progress: { completed: 5, total: 8 },
};

const ACTIONS_TAKEN = [
  "Entity hierarchy ingested and modeled (Entities)",
  "Third-party engagements mapped to entity nodes (TPM)",
  "State change detected for linked partner (Sentry)",
  "Node impact calculated + enterprise roll-up (Contextualist)",
  "Risk Event created with executive synthesis (Strategist)",
];

const DECISIONS_NEEDED = [
  { label: "Notify Risk Owners", hint: "Send targeted notifications to impacted owners" },
  { label: "Open Mitigation Plan", hint: "Create governance tasks and tracking" },
  { label: "Publish Executive Summary", hint: "Share board-ready enterprise update" },
];

const SUGGESTIONS = [
  "Show ripple-up impact",
  "View entity map",
  "Draft board summary",
  "Show unresolved events",
];

// ─────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────

export default function CompliancePage() {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeDecision, setActiveDecision] = useState<string | null>(null);
  const [promptValue, setPromptValue] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-100)" }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <span style={styles.navLabel}>Wireframe</span>
          <span style={styles.navTitle}>Agentic Hero</span>
        </div>
        <div style={styles.navLinks}>
          <a href="/experiments/agentic-hero" style={styles.navLink}>Steady State</a>
          <a href="/experiments/agentic-hero/security" style={styles.navLink}>Security</a>
          <a href="/experiments/agentic-hero/whistleblower" style={styles.navLink}>Whistleblower</a>
          <a href="/experiments/agentic-hero/compliance" style={styles.navLinkActive}>Compliance</a>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Hero Header */}
        <header style={styles.header}>
          <h1 style={styles.headline}>You have a global compliance signal to review.</h1>
        </header>

        {/* Signal Card */}
        <Card style={{ marginTop: "var(--space-6)" }}>
          <div style={styles.incidentHeader}>
            <span style={styles.incidentLabel}>Risk-aware digital twin across entities and suppliers</span>
            <span style={styles.urgencyBadge}>
              <span style={styles.urgencyDot} />
              High urgency
            </span>
          </div>

          <div style={styles.incidentBody}>
            <p style={styles.incidentTitle}>{SIGNAL.title}</p>

            {/* Progress bar */}
            <div style={styles.progressRow}>
              <span style={styles.progressText}>
                Agent progress: {SIGNAL.progress.completed} of {SIGNAL.progress.total} steps
              </span>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${(SIGNAL.progress.completed / SIGNAL.progress.total) * 100}%`,
                  }}
                />
              </div>
            </div>

            <p style={styles.incidentDetail}>
              {SIGNAL.detail} <span style={styles.incidentId}>Case ID: {SIGNAL.id}</span>
            </p>

            <div style={styles.incidentActions}>
              {reviewOpen ? (
                <>
                  <span style={styles.reviewingLabel}>Reviewing now</span>
                  <Button onClick={() => setReviewOpen(false)}>Close Review</Button>
                </>
              ) : (
                <>
                  <Button>Assign</Button>
                  <Button data-variant="primary" onClick={() => setReviewOpen(true)}>
                    Review
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Review Panel */}
        {reviewOpen && (
          <Card style={{ marginTop: "var(--space-4)" }}>
            <div style={styles.reviewHeader}>
              <div>
                <span style={styles.reviewLabel}>Compliance Review</span>
                <p style={styles.reviewTitle}>Global compliance signal detected ({SIGNAL.id})</p>
              </div>
              <Button onClick={() => setReviewOpen(false)}>Close</Button>
            </div>

            <Divider />

            {/* Briefing */}
            <div style={styles.section}>
              <p style={styles.sectionLabel}>Monitoring Briefing</p>
              <p style={styles.sectionText}>
                This workspace represents a living map of your legal structure and external dependencies.
                When a supplier's state changes, the system updates the impacted entity node,
                recalculates ripple-up risk to the parent organization, and drafts targeted actions.
              </p>
            </div>

            {/* Actions Taken */}
            <div style={{ ...styles.section, background: "var(--color-gray-50)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)" }}>
              <p style={styles.sectionLabel}>Actions already taken</p>
              <ul style={styles.checkList}>
                {ACTIONS_TAKEN.map((action, i) => (
                  <li key={i} style={styles.checkItem}>✓ {action}</li>
                ))}
              </ul>
              <p style={styles.footnote}>
                No notifications have been sent and nothing has been published. Pending actions require approval.
              </p>
            </div>

            {/* Decisions Needed */}
            <div style={styles.section}>
              <p style={styles.sectionLabel}>Decisions needed from you</p>
              <div style={styles.decisionList}>
                {DECISIONS_NEEDED.map((d) => (
                  <div
                    key={d.label}
                    style={{
                      ...styles.decisionCard,
                      background: activeDecision === d.label ? "var(--color-gray-100)" : "var(--color-white)",
                    }}
                  >
                    <p style={styles.decisionTitle}>{d.label}</p>
                    <p style={styles.decisionHint}>{d.hint}</p>
                    <Button
                      data-variant="primary"
                      onClick={() => setActiveDecision(activeDecision === d.label ? null : d.label)}
                      style={{ marginTop: "var(--space-3)" }}
                    >
                      {activeDecision === d.label ? "Close" : d.label}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Decision Detail */}
            {activeDecision && (
              <div style={{ ...styles.section, background: "var(--color-gray-50)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)" }}>
                <p style={styles.sectionLabel}>{activeDecision}</p>
                <p style={styles.sectionText}>
                  This is a placeholder for the {activeDecision.toLowerCase()} workflow.
                  In the full prototype, this would show a draft document, recipient list, and approval controls.
                </p>
                <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
                  <Button onClick={() => setActiveDecision(null)}>Cancel</Button>
                  <Button data-variant="primary">Approve & Send</Button>
                </div>
              </div>
            )}

            {/* Contextual Prompt */}
            <div style={styles.section}>
              <p style={styles.sectionLabel}>Ask about this signal</p>
              <Input
                placeholder={`Ask a follow-up about ${SIGNAL.id}...`}
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
              />
            </div>

            <div style={styles.monitorNote}>
              <p style={styles.monitorTitle}>Monitoring</p>
              <p style={styles.monitorText}>
                Updates provided hourly and immediately as new information becomes available.
              </p>
            </div>
          </Card>
        )}

        {/* Prompt Box (when review is closed) */}
        {!reviewOpen && (
          <>
            <Divider />
            <Card>
              <p style={styles.promptLabel}>What should we review?</p>
              <Input
                placeholder="Ask about this compliance signal..."
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
              />
              <div style={styles.suggestionRow}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => setPromptValue(s)} style={styles.suggestionChip}>
                    {s}
                  </button>
                ))}
              </div>
            </Card>
          </>
        )}

        <p style={styles.footerNote}>
          Wireframe note: This is a simplified grayscale prototype for UX exploration.
        </p>
      </main>
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
  main: { maxWidth: "860px", margin: "0 auto", padding: "var(--space-8) var(--space-6)" },
  header: { textAlign: "center" },
  headline: { fontSize: "var(--text-3xl)", fontWeight: 600, color: "var(--color-gray-900)" },
  incidentHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" },
  incidentLabel: { fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-gray-900)" },
  urgencyBadge: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", padding: "var(--space-1) var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-gray-700)", background: "var(--color-gray-100)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-gray-200)" },
  urgencyDot: { width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-gray-700)" },
  incidentBody: { background: "var(--color-gray-50)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)" },
  incidentTitle: { fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-gray-900)", marginBottom: "var(--space-2)" },
  progressRow: { display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" },
  progressText: { fontSize: "var(--text-xs)", color: "var(--color-gray-600)" },
  progressBar: { flex: 1, height: "6px", background: "var(--color-gray-200)", borderRadius: "var(--radius-sm)", overflow: "hidden" },
  progressFill: { height: "100%", background: "var(--color-gray-700)", borderRadius: "var(--radius-sm)" },
  incidentDetail: { fontSize: "var(--text-sm)", color: "var(--color-gray-600)" },
  incidentId: { fontWeight: 500, color: "var(--color-gray-700)" },
  incidentActions: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-4)" },
  reviewingLabel: { fontSize: "var(--text-xs)", color: "var(--color-gray-500)" },
  reviewHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  reviewLabel: { fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gray-500)" },
  reviewTitle: { fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-gray-900)", marginTop: "var(--space-1)" },
  section: { marginTop: "var(--space-5)" },
  sectionLabel: { fontSize: "var(--text-xs)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gray-500)", marginBottom: "var(--space-2)" },
  sectionText: { fontSize: "var(--text-sm)", color: "var(--color-gray-700)", lineHeight: 1.6 },
  checkList: { listStyle: "none", padding: 0, margin: 0 },
  checkItem: { fontSize: "var(--text-sm)", color: "var(--color-gray-700)", padding: "var(--space-1) 0" },
  footnote: { fontSize: "var(--text-xs)", color: "var(--color-gray-500)", marginTop: "var(--space-3)" },
  decisionList: { display: "flex", flexDirection: "column", gap: "var(--space-3)" },
  decisionCard: { padding: "var(--space-3)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-lg)" },
  decisionTitle: { fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-gray-800)" },
  decisionHint: { fontSize: "var(--text-sm)", color: "var(--color-gray-600)", marginTop: "var(--space-1)" },
  monitorNote: { marginTop: "var(--space-5)", padding: "var(--space-3)", background: "var(--color-gray-50)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-gray-200)" },
  monitorTitle: { fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-gray-900)" },
  monitorText: { fontSize: "var(--text-sm)", color: "var(--color-gray-600)", marginTop: "var(--space-1)" },
  promptLabel: { fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-gray-900)", marginBottom: "var(--space-3)" },
  suggestionRow: { display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-3)" },
  suggestionChip: { padding: "var(--space-1) var(--space-3)", fontSize: "var(--text-xs)", color: "var(--color-gray-700)", background: "var(--color-gray-50)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-xl)", cursor: "pointer" },
  footerNote: { marginTop: "var(--space-10)", fontSize: "var(--text-xs)", color: "var(--color-gray-400)", textAlign: "center" },
};
