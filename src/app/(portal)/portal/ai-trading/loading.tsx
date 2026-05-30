export default function AITradingLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Status card skeleton */}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-bg-elevated" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 animate-pulse rounded bg-bg-elevated" />
              <div className="h-3 w-20 animate-pulse rounded bg-bg-elevated" />
            </div>
          </div>
          <div className="h-7 w-20 animate-pulse rounded-full bg-bg-elevated" />
        </div>
        <div className="mb-5 grid grid-cols-2 gap-4">
          <div className="h-20 animate-pulse rounded-lg bg-bg-elevated" />
          <div className="h-20 animate-pulse rounded-lg bg-bg-elevated" />
        </div>
        <div className="h-10 animate-pulse rounded-lg bg-bg-elevated" />
      </div>

      {/* Stats bar skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-card">
            <div className="h-3 w-16 animate-pulse rounded bg-bg-elevated" />
            <div className="mt-2 h-7 w-20 animate-pulse rounded bg-bg-elevated" />
          </div>
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl bg-bg-surface" />
        <div className="h-64 animate-pulse rounded-xl bg-bg-surface" />
      </div>
    </div>
  )
}
