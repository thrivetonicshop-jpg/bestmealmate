'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2, ExternalLink, Clock, Truck } from 'lucide-react'

// Instacart Developer Platform Integration Component
// Following Instacart Developer Messaging Guidelines

interface InstacartItem {
  name: string
  quantity: number
  unit?: string
}

interface InstacartButtonProps {
  items: InstacartItem[]
  postalCode?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'compact'
}

export default function InstacartButton({
  items,
  postalCode,
  className = '',
  variant = 'primary',
}: InstacartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOrderViaInstacart = async () => {
    if (items.length === 0) {
      setError('No items to order')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/instacart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, postalCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create cart')
      }

      // Open Instacart checkout in new tab
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      console.error('Instacart order error:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect')
    } finally {
      setLoading(false)
    }
  }

  // Compact variant for inline use
  if (variant === 'compact') {
    return (
      <button
        onClick={handleOrderViaInstacart}
        disabled={loading || items.length === 0}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-[#003D29] text-white rounded-lg font-medium hover:bg-[#002A1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ShoppingCart className="w-4 h-4" />
        )}
        <span>Order via Instacart</span>
      </button>
    )
  }

  // Secondary variant
  if (variant === 'secondary') {
    return (
      <div className={`${className}`}>
        <button
          onClick={handleOrderViaInstacart}
          disabled={loading || items.length === 0}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-[#003D29] text-[#003D29] rounded-xl font-semibold hover:bg-[#003D29] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Order via Instacart</span>
              <ExternalLink className="w-4 h-4" />
            </>
          )}
        </button>
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
        {/* Required Instacart trademark attribution */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          INSTACART<sup>&reg;</sup> is a registered trademark of Maplebear Inc. d/b/a Instacart.
        </p>
      </div>
    )
  }

  // Primary variant (default) - full featured card
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm ${className}`}>
      {/* Header with Instacart branding */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-[#003D29] rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Order via Instacart</h3>
          {/* Per guidelines: "Delivery in as fast as one hour" */}
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Delivery in as fast as one hour
          </p>
        </div>
      </div>

      {/* Item count */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">{items.length} items</span> ready to add to your cart
        </p>
      </div>

      {/* Delivery info - Per guidelines: "$0 Delivery Fee" not "Free Delivery" */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Truck className="w-4 h-4 text-[#003D29]" />
        <span className="font-medium text-[#003D29]">$0 Delivery Fee*</span>
      </div>

      {/* Order button */}
      <button
        onClick={handleOrderViaInstacart}
        disabled={loading || items.length === 0}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#003D29] text-white rounded-xl font-semibold hover:bg-[#002A1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating cart...</span>
          </>
        ) : (
          <>
            <span>Shop on Instacart</span>
            <ExternalLink className="w-4 h-4" />
          </>
        )}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      {/* Required disclaimers per Instacart guidelines */}
      <div className="mt-4 space-y-1">
        {/* Service fees disclaimer - required */}
        <p className="text-xs text-gray-500 text-center">
          *Service fees apply. Instacart may not be available in all zip codes.
        </p>
        {/* Trademark attribution - required */}
        <p className="text-xs text-gray-400 text-center">
          INSTACART<sup>&reg;</sup> is a registered trademark of Maplebear Inc. d/b/a Instacart.
        </p>
      </div>
    </div>
  )
}

// Instacart logo component for consistent branding
export function InstacartLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-label="Instacart"
    >
      {/* Simplified carrot icon representing Instacart */}
      <path d="M12 2C12.5523 2 13 2.44772 13 3V4.5C14.5 4.5 16 5.5 16.5 7L17 8.5L16 9L15 8C14.5 7.5 14 7 13 7V12L16 15L15 17L12 14L9 17L8 15L11 12V7C10 7 9.5 7.5 9 8L8 9L7 8.5L7.5 7C8 5.5 9.5 4.5 11 4.5V3C11 2.44772 11.4477 2 12 2Z" />
      <path d="M12 14V21C12 21.5523 11.5523 22 11 22C10.4477 22 10 21.5523 10 21V16L12 14Z" />
      <path d="M12 14L14 16V21C14 21.5523 13.5523 22 13 22C12.4477 22 12 21.5523 12 21V14Z" />
    </svg>
  )
}
