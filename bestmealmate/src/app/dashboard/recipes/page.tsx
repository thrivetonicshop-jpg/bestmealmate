'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChefHat,
  Calendar,
  ShoppingCart,
  Refrigerator,
  Users,
  Search,
  Filter,
  Clock,
  Star,
  Plus,
  Settings,
  LogOut,
  Heart,
  Users as UsersIcon,
  Flame
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface Recipe {
  id: string
  name: string
  description: string
  cuisine: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
  prep_time_minutes: number
  cook_time_minutes: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  image_url: string
  is_kid_friendly: boolean
  is_quick_meal: boolean
  tags: string[]
  rating: number
  is_favorite: boolean
}

const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Sheet Pan Chicken & Vegetables',
    description: 'A simple one-pan dinner with roasted chicken and seasonal vegetables.',
    cuisine: 'American',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 35,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.5,
    is_favorite: true
  },
  {
    id: '2',
    name: 'Beef Tacos',
    description: 'Classic Mexican tacos with seasoned ground beef and fresh toppings.',
    cuisine: 'Mexican',
    meal_type: 'dinner',
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['gluten_free'],
    rating: 4.8,
    is_favorite: true
  },
  {
    id: '3',
    name: 'Pasta Primavera',
    description: 'Light and fresh pasta with garden vegetables in a garlic olive oil sauce.',
    cuisine: 'Italian',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 20,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2c5?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.2,
    is_favorite: false
  },
  {
    id: '4',
    name: 'Honey Garlic Salmon',
    description: 'Sweet and savory salmon fillets glazed with honey and garlic.',
    cuisine: 'Asian Fusion',
    meal_type: 'dinner',
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.7,
    is_favorite: false
  },
  {
    id: '5',
    name: 'Veggie Stir Fry',
    description: 'Quick and healthy vegetable stir fry with a savory sauce.',
    cuisine: 'Asian',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 10,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan'],
    rating: 4.0,
    is_favorite: false
  },
  {
    id: '6',
    name: 'Chicken Alfredo',
    description: 'Creamy pasta with tender chicken in a rich Parmesan sauce.',
    cuisine: 'Italian',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 25,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882c?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: [],
    rating: 4.6,
    is_favorite: true
  }
]

const mealTypeColors: Record<string, string> = {
  breakfast: 'bg-yellow-100 text-yellow-800',
  lunch: 'bg-green-100 text-green-800',
  dinner: 'bg-purple-100 text-purple-800',
  snack: 'bg-orange-100 text-orange-800',
  dessert: 'bg-pink-100 text-pink-800'
}

const difficultyColors: Record<string, string> = {
  easy: 'text-green-600',
  medium: 'text-amber-600',
  hard: 'text-red-600'
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMealType, setFilterMealType] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [filterQuickMeals, setFilterQuickMeals] = useState(false)
  const [filterKidFriendly, setFilterKidFriendly] = useState(false)
  const [filterFavorites, setFilterFavorites] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      if (searchTerm && !recipe.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterMealType !== 'all' && recipe.meal_type !== filterMealType) {
        return false
      }
      if (filterDifficulty !== 'all' && recipe.difficulty !== filterDifficulty) {
        return false
      }
      if (filterQuickMeals && !recipe.is_quick_meal) {
        return false
      }
      if (filterKidFriendly && !recipe.is_kid_friendly) {
        return false
      }
      if (filterFavorites && !recipe.is_favorite) {
        return false
      }
      return true
    })
  }, [recipes, searchTerm, filterMealType, filterDifficulty, filterQuickMeals, filterKidFriendly, filterFavorites])

  function toggleFavorite(recipeId: string) {
    setRecipes(recipes.map(r =>
      r.id === recipeId ? { ...r, is_favorite: !r.is_favorite } : r
    ))
    const recipe = recipes.find(r => r.id === recipeId)
    toast.success(recipe?.is_favorite ? 'Removed from favorites' : 'Added to favorites')
  }

  function addToMealPlan(recipe: Recipe) {
    toast.success(`Added "${recipe.name}" to meal plan`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold text-gray-900">BestMealMate</span>
        </div>

        <nav className="space-y-1">
          {[
            { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: false },
            { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries', active: false },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
            { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: true },
            { icon: Users, label: 'Family', href: '/dashboard/family', active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="border-t border-gray-200 pt-4 space-y-1">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
            <p className="text-gray-600">Browse and discover new meal ideas</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">
            <Plus className="w-5 h-5" />
            Add Recipe
          </button>
        </header>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-brand-50 border-brand-300 text-brand-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                  <select
                    value={filterMealType}
                    onChange={(e) => setFilterMealType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                  >
                    <option value="all">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterQuickMeals}
                    onChange={(e) => setFilterQuickMeals(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Quick Meals (under 30 min)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterKidFriendly}
                    onChange={(e) => setFilterKidFriendly(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Kid Friendly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterFavorites}
                    onChange={(e) => setFilterFavorites(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Favorites Only</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No recipes found</p>
            <button className="text-brand-600 font-medium hover:text-brand-700">
              Browse all recipes
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                      recipe.is_favorite
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${recipe.is_favorite ? 'fill-current' : ''}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${mealTypeColors[recipe.meal_type]}`}>
                      {recipe.meal_type}
                    </span>
                    {recipe.is_quick_meal && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Quick
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{recipe.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <UsersIcon className="w-4 h-4" />
                      {recipe.servings}
                    </span>
                    <span className={`flex items-center gap-1 ${difficultyColors[recipe.difficulty]}`}>
                      {recipe.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= recipe.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">{recipe.rating}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                      View Recipe
                    </button>
                    <button
                      onClick={() => addToMealPlan(recipe)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Calendar, label: 'Plan', href: '/dashboard', active: false },
            { icon: ShoppingCart, label: 'Groceries', href: '/dashboard/groceries', active: false },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
            { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: true },
            { icon: Users, label: 'Family', href: '/dashboard/family', active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                item.active ? 'text-brand-600' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
