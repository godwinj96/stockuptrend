'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function SecuritySettings({ userId: _userId }: { userId: string }) {
  const supabase = createBrowserClient()
  const [showNew, setShowNew] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.updateUser({ password: data.newPassword })
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Password updated successfully')
    reset()
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        <h2 className="mb-5 font-display text-base font-semibold text-text-primary">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Current Password</label>
            <input {...register('currentPassword')} type="password" className="input-field" autoComplete="current-password" />
            {errors.currentPassword && <p className="mt-1 text-xs text-danger">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">New Password</label>
            <div className="relative">
              <input
                {...register('newPassword')}
                type={showNew ? 'text' : 'password'}
                className="input-field pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-xs text-danger">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Confirm New Password</label>
            <input {...register('confirmPassword')} type="password" className="input-field" autoComplete="new-password" />
            {errors.confirmPassword && <p className="mt-1 text-xs text-danger">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover disabled:opacity-50"
          >
            {isSubmitting ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-primary-muted">
            <ShieldCheck className="h-5 w-5 text-accent-primary" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-text-primary">
              Two-Factor Authentication
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Add an extra layer of security with a TOTP authenticator app.
            </p>
            <button className="mt-3 rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-primary transition-all hover:bg-bg-elevated">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
