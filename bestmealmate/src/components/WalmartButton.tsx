'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2, ExternalLink, Truck } from 'lucide-react'

// Walmart Integration Component

interface WalmartItem {
  name: string
  quantity: number
  unit?: string
}

interface WalmartButtonProps {
  items: WalmartItem[]
  className?: string
  variant?: 'primary' | 'secondary' | 'compact'
}

export default function WalmartButton({
  items,
  className = '',
  variant = 'primary',
}: WalmartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOrderViaWalmart = async () => {
    if (items.length === 0) {
      setError('No items to order')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/walmart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create cart')
      }

      // Open Walmart in new tab
      if (data.cartUrl) {
        window.open(data.cartUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      console.error('Walmart order error:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect')
    } finally {
      setLoading(false)
    }
  }

  // Compact variant for inline use
  if (variant === 'compact') {
    return (
      <button
        onClick={handleOrderViaWalmart}
        disabled={loading || items.length === 0}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-[#0071DC] text-white rounded-lg font-medium hover:bg-[#004C91] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ShoppingCart className="w-4 h-4" />
        )}
        <span>Shop at Walmart</span>
      </button>
    )
  }

  // Secondary variant
  if (variant === 'secondary') {
    return (
      <div className={`${className}`}>
        <button
          onClick={handleOrderViaWalmart}
          disabled={loading || items.length === 0}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-[#0071DC] text-[#0071DC] rounded-xl font-semibold hover:bg-[#0071DC] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Shop at Walmart</span>
              <ExternalLink className="w-4 h-4" />
            </>
          )}
        </button>
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </div>
    )
  }

  // Primary variant (default) - full featured card
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm ${className}`}>
      {/* Header with Walmart branding */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-[#0071DC] rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Shop at Walmart</h3>
          <p className="text-sm text-gray-600">Save money. Live better.</p>
        </div>
      </div>

      {/* Item count */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">{items.length} items</span> ready to add to your cart
        </p>
      </div>

      {/* Delivery/Pickup options */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Truck className="w-4 h-4 text-[#0071DC]" />
        <span className="font-medium text-[#0071DC]">Pickup, Delivery & Shipping</span>
      </div>

      {/* Order button */}
      <button
        onClick={handleOrderViaWalmart}
        disabled={loading || items.length === 0}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#0071DC] text-white rounded-xl font-semibold hover:bg-[#004C91] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Searching...</span>
          </>
        ) : (
          <>
            <span>Shop at Walmart</span>
            <ExternalLink className="w-4 h-4" />
          </>
        )}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-4">
        Prices and availability may vary by location.
      </p>
    </div>
  )
}
