import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const { data: txRaw } = await db.from('transactions').select('id, user_id, amount').eq('id', params.id).single()
  const tx = txRaw as { id: string; user_id: string; amount: number } | null
  if (!tx) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.from('transactions').update({ status: 'completed' }).eq('id', params.id)
  await db.from('notifications').insert({
    user_id: tx.user_id, type: 'withdrawal_approved', is_read: false,
    title: 'Withdrawal Approved',
    body: `Your withdrawal of $${Number(tx.amount).toFixed(2)} has been approved and is being processed.`,
  })

  return NextResponse.json({ success: true })
}
