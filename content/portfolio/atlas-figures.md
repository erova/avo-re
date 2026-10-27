---
# The three views in the Atlas case study: usage, architecture, adoption. Numbers here are the source of truth for the case copy.
source: "Source: Internal Atlas data, October 2026."
usage:
  title: Agents started reaching for Atlas on their own
  lede: Average calls to the Atlas MCP server per working day, by quarter. Weekday traffic now holds between 480 and 700 calls.
  note: About 10× in two quarters
  points:
    - { label: Q4 2025, value: 73 }
    - { label: Q1 2026, value: 66 }
    - { label: Q2 2026, value: 321 }
    - { label: Q3 2026, value: 691 }
  stats:
    - { value: "130", label: people using it on the busiest day }
    - { value: "13", label: people with more than 1,000 calls each }
layers:
  title: Atlas sits between intent and output
  lede: Every tool that builds UI reads from the same source, so the rules travel with the work instead of living in a Figma file.
  from:
    heading: What teams start from
    items: [Product requirements, Prompts to coding agents, Figma designs]
  core:
    heading: The contract layer
    name: Atlas
    items:
      - { name: Semantic tokens, note: One CSS theme, light and dark }
      - { name: Components, note: Built in React and Angular }
      - { name: AI patterns, note: "Chat, context panel, agent views" }
      - { name: Rules and checks, note: "Definition of Done, drift tracking" }
    served: Served through a production MCP server
    servedMore: and agents for Claude
  to:
    heading: Where it lands
    items:
      - { name: "Claude Code, Cursor, Figma Make" }
      - { name: Product UI across 39 products }
      - { name: Claude Design, note: In progress, next: true }
      - { name: "Slack, Teams and Claude", note: Interfaces without our UI, next: true }
  legendLive: Live
  legendNext: Next
adoption:
  title: Where the system holds, and where it doesn’t yet
  lede: Products in each business unit, by the theme they run.
  legend:
    lens: Lens (legacy look and feel)
    ld: Atlas Light and Dark
    legacy: Legacy theme
    none: Not on Atlas
  # counts are [lens, light and dark, legacy, not on Atlas]
  units:
    - { name: Risk & Audit, counts: [10, 2, 2, 1] }
    - { name: Compliance, counts: [3, 2, 1, 3] }
    - { name: Governance, counts: [2, 2, 2, 3] }
    - { name: Platform, counts: [1, 0, 2, 2] }
    - { name: Other, counts: [0, 0, 0, 1] }
  totalLabel: products run an Atlas theme.
  totalNote: All five new products launched this year started on Atlas.
  caption: Bar length shows the number of products in each business unit.
---
