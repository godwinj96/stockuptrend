'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils/format'
import { ShieldCheck } from 'lucide-react'

interface Limits {
  min: number
  max: number
}

interface Props {
  accountId: string
  currency: string
  userId?: string
  limits: Limits
}

function makeSchema(limits: Limits) {
  return z.object({
    amount: z
      .number({ invalid_type_error: 'Enter a valid amount' })
      .min(limits.min, `Minimum deposit is ${formatCurrency(limits.min)}`)
      .max(limits.max, `Maximum deposit is ${formatCurrency(limits.max)}`),
  })
}

type FormData = { amount: number }

const QUICK_AMOUNTS = [100, 250, 500, 1000]

export function CardDepositForm({ accountId, currency, limits }: Props) {
  const schema = makeSchema(limits)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const amount = watch('amount')

  async function onSubmit(data: FormData) {
    const res = await fetch('/api/portal/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: data.amount, method: 'card', accountId, currency }),
    })

    if (!res.ok) {
      toast.error('Failed to initiate deposit. Please try again.')
      return
    }

    const { url } = await res.json()
    if (url) {
      window.location.href = url
    } else {
      toast.error('Payment session error. Please contact support.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          Deposit Amount ({currency})
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-tertiary">
            $
          </span>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            min={limits.min}
            max={limits.max}
            step="0.01"
            placeholder={`${limits.min}`}
            className="input-field pl-8"
          />
        </div>
        {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount.message}</p>}
      </div>

      {/* Quick amounts */}
      <div className="flex gap-2">
        {QUICK_AMOUNTS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setValue('amount', q, { shouldValidate: true })}
            className="flex-1 rounded-lg border border-border-subtle py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
          >
            ${q}
          </button>
        ))}
      </div>

      {amount > 0 && (
        <div className="rounded-lg bg-bg-elevated p-4 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>Amount</span>
            <span className="font-medium text-text-primary">{formatCurrency(amount, currency)}</span>
          </div>
          <div className="mt-1 flex justify-between text-text-secondary">
            <span>Processing fee</span>
            <span className="font-medium text-accent-primary">Free</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary py-3.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent disabled:opacity-50"
      >
        <ShieldCheck className="h-4 w-4" />
        {isSubmitting ? 'Redirecting…' : 'Pay Securely'}
      </button>

      <p className="text-center text-xs text-text-tertiary">
        Secured by Stripe · 256-bit SSL encryption
      </p>
    </form>
  )
}
