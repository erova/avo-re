"use client";

/**
 * Agentic Hero — Wireframe Kit
 * Simplified grayscale wireframe demonstrating the core UX concept.
 * NOTE: simplified for wireframe kit — no external dependencies, no complex hooks
 */

import React, { useState } from "react";
import { Card } from "../../../wireframe-primitives/Card";
import { Button } from "../../../wireframe-primitives/Button";
import { Input } from "../../../wireframe-primitives/Input";
import { Divider } from "../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Mock Data (local to this file)
// ─────────────────────────────────────────────────────────────

const AGENTS = [
  { name: "Entity Monitor", lastRun: "8 min ago", status: "Active" },
  { name: "Policy Drift Watch", lastRun: "31 min ago", status: "Stable" },
  { name: "Third-Party Sentinel", lastRun: "45 min ago", status: "Active" },
  { name: "Investigation Triage", lastRun: "1 hr ago", status: "Standing by" },
];

const RECENT_APPS = [
  { name: "Entities", detail: "Reviewed entity map for structural updates" },
  { name: "Risk Manager", detail: "Checked open items; all risks in normal range" },
  { name: "Policy Manager", detail: "Confirmed policy review cadence is current" },
];

const SUGGESTIONS = [
  "Analyze coverage gaps",
  "Map entity–vendor links",
  "Assess audit readiness",
  "Generate recommendations",
];

const ACTIVITY_LOG = [
  "All monitoring agents completed successfully.",
  "No escalations in the last 24 hours.",
  "Entity inventory synced without changes.",
  "Third-party watchlist refresh completed.",
];

// ─────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────

