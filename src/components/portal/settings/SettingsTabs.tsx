'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { ProfileSettings } from './ProfileSettings'
import { SecuritySettings } from './SecuritySettings'

interface Props {
  profile: { full_name?: string | null; email?: string | null; phone?: string | null; country?: string | null } | null
  userId: string
  userEmail: string
}

const TABS = ['Profile', 'Security', 'Notifications'] as const
type Tab = (typeof TABS)[number]

export function SettingsTabs({ profile, userId, userEmail }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Profile')

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border-subtle bg-bg-surface p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150',
              activeTab === tab
                ? 'bg-bg-elevated text-text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <ProfileSettings profile={profile} userId={userId} userEmail={userEmail} />
      )}
      {activeTab === 'Security' && (
        <SecuritySettings userId={userId} />
      )}
      {activeTab === 'Notifications' && (
        <NotificationSettings />
      )}
    </div>
  )
}

function NotificationSettings() {
  const PREFS = [
    { key: 'deposits', label: 'Deposit confirmations', description: 'When a deposit is credited' },
    { key: 'withdrawals', label: 'Withdrawal updates', description: 'Status changes on withdrawal requests' },
    { key: 'kyc', label: 'KYC updates', description: 'Verification approvals or rejections' },
    { key: 'support', label: 'Support replies', description: 'When an agent replies to your ticket' },
    { key: 'promotions', label: 'Promotions & news', description: 'Platform updates and offers' },
  ]

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 space-y-4">
      <h2 className="font-display text-base font-semibold text-text-primary">Email Notifications</h2>
      <div className="space-y-3">
        {PREFS.map((pref) => (
          <label key={pref.key} className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-primary">{pref.label}</p>
              <p className="text-xs text-text-tertiary">{pref.description}</p>
            </div>
            <input
              type="checkbox"
              defaultChecked={pref.key !== 'promotions'}
              className="h-4 w-4 rounded accent-[var(--accent-primary)]"
            />
          </label>
        ))}
      </div>
      <button className="mt-2 rounded-lg bg-accent-primary px-5 py-2 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover">
        Save Preferences
      </button>
    </div>
  )
}
