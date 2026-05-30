import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PORTAL_PATH = '/portal'
const ADMIN_PATH = '/admin'
const AUTH_PATHS = ['/auth/login', '/auth/register']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  // Unauthenticated: block portal and admin
  if (!user && (pathname.startsWith(PORTAL_PATH) || pathname.startsWith(ADMIN_PATH))) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  if (user) {
    if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
      const { data: profile } = await db.from('profiles').select('role').eq('id', user.id).single()
      const url = request.nextUrl.clone()
      url.searchParams.delete('redirectTo')
      url.pathname = (profile as { role?: string } | null)?.role === 'admin'
        ? '/admin/dashboard'
        : '/portal/dashboard'
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith(ADMIN_PATH)) {
      const { data: profile } = await db.from('profiles').select('role').eq('id', user.id).single()
      if ((profile as { role?: string } | null)?.role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/portal/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
