import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/supabase/admin'
import { logAdminAction } from '@/lib/admin/audit'

const schema = z.object({ aiActive: z.boolean() })

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, db, error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const body: unknown = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { aiActive } = parsed.data

  const { data: account } = await db.from('accounts').select('id, ai_active').eq('user_id', params.id).maybeSingle()
  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

  await db.from('accounts').update({ ai_active: aiActive }).eq('id', account.id)

  await logAdminAction(db, {
    adminId: user!.id,
    targetUserId: params.id,
    action: aiActive ? 'ai_trading_enabled' : 'ai_trading_disabled',
    details: { accountId: account.id, previous: account.ai_active, next: aiActive },
  })

  revalidateTag('admin-dashboard')
  return NextResponse.json({ success: true, aiActive })
}
