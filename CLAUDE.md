# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

StockUptrend is a Next.js online brokerage platform (forex, crypto, stocks, CFDs) hosted on Vercel with Supabase for auth and database. The app has two surfaces: a marketing site and an authenticated client portal.

## Rules Files

All AI-agent rules are in `.cursor/rules/`. **Read these before making changes.**

| File | Domain |
|---|---|
| `00-project-overview.md` | North star — what the app is, Phase 1 scope, hard constraints |
| `01-architecture.md` | System topology, rendering strategy, API layer |
| `02-folder-structure.md` | Canonical directory layout — do not deviate |
| `03-tech-stack.md` | All packages, version pins, banned packages |
| `04-database-schema.md` | Supabase tables, RLS, storage buckets |
| `05-auth-and-authorization.md` | Auth flows, session management, KYC gating |
| `06-navigation.md` | Sitemap, URL structure, nav components |
| `07-design-system.md` | Colour tokens, typography, spacing, visual identity |
| `08-components.md` | Component authoring rules, key shared components |
| `09-animation-and-motion.md` | Framer Motion, timing constants, microinteractions |
| `10-state-management.md` | SWR, Zustand, React Hook Form patterns |
| `11-trading-and-market-data.md` | TradingView integration, risk warnings |
| `12-payments.md` | Stripe, MoonPay, Coinbase Commerce flows |
| `13-security.md` | RLS, env vars, CSP, input validation |
| `14-seo-and-performance.md` | Metadata, Core Web Vitals, i18n |
| `15-client-portal.md` | Full portal spec (dashboard, KYC, deposits, etc.) |
| `16-public-pages.md` | Marketing page content and UX spec |
| `17-llm-sop.md` | Code quality SOPs, completeness rules, self-check |

## Quick Reference

**Tech stack:** Next.js 14 (App Router) · Supabase · Tailwind CSS · shadcn/ui · Framer Motion · TradingView · Stripe/MoonPay/Coinbase

**Key constraints:**
- No custom backend — all server logic in Next.js Route Handlers
- TypeScript strict mode — no `any`
- Dark mode default — all UI built dark-first
- Every table has Supabase RLS enabled
- Every Route Handler validates auth session before processing

**Start here for any new feature:** Read `00-project-overview.md` → find the relevant domain file → apply `17-llm-sop.md` self-check before submitting.
