---
title: Trading & Market Data
description: TradingView integration spec, instrument display rules, and risk warning requirements.
alwaysApply: false
---

# Trading & Market Data

## TradingView Integration (Phase 1)

All market data display uses TradingView's free embeddable widgets. No custom market data API subscription is required in Phase 1.

### Widget Types Used

| Widget | Component | Where |
|---|---|---|
| Ticker Tape | `<TradingViewTicker />` | Homepage (below hero), portal header |
| Advanced Chart | `<TradingViewChart />` | Instrument detail pages, portal trade view |
| Market Overview | `<TradingViewMarketOverview />` | Homepage instruments section |
| Economic Calendar | `<TradingViewEconomicCalendar />` | Education section, homepage (optional) |

### Loading Strategy

All TradingView widgets load lazily via `IntersectionObserver`:

```typescript
// src/components/charts/TradingViewTicker.tsx
'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface TradingViewTickerProps {
  className?: string
  symbols?: string[]
}

// Default symbols matching StockUptrend's instrument offering
const DEFAULT_SYMBOLS = [
  { proName: 'FOREXCOM:EURUSD', title: 'EUR/USD' },
  { proName: 'FOREXCOM:GBPUSD', title: 'GBP/USD' },
  { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
  { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
  { proName: 'NASDAQ:AAPL', title: 'Apple' },
  { proName: 'TVC:GOLD', title: 'Gold' },
  { proName: 'NYMEX:CL1!', title: 'Crude Oil' },
]

export function TradingViewTicker({ className }: TradingViewTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadWidget()
          observerRef.current?.disconnect()
        }
      },
      { rootMargin: '200px' }  // Start loading 200px before entering viewport
    )
    observerRef.current.observe(container)

    return () => {
      observerRef.current?.disconnect()
      if (scriptRef.current) scriptRef.current.remove()
    }
  }, [])

  function loadWidget() {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: DEFAULT_SYMBOLS,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    })
    containerRef.current?.appendChild(script)
    scriptRef.current = script
  }

  return (
    <div ref={containerRef} className={cn('tradingview-widget-container w-full', className)}>
      <div className="tradingview-widget-container__widget" />
    </div>
  )
}
```

Apply this same pattern to all other TradingView widget components, adjusting the script src and config.

### Widget Configuration

All widgets must be configured with:
- `colorTheme: 'dark'` — matches StockUptrend's dark theme
- `isTransparent: true` — widget background is transparent, blends with our surface colour
- `locale` — driven by `next-intl` current locale

### Skeleton Before Load

Every TradingView component renders a skeleton that matches the widget's dimensions until loaded:

```typescript
// Ticker skeleton: full-width bar
<div className="h-12 w-full bg-bg-surface border-y border-border-subtle animate-pulse" />

// Chart skeleton: fixed aspect ratio placeholder
<div className="w-full aspect-video bg-bg-surface rounded-xl animate-pulse" />
```

The skeleton is replaced by the widget container once the script fires. Use a `loaded` state to toggle between skeleton and widget.

## Instrument Categories

StockUptrend offers four categories. Instrument data is defined statically in `src/lib/constants/instruments.ts` for Phase 1 (no live data fetch needed for the instruments catalogue — TradingView handles live prices in the widget).

```typescript
// src/lib/constants/instruments.ts
export type InstrumentCategory = 'forex' | 'crypto' | 'stocks' | 'commodities'

export interface Instrument {
  id: string
  symbol: string         // TradingView symbol, e.g. 'FOREXCOM:EURUSD'
  displaySymbol: string  // e.g. 'EUR/USD'
  name: string           // e.g. 'Euro / US Dollar'
  category: InstrumentCategory
  spread: string         // e.g. 'From 0.8 pips'
  leverage: string       // e.g. 'Up to 1:500'
  minTradeSize: string
  description: string
  slug: string           // URL slug for detail page
}

export const INSTRUMENTS: Instrument[] = [
  // Forex (major pairs)
  {
    id: 'eurusd',
    symbol: 'FOREXCOM:EURUSD',
    displaySymbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    spread: 'From 0.8 pips',
    leverage: 'Up to 1:500',
    minTradeSize: '0.01 lots',
    description: 'The most traded currency pair in the world...',
    slug: 'eur-usd',
  },
  // ... (GBPUSD, USDJPY, USDCHF, AUDUSD, etc.)
  // Crypto
  // Stocks
  // Commodities
]

export const INSTRUMENT_CATEGORIES = {
  forex: { label: 'Forex', description: '40+ currency pairs', icon: 'TrendingUp' },
  crypto: { label: 'Cryptocurrencies', description: '20+ digital assets', icon: 'Bitcoin' },
  stocks: { label: 'Stocks & Indices', description: '100+ global stocks', icon: 'BarChart2' },
  commodities: { label: 'Commodities', description: 'Gold, oil, silver & more', icon: 'Layers' },
}
```

## Margin Calculator

A client-side interactive tool on instrument detail pages and `/trading-conditions`:

```typescript
// Inputs: instrument, direction (buy/sell), lot size, leverage
// Output: required margin = (lot size × contract size × market price) / leverage
// Displayed: Required margin, pip value, contract size
// No API call needed — pure math, using displayed price from TradingView widget
```

## Risk Warning Requirements

**This is non-negotiable.** Every page that displays trading instruments, account types, or trading conditions must include the risk warning.

### Risk Warning Component

```typescript
// src/components/shared/RiskWarningBanner.tsx
export function RiskWarningBanner({ variant = 'banner' }: { variant?: 'banner' | 'inline' | 'footer' }) {
  const text = `CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 
    74% of retail investor accounts lose money when trading CFDs with this provider. 
    You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.`

  if (variant === 'footer') {
    return (
      <div className="bg-bg-surface border-t border-border-subtle px-6 py-4">
        <p className="text-xs text-text-tertiary leading-relaxed max-w-4xl">{text}</p>
      </div>
    )
  }

  return (
    <div className="bg-warning-muted border border-warning/20 rounded-lg px-4 py-3 flex gap-3">
      <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
      <p className="text-xs text-text-secondary leading-relaxed">{text}</p>
    </div>
  )
}
```

**Required on these pages (banner variant):**
- `/trading-instruments` and all `[slug]` pages
- `/trading-conditions`
- `/account-types`
- `/platforms`
- Portal `/portal/deposit` page

**Required in footer (footer variant):** All pages via the shared `<Footer />`.

## Phase 2 Trading Features (Out of Scope for Phase 1)

Do not build these in Phase 1. Document them here to avoid accidental scope creep:
- MT5 live account connection
- Real-time open positions management
- Copy trading
- Advanced charting with drawing tools (beyond TradingView embed)
- Automated trading / expert advisors
