'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Building2, Bitcoin } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/format'
import { PAYMENT_LIMITS } from '@/lib/constants/payments'

interface Props {
  accountId: string
  balance: number
  currency: string
  userId: string
}

type WithdrawalMethod = 'bank_wire' | 'crypto'

const METHODS: Array<{ id: WithdrawalMethod; label: string; icon: React.ComponentType<{ className?: string }>; detail: string }> = [
  { id: 'bank_wire', label: 'Bank Wire', icon: Building2, detail: '1–3 business days' },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin, detail: '~1 hour' },
]

function makeSchema(method: WithdrawalMethod, balance: number, limits: { min: number; max: number }) {
  const base = z.object({
    amount: z
      .number({ invalid_type_error: 'Enter a valid amount' })
      .min(limits.min, `Minimum withdrawal is ${formatCurrency(limits.min)}`)
      .max(Math.min(balance, limits.max), `Cannot exceed available balance (${formatCurrency(balance)})`),
  })

  if (method === 'bank_wire') {
    return base.extend({
      bankName: z.string().min(2, 'Bank name is required'),
      accountName: z.string().min(2, 'Account name is required'),
      iban: z.string().min(10, 'Valid IBAN is required'),
      swiftBic: z.string().min(8, 'Valid SWIFT/BIC is required'),
    })
  }

  return base.extend({
    cryptoAddress: z.string().min(20, 'Valid crypto address required'),
    cryptoNetwork: z.enum(['USDT_TRC20', 'BTC', 'ETH']),
  })
}

export function WithdrawalForm({ accountId, balance, currency, userId: _userId }: Props) {
  const [method, setMethod] = useState<WithdrawalMethod>('bank_wire')
  const limits = PAYMENT_LIMITS.withdrawal[method === 'bank_wire' ? 'bank_wire' : 'crypto']

  const schema = makeSchema(method, balance, limits)
  type FormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const amount = (watch as (field: string) => unknown)('amount') as number

  async function onSubmit(data: FormData) {
    const res = await fetch('/api/portal/withdrawal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, method, accountId, currency }),
    })

    if (!res.ok) {
      toast.error('Request failed. Please try again or contact support.')
      return
    }

    toast.success('Withdrawal request submitted. You will be notified once processed.')
    reset()
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
      {/* Balance */}
      <div className="mb-6 rounded-xl bg-bg-elevated p-4">
        <p className="text-xs text-text-tertiary">Available Balance</p>
        <p className="font-display text-3xl font-bold text-text-primary">
          {formatCurrency(balance, currency)}
        </p>
      </div>

      {/* Method tabs */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => { setMethod(m.id); reset() }}
            className={cn(
              'flex items-center gap-2 rounded-xl border p-3 transition-all duration-200',
              method === m.id
                ? 'border-accent-primary bg-accent-primary-muted'
                : 'border-border-subtle hover:border-border-default'
            )}
          >
            <m.icon className={cn('h-4 w-4', method === m.id ? 'text-accent-primary' : 'text-text-tertiary')} />
            <div className="text-left">
              <p className={cn('text-sm font-medium', method === m.id ? 'text-accent-primary' : 'text-text-secondary')}>
                {m.label}
              </p>
              <p className="text-xs text-text-tertiary">{m.detail}</p>
            </div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Amount ({currency})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-tertiary">$</span>
            <input
              {...register('amount' as never, { valueAsNumber: true })}
              type="number"
              min={limits.min}
              step="0.01"
              placeholder={`${limits.min}`}
              className="input-field pl-8"
            />
          </div>
          {'amount' in errors && errors.amount && (
            <p className="mt-1 text-xs text-danger">{(errors.amount as { message: string }).message}</p>
          )}
        </div>

        {method === 'bank_wire' && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Bank Name</label>
                <input {...register('bankName' as never)} placeholder="Barclays" className="input-field" />
                {'bankName' in errors && errors.bankName && (
                  <p className="mt-1 text-xs text-danger">{(errors.bankName as { message: string }).message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Account Name</label>
                <input {...register('accountName' as never)} placeholder="John Smith" className="input-field" />
                {'accountName' in errors && errors.accountName && (
                  <p className="mt-1 text-xs text-danger">{(errors.accountName as { message: string }).message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">IBAN</label>
              <input {...register('iban' as never)} placeholder="GB29 NWBK 6016 1331 9268 19" className="input-field font-mono" />
              {'iban' in errors && errors.iban && (
                <p className="mt-1 text-xs text-danger">{(errors.iban as { message: string }).message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">SWIFT/BIC</label>
              <input {...register('swiftBic' as never)} placeholder="BARCGB22" className="input-field font-mono" />
              {'swiftBic' in errors && errors.swiftBic && (
                <p className="mt-1 text-xs text-danger">{(errors.swiftBic as { message: string }).message}</p>
              )}
            </div>
          </>
        )}

        {method === 'crypto' && (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Network</label>
              <select {...register('cryptoNetwork' as never)} className="input-field">
                <option value="USDT_TRC20">USDT (TRC-20) — Recommended</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ERC-20)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Wallet Address</label>
              <input
                {...register('cryptoAddress' as never)}
                placeholder="Your wallet address"
                className="input-field font-mono text-sm"
              />
              {'cryptoAddress' in errors && errors.cryptoAddress && (
                <p className="mt-1 text-xs text-danger">{(errors.cryptoAddress as { message: string }).message}</p>
              )}
            </div>
          </>
        )}

        {amount > 0 && (
          <div className="rounded-lg bg-bg-elevated p-4 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>You receive</span>
              <span className="font-medium text-text-primary">{formatCurrency(amount, currency)}</span>
            </div>
            <div className="mt-1 flex justify-between text-text-secondary">
              <span>Platform fee</span>
              <span className="font-medium text-accent-primary">Free</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-accent-primary py-3 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting…' : 'Request Withdrawal'}
        </button>
        <p className="text-center text-xs text-text-tertiary">
          Withdrawal requests are reviewed within 1 business day
        </p>
      </form>
    </div>
  )
}
