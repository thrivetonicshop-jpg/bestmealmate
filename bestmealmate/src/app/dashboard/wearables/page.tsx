'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Watch,
  Activity,
  Heart,
  Footprints,
  Moon,
  Flame,
  Droplets,
  Scale,
  TrendingUp,
  Plus,
  Trash2,
  RefreshCw,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  Check
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import {
  WearableProvider,
  WEARABLE_PROVIDERS,
  formatMetricValue,
  getMetricIcon,
  DailyHealthSummary
} from '@/lib/wearables'

interface WearableConnection {
  id: string
  provider: WearableProvider
  is_active: boolean
  last_sync_at: string | null
  provider_info: {
    name: string
    icon: string
    color: string
  }
}

interface HealthSummaryResponse {
  today: DailyHealthSummary
  daily_summaries: DailyHealthSummary[]
  averages: {
    steps: number
    calories_burned: number
    active_minutes: number
  }
  nutrition_goals: {
    base_calorie_goal: number
    adjusted_calorie_goal: number
    protein_goal: number | null
    carb_goal: number | null
    fat_goal: number | null
  }
  activity_level: string
  recommendation: string
}

export default function WearablesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [connections, setConnections] = useState<WearableConnection[]>([])
  const [availableProviders, setAvailableProviders] = useState<Array<{ id: string; name: string; icon: string; color: string }>>([])
  const [healthData, setHealthData] = useState<HealthSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Fetch connections
      const connResponse = await fetch('/api/wearables', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (connResponse.ok) {
        const connData = await connResponse.json()
        setConnections(connData.connections || [])
        setAvailableProviders(connData.available_providers || [])
      }

      // Fetch health data
      const healthResponse = await fetch('/api/wearables/sync?days=7', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (healthResponse.ok) {
        const data = await healthResponse.json()
        setHealthData(data)
      }
    } catch (error) {
      console.error('Error fetching wearable data:', error)
      toast.error('Failed to load wearable data')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (providerId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // For demo purposes, simulate a connection
      // In production, this would redirect to OAuth flow
      const response = await fetch('/api/wearables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          provider: providerId,
          access_token: 'demo_token',
        }),
      })

      if (response.ok) {
        toast.success(`Connected to ${WEARABLE_PROVIDERS[providerId as WearableProvider]?.name}`)
        setShowConnectModal(false)
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to connect')
      }
    } catch (error) {
      toast.error('Failed to connect device')
    }
  }

  const handleDisconnect = async (connectionId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/wearables?id=${connectionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (response.ok) {
        toast.success('Device disconnected')
        fetchData()
      } else {
        toast.error('Failed to disconnect')
      }
    } catch (error) {
      toast.error('Failed to disconnect device')
    }
  }

  const handleSync = async () => {
    if (connections.length === 0) {
      toast.error('No devices connected')
      return
    }

    setSyncing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Simulate syncing data from connected devices
      for (const conn of connections) {
        const mockMetrics = [
          { metric_type: 'steps', value: Math.floor(Math.random() * 5000) + 5000, unit: 'steps', recorded_at: new Date().toISOString() },
          { metric_type: 'calories_burned', value: Math.floor(Math.random() * 300) + 200, unit: 'kcal', recorded_at: new Date().toISOString() },
          { metric_type: 'active_minutes', value: Math.floor(Math.random() * 30) + 15, unit: 'minutes', recorded_at: new Date().toISOString() },
          { metric_type: 'heart_rate', value: Math.floor(Math.random() * 20) + 65, unit: 'bpm', recorded_at: new Date().toISOString() },
        ]

        await fetch('/api/wearables/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            connection_id: conn.id,
            metrics: mockMetrics,
          }),
        })
      }

      toast.success('Sync completed!')
      fetchData()
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const unconnectedProviders = availableProviders.filter(
    p => !connections.some(c => c.provider === p.id)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Watch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Wearable Devices</h1>
                  <p className="text-sm text-gray-500">Track your health & adjust nutrition</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSync}
                disabled={syncing || connections.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-lg font-medium hover:bg-brand-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
              <button
                onClick={() => setShowConnectModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Connect Device
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connected Devices */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Devices</h2>
          {connections.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Watch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No devices connected</h3>
              <p className="text-gray-500 mb-4">Connect your wearable device to sync health data and get personalized nutrition recommendations.</p>
              <button
                onClick={() => setShowConnectModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Connect Your First Device
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map(conn => (
                <div
                  key={conn.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${conn.provider_info?.color}20` }}
                      >
                        {conn.provider_info?.icon || '⌚'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{conn.provider_info?.name}</h3>
                        <p className="text-sm text-gray-500">
                          {conn.is_active ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <Check className="w-3 h-3" /> Connected
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-600">
                              <AlertCircle className="w-3 h-3" /> Needs reconnection
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDisconnect(conn.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {conn.last_sync_at && (
                    <p className="text-xs text-gray-400">
                      Last synced: {new Date(conn.last_sync_at).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Today's Health Summary */}
        {healthData && (
          <>
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Activity</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  icon={<Footprints className="w-5 h-5" />}
                  label="Steps"
                  value={healthData.today.steps?.toLocaleString() || '0'}
                  color="blue"
                />
                <MetricCard
                  icon={<Flame className="w-5 h-5" />}
                  label="Calories Burned"
                  value={`${healthData.today.calories_burned?.toLocaleString() || '0'} kcal`}
                  color="orange"
                />
                <MetricCard
                  icon={<Activity className="w-5 h-5" />}
                  label="Active Minutes"
                  value={`${healthData.today.active_minutes || '0'} min`}
                  color="green"
                />
                <MetricCard
                  icon={<Heart className="w-5 h-5" />}
                  label="Avg Heart Rate"
                  value={healthData.today.avg_heart_rate ? `${healthData.today.avg_heart_rate} bpm` : '--'}
                  color="red"
                />
              </div>
            </section>

            {/* Nutrition Adjustment */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Insights</h2>
              <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-6 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">AI-Powered Recommendation</h3>
                    <p className="text-white/90">{healthData.recommendation}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm text-white/70 mb-1">Base Calorie Goal</p>
                    <p className="text-2xl font-bold">{healthData.nutrition_goals.base_calorie_goal} kcal</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm text-white/70 mb-1">Calories Burned Today</p>
                    <p className="text-2xl font-bold">+{healthData.today.calories_burned || 0} kcal</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 border border-white/30">
                    <p className="text-sm text-white/70 mb-1">Adjusted Goal</p>
                    <p className="text-2xl font-bold">{healthData.nutrition_goals.adjusted_calorie_goal} kcal</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm">
                    <span className="font-medium">Activity Level:</span>{' '}
                    <span className="capitalize">{healthData.activity_level.replace('_', ' ')}</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Weekly Trend */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">7-Day Averages</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Footprints className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Avg Steps</p>
                      <p className="text-xl font-bold text-gray-900">{healthData.averages.steps.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Good progress!</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Avg Calories Burned</p>
                      <p className="text-xl font-bold text-gray-900">{healthData.averages.calories_burned.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Avg Active Minutes</p>
                      <p className="text-xl font-bold text-gray-900">{healthData.averages.active_minutes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Connect Device Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connect a Device</h2>
            <p className="text-gray-500 mb-6">Choose a wearable device to connect with BestMealMate</p>

            <div className="space-y-3">
              {unconnectedProviders.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => handleConnect(provider.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${provider.color}20` }}
                  >
                    {provider.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-500">Tap to connect</p>
                  </div>
                </button>
              ))}
            </div>

            {unconnectedProviders.length === 0 && (
              <p className="text-center text-gray-500 py-8">All available devices are already connected!</p>
            )}

            <button
              onClick={() => setShowConnectModal(false)}
              className="w-full mt-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: 'blue' | 'orange' | 'green' | 'red' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
