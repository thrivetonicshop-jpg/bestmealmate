'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/lib/i18n'

/**
 * Skip Links - Allow keyboard users to skip to main content
 */
export function SkipLinks() {
  const { t } = useTranslation()

  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[100] bg-brand-600 text-white px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        {t('a11y.skipToContent')}
      </a>
      <a
        href="#main-nav"
        className="fixed top-4 left-48 z-[100] bg-brand-600 text-white px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        {t('a11y.skipToNav')}
      </a>
    </div>
  )
}

/**
 * Screen Reader Announcer - Announce dynamic content changes
 */
export function ScreenReaderAnnouncer() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAnnounce = (e: CustomEvent<string>) => {
      setMessage(e.detail)
      setTimeout(() => setMessage(''), 1000)
    }

    window.addEventListener('announce' as keyof WindowEventMap, handleAnnounce as EventListener)
    return () => {
      window.removeEventListener('announce' as keyof WindowEventMap, handleAnnounce as EventListener)
    }
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

// Helper to announce messages to screen readers
export function announce(message: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('announce', { detail: message }))
  }
}

/**
 * Focus Trap - Trap focus within a modal or dialog
 */
export function FocusTrap({
  children,
  active = true
}: {
  children: React.ReactNode
  active?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Focus first element when trap activates
    firstElement?.focus()

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [active])

  return <div ref={containerRef}>{children}</div>
}

/**
 * Visually Hidden - Hide content visually but keep accessible to screen readers
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

/**
 * Live Region - Announce updates to screen readers
 */
export function LiveRegion({
  children,
  role = 'status',
  'aria-live': ariaLive = 'polite'
}: {
  children: React.ReactNode
  role?: 'status' | 'alert' | 'log'
  'aria-live'?: 'polite' | 'assertive' | 'off'
}) {
  return (
    <div role={role} aria-live={ariaLive} aria-atomic="true">
      {children}
    </div>
  )
}

/**
 * Reduced Motion Hook - Respect user's motion preferences
 */
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}

/**
 * High Contrast Hook - Detect high contrast mode
 */
export function useHighContrast() {
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)')
    setHighContrast(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setHighContrast(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return highContrast
}

/**
 * Keyboard Navigation Hook - Detect keyboard vs mouse navigation
 */
export function useKeyboardNavigation() {
  const [isKeyboard, setIsKeyboard] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboard(true)
        document.body.classList.add('keyboard-nav')
      }
    }

    const handleMouseDown = () => {
      setIsKeyboard(false)
      document.body.classList.remove('keyboard-nav')
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return isKeyboard
}

/**
 * Font Size Controls - Allow users to adjust text size
 */
export function FontSizeControls() {
  const [fontSize, setFontSize] = useState(100)

  useEffect(() => {
    const saved = localStorage.getItem('fontSize')
    if (saved) {
      const size = parseInt(saved)
      setFontSize(size)
      document.documentElement.style.fontSize = `${size}%`
    }
  }, [])

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(75, Math.min(150, fontSize + delta))
    setFontSize(newSize)
    localStorage.setItem('fontSize', String(newSize))
    document.documentElement.style.fontSize = `${newSize}%`
    announce(`Font size changed to ${newSize}%`)
  }

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Font size controls">
      <button
        onClick={() => changeFontSize(-10)}
        disabled={fontSize <= 75}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease font size"
      >
        A-
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-center">
        {fontSize}%
      </span>
      <button
        onClick={() => changeFontSize(10)}
        disabled={fontSize >= 150}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase font size"
      >
        A+
      </button>
    </div>
  )
}
