import { cache } from 'react'
import { createServerClient } from './server'
import type { Profile } from './types'

export const getServerUser = cache(async () => {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export const getProfile = cache(async (userId: string): Promise<Profile | null> => {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data as Profile | null
})
