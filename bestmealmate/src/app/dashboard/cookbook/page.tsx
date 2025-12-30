'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'
import {
  ChefHat,
  Calendar,
  ShoppingCart,
  Refrigerator,
  Users,
  BookOpen,
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  Flame,
  Heart,
  MoreVertical,
  Edit,
  Trash2,
  FolderPlus,
  Tag,
  StickyNote,
  X,
  Check,
  ChevronRight,
  Settings,
  LogOut,
  Grid,
  List,
  SortAsc,
  Watch,
  Utensils,
  Leaf,
  Wheat,
  Fish,
  Egg,
  Milk,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

// Predefined filter categories
const FILTER_CATEGORIES = {
  mealType: {
    label: 'Meal Type',
    options: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'appetizer']
  },
  cuisine: {
    label: 'Cuisine',
    options: ['italian', 'mexican', 'asian', 'american', 'mediterranean', 'indian', 'french', 'thai', 'japanese', 'korean']
  },
  dietary: {
    label: 'Dietary',
    options: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein']
  },
  difficulty: {
    label: 'Difficulty',
    options: ['easy', 'medium', 'hard']
  },
  cookingMethod: {
    label: 'Cooking Method',
    options: ['baking', 'grilling', 'stovetop', 'slow-cooker', 'instant-pot', 'no-cook', 'air-fryer']
  },
  occasion: {
    label: 'Occasion',
    options: ['weeknight', 'meal-prep', 'party', 'holiday', 'date-night', 'kid-friendly', 'budget-friendly']
  }
}

// Types
interface SavedRecipe {
  id: string
  name: string
  emoji: string
  description: string
  prepTime: string
  cookTime: string
  servings: number
  calories: number
  ingredients: Array<{ name: string; amount: string }>
  instructions: string[]
  tags: string[]
  collectionId: string
  notes: string
  rating: number
  isFavorite: boolean
  createdAt: Date
  lastCooked?: Date
  timesCooked: number
  imageUrl?: string
  source: 'scanned' | 'imported' | 'manual' | 'ai-generated'
}

interface Collection {
  id: string
  name: string
  emoji: string
  color: string
  description: string
  recipeCount: number
  createdAt: Date
}

