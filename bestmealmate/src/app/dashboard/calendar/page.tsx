'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Sparkles,
  Clock,
  Users,
  Check
} from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { useMealPlanStore, useRecipesStore, useAuthStore, type PlannedMealWithRecipe } from '@/lib/store'
import { cn, mealTypeLabels, formatCookingTime, getWeekDates } from '@/lib/utils'
import type { Recipe } from '@/lib/database.types'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const

export default function CalendarPage() {
  const { household } = useAuthStore()
  const {
    currentPlan,
    setCurrentPlan,
    plannedMeals,
    setPlannedMeals,
    addPlannedMeal,
    updatePlannedMeal,
    removePlannedMeal,
    isLoading,
    setIsLoading
  } = useMealPlanStore()
  const { recipes, setRecipes } = useRecipesStore()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekDates, setWeekDates] = useState<Date[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [addingFor, setAddingFor] = useState<{ date: Date; mealType: string } | null>(null)

  // Calculate week dates
  useEffect(() => {
    setWeekDates(getWeekDates(selectedDate))
  }, [selectedDate])

  // Fetch meal plan and recipes
  useEffect(() => {
    const fetchData = async () => {
      if (!household?.id || weekDates.length === 0) return

      setIsLoading(true)
      try {
        const weekStart = format(weekDates[0], 'yyyy-MM-dd')

        const [mealPlanRes, recipesRes] = await Promise.all([
          fetch(`/api/meal-plans?householdId=${household.id}&weekStart=${weekStart}`),
          fetch(`/api/recipes?householdId=${household.id}`)
        ])

        const mealPlanData = await mealPlanRes.json()
        const recipesData = await recipesRes.json()

        setCurrentPlan(mealPlanData.mealPlan)
        setPlannedMeals(mealPlanData.plannedMeals || [])
        setRecipes(recipesData.recipes || [])
      } catch (error) {
        console.error('Failed to fetch meal plan:', error)
        toast.error('Failed to load meal plan')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [household?.id, weekDates, setCurrentPlan, setPlannedMeals, setRecipes, setIsLoading])

  const goToPreviousWeek = () => {
    setSelectedDate((prev) => addDays(prev, -7))
  }

  const goToNextWeek = () => {
    setSelectedDate((prev) => addDays(prev, 7))
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const getMealsForDate = (date: Date, mealType: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return plannedMeals.filter(
      (meal) => meal.meal_date === dateStr && meal.meal_type === mealType
    )
  }

  const handleAddMeal = (date: Date, mealType: string) => {
    setAddingFor({ date, mealType })
    setShowAddModal(true)
  }

  const handleDeleteMeal = async (id: string) => {
    try {
      const res = await fetch(`/api/meal-plans?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      removePlannedMeal(id)
      toast.success('Meal removed')
    } catch (error) {
      toast.error('Failed to remove meal')
    }
  }

  const handleMarkCooked = async (meal: PlannedMealWithRecipe) => {
    try {
      const res = await fetch('/api/meal-plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: meal.id,
          status: meal.status === 'cooked' ? 'planned' : 'cooked',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      updatePlannedMeal(meal.id, data.plannedMeal)
      toast.success(meal.status === 'cooked' ? 'Marked as planned' : 'Marked as cooked!')
    } catch (error) {
      toast.error('Failed to update meal status')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meal Calendar</h1>
            <p className="text-gray-600">Plan your family meals for the week</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-brand-600 border border-brand-200 rounded-xl font-medium hover:bg-brand-50 transition-colors"
            >
              Today
            </button>
            <div className="flex items-center bg-white border border-gray-200 rounded-xl">
              <button
                onClick={goToPreviousWeek}
                className="p-2 hover:bg-gray-50 rounded-l-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="px-4 py-2 font-medium text-gray-900">
                {format(weekDates[0] || new Date(), 'MMM d')} - {format(weekDates[6] || new Date(), 'MMM d, yyyy')}
              </span>
              <button
                onClick={goToNextWeek}
                className="p-2 hover:bg-gray-50 rounded-r-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading meal plan...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {weekDates.map((date) => (
                <div
                  key={date.toISOString()}
                  className={cn(
                    "p-3 text-center border-r last:border-r-0 border-gray-200",
                    isToday(date) && "bg-brand-50"
                  )}
                >
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    {format(date, 'EEE')}
                  </p>
                  <p className={cn(
                    "text-lg font-semibold mt-1",
                    isToday(date) ? "text-brand-600" : "text-gray-900"
                  )}>
                    {format(date, 'd')}
                  </p>
                </div>
              ))}
            </div>

            {/* Meal Type Rows */}
            {MEAL_TYPES.map((mealType) => (
              <div key={mealType} className="grid grid-cols-7 border-b last:border-b-0 border-gray-200">
                {weekDates.map((date) => {
                  const meals = getMealsForDate(date, mealType)
                  return (
                    <div
                      key={`${date.toISOString()}-${mealType}`}
                      className={cn(
                        "min-h-[120px] p-2 border-r last:border-r-0 border-gray-200",
                        isToday(date) && "bg-brand-50/50"
                      )}
                    >
                      {/* Meal Type Label - only show on first column */}
                      {date === weekDates[0] && (
                        <p className="text-xs font-medium text-gray-400 uppercase mb-2">
                          {mealTypeLabels[mealType]}
                        </p>
                      )}

                      {/* Meals */}
                      <div className="space-y-1">
                        {meals.map((meal) => (
                          <div
                            key={meal.id}
                            className={cn(
                              "group relative p-2 rounded-lg text-sm transition-colors",
                              meal.status === 'cooked'
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            )}
                          >
                            <p className="font-medium line-clamp-2 pr-6">
                              {meal.recipe?.name || 'Unnamed meal'}
                            </p>
                            {meal.recipe?.total_time_minutes && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatCookingTime(meal.recipe.total_time_minutes)}
                              </p>
                            )}
                            {/* Actions */}
                            <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                              <button
                                onClick={() => handleMarkCooked(meal)}
                                className={cn(
                                  "p-1 rounded",
                                  meal.status === 'cooked'
                                    ? "text-green-600 hover:bg-green-200"
                                    : "text-gray-400 hover:bg-gray-300"
                                )}
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteMeal(meal.id)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Add Button */}
                        <button
                          onClick={() => handleAddMeal(date, mealType)}
                          className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-xs">Add</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Meals Planned</p>
            <p className="text-2xl font-bold text-gray-900">{plannedMeals.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Meals Cooked</p>
            <p className="text-2xl font-bold text-green-600">
              {plannedMeals.filter((m) => m.status === 'cooked').length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Available Recipes</p>
            <p className="text-2xl font-bold text-brand-600">{recipes.length}</p>
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddModal && addingFor && (
        <AddMealModal
          date={addingFor.date}
          mealType={addingFor.mealType}
          mealPlanId={currentPlan?.id || ''}
          recipes={recipes}
          onClose={() => {
            setShowAddModal(false)
            setAddingFor(null)
          }}
          onAdd={(meal) => {
            addPlannedMeal(meal)
            setShowAddModal(false)
            setAddingFor(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}

// Add Meal Modal
function AddMealModal({
  date,
  mealType,
  mealPlanId,
  recipes,
  onClose,
  onAdd
}: {
  date: Date
  mealType: string
  mealPlanId: string
  recipes: Recipe[]
  onClose: () => void
  onAdd: (meal: PlannedMealWithRecipe) => void
}) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [customMealName, setCustomMealName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'recipe' | 'custom'>('recipe')

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMealType = !r.meal_type || r.meal_type === mealType
    return matchesSearch && matchesMealType
  })

  const handleSubmit = async () => {
    if (mode === 'recipe' && !selectedRecipe) {
      toast.error('Please select a recipe')
      return
    }
    if (mode === 'custom' && !customMealName.trim()) {
      toast.error('Please enter a meal name')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealPlanId,
          recipeId: mode === 'recipe' ? selectedRecipe?.id : undefined,
          recipeName: mode === 'custom' ? customMealName.trim() : undefined,
          mealDate: format(date, 'yyyy-MM-dd'),
          mealType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      onAdd(data.plannedMeal)
      toast.success('Meal added to plan')
    } catch (error: any) {
      toast.error(error.message || 'Failed to add meal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add Meal</h3>
            <p className="text-sm text-gray-500">
              {format(date, 'EEEE, MMMM d')} · {mealTypeLabels[mealType]}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('recipe')}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium transition-colors",
                mode === 'recipe'
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              From Recipe
            </button>
            <button
              onClick={() => setMode('custom')}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium transition-colors",
                mode === 'custom'
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              Custom Meal
            </button>
          </div>

          {mode === 'recipe' ? (
            <>
              {/* Search */}
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none mb-4"
              />

              {/* Recipe List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredRecipes.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No recipes found</p>
                ) : (
                  filteredRecipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 text-left transition-colors",
                        selectedRecipe?.id === recipe.id
                          ? "border-brand-500 bg-brand-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <p className="font-medium text-gray-900">{recipe.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        {recipe.total_time_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatCookingTime(recipe.total_time_minutes)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {recipe.servings}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Name
              </label>
              <input
                type="text"
                value={customMealName}
                onChange={(e) => setCustomMealName(e.target.value)}
                placeholder="e.g., Leftover pasta"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || (mode === 'recipe' && !selectedRecipe) || (mode === 'custom' && !customMealName.trim())}
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
