'use client'

import { useState } from 'react'
import {
  ChefHat,
  Clock,
  Users,
  Flame,
  Check,
  Play,
  Pause,
  ChevronRight,
  ChevronDown,
  Snowflake,
  Package,
  Calendar,
  Sparkles,
  Timer,
  ListChecks,
  CookingPot,
  Refrigerator,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight,
  Utensils
} from 'lucide-react'

export interface BatchMeal {
  id: string
  name: string
  emoji: string
  description: string
  prepTime: string
  cookTime: string
  totalTime: string
  servings: number
  portionsPerBatch: number
  shelfLife: {
    fridge: number // days
    freezer: number // months
  }
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: Array<{
    name: string
    amount: string
    prepNote?: string
  }>
  prepSteps: Array<{
    step: string
    time?: string
    tip?: string
  }>
  cookSteps: Array<{
    step: string
    time?: string
    tip?: string
  }>
  storageInstructions: string[]
  reheatingInstructions: string[]
  variations?: string[]
  tags: string[]
}

interface BatchMealPrepProps {
  meal: BatchMeal
  onClose: () => void
  onComplete: (portionsFridge: number, portionsFreezer: number) => void
  onAddToWeeklyPlan: (portions: number, dates: Date[]) => void
}

type PrepPhase = 'overview' | 'prep' | 'cook' | 'store' | 'complete'

