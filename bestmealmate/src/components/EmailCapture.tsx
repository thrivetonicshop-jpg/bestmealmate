'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Gift, Sparkles } from 'lucide-react'

export default function EmailCapture() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user already dismissed or subscribed
    const hasInteracted = localStorage.getItem('emailCaptureInteracted')
    if (hasInteracted) {
      setDismissed(true)
      return
    }

    // Show popup after 10 seconds
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    // Simulate API call - replace with actual newsletter API
    try {
      // TODO: Integrate with your email service (Mailchimp, ConvertKit, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000))

      setStatus('success')
      localStorage.setItem('emailCaptureInteracted', 'subscribed')

      // Close after success message
      setTimeout(() => {
        setIsOpen(false)
      }, 2000)
    } catch {
      setStatus('error')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('emailCaptureInteracted', 'dismissed')
  }

  if (dismissed || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Get 7 Days Free!</h3>
          <p className="text-white/90">
            Plus weekly meal planning tips & exclusive recipes
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900">You&apos;re in!</p>
              <p className="text-gray-600">Check your inbox for your free trial.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-brand-500/30 transition-all disabled:opacity-70"
              >
                {status === 'loading' ? 'Subscribing...' : 'Get My Free Trial'}
              </button>

              {status === 'error' && (
                <p className="text-red-500 text-sm text-center">
                  Something went wrong. Please try again.
                </p>
              )}

              <p className="text-xs text-gray-500 text-center">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span> 50+ recipes
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span> Meal plans
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span> Tips & tricks
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
