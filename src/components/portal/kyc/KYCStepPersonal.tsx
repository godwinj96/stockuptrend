'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createBrowserClient } from '@/lib/supabase/client'

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  addressLine1: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postcode: z.string().min(2, 'Postcode is required'),
  country: z.string().min(2, 'Country is required'),
})

type PersonalFormData = z.infer<typeof schema>

interface Props {
  userId: string
  prefillName: string
  prefillCountry: string
  onComplete: () => void
}

export function KYCStepPersonal({ userId, prefillName, prefillCountry, onComplete }: Props) {
  const supabase = createBrowserClient()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalFormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: prefillName, country: prefillCountry },
  })

  async function onSubmit(data: PersonalFormData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { error } = await db
      .from('profiles')
      .update({ full_name: data.fullName, country: data.country })
      .eq('id', userId)

    if (error) {
      toast.error('Failed to save details. Please try again.')
      return
    }
    toast.success('Personal details saved')
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <h2 className="font-display text-lg font-semibold text-text-primary">Personal Details</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Full Name</label>
          <input {...register('fullName')} placeholder="As on your ID" className="input-field" />
          {errors.fullName && <p className="mt-1 text-xs text-danger">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Date of Birth</label>
          <input {...register('dateOfBirth')} type="date" className="input-field" />
          {errors.dateOfBirth && <p className="mt-1 text-xs text-danger">{errors.dateOfBirth.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Nationality</label>
          <input {...register('nationality')} placeholder="e.g. British" className="input-field" />
          {errors.nationality && <p className="mt-1 text-xs text-danger">{errors.nationality.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Country of Residence</label>
          <input {...register('country')} placeholder="United Kingdom" className="input-field" />
          {errors.country && <p className="mt-1 text-xs text-danger">{errors.country.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Address</label>
          <input {...register('addressLine1')} placeholder="Street address" className="input-field" />
          {errors.addressLine1 && <p className="mt-1 text-xs text-danger">{errors.addressLine1.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">City</label>
          <input {...register('city')} placeholder="London" className="input-field" />
          {errors.city && <p className="mt-1 text-xs text-danger">{errors.city.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Postcode / ZIP</label>
          <input {...register('postcode')} placeholder="SW1A 1AA" className="input-field" />
          {errors.postcode && <p className="mt-1 text-xs text-danger">{errors.postcode.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-accent-primary py-3 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent disabled:opacity-50"
      >
        {isSubmitting ? 'Saving…' : 'Continue to Documents'}
      </button>
    </form>
  )
}
