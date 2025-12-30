'use client'

import { useState, useRef, useEffect } from 'react'
import {
  X,
  Camera,
  Check,
  ShoppingCart,
  DollarSign,
  ScanLine,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  Receipt,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export interface GroceryItemWithPrice {
  id: string
  name: string
  quantity: string
  aisle: string
  isPurchased: boolean
  estimatedPrice?: number
  actualPrice?: number
  barcode?: string
  brand?: string
  priceHistory?: Array<{ date: string; price: number; store: string }>
  fromRecipe?: string
}

interface GroceryShoppingModeProps {
  items: GroceryItemWithPrice[]
  storeName?: string
  onToggleItem: (itemId: string, purchased: boolean) => void
  onUpdatePrice: (itemId: string, price: number) => void
  onScanBarcode: (barcode: string) => Promise<{ name: string; price: number; brand?: string } | null>
  onClose: () => void
  onFinishShopping: (receipt: ShoppingReceipt) => void
}

interface ShoppingReceipt {
  storeName: string
  date: string
  items: Array<{ name: string; quantity: string; price: number }>
  subtotal: number
  estimatedTotal: number
  actualTotal: number
  savings: number
}

export default function GroceryShoppingMode({
  items,
  storeName = 'Grocery Store',
  onToggleItem,
  onUpdatePrice,
  onScanBarcode,
  onClose,
  onFinishShopping
}: GroceryShoppingModeProps) {
  const [scanning, setScanning] = useState(false)
  const [currentAisle, setCurrentAisle] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [priceInput, setPriceInput] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Group items by aisle
  const itemsByAisle = items.reduce((acc, item) => {
    const aisle = item.aisle || 'Other'
    if (!acc[aisle]) acc[aisle] = []
    acc[aisle].push(item)
    return acc
  }, {} as Record<string, GroceryItemWithPrice[]>)

  const aisles = Object.keys(itemsByAisle).sort()

  // Calculate totals
  const purchasedItems = items.filter(i => i.isPurchased)
  const estimatedTotal = items.reduce((sum, i) => sum + (i.estimatedPrice || 0), 0)
  const actualTotal = purchasedItems.reduce((sum, i) => sum + (i.actualPrice || i.estimatedPrice || 0), 0)
  const remainingItems = items.filter(i => !i.isPurchased)
  const remainingEstimate = remainingItems.reduce((sum, i) => sum + (i.estimatedPrice || 0), 0)

  // Filter items by search
  const filteredItems = searchQuery
    ? items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : null

  // Start camera for barcode scanning
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setScanning(true)
    } catch (err) {
      console.error('Camera error:', err)
      alert('Unable to access camera')
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setScanning(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handlePriceSubmit = (itemId: string) => {
    const price = parseFloat(priceInput)
    if (!isNaN(price) && price >= 0) {
      onUpdatePrice(itemId, price)
      onToggleItem(itemId, true)
    }
    setEditingPrice(null)
    setPriceInput('')
  }

  const getPriceComparison = (item: GroceryItemWithPrice) => {
    if (!item.actualPrice || !item.estimatedPrice) return null
    const diff = item.actualPrice - item.estimatedPrice
    const percent = ((diff / item.estimatedPrice) * 100).toFixed(0)
    if (Math.abs(diff) < 0.10) return null
    return {
      diff,
      percent,
      isHigher: diff > 0
    }
  }

  const finishShopping = () => {
    const receipt: ShoppingReceipt = {
      storeName,
      date: new Date().toISOString(),
      items: purchasedItems.map(i => ({
        name: i.name,
        quantity: i.quantity,
        price: i.actualPrice || i.estimatedPrice || 0
      })),
      subtotal: actualTotal,
      estimatedTotal,
      actualTotal,
      savings: estimatedTotal - actualTotal
    }
    onFinishShopping(receipt)
    setShowReceipt(true)
  }

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <MapPin className="w-4 h-4 text-brand-600" />
              <h1 className="font-bold text-gray-900">{storeName}</h1>
            </div>
            <p className="text-xs text-gray-500">
              {purchasedItems.length} of {items.length} items
            </p>
          </div>
          <button
            onClick={startScanning}
            className="p-2 bg-brand-100 text-brand-600 rounded-lg hover:bg-brand-200 transition-colors"
          >
            <ScanLine className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all"
          />
        </div>
      </header>

      {/* Totals Bar */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/70">Cart Total</p>
            <p className="text-2xl font-bold">${actualTotal.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70">Remaining</p>
            <p className="text-lg font-semibold">~${remainingEstimate.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70">Budget</p>
            <p className="text-lg font-semibold">${estimatedTotal.toFixed(2)}</p>
          </div>
        </div>
        {actualTotal < estimatedTotal && purchasedItems.length > 0 && (
          <div className="mt-2 flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm">Saving ${(estimatedTotal - actualTotal).toFixed(2)} so far!</span>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Results */}
        {filteredItems ? (
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-3">
              {filteredItems.length} results for &quot;{searchQuery}&quot;
            </p>
            <div className="space-y-2">
              {filteredItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onToggle={() => onToggleItem(item.id, !item.isPurchased)}
                  onEditPrice={() => {
                    setEditingPrice(item.id)
                    setPriceInput(item.actualPrice?.toString() || item.estimatedPrice?.toString() || '')
                  }}
                  editingPrice={editingPrice === item.id}
                  priceInput={priceInput}
                  onPriceChange={setPriceInput}
                  onPriceSubmit={() => handlePriceSubmit(item.id)}
                  priceComparison={getPriceComparison(item)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Aisle Groups */
          <div className="p-4 space-y-4">
            {aisles.map(aisle => {
              const aisleItems = itemsByAisle[aisle]
              const isExpanded = currentAisle === aisle || currentAisle === null
              const completedCount = aisleItems.filter(i => i.isPurchased).length
              const allCompleted = completedCount === aisleItems.length

              return (
                <div key={aisle} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setCurrentAisle(currentAisle === aisle ? null : aisle)}
                    className={`w-full px-4 py-3 flex items-center justify-between ${
                      allCompleted ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {allCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <ShoppingCart className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{aisle}</h3>
                        <p className="text-xs text-gray-500">
                          {completedCount} of {aisleItems.length} items
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 divide-y divide-gray-100">
                      {aisleItems.map(item => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          onToggle={() => onToggleItem(item.id, !item.isPurchased)}
                          onEditPrice={() => {
                            setEditingPrice(item.id)
                            setPriceInput(item.actualPrice?.toString() || item.estimatedPrice?.toString() || '')
                          }}
                          editingPrice={editingPrice === item.id}
                          priceInput={priceInput}
                          onPriceChange={setPriceInput}
                          onPriceSubmit={() => handlePriceSubmit(item.id)}
                          priceComparison={getPriceComparison(item)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t border-gray-200 p-4 safe-area-pb">
        <button
          onClick={finishShopping}
          disabled={purchasedItems.length === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Receipt className="w-5 h-5" />
          Finish Shopping (${actualTotal.toFixed(2)})
        </button>
      </div>

      {/* Scanner Modal */}
      {scanning && (
        <div className="fixed inset-0 bg-black z-60 flex flex-col">
          <header className="bg-black/50 px-4 py-3 flex items-center justify-between">
            <button onClick={stopScanning} className="p-2 text-white">
              <X className="w-6 h-6" />
            </button>
            <span className="text-white font-medium">Scan Barcode</span>
            <div className="w-10" />
          </header>
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-32 border-2 border-white rounded-xl">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-500 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-500 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-500 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-500 rounded-br-xl" />
              </div>
            </div>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-white text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
                Point camera at barcode
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Shopping Complete!</h2>
              <p className="text-white/80">{storeName}</p>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Purchased</span>
                  <span className="font-semibold">{purchasedItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-semibold">${estimatedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Spent</span>
                  <span className="font-bold text-brand-600">${actualTotal.toFixed(2)}</span>
                </div>
                {actualTotal < estimatedTotal && (
                  <div className="flex justify-between text-green-600 bg-green-50 -mx-6 px-6 py-3">
                    <span className="font-semibold flex items-center gap-2">
                      <TrendingDown className="w-5 h-5" />
                      You Saved
                    </span>
                    <span className="font-bold">${(estimatedTotal - actualTotal).toFixed(2)}</span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Item Card Component
function ItemCard({
  item,
  onToggle,
  onEditPrice,
  editingPrice,
  priceInput,
  onPriceChange,
  onPriceSubmit,
  priceComparison
}: {
  item: GroceryItemWithPrice
  onToggle: () => void
  onEditPrice: () => void
  editingPrice: boolean
  priceInput: string
  onPriceChange: (value: string) => void
  onPriceSubmit: () => void
  priceComparison: { diff: number; percent: string; isHigher: boolean } | null
}) {
  return (
    <div className={`px-4 py-3 flex items-center gap-3 ${item.isPurchased ? 'bg-green-50/50' : ''}`}>
      <button
        onClick={onToggle}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
          item.isPurchased
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-brand-500'
        }`}
      >
        {item.isPurchased && <Check className="w-4 h-4" />}
      </button>

      <div className="flex-1">
        <p className={`font-medium ${item.isPurchased ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          {item.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{item.quantity}</span>
          {item.fromRecipe && (
            <>
              <span>•</span>
              <span className="text-brand-600">{item.fromRecipe}</span>
            </>
          )}
        </div>
      </div>

      {editingPrice ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-500">$</span>
          <input
            type="number"
            value={priceInput}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-brand-500 outline-none"
            autoFocus
            step="0.01"
            min="0"
            onKeyDown={(e) => e.key === 'Enter' && onPriceSubmit()}
          />
          <button
            onClick={onPriceSubmit}
            className="p-1 bg-green-500 text-white rounded-lg"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={onEditPrice}
          className="text-right"
        >
          {item.actualPrice !== undefined ? (
            <div>
              <p className="font-semibold text-gray-900">${item.actualPrice.toFixed(2)}</p>
              {priceComparison && (
                <p className={`text-xs flex items-center gap-1 ${priceComparison.isHigher ? 'text-red-600' : 'text-green-600'}`}>
                  {priceComparison.isHigher ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {priceComparison.isHigher ? '+' : ''}{priceComparison.percent}%
                </p>
              )}
            </div>
          ) : item.estimatedPrice ? (
            <p className="text-gray-400">~${item.estimatedPrice.toFixed(2)}</p>
          ) : (
            <p className="text-gray-300">$ --</p>
          )}
        </button>
      )}
    </div>
  )
}
