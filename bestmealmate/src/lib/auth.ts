import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './database.types'

// Client-side auth helper
export function createClient() {
  return createClientComponentClient<Database>()
}

// Server-side auth helper
export function createServerClient() {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Get current user's household ID
export async function getHouseholdId(supabase: ReturnType<typeof createClient | typeof createServerClient>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Find the family member record for this user to get household_id
  const { data: familyMember } = await supabase
    .from('family_members')
    .select('household_id')
    .eq('user_id', user.id)
    .single()

  return (familyMember as { household_id: string } | null)?.household_id || null
}

// Get current user with household info
export async function getCurrentUser(supabase: ReturnType<typeof createClient | typeof createServerClient>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: familyMember } = await supabase
    .from('family_members')
    .select(`
      *,
      households (*)
    `)
    .eq('user_id', user.id)
    .single()

  const typedFamilyMember = familyMember as { household_id: string; households: any } | null

  return {
    user,
    familyMember,
    household: typedFamilyMember?.households || null,
    householdId: typedFamilyMember?.household_id || null
  }
}
