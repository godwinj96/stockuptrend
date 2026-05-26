---
title: Tech Stack
description: Authoritative package list, version pins, and banned packages for StockUptrend.
alwaysApply: true
---

# Tech Stack

## Core Framework

| Package | Version | Purpose |
|---|---|---|
| `next` | `^14.2.x` | App Router, SSR, ISR, Route Handlers |
| `react` | `^18.3.x` | UI rendering |
| `react-dom` | `^18.3.x` | DOM rendering |
| `typescript` | `^5.x` | Type safety (strict mode) |

## Supabase

| Package | Version | Purpose |
|---|---|---|
| `@supabase/supabase-js` | `^2.x` | Supabase client |
| `@supabase/ssr` | `^0.x` | SSR-compatible auth (createServerClient, createBrowserClient) |

> Always use `@supabase/ssr` for auth in Next.js. Never use the legacy `@supabase/auth-helpers-nextjs`.

## Styling

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | `^3.4.x` | Utility-first CSS |
| `postcss` | `^8.x` | Tailwind processing |
| `autoprefixer` | `^10.x` | Vendor prefix handling |
| `clsx` | `^2.x` | Conditional class utility |
| `tailwind-merge` | `^2.x` | Merge Tailwind classes without conflicts |
| `tailwindcss-animate` | `^1.x` | Animation utilities (used by shadcn) |

## Components

| Package | Version | Purpose |
|---|---|---|
| `shadcn/ui` | latest CLI | Copy-paste component primitives |
| `@radix-ui/*` | latest (via shadcn) | Accessible headless primitives |
| `lucide-react` | `^0.x` | Icons — the only icon library used |
| `cmdk` | `^1.x` | Command palette (shadcn dependency) |

> shadcn/ui is installed via `npx shadcn@latest add [component]`. Components land in `/src/components/ui/`. Do not install `@shadcn/ui` as a package.

## Animation

| Package | Version | Purpose |
|---|---|---|
| `framer-motion` | `^11.x` | Page transitions, scroll animations, microinteractions |

> Framer Motion handles all complex animations. Tailwind `transition-*` utilities handle simple hover/focus states only.

## Forms & Validation

| Package | Version | Purpose |
|---|---|---|
| `react-hook-form` | `^7.x` | Form state management |
| `zod` | `^3.x` | Schema validation (client + server) |
| `@hookform/resolvers` | `^3.x` | Connects Zod to React Hook Form |

> Every form in the app uses React Hook Form + Zod. No `useState` for form fields.

## Data Fetching & State

| Package | Version | Purpose |
|---|---|---|
| `swr` | `^2.x` | Client-side data fetching with caching/revalidation |
| `zustand` | `^4.x` | Global UI state (modals, sidebar, theme) |

## Payments

| Package | Version | Purpose |
|---|---|---|
| `stripe` | `^16.x` | Stripe server-side SDK (Route Handlers only) |
| `@stripe/stripe-js` | `^4.x` | Stripe client-side (Elements) |
| `@stripe/react-stripe-js` | `^2.x` | React components for Stripe Elements |

> MoonPay and Coinbase Commerce are integrated via widget embed and REST API — no dedicated npm packages required.

## Charts & Market Data

| Package | Version | Purpose |
|---|---|---|
| `lightweight-charts` | `^4.x` | TradingView Lightweight Charts (for custom chart components if needed) |
| `recharts` | `^2.x` | Internal charts (P&L, balance history in portal) |

> TradingView widget embeds (ticker, advanced chart, market overview) are loaded via script tag inside Client Components. See `11-trading-and-market-data.md`.

## Notifications & UI Utilities

| Package | Version | Purpose |
|---|---|---|
| `sonner` | `^1.x` | Toast notifications |
| `next-themes` | `^0.x` | Dark/light mode (dark is default) |
| `date-fns` | `^3.x` | Date formatting and manipulation |

## i18n

| Package | Version | Purpose |
|---|---|---|
| `next-intl` | `^3.x` | Translations, locale routing, RTL support |

## SEO

| Package | Version | Purpose |
|---|---|---|
| `next-sitemap` | `^4.x` | Auto-generated sitemap.xml |

## Monitoring & Analytics

| Package | Version | Purpose |
|---|---|---|
| `@sentry/nextjs` | `^8.x` | Error monitoring (client + server) |
| `@vercel/analytics` | `^1.x` | Vercel Analytics |
| `@vercel/speed-insights` | `^1.x` | Core Web Vitals tracking |

## Dev Tools

| Package | Version | Purpose |
|---|---|---|
| `eslint` | `^8.x` | Linting |
| `eslint-config-next` | `^14.x` | Next.js ESLint rules |
| `prettier` | `^3.x` | Code formatting |
| `prettier-plugin-tailwindcss` | `^0.x` | Sorts Tailwind classes automatically |

## Banned Packages

Do not install these. If you find them in the codebase, replace them:

| Banned | Use Instead | Reason |
|---|---|---|
| `moment` / `moment-timezone` | `date-fns` | Bundle size, deprecated |
| `axios` | native `fetch` | Unnecessary abstraction in Next.js 14 |
| `lodash` / `lodash-es` | Native JS (Array methods, Object.entries, etc.) | Bundle size |
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | Deprecated, SSR-incompatible |
| `react-query` / `@tanstack/react-query` | `swr` | Already chosen, don't mix |
| `redux` / `@reduxjs/toolkit` | `zustand` | Overkill for this app |
| `styled-components` / `emotion` | Tailwind CSS | CSS-in-JS conflicts with SSR |
| `react-icons` | `lucide-react` | Only one icon library |
| `uuid` | `crypto.randomUUID()` (Web Crypto API) | Native alternative |
| `classnames` | `clsx` (already installed) | Redundant |

## TypeScript Configuration

```json
// tsconfig.json (key settings)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Use `@/` path alias throughout — no relative `../` imports that traverse more than one directory level.

## Tailwind Configuration

```typescript
// tailwind.config.ts — extend the theme with brand tokens
// All custom values are added to `extend`, never overriding Tailwind defaults
// CSS custom properties are defined in globals.css and referenced here
// See 07-design-system.md for the full token set
```

## next.config.js Requirements

```javascript
// Required configurations:
// 1. CSP headers — include TradingView, Stripe, MoonPay domains
// 2. Image domains — allow Supabase storage domain
// 3. i18n locale routing — handled by next-intl middleware
// 4. Sentry integration — via withSentryConfig wrapper
```
