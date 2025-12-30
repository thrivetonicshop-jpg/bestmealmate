'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Users,
  Check,
  Sparkles,
  Plus,
  MoreVertical,
  Shuffle,
  Trash2,
  Copy,
  ShoppingCart,
  Star,
  Snowflake,
  Play,
  Target,
  TrendingUp,
  RefreshCw,
  Download,
  ChefHat
} from 'lucide-react'
import type { MealOption, TodaysMeal, UserGoals } from './TodaysMeals'

interface DayPlan {
  date: Date
  dayName: string
  isToday: boolean
  meals: {
    breakfast: TodaysMeal | null
    lunch: TodaysMeal | null
    dinner: TodaysMeal | null
    snack?: TodaysMeal | null
  }
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

interface WeeklyMealPlanProps {
  weeklyPlan: DayPlan[]
  userGoals: UserGoals
  onStartCooking: (meal: TodaysMeal) => void
  onMarkComplete: (mealId: string) => void
  onSwapMeal: (mealId: string, newMeal: MealOption) => void
  onAddMeal: (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void
  onRemoveMeal: (mealId: string) => void
  onCopyMeal: (meal: TodaysMeal, targetDay: number) => void
  onRegenerateDay: (dayIndex: number) => void
  onRegenerateWeek: () => void
  onGenerateGroceryList: () => void
  isLoading?: boolean
  frozenMeals?: Array<{ id: string; name: string; portions: number; emoji: string }>
}

export default function WeeklyMealPlan({
  weeklyPlan,
  userGoals,
  onStartCooking,
  onMarkComplete,
  onSwapMeal,
  onAddMeal,
  onRemoveMeal,
  onCopyMeal,
  onRegenerateDay,
  onRegenerateWeek,
  onGenerateGroceryList,
  isLoading = false,
  frozenMeals = []
}: WeeklyMealPlanProps) {
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    // Find today's index
    return weeklyPlan.findIndex(d => d.isToday) || 0
  })
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')
  const [showMealMenu, setShowMealMenu] = useState<string | null>(null)
  const [showCopyModal, setShowCopyModal] = useState<{ meal: TodaysMeal; show: boolean } | null>(null)

