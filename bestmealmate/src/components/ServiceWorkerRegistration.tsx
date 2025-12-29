'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker after the page loads
      window.addEventListener('load', () => {
        registerServiceWorker()
      })

      // If page already loaded, register immediately
      if (document.readyState === 'complete') {
        registerServiceWorker()
      }
    }
  }, [])

  return null
}

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    })

    console.log('🚀 Service Worker registered:', registration.scope)

    // Check for updates periodically
    setInterval(() => {
      registration.update()
    }, 60 * 60 * 1000) // Check every hour

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('🔄 New version available!')

            // Notify user about update (optional)
            if (window.confirm('A new version of BestMealMate is available. Reload to update?')) {
              window.location.reload()
            }
          }
        })
      }
    })

    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker controller changed')
    })

  } catch (error) {
    console.error('❌ Service Worker registration failed:', error)
  }
}

export default ServiceWorkerRegistration
