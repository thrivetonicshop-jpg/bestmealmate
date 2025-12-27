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
  Flame,
  Sparkles,
  X,
  SlidersHorizontal,
  BookOpen,
  TrendingUp
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
  calories: number
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
    is_favorite: true,
    calories: 450
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
    is_favorite: true,
    calories: 520
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
    is_favorite: false,
    calories: 380
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
    is_favorite: false,
    calories: 420
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
    is_favorite: false,
    calories: 280
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
    is_favorite: true,
    calories: 650
  }
]

const mealTypeColors: Record<string, string> = {
  breakfast: 'from-yellow-400 to-orange-400',
  lunch: 'from-green-400 to-emerald-400',
  dinner: 'from-purple-400 to-pink-400',
  snack: 'from-orange-400 to-red-400',
  dessert: 'from-pink-400 to-rose-400'
}

const difficultyConfig: Record<string, { color: string; bg: string }> = {
  easy: { color: 'text-green-700', bg: 'bg-green-100' },
  medium: { color: 'text-amber-700', bg: 'bg-amber-100' },
  hard: { color: 'text-red-700', bg: 'bg-red-100' }
}

const navItems = [
  { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: false },
  { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries', active: false },
  { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
  { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: true },
  { icon: Users, label: 'Family', href: '/dashboard/family', active: false },
]

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

  const activeFiltersCount = [
    filterMealType !== 'all',
    filterDifficulty !== 'all',
    filterQuickMeals,
    filterKidFriendly,
    filterFavorites
  ].filter(Boolean).length

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

  function clearFilters() {
    setFilterMealType('all')
    setFilterDifficulty('all')
    setFilterQuickMeals(false)
    setFilterKidFriendly(false)
    setFilterFavorites(false)
    setSearchTerm('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BestMealMate</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.active && <div className="ml-auto w-2 h-2 rounded-full bg-white/50" />}
            </Link>
          ))}
        </nav>

        {/* AI Chef Promo */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">AI Recipe Finder</span>
            </div>
            <p className="text-sm text-white/80 mb-3">Tell me what you're craving and I'll find the perfect recipe!</p>
            <button className="w-full py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
              Ask AI Chef
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 space-y-1">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-7 h-7 text-brand-600" />
                  Recipe Collection
                </h1>
                <p className="text-gray-500">Discover delicious meals for your family</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-medium hover:shadow-glow transition-all">
                <Plus className="w-5 h-5" />
                Add Recipe
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Recipes', value: recipes.length.toString(), icon: BookOpen, color: 'from-brand-500 to-emerald-500' },
              { label: 'Favorites', value: recipes.filter(r => r.is_favorite).length.toString(), icon: Heart, color: 'from-pink-500 to-rose-500' },
              { label: 'Quick Meals', value: recipes.filter(r => r.is_quick_meal).length.toString(), icon: Flame, color: 'from-orange-500 to-amber-500' },
              { label: 'Kid Friendly', value: recipes.filter(r => r.is_kid_friendly).length.toString(), icon: UsersIcon, color: 'from-blue-500 to-cyan-500' },
            ].map((stat, i) => (
              <div key={i} className="card p-4 group hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes by name, cuisine, or ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                  showFilters
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                    <select
                      value={filterMealType}
                      onChange={(e) => setFilterMealType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all bg-white"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all bg-white"
                    >
                      <option value="all">All Levels</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { label: 'Quick Meals', value: filterQuickMeals, setter: setFilterQuickMeals, icon: Flame },
                    { label: 'Kid Friendly', value: filterKidFriendly, setter: setFilterKidFriendly, icon: UsersIcon },
                    { label: 'Favorites Only', value: filterFavorites, setter: setFilterFavorites, icon: Heart },
                  ].map((filter, i) => (
                    <button
                      key={i}
                      onClick={() => filter.setter(!filter.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        filter.value
                          ? 'bg-brand-50 border-brand-300 text-brand-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <filter.icon className="w-4 h-4" />
                      {filter.label}
                    </button>
                  ))}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredRecipes.length}</span> recipes
            </p>
          </div>

          {/* Recipe Grid */}
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-card-hover hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={recipe.image_url}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Favorite button */}
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-sm transition-all ${
                        recipe.is_favorite
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${recipe.is_favorite ? 'fill-current' : ''}`} />
                    </button>

                    {/* Badges */}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r ${mealTypeColors[recipe.meal_type]} text-white shadow-lg`}>
                        {recipe.meal_type}
                      </span>
                      {recipe.is_quick_meal && (
                        <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/90 text-gray-700 flex items-center gap-1 shadow-lg">
                          <Flame className="w-3 h-3 text-orange-500" />
                          Quick
                        </span>
                      )}
                      {recipe.is_kid_friendly && (
                        <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/90 text-gray-700 shadow-lg">
                          Kid Friendly
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-brand-600 transition-colors">
                      {recipe.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{recipe.description}</p>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                        <UsersIcon className="w-4 h-4 text-gray-400" />
                        {recipe.servings}
                      </span>
                      <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg ${difficultyConfig[recipe.difficulty].bg} ${difficultyConfig[recipe.difficulty].color}`}>
                        {recipe.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= recipe.rating
                                ? 'text-amber-400 fill-current'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium text-gray-600 ml-1.5">{recipe.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{recipe.calories} cal</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-medium hover:shadow-glow transition-all">
                        View Recipe
                      </button>
                      <button
                        onClick={() => addToMealPlan(recipe)}
                        className="p-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 lg:hidden">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                item.active
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-400 hover:text-gray-600'
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
