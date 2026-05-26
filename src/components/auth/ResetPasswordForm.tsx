'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { MailCheck } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

const schema = z.object({ email: z.string().email('Enter a valid email address') })
type FormData = z.infer<typeof schema>

export function ResetPasswordForm() {
  const supabase = createBrowserClient()
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/portal/settings`,
    })
    if (error) {
      toast.error(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center">
        <MailCheck className="mx-auto mb-3 h-10 w-10 text-accent-primary" />
        <p className="font-semibold text-text-primary">Check your inbox</p>
        <p className="mt-1 text-sm text-text-secondary">
          If an account exists with that email, we&apos;ve sent a reset link.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">Email Address</label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className="input-field"
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-accent-primary py-3 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent disabled:opacity-50"
      >
        {isSubmitting ? 'Sending…' : 'Send Reset Link'}
      </button>
    </form>
  )
}
