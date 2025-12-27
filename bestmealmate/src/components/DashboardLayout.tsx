'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChefHat,
  Calendar,
  ShoppingCart,
  Refrigerator,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore, useUIStore } from '@/lib/store'
import { cn, getGreeting } from '@/lib/utils'
import AIChefModal from './AIChefModal'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { icon: Calendar, label: 'Meal Plan', href: '/dashboard' },
  { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries' },
  { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry' },
  { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes' },
  { icon: Users, label: 'Family', href: '/dashboard/family' },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, household, setUser, setHousehold, setIsLoading: setAuthLoading } = useAuthStore()
  const { sidebarOpen, setSidebarOpen, aiChefOpen, setAIChefOpen } = useUIStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      setAuthLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' })

          // Fetch household
          const { data: member } = await supabase
            .from('family_members')
            .select('household_id')
            .eq('user_id', session.user.id)
            .single()

          if (member?.household_id) {
            const { data: householdData } = await supabase
              .from('households')
              .select('*')
              .eq('id', member.household_id)
              .single()

            if (householdData) {
              setHousehold(householdData)
            }
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setHousehold(null)
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, setUser, setHousehold, setAuthLoading])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 transition-transform duration-300 z-40",
        "hidden lg:block",
        !sidebarOpen && "lg:-translate-x-64"
      )}>
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold text-gray-900">BestMealMate</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="border-t border-gray-200 pt-4 space-y-1">
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive('/dashboard/settings')
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 z-50 transition-transform duration-300 lg:hidden",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-brand-600" />
            <span className="text-xl font-bold text-gray-900">BestMealMate</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="border-t border-gray-200 pt-4 space-y-1">
            <Link
              href="/dashboard/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 pb-20 lg:pb-0",
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{getGreeting()}!</h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {household?.name || 'Your household'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button
                onClick={() => setAIChefOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                <span className="hidden sm:inline">AI Chef</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-30">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1",
                isActive(item.href) ? "text-brand-600" : "text-gray-400"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* AI Chef Modal */}
      <AIChefModal open={aiChefOpen} onClose={() => setAIChefOpen(false)} />
    </div>
  )
}