// Navigation items
const navItems = [
  { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: false },
  { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries', active: false },
  { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
  { icon: BookOpen, label: 'Cookbook', href: '/dashboard/cookbook', active: true },
  { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: false },
  { icon: Users, label: 'Family', href: '/dashboard/family', active: false },
  { icon: Watch, label: 'Health', href: '/dashboard/wearables', active: false },
]

// Sample collections
const SAMPLE_COLLECTIONS: Collection[] = [
  { id: 'all', name: 'All Recipes', emoji: '📚', color: 'from-gray-500 to-gray-600', description: 'All your saved recipes', recipeCount: 0, createdAt: new Date() },
  { id: 'favorites', name: 'Favorites', emoji: '❤️', color: 'from-red-500 to-pink-500', description: 'Your favorite recipes', recipeCount: 0, createdAt: new Date() },
  { id: 'quick-meals', name: 'Quick Meals', emoji: '⚡', color: 'from-yellow-500 to-orange-500', description: 'Ready in 30 minutes or less', recipeCount: 0, createdAt: new Date() },
  { id: 'healthy', name: 'Healthy', emoji: '🥗', color: 'from-green-500 to-emerald-500', description: 'Nutritious and balanced', recipeCount: 0, createdAt: new Date() },
  { id: 'comfort-food', name: 'Comfort Food', emoji: '🍲', color: 'from-amber-500 to-orange-500', description: 'Soul-warming dishes', recipeCount: 0, createdAt: new Date() },
  { id: 'desserts', name: 'Desserts', emoji: '🍰', color: 'from-pink-500 to-purple-500', description: 'Sweet treats', recipeCount: 0, createdAt: new Date() },
]

// Sample saved recipes
const SAMPLE_RECIPES: SavedRecipe[] = [
  {
    id: 'r1',
    name: 'Honey Garlic Chicken',
    emoji: '🍗',
    description: 'Sweet and savory chicken with a sticky honey garlic glaze',
    prepTime: '15 min',
    cookTime: '25 min',
    servings: 4,
    calories: 380,
    ingredients: [
      { name: 'Chicken thighs', amount: '2 lbs' },
      { name: 'Honey', amount: '1/4 cup' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Butter', amount: '2 tbsp' },
    ],
    instructions: [
      'Season chicken with salt and pepper',
      'Sear chicken in a hot pan until golden',
      'Make honey garlic sauce',
      'Add sauce to chicken and simmer',
      'Serve with rice and vegetables'
    ],
    tags: ['dinner', 'chicken', 'asian-inspired', 'family-friendly'],
    collectionId: 'quick-meals',
    notes: 'Kids love this! Double the sauce for extra.',
    rating: 5,
    isFavorite: true,
    createdAt: new Date(Date.now() - 7 * 86400000),
    lastCooked: new Date(Date.now() - 2 * 86400000),
    timesCooked: 5,
    source: 'scanned'
  },
  {
    id: 'r2',
    name: 'Mediterranean Quinoa Bowl',
    emoji: '🥗',
    description: 'Fresh and healthy bowl with quinoa, vegetables, and feta',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 2,
    calories: 420,
    ingredients: [
      { name: 'Quinoa', amount: '1 cup' },
      { name: 'Cucumber', amount: '1 medium' },
      { name: 'Cherry tomatoes', amount: '1 cup' },
      { name: 'Feta cheese', amount: '1/2 cup' },
      { name: 'Olives', amount: '1/4 cup' },
      { name: 'Lemon', amount: '1' },
    ],
    instructions: [
      'Cook quinoa according to package',
      'Chop vegetables',
      'Make lemon dressing',
      'Combine all ingredients',
      'Top with feta and serve'
    ],
    tags: ['lunch', 'healthy', 'vegetarian', 'meal-prep'],
    collectionId: 'healthy',
    notes: 'Great for meal prep - lasts 3 days in fridge',
    rating: 4,
    isFavorite: true,
    createdAt: new Date(Date.now() - 14 * 86400000),
    lastCooked: new Date(Date.now() - 5 * 86400000),
    timesCooked: 8,
    source: 'imported'
  },
  {
    id: 'r3',
    name: 'Classic Chocolate Brownies',
    emoji: '🍫',
    description: 'Rich, fudgy brownies with a crackly top',
    prepTime: '15 min',
    cookTime: '25 min',
    servings: 12,
    calories: 280,
    ingredients: [
      { name: 'Dark chocolate', amount: '200g' },
      { name: 'Butter', amount: '150g' },
      { name: 'Sugar', amount: '1 cup' },
      { name: 'Eggs', amount: '3' },
      { name: 'Flour', amount: '3/4 cup' },
      { name: 'Cocoa powder', amount: '1/4 cup' },
    ],
    instructions: [
      'Melt chocolate and butter together',
      'Whisk in sugar and eggs',
      'Fold in flour and cocoa',
      'Pour into prepared pan',
      'Bake at 350°F for 25 minutes'
    ],
    tags: ['dessert', 'chocolate', 'baking', 'party'],
    collectionId: 'desserts',
    notes: 'Don\'t overbake! Center should be slightly gooey.',
    rating: 5,
    isFavorite: false,
    createdAt: new Date(Date.now() - 30 * 86400000),
    timesCooked: 3,
    source: 'manual'
  },
  {
    id: 'r4',
    name: 'Creamy Tomato Pasta',
    emoji: '🍝',
    description: 'Comforting pasta in a rich tomato cream sauce',
    prepTime: '10 min',
    cookTime: '20 min',
    servings: 4,
    calories: 520,
    ingredients: [
      { name: 'Pasta', amount: '1 lb' },
      { name: 'Crushed tomatoes', amount: '28 oz can' },
      { name: 'Heavy cream', amount: '1/2 cup' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Parmesan', amount: '1/2 cup' },
      { name: 'Basil', amount: '1/4 cup' },
    ],
    instructions: [
      'Cook pasta al dente',
      'Sauté garlic in olive oil',
      'Add tomatoes and simmer',
      'Stir in cream and cheese',
      'Toss with pasta and basil'
    ],
    tags: ['dinner', 'pasta', 'italian', 'comfort-food'],
    collectionId: 'comfort-food',
    notes: 'Add red pepper flakes for a kick!',
    rating: 4,
    isFavorite: true,
    createdAt: new Date(Date.now() - 21 * 86400000),
    lastCooked: new Date(Date.now() - 3 * 86400000),
    timesCooked: 6,
    source: 'ai-generated'
  },
]

// New Recipe Form Component
function NewRecipeForm({
  collections,
  pendingScannedItem,
  onSave,
  onCancel
}: {
  collections: Collection[]
  pendingScannedItem: {
    id: string
    name: string
    emoji: string
    ingredients: Array<{ name: string; amount: string }>
    source: string
    createdAt: string
    previewImage?: string
  } | null
  onSave: (recipe: SavedRecipe) => void
  onCancel: () => void
}) {
  const [recipeName, setRecipeName] = useState(pendingScannedItem?.name || '')
  const [description, setDescription] = useState('')
  const [selectedCollection, setSelectedCollection] = useState(collections[0]?.id || '')
  const [notes, setNotes] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [prepTime, setPrepTime] = useState('15 min')
  const [cookTime, setCookTime] = useState('30 min')
  const [servings, setServings] = useState(4)

  const handleSave = () => {
    if (!recipeName.trim()) return

    const newRecipe: SavedRecipe = {
      id: `recipe-${Date.now()}`,
      name: recipeName,
      emoji: pendingScannedItem?.emoji || '🍽️',
      description: description || 'Recipe from scanned ingredients',
      prepTime,
      cookTime,
      servings,
      calories: Math.floor(Math.random() * 300) + 200,
      ingredients: pendingScannedItem?.ingredients || [],
      instructions: ['Prepare ingredients', 'Cook as desired', 'Serve and enjoy'],
      tags: selectedTags,
      collectionId: selectedCollection,
      notes,
      rating: 0,
      isFavorite: false,
      createdAt: new Date(),
      timesCooked: 0,
      imageUrl: pendingScannedItem?.previewImage,
      source: 'scanned'
    }

    onSave(newRecipe)
  }

  return (
    <div className="space-y-4">
      {/* Recipe Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name</label>
        <input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="Give your recipe a name..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your recipe..."
          rows={2}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none resize-none"
        />
      </div>

      {/* Collection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Save to Collection</label>
        <div className="flex flex-wrap gap-2">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                selectedCollection === collection.id
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span>{collection.emoji}</span>
              <span className="text-sm font-medium">{collection.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time & Servings */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time</label>
          <select
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-500 outline-none"
          >
            <option value="5 min">5 min</option>
            <option value="10 min">10 min</option>
            <option value="15 min">15 min</option>
            <option value="20 min">20 min</option>
            <option value="30 min">30 min</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time</label>
          <select
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-500 outline-none"
          >
            <option value="15 min">15 min</option>
            <option value="30 min">30 min</option>
            <option value="45 min">45 min</option>
            <option value="1 hour">1 hour</option>
            <option value="1.5 hours">1.5 hours</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(parseInt(e.target.value) || 1)}
            min={1}
            max={12}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Tags</label>
        <div className="flex flex-wrap gap-2">
          {['breakfast', 'lunch', 'dinner', 'snack', 'healthy', 'quick', 'vegetarian', 'comfort-food'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTags(prev =>
                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
              )}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                selectedTags.includes(tag)
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add cooking tips, modifications, or reminders..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!recipeName.trim()}
          className="flex-1 px-4 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          Save Recipe
        </button>
      </div>
    </div>
  )
}

export default function CookbookPage() {
  const searchParams = useSearchParams()
  const { signOut } = useAuth()
  const [collections, setCollections] = useState<Collection[]>(SAMPLE_COLLECTIONS)
  const [recipes, setRecipes] = useState<SavedRecipe[]>(SAMPLE_RECIPES)
  const [activeCollection, setActiveCollection] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'rating' | 'cooked'>('recent')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionEmoji, setNewCollectionEmoji] = useState('📁')
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null)
  const [editingNotes, setEditingNotes] = useState(false)
  const [editedNotes, setEditedNotes] = useState('')

  // Advanced filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [showAddTagModal, setShowAddTagModal] = useState(false)
  const [newCustomTag, setNewCustomTag] = useState('')
  const [editingRecipeTags, setEditingRecipeTags] = useState<string | null>(null)
  const [showNewRecipeModal, setShowNewRecipeModal] = useState(false)
  const [pendingScannedItem, setPendingScannedItem] = useState<{
    id: string
    name: string
    emoji: string
    ingredients: Array<{ name: string; amount: string }>
    source: string
    createdAt: string
    previewImage?: string
  } | null>(null)

  // Check for incoming scanned items
  useEffect(() => {
    const fromScan = searchParams.get('from')
    if (fromScan === 'scan') {
      const pendingItems = localStorage.getItem('pendingCookbookItems')
      if (pendingItems) {
        const items = JSON.parse(pendingItems)
        if (items.length > 0) {
          const latestItem = items[items.length - 1]
          setPendingScannedItem(latestItem)
          setShowNewRecipeModal(true)
          localStorage.removeItem('pendingCookbookItems')
          toast.success('Scanned ingredients ready to save!')
        }
      }
      // Clean URL
      window.history.replaceState({}, '', '/dashboard/cookbook')
    }
  }, [searchParams])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    recipes.forEach(r => r.tags.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [recipes])

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    let result = [...recipes]

    // Filter by collection
    if (activeCollection === 'favorites') {
      result = result.filter(r => r.isFavorite)
    } else if (activeCollection !== 'all') {
      result = result.filter(r => r.collectionId === activeCollection)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some(t => t.toLowerCase().includes(query)) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(query))
      )
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter(r =>
        selectedTags.every(tag => r.tags.includes(tag))
      )
    }

    // Apply advanced filters
    Object.entries(selectedFilters).forEach(([, filterValues]) => {
      if (filterValues.length > 0) {
        result = result.filter(r =>
          filterValues.some(filterValue => r.tags.includes(filterValue))
        )
      }
    })

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'cooked':
        result.sort((a, b) => b.timesCooked - a.timesCooked)
        break
      default:
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    return result
  }, [recipes, activeCollection, searchQuery, selectedTags, sortBy, selectedFilters])

  // Update collection counts
  const collectionsWithCounts = useMemo(() => {
    return collections.map(c => ({
      ...c,
      recipeCount: c.id === 'all'
        ? recipes.length
        : c.id === 'favorites'
          ? recipes.filter(r => r.isFavorite).length
          : recipes.filter(r => r.collectionId === c.id).length
    }))
  }, [collections, recipes])

  const toggleFavorite = (recipeId: string) => {
    setRecipes(prev => prev.map(r =>
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    ))
    if (selectedRecipe?.id === recipeId) {
      setSelectedRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null)
    }
  }

  const updateRecipeNotes = (recipeId: string, notes: string) => {
    setRecipes(prev => prev.map(r =>
      r.id === recipeId ? { ...r, notes } : r
    ))
    if (selectedRecipe?.id === recipeId) {
      setSelectedRecipe(prev => prev ? { ...prev, notes } : null)
    }
    setEditingNotes(false)
  }

  const deleteRecipe = (recipeId: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      setRecipes(prev => prev.filter(r => r.id !== recipeId))
      setSelectedRecipe(null)
    }
  }

  const moveToCollection = (recipeId: string, collectionId: string) => {
    setRecipes(prev => prev.map(r =>
      r.id === recipeId ? { ...r, collectionId } : r
    ))
    if (selectedRecipe?.id === recipeId) {
      setSelectedRecipe(prev => prev ? { ...prev, collectionId } : null)
    }
  }

  const createCollection = () => {
    if (!newCollectionName.trim()) return
    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name: newCollectionName,
      emoji: newCollectionEmoji,
      color: 'from-blue-500 to-indigo-500',
      description: '',
      recipeCount: 0,
      createdAt: new Date()
    }
    setCollections(prev => [...prev, newCollection])
    setNewCollectionName('')
    setNewCollectionEmoji('📁')
    setShowNewCollection(false)
  }

  const getSourceBadge = (source: SavedRecipe['source']) => {
    switch (source) {
      case 'scanned':
        return { label: 'Scanned', color: 'bg-emerald-100 text-emerald-700' }
      case 'imported':
        return { label: 'Imported', color: 'bg-blue-100 text-blue-700' }
      case 'ai-generated':
        return { label: 'AI Generated', color: 'bg-purple-100 text-purple-700' }
      default:
        return { label: 'Manual', color: 'bg-gray-100 text-gray-700' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BestMealMate</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.active && <div className="ml-auto w-2 h-2 rounded-full bg-white/50" />}
            </Link>
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="border-t border-gray-100 p-4 space-y-1">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Cookbook</h1>
                <p className="text-gray-500">{recipes.length} saved recipes</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {viewMode === 'grid' ? <List className="w-5 h-5 text-gray-600" /> : <Grid className="w-5 h-5 text-gray-600" />}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2.5 rounded-xl transition-colors ${showFilters ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <Filter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <SortAsc className="w-4 h-4" />
                  <span className="text-sm">Advanced</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes, ingredients, or tags..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Sort by</span>
                  <div className="flex gap-2">
                    {[
                      { value: 'recent', label: 'Recent' },
                      { value: 'name', label: 'Name' },
                      { value: 'rating', label: 'Rating' },
                      { value: 'cooked', label: 'Most Cooked' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as typeof sortBy)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          sortBy === option.value
                            ? 'bg-brand-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700 block mb-2">Filter by tags</span>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTags(prev =>
                          prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                        )}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-brand-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-sm text-brand-600 hover:text-brand-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Collections */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Collections</h2>
              <button
                onClick={() => setShowNewCollection(true)}
                className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                New Collection
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {collectionsWithCounts.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => setActiveCollection(collection.id)}
                  className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    activeCollection === collection.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{collection.emoji}</span>
                  <div className="text-left">
                    <p className={`font-medium ${activeCollection === collection.id ? 'text-brand-700' : 'text-gray-900'}`}>
                      {collection.name}
                    </p>
                    <p className="text-xs text-gray-500">{collection.recipeCount} recipes</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recipes Grid/List */}
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedTags.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Start adding recipes to your cookbook'}
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Scan Food to Add Recipes
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group"
                >
                  <div className={`h-32 bg-gradient-to-br ${
                    collectionsWithCounts.find(c => c.id === recipe.collectionId)?.color || 'from-gray-400 to-gray-500'
                  } flex items-center justify-center relative`}>
                    <span className="text-6xl">{recipe.emoji}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(recipe.id)
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/40 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                    </button>
                    <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-lg ${getSourceBadge(recipe.source).color}`}>
                      {getSourceBadge(recipe.source).label}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">
                      {recipe.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {recipe.calories} cal
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {recipe.rating}
                      </span>
                    </div>
                    {recipe.notes && (
                      <div className="mt-3 flex items-start gap-2 p-2 bg-amber-50 rounded-lg">
                        <StickyNote className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 line-clamp-2">{recipe.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex items-center gap-4"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                    collectionsWithCounts.find(c => c.id === recipe.collectionId)?.color || 'from-gray-400 to-gray-500'
                  } flex items-center justify-center flex-shrink-0`}>
                    <span className="text-3xl">{recipe.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{recipe.name}</h3>
                      {recipe.isFavorite && <Heart className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{recipe.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {recipe.calories} cal
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {recipe.rating}
                      </span>
                      <span className={`px-2 py-0.5 rounded ${getSourceBadge(recipe.source).color}`}>
                        {getSourceBadge(recipe.source).label}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 lg:hidden safe-area-pb">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                item.active
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* New Collection Modal */}
      {showNewCollection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Collection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Collection Name</label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g., Weeknight Dinners"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                <div className="flex gap-2 flex-wrap">
                  {['📁', '🍳', '🥘', '🍜', '🥙', '🍕', '🌮', '🍣', '🥐', '🧁'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewCollectionEmoji(emoji)}
                      className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${
                        newCollectionEmoji === emoji
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewCollection(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createCollection}
                disabled={!newCollectionName.trim()}
                className="flex-1 px-4 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {Object.entries(FILTER_CATEGORIES).map(([key, category]) => (
                <div key={key}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">{category.label}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedFilters(prev => {
                            const current = prev[key] || []
                            if (current.includes(option)) {
                              return { ...prev, [key]: current.filter(o => o !== option) }
                            } else {
                              return { ...prev, [key]: [...current, option] }
                            }
                          })
                        }}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                          (selectedFilters[key] || []).includes(option)
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setSelectedFilters({})}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="flex-1 px-4 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Recipe Modal (for scanned items) */}
      {showNewRecipeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {pendingScannedItem ? 'Save Scanned Recipe' : 'Add New Recipe'}
                </h3>
                <button
                  onClick={() => {
                    setShowNewRecipeModal(false)
                    setPendingScannedItem(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Preview Image */}
              {pendingScannedItem?.previewImage && (
                <div className="mb-6 relative w-full h-48 rounded-xl overflow-hidden">
                  <Image
                    src={pendingScannedItem.previewImage}
                    alt="Scanned preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Scanned Ingredients */}
              {pendingScannedItem && (
                <div className="mb-6 p-4 bg-emerald-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-emerald-700 mb-2">Identified Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {pendingScannedItem.ingredients.map((ing, i) => (
                      <span key={i} className="px-3 py-1 bg-white text-emerald-700 rounded-full text-sm">
                        {ing.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <NewRecipeForm
                collections={collectionsWithCounts.filter(c => c.id !== 'all' && c.id !== 'favorites')}
                pendingScannedItem={pendingScannedItem}
                onSave={(recipe) => {
                  setRecipes(prev => [recipe, ...prev])
                  setShowNewRecipeModal(false)
                  setPendingScannedItem(null)
                  toast.success('Recipe saved to cookbook!')
                }}
                onCancel={() => {
                  setShowNewRecipeModal(false)
                  setPendingScannedItem(null)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Tag Modal */}
      {showAddTagModal && editingRecipeTags && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Manage Recipe Tags</h3>

            {/* Current Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Tags</label>
              <div className="flex flex-wrap gap-2">
                {recipes.find(r => r.id === editingRecipeTags)?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => {
                        setRecipes(prev => prev.map(r =>
                          r.id === editingRecipeTags
                            ? { ...r, tags: r.tags.filter(t => t !== tag) }
                            : r
                        ))
                      }}
                      className="p-0.5 hover:bg-brand-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add New Tag */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add New Tag</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCustomTag}
                  onChange={(e) => setNewCustomTag(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g., family-favorite"
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                />
                <button
                  onClick={() => {
                    if (newCustomTag.trim()) {
                      setRecipes(prev => prev.map(r =>
                        r.id === editingRecipeTags
                          ? { ...r, tags: [...new Set([...r.tags, newCustomTag.trim()])] }
                          : r
                      ))
                      setNewCustomTag('')
                    }
                  }}
                  disabled={!newCustomTag.trim()}
                  className="px-4 py-2 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Suggested Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Tags</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(FILTER_CATEGORIES).flatMap(cat => cat.options).slice(0, 12).map((tag) => {
                  const recipe = recipes.find(r => r.id === editingRecipeTags)
                  const hasTag = recipe?.tags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        if (!hasTag) {
                          setRecipes(prev => prev.map(r =>
                            r.id === editingRecipeTags
                              ? { ...r, tags: [...r.tags, tag] }
                              : r
                          ))
                        }
                      }}
                      disabled={hasTag}
                      className={`px-3 py-1 text-sm rounded-full border transition-all ${
                        hasTag
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-brand-500 hover:bg-brand-50 text-gray-600'
                      }`}
                    >
                      +{tag}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setShowAddTagModal(false)
                setEditingRecipeTags(null)
                setNewCustomTag('')
              }}
              className="w-full px-4 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className={`h-48 bg-gradient-to-br ${
              collectionsWithCounts.find(c => c.id === selectedRecipe.collectionId)?.color || 'from-gray-400 to-gray-500'
            } flex items-center justify-center relative sticky top-0`}>
              <span className="text-8xl">{selectedRecipe.emoji}</span>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/40 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => toggleFavorite(selectedRecipe.id)}
                className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/40 transition-colors"
              >
                <Heart className={`w-6 h-6 ${selectedRecipe.isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
              </button>
              <span className={`absolute bottom-4 left-4 text-sm px-3 py-1 rounded-lg ${getSourceBadge(selectedRecipe.source).color}`}>
                {getSourceBadge(selectedRecipe.source).label}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedRecipe.name}</h2>
                  <p className="text-gray-600">{selectedRecipe.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= selectedRecipe.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{selectedRecipe.prepTime}</p>
                  <p className="text-xs text-gray-500">Prep</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Flame className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{selectedRecipe.cookTime}</p>
                  <p className="text-xs text-gray-500">Cook</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Users className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{selectedRecipe.servings}</p>
                  <p className="text-xs text-gray-500">Servings</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{selectedRecipe.calories}</p>
                  <p className="text-xs text-gray-500">Calories</p>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h3>
                  <button
                    onClick={() => {
                      setEditingRecipeTags(selectedRecipe.id)
                      setShowAddTagModal(true)
                    }}
                    className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Manage Tags
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                  {selectedRecipe.tags.length === 0 && (
                    <span className="text-sm text-gray-400">No tags yet</span>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <StickyNote className="w-4 h-4" />
                    My Notes
                  </h3>
                  <button
                    onClick={() => {
                      setEditingNotes(true)
                      setEditedNotes(selectedRecipe.notes)
                    }}
                    className="text-sm text-brand-600 hover:text-brand-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                {editingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Add your notes about this recipe..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingNotes(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateRecipeNotes(selectedRecipe.id, editedNotes)}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <p className="text-sm text-amber-800">
                      {selectedRecipe.notes || 'No notes yet. Click edit to add notes.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-2 h-2 bg-brand-500 rounded-full" />
                      <span className="text-gray-900">{ing.name}</span>
                      <span className="text-gray-500 ml-auto">{ing.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Move to Collection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Move to Collection</h3>
                <div className="flex flex-wrap gap-2">
                  {collectionsWithCounts.filter(c => c.id !== 'all' && c.id !== 'favorites').map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => moveToCollection(selectedRecipe.id, collection.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        selectedRecipe.collectionId === collection.id
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span>{collection.emoji}</span>
                      <span className="text-sm font-medium">{collection.name}</span>
                      {selectedRecipe.collectionId === collection.id && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  href="/dashboard"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
                >
                  <ChefHat className="w-5 h-5" />
                  Cook This
                </Link>
                <button
                  onClick={() => deleteRecipe(selectedRecipe.id)}
                  className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
