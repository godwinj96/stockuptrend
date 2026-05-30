'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createBrowserClient } from '@/lib/supabase/client'
import { ROUTES } from '@/lib/constants/routes'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createBrowserClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error('Invalid credentials. Please check your email and password.')
      return
    }

    const { data: { user: loggedInUser } } = await supabase.auth.getUser()
    if (loggedInUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', loggedInUser.id)
        .single()
      const dest = (profile as { role?: string } | null)?.role === 'admin'
        ? ROUTES.admin.dashboard
        : ROUTES.portal.dashboard
      router.push(dest)
    } else {
      router.push(ROUTES.portal.dashboard)
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-secondary">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-border-default bg-bg-elevated px-3.5 py-2.5 text-sm text-text-primary placeholder-text-tertiary transition-all duration-150 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary-muted"
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-text-secondary">
            Password
          </label>
          <Link
            href={ROUTES.auth.resetPassword}
            className="text-xs text-text-tertiary transition-colors hover:text-text-secondary"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className="w-full rounded-lg border border-border-default bg-bg-elevated px-3.5 py-2.5 pr-10 text-sm text-text-primary placeholder-text-tertiary transition-all duration-150 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary-muted"
            placeholder="••••••••"
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
        {errors.password && (
          <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>
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
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}
