# avo-re - Context for Claude

## Current State
- Last updated: February 2, 2026
- Project: Portfolio/prototype site at avo.re

## VibeSharing Integration

**After deploying or creating a new prototype**, automatically register it with VibeSharing:

```bash
curl -X POST https://vibesharing.app/api/prototypes \
  -H "Authorization: Bearer $VIBESHARING_DEPLOY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PROTOTYPE_NAME",
    "external_url": "https://www.avo.re/PATH_TO_PROTOTYPE",
    "description": "BRIEF_DESCRIPTION"
  }'
```

**Token:** Stored in `.env.local` as `VIBESHARING_DEPLOY_TOKEN`

**After registering**, tell the user:
- The prototype is now in VibeSharing
- Share the `feedback_url` from the response for stakeholder feedback

**Context:**
- avo.re and vibesharing.app are sibling sites (same owner, different purposes)
- VibeSharing adds feedback/handoff tracking on top of prototypes hosted here
- Optional: include `parent_project_id` to link under an existing VibeSharing project

## What Was Built This Session

### General Counsel Command Center - Deep Work Canvases (February 2, 2026)

Enhanced the General Counsel dashboard at `/now/agentic-hero/dark/general-counsel` with 6 immersive "canvas" experiences that enable users to complete complex tasks without leaving Diligent:

1. **Workflow Canvas** (`canvases.tsx` → `WorkflowCanvas`)
   - Multi-step wizard for complex tasks (e.g., "Prepare board materials")
   - 4-step process: Define Objective → Gather Context → Draft & Review → Finalize
   - AI gathers relevant documents/data automatically
   - Suggested workflow templates included
   - AI chat sidebar for iterative refinement

2. **Document Canvas** (`DocumentCanvas`)
   - Draft/create/review legal documents with AI assistance
   - Templates: Legal Memo, Contract Review, Board Resolution, Policy Draft, Legal Letter, Executive Brief
   - Situation-triggered workflows ("respond to regulatory inquiry")
   - AI suggestions sidebar
   - Save to Boards integration

3. **Reporting Canvas** (`ReportingCanvas`)
   - Natural language queries for governance analytics
   - "Show me board attendance trends over 4 quarters"
   - "Compare our board composition to peer group"
   - Visual charts with AI-generated insights
   - Export to PDF / Add to Board Book

4. **AI Search Canvas** (`SearchCanvas`)
   - Cross-system search: "Who owns the vendor relationship with Acme Corp?"
   - Searches: Boards, Entities, Policy Manager, Third Party Manager, Risk Manager, Activity Center
   - AI-summarized results with source attribution
   - Relevance scoring per result

5. **Meeting Scheduler Canvas** (`MeetingCanvas`)
   - "Schedule a board prep sync with CFO"
   - AI finds optimal times, shows attendee availability
   - **Key feature**: AI proactively moved a low-priority meeting to open preferred time slot
   - Sends calendar invites automatically

6. **Email Draft Canvas** (`EmailCanvas`)
   - Draft emails with secure Board material references
   - **Security**: Board materials shared via secure links, NOT as attachments
   - Templates: Board Meeting Prep, Director Update, Committee Notice
   - AI writing assistant for tone/length adjustments
   - Audit trail when recipients access materials

### Key Design Principles
- **Deep Work Mode**: Each canvas is full-screen, immersive—no distractions
- **Stay in Diligent**: Complete tasks that would normally require Outlook, Word, etc.
- **AI as Agent**: AI doesn't just answer questions—it takes actions (schedules meetings, drafts documents, gathers context)
- **Secure by Design**: Board materials never emailed as attachments
- **Intent Detection**: Prompt box routes to appropriate canvas based on natural language

### Entry Points
- Enhanced PromptBox with text input + 6 action buttons
- Intent detection routes typed queries to appropriate canvas
- Mobile-optimized quick actions for iPhone view

### Previous Session: Compliance Command Center (Near-term Vision)
Built 5 role-based dashboards for Diligent compliance personas at `/now/agentic-hero/dark/`:

1. **CCO** (`/compliance-cco`)
   - Focus: Program defensibility, board readiness, DOJ framework alignment, culture oversight
   - Agents: Program Health Monitor, Regulatory Watch, Culture Pulse, Third-Party Risk Aggregator, Policy Effectiveness Tracker
   - Primary queue: Board presentations, high-risk escalations
   - Apps: Diligent 360, Policy Manager, Third Party Manager, Vault

