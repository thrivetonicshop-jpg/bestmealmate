'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Users,
  Check,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ShoppingCart,
  Star,
  Snowflake,
  Package,
  Timer,
  CheckCircle2,
  Circle,
  AlertCircle
} from 'lucide-react'
import type { MealOption, TodaysMeal } from './TodaysMeals'

interface CookingModeProps {
  meal: TodaysMeal
  onClose: () => void
  onComplete: (mealId: string, rating?: number, notes?: string, batchCooked?: boolean, frozenPortions?: number) => void
  onAddToGroceryList: (ingredients: Array<{ name: string; amount: string }>) => void
  pantryItems?: Array<{ name: string; quantity: number; unit: string }>
}

export default function CookingMode({
  meal,
  onClose,
  onComplete,
  onAddToGroceryList,
  pantryItems = []
}: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [timer, setTimer] = useState<number | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [batchCooked, setBatchCooked] = useState(false)
  const [frozenPortions, setFrozenPortions] = useState(0)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())

  const selectedMeal = meal.selectedMeal
  const instructions = selectedMeal?.instructions || []
  const ingredients = selectedMeal?.ingredients || []
  const totalSteps = instructions.length

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerRunning && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t === null || t <= 1) {
            setTimerRunning(false)
            if (soundEnabled) {
              // Play notification sound
              try {
                const audio = new Audio('/timer-done.mp3')
                audio.play().catch(() => {})
              } catch {}
            }
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerRunning, timer, soundEnabled])

  // Early return after all hooks are called
  if (!selectedMeal) return null

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Extract timer from step text (e.g., "cook for 5 minutes")
  const extractTimer = (step: string): number | null => {
    const match = step.match(/(\d+)\s*(min|minute|minutes|hour|hours)/i)
    if (match) {
      const value = parseInt(match[1])
      const unit = match[2].toLowerCase()
      if (unit.startsWith('hour')) {
        return value * 3600
      }
      return value * 60
    }
    return null
  }

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedSteps(newCompleted)
  }

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      // Auto-detect timer for next step
      const nextTimer = extractTimer(instructions[currentStep + 1])
      if (nextTimer) {
        setTimer(nextTimer)
        setTimerRunning(false)
      }
    } else {
      // All steps done
      setShowCompletionModal(true)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const startTimer = (seconds: number) => {
    setTimer(seconds)
    setTimerRunning(true)
  }

  const toggleIngredient = (name: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(name)) {
      newChecked.delete(name)
    } else {
      newChecked.add(name)
    }
    setCheckedIngredients(newChecked)
  }

  // Check if ingredient is in pantry
  const isInPantry = (ingredientName: string) => {
    return pantryItems.some(item =>
      item.name.toLowerCase().includes(ingredientName.toLowerCase()) ||
      ingredientName.toLowerCase().includes(item.name.toLowerCase())
    )
  }

  const missingIngredients = ingredients.filter(ing => !isInPantry(ing.name))

  const handleComplete = () => {
    onComplete(meal.id, rating, notes, batchCooked, frozenPortions)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="font-bold">{selectedMeal.name}</h1>
          <p className="text-sm text-gray-400">Step {currentStep + 1} of {totalSteps}</p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 lg:p-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Instructions Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Step Card */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xl">
                    {currentStep + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">Step {currentStep + 1}</h2>
                    {extractTimer(instructions[currentStep]) && (
                      <p className="text-sm text-gray-400">Timer available for this step</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleStep(currentStep)}
                    className={`p-2 rounded-lg transition-colors ${
                      completedSteps.has(currentStep)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    <Check className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-lg text-gray-200 leading-relaxed">
                  {instructions[currentStep]}
                </p>

                {/* Timer for current step */}
                {extractTimer(instructions[currentStep]) && (
                  <div className="mt-6 bg-gray-900 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Timer className="w-6 h-6 text-brand-400" />
                        <span className="text-3xl font-mono font-bold text-white">
                          {timer !== null ? formatTime(timer) : formatTime(extractTimer(instructions[currentStep])!)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!timerRunning ? (
                          <button
                            onClick={() => startTimer(timer ?? extractTimer(instructions[currentStep])!)}
                            className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors flex items-center gap-2"
                          >
                            <Play className="w-5 h-5" />
                            Start
                          </button>
                        ) : (
                          <button
                            onClick={() => setTimerRunning(false)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                          >
                            <Pause className="w-5 h-5" />
                            Pause
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setTimer(extractTimer(instructions[currentStep]))
                            setTimerRunning(false)
                          }}
                          className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPrevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <button
                  onClick={goToNextStep}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentStep === totalSteps - 1
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-brand-500 text-white hover:bg-brand-600'
                  }`}
                >
                  {currentStep === totalSteps - 1 ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Finish Cooking
                    </>
                  ) : (
                    <>
                      Next Step
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* All Steps Overview */}
              <div className="bg-gray-800 rounded-2xl p-4">
                <h3 className="font-semibold text-white mb-3">All Steps</h3>
                <div className="space-y-2">
                  {instructions.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                        index === currentStep
                          ? 'bg-brand-500/20 border border-brand-500'
                          : completedSteps.has(index)
                            ? 'bg-green-500/10 border border-green-500/30'
                            : 'bg-gray-700/50 hover:bg-gray-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedSteps.has(index)
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                            ? 'bg-brand-500 text-white'
                            : 'bg-gray-600 text-gray-400'
                      }`}>
                        {completedSteps.has(index) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <p className={`text-sm line-clamp-2 ${
                        completedSteps.has(index) ? 'text-green-400' : 'text-gray-300'
                      }`}>
                        {step}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Meal Info */}
              <div className="bg-gray-800 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selectedMeal.emoji}</span>
                  <div>
                    <h3 className="font-bold text-white">{selectedMeal.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {selectedMeal.totalTime}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-700 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Calories</p>
                    <p className="font-semibold text-white">{selectedMeal.calories}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Servings</p>
                    <p className="font-semibold text-white">{selectedMeal.servings}</p>
                  </div>
                </div>
              </div>

              {/* Ingredients Checklist */}
              <div className="bg-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Ingredients</h3>
                  <span className="text-xs text-gray-400">
                    {checkedIngredients.size}/{ingredients.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {ingredients.map((ing, index) => {
                    const inPantry = isInPantry(ing.name)
                    const isChecked = checkedIngredients.has(ing.name)

                    return (
                      <button
                        key={index}
                        onClick={() => toggleIngredient(ing.name)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                          isChecked ? 'bg-green-500/20' : 'bg-gray-700/50 hover:bg-gray-700'
                        }`}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className={`text-sm ${isChecked ? 'text-green-400 line-through' : 'text-gray-300'}`}>
                            {ing.amount} {ing.name}
                          </p>
                        </div>
                        {!inPantry && !isChecked && (
                          <span title="Not in pantry">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Add missing to grocery list */}
                {missingIngredients.length > 0 && (
                  <button
                    onClick={() => onAddToGroceryList(missingIngredients)}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add {missingIngredients.length} to Grocery List
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Great job!</h2>
              <p className="text-gray-600">You&apos;ve finished cooking {selectedMeal.name}</p>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">How was it?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star className={`w-8 h-8 ${
                      star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Cooking Options */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-5 h-5 text-brand-600" />
                <span className="font-medium text-gray-900">Batch Cooking</span>
              </div>

              <label className="flex items-center gap-3 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={batchCooked}
                  onChange={(e) => setBatchCooked(e.target.checked)}
                  className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                />
                <span className="text-gray-700">I made extra portions</span>
              </label>

              {batchCooked && (
                <div className="flex items-center gap-3 ml-8">
                  <Snowflake className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Frozen portions:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFrozenPortions(Math.max(0, frozenPortions - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{frozenPortions}</span>
                    <button
                      onClick={() => setFrozenPortions(frozenPortions + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any adjustments or tips for next time?"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Keep Cooking
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