export default function AgenticHeroPage() {
  const [activityOpen, setActivityOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
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
          <a href="/experiments/agentic-hero" style={styles.navLinkActive}>Steady State</a>
          <a href="/experiments/agentic-hero/security" style={styles.navLink}>Security</a>
          <a href="/experiments/agentic-hero/whistleblower" style={styles.navLink}>Whistleblower</a>
          <a href="/experiments/agentic-hero/compliance" style={styles.navLink}>Compliance</a>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Hero Header */}
        <header style={styles.header}>
          <h1 style={styles.headline}>Everything looks good right now.</h1>
          <p style={styles.subhead}>
            Calm periods are a good time to validate coverage, map dependencies, and generate recommendations.
          </p>
        </header>

        {/* Agent Ticker */}
        <Card style={{ marginTop: "var(--space-6)" }}>
          <div style={styles.tickerHeader}>
            <span style={styles.tickerLabel}>Active Agents</span>
            <Button onClick={() => setActivityOpen(!activityOpen)}>
              {activityOpen ? "Hide Activity" : "View Activity"}
            </Button>
          </div>

          <div style={styles.agentList}>
            {AGENTS.map((agent) => (
              <button
                key={agent.name}
                onClick={() => setSelectedAgent(selectedAgent === agent.name ? null : agent.name)}
                style={{
                  ...styles.agentChip,
                  background: selectedAgent === agent.name ? "var(--color-gray-200)" : "var(--color-white)",
                }}
              >
                <span style={styles.agentName}>{agent.name}</span>
                <span style={styles.agentMeta}>· {agent.lastRun}</span>
              </button>
            ))}
          </div>

          {/* Agent Detail (expands when clicked) */}
          {selectedAgent && (
            <div style={styles.agentDetail}>
              <Divider />
              <p style={styles.detailTitle}>{selectedAgent}</p>
              <p style={styles.detailText}>
                Status: {AGENTS.find((a) => a.name === selectedAgent)?.status}
              </p>
              <p style={styles.detailText}>
                This agent monitors for changes and will alert you if action is needed.
              </p>
              <div style={{ marginTop: "var(--space-3)", display: "flex", gap: "var(--space-2)" }}>
                <Button>Edit Agent</Button>
                <Button>View History</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Activity Log (toggle panel) */}
        {activityOpen && (
          <Card style={{ marginTop: "var(--space-4)" }}>
            <div style={styles.activityHeader}>
              <span style={styles.tickerLabel}>Recent System Activity</span>
              <Button onClick={() => setActivityOpen(false)}>Close</Button>
            </div>
            <ul style={styles.activityList}>
              {ACTIVITY_LOG.map((entry, i) => (
                <li key={i} style={styles.activityItem}>
                  <span style={styles.activityDot} />
                  {entry}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Divider />

        {/* Prompt Box */}
        <Card>
          <p style={styles.promptLabel}>Prompt the AI to get to work</p>
          <p style={styles.promptHint}>
            Use downtime to analyze gaps, generate recommendations, or map coverage.
          </p>
          <div style={{ marginTop: "var(--space-4)" }}>
            <Input
              placeholder="e.g., Show me coverage gaps across entities and third parties"
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
            />
          </div>
          <div style={styles.suggestionRow}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setPromptValue(s)}
                style={styles.suggestionChip}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={styles.promptActions}>
            <Button onClick={() => setPromptValue("")}>Clear</Button>
            <Button data-variant="primary">Run Task</Button>
          </div>
        </Card>

        <Divider />

        {/* Recent Apps */}
        <section>
          <h2 style={styles.sectionTitle}>Pick up where you left off</h2>
          <div style={styles.appGrid}>
            {RECENT_APPS.map((app) => (
              <Card key={app.name}>
                <p style={styles.appName}>{app.name}</p>
                <p style={styles.appDetail}>{app.detail}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <p style={styles.footerNote}>
          Wireframe note: This is a simplified grayscale prototype for UX exploration.
        </p>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inline Styles (grayscale only, no external CSS)
// ─────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "var(--space-3) var(--space-6)",
    borderBottom: "1px solid var(--color-gray-200)",
    background: "var(--color-white)",
  },
  navInner: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
  },
  navLabel: {
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--color-gray-400)",
  },
  navTitle: {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  },
  navLinks: {
    display: "flex",
    gap: "var(--space-2)",
  },
  navLink: {
    padding: "var(--space-1) var(--space-3)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-600)",
    textDecoration: "none",
    borderRadius: "var(--radius-xl)",
    border: "1px solid var(--color-gray-200)",
  },
  navLinkActive: {
    padding: "var(--space-1) var(--space-3)",
    fontSize: "var(--text-xs)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    textDecoration: "none",
    borderRadius: "var(--radius-xl)",
    border: "1px solid var(--color-gray-300)",
    background: "var(--color-white)",
  },
  main: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "var(--space-8) var(--space-6)",
  },
  header: {
    textAlign: "center",
  },
  headline: {
    fontSize: "var(--text-3xl)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-3)",
  },
  subhead: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-500)",
  },
  tickerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--space-3)",
  },
  tickerLabel: {
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--color-gray-500)",
  },
  agentList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--space-2)",
  },
  agentChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-2)",
    padding: "var(--space-2) var(--space-3)",
    fontSize: "var(--text-sm)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
  },
  agentName: {
    fontWeight: 500,
    color: "var(--color-gray-800)",
  },
  agentMeta: {
    color: "var(--color-gray-500)",
  },
  agentDetail: {
    marginTop: "var(--space-4)",
  },
  detailTitle: {
    fontSize: "var(--text-base)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-2)",
  },
  detailText: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
    marginBottom: "var(--space-1)",
  },
  activityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--space-3)",
  },
  activityList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  activityItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--space-3)",
    padding: "var(--space-2) 0",
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-700)",
  },
  activityDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--color-gray-400)",
    marginTop: "6px",
    flexShrink: 0,
  },
  promptLabel: {
    fontSize: "var(--text-lg)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-1)",
  },
  promptHint: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
  },
  suggestionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--space-2)",
    marginTop: "var(--space-3)",
  },
  suggestionChip: {
    padding: "var(--space-1) var(--space-3)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-700)",
    background: "var(--color-gray-50)",
    border: "1px solid var(--color-gray-200)",
    borderRadius: "var(--radius-xl)",
    cursor: "pointer",
  },
  promptActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "var(--space-2)",
    marginTop: "var(--space-4)",
  },
  sectionTitle: {
    fontSize: "var(--text-xl)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-4)",
  },
  appGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "var(--space-4)",
  },
  appName: {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
    marginBottom: "var(--space-1)",
  },
  appDetail: {
    fontSize: "var(--text-sm)",
    color: "var(--color-gray-600)",
  },
  footerNote: {
    marginTop: "var(--space-10)",
    fontSize: "var(--text-xs)",
    color: "var(--color-gray-400)",
    textAlign: "center",
  },
};
