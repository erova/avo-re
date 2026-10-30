---
title: VibeSharing
company: Founder
years: January 2026–
tags: ["Side hustle", "Product-Market Fit", "MCP functionality"]
rail: VibeSharing
order: 5
public: true
deepDive: false
situation: \>-
  VibeSharing answers the problem many product teams face that prototype with AI: how do I keep track of the latest version, and how do I leave feedback? 
did: \>-
  I designed and built VibeSharing on nights and weekends with Claude Code, though VibeSharing works with Codex, Lovable and other tools.  Primary features include easy organization of prototypes, Figma-like pin-based feedback, easy ability to build usability tests or A/B tests, stakeholder alerts on new versions, and a published MCP server (listed in the official MCP registry) so AI coding agents can deploy and pull design-system templates directly. Every action is logged and recorded for easy auditing.
outcomes:
  - 200+ prototypes deployed since launch across multiple product workstreams.
  - It's also how I learned what my teams are actually up against when they build with AI.
asking: ""
showcase:
  label: Views of VibeSharing
  tabs:
	- id: workflow
	  label: Workflow
	  steps:
	    - title: Ask in plain words
	      at: 0
	      text: The builder tells their AI coding tool what to make and where to publish it. The tool builds the page and shares it in one step.
	    - title: Open the shared link
	      at: 13
	      text: Anyone with the link can open it and use it, here by voting in a lunch poll.
	    - title: Pin feedback to the screen
	      at: 22
	      text: They drop a pin on the exact spot and write the comment, the way they would in Figma.
	    - title: Triage from the terminal
	      at: 34.4
	      text: Back in the tool, the builder asks for the feedback and sets its priority and status.
	    - title: See it on the project page
	      at: 42.9
	      text: The comment lands on the project marked In Progress, so everyone can see it was picked up.
	  main:
	    src: /images/work/vibesharing/workflow-poster.webp
	    video: /images/work/vibesharing/workflow.mp4
	    width: 1100
	    height: 684
	    alt: A screen recording in five steps. A builder types a request in Claude Code to build a Friday lunch poll and publish it to a Demo collection. The shared poll is opened and voted on, and a pinned comment asking for a pizza option is left. Back in the terminal the builder reads the comment and marks it in progress, and the project page then shows it with an In Progress label.
	- id: mcp
	  label: MCP
	- id: admin
	  label: Admin
	  main:
	    src: /images/work/vibesharing/admin-audit-table.webp
	    width: 1730
	    height: 1116
	    caption: "Audit log: timestamped events, exportable as CSV"
	    alt: The VibeSharing admin Audit Log, a table of timestamped events such as project access and feedback created, with a Download CSV button. User names are removed.
	  panels:
	    - src: /images/work/vibesharing/admin-members.webp
	      width: 1400
	      height: 775
	      caption: "Members: roles, invites and GitHub access"
	      alt: The admin Members page, with an invite form, GitHub access controls and a table of admins showing last activity, MCP use and deploys. Other members' names are removed.
	    - src: /images/work/vibesharing/admin-analytics-sm.webp
	      width: 1400
	      height: 774
	      caption: "Analytics: usage, deploys and reliability"
	      alt: The admin Analytics page, with counts of members, prototypes, feedback, deployments and MCP calls, charts of deploys and feedback over 30 days, and a reliability section covering success rate, errors and the slowest deploys. Project and organization names are removed.
link: https://vibesharing.app
linkLabel: vibesharing.app
---
