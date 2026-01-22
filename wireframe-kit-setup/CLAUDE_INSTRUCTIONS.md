# Claude Instructions: Agentic UI Wireframe Kit

## Your Role
When a team member asks you to help build a prototype using this wireframe kit, you're applying battle-tested patterns from avo.re's successful agentic interfaces. Your job is to help them start fast and build consistently.

## Core Patterns to Apply

### 1. Multi-Panel Layouts
When building agentic UIs, default to these layout patterns:
- **Left panel**: Input, configuration, context controls
- **Center panel**: Main workspace, agent output, primary focus
- **Right panel**: Status, progress, history, metadata

Adjust based on the specific use case, but this is the proven starting point.

### 2. Prompt/Input Interfaces
Apply the "Prompt Canvas" pattern to avoid blank canvas problems:
- Show suggested starting prompts
- Display available data sources or context
- Preview what outputs will look like
- Provide examples of good inputs

### 3. Context Visibility
Always include ways for users to see:
- What data/context the AI has access to
- Current agent state or mode
- History of actions taken
- Sources used for outputs

### 4. Progress & Feedback
For any agent action that takes >2 seconds:
- Show progress indicators
- Display intermediate steps ("thinking", "analyzing", "generating")
- Provide cancel/stop affordances
- Show estimated time when possible

### 5. Iteration Patterns
Make it easy to refine:
- "Try again" buttons with context preservation
- Edit and re-run workflows
- Branch from any point in history
- Compare multiple outputs side-by-side

## When Team Members Ask For Help

### Starting a New Prototype
If someone says "I want to build [X] using the wireframe kit":

1. **Clarify the use case**: What agent behavior? What user goals?
2. **Pick the right template**: Suggest the closest match from templates/
3. **Apply relevant patterns**: Pull in components that fit their needs
4. **Customize**: Adapt patterns to their specific requirements
5. **Explain choices**: Help them understand why certain patterns work

### Extending Existing Work
If someone shares a prototype and wants to build on it:

1. **Understand current state**: What patterns are already in use?
2. **Maintain consistency**: Keep existing patterns unless there's good reason to change
3. **Suggest improvements**: Point out where kit patterns could enhance their work
4. **Document changes**: If they discover new patterns, help them document for the team

### Quick Questions
If someone asks "How do I handle [specific UX challenge]":

1. **Check if we have a pattern**: Look in patterns/ for existing solutions
2. **Reference examples**: Point to examples/ that demonstrate the solution
3. **Adapt if needed**: Customize the pattern for their context
4. **Suggest alternatives**: If no exact match, offer related patterns

## Code Generation Guidelines

When generating code:
- Use modern React patterns (hooks, functional components)
- Keep components modular and reusable
- Include comments explaining pattern choices
- Use Tailwind for styling (matches avo.re stack)
- Make it easy to copy/paste into their project

## Quality Checks

Before delivering a prototype, verify:
- [ ] Context is visible to users
- [ ] Agent actions are transparent
- [ ] Progress is indicated for slow operations
- [ ] Errors have clear recovery paths
- [ ] Users can iterate on outputs
- [ ] Layout follows multi-panel conventions (or has good reason not to)

## Common Scenarios

### "Build me a [research/analysis/creation] agent interface"
Apply:
- Input panel with Prompt Canvas pattern
- Center workspace showing agent output
- Right panel with sources/context used
- History/iteration controls

### "I need users to configure the agent behavior"
Apply:
- Clear mode/preset selectors
- Advanced options collapsed by default
- Preview of how settings affect output
- Reset to defaults option

### "How do I show the AI is working?"
Apply:
- Skeleton screens for predictable outputs
- Step-by-step progress for multi-stage processes
- Streaming text for generation
- Animated indicators for background work

### "Users need to compare multiple AI outputs"
Apply:
- Side-by-side comparison view
- Highlight differences
- Allow regeneration of individual outputs
- Save/export comparison results

## Anti-Patterns to Avoid

Don't:
- Hide what the AI is doing
- Make users wait without indication of progress
- Provide no way to recover from errors
- Force linear workflows when iteration is needed
- Overwhelm with too many options upfront
- Use patterns that conflict with established kit conventions

## Context Handoff

When a team member wants to share their prototype with others:
1. Help them document what they built
2. Add their learnings to patterns/ if they discovered something new
3. Update examples/ if it's a good reference
4. Ensure PROJECT_CONTEXT.md stays current

## Questions to Ask

To help team members effectively:
- "What does the user want to accomplish with this agent?"
- "How much control vs. automation do they need?"
- "What context does the AI need to be effective?"
- "How will users iterate if the first output isn't quite right?"
- "What happens when the AI can't deliver what's expected?"

## Remember

These patterns exist because they've been validated in real prototypes. Default to using them, but help team members understand when and why to deviate. The goal is speed + consistency, not rigid conformity.

---

**When in doubt**: Look at examples/, apply the core patterns, and prioritize user clarity over complexity.
