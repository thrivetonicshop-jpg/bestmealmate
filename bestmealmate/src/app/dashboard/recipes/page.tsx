'use client'

import { useState, useEffect } from 'react'
import {
  ChefHat,
  Plus,
  Search,
  Clock,
  Users,
  Star,
  Filter,
  X,
  Heart,
  Utensils,
  Flame
} from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { useRecipesStore, useAuthStore } from '@/lib/store'
import { cn, formatCookingTime, difficultyLabels, mealTypeLabels } from '@/lib/utils'
import type { Recipe } from '@/lib/database.types'

const MEAL_TYPES = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert']
const DIFFICULTIES = ['all', 'easy', 'medium', 'hard']

export default function RecipesPage() {
  const { household } = useAuthStore()
  const { recipes, setRecipes, isLoading, setIsLoading } = useRecipesStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMealType, setSelectedMealType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (household?.id) params.set('householdId', household.id)
        if (searchQuery) params.set('search', searchQuery)
        if (selectedMealType !== 'all') params.set('mealType', selectedMealType)
        if (selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty)

        const res = await fetch(`/api/recipes?${params.toString()}`)
        const data = await res.json()
        setRecipes(data.recipes || [])
      } catch (error) {
        console.error('Failed to fetch recipes:', error)
        toast.error('Failed to load recipes')
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchRecipes, 300)
    return () => clearTimeout(debounce)
  }, [household?.id, searchQuery, selectedMealType, selectedDifficulty, setRecipes, setIsLoading])

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = !searchQuery ||
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Group by meal type for display
  const quickMeals = filteredRecipes.filter(r => r.is_quick_meal || (r.total_time_minutes && r.total_time_minutes <= 30))
  const kidFriendly = filteredRecipes.filter(r => r.is_kid_friendly)

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
            <p className="text-gray-600">{filteredRecipes.length} recipes available</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Recipe
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-colors",
              showFilters
                ? "border-brand-500 text-brand-700 bg-brand-50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                <div className="flex flex-wrap gap-2">
                  {MEAL_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedMealType(type)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        selectedMealType === type
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {type === 'all' ? 'All' : mealTypeLabels[type]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        selectedDifficulty === diff
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {diff === 'all' ? 'All' : difficultyLabels[diff].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Meals Section */}
        {quickMeals.length > 0 && selectedMealType === 'all' && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Quick Meals (30 min or less)</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickMeals.slice(0, 3).map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Recipes */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading recipes...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Add your first recipe to get started'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
            >
              <Plus className="w-4 h-4" />
              Add Recipe
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedMealType === 'all' ? 'All Recipes' : mealTypeLabels[selectedMealType]}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Add Recipe Modal */}
      {showAddModal && (
        <AddRecipeModal
          householdId={household?.id || ''}
          onClose={() => setShowAddModal(false)}
          onAdd={(recipe: any) => {
            setRecipes([recipe, ...recipes])
            setShowAddModal(false)
          }}
        />
      )}
    </DashboardLayout>
  )
}

// Recipe Card Component
function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden text-left hover:shadow-md transition-shadow"
    >
      {recipe.image_url ? (
        <div className="h-40 bg-gray-100 relative">
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          {recipe.is_kid_friendly && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-0.5 rounded-full">
              Kid Friendly
            </span>
          )}
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center relative">
          <ChefHat className="w-12 h-12 text-brand-400" />
          {recipe.is_kid_friendly && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-0.5 rounded-full">
              Kid Friendly
            </span>
          )}
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{recipe.name}</h3>
        {recipe.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{recipe.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {recipe.total_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatCookingTime(recipe.total_time_minutes)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {recipe.servings}
          </span>
          {recipe.difficulty && (
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium",
              difficultyLabels[recipe.difficulty].color
            )}>
              {difficultyLabels[recipe.difficulty].label}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

// Recipe Detail Modal
function RecipeDetailModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const [fullRecipe, setFullRecipe] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFullRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes?id=${recipe.id}`)
        const data = await res.json()
        setFullRecipe(data.recipe)
      } catch (error) {
        console.error('Failed to fetch recipe details:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFullRecipe()
  }, [recipe.id])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative">
          {recipe.image_url ? (
            <div className="h-48 bg-gray-100">
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-white/50" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h2>
          {recipe.description && (
            <p className="text-gray-600 mb-4">{recipe.description}</p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-6">
            {recipe.total_time_minutes && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{formatCookingTime(recipe.total_time_minutes)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>{recipe.servings} servings</span>
            </div>
            {recipe.difficulty && (
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                difficultyLabels[recipe.difficulty].color
              )}>
                {difficultyLabels[recipe.difficulty].label}
              </span>
            )}
            {recipe.calories_per_serving && (
              <div className="flex items-center gap-2 text-gray-600">
                <Flame className="w-5 h-5" />
                <span>{recipe.calories_per_serving} cal</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.is_quick_meal && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">Quick Meal</span>
            )}
            {recipe.is_kid_friendly && (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">Kid Friendly</span>
            )}
            {recipe.is_one_pot && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">One Pot</span>
            )}
            {recipe.is_freezer_friendly && (
              <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm">Freezer Friendly</span>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <>
              {/* Ingredients */}
              {fullRecipe?.recipe_ingredients?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {fullRecipe.recipe_ingredients.map((ri: any) => (
                      <li key={ri.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-500" />
                        <span>
                          {ri.quantity} {ri.unit} {ri.ingredient?.name}
                          {ri.notes && <span className="text-gray-500"> ({ri.notes})</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Steps */}
              {fullRecipe?.recipe_steps?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
                  <ol className="space-y-4">
                    {fullRecipe.recipe_steps
                      .sort((a: any, b: any) => a.step_number - b.step_number)
                      .map((step: any) => (
                        <li key={step.id} className="flex gap-4">
                          <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-medium">
                            {step.step_number}
                          </span>
                          <div>
                            <p className="text-gray-700">{step.instruction}</p>
                            {step.timer_minutes && (
                              <p className="text-sm text-brand-600 mt-1">
                                Timer: {step.timer_minutes} min
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                  </ol>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            Add to Meal Plan
          </button>
        </div>
      </div>
    </div>
  )
}

// Add Recipe Modal
function AddRecipeModal({ householdId, onClose, onAdd }: any) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [mealType, setMealType] = useState('dinner')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [servings, setServings] = useState('4')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a recipe name')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          householdId,
          name: name.trim(),
          description: description.trim() || null,
          mealType,
          prepTimeMinutes: parseInt(prepTime) || null,
          cookTimeMinutes: parseInt(cookTime) || null,
          difficulty,
          servings: parseInt(servings) || 4,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onAdd(data.recipe)
      toast.success('Recipe added')
    } catch (error: any) {
      toast.error(error.message || 'Failed to add recipe')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add Recipe</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chicken Stir Fry"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.filter(t => t !== 'all').map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    mealType === type
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {mealTypeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
              <input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="15"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
              <input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="20"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                min="1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
