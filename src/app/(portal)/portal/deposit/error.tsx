'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/shared/ErrorState'

export default function DepositError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])
  return <div className="mx-auto max-w-2xl py-8"><ErrorState title="Failed to load deposit page" onRetry={reset} /></div>
}
