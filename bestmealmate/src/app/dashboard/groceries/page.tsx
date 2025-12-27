'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChefHat,
  Calendar,
  ShoppingCart,
  Refrigerator,
  Users,
  Plus,
  Check,
  Trash2,
  Settings,
  LogOut,
  MoreVertical,
  Share2,
  Download
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface GroceryItem {
  id: string
  name: string
  quantity: string
  aisle: string
  is_purchased: boolean
  notes?: string
}

interface GroceryList {
  id: string
  name: string
  status: 'active' | 'shopping' | 'completed'
  items: GroceryItem[]
  created_at: string
}

const initialLists: GroceryList[] = [
  {
    id: '1',
    name: 'Weekly Groceries',
    status: 'active',
    created_at: new Date().toISOString(),
    items: [
      { id: '1', name: 'Chicken Breast', quantity: '2 lbs', aisle: 'Meat', is_purchased: false },
      { id: '2', name: 'Broccoli', quantity: '2 heads', aisle: 'Produce', is_purchased: false },
      { id: '3', name: 'Milk', quantity: '1 gallon', aisle: 'Dairy', is_purchased: true },
      { id: '4', name: 'Eggs', quantity: '1 dozen', aisle: 'Dairy', is_purchased: false },
      { id: '5', name: 'Pasta', quantity: '2 boxes', aisle: 'Pantry', is_purchased: true },
      { id: '6', name: 'Olive Oil', quantity: '1 bottle', aisle: 'Pantry', is_purchased: false },
      { id: '7', name: 'Onions', quantity: '3', aisle: 'Produce', is_purchased: false },
      { id: '8', name: 'Garlic', quantity: '1 head', aisle: 'Produce', is_purchased: true },
    ]
  }
]

const aisleOrder = ['Produce', 'Meat', 'Dairy', 'Pantry', 'Frozen', 'Beverages', 'Other']

export default function GroceriesPage() {
  const [lists, setLists] = useState<GroceryList[]>(initialLists)
  const [activeListId, setActiveListId] = useState(lists[0]?.id)
  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState('')
  const [showAddItem, setShowAddItem] = useState(false)

  const activeList = lists.find(l => l.id === activeListId)

  const groupedItems = useMemo(() => {
    if (!activeList) return {}
    const groups: Record<string, GroceryItem[]> = {}

    activeList.items.forEach(item => {
      const aisle = item.aisle || 'Other'
      if (!groups[aisle]) groups[aisle] = []
      groups[aisle].push(item)
    })

    // Sort by aisle order
    const sorted: Record<string, GroceryItem[]> = {}
    aisleOrder.forEach(aisle => {
      if (groups[aisle]) sorted[aisle] = groups[aisle]
    })
    Object.keys(groups).forEach(aisle => {
      if (!sorted[aisle]) sorted[aisle] = groups[aisle]
    })

    return sorted
  }, [activeList])

  const stats = useMemo(() => {
    if (!activeList) return { total: 0, purchased: 0 }
    return {
      total: activeList.items.length,
      purchased: activeList.items.filter(i => i.is_purchased).length
    }
  }, [activeList])

  function toggleItem(itemId: string) {
    setLists(lists.map(list => {
      if (list.id !== activeListId) return list
      return {
        ...list,
        items: list.items.map(item =>
          item.id === itemId ? { ...item, is_purchased: !item.is_purchased } : item
        )
      }
    }))
  }

  function deleteItem(itemId: string) {
    setLists(lists.map(list => {
      if (list.id !== activeListId) return list
      return {
        ...list,
        items: list.items.filter(item => item.id !== itemId)
      }
    }))
    toast.success('Item removed')
  }

  function addItem(e: React.FormEvent) {
    e.preventDefault()
    if (!newItemName.trim()) return

    const newItem: GroceryItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      quantity: newItemQuantity || '1',
      aisle: 'Other',
      is_purchased: false
    }

    setLists(lists.map(list => {
      if (list.id !== activeListId) return list
      return {
        ...list,
        items: [...list.items, newItem]
      }
    }))

    setNewItemName('')
    setNewItemQuantity('')
    setShowAddItem(false)
    toast.success('Item added')
  }

  function createNewList() {
    const newList: GroceryList = {
      id: `list-${Date.now()}`,
      name: `Shopping List ${lists.length + 1}`,
      status: 'active',
      created_at: new Date().toISOString(),
      items: []
    }
    setLists([...lists, newList])
    setActiveListId(newList.id)
    toast.success('New list created')
  }

  function clearPurchased() {
    setLists(lists.map(list => {
      if (list.id !== activeListId) return list
      return {
        ...list,
        items: list.items.filter(item => !item.is_purchased)
      }
    }))
    toast.success('Purchased items cleared')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold text-gray-900">BestMealMate</span>
        </div>

        <nav className="space-y-1">
          {[
            { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: false },
            { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries', active: true },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
            { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: false },
            { icon: Users, label: 'Family', href: '/dashboard/family', active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="border-t border-gray-200 pt-4 space-y-1">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grocery Lists</h1>
            <p className="text-gray-600">Manage your shopping lists</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={createNewList}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New List
            </button>
          </div>
        </header>

        {/* List Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeListId === list.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {list.name}
            </button>
          ))}
        </div>

        {activeList && (
          <>
            {/* Progress Bar */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {stats.purchased} of {stats.total} items
                </span>
                <span className="text-sm text-gray-500">
                  {stats.total > 0 ? Math.round((stats.purchased / stats.total) * 100) : 0}% complete
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-300"
                  style={{ width: `${stats.total > 0 ? (stats.purchased / stats.total) * 100 : 0}%` }}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowAddItem(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
                {stats.purchased > 0 && (
                  <button
                    onClick={clearPurchased}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Clear Purchased
                  </button>
                )}
                <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add Item Form */}
            {showAddItem && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                <form onSubmit={addItem} className="flex gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Item name"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    placeholder="Qty"
                    className="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddItem(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}

            {/* Items by Aisle */}
            {Object.entries(groupedItems).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Your list is empty</p>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="text-brand-600 font-medium hover:text-brand-700"
                >
                  Add your first item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedItems).map(([aisle, items]) => (
                  <div key={aisle} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-700">{aisle}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {items.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                            item.is_purchased ? 'bg-gray-50' : ''
                          }`}
                        >
                          <button
                            onClick={() => toggleItem(item.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              item.is_purchased
                                ? 'bg-brand-600 border-brand-600 text-white'
                                : 'border-gray-300 hover:border-brand-400'
                            }`}
                          >
                            {item.is_purchased && <Check className="w-4 h-4" />}
                          </button>
                          <div className="flex-1">
                            <span className={`${item.is_purchased ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                              {item.name}
                            </span>
                            <span className="text-gray-500 ml-2">{item.quantity}</span>
                          </div>
                          <button
                            onClick={() => deleteItem(item.id)}
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
          </>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Calendar, label: 'Plan', href: '/dashboard', active: false },
            { icon: ShoppingCart, label: 'Groceries', href: '/dashboard/groceries', active: true },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
            { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: false },
            { icon: Users, label: 'Family', href: '/dashboard/family', active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                item.active ? 'text-brand-600' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
