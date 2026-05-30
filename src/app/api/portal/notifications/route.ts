import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import type { AppNotification } from '@/lib/supabase/types'

export async function GET() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }

  const notifications = (data ?? []) as AppNotification[]
  const unread_count = notifications.filter((n) => !n.is_read).length

  return NextResponse.json({ notifications, unread_count })
}
