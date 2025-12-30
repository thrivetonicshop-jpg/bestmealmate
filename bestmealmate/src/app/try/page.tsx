'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Sparkles,
  ChefHat,
  ArrowRight,
  Check,
  Gift,
  Zap,
  Apple,
  Beef,
  Milk,
  Carrot,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import FoodScanner from '@/components/FoodScanner'
import { getFreeScanStatus, initializeFreeScans } from '@/lib/free-scans'

// Sample scanned items to show what the scanner does
const SAMPLE_ITEMS = [
  { name: 'Organic Eggs', quantity: '1 dozen', category: 'dairy', icon: '🥚', calories: 70, protein: 6 },
  { name: 'Chicken Breast', quantity: '2 lbs', category: 'meat', icon: '🍗', calories: 165, protein: 31 },
  { name: 'Fresh Broccoli', quantity: '1 head', category: 'produce', icon: '🥦', calories: 55, protein: 4 },
  { name: 'Whole Milk', quantity: '1 gallon', category: 'dairy', icon: '🥛', calories: 150, protein: 8 },
  { name: 'Apples', quantity: '6 count', category: 'produce', icon: '🍎', calories: 95, protein: 0 },
]

// Sample meal suggestions
const SAMPLE_MEALS = [
  { name: 'Chicken Stir-Fry', time: '25 min', icon: '🍳', match: '4 ingredients' },
  { name: 'Veggie Omelet', time: '15 min', icon: '🥗', match: '3 ingredients' },
  { name: 'Apple Chicken Salad', time: '20 min', icon: '🥗', match: '3 ingredients' },
]

interface TrialItem {
  name: string
  quantity: string
  category: string
  confidence?: number
}

export default function TryPage() {
  const router = useRouter()
  const [showScanner, setShowScanner] = useState(false)
  const [scannedItems, setScannedItems] = useState<TrialItem[]>([])
  const [showDemo, setShowDemo] = useState(true)
  const [freeScans, setFreeScans] = useState(3)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)

  useEffect(() => {
    // Initialize free scans
    initializeFreeScans()
    const status = getFreeScanStatus()
    setFreeScans(status.remaining)

    // Mark as guest trial mode
    localStorage.setItem('guestTrialMode', 'true')
  }, [])

  const handleItemsDetected = (items: TrialItem[]) => {
    setScannedItems(prev => [...prev, ...items])
    setShowScanner(false)
    setShowDemo(false)

    // Update free scans count
    const status = getFreeScanStatus()
    setFreeScans(status.remaining)

    // Show signup prompt if scans exhausted
    if (status.remaining <= 0) {
      setTimeout(() => setShowSignupPrompt(true), 1500)
    }

    toast.success(`Added ${items.length} items!`)
  }

  const handleTryDemo = () => {
    // Add sample items to show the experience
    setScannedItems(SAMPLE_ITEMS.map(item => ({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      confidence: 0.95
    })))
    setShowDemo(false)
    toast.success('Demo: See what scanning looks like!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-brand-600" />
            <span className="font-bold text-gray-900">BestMealMate</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Free scans badge */}
            <div className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
              <Gift className="w-4 h-4" />
              {freeScans} free scans
            </div>
            <button
              onClick={() => router.push('/onboarding')}
              className="text-sm text-brand-600 font-medium hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 pb-32 px-4">
        <div className="max-w-lg mx-auto">
          {/* Demo view - show what the app does */}
          {showDemo && scannedItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-6"
            >
              {/* Hero */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Try BestMealMate Free
                </h1>
                <p className="text-gray-600">
                  Scan your fridge, get instant meal ideas
                </p>
              </div>

              {/* Demo scan result preview */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3">
                  <p className="text-white font-medium text-sm">Example: What the scanner finds</p>
                </div>
                <div className="p-4 space-y-3">
                  {SAMPLE_ITEMS.slice(0, 3).map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        95%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Demo meal suggestions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
                  <p className="text-white font-medium text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI suggests meals you can make
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  {SAMPLE_MEALS.map((meal, i) => (
                    <motion.div
                      key={meal.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <span className="text-2xl">{meal.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{meal.name}</p>
                        <p className="text-sm text-gray-500">{meal.time} • {meal.match}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowScanner(true)}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  Scan Your Fridge Now
                </button>
                <button
                  onClick={handleTryDemo}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  See Demo First
                </button>
              </div>
            </motion.div>
          )}

          {/* Scanned items view */}
          {scannedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-6"
            >
              {/* Success header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {scannedItems.length} Items Found!
                </h2>
                <p className="text-gray-600 text-sm">
                  {freeScans > 0 ? `${freeScans} free scans remaining` : 'Sign up to continue scanning'}
                </p>
              </div>

              {/* Scanned items list */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                <div className="bg-brand-500 px-4 py-3">
                  <p className="text-white font-medium">Your Pantry</p>
                </div>
                <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                  {scannedItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                        <Apple className="w-5 h-5 text-brand-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity}</p>
                      </div>
                      {item.confidence && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {Math.round(item.confidence * 100)}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Meal suggestions based on scanned items */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
                  <p className="text-white font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Meals You Can Make
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  {SAMPLE_MEALS.map((meal) => (
                    <div
                      key={meal.name}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <span className="text-2xl">{meal.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{meal.name}</p>
                        <p className="text-sm text-gray-500">{meal.time} • Uses {meal.match}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                {freeScans > 0 ? (
                  <button
                    onClick={() => setShowScanner(true)}
                    className="w-full py-4 bg-brand-600 text-white rounded-2xl font-semibold hover:bg-brand-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Scan More Items ({freeScans} left)
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/onboarding')}
                    className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-2xl font-semibold hover:from-brand-700 hover:to-brand-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Sign Up for Unlimited Scans
                  </button>
                )}
                <button
                  onClick={() => router.push('/onboarding')}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Create Free Account
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Scanner modal */}
      {showScanner && (
        <FoodScanner
          onItemsDetected={handleItemsDetected}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Signup prompt modal */}
      <AnimatePresence>
        {showSignupPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 text-center"
            >
              <button
                onClick={() => setShowSignupPrompt(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Loved It?
              </h2>
              <p className="text-gray-600 mb-6">
                You&apos;ve used all 3 free scans. Create a free account to continue!
              </p>

              <div className="bg-gradient-to-r from-brand-50 to-emerald-50 rounded-2xl p-4 mb-6 text-left">
                <p className="font-medium text-brand-700 mb-2">Free account includes:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Unlimited food scanning
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    AI meal suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Smart grocery lists
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Family meal planning
                  </li>
                </ul>
              </div>

              <button
                onClick={() => router.push('/onboarding')}
                className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
              >
                Create Free Account
              </button>
              <button
                onClick={() => setShowSignupPrompt(false)}
                className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium mt-2"
              >
                Maybe Later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
