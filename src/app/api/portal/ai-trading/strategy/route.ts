import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  accountId: z.string().uuid(),
  strategyId: z.string().uuid(),
})

export async function PATCH(req: NextRequest) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: unknown = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { accountId, strategyId } = parsed.data

  // Verify the strategy exists
  const { data: strategy } = await supabase
    .from('ai_strategies')
    .select('id')
    .eq('id', strategyId)
    .single()

  if (!strategy) {
    return NextResponse.json({ error: 'Strategy not found' }, { status: 404 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { error } = await db
    .from('accounts')
    .update({ strategy_id: strategyId })
    .eq('id', accountId)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
