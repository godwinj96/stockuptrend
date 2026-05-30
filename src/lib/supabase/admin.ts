import { createServerClient, createServiceRoleClient } from './server'

export async function requireAdmin() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, db: null, error: 'Unauthorized' as const, status: 401 }

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serviceAny = service as any
  const { data: profile } = await serviceAny.from('profiles').select('role').eq('id', user.id).single()

  if ((profile as { role?: string } | null)?.role !== 'admin') {
    return { user: null, db: null, error: 'Forbidden' as const, status: 403 }
  }

  return { user, db: serviceAny, error: null, status: 200 }
}
