import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { Profile } from '@/lib/supabase/types'

const schema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  country: z.string().max(80).optional(),
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
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const updates = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v !== undefined),
  )

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data, error } = await db
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true, profile: data as Profile })
}
