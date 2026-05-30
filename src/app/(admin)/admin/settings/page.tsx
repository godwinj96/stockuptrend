import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { DepositSettingsForm } from '@/components/admin/settings/DepositSettingsForm'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Settings | Admin',
  robots: { index: false, follow: false },
}

export default async function AdminSettingsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.auth.login)

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const { data: profileRaw } = await db.from('profiles').select('role').eq('id', user.id).single()
  const profile = profileRaw as { role?: string } | null
  if (profile?.role !== 'admin') redirect(ROUTES.portal.dashboard)

  const { data: rows } = await db.from('deposit_settings').select('key, value')
  const settings: Record<string, string> = {}
  for (const row of (rows ?? []) as { key: string; value: string }[]) {
    settings[row.key] = row.value
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-text-primary">Deposit Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage the bank transfer details and crypto wallet addresses shown to users on the deposit screen.
        </p>
      </div>
      <DepositSettingsForm initialSettings={settings} />
    </div>
  )
}
