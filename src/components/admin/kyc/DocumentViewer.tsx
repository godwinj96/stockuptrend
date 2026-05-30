'use client'

import { useState } from 'react'
import { ExternalLink, Loader2, FileText } from 'lucide-react'
import { formatDateTime } from '@/lib/utils/format'

interface KYCDoc {
  id: string
  doc_type: string
  file_url: string
  status: string | null
  created_at: string | null
}

interface DocumentViewerProps {
  userId: string
  documents: KYCDoc[]
}

const DOC_LABELS: Record<string, string> = {
  id_front:          'ID / Passport (Front)',
  id_back:           'ID / Passport (Back)',
  proof_of_address:  'Proof of Address',
  selfie:            'Selfie',
}

function DocCard({ doc, userId }: { doc: KYCDoc; userId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function viewDocument() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/kyc/${userId}/document-url?path=${encodeURIComponent(doc.file_url)}`
      )
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Failed to get URL')
      window.open(data.url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-elevated p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-secondary-muted">
            <FileText className="h-4 w-4 text-accent-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {DOC_LABELS[doc.doc_type] ?? doc.doc_type}
            </p>
            <p className="text-xs text-text-tertiary">
              {doc.created_at ? formatDateTime(doc.created_at) : 'Unknown date'}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          doc.status === 'approved' ? 'bg-accent-primary-muted text-accent-primary'
          : doc.status === 'rejected' ? 'bg-danger-muted text-danger'
          : 'bg-warning/10 text-warning'
        }`}>
          {doc.status ?? 'Pending'}
        </span>
      </div>

      {error && <p className="mb-2 text-xs text-danger">{error}</p>}

      <button
        onClick={viewDocument}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-default py-2 text-xs font-medium text-text-secondary transition-colors hover:border-accent-primary hover:bg-accent-primary-muted hover:text-accent-primary disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
        {loading ? 'Loading…' : 'View Document'}
      </button>
    </div>
  )
}

export function DocumentViewer({ userId, documents }: DocumentViewerProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-border-subtle bg-bg-elevated px-4 py-8 text-center text-sm text-text-tertiary">
        No documents submitted yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <DocCard key={doc.id} doc={doc} userId={userId} />
      ))}
    </div>
  )
}
