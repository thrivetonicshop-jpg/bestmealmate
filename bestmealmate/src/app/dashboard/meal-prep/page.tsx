'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChefHat } from 'lucide-react'
import BatchMealPrep, { type BatchMeal } from '@/components/BatchMealPrep'

// Sample batch meals data
const SAMPLE_BATCH_MEALS: BatchMeal[] = [
  {
    id: 'batch-1',
    name: 'Asian Chicken Stir Fry',
    emoji: '🥡',
    description: 'A versatile chicken stir fry that reheats perfectly. Great for quick weeknight dinners.',
    servings: 4,
    portionsPerBatch: 8,
    totalTime: '45 min',
    prepTime: '20 min',
    cookTime: '25 min',
    shelfLife: { fridge: 4, freezer: 3 },
    calories: 320,
    protein: 35,
    carbs: 18,
    fat: 12,
    ingredients: [
      { name: 'Chicken breast', amount: '2 lbs' },
      { name: 'Broccoli florets', amount: '4 cups' },
      { name: 'Bell peppers', amount: '3 large' },
      { name: 'Soy sauce', amount: '1/2 cup' },
      { name: 'Sesame oil', amount: '2 tbsp' },
      { name: 'Garlic', amount: '6 cloves', prepNote: 'minced' },
      { name: 'Ginger', amount: '2 inch piece', prepNote: 'minced' },
      { name: 'Cornstarch', amount: '2 tbsp' },
      { name: 'Vegetable oil', amount: '3 tbsp' },
      { name: 'Salt and pepper', amount: 'to taste' }
    ],
    prepSteps: [
      { step: 'Cut chicken into 1-inch cubes', time: '5 min', tip: 'Partially frozen chicken is easier to cut' },
      { step: 'Chop broccoli into bite-size florets', time: '3 min' },
      { step: 'Slice bell peppers into strips', time: '3 min' },
      { step: 'Mince garlic and ginger', time: '3 min' },
      { step: 'Mix sauce: soy sauce, sesame oil, cornstarch, and 1/4 cup water', time: '2 min' }
    ],
    cookSteps: [
      { step: 'Heat oil in large wok or skillet over high heat', time: '2 min' },
      { step: 'Cook chicken in batches until golden (don\'t overcrowd)', time: '8 min', tip: 'Work in 2-3 batches for best browning' },
      { step: 'Remove chicken, add vegetables and stir fry 4-5 minutes', time: '5 min' },
      { step: 'Add garlic and ginger, cook 30 seconds until fragrant', time: '1 min' },
      { step: 'Return chicken, pour sauce over and toss until thickened', time: '3 min' }
    ],
    storageInstructions: [
      'Let cool completely before storing (about 30 minutes)',
      'Divide into meal-sized portions in airtight containers',
      'Refrigerate portions you\'ll eat within 4 days',
      'Freeze remaining portions for up to 3 months'
    ],
    reheatingInstructions: [
      'Microwave: Heat 2-3 minutes, stirring halfway',
      'Stovetop: Add splash of water, heat over medium 5-7 minutes',
      'From frozen: Thaw overnight in fridge, then reheat as above'
    ],
    variations: [
      'Swap chicken for tofu or shrimp',
      'Add cashews for extra crunch',
      'Use different vegetables based on season'
    ],
    tags: ['asian', 'chicken', 'quick-reheat', 'freezer-friendly']
  },
  {
    id: 'batch-2',
    name: 'Turkey Taco Meat',
    emoji: '🌮',
    description: 'Seasoned ground turkey that works for tacos, burritos, salads, and more.',
    servings: 5,
    portionsPerBatch: 10,
    totalTime: '30 min',
    prepTime: '5 min',
    cookTime: '25 min',
    shelfLife: { fridge: 5, freezer: 3 },
    calories: 180,
    protein: 25,
    carbs: 5,
    fat: 7,
    ingredients: [
      { name: 'Ground turkey', amount: '3 lbs' },
      { name: 'Onion', amount: '1 large', prepNote: 'diced' },
      { name: 'Taco seasoning', amount: '3 packets' },
      { name: 'Tomato paste', amount: '3 tbsp' },
      { name: 'Water', amount: '1 cup' }
    ],
    prepSteps: [
      { step: 'Dice onion', time: '3 min' }
    ],
    cookSteps: [
      { step: 'Brown turkey in large pan, breaking into crumbles', time: '10 min' },
      { step: 'Add onion and cook until softened', time: '5 min' },
      { step: 'Stir in taco seasoning, tomato paste, and water', time: '2 min' },
      { step: 'Simmer until liquid is absorbed', time: '8 min' }
    ],
    storageInstructions: [
      'Cool completely before storing',
      'Portion into freezer bags or containers',
      'Lay bags flat in freezer for easy stacking'
    ],
    reheatingInstructions: [
      'Microwave: 2-3 minutes with a splash of water',
      'Stovetop: Medium heat, 5 minutes with water as needed'
    ],
    variations: [
      'Use ground beef or chicken instead',
      'Add black beans for extra fiber',
      'Mix in corn for sweetness'
    ],
    tags: ['mexican', 'turkey', 'versatile', 'kid-friendly']
  },
  {
    id: 'batch-3',
    name: 'Mediterranean Quinoa Bowls',
    emoji: '🥗',
    description: 'Healthy grain bowls with roasted vegetables and feta. Perfect for lunches.',
    servings: 3,
    portionsPerBatch: 6,
    totalTime: '50 min',
    prepTime: '15 min',
    cookTime: '35 min',
    shelfLife: { fridge: 5, freezer: 0 },
    calories: 380,
    protein: 14,
    carbs: 45,
    fat: 16,
    ingredients: [
      { name: 'Quinoa', amount: '2 cups dry' },
      { name: 'Chickpeas', amount: '2 cans', prepNote: 'drained' },
      { name: 'Cherry tomatoes', amount: '2 pints' },
      { name: 'Cucumber', amount: '2 large' },
      { name: 'Red onion', amount: '1 medium' },
      { name: 'Feta cheese', amount: '8 oz' },
      { name: 'Kalamata olives', amount: '1 cup' },
      { name: 'Olive oil', amount: '1/4 cup' },
      { name: 'Lemon juice', amount: '3 tbsp' },
      { name: 'Dried oregano', amount: '1 tbsp' }
    ],
    prepSteps: [
      { step: 'Rinse quinoa thoroughly', time: '2 min' },
      { step: 'Dice cucumber and red onion', time: '5 min' },
      { step: 'Halve cherry tomatoes', time: '3 min' },
      { step: 'Make dressing: olive oil, lemon, oregano, salt', time: '3 min' }
    ],
    cookSteps: [
      { step: 'Cook quinoa according to package (usually 15-20 min)', time: '20 min' },
      { step: 'Roast chickpeas at 400°F until crispy', time: '25 min' },
      { step: 'Let quinoa cool to room temperature', time: '10 min' }
    ],
    storageInstructions: [
      'Store quinoa and vegetables separately from dressing',
      'Keep feta and olives in separate containers',
      'Assemble bowls fresh each day for best texture'
    ],
    reheatingInstructions: [
      'Best served cold or room temperature',
      'Can warm quinoa in microwave if preferred'
    ],
    variations: [
      'Add grilled chicken for extra protein',
      'Swap feta for goat cheese',
      'Use different vegetables based on season'
    ],
    tags: ['mediterranean', 'vegetarian', 'healthy', 'no-reheat']
  }
]

