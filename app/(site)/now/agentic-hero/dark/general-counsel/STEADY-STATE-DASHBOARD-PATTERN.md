# Steady-State Dashboard Pattern

A reusable design pattern for persona-based "agentic hero" dashboards that communicate calm confidence when systems are running smoothly.

---

## Core Concept

The **Steady-State Dashboard** is a home screen pattern for when everything is working well. Instead of showing alerts, warnings, or urgent actions, it communicates:

> "Your [domain] is in good shape. Agents are quietly monitoring. Here's how to get ahead."

This is the opposite of a crisis dashboard. It builds trust by showing that AI agents are working in the background, and positions the user to do proactive, strategic work rather than reactive firefighting.

---

## When to Use This Pattern

- **Primary persona home screens** (General Counsel, CISO, Chief Compliance Officer, etc.)
- **"Good news" states** where monitoring agents have nothing urgent to report
- **Trust-building moments** to demonstrate AI value without requiring user action
- **Vision demos** showing near-term vs. future AI capabilities

---

## Anatomy of the Dashboard

### 1. Hero Header

A large, calm statement that sets the tone.

**Near-term example:**
> "Your legal portfolio is in good shape."
> "All matters on track, contracts monitored, and compliance current."

**Future vision example:**
> "Your AI legal workforce is optimizing outcomes."
> "Predictive models are active, autonomous recommendations are ready."

**Design notes:**
- Centered text, large font (4xl on desktop, xl on mobile)
- Subtle gradient background in future vision mode
- Optional: Summary metrics in future vision (e.g., "3 AI Actions", "73% Confidence", "$240K Savings")

---

### 2. Agent Ticker Strip

A horizontally scrolling strip showing background monitoring agents. This is the "proof of work" that justifies the calm state.

**Structure per agent:**
```
[Agent Name] · Last [time ago], next [future time]
```

**Example agents for General Counsel:**
| Agent Name | What It Monitors |
|------------|------------------|
| Matter Monitor | Active litigation, court filings, deadline proximity |
| Contract Intelligence | Contract renewals, obligation deadlines, term deviations |
| Regulatory Watch | New regulations, enforcement actions, comment periods |
| Corporate Governance | Board meeting prep, D&O compliance, subsidiary audits |
| Legal Hold Manager | Hold acknowledgments, custodian compliance, preservation |

**Interaction:**
- Hover pauses the ticker
- Hover on agent name shows popover with:
  - Current status note
  - List of monitoring criteria
  - "Edit agent" and "View activity" actions

**Vision differentiation:**
- **Near-term**: Criteria are monitoring-focused ("New court filings", "Renewal date tracking")
- **Future**: Criteria are AI-action-focused ("Predicted litigation outcomes", "AI-drafted negotiation positions")

---

### 3. AI Prompt Box

A prominent input area for directing the AI assistant.

**Structure:**
- Headline describing what the AI can do
- Large textarea with placeholder example
- Quick-action pill buttons for common tasks
- "Clear" and "Run task" (or "Execute" in future) buttons

**Near-term prompts:**
- "Prep board materials"
- "Check entity filings"  
- "Policy attestation status"
- "Generate legal KPIs"

**Future prompts:**
- "Predict case outcomes"
- "Auto-draft board book"
- "Autonomous entity filings"
- "Proactive policy updates"

**Mobile adaptation:**
- Replace full prompt box with compact button: "Ask Diligent AI → Tap to start"

---

### 4. Pending Actions Module

**Near-term version: Approval Queue**
Show items prepared by the system awaiting human approval.

Example for GC: Entity filings ready to submit
```
┌─────────────────────────────────────────────────────────────┐
│ 🟠 Regulatory filings ready for your approval               │
│    Prepared by Entities · Review and approve to submit      │
├─────────────────────────────────────────────────────────────┤
│ ● Acme Holdings, Inc. · Delaware Annual Report              │
│   Delaware · Due Mar 1, 2025 · Fee: $225                    │
│                                    [Review] [Approve & Submit]│
├─────────────────────────────────────────────────────────────┤
│ ● Acme West LLC · Statement of Information                  │
│   California · Due Feb 15, 2025 · Fee: $20                  │
│                                    [Review] [Approve & Submit]│
└─────────────────────────────────────────────────────────────┘
│ Total filing fees: $395              [Approve all filings →] │
```

