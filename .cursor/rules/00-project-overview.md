---
title: Project Overview
description: North-star context for every agent working on StockUptrend. Read this first.
alwaysApply: true
---

# StockUptrend — Project Overview

## What It Is

StockUptrend is a modern online brokerage platform targeting retail traders aged 25–45 who trade forex, cryptocurrencies, stocks, and CFDs. It consists of two distinct surfaces:

1. **Marketing site** — public-facing pages that establish trust, showcase instruments, explain account types and conditions, and convert visitors into registered users.
2. **Client portal** — authenticated area where users manage their trading account: KYC verification, deposits/withdrawals, trade history, support tickets, and account settings.

## Brand Promise

Professional, trustworthy, and approachable. StockUptrend should feel like a premium fintech product — not a generic broker template. Users must feel confident entrusting their money to this platform within seconds of landing on it.

## Phase 1 MVP (current build scope)

All of the following must be complete before Phase 1 is considered done:

**Public marketing pages:**
- Homepage (full sections — see `16-public-pages.md`)
- About Us
- Trading Instruments
- Platforms
- Account Types
- Trading Conditions
- Safety of Funds
- Education / Blog (static, no CMS required in Phase 1)
- FAQ
- Contact & Support
- Legal pages (Terms of Service, Privacy Policy, Risk Disclosure, AML/KYC Policy)

**Authentication:**
- Register (email + phone)
- Email verification
- Login
- Password reset

**Client portal:**
- Dashboard
- KYC verification flow (3-step)
- Deposit (Card, Bank Transfer, Crypto)
- Withdrawal (with KYC gate)
- Trade History
- Support Tickets
- Account Settings (profile, password, 2FA, notifications)

**Phases 2 and 3** (out of scope for current build): education center CMS, copy trading, advanced analytics, MT5 deep integration, mobile app.

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Hosting | Vercel |
| Auth + Database + Storage | Supabase |
| Styling | Tailwind CSS v3 |
| Components | shadcn/ui + Radix UI |
| Animations | Framer Motion |
| Charts / Market data | TradingView widgets |
| Payments | Stripe + MoonPay + Coinbase Commerce |
| i18n | next-intl |
| Forms | React Hook Form + Zod |
| State | Zustand (UI) + SWR (server data) |

Full package list and version pins: see `03-tech-stack.md`.

## Hard Constraints

- **No custom backend server.** All server logic runs inside Next.js Route Handlers (`/app/api/`). No Express, no separate Node server.
- **Supabase for everything.** Auth, database, file storage, realtime — all Supabase. No Firebase, no PlanetScale, no custom JWT.
- **App Router only.** No Pages Router patterns, no `getServerSideProps`, no `getStaticProps`. Use Server Components and `generateStaticParams`.
- **TypeScript strict mode.** No `any` unless unavoidable with a third-party library. No `@ts-ignore`.
- **Dark mode is default.** Light mode support is secondary. Never build UI assuming a white background.

## Regulatory Requirements

- Every page that displays trading instruments or account types **must** include a risk warning banner. See `11-trading-and-market-data.md` for required text.
- KYC is mandatory before a user can withdraw funds. Deposit is allowed pre-KYC with a capped limit.
- Legal pages (Terms, Privacy, Risk Disclosure, AML/KYC) must be linked in the footer of every page.
- Personal data handling must comply with GDPR principles (data minimisation, right to erasure, consent).

## Rules Files Index

| File | Domain |
|---|---|
| `00-project-overview.md` | This file — north star |
| `01-architecture.md` | System topology, rendering strategy, data flow |
| `02-folder-structure.md` | Canonical directory layout |
| `03-tech-stack.md` | All packages, versions, banned packages |
| `04-database-schema.md` | Supabase tables, RLS, storage |
| `05-auth-and-authorization.md` | Auth flows, route protection |
| `06-navigation.md` | Sitemap, URL structure, nav components |
| `07-design-system.md` | Colour tokens, typography, spacing, visual identity |
| `08-components.md` | Component authoring rules, key shared components |
| `09-animation-and-motion.md` | Framer Motion rules, timing, microinteractions |
| `10-state-management.md` | Data fetching, Zustand, SWR patterns |
| `11-trading-and-market-data.md` | TradingView integration, instrument display |
| `12-payments.md` | Deposit/withdrawal flows, payment providers |
| `13-security.md` | RLS, env vars, input validation, CSP |
| `14-seo-and-performance.md` | Metadata, Core Web Vitals, i18n |
| `15-client-portal.md` | Full portal spec |
| `16-public-pages.md` | Marketing page content and UX spec |
| `17-llm-sop.md` | Code quality SOPs, completeness rules, self-check |
