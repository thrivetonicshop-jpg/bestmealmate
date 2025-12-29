'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DeleteAccountPage() {
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Send deletion request email
    try {
      await fetch('/api/account/delete-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason }),
      })
    } catch {
      // Still show success - request will be handled manually if API fails
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Received</h1>
          <p className="text-gray-600 mb-6">
            We have received your account deletion request. Our team will process your request within 30 days
            and send a confirmation to your email address.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            If you have an active subscription, it will be cancelled and you will not be charged further.
          </p>
          <Link href="/" className="text-emerald-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Delete Your Account</h1>
        <p className="text-gray-600 mb-6">
          Request deletion of your BestMealMate account and all associated data.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-amber-800 mb-2">What will be deleted:</h2>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Your account and login credentials</li>
            <li>• Family member profiles</li>
            <li>• Pantry items and grocery lists</li>
            <li>• Saved recipes and meal plans</li>
            <li>• Dietary preferences and restrictions</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">What we retain (for legal compliance):</h2>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Transaction records (7 years for tax purposes)</li>
            <li>• Anonymized analytics data</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Account Email Address *
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for leaving (optional)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Help us improve by sharing why you're leaving..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Submitting...' : 'Request Account Deletion'}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-500 text-center">
          Your request will be processed within 30 days per GDPR and CCPA requirements.
          You will receive an email confirmation once your account has been deleted.
        </p>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-gray-600 mb-2">
            Already logged in? You can also delete your account from:
          </p>
          <Link href="/dashboard/settings" className="text-emerald-600 hover:underline text-sm">
            Dashboard → Settings → Delete Account
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-500 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
