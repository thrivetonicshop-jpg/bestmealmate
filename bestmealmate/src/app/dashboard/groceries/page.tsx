'use client'

import { useState, useEffect } from 'react'
import {
  ShoppingCart,
  Plus,
  Check,
  X,
  Trash2,
  ShoppingBag,
  ListPlus,
  ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { useGroceryStore, useAuthStore, usePantryStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function GroceryListPage() {
  const { household } = useAuthStore()
  const { ingredients } = usePantryStore()
  const {
    lists,
    setLists,
    currentList,
    setCurrentList,
    items,
    setItems,
    togglePurchased,
    removeItem,
    addItem,
    isLoading,
    setIsLoading
  } = useGroceryStore()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showNewListModal, setShowNewListModal] = useState(false)

  // Fetch grocery lists
  useEffect(() => {
    const fetchGroceries = async () => {
      if (!household?.id) return

      setIsLoading(true)
      try {
        const res = await fetch(`/api/groceries?householdId=${household.id}`)
        const data = await res.json()

        setLists(data.lists || [])
        setCurrentList(data.currentList || null)
        setItems(data.items || [])
      } catch (error) {
        console.error('Failed to fetch groceries:', error)
        toast.error('Failed to load grocery list')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroceries()
  }, [household?.id, setLists, setCurrentList, setItems, setIsLoading])

  // Calculate stats
  const uncheckedCount = items.filter(i => !i.is_purchased).length
  const checkedCount = items.filter(i => i.is_purchased).length
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0

  const handleToggleItem = async (id: string, isPurchased: boolean) => {
    try {
      const res = await fetch('/api/groceries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggleItem',
          id,
          isPurchased: !isPurchased,
        }),
      })
      if (!res.ok) throw new Error('Failed to update')
      togglePurchased(id)
    } catch (error) {
      toast.error('Failed to update item')
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/groceries?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      removeItem(id)
      toast.success('Item removed')
    } catch (error) {
      toast.error('Failed to delete item')
    }
  }

  const handleCreateList = async (name: string) => {
    try {
      const res = await fetch('/api/groceries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createList',
          householdId: household?.id,
          name,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setLists([data.list, ...lists])
      setCurrentList(data.list)
      setItems([])
      setShowNewListModal(false)
      toast.success('New list created')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create list')
    }
  }

  const handleAddToPantry = async () => {
    // Add purchased items to pantry
    const purchasedItems = items.filter(i => i.is_purchased)
    if (purchasedItems.length === 0) {
      toast.error('No items to add to pantry')
      return
    }

    try {
      for (const item of purchasedItems) {
        await fetch('/api/pantry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            householdId: household?.id,
            ingredientId: item.ingredient_id,
            quantity: item.quantity,
            unit: item.unit,
            location: 'pantry',
          }),
        })
      }
      toast.success(`Added ${purchasedItems.length} items to pantry`)
    } catch (error) {
      toast.error('Failed to add some items to pantry')
    }
  }

  // Group items by aisle
  const groupedItems = items.reduce((acc, item) => {
    const aisle = item.aisle || 'Other'
    if (!acc[aisle]) acc[aisle] = []
    acc[aisle].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  // Sort aisles
  const sortedAisles = Object.keys(groupedItems).sort((a, b) => {
    if (a === 'Other') return 1
    if (b === 'Other') return -1
    return a.localeCompare(b)
  })

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grocery List</h1>
            <p className="text-gray-600">
              {currentList?.name || 'No active list'} · {uncheckedCount} items remaining
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewListModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <ListPlus className="w-5 h-5" />
              New List
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Shopping Progress</span>
              <span className="text-sm text-gray-500">{checkedCount} of {items.length} items</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            {progress === 100 && (
              <button
                onClick={handleAddToPantry}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-brand-100 text-brand-700 rounded-lg font-medium hover:bg-brand-200 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Add all to Pantry
              </button>
            )}
          </div>
        )}

        {/* List Selector */}
        {lists.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {lists.map((list) => (
              <button
                key={list.id}
                onClick={() => {
                  setCurrentList(list)
                  // Re-fetch items for selected list
                  fetch(`/api/groceries?householdId=${household?.id}&listId=${list.id}`)
                    .then(res => res.json())
                    .then(data => setItems(data.items || []))
                }}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors",
                  currentList?.id === list.id
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {list.name}
              </button>
            ))}
          </div>
        )}

        {/* Items */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading grocery list...</p>
          </div>
        ) : !currentList ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No grocery list yet</h3>
            <p className="text-gray-500 mb-4">Create a list to start adding items</p>
            <button
              onClick={() => setShowNewListModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
            >
              <Plus className="w-4 h-4" />
              Create List
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">List is empty</h3>
            <p className="text-gray-500 mb-4">Add items to your shopping list</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
            >
              <Plus className="w-4 h-4" />
              Add First Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAisles.map((aisle) => (
              <div key={aisle} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-medium text-gray-700">{aisle}</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {groupedItems[aisle].map((item) => (
                    <div
                      key={item.id}
                      className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <button
                        onClick={() => handleToggleItem(item.id, item.is_purchased)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
                          item.is_purchased
                            ? "bg-brand-600 border-brand-600 text-white"
                            : "border-gray-300 hover:border-brand-500"
                        )}
                      >
                        {item.is_purchased && <Check className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <span className={cn(
                          "font-medium",
                          item.is_purchased ? "text-gray-400 line-through" : "text-gray-900"
                        )}>
                          {item.ingredient?.name || 'Unknown Item'}
                        </span>
                        {(item.quantity > 1 || item.unit) && (
                          <span className="text-sm text-gray-500 ml-2">
                            {item.quantity} {item.unit}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddGroceryItemModal
          listId={currentList?.id || ''}
          householdId={household?.id || ''}
          ingredients={ingredients}
          onClose={() => setShowAddModal(false)}
          onAdd={(item: any) => {
            addItem(item)
            setShowAddModal(false)
          }}
        />
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <NewListModal
          onClose={() => setShowNewListModal(false)}
          onCreate={handleCreateList}
        />
      )}
    </DashboardLayout>
  )
}

// Add Item Modal
function AddGroceryItemModal({ listId, householdId, ingredients, onClose, onAdd }: any) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('')
  const [aisle, setAisle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [ingredientId, setIngredientId] = useState('')

  useEffect(() => {
    if (name.length >= 2 && !ingredientId) {
      const filtered = ingredients.filter((i: any) =>
        i.name.toLowerCase().includes(name.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [name, ingredientId, ingredients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/groceries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addItem',
          householdId,
          listId,
          ingredientId: ingredientId || undefined,
          ingredientName: ingredientId ? undefined : name.trim(),
          quantity: parseFloat(quantity) || 1,
          unit: unit || null,
          aisle: aisle || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onAdd(data.item)
      toast.success('Item added')
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add Item</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Item *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setIngredientId('')
              }}
              placeholder="e.g., Milk"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              autoFocus
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setIngredientId(s.id)
                      setName(s.name)
                      setSuggestions([])
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., lbs"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aisle</label>
            <input
              type="text"
              value={aisle}
              onChange={(e) => setAisle(e.target.value)}
              placeholder="e.g., Dairy, Produce"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
            />
          </div>

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
              disabled={isLoading || !name.trim()}
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// New List Modal
function NewListModal({ onClose, onCreate }: any) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a list name')
      return
    }
    setIsLoading(true)
    await onCreate(name.trim())
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Create New List</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">List Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekly Groceries"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              autoFocus
            />
          </div>

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
              disabled={isLoading || !name.trim()}
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
