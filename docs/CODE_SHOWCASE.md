# Code Showcase - BestMealMate

Complete code examples from the BestMealMate codebase, organized by feature.

## Table of Contents

1. [Frontend Components](#frontend-components)
2. [API Routes](#api-routes)
3. [Database Layer](#database-layer)
4. [Authentication](#authentication)
5. [State Management](#state-management)
6. [Utilities & Helpers](#utilities--helpers)

---

## Frontend Components

### 1. Landing Page (`src/app/page.tsx`)

A fully responsive landing page with hero section, feature showcase, and pricing.

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ChefHat, Users, ShoppingCart, Calendar,
  Sparkles, Check, ArrowRight, Refrigerator,
  Clock, Leaf
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-brand-600" />
              <span className="text-xl font-bold text-gray-900">BestMealMate</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link
                href="/onboarding"
                className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Meal planning for
            <span className="text-brand-600"> real families</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Different tastes. Allergies. Picky eaters. Expiring food.
            The endless "what's for dinner?" question.
            <span className="font-semibold text-gray-900"> We solve all of it.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              Start Planning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["1 family member", "Basic meal plans", "5 recipes per week"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-brand-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Tier */}
            <div className="bg-white p-8 rounded-2xl border-2 border-brand-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Up to 4 family members", "AI chef suggestions", "Smart grocery list"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-brand-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
```

### 2. Dashboard Page (`src/app/dashboard/page.tsx`)

Main dashboard with sidebar navigation, meal plan display, and AI Chef modal.

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChefHat, Calendar, ShoppingCart, Refrigerator,
  Users, Sparkles, Plus, ChevronRight, Clock,
  Check, AlertTriangle, Settings, LogOut
} from 'lucide-react'

export default function DashboardPage() {
  const [showAIChef, setShowAIChef] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold text-gray-900">BestMealMate</span>
        </div>

        <nav className="space-y-1">
          {[
            { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: true },
            { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries' },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry' },
            { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes' },
            { icon: Users, label: 'Family', href: '/dashboard/family' },
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
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good evening!</h1>
            <p className="text-gray-600">Here's what's cooking this week</p>
          </div>
          <button
            onClick={() => setShowAIChef(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Ask AI Chef
          </button>
        </header>

        {/* Tonight's Dinner Card */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-brand-100 text-sm font-medium mb-1">Tonight's Dinner</p>
              <h2 className="text-2xl font-bold">Sheet Pan Chicken & Veggies</h2>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">35 min</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-white text-brand-700 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-colors">
              Start Cooking
            </button>
            <button className="px-4 py-3 bg-white/20 rounded-xl font-medium hover:bg-white/30 transition-colors">
              Swap Meal
            </button>
          </div>
        </div>
      </main>

      {/* AI Chef Modal */}
      {showAIChef && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Chef</h3>
                  <p className="text-sm text-gray-500">Ask me anything about meals</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIChef(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-2xl text-gray-400">&times;</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-gray-600">
                Based on your pantry and family preferences, I suggest
                <strong> Honey Garlic Chicken</strong> for tonight.
              </p>
            </div>

            <input
              type="text"
              placeholder="Ask me anything..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}
```

### 3. Pantry Page with CRUD Operations (`src/app/dashboard/pantry/page.tsx`)

Full-featured pantry management with search, filters, and expiry tracking.

```tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { PantryItem, Ingredient } from '@/lib/database.types'
import toast from 'react-hot-toast'

type LocationType = 'fridge' | 'freezer' | 'pantry' | 'spice_rack' | 'other'

interface PantryItemWithIngredient extends PantryItem {
  ingredients?: Ingredient
}

export default function PantryPage() {
  const [items, setItems] = useState<PantryItemWithIngredient[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState<LocationType | 'all'>('all')

  useEffect(() => {
    fetchPantryItems()
  }, [])

  async function fetchPantryItems() {
    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .select(`*, ingredients (*)`)
        .order('expiry_date', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching pantry items:', error)
    } finally {
      setLoading(false)
    }
  }

  function getExpiryStatus(expiryDate: string | null): 'expired' | 'expiring' | 'fresh' {
    if (!expiryDate) return 'fresh'
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 3) return 'expiring'
    return 'fresh'
  }

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const name = item.ingredients?.name || ''
      if (searchTerm && !name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterLocation !== 'all' && item.location !== filterLocation) {
        return false
      }
      return true
    })
  }, [items, searchTerm, filterLocation])

  const stats = useMemo(() => ({
    total: items.length,
    expired: items.filter(i => getExpiryStatus(i.expiry_date) === 'expired').length,
    expiring: items.filter(i => getExpiryStatus(i.expiry_date) === 'expiring').length,
    fresh: items.filter(i => getExpiryStatus(i.expiry_date) === 'fresh').length,
  }), [items])

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
      toast.error('Failed to delete item')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <p className="text-sm text-gray-500">Fresh</p>
          <p className="text-2xl font-bold text-green-600">{stats.fresh}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <p className="text-sm text-gray-500">Expiring Soon</p>
          <p className="text-2xl font-bold text-amber-600">{stats.expiring}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <p className="text-sm text-gray-500">Expired</p>
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const status = getExpiryStatus(item.expiry_date)
          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-4 border-2 ${
                status === 'expired' ? 'border-red-200 bg-red-50' :
                status === 'expiring' ? 'border-amber-200 bg-amber-50' :
                'border-gray-200'
              }`}
            >
              <h3 className="font-semibold">{item.ingredients?.name}</h3>
              <p className="text-sm text-gray-600">{item.quantity} {item.unit}</p>
              <p className="text-sm text-gray-500">{item.location}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

---

## API Routes

### 1. AI Chef Endpoint (`src/app/api/ai-chef/route.ts`)

Claude-powered meal suggestions based on pantry and family preferences.

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    const systemPrompt = `You are the AI Chef for BestMealMate, a family meal planning app.

Your job is to help families decide what to cook based on:
1. What ingredients they have (especially expiring items)
2. Each family member's dietary restrictions and allergies
3. How much time they have to cook
4. What they've eaten recently (to ensure variety)

Current context:
${JSON.stringify(context, null, 2)}

Guidelines:
- Always prioritize safety (allergies are serious!)
- Suggest meals that work for EVERYONE in the family
- Prefer using ingredients that are expiring soon
- Be friendly, helpful, and concise
- When suggesting a meal, explain why it's a good fit`

    const anthropic = getAnthropic()
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    const reply = textContent ? textContent.text : 'I could not generate a response.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI Chef error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
```

### 2. Stripe Checkout (`src/app/api/stripe/checkout/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  })
}

export async function POST(request: NextRequest) {
  try {
    const { householdId, tier, email } = await request.json()

    const priceId = tier === 'family'
      ? process.env.STRIPE_FAMILY_PRICE_ID
      : process.env.STRIPE_PREMIUM_PRICE_ID

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        household_id: householdId,
        tier: tier,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
      subscription_data: {
        trial_period_days: 14,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

### 3. Stripe Webhook (`src/app/api/stripe/webhook/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const householdId = session.metadata?.household_id
        const tier = session.metadata?.tier as 'premium' | 'family'

        if (householdId && tier) {
          await supabaseAdmin
            .from('households')
            .update({
              subscription_tier: tier,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
            })
            .eq('id', householdId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await supabaseAdmin
          .from('households')
          .update({
            subscription_tier: 'free',
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', subscription.customer as string)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
```

---

## Database Layer

### Supabase Client Configuration (`src/lib/supabase.ts`)

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Client-side Supabase instance (respects RLS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side admin client (bypasses RLS)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Runtime safety helpers
export function getSupabase(): SupabaseClient<Database> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables')
  }
  return supabase
}

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase admin environment variables')
  }
  return supabaseAdmin
}
```

### TypeScript Types (`src/lib/database.types.ts`)

```typescript
export type Database = {
  public: {
    Tables: {
      households: {
        Row: {
          id: string
          name: string
          subscription_tier: 'free' | 'premium' | 'family'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          timezone: string
          preferred_grocery_store: string | null
          created_at: string
          updated_at: string
        }
        Insert: { /* ... */ }
        Update: { /* ... */ }
      }
      family_members: {
        Row: {
          id: string
          household_id: string
          user_id: string | null
          name: string
          age: number | null
          role: 'admin' | 'member' | 'child'
          is_picky_eater: boolean
          created_at: string
          updated_at: string
        }
      }
      pantry_items: {
        Row: {
          id: string
          household_id: string
          ingredient_id: string
          quantity: number
          unit: string | null
          location: 'fridge' | 'freezer' | 'pantry' | 'spice_rack' | 'other'
          expiry_date: string | null
          is_staple: boolean
          notes: string | null
        }
      }
      // ... more tables
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

// Convenience aliases
export type Household = Tables<'households'>
export type FamilyMember = Tables<'family_members'>
export type PantryItem = Tables<'pantry_items'>
export type Recipe = Tables<'recipes'>
```

---

## Authentication

### OAuth Callback (`src/app/auth/callback/route.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

### Login Page (`src/app/login/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        toast.success('Check your email to confirm your account!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast.success('Welcome back!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) toast.error(error.message)
  }

  // ... render form
}
```

---

## Code Statistics

| Category | Files | Lines of Code |
|----------|-------|---------------|
| Frontend Pages | 10 | ~3,500 |
| API Routes | 4 | ~250 |
| Library/Utils | 2 | ~650 |
| Database Schema | 1 | ~470 |
| Config Files | 5 | ~200 |
| **Total** | **22** | **~5,070** |

---

## Key Patterns Used

1. **Server Components** - Default in Next.js 14 App Router
2. **Client Components** - `'use client'` for interactive features
3. **Route Handlers** - `route.ts` files for API endpoints
4. **RLS Policies** - Row Level Security in Supabase
5. **Optimistic UI** - Zustand for state, toast for feedback
6. **Responsive Design** - Tailwind CSS mobile-first approach
7. **Type Safety** - Full TypeScript with generated database types
