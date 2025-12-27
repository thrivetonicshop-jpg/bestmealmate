'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ChefHat,
  Calendar,
  ShoppingCart,
  Refrigerator,
  Users,
  Plus,
  Search,
  Filter,
  X,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock,
  Check,
  Settings,
  LogOut,
  Snowflake,
  Home,
  Package,
  Camera
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { PantryItem, Ingredient } from '@/lib/database.types'
import toast, { Toaster } from 'react-hot-toast'

// Dynamically import FoodScanner to avoid SSR issues with camera
const FoodScanner = dynamic(() => import('@/components/FoodScanner'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
    <div className="text-white">Loading scanner...</div>
  </div>
})

type LocationType = 'fridge' | 'freezer' | 'pantry' | 'spice_rack' | 'other'

interface PantryItemWithIngredient extends PantryItem {
  ingredients?: Ingredient
}

interface FormData {
  ingredient_name: string
  quantity: number
  unit: string
  location: LocationType
  expiry_date: string
  is_staple: boolean
  notes: string
}

const initialFormData: FormData = {
  ingredient_name: '',
  quantity: 1,
  unit: '',
  location: 'pantry',
  expiry_date: '',
  is_staple: false,
  notes: ''
}

const locationIcons: Record<LocationType, typeof Refrigerator> = {
  fridge: Refrigerator,
  freezer: Snowflake,
  pantry: Package,
  spice_rack: Package,
  other: Home
}

const locationLabels: Record<LocationType, string> = {
  fridge: 'Fridge',
  freezer: 'Freezer',
  pantry: 'Pantry',
  spice_rack: 'Spice Rack',
  other: 'Other'
}

const categoryColors: Record<string, string> = {
  produce: 'bg-green-100 text-green-800',
  meat: 'bg-red-100 text-red-800',
  dairy: 'bg-blue-100 text-blue-800',
  grains: 'bg-amber-100 text-amber-800',
  pantry: 'bg-orange-100 text-orange-800',
  frozen: 'bg-cyan-100 text-cyan-800',
  spices: 'bg-purple-100 text-purple-800',
  condiments: 'bg-yellow-100 text-yellow-800',
  beverages: 'bg-indigo-100 text-indigo-800',
  default: 'bg-gray-100 text-gray-800'
}

