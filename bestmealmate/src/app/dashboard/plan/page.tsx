'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChefHat,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Clock,
  Flame,
  Users,
  Check,
  MoreVertical,
  Shuffle,
  Trash2,
  Edit,
  Copy,
  ShoppingCart,
  X,
  Save,
  Star,
  History
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import {
  saveGeneratedMeal,
  getSavedMeals,
  markMealCooked,
  rateMeal,
  deleteGeneratedMeal,
  updateAIMemory,
  type GeneratedMeal
} from '@/lib/supabase'

interface Meal {
  id?: string
  name: string
  time: string
  calories: number
  emoji: string
  servings: number
  description?: string
  ingredients?: Array<{ name: string; amount: string; notes?: string }>
  instructions?: string[]
  is_saved?: boolean
  is_cooked?: boolean
  rating?: number
}

interface DayPlan {
  date: Date
  dayName: string
  meals: {
    breakfast: Meal | null
    lunch: Meal | null
    dinner: Meal | null
  }
}

// Generate initial week plan
function generateInitialWeekPlan(): DayPlan[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const today = new Date()
  const dayOfWeek = today.getDay()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

  return days.map((dayName, index) => ({
    date: new Date(startOfWeek.getTime() + index * 86400000),
    dayName,
    meals: {
      breakfast: null,
      lunch: null,
      dinner: null,
    }
  }))
}

