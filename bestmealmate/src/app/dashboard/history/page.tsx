'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  History,
  Calendar,
  Star,
  Clock,
  Flame,
  Users,
  Heart,
  Search,
  Filter,
  ChefHat,
  TrendingUp,
  Award,
  Repeat,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface MealHistoryItem {
  id: string
  name: string
  emoji: string
  date: Date
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  calories: number
  rating?: number
  isFavorite: boolean
  timesCooked: number
  lastCooked: Date
  prepTime: string
  tags: string[]
}

// Sample meal history data
const SAMPLE_HISTORY: MealHistoryItem[] = [
  {
    id: '1',
    name: 'Honey Garlic Chicken',
    emoji: '🍗',
    date: new Date(Date.now() - 86400000),
    mealType: 'dinner',
    calories: 450,
    rating: 5,
    isFavorite: true,
    timesCooked: 8,
    lastCooked: new Date(Date.now() - 86400000),
    prepTime: '35 min',
    tags: ['quick', 'family-favorite', 'chicken']
  },
  {
    id: '2',
    name: 'Greek Yogurt Parfait',
    emoji: '🥣',
    date: new Date(Date.now() - 86400000),
    mealType: 'breakfast',
    calories: 320,
    rating: 4,
    isFavorite: false,
    timesCooked: 12,
    lastCooked: new Date(Date.now() - 86400000),
    prepTime: '5 min',
    tags: ['quick', 'healthy', 'breakfast']
  },
  {
    id: '3',
    name: 'Mediterranean Quinoa Bowl',
    emoji: '🥗',
    date: new Date(Date.now() - 2 * 86400000),
    mealType: 'lunch',
    calories: 520,
    rating: 5,
    isFavorite: true,
    timesCooked: 5,
    lastCooked: new Date(Date.now() - 2 * 86400000),
    prepTime: '25 min',
    tags: ['healthy', 'vegetarian', 'meal-prep']
  },
  {
    id: '4',
    name: 'Sheet Pan Salmon',
    emoji: '🐟',
    date: new Date(Date.now() - 3 * 86400000),
    mealType: 'dinner',
    calories: 480,
    rating: 4,
    isFavorite: true,
    timesCooked: 6,
    lastCooked: new Date(Date.now() - 3 * 86400000),
    prepTime: '30 min',
    tags: ['healthy', 'fish', 'easy']
  },
  {
    id: '5',
    name: 'Beef Tacos',
    emoji: '🌮',
    date: new Date(Date.now() - 4 * 86400000),
    mealType: 'dinner',
    calories: 580,
    rating: 5,
    isFavorite: true,
    timesCooked: 10,
    lastCooked: new Date(Date.now() - 4 * 86400000),
    prepTime: '25 min',
    tags: ['mexican', 'family-favorite', 'quick']
  },
  {
    id: '6',
    name: 'Avocado Toast',
    emoji: '🥑',
    date: new Date(Date.now() - 5 * 86400000),
    mealType: 'breakfast',
    calories: 350,
    rating: 4,
    isFavorite: false,
    timesCooked: 15,
    lastCooked: new Date(Date.now() - 5 * 86400000),
    prepTime: '10 min',
    tags: ['quick', 'vegetarian', 'breakfast']
  },
  {
    id: '7',
    name: 'Chicken Stir Fry',
    emoji: '🥡',
    date: new Date(Date.now() - 6 * 86400000),
    mealType: 'dinner',
    calories: 420,
    rating: 4,
    isFavorite: false,
    timesCooked: 7,
    lastCooked: new Date(Date.now() - 6 * 86400000),
    prepTime: '30 min',
    tags: ['asian', 'quick', 'healthy']
  },
  {
    id: '8',
    name: 'Pasta Primavera',
    emoji: '🍝',
    date: new Date(Date.now() - 7 * 86400000),
    mealType: 'dinner',
    calories: 550,
    rating: 3,
    isFavorite: false,
    timesCooked: 4,
    lastCooked: new Date(Date.now() - 7 * 86400000),
    prepTime: '35 min',
    tags: ['italian', 'vegetarian', 'pasta']
  }
]

export default function MealHistoryPage() {
  const { household } = useAuth()
  const [history, setHistory] = useState<MealHistoryItem[]>(SAMPLE_HISTORY)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'recent'>('all')
  const [filterMealType, setFilterMealType] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all')

  // Calculate stats
  const stats = {
    totalMeals: history.length,
    favorites: history.filter(m => m.isFavorite).length,
    avgRating: history.filter(m => m.rating).reduce((sum, m) => sum + (m.rating || 0), 0) / history.filter(m => m.rating).length || 0,
    mostCooked: history.reduce((max, m) => m.timesCooked > max.timesCooked ? m : max, history[0])
  }

  // Filter history
  const filteredHistory = history.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = filterType === 'all' ||
      (filterType === 'favorites' && meal.isFavorite) ||
      (filterType === 'recent' && meal.date > new Date(Date.now() - 7 * 86400000))
    const matchesMealType = filterMealType === 'all' || meal.mealType === filterMealType
    return matchesSearch && matchesFilter && matchesMealType
  })

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(m =>
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    ))
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast': return 'bg-amber-100 text-amber-700'
      case 'lunch': return 'bg-green-100 text-green-700'
      case 'dinner': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Meal History</h1>
                <p className="text-gray-500">{stats.totalMeals} meals cooked</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMeals}</p>
                <p className="text-xs text-gray-500">Meals Cooked</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
                <p className="text-xs text-gray-500">Favorites</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Avg Rating</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 truncate">{stats.mostCooked?.name}</p>
                <p className="text-xs text-gray-500">{stats.mostCooked?.timesCooked}x cooked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meals or tags..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* Filter Type */}
            <div className="flex gap-2">
              {(['all', 'favorites', 'recent'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    filterType === type
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'favorites' ? '❤️ Favorites' : '🕐 Recent'}
                </button>
              ))}
            </div>

            {/* Meal Type Filter */}
            <div className="flex gap-2">
              {(['all', 'breakfast', 'lunch', 'dinner'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterMealType(type)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filterMealType === type
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Meals' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meal History List */}
        <div className="space-y-3">
          {filteredHistory.map((meal) => (
            <div
              key={meal.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Emoji */}
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                  {meal.emoji}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getMealTypeColor(meal.mealType)}`}>
                      {meal.mealType}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(meal.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {meal.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {meal.calories} cal
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat className="w-3.5 h-3.5" />
                      {meal.timesCooked}x
                    </span>
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {meal.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                {meal.rating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= meal.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(meal.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    meal.isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${meal.isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Cook Again */}
                <Link
                  href={`/dashboard/recipes?cook=${meal.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
                >
                  <ChefHat className="w-4 h-4" />
                  Cook Again
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No meals found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Cooking Trends */}
        <div className="mt-8 bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h3 className="font-bold text-lg">Your Cooking Trends</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">This Week</p>
              <p className="text-2xl font-bold">{history.filter(m => m.date > new Date(Date.now() - 7 * 86400000)).length} meals</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">Top Cuisine</p>
              <p className="text-2xl font-bold">Asian</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">Avg Prep Time</p>
              <p className="text-2xl font-bold">25 min</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm mb-1">Avg Calories</p>
              <p className="text-2xl font-bold">{Math.round(history.reduce((sum, m) => sum + m.calories, 0) / history.length)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
