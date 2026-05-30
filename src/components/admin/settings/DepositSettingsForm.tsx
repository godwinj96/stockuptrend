'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Building2, Bitcoin } from 'lucide-react'

const schema = z.object({
  bank_name:           z.string().min(1, 'Required'),
  bank_account_name:   z.string().min(1, 'Required'),
  bank_sort_code:      z.string().min(1, 'Required'),
  bank_iban:           z.string().min(1, 'Required'),
  bank_swift:          z.string().min(1, 'Required'),
  crypto_btc_address:  z.string(),
  crypto_eth_address:  z.string(),
  crypto_bnb_address:  z.string(),
  crypto_usdt_address: z.string(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  initialSettings: Record<string, string>
}

const CRYPTO_FIELDS: { key: keyof FormValues; label: string; network: string }[] = [
  { key: 'crypto_btc_address',  label: 'Bitcoin (BTC)',  network: 'BTC Network' },
  { key: 'crypto_eth_address',  label: 'Ethereum (ETH)', network: 'ERC-20' },
  { key: 'crypto_bnb_address',  label: 'BNB',            network: 'BEP-20' },
  { key: 'crypto_usdt_address', label: 'USDT',           network: 'TRC-20' },
]

export function DepositSettingsForm({ initialSettings }: Props) {
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bank_name:           initialSettings.bank_name           ?? '',
      bank_account_name:   initialSettings.bank_account_name   ?? '',
      bank_sort_code:      initialSettings.bank_sort_code       ?? '',
      bank_iban:           initialSettings.bank_iban           ?? '',
      bank_swift:          initialSettings.bank_swift          ?? '',
      crypto_btc_address:  initialSettings.crypto_btc_address  ?? '',
      crypto_eth_address:  initialSettings.crypto_eth_address  ?? '',
      crypto_bnb_address:  initialSettings.crypto_bnb_address  ?? '',
      crypto_usdt_address: initialSettings.crypto_usdt_address ?? '',
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/deposit-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: values }),
      })
      const data = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Save failed')
      toast.success('Deposit settings saved')
      reset(values)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-6">
      {/* Bank Transfer */}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-primary-muted">
            <Building2 className="h-4 w-4 text-accent-primary" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold text-text-primary">Bank Transfer Details</h2>
            <p className="text-xs text-text-tertiary">Shown to users on the deposit screen</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'bank_name' as const,         label: 'Bank Name' },
            { key: 'bank_account_name' as const,  label: 'Account Name' },
            { key: 'bank_sort_code' as const,     label: 'Sort Code' },
            { key: 'bank_iban' as const,          label: 'IBAN' },
            { key: 'bank_swift' as const,         label: 'SWIFT / BIC' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">{label}</label>
              <input
                {...register(key)}
                type="text"
                className="input-field w-full font-mono text-sm"
                placeholder={label}
              />
              {errors[key] && (
                <p className="mt-1 text-xs text-danger">{errors[key]?.message}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Crypto Wallets */}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-primary-muted">
            <Bitcoin className="h-4 w-4 text-accent-primary" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold text-text-primary">Crypto Wallet Addresses</h2>
            <p className="text-xs text-text-tertiary">Users send crypto to these addresses when depositing</p>
          </div>
        </div>

        <div className="space-y-4">
          {CRYPTO_FIELDS.map(({ key, label, network }) => (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-text-secondary">{label}</label>
                <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-text-tertiary">
                  {network}
                </span>
              </div>
              <input
                {...register(key)}
                type="text"
                className="input-field w-full font-mono text-sm"
                placeholder="Enter wallet address"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-text-tertiary">
          Changes take effect immediately for all users
        </p>
        <button
          type="submit"
          disabled={!isDirty || isSaving}
          className="flex items-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
