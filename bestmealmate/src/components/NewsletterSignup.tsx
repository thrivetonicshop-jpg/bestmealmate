'use client'

import { useState } from 'react'
import { Mail, Check, Loader2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface NewsletterSignupProps {
  variant?: 'inline' | 'card' | 'footer'
  className?: string
}

export default function NewsletterSignup({ variant = 'card', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          tags: ['website-signup', variant]
        })
      })

      const data = await response.json()

      if (data.success) {
        setSubscribed(true)
        toast.success(data.message || 'Successfully subscribed!')
        setEmail('')
        setFirstName('')
      } else {
        toast.error(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 ${className}`}>
        <div className="p-2 bg-green-500 rounded-full">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-green-800">You&apos;re on the list!</p>
          <p className="text-sm text-green-600">Check your inbox for a welcome email.</p>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          Subscribe
        </button>
      </form>
    )
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h4 className="font-semibold text-gray-900 mb-2">Get Meal Tips Weekly</h4>
        <p className="text-sm text-gray-600 mb-3">Join 10,000+ families getting recipe ideas.</p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Subscribe Free
          </button>
        </form>
      </div>
    )
  }

  // Card variant (default)
  return (
    <div className={`bg-gradient-to-br from-brand-50 to-emerald-50 rounded-2xl p-6 border border-brand-100 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-brand-600" />
        <h3 className="font-bold text-gray-900">Get Weekly Meal Ideas</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Join 10,000+ families. Get recipes, meal planning tips, and exclusive offers delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="w-1/3 px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Mail className="w-5 h-5" />
          )}
          Subscribe for Free
        </button>
        <p className="text-xs text-gray-500 text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </form>
    </div>
  )
}
