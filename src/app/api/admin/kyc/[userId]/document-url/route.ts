import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const storagePath = new URL(req.url).searchParams.get('path')
  if (!storagePath) return NextResponse.json({ error: 'path is required' }, { status: 400 })

  // Verify the path belongs to the userId for safety
  if (!storagePath.startsWith(params.userId + '/')) {
    return NextResponse.json({ error: 'Path does not belong to user' }, { status: 403 })
  }

  const db = createServiceRoleClient()
  const { data, error: storageError } = await db.storage
    .from('kyc-documents')
    .createSignedUrl(storagePath, 120) // 2 min expiry

  if (storageError || !data?.signedUrl) {
    return NextResponse.json({ error: 'Could not generate signed URL' }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
