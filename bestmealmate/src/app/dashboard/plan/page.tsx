'use client'

import { useState } from 'react'
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
  X
} from 'lucide-react'

// Mock data for weekly meal plan
const mockWeeklyPlan = [
  {
    date: new Date(),
    dayName: 'Monday',
    meals: {
      breakfast: { name: 'Avocado Toast', time: '10 min', calories: 320, emoji: '🥑', servings: 4 },
      lunch: { name: 'Caesar Salad', time: '15 min', calories: 380, emoji: '🥗', servings: 4 },
      dinner: { name: 'Sheet Pan Chicken & Veggies', time: '35 min', calories: 450, emoji: '🍗', servings: 4 },
    }
  },
  {
    date: new Date(Date.now() + 86400000),
    dayName: 'Tuesday',
    meals: {
      breakfast: { name: 'Greek Yogurt Parfait', time: '5 min', calories: 280, emoji: '🍨', servings: 4 },
      lunch: { name: 'Turkey Sandwich', time: '10 min', calories: 420, emoji: '🥪', servings: 4 },
      dinner: { name: 'Beef Tacos', time: '25 min', calories: 520, emoji: '🌮', servings: 4 },
    }
  },
  {
    date: new Date(Date.now() + 86400000 * 2),
    dayName: 'Wednesday',
    meals: {
      breakfast: { name: 'Smoothie Bowl', time: '10 min', calories: 340, emoji: '🫐', servings: 2 },
      lunch: { name: 'Chicken Wrap', time: '15 min', calories: 450, emoji: '🌯', servings: 4 },
      dinner: { name: 'Pasta Primavera', time: '30 min', calories: 380, emoji: '🍝', servings: 4 },
    }
  },
  {
    date: new Date(Date.now() + 86400000 * 3),
    dayName: 'Thursday',
    meals: {
      breakfast: { name: 'Oatmeal with Berries', time: '8 min', calories: 290, emoji: '🥣', servings: 4 },
      lunch: { name: 'Quinoa Bowl', time: '20 min', calories: 390, emoji: '🥙', servings: 4 },
      dinner: { name: 'Grilled Salmon', time: '25 min', calories: 420, emoji: '🐟', servings: 4 },
    }
  },
  {
    date: new Date(Date.now() + 86400000 * 4),
    dayName: 'Friday',
    meals: {
      breakfast: { name: 'Eggs Benedict', time: '20 min', calories: 480, emoji: '🍳', servings: 2 },
      lunch: { name: 'Sushi Bowl', time: '25 min', calories: 410, emoji: '🍣', servings: 4 },
      dinner: { name: 'Pizza Night', time: '45 min', calories: 680, emoji: '🍕', servings: 6 },
    }
  },
  {
    date: new Date(Date.now() + 86400000 * 5),
    dayName: 'Saturday',
    meals: {
      breakfast: { name: 'Pancakes', time: '20 min', calories: 450, emoji: '🥞', servings: 4 },
      lunch: { name: 'Grilled Cheese & Soup', time: '15 min', calories: 520, emoji: '🧀', servings: 4 },
      dinner: { name: 'BBQ Ribs', time: '120 min', calories: 720, emoji: '🍖', servings: 6 },
    }
  },
  {
    date: new Date(Date.now() + 86400000 * 6),
    dayName: 'Sunday',
    meals: {
      breakfast: { name: 'Brunch Spread', time: '30 min', calories: 580, emoji: '🍽️', servings: 6 },
      lunch: null,
      dinner: { name: 'Roast Chicken Dinner', time: '90 min', calories: 550, emoji: '🍗', servings: 6 },
    }
  },
]

export default function MealPlanPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [showMealMenu, setShowMealMenu] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAISuggestion, setShowAISuggestion] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')

  const generateMealPlan = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Generate a healthy meal suggestion for my family',
          action: 'generate_meal_plan'
        })
      })
      const data = await response.json()
      setAiSuggestion(data.suggestion || 'Try making Honey Garlic Chicken with roasted vegetables - quick, healthy, and family-friendly!')
      setShowAISuggestion(true)
    } catch {
      setAiSuggestion('How about Teriyaki Salmon with rice and steamed broccoli? Takes only 25 minutes and is packed with omega-3!')
      setShowAISuggestion(true)
    }
    setIsGenerating(false)
  }

  const addToGroceryList = () => {
    // Navigate to groceries with items
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
    const day = mockWeeklyPlan[dayIndex]
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
          {mockWeeklyPlan.map((day, index) => (
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
          {mockWeeklyPlan.map((day, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                index === 0 ? 'border-brand-300 ring-2 ring-brand-100' : 'border-gray-100 hover:border-brand-200'
              }`}
              onClick={() => setSelectedDay(index)}
            >
              <div className="text-center mb-3">
                <p className="text-xs text-gray-500 uppercase">{day.dayName.slice(0, 3)}</p>
                <p className={`text-2xl font-bold ${index === 0 ? 'text-brand-600' : 'text-gray-900'}`}>
                  {day.date.getDate()}
                </p>
              </div>
              <div className="space-y-2">
                {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                  const meal = day.meals[mealType]
                  return meal ? (
                    <div
                      key={mealType}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm"
                    >
                      <span className="text-lg">{meal.emoji}</span>
                      <span className="truncate text-gray-700">{meal.name}</span>
                    </div>
                  ) : (
                    <button
                      key={mealType}
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
                {mockWeeklyPlan[selectedDay].dayName}
              </h2>
              <p className="text-gray-500">
                {formatDate(mockWeeklyPlan[selectedDay].date)} • {totalCaloriesForDay(selectedDay)} calories
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors">
              <Shuffle className="w-4 h-4" />
              Shuffle All
            </button>
          </div>

          <div className="space-y-4">
            {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
              const meal = mockWeeklyPlan[selectedDay].meals[mealType]
              const mealLabels = {
                breakfast: { label: 'Breakfast', time: '7:00 AM', color: 'from-amber-500 to-orange-500' },
                lunch: { label: 'Lunch', time: '12:00 PM', color: 'from-green-500 to-emerald-500' },
                dinner: { label: 'Dinner', time: '6:00 PM', color: 'from-purple-500 to-pink-500' },
              }
              const mealInfo = mealLabels[mealType]

              return (
                <div
                  key={mealType}
                  className="relative p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all"
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
                        <button className="text-gray-400 hover:text-brand-600 transition-colors">
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
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                              <Shuffle className="w-4 h-4" />
                              Swap Meal
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                              <Copy className="w-4 h-4" />
                              Copy to Another Day
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                              <Check className="w-4 h-4" />
                              Mark as Cooked
                            </button>
                            <hr className="my-2 border-gray-100" />
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
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
              onClick={generateMealPlan}
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
              <p className="text-2xl font-bold">19</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">Avg. Daily Calories</p>
              <p className="text-2xl font-bold">1,850</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">Prep Time</p>
              <p className="text-2xl font-bold">8.5h</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">Grocery Items</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestion Modal */}
      {showAISuggestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
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
                  onClick={() => setShowAISuggestion(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mb-5 border border-purple-100">
                <p className="text-gray-700 leading-relaxed">{aiSuggestion}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowAISuggestion(false)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add to Plan
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
    </div>
  )
}
