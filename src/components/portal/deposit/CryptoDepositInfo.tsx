'use client'

import { useState } from 'react'
import { AlertCircle, ExternalLink, Loader2 } from 'lucide-react'

interface Props {
  userId: string
  accountId: string
  limits: { min: number; max: number }
}

type CryptoAsset = 'usdt' | 'btc' | 'eth'

const ASSETS: { id: CryptoAsset; label: string; walletAddress: string; network: string }[] = [
  {
    id: 'usdt',
    label: 'USDT',
    walletAddress: process.env.NEXT_PUBLIC_USDT_WALLET_ADDRESS ?? '',
    network: 'TRON (TRC-20)',
  },
  {
    id: 'btc',
    label: 'Bitcoin (BTC)',
    walletAddress: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS ?? '',
    network: 'Bitcoin',
  },
  {
    id: 'eth',
    label: 'Ethereum (ETH)',
    walletAddress: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS ?? '',
    network: 'Ethereum (ERC-20)',
  },
]

const moonpayEnabled = Boolean(process.env.NEXT_PUBLIC_MOONPAY_API_KEY)

export function CryptoDepositInfo({ limits }: Props) {
  const [selected, setSelected] = useState<CryptoAsset>('usdt')
  const [loading, setLoading] = useState(false)
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const asset = ASSETS.find((a) => a.id === selected)!

  async function openMoonPay() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/portal/moonpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currencyCode: selected,
          walletAddress: asset.walletAddress,
        }),
      })
      const data = await res.json() as { signedUrl?: string; error?: string }
      if (!res.ok || !data.signedUrl) {
        throw new Error(data.error ?? 'Failed to load widget')
      }
      setWidgetUrl(data.signedUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Asset selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">Select Asset</label>
        <div className="grid grid-cols-3 gap-2">
          {ASSETS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => { setSelected(a.id); setWidgetUrl(null); setError(null) }}
              className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                selected === a.id
                  ? 'border-accent-primary bg-accent-primary-muted text-accent-primary'
                  : 'border-border-subtle text-text-secondary hover:border-border-default'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* MoonPay widget or fallback */}
      {moonpayEnabled ? (
        widgetUrl ? (
          <div className="overflow-hidden rounded-xl border border-border-subtle">
            <iframe
              src={widgetUrl}
              title="MoonPay — Buy Crypto"
              className="h-[540px] w-full"
              allow="accelerometer; autoplay; camera; gyroscope; payment"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-border-subtle bg-bg-elevated p-6 text-center">
            <p className="mb-1 text-sm font-medium text-text-primary">
              Buy {asset.label} instantly with card or bank transfer
            </p>
            <p className="mb-4 text-xs text-text-tertiary">
              Powered by MoonPay — funds credited once payment confirms
            </p>
            {error && (
              <p className="mb-3 text-xs text-danger">{error}</p>
            )}
            <button
              type="button"
              onClick={openMoonPay}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.97] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              {loading ? 'Loading…' : 'Buy with MoonPay'}
            </button>
          </div>
        )
      ) : (
        <div className="rounded-xl border border-border-subtle bg-bg-elevated p-4">
          <p className="mb-1 text-xs font-medium text-text-secondary">
            Crypto purchases via MoonPay coming soon
          </p>
          <p className="text-xs text-text-tertiary">
            To deposit crypto, transfer directly to the wallet address above once configured by your account manager.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-xs text-danger">
        <AlertCircle className="mb-0.5 mr-1.5 inline h-3.5 w-3.5" />
        Only send {asset.label} on the {asset.network} network. Sending other assets or using a
        different network will result in permanent loss of funds.
      </div>

      <p className="text-xs text-text-tertiary">
        Minimum: ${limits.min} equivalent · Maximum: ${limits.max.toLocaleString()} equivalent
      </p>
    </div>
  )
}
