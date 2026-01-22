# Agentic UI Wireframe Kit

## Overview
A reusable wireframe system that captures the design patterns and structural conventions from our successful agentic prototypes (like agentic heroes). This kit enables the team to quickly spin up new AI-powered interfaces with consistent, validated patterns.

## Problem It Solves
- **Speed**: Start new agentic prototypes in minutes instead of hours
- **Consistency**: Maintain design patterns that we know work across different AI-powered tools
- **Knowledge transfer**: Encode our learnings about what makes effective agentic UIs so the whole team benefits
- **Collaboration**: Teammates can build on each other's work without re-explaining core patterns

## Key Patterns Included

### Layout Conventions
- Multi-panel layouts optimized for AI agent workflows
- Input/output separation patterns
- Progress/status visibility areas
- Context preservation zones (showing what the AI "knows")

### Component Hierarchies
- Prompt input interfaces
- Agent action displays
- Result/output containers
- Control panels for agent behavior
- Feedback mechanisms

### Interaction Patterns
- How users initiate agent actions
- Progress indication during AI processing
- Error states and recovery flows
- Iteration and refinement patterns
- Context handoff between sessions

## Design Principles
These patterns are built on core principles we've validated:

1. **Transparency**: Users always see what the agent is doing and why
2. **Control**: Clear affordances for steering agent behavior
3. **Context visibility**: Show what information the agent has access to
4. **Iterative refinement**: Make it easy to build on previous outputs
5. **Graceful degradation**: Clear paths when AI doesn't deliver expected results

## Project Structure
```
wireframe-kit/
├── PROJECT_CONTEXT.md (this file)
├── CLAUDE_INSTRUCTIONS.md (how to use this kit with Claude)
├── components/ (reusable wireframe components)
├── examples/ (reference implementations)
├── patterns/ (detailed pattern documentation)
└── templates/ (starter templates for common scenarios)
```

## Who This Is For
- Designers prototyping new agentic features
- Developers building AI-powered interfaces
- Product managers exploring new AI workflow concepts
- Anyone at avo.re creating tools that involve AI agents

## Getting Started
1. Read through CLAUDE_INSTRUCTIONS.md
2. Browse the examples/ folder to see patterns in action
3. Pick a template from templates/ that's closest to your use case
4. Use Claude to customize and extend for your specific prototype

## Related Projects
- Prompt Canvas (demonstrates "blank canvas problem" solutions)
- Collaboration tool (demonstrates context handoff patterns)
- Agentic heroes (original inspiration for many patterns)

## Maintenance
This is a living system. When you discover new patterns that work well in your prototypes:
1. Document them
2. Add an example
3. Update CLAUDE_INSTRUCTIONS.md if needed
4. Share with the team

---
*Last updated: January 2026*
*Maintained by: Design & Prototyping team at avo.re*
