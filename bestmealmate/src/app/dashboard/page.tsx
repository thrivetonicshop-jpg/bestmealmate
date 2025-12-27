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
  LogOut
} from 'lucide-react'

// Mock data - replace with Supabase queries
const mockMealPlan = [
  { day: 'Today', meal: 'Sheet Pan Chicken & Veggies', time: '35 min', status: 'ready' },
  { day: 'Tomorrow', meal: 'Beef Tacos', time: '25 min', status: 'planned' },
  { day: 'Wednesday', meal: 'Pasta Primavera', time: '30 min', status: 'planned' },
]

const mockExpiring = [
  { name: 'Chicken Breast', days: 1, location: 'Fridge' },
  { name: 'Spinach', days: 2, location: 'Fridge' },
  { name: 'Greek Yogurt', days: 3, location: 'Fridge' },
]

const mockGroceryItems = [
  { name: 'Onions', quantity: '3', checked: false },
  { name: 'Bell Peppers', quantity: '4', checked: false },
  { name: 'Ground Beef', quantity: '2 lbs', checked: true },
  { name: 'Tortillas', quantity: '1 pack', checked: false },
]

const mockFamily = [
  { name: 'You', avatar: '👨', restrictions: [] },
  { name: 'Sarah', avatar: '👩', restrictions: ['Vegetarian'] },
  { name: 'Jake', avatar: '👦', restrictions: ['Nut Allergy'] },
  { name: 'Emma', avatar: '👧', restrictions: [] },
]

export default function DashboardPage() {
  const [showAIChef, setShowAIChef] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold text-gray-900">BestMealMate</span>
        </div>
        
        <nav className="space-y-1">
          {[
            { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: true },
            { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries', active: false },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
            { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: false },
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
      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good evening!</h1>
            <p className="text-gray-600">Here's what's cooking this week</p>
          </div>
          <button
            onClick={() => setShowAIChef(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Ask AI Chef
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column - Meal Plan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tonight's Dinner - Hero Card */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-brand-100 text-sm font-medium mb-1">Tonight's Dinner</p>
                  <h2 className="text-2xl font-bold">{mockMealPlan[0].meal}</h2>
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{mockMealPlan[0].time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-brand-200" />
                <span className="text-brand-100">You have all the ingredients</span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-white text-brand-700 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-colors">
                  Start Cooking
                </button>
                <button className="px-4 py-3 bg-white/20 rounded-xl font-medium hover:bg-white/30 transition-colors">
                  Swap Meal
                </button>
              </div>
            </div>

            {/* This Week */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">This Week</h3>
                <Link href="/dashboard/plan" className="text-brand-600 text-sm font-medium hover:text-brand-700 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {mockMealPlan.map((meal, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-brand-50' : 'hover:bg-gray-50'} transition-colors`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{meal.meal}</p>
                        <p className="text-sm text-gray-500">{meal.day} • {meal.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Family */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Family</h3>
                <Link href="/dashboard/family" className="text-brand-600 text-sm font-medium hover:text-brand-700 flex items-center gap-1">
                  Manage <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex items-center gap-4">
                {mockFamily.map((member, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-1">
                      {member.avatar}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{member.name}</p>
                    {member.restrictions.length > 0 && (
                      <p className="text-xs text-gray-500">{member.restrictions[0]}</p>
                    )}
                  </div>
                ))}
                <button className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Expiring Soon */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Expiring Soon</h3>
              </div>
              <div className="space-y-3">
                {mockExpiring.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                    <span className={`text-sm font-medium ${item.days <= 1 ? 'text-red-600' : 'text-amber-600'}`}>
                      {item.days === 1 ? 'Tomorrow' : `${item.days} days`}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-brand-600 font-medium text-sm hover:text-brand-700 transition-colors">
                Use these first →
              </button>
            </div>

            {/* Grocery List Preview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Grocery List</h3>
                <span className="text-sm text-gray-500">{mockGroceryItems.filter(i => !i.checked).length} items</span>
              </div>
              <div className="space-y-2">
                {mockGroceryItems.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      item.checked 
                        ? 'bg-brand-600 border-brand-600 text-white' 
                        : 'border-gray-300 hover:border-brand-400'
                    }`}>
                      {item.checked && <Check className="w-3 h-3" />}
                    </button>
                    <span className={`flex-1 ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500">{item.quantity}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/groceries" className="block w-full mt-4 py-2 text-center text-brand-600 font-medium text-sm hover:text-brand-700 transition-colors">
                View Full List →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-brand-600" />
                  </div>
                  <span className="font-medium text-gray-700">Add to Pantry</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Browse Recipes</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="font-medium text-gray-700">Order Groceries</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chef Modal */}
      {showAIChef && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Chef</h3>
                  <p className="text-sm text-gray-500">Ask me anything about meals</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAIChef(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl text-gray-400">&times;</span>
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-gray-600">
                Based on your pantry and family preferences, I suggest <strong>Honey Garlic Chicken</strong> for tonight. 
                It uses your chicken that expires tomorrow, takes 30 minutes, and everyone in your family can eat it!
              </p>
            </div>
            
            <div className="flex gap-2 mb-4">
              <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                Add to Plan
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Show Recipe
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Suggest Another
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <input
                type="text"
                placeholder="Ask me anything... (e.g., 'What can I make with chicken?')"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Calendar, label: 'Plan', active: true },
            { icon: ShoppingCart, label: 'Groceries', active: false },
            { icon: Refrigerator, label: 'Pantry', active: false },
            { icon: ChefHat, label: 'Recipes', active: false },
            { icon: Users, label: 'Family', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                item.active ? 'text-brand-600' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
