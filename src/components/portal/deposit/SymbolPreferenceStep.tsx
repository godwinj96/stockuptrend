'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, TrendingUp, Bitcoin, DollarSign, BarChart2, Coins, Search, X, Rocket, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SYMBOL_POOL } from '@/lib/trading/symbols'
import type { SymbolConfig } from '@/lib/trading/symbols'

const MAX_SELECT = 6

type TabCategory = 'all' | 'crypto' | 'stock' | 'forex' | 'commodity' | 'index'

const CATEGORY_TABS: Array<{ id: TabCategory; label: string }> = [
  { id: 'all',       label: 'All'         },
  { id: 'stock',     label: 'Stocks'      },
  { id: 'crypto',    label: 'Crypto'      },
  { id: 'forex',     label: 'Forex'       },
  { id: 'commodity', label: 'Commodities' },
  { id: 'index',     label: 'Indices'     },
]

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  crypto:    Bitcoin,
  stock:     TrendingUp,
  forex:     DollarSign,
  commodity: Coins,
  index:     BarChart2,
}

const CATEGORY_COLOR: Record<string, string> = {
  crypto:    'text-accent-gold bg-accent-gold-muted',
  stock:     'text-accent-primary bg-accent-primary-muted',
  forex:     'text-accent-secondary bg-accent-secondary-muted',
  commodity: 'text-accent-gold bg-accent-gold-muted',
  index:     'text-text-secondary bg-bg-elevated',
}

const FEATURED_SYMBOLS = SYMBOL_POOL.filter((s) => s.featured)
const MAIN_POOL        = SYMBOL_POOL.filter((s) => !s.featured)

// Renders a TradingView logo, falls back to category icon
function SymbolLogo({ sym }: { sym: SymbolConfig }) {
  const [error, setError] = useState(false)
  const Icon = CATEGORY_ICON[sym.category] ?? TrendingUp
  const colorClass = CATEGORY_COLOR[sym.category] ?? 'text-text-secondary bg-bg-elevated'

  if (!sym.logoUrl || error) {
    return (
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', colorClass)}>
        <Icon className="h-4 w-4" />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sym.logoUrl}
      alt={sym.displayName}
      width={32}
      height={32}
      className="h-8 w-8 shrink-0 rounded-lg object-contain"
      onError={() => setError(true)}
    />
  )
}

interface SymbolPreferenceStepProps {
  initialSelected: string[]
  onContinue: (selected: string[]) => void
  onSkip: () => void
}

