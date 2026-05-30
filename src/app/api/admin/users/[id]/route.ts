import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { z } from 'zod'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const [{ data: profile }, { data: account }, { data: transactions }, { data: trades }] = await Promise.all([
    db.from('profiles').select('*').eq('id', params.id).single(),
    db.from('accounts').select('*').eq('user_id', params.id).eq('is_active', true).single(),
    db.from('transactions').select('*').eq('user_id', params.id).order('created_at', { ascending: false }).limit(10),
    db.from('trades').select('profit_loss, status').eq('user_id', params.id),
  ])

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const closedTrades = (trades ?? []).filter((t: { status: string }) => t.status === 'closed')
  const totalPnL = closedTrades.reduce((s: number, t: { profit_loss: number | null }) => s + (t.profit_loss ?? 0), 0)

  return NextResponse.json({
    profile, account: account ?? null, transactions: transactions ?? [],
    stats: { totalTrades: closedTrades.length, totalPnL: parseFloat(totalPnL.toFixed(2)) },
  })
}

const patchSchema = z.object({
  account_type: z.enum(['standard', 'pro', 'vip']).optional(),
  role:         z.enum(['user', 'admin']).optional(),
  is_active:    z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const body: unknown = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  if (parsed.data.account_type || parsed.data.role) {
    const profileUpdates: Record<string, unknown> = {}
    if (parsed.data.role) profileUpdates.role = parsed.data.role
    if (parsed.data.account_type) profileUpdates.account_type = parsed.data.account_type
    await db.from('profiles').update(profileUpdates).eq('id', params.id)
  }
  if (parsed.data.is_active !== undefined) {
    await db.from('accounts').update({ is_active: parsed.data.is_active }).eq('user_id', params.id)
  }

  return NextResponse.json({ success: true })
}
