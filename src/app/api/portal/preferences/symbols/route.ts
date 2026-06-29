import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { SYMBOL_POOL } from '@/lib/trading/symbols'

const VALID_SYMBOL_IDS = new Set<string>(SYMBOL_POOL.map((s) => s.id))
const MAX_PREFERRED = 6

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const symbols: unknown = (body as Record<string, unknown>)?.symbols

  if (!Array.isArray(symbols)) {
    return NextResponse.json({ error: 'symbols must be an array' }, { status: 400 })
  }

  const validated = symbols.filter(
    (s): s is string => typeof s === 'string' && VALID_SYMBOL_IDS.has(s)
  ).slice(0, MAX_PREFERRED)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { error } = await db
    .from('accounts')
    .update({ preferred_symbols: validated })
    .eq('user_id', user.id)
    .eq('is_active', true)

  if (error) {
    console.error('preferences/symbols: update failed', error)
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }

  return NextResponse.json({ success: true, saved: validated })
}