export function SymbolPreferenceStep({
  initialSelected,
  onContinue,
  onSkip,
}: SymbolPreferenceStepProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const [activeTab, setActiveTab] = useState<TabCategory>('all')
  const [query, setQuery]         = useState('')
  const [saving, setSaving]       = useState(false)

  const isSearching = query.trim().length > 0

  const filteredMain = useMemo<SymbolConfig[]>(() => {
    const q = query.trim().toLowerCase()
    const pool = isSearching
      ? SYMBOL_POOL
      : activeTab === 'all'
        ? MAIN_POOL
        : MAIN_POOL.filter((s) => s.category === activeTab)

    if (!q) return pool
    return pool.filter(
      (s) =>
        s.displayName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q),
    )
  }, [query, activeTab, isSearching])

  // When searching, also check if any featured symbols match
  const filteredFeatured = useMemo<SymbolConfig[]>(() => {
    if (isSearching) {
      const q = query.trim().toLowerCase()
      return FEATURED_SYMBOLS.filter(
        (s) =>
          s.displayName.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q),
      )
    }
    // Show featured only on 'all' tab with no search
    return activeTab === 'all' ? FEATURED_SYMBOLS : []
  }, [query, activeTab, isSearching])

  const showFeatured = filteredFeatured.length > 0

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id)
      if (prev.length >= MAX_SELECT) return prev
      return [...prev, id]
    })
  }

  async function handleContinue() {
    setSaving(true)
    try {
      await fetch('/api/portal/preferences/symbols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols: selected }),
      })
    } catch {
      // Non-blocking — preferences save is best-effort
    } finally {
      setSaving(false)
      onContinue(selected)
    }
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Static header — always visible */}
      <div className="space-y-4 pb-4">
        <div>
          <h2 className="font-display text-base font-semibold text-text-primary">
            What should the AI focus on?
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Select up to {MAX_SELECT} markets. The AI will prioritise these when trading on your behalf.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks, crypto, forex…"
            className="w-full rounded-lg border border-border-default bg-bg-elevated py-2.5 pl-9 pr-9 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category tabs — hidden while searching */}
        {!isSearching && (
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150',
                  activeTab === tab.id
                    ? 'bg-accent-primary text-text-inverse'
                    : 'bg-bg-elevated text-text-secondary hover:text-text-primary',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable symbol area */}
      <div className="max-h-[360px] overflow-y-auto pr-1 -mr-1 space-y-3">

      {/* Featured section — SpaceX */}
      <AnimatePresence>
        {showFeatured && (
          <motion.div
            key="featured"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-accent-gold" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-gold">
                Featured
              </span>
            </div>

            {filteredFeatured.map((sym) => {
              const isSelected = selected.includes(sym.id)
              const isDisabled = !isSelected && selected.length >= MAX_SELECT

              return (
                <motion.button
                  key={sym.id}
                  layout
                  type="button"
                  onClick={() => !isDisabled && toggle(sym.id)}
                  disabled={isDisabled}
                  className={cn(
                    'relative w-full rounded-xl border-2 p-4 text-left transition-all duration-150',
                    isSelected
                      ? 'border-accent-gold bg-accent-gold-muted/30'
                      : isDisabled
                        ? 'cursor-not-allowed border-accent-gold/20 bg-accent-gold-muted/5 opacity-40'
                        : 'border-accent-gold/40 bg-accent-gold-muted/10 hover:border-accent-gold/60 hover:bg-accent-gold-muted/20',
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Logo — larger for featured card */}
                    <FeaturedSymbolLogo sym={sym} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          'text-base font-bold',
                          isSelected ? 'text-accent-gold' : 'text-text-primary',
                        )}>
                          {sym.displayName}
                        </p>
                        <span className="rounded-full bg-accent-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-bg-base">
                          New IPO
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {sym.id} · Just listed on NASDAQ
                      </p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <Rocket className="h-3 w-3 text-accent-gold/70" />
                        <span className="text-[11px] font-medium text-accent-gold/80">
                          Top AI Pick — High priority
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-gold"
                      >
                        <Check className="h-3 w-3 text-bg-base" />
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main symbol grid */}
      {filteredMain.length === 0 && !showFeatured ? (
        <div className="py-8 text-center">
          <Search className="mx-auto mb-3 h-8 w-8 text-text-tertiary/40" />
          <p className="text-sm font-medium text-text-secondary">No results for &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-xs text-text-tertiary">Try a ticker like &ldquo;BTC&rdquo; or a name like &ldquo;Apple&rdquo;</p>
        </div>
      ) : filteredMain.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredMain.map((sym) => {
              const isSelected = selected.includes(sym.id)
              const isDisabled = !isSelected && selected.length >= MAX_SELECT

              return (
                <motion.button
                  key={sym.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  onClick={() => !isDisabled && toggle(sym.id)}
                  disabled={isDisabled}
                  className={cn(
                    'relative flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all duration-150',
                    isSelected
                      ? 'border-accent-primary bg-accent-primary-muted'
                      : isDisabled
                        ? 'cursor-not-allowed border-border-subtle opacity-40'
                        : 'border-border-subtle hover:border-border-default hover:bg-bg-elevated',
                  )}
                >
                  <SymbolLogo sym={sym} />

                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      'truncate text-xs font-semibold',
                      isSelected ? 'text-accent-primary' : 'text-text-primary',
                    )}>
                      {sym.displayName}
                    </p>
                    <p className="text-[10px] capitalize text-text-tertiary">{sym.category}</p>
                  </div>

                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-primary"
                    >
                      <Check className="h-2.5 w-2.5 text-text-inverse" />
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      ) : null}

      {/* Selection count — inside scroll area */}
      <p className="pb-1 text-xs text-text-tertiary">
        {selected.length}/{MAX_SELECT} selected
        {selected.length === MAX_SELECT && (
          <span className="ml-1 text-accent-primary">· Maximum reached</span>
        )}
      </p>

      </div>{/* end scrollable area */}

      {/* Actions — always visible, pinned below scroll area */}
      <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-4 mt-2">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-text-tertiary underline-offset-2 hover:text-text-secondary hover:underline"
        >
          Skip for now
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-accent-primary px-5 py-2 text-sm font-semibold text-text-inverse transition-all duration-200 hover:scale-[1.02] hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.98] disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

// Larger logo for the featured SpaceX card
function FeaturedSymbolLogo({ sym }: { sym: SymbolConfig }) {
  const [error, setError] = useState(false)
  const Icon = CATEGORY_ICON[sym.category] ?? TrendingUp

  if (!sym.logoUrl || error) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-gold-muted">
        <Icon className="h-7 w-7 text-accent-gold" />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sym.logoUrl}
      alt={sym.displayName}
      width={56}
      height={56}
      className="h-14 w-14 shrink-0 rounded-xl object-contain"
      onError={() => setError(true)}
    />
  )
}
