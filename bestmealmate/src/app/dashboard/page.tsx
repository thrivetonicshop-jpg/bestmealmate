'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChefHat,
  Calendar,
  ShoppingCart,
  Refrigerator,
  Users,
  Sparkles,
  Plus,
  ChevronRight,
  Clock,
  Check,
  AlertTriangle,
  Settings,
  LogOut,
  Flame,
  Heart,
  UtensilsCrossed,
  Timer,
  TrendingUp,
  Bell,
  Search,
  X,
  Send,
  Watch,
  Play,
  Target,
  RefreshCw,
  Snowflake,
  Star
} from 'lucide-react'
import { trackSubscriptionConversion } from '@/lib/conversion-tracking'
import { useAuth } from '@/lib/auth-context'
import TodaysMeals, { type TodaysMeal, type MealOption, type UserGoals } from '@/components/TodaysMeals'
import CookingMode from '@/components/CookingMode'
import PantrySuggestions, { type ExpiringItem } from '@/components/PantrySuggestions'

// Navigation items
const navItems = [
  { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: true },
  { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries', active: false },
  { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
  { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: false },
  { icon: Users, label: 'Family', href: '/dashboard/family', active: false },
  { icon: Watch, label: 'Health', href: '/dashboard/wearables', active: false },
]

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const { user, household, familyMember } = useAuth()

  // Meal planning state
  const [todaysMeals, setTodaysMeals] = useState<TodaysMeal[]>([])
  const [userGoals, setUserGoals] = useState<UserGoals>({
    dailyCalories: 2000,
    dailyProtein: 50,
    dailyCarbs: 250,
    dailyFat: 70
  })
  const [isLoadingMeals, setIsLoadingMeals] = useState(true)
  const [cookingMeal, setCookingMeal] = useState<TodaysMeal | null>(null)
  const [frozenMeals, setFrozenMeals] = useState<Array<{ id: string; name: string; portions: number; emoji: string; calories: number }>>([])

  // UI state
  const [showAIChef, setShowAIChef] = useState(false)
  const [aiInput, setAIInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  // Pantry savings tracking
  const [savingsThisMonth] = useState(47.50)
  const [wastedThisMonth] = useState(12.00)

  // Mock data for expiring items with cost and recipe suggestions
  const [expiringItems] = useState<ExpiringItem[]>([
    {
      id: '1',
      name: 'Chicken Breast',
      emoji: '🍗',
      quantity: 2,
      unit: 'lbs',
      expiryDate: new Date(Date.now() + 1 * 86400000),
      daysUntilExpiry: 1,
      location: 'fridge',
      estimatedValue: 8.99,
      suggestedRecipes: [
        { id: 'r1', name: 'Honey Garlic Chicken', emoji: '🍯', usesItems: ['Chicken Breast'], prepTime: '30 min' },
        { id: 'r2', name: 'Chicken Stir Fry', emoji: '🥡', usesItems: ['Chicken Breast', 'Spinach'], prepTime: '25 min' },
      ]
    },
    {
      id: '2',
      name: 'Spinach',
      emoji: '🥬',
      quantity: 1,
      unit: 'bag',
      expiryDate: new Date(Date.now() + 2 * 86400000),
      daysUntilExpiry: 2,
      location: 'fridge',
      estimatedValue: 3.49,
      suggestedRecipes: [
        { id: 'r3', name: 'Spinach Salad', emoji: '🥗', usesItems: ['Spinach'], prepTime: '10 min' },
        { id: 'r4', name: 'Green Smoothie', emoji: '🥤', usesItems: ['Spinach', 'Greek Yogurt'], prepTime: '5 min' },
      ]
    },
    {
      id: '3',
      name: 'Greek Yogurt',
      emoji: '🥛',
      quantity: 32,
      unit: 'oz',
      expiryDate: new Date(Date.now() + 3 * 86400000),
      daysUntilExpiry: 3,
      location: 'fridge',
      estimatedValue: 5.99,
      suggestedRecipes: [
        { id: 'r5', name: 'Yogurt Parfait', emoji: '🥣', usesItems: ['Greek Yogurt'], prepTime: '5 min' },
      ]
    },
    {
      id: '4',
      name: 'Ground Beef',
      emoji: '🥩',
      quantity: 1,
      unit: 'lb',
      expiryDate: new Date(Date.now() + 2 * 86400000),
      daysUntilExpiry: 2,
      location: 'fridge',
      estimatedValue: 6.99,
      suggestedRecipes: [
        { id: 'r6', name: 'Beef Tacos', emoji: '🌮', usesItems: ['Ground Beef'], prepTime: '20 min' },
        { id: 'r7', name: 'Spaghetti Bolognese', emoji: '🍝', usesItems: ['Ground Beef'], prepTime: '35 min' },
      ]
    },
    {
      id: '5',
      name: 'Bell Peppers',
      emoji: '🫑',
      quantity: 3,
      unit: 'pcs',
      expiryDate: new Date(Date.now() + 5 * 86400000),
      daysUntilExpiry: 5,
      location: 'fridge',
      estimatedValue: 4.50,
      suggestedRecipes: []
    },
    {
      id: '6',
      name: 'Salmon Fillet',
      emoji: '🐟',
      quantity: 1,
      unit: 'lb',
      expiryDate: new Date(Date.now() + 1 * 86400000),
      daysUntilExpiry: 1,
      location: 'fridge',
      estimatedValue: 12.99,
      suggestedRecipes: [
        { id: 'r8', name: 'Lemon Herb Salmon', emoji: '🍋', usesItems: ['Salmon Fillet'], prepTime: '25 min' },
        { id: 'r9', name: 'Salmon Bowl', emoji: '🍚', usesItems: ['Salmon Fillet'], prepTime: '30 min' },
      ]
    },
  ])

  const [familyMembers] = useState([
    { id: '1', name: 'You', avatar: '👨', restrictions: [], color: 'from-blue-500 to-blue-600' },
    { id: '2', name: 'Sarah', avatar: '👩', restrictions: ['Vegetarian'], color: 'from-pink-500 to-pink-600' },
    { id: '3', name: 'Jake', avatar: '👦', restrictions: ['Nut Allergy'], color: 'from-orange-500 to-orange-600' },
    { id: '4', name: 'Emma', avatar: '👧', restrictions: [], color: 'from-purple-500 to-purple-600' },
  ])

  // Track Google Ads conversion when user returns from successful checkout
  useEffect(() => {
    const upgraded = searchParams.get('upgraded')
    if (upgraded === 'true') {
      trackSubscriptionConversion('premium')
      const url = new URL(window.location.href)
      url.searchParams.delete('upgraded')
      window.history.replaceState({}, '', url.pathname)
    }
  }, [searchParams])

  // Generate meals on load
  const generateTodaysMeals = useCallback(async () => {
    setIsLoadingMeals(true)
    try {
      const response = await fetch('/api/generate-meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          householdId: household?.id || 'demo',
          familyMembers: familyMembers.map(m => ({
            id: m.id,
            name: m.name,
            calorie_goal: 2000,
            protein_goal: 50,
            carb_goal: 250,
            fat_goal: 70,
            dietary_restrictions: m.restrictions.filter(r => !r.includes('Allergy')),
            allergies: m.restrictions.filter(r => r.includes('Allergy')).map(a => ({ name: a.replace(' Allergy', ''), severity: 'severe' })),
          })),
          pantryItems: expiringItems.map(i => ({ name: i.name, quantity: i.quantity, unit: i.unit, expiry_date: i.expiryDate.toISOString() })),
          frozenMeals: frozenMeals.map(m => ({ ...m, frozenDate: new Date().toISOString(), protein: 30, carbs: 40, fat: 15 })),
          mealTypes: ['breakfast', 'lunch', 'dinner'],
          preferences: {
            maxPrepTime: 45,
            cookingSkill: 'intermediate',
          }
        })
      })

      const data = await response.json()

      if (data.success && data.meals) {
        setTodaysMeals(data.meals)
        if (data.userGoals) {
          setUserGoals(data.userGoals)
        }
      }
    } catch (error) {
      console.error('Error generating meals:', error)
      // Set fallback meals
      setTodaysMeals(generateFallbackMeals())
    }
    setIsLoadingMeals(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [household?.id])

  useEffect(() => {
    generateTodaysMeals()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Fallback meals generator
  function generateFallbackMeals(): TodaysMeal[] {
    const mealTypes: Array<'breakfast' | 'lunch' | 'dinner'> = ['breakfast', 'lunch', 'dinner']
    const fallbackData: Record<string, { name: string; emoji: string; calories: number; time: string }> = {
      breakfast: { name: 'Greek Yogurt Parfait', emoji: '🥣', calories: 350, time: '5 min' },
      lunch: { name: 'Mediterranean Quinoa Bowl', emoji: '🥗', calories: 520, time: '25 min' },
      dinner: { name: 'Sheet Pan Salmon with Vegetables', emoji: '🐟', calories: 480, time: '35 min' }
    }

    return mealTypes.map((type, index) => ({
      id: `meal-${index}`,
      mealType: type,
      scheduledTime: type === 'breakfast' ? '7:00 AM' : type === 'lunch' ? '12:00 PM' : '6:00 PM',
      status: 'ready' as const,
      selectedMeal: {
        id: `option-${index}`,
        name: fallbackData[type].name,
        description: 'A delicious and nutritious meal perfect for your family.',
        emoji: fallbackData[type].emoji,
        prepTime: '10 min',
        cookTime: '15 min',
        totalTime: fallbackData[type].time,
        calories: fallbackData[type].calories,
        protein: 25,
        carbs: 40,
        fat: 15,
        servings: 4,
        ingredients: [
          { name: 'Main ingredient', amount: '1 cup' },
          { name: 'Secondary ingredient', amount: '2 tbsp' },
        ],
        instructions: [
          'Prepare all ingredients',
          'Cook according to directions',
          'Serve and enjoy'
        ],
        tags: ['healthy', 'quick'],
        matchScore: 85
      },
      alternatives: [],
      portionMultiplier: 1,
      attendees: familyMembers.map(m => ({ id: m.id, name: m.name, avatar: m.avatar }))
    }))
  }

  const handleStartCooking = (meal: TodaysMeal) => {
    setCookingMeal(meal)
  }

  const handleMarkComplete = (mealId: string) => {
    setTodaysMeals(prev => prev.map(meal =>
      meal.id === mealId ? { ...meal, status: 'completed' as const } : meal
    ))
  }

  const handleSwapMeal = (mealId: string, newMeal: MealOption) => {
    setTodaysMeals(prev => prev.map(meal =>
      meal.id === mealId ? { ...meal, selectedMeal: newMeal } : meal
    ))
  }

  const handleCookingComplete = (mealId: string, rating?: number, notes?: string, batchCooked?: boolean, frozenPortions?: number) => {
    handleMarkComplete(mealId)

    // Track frozen portions
    if (batchCooked && frozenPortions && frozenPortions > 0) {
      const meal = todaysMeals.find(m => m.id === mealId)
      if (meal?.selectedMeal) {
        setFrozenMeals(prev => [...prev, {
          id: `frozen-${Date.now()}`,
          name: meal.selectedMeal!.name,
          portions: frozenPortions,
          emoji: meal.selectedMeal!.emoji,
          calories: meal.selectedMeal!.calories
        }])
      }
    }
  }

  const handleAddToGroceryList = (ingredients: Array<{ name: string; amount: string }>) => {
    // TODO: Integrate with grocery list API
    console.log('Adding to grocery list:', ingredients)
    window.location.href = '/dashboard/groceries'
  }

  const askAIChef = async (question: string) => {
    if (!question.trim()) return
    setAiLoading(true)
    try {
      const response = await fetch('/api/ai-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          pantryItems: expiringItems.map(i => i.name),
          familyMembers: familyMembers.map(m => ({ name: m.name, restrictions: m.restrictions }))
        })
      })
      const data = await response.json()
      setAiResponse(data.message || data.suggestion || 'Here are some meal ideas based on your pantry!')
    } catch {
      setAiResponse('I suggest trying Honey Garlic Chicken - it uses ingredients you have and takes only 30 minutes!')
    }
    setAiLoading(false)
    setAIInput('')
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Get next meal to cook
  const nextMeal = todaysMeals.find(m => m.status === 'ready' || m.status === 'upcoming')
  const completedMeals = todaysMeals.filter(m => m.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BestMealMate</span>
          </div>
        </div>

        {/* Navigation */}
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
              <span className="font-semibold">AI Chef</span>
            </div>
            <p className="text-sm text-white/80 mb-3">Get instant meal suggestions based on your pantry</p>
            <button
              onClick={() => setShowAIChef(true)}
              className="w-full py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Ask AI Chef
            </button>
          </div>
        </div>

        {/* Bottom Nav */}
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
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{greeting()}!</h1>
              <p className="text-gray-500">Your meals are ready for today</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button
                onClick={() => setShowAIChef(true)}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-medium hover:shadow-glow transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Ask AI Chef
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Today's Meals Section */}
          <TodaysMeals
            meals={todaysMeals}
            userGoals={userGoals}
            onStartCooking={handleStartCooking}
            onMarkComplete={handleMarkComplete}
            onSwapMeal={handleSwapMeal}
            onRegenerateMeals={generateTodaysMeals}
            isLoading={isLoadingMeals}
          />

          {/* Additional Sections */}
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Frozen Meals Inventory */}
              {frozenMeals.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Snowflake className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Frozen Meal Inventory</h3>
                      <p className="text-sm text-gray-500">{frozenMeals.reduce((sum, m) => sum + m.portions, 0)} portions available</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {frozenMeals.map((meal) => (
                      <div key={meal.id} className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{meal.emoji}</span>
                          <span className="font-medium text-gray-900 truncate">{meal.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{meal.calories} cal</span>
                          <span className="bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            {meal.portions} portions
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Family */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Your Family</h3>
                  </div>
                  <Link href="/dashboard/family" className="text-brand-600 text-sm font-medium hover:text-brand-700 flex items-center gap-1 hover:gap-2 transition-all">
                    Manage <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {familyMembers.map((member, i) => (
                    <div key={i} className="group text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center text-3xl mb-2 shadow-lg group-hover:scale-110 transition-transform cursor-pointer`}>
                        {member.avatar}
                      </div>
                      <p className="text-sm font-medium text-gray-700">{member.name}</p>
                      {member.restrictions.length > 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                          {member.restrictions[0]}
                        </span>
                      )}
                    </div>
                  ))}
                  <button className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all">
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Weekly Plan Link */}
              <Link href="/dashboard/plan" className="block bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl p-6 text-white hover:shadow-glow transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">View Weekly Plan</h3>
                      <p className="text-white/80">Plan your entire week&apos;s meals in advance</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6" />
                </div>
              </Link>
            </div>

            {/* Sidebar - Pantry Savings */}
            <div className="space-y-6">
              {/* Smart Pantry Savings */}
              <PantrySuggestions
                expiringItems={expiringItems}
                savingsThisMonth={savingsThisMonth}
                wastedThisMonth={wastedThisMonth}
                onUseItem={(itemId, recipeId) => {
                  console.log('Using item:', itemId, 'for recipe:', recipeId)
                  // Navigate to recipe or mark as used
                }}
                onDismissItem={(itemId) => {
                  console.log('Dismissing item:', itemId)
                }}
                onGenerateRecipe={(items) => {
                  setShowAIChef(true)
                  askAIChef('Create a recipe using: ' + items.map(i => i.name).join(', '))
                }}
              />

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Plus, label: 'Add to Pantry', color: 'from-brand-500 to-emerald-500', href: '/dashboard/pantry' },
                    { icon: ChefHat, label: 'Browse Recipes', color: 'from-purple-500 to-pink-500', href: '/dashboard/recipes' },
                    { icon: ShoppingCart, label: 'Grocery List', color: 'from-orange-500 to-amber-500', href: '/dashboard/groceries' },
                    { icon: Users, label: 'Manage Family', color: 'from-blue-500 to-cyan-500', href: '/dashboard/family' },
                  ].map((action, i) => (
                    <Link
                      key={i}
                      href={action.href}
                      className="group p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all text-center"
                    >
                      <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chef Modal */}
      {showAIChef && (
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
                    <h3 className="font-bold text-lg">AI Chef</h3>
                    <p className="text-sm text-white/80">Your personal meal assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIChef(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mb-5 border border-purple-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    {aiLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {aiLoading ? (
                        'Thinking of the perfect meal for you...'
                      ) : aiResponse ? (
                        aiResponse
                      ) : (
                        <>Based on your pantry and family preferences, I suggest <strong className="text-purple-700">Honey Garlic Chicken</strong> for tonight. It uses your chicken that expires tomorrow, takes 30 minutes, and everyone in your family can eat it!</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <Link href="/dashboard/plan" className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add to Plan
                </Link>
                <Link href="/dashboard/recipes" className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  View Recipe
                </Link>
                <button
                  onClick={() => askAIChef('Suggest another meal for my family')}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Suggest Another
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAIInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askAIChef(aiInput)}
                  placeholder="Ask me anything about meals..."
                  className="w-full px-5 py-4 pr-14 rounded-2xl border border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                />
                <button
                  onClick={() => askAIChef(aiInput)}
                  disabled={aiLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {['What can I make with chicken?', 'Quick 20-min meals', 'Kid-friendly dinners'].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => askAIChef(suggestion)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 lg:hidden safe-area-pb">
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

      {/* Cooking Mode */}
      {cookingMeal && (
        <CookingMode
          meal={cookingMeal}
          onClose={() => setCookingMeal(null)}
          onComplete={handleCookingComplete}
          onAddToGroceryList={handleAddToGroceryList}
        />
      )}
    </div>
  )
}