2. **Compliance Director** (`/compliance-director`)
   - Focus: Operational management, policy workflows, attestation campaigns, vendor onboarding
   - Agents: Policy Lifecycle Tracker, Attestation Monitor, Onboarding Queue Manager, Training Deployment, Deadline Alerter
   - Primary queue: Policies awaiting approval, overdue DDQs
   - Apps: Policy Manager, Third Party Manager, Compliance Education, Activity Center

3. **Investigations Lead** (`/compliance-investigations`)
   - Focus: Case triage, investigation management, retaliation monitoring, trend analysis
   - Agents: Intake Classifier, Case Priority Scorer, Investigation Timeline, Retaliation Monitor, Trend Analyzer
   - Primary queue: Cases requiring triage, SLA tracking
   - Apps: Vault, Case Management, Activity Center

4. **Compliance Analyst** (`/compliance-analyst`)
   - Focus: Hands-on policy drafting, attestation follow-up, DDQ tracking, evidence gathering
   - Agents: Policy Drafter, Attestation Tracker, DDQ Response Monitor, Training Coordinator, Evidence Collector
   - Primary queue: Policies in draft, DDQ responses, training reminders
   - Apps: Policy Manager, Third Party Manager, Compliance Education

5. **Corporate Secretary** (`/compliance-entity`)
   - Focus: Entity management, filing deadlines, KYC/audit requests, structure changes
   - Agents: Filing Deadline Monitor, Jurisdiction Compliance, Data Accuracy Validator, KYC Request Fulfiller, Structure Change Assistant
   - Primary queue: Filings due, KYC packages, officer updates
   - Apps: Entities

### Audit Command Center (Near-term Vision)
Built 4 role-based dashboards for Diligent audit personas at `/now/agentic-hero/dark/`:

1. **Audit Executive** (`/audit-executive`)
   - Focus: Strategic oversight, board relationships, enterprise risk, budget
   - Agents: Audit Universe Monitor, Risk Assessment Engine, Regulatory Watch, Execution Tracker, Findings Manager
   - Primary queue: Risk assessments awaiting CAE approval
   - Apps: Diligent 360, Diligent Audit, Activity Center, Impact Reports

2. **Audit Manager** (`/audit-manager`)
   - Focus: Team management, quality review, capacity planning, engagement supervision
   - Agents: Workload Balancer, Quality Review Agent, Anomaly Detector, Finding Composer, Progress Tracker
   - Primary queue: Workpapers awaiting manager sign-off
   - Apps: Diligent Audit, Assessments, ACL Analytics, Activity Center

