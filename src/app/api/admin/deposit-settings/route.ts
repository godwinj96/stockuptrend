import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ALLOWED_KEYS = [
  'bank_name', 'bank_account_name', 'bank_sort_code', 'bank_iban', 'bank_swift',
  'crypto_btc_address', 'crypto_eth_address', 'crypto_bnb_address', 'crypto_usdt_address',
] as const

const patchSchema = z.object({
  settings: z.record(z.string()),
})

export async function GET() {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const { data, error: dbError } = await db.from('deposit_settings').select('key, value')
  if (dbError) return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })

  const settings: Record<string, string> = {}
  for (const row of (data ?? []) as { key: string; value: string }[]) {
    settings[row.key] = row.value
  }

  return NextResponse.json({ settings })
}

export async function PATCH(req: NextRequest) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const body: unknown = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const rows = Object.entries(parsed.data.settings)
    .filter(([key]) => (ALLOWED_KEYS as readonly string[]).includes(key))
    .map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }))

  if (rows.length === 0) return NextResponse.json({ error: 'No valid keys provided' }, { status: 400 })

  const { error: dbError } = await db
    .from('deposit_settings')
    .upsert(rows, { onConflict: 'key' })

  if (dbError) return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })

  return NextResponse.json({ success: true })
}
