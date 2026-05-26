'use client'

import { useState, useRef } from 'react'
import { Camera, FileCheck } from 'lucide-react'
import { toast } from 'sonner'
import { createBrowserClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

interface Props {
  userId: string
  onComplete: () => void
}

export function KYCStepSelfie({ userId, onComplete }: Props) {
  const supabase = createBrowserClient()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedPath, setUploadedPath] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(file: File) {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPEG and PNG images are accepted')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB')
      return
    }

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/selfie-${Date.now()}.${ext}`

    const { error } = await supabase.storage.from('kyc-documents').upload(path, file, {
      upsert: false,
    })

    setUploading(false)

    if (error) {
      toast.error('Upload failed. Please try again.')
      return
    }

    setUploadedFile(file)
    setUploadedPath(path)
    toast.success('Selfie uploaded')
  }

  async function handleSubmit() {
    if (!uploadedFile || !uploadedPath) return
    setSubmitting(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any

    // Insert kyc_documents record for selfie (fixes missing row bug)
    const { error: docError } = await db.from('kyc_documents').insert({
      user_id: userId,
      doc_type: 'selfie',
      file_url: uploadedPath,
      status: 'pending',
    })

    if (docError) {
      toast.error('Submission failed. Please try again.')
      setSubmitting(false)
      return
    }

    const { error: profileError } = await db
      .from('profiles')
      .update({ kyc_status: 'under_review' })
      .eq('id', userId)

    if (profileError) {
      toast.error('Submission failed. Please try again.')
      setSubmitting(false)
      return
    }

    toast.success("KYC submitted for review! We'll notify you within 1 business day.")
    onComplete()
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold text-text-primary">Selfie with ID</h2>

      <div className="rounded-lg border border-border-subtle bg-bg-elevated p-4 text-sm text-text-secondary">
        <ul className="space-y-1.5">
          <li>• Hold your government-issued ID clearly next to your face</li>
          <li>• Ensure both your face and ID text are clearly visible</li>
          <li>• Good lighting — no shadows or glare on the ID</li>
        </ul>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
      />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className={cn(
          'flex w-full items-center gap-4 rounded-xl border-2 border-dashed p-6 text-left transition-colors',
          uploadedFile
            ? 'border-accent-primary/40 bg-accent-primary-muted'
            : 'border-border-subtle hover:border-border-default',
          uploading && 'opacity-60'
        )}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-elevated">
          {uploadedFile ? (
            <FileCheck className="h-6 w-6 text-accent-primary" />
          ) : (
            <Camera className="h-6 w-6 text-text-tertiary" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">
            {uploadedFile ? uploadedFile.name : 'Upload Selfie with ID'}
          </p>
          <p className="text-xs text-text-tertiary">
            {uploadedFile ? 'Tap to replace' : 'JPEG or PNG, max 10MB'}
          </p>
        </div>

        {/* Indeterminate shimmer while uploading */}
        {uploading && (
          <div className="ml-auto h-1 w-20 overflow-hidden rounded-full bg-bg-elevated">
            <div className="shimmer h-full w-full" />
          </div>
        )}
        {uploadedFile && !uploading && (
          <span className="ml-auto text-xs font-medium text-accent-primary">Uploaded ✓</span>
        )}
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!uploadedFile || uploading || submitting}
        className="w-full rounded-lg bg-accent-primary py-3 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Submit for Review'}
      </button>
    </div>
  )
}
