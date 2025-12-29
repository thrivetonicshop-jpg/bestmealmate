'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  ChefHat,
  ShoppingCart,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Home,
  Settings,
  UtensilsCrossed,
  Package,
  UserCircle,
  Clock,
  DollarSign,
  Percent
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  premiumUsers: number
  familyUsers: number
  mrr: number
  mrrGrowth: number
  churnRate: number
  avgSessionDuration: number
  mealsPlanned: number
  recipesGenerated: number
  groceryListsCreated: number
  aiChefQueries: number
}

interface ChartData {
  label: string
  value: number
}

export default function AdminDashboard() {
  const { user, household } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  // Check if user is admin (in production, check against admin role)
  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('bestmealmate')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  async function loadAnalytics() {
    setLoading(true)

    // Simulated analytics data - in production, fetch from API
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockData: AnalyticsData = {
      totalUsers: 12847,
      activeUsers: 8234,
      premiumUsers: 2156,
      familyUsers: 1423,
      mrr: 47832,
      mrrGrowth: 12.4,
      churnRate: 2.3,
      avgSessionDuration: 8.5,
      mealsPlanned: 45672,
      recipesGenerated: 23451,
      groceryListsCreated: 12893,
      aiChefQueries: 34521
    }

    setAnalytics(mockData)
    setLoading(false)
  }

  const userGrowthData: ChartData[] = [
    { label: 'Week 1', value: 11234 },
    { label: 'Week 2', value: 11567 },
    { label: 'Week 3', value: 12012 },
    { label: 'Week 4', value: 12847 }
  ]

  const revenueData: ChartData[] = [
    { label: 'Week 1', value: 42100 },
    { label: 'Week 2', value: 44200 },
    { label: 'Week 3', value: 45800 },
    { label: 'Week 4', value: 47832 }
  ]

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/recipes', icon: UtensilsCrossed, label: 'Recipes' },
    { href: '/dashboard/pantry', icon: Package, label: 'Pantry' },
    { href: '/dashboard/family', icon: UserCircle, label: 'Family' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' }
  ]

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">You don&apos;t have permission to view this page.</p>
          <Link href="/dashboard" className="text-brand-600 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-brand-600" />
          <span className="font-bold text-xl text-gray-900 dark:text-white">Admin Panel</span>
        </div>

        <nav className="space-y-1">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300"
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Overview of your platform metrics</p>
          </div>
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="w-4 h-4" />
                    8.2%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="w-4 h-4" />
                    5.1%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.activeUsers.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Users (DAU)</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="flex items-center text-green-600 text-sm">
                    <ArrowUp className="w-4 h-4" />
                    {analytics.mrrGrowth}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${analytics.mrr.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Recurring Revenue</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <Percent className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="flex items-center text-green-600 text-sm">
                    <ArrowDown className="w-4 h-4" />
                    0.5%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.churnRate}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Churn Rate</p>
              </div>
            </div>

            {/* Subscription Breakdown */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Subscriptions</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Free Users</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(analytics.totalUsers - analytics.premiumUsers - analytics.familyUsers).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Premium ($9.99)</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {analytics.premiumUsers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Family ($14.99)</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {analytics.familyUsers.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-brand-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Engagement</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Session</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {analytics.avgSessionDuration} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">AI Chef Queries</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {analytics.aiChefQueries.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Recipes Generated</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {analytics.recipesGenerated.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-brand-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Feature Usage</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Meals Planned</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {analytics.mealsPlanned.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Grocery Lists</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {analytics.groceryListsCreated.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Conversion Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {((analytics.premiumUsers + analytics.familyUsers) / analytics.totalUsers * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              {/* User Growth Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-6">User Growth</h3>
                <div className="h-48 flex items-end gap-4">
                  {userGrowthData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-brand-500 rounded-t"
                        style={{ height: `${(data.value / Math.max(...userGrowthData.map(d => d.value))) * 150}px` }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{data.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Revenue Growth</h3>
                <div className="h-48 flex items-end gap-4">
                  {revenueData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: `${(data.value / Math.max(...revenueData.map(d => d.value))) * 150}px` }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{data.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/status"
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Activity className="w-6 h-6 text-brand-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">System Status</span>
                </Link>
                <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Users className="w-6 h-6 text-brand-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Manage Users</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <CreditCard className="w-6 h-6 text-brand-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">View Payments</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <BarChart3 className="w-6 h-6 text-brand-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Export Data</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400"
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
