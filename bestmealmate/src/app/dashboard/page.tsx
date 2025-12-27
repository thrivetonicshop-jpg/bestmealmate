'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  ShoppingCart,
  ChevronRight,
  Clock,
  Check,
  AlertTriangle,
  Plus,
  Sparkles,
  ChefHat
} from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuthStore, useFamilyStore, usePantryStore, useGroceryStore, useMealPlanStore, useUIStore } from '@/lib/store'
import { cn, getExpiryStatus, formatCookingTime, avatarEmojis, formatDayOfWeek, getWeekDates } from '@/lib/utils'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { household } = useAuthStore()
  const { members, setMembers } = useFamilyStore()
  const { items: pantryItems, setItems: setPantryItems } = usePantryStore()
  const { items: groceryItems, setItems: setGroceryItems, currentList, setCurrentList, togglePurchased } = useGroceryStore()
  const { plannedMeals, setPlannedMeals, setCurrentPlan } = useMealPlanStore()
  const { setAIChefOpen } = useUIStore()

  const [isLoading, setIsLoading] = useState(true)

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!household?.id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const weekStart = format(getWeekDates()[0], 'yyyy-MM-dd')

        const [familyRes, pantryRes, groceryRes, mealPlanRes] = await Promise.all([
          fetch(`/api/family?householdId=${household.id}`),
          fetch(`/api/pantry?householdId=${household.id}`),
          fetch(`/api/groceries?householdId=${household.id}`),
          fetch(`/api/meal-plans?householdId=${household.id}&weekStart=${weekStart}`)
        ])

        const [familyData, pantryData, groceryData, mealPlanData] = await Promise.all([
          familyRes.json(),
          pantryRes.json(),
          groceryRes.json(),
          mealPlanRes.json()
        ])

        setMembers(familyData.members || [])
        setPantryItems(pantryData.items || [])
        setGroceryItems(groceryData.items || [])
        setCurrentList(groceryData.currentList || null)
        setCurrentPlan(mealPlanData.mealPlan || null)
        setPlannedMeals(mealPlanData.plannedMeals || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [household?.id, setMembers, setPantryItems, setGroceryItems, setCurrentList, setCurrentPlan, setPlannedMeals])

  // Get expiring items (within 3 days)
  const expiringItems = pantryItems
    .filter((item) => {
      if (!item.expiry_date) return false
      const status = getExpiryStatus(item.expiry_date)
      return status.urgency === 'urgent' || status.urgency === 'soon'
    })
    .slice(0, 5)

  // Get today's and upcoming meals
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todayMeals = plannedMeals.filter((m) => m.meal_date === todayStr)
  const dinnerTonight = todayMeals.find((m) => m.meal_type === 'dinner')

  // Get next 3 days of dinner plans
  const upcomingMeals = plannedMeals
    .filter((m) => m.meal_type === 'dinner' && m.meal_date >= todayStr)
    .slice(0, 3)

  // Get unchecked grocery items
  const uncheckedGroceryItems = groceryItems.filter((i) => !i.is_purchased).slice(0, 5)

  const handleToggleGroceryItem = async (id: string, isPurchased: boolean) => {
    try {
      await fetch('/api/groceries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleItem', id, isPurchased: !isPurchased }),
      })
      togglePurchased(id)
    } catch (error) {
      toast.error('Failed to update item')
    }
  }

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column - Meal Plan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tonight's Dinner - Hero Card */}
            {dinnerTonight ? (
              <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-brand-100 text-sm font-medium mb-1">Tonight's Dinner</p>
                    <h2 className="text-2xl font-bold">
                      {dinnerTonight.recipe?.name || 'Meal planned'}
                    </h2>
                  </div>
                  {dinnerTonight.recipe?.total_time_minutes && (
                    <div className="bg-white/20 rounded-lg px-3 py-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {formatCookingTime(dinnerTonight.recipe.total_time_minutes)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-brand-200" />
                  <span className="text-brand-100">
                    {dinnerTonight.status === 'cooked' ? 'Already cooked!' : 'Ready to cook'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/dashboard/recipes"
                    className="flex-1 bg-white text-brand-700 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-colors text-center"
                  >
                    View Recipe
                  </Link>
                  <button className="px-4 py-3 bg-white/20 rounded-xl font-medium hover:bg-white/30 transition-colors">
                    Swap Meal
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6">
                <div className="text-center py-4">
                  <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">No dinner planned for tonight</h2>
                  <p className="text-gray-500 mb-4">Let AI Chef suggest something based on your pantry!</p>
                  <button
                    onClick={() => setAIChefOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
                  >
                    <Sparkles className="w-5 h-5" />
                    Get Suggestions
                  </button>
                </div>
              </div>
            )}

            {/* This Week */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">This Week</h3>
                <Link href="/dashboard/calendar" className="text-brand-600 text-sm font-medium hover:text-brand-700 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {upcomingMeals.length > 0 ? (
                <div className="space-y-3">
                  {upcomingMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl transition-colors",
                        meal.meal_date === todayStr ? "bg-brand-50" : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          meal.meal_date === todayStr ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"
                        )}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {meal.recipe?.name || 'Unnamed meal'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDayOfWeek(meal.meal_date)}
                            {meal.recipe?.total_time_minutes && ` · ${formatCookingTime(meal.recipe.total_time_minutes)}`}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No meals planned yet</p>
                  <Link
                    href="/dashboard/calendar"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
                  >
                    <Plus className="w-4 h-4" />
                    Plan Meals
                  </Link>
                </div>
              )}
            </div>

            {/* Family */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Family</h3>
                <Link href="/dashboard/family" className="text-brand-600 text-sm font-medium hover:text-brand-700 flex items-center gap-1">
                  Manage <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {members.length > 0 ? (
                  <>
                    {members.map((member, i) => (
                      <div key={member.id} className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-1">
                          {avatarEmojis[i % avatarEmojis.length]}
                        </div>
                        <p className="text-sm font-medium text-gray-700">{member.name}</p>
                        {member.dietary_restrictions && member.dietary_restrictions.length > 0 && (
                          <p className="text-xs text-gray-500">{member.dietary_restrictions[0].restriction_type}</p>
                        )}
                      </div>
                    ))}
                  </>
                ) : null}
                <Link
                  href="/dashboard/family"
                  className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Expiring Soon */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Expiring Soon</h3>
              </div>
              {expiringItems.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {expiringItems.map((item) => {
                      const expiry = getExpiryStatus(item.expiry_date)
                      return (
                        <div key={item.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{item.ingredient?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500 capitalize">{item.location}</p>
                          </div>
                          <span className={cn("text-sm font-medium", expiry.color)}>
                            {expiry.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setAIChefOpen(true)}
                    className="w-full mt-4 py-2 text-brand-600 font-medium text-sm hover:text-brand-700 transition-colors"
                  >
                    Use these first →
                  </button>
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">No items expiring soon</p>
              )}
            </div>

            {/* Grocery List Preview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Grocery List</h3>
                <span className="text-sm text-gray-500">
                  {uncheckedGroceryItems.length} items
                </span>
              </div>
              {uncheckedGroceryItems.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {uncheckedGroceryItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleGroceryItem(item.id, item.is_purchased)}
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                            item.is_purchased
                              ? "bg-brand-600 border-brand-600 text-white"
                              : "border-gray-300 hover:border-brand-400"
                          )}
                        >
                          {item.is_purchased && <Check className="w-3 h-3" />}
                        </button>
                        <span className={cn(
                          "flex-1",
                          item.is_purchased ? "text-gray-400 line-through" : "text-gray-700"
                        )}>
                          {item.ingredient?.name || 'Unknown'}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-sm text-gray-500">{item.quantity}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard/groceries" className="block w-full mt-4 py-2 text-center text-brand-600 font-medium text-sm hover:text-brand-700 transition-colors">
                    View Full List →
                  </Link>
                </>
              ) : currentList ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">Your list is complete!</p>
                  <Link
                    href="/dashboard/groceries"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-lg font-medium hover:bg-brand-200"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add Items
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">No grocery list yet</p>
                  <Link
                    href="/dashboard/groceries"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
                  >
                    <Plus className="w-4 h-4" />
                    Create List
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/dashboard/pantry"
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-brand-600" />
                  </div>
                  <span className="font-medium text-gray-700">Add to Pantry</span>
                </Link>
                <Link
                  href="/dashboard/recipes"
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Browse Recipes</span>
                </Link>
                <button
                  onClick={() => setAIChefOpen(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="font-medium text-gray-700">Ask AI Chef</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
