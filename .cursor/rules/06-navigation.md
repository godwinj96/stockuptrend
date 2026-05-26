---
title: Navigation
description: Complete sitemap, URL structure, nav component rules, and routing conventions.
alwaysApply: false
---

# Navigation

## Sitemap

### Public Marketing Site

```
/                               Homepage
/about                          About Us
/trading-instruments            All instruments overview
/trading-instruments/[slug]     Individual instrument detail
/platforms                      Trading platforms (MT5, WebTrader)
/account-types                  Account tiers and comparison
/trading-conditions             Spreads, leverage, execution
/safety-of-funds                Regulation, segregated accounts, insurance
/education                      Education hub (blog/articles)
/education/[slug]               Individual article
/faq                            Frequently Asked Questions
/contact                        Contact & Support
/legal/terms                    Terms of Service
/legal/privacy                  Privacy Policy
/legal/risk-disclosure          Risk Disclosure Statement
/legal/aml-kyc                  AML & KYC Policy
```

### Authentication

```
/auth/login                     Sign in
/auth/register                  Create account
/auth/verify                    Email verification prompt
/auth/reset-password            Request password reset
/auth/callback                  Supabase auth callback (handles tokens)
```

### Client Portal

```
/portal/dashboard               Account overview
/portal/deposit                 Fund account
/portal/withdrawal              Request withdrawal
/portal/trade-history           All trades table
/portal/kyc                     KYC verification flow
/portal/support                 Support ticket list
/portal/support/[ticketId]      Ticket detail / thread
/portal/settings                Account settings
```

## URL Conventions

- All URLs: lowercase, kebab-case, no trailing slashes
- No URL parameters for navigation state — use path segments
- Filter/pagination state: URL search params (`?page=2&symbol=EURUSD`), not component state
- No hash fragments for navigation — use proper page sections with scroll behavior
- Dynamic segments use `[slug]` or `[ticketId]` — meaningful names, not generic `[id]`

## Public Site Navigation

### Sticky Header (`<Navbar />`)

Structure:
```
[Logo]   [Nav Links]   [Login]  [Register CTA]
```

**Desktop nav links with mega-menu dropdowns:**

- **Trading** (mega-menu)
  - Trading Instruments → `/trading-instruments`
  - Trading Conditions → `/trading-conditions`
  - Platforms → `/platforms`
  - Account Types → `/account-types`

- **Company** (dropdown)
  - About Us → `/about`
  - Safety of Funds → `/safety-of-funds`
  - FAQ → `/faq`
  - Contact → `/contact`

- **Education** (dropdown)
  - Education Hub → `/education`
  - *(Webinars, Glossary — Phase 2)*

**Right side:**
- Language selector (`<LanguageSelector />`)
- Login → `/auth/login` (ghost/outline button)
- Register → `/auth/register` (primary CTA button — accent green)

**Behavior:**
- Sticky on scroll with backdrop blur and subtle border-bottom on scroll
- Transparent on homepage hero, opaque background below fold
- Mobile: collapses to hamburger menu → full-screen drawer overlay with all links
- Active route: current page nav link has accent color indicator

### Footer (`<Footer />`)

Four-column layout on desktop, stacked on mobile:

| Column 1: StockUptrend | Column 2: Trading | Column 3: Company | Column 4: Legal & Support |
|---|---|---|---|
| Logo + tagline | Instruments | About Us | Terms of Service |
| Social links | Conditions | Safety of Funds | Privacy Policy |
| Language selector | Platforms | FAQ | Risk Disclosure |
| — | Account Types | Contact | AML/KYC Policy |

Below columns:
- Risk warning text (abbreviated — "Trading CFDs carries significant risk...")
- Copyright line: "© 2024 StockUptrend. All rights reserved."
- Regulatory notice

## Client Portal Navigation

### Sidebar (`<PortalSidebar />`)

Fixed left sidebar on desktop (width: 240px), bottom navigation on mobile.

```
[StockUptrend Logo]
[User avatar + name + account type badge]

─── Main ───
[Icon] Dashboard        /portal/dashboard
[Icon] Deposit          /portal/deposit
[Icon] Withdrawal       /portal/withdrawal

─── Account ───
[Icon] Trade History    /portal/trade-history
[Icon] KYC              /portal/kyc  [status badge]
[Icon] Support          /portal/support  [unread count badge]

─── Other ───
[Icon] Settings         /portal/settings
[Icon] Sign Out         (action, not link)
```

**Behavior:**
- Active route: highlighted with accent background + left border accent
- KYC menu item shows status badge: pending (yellow), approved (green), rejected (red)
- Support shows unread ticket reply count badge
- Sidebar collapsible on desktop (icon-only mode) — state persisted in Zustand
- Mobile: bottom tab bar with 5 primary items (Dashboard, Deposit, Withdraw, History, More)

### Portal Header (`<PortalHeader />`)

```
[Hamburger / sidebar toggle]   [Page title]   [Search?]   [Notifications]  [Avatar menu]
```

- Notifications bell: `<NotificationDropdown />` — shows last 10 unread notifications
- Avatar menu: Profile link, Settings, Sign Out
- Mobile only: shows hamburger to open sidebar drawer

## Breadcrumbs

All portal interior pages show breadcrumbs below the portal header:

```
Portal > [Section] > [Page Title]
```

Implemented with `<nav aria-label="breadcrumb">` and JSON-LD BreadcrumbList schema.

## Routing Constants

All route paths are defined in `src/lib/constants/routes.ts` — never hardcode URL strings in components:

```typescript
// src/lib/constants/routes.ts
export const ROUTES = {
  home: '/',
  about: '/about',
  instruments: '/trading-instruments',
  instrument: (slug: string) => `/trading-instruments/${slug}`,
  platforms: '/platforms',
  accountTypes: '/account-types',
  conditions: '/trading-conditions',
  safety: '/safety-of-funds',
  education: '/education',
  article: (slug: string) => `/education/${slug}`,
  faq: '/faq',
  contact: '/contact',
  legal: {
    terms: '/legal/terms',
    privacy: '/legal/privacy',
    riskDisclosure: '/legal/risk-disclosure',
    amlKyc: '/legal/aml-kyc',
  },
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verify: '/auth/verify',
    resetPassword: '/auth/reset-password',
  },
  portal: {
    dashboard: '/portal/dashboard',
    deposit: '/portal/deposit',
    withdrawal: '/portal/withdrawal',
    tradeHistory: '/portal/trade-history',
    kyc: '/portal/kyc',
    support: '/portal/support',
    ticket: (id: string) => `/portal/support/${id}`,
    settings: '/portal/settings',
  },
} as const
```

## Link Component Rules

- Always use `next/link` (`<Link>`) for internal navigation — never `<a href>` for same-domain links
- Use `router.push()` only for programmatic navigation after async actions (form submit, payment success)
- Prefetch is enabled by default on `<Link>` — do not disable without reason
- External links (social, legal third-party): use `<a target="_blank" rel="noopener noreferrer">`