export default function PantryPage() {
  const { household } = useAuth()
  const [items, setItems] = useState<PantryItemWithIngredient[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [editingItem, setEditingItem] = useState<PantryItemWithIngredient | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState<LocationType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'expired' | 'expiring' | 'fresh'>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Get household ID from auth context, fallback to demo
  const householdId = household?.id || 'demo-household-id'

  // Handle scanned items from food scanner
  const handleScannedItems = async (scannedItems: { name: string; quantity: string; category: string; confidence: number }[]) => {
    for (const item of scannedItems) {
      // Parse quantity string (e.g., "1 gallon" -> quantity: 1, unit: "gallon")
      const quantityMatch = item.quantity.match(/^([\d.]+)\s*(.*)$/)
      const quantity = quantityMatch ? parseFloat(quantityMatch[1]) : 1
      const unit = quantityMatch ? quantityMatch[2] : ''

      const newItem: PantryItemWithIngredient = {
        id: `scanned-${Date.now()}-${Math.random()}`,
        household_id: householdId,
        ingredient_id: `ing-${Date.now()}`,
        quantity,
        unit: unit || null,
        location: 'fridge',
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        added_date: new Date().toISOString().split('T')[0],
        is_staple: false,
        notes: `Scanned (${Math.round(item.confidence * 100)}% confidence)`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ingredients: {
          id: `ing-${Date.now()}`,
          name: item.name,
          category: item.category,
          default_unit: unit || null,
          calories_per_unit: null,
          protein_per_unit: null,
          carbs_per_unit: null,
          fat_per_unit: null,
          barcode: null,
          image_url: null,
          avg_shelf_life_days: null,
          created_at: new Date().toISOString()
        }
      }
      setItems(prev => [...prev, newItem])
    }
  }

  useEffect(() => {
    fetchPantryItems()
    fetchIngredients()
  }, [])

  async function fetchPantryItems() {
    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .select(`
          *,
          ingredients (*)
        `)
        .eq('household_id', householdId)
        .order('expiry_date', { ascending: true, nullsFirst: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching pantry items:', error)
      // Use mock data for demo
      setItems(getMockItems())
    } finally {
      setLoading(false)
    }
  }

  async function fetchIngredients() {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name')

      if (error) throw error
      setIngredients(data || [])
    } catch (error) {
      console.error('Error fetching ingredients:', error)
      setIngredients(getMockIngredients())
    }
  }

  function getMockItems(): PantryItemWithIngredient[] {
    const today = new Date()
    return [
      {
        id: '1',
        household_id: householdId,
        ingredient_id: '1',
        quantity: 2,
        unit: 'lb',
        location: 'fridge',
        expiry_date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        added_date: today.toISOString().split('T')[0],
        is_staple: false,
        notes: 'For meal prep',
        created_at: today.toISOString(),
        updated_at: today.toISOString(),
        ingredients: { id: '1', name: 'Chicken Breast', category: 'meat', default_unit: 'lb', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 3, created_at: today.toISOString() }
      },
      {
        id: '2',
        household_id: householdId,
        ingredient_id: '2',
        quantity: 5,
        unit: 'oz',
        location: 'fridge',
        expiry_date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        added_date: today.toISOString().split('T')[0],
        is_staple: false,
        notes: '',
        created_at: today.toISOString(),
        updated_at: today.toISOString(),
        ingredients: { id: '2', name: 'Spinach', category: 'produce', default_unit: 'oz', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 5, created_at: today.toISOString() }
      },
      {
        id: '3',
        household_id: householdId,
        ingredient_id: '3',
        quantity: 1,
        unit: 'gallon',
        location: 'fridge',
        expiry_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        added_date: today.toISOString().split('T')[0],
        is_staple: true,
        notes: '',
        created_at: today.toISOString(),
        updated_at: today.toISOString(),
        ingredients: { id: '3', name: 'Milk', category: 'dairy', default_unit: 'gallon', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 7, created_at: today.toISOString() }
      },
      {
        id: '4',
        household_id: householdId,
        ingredient_id: '4',
        quantity: 2,
        unit: 'lb',
        location: 'pantry',
        expiry_date: new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        added_date: today.toISOString().split('T')[0],
        is_staple: true,
        notes: '',
        created_at: today.toISOString(),
        updated_at: today.toISOString(),
        ingredients: { id: '4', name: 'Rice', category: 'grains', default_unit: 'lb', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 365, created_at: today.toISOString() }
      },
      {
        id: '5',
        household_id: householdId,
        ingredient_id: '5',
        quantity: 1,
        unit: 'lb',
        location: 'freezer',
        expiry_date: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        added_date: today.toISOString().split('T')[0],
        is_staple: false,
        notes: 'Ground beef for tacos',
        created_at: today.toISOString(),
        updated_at: today.toISOString(),
        ingredients: { id: '5', name: 'Ground Beef', category: 'meat', default_unit: 'lb', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 2, created_at: today.toISOString() }
      },
      {
        id: '6',
        household_id: householdId,
        ingredient_id: '6',
        quantity: 12,
        unit: 'count',
        location: 'fridge',
        expiry_date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        added_date: today.toISOString().split('T')[0],
        is_staple: true,
        notes: '',
        created_at: today.toISOString(),
        updated_at: today.toISOString(),
        ingredients: { id: '6', name: 'Eggs', category: 'dairy', default_unit: 'dozen', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 21, created_at: today.toISOString() }
      }
    ]
  }

  function getMockIngredients(): Ingredient[] {
    return [
      { id: '1', name: 'Chicken Breast', category: 'meat', default_unit: 'lb', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 3, created_at: new Date().toISOString() },
      { id: '2', name: 'Spinach', category: 'produce', default_unit: 'oz', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 5, created_at: new Date().toISOString() },
      { id: '3', name: 'Milk', category: 'dairy', default_unit: 'gallon', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 7, created_at: new Date().toISOString() },
      { id: '4', name: 'Rice', category: 'grains', default_unit: 'lb', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 365, created_at: new Date().toISOString() },
      { id: '5', name: 'Ground Beef', category: 'meat', default_unit: 'lb', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 2, created_at: new Date().toISOString() },
      { id: '6', name: 'Eggs', category: 'dairy', default_unit: 'dozen', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 21, created_at: new Date().toISOString() },
      { id: '7', name: 'Onion', category: 'produce', default_unit: 'whole', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 30, created_at: new Date().toISOString() },
      { id: '8', name: 'Garlic', category: 'produce', default_unit: 'head', calories_per_unit: null, protein_per_unit: null, carbs_per_unit: null, fat_per_unit: null, barcode: null, image_url: null, avg_shelf_life_days: 14, created_at: new Date().toISOString() },
    ]
  }

  function getExpiryStatus(expiryDate: string | null): 'expired' | 'expiring' | 'fresh' {
    if (!expiryDate) return 'fresh'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 3) return 'expiring'
    return 'fresh'
  }

  function getDaysUntilExpiry(expiryDate: string | null): number | null {
    if (!expiryDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(expiryDate)
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      const name = item.ingredients?.name || ''
      if (searchTerm && !name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Location filter
      if (filterLocation !== 'all' && item.location !== filterLocation) {
        return false
      }

      // Status filter
      if (filterStatus !== 'all') {
        const status = getExpiryStatus(item.expiry_date)
        if (status !== filterStatus) return false
      }

      return true
    })
  }, [items, searchTerm, filterLocation, filterStatus])

  const stats = useMemo(() => {
    const expired = items.filter(i => getExpiryStatus(i.expiry_date) === 'expired').length
    const expiring = items.filter(i => getExpiryStatus(i.expiry_date) === 'expiring').length
    const fresh = items.filter(i => getExpiryStatus(i.expiry_date) === 'fresh').length
    const staples = items.filter(i => i.is_staple).length

    return { total: items.length, expired, expiring, fresh, staples }
  }, [items])

  function openAddModal() {
    setEditingItem(null)
    setFormData(initialFormData)
    setShowModal(true)
  }

  function openEditModal(item: PantryItemWithIngredient) {
    setEditingItem(item)
    setFormData({
      ingredient_name: item.ingredients?.name || '',
      quantity: item.quantity,
      unit: item.unit || '',
      location: item.location,
      expiry_date: item.expiry_date || '',
      is_staple: item.is_staple,
      notes: item.notes || ''
    })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.ingredient_name.trim()) {
      toast.error('Please enter an ingredient name')
      return
    }

    try {
      // Find or create ingredient
      let ingredientId = ingredients.find(
        i => i.name.toLowerCase() === formData.ingredient_name.toLowerCase()
      )?.id

      if (!ingredientId) {
        // Create new ingredient
        const { data: newIngredient, error: ingredientError } = await supabase
          .from('ingredients')
          .insert({ name: formData.ingredient_name })
          .select()
          .single()

        if (ingredientError) throw ingredientError
        ingredientId = newIngredient.id
        setIngredients([...ingredients, newIngredient])
      }

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('pantry_items')
          .update({
            ingredient_id: ingredientId,
            quantity: formData.quantity,
            unit: formData.unit || null,
            location: formData.location,
            expiry_date: formData.expiry_date || null,
            is_staple: formData.is_staple,
            notes: formData.notes || null
          })
          .eq('id', editingItem.id)

        if (error) throw error
        toast.success('Item updated successfully')
      } else {
        // Add new item
        const { error } = await supabase
          .from('pantry_items')
          .insert({
            household_id: householdId,
            ingredient_id: ingredientId,
            quantity: formData.quantity,
            unit: formData.unit || null,
            location: formData.location,
            expiry_date: formData.expiry_date || null,
            is_staple: formData.is_staple,
            notes: formData.notes || null
          })

        if (error) throw error
        toast.success('Item added successfully')
      }

      setShowModal(false)
      fetchPantryItems()
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error('Failed to save item')

      // Demo mode: update local state
      if (editingItem) {
        setItems(items.map(i =>
          i.id === editingItem.id
            ? {
                ...i,
                quantity: formData.quantity,
                unit: formData.unit || null,
                location: formData.location,
                expiry_date: formData.expiry_date || null,
                is_staple: formData.is_staple,
                notes: formData.notes || null,
                ingredients: { ...i.ingredients!, name: formData.ingredient_name }
              }
            : i
        ))
        toast.success('Item updated (demo mode)')
      } else {
        const newItem: PantryItemWithIngredient = {
          id: `demo-${Date.now()}`,
          household_id: householdId,
          ingredient_id: `demo-ing-${Date.now()}`,
          quantity: formData.quantity,
          unit: formData.unit || null,
          location: formData.location,
          expiry_date: formData.expiry_date || null,
          added_date: new Date().toISOString().split('T')[0],
          is_staple: formData.is_staple,
          notes: formData.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ingredients: {
            id: `demo-ing-${Date.now()}`,
            name: formData.ingredient_name,
            category: null,
            default_unit: formData.unit || null,
            calories_per_unit: null,
            protein_per_unit: null,
            carbs_per_unit: null,
            fat_per_unit: null,
            barcode: null,
            image_url: null,
            avg_shelf_life_days: null,
            created_at: new Date().toISOString()
          }
        }
        setItems([...items, newItem])
        toast.success('Item added (demo mode)')
      }
      setShowModal(false)
    }
  }

  async function handleDelete(item: PantryItemWithIngredient) {
    if (!confirm(`Delete ${item.ingredients?.name}?`)) return

    try {
      const { error } = await supabase
        .from('pantry_items')
        .delete()
        .eq('id', item.id)

      if (error) throw error
      toast.success('Item deleted')
      fetchPantryItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      // Demo mode
      setItems(items.filter(i => i.id !== item.id))
      toast.success('Item deleted (demo mode)')
    }
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
            { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries', active: false },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: true },
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
            <h1 className="text-2xl font-bold text-gray-900">Pantry</h1>
            <p className="text-gray-600">Manage your ingredients and track expiry dates</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              <Camera className="w-5 h-5" />
              Scan Food
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Fresh</p>
            <p className="text-2xl font-bold text-green-600">{stats.fresh}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Expiring Soon</p>
            <p className="text-2xl font-bold text-amber-600">{stats.expiring}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Expired</p>
            <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 col-span-2 lg:col-span-1">
            <p className="text-sm text-gray-500 mb-1">Staples</p>
            <p className="text-2xl font-bold text-brand-600">{stats.staples}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters || filterLocation !== 'all' || filterStatus !== 'all'
                  ? 'bg-brand-50 border-brand-300 text-brand-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {(filterLocation !== 'all' || filterStatus !== 'all') && (
                <span className="bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {(filterLocation !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value as LocationType | 'all')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                >
                  <option value="all">All Locations</option>
                  {Object.entries(locationLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'expired' | 'expiring' | 'fresh')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="fresh">Fresh</option>
                  <option value="expiring">Expiring Soon</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pantry items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Refrigerator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {items.length === 0 ? 'Your pantry is empty' : 'No items match your search'}
            </p>
            {items.length === 0 && (
              <button
                onClick={openAddModal}
                className="text-brand-600 font-medium hover:text-brand-700"
              >
                Add your first item
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const status = getExpiryStatus(item.expiry_date)
              const daysLeft = getDaysUntilExpiry(item.expiry_date)
              const LocationIcon = locationIcons[item.location]
              const category = item.ingredients?.category || 'default'

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl p-4 border-2 transition-all hover:shadow-md ${
                    status === 'expired'
                      ? 'border-red-200 bg-red-50'
                      : status === 'expiring'
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{item.ingredients?.name}</h3>
                        {item.is_staple && (
                          <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                            Staple
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[category] || categoryColors.default}`}>
                      {category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                      <LocationIcon className="w-3 h-3" />
                      {locationLabels[item.location]}
                    </span>
                  </div>

                  {item.expiry_date && (
                    <div className={`flex items-center gap-2 text-sm ${
                      status === 'expired'
                        ? 'text-red-700'
                        : status === 'expiring'
                        ? 'text-amber-700'
                        : 'text-gray-600'
                    }`}>
                      {status === 'expired' ? (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          <span>Expired {Math.abs(daysLeft!)} day{Math.abs(daysLeft!) !== 1 ? 's' : ''} ago</span>
                        </>
                      ) : status === 'expiring' ? (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Fresh ({daysLeft} days left)</span>
                        </>
                      )}
                    </div>
                  )}

                  {item.notes && (
                    <p className="mt-2 text-xs text-gray-500 italic">{item.notes}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Item' : 'Add to Pantry'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredient Name *
                  </label>
                  <input
                    type="text"
                    value={formData.ingredient_name}
                    onChange={(e) => setFormData({ ...formData, ingredient_name: e.target.value })}
                    placeholder="e.g., Chicken Breast"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    list="ingredients-list"
                    required
                  />
                  <datalist id="ingredients-list">
                    {ingredients.map(ing => (
                      <option key={ing.id} value={ing.name} />
                    ))}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="e.g., lb, oz, count"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value as LocationType })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                  >
                    {Object.entries(locationLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional notes..."
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_staple}
                    onChange={(e) => setFormData({ ...formData, is_staple: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Mark as staple item (always keep in stock)</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
                  >
                    {editingItem ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Calendar, label: 'Plan', href: '/dashboard', active: false },
            { icon: ShoppingCart, label: 'Groceries', href: '/dashboard/groceries', active: false },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: true },
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

      {/* Food Scanner Modal */}
      {showScanner && (
        <FoodScanner
          onItemsDetected={handleScannedItems}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}
