import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_SIZE_BYTES = 10 * 1024 * 1024
const REQUIRED_DOC_TYPES = ['id_front', 'proof_of_address', 'selfie']

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const docType = formData.get('doc_type') as string | null

  if (!file || !docType) {
    return NextResponse.json({ error: 'file and doc_type are required' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed. Use JPEG, PNG, WEBP, or PDF.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 })
  }

  const serviceSupabase = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = serviceSupabase as any

  const ext = file.name.split('.').pop() ?? 'jpg'
  const storagePath = `${user.id}/${docType}/${Date.now()}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await serviceSupabase.storage
    .from('kyc-documents')
    .upload(storagePath, arrayBuffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('kyc-upload: storage error', uploadError)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { error: dbError } = await db
    .from('kyc_documents')
    .upsert(
      { user_id: user.id, doc_type: docType, file_url: storagePath, status: 'pending' },
      { onConflict: 'user_id,doc_type' },
    )

  if (dbError) {
    console.error('kyc-upload: db error', dbError)
    return NextResponse.json({ error: 'Failed to save document record' }, { status: 500 })
  }

  // Check if all required docs submitted → set kyc_status to 'pending'
  const { data: docs } = await serviceSupabase
    .from('kyc_documents')
    .select('doc_type')
    .eq('user_id', user.id)

  const docsTyped = docs as Array<{ doc_type: string }> | null
  const submittedTypes = (docsTyped ?? []).map((d) => d.doc_type)
  const allSubmitted = REQUIRED_DOC_TYPES.every((t) => submittedTypes.includes(t))

  if (allSubmitted) {
    await db.from('profiles').update({ kyc_status: 'pending' }).eq('id', user.id)
  }

  return NextResponse.json({ success: true, path: storagePath, kycPending: allSubmitted })
}
