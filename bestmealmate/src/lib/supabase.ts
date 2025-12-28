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

// ============================================
// EMAIL SUBSCRIBER HELPERS
// ============================================

export interface EmailSubscriber {
  email: string
  name?: string
  source?: 'landing_page' | 'onboarding' | 'settings' | 'referral' | 'popup'
  preferences?: {
    weekly_tips?: boolean
    new_features?: boolean
    promotions?: boolean
  }
}

/**
 * Add email to subscriber list
 */
export async function subscribeEmail(subscriber: EmailSubscriber) {
  const { data, error } = await supabase
    .from('email_subscribers')
    .upsert({
      email: subscriber.email.toLowerCase().trim(),
      name: subscriber.name,
      source: subscriber.source || 'landing_page',
      preferences: subscriber.preferences || { weekly_tips: true, new_features: true, promotions: false },
      is_subscribed: true,
    }, {
      onConflict: 'email'
    })
    .select()
    .single()

  if (error) {
    console.error('Error subscribing email:', error)
    throw error
  }

  return data
}

/**
 * Unsubscribe email from list
 */
export async function unsubscribeEmail(email: string) {
  const { error } = await supabase
    .from('email_subscribers')
    .update({
      is_subscribed: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('email', email.toLowerCase().trim())

  if (error) {
    console.error('Error unsubscribing email:', error)
    throw error
  }
}

// ============================================
// USER PREFERENCES HELPERS
// ============================================

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  language?: string
  favorite_cuisines?: string[]
  cooking_skill_level?: 'beginner' | 'intermediate' | 'advanced'
  max_prep_time_minutes?: number
  default_servings?: number
  prefer_batch_cooking?: boolean
  prefer_one_pot_meals?: boolean
  preferred_grocery_stores?: string[]
  budget_per_week?: number
  prefer_organic?: boolean
  prefer_local?: boolean
  ai_memory?: Record<string, unknown>
  email_notifications?: boolean
  push_notifications?: boolean
  meal_reminder_time?: string
  grocery_reminder_day?: number
}

/**
 * Get user preferences
 */
export async function getUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching user preferences:', error)
  }

  return data
}

/**
 * Update or create user preferences
 */
export async function saveUserPreferences(userId: string, householdId: string, preferences: UserPreferences) {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      household_id: householdId,
      ...preferences,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving user preferences:', error)
    throw error
  }

  return data
}

/**
 * Update AI memory for a user (what the AI remembers about them)
 */
export async function updateAIMemory(userId: string, memory: Record<string, unknown>) {
  const { data: existing } = await supabase
    .from('user_preferences')
    .select('ai_memory')
    .eq('user_id', userId)
    .single()

  const updatedMemory = {
    ...(existing?.ai_memory as Record<string, unknown> || {}),
    ...memory,
    last_updated: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('user_preferences')
    .update({ ai_memory: updatedMemory })
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating AI memory:', error)
    throw error
  }
}

// ============================================
// AI GENERATED MEALS HELPERS
// ============================================

export interface GeneratedMeal {
  household_id: string
  user_id?: string
  name: string
  description?: string
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'any'
  cuisine?: string
  prep_time?: string
  cook_time?: string
  total_time?: string
  servings?: number
  ingredients?: Array<{ name: string; amount: string; notes?: string }>
  instructions?: string[]
  calories_per_serving?: number
  protein_per_serving?: number
  carbs_per_serving?: number
  fat_per_serving?: number
  prompt_used?: string
  dietary_restrictions?: string[]
  pantry_items_used?: string[]
}

/**
 * Save a generated meal to Supabase
 */
export async function saveGeneratedMeal(meal: GeneratedMeal) {
  const { data, error } = await supabase
    .from('ai_generated_meals')
    .insert({
      ...meal,
      ingredients: meal.ingredients || [],
      instructions: meal.instructions || [],
      is_saved: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving generated meal:', error)
    throw error
  }

  return data
}

/**
 * Get saved generated meals for a household
 */
export async function getSavedMeals(householdId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('ai_generated_meals')
    .select('*')
    .eq('household_id', householdId)
    .eq('is_saved', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching saved meals:', error)
    throw error
  }

  return data
}

/**
 * Rate a generated meal
 */
export async function rateMeal(mealId: string, rating: number, notes?: string) {
  const { error } = await supabase
    .from('ai_generated_meals')
    .update({
      rating,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mealId)

  if (error) {
    console.error('Error rating meal:', error)
    throw error
  }
}

/**
 * Mark a meal as cooked
 */
export async function markMealCooked(mealId: string) {
  const { error } = await supabase
    .from('ai_generated_meals')
    .update({
      is_cooked: true,
      cooked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', mealId)

  if (error) {
    console.error('Error marking meal as cooked:', error)
    throw error
  }
}

/**
 * Delete a generated meal
 */
export async function deleteGeneratedMeal(mealId: string) {
  const { error } = await supabase
    .from('ai_generated_meals')
    .delete()
    .eq('id', mealId)

  if (error) {
    console.error('Error deleting meal:', error)
    throw error
  }
}

// ============================================
// USER PROFILE BACKUP HELPERS
// ============================================

/**
 * Create a backup of user profile data
 */
export async function createProfileBackup(
  userId: string,
  householdId: string,
  backupType: 'auto' | 'manual' | 'before_delete' = 'auto'
) {
  // Fetch all user data
  const [household, familyMembers, preferences] = await Promise.all([
    supabase.from('households').select('*').eq('id', householdId).single(),
    supabase.from('family_members').select('*, dietary_restrictions(*), allergies(*), food_dislikes(*)').eq('household_id', householdId),
    getUserPreferences(userId),
  ])

  const backupData = {
    household: household.data,
    family_members: familyMembers.data,
    preferences,
    backup_timestamp: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('user_profile_backups')
    .insert({
      user_id: userId,
      household_id: householdId,
      backup_data: backupData,
      backup_type: backupType,
      backup_size_bytes: JSON.stringify(backupData).length,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating profile backup:', error)
    throw error
  }

  return data
}

/**
 * Get latest profile backup for a user
 */
export async function getLatestBackup(userId: string) {
  const { data, error } = await supabase
    .from('user_profile_backups')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching backup:', error)
  }

  return data
}

// ============================================
// LOGIN TRACKING HELPERS
// ============================================

export interface LoginInfo {
  user_id: string
  email: string
  login_method?: 'email' | 'google' | 'apple' | 'magic_link'
  user_agent?: string
  is_successful?: boolean
  failure_reason?: string
}

/**
 * Track a login attempt
 */
export async function trackLogin(loginInfo: LoginInfo) {
  // Parse user agent for device info
  const userAgent = loginInfo.user_agent || ''
  let deviceType = 'desktop'
  if (/mobile/i.test(userAgent)) deviceType = 'mobile'
  else if (/tablet/i.test(userAgent)) deviceType = 'tablet'

  const { error } = await supabase
    .from('login_history')
    .insert({
      user_id: loginInfo.user_id,
      email: loginInfo.email,
      login_method: loginInfo.login_method || 'email',
      user_agent: loginInfo.user_agent,
      device_type: deviceType,
      is_successful: loginInfo.is_successful ?? true,
      failure_reason: loginInfo.failure_reason,
    })

  if (error) {
    console.error('Error tracking login:', error)
    // Don't throw - login tracking shouldn't break the app
  }
}

/**
 * Get login history for a user
 */
export async function getLoginHistory(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('login_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching login history:', error)
  }

  return data || []
}
