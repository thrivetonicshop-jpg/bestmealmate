'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChefHat,
  Calendar,
  ShoppingCart,
  Refrigerator,
  Users,
  Settings,
  LogOut,
  Bell,
  CreditCard,
  Shield,
  Palette,
  Globe,
  Trash2,
  Check,
  ChevronRight,
  Crown
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function SettingsPage() {
  const [household, setHousehold] = useState({
    name: 'The Smith Family',
    timezone: 'America/New_York',
    preferred_store: 'Whole Foods',
    subscription_tier: 'premium' as 'free' | 'premium' | 'family'
  })

  const [notifications, setNotifications] = useState({
    expiry_reminders: true,
    meal_reminders: true,
    grocery_reminders: true,
    email_notifications: true,
    push_notifications: true
  })

  const [theme, setTheme] = useState('system')

  function handleSave() {
    toast.success('Settings saved')
  }

  const subscriptionInfo = {
    free: {
      name: 'Free',
      price: '$0',
      features: ['Up to 2 family members', 'Basic meal suggestions', '7-day meal planning']
    },
    premium: {
      name: 'Premium',
      price: '$9.99/mo',
      features: ['Up to 6 family members', 'AI-powered meal planning', 'Unlimited recipes', 'Grocery list sync']
    },
    family: {
      name: 'Family',
      price: '$14.99/mo',
      features: ['Unlimited family members', 'Priority AI suggestions', 'Multi-household support', 'Premium support']
    }
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
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 bg-brand-50 text-brand-700 rounded-lg transition-colors">
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
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </header>

        <div className="max-w-3xl space-y-6">
          {/* Subscription */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Subscription</h2>
                  <p className="text-sm text-gray-500">Manage your plan and billing</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Current Plan</p>
                  <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {subscriptionInfo[household.subscription_tier].name}
                    {household.subscription_tier !== 'free' && (
                      <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full">Active</span>
                    )}
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {subscriptionInfo[household.subscription_tier].price}
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                {subscriptionInfo[household.subscription_tier].features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {household.subscription_tier === 'free' ? (
                <button className="w-full py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                  Upgrade to Premium
                </button>
              ) : (
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Manage Subscription
                  </button>
                  {household.subscription_tier === 'premium' && (
                    <button className="flex-1 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                      Upgrade to Family
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Household Settings */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Household</h2>
                  <p className="text-sm text-gray-500">General household settings</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Household Name</label>
                <input
                  type="text"
                  value={household.name}
                  onChange={(e) => setHousehold({ ...household, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select
                  value={household.timezone}
                  onChange={(e) => setHousehold({ ...household, timezone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Grocery Store</label>
                <input
                  type="text"
                  value={household.preferred_store}
                  onChange={(e) => setHousehold({ ...household, preferred_store: e.target.value })}
                  placeholder="e.g., Whole Foods, Costco, Trader Joe's"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-500">Choose what alerts you receive</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { key: 'expiry_reminders', label: 'Expiry Reminders', desc: 'Get notified when food is about to expire' },
                { key: 'meal_reminders', label: 'Meal Reminders', desc: 'Daily reminders about planned meals' },
                { key: 'grocery_reminders', label: 'Grocery Reminders', desc: 'Reminders to check your grocery list' },
                { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'push_notifications', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-brand-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Appearance</h2>
                  <p className="text-sm text-gray-500">Customize how the app looks</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="flex gap-2">
                {['light', 'dark', 'system'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                      theme === t
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Privacy & Security</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Payment Methods</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Language & Region</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
            <div className="p-6 border-b border-red-100 bg-red-50">
              <h2 className="font-semibold text-red-700">Danger Zone</h2>
              <p className="text-sm text-red-600">Irreversible actions</p>
            </div>
            <div className="p-6 space-y-4">
              <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                <Trash2 className="w-5 h-5" />
                Delete all data
              </button>
              <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                <Trash2 className="w-5 h-5" />
                Delete account
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Calendar, label: 'Plan', href: '/dashboard', active: false },
            { icon: ShoppingCart, label: 'Groceries', href: '/dashboard/groceries', active: false },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
            { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: false },
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
