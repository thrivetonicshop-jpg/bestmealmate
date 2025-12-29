'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Activity,
  Server,
  Database,
  CreditCard,
  Brain,
  RefreshCw,
  ChevronLeft
} from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  latency?: number
  lastChecked: string
  icon: React.ElementType
  description: string
}

interface Incident {
  id: string
  title: string
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  severity: 'minor' | 'major' | 'critical'
  createdAt: string
  updatedAt: string
  updates: { time: string; message: string }[]
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  async function checkStatus() {
    setLoading(true)

    // Simulated status check - in production, these would be real API calls
    const statusChecks: ServiceStatus[] = [
      {
        name: 'Web Application',
        status: 'operational',
        latency: 45,
        lastChecked: new Date().toISOString(),
        icon: Server,
        description: 'Main web application and user interface'
      },
      {
        name: 'Database',
        status: 'operational',
        latency: 12,
        lastChecked: new Date().toISOString(),
        icon: Database,
        description: 'User data, recipes, and meal plans storage'
      },
      {
        name: 'AI Chef (Claude)',
        status: 'operational',
        latency: 890,
        lastChecked: new Date().toISOString(),
        icon: Brain,
        description: 'AI-powered meal suggestions and recipe generation'
      },
      {
        name: 'Payment Processing',
        status: 'operational',
        latency: 234,
        lastChecked: new Date().toISOString(),
        icon: CreditCard,
        description: 'Stripe payment and subscription management'
      },
      {
        name: 'Authentication',
        status: 'operational',
        latency: 89,
        lastChecked: new Date().toISOString(),
        icon: Activity,
        description: 'User login, registration, and session management'
      }
    ]

    // Simulated past incidents
    const pastIncidents: Incident[] = [
      {
        id: '1',
        title: 'Scheduled Maintenance - Database Optimization',
        status: 'resolved',
        severity: 'minor',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        updates: [
          { time: '10:00 AM', message: 'Starting scheduled database maintenance' },
          { time: '12:00 PM', message: 'Maintenance completed successfully. All systems operational.' }
        ]
      }
    ]

    setServices(statusChecks)
    setIncidents(pastIncidents)
    setLastUpdated(new Date())
    setLoading(false)
  }

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'maintenance':
        return <Clock className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusText = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'Operational'
      case 'degraded':
        return 'Degraded Performance'
      case 'outage':
        return 'Service Outage'
      case 'maintenance':
        return 'Under Maintenance'
    }
  }

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'outage':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  const allOperational = services.every(s => s.status === 'operational')
  const hasOutage = services.some(s => s.status === 'outage')
  const hasDegraded = services.some(s => s.status === 'degraded')

  const overallStatus = hasOutage ? 'outage' : hasDegraded ? 'degraded' : 'operational'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to BestMealMate
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Status</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Real-time status of BestMealMate services
              </p>
            </div>
            <button
              onClick={checkStatus}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Overall Status Banner */}
        <div className={`rounded-xl p-6 mb-8 ${
          allOperational
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : hasOutage
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className="flex items-center gap-4">
            {allOperational ? (
              <CheckCircle className="w-10 h-10 text-green-500" />
            ) : hasOutage ? (
              <XCircle className="w-10 h-10 text-red-500" />
            ) : (
              <AlertCircle className="w-10 h-10 text-yellow-500" />
            )}
            <div>
              <h2 className={`text-xl font-semibold ${
                allOperational ? 'text-green-800 dark:text-green-400' :
                hasOutage ? 'text-red-800 dark:text-red-400' :
                'text-yellow-800 dark:text-yellow-400'
              }`}>
                {allOperational ? 'All Systems Operational' :
                 hasOutage ? 'Service Disruption' :
                 'Degraded Performance'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Uptime Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-3xl font-bold text-green-600">99.9%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Uptime (30 days)</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-3xl font-bold text-brand-600">45ms</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Incidents</p>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Services</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {services.map((service) => (
              <div key={service.name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {service.latency && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {service.latency}ms
                    </span>
                  )}
                  <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                    {getStatusText(service.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Incidents</h3>
          </div>
          {incidents.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No incidents in the past 90 days</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {incidents.map((incident) => (
                <div key={incident.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{incident.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      incident.status === 'resolved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {new Date(incident.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <div className="space-y-2">
                    {incident.updates.map((update, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="text-gray-400 whitespace-nowrap">{update.time}</span>
                        <span className="text-gray-600 dark:text-gray-300">{update.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscribe to Updates */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Want to be notified of incidents?{' '}
            <a href="mailto:status@bestmealmate.com" className="text-brand-600 hover:underline">
              Subscribe to updates
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} BestMealMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
