'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/shared/ErrorState'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PortfolioError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full items-center justify-center">
      <ErrorState
        title="Failed to load Portfolio"
        message="Could not load your portfolio data. Please try again."
        onRetry={reset}
      />
    </div>
  )
}
