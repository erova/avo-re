---
title: The design system as AI infrastructure
company: Diligent
years: 2025–26
tags: ["Design systems", "MCP", "AI infrastructure"]
rail: Atlas
order: 3
public: true
deepDive: false
situation: >-
  If AI coding agents are going to build UI, the design system has to be something they can read, not a Figma library people forget to open.
did: >-
  I ran Atlas as a product. We shipped a production MCP server that serves tokens, patterns, and components to engineers and AI agents, with Figma-to-code parity on semantic tokens. I set code-level adoption governance: a drift taxonomy and an exception-by-approval model for custom components. When designers left other teams, I routed backfills to Atlas instead of asking for new headcount.
outcomes:
  - 85% of engineers use the Atlas MCP server; daily calls grew about 10× in two quarters.
  - 88% of calls are agents pulling live Atlas data.
  - 58 production-ready components in design and code; 12 native AI patterns shipped in 2026.
  - 22 of 39 products run an Atlas theme, and all five new products this year started on Atlas.
asking: ""
media: ""
showcase:
  label: Views of Atlas
  tabs:
    - id: usage
      label: Usage
      view: atlas-usage
    - id: architecture
      label: Architecture
      view: atlas-layers
    - id: adoption
      label: Adoption
      view: atlas-adoption
---
