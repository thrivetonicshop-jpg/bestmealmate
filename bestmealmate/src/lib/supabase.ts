import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if we're in a build environment (Next.js build phase)
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

// Validate required environment variables at runtime (not during build)
function validateEnvVars() {
  if (isBuildPhase) {
    return // Skip validation during build
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
    )
  }
}

// Create a placeholder client for build time, real client for runtime
function createSupabaseClient(): SupabaseClient<Database> {
  // During build, return a placeholder client that won't be used
  if (isBuildPhase || !supabaseUrl || !supabaseAnonKey) {
    // Return a minimal client that won't make real requests during build
    return createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

function createSupabaseAdminClient(): SupabaseClient<Database> {
  // During build, return a placeholder client
  if (isBuildPhase || !supabaseUrl || !supabaseServiceKey) {
    return createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Client-side Supabase instance
export const supabase = createSupabaseClient()

// Server-side admin client with service role
export const supabaseAdmin = createSupabaseAdminClient()

// Helper function to get validated supabase client (throws at runtime if not configured)
export function getSupabase(): SupabaseClient<Database> {
  validateEnvVars()
  return supabase
}

// Helper function to get validated admin client
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!isBuildPhase && (!supabaseUrl || !supabaseServiceKey)) {
    throw new Error(
      'Missing Supabase admin environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.'
    )
  }
  return supabaseAdmin
}

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