**Future version: Cross-Platform Risk Signals**
Show requests for the persona's expertise from other parts of the organization.

Example for GC: Risk signals requesting legal input
```
┌─────────────────────────────────────────────────────────────┐
│ 🟣 Cross-Diligent risk signals awaiting your input          │
│    Your legal perspective is needed across the enterprise   │
├─────────────────────────────────────────────────────────────┤
│ [Risk Manager] [High Impact]                                │
│ Litigation exposure assessment needed                       │
│ Q1 risk register update requires your input on active       │
│ matter reserves and potential new claims.                   │
│ Requested by Chief Risk Officer · Due Jan 24                │
│                                              [Contribute]    │
└─────────────────────────────────────────────────────────────┘
│ AI Insight: Your legal risk assessments will automatically  │
│ propagate to Risk Manager, updating the enterprise risk     │
│ register in real-time.                                      │
```

---

### 5. Recent Apps / AI Workspace

Quick access to recently used applications with context on last activity.

**Card structure:**
```
[App Name]                                    [Last Used]
Description of last activity in this app
```

**Near-term examples:**
- Boards: "Finalized Q1 board meeting agenda and uploaded supporting materials"
- Entities: "Verified annual report filings for 3 subsidiaries"
- Policy Manager: "Reviewed attestation status for updated Code of Conduct"

**Future examples (with AI tags):**
- AI Legal Workspace [AI-Managed]: "Your autonomous agents handled 12 routine matters this week"
- Predictive Analytics [Auto-Updated]: "Updated litigation outcome models reflect recent case law"
- Autonomous Filings [Agent Action]: "3 annual reports auto-filed; 2 more awaiting approval"

---

### 6. Proactive Actions Section

Since everything is calm, suggest ways to get ahead.

**Near-term framing:**
> "Since everything's under control, get ahead of a few things"

**Future framing:**
> "AI-recommended actions awaiting your approval"

**Card structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Action Title]                              [AI-Generated]  │
│ Detail about what to do and why                             │
│ [App Badge] Ready to complete                               │
│                                           [Open in app]     │
└─────────────────────────────────────────────────────────────┘
```

**Example near-term actions:**
- "Finalize board book for Q1 meeting" → Opens in Boards
- "Review subsidiary compliance calendar" → Opens in Entities
- "Follow up on policy attestations" → Opens in Policy Manager

**Example future actions:**
- "Review AI-generated settlement recommendations" [AI-Generated]
- "Approve autonomous contract negotiations" [Auto-Draft Ready]
- "Validate predictive regulatory impact analysis" [Predictive]

---

### 7. What's New Sidebar

Educational content about features (near-term) or roadmap capabilities (future).

**Near-term: "Good to Know & Good to Go"**
- Feature highlights users may not know about
- Links to learn more

**Future: "On the AI Roadmap"**
- Upcoming AI capabilities
- Vision for autonomous workflows

---

### 8. Activity Log Footer

System transparency showing recent background activity.

**Near-term examples:**
- "Boards: Q1 board book updated—3 new documents added by CFO"
- "Entities: Annual report reminder sent for Delaware subsidiaries"
- "Policy Manager: Code of Conduct attestation at 94%"

**Future examples (cross-platform):**
- "Risk Manager → Legal: Litigation exposure input requested"
- "Matter Monitor: Predictive model updated—Smith v. Acme settlement probability now 73%"
- "Your risk input auto-synced to enterprise risk register (3 items updated)"

---

## Vision Toggle Pattern

The dashboard supports two modes toggled by a pill control:

| Aspect | Near-term Vision | 1 Year+ Vision |
|--------|------------------|----------------|
| **Tone** | Helpful assistant | Autonomous workforce |
| **Agent role** | Monitoring & alerting | Predicting & acting |
| **User role** | Directing & approving | Reviewing & validating |
| **Action language** | "Run task" | "Execute" |
| **Color accent** | Blue (#58a6ff) | Purple (#a371f7) |
| **Tags** | App names | AI capability tags |

---

## Design Tokens (Dark Theme)

```css
/* Backgrounds */
--bg-page: #0d1117;
--bg-card: #161b22;
--bg-elevated: #21262d;

