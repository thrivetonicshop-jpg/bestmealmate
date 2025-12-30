'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Camera,
  Utensils,
  ShoppingCart,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  Gift,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

// Feature highlights for welcome screen
const FEATURES = [
  { icon: Camera, title: 'Scan Your Food', desc: 'AI identifies items instantly' },
  { icon: Utensils, title: 'Smart Meal Plans', desc: 'Personalized for your family' },
  { icon: ShoppingCart, title: 'Grocery Lists', desc: 'Auto-generated from meals' },
]

// Quick diet options
const QUICK_DIETS = [
  'None', 'Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Halal', 'Kosher'
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0 = welcome, 1 = account, 2 = done
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [householdSize, setHouseholdSize] = useState(2)
  const [diet, setDiet] = useState('None')
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Initialize free scans for new users
  useEffect(() => {
    const existing = localStorage.getItem('freeScansRemaining')
    if (!existing) {
      localStorage.setItem('freeScansRemaining', '3')
      localStorage.setItem('freeScansTotal', '3')
    }
  }, [])

  // Try free - go to trial experience page
  const handleTryFree = () => {
    // Ensure free scans are set
    if (!localStorage.getItem('freeScansRemaining')) {
      localStorage.setItem('freeScansRemaining', '3')
      localStorage.setItem('freeScansTotal', '3')
    }
    // Mark as guest trial user
    localStorage.setItem('guestTrialMode', 'true')
    // Go to try page with full trial experience
    router.push('/try')
  }

  const handleSubmit = async () => {
    if (!email || !password || password.length < 6) {
      toast.error('Please fill in all fields (password 6+ characters)')
      return
    }

    setIsLoading(true)
    try {
      const { supabase, createHouseholdWithMember } = await import('@/lib/supabase')

      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      // 2. Create household
      const householdName = name ? `${name}'s Kitchen` : 'My Kitchen'
      const { household } = await createHouseholdWithMember(
        authData.user.id,
        householdName,
        name || email.split('@')[0],
        email
      )

      // 3. Add dietary restriction if selected
      if (diet !== 'None') {
        const { data: adminMember } = await supabase
          .from('family_members')
          .select('id')
          .eq('household_id', household.id)
          .eq('role', 'admin')
          .single()

        if (adminMember) {
          await supabase.from('dietary_restrictions').insert({
            family_member_id: adminMember.id,
            restriction_type: diet,
          })
        }
      }

      // 4. Store household size preference
      localStorage.setItem('preferredServings', householdSize.toString())

      // Clear guest trial mode
      localStorage.removeItem('guestTrialMode')

      // Ensure free scans are set
      if (!localStorage.getItem('freeScansRemaining')) {
        localStorage.setItem('freeScansRemaining', '3')
        localStorage.setItem('freeScansTotal', '3')
      }

      setIsComplete(true)

      // Brief delay for success animation
      setTimeout(() => {
        toast.success('Welcome to BestMealMate!')
        router.push('/dashboard')
      }, 1500)

    } catch (error: unknown) {
      console.error('Onboarding error:', error)
      const message = error instanceof Error ? error.message : 'Something went wrong'
      toast.error(message)
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return email && password && password.length >= 6
    return true
  }

  // Success overlay
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-brand-600" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">You&apos;re all set!</h1>
          <p className="text-white/80">Let&apos;s start planning meals...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white overflow-hidden">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-brand-500"
          initial={{ width: '0%' }}
          animate={{ width: step === 0 ? '33%' : step === 1 ? '66%' : '100%' }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <main className="min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col px-4 pt-12 pb-24"
            >
              <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
                {/* Logo and title */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-20 h-20 bg-brand-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30"
                  >
                    <ChefHat className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.h1
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-gray-900 mb-2"
                  >
                    BestMealMate
                  </motion.h1>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600"
                  >
                    AI-powered meal planning for your family
                  </motion.p>
                </div>

                {/* Free trial badge */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 mb-8 text-center shadow-lg"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Gift className="w-5 h-5" />
                    <span className="font-bold text-lg">3 FREE Food Scans</span>
                  </div>
                  <p className="text-white/90 text-sm">Try our AI scanner - no signup required!</p>
                </motion.div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {FEATURES.map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-brand-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-500">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="mt-auto space-y-3">
                  {/* Primary: Try Free (no signup) */}
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleTryFree}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                  >
                    <Zap className="w-5 h-5" />
                    Try 3 Free Scans Now
                  </motion.button>

                  {/* Secondary: Create Account */}
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    onClick={() => setStep(1)}
                    className="w-full py-4 bg-brand-600 text-white rounded-2xl font-semibold text-lg hover:bg-brand-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30"
                  >
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <p className="text-center text-sm text-gray-500 mt-2">
                    Already have an account?{' '}
                    <button onClick={() => router.push('/login')} className="text-brand-600 font-medium hover:underline">
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Quick Setup */}
          {step === 1 && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col px-4 pt-12 pb-24"
            >
              <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-brand-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Quick Setup</h2>
                  <p className="text-gray-500">Just a few details to personalize your experience</p>
                </div>

                {/* Form */}
                <div className="space-y-4 flex-1">
                  {/* Name (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Your name <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What should we call you?"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      autoComplete="email"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="6+ characters"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 pr-12"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Household size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      How many people eat together?
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => setHouseholdSize(num)}
                          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                            householdSize === num
                              ? 'bg-brand-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {num}{num === 6 ? '+' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Diet preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Any dietary preference?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_DIETS.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDiet(d)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            diet === d
                              ? 'bg-brand-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="px-6 py-3.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isLoading}
                    className={`flex-1 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      canProceed() && !isLoading
                        ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/30 active:scale-[0.98]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Start Cooking
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
