# avo.re portfolio: build brief

Drop this file into the repo root (or reference it from CLAUDE.md) and ask Claude Code to build from it. Sections marked **DECIDE** need Chris's call before launch.

> **Superseded (Oct 2026):** §6 Visual direction, its palette and type, and its "Don't" list were rejected by Chris. Visual direction now lives in `PRODUCT.md`. Everything else in this brief still applies.

---

## 1. Goal and audience

A single scrolling portfolio page at avo.re, with optional deep-dive pages per case study. erova.com stays as the brochure site and links here.

Readers, in order of how fast they'll leave:

1. **Executive recruiters**: 30–60 seconds. Need scope, level, companies, a few hard numbers, and a résumé link above the fold.
2. **Product and engineering executives (hiring managers)**: 3–5 minutes. Need evidence of judgment and business outcomes, not process.
3. **Senior design leaders (peers, panelists)**: will read everything. Want the honest version: what was hard, what I'd still question, how I think about AI and org design.

Every section must work for reader 1 in a skim and reward reader 3 if they expand it.

## 2. Page structure (single scroll)

```
┌─────────────────────────────────────────────┐
│ Hero: name, positioning line, one-sentence  │
│ "now", résumé / LinkedIn / email            │
├─────────────────────────────────────────────┤
│ At a glance: scope facts (definition list)  │
├─────────────────────────────────────────────┤
│ Selected work                               │
│   1. Making the agentic vision visible  ◀── interactive state viewer (the one bold moment)
│   2. Modernizing the flagship (Boards)      │
│   3. The design system as AI infrastructure │
│   4. Leading an org through AI, honestly    │
│   5. VibeSharing (founder)                  │
├─────────────────────────────────────────────┤
│ What others say: 3–4 short quotes           │
├─────────────────────────────────────────────┤
│ Earlier work: NM, Meta, InVision, Nasdaq    │
│ (compact rows, expandable)                  │
├─────────────────────────────────────────────┤
│ How I lead: Clarity / Consistency / Curiosity│
│ + People I've grown + One thing I got wrong │
├─────────────────────────────────────────────┤
│ Writing & speaking: signature talk, essays, │
│ earlier talks, Liftoff!, other publications │
├─────────────────────────────────────────────┤
│ Contact                                     │
└─────────────────────────────────────────────┘
```

Quotes sit right after the selected work on purpose: the reader has just seen my claims, and the next thing they see is someone else confirming them.

Each case study on the home page uses the same four-part shape so readers learn it once:

- **The situation** (2–3 sentences)
- **What I did** (3–4 short sentences, first person, decisions not activities)
- **What changed** (3–5 outcomes; numbers where cleared)
- **What I'm still asking** (one line; optional, but this is what peers remember)

Each case links to `/work/<slug>` for the long version (more images, timeline, team, lessons). Home page versions stay under ~150 words of prose each.

## 3. Content (draft copy)

Voice: first person, plain, direct. Short sentences. No "passionate," no "leveraged," no "drove synergies." Copy below is a starting draft; tighten further, don't expand.

### Hero

- **Name:** Chris Avore
- **Positioning:** Design leadership for products that can't afford to be wrong.
- **Now:** I lead design at Diligent, turning a governance, risk, and compliance portfolio used by most of the Fortune 1000 into an AI-first one. I still prototype in code. Before Diligent: Northwestern Mutual, Meta, and Nasdaq.
- **Actions:** Download résumé (PDF) · LinkedIn · Email

### At a glance

Render as a two-column definition list, not stat cards.

| Term | Detail |
|---|---|
| Diligent, 2024– | VP & Head of Design. **DECIDE: canonical team size** across 4 business units and 5 countries; 5 directors |
| Northwestern Mutual, 2021–24 | VP & Head of Design. Scaled the org from 60 to 120+ |
| Meta, 2020–21 | Product Design Manager, recruiting platforms |
| Nasdaq, 2011–18 | Built the UX team from 1 to 35; 32 patents |
| Author | *Liftoff! Practical Design Leadership* (Rosenfeld Media, with Russ Unger) |
| Founder | VibeSharing, a home for AI-generated prototypes |
| Research, accessibility, content | **DECIDE:** one concrete line each (e.g., a research practice I set up, a WCAG standard adopted across N products, a content design hire or guideline). These are in my remit but have no evidence anywhere on the page yet |

