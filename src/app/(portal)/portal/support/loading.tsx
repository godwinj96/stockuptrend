export default function SupportLoading() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <div className="h-7 w-28 animate-pulse rounded-lg bg-bg-elevated" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded-lg bg-bg-elevated" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="h-64 animate-pulse rounded-2xl bg-bg-surface lg:col-span-2" />
        <div className="h-64 animate-pulse rounded-2xl bg-bg-surface lg:col-span-3" />
      </div>
    </div>
  )
}
