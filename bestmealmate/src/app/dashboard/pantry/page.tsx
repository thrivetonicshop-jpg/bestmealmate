'use client'

import { useState, useEffect } from 'react'
import {
  Refrigerator,
  Plus,
  Search,
  AlertTriangle,
  Trash2,
  Edit2,
  X,
  Check,
  Snowflake,
  Package
} from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { usePantryStore, useAuthStore, type PantryItemWithIngredient } from '@/lib/store'
import { cn, getExpiryStatus, locationLabels, formatDate, categoryLabels } from '@/lib/utils'

const LOCATIONS = ['fridge', 'freezer', 'pantry', 'spice_rack', 'other'] as const

const locationIcons: Record<string, React.ReactNode> = {
  fridge: <Refrigerator className="w-4 h-4" />,
  freezer: <Snowflake className="w-4 h-4" />,
  pantry: <Package className="w-4 h-4" />,
  spice_rack: <Package className="w-4 h-4" />,
  other: <Package className="w-4 h-4" />,
}

export default function PantryPage() {
  const { household } = useAuthStore()
  const { items, setItems, addItem, updateItem, removeItem, ingredients, setIngredients, isLoading, setIsLoading } = usePantryStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PantryItemWithIngredient | null>(null)

  // Fetch pantry items
  useEffect(() => {
    const fetchPantry = async () => {
      if (!household?.id) return

      setIsLoading(true)
      try {
        const [pantryRes, ingredientsRes] = await Promise.all([
          fetch(`/api/pantry?householdId=${household.id}`),
          fetch('/api/ingredients')
        ])

        const pantryData = await pantryRes.json()
        const ingredientsData = await ingredientsRes.json()

        setItems(pantryData.items || [])
        setIngredients(ingredientsData.ingredients || [])
      } catch (error) {
        console.error('Failed to fetch pantry:', error)
        toast.error('Failed to load pantry')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPantry()
  }, [household?.id, setItems, setIngredients, setIsLoading])

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = !searchQuery ||
      item.ingredient?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation
    return matchesSearch && matchesLocation
  })

  // Group by location
  const groupedItems = filteredItems.reduce((acc, item) => {
    const loc = item.location || 'other'
    if (!acc[loc]) acc[loc] = []
    acc[loc].push(item)
    return acc
  }, {} as Record<string, PantryItemWithIngredient[]>)

  // Get expiring items count
  const expiringCount = items.filter((item) => {
    const status = getExpiryStatus(item.expiry_date)
    return status.urgency === 'urgent' || status.urgency === 'expired'
  }).length

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/pantry?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      removeItem(id)
      toast.success('Item removed')
    } catch (error) {
      toast.error('Failed to delete item')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pantry</h1>
            <p className="text-gray-600">
              {items.length} items · {expiringCount > 0 && (
                <span className="text-orange-600">{expiringCount} expiring soon</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setSelectedLocation('all')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors",
                selectedLocation === 'all'
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              All
            </button>
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2",
                  selectedLocation === loc
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {locationIcons[loc]}
                {locationLabels[loc]}
              </button>
            ))}
          </div>
        </div>

        {/* Expiring Soon Alert */}
        {expiringCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800">Items expiring soon</h3>
              <p className="text-sm text-orange-700">
                You have {expiringCount} items that will expire in the next 2 days. Use them soon!
              </p>
            </div>
          </div>
        )}

        {/* Items by Location */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading pantry...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Refrigerator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try a different search term' : 'Start by adding items to your pantry'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
            >
              <Plus className="w-4 h-4" />
              Add First Item
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([location, locationItems]) => (
              <div key={location} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  {locationIcons[location]}
                  <h2 className="font-semibold text-gray-900">{locationLabels[location]}</h2>
                  <span className="text-sm text-gray-500">({locationItems.length})</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {locationItems.map((item) => {
                    const expiry = getExpiryStatus(item.expiry_date)
                    return (
                      <div
                        key={item.id}
                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">
                              {item.ingredient?.name || 'Unknown Item'}
                            </h3>
                            {item.is_staple && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Staple
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span>
                              {item.quantity} {item.unit || 'units'}
                            </span>
                            {item.expiry_date && (
                              <span className={expiry.color}>
                                Expires: {expiry.label}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <PantryItemModal
          item={editingItem}
          ingredients={ingredients}
          householdId={household?.id || ''}
          onClose={() => {
            setShowAddModal(false)
            setEditingItem(null)
          }}
          onSave={(newItem) => {
            if (editingItem) {
              updateItem(newItem.id, newItem)
            } else {
              addItem(newItem)
            }
            setShowAddModal(false)
            setEditingItem(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}

// Add/Edit Modal Component
interface PantryItemModalProps {
  item: PantryItemWithIngredient | null
  ingredients: any[]
  householdId: string
  onClose: () => void
  onSave: (item: PantryItemWithIngredient) => void
}

function PantryItemModal({ item, ingredients, householdId, onClose, onSave }: PantryItemModalProps) {
  const [ingredientName, setIngredientName] = useState(item?.ingredient?.name || '')
  const [ingredientId, setIngredientId] = useState(item?.ingredient_id || '')
  const [quantity, setQuantity] = useState(item?.quantity?.toString() || '1')
  const [unit, setUnit] = useState(item?.unit || '')
  const [location, setLocation] = useState<string>(item?.location || 'pantry')
  const [expiryDate, setExpiryDate] = useState(item?.expiry_date || '')
  const [isStaple, setIsStaple] = useState(item?.is_staple || false)
  const [notes, setNotes] = useState(item?.notes || '')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])

  // Search ingredients as user types
  useEffect(() => {
    if (ingredientName.length >= 2 && !ingredientId) {
      const filtered = ingredients.filter((i) =>
        i.name.toLowerCase().includes(ingredientName.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [ingredientName, ingredientId, ingredients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ingredientName.trim()) {
      toast.error('Please enter an ingredient name')
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        householdId,
        ingredientId: ingredientId || undefined,
        ingredientName: ingredientId ? undefined : ingredientName.trim(),
        quantity: parseFloat(quantity) || 1,
        unit: unit || null,
        location,
        expiryDate: expiryDate || null,
        isStaple,
        notes: notes || null,
      }

      if (item) {
        // Update existing
        const res = await fetch('/api/pantry', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, ...payload }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        onSave(data.item)
        toast.success('Item updated')
      } else {
        // Create new
        const res = await fetch('/api/pantry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        onSave(data.item)
        toast.success('Item added')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save item')
    } finally {
      setIsLoading(false)
    }
  }

  const selectSuggestion = (suggestion: any) => {
    setIngredientId(suggestion.id)
    setIngredientName(suggestion.name)
    if (suggestion.default_unit) setUnit(suggestion.default_unit)
    setSuggestions([])
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {item ? 'Edit Item' : 'Add to Pantry'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Ingredient Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              value={ingredientName}
              onChange={(e) => {
                setIngredientName(e.target.value)
                setIngredientId('')
              }}
              placeholder="e.g., Chicken Breast"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              disabled={!!item}
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSuggestion(s)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{s.name}</span>
                    {s.category && (
                      <span className="text-xs text-gray-500">{categoryLabels[s.category] || s.category}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quantity & Unit */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.5"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., lbs, oz"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                    location === loc
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {locationIcons[loc]}
                  {locationLabels[loc]}
                </button>
              ))}
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
            />
          </div>

          {/* Is Staple */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isStaple}
              onChange={(e) => setIsStaple(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700">Mark as staple item (always keep stocked)</span>
          </label>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {item ? 'Save Changes' : 'Add Item'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
