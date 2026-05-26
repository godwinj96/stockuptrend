import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { TradeHistoryTable } from '@/components/portal/trade-history/TradeHistoryTable'

export const metadata: Metadata = {
  title: 'Trade History | StockUptrend',
}

export default async function TradeHistoryPage({
  searchParams,
}: {
  searchParams: { page?: string; symbol?: string; direction?: string }
}) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const page = Number(searchParams.page ?? 1)
  const pageSize = 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('trades')
    .select('*', { count: 'exact' })
    .eq('user_id', user!.id)
    .order('open_at', { ascending: false })
    .range(from, to)

  if (searchParams.symbol) query = query.ilike('symbol', `%${searchParams.symbol}%`)
  if (searchParams.direction) query = query.eq('direction', searchParams.direction)

  const { data: trades, count } = await query

  return (
    <div className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Trade History</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {count ?? 0} total trades
          </p>
        </div>
      </div>
      <TradeHistoryTable
        trades={trades ?? []}
        totalCount={count ?? 0}
        currentPage={page}
        pageSize={pageSize}
      />
    </div>
  )
}
