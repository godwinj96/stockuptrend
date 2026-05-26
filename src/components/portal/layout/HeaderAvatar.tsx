import { getProfile } from '@/lib/supabase/queries'

export function HeaderAvatarSkeleton() {
  return <div className="h-8 w-8 animate-pulse rounded-full bg-bg-overlay" />
}

export async function HeaderAvatar({ userId }: { userId: string }) {
  const profile = await getProfile(userId)

  const initials =
    profile?.full_name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ??
    profile?.email?.[0]?.toUpperCase() ??
    'U'

  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-primary-muted text-xs font-semibold text-accent-primary transition-colors hover:bg-accent-primary/20"
      aria-label="Account menu"
    >
      {initials}
    </button>
  )
}
