import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({ status: z.enum(['open', 'in_progress', 'resolved']) })

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const body: unknown = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const db = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbAny = db as any

  await dbAny.from('support_tickets').update({ status: parsed.data.status }).eq('id', params.id)

  return NextResponse.json({ success: true })
}
