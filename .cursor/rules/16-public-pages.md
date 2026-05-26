---
title: Public Pages
description: Content and UX spec for all marketing/public-facing pages.
alwaysApply: false
---

# Public Pages

All public pages use the `(marketing)` route group with the shared `<Navbar />` and `<Footer />`.

## Homepage (`/`)

The homepage is the primary conversion page. Every section must load fast and guide the visitor toward registration.

### Section Order & Specs

**1. Hero Section**

```
Layout: Full-viewport height (100svh). Two-column on desktop (text left, visual right), stacked on mobile.

Headline: Large display type, 2-3 lines max, focuses on the core value prop.
  Example: "Trade the World's\nMarkets. Smarter."
  (Actual copy TBD — this is a structural placeholder)

Sub-headline: 1-2 sentences, 16-18px, text-secondary.

CTAs: Two buttons side by side:
  Primary: "Open Account" → /auth/register  (accent green, large)
  Secondary: "Explore Instruments" → /trading-instruments  (ghost/outline)

Right visual: Animated abstract — NOT a stock photo of a trader or city skyline.
  Options: Subtle animated data grid / floating price cards with live-feel numbers / 
  abstract geometric composition reflecting precision and depth.
  Must NOT look like a template hero visual.

Background: Deep dark, subtle gradient from --bg-base to --bg-surface. 
  NO mesh gradients, NO blurry colorful blobs.

Risk warning: Subtle line directly below CTAs in text-tertiary, text-xs.
  "74% of retail CFD accounts lose money."
```

**2. Market Ticker Strip**

Full-width `<TradingViewTicker />` immediately below hero, separated by a subtle horizontal border. Height: ~48px. Background: `bg-bg-surface`.

**3. Trust Bar**

5-6 trust signals in a horizontal scrolling strip on mobile, inline on desktop:
- "Regulated Broker" (with shield icon)
- "SSL Secured" (lock icon)
- "50,000+ Active Traders" (users icon)
- "24/7 Support" (headset icon)
- "Instant Deposits" (zap icon)
- "Segregated Funds" (vault icon)

Animation: staggered slide-in from bottom on first viewport entry.

**4. Trading Instruments Overview**

Heading: "Trade 200+ Instruments Across Every Market"

4 category cards in a 2×2 grid on mobile, 4-column row on desktop:
- Forex (40+ pairs)
- Cryptocurrency (20+ assets)
- Stocks & Indices (100+ equities)
- Commodities (Gold, Oil, Silver, Natural Gas)

Each card: category icon, name, instrument count, "Explore →" link.
Below cards: live price strip for featured instruments (TradingView Market Overview widget or a static `<InstrumentCard />` grid with representative instruments).

**5. Why StockUptrend**

3-4 value propositions with icon + heading + 1-2 sentences:
- Tight spreads from 0.0 pips
- Up to 1:500 leverage
- Instant order execution
- Advanced charting & tools

Layout: 3-column on desktop (or 2+2), icon above text. NO generic flat icons — use Lucide icons styled with brand accent colour.

**6. Account Types Preview**

Heading: "Choose the Account That Fits Your Trading"

3 tier cards side by side: Standard | Pro | VIP
Each card: tier name, min deposit, key stats (spread, leverage, commission), feature list with checkmarks, CTA "Get Started".
Pro card: "Most Popular" badge + accent border.
VIP card: gold accent.

Link to full comparison: "Compare all account types →" to `/account-types`.

**7. How It Works**

3-step process, horizontal flow with connecting arrows on desktop:

```
[1] Create Account
    Register in 2 minutes with your email.

[2] Verify & Deposit
    Complete KYC and fund your account.

[3] Start Trading
    Access 200+ instruments across global markets.
```

Step number: large, accent-green, bold. Icon above number.

**8. Platform Preview**

Heading: "Professional Trading Tools"

Left: Feature list (MT5 / WebTrader features, charting tools, mobile apps).
Right: Platform screenshot or embedded TradingView chart widget teaser.

CTA: "Explore Platforms" → `/platforms`.

**9. Social Proof / Testimonials**

3-4 testimonial cards in a carousel (mobile) or grid (desktop).
Each: avatar (placeholder initials if no photo), name, country, star rating, quote.
Carousel: auto-advances on a 5s interval, pause on hover. Manual prev/next arrows.

**10. Homepage CTA Section**

Full-width section with high-contrast background (slightly lighter than base or a subtle pattern):
Heading: "Start Your Trading Journey Today"
Sub-text: 1 sentence
Two buttons: "Open Account" (primary) + "Contact Us" (ghost)

**11. Footer**

`<Footer />` shared component. See `06-navigation.md` for structure.
Includes abbreviated risk warning above copyright line.

---

## About Us (`/about`)

### Sections

1. **Page Hero** — title "About StockUptrend", breadcrumb, short mission statement
2. **Our Mission** — 1-2 paragraphs about the company vision
3. **Key Stats Bar** — traders count, countries, instruments, years operating (animated counters)
4. **Our Story** — narrative section (founder story or company history)
5. **Our Values** — 4 value cards (integrity, transparency, innovation, customer focus)
6. **Team** (optional for Phase 1 — can be a simple "We are a dedicated team" section)
7. **CTA** — "Join StockUptrend" button

---

## Trading Instruments (`/trading-instruments`)

### Sections