### Work 1: Making the agentic vision visible (Diligent, 2025–26)

**The situation.** Diligent wanted to go all in on AI. Engineering-led pilots had stalled, and the plan was a Word doc of use cases nobody could picture, estimate, or sequence.

**What I did.** I reframed the brief: users shouldn't have to learn to ask AI better questions; the system should already know the question. When a director resigns, the product should know the seat is open, which bylaws apply, and who's qualified, then surface the next step. I stopped writing decks and built a working prototype myself, then put one designer on each use case and held all six to one system across three surfaces: a command center, agents embedded in existing products, and Teams/Slack.

**What changed.** The CEO, CTO, and BU leaders committed. Product could scope and engineering could estimate. It became a two-track roadmap of twenty initiatives, and we showed it onstage at Diligent's April 2026 customer conference.

**What I'm still asking.** On 0-to-1 work, is cross-product consistency a hill worth dying on?

**Interactive element (the page's one bold moment):** a state viewer of the prototype. Tabs or a segmented control: *All clear → A signal fires → A different agent → In Teams → Dark theme.* Each state swaps a screenshot with a one-line caption. Keyboard accessible, no autoplay. Captions from the decks:
- All clear: "No false urgency. Suggestions that pay off later, based on what the system knows."
- A signal fires: "Monitoring agents detect a change and the home screen reshapes around it."
- A different agent: "A different agent, a different user, the same system."
- In Teams: "The same intelligence, brought to where people already work."
- Dark theme: "Same intelligence, different theme."

**Motion (DECIDE: which recordings are cleared).** Below the state viewer, add one short video: a 60–90 second screen recording of the prototype responding to a signal. The vision prototypes are already hosted on VibeSharing, so record from there. If the April 2026 conference demo is public, add a 20–30 second clip of it as a second option, with captions on. Videos are click-to-play, never autoplay, with a poster frame and a transcript link.

### Work 2: Modernizing the flagship (Diligent Boards, 2024–25)

**The situation.** Boards is the system of record for corporate governance, used by roughly 70% of the Fortune 1000. Diligent charged a premium the product didn't look like it earned, and any change risked disrupting power users who open it a few times a year.

**What I did.** I took direct ownership: ran the client interviews, owned the information architecture, and chose the visual direction. I made two contrarian calls. I shipped the visual redesign first and held the IA work ~90 days. And I built for the legacy product clients actually used, not the next-gen one, so the modernized old product leapfrogged the new.

**What changed.** **DECIDE which of these are cleared for public use.**
- Six months from kickoff to general release for all Boards clients
- Bookings beat target; cross-sell bookings roughly doubled; director monthly active usage up 31% YoY
- The visual language was adopted by all four business units and became the foundation of Atlas's light and dark themes

**What I'm still asking.** A better destination doesn't make change easy. How do you get teams to ship early and imperfect when it's never been the norm?

### Work 3: The design system as AI infrastructure (Atlas, 2025–26)

**The situation.** If AI coding agents are going to build UI, the design system has to be something they can read, not a Figma library people forget to open.

**What I did.** I ran Atlas as a product. We shipped a production MCP server that serves tokens, patterns, and components to engineers and AI agents, with Figma-to-code parity on semantic tokens. I set code-level adoption governance: a drift taxonomy and an exception-by-approval model for custom components. When designers left other teams, I routed backfills to Atlas instead of asking for new headcount.

**What changed.**
- 85% of engineers use the Atlas MCP server; daily usage up 20× since launch
- 88% of calls are agents pulling live Atlas data
- 58 production-ready components in design and code; 12 native AI patterns shipped in 2026
- Light/dark themes adopted across 12 products in four business units

### Work 4: Leading an org through AI, honestly (Diligent, 2024–26)

**The situation.** "AI first" was a goal everyone was evaluated on and nobody had defined. Designers didn't know what it meant or how they'd be judged, while the industry was busy announcing design layoffs.

**What I did.** I defined what AI use looks like at every level, from junior to staff. I wrote a triad playbook with product and engineering that treats AI prototypes as hypotheses, not proof, and makes clear when design enters the work. I built a readiness model: six systems (design system, AI infrastructure, workflow and deployment, triad accountability, track record, customer readiness), each rated 0–5, where the weakest sets the ceiling. And I measured the gap instead of assuming it.

**What changed.** We replaced opinion with a shared scorecard. The finding I share most: AI gives design teams 50–70% gains upstream (discovery, ideation, first drafts) but close to none in final design and handoff. Net, end to end, it's about 25–30%. Gross isn't net, and the last mile is where the gains stop.

**What I'm still asking.** Whose infrastructure, remit, and responsibilities have to change once the whole org works this way?

Link out to the October 2026 talk, "AI, Anxiety, and Actual Impact" (Design Leadership Summit, Budapest), and to the essays on gross vs. net gains and the readiness model (see Writing & speaking). This case is the summary; the essays are where the full argument lives.

> Keep internal ratings, named directors' scores, and "my boss asked when we could cut design" off the public page. Frame the framework and the gross/net finding, which is the part peers want.

### Work 5: VibeSharing (founder, 2026–)

**The situation.** Building prototypes with AI got fast. Sharing them didn't: screenshots pasted into FigJam, nobody sure which link was current, designers pinging stakeholders by hand.

**What I did.** I designed and built VibeSharing on nights and weekends with Claude Code: one version-aware URL per prototype, feedback pinned to versions, stakeholder alerts on new versions, gated external sharing, and a published MCP server (listed in the official MCP registry) so AI coding agents can deploy and pull design-system templates directly.

**What changed.** 100+ prototypes deployed since launch across multiple product workstreams. It's also how I learned what my teams are actually up against when they build with AI.

Link: vibesharing.app. Use VibeSharing's own product screenshots, not any client's dashboard or analytics.

### What others say

**DECIDE: collect these before launch.** Three or four quotes, 1–3 sentences each, with name, title, and how they worked with me. Ask for something specific (a decision, a moment, a change they saw), not adjectives. Aim for this mix:

| Slot | Who | What it should prove |
|---|---|---|
| Exec partner | A product or engineering exec (CPO, CTO, SVP) | I move the business, not just design |
| Direct report | A director I hired or promoted | I build leaders |
| Designer | Someone who grew under me | I raise craft and care about careers |
| Optional | A customer or conference organizer | Outside credibility |

Already in hand: the senior engineering manager quote from Meta ("not afraid to jump into the day-to-day…"). Use it as a fallback, trimmed to two sentences.

Render as plain pull quotes in the display italic, left-aligned, no quote-mark ornaments, no carousel. Every quote is visible without clicking.

### Earlier work (compact rows, each expandable)

- **Northwestern Mutual, 2021–24.** Took over a 120-person org with 36% annual attrition and low partner confidence. Rebuilt the operating model, leadership bench, and design KPIs. Attrition fell to **DECIDE: 3 people or a %**; engagement survey participation +44%, strategic clarity +46%. Programs my org partnered on: the Planning Experience reached 90% advisor adoption and 30,000+ plans in its first 90 days; accelerated underwriting cut issuance from four weeks to three days (MIT Sloan Management Review, March 2023); the mobile redesign grew MAU 20.3% YoY.
- **Meta, 2020–21.** Led design on a 0-to-1 recruiting effort: recruiters were sharing candidate PDFs in open Workplace groups. A structured, native sharing flow cut posts with file attachments from 23.9% to 4.2% in 30 days, without hurting sourcing or hiring metrics.
- **InVision, 2018–19.** Co-authored *The New Design Frontier*, InVision's study of design maturity across thousands of companies, and co-developed the Design Maturity Model that came out of it. Ran executive workshops for Netflix, American Express, and Boeing. **DECIDE:** add the report to the résumés too; it's missing from every current version.
- **Nasdaq, 2011–18.** Built the UX team from 1 to 35, leading experience design for governance, compliance, and trading platforms behind 27%+ of company revenue. Credited on 32 patents.
- **Before 2011.** Independent consultant for Merck, FINRA, National Geographic, the National Park Service, and the Department of Defense.

### How I lead

Three short columns (prose, not bullets). Adapted from the Bloomberg deck:

- **Clarity.** Saying what good looks like, and what it doesn't. Being direct about what design can and can't do. When strategic clarity isn't there, building it for the team instead of waiting for it.
- **Consistency.** Being the same leader on good days and bad. Not moving the goalposts on quality. Building the same kind of partnership with everyone, not just the people I click with.
- **Curiosity.** Asking how something came to be before reacting to it. Changing my mind when the evidence warrants. Asking more questions than I answer.

Keep the "*or try to" footnote. It's the most human line in either deck.

**People I've grown.** A short paragraph plus a few named examples, so the page isn't only about who I exited. **DECIDE: names and permission.** Draft:

> The part of the job I'm proudest of is the people. At Diligent I started a manager apprenticeship program so we could grow leaders from inside, and the Boards team went from one designer to a bench of two directors, two senior managers, and an apprentice manager. At Northwestern Mutual, attrition fell from 36% to three departures in a year as we rebuilt career paths. People I've managed now lead design at [company], [company], and [company].

Fill the last sentence only with people who've said yes to being named (or keep it to company names).

**One thing I got wrong.** **DECIDE: pick the story.** One short paragraph: what I believed, what happened, what I do differently now. Candidates from the decks:
- Pushing portfolio-wide consistency onto 0-to-1 AI work, where engineers optimized for speed and a client might only ever see one interface.
- Assuming AI efficiency gains would show up end to end, before measuring and finding the last mile gave back most of them.
- Expecting a clearly better target state (the Boards redesign) to sell itself, when critique, shipping early, and fast follows weren't the norm yet.

Keep it specific and unresolved where it's still unresolved. Peers trust this section more than any outcome number.

### Writing & speaking

Structure this as a body of thinking that has evolved, newest first, not a list of venues. Four parts:

**1. Signature talk.** "AI, Anxiety, and Actual Impact: Leading Design Teams Through the AI Era," Design Leadership Summit, Budapest, October 2026. Two-sentence abstract, plus slides or video if available (**DECIDE**). It ties back to Work 4 and to VibeSharing.

**2. Recent essays on avo.re.** **DECIDE: write 2–3 before launch; the site can go live with one.** Each is 800–1,200 words and adapted from material already in the decks:
- *Gross isn't net.* Where AI actually saves design teams time (50–70% upstream) and where it gives it back (final design, handoff, QA), and what that means for headcount conversations.
- *Readiness before reductions.* The six-system model, why the weakest system sets the ceiling, and how to use it with a CTO or CFO. Share the framework, not Diligent's scores.
- *AI should already know the question.* Why prompting is the wrong default for infrequent, high-stakes enterprise workflows, using the open-board-seat example.

List them with title, one-line summary, and date. These carry the most recent proof of thinking, since the book is from 2020.

**3. Earlier talks.** A short list, one line each, with a topic that shows the arc:
- UX Lisbon 2023: Redesigning the design org you inherit — revisiting the structures, roles, and rituals of an existing team so people can grow and do their best work.
- "Design Success in Turbulent, Ambiguous Spaces": practices leaders can use with business, product, and engineering partners when nothing is predictable (venue/year: **DECIDE**).
- IA Conference, Interaction, Leading Design Festival London, Design Leadership Summit Toronto, IxDA South America, UXDX, Confab, MX, UX Week.
- Closing line: 24+ conferences in 10 countries since 2010. Link to erova.com/public-speaking for booking.

**4. *Liftoff!* and other publications.**
- *Liftoff! Practical Design Leadership to Elevate Your Team, Your Organization, and You*, with Russ Unger (Rosenfeld Media, July 2020). A practical guide for new and experienced design managers: hiring and scaling teams, developing careers, why diversity matters to the business, and establishing design's place in the organization.
- Make it concrete with two specifics from the book: a step-by-step design charter workshop (Chapter 8), and ways to bring executives into common UX activities to build influence (Chapter 15).
- Blurbs: Jesse James Garrett's line is confirmed. Rosenfeld's page also lists endorsements from leaders at the Obama White House, USAA, Mastercard, and Kristin Skinner (*Org Design for Design Orgs*), but the attributions are scrambled on that page. **DECIDE: verify against the printed book** before quoting any of them; use one or two at most.
- Links: Rosenfeld Media book page, and the Rosenfeld podcast episode where Russ and I talk through the mistakes and lessons behind the book.
- Also: *The New Design Frontier* (InVision, co-author); a case study chapter on Nasdaq IR Mobile in *Successful User Experience: Strategies and Roadmaps* (Morgan Kaufmann).

Show the book cover (it's a strong, colorful image and the page's only one outside the work). Everything else in this section is text.

### Contact

Email (avore@erova.com), LinkedIn, résumé PDF. Phone optional (**DECIDE**). "Based near the Jersey Shore, a ferry ride from Manhattan."

## 4. Canonical facts (use these everywhere; fix the decks to match)

The decks disagree with each other. Pick one value per row before launch.

| Fact | Values found | Use |
|---|---|---|
| Diligent team size | 70 (Capital One, Bloomberg), 65 (Pfizer résumé), 60+ (2026 portfolio) | **DECIDE** (current headcount + contractors) |
| NM attrition result | "36% → 3 people" mixes a rate with a count | Say "36% to three departures in 2024" or convert to % |
| NM Planning Experience adoption | "near-100%" (résumé), "90%" (portfolio) | 90% |
| Who set the April 2026 deadline | "CEO, CTO, CMO gave me a challenge" (Capital One) vs "I set an ambitious goal for myself" (Bloomberg) | Pick one |
| Kids' ages, marathon count, Little League | Stale in both decks | Leave off the site; personal details go stale fast |

## 5. Public-safety review (before anything goes live)

The decks were built for private interviews. A public URL is readable by Diligent leadership, my team, and customers.

- **Financials.** Diligent is private. Remove or get sign-off on: ~$600M product revenue, ARR figures, $769k→$1.53M cross-sell, new-logo bookings, GDR. Percentages or qualitative statements are safer.
- **People.** Soften "exited the former Director," "exited half the leaders," and "designers who preferred months-long discovery moved on." People can recognize themselves.
- **Internal assessments.** Keep the readiness index scores and director ratings private.
- **Customer and partner names in screenshots.** Replace or blur Walmart, Pfizer, NVIDIA, Moody's, Davis Polk, S&P, and any real-looking employee names. Scott Bridgen's stage photo: confirm it's from a public event.
- **Unreleased product.** The Risk Summit demo is public; other roadmap screens may not be. Check with Diligent comms.
- **VibeSharing / Diligent separation.** No Diligent analytics screenshots on the VibeSharing section.
- **Option:** keep the full-detail case pages at unlisted or password-protected routes and send links to recruiters directly. The public home page stays clean.

## 6. Visual direction

**Concept: "the board book."** Calm, exact, and quietly expensive, like materials prepared for a board meeting. The page should feel the way the products should: nothing urgent unless something actually is.

**Palette**

| Name | Hex | Role |
|---|---|---|
| Paper | `#F6F7F8` | Page background (cool, not cream) |
| Ink | `#14213D` | Text and headlines (the Bloomberg deck's navy, for continuity) |
| Slate | `#5A6478` | Secondary text |
| Rule | `#D5D9E0` | Hairlines between sections only |
| Signal | `#C2410C` | Reserved for the state viewer and focus rings. Nowhere else |
| Night | `#0E1A30` | Dark-mode background |

Dark mode inverts Paper/Ink around Night; Signal stays.

**Type**

- Display: **Bodoni Moda** italic (Google Fonts) for H1 and section headings. Both 2026 decks used a high-contrast italic display; this keeps the personal brand continuous.
- Body and UI: **Public Sans**. It comes from the US Web Design System, plain and trustworthy, a fit for regulated products.
- Scale ~1.25. Body 18px/1.6. Measure under 70ch.

**Layout**

- Left-aligned, single reading column (~640px) with a wider media column for case images on desktop; stacks on mobile.
- Sticky, quiet section index on the left on desktop (Work, Earlier, How I lead, Writing, Contact) with current-section highlight.
- Generous vertical space between cases. Hairline rules only between major sections.

**Don't** (these are the tells of templated portfolios, and several appear in the decks):

- No all-caps tracked eyebrow labels above headings
- No monospace data labels; no "A · B · C" meta strings in the UI
- No big-number stat cards with gradient accents; outcomes are short sentences with the number in plain bold
- No 01/02/03 numbering on case studies (they aren't a sequence)
- No fade-and-slide on every section; the state viewer is the only animated moment
- No cream background with terracotta accent
- No "→" appended to every link

## 7. Tech

- **Framework:** Astro, static output. Case studies as MDX in a content collection: `src/content/work/<slug>.mdx` with frontmatter `title, company, years, summary, outcomes[], order, public`.
- **Routes:** `/` (single scroll), `/work/<slug>` (deep dives), `/resume.pdf`.
- **Hosting:** Vercel. DNS for avo.re stays at Hostinger (A/CNAME to Vercel). **DECIDE:** portfolio at avo.re root, or chris.avo.re / avo.re/work if the root is the newsletter.
- **erova.com:** point its Portfolio link and nav to avo.re now; later, consider a full 301 so there's one site to maintain and one place search engines rank.
- **Images:** export from the deck PDFs at 2× (max 2400px wide), convert to WebP/AVIF, real alt text describing what the screen shows. Store in `public/work/<slug>/`.
- **Meta:** title, description, Open Graph image (designed, not a screenshot), canonical URL, JSON-LD `Person`.
- **Quality floor:** WCAG 2.1 AA contrast, visible focus, `prefers-reduced-motion`, `prefers-color-scheme` dark mode, Lighthouse 95+ on all four scores, no layout shift from fonts (`font-display: swap`, preload display face).
- **Analytics:** privacy-friendly (Plausible or Vercel Analytics). Track résumé downloads and deep-dive clicks.

## 8. Assets to export

| Case | Source | Slides |
|---|---|---|
| Agentic vision | Capital One deck | State 1–4 screenshots, "Risks detected" screen |
| Agentic vision | Bloomberg deck | Teams screen, Boards + Command Center chat, whistleblower and security-incident flows, conference stage still |
| Boards | Bloomberg deck | Before (×2), Today's Boards, reader light/dark, Decision Hub, GovernAI, card-sort photo, IA sketch |
| Boards | 2026 portfolio | Compaq "before" monitor and laptop "after" (good, memorable pair for the home page) |
| Atlas | Capital One deck | Rebuild the stats as live text, not an image |
| AI org | Capital One deck | Gross ≠ Net and gain-bands charts, rebuilt as accessible HTML/SVG |
| VibeSharing | Capital One deck | Use only screens without client data |
| NM | 2026 portfolio | Shipped work (PX, underwriting, mobile) |
| Meta | 2026 portfolio | Candidate packet annotated screen |
| Portrait | 2026 portfolio cover | Headshot |
| Agentic vision (motion) | VibeSharing-hosted prototypes; April 2026 conference recording | 60–90s screen recording, 20–30s stage clip; MP4 + WebM, captions (VTT), poster frame |
| Book | erova.com / Rosenfeld | *Liftoff!* cover at 2× |
| Quotes | Collected from people | Name, title, relationship, written permission |

## 9. Build order for Claude Code

1. Scaffold Astro, tokens (CSS custom properties for both themes), fonts, base layout.
2. Build the home page with real copy from section 3 and placeholder images.
3. Build the state viewer component; test keyboard and reduced motion.
4. Add MDX deep-dive template and one full case (Boards).
5. Add two more content collections: `src/content/writing/` (essays: title, date, summary) rendered at `/writing/<slug>`, and `src/content/quotes/` (quote, name, title, relationship, order). Sections hide themselves when a collection is empty, so the site can launch before every quote and essay exists.
6. Swap in exported images and video; write alt text and captions.
7. Meta, OG image, analytics (add video plays and essay reads), Vercel deploy, DNS.
8. Review pass against sections 5 and 6 before making it public. Resolve every **DECIDE** or remove the element it belongs to.
