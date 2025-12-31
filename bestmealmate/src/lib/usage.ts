import { getSupabaseAdmin } from './supabase'

export interface UsageStats {
  suggestionsUsed: number
  suggestionsLimit: number
  resetDate: string | null
  tier: string
  trialEnds: string | null
  status: string
  isUnlimited: boolean
  canUseAI: boolean
  remainingSuggestions: number
}

export interface UsageLimits {
  free: number
  premium: number
  family: number
}

export const USAGE_LIMITS: UsageLimits = {
  free: 5,
  premium: -1, // unlimited
  family: -1, // unlimited
}

/**
 * Get usage statistics for a household
 */
export async function getUsageStats(householdId: string): Promise<UsageStats | null> {
  const supabase = getSupabaseAdmin()

  const { data: household, error } = await supabase
    .from('households')
    .select('subscription_tier, ai_suggestions_this_week, ai_suggestions_reset_at, trial_ends_at, subscription_status')
    .eq('id', householdId)
    .single()

  if (error || !household) {
    console.error('Error getting usage stats:', error)
    return null
  }

  const tier = household.subscription_tier || 'free'
  const limit = USAGE_LIMITS[tier as keyof UsageLimits] ?? 5
  const isUnlimited = limit === -1
  const used = household.ai_suggestions_this_week || 0

  // Check if week needs reset
  const resetAt = household.ai_suggestions_reset_at
    ? new Date(household.ai_suggestions_reset_at)
    : new Date()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  let actualUsed = used
  if (resetAt < weekAgo) {
    actualUsed = 0 // Will be reset on next use
  }

  return {
    suggestionsUsed: actualUsed,
    suggestionsLimit: limit,
    resetDate: resetAt ? new Date(resetAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
    tier,
    trialEnds: household.trial_ends_at,
    status: household.subscription_status || 'active',
    isUnlimited,
    canUseAI: isUnlimited || actualUsed < limit,
    remainingSuggestions: isUnlimited ? -1 : Math.max(0, limit - actualUsed),
  }
}

/**
 * Check if a household can use AI and increment usage if allowed
 */
export async function checkAndIncrementUsage(householdId: string): Promise<{
  allowed: boolean
  usage: UsageStats | null
  message?: string
}> {
  const supabase = getSupabaseAdmin()

  // Get current usage
  const usage = await getUsageStats(householdId)

  if (!usage) {
    return { allowed: false, usage: null, message: 'Household not found' }
  }

  // Check if allowed
  if (!usage.canUseAI) {
    return {
      allowed: false,
      usage,
      message: `You've reached your weekly limit of ${usage.suggestionsLimit} AI suggestions. Upgrade to Premium for unlimited suggestions!`,
    }
  }

  // Increment usage
  const { error } = await supabase
    .from('households')
    .update({
      ai_suggestions_this_week: (usage.suggestionsUsed || 0) + 1,
      ai_suggestions_reset_at: usage.suggestionsUsed === 0 ? new Date().toISOString() : undefined,
    })
    .eq('id', householdId)

  if (error) {
    console.error('Error incrementing usage:', error)
    return { allowed: false, usage, message: 'Failed to track usage' }
  }

  return {
    allowed: true,
    usage: {
      ...usage,
      suggestionsUsed: usage.suggestionsUsed + 1,
      remainingSuggestions: usage.isUnlimited ? -1 : Math.max(0, usage.suggestionsLimit - usage.suggestionsUsed - 1),
      canUseAI: usage.isUnlimited || usage.suggestionsUsed + 1 < usage.suggestionsLimit,
    },
  }
}

/**
 * Get days until trial expires
 */
export function getDaysUntilTrialExpires(trialEnds: string | null): number | null {
  if (!trialEnds) return null

  const endDate = new Date(trialEnds)
  const now = new Date()
  const diffTime = endDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays > 0 ? diffDays : 0
}

/**
 * Check if trial is expiring soon (within 3 days)
 */
export function isTrialExpiringSoon(trialEnds: string | null): boolean {
  const days = getDaysUntilTrialExpires(trialEnds)
  return days !== null && days <= 3 && days > 0
}