3. **Auditor** (`/auditor`)
   - Focus: Hands-on execution, testing, evidence collection, documentation
   - Agents: Evidence Tracker, Testing Assistant, Documentation Helper, Finding Drafter, Interview Prep
   - Primary queue: Evidence requests tracking (who they're waiting on)
   - Apps: Diligent Audit, ACL Analytics, Assessments

4. **QA Reviewer** (`/audit-qa`)
   - Focus: Standards compliance, cross-audit patterns, process improvement
   - Agents: Standards Compliance, Pattern Analyzer, Feedback Composer, Quality Scorer, Improvement Tracker
   - Primary queue: Audits in QA queue with AI pre-scan
   - Apps: Diligent Audit, Internal Controls, Activity Center, Impact Reports

### Key Design Patterns
- Consistent "Command Center" labeling (not per-persona dashboard names)
- Scrolling agent ticker showing background monitoring agents
- "All is well" steady-state messaging (everything under control)
- Prompt box for AI assistant interaction
- Role-appropriate primary queue unique to each persona
- "Pick up where you left off" with real Diligent products
- Device preview (Desktop, iPad, iPhone)

### Diligent Products Referenced

**Audit Products:**
- **Diligent Audit** - Main hub for planning, fieldwork, documentation
- **Internal Controls Management** - SOX, ICFR, controls testing
- **ACL Analytics / AI Studio** - Data analytics with natural language
- **Assessments** - Push control/risk assessments to business owners
- **Impact Reports** - One-click formatted reports
- **Activity Center** - Self-serve BI dashboards
- **Diligent 360** - Aggregated risk view for CAE/board

**Compliance Products:**
- **Policy Manager** - Policy lifecycle, attestations, version control
- **Third Party Manager** - DDQ workflows, vendor risk scoring
- **Vault** - Speak-up/whistleblower case management
- **Compliance Education** - Training deployment, LMS integration
- **Entities** - Entity management, filings, KYC fulfillment

## Key Decisions
- Near-term vision only (users still navigate to products); 1-year+ vision toggles coming later
- Each persona has distinct agents appropriate to their work level
- Agents run in background on intervals, shown in ticker
- AI prepares materials but humans validate/approve
- Used actual Diligent product names in "Pick up where you left off" sections
- Consistent "Audit Command Center" / "Compliance Command Center" labeling in nav

## Known Issues / Notes
- "Pick up where you left off" sections may need further refinement based on actual product workflows
- Navigation between all audit personas linked; all compliance personas linked
- General Counsel dashboard also exists at `/now/agentic-hero/dark/general-counsel` (separate persona)

## Next Steps
- Build 1-year+ vision toggle for each persona
- Potentially refine based on additional context about actual product capabilities
- May add additional personas based on feedback

## Technical Notes
- All dashboards are standalone React client components
- Dark theme using GitHub-style color palette (#0d1117, #161b22, #30363d, etc.)
- Responsive with device frames (IPhoneFrame, IPadFrame)
- Ticker uses CSS animation with pause on hover

---
*Updated: February 2, 2026*

---

## Portfolio build (avo.re home page) — standing rules

Branch `portfolio-build`. The full spec is `docs/avo-re-portfolio-brief.md` (goal, page structure, draft copy, canonical facts, public-safety review §5, visual direction §6, build order §9). Read the relevant section before building it. Source decks are in `~/Projects/avo-re/source/`.

**Stack deviation from the brief:** built in this Next.js repo, not Astro, so the prototype routes under `/now/*` keep working. Brief §7 "Astro / content collections" maps to Next + MDX files in `content/` read via `lib/*.ts`.

**Structure:** two route groups with separate root layouts. `app/(site)/` is the legacy dark/pink site (`/work`, `/writing`, `/now`, `/about`) and must not be restyled. `app/(portfolio)/` is the new `/` with its own tokens (`tokens.css`) and fonts. Imports of legacy code use `@/app/(site)/...`. Never import portfolio CSS into `(site)` or the reverse.

**Status:** draft is `noindex` (in `(portfolio)/layout.tsx`). Remove only after the brief's step 8 review.

### Visual direction
Set by the user, recorded in `PRODUCT.md` (read it before any design work). The brief's §6 "board book" concept, its palette, fonts and don't list are **rejected**; do not reintroduce them.
- Lane: serious long-form magazine (Asterisk, Works in Progress, Quanta). Anti-references: pudding.cool (playful, loud) and chelseawatson.com (portfolio template: self-descriptor headline, trait grid under tracked-caps labels, logo strip).
- Color: committed large fields, deep green and rose, plus warm paper. Tokens and field roles are in `app/(portfolio)/tokens.css` (OKLCH). Use the roles (`--bg`, `--fg`, `--fg-muted`, `--accent`), never raw palette values. Pink and green must differ in lightness.
- Type: Gloock (display), Source Serif 4 (body and italic emphasis), Schibsted Grotesk (small UI only). Gloock has no italic; emphasis words use Source Serif italic.
- Depth and motion are welcome when they have a job: staggered hero entrance, scroll-driven parallax with floating panels (native CSS `animation-timeline: view()`), the margin rail. One easing curve and a few durations (`--ease`, `--dur*`). Animate `transform`/`opacity`/`translate`/`scale` only. Everything behind `prefers-reduced-motion: no-preference`.
- Avoid: tracked all-caps eyebrow labels, trait grids, logo strips, stat cards, side-stripe borders, gradient text, identical card grids, emoji/cartoon illustration.

### Where copy lives
Home page prose is **not** in `page.tsx`. It lives in `content/portfolio/*.md` (see its README), case studies in `content/cases/*.md`, quotes in `content/quotes/`. `page.tsx` only reads and arranges them (`lib/portfolio.ts`, `_components/Md.tsx`). Edit copy in those files; never hardcode copy, image paths, or alt text into components. New sections should follow the same pattern.

### Quality floor
WCAG 2.1 AA contrast, visible focus, keyboard-accessible interactives, `prefers-reduced-motion`, `prefers-color-scheme`, Lighthouse 95+ on all four, no font layout shift.

### Working rules
- Anything marked **DECIDE** in the brief gets a visible `[DECIDE: ...]` placeholder. Never invent facts, numbers, quotes, or names.
- Sections backed by content hide themselves when empty.
- Check brief §5 before adding financials, internal ratings, client names, or screenshots.
- Run `npm run build` after structural changes; confirm `/`, `/work`, `/writing`, `/now`, `/about` still return 200.
