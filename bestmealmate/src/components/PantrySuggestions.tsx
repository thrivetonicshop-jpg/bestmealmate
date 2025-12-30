'use client'

import { useState, useMemo } from 'react'
import {
  AlertTriangle,
  DollarSign,
  Sparkles,
  TrendingDown,
  Clock,
  ChevronRight,
  Leaf,
  ShoppingBag,
  Refrigerator,
  Flame,
  Check,
  X,
  ArrowRight
} from 'lucide-react'

export interface ExpiringItem {
  id: string
  name: string
  emoji: string
  quantity: number
  unit: string
  expiryDate: Date
  daysUntilExpiry: number
  location: 'fridge' | 'freezer' | 'pantry' | 'other'
  estimatedValue: number // USD
  suggestedRecipes?: Array<{
    id: string
    name: string
    emoji: string
    usesItems: string[]
    prepTime: string
  }>
}

interface PantrySuggestionsProps {
  expiringItems: ExpiringItem[]
  onUseItem: (itemId: string, recipeId?: string) => void
  onDismissItem: (itemId: string) => void
  onGenerateRecipe: (items: ExpiringItem[]) => void
  savingsThisMonth?: number
  wastedThisMonth?: number
}

export default function PantrySuggestions({
  expiringItems,
  onUseItem,
  onDismissItem,
  onGenerateRecipe,
  savingsThisMonth = 0,
  wastedThisMonth = 0
}: PantrySuggestionsProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // Group items by urgency
  const { critical, warning, upcoming } = useMemo(() => {
    const critical: ExpiringItem[] = []
    const warning: ExpiringItem[] = []
    const upcoming: ExpiringItem[] = []

    expiringItems.forEach(item => {
      if (item.daysUntilExpiry <= 1) {
        critical.push(item)
      } else if (item.daysUntilExpiry <= 3) {
        warning.push(item)
      } else if (item.daysUntilExpiry <= 7) {
        upcoming.push(item)
      }
    })

    return { critical, warning, upcoming }
  }, [expiringItems])

  // Calculate potential savings
  const potentialSavings = useMemo(() => {
    return expiringItems.reduce((sum, item) => sum + item.estimatedValue, 0)
  }, [expiringItems])

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 1) return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
    if (days <= 3) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' }
    return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' }
  }

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'fridge': return <Refrigerator className="w-3 h-3" />
      case 'freezer': return <Refrigerator className="w-3 h-3" />
      default: return <ShoppingBag className="w-3 h-3" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Savings Dashboard */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Smart Savings</h3>
            <p className="text-white/70 text-sm">Use what you have, save money</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-emerald-200" />
              <span className="text-xs text-white/70">At Risk</span>
            </div>
            <p className="text-2xl font-bold">${potentialSavings.toFixed(2)}</p>
            <p className="text-xs text-white/60">{expiringItems.length} items expiring</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-4 h-4 text-emerald-200" />
              <span className="text-xs text-white/70">Saved</span>
            </div>
            <p className="text-2xl font-bold">${savingsThisMonth.toFixed(2)}</p>
            <p className="text-xs text-white/60">this month</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-300" />
              <span className="text-xs text-white/70">Wasted</span>
            </div>
            <p className="text-2xl font-bold">${wastedThisMonth.toFixed(2)}</p>
            <p className="text-xs text-white/60">this month</p>
          </div>
        </div>
      </div>

      {/* Critical Items - Use Now! */}
      {critical.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900">Use Today!</h4>
                <p className="text-xs text-red-600">{critical.length} items expiring</p>
              </div>
            </div>
            <span className="text-sm font-bold text-red-700">
              ${critical.reduce((s, i) => s + i.estimatedValue, 0).toFixed(2)} at risk
            </span>
          </div>

          <div className="space-y-2">
            {critical.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3 border border-red-100"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleItemSelection(item.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedItems.has(item.id)
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'border-gray-300 hover:border-red-400'
                    }`}
                  >
                    {selectedItems.has(item.id) && <Check className="w-4 h-4" />}
                  </button>
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{item.quantity} {item.unit}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {getLocationIcon(item.location)}
                        {item.location}
                      </span>
                      <span>•</span>
                      <span className="text-red-600 font-medium">
                        {item.daysUntilExpiry === 0 ? 'Today' : 'Tomorrow'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${item.estimatedValue.toFixed(2)}</p>
                  </div>
                </div>

                {/* Quick recipe suggestions */}
                {item.suggestedRecipes && item.suggestedRecipes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-red-100">
                    <p className="text-xs text-gray-500 mb-2">Quick recipes:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.suggestedRecipes.slice(0, 2).map((recipe) => (
                        <button
                          key={recipe.id}
                          onClick={() => onUseItem(item.id, recipe.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-sm text-red-800 transition-colors"
                        >
                          <span>{recipe.emoji}</span>
                          <span>{recipe.name}</span>
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{recipe.prepTime}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedItems.size > 0 && (
            <button
              onClick={() => onGenerateRecipe(critical.filter(i => selectedItems.has(i.id)))}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Generate Recipe with {selectedItems.size} Items
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Warning Items - Use Soon */}
      {warning.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900">Use This Week</h4>
                <p className="text-xs text-amber-600">{warning.length} items expiring in 2-3 days</p>
              </div>
            </div>
            <span className="text-sm font-bold text-amber-700">
              ${warning.reduce((s, i) => s + i.estimatedValue, 0).toFixed(2)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {warning.map((item) => {
              const colors = getUrgencyColor(item.daysUntilExpiry)
              return (
                <button
                  key={item.id}
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${colors.bg} ${colors.border} hover:shadow-md`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.daysUntilExpiry} days</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">${item.estimatedValue.toFixed(2)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Upcoming Items */}
      {upcoming.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Refrigerator className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Coming Up</h4>
                <p className="text-xs text-gray-500">{upcoming.length} items expiring this week</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600">
              ${upcoming.reduce((s, i) => s + i.estimatedValue, 0).toFixed(2)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {upcoming.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl"
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-xs text-gray-400">{item.daysUntilExpiry}d</span>
              </div>
            ))}
            {upcoming.length > 6 && (
              <button className="px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-600 hover:bg-gray-200 transition-colors">
                +{upcoming.length - 6} more
              </button>
            )}
          </div>
        </div>
      )}

      {/* AI Suggestion Button */}
      <button
        onClick={() => onGenerateRecipe(expiringItems.filter(i => i.daysUntilExpiry <= 3))}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
      >
        <Sparkles className="w-5 h-5" />
        <span>Get AI Recipes Using Expiring Items</span>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
          Save ${(critical.reduce((s, i) => s + i.estimatedValue, 0) + warning.reduce((s, i) => s + i.estimatedValue, 0)).toFixed(2)}
        </span>
      </button>

      {/* Tips */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-900 mb-1">💡 Savings Tip</h4>
            <p className="text-sm text-emerald-700">
              Families save an average of <strong>$150/month</strong> by using expiring items first.
              Your chicken can be frozen today to extend its life by 3 months!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
