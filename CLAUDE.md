# avo-re - Context for Claude

## Current State
- Last updated: January 31, 2026
- Project: Portfolio/prototype site at avo.re

## What Was Built This Session

### Audit Persona Dashboards (Near-term Vision)
Built 4 role-based dashboards for Diligent audit personas at `/now/agentic-hero/dark/`:

1. **Audit Executive** (`/audit-executive`)
   - Title: "Audit Command Center"
   - Focus: Strategic oversight, board relationships, enterprise risk, budget
   - Agents: Audit Universe Monitor, Risk Assessment Engine, Regulatory Watch, Execution Tracker, Findings Manager
   - Primary queue: Risk assessments awaiting CAE approval
   - Apps: Diligent 360, Diligent Audit, Activity Center, Impact Reports

2. **Audit Manager** (`/audit-manager`)
   - Title: "Audit Manager Hub"
   - Focus: Team management, quality review, capacity planning, engagement supervision
   - Agents: Workload Balancer, Quality Review Agent, Anomaly Detector, Finding Composer, Progress Tracker
   - Primary queue: Workpapers awaiting manager sign-off
   - Apps: Diligent Audit, Assessments, ACL Analytics, Activity Center

3. **Auditor** (`/auditor`)
   - Title: "Auditor Workspace"
   - Focus: Hands-on execution, testing, evidence collection, documentation
   - Agents: Evidence Tracker, Testing Assistant, Documentation Helper, Finding Drafter, Interview Prep
   - Primary queue: Evidence requests tracking (who they're waiting on)
   - Apps: Diligent Audit, ACL Analytics, Assessments

4. **QA Reviewer** (`/audit-qa`)
   - Title: "Quality Assurance Hub"
   - Focus: Standards compliance, cross-audit patterns, process improvement
   - Agents: Standards Compliance, Pattern Analyzer, Feedback Composer, Quality Scorer, Improvement Tracker
   - Primary queue: Audits in QA queue with AI pre-scan
   - Apps: Diligent Audit, Internal Controls, Activity Center, Impact Reports

### Key Design Patterns
- Scrolling agent ticker showing background monitoring agents
- "All is well" steady-state messaging (everything under control)
- Prompt box for AI assistant interaction
- Role-appropriate primary queue (risk assessments → workpapers → evidence → QA reviews)
- "Pick up where you left off" with real Diligent products
- Device preview (Desktop, iPad, iPhone)

### Diligent Products Referenced
Based on "Diligent Products for Auditors Overview.pdf":
- **Diligent Audit** (Internal Audit Management) - Main hub for planning, fieldwork, documentation
- **Internal Controls Management** - SOX, ICFR, controls testing
- **ACL Analytics / AI Studio** - Data analytics with natural language
- **Assessments** - Push control/risk assessments to business owners
- **Impact Reports** - One-click formatted reports
- **Activity Center** - Self-serve BI dashboards
- **Diligent 360** - Aggregated risk view for CAE/board

## Key Decisions
- Near-term vision only (users still navigate to products); 1-year+ vision toggles coming later
- Each persona has distinct agents appropriate to their work level
- Agents run in background on intervals, shown in ticker
- AI prepares materials but humans validate/approve
- Used actual Diligent product names in "Pick up where you left off" sections

## Known Issues / Notes
- "Pick up where you left off" sections may need further refinement based on actual product workflows
- Navigation between all 4 audit personas now linked
- General Counsel dashboard also exists at `/now/agentic-hero/dark/general-counsel` (separate persona)

## Next Steps
- Build 1-year+ vision toggle for each audit persona
- Potentially refine based on additional context about actual product capabilities
- May need to add more audit personas or adjust based on feedback

## Technical Notes
- All dashboards are standalone React client components
- Dark theme using GitHub-style color palette (#0d1117, #161b22, #30363d, etc.)
- Responsive with device frames (IPhoneFrame, IPadFrame)
- Ticker uses CSS animation with pause on hover

---
*Session: January 31, 2026*
