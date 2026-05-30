import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({ reason: z.string().min(1).max(500) })

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const body: unknown = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Reason required' }, { status: 400 })

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const { data: txRaw } = await db.from('transactions').select('id, user_id, amount').eq('id', params.id).single()
  const tx = txRaw as { id: string; user_id: string; amount: number } | null
  if (!tx) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.from('transactions').update({ status: 'failed', admin_note: parsed.data.reason }).eq('id', params.id)
  await db.from('notifications').insert({
    user_id: tx.user_id, type: 'system', is_read: false,
    title: 'Deposit Rejected',
    body: `Your deposit of $${Number(tx.amount).toFixed(2)} was rejected. Reason: ${parsed.data.reason}`,
  })

  return NextResponse.json({ success: true })
}
