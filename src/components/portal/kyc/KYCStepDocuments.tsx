'use client'

import { useState, useRef } from 'react'
import { Upload, FileCheck, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createBrowserClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_SIZE_MB = 10

interface Props {
  userId: string
  onComplete: () => void
}

type DocType = 'government_id' | 'proof_of_address'

interface UploadedFile {
  file: File
  url: string
}

export function KYCStepDocuments({ userId, onComplete }: Props) {
  const supabase = createBrowserClient()
  const [uploads, setUploads] = useState<Partial<Record<DocType, UploadedFile>>>({})
  const [uploading, setUploading] = useState<DocType | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const govIdRef = useRef<HTMLInputElement>(null)
  const poaRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(docType: DocType, file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG and PDF files are accepted')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be under ${MAX_SIZE_MB}MB`)
      return
    }

    setUploading(docType)
    const ext = file.name.split('.').pop()
    const path = `${userId}/${docType}-${Date.now()}.${ext}`

    const { error } = await supabase.storage.from('kyc-documents').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) {
      toast.error('Upload failed. Please try again.')
      setUploading(null)
      return
    }

    setUploads((prev) => ({ ...prev, [docType]: { file, url: path } }))
    setUploading(null)
    toast.success('Document uploaded')
  }

  async function handleSubmit() {
    if (!uploads.government_id || !uploads.proof_of_address) {
      toast.error('Please upload both documents')
      return
    }

    setSubmitting(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { error } = await db.from('kyc_documents').insert([
      { user_id: userId, doc_type: 'government_id', file_url: uploads.government_id.url, status: 'pending' },
      { user_id: userId, doc_type: 'proof_of_address', file_url: uploads.proof_of_address.url, status: 'pending' },
    ])

    if (error) {
      toast.error('Submission failed. Please try again.')
      setSubmitting(false)
      return
    }

    toast.success('Documents submitted')
    onComplete()
  }

  const DOCS: Array<{ type: DocType; label: string; hint: string; ref: React.RefObject<HTMLInputElement> }> = [
    {
      type: 'government_id',
      label: 'Government-Issued ID',
      hint: "Passport, national ID card, or driver's licence",
      ref: govIdRef,
    },
    {
      type: 'proof_of_address',
      label: 'Proof of Address',
      hint: 'Utility bill or bank statement dated within 3 months',
      ref: poaRef,
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold text-text-primary">ID Documents</h2>

      <div className="rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning">
        <AlertCircle className="mb-0.5 mr-1.5 inline h-4 w-4" />
        Ensure documents are clear, fully visible, and not expired.
      </div>

      <div className="space-y-4">
        {DOCS.map(({ type, label, hint, ref }) => {
          const uploaded = uploads[type]
          const isUploading = uploading === type
          return (
            <div key={type}>
              <input
                ref={ref}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(type, file)
                }}
              />
              <button
                type="button"
                onClick={() => ref.current?.click()}
                disabled={isUploading}
                className={cn(
                  'flex w-full items-center gap-4 rounded-xl border-2 border-dashed p-5 text-left transition-colors',
                  uploaded
                    ? 'border-accent-primary/40 bg-accent-primary-muted'
                    : 'border-border-subtle hover:border-border-default',
                  isUploading && 'opacity-60'
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-elevated">
                  {uploaded ? (
                    <FileCheck className="h-5 w-5 text-accent-primary" />
                  ) : (
                    <Upload className="h-5 w-5 text-text-tertiary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{label}</p>
                  <p className="text-xs text-text-tertiary">{uploaded ? uploaded.file.name : hint}</p>
                </div>
                {isUploading && (
                  <span className="ml-auto text-xs text-text-tertiary">Uploading…</span>
                )}
                {uploaded && !isUploading && (
                  <span className="ml-auto text-xs font-medium text-accent-primary">Uploaded ✓</span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!uploads.government_id || !uploads.proof_of_address || submitting}
        className="w-full rounded-lg bg-accent-primary py-3 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Continue to Selfie'}
      </button>
    </div>
  )
}