export default function BatchMealPrep({
  meal,
  onClose,
  onComplete,
  onAddToWeeklyPlan
}: BatchMealPrepProps) {
  const [phase, setPhase] = useState<PrepPhase>('overview')
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [batchMultiplier, setBatchMultiplier] = useState(1)
  const [portionsFridge, setPortionsFridge] = useState(2)
  const [portionsFreezer, setPortionsFreezer] = useState(meal.portionsPerBatch - 2)
  const [timer, setTimer] = useState<number | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)

  const totalPortions = meal.portionsPerBatch * batchMultiplier

  // Timer effect
  useState(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerRunning && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t !== null && t > 0 ? t - 1 : 0)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleStep = (phase: string, index: number) => {
    const key = `${phase}-${index}`
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(key)) {
      newCompleted.delete(key)
    } else {
      newCompleted.add(key)
    }
    setCompletedSteps(newCompleted)
  }

  const scaleAmount = (amount: string): string => {
    if (batchMultiplier === 1) return amount
    const match = amount.match(/^([\d.\/]+)\s*(.*)$/)
    if (match) {
      let num = match[1]
      const unit = match[2]
      // Handle fractions
      if (num.includes('/')) {
        const [n, d] = num.split('/')
        num = String(parseFloat(n) / parseFloat(d))
      }
      const scaled = parseFloat(num) * batchMultiplier
      return `${scaled % 1 === 0 ? scaled : scaled.toFixed(1)} ${unit}`
    }
    return amount
  }

  const renderOverview = () => (
    <div className="p-6 space-y-6">
      {/* Hero */}
      <div className="text-center">
        <span className="text-6xl mb-4 block">{meal.emoji}</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{meal.name}</h2>
        <p className="text-gray-600">{meal.description}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
          <p className="text-xs text-gray-500">Total Time</p>
          <p className="font-semibold text-gray-900">{meal.totalTime}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <Package className="w-5 h-5 mx-auto mb-1 text-gray-600" />
          <p className="text-xs text-gray-500">Portions</p>
          <p className="font-semibold text-gray-900">{totalPortions}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <Refrigerator className="w-5 h-5 mx-auto mb-1 text-blue-600" />
          <p className="text-xs text-blue-600">Fridge</p>
          <p className="font-semibold text-blue-700">{meal.shelfLife.fridge} days</p>
        </div>
        <div className="bg-cyan-50 rounded-xl p-3 text-center">
          <Snowflake className="w-5 h-5 mx-auto mb-1 text-cyan-600" />
          <p className="text-xs text-cyan-600">Freezer</p>
          <p className="font-semibold text-cyan-700">{meal.shelfLife.freezer} mo</p>
        </div>
      </div>

      {/* Batch Size Selector */}
      <div className="bg-gradient-to-r from-brand-50 to-emerald-50 rounded-2xl p-4 border border-brand-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CookingPot className="w-5 h-5 text-brand-600" />
            <span className="font-semibold text-gray-900">Batch Size</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBatchMultiplier(Math.max(1, batchMultiplier - 1))}
              className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-brand-600">{batchMultiplier}x</span>
            <button
              onClick={() => setBatchMultiplier(batchMultiplier + 1)}
              className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Makes <strong>{totalPortions} portions</strong> •
          Enough for <strong>{Math.ceil(totalPortions / 4)} family dinners</strong>
        </p>
      </div>

      {/* What You'll Learn */}
      <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Meal Prep Guide Includes
        </h3>
        <div className="space-y-2">
          {[
            'Step-by-step prep instructions',
            'Time-saving batch cooking tips',
            'Proper portioning & storage',
            'Easy reheating instructions',
            'Flavor variations to try'
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-purple-800">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition per portion */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Calories', value: meal.calories, unit: '' },
          { label: 'Protein', value: meal.protein, unit: 'g' },
          { label: 'Carbs', value: meal.carbs, unit: 'g' },
          { label: 'Fat', value: meal.fat, unit: 'g' }
        ].map((n, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">{n.label}</p>
            <p className="font-bold text-gray-900">{n.value}{n.unit}</p>
          </div>
        ))}
      </div>

      {/* Start Button */}
      <button
        onClick={() => setPhase('prep')}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
      >
        <Play className="w-6 h-6" />
        Start Meal Prep
      </button>
    </div>
  )

  const renderPrepPhase = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Phase Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <ListChecks className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Prep Work</h2>
            <p className="text-gray-500">~{meal.prepTime} • Get everything ready</p>
          </div>
        </div>

        {/* Ingredients Checklist */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-gray-600" />
            Ingredients ({meal.ingredients.length})
          </h3>
          <div className="space-y-2">
            {meal.ingredients.map((ing, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg"
              >
                <button
                  onClick={() => toggleStep('ing', i)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    completedSteps.has(`ing-${i}`)
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {completedSteps.has(`ing-${i}`) && <Check className="w-4 h-4" />}
                </button>
                <div>
                  <p className={completedSteps.has(`ing-${i}`) ? 'line-through text-gray-400' : 'text-gray-900'}>
                    <strong>{scaleAmount(ing.amount)}</strong> {ing.name}
                  </p>
                  {ing.prepNote && (
                    <p className="text-xs text-gray-500 mt-0.5">{ing.prepNote}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prep Steps */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Prep Steps</h3>
          {meal.prepSteps.map((step, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl border p-4 ${
                completedSteps.has(`prep-${i}`) ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleStep('prep', i)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completedSteps.has(`prep-${i}`)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {completedSteps.has(`prep-${i}`) ? <Check className="w-5 h-5" /> : i + 1}
                </button>
                <div className="flex-1">
                  <p className="text-gray-900">{step.step}</p>
                  {step.time && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {step.time}
                    </p>
                  )}
                  {step.tip && (
                    <div className="mt-2 flex items-start gap-2 bg-amber-50 px-3 py-2 rounded-lg">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">{step.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={() => setPhase('cook')}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors"
        >
          Continue to Cooking
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  const renderCookPhase = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Phase Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cooking</h2>
            <p className="text-gray-500">~{meal.cookTime} • Let&apos;s cook!</p>
          </div>
        </div>

        {/* Timer (if active) */}
        {timer !== null && (
          <div className="bg-gray-900 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="w-6 h-6" />
                <span className="text-3xl font-mono font-bold">{formatTime(timer)}</span>
              </div>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  timerRunning ? 'bg-orange-500' : 'bg-brand-500'
                }`}
              >
                {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}

        {/* Cook Steps */}
        <div className="space-y-3">
          {meal.cookSteps.map((step, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl border p-4 ${
                completedSteps.has(`cook-${i}`) ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleStep('cook', i)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completedSteps.has(`cook-${i}`)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {completedSteps.has(`cook-${i}`) ? <Check className="w-5 h-5" /> : i + 1}
                </button>
                <div className="flex-1">
                  <p className="text-gray-900">{step.step}</p>
                  {step.time && (
                    <button
                      onClick={() => {
                        const mins = parseInt(step.time!.match(/\d+/)?.[0] || '0')
                        setTimer(mins * 60)
                        setTimerRunning(true)
                      }}
                      className="mt-2 flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
                    >
                      <Timer className="w-4 h-4" /> Start {step.time} timer
                    </button>
                  )}
                  {step.tip && (
                    <div className="mt-2 flex items-start gap-2 bg-amber-50 px-3 py-2 rounded-lg">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">{step.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={() => setPhase('store')}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors"
        >
          Continue to Storage
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  const renderStorePhase = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Phase Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Storage & Portioning</h2>
            <p className="text-gray-500">Divide into {totalPortions} portions</p>
          </div>
        </div>

        {/* Portion Divider */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4">How to divide your portions:</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Refrigerator className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Fridge</p>
                  <p className="text-xs text-gray-500">Use within {meal.shelfLife.fridge} days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPortionsFridge(Math.max(0, portionsFridge - 1))}
                  className="w-8 h-8 bg-white rounded-lg shadow-sm"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold">{portionsFridge}</span>
                <button
                  onClick={() => setPortionsFridge(Math.min(totalPortions, portionsFridge + 1))}
                  className="w-8 h-8 bg-white rounded-lg shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Snowflake className="w-6 h-6 text-cyan-600" />
                <div>
                  <p className="font-medium text-gray-900">Freezer</p>
                  <p className="text-xs text-gray-500">Good for {meal.shelfLife.freezer} months</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPortionsFreezer(Math.max(0, portionsFreezer - 1))}
                  className="w-8 h-8 bg-white rounded-lg shadow-sm"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold">{portionsFreezer}</span>
                <button
                  onClick={() => setPortionsFreezer(Math.min(totalPortions, portionsFreezer + 1))}
                  className="w-8 h-8 bg-white rounded-lg shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {portionsFridge + portionsFreezer !== totalPortions && (
            <div className="mt-3 flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                {totalPortions - portionsFridge - portionsFreezer} portions unassigned
              </span>
            </div>
          )}
        </div>

        {/* Storage Instructions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Storage Tips</h3>
          <div className="space-y-2">
            {meal.storageInstructions.map((instruction, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reheating Instructions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Reheating Instructions</h3>
          <div className="space-y-2">
            {meal.reheatingInstructions.map((instruction, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Variations */}
        {meal.variations && meal.variations.length > 0 && (
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Flavor Variations
            </h3>
            <ul className="space-y-1">
              {meal.variations.map((v, i) => (
                <li key={i} className="text-sm text-purple-800">• {v}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Complete Button */}
        <button
          onClick={() => {
            onComplete(portionsFridge, portionsFreezer)
            setPhase('complete')
          }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
        >
          <CheckCircle2 className="w-5 h-5" />
          Complete Meal Prep
        </button>
      </div>
    </div>
  )

  const renderComplete = () => (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Meal Prep Complete!</h2>
        <p className="text-gray-600 mb-6">
          You&apos;ve prepared {totalPortions} portions of {meal.name}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <Refrigerator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-2xl text-blue-700">{portionsFridge}</p>
            <p className="text-sm text-blue-600">in fridge</p>
          </div>
          <div className="bg-cyan-50 rounded-xl p-4">
            <Snowflake className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
            <p className="font-bold text-2xl text-cyan-700">{portionsFreezer}</p>
            <p className="text-sm text-cyan-600">in freezer</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <div className="flex items-center gap-2">
            {(['overview', 'prep', 'cook', 'store', 'complete'] as PrepPhase[]).map((p, i) => (
              <div
                key={p}
                className={`w-2 h-2 rounded-full ${
                  phase === p ? 'bg-brand-500' :
                  (['overview', 'prep', 'cook', 'store', 'complete'].indexOf(phase) > i) ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="w-12" />
        </div>
      </header>

      {/* Content */}
      {phase === 'overview' && renderOverview()}
      {phase === 'prep' && renderPrepPhase()}
      {phase === 'cook' && renderCookPhase()}
      {phase === 'store' && renderStorePhase()}
      {phase === 'complete' && renderComplete()}
    </div>
  )
}

// Sample batch meal data
export const sampleBatchMeals: BatchMeal[] = [
  {
    id: 'chicken-stir-fry',
    name: 'Asian Chicken Stir Fry',
    emoji: '🥡',
    description: 'Tender chicken with colorful vegetables in a savory sauce. Perfect for quick weeknight dinners.',
    prepTime: '20 min',
    cookTime: '15 min',
    totalTime: '35 min',
    servings: 4,
    portionsPerBatch: 8,
    shelfLife: { fridge: 4, freezer: 3 },
    calories: 380,
    protein: 35,
    carbs: 28,
    fat: 14,
    ingredients: [
      { name: 'chicken breast', amount: '2 lbs', prepNote: 'cut into 1-inch cubes' },
      { name: 'broccoli florets', amount: '4 cups' },
      { name: 'bell peppers', amount: '2 large', prepNote: 'sliced' },
      { name: 'snap peas', amount: '2 cups' },
      { name: 'garlic', amount: '4 cloves', prepNote: 'minced' },
      { name: 'ginger', amount: '2 tbsp', prepNote: 'freshly grated' },
      { name: 'soy sauce', amount: '1/2 cup' },
      { name: 'sesame oil', amount: '2 tbsp' },
      { name: 'cornstarch', amount: '2 tbsp' },
      { name: 'vegetable oil', amount: '3 tbsp' }
    ],
    prepSteps: [
      { step: 'Cut chicken into 1-inch cubes and pat dry with paper towels', tip: 'Dry chicken sears better' },
      { step: 'Slice all vegetables and keep them in separate groups', time: '10 min' },
      { step: 'Mix sauce: combine soy sauce, sesame oil, cornstarch, and 1/4 cup water' },
      { step: 'Mince garlic and grate ginger, set aside together' }
    ],
    cookSteps: [
      { step: 'Heat large wok or skillet over high heat with 2 tbsp oil', time: '2 min', tip: 'Wok should be smoking hot' },
      { step: 'Cook chicken in batches until golden, about 3-4 minutes per batch. Set aside.', time: '8 min' },
      { step: 'Add remaining oil, stir-fry garlic and ginger for 30 seconds' },
      { step: 'Add broccoli and peppers, stir-fry 3 minutes', time: '3 min' },
      { step: 'Add snap peas, cook 1 more minute', time: '1 min' },
      { step: 'Return chicken to wok, pour sauce over everything', tip: 'Stir constantly as sauce thickens' },
      { step: 'Toss until sauce coats everything evenly, about 1 minute' }
    ],
    storageInstructions: [
      'Let cool completely before storing (about 30 minutes)',
      'Divide into portion containers while still slightly warm',
      'For freezing: use freezer-safe containers, leave 1/2 inch headroom',
      'Label with date and contents',
      'Store rice separately to prevent sogginess'
    ],
    reheatingInstructions: [
      'From fridge: Microwave 2-3 minutes, stirring halfway',
      'From frozen: Thaw overnight in fridge, then reheat',
      'Or heat frozen directly in skillet over medium heat for 8-10 minutes',
      'Add splash of water if needed to loosen sauce'
    ],
    variations: [
      'Swap chicken for beef or shrimp',
      'Add pineapple chunks for sweet & sour version',
      'Make it spicy with chili flakes or sriracha',
      'Use coconut aminos instead of soy sauce for paleo'
    ],
    tags: ['asian', 'high-protein', 'freezer-friendly', 'kid-friendly']
  }
]
