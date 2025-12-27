import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Validate URL format
function isValidSupabaseUrl(url: string): boolean {
  return url.startsWith('https://') && url.includes('.supabase.co') && !url.includes('placeholder')
}

// Client-side Supabase instance
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Server-side admin client (only create if service key is available)
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Helper to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return isValidSupabaseUrl(supabaseUrl) && supabaseAnonKey !== 'placeholder-key'
}

// Helper function for client-side use with validation
export function getSupabase(): SupabaseClient<Database> {
  if (!isSupabaseConfigured() && isBrowser) {
    console.warn('Supabase is not properly configured. Check your environment variables.')
  }
  return supabase
}

// Helper function for server-side admin operations
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available. Check SUPABASE_SERVICE_ROLE_KEY.')
  }
  return supabaseAdmin
}

// Type-safe database helpers
export async function getUserHousehold(userId: string) {
  const { data, error } = await supabase
    .from('family_members')
    .select(`
      *,
      households (*)
    `)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user household:', error)
    return null
  }

  return data
}

export async function createHouseholdWithMember(
  userId: string,
  householdName: string,
  memberName: string,
  email: string
) {
  // Create household
  const { data: household, error: householdError } = await supabase
    .from('households')
    .insert({
      name: householdName || 'My Household',
    })
    .select()
    .single()

  if (householdError) {
    console.error('Error creating household:', householdError)
    throw householdError
  }

  // Create family member linked to user
  const { data: member, error: memberError } = await supabase
    .from('family_members')
    .insert({
      household_id: household.id,
      user_id: userId,
      name: memberName || email.split('@')[0],
      role: 'admin',
    })
    .select()
    .single()

  if (memberError) {
    console.error('Error creating family member:', memberError)
    throw memberError
  }

  return { household, member }
}
