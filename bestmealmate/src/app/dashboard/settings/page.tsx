'use client'

import { useState, useEffect } from 'react'
import {
  Settings,
  User,
  Home,
  Bell,
  CreditCard,
  Shield,
  Moon,
  Sun,
  Check,
  ChevronRight,
  LogOut,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuthStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
]

const GROCERY_STORES = [
  'Walmart',
  'Target',
  'Kroger',
  'Costco',
  'Whole Foods',
  'Trader Joe\'s',
  'Safeway',
  'Publix',
  'Aldi',
  'Other',
]

export default function SettingsPage() {
  const router = useRouter()
  const { user, household, setHousehold } = useAuthStore()

  const [activeSection, setActiveSection] = useState('household')
  const [isLoading, setIsLoading] = useState(false)

  // Household settings
  const [householdName, setHouseholdName] = useState(household?.name || '')
  const [timezone, setTimezone] = useState(household?.timezone || 'America/New_York')
  const [preferredStore, setPreferredStore] = useState(household?.preferred_grocery_store || '')

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [expiryAlerts, setExpiryAlerts] = useState(true)
  const [mealReminders, setMealReminders] = useState(true)

  useEffect(() => {
    if (household) {
      setHouseholdName(household.name)
      setTimezone(household.timezone)
      setPreferredStore(household.preferred_grocery_store || '')
    }
  }, [household])

  const handleSaveHousehold = async () => {
    if (!household?.id) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/household', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: household.id,
          name: householdName.trim(),
          timezone,
          preferredGroceryStore: preferredStore || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setHousehold(data.household)
      toast.success('Settings saved')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    if (!confirm('This will delete all your data including meal plans, recipes, and family members. Are you absolutely sure?')) return

    toast.error('Account deletion is not implemented yet')
  }

  const sections = [
    { id: 'household', label: 'Household', icon: Home },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'account', label: 'Account', icon: User },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your household and account preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b last:border-b-0",
                    activeSection === section.id
                      ? "bg-brand-50 text-brand-700 border-l-4 border-l-brand-600"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Household Settings */}
            {activeSection === 'household' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Household Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Household Name
                    </label>
                    <input
                      type="text"
                      value={householdName}
                      onChange={(e) => setHouseholdName(e.target.value)}
                      placeholder="The Smith Family"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Grocery Store
                    </label>
                    <select
                      value={preferredStore}
                      onChange={(e) => setPreferredStore(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    >
                      <option value="">Select a store</option>
                      {GROCERY_STORES.map((store) => (
                        <option key={store} value={store}>
                          {store}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSaveHousehold}
                    disabled={isLoading}
                    className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>

                <div className="space-y-4">
                  <ToggleSetting
                    label="Email Notifications"
                    description="Receive weekly meal plan summaries and tips"
                    checked={emailNotifications}
                    onChange={setEmailNotifications}
                  />
                  <ToggleSetting
                    label="Push Notifications"
                    description="Get reminders on your device"
                    checked={pushNotifications}
                    onChange={setPushNotifications}
                  />
                  <ToggleSetting
                    label="Expiry Alerts"
                    description="Notifications when food is about to expire"
                    checked={expiryAlerts}
                    onChange={setExpiryAlerts}
                  />
                  <ToggleSetting
                    label="Meal Reminders"
                    description="Daily reminders about planned meals"
                    checked={mealReminders}
                    onChange={setMealReminders}
                  />
                </div>

                <button
                  onClick={() => toast.success('Notification preferences saved')}
                  className="mt-6 px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Preferences
                </button>
              </div>
            )}

            {/* Subscription */}
            {activeSection === 'subscription' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Subscription</h2>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Current Plan</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      household?.subscription_tier === 'family' ? "bg-purple-100 text-purple-700" :
                      household?.subscription_tier === 'premium' ? "bg-brand-100 text-brand-700" :
                      "bg-gray-200 text-gray-700"
                    )}>
                      {household?.subscription_tier === 'family' ? 'Family' :
                       household?.subscription_tier === 'premium' ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  {household?.subscription_tier === 'free' && (
                    <p className="text-sm text-gray-500">
                      Upgrade to unlock AI Chef, unlimited recipes, and more features!
                    </p>
                  )}
                </div>

                {household?.subscription_tier === 'free' ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900">Premium</h3>
                      <p className="text-2xl font-bold text-gray-900 mt-2">$9.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                      <ul className="mt-4 space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600" /> AI Chef suggestions</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600" /> Up to 4 family members</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-600" /> Smart grocery lists</li>
                      </ul>
                      <button className="w-full mt-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700">
                        Upgrade
                      </button>
                    </div>
                    <div className="border-2 border-purple-300 rounded-xl p-4 bg-purple-50">
                      <h3 className="font-semibold text-gray-900">Family</h3>
                      <p className="text-2xl font-bold text-gray-900 mt-2">$14.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                      <ul className="mt-4 space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Everything in Premium</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Unlimited family members</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Calendar sync</li>
                      </ul>
                      <button className="w-full mt-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                        Upgrade
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Manage subscription
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Account Settings */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
                      />
                    </div>

                    <button className="text-brand-600 text-sm font-medium hover:text-brand-700">
                      Change password
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>

                  <div className="space-y-3">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-700">Sign Out</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button
                      onClick={handleDeleteAccount}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                        <span className="font-medium text-gray-700 group-hover:text-red-600">Delete Account</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Toggle Setting Component
function ToggleSetting({
  label,
  description,
  checked,
  onChange
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-12 h-6 rounded-full transition-colors",
          checked ? "bg-brand-600" : "bg-gray-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
            checked ? "translate-x-6" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  )
}
