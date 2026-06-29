import type { Metadata } from 'next'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { DepositForm } from '@/components/portal/deposit/DepositForm'
import type { Account } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Deposit Funds | StockUptrend',
}

export default async function DepositPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const [{ data: rawAccount }, { data: settingsRows }] = await Promise.all([
    supabase
      .from('accounts')
      .select('id, balance, currency, account_type, account_number, preferred_symbols')
      .eq('user_id', user!.id)
      .eq('is_active', true)
      .single(),
    db.from('deposit_settings').select('key, value'),
  ])

  const account = rawAccount as (Pick<Account, 'id' | 'balance' | 'currency' | 'account_type' | 'account_number'> & { preferred_symbols?: string[] | null }) | null

  const depositSettings: Record<string, string> = {}
  for (const row of (settingsRows ?? []) as { key: string; value: string }[]) {
    depositSettings[row.key] = row.value
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="anim-fade-up mb-8" style={{ animationDelay: '0ms' }}>
        <h1 className="font-display text-2xl font-bold text-text-primary">Deposit Funds</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Choose your preferred payment method and amount.
        </p>
      </div>
      <div className="anim-fade-up" style={{ animationDelay: '60ms' }}>
        <DepositForm
          accountId={account?.id ?? ''}
          accountNumber={account?.account_number ?? ''}
          currency={account?.currency ?? 'USD'}
          userId={user!.id}
          depositSettings={depositSettings}
          initialPreferredSymbols={account?.preferred_symbols ?? []}
        />
      </div>
    </div>
  )
}
