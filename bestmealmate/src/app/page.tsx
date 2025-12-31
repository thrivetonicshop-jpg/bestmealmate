'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChefHat,
  Users,
  ShoppingCart,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Refrigerator,
  Leaf,
  Heart,
  Star,
  Zap,
  Target,
  Dumbbell,
  Battery,
  Scale,
  UtensilsCrossed,
  Menu,
  X
} from 'lucide-react'

// Types
interface OnboardingData {
  name: string
  familySize: number
  dietaryPreferences: string[]
  healthGoal: string
  cuisines: string[]
}

// Dietary options
const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
  { id: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
  { id: 'nut-allergy', label: 'Nut Allergy', emoji: '🥜' },
  { id: 'keto', label: 'Keto', emoji: '🥑' },
  { id: 'paleo', label: 'Paleo', emoji: '🍖' },
  { id: 'low-sodium', label: 'Low-Sodium', emoji: '🧂' },
]

// Health goals
const healthGoals = [
  { id: 'weight-loss', label: 'Weight Loss', icon: Scale, color: 'text-blue-500' },
  { id: 'muscle-gain', label: 'Build Muscle', icon: Dumbbell, color: 'text-purple-500' },
  { id: 'maintenance', label: 'Maintain Weight', icon: Target, color: 'text-green-500' },
  { id: 'energy', label: 'More Energy', icon: Battery, color: 'text-yellow-500' },
]

