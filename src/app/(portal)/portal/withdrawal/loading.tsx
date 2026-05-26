export default function WithdrawalLoading() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-bg-elevated" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-bg-elevated" />
      </div>
      <div className="h-[400px] animate-pulse rounded-2xl bg-bg-surface" />
    </div>
  )
}
