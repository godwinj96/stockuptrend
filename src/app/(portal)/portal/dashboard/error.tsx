'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/shared/ErrorState'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error monitoring service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <ErrorState
        title="Dashboard unavailable"
        message="There was an error loading your dashboard. Please try again."
        onRetry={reset}
      />
    </div>
  )
}
