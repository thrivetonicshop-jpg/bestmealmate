'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Camera,
  ChefHat,
  Refrigerator,
  Calendar,
  ShoppingCart,
  Users,
  Settings,
  ArrowLeft,
  Sparkles,
  Zap
} from 'lucide-react'
import ScanAndCook from '@/components/ScanAndCook'

const navItems = [
  { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: false },
  { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: false },
  { icon: ShoppingCart, label: 'Groceries', href: '/dashboard/groceries', active: false },
  { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
  { icon: Camera, label: 'Scan & Cook', href: '/dashboard/scan-and-cook', active: true },
  { icon: Users, label: 'Family', href: '/dashboard/family', active: false },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', active: false },
]

export default function ScanAndCookPage() {
  const [showScanner, setShowScanner] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 z-40">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BestMealMate</span>
          </Link>
        </div>

        <nav className="mt-4 px-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                item.active
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Camera className="w-7 h-7 text-brand-600" />
                    Scan & Cook
                  </h1>
                  <p className="text-gray-500">Turn your ingredients into delicious meals</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-600 rounded-3xl p-8 lg:p-12 text-white mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="text-white/90 font-medium">AI-Powered</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Snap a photo, get a meal!
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Take pictures of your fridge, pantry, cabinets, and spices. Our AI will identify
                all your ingredients and suggest delicious meals you can cook right now.
              </p>
              <button
                onClick={() => setShowScanner(true)}
                className="px-8 py-4 bg-white text-brand-600 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-gray-100 transition-colors shadow-xl"
              >
                <Camera className="w-6 h-6" />
                Start Scanning
                <Zap className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">How it works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: 1,
                  title: 'Scan Your Kitchen',
                  description: 'Take photos of your fridge, pantry, cabinets, and spice rack',
                  icon: Camera,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  step: 2,
                  title: 'AI Identifies Ingredients',
                  description: 'Claude AI recognizes all visible food items and ingredients',
                  icon: Sparkles,
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  step: 3,
                  title: 'Get Meal Ideas',
                  description: 'Receive personalized meal suggestions based on what you have',
                  icon: ChefHat,
                  color: 'from-brand-500 to-emerald-500'
                }
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                      {item.step}
                    </span>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Tips for best results
            </h3>
            <ul className="space-y-2 text-amber-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Take photos in good lighting so AI can clearly see all items
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Open drawers and doors fully to capture everything
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Include your spice rack - seasonings unlock more recipe options!
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Scan multiple locations for the most meal suggestions
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 lg:hidden">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                item.active
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Scanner Modal */}
      {showScanner && (
        <ScanAndCook
          onClose={() => setShowScanner(false)}
          onSelectMeal={(meal) => {
            console.log('Selected meal:', meal)
          }}
        />
      )}
    </div>
  )
}
