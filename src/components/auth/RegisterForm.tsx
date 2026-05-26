'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createBrowserClient } from '@/lib/supabase/client'
import { ROUTES } from '@/lib/constants/routes'

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name is too long'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().trim().optional(),
    country: z.string().min(1, 'Please select your country'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Australia', 'Austria', 'Bahrain', 'Bangladesh',
  'Belgium', 'Brazil', 'Canada', 'China', 'Colombia', 'Croatia', 'Czech Republic',
  'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'Hong Kong',
  'Hungary', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan',
  'Jordan', 'Kenya', 'Kuwait', 'Lebanon', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey',
  'UAE', 'Uganda', 'Ukraine', 'United Kingdom', 'United States', 'Vietnam',
]

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createBrowserClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterFormData) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone ?? null,
          country: data.country,
        },
        emailRedirectTo: `${window.location.origin}${ROUTES.auth.callback}`,
      },
    })

    if (error) {
      toast.error(error.message)
      return
    }

    router.push(ROUTES.auth.verify)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-text-secondary">
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          className="input-field w-full"
          placeholder="Jane Smith"
          {...register('fullName')}
        />
        {errors.fullName && <p className="mt-1.5 text-xs text-danger">{errors.fullName.message}</p>}
      </div>

      <div>
        <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-text-secondary">
          Email address
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          className="input-field w-full"
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text-secondary">
            Phone <span className="text-text-tertiary">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className="input-field w-full"
            placeholder="+1 234 567 8900"
            {...register('phone')}
          />
        </div>

        <div>
          <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-text-secondary">
            Country
          </label>
          <select
            id="country"
            className="input-field w-full"
            defaultValue=""
            {...register('country')}
          >
            <option value="" disabled>Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.country && <p className="mt-1.5 text-xs text-danger">{errors.country.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-text-secondary">
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className="input-field w-full pr-10"
            placeholder="Min. 8 characters"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-text-secondary">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="input-field w-full"
          placeholder="Repeat password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-danger">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary py-2.5 text-sm font-semibold text-text-inverse transition-all duration-200 hover:scale-[1.01] hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  )
}
