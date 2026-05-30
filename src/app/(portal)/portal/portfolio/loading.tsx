export default function PortfolioLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-3 w-24 animate-pulse rounded bg-bg-elevated" />
              <div className="h-7 w-7 animate-pulse rounded-lg bg-bg-elevated" />
            </div>
            <div className="h-8 w-28 animate-pulse rounded bg-bg-elevated" />
            <div className="mt-2 h-3 w-16 animate-pulse rounded bg-bg-elevated" />
          </div>
        ))}
      </div>

      {/* Performance chart skeleton */}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card">
        <div className="mb-4">
          <div className="h-4 w-32 animate-pulse rounded bg-bg-elevated" />
          <div className="mt-1.5 h-3 w-48 animate-pulse rounded bg-bg-elevated" />
        </div>
        <div className="h-[280px] animate-pulse rounded-lg bg-bg-elevated" />
      </div>

      {/* Monthly P&L skeleton */}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card">
        <div className="mb-4">
          <div className="h-4 w-24 animate-pulse rounded bg-bg-elevated" />
          <div className="mt-1.5 h-3 w-40 animate-pulse rounded bg-bg-elevated" />
        </div>
        <div className="h-[200px] animate-pulse rounded-lg bg-bg-elevated" />
      </div>
    </div>
  )
}
