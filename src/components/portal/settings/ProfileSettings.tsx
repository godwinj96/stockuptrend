'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createBrowserClient } from '@/lib/supabase/client'

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
})

type FormData = z.infer<typeof schema>

interface Props {
  profile: { full_name?: string | null; email?: string | null; phone?: string | null; country?: string | null } | null
  userId: string
  userEmail: string
}

export function ProfileSettings({ profile, userId, userEmail }: Props) {
  const supabase = createBrowserClient()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      country: profile?.country ?? '',
    },
  })

  async function onSubmit(data: FormData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { error } = await db
      .from('profiles')
      .update({ full_name: data.fullName, phone: data.phone, country: data.country })
      .eq('id', userId)

    if (error) {
      toast.error('Failed to update profile. Please try again.')
      return
    }
    toast.success('Profile updated')
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
      <h2 className="mb-5 font-display text-base font-semibold text-text-primary">Profile Information</h2>

      <div className="mb-5 rounded-lg bg-bg-elevated px-4 py-3">
        <p className="text-xs text-text-tertiary">Email address</p>
        <p className="text-sm font-medium text-text-primary">{userEmail}</p>
        <p className="mt-0.5 text-xs text-text-tertiary">Contact support to change your email</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Full Name</label>
          <input {...register('fullName')} className="input-field" />
          {errors.fullName && <p className="mt-1 text-xs text-danger">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Phone Number</label>
          <input {...register('phone')} type="tel" placeholder="+44 7700 900123" className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Country</label>
          <input {...register('country')} className="input-field" />
          {errors.country && <p className="mt-1 text-xs text-danger">{errors.country.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
