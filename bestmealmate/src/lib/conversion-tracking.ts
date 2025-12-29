// Google Ads Conversion Tracking
// Conversion ID: AW-17838684120
// Conversion Label: Nmx6CM7vq9kbENjvkrpC

// Note: Window.gtag is declared in WebVitals.tsx

interface ConversionOptions {
  transactionId?: string
  value?: number
  currency?: string
  callback?: () => void
}

/**
 * Report a purchase conversion to Google Ads
 * Call this when a user completes a subscription checkout
 */
export function trackPurchaseConversion(options: ConversionOptions = {}) {
  const { transactionId = '', value, currency = 'USD', callback } = options

  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    console.log('Google Ads gtag not available')
    callback?.()
    return
  }

  const conversionCallback = () => {
    callback?.()
  }

  window.gtag('event', 'conversion', {
    send_to: 'AW-17838684120/Nmx6CM7vq9kbENjvkrpC',
    transaction_id: transactionId,
    value: value,
    currency: currency,
    event_callback: conversionCallback,
  })
}

/**
 * Track subscription signup conversion
 */
export function trackSubscriptionConversion(
  plan: 'premium' | 'family',
  transactionId?: string
) {
  const planValues = {
    premium: 9.99,
    family: 14.99,
  }

  trackPurchaseConversion({
    transactionId: transactionId || `sub_${Date.now()}`,
    value: planValues[plan],
    currency: 'USD',
  })
}

/**
 * Track free trial signup (lower value conversion)
 */
export function trackTrialConversion(transactionId?: string) {
  trackPurchaseConversion({
    transactionId: transactionId || `trial_${Date.now()}`,
    value: 0, // Trial has no immediate value
    currency: 'USD',
  })
}

/**
 * Track page views for remarketing
 */
export function trackPageView(pagePath: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    send_to: 'AW-17838684120',
  })
}