// Cuisine options
const cuisineOptions = [
  { id: 'italian', label: 'Italian', emoji: '🍝' },
  { id: 'mexican', label: 'Mexican', emoji: '🌮' },
  { id: 'asian', label: 'Asian', emoji: '🍜' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { id: 'american', label: 'American', emoji: '🍔' },
  { id: 'indian', label: 'Indian', emoji: '🍛' },
  { id: 'french', label: 'French', emoji: '🥐' },
  { id: 'japanese', label: 'Japanese', emoji: '🍣' },
]

// Benefits for left side
const benefits = [
  {
    icon: Users,
    title: "Family Profiles",
    desc: "Dad's keto, kid's allergies, grandma's low-sodium — all in one plan"
  },
  {
    icon: Refrigerator,
    title: "Smart Pantry",
    desc: "Know what's expiring and never waste food again"
  },
  {
    icon: ChefHat,
    title: "AI Chef",
    desc: "Smart recipes that understand your whole family's needs"
  },
  {
    icon: ShoppingCart,
    title: "Smart Grocery List",
    desc: "Intelligently merged lists organized by aisle"
  },
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [generatedMeals, setGeneratedMeals] = useState<Array<{name: string, time: string, emoji: string, type?: string, calories?: number, description?: string}>>([])
  const [weeklyStats, setWeeklyStats] = useState<{totalMeals: number, avgCaloriesPerDay: number, estimatedGroceryCost: string, prepTimeTotal: string} | null>(null)

  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    familySize: 4,
    dietaryPreferences: [],
    healthGoal: '',
    cuisines: [],
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const totalSteps = 5

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      generateMealPlan()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.name.trim().length > 0
      case 2: return formData.familySize > 0
      case 3: return true // Dietary preferences are optional
      case 4: return formData.healthGoal !== ''
      case 5: return formData.cuisines.length > 0
      default: return false
    }
  }

  const toggleDietaryPreference = (id: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(id)
        ? prev.dietaryPreferences.filter(p => p !== id)
        : [...prev.dietaryPreferences, id]
    }))
  }

  const toggleCuisine = (id: string) => {
    setFormData(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(id)
        ? prev.cuisines.filter(c => c !== id)
        : [...prev.cuisines, id]
    }))
  }

  const generateMealPlan = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-landing-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          familySize: formData.familySize,
          dietaryPreferences: formData.dietaryPreferences,
          healthGoal: formData.healthGoal,
          cuisines: formData.cuisines
        })
      })

      const data = await response.json()

      if (data.success && data.weekPlan) {
        // Extract first few meals for preview
        const previewMeals = data.weekPlan.slice(0, 3).flatMap((day: { day: string, meals: Array<{name: string, time: string, emoji: string, type: string, calories: number, description: string}> }) =>
          day.meals.map((meal: {name: string, time: string, emoji: string, type: string, calories: number, description: string}) => ({
            name: meal.name,
            time: meal.time,
            emoji: meal.emoji,
            type: meal.type,
            calories: meal.calories,
            description: meal.description
          }))
        ).slice(0, 7)

        setGeneratedMeals(previewMeals)
        setWeeklyStats(data.weeklyStats)
      } else {
        // Fallback if API fails
        setGeneratedMeals([
          { name: "Honey Garlic Salmon", time: "30 min", emoji: "🐟" },
          { name: "Mediterranean Quinoa Bowl", time: "25 min", emoji: "🥗" },
          { name: "Turkey Taco Night", time: "20 min", emoji: "🌮" }
        ])
      }
    } catch (error) {
      console.error('Error generating meal plan:', error)
      // Use fallback on error
      setGeneratedMeals([
        { name: "Honey Garlic Salmon", time: "30 min", emoji: "🐟" },
        { name: "Mediterranean Quinoa Bowl", time: "25 min", emoji: "🥗" },
        { name: "Turkey Taco Night", time: "20 min", emoji: "🌮" }
      ])
    }

    setIsGenerating(false)
    setShowCelebration(true)
  }

  const resetForm = () => {
    setCurrentStep(1)
    setFormData({
      name: '',
      familySize: 4,
      dietaryPreferences: [],
      healthGoal: '',
      cuisines: [],
    })
    setShowCelebration(false)
    setGeneratedMeals([])
    setWeeklyStats(null)
  }

  // Step content components
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Welcome to BestMealMate!</h3>
              <p className="text-gray-600 mt-2">Let&apos;s personalize your meal planning experience</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                What&apos;s your name?
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-lg"
                autoFocus
              />
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">How big is your family?</h3>
              <p className="text-gray-600 mt-2">We&apos;ll adjust portion sizes for everyone</p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setFormData(prev => ({ ...prev, familySize: Math.max(1, prev.familySize - 1) }))}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 transition-colors"
              >
                -
              </button>

              <div className="text-center">
                <span className="text-5xl font-bold text-green-600">{formData.familySize}</span>
                <p className="text-gray-500 mt-1">{formData.familySize === 1 ? 'person' : 'people'}</p>
              </div>

              <button
                onClick={() => setFormData(prev => ({ ...prev, familySize: Math.min(12, prev.familySize + 1) }))}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 transition-colors"
              >
                +
              </button>
            </div>

            <div className="flex justify-center gap-2">
              {[...Array(formData.familySize)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl"
                >
                  {i === 0 ? '👨' : i === 1 ? '👩' : i < 4 ? '👧' : '👦'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Any dietary preferences?</h3>
              <p className="text-gray-600 mt-2">Select all that apply (optional)</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {dietaryOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleDietaryPreference(option.id)}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                    formData.dietaryPreferences.includes(option.id)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className="font-medium text-sm">{option.label}</span>
                  {formData.dietaryPreferences.includes(option.id) && (
                    <Check className="w-4 h-4 ml-auto text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">What&apos;s your health goal?</h3>
              <p className="text-gray-600 mt-2">We&apos;ll tailor recipes to help you succeed</p>
            </div>

            <div className="space-y-3">
              {healthGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setFormData(prev => ({ ...prev, healthGoal: goal.id }))}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    formData.healthGoal === goal.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${goal.color}`}>
                    <goal.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-900">{goal.label}</span>
                  {formData.healthGoal === goal.id && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Favorite cuisines?</h3>
              <p className="text-gray-600 mt-2">Select at least one you love</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {cuisineOptions.map((cuisine) => (
                <button
                  key={cuisine.id}
                  onClick={() => toggleCuisine(cuisine.id)}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                    formData.cuisines.includes(cuisine.id)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{cuisine.emoji}</span>
                  <span className="font-medium text-sm">{cuisine.label}</span>
                  {formData.cuisines.includes(cuisine.id) && (
                    <Check className="w-4 h-4 ml-auto text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop&crop=center"
                alt="BestMealMate"
                width={40}
                height={40}
                className="rounded-xl object-cover shadow-md"
              />
              <span className="text-xl font-bold text-gray-900">BestMealMate</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/onboarding" className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl">
                Get Started Free
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-4 space-y-3">
                <Link href="/login" className="block w-full py-3 text-center text-gray-600 font-medium bg-gray-50 rounded-xl">
                  Log In
                </Link>
                <Link href="/onboarding" className="block w-full py-3 text-center text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with Split Layout */}
      <section className="min-h-screen pt-20 lg:pt-0 relative overflow-hidden">
        {/* Green gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />

        {/* Animated floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 text-6xl opacity-20"
          >
            🥗
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-20 text-5xl opacity-20"
          >
            🍳
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-40 left-20 text-5xl opacity-20"
          >
            🥑
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-20 right-40 text-6xl opacity-20"
          >
            🍕
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full py-12 lg:py-0">

            {/* Left Side - Storytelling & Benefits */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Meal Planning
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                  Never stress about
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> &quot;What&apos;s for dinner?&quot;</span> again
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                  AI creates meal plans your whole family will actually eat. Dad&apos;s keto, kid&apos;s picky, grandma&apos;s low-sodium — all handled in 2 minutes.
                </p>
              </motion.div>

              {/* Benefits with staggered animation */}
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4 justify-center lg:justify-start"
              >
                <div className="flex -space-x-3">
                  {['👨', '👩', '👴', '👧', '👦'].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 border-2 border-white flex items-center justify-center text-lg shadow-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">50K+ families</span> love BestMealMate
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Interactive Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 relative overflow-hidden">
                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(totalSteps)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i + 1 === currentStep
                          ? 'w-8 bg-green-500'
                          : i + 1 < currentStep
                          ? 'w-2 bg-green-500'
                          : 'w-2 bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Step indicator */}
                <p className="text-center text-sm text-gray-500 mb-6">
                  Step {currentStep} of {totalSteps}
                </p>

                {/* Form content */}
                <AnimatePresence mode="wait">
                  {renderStepContent()}
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex gap-3 mt-8">
                  {currentStep > 1 && (
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  )}

                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      canProceed()
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {currentStep === totalSteps ? (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate My Meal Plan
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Skip option for optional steps */}
                {currentStep === 3 && (
                  <button
                    onClick={nextStep}
                    className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Skip for now
                  </button>
                )}

                {/* Login link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-green-600 font-medium hover:text-green-700">
                    Log in
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">50K+</p>
              <p className="text-gray-600 text-sm mt-1">Happy Families</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">2M+</p>
              <p className="text-gray-600 text-sm mt-1">Meals Planned</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">$127</p>
              <p className="text-gray-600 text-sm mt-1">Avg Monthly Savings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">4.9</p>
              <p className="text-gray-600 text-sm mt-1">App Store Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by families everywhere
            </h2>
            <p className="text-lg text-gray-600">
              See what parents are saying about BestMealMate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Mom of 3",
                avatar: "👩",
                quote: "Finally! My husband does keto, my daughter has a nut allergy, and I'm trying to eat Mediterranean. BestMealMate handles it all in ONE weekly plan.",
                rating: 5
              },
              {
                name: "James K.",
                role: "Dad & Home Chef",
                avatar: "👨",
                quote: "I used to spend 2 hours every Sunday planning meals. Now it takes 5 minutes. The AI actually understands what my picky kids will eat!",
                rating: 5
              },
              {
                name: "Maria L.",
                role: "Working Mom",
                avatar: "👩‍💼",
                quote: "We've saved over $200/month on groceries. No more food waste, no more last-minute takeout. This app paid for itself 10x over.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loading Modal */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-green-100 border-t-green-500"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Creating Your Meal Plan</h3>
              <p className="text-gray-600">Analyzing preferences for {formData.name}&apos;s family...</p>
              <div className="mt-4 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-green-500"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Confetti/celebration animation */}
              <div className="absolute inset-0 pointer-events-none">
                {['🎉', '🥳', '🎊', '✨', '🌟'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: -50, x: Math.random() * 300, opacity: 0 }}
                    animate={{
                      y: [0, 400],
                      opacity: [1, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                    className="absolute text-2xl"
                    style={{ left: `${20 + i * 15}%` }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Meal Plan is Ready!
              </h3>
              <p className="text-gray-600 mb-6">
                Hi {formData.name}! We&apos;ve created a personalized 7-day meal plan for your family of {formData.familySize}.
              </p>

              {/* Weekly stats */}
              {weeklyStats && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{weeklyStats.totalMeals}</p>
                    <p className="text-xs text-gray-600">Meals Planned</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{weeklyStats.avgCaloriesPerDay}</p>
                    <p className="text-xs text-gray-600">Avg Cal/Day</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-purple-600">{weeklyStats.estimatedGroceryCost}</p>
                    <p className="text-xs text-gray-600">Est. Grocery</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-orange-600">{weeklyStats.prepTimeTotal}</p>
                    <p className="text-xs text-gray-600">Total Prep</p>
                  </div>
                </div>
              )}

              {/* Meal preview */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm font-medium text-gray-500 mb-3">This week&apos;s highlights:</p>
                <div className="space-y-2">
                  {generatedMeals.slice(0, 3).map((meal, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 bg-white rounded-xl p-3"
                    >
                      <span className="text-2xl">{meal.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{meal.name}</p>
                        <p className="text-xs text-gray-500">{meal.time}{meal.calories ? ` • ${meal.calories} cal` : ''}</p>
                      </div>
                      <Check className="w-5 h-5 text-green-500" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Start Over
                </button>
                <Link
                  href="/onboarding"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  View Full Plan
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything you need for
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> stress-free meals</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From AI recipe suggestions to smart grocery lists, we&apos;ve got every aspect of meal planning covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Users,
                title: "Family Diet Profiles",
                desc: "Create unique profiles for each family member with their specific dietary needs and preferences.",
                gradient: "from-green-500 to-emerald-600"
              },
              {
                icon: Sparkles,
                title: "AI Recipe Matching",
                desc: "Our AI suggests recipes that work for everyone, considering all dietary restrictions at once.",
                gradient: "from-purple-500 to-pink-600"
              },
              {
                icon: Refrigerator,
                title: "Smart Pantry",
                desc: "Track what you have, get expiry alerts, and use ingredients before they go bad.",
                gradient: "from-blue-500 to-cyan-600"
              },
              {
                icon: ShoppingCart,
                title: "Auto Grocery Lists",
                desc: "Ingredients automatically merge and organize by aisle for efficient shopping trips.",
                gradient: "from-orange-500 to-amber-600"
              },
              {
                icon: Heart,
                title: "Save Favorites",
                desc: "Build your family cookbook with recipes everyone loves for easy repeat planning.",
                gradient: "from-red-500 to-rose-600"
              },
              {
                icon: Leaf,
                title: "Zero Food Waste",
                desc: "Track waste, get suggestions to use expiring items, and see your impact over time.",
                gradient: "from-teal-500 to-green-600"
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BestMealMate - Competitor Comparison */}
      <section className="py-20 lg:py-32 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why families switch to BestMealMate
            </h2>
            <p className="text-lg text-gray-600">
              Built specifically for real families with diverse dietary needs
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-green-600 bg-green-50">BestMealMate</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Mealime</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">MyFitnessPal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { feature: "Multiple diet profiles", best: true, mealime: false, mfp: false },
                    { feature: "AI meal suggestions", best: true, mealime: false, mfp: false },
                    { feature: "Family-focused planning", best: true, mealime: "Limited", mfp: false },
                    { feature: "Smart grocery lists", best: true, mealime: true, mfp: false },
                    { feature: "Pantry tracking", best: true, mealime: false, mfp: false },
                    { feature: "Handles picky eaters", best: true, mealime: false, mfp: false },
                    { feature: "Cost per meal tracking", best: true, mealime: false, mfp: false },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center bg-green-50/50">
                        {row.best === true ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : row.best === false ? (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : (
                          <span className="text-sm text-gray-500">{row.best}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.mealime === true ? (
                          <Check className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : row.mealime === false ? (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : (
                          <span className="text-sm text-gray-500">{row.mealime}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.mfp === true ? (
                          <Check className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : row.mfp === false ? (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : (
                          <span className="text-sm text-gray-500">{row.mfp}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 text-sm mt-6"
          >
            Comparison based on publicly available features as of 2024
          </motion.p>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in 3 simple steps and enjoy stress-free meal planning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Tell us about your family", desc: "Add profiles for each family member with their dietary needs and preferences." },
              { step: "2", title: "Get personalized meal plans", desc: "Our AI creates weekly meal plans that work for everyone in your household." },
              { step: "3", title: "Shop and cook with ease", desc: "Get organized grocery lists and step-by-step recipes delivered to you." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  2 family profiles
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Weekly meal plans
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Basic grocery lists
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  5 AI suggestions/week
                </li>
              </ul>
              <Link
                href="/onboarding"
                className="block w-full py-3 text-center border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Start Planning Free
              </Link>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 border-2 border-green-500 shadow-xl relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  5 family profiles
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Unlimited meal plans
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Smart pantry tracking
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Unlimited AI suggestions
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Recipe import
                </li>
              </ul>
              <Link
                href="/onboarding?plan=premium"
                className="block w-full py-3 text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Start Free Trial
              </Link>
            </motion.div>

            {/* Family Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Family</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$14.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Unlimited profiles
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Everything in Premium
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Wearable sync
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Priority AI Chef
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  Family sharing
                </li>
              </ul>
              <Link
                href="/onboarding?plan=family"
                className="block w-full py-3 text-center border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Start Free Trial
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-32 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Got questions? We&apos;ve got answers.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: "How does the AI meal planning work?", a: "Our AI analyzes your family's dietary preferences, restrictions, and goals to create personalized weekly meal plans that everyone can enjoy." },
              { q: "Can I customize the meal plans?", a: "Absolutely! You can swap meals, adjust portions, and save your favorites. The AI learns from your preferences over time." },
              { q: "Is there a free trial?", a: "Yes! Start with our free plan which includes 2 family profiles and 5 AI suggestions per week. Upgrade anytime for more features." },
              { q: "How do I cancel my subscription?", a: "You can cancel anytime from your account settings. No questions asked, no hidden fees." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    {item.q}
                    <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600">
                    {item.a}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to simplify meal time?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join 50,000+ families who&apos;ve discovered the joy of stress-free meal planning. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding"
                className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Log In
              </Link>
            </div>
            <p className="text-white/70 text-sm mt-6">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop&crop=center"
                alt="BestMealMate"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-bold">BestMealMate</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/help" className="hover:text-white transition-colors">Help</Link>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} BestMealMate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
