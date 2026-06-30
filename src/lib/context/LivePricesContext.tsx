'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { SYMBOL_POOL } from '@/lib/trading/symbols'

// Only simulate prices for symbols that actually appear in the UI
// (LivePriceTicker, LiveOpenPositions, BalanceWidget). Full SYMBOL_POOL
// is used by the trading algorithm — not needed in the browser context.
const LIVE_SYMBOL_IDS = [
  'EURUSD', 'GBPUSD', 'USDJPY',
  'BTCUSD', 'ETHUSD', 'SOLUSD',
  'AAPL', 'MSFT', 'NVDA', 'TSLA', 'SPCX',
  'XAUUSD', 'USOIL',
  'SPX500', 'NAS100',
] as const

const LIVE_DISPLAY_SYMBOLS = SYMBOL_POOL.filter((s) =>
  (LIVE_SYMBOL_IDS as readonly string[]).includes(s.id),
)

// Per-category variance mirrors simulate.ts for consistent feel
const VARIANCE_BY_CATEGORY: Record<string, number> = {
  forex:     0.0008,
  crypto:    0.0050,
  stock:     0.0025,
  commodity: 0.0020,
  index:     0.0015,
}

export interface LivePrice {
  price: number
  direction: 'up' | 'down' | null
  changePct: number // vs initial base price
}

type LivePriceMap = Map<string, LivePrice>

const LivePricesContext = createContext<LivePriceMap>(new Map())

export function useLivePrices(): LivePriceMap {
  return useContext(LivePricesContext)
}

export function useLivePrice(symbolId: string): LivePrice | null {
  const map = useContext(LivePricesContext)
  return map.get(symbolId) ?? null
}

export function LivePricesProvider({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion()

  const [prices, setPrices] = useState<LivePriceMap>(() => {
    const initial = new Map<string, LivePrice>()
    for (const sym of LIVE_DISPLAY_SYMBOLS) {
      initial.set(sym.id, { price: sym.basePrice, direction: null, changePct: 0 })
    }
    return initial
  })

  const directionTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    if (shouldReduceMotion) return

    const interval = setInterval(() => {
      setPrices((prev) => {
        const next = new Map(prev)
        for (const sym of LIVE_DISPLAY_SYMBOLS) {
          const current = next.get(sym.id)!
          const variancePct = VARIANCE_BY_CATEGORY[sym.category] ?? 0.002
          const delta = current.price * variancePct * (Math.random() * 2 - 1)
          const newPrice = parseFloat(Math.max(0.0001, current.price + delta).toFixed(sym.pipDecimalPlaces))
          const direction: 'up' | 'down' = newPrice >= current.price ? 'up' : 'down'
          const changePct = ((newPrice - sym.basePrice) / sym.basePrice) * 100

          next.set(sym.id, { price: newPrice, direction, changePct })

          // Clear direction flash after 800ms
          const existing = directionTimers.current.get(sym.id)
          if (existing) clearTimeout(existing)
          const timer = setTimeout(() => {
            setPrices((p) => {
              const m = new Map(p)
              const entry = m.get(sym.id)
              if (entry) m.set(sym.id, { ...entry, direction: null })
              return m
            })
          }, 800)
          directionTimers.current.set(sym.id, timer)
        }
        return next
      })
    }, 2500)

    return () => {
      clearInterval(interval)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      for (const t of directionTimers.current.values()) clearTimeout(t)
    }
  }, [shouldReduceMotion])

  return (
    <LivePricesContext.Provider value={prices}>
      {children}
    </LivePricesContext.Provider>
  )
}