/* Borders */
--border-default: #30363d;
--border-accent-blue: rgba(88, 166, 255, 0.5);
--border-accent-purple: rgba(163, 113, 247, 0.4);

/* Text */
--text-primary: #f0f6fc;
--text-secondary: #8b949e;
--text-tertiary: #6e7681;

/* Accents */
--accent-blue: #58a6ff;
--accent-purple: #a371f7;
--accent-green: #3fb950;
--accent-orange: #f0883e;
--accent-red: #da3633;

/* Spacing */
--radius-sm: 0.5rem;    /* 8px - small elements */
--radius-md: 0.75rem;   /* 12px - buttons, inputs */
--radius-lg: 1rem;      /* 16px - cards */
--radius-xl: 1.5rem;    /* 24px - large cards, sections */
```

---

## Responsive Breakpoints

| Device | Behavior |
|--------|----------|
| **Desktop** | Full layout, all sections visible, 2-column grids |
| **iPad** | Slightly condensed, single-column where needed, all content visible |
| **iPhone** | Compact cards, hidden ticker, simplified prompt button, truncated lists with "View more" |

---

## Adapting for Other Personas

### CISO Dashboard

**Agents:**
- Threat Intelligence Monitor
- Vulnerability Scanner
- Access Anomaly Detector
- Compliance Posture Checker
- Incident Response Coordinator

**Hero message:**
> "Your security posture is strong. No active threats detected."

**Pending actions (near-term):**
- Security patches awaiting approval
- Access reviews due this week

**Risk signals (future):**
- Cross-platform security posture requests
- Risk quantification inputs needed

---

### Chief Compliance Officer Dashboard

**Agents:**
- Policy Compliance Monitor
- Training Completion Tracker
- Regulatory Change Scanner
- Whistleblower Case Monitor
- Audit Readiness Checker

**Hero message:**
> "Compliance is current across all programs."

**Pending actions:**
- Policy attestations awaiting final approvals
- Training deadline reminders to send

---

### Board Director Dashboard

**Agents:**
- Meeting Preparation Monitor
- Document Update Tracker
- Resolution Status Monitor
- Committee Activity Summarizer

**Hero message:**
> "You're prepared for the upcoming board meeting."

**Pending actions:**
- Documents to review before meeting
- Consent agenda items awaiting your vote

---

## Implementation Checklist

- [ ] Define 4-6 background monitoring agents for the persona
- [ ] Write near-term and future criteria for each agent
- [ ] Create hero message variants for both visions
- [ ] Design pending actions module (approval queue + risk signals)
- [ ] Populate recent apps with realistic last-activity descriptions
- [ ] Write proactive action cards with app routing
- [ ] Add activity log entries showing system transparency
- [ ] Test responsive layouts (desktop, iPad, iPhone)
- [ ] Implement vision toggle with appropriate color theming

---

## Reference Implementation

See the General Counsel dashboard:
```
/app/now/agentic-hero/dark/general-counsel/page.tsx
```

This is a ~1,450 line React component demonstrating the full pattern with all sections, vision toggle, device preview frames, and responsive adaptations.

---

## Key Design Principles

1. **Calm confidence** — The dashboard should feel reassuring, not overwhelming
2. **Proof of work** — Show that agents are actively monitoring, even when quiet
3. **Proactive positioning** — Guide users toward strategic work, not reactive tasks
4. **Vision differentiation** — Make the future feel distinctly more autonomous
5. **Graceful degradation** — Mobile views should feel complete, not truncated
6. **Transparency** — Activity logs build trust by showing what's happening behind the scenes
