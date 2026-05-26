import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { KYCWizard } from '@/components/portal/kyc/KYCWizard'
import type { Profile } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'KYC Verification | StockUptrend',
}

export default async function KYCPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('kyc_status, full_name, country')
    .eq('id', user!.id)
    .single()
  const profile = rawProfile as Pick<Profile, 'kyc_status' | 'full_name' | 'country'> | null

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Identity Verification
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Complete KYC to unlock trading and withdrawals. Most verifications are approved within
          1 business day.
        </p>
      </div>
      <KYCWizard
        kycStatus={profile?.kyc_status ?? 'not_started'}
        userId={user!.id}
        prefillName={profile?.full_name ?? ''}
        prefillCountry={profile?.country ?? ''}
      />
    </div>
  )
}
