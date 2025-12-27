import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow, addDays, startOfWeek, differenceInDays } from 'date-fns'

// Tailwind class merge utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d, yyyy')
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'EEEE, MMM d')
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d')
}

export function formatDayOfWeek(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'EEEE')
}

export function getExpiryStatus(expiryDate: string | null): { label: string; color: string; urgency: 'expired' | 'urgent' | 'soon' | 'ok' } {
  if (!expiryDate) return { label: 'No expiry', color: 'text-gray-500', urgency: 'ok' }

  const days = differenceInDays(new Date(expiryDate), new Date())

  if (days < 0) return { label: 'Expired', color: 'text-red-600', urgency: 'expired' }
  if (days === 0) return { label: 'Today', color: 'text-red-600', urgency: 'urgent' }
  if (days === 1) return { label: 'Tomorrow', color: 'text-orange-600', urgency: 'urgent' }
  if (days <= 3) return { label: `${days} days`, color: 'text-orange-500', urgency: 'soon' }
  if (days <= 7) return { label: `${days} days`, color: 'text-yellow-600', urgency: 'soon' }
  return { label: formatShortDate(expiryDate), color: 'text-gray-500', urgency: 'ok' }
}

export function getWeekDates(date: Date = new Date()): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 }) // Sunday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

// Greeting based on time of day
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// Storage location labels
export const locationLabels: Record<string, string> = {
  fridge: 'Fridge',
  freezer: 'Freezer',
  pantry: 'Pantry',
  spice_rack: 'Spice Rack',
  other: 'Other',
}

// Meal type labels
export const mealTypeLabels: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
  dessert: 'Dessert',
}

// Difficulty labels
export const difficultyLabels: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'text-green-600 bg-green-100' },
  medium: { label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
  hard: { label: 'Hard', color: 'text-red-600 bg-red-100' },
}

// Category labels and icons
export const categoryLabels: Record<string, string> = {
  produce: 'Produce',
  meat: 'Meat & Seafood',
  dairy: 'Dairy & Eggs',
  pantry: 'Pantry',
  frozen: 'Frozen',
  spices: 'Spices',
  condiments: 'Condiments',
  grains: 'Grains & Bread',
  beverages: 'Beverages',
}

// Avatar emojis for family members
export const avatarEmojis = ['👨', '👩', '👦', '👧', '👴', '👵', '🧑', '👶']

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Format time (e.g., "35 min" or "1h 30m")
export function formatCookingTime(minutes: number | null): string {
  if (!minutes) return 'N/A'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

// Pluralize helper
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`)
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
