'use client'

import { useState, useEffect, useCallback } from 'react'
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
  Crown,
  Loader2,
  Download,
  Upload,
  Moon,
  Sun,
  Monitor,
  Save,
  ExternalLink
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/lib/auth-context'
import ReferralProgram from '@/components/ReferralProgram'
import { saveUserPreferences, getUserPreferences, getLoginHistory, type UserPreferences, type LoginHistoryEntry } from '@/lib/supabase'

export default function SettingsPage() {
  const { user, household, signOut, exportUserData, createBackup } = useAuth()

  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    email_notifications: true,
    push_notifications: true,
    favorite_cuisines: [],
    cooking_skill_level: 'intermediate',
    max_prep_time_minutes: 60,
    default_servings: 4,
  })

  const [notifications, setNotifications] = useState({
    expiry_reminders: true,
    meal_reminders: true,
    grocery_reminders: true,
    email_notifications: true,
    push_notifications: true
  })

  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [backingUp, setBackingUp] = useState(false)
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([])
  const [managingBilling, setManagingBilling] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const loadPreferences = useCallback(async () => {
    if (!user?.id) return
    try {
      const data = await getUserPreferences(user.id)
      if (data) {
        setPreferences(prev => ({ ...prev, ...data }))
        setNotifications({
          expiry_reminders: true,
          meal_reminders: true,
          grocery_reminders: true,
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? true,
        })
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }, [user?.id])

  const loadLoginHistory = useCallback(async () => {
    if (!user?.id) return
    try {
      const data = await getLoginHistory(user.id, 5)
      setLoginHistory(data)
    } catch (error) {
      console.error('Error loading login history:', error)
    }
  }, [user?.id])

  // Load preferences on mount
  useEffect(() => {
    if (user?.id) {
      loadPreferences()
      loadLoginHistory()
    }
  }, [user?.id, loadPreferences, loadLoginHistory])

  // Handle checkout cancelled message
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') === 'cancelled') {
      toast('Checkout cancelled. You can upgrade anytime!', { icon: 'ℹ️' })
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/settings')
    }
  }, [])

  // Apply theme
  useEffect(() => {
    const applyTheme = (theme: string) => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        // System preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
    applyTheme(preferences.theme || 'system')
  }, [preferences.theme])

  async function handleUpgrade(tier: 'premium' | 'family') {
    setUpgrading(tier)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          householdId: household?.id,
          tier: tier,
          email: user?.email,
        }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      toast.error('Failed to start checkout. Please try again.')
      console.error('Checkout error:', error)
    } finally {
      setUpgrading(null)
    }
  }

  async function handleSave() {
    if (!user?.id || !household?.id) return
    setSaving(true)
    try {
      await saveUserPreferences(user.id, household.id, {
        ...preferences,
        email_notifications: notifications.email_notifications,
        push_notifications: notifications.push_notifications,
      })
      toast.success('Settings saved')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    }
    setSaving(false)
  }

  async function handleExportData() {
    setExporting(true)
    try {
      const data = await exportUserData()
      if (data) {
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bestmealmate-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Data exported successfully')
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    }
    setExporting(false)
  }

  async function handleBackup() {
    setBackingUp(true)
    try {
      await createBackup()
      toast.success('Backup created successfully')
    } catch (error) {
      console.error('Error creating backup:', error)
      toast.error('Failed to create backup')
    }
    setBackingUp(false)
  }

  async function handleManageBilling() {
    if (!household?.stripe_customer_id) {
      toast.error('No billing account found')
      return
    }
    setManagingBilling(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: household.stripe_customer_id,
          returnUrl: window.location.href,
        }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Failed to open billing portal')
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
      toast.error('Failed to open billing portal')
    }
    setManagingBilling(false)
  }

  async function handleDeleteAccount() {
    if (!user?.id) return
    setDeletingAccount(true)
    try {
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Account deletion scheduled')
        await signOut()
      } else {
        toast.error(data.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    }
    setDeletingAccount(false)
    setShowDeleteConfirm(false)
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

  const currentTier = household?.subscription_tier || 'free'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">BestMealMate</span>
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
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-1">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 bg-brand-50 text-brand-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
        </header>

        <div className="max-w-3xl space-y-6">
          {/* Subscription */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Subscription</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your plan and billing</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {subscriptionInfo[currentTier as keyof typeof subscriptionInfo].name}
                    {currentTier !== 'free' && (
                      <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full">Active</span>
                    )}
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {subscriptionInfo[currentTier as keyof typeof subscriptionInfo].price}
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                {subscriptionInfo[currentTier as keyof typeof subscriptionInfo].features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {currentTier === 'free' ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleUpgrade('premium')}
                    disabled={upgrading !== null}
                    className="w-full py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {upgrading === 'premium' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Upgrade to Premium - $9.99/mo'
                    )}
                  </button>
                  <button
                    onClick={() => handleUpgrade('family')}
                    disabled={upgrading !== null}
                    className="w-full py-2 border border-brand-600 text-brand-600 rounded-lg font-medium hover:bg-brand-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {upgrading === 'family' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Upgrade to Family - $14.99/mo'
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleManageBilling}
                  disabled={managingBilling}
                  className="w-full py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {managingBilling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Manage Billing
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Referral Program */}
          {user?.id && (
            <ReferralProgram userId={user.id} />
          )}

          {/* Appearance / Theme */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Appearance</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customize how the app looks</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setPreferences({ ...preferences, theme: theme.id as 'light' | 'dark' | 'system' })}
                    className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl font-medium transition-all ${
                      preferences.theme === theme.id
                        ? 'bg-brand-600 text-white ring-2 ring-brand-600 ring-offset-2'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <theme.icon className="w-6 h-6" />
                    <span>{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Notifications</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Choose what alerts you receive</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {[
                { key: 'expiry_reminders', label: 'Expiry Reminders', desc: 'Get notified when food is about to expire' },
                { key: 'meal_reminders', label: 'Meal Reminders', desc: 'Daily reminders about planned meals' },
                { key: 'grocery_reminders', label: 'Grocery Reminders', desc: 'Reminders to check your grocery list' },
                { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'push_notifications', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'
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

          {/* Data & Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Data & Privacy</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your data</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Export My Data</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Download all your data as JSON</p>
                  </div>
                </div>
                {exporting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <button
                onClick={handleBackup}
                disabled={backingUp}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Create Backup</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Save a snapshot of your profile</p>
                  </div>
                </div>
                {backingUp ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Login History */}
          {loginHistory.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Recent Logins</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your login activity</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {loginHistory.map((login) => (
                  <div key={login.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {login.device_type || 'Unknown'} • {login.login_method || 'Email'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(login.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Payment Methods</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Language & Region</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 overflow-hidden">
            <div className="p-6 border-b border-red-100 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <h2 className="font-semibold text-red-700 dark:text-red-400">Danger Zone</h2>
              <p className="text-sm text-red-600 dark:text-red-400">Irreversible actions</p>
            </div>
            <div className="p-6 space-y-4">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete account
                </button>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    Are you sure? This will permanently delete your account and all data. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deletingAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {deletingAccount ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Yes, delete my account'
                      )}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden">
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
