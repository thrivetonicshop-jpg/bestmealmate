'use client'

import { useState } from 'react'
import { X, AlertTriangle, Check, Zap, Users, ChefHat } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DowngradeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  currentTier: string
}

export function DowngradeModal({ isOpen, onClose, onConfirm, currentTier }: DowngradeModalProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'confirm' | 'feedback'>('confirm')
  const [feedback, setFeedback] = useState('')

  const featuresYouLose = {
    premium: [
      { icon: Zap, text: 'Unlimited AI suggestions (down to 5/week)' },
      { icon: Users, text: '8 family profiles (down to 2)' },
      { icon: ChefHat, text: 'Recipe import feature' },
    ],
    family: [
      { icon: Zap, text: 'Unlimited AI suggestions (down to 5/week)' },
      { icon: Users, text: 'Unlimited family profiles (down to 2)' },
      { icon: ChefHat, text: 'Priority AI Chef support' },
    ],
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      setStep('feedback')
    } catch (error) {
      console.error('Failed to downgrade:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep('confirm')
    setFeedback('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {step === 'confirm' ? (
            <>
              {/* Header */}
              <div className="bg-amber-50 border-b border-amber-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">Cancel Subscription?</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      You&apos;ll lose access to premium features
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  If you cancel, you&apos;ll be downgraded to the Free plan and lose these features:
                </p>

                <div className="space-y-3 mb-6">
                  {(featuresYouLose[currentTier as keyof typeof featuresYouLose] || featuresYouLose.premium).map(
                    (feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-700">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    )
                  )}
                </div>

                <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-green-800">
                    <strong>Keep your plan</strong> and continue enjoying unlimited meal planning,
                    AI suggestions, and all premium features for your family.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 p-4 flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all"
                >
                  Keep My Plan
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="py-3 px-6 text-gray-600 font-medium hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Canceling...' : 'Cancel Anyway'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Feedback step */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Subscription Canceled</h2>
                  <p className="text-gray-600 mt-2">
                    You&apos;ve been moved to the Free plan. We&apos;re sad to see you go!
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Help us improve - why are you leaving?
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Your feedback helps us make BestMealMate better..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Done
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Changed your mind?{' '}
                  <button className="text-green-600 hover:text-green-700 font-medium">
                    Resubscribe anytime
                  </button>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DowngradeModal
