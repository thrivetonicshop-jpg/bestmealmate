'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Crown, AlertTriangle, Clock, Zap, X } from 'lucide-react'
import { UsageStats, getDaysUntilTrialExpires, isTrialExpiringSoon } from '@/lib/usage'

interface SubscriptionBadgeProps {
  householdId: string
  compact?: boolean
  showUsage?: boolean
}

export function SubscriptionBadge({ householdId, compact = false, showUsage = true }: SubscriptionBadgeProps) {
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTrialWarning, setShowTrialWarning] = useState(true)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch(`/api/usage?householdId=${householdId}`)
        const data = await response.json()
        if (data.success) {
          setUsage(data.usage)
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error)
      } finally {
        setLoading(false)
      }
    }

    if (householdId) {
      fetchUsage()
    }
  }, [householdId])

  if (loading || !usage) {
    return null
  }

  const tierColors = {
    free: 'bg-gray-100 text-gray-700 border-gray-200',
    premium: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200',
    family: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200',
  }

  const statusColors = {
    active: 'text-green-600',
    trialing: 'text-blue-600',
    past_due: 'text-red-600',
    canceled: 'text-gray-500',
    incomplete: 'text-orange-600',
  }

  const tierNames = {
    free: 'Free',
    premium: 'Premium',
    family: 'Family',
  }

  const daysUntilTrialExpires = getDaysUntilTrialExpires(usage.trialEnds)
  const trialExpiringSoon = isTrialExpiringSoon(usage.trialEnds)

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${tierColors[usage.tier as keyof typeof tierColors] || tierColors.free}`}>
        {usage.tier !== 'free' && <Crown className="w-3 h-3" />}
        {tierNames[usage.tier as keyof typeof tierNames] || 'Free'}
        {usage.status === 'trialing' && (
          <span className="text-blue-600">• Trial</span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Trial Warning Banner */}
      {trialExpiringSoon && showTrialWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              Your trial expires in {daysUntilTrialExpires} day{daysUntilTrialExpires !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Upgrade now to keep your premium features and unlimited AI suggestions.
            </p>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-900 mt-2"
            >
              <Zap className="w-3 h-3" />
              Upgrade Now
            </Link>
          </div>
          <button
            onClick={() => setShowTrialWarning(false)}
            className="text-amber-400 hover:text-amber-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Subscription Status Card */}
      <div className={`rounded-xl border p-4 ${tierColors[usage.tier as keyof typeof tierColors] || tierColors.free}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {usage.tier !== 'free' && <Crown className="w-5 h-5" />}
            <span className="font-semibold">
              {tierNames[usage.tier as keyof typeof tierNames] || 'Free'} Plan
            </span>
          </div>
          <span className={`text-xs font-medium ${statusColors[usage.status as keyof typeof statusColors] || statusColors.active}`}>
            {usage.status === 'trialing' && daysUntilTrialExpires !== null
              ? `${daysUntilTrialExpires} days left`
              : usage.status.charAt(0).toUpperCase() + usage.status.slice(1).replace('_', ' ')}
          </span>
        </div>

        {/* Usage Progress */}
        {showUsage && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                AI Suggestions
              </span>
              <span>
                {usage.isUnlimited
                  ? 'Unlimited'
                  : `${usage.suggestionsUsed} / ${usage.suggestionsLimit}`}
              </span>
            </div>
            {!usage.isUnlimited && (
              <>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usage.suggestionsUsed >= usage.suggestionsLimit
                        ? 'bg-red-500'
                        : usage.suggestionsUsed >= usage.suggestionsLimit * 0.8
                        ? 'bg-amber-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, (usage.suggestionsUsed / usage.suggestionsLimit) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs mt-1 opacity-70">
                  <span>
                    {usage.remainingSuggestions > 0
                      ? `${usage.remainingSuggestions} remaining`
                      : 'Limit reached'}
                  </span>
                  {usage.resetDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Resets {new Date(usage.resetDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Upgrade CTA for free tier */}
        {usage.tier === 'free' && (
          <Link
            href="/dashboard/settings"
            className="mt-3 flex items-center justify-center gap-1 w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            <Crown className="w-4 h-4" />
            Upgrade for Unlimited
          </Link>
        )}
      </div>
    </div>
  )
}

export default SubscriptionBadge
