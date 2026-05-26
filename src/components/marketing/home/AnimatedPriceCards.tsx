'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PriceData {
  symbol: string
  name: string
  price: string
  change: number
}

const INITIAL_PRICES: PriceData[] = [
  { symbol: 'EUR/USD', name: 'Euro / Dollar', price: '1.08342', change: 0.23 },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: '67,234.50', change: 2.41 },
  { symbol: 'XAU/USD', name: 'Gold', price: '2,318.40', change: -0.34 },
  { symbol: 'GBP/USD', name: 'Pound / Dollar', price: '1.27218', change: 0.15 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '189.84', change: 1.02 },
  { symbol: 'ETH/USD', name: 'Ethereum', price: '3,421.20', change: -1.18 },
]

function randomDelta(current: string, magnitude: number): string {
  const num = parseFloat(current.replace(/,/g, ''))
  const delta = (Math.random() - 0.5) * magnitude
  const next = Math.max(0, num + delta)
  if (num > 1000) return next.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return next.toFixed(5).slice(0, current.length)
}

export function AnimatedPriceCards() {
  const [prices, setPrices] = useState(INITIAL_PRICES)
  const [flashMap, setFlashMap] = useState<Record<string, 'up' | 'down' | null>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * prices.length)
      const item = prices[idx]
      if (!item) return

      const oldPrice = parseFloat(item.price.replace(/,/g, ''))
      const magnitude = oldPrice > 1000 ? oldPrice * 0.003 : oldPrice * 0.001
      const newPriceStr = randomDelta(item.price, magnitude)
      const newPrice = parseFloat(newPriceStr.replace(/,/g, ''))
      const direction = newPrice >= oldPrice ? 'up' : 'down'

      setPrices((prev) =>
        prev.map((p, i) =>
          i === idx ? { ...p, price: newPriceStr, change: p.change + (Math.random() - 0.5) * 0.1 } : p
        )
      )
      setFlashMap((prev) => ({ ...prev, [item.symbol]: direction }))
      setTimeout(() => setFlashMap((prev) => ({ ...prev, [item.symbol]: null })), 600)
    }, 1200)

    return () => clearInterval(interval)
  }, [prices])

  return (
    <div className="relative h-[480px] w-full">
      {/* Central glow */}
      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary opacity-10 blur-3xl" />

      {/* Card grid */}
      <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4">
        {prices.map((item, i) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0, 0, 0.2, 1] }}
          >
            <PriceCard item={item} flash={flashMap[item.symbol] ?? null} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PriceCard({ item, flash }: { item: PriceData; flash: 'up' | 'down' | null }) {
  const isPositive = item.change >= 0

  return (
    <div
      className={cn(
        'rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-card transition-colors duration-500',
        flash === 'up' && 'bg-accent-primary-muted',
        flash === 'down' && 'bg-danger/5'
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="font-mono text-xs font-semibold text-text-secondary">{item.symbol}</p>
          <p className="text-xs text-text-tertiary">{item.name}</p>
        </div>
        <span
          className={cn(
            'flex items-center gap-0.5 text-xs font-medium',
            isPositive ? 'text-accent-primary' : 'text-danger'
          )}
        >
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? '+' : ''}
          {item.change.toFixed(2)}%
        </span>
      </div>
      <p
        className={cn(
          'font-mono text-lg font-bold tabular-nums transition-colors duration-300',
          flash === 'up' ? 'text-accent-primary' : flash === 'down' ? 'text-danger' : 'text-text-primary'
        )}
      >
        {item.price}
      </p>
    </div>
  )
}
