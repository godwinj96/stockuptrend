---
title: Animation & Motion
description: Framer Motion rules, timing constants, scroll animations, microinteractions, and motion anti-patterns.
alwaysApply: true
---

# Animation & Motion

## Philosophy

Every animation must earn its place. The three legitimate reasons for animation:

1. **Reveal** — show new information or content (scroll-triggered entrances, page transitions)
2. **Confirm** — affirm an action was received (button feedback, form submission, state change)
3. **Guide** — direct attention to something important (notification pulse, status change flash)

If an animation doesn't do one of these things, remove it.

## Tooling

- **Framer Motion** (`framer-motion`) — all animations with logic, state, or multi-step sequences
- **Tailwind `transition-*` utilities** — simple CSS transitions (hover colour, border, shadow changes)
- **Never** use raw CSS `@keyframes` for anything that needs to be accessible or respond to `prefers-reduced-motion`

## Timing Constants

Define in `src/lib/constants/motion.ts` and import everywhere:

```typescript
export const MOTION = {
  duration: {
    micro: 0.15,      // 150ms — button press, checkbox tick, small state changes
    fast: 0.2,        // 200ms — hover transitions, colour shifts
    standard: 0.3,    // 300ms — modal open, dropdown, panel slide
    entrance: 0.6,    // 600ms — section entrance, page content reveal
    slow: 0.8,        // 800ms — hero animation, large layout shifts
  },
  ease: {
    out: [0.0, 0.0, 0.2, 1.0],       // ease-out — element entrances
    inOut: [0.4, 0.0, 0.2, 1.0],     // ease-in-out — transitions between states
    spring: { type: 'spring', stiffness: 300, damping: 30 }, // interactive snap
  },
  stagger: {
    fast: 0.05,       // 50ms between items in a list
    standard: 0.1,    // 100ms — default stagger for card grids
    slow: 0.15,       // 150ms — trust badges, feature list items
  },
} as const
```

**Hard limit:** No single animation duration exceeds 800ms. If a sequence needs longer, break it into chained steps.

## `prefers-reduced-motion`

Every Framer Motion animation must respect this preference:

```typescript
// src/hooks/useReducedMotion.ts
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

export function useReducedMotion() {
  return useFramerReducedMotion()
}

// Usage in any animated component:
const shouldReduceMotion = useReducedMotion()

const variants = {
  hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
  visible: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
}
```

When `prefers-reduced-motion: reduce` is set, animations fall back to instant opacity changes only — no movement.

## Reusable Animation Variants

Define standard variants in `src/lib/constants/motion.ts`:

```typescript
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION.duration.entrance,
      ease: MOTION.ease.out,
      delay: i * MOTION.stagger.standard,
    },
  }),
}

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION.duration.standard, ease: MOTION.ease.out },
  },
}

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: MOTION.duration.entrance, ease: MOTION.ease.out },
  },
}

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION.duration.standard,
      ease: MOTION.ease.out,
      delay: i * MOTION.stagger.fast,
    },
  }),
}
```

## Scroll-Triggered Entrance Animations

Use Framer Motion `useInView` with `once: true` (animate only on first entry):

```typescript
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}
```

**Per-element rules:**

| Element | Animation | Trigger |
|---|---|---|
| Hero headline | Fade up (`y: 30 → 0`) | Immediate on page load |
| Hero subheadline | Fade up, delay 0.1s | Immediate on page load |
| Hero CTAs | Fade up, delay 0.2s | Immediate on page load |
| Section headings | Slide in from left (`x: -20 → 0`) | 20% in viewport |
| Stat counters | Count up (number animation) | First viewport entry |
| Feature/instrument cards | Staggered scale-up + fade | 20% of container in viewport |
| Trust badges | Horizontal stagger slide-in | In viewport |
| "How it works" steps | Sequential fade-up with 0.15s stagger | In viewport |
| Testimonials | Fade in | In viewport |

## Page Transitions

```typescript
// src/app/(marketing)/layout.tsx
// Wrap page content with AnimatePresence + motion.div

// Standard page transition variant
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1.0] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}
```

Keep page transitions subtle — this is a financial platform, not a portfolio site. Minimal movement.

## Hover Microinteractions

These are CSS `transition` utilities on components (no Framer Motion needed):

### CTA Buttons (Primary)
```css
transition: all 200ms ease-out;
/* hover: scale(1.02), shadow gains glow, background slightly brightens */
/* active: scale(0.98) — press feedback */
```

```typescript
className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-glow-accent"
```

### Cards (Interactive)
```typescript
className="transition-all duration-200 hover:-translate-y-0.5 hover:border-border-default hover:shadow-elevated cursor-pointer"
```

### Navigation Links
```typescript
// Underline grows from left on hover
className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent-primary after:transition-all after:duration-200 hover:after:w-full"
```

### Instrument Rows (in tables)
```typescript
className="transition-colors duration-150 hover:bg-bg-elevated/60 border-l-2 border-l-transparent hover:border-l-accent-primary"
```

### Icon Buttons
```typescript
className="transition-colors duration-150 hover:text-text-primary hover:bg-bg-elevated rounded-lg p-2"
```

## Number / Counter Animations

For stat counters (homepage stats, dashboard balance):

```typescript
// Use framer-motion useSpring + useTransform, or a dedicated count-up hook
import { animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function useCountUp(target: number, duration = 1.5) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => { node.textContent = formatNumber(v) },
    })
    return () => controls.stop()
  }, [target, duration])
  return ref
}
```

Dashboard balance: counts up on first load from 0 to current balance over 1.2s.

## Price Change Flash

When a price updates in an instrument card or market ticker:

```typescript
// Flash green background for positive change, red for negative
// CSS class toggled briefly then removed
const flashClass = change > 0 ? 'bg-accent-primary-muted' : 'bg-danger-muted'
// Add class, remove after 600ms
```

## Loading State Animations

Skeleton screens use Tailwind `animate-pulse`. Never use a spinner for a content area — only for button loading states.

**Button loading state:**
```typescript
<Button disabled={isLoading}>
  {isLoading ? (
    <span className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Processing...
    </span>
  ) : 'Submit'}
</Button>
```

## Portal-Specific Animations

- Dashboard balance widget: count-up on first render
- Transaction status change: row highlights briefly (fade green/yellow)
- Notification bell: subtle bounce when new notification arrives (`animate-bounce` for 2 cycles then stops)
- KYC step progress: progress bar fills smoothly between steps
- Deposit success: checkmark icon draws itself (SVG path animation via Framer Motion)
- Modal open: scale from 0.95 → 1 + fade, backdrop fade in simultaneously

## Anti-Patterns

**Never do:**
- Spring/bouncy animations on financial numbers or account balances — reads as frivolous
- Parallax scrolling on mobile — causes layout jank and motion sickness
- Continuous looping animations on static content (pulsing, rotating, floating)
- Animations that delay access to content (hero animations that must complete before CTA is visible)
- CSS `animation` properties that can't respond to `prefers-reduced-motion`
- `transition: all` on elements with many changing properties — always specify the property
- Animate layout properties (`width`, `height`, `top`, `left`) — use `transform` instead
- Multiple simultaneous entrance animations competing for attention
