'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, Settings, Check } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500)
      return () => clearTimeout(timer)
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent)
        setPreferences(saved)
        applyConsent(saved)
      } catch {
        setShowBanner(true)
      }
    }
  }, [])

  const applyConsent = (prefs: CookiePreferences) => {
    // Enable/disable analytics based on consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
        functionality_storage: prefs.preferences ? 'granted' : 'denied',
        personalization_storage: prefs.preferences ? 'granted' : 'denied',
      })
    }
  }

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    }
    setPreferences(allAccepted)
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    applyConsent(allAccepted)
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleRejectAll = () => {
    const rejected: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }
    setPreferences(rejected)
    localStorage.setItem('cookie-consent', JSON.stringify(rejected))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    applyConsent(rejected)
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    applyConsent(preferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg animate-slide-up">
        <div className="max-w-7xl mx-auto">
          {!showSettings ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Cookie className="w-8 h-8 text-brand-600 flex-shrink-0 hidden sm:block" />
              <div className="flex-1">
                <p className="text-gray-700">
                  We use cookies to improve your experience, analyze site traffic, and personalize content.{' '}
                  <Link href="/cookies" className="text-brand-600 hover:underline">
                    Learn more
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Customize
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Cookie Preferences</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid gap-3">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Necessary Cookies</p>
                    <p className="text-sm text-gray-500">Required for the website to function properly</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Always on</span>
                    <div className="w-10 h-6 bg-brand-600 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <button
                  onClick={() => togglePreference('analytics')}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left w-full"
                >
                  <div>
                    <p className="font-medium text-gray-900">Analytics Cookies</p>
                    <p className="text-sm text-gray-500">Help us understand how visitors interact with our site</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                    preferences.analytics ? 'bg-brand-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </button>

                {/* Marketing Cookies */}
                <button
                  onClick={() => togglePreference('marketing')}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left w-full"
                >
                  <div>
                    <p className="font-medium text-gray-900">Marketing Cookies</p>
                    <p className="text-sm text-gray-500">Used to deliver personalized advertisements</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                    preferences.marketing ? 'bg-brand-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </button>

                {/* Preferences Cookies */}
                <button
                  onClick={() => togglePreference('preferences')}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left w-full"
                >
                  <div>
                    <p className="font-medium text-gray-900">Preference Cookies</p>
                    <p className="text-sm text-gray-500">Remember your settings and preferences</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                    preferences.preferences ? 'bg-brand-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex items-center gap-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
