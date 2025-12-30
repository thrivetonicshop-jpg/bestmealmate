'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
  AlertCircle,
  Thermometer,
  ChefHat,
  Minus,
  Plus,
  Info,
  Scale
} from 'lucide-react'
import type { MealOption, TodaysMeal } from './TodaysMeals'

interface CookingModeProps {
  meal: TodaysMeal
  onClose: () => void
  onComplete: (mealId: string, rating?: number, notes?: string, batchCooked?: boolean, frozenPortions?: number) => void
  onAddToGroceryList: (ingredients: Array<{ name: string; amount: string }>) => void
  pantryItems?: Array<{ name: string; quantity: number; unit: string }>
}

// Parse ingredient amount for scaling
function parseAmount(amount: string): { value: number; unit: string; original: string } {
  const match = amount.match(/^([\d.\/]+)\s*(.*)$/)
  if (match) {
    let value = 0
    const numStr = match[1]
    if (numStr.includes('/')) {
      const [num, denom] = numStr.split('/')
      value = parseFloat(num) / parseFloat(denom)
    } else {
      value = parseFloat(numStr)
    }
    return { value, unit: match[2], original: amount }
  }
  return { value: 1, unit: amount, original: amount }
}

// Format scaled amount
function formatScaledAmount(amount: string, multiplier: number): string {
  const parsed = parseAmount(amount)
  const scaled = parsed.value * multiplier

  // Format nicely
  if (scaled === Math.floor(scaled)) {
    return `${scaled} ${parsed.unit}`
  }
  // Handle fractions
  if (scaled === 0.5) return `1/2 ${parsed.unit}`
  if (scaled === 0.25) return `1/4 ${parsed.unit}`
  if (scaled === 0.75) return `3/4 ${parsed.unit}`
  if (scaled === 0.33 || scaled === 0.333) return `1/3 ${parsed.unit}`
  if (scaled === 0.67 || scaled === 0.666) return `2/3 ${parsed.unit}`

  return `${scaled.toFixed(1)} ${parsed.unit}`
}

