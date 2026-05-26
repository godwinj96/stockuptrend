---
title: Folder Structure
description: Canonical directory layout for StockUptrend. Agents must not deviate from this structure.
alwaysApply: true
---

# Folder Structure

Agents must follow this layout exactly. Do not create new top-level directories without a rule update.

## Top-Level Layout

```
stockuptrend/
├── .cursor/
│   └── rules/              ← All rules files (this directory)
├── src/
│   ├── app/                ← Next.js App Router
│   ├── components/         ← All React components
│   ├── lib/                ← Utilities, Supabase clients, constants
│   ├── hooks/              ← Custom React hooks
│   ├── styles/             ← Global CSS and animation utilities
│   └── types/              ← TypeScript type definitions
├── public/
│   ├── images/             ← Static images (hero, logos, backgrounds)
│   └── icons/              ← SVG icons not from Lucide
├── .env.local              ← Local env vars (never commit)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## App Directory (`/src/app/`)

```
app/
├── layout.tsx              ← Root layout (fonts, providers, analytics)
├── globals.css             ← Tailwind directives + CSS custom properties
├── error.tsx               ← Root error boundary
├── not-found.tsx           ← 404 page
│
├── (marketing)/            ← Route group: public pages (no URL prefix)
│   ├── layout.tsx          ← Marketing layout (Navbar + Footer)
│   ├── page.tsx            ← Homepage (/)
│   ├── about/
│   │   └── page.tsx
│   ├── trading-instruments/
│   │   ├── page.tsx
│   │   └── [slug]/         ← Individual instrument detail pages
│   │       └── page.tsx
│   ├── platforms/
│   │   └── page.tsx
│   ├── account-types/
│   │   └── page.tsx
│   ├── trading-conditions/
│   │   └── page.tsx
│   ├── safety-of-funds/
│   │   └── page.tsx
│   ├── education/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── faq/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   └── legal/
│       ├── terms/page.tsx
│       ├── privacy/page.tsx
│       ├── risk-disclosure/page.tsx
│       └── aml-kyc/page.tsx
│
├── (portal)/               ← Route group: authenticated client portal
│   ├── layout.tsx          ← Portal layout (PortalSidebar + PortalHeader)
│   ├── portal/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── deposit/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── withdrawal/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── kyc/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── trade-history/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── support/
│   │   │   ├── page.tsx
│   │   │   ├── [ticketId]/
│   │   │   │   └── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── error.tsx
│
├── auth/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── verify/
│   │   └── page.tsx        ← Email verification landing
│   ├── reset-password/
│   │   └── page.tsx
│   └── callback/
│       └── route.ts        ← Supabase OAuth/magic link callback
│
└── api/                    ← Route Handlers only — no UI here
    ├── portal/
    │   ├── deposit/route.ts
    │   ├── withdrawal/route.ts
    │   └── kyc/route.ts
    └── webhooks/
        ├── stripe/route.ts
        └── coinbase/route.ts
```

## Components Directory (`/src/components/`)

```
components/
├── ui/                     ← shadcn/ui generated components — DO NOT EDIT MANUALLY
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── table.tsx
│   └── ... (all shadcn primitives)
│
├── shared/                 ← Used across both marketing and portal
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── RiskWarningBanner.tsx
│   ├── MarketTicker.tsx    ← TradingView ticker tape wrapper
│   ├── TrustBadgeBar.tsx
│   ├── LoadingSkeleton.tsx
│   ├── ErrorState.tsx
│   ├── EmptyState.tsx
│   └── LanguageSelector.tsx
│
├── marketing/              ← Page-specific marketing components
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── InstrumentsOverview.tsx
│   │   ├── WhyStockUptrend.tsx
│   │   ├── AccountTypesTease.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── HomeCTA.tsx
│   ├── instruments/
│   │   ├── InstrumentCard.tsx
│   │   ├── InstrumentTable.tsx
│   │   └── TradingChart.tsx   ← TradingView chart widget wrapper
│   └── account-types/
│       └── AccountTypeTier.tsx
│
├── portal/                 ← Client portal components
│   ├── layout/
│   │   ├── PortalSidebar.tsx
│   │   ├── PortalHeader.tsx
│   │   ├── NotificationDropdown.tsx
│   │   └── KYCStatusBanner.tsx
│   ├── dashboard/
│   │   ├── BalanceWidget.tsx
│   │   ├── PnLSummary.tsx
│   │   ├── QuickActions.tsx
│   │   └── RecentTransactions.tsx
│   ├── kyc/
│   │   ├── KYCStepPersonal.tsx
│   │   ├── KYCStepDocuments.tsx
│   │   ├── KYCStepSelfie.tsx
│   │   └── KYCStatusTracker.tsx
│   ├── payments/
│   │   ├── DepositForm.tsx
│   │   ├── WithdrawalForm.tsx
│   │   ├── PaymentMethodTabs.tsx
│   │   ├── StripeCardForm.tsx
│   │   ├── MoonPayWidget.tsx
│   │   └── CryptoAddressDisplay.tsx
│   ├── trade-history/
│   │   └── TradeHistoryTable.tsx
│   └── support/
│       ├── TicketList.tsx
│       ├── NewTicketForm.tsx
│       └── TicketThread.tsx
│
└── charts/                 ← TradingView widget wrappers
    ├── TradingViewTicker.tsx
    ├── TradingViewChart.tsx
    ├── TradingViewMarketOverview.tsx
    └── TradingViewEconomicCalendar.tsx
```

## Lib Directory (`/src/lib/`)

```
lib/
├── supabase/
│   ├── server.ts           ← createServerClient (for Server Components and Route Handlers)
│   ├── client.ts           ← createBrowserClient (for Client Components)
│   ├── middleware.ts        ← Session refresh for middleware.ts
│   └── types.ts            ← Generated Supabase types (run: supabase gen types)
├── utils/
│   ├── cn.ts               ← clsx + tailwind-merge utility
│   ├── format.ts           ← Currency, date, number formatters
│   └── errors.ts           ← Structured error handling utilities
├── validations/
│   ├── auth.ts             ← Login, register, reset-password Zod schemas
│   ├── kyc.ts              ← KYC form Zod schemas
│   ├── payments.ts         ← Deposit/withdrawal Zod schemas
│   └── support.ts          ← Support ticket Zod schemas
└── constants/
    ├── instruments.ts      ← Instrument list, categories, symbols
    ├── account-types.ts    ← Account tier definitions and features
    ├── currencies.ts       ← Supported deposit currencies
    └── routes.ts           ← Typed route constants (never hardcode paths)
```

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Directories | `kebab-case` | `trade-history/`, `account-types/` |
| Page files | `page.tsx` (fixed by Next.js) | `page.tsx` |
| Component files | `PascalCase.tsx` | `BalanceWidget.tsx` |
| Hook files | `camelCase.ts` with `use` prefix | `useAccountBalance.ts` |
| Utility files | `camelCase.ts` | `format.ts`, `cn.ts` |
| Constant files | `kebab-case.ts` | `account-types.ts` |
| Type files | `camelCase.ts` | `portal.ts` |
| CSS modules | N/A — use Tailwind only | — |

## Rules

- One component per file. Related sub-components can be co-located in the same folder but each in their own file.
- Every route folder that fetches data must have a `loading.tsx` (skeleton) and `error.tsx` (error state).
- Route Handlers live in `/app/api/` — no business logic in page files.
- No barrel files (`index.ts`) in `/components/ui/` — import shadcn components directly.
- The `/src/components/ui/` directory is owned by shadcn/ui. Never edit files in it directly; extend components in `/src/components/shared/` or `/src/components/marketing/` etc.
