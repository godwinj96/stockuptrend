'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/shared/ErrorState'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AITradingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full items-center justify-center">
      <ErrorState
        title="Failed to load AI Trading"
        message="Could not load your trading data. Please try again."
        onRetry={reset}
      />
    </div>
  )
}
