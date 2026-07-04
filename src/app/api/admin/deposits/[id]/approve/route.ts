import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const { data: txRaw } = await db.from('transactions').select('id, user_id, account_id, amount, status').eq('id', params.id).single()
  const tx = txRaw as { id: string; user_id: string; account_id: string; amount: number; status: string } | null

  if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  if (tx.status !== 'pending_review') return NextResponse.json({ error: 'Not pending review' }, { status: 400 })

  await db.from('transactions').update({ status: 'completed' }).eq('id', params.id)

  const { data: accountRaw } = await db.from('accounts').select('balance').eq('id', tx.account_id).single()
  const account = accountRaw as { balance: number } | null

  await db.from('accounts').update({ balance: (account?.balance ?? 0) + tx.amount }).eq('id', tx.account_id)

  await db.from('notifications').insert({
    user_id: tx.user_id, type: 'deposit_confirmed', is_read: false,
    title: 'Deposit Approved',
    body: `Your deposit of $${Number(tx.amount).toFixed(2)} has been approved and credited to your account.`,
  })

  revalidateTag('admin-dashboard')
  return NextResponse.json({ success: true })
}
