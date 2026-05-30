import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const db = createServiceRoleClient()

  const [
    usersRes,
    pendingDepositsRes,
    pendingKycRes,
    pendingWithdrawalsRes,
    openTicketsRes,
    volumeRes,
  ] = await Promise.all([
    db.from('profiles').select('id', { count: 'exact', head: true }),
    db.from('transactions').select('id', { count: 'exact', head: true })
      .eq('type', 'deposit').eq('status', 'pending_review'),
    db.from('profiles').select('id', { count: 'exact', head: true })
      .in('kyc_status', ['pending', 'under_review']),
    db.from('transactions').select('id', { count: 'exact', head: true })
      .eq('type', 'withdrawal').eq('status', 'pending_review'),
    db.from('support_tickets').select('id', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress']),
    db.from('transactions').select('amount').eq('type', 'deposit').eq('status', 'completed'),
  ])

  const totalVolume = (volumeRes.data ?? []).reduce(
    (sum: number, t: { amount: number }) => sum + (t.amount ?? 0), 0
  )

  return NextResponse.json({
    totalUsers:          usersRes.count ?? 0,
    pendingDeposits:     pendingDepositsRes.count ?? 0,
    pendingKyc:          pendingKycRes.count ?? 0,
    pendingWithdrawals:  pendingWithdrawalsRes.count ?? 0,
    openTickets:         openTicketsRes.count ?? 0,
    totalVolume:         parseFloat(totalVolume.toFixed(2)),
  })
}
