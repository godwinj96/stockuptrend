'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { CopyButton } from '@/components/shared/CopyButton'

interface Props {
  userId: string
  accountId: string
  limits: { min: number; max: number }
}

type CryptoAsset = 'USDT_TRC20' | 'BTC' | 'ETH'

const CRYPTO_ADDRESSES: Record<CryptoAsset, { address: string; network: string; confirmations: string }> = {
  USDT_TRC20: {
    address: 'TRC20AddressWillBeGeneratedPerUser',
    network: 'TRON (TRC-20)',
    confirmations: '1 confirmation (~1 min)',
  },
  BTC: {
    address: 'BTC_AddressWillBeGeneratedPerUser',
    network: 'Bitcoin',
    confirmations: '2 confirmations (~20 min)',
  },
  ETH: {
    address: 'ETH_AddressWillBeGeneratedPerUser',
    network: 'Ethereum (ERC-20)',
    confirmations: '12 confirmations (~3 min)',
  },
}

const ASSET_LABELS: Record<CryptoAsset, string> = {
  USDT_TRC20: 'USDT (TRC-20)',
  BTC: 'Bitcoin (BTC)',
  ETH: 'Ethereum (ETH)',
}

export function CryptoDepositInfo({ limits }: Props) {
  const [selected, setSelected] = useState<CryptoAsset>('USDT_TRC20')
  const info = CRYPTO_ADDRESSES[selected]

  return (
    <div className="space-y-5">
      {/* Asset selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">Select Asset</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(ASSET_LABELS) as CryptoAsset[]).map((asset) => (
            <button
              key={asset}
              type="button"
              onClick={() => setSelected(asset)}
              className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                selected === asset
                  ? 'border-accent-primary bg-accent-primary-muted text-accent-primary'
                  : 'border-border-subtle text-text-secondary hover:border-border-default'
              }`}
            >
              {ASSET_LABELS[asset]}
            </button>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="rounded-xl border border-border-subtle bg-bg-elevated p-4">
        <p className="mb-2 text-xs font-medium text-text-secondary">Deposit Address</p>
        <div className="flex items-center gap-2">
          <p className="flex-1 break-all font-mono text-sm text-text-primary">{info.address}</p>
          <CopyButton text={info.address} />
        </div>
        <div className="mt-3 space-y-1 text-xs text-text-tertiary">
          <p>Network: <span className="text-text-secondary">{info.network}</span></p>
          <p>Confirmations required: <span className="text-text-secondary">{info.confirmations}</span></p>
        </div>
      </div>

      <div className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-xs text-danger">
        <AlertCircle className="mb-0.5 mr-1.5 inline h-3.5 w-3.5" />
        Only send {ASSET_LABELS[selected]} on the {info.network} network. Sending other assets or
        using a different network will result in permanent loss of funds.
      </div>

      <p className="text-xs text-text-tertiary">
        Minimum: ${limits.min} equivalent · Maximum: ${limits.max.toLocaleString()} equivalent
      </p>
    </div>
  )
}
