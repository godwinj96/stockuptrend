'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { FEATURED_TRADINGVIEW_SYMBOLS } from '@/lib/constants/instruments'

interface TradingViewTickerProps {
  className?: string
}

export function TradingViewTicker({ className }: TradingViewTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadWidget()
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  function loadWidget() {
    const container = containerRef.current
    if (!container) return

    const widgetDiv = container.querySelector('.tradingview-widget-container__widget')
    if (!widgetDiv) return

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: FEATURED_TRADINGVIEW_SYMBOLS,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    })
    script.onload = () => setLoaded(true)
    widgetDiv.appendChild(script)
  }

  return (
    <div
      className={cn(
        'relative w-full border-y border-border-subtle bg-bg-surface',
        className
      )}
    >
      {/* Skeleton */}
      {!loaded && (
        <div className="h-12 w-full animate-pulse bg-bg-elevated" aria-hidden />
      )}

      {/* Widget container */}
      <div
        ref={containerRef}
        className={cn('tradingview-widget-container', !loaded && 'invisible h-0')}
      >
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  )
}
