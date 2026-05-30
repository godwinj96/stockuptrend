'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, AlertCircle } from 'lucide-react'
import { AnimatedCheckmark } from '@/components/shared/AnimatedCheckmark'
import { CopyButton } from '@/components/shared/CopyButton'
import { formatCurrency } from '@/lib/utils/format'

interface Props {
  userId: string
  accountId: string
  limits: { min: number; max: number }
  walletAddresses: Record<'BTC' | 'ETH' | 'BNB' | 'USDT', string>
}

type CryptoCurrency = 'BTC' | 'ETH' | 'BNB' | 'USDT'

const CURRENCIES: { id: CryptoCurrency; label: string; network: string }[] = [
  { id: 'BTC',  label: 'Bitcoin',  network: 'BTC' },
  { id: 'ETH',  label: 'Ethereum', network: 'ERC-20' },
  { id: 'BNB',  label: 'BNB',      network: 'BEP-20' },
  { id: 'USDT', label: 'USDT',     network: 'TRC-20' },
]

const QUICK_AMOUNTS = [100, 500, 1000, 5000]

const schema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .transform(Number)
    .pipe(z.number().min(10, 'Minimum deposit is $10').max(50_000, 'Maximum deposit is $50,000')),
})

type FormValues = z.input<typeof schema>

export function CryptoDepositInfo({ accountId, limits, walletAddresses }: Props) {
  const router = useRouter()
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>('USDT')
  const [succeeded, setSucceeded] = useState(false)
  const [depositedAmount, setDepositedAmount] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const currentAddress = walletAddresses[selectedCurrency] ?? ''
  const currentCurrency = CURRENCIES.find((c) => c.id === selectedCurrency)!

  async function onSubmit(values: FormValues) {
    const amount = Number(values.amount)
    try {
      const res = await fetch('/api/portal/demo-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, amount, currency: selectedCurrency }),
      })
      const data = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Deposit failed')
      }
      setDepositedAmount(amount)
      setSucceeded(true)
      toast.success('Deposit request submitted — pending admin approval')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (succeeded) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <AnimatedCheckmark size={64} />
        <div>
          <p className="font-display text-lg font-semibold text-text-primary">
            Deposit Request Submitted
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Send exactly <span className="font-semibold text-text-primary">{formatCurrency(depositedAmount)}</span> worth
            of {selectedCurrency} to the address below. Your deposit will be credited once our team confirms receipt.
          </p>
        </div>

        {currentAddress ? (
          <div className="w-full rounded-xl border border-accent-primary/20 bg-accent-primary-muted p-4">
            <p className="mb-2 text-xs font-medium text-text-secondary">
              {currentCurrency.label} ({currentCurrency.network}) Address
            </p>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-base px-3 py-2.5">
              <span className="break-all font-mono text-xs text-text-primary">{currentAddress}</span>
              <CopyButton text={currentAddress} />
            </div>
            <p className="mt-2 text-xs text-text-tertiary">
              Send only {selectedCurrency} on the {currentCurrency.network} network to this address.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Wallet address not configured. Please contact support for payment instructions.</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSucceeded(false)}
          className="text-sm text-accent-primary underline-offset-2 hover:underline"
        >
          Make another deposit
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Currency selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">Select Currency</label>
        <div className="grid grid-cols-4 gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCurrency(c.id)}
              className={`rounded-lg border py-2.5 text-xs font-medium transition-colors ${
                selectedCurrency === c.id
                  ? 'border-accent-primary bg-accent-primary-muted text-accent-primary'
                  : 'border-border-subtle text-text-secondary hover:border-border-default hover:text-text-primary'
              }`}
            >
              <span className="block font-semibold">{c.id}</span>
              <span className="block text-[10px] opacity-70">{c.network}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Wallet address display */}
      {currentAddress ? (
        <div className="rounded-xl border border-border-subtle bg-bg-elevated p-4">
          <p className="mb-2 text-xs font-medium text-text-secondary">
            Send {currentCurrency.label} to this address ({currentCurrency.network})
          </p>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-base px-3 py-2.5">
            <span className="break-all font-mono text-xs text-text-primary">{currentAddress}</span>
            <CopyButton text={currentAddress} />
          </div>
          <p className="mt-2 text-xs text-text-tertiary">
            Only send {selectedCurrency} on the {currentCurrency.network} network. Other assets will be lost.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3 text-sm text-text-tertiary">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary" />
          <span>Wallet address not configured for {currentCurrency.label}. Contact support.</span>
        </div>
      )}

      {/* Amount input */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Deposit Amount (USD equivalent)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-text-tertiary">
              $
            </span>
            <input
              {...register('amount')}
              type="number"
              min={limits.min}
              max={limits.max}
              step="1"
              placeholder="Enter amount"
              className="input-field w-full pl-7"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs text-danger">{errors.amount.message}</p>
          )}
        </div>

        {/* Quick amounts */}
        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setValue('amount', String(amt) as unknown as FormValues['amount'])}
              className="rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent-primary hover:bg-accent-primary-muted hover:text-accent-primary"
            >
              ${amt.toLocaleString()}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary py-3 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.98] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            `Deposit with ${selectedCurrency}`
          )}
        </button>
      </form>

      <p className="text-xs text-text-tertiary">
        Min: ${limits.min} · Max: ${limits.max.toLocaleString()} · Deposits typically reviewed within 24 hours
      </p>
    </div>
  )
}