export default function MealPlanPage() {
  const { user, household } = useAuth()
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(generateInitialWeekPlan())
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [showMealMenu, setShowMealMenu] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAISuggestion, setShowAISuggestion] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<GeneratedMeal | null>(null)
  const [savedMeals, setSavedMeals] = useState<GeneratedMeal[]>([])
  const [showSavedMeals, setShowSavedMeals] = useState(false)
  const [savingMeal, setSavingMeal] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('dinner')
  const [ratingMealId, setRatingMealId] = useState<string | null>(null)
  const [selectedRating, setSelectedRating] = useState(0)

  // Load saved meals on mount
  useEffect(() => {
    if (household?.id) {
      loadSavedMeals()
    }
  }, [household?.id])

  const loadSavedMeals = async () => {
    if (!household?.id) return
    try {
      const meals = await getSavedMeals(household.id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSavedMeals((meals as any[]) || [])
    } catch (error) {
      console.error('Error loading saved meals:', error)
    }
  }

  const generateMealPlan = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a healthy ${selectedMealType} meal suggestion for my family. Include ingredients and simple instructions.`,
          action: 'generate_meal_plan'
        })
      })
      const data = await response.json()

      // Parse the AI response into a structured meal
      const suggestionText = data.suggestion || data.reply || data.message || ''

      const generatedMeal: GeneratedMeal = {
        household_id: household?.id || '',
        user_id: user?.id,
        name: extractMealName(suggestionText) || 'AI Suggested Meal',
        description: suggestionText,
        meal_type: selectedMealType,
        prep_time: extractTime(suggestionText, 'prep') || '15 min',
        cook_time: extractTime(suggestionText, 'cook') || '25 min',
        total_time: extractTime(suggestionText, 'total') || '40 min',
        servings: 4,
        ingredients: extractIngredients(suggestionText),
        instructions: extractInstructions(suggestionText),
        calories_per_serving: extractCalories(suggestionText) || 450,
        prompt_used: `Generate a healthy ${selectedMealType} meal`,
      }

      setAiSuggestion(generatedMeal)
      setShowAISuggestion(true)

      // Update AI memory with the request
      if (user?.id) {
        updateAIMemory(user.id, {
          last_meal_request: selectedMealType,
          last_suggestion_date: new Date().toISOString(),
        }).catch(console.error)
      }
    } catch (error) {
      console.error('Error generating meal:', error)
      // Fallback suggestion
      setAiSuggestion({
        household_id: household?.id || '',
        user_id: user?.id,
        name: 'Honey Garlic Chicken',
        description: 'Delicious honey garlic chicken with roasted vegetables - quick, healthy, and family-friendly!',
        meal_type: selectedMealType,
        prep_time: '10 min',
        cook_time: '25 min',
        total_time: '35 min',
        servings: 4,
        ingredients: [
          { name: 'Chicken breast', amount: '1.5 lbs' },
          { name: 'Honey', amount: '3 tbsp' },
          { name: 'Garlic', amount: '4 cloves, minced' },
          { name: 'Soy sauce', amount: '2 tbsp' },
          { name: 'Mixed vegetables', amount: '2 cups' },
        ],
        instructions: [
          'Preheat oven to 400°F',
          'Mix honey, garlic, and soy sauce',
          'Coat chicken with the mixture',
          'Roast with vegetables for 25 minutes',
        ],
        calories_per_serving: 380,
      })
      setShowAISuggestion(true)
    }
    setIsGenerating(false)
  }

  // Helper functions to extract meal info from AI response
  const extractMealName = (text: string): string => {
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.trim() && !line.includes(':') && line.length < 100) {
        return line.replace(/[#*]/g, '').trim()
      }
    }
    const match = text.match(/(?:try|make|suggest|recommend)[\s:]*([^.!?\n]+)/i)
    return match ? match[1].trim() : ''
  }

  const extractTime = (text: string, type: 'prep' | 'cook' | 'total'): string => {
    const patterns: Record<string, RegExp> = {
      prep: /prep(?:aration)?[\s:]*(\d+[\s-]*(?:min|minutes|hour|hours))/i,
      cook: /cook(?:ing)?[\s:]*(\d+[\s-]*(?:min|minutes|hour|hours))/i,
      total: /total[\s:]*(\d+[\s-]*(?:min|minutes|hour|hours))/i,
    }
    const match = text.match(patterns[type])
    return match ? match[1] : ''
  }

  const extractCalories = (text: string): number => {
    const match = text.match(/(\d{2,4})[\s]*(?:cal|kcal|calories)/i)
    return match ? parseInt(match[1]) : 0
  }

  const extractIngredients = (text: string): Array<{ name: string; amount: string }> => {
    const ingredients: Array<{ name: string; amount: string }> = []
    const lines = text.split('\n')
    let inIngredients = false

    for (const line of lines) {
      if (/ingredients?/i.test(line)) {
        inIngredients = true
        continue
      }
      if (/instructions?|directions?|steps?|method/i.test(line)) {
        inIngredients = false
        continue
      }
      if (inIngredients && line.trim()) {
        const cleanLine = line.replace(/^[-•*\d.)\s]+/, '').trim()
        if (cleanLine) {
          const amountMatch = cleanLine.match(/^([\d½¼¾⅓⅔]+[\s]*(?:cup|tbsp|tsp|oz|lb|g|kg|ml|l|piece|clove|head)?s?)/i)
          if (amountMatch) {
            ingredients.push({
              amount: amountMatch[1],
              name: cleanLine.replace(amountMatch[1], '').trim()
            })
          } else {
            ingredients.push({ name: cleanLine, amount: 'to taste' })
          }
        }
      }
    }
    return ingredients
  }

  const extractInstructions = (text: string): string[] => {
    const instructions: string[] = []
    const lines = text.split('\n')
    let inInstructions = false

    for (const line of lines) {
      if (/instructions?|directions?|steps?|method/i.test(line)) {
        inInstructions = true
        continue
      }
      if (inInstructions && line.trim()) {
        const cleanLine = line.replace(/^[-•*\d.)\s]+/, '').trim()
        if (cleanLine && cleanLine.length > 10) {
          instructions.push(cleanLine)
        }
      }
    }
    return instructions
  }

  const handleSaveMeal = async () => {
    if (!aiSuggestion || !household?.id) return
    setSavingMeal(true)
    try {
      const savedMeal = await saveGeneratedMeal(aiSuggestion)
      setSavedMeals(prev => [savedMeal, ...prev])

      // Add to the current day's plan
      const mealForPlan: Meal = {
        id: savedMeal.id,
        name: savedMeal.name,
        time: savedMeal.total_time || '30 min',
        calories: savedMeal.calories_per_serving || 400,
        emoji: getMealEmoji(selectedMealType),
        servings: savedMeal.servings || 4,
        description: savedMeal.description || undefined,
        ingredients: savedMeal.ingredients as Meal['ingredients'],
        instructions: savedMeal.instructions as string[],
        is_saved: true,
      }

      setWeeklyPlan(prev => {
        const updated = [...prev]
        updated[selectedDay] = {
          ...updated[selectedDay],
          meals: {
            ...updated[selectedDay].meals,
            [selectedMealType]: mealForPlan
          }
        }
        return updated
      })

      setShowAISuggestion(false)
      setAiSuggestion(null)
    } catch (error) {
      console.error('Error saving meal:', error)
    }
    setSavingMeal(false)
  }

  const getMealEmoji = (type: string): string => {
    const emojis: Record<string, string> = {
      breakfast: '🍳',
      lunch: '🥗',
      dinner: '🍽️',
      snack: '🍎',
    }
    return emojis[type] || '🍴'
  }

  const handleMarkAsCooked = async (mealId: string) => {
    try {
      await markMealCooked(mealId)
      setWeeklyPlan(prev => {
        return prev.map(day => ({
          ...day,
          meals: {
            breakfast: day.meals.breakfast?.id === mealId ? { ...day.meals.breakfast, is_cooked: true } : day.meals.breakfast,
            lunch: day.meals.lunch?.id === mealId ? { ...day.meals.lunch, is_cooked: true } : day.meals.lunch,
            dinner: day.meals.dinner?.id === mealId ? { ...day.meals.dinner, is_cooked: true } : day.meals.dinner,
          }
        }))
      })
      setShowMealMenu(null)
    } catch (error) {
      console.error('Error marking meal as cooked:', error)
    }
  }

  const handleRateMeal = async (mealId: string) => {
    if (selectedRating === 0) return
    try {
      await rateMeal(mealId, selectedRating)
      setRatingMealId(null)
      setSelectedRating(0)
    } catch (error) {
      console.error('Error rating meal:', error)
    }
  }

  const handleDeleteMeal = async (mealId: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    try {
      await deleteGeneratedMeal(mealId)
      setWeeklyPlan(prev => {
        const updated = [...prev]
        updated[selectedDay] = {
          ...updated[selectedDay],
          meals: {
            ...updated[selectedDay].meals,
            [mealType]: null
          }
        }
        return updated
      })
      setShowMealMenu(null)
    } catch (error) {
      console.error('Error deleting meal:', error)
    }
  }

  const addSavedMealToPlan = (meal: GeneratedMeal) => {
    const mealForPlan: Meal = {
      id: meal.id,
      name: meal.name,
      time: meal.total_time || '30 min',
      calories: meal.calories_per_serving || 400,
      emoji: getMealEmoji(meal.meal_type || 'dinner'),
      servings: meal.servings || 4,
      description: meal.description || undefined,
      is_saved: true,
    }

    setWeeklyPlan(prev => {
      const updated = [...prev]
      updated[selectedDay] = {
        ...updated[selectedDay],
        meals: {
          ...updated[selectedDay].meals,
          [selectedMealType]: mealForPlan
        }
      }
      return updated
    })
    setShowSavedMeals(false)
  }

  const addToGroceryList = () => {
    window.location.href = '/dashboard/groceries'
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getWeekRange = () => {
    const start = new Date(currentWeekStart)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeekStart(newDate)
  }

  const totalCaloriesForDay = (dayIndex: number) => {
    const day = weeklyPlan[dayIndex]
    return Object.values(day.meals).reduce((sum, meal) => sum + (meal?.calories || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meal Plan</h1>
                <p className="text-gray-500">{getWeekRange()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSavedMeals(true)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                title="Saved Meals"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={addToGroceryList}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={generateMealPlan}
                disabled={isGenerating}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-medium hover:shadow-glow transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isGenerating ? 'Generating...' : 'AI Suggestions'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        {/* Week Navigator */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            <span className="font-semibold text-gray-900">{getWeekRange()}</span>
          </div>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Day Selector (Mobile) */}
        <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden">
          {weeklyPlan.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
                selectedDay === index
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-300'
              }`}
            >
              <p className="text-xs opacity-80">{day.dayName.slice(0, 3)}</p>
              <p className="font-bold">{day.date.getDate()}</p>
            </button>
          ))}
        </div>

        {/* Weekly View (Desktop) */}
        <div className="hidden lg:grid lg:grid-cols-7 gap-4 mb-8">
          {weeklyPlan.map((day, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                index === selectedDay ? 'border-brand-300 ring-2 ring-brand-100' : 'border-gray-100 hover:border-brand-200'
              }`}
              onClick={() => setSelectedDay(index)}
            >
              <div className="text-center mb-3">
                <p className="text-xs text-gray-500 uppercase">{day.dayName.slice(0, 3)}</p>
                <p className={`text-2xl font-bold ${index === selectedDay ? 'text-brand-600' : 'text-gray-900'}`}>
                  {day.date.getDate()}
                </p>
              </div>
              <div className="space-y-2">
                {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                  const meal = day.meals[mealType]
                  return meal ? (
                    <div
                      key={mealType}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${meal.is_cooked ? 'bg-green-50' : 'bg-gray-50'}`}
                    >
                      <span className="text-lg">{meal.emoji}</span>
                      <span className="truncate text-gray-700">{meal.name}</span>
                      {meal.is_cooked && <Check className="w-3 h-3 text-green-500 flex-shrink-0" />}
                    </div>
                  ) : (
                    <button
                      key={mealType}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedDay(index)
                        setSelectedMealType(mealType)
                        setShowSavedMeals(true)
                      }}
                      className="w-full p-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm hover:border-brand-300 hover:text-brand-600 transition-colors"
                    >
                      + Add {mealType}
                    </button>
                  )
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  <Flame className="w-3 h-3 inline mr-1" />
                  {totalCaloriesForDay(index)} cal
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Day Detail */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {weeklyPlan[selectedDay].dayName}
              </h2>
              <p className="text-gray-500">
                {formatDate(weeklyPlan[selectedDay].date)} • {totalCaloriesForDay(selectedDay)} calories
              </p>
            </div>
            <button
              onClick={() => generateMealPlan()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle All
            </button>
          </div>

          <div className="space-y-4">
            {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
              const meal = weeklyPlan[selectedDay].meals[mealType]
              const mealLabels = {
                breakfast: { label: 'Breakfast', time: '7:00 AM', color: 'from-amber-500 to-orange-500' },
                lunch: { label: 'Lunch', time: '12:00 PM', color: 'from-green-500 to-emerald-500' },
                dinner: { label: 'Dinner', time: '6:00 PM', color: 'from-purple-500 to-pink-500' },
              }
              const mealInfo = mealLabels[mealType]

              return (
                <div
                  key={mealType}
                  className={`relative p-4 rounded-2xl border transition-all ${meal?.is_cooked ? 'border-green-200 bg-green-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mealInfo.color} flex items-center justify-center text-white shadow-lg`}>
                      {meal ? (
                        <span className="text-2xl">{meal.emoji}</span>
                      ) : (
                        <Plus className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400 uppercase">{mealInfo.label}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{mealInfo.time}</span>
                        {meal?.is_cooked && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Cooked</span>
                        )}
                        {meal?.is_saved && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Saved</span>
                        )}
                      </div>

                      {meal ? (
                        <>
                          <h3 className="font-semibold text-gray-900 text-lg">{meal.name}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {meal.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-4 h-4" />
                              {meal.calories} cal
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {meal.servings} servings
                            </span>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedMealType(mealType)
                            setShowSavedMeals(true)
                          }}
                          className="text-gray-400 hover:text-brand-600 transition-colors"
                        >
                          Click to add a meal
                        </button>
                      )}
                    </div>

                    {meal && (
                      <div className="relative">
                        <button
                          onClick={() => setShowMealMenu(showMealMenu === `${selectedDay}-${mealType}` ? null : `${selectedDay}-${mealType}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>

                        {showMealMenu === `${selectedDay}-${mealType}` && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                              <Edit className="w-4 h-4" />
                              Edit Meal
                            </button>
                            <button
                              onClick={() => {
                                setSelectedMealType(mealType)
                                generateMealPlan()
                                setShowMealMenu(null)
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Shuffle className="w-4 h-4" />
                              Swap Meal
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                              <Copy className="w-4 h-4" />
                              Copy to Another Day
                            </button>
                            {meal.id && !meal.is_cooked && (
                              <button
                                onClick={() => handleMarkAsCooked(meal.id!)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                                Mark as Cooked
                              </button>
                            )}
                            {meal.id && (
                              <button
                                onClick={() => setRatingMealId(meal.id!)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Star className="w-4 h-4" />
                                Rate Meal
                              </button>
                            )}
                            <hr className="my-2 border-gray-100" />
                            <button
                              onClick={() => meal.id ? handleDeleteMeal(meal.id, mealType) : null}
                              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={addToGroceryList}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:shadow-glow transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Grocery List
            </button>
            <button
              onClick={() => {
                setSelectedMealType('dinner')
                generateMealPlan()
              }}
              disabled={isGenerating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isGenerating ? 'Generating...' : 'Get AI Suggestions'}
            </button>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="mt-6 bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl p-6 text-white">
          <h3 className="font-bold text-lg mb-4">Weekly Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">Total Meals</p>
              <p className="text-2xl font-bold">
                {weeklyPlan.reduce((sum, day) => sum + Object.values(day.meals).filter(Boolean).length, 0)}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">Avg. Daily Calories</p>
              <p className="text-2xl font-bold">
                {Math.round(weeklyPlan.reduce((sum, day) => sum + Object.values(day.meals).reduce((s, m) => s + (m?.calories || 0), 0), 0) / 7)}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">Saved Meals</p>
              <p className="text-2xl font-bold">{savedMeals.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">Cooked This Week</p>
              <p className="text-2xl font-bold">
                {weeklyPlan.reduce((sum, day) => sum + Object.values(day.meals).filter(m => m?.is_cooked).length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestion Modal */}
      {showAISuggestion && aiSuggestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI Meal Suggestion</h3>
                    <p className="text-sm text-white/80">Personalized for your family</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAISuggestion(false)
                    setAiSuggestion(null)
                  }}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{aiSuggestion.name}</h4>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {aiSuggestion.total_time}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {aiSuggestion.calories_per_serving} cal
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {aiSuggestion.servings} servings
                </span>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mb-5 border border-purple-100">
                <p className="text-gray-700 leading-relaxed">{aiSuggestion.description}</p>
              </div>

              {aiSuggestion.ingredients && aiSuggestion.ingredients.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Ingredients</h5>
                  <ul className="space-y-1">
                    {aiSuggestion.ingredients.map((ing, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        {ing.amount} {ing.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiSuggestion.instructions && aiSuggestion.instructions.length > 0 && (
                <div className="mb-5">
                  <h5 className="font-semibold text-gray-900 mb-2">Instructions</h5>
                  <ol className="space-y-2">
                    {aiSuggestion.instructions.map((step, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="font-medium text-purple-600">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSaveMeal}
                  disabled={savingMeal}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {savingMeal ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {savingMeal ? 'Saving...' : 'Save & Add to Plan'}
                </button>
                <button
                  onClick={() => {
                    setShowAISuggestion(false)
                    generateMealPlan()
                  }}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Shuffle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Meals Modal */}
      {showSavedMeals && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-900 p-6 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Saved Meals</h3>
                    <p className="text-sm text-white/80">Choose a meal to add</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSavedMeals(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Generate New */}
              <button
                onClick={() => {
                  setShowSavedMeals(false)
                  generateMealPlan()
                }}
                className="w-full mb-4 p-4 border-2 border-dashed border-purple-200 rounded-xl text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate New with AI
              </button>

              {savedMeals.length > 0 ? (
                <div className="space-y-3">
                  {savedMeals.map((meal) => (
                    <button
                      key={meal.id}
                      onClick={() => addSavedMealToPlan(meal)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMealEmoji(meal.meal_type || 'dinner')}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{meal.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{meal.total_time}</span>
                            <span>•</span>
                            <span>{meal.calories_per_serving} cal</span>
                            {meal.rating && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  {meal.rating}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Plus className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ChefHat className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No saved meals yet</p>
                  <p className="text-sm">Generate some meals with AI to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingMealId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rate this meal</h3>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= selectedRating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRatingMealId(null)
                  setSelectedRating(0)
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRateMeal(ratingMealId)}
                disabled={selectedRating === 0}
                className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-xl disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
