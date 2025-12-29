'use client'

import { useState, useEffect } from 'react'
import { Gift, Copy, Check, Send, Users, DollarSign, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalEarnings: number
  referralCode: string
}

interface ReferralProgramProps {
  userId: string
}

export default function ReferralProgram({ userId }: ReferralProgramProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/referral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'stats', userId })
        })
        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch referral stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [userId])

  const copyReferralLink = async () => {
    if (!stats) return
    const link = `${window.location.origin}/onboarding?ref=${stats.referralCode}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferral = async () => {
    if (!stats) return
    const link = `${window.location.origin}/onboarding?ref=${stats.referralCode}`
    const text = `Join me on BestMealMate - the AI meal planning app for families! Get 14 extra days free with my referral link:`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join BestMealMate', text, url: link })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyReferralLink()
        }
      }
    } else {
      copyReferralLink()
    }
  }

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    setSending(true)
    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          userId,
          email: inviteEmail.trim()
        })
      })
      const data = await response.json()
      if (data.success) {
        toast.success(`Invitation sent to ${inviteEmail}`)
        setInviteEmail('')
      } else {
        toast.error(data.error || 'Failed to send invitation')
      }
    } catch (error) {
      toast.error('Failed to send invitation')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-20 bg-gray-200 rounded mb-4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500 to-emerald-500 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-6 h-6" />
          <h3 className="text-xl font-bold">Refer Friends, Earn Rewards</h3>
        </div>
        <p className="text-white/80">
          Give friends 14 days extra free trial. Get $5 credit for each successful referral.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
            <Users className="w-5 h-5 text-brand-500" />
            {stats?.totalReferrals || 0}
          </div>
          <p className="text-sm text-gray-500">Total Referrals</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
            <Check className="w-5 h-5" />
            {stats?.successfulReferrals || 0}
          </div>
          <p className="text-sm text-gray-500">Successful</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
            <DollarSign className="w-5 h-5 text-brand-500" />
            {((stats?.totalEarnings || 0) / 100).toFixed(2)}
          </div>
          <p className="text-sm text-gray-500">Earned</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="p-4 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Referral Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={stats ? `${window.location.origin}/onboarding?ref=${stats.referralCode}` : ''}
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
          />
          <button
            onClick={copyReferralLink}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copy link"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
          </button>
          <button
            onClick={shareReferral}
            className="px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Code: <span className="font-mono font-medium">{stats?.referralCode}</span>
        </p>
      </div>

      {/* Email Invite */}
      <div className="p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Invite by Email
        </label>
        <form onSubmit={sendInvite} className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="friend@example.com"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
          />
          <button
            type="submit"
            disabled={sending || !inviteEmail.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      {/* How it works */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">How it works</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <span>Share your unique referral link with friends</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <span>They get 14 extra days of free trial</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <span>You get $5 credit when they subscribe</span>
          </div>
        </div>
      </div>
    </div>
  )
}
