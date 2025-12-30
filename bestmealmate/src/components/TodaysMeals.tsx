'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Clock,
  Flame,
  Users,
  ChevronRight,
  Check,
  Sparkles,
  Target,
  ChefHat,
  RefreshCw,
  Play,
  Star,
  Utensils
} from 'lucide-react'

export interface MealOption {
  id: string
  name: string
  description: string
  emoji: string
  prepTime: string
  cookTime: string
  totalTime: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servings: number
  ingredients: Array<{ name: string; amount: string; notes?: string }>
  instructions: string[]
  tags: string[]
  rating?: number
  matchScore?: number // How well it matches user goals
}

export interface TodaysMeal {
  id: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  scheduledTime: string
  status: 'upcoming' | 'ready' | 'cooking' | 'completed' | 'skipped'
  selectedMeal: MealOption | null
  alternatives: MealOption[]
  portionMultiplier: number // Based on user goals
  attendees: Array<{ id: string; name: string; avatar: string }>
}

export interface UserGoals {
  dailyCalories: number
  dailyProtein: number
  dailyCarbs: number
  dailyFat: number
}

interface TodaysMealsProps {
  meals: TodaysMeal[]
  userGoals: UserGoals
  onStartCooking: (meal: TodaysMeal) => void
  onMarkComplete: (mealId: string) => void
  onSwapMeal: (mealId: string, newMeal: MealOption) => void
  onRegenerateMeals: () => void
  isLoading?: boolean
}