export default function CookingMode({
  meal,
  onClose,
  onComplete,
  onAddToGroceryList,
  pantryItems = []
}: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(-1) // -1 = prep overview
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
  const [selectedIngredient, setSelectedIngredient] = useState<{ name: string; amount: string } | null>(null)
  const [servingMultiplier, setServingMultiplier] = useState(1)
  const [ovenPreheated, setOvenPreheated] = useState(false)
  const [phase, setPhase] = useState<'prep' | 'cook'>('prep')

  const selectedMeal = meal.selectedMeal
  const ingredients = useMemo(() => selectedMeal?.ingredients || [], [selectedMeal?.ingredients])

  // Generate detailed cooking steps with timers
  const generateDetailedSteps = useCallback(() => {
    if (!selectedMeal) return []

    const steps: Array<{
      id: string
      type: 'preheat' | 'prep' | 'cook' | 'rest'
      title: string
      description: string
      duration: number // seconds
      tip?: string
      ingredients?: string[]
    }> = []

    // Check if recipe needs oven
    const needsOven = selectedMeal.instructions?.some(i =>
      i.toLowerCase().includes('oven') ||
      i.toLowerCase().includes('bake') ||
      i.toLowerCase().includes('roast') ||
      i.toLowerCase().includes('broil')
    ) || false

    // Add preheat step if needed
    if (needsOven) {
      const tempMatch = selectedMeal.instructions?.find(i => i.match(/(\d{3})\s*[°]?[fF]/))
      const temp = tempMatch?.match(/(\d{3})/)?.[1] || '400'
      steps.push({
        id: 'preheat',
        type: 'preheat',
        title: 'Preheat Oven',
        description: `Set your oven to ${temp}°F. This typically takes 10-15 minutes.`,
        duration: 600, // 10 minutes
        tip: 'Start this first so your oven is ready when you need it'
      })
    }

    // Generate prep steps from ingredients
    const prepSteps: Array<{
      id: string
      type: 'prep'
      title: string
      description: string
      duration: number
      tip?: string
      ingredients?: string[]
    }> = []

    // Group ingredients by prep type
    const choppingIngredients = ingredients.filter(i =>
      ['onion', 'garlic', 'pepper', 'carrot', 'celery', 'tomato', 'potato', 'cucumber'].some(v =>
        i.name.toLowerCase().includes(v)
      )
    )
    const meatIngredients = ingredients.filter(i =>
      ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'turkey', 'lamb'].some(v =>
        i.name.toLowerCase().includes(v)
      )
    )
    const measureIngredients = ingredients.filter(i =>
      ['oil', 'sauce', 'vinegar', 'spice', 'salt', 'pepper', 'sugar', 'flour', 'butter'].some(v =>
        i.name.toLowerCase().includes(v)
      ) || i.amount.includes('tbsp') || i.amount.includes('tsp') || i.amount.includes('cup')
    )

    // Add prep steps
    if (choppingIngredients.length > 0) {
      prepSteps.push({
        id: 'chop',
        type: 'prep',
        title: 'Chop Vegetables',
        description: `Wash and chop: ${choppingIngredients.map(i => i.name).join(', ')}. Dice onions finely, mince garlic, and slice other vegetables as needed.`,
        duration: choppingIngredients.length * 120, // 2 min per ingredient
        tip: 'Keep a damp towel under your cutting board to prevent slipping',
        ingredients: choppingIngredients.map(i => i.name)
      })
    }

    if (meatIngredients.length > 0) {
      prepSteps.push({
        id: 'meat-prep',
        type: 'prep',
        title: 'Prepare Protein',
        description: `Pat dry and season ${meatIngredients.map(i => i.name).join(', ')}. Cut into appropriate sizes if needed. Season with salt and pepper.`,
        duration: meatIngredients.length * 180, // 3 min per protein
        tip: 'Bringing meat to room temperature helps it cook more evenly',
        ingredients: meatIngredients.map(i => i.name)
      })
    }

    if (measureIngredients.length > 0) {
      prepSteps.push({
        id: 'measure',
        type: 'prep',
        title: 'Measure Seasonings & Liquids',
        description: `Measure out: ${measureIngredients.map(i => `${i.amount} ${i.name}`).join(', ')}. Having everything ready makes cooking smoother.`,
        duration: measureIngredients.length * 30, // 30 sec per ingredient
        tip: 'This is called "mise en place" - everything in its place',
        ingredients: measureIngredients.map(i => i.name)
      })
    }

    steps.push(...prepSteps)

    // Generate cooking steps from instructions
    const cookingSteps = (selectedMeal.instructions || []).map((instruction, index) => {
      // Extract time from instruction
      let duration = 180 // default 3 minutes
      const timeMatch = instruction.match(/(\d+)(?:-(\d+))?\s*(min|minute|minutes|hour|hours|seconds|sec)/i)
      if (timeMatch) {
        const time1 = parseInt(timeMatch[1])
        const time2 = timeMatch[2] ? parseInt(timeMatch[2]) : time1
        const avgTime = (time1 + time2) / 2
        const unit = timeMatch[3].toLowerCase()
        if (unit.startsWith('hour')) {
          duration = avgTime * 3600
        } else if (unit.startsWith('sec')) {
          duration = avgTime
        } else {
          duration = avgTime * 60
        }
      }

      // Generate tips based on instruction content
      let tip: string | undefined
      if (instruction.toLowerCase().includes('heat') && instruction.toLowerCase().includes('oil')) {
        tip = 'Oil should shimmer when hot enough - test with a small piece of food'
      } else if (instruction.toLowerCase().includes('brown')) {
        tip = 'Don\'t move food too much - let it develop color before flipping'
      } else if (instruction.toLowerCase().includes('simmer')) {
        tip = 'Keep at a gentle bubble - vigorous boiling can toughen meat'
      } else if (instruction.toLowerCase().includes('rest')) {
        tip = 'Resting allows juices to redistribute for better flavor'
      }

      return {
        id: `cook-${index}`,
        type: 'cook' as const,
        title: `Step ${index + 1}`,
        description: instruction,
        duration,
        tip
      }
    })

    steps.push(...cookingSteps)

    // Add resting step if meat involved
    if (meatIngredients.length > 0 && !steps.some(s => s.description.toLowerCase().includes('rest'))) {
      steps.push({
        id: 'rest',
        type: 'rest',
        title: 'Rest Before Serving',
        description: 'Let the meat rest for 5 minutes before cutting. This keeps it juicy.',
        duration: 300, // 5 minutes
        tip: 'Cover loosely with foil to keep warm while resting'
      })
    }

    return steps
  }, [selectedMeal, ingredients])

  const steps = generateDetailedSteps()
  const totalSteps = steps.length
  const prepSteps = steps.filter(s => s.type === 'prep' || s.type === 'preheat')
  const cookSteps = steps.filter(s => s.type === 'cook' || s.type === 'rest')

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerRunning && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t === null || t <= 1) {
            setTimerRunning(false)
            if (soundEnabled) {
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

  if (!selectedMeal) return null

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      // Set timer for next step
      if (steps[nextStep]) {
        setTimer(steps[nextStep].duration)
        setTimerRunning(false)
      }
      // Switch to cook phase when appropriate
      if (steps[nextStep]?.type === 'cook' || steps[nextStep]?.type === 'rest') {
        setPhase('cook')
      }
    } else {
      setShowCompletionModal(true)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1)
      if (currentStep === 0) {
        setPhase('prep')
      }
    }
  }

  const startTimer = (seconds: number) => {
    setTimer(seconds)
    setTimerRunning(true)
  }

  const toggleIngredient = (ing: { name: string; amount: string }) => {
    if (selectedIngredient?.name === ing.name) {
      setSelectedIngredient(null)
    } else {
      setSelectedIngredient(ing)
    }
  }

  const checkIngredient = (name: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(name)) {
      newChecked.delete(name)
    } else {
      newChecked.add(name)
    }
    setCheckedIngredients(newChecked)
  }

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

  const currentStepData = currentStep >= 0 ? steps[currentStep] : null
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="font-bold">{selectedMeal.name}</h1>
          <p className="text-sm text-gray-400">
            {currentStep === -1 ? 'Getting Ready' : `Step ${currentStep + 1} of ${totalSteps}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      {/* Phase Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <button
            onClick={() => {
              setPhase('prep')
              const firstPrepIndex = steps.findIndex(s => s.type === 'prep' || s.type === 'preheat')
              if (firstPrepIndex >= 0) setCurrentStep(firstPrepIndex)
              else setCurrentStep(-1)
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              phase === 'prep'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Prep ({prepSteps.length})</span>
          </button>
          <button
            onClick={() => {
              setPhase('cook')
              const firstCookIndex = steps.findIndex(s => s.type === 'cook')
              if (firstCookIndex >= 0) setCurrentStep(firstCookIndex)
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              phase === 'cook'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Cook ({cookSteps.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Instructions Panel */}
            <div className="lg:col-span-2 space-y-4">
              {/* Prep Overview (Step -1) */}
              {currentStep === -1 && (
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <ChefHat className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Let&apos;s Get Started!</h2>
                      <p className="text-white/80">Gather your ingredients and tools</p>
                    </div>
                  </div>

                  {/* Serving Size Adjuster */}
                  <div className="bg-white/10 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Servings</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
                          className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xl font-bold w-16 text-center">
                          {Math.round(selectedMeal.servings * servingMultiplier)}
                        </span>
                        <button
                          onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
                          className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {servingMultiplier !== 1 && (
                      <p className="text-sm text-white/70 mt-2">
                        Original recipe: {selectedMeal.servings} servings •
                        Ingredients adjusted {servingMultiplier > 1 ? 'up' : 'down'}
                      </p>
                    )}
                  </div>

                  {/* Time Estimate */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <Clock className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-xs text-white/70">Prep</p>
                      <p className="font-bold">{selectedMeal.prepTime}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <Flame className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-xs text-white/70">Cook</p>
                      <p className="font-bold">{selectedMeal.cookTime}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <Timer className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-xs text-white/70">Total</p>
                      <p className="font-bold">{selectedMeal.totalTime}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentStep(0)
                      if (steps[0]) setTimer(steps[0].duration)
                    }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-amber-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
                  >
                    <Play className="w-6 h-6" />
                    Start Cooking
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Current Step Card */}
              {currentStepData && (
                <div className={`rounded-2xl p-6 ${
                  currentStepData.type === 'preheat' ? 'bg-red-900' :
                  currentStepData.type === 'prep' ? 'bg-amber-900' :
                  currentStepData.type === 'rest' ? 'bg-blue-900' :
                  'bg-gray-800'
                }`}>
                  {/* Step Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      currentStepData.type === 'preheat' ? 'bg-red-500' :
                      currentStepData.type === 'prep' ? 'bg-amber-500' :
                      currentStepData.type === 'rest' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}>
                      {currentStepData.type === 'preheat' ? (
                        <Thermometer className="w-7 h-7 text-white" />
                      ) : currentStepData.type === 'prep' ? (
                        <ChefHat className="w-7 h-7 text-white" />
                      ) : currentStepData.type === 'rest' ? (
                        <Clock className="w-7 h-7 text-white" />
                      ) : (
                        <Flame className="w-7 h-7 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          currentStepData.type === 'preheat' ? 'bg-red-500/30 text-red-300' :
                          currentStepData.type === 'prep' ? 'bg-amber-500/30 text-amber-300' :
                          currentStepData.type === 'rest' ? 'bg-blue-500/30 text-blue-300' :
                          'bg-orange-500/30 text-orange-300'
                        }`}>
                          {currentStepData.type.toUpperCase()}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white mt-1">{currentStepData.title}</h2>
                    </div>
                    <button
                      onClick={() => toggleStep(currentStep)}
                      className={`p-3 rounded-xl transition-colors ${
                        completedSteps.has(currentStep)
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      <Check className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Step Description */}
                  <p className="text-lg text-white/90 leading-relaxed mb-4">
                    {currentStepData.description}
                  </p>

                  {/* Ingredients for this step */}
                  {currentStepData.ingredients && currentStepData.ingredients.length > 0 && (
                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                      <p className="text-sm text-white/60 mb-2">Ingredients for this step:</p>
                      <div className="flex flex-wrap gap-2">
                        {currentStepData.ingredients.map(ingName => {
                          const ing = ingredients.find(i => i.name === ingName)
                          if (!ing) return null
                          return (
                            <button
                              key={ingName}
                              onClick={() => toggleIngredient(ing)}
                              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedIngredient?.name === ingName
                                  ? 'bg-white text-gray-900'
                                  : checkedIngredients.has(ingName)
                                    ? 'bg-green-500/30 text-green-300 line-through'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                              }`}
                            >
                              {formatScaledAmount(ing.amount, servingMultiplier)} {ing.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tip */}
                  {currentStepData.tip && (
                    <div className="flex items-start gap-3 bg-white/10 rounded-xl p-4 mb-4">
                      <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-white/80">
                        <span className="font-medium text-yellow-400">Tip:</span> {currentStepData.tip}
                      </p>
                    </div>
                  )}

                  {/* Timer */}
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Timer className="w-6 h-6 text-white/60" />
                        <span className="text-4xl font-mono font-bold text-white">
                          {timer !== null ? formatTime(timer) : formatTime(currentStepData.duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!timerRunning ? (
                          <button
                            onClick={() => startTimer(timer ?? currentStepData.duration)}
                            className="px-5 py-2.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                          >
                            <Play className="w-5 h-5" />
                            Start Timer
                          </button>
                        ) : (
                          <button
                            onClick={() => setTimerRunning(false)}
                            className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
                          >
                            <Pause className="w-5 h-5" />
                            Pause
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setTimer(currentStepData.duration)
                            setTimerRunning(false)
                          }}
                          className="p-2.5 bg-white/10 text-white/60 rounded-xl hover:bg-white/20 transition-colors"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step Navigation */}
              {currentStep >= 0 && (
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={goToPrevStep}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-800 text-gray-400 rounded-xl font-medium hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                  <button
                    onClick={goToNextStep}
                    className={`flex-1 max-w-xs flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
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
              )}

              {/* All Steps Overview */}
              {currentStep >= 0 && (
                <div className="bg-gray-800 rounded-2xl p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    All Steps
                    <span className="text-xs text-gray-400 font-normal">
                      ({completedSteps.size}/{totalSteps} completed)
                    </span>
                  </h3>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {steps.map((step, index) => (
                      <button
                        key={step.id}
                        onClick={() => {
                          setCurrentStep(index)
                          setTimer(step.duration)
                          setTimerRunning(false)
                          if (step.type === 'cook' || step.type === 'rest') {
                            setPhase('cook')
                          } else {
                            setPhase('prep')
                          }
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                          index === currentStep
                            ? 'bg-brand-500/20 border border-brand-500'
                            : completedSteps.has(index)
                              ? 'bg-green-500/10 border border-green-500/30'
                              : 'bg-gray-700/50 hover:bg-gray-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          completedSteps.has(index)
                            ? 'bg-green-500 text-white'
                            : index === currentStep
                              ? 'bg-brand-500 text-white'
                              : step.type === 'preheat'
                                ? 'bg-red-500/30 text-red-400'
                                : step.type === 'prep'
                                  ? 'bg-amber-500/30 text-amber-400'
                                  : step.type === 'rest'
                                    ? 'bg-blue-500/30 text-blue-400'
                                    : 'bg-orange-500/30 text-orange-400'
                        }`}>
                          {completedSteps.has(index) ? (
                            <Check className="w-4 h-4" />
                          ) : step.type === 'preheat' ? (
                            <Thermometer className="w-4 h-4" />
                          ) : step.type === 'prep' ? (
                            <ChefHat className="w-4 h-4" />
                          ) : step.type === 'rest' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <Flame className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            completedSteps.has(index) ? 'text-green-400' : 'text-gray-200'
                          }`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-500">{formatTime(step.duration)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Ingredient Detail Popup */}
              {selectedIngredient && (
                <div className="bg-white rounded-2xl p-4 animate-scale-in">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">Ingredient Detail</h4>
                    <button
                      onClick={() => setSelectedIngredient(null)}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="text-center py-4">
                    <Scale className="w-8 h-8 text-brand-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {formatScaledAmount(selectedIngredient.amount, servingMultiplier)}
                    </p>
                    <p className="text-gray-600">{selectedIngredient.name}</p>
                    {servingMultiplier !== 1 && (
                      <p className="text-xs text-gray-400 mt-2">
                        Original: {selectedIngredient.amount}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      checkIngredient(selectedIngredient.name)
                      setSelectedIngredient(null)
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      checkedIngredients.has(selectedIngredient.name)
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {checkedIngredients.has(selectedIngredient.name) ? 'Uncheck' : 'Mark as Ready'}
                  </button>
                </div>
              )}

              {/* Ingredients Checklist */}
              <div className="bg-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Ingredients</h3>
                  <span className="text-xs text-gray-400">
                    Tap for portion
                  </span>
                </div>
                <div className="space-y-1.5 max-h-80 overflow-y-auto">
                  {ingredients.map((ing, index) => {
                    const inPantry = isInPantry(ing.name)
                    const isChecked = checkedIngredients.has(ing.name)
                    const isSelected = selectedIngredient?.name === ing.name

                    return (
                      <button
                        key={index}
                        onClick={() => toggleIngredient(ing)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-brand-500 text-white ring-2 ring-brand-300'
                            : isChecked
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            checkIngredient(ing.name)
                          }}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-600 hover:bg-gray-500'
                          }`}
                        >
                          {isChecked && <Check className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isChecked ? 'line-through opacity-70' : ''}`}>
                            <span className="font-medium">
                              {formatScaledAmount(ing.amount, servingMultiplier)}
                            </span>{' '}
                            {ing.name}
                          </p>
                        </div>
                        {!inPantry && !isChecked && (
                          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {missingIngredients.length > 0 && (
                  <button
                    onClick={() => onAddToGroceryList(missingIngredients)}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add {missingIngredients.length} Missing to List
                  </button>
                )}
              </div>

              {/* Nutrition */}
              <div className="bg-gray-800 rounded-2xl p-4">
                <h3 className="font-semibold text-white mb-3">Per Serving</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Calories</p>
                    <p className="font-bold text-white">{selectedMeal.calories}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Protein</p>
                    <p className="font-bold text-white">{selectedMeal.protein}g</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Carbs</p>
                    <p className="font-bold text-white">{selectedMeal.carbs}g</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Fat</p>
                    <p className="font-bold text-white">{selectedMeal.fat}g</p>
                  </div>
                </div>
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

            {/* Batch Cooking */}
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
                      className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{frozenPortions}</span>
                    <button
                      onClick={() => setFrozenPortions(frozenPortions + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any tips for next time?"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 resize-none"
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Keep Cooking
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600"
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
