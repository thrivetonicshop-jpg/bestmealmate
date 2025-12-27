'use client'

import { useState } from 'react'
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
  Send
} from 'lucide-react'

// Mock data - replace with Supabase queries
const mockMealPlan = [
  { day: 'Today', meal: 'Sheet Pan Chicken & Veggies', time: '35 min', status: 'ready', calories: 450, image: '🍗' },
  { day: 'Tomorrow', meal: 'Beef Tacos', time: '25 min', status: 'planned', calories: 520, image: '🌮' },
  { day: 'Wednesday', meal: 'Pasta Primavera', time: '30 min', status: 'planned', calories: 380, image: '🍝' },
  { day: 'Thursday', meal: 'Grilled Salmon', time: '25 min', status: 'planned', calories: 420, image: '🐟' },
]

const mockExpiring = [
  { name: 'Chicken Breast', days: 1, location: 'Fridge', emoji: '🍗' },
  { name: 'Spinach', days: 2, location: 'Fridge', emoji: '🥬' },
  { name: 'Greek Yogurt', days: 3, location: 'Fridge', emoji: '🥛' },
]

const mockGroceryItems = [
  { name: 'Onions', quantity: '3', checked: false, aisle: 'Produce' },
  { name: 'Bell Peppers', quantity: '4', checked: false, aisle: 'Produce' },
  { name: 'Ground Beef', quantity: '2 lbs', checked: true, aisle: 'Meat' },
  { name: 'Tortillas', quantity: '1 pack', checked: false, aisle: 'Bakery' },
  { name: 'Cheese', quantity: '1 block', checked: false, aisle: 'Dairy' },
]

const mockFamily = [
  { name: 'You', avatar: '👨', restrictions: [], color: 'from-blue-500 to-blue-600' },
  { name: 'Sarah', avatar: '👩', restrictions: ['Vegetarian'], color: 'from-pink-500 to-pink-600' },
  { name: 'Jake', avatar: '👦', restrictions: ['Nut Allergy'], color: 'from-orange-500 to-orange-600' },
  { name: 'Emma', avatar: '👧', restrictions: [], color: 'from-purple-500 to-purple-600' },
]

const navItems = [
  { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: true },
  { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries', active: false },
  { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
  { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: false },
  { icon: Users, label: 'Family', href: '/dashboard/family', active: false },
]

export default function DashboardPage() {
  const [showAIChef, setShowAIChef] = useState(false)
  const [aiInput, setAIInput] = useState('')

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

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
              <p className="text-gray-500">Here's what's cooking this week</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors lg:hidden">
                <Search className="w-5 h-5 text-gray-600" />
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
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Meals Planned', value: '7', icon: Calendar, color: 'from-brand-500 to-emerald-500' },
              { label: 'Grocery Items', value: '12', icon: ShoppingCart, color: 'from-blue-500 to-cyan-500' },
              { label: 'Pantry Items', value: '24', icon: Refrigerator, color: 'from-orange-500 to-amber-500' },
              { label: 'Saved Recipes', value: '18', icon: Heart, color: 'from-pink-500 to-rose-500' },
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

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Column - Meal Plan */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tonight's Dinner - Hero Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-emerald-500 rounded-3xl p-6 lg:p-8 text-white">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                <div className="relative">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
                        {mockMealPlan[0].image}
                      </div>
                      <div>
                        <p className="text-white/70 text-sm font-medium mb-1 flex items-center gap-2">
                          <Flame className="w-4 h-4" />
                          Tonight's Dinner
                        </p>
                        <h2 className="text-2xl lg:text-3xl font-bold">{mockMealPlan[0].meal}</h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                        <Timer className="w-4 h-4" />
                        <span className="font-medium">{mockMealPlan[0].time}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                        <Flame className="w-4 h-4" />
                        <span className="font-medium">{mockMealPlan[0].calories} cal</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm w-fit">
                    <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90">You have all the ingredients ready!</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 bg-white text-brand-700 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg">
                      <UtensilsCrossed className="w-5 h-5" />
                      Start Cooking
                    </button>
                    <button className="px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl font-medium hover:bg-white/30 transition-all">
                      Swap Meal
                    </button>
                    <button className="px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl font-medium hover:bg-white/30 transition-all">
                      View Recipe
                    </button>
                  </div>
                </div>
              </div>

              {/* This Week */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-brand-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">This Week's Menu</h3>
                  </div>
                  <Link href="/dashboard/plan" className="text-brand-600 text-sm font-medium hover:text-brand-700 flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {mockMealPlan.map((meal, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer ${
                        i === 0
                          ? 'bg-gradient-to-r from-brand-50 to-emerald-50 border border-brand-100'
                          : 'hover:bg-gray-50 border border-transparent hover:border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl">
                          {meal.image}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{meal.meal}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-500">{meal.day}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {meal.time}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{meal.calories} cal</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Family */}
              <div className="card p-6">
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
                  {mockFamily.map((member, i) => (
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Expiring Soon */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Expiring Soon</h3>
                    <p className="text-sm text-gray-500">Use these first</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {mockExpiring.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.location}</p>
                      </div>
                      <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${
                        item.days <= 1
                          ? 'bg-red-100 text-red-700'
                          : item.days <= 2
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.days === 1 ? 'Tomorrow' : `${item.days} days`}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 text-brand-600 font-semibold text-sm hover:text-brand-700 transition-colors flex items-center justify-center gap-2 bg-brand-50 rounded-xl hover:bg-brand-100">
                  <Sparkles className="w-4 h-4" />
                  Get recipe suggestions
                </button>
              </div>

              {/* Grocery List Preview */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Grocery List</h3>
                      <p className="text-sm text-gray-500">{mockGroceryItems.filter(i => !i.checked).length} items remaining</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-700">
                      {mockGroceryItems.filter(i => i.checked).length}/{mockGroceryItems.length}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${(mockGroceryItems.filter(i => i.checked).length / mockGroceryItems.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {mockGroceryItems.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <button className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        item.checked
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'border-gray-300 hover:border-brand-400'
                      }`}>
                        {item.checked && <Check className="w-4 h-4" />}
                      </button>
                      <span className={`flex-1 ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/groceries" className="block w-full mt-4 py-3 text-center text-white font-semibold text-sm rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg transition-all">
                  View Full List
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Plus, label: 'Add to Pantry', color: 'from-brand-500 to-emerald-500', href: '/dashboard/pantry' },
                    { icon: ChefHat, label: 'Browse Recipes', color: 'from-purple-500 to-pink-500', href: '/dashboard/recipes' },
                    { icon: ShoppingCart, label: 'Order Groceries', color: 'from-orange-500 to-amber-500', href: '/dashboard/groceries' },
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
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Based on your pantry and family preferences, I suggest <strong className="text-purple-700">Honey Garlic Chicken</strong> for tonight.
                      It uses your chicken that expires tomorrow, takes 30 minutes, and everyone in your family can eat it!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <button className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add to Plan
                </button>
                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  View Recipe
                </button>
                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  Suggest Another
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAIInput(e.target.value)}
                  placeholder="Ask me anything about meals..."
                  className="w-full px-5 py-4 pr-14 rounded-2xl border border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all">
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {['What can I make with chicken?', 'Quick 20-min meals', 'Kid-friendly dinners'].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setAIInput(suggestion)}
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
    </div>
  )
}
