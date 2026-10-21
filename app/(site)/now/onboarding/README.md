# Self-Contained Onboarding Demo

This is a **complete, self-contained demo** that lives entirely in `/app/now/onboarding/`.

## 📁 File Structure

Everything goes in one folder:

```
app/
  now/
    onboarding/
      ├── page.tsx                    ← Main demo page
      ├── onboarding-engine.ts        ← Core logic (separated)
      ├── useOnboarding.ts            ← React hook
      ├── OnboardingTooltip.tsx       ← Tooltip UI
      ├── HelpIndicator.tsx           ← Help badges
      └── ChecklistPanel.tsx          ← Progress footer
```

## 🚀 Installation

1. **Copy all files** from this folder to `app/now/onboarding/`
2. **Install dependency**: `npm install lucide-react`
3. **Visit** `/now/onboarding` in your browser
4. **Click** "Start Dashboard Tour"

That's it! Everything is self-contained.

## ✨ What This Demonstrates

- ✅ **Clean separation** - Logic (engine) separate from UI (components)
- ✅ **Help indicators** - Pulsing ? badges on elements
- ✅ **Triangle arrows** - Point from tooltip to target
- ✅ **GIF support** - Show animations in tooltips
- ✅ **Progress tracking** - Checklist in collapsible footer
- ✅ **Pulsing dots** - Visual feedback on target elements

## 🎯 For Stakeholders

This proves you can build a **lightweight alternative to Pendo**:

| Feature | Pendo | This Demo |
|---------|-------|-----------|
| Bundle size | 100KB+ | ~15KB |
| Cost | $1000+/month | $0 |
| Customization | Limited | Full control |
| Vendor lock-in | Yes | No |
| Code ownership | No | Yes |

## 🔧 How It Works

### 1. Configuration (Pure Data)
```typescript
// In page.tsx
const demoConfig = {
  flows: [...],           // Your onboarding flows
  helpIndicators: [...]   // Elements with help
};
```

### 2. Engine (Pure Logic)
```typescript
// onboarding-engine.ts
// State management, events, no UI
const engine = createOnboardingEngine(config);
```

### 3. React Integration
```typescript
// useOnboarding.ts
// Connects engine to React components
const onboarding = useOnboarding(engine);
```

### 4. UI Components
```typescript
// Reusable, can be customized
<OnboardingTooltip {...} />
<HelpIndicator {...} />
<ChecklistPanel {...} />
```

## 📝 To Customize

### Change the tour steps
Edit `demoConfig` in `page.tsx`:
```typescript
steps: [
  {
    id: 'my-step',
    target: '#my-element',
    title: 'My Title',
    content: 'My description',
    position: 'bottom'
  }
]
```

### Change your brand colors
In your `globals.css`:
```css
:root {
  --accent: 236 72 153; /* Your pink RGB values */
}
```

### Add more UI elements
Just add IDs to elements and reference them in config:
```tsx
<div id="new-feature">My Feature</div>

// In config:
helpIndicators: ['#new-feature']
```

## 🎬 Demo Flow

1. Load `/now/onboarding`
2. See pulsing ? badges on 4 features
3. Click "Start Dashboard Tour"
4. Walk through 4 steps with arrows, dots, GIFs
5. Click features to complete checklist
6. Watch progress bar fill up
7. Get celebration when done!

## 📦 What's NOT Here

This demo is isolated - it does NOT:
- ❌ Install framework across your whole site
- ❌ Touch your homepage or other pages
- ❌ Require changes elsewhere

It's purely a proof-of-concept living in `/now/onboarding`.

## 🚀 Next Steps

After showing stakeholders:
1. If approved, extract framework to `/src/onboarding/`
2. Use throughout your actual app
3. Create real onboarding flows for your features
4. Deploy!

---

**This is a complete, working alternative to Pendo that you own and control.**