1. **Page Hero** — title, sub-headline, breadcrumb
2. **Risk Warning Banner**
3. **Category Filter Tabs** — All | Forex | Crypto | Stocks & Indices | Commodities
4. **Instrument Grid** — `<InstrumentCard />` grid, filterable by category
5. **Instrument Detail CTA** — Click card → `/trading-instruments/[slug]`
6. **Trading Conditions Summary** — mini table with spreads, leverage, execution type
7. **CTA Section** — "Ready to Trade? Open your account."

### Instrument Detail Page (`/trading-instruments/[slug]`)

1. **Page Hero** — symbol, name, category badge, risk warning
2. **Live TradingView Chart** — full-width, responsive
3. **Instrument Facts** — spread, leverage, contract size, min trade, trading hours, overnight swap
4. **Margin Calculator** — interactive client-side tool
5. **Related Instruments** — 4 instruments from same category
6. **CTA** — "Trade [Symbol] Now"

---

## Platforms (`/platforms`)

### Sections

1. **Page Hero** — "Professional Trading Platforms"
2. **Risk Warning Banner**
3. **Platform Cards** — MetaTrader 5, WebTrader, Mobile App (iOS/Android)
   Each: platform name, key features list, screenshots, download/access CTA
4. **Feature Comparison Table** — MT5 vs WebTrader vs Mobile feature matrix
5. **Download CTA** — MT5 download links for Windows/Mac/iOS/Android

---

## Account Types (`/account-types`)

### Sections

1. **Page Hero** — "Find Your Perfect Account"
2. **Risk Warning Banner**
3. **Account Tier Cards** — Standard, Pro, VIP (full details, not just preview)
4. **Full Comparison Table** — all features side by side as a data table
5. **FAQ for Accounts** — 4-5 common questions about account types
6. **CTA** — "Open Account"

---

## Trading Conditions (`/trading-conditions`)

### Sections

1. **Page Hero** + Risk Warning
2. **Spreads Table** — major pairs, crypto, stocks: instrument, spread type (fixed/variable), from value
3. **Leverage Table** — by asset class: instrument type, max leverage
4. **Execution Policy** — market execution, no requotes, instant execution description
5. **Swap Rates** — long/short swap rates for top instruments
6. **Margin Requirements** — margin call and stop-out levels
7. **CTA** — "Open Account" + "View Instruments"

---

## Safety of Funds (`/safety-of-funds`)

### Sections

1. **Page Hero** — "Your Funds Are Safe With Us"
2. **Regulatory Status** — licence details, regulatory bodies (FCA, CySec, etc.)
3. **Segregated Accounts** — explanation with diagram/illustration
4. **Security Measures** — SSL, 2FA, cold storage (crypto), anti-fraud
5. **Investor Protection** — compensation scheme details (if applicable)
6. **Transparency Commitments** — regular audits, financial reports
7. **Trust Badges Bar** — visual security indicators

---

## Education / Blog (`/education`)

### Sections

1. **Page Hero** — "Learn to Trade. Trade to Win."
2. **Featured Article** — large card, latest or manually pinned
3. **Categories Filter** — All | Forex | Crypto | Stocks | Beginners | Advanced
4. **Article Grid** — cards with: cover image, category badge, title, excerpt, read time, date
5. **Webinars CTA** (Phase 2 — placeholder card with "Coming Soon" badge)

### Article Page (`/education/[slug]`)

1. Page hero with title, date, read time, author
2. Long-form content (MDX or static HTML — no CMS in Phase 1)
3. Table of contents (sticky on desktop)
4. Related articles (3 cards at bottom)
5. Risk warning
6. CTA — "Put Your Knowledge to Work — Open an Account"

Phase 1: Articles are static MDX files in `/content/education/`. No headless CMS.

---

## FAQ (`/faq`)

### Structure

Accordion-style Q&A grouped by category:
- Getting Started
- Deposits & Withdrawals
- Trading
- Account & KYC
- Security
- Technical

Each item: question as trigger, answer as accordion content.
JSON-LD FAQPage structured data (see `14-seo-and-performance.md`).

Search: Simple client-side text filter input at top (filters visible Q&As).

---

## Contact (`/contact`)

### Sections

1. **Page Hero** — "We're Here to Help"
2. **Contact Methods** — 3 cards side by side:
   - Live Chat: "Chat with a support agent" (link to intercom/crisp or mailto)
   - Email: support@stockuptrend.com (link)
   - Response Time: "We reply within 2 hours"
3. **Contact Form**
   ```
   Name | Email | Subject
   Category: (Deposits / Withdrawals / KYC / Technical / Other)
   Message (textarea)
   [Send Message]
   ```
   Validation: React Hook Form + Zod. Submission: email or Supabase function.
4. **Business Hours** — timezone-aware schedule

---

## Legal Pages (`/legal/*`)

All four legal pages use the same layout:
- Page hero with document title + last updated date
- Full-width long-form content (rendered from MDX or static HTML)
- Table of contents (sticky on desktop)
- Print button
- Link back to `/legal` index or other legal documents

Content: Placeholder text in Phase 1. Real legal copy sourced from legal team before launch.

Required legal pages:
- `/legal/terms` — Terms of Service
- `/legal/privacy` — Privacy Policy
- `/legal/risk-disclosure` — Risk Disclosure Statement (includes mandatory CFD risk warning)
- `/legal/aml-kyc` — AML & KYC Policy
