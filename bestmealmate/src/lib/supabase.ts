import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid errors during build
let supabaseInstance: SupabaseClient | null = null
let supabaseAdminInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return supabaseAdminInstance
}

// Export for backwards compatibility (client-side usage)
export const supabase = {
  get client() {
    return getSupabase()
  },
  get auth() {
    return getSupabase().auth
  },
  from: (table: string) => getSupabase().from(table),
}

// Export for backwards compatibility (server-side usage)
export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table),
  get auth() {
    return getSupabaseAdmin().auth
  },
}
