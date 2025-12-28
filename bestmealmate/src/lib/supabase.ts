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

// ============================================
// SUPABASE STORAGE HELPERS
// ============================================

// Storage bucket names
export const STORAGE_BUCKETS = {
  FOOD_SCANS: 'food-scans',
  AVATARS: 'avatars',
  RECIPES: 'recipes',
  MEAL_PLANS: 'meal-plans',
} as const

type BucketName = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: BucketName,
  path: string,
  file: File | Blob,
  options?: { contentType?: string; upsert?: boolean }
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: options?.contentType,
      upsert: options?.upsert ?? false,
    })

  if (error) {
    console.error(`Error uploading to ${bucket}:`, error)
    throw error
  }

  return data
}

/**
 * Upload a base64 image to Supabase Storage
 */
export async function uploadBase64Image(
  bucket: BucketName,
  path: string,
  base64Data: string,
  options?: { upsert?: boolean }
) {
  // Extract the base64 content and mime type
  const matches = base64Data.match(/^data:(.+);base64,(.+)$/)
  if (!matches) {
    throw new Error('Invalid base64 image format')
  }

  const contentType = matches[1]
  const base64Content = matches[2]

  // Convert base64 to Blob
  const byteCharacters = atob(base64Content)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: contentType })

  return uploadFile(bucket, path, blob, { contentType, upsert: options?.upsert })
}

/**
 * Get public URL for a file in storage
 */
export function getPublicUrl(bucket: BucketName, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Get signed URL for private file access (temporary)
 */
export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn: number = 3600
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)

  if (error) {
    console.error(`Error getting signed URL:`, error)
    throw error
  }

  return data.signedUrl
}

/**
 * Delete a file from storage
 */
export async function deleteFile(bucket: BucketName, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    console.error(`Error deleting from ${bucket}:`, error)
    throw error
  }
}

/**
 * Upload food scan image and return the public URL
 */
export async function uploadFoodScanImage(
  householdId: string,
  imageBase64: string
): Promise<string> {
  const timestamp = Date.now()
  const path = `${householdId}/${timestamp}.jpg`

  await uploadBase64Image(STORAGE_BUCKETS.FOOD_SCANS, path, imageBase64, { upsert: true })
  return getPublicUrl(STORAGE_BUCKETS.FOOD_SCANS, path)
}

/**
 * Upload avatar image for a family member
 */
export async function uploadAvatar(
  memberId: string,
  imageFile: File
): Promise<string> {
  const ext = imageFile.name.split('.').pop() || 'jpg'
  const path = `${memberId}/avatar.${ext}`

  await uploadFile(STORAGE_BUCKETS.AVATARS, path, imageFile, {
    contentType: imageFile.type,
    upsert: true
  })
  return getPublicUrl(STORAGE_BUCKETS.AVATARS, path)
}

/**
 * Upload recipe image
 */
export async function uploadRecipeImage(
  recipeId: string,
  imageFile: File | Blob,
  contentType?: string
): Promise<string> {
  const ext = contentType?.split('/')[1] || 'jpg'
  const path = `${recipeId}/main.${ext}`

  await uploadFile(STORAGE_BUCKETS.RECIPES, path, imageFile, {
    contentType,
    upsert: true
  })
  return getPublicUrl(STORAGE_BUCKETS.RECIPES, path)
}

/**
 * List files in a storage bucket path
 */
export async function listFiles(bucket: BucketName, path: string = '') {
  const { data, error } = await supabase.storage.from(bucket).list(path)

  if (error) {
    console.error(`Error listing files in ${bucket}:`, error)
    throw error
  }

  return data
}