export default function TodaysMeals({
  meals,
  userGoals,
  onStartCooking,
  onMarkComplete,
  onSwapMeal,
  onRegenerateMeals,
  isLoading = false
}: TodaysMealsProps) {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)
  const [showAlternatives, setShowAlternatives] = useState<string | null>(null)

  // Calculate daily progress
  const completedMeals = meals.filter(m => m.status === 'completed')
  const totalConsumed = completedMeals.reduce((acc, meal) => {
    if (!meal.selectedMeal) return acc
    const multiplier = meal.portionMultiplier
    return {
      calories: acc.calories + (meal.selectedMeal.calories * multiplier),
      protein: acc.protein + (meal.selectedMeal.protein * multiplier),
      carbs: acc.carbs + (meal.selectedMeal.carbs * multiplier),
      fat: acc.fat + (meal.selectedMeal.fat * multiplier)
    }
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

  // Calculate remaining for the day
  const remaining = {
    calories: userGoals.dailyCalories - totalConsumed.calories,
    protein: userGoals.dailyProtein - totalConsumed.protein,
    carbs: userGoals.dailyCarbs - totalConsumed.carbs,
    fat: userGoals.dailyFat - totalConsumed.fat
  }

  // Get meal type info
  const getMealTypeInfo = (type: string) => {
    const info: Record<string, { label: string; time: string; gradient: string; emoji: string }> = {
      breakfast: { label: 'Breakfast', time: '7:00 AM', gradient: 'from-amber-500 to-orange-500', emoji: '🌅' },
      lunch: { label: 'Lunch', time: '12:00 PM', gradient: 'from-green-500 to-emerald-500', emoji: '☀️' },
      dinner: { label: 'Dinner', time: '6:00 PM', gradient: 'from-purple-500 to-pink-500', emoji: '🌙' },
      snack: { label: 'Snack', time: '3:00 PM', gradient: 'from-blue-500 to-cyan-500', emoji: '🍎' }
    }
    return info[type] || info.dinner
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      upcoming: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Upcoming' },
      ready: { bg: 'bg-brand-100', text: 'text-brand-700', label: 'Ready to Cook' },
      cooking: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Cooking Now' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      skipped: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Skipped' }
    }
    return badges[status] || badges.upcoming
  }

  // Get next upcoming meal
  const nextMeal = meals.find(m => m.status === 'ready' || m.status === 'upcoming')

  return (
    <div className="space-y-6">
      {/* Daily Progress Card */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-600 to-emerald-500 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Today&apos;s Progress</h3>
              <p className="text-white/70 text-sm">{completedMeals.length} of {meals.length} meals completed</p>
            </div>
          </div>
          <button
            onClick={onRegenerateMeals}
            disabled={isLoading}
            className="p-2.5 bg-white/20 rounded-xl hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Macro Progress Bars */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Calories', current: totalConsumed.calories, goal: userGoals.dailyCalories, unit: 'kcal', color: 'bg-amber-400' },
            { label: 'Protein', current: totalConsumed.protein, goal: userGoals.dailyProtein, unit: 'g', color: 'bg-red-400' },
            { label: 'Carbs', current: totalConsumed.carbs, goal: userGoals.dailyCarbs, unit: 'g', color: 'bg-blue-400' },
            { label: 'Fat', current: totalConsumed.fat, goal: userGoals.dailyFat, unit: 'g', color: 'bg-purple-400' }
          ].map((macro, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-xs text-white/70 mb-1">{macro.label}</p>
              <p className="font-bold text-lg">{Math.round(macro.current)}<span className="text-xs font-normal">/{macro.goal}{macro.unit}</span></p>
              <div className="h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${macro.color} rounded-full transition-all`}
                  style={{ width: `${Math.min((macro.current / macro.goal) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Meal Hero */}
      {nextMeal && nextMeal.selectedMeal && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={`bg-gradient-to-r ${getMealTypeInfo(nextMeal.mealType).gradient} p-6 text-white`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
                  {nextMeal.selectedMeal.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white/80">{getMealTypeInfo(nextMeal.mealType).emoji} {getMealTypeInfo(nextMeal.mealType).label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(nextMeal.status).bg} ${getStatusBadge(nextMeal.status).text}`}>
                      {getStatusBadge(nextMeal.status).label}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{nextMeal.selectedMeal.name}</h2>
                  <p className="text-white/80 text-sm mt-1">{nextMeal.selectedMeal.description}</p>
                </div>
              </div>
              {nextMeal.selectedMeal.matchScore && (
                <div className="bg-white/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">{nextMeal.selectedMeal.matchScore}% match</span>
                </div>
              )}
            </div>

            {/* Meal Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{nextMeal.selectedMeal.totalTime}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5">
                <Flame className="w-4 h-4" />
                <span className="text-sm">{Math.round(nextMeal.selectedMeal.calories * nextMeal.portionMultiplier)} cal</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5">
                <Users className="w-4 h-4" />
                <span className="text-sm">{nextMeal.attendees.length} servings</span>
              </div>
              {nextMeal.selectedMeal.rating && (
                <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="text-sm">{nextMeal.selectedMeal.rating}</span>
                </div>
              )}
            </div>

            {/* Portion Info */}
            {nextMeal.portionMultiplier !== 1 && (
              <div className="mt-3 bg-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="text-sm">
                  Portions adjusted to {Math.round(nextMeal.portionMultiplier * 100)}% to match your nutrition goals
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 flex flex-wrap gap-3">
            <button
              onClick={() => onStartCooking(nextMeal)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:shadow-glow transition-all"
            >
              <Play className="w-5 h-5" />
              Start Cooking
            </button>
            <button
              onClick={() => setShowAlternatives(showAlternatives === nextMeal.id ? null : nextMeal.id)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              See Options ({nextMeal.alternatives.length})
            </button>
            <button
              onClick={() => onMarkComplete(nextMeal.id)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition-colors"
            >
              <Check className="w-5 h-5" />
              Mark Done
            </button>
          </div>

          {/* Alternatives Panel */}
          {showAlternatives === nextMeal.id && (
            <div className="border-t border-gray-100 p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Alternative Meals
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {nextMeal.alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => {
                      onSwapMeal(nextMeal.id, alt)
                      setShowAlternatives(null)
                    }}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{alt.emoji}</span>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">{alt.name}</h5>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{alt.totalTime}</span>
                          <span>•</span>
                          <span>{alt.calories} cal</span>
                          {alt.matchScore && (
                            <>
                              <span>•</span>
                              <span className="text-brand-600">{alt.matchScore}% match</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {alt.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Today's Meals */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Utensils className="w-5 h-5 text-brand-600" />
            Today&apos;s Meal Plan
          </h3>
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>

        <div className="space-y-3">
          {meals.map((meal) => {
            const typeInfo = getMealTypeInfo(meal.mealType)
            const statusBadge = getStatusBadge(meal.status)
            const isExpanded = expandedMeal === meal.id

            return (
              <div
                key={meal.id}
                className={`rounded-2xl border transition-all ${
                  meal.status === 'completed'
                    ? 'border-green-200 bg-green-50/50'
                    : meal.status === 'cooking'
                      ? 'border-orange-200 bg-orange-50/50'
                      : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => setExpandedMeal(isExpanded ? null : meal.id)}
                  className="w-full p-4 flex items-center gap-4 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeInfo.gradient} flex items-center justify-center shadow-lg`}>
                    {meal.selectedMeal ? (
                      <span className="text-2xl">{meal.selectedMeal.emoji}</span>
                    ) : (
                      <ChefHat className="w-6 h-6 text-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-gray-500 uppercase font-medium">{typeInfo.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    {meal.selectedMeal ? (
                      <>
                        <h4 className="font-semibold text-gray-900">{meal.selectedMeal.name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meal.selectedMeal.totalTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            {Math.round(meal.selectedMeal.calories * meal.portionMultiplier)} cal
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400">No meal planned</p>
                    )}
                  </div>

                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {/* Expanded Content */}
                {isExpanded && meal.selectedMeal && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                    {/* Nutrition Info */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Calories</p>
                        <p className="font-semibold text-gray-900">{Math.round(meal.selectedMeal.calories * meal.portionMultiplier)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Protein</p>
                        <p className="font-semibold text-gray-900">{Math.round(meal.selectedMeal.protein * meal.portionMultiplier)}g</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Carbs</p>
                        <p className="font-semibold text-gray-900">{Math.round(meal.selectedMeal.carbs * meal.portionMultiplier)}g</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Fat</p>
                        <p className="font-semibold text-gray-900">{Math.round(meal.selectedMeal.fat * meal.portionMultiplier)}g</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {meal.status !== 'completed' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onStartCooking(meal)
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            Cook Now
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onMarkComplete(meal.id)
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            Mark Done
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowAlternatives(showAlternatives === meal.id ? null : meal.id)
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Swap
                      </button>
                    </div>

                    {/* Inline Alternatives */}
                    {showAlternatives === meal.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Choose Alternative:</h5>
                        <div className="space-y-2">
                          {meal.alternatives.map((alt) => (
                            <button
                              key={alt.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                onSwapMeal(meal.id, alt)
                                setShowAlternatives(null)
                              }}
                              className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-3 text-left transition-colors"
                            >
                              <span className="text-xl">{alt.emoji}</span>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{alt.name}</p>
                                <p className="text-xs text-gray-500">{alt.totalTime} • {alt.calories} cal</p>
                              </div>
                              {alt.matchScore && (
                                <span className="text-xs text-brand-600 font-medium">{alt.matchScore}%</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
