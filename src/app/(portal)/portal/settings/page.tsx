import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { SettingsTabs } from '@/components/portal/settings/SettingsTabs'

export const metadata: Metadata = {
  title: 'Settings | StockUptrend',
}

export default async function SettingsPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, phone, country')
    .eq('id', user!.id)
    .single()

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your profile, security, and notification preferences.
        </p>
      </div>
      <SettingsTabs profile={profile} userId={user!.id} userEmail={user!.email ?? ''} />
    </div>
  )
}
