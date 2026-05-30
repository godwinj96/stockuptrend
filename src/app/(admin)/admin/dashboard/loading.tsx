export default function AdminDashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border-subtle bg-bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-3 w-24 animate-pulse rounded bg-bg-elevated" />
              <div className="h-8 w-8 animate-pulse rounded-lg bg-bg-elevated" />
            </div>
            <div className="h-8 w-20 animate-pulse rounded bg-bg-elevated" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-bg-surface" />
        ))}
      </div>
    </div>
  )
}
