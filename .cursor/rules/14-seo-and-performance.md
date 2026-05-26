---
title: SEO & Performance
description: Metadata patterns, Core Web Vitals targets, structured data, i18n, and performance rules.
alwaysApply: false
---

# SEO & Performance

## Metadata

Every page exports a `generateMetadata` function (or a static `metadata` export for fully static pages). No page may have default/empty metadata.

### Metadata Template

```typescript
// Reusable base metadata
// src/lib/utils/metadata.ts
import { Metadata } from 'next'

export function createMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string
  description: string
  path: string
  image?: string
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const ogImage = image ?? `${siteUrl}/images/og-default.jpg`

  return {
    title: `${title} | StockUptrend`,
    description,
    metadataBase: new URL(siteUrl!),
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | StockUptrend`,
      description,
      url: `${siteUrl}${path}`,
      siteName: 'StockUptrend',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | StockUptrend`,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
```

### Page-Level Usage

```typescript
// app/(marketing)/about/page.tsx
import { createMetadata } from '@/lib/utils/metadata'

export const metadata = createMetadata({
  title: 'About Us',
  description: 'Learn about StockUptrend — a modern online brokerage platform...',
  path: '/about',
})
```

**Exclude from indexing** (robots: no-index):
- All `/auth/*` pages
- All `/portal/*` pages
- `/api/*` routes (automatic via Next.js)

### Page Title Rules

- Format: `[Page Name] | StockUptrend`
- Homepage: `StockUptrend — Online Trading Platform | Forex, Crypto & CFDs`
- Max 60 characters for the full title string
- Descriptions: 120–160 characters, unique per page, include primary keyword

## Structured Data (JSON-LD)

Inject via `<Script type="application/ld+json">` in page components.

### Homepage — Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "StockUptrend",
  "url": "https://stockuptrend.com",
  "logo": "https://stockuptrend.com/images/logo.png",
  "description": "Online brokerage platform for forex, crypto, stocks and CFDs.",
  "sameAs": ["https://twitter.com/stockuptrend", "https://linkedin.com/company/stockuptrend"]
}
```

### FAQ Page — FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I open an account?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Register online in minutes with your email..."
      }
    }
  ]
}
```

### Interior Pages — BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stockuptrend.com" },
    { "@type": "ListItem", "position": 2, "name": "Trading Instruments", "item": "https://stockuptrend.com/trading-instruments" }
  ]
}
```

## Sitemap

```javascript
// next-sitemap.config.js
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/portal/*', '/auth/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/portal/', '/auth/', '/api/'] },
    ],
  },
}
```

## Core Web Vitals Targets

| Metric | Target | How to achieve |
|---|---|---|
| LCP | < 2.5s | Hero images use `next/image` with `priority`. Fonts via `next/font`. No blocking scripts above fold. |
| INP | < 100ms | No heavy synchronous operations in event handlers. Debounce inputs. |
| CLS | < 0.1 | All images have explicit `width` and `height`. Font uses `display: swap`. No layout shifts from ads/widgets. |
| TTFB | < 800ms | Use ISR for marketing pages. Supabase queries are fast (<50ms) with proper indexes. |

## Images

```typescript
// Always use next/image — never <img> tags
import Image from 'next/image'

// Hero image (above fold — use priority)
<Image
  src="/images/hero-bg.jpg"
  alt="Trading platform interface"
  width={1440}
  height={800}
  priority    // ← load immediately, don't lazy-load
  className="object-cover"
/>

// Below-fold images (lazy-loaded by default)
<Image
  src="/images/platform-screenshot.jpg"
  alt="MT5 platform screenshot"
  width={800}
  height={500}
  // no priority — lazy loads automatically
/>
```

**Rules:**
- All images must have explicit `width` and `height` to prevent CLS
- `alt` text must describe the image — never empty unless purely decorative
- Use `priority` only for LCP image (typically the hero)
- Prefer `.webp` format for all custom images (lighter than JPEG at same quality)
- Supabase storage images: use `next/image` with Supabase domain whitelisted in `next.config.js`

## Fonts

```typescript
// src/app/layout.tsx — loaded via next/font (no external CDN)
import { Inter } from 'next/font/google'
import { Bricolage_Grotesque } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})
```

Both fonts are self-hosted by Next.js from Google Fonts infrastructure — no CDN call at runtime.

## TradingView Widget Performance

TradingView widgets below the fold are loaded lazily via `IntersectionObserver` (see `11-trading-and-market-data.md`). This prevents them from blocking initial page load.

For the ticker tape (above fold on homepage): load immediately but use `async` script to avoid blocking the main thread.

## Code Splitting

App Router provides route-based code splitting automatically. Additionally:

- Heavy Client Components (TradingView wrappers, payment forms): wrap with `next/dynamic`
```typescript
import dynamic from 'next/dynamic'
const TradingViewChart = dynamic(() => import('@/components/charts/TradingViewChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,  // TradingView widgets require browser environment
})
```

- Do not use `next/dynamic` for server components — they're already split by the router

## Internationalisation (i18n)

Built with `next-intl`. Configuration:

```
Supported locales: en (default), ar, fr, es, de, zh
URL pattern: /en/..., /ar/..., /fr/...
Default locale: en (no prefix in URL — see next-intl docs for unprefixed default locale config)
RTL support: ar locale sets <html dir="rtl">
```

```typescript
// next-intl middleware handles locale detection and routing
// src/i18n.ts defines supported locales
// src/messages/en.json, ar.json, fr.json etc. contain translations

// Usage in Server Components:
import { getTranslations } from 'next-intl/server'
const t = await getTranslations('HomePage')

// Usage in Client Components:
import { useTranslations } from 'next-intl'
const t = useTranslations('HomePage')
```

Translation keys follow a namespaced flat structure:
```json
{
  "HomePage": {
    "hero_title": "Trade Smarter.",
    "hero_subtitle": "Access global markets with tight spreads and powerful tools."
  },
  "Navigation": {
    "trading": "Trading",
    "company": "Company"
  }
}
```

**RTL layout:** Tailwind v3 supports `rtl:` variant — use it for directional properties:
```typescript
className="mr-4 rtl:mr-0 rtl:ml-4"
// Or use logical properties:
className="ms-4"  // margin-inline-start — correct in both LTR and RTL
```

## Analytics

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Add inside root layout body:
<Analytics />
<SpeedInsights />
```

Google Analytics / GTM: add via next-intl-compatible Script component (Phase 2 scope — or add in Phase 1 if required):
```typescript
import Script from 'next/script'
<Script src="https://www.googletagmanager.com/gtag/js" strategy="afterInteractive" />
```