export default function MealPrepPage() {
  const [selectedMeal, setSelectedMeal] = useState<BatchMeal | null>(null)
  const [completedPreps, setCompletedPreps] = useState<string[]>([])

  const handleComplete = (portionsFridge: number, portionsFreezer: number) => {
    if (selectedMeal) {
      console.log(`Completed ${selectedMeal.name}: ${portionsFridge} fridge, ${portionsFreezer} freezer`)
      setCompletedPreps(prev => [...prev, selectedMeal.id])
      setSelectedMeal(null)
    }
  }

  const handleAddToWeeklyPlan = (portions: number, dates: Date[]) => {
    console.log('Adding to weekly plan:', portions, 'portions for', dates.length, 'days')
  }

  if (selectedMeal) {
    return (
      <BatchMealPrep
        meal={selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onComplete={handleComplete}
        onAddToWeeklyPlan={handleAddToWeeklyPlan}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 lg:px-8 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Batch Meal Prep</h1>
            <p className="text-gray-500">Cook once, eat all week</p>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-6xl mx-auto">
        {/* Intro */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">Ready to Prep?</h2>
              <p className="text-white/80">Select a recipe to start batch cooking</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm text-center">
              <p className="text-3xl font-bold">{SAMPLE_BATCH_MEALS.length}</p>
              <p className="text-sm text-white/70">Recipes</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm text-center">
              <p className="text-3xl font-bold">
                {SAMPLE_BATCH_MEALS.reduce((sum, m) => sum + m.portionsPerBatch, 0)}
              </p>
              <p className="text-sm text-white/70">Total Servings</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm text-center">
              <p className="text-3xl font-bold">{completedPreps.length}</p>
              <p className="text-sm text-white/70">Completed</p>
            </div>
          </div>
        </div>

        {/* Recipe Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_BATCH_MEALS.map((meal) => {
            const isCompleted = completedPreps.includes(meal.id)
            const freezerFriendly = meal.shelfLife.freezer > 0

            return (
              <button
                key={meal.id}
                onClick={() => !isCompleted && setSelectedMeal(meal)}
                className={`text-left bg-white rounded-2xl border overflow-hidden transition-all ${
                  isCompleted
                    ? 'border-green-200 bg-green-50 opacity-75'
                    : 'border-gray-200 hover:shadow-lg hover:border-orange-300'
                }`}
                disabled={isCompleted}
              >
                {/* Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{meal.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{meal.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{meal.portionsPerBatch} servings</span>
                        <span>•</span>
                        <span>{meal.totalTime}</span>
                      </div>
                    </div>
                    {isCompleted && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓ Done
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{meal.description}</p>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-wrap gap-1">
                      {meal.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    {freezerFriendly && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        ❄️ Freezer friendly
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="font-semibold text-gray-900">{meal.calories}</p>
                      <p className="text-xs text-gray-500">cal</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="font-semibold text-gray-900">{meal.protein}g</p>
                      <p className="text-xs text-gray-500">protein</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="font-semibold text-gray-900">{meal.carbs}g</p>
                      <p className="text-xs text-gray-500">carbs</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="font-semibold text-gray-900">{meal.fat}g</p>
                      <p className="text-xs text-gray-500">fat</p>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    <span>🥶 Keeps {meal.shelfLife.fridge} days in fridge</span>
                    {freezerFriendly && (
                      <span className="ml-2">• ❄️ {meal.shelfLife.freezer} months frozen</span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <h3 className="font-bold text-amber-900 mb-3">💡 Batch Prep Tips</h3>
          <ul className="text-sm text-amber-800 space-y-2">
            <li>• Set aside 2-3 hours on Sunday for the week&apos;s prep</li>
            <li>• Label everything with the date and contents</li>
            <li>• Cool food completely before refrigerating or freezing</li>
            <li>• Invest in quality airtight containers</li>
            <li>• Prep components separately for variety during the week</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
