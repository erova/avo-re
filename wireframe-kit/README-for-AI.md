# Wireframe Kit

A self-contained environment for generating grayscale interactive prototypes — designed to work with AI tools like ChatGPT, Cursor, and Claude.

---

## What This Is

Reference patterns for:
- **Agentic UI**: Incident response, agent status, contextual assists, action receipts
- **Content apps**: Lists with search/filter, detail panels, editors with smart suggestions

Use it to quickly mock up UX ideas without touching the production site.

---

## What It Intentionally Omits

| Excluded | Why |
|----------|-----|
| avo.re site scaffolding | Keeps prototypes isolated and disposable |
| Design system / Tailwind | Forces grayscale; avoids style drift |
| Analytics / tracking | Not needed for prototypes |
| Design tokens | Uses simple CSS variables instead |
| MDX / content layer | Mock data lives inline in each file |
| Path aliases (`@/`) | Explicit relative imports only |

---

## How to Run

```bash
# From repo root
cd wireframe-kit
npm run dev
```

Then open:
- `http://localhost:3000` — Experiment index
- `http://localhost:3000/experiments/agentic-hero` — Agentic dashboard
- `http://localhost:3000/experiments/ca-books` — Books list
- `http://localhost:3000/experiments/ca-bookbuilder` — Book editor

---

## Export as Zip

To share the wireframe kit (without node_modules or build artifacts):

```bash
# From repo root
./wireframe-kit/scripts/make-zip.sh
```

This creates `wireframe-kit.zip` at the repo root containing:
- `app/` — All experiment pages
- `styles/` — CSS variables and base styles
- `wireframe-primitives/` — Reusable components
- `README-for-AI.md` — This file
- `scripts/` — Including the zip script itself

Excludes: `node_modules/`, `.next/`, cache files, logs.

---

## Example Prompts for AI Tools

Copy-paste these into ChatGPT, Cursor, or Claude when extending the kit:

### 1. Create a new list view

> Create a new experiment in `wireframe-kit/app/experiments/approvals/page.tsx`.
> 
> Show a list of pending approvals with: requester name, request type, date, status.
> Include a search input and status filter tabs.
> Clicking a row opens a right-side detail panel.
> Use the existing Card, Button, Input, Divider primitives.
> Keep it grayscale, single file, local mock data (10–15 items).

### 2. Add an assist nudge pattern

> In the approvals experiment, add a contextual nudge that appears after the user views 3+ items.
> The nudge should say "You're reviewing manually — want me to surface the highest-risk items first?"
> Clicking the nudge opens a right-side assist panel with suggested actions.
> Use useState for all interactivity. No animation libraries.

### 3. Create a settings/config page

> Create `wireframe-kit/app/experiments/settings/page.tsx`.
> 
> Show a form with sections: General, Notifications, Security.
> Each section is a Card with form fields (Input, toggles, dropdowns).
> Include a "Save changes" button that shows a success message.
> Keep styling minimal and grayscale.

### 4. Port an existing avo.re page

> Port `/app/now/risk-heatmap` into `wireframe-kit/app/experiments/risk-heatmap/page.tsx`.
> 
> Goal: grayscale wireframe showing the same UX idea, zero dependency on avo.re.
> - No imports from outside wireframe-kit
> - Replace complex hooks with simple useState
> - Use local mock data
> - Add comments where behavior is simplified

### 5. Create a modal flow

> Add a "Create new book" flow to the ca-books experiment.
> 
> Clicking "Create book" opens a modal with steps:
> 1. Enter book name and meeting date
> 2. Select organization from dropdown
> 3. Confirm and create
> 
> Use useState for step tracking. Close modal on completion or backdrop click.
> Keep it in the same file unless a component is truly reusable.

---

## Rules for Extending

1. **Grayscale only** — No brand colors, no gradients, no shadows heavier than `rgba(0,0,0,0.1)`

2. **Self-contained** — No imports from outside `wireframe-kit/`. Use relative paths:
   ```tsx
   import { Card } from "../../../wireframe-primitives/Card";
   ```

3. **Local mock data** — Define constants in the same file:
   ```tsx
   const ITEMS = [
     { id: "1", name: "...", status: "pending" },
     // ...
   ];
   ```

4. **Simple state** — Use `useState` for interactivity. No complex hooks, no animation libraries, no external state management.

5. **Single file preferred** — Keep the entire experiment in one `page.tsx` unless a component is genuinely reusable across experiments.

6. **Comment simplifications** — When replacing complex behavior:
   ```tsx
   // NOTE: simplified for wireframe kit — original uses intersection observer
   ```

---

## Available Primitives

| Component | Usage |
|-----------|-------|
| `Button` | `<Button>Label</Button>` or `<Button data-variant="primary">` |
| `Input` | `<Input placeholder="..." value={} onChange={} />` |
| `Card` | `<Card>content</Card>` — white background, gray border |
| `Divider` | `<Divider />` — horizontal rule |

Import from:
```tsx
import { Card } from "../../../wireframe-primitives/Card";
```

---

## File Structure

```
wireframe-kit/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Experiment index
│   └── experiments/
│       ├── agentic-hero/       # Incident response patterns
│       ├── ca-books/           # List + detail panel
│       └── ca-bookbuilder/     # Editor + assist nudge
├── styles/
│   └── wireframe.css           # CSS variables, base styles
├── wireframe-primitives/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Divider.tsx
├── scripts/
│   └── make-zip.sh             # Export kit as portable zip
└── README-for-AI.md            # This file
```

---

## Quick Reference: CSS Variables

```css
/* Colors */
var(--color-gray-50)   /* lightest */
var(--color-gray-100)
var(--color-gray-200)
var(--color-gray-300)
var(--color-gray-400)
var(--color-gray-500)
var(--color-gray-600)
var(--color-gray-700)
var(--color-gray-800)
var(--color-gray-900)  /* darkest */

/* Spacing */
var(--space-1) through var(--space-10)

/* Typography */
var(--text-xs), var(--text-sm), var(--text-base), var(--text-lg), var(--text-xl)

/* Border radius */
var(--radius-sm), var(--radius-md), var(--radius-lg), var(--radius-xl)
```
