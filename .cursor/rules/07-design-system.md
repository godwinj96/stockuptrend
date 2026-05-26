---
title: Design System
description: Colour tokens, typography, spacing, component aesthetics, and visual identity rules for StockUptrend.
alwaysApply: true
---

# Design System

## Visual Identity

StockUptrend's visual identity is built around three principles:
1. **Precision** — tight spacing, sharp edges (not rounded-full everywhere), monospaced numerics
2. **Depth** — layered dark surfaces with intentional shadow and glow, not flat
3. **Confidence** — bold typographic hierarchy, strong contrast, deliberate use of green to signal positive financial outcomes

The design must feel like it was made by a team with a strong point of view — not assembled from a UI kit. Every decision (colour, radius, shadow, weight) exists for a reason.

## Colour Tokens

Define as CSS custom properties in `src/app/globals.css`:

```css
:root {
  /* Backgrounds — layered dark surfaces */
  --bg-base: #080B12;          /* deepest layer — body background */
  --bg-surface: #0E1420;       /* cards, panels */
  --bg-elevated: #141A2A;      /* modals, dropdowns, elevated cards */
  --bg-overlay: #1B2236;       /* tooltips, popovers */

  /* Accent — green is the primary brand signal (profit, success, CTAs) */
  --accent-primary: #00C27A;   /* primary CTA, success states, positive P&L */
  --accent-primary-hover: #00D988; /* hover state for primary accent */
  --accent-primary-muted: rgba(0, 194, 122, 0.12); /* subtle backgrounds */

  /* Accent — blue for secondary actions, information, links */
  --accent-secondary: #3E7BFA;
  --accent-secondary-hover: #5B91FF;
  --accent-secondary-muted: rgba(62, 123, 250, 0.12);

  /* Accent — gold for premium/VIP tiers */
  --accent-gold: #E8A530;
  --accent-gold-muted: rgba(232, 165, 48, 0.12);

  /* Semantic */
  --color-danger: #F04E4E;
  --color-danger-muted: rgba(240, 78, 78, 0.12);
  --color-warning: #F5A623;
  --color-warning-muted: rgba(245, 166, 35, 0.12);
  --color-info: var(--accent-secondary);

  /* Text */
  --text-primary: #EEF2FF;     /* main body text */
  --text-secondary: #8B95B0;   /* secondary labels, captions */
  --text-tertiary: #4D566B;    /* placeholder text, disabled */
  --text-inverse: #080B12;     /* text on light/accent backgrounds */

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);   /* card borders */
  --border-default: rgba(255, 255, 255, 0.10);  /* input borders, dividers */
  --border-strong: rgba(255, 255, 255, 0.18);   /* focused states */
  --border-accent: var(--accent-primary);

  /* Shadows / Glows */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px var(--border-subtle);
  --shadow-elevated: 0 4px 24px rgba(0,0,0,0.5);
  --glow-accent: 0 0 20px rgba(0, 194, 122, 0.25);
  --glow-accent-strong: 0 0 40px rgba(0, 194, 122, 0.35);
}
```

Map tokens to Tailwind in `tailwind.config.ts`:

```typescript
// tailwind.config.ts
colors: {
  bg: {
    base: 'var(--bg-base)',
    surface: 'var(--bg-surface)',
    elevated: 'var(--bg-elevated)',
    overlay: 'var(--bg-overlay)',
  },
  accent: {
    primary: 'var(--accent-primary)',
    'primary-hover': 'var(--accent-primary-hover)',
    'primary-muted': 'var(--accent-primary-muted)',
    secondary: 'var(--accent-secondary)',
    gold: 'var(--accent-gold)',
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
  },
  border: {
    subtle: 'var(--border-subtle)',
    default: 'var(--border-default)',
    strong: 'var(--border-strong)',
  },
  danger: 'var(--color-danger)',
  warning: 'var(--color-warning)',
}
```

## Typography

