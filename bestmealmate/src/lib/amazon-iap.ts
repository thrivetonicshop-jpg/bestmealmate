// Amazon In-App Purchasing Helper
// This file provides a unified interface for Amazon IAP in the BestMealMate app

declare global {
  interface Window {
    AmazonIAP?: {
      purchasePremium: () => void
      purchaseFamily: () => void
      refreshPurchases: () => void
      isAmazonDevice: () => boolean
    }
  }
}

export interface AmazonProduct {
  sku: string
  title: string
  description: string
  price: string
}

export interface PurchaseResult {
  plan: 'premium' | 'family'
  receiptId: string
}

// Check if running in Amazon Appstore app
export function isAmazonApp(): boolean {
  if (typeof window === 'undefined') return false
  return !!window.AmazonIAP?.isAmazonDevice?.()
}

// Purchase Premium subscription
export function purchasePremium(): void {
  if (!isAmazonApp()) {
    console.warn('Amazon IAP not available - not running in Amazon app')
    // Fallback to web checkout
    window.location.href = '/onboarding?plan=premium'
    return
  }
  window.AmazonIAP?.purchasePremium()
}

// Purchase Family subscription
export function purchaseFamily(): void {
  if (!isAmazonApp()) {
    console.warn('Amazon IAP not available - not running in Amazon app')
    // Fallback to web checkout
    window.location.href = '/onboarding?plan=family'
    return
  }
  window.AmazonIAP?.purchaseFamily()
}

// Refresh purchase status
export function refreshPurchases(): void {
  if (isAmazonApp()) {
    window.AmazonIAP?.refreshPurchases()
  }
}

// Verify receipt with backend
export async function verifyReceipt(
  receiptId: string,
  userId: string
): Promise<{ valid: boolean; plan?: string; error?: string }> {
  try {
    const response = await fetch('/api/amazon/verify-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiptId, userId }),
    })

    return await response.json()
  } catch (error) {
    console.error('Receipt verification failed:', error)
    return { valid: false, error: 'Verification failed' }
  }
}

// Event listeners for Amazon IAP events
export function setupAmazonIAPListeners(callbacks: {
  onProductsLoaded?: (products: AmazonProduct[]) => void
  onPurchaseSuccess?: (result: PurchaseResult) => void
  onPurchaseError?: (error: { error: string }) => void
  onPurchaseAlreadyOwned?: () => void
  onSubscriptionCanceled?: (data: { sku: string }) => void
}): () => void {
  if (typeof window === 'undefined') return () => {}

  const handlers: { [key: string]: EventListener } = {}

  if (callbacks.onProductsLoaded) {
    handlers.onProductsLoaded = ((e: CustomEvent) => {
      callbacks.onProductsLoaded?.(e.detail.products || [])
    }) as EventListener
    window.addEventListener('onProductsLoaded', handlers.onProductsLoaded)
  }

  if (callbacks.onPurchaseSuccess) {
    handlers.onPurchaseSuccess = ((e: CustomEvent) => {
      callbacks.onPurchaseSuccess?.(e.detail)
    }) as EventListener
    window.addEventListener('onPurchaseSuccess', handlers.onPurchaseSuccess)
  }

  if (callbacks.onPurchaseError) {
    handlers.onPurchaseError = ((e: CustomEvent) => {
      callbacks.onPurchaseError?.(e.detail)
    }) as EventListener
    window.addEventListener('onPurchaseError', handlers.onPurchaseError)
  }

  if (callbacks.onPurchaseAlreadyOwned) {
    handlers.onPurchaseAlreadyOwned = (() => {
      callbacks.onPurchaseAlreadyOwned?.()
    }) as EventListener
    window.addEventListener('onPurchaseAlreadyOwned', handlers.onPurchaseAlreadyOwned)
  }

  if (callbacks.onSubscriptionCanceled) {
    handlers.onSubscriptionCanceled = ((e: CustomEvent) => {
      callbacks.onSubscriptionCanceled?.(e.detail)
    }) as EventListener
    window.addEventListener('onSubscriptionCanceled', handlers.onSubscriptionCanceled)
  }

  // Return cleanup function
  return () => {
    Object.entries(handlers).forEach(([event, handler]) => {
      window.removeEventListener(event, handler)
    })
  }
}

// Hook for React components
export function useAmazonIAP(callbacks: Parameters<typeof setupAmazonIAPListeners>[0]) {
  if (typeof window !== 'undefined') {
    // Setup listeners on mount, cleanup on unmount
    const cleanup = setupAmazonIAPListeners(callbacks)
    return { cleanup, isAmazonApp: isAmazonApp() }
  }
  return { cleanup: () => {}, isAmazonApp: false }
}