  // Calculate weekly totals
  const weeklyTotals = weeklyPlan.reduce(
    (acc, day) => ({
      calories: acc.calories + day.totalCalories,
      protein: acc.protein + day.totalProtein,
      carbs: acc.carbs + day.totalCarbs,
      fat: acc.fat + day.totalFat,
      mealsPlanned: acc.mealsPlanned + Object.values(day.meals).filter(Boolean).length,
      mealsCompleted: acc.mealsCompleted + Object.values(day.meals).filter(m => m?.status === 'completed').length
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, mealsPlanned: 0, mealsCompleted: 0 }
  )

  const weeklyGoals = {
    calories: userGoals.dailyCalories * 7,
    protein: userGoals.dailyProtein * 7,
    carbs: userGoals.dailyCarbs * 7,
    fat: userGoals.dailyFat * 7
  }

  const getMealTypeInfo = (type: string) => {
    const info: Record<string, { label: string; time: string; gradient: string; emoji: string }> = {
      breakfast: { label: 'Breakfast', time: '7:00 AM', gradient: 'from-amber-500 to-orange-500', emoji: '🌅' },
      lunch: { label: 'Lunch', time: '12:00 PM', gradient: 'from-green-500 to-emerald-500', emoji: '☀️' },
      dinner: { label: 'Dinner', time: '6:00 PM', gradient: 'from-purple-500 to-pink-500', emoji: '🌙' },
      snack: { label: 'Snack', time: '3:00 PM', gradient: 'from-blue-500 to-cyan-500', emoji: '🍎' }
    }
    return info[type] || info.dinner
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getWeekRange = () => {
    if (weeklyPlan.length === 0) return ''
    const start = weeklyPlan[0].date
    const end = weeklyPlan[weeklyPlan.length - 1].date
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-brand-600" />
            Weekly Meal Plan
          </h2>
          <p className="text-gray-500">{getWeekRange()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateGroceryList}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Generate Grocery List
          </button>
          <button
            onClick={onRegenerateWeek}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-xl font-medium hover:bg-brand-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            Regenerate Week
          </button>
        </div>
      </div>

      {/* Weekly Summary Stats */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-600 to-emerald-500 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Weekly Overview</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {weeklyTotals.mealsPlanned} meals planned
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {weeklyTotals.mealsCompleted} completed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Calories', current: weeklyTotals.calories, goal: weeklyGoals.calories, unit: 'kcal', color: 'bg-amber-400' },
            { label: 'Protein', current: weeklyTotals.protein, goal: weeklyGoals.protein, unit: 'g', color: 'bg-red-400' },
            { label: 'Carbs', current: weeklyTotals.carbs, goal: weeklyGoals.carbs, unit: 'g', color: 'bg-blue-400' },
            { label: 'Fat', current: weeklyTotals.fat, goal: weeklyGoals.fat, unit: 'g', color: 'bg-purple-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm">{stat.label}</span>
                <TrendingUp className="w-4 h-4 text-white/50" />
              </div>
              <p className="text-2xl font-bold">
                {Math.round(stat.current)}
                <span className="text-sm font-normal text-white/70">/{stat.goal}{stat.unit}</span>
              </p>
              <div className="h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${stat.color} rounded-full transition-all`}
                  style={{ width: `${Math.min((stat.current / stat.goal) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frozen Meals Available */}
      {frozenMeals.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Snowflake className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Frozen Meals Available</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {frozenMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-blue-200"
              >
                <span>{meal.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{meal.name}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {meal.portions} portions
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setViewMode('week')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Week View
        </button>
        <button
          onClick={() => setViewMode('day')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Day View
        </button>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-3">
          {weeklyPlan.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`bg-white rounded-2xl border transition-all cursor-pointer ${
                day.isToday
                  ? 'border-brand-300 ring-2 ring-brand-100'
                  : selectedDay === dayIndex
                    ? 'border-gray-300'
                    : 'border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => setSelectedDay(dayIndex)}
            >
              {/* Day Header */}
              <div className={`p-3 border-b ${day.isToday ? 'bg-brand-50' : 'bg-gray-50'} rounded-t-2xl`}>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-medium">{day.dayName.slice(0, 3)}</p>
                  <p className={`text-lg font-bold ${day.isToday ? 'text-brand-600' : 'text-gray-900'}`}>
                    {day.date.getDate()}
                  </p>
                  {day.isToday && (
                    <span className="text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full">Today</span>
                  )}
                </div>
              </div>

              {/* Meals */}
              <div className="p-2 space-y-1.5">
                {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                  const meal = day.meals[mealType]
                  const typeInfo = getMealTypeInfo(mealType)

                  return meal && meal.selectedMeal ? (
                    <div
                      key={mealType}
                      className={`p-2 rounded-lg text-xs ${
                        meal.status === 'completed'
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{meal.selectedMeal.emoji}</span>
                        <span className="truncate font-medium text-gray-700">
                          {meal.selectedMeal.name}
                        </span>
                        {meal.status === 'completed' && (
                          <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      key={mealType}
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddMeal(dayIndex, mealType)
                      }}
                      className="w-full p-2 border border-dashed border-gray-200 rounded-lg text-gray-400 text-xs hover:border-brand-300 hover:text-brand-600 transition-colors"
                    >
                      + {typeInfo.label}
                    </button>
                  )
                })}
              </div>

              {/* Day Total */}
              <div className="p-2 pt-0">
                <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg py-1">
                  <Flame className="w-3 h-3 inline mr-1" />
                  {day.totalCalories} cal
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && weeklyPlan[selectedDay] && (
        <div className="space-y-4">
          {/* Day Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
              disabled={selectedDay === 0}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">{weeklyPlan[selectedDay].dayName}</h3>
              <p className="text-gray-500">{formatDate(weeklyPlan[selectedDay].date)}</p>
            </div>
            <button
              onClick={() => setSelectedDay(Math.min(weeklyPlan.length - 1, selectedDay + 1))}
              disabled={selectedDay === weeklyPlan.length - 1}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Day Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Calories', value: weeklyPlan[selectedDay].totalCalories, goal: userGoals.dailyCalories, unit: 'kcal' },
              { label: 'Protein', value: weeklyPlan[selectedDay].totalProtein, goal: userGoals.dailyProtein, unit: 'g' },
              { label: 'Carbs', value: weeklyPlan[selectedDay].totalCarbs, goal: userGoals.dailyCarbs, unit: 'g' },
              { label: 'Fat', value: weeklyPlan[selectedDay].totalFat, goal: userGoals.dailyFat, unit: 'g' }
            ].map((stat, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="font-bold text-gray-900">{Math.round(stat.value)}<span className="text-xs font-normal text-gray-500">/{stat.goal}{stat.unit}</span></p>
              </div>
            ))}
          </div>

          {/* Meals for Selected Day */}
          <div className="space-y-4">
            {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
              const meal = weeklyPlan[selectedDay].meals[mealType]
              const typeInfo = getMealTypeInfo(mealType)

              return (
                <div
                  key={mealType}
                  className={`bg-white rounded-2xl border p-4 ${
                    meal?.status === 'completed'
                      ? 'border-green-200 bg-green-50/30'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeInfo.gradient} flex items-center justify-center shadow-lg`}>
                      {meal?.selectedMeal ? (
                        <span className="text-2xl">{meal.selectedMeal.emoji}</span>
                      ) : (
                        <Plus className="w-6 h-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 uppercase font-medium">{typeInfo.label}</span>
                        <span className="text-xs text-gray-400">{typeInfo.time}</span>
                        {meal?.status === 'completed' && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Completed</span>
                        )}
                      </div>

                      {meal?.selectedMeal ? (
                        <>
                          <h4 className="font-semibold text-gray-900 text-lg">{meal.selectedMeal.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{meal.selectedMeal.description}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {meal.selectedMeal.totalTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-4 h-4" />
                              {Math.round(meal.selectedMeal.calories * meal.portionMultiplier)} cal
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {meal.selectedMeal.protein}g protein
                            </span>
                            {meal.selectedMeal.matchScore && (
                              <span className="flex items-center gap-1 text-brand-600">
                                <Sparkles className="w-4 h-4" />
                                {meal.selectedMeal.matchScore}% match
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {meal.status !== 'completed' && (
                              <>
                                <button
                                  onClick={() => onStartCooking(meal)}
                                  className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
                                >
                                  <Play className="w-4 h-4" />
                                  Start Cooking
                                </button>
                                <button
                                  onClick={() => onMarkComplete(meal.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                  Mark Done
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setShowMealMenu(showMealMenu === meal.id ? null : meal.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-400" />
                            </button>

                            {showMealMenu === meal.id && (
                              <div className="absolute right-4 mt-10 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                                <button
                                  onClick={() => {
                                    onSwapMeal(meal.id, meal.alternatives[0])
                                    setShowMealMenu(null)
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Shuffle className="w-4 h-4" />
                                  Swap Meal
                                </button>
                                <button
                                  onClick={() => {
                                    setShowCopyModal({ meal, show: true })
                                    setShowMealMenu(null)
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy to Another Day
                                </button>
                                <hr className="my-2 border-gray-100" />
                                <button
                                  onClick={() => {
                                    onRemoveMeal(meal.id)
                                    setShowMealMenu(null)
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Alternatives */}
                          {meal.alternatives.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-2">Alternatives:</p>
                              <div className="flex flex-wrap gap-2">
                                {meal.alternatives.slice(0, 3).map((alt) => (
                                  <button
                                    key={alt.id}
                                    onClick={() => onSwapMeal(meal.id, alt)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                  >
                                    <span>{alt.emoji}</span>
                                    <span className="text-sm text-gray-700">{alt.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => onAddMeal(selectedDay, mealType)}
                          className="text-gray-400 hover:text-brand-600 transition-colors"
                        >
                          Click to add a {mealType}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Regenerate Day Button */}
          <button
            onClick={() => onRegenerateDay(selectedDay)}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            Regenerate All Meals for {weeklyPlan[selectedDay].dayName}
          </button>
        </div>
      )}

      {/* Copy Modal */}
      {showCopyModal?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Copy to which day?</h3>
            <div className="space-y-2">
              {weeklyPlan.map((day, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onCopyMeal(showCopyModal.meal, index)
                    setShowCopyModal(null)
                  }}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="font-medium text-gray-900">{day.dayName}</span>
                  <span className="text-gray-500">{formatDate(day.date)}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCopyModal(null)}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