**Font loading** (via `next/font` — no external CDN calls):

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
// Heading font: Bricolage Grotesque (variable) for display headings
// Body font: Inter (variable) for all UI text
```

**Type scale:**

| Token | Size | Weight | Usage |
|---|---|---|---|
| Display | `text-5xl` / `text-6xl` | 700 | Hero headlines |
| H1 | `text-4xl` | 700 | Page titles |
| H2 | `text-3xl` | 600 | Section headings |
| H3 | `text-2xl` | 600 | Card headings, subsections |
| H4 | `text-xl` | 600 | Widget titles |
| Body Large | `text-lg` | 400 | Lead paragraphs |
| Body | `text-base` | 400 | Default body text |
| Body Small | `text-sm` | 400 | Secondary info, captions |
| Label | `text-sm` | 500 | Form labels, table headers |
| Caption | `text-xs` | 400 | Timestamps, metadata |
| Mono | `font-mono text-sm` | 400 | Account numbers, trade symbols, prices |

**Numeric rendering:**
- All financial numbers use `font-variant-numeric: tabular-nums` — add `tabular-nums` Tailwind class to any element displaying prices, balances, P&L, or account numbers
- Positive P&L: `text-accent-primary`
- Negative P&L: `text-danger`

**Rules:**
- Headings use Bricolage Grotesque. Body uses Inter. Never mix more than 2 typefaces.
- Never set custom `font-size` values — use Tailwind scale only
- Line height: `leading-tight` (1.25) for headings, `leading-normal` (1.5) for body, `leading-relaxed` (1.625) for long-form content
- Do not center-align paragraphs longer than 2 lines

## Spacing

4px base unit — use Tailwind spacing scale exclusively. Common pattern:

- Card padding: `p-5` or `p-6`
- Section vertical padding: `py-16` or `py-24`
- Stacked element gaps: `gap-3` or `gap-4`
- Inline element gaps: `gap-2`
- Section header to content: `mt-8` or `mt-10`

## Border Radius

| Context | Value | Tailwind |
|---|---|---|
| Cards, panels | 10px | `rounded-xl` |
| Buttons | 8px | `rounded-lg` |
| Inputs | 8px | `rounded-lg` |
| Badges, pills | 999px | `rounded-full` |
| Modals | 16px | `rounded-2xl` |
| Avatar | 50% | `rounded-full` |
| Small chips/tags | 6px | `rounded-md` |

Do not apply `rounded-full` to rectangular content cards — it reads as a UI kit default, not intentional design.

## Component Aesthetics

### Cards

```css
/* Base card pattern */
background: var(--bg-surface);
border: 1px solid var(--border-subtle);
border-radius: 10px;
box-shadow: var(--shadow-card);
/* On hover (interactive cards): */
border-color: var(--border-default);
transform: translateY(-2px);
box-shadow: var(--shadow-elevated);
transition: all 200ms ease-out;
```

Tailwind shorthand: `bg-bg-surface border border-border-subtle rounded-xl shadow-card`

### Buttons

**Primary (CTA):**
```
bg: accent-primary | hover: accent-primary-hover
text: text-inverse (dark)
padding: px-5 py-2.5
border-radius: rounded-lg
shadow: shadow glow-accent (on hover only)
font-weight: 600
```

**Secondary:**
```
bg: transparent | hover: accent-secondary-muted
border: 1px solid border-default | hover: border-accent-secondary
text: text-primary
```

**Ghost:**
```
bg: transparent | hover: bg-bg-elevated
text: text-secondary | hover: text-primary
no border
```

**Destructive:**
```
bg: danger (at 90% opacity) | hover: danger
text: white
```

### Inputs

```css
background: var(--bg-elevated);
border: 1px solid var(--border-default);
border-radius: 8px;
color: var(--text-primary);
/* Focus: */
border-color: var(--accent-primary);
box-shadow: 0 0 0 3px var(--accent-primary-muted);
/* Error: */
border-color: var(--color-danger);
box-shadow: 0 0 0 3px var(--color-danger-muted);
```

Placeholder text: `text-text-tertiary`. Label above input (not inside), weight 500, size `text-sm`.

### Badges / Status Chips

```
approved/success: bg-accent-primary-muted text-accent-primary border-none
pending: bg-warning-muted text-warning
rejected/error: bg-danger-muted text-danger
info: bg-accent-secondary-muted text-accent-secondary
neutral: bg-bg-overlay text-text-secondary
```

Sizing: `text-xs font-medium px-2.5 py-0.5 rounded-full`

### Data Tables

```
Header row: bg-bg-elevated, border-b border-border-default, text-text-secondary text-xs uppercase tracking-wider
Body rows: border-b border-border-subtle, hover: bg-bg-elevated/50
Striped: alternate rows with bg-bg-surface and bg-bg-elevated
Numeric columns: tabular-nums, right-aligned
```

## Visual Identity Anti-Patterns

**Never do:**
- White or light grey page backgrounds
- Generic gradient backgrounds (purple-to-blue, rainbow mesh)
- Default shadcn grey color palette without brand overrides
- Glassmorphism with bright backdrop blur on dark surfaces (reads as generic)
- Stock photo illustrations or generic icon packs
- Flat icons with no visual weight — use Lucide icons consistently
- Rainbow or multi-colour gradient text in headings
- Centred body text blocks over 2 lines
- Cards with no visual depth (no border, no shadow, just flat background)
- Inconsistent border radii (mixing `rounded-3xl` with `rounded-sm` arbitrarily)
- Tables or data grids styled without proper row separation

## Dark Mode

Dark is the default and primary mode. All components are built dark-first. If light mode is added in the future, it is an overlay — not the baseline.

```typescript
// In layout.tsx, set html class to dark by default
// next-themes handles switching — but dark is the default experience
```

## Responsive Breakpoints

Mobile-first: write base styles for 375px, then layer up:

| Breakpoint | Width | Context |
|---|---|---|
| Base | 375px+ | Mobile (default) |
| `sm:` | 640px+ | Large mobile / phablet |
| `md:` | 768px+ | Tablet |
| `lg:` | 1024px+ | Small desktop |
| `xl:` | 1280px+ | Desktop |
| `2xl:` | 1536px+ | Large desktop |

No layout may break below 375px width. Test at 375px and 1440px as primary checkpoints.
