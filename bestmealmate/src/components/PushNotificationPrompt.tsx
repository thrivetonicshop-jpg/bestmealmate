'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

export default function PushNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default')

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setPermission('unsupported')
      return
    }

    setPermission(Notification.permission)

    // Show prompt after 30 seconds if permission not granted/denied
    if (Notification.permission === 'default') {
      const hasPrompted = localStorage.getItem('pushPromptShown')
      if (!hasPrompted) {
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 30000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const requestPermission = async () => {
    try {
      // Register service worker first
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)

      // Request notification permission
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted') {
        // Show a test notification
        new Notification('BestMealMate', {
          body: 'You\'ll now receive meal reminders and tips!',
          icon: '/icon-192.png'
        })
      }

      localStorage.setItem('pushPromptShown', 'true')
      setShowPrompt(false)
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  const dismissPrompt = () => {
    localStorage.setItem('pushPromptShown', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt || permission !== 'default') return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 animate-slideUp">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-brand-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                Enable Notifications
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Get meal reminders, expiring food alerts, and weekly recipe inspiration.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={requestPermission}
                  className="flex-1 bg-brand-500 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-brand-600 transition-colors"
                >
                  Enable
                </button>
                <button
                  onClick={dismissPrompt}
                  className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={dismissPrompt}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
