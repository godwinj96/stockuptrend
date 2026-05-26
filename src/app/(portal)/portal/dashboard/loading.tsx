export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* KYC banner skeleton */}
      <div className="h-14 w-full animate-pulse rounded-xl bg-bg-elevated" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Balance widget skeleton */}
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
            <div className="mb-4 h-4 w-28 animate-pulse rounded bg-bg-overlay" />
            <div className="mb-2 h-10 w-48 animate-pulse rounded bg-bg-overlay" />
            <div className="mb-6 h-3 w-32 animate-pulse rounded bg-bg-overlay" />
            <div className="flex gap-3">
              <div className="h-9 w-24 animate-pulse rounded-lg bg-bg-overlay" />
              <div className="h-9 w-24 animate-pulse rounded-lg bg-bg-overlay" />
            </div>
          </div>

          {/* Transactions skeleton */}
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
            <div className="mb-5 h-4 w-36 animate-pulse rounded bg-bg-overlay" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-t border-border-subtle py-3">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-bg-overlay" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-24 animate-pulse rounded bg-bg-overlay" />
                  <div className="h-3 w-16 animate-pulse rounded bg-bg-overlay" />
                </div>
                <div className="h-3.5 w-20 animate-pulse rounded bg-bg-overlay" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions skeleton */}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
          <div className="mb-4 h-4 w-28 animate-pulse rounded bg-bg-overlay" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-bg-overlay" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
