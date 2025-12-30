'use client'

import { useState, useMemo } from 'react'
import {
  Recycle,
  ChefHat,
  Clock,
  Flame,
  Sparkles,
  Check,
  ArrowRight,
  Plus,
  Minus,
  Users,
  Utensils,
  Lightbulb,
  Star,
  Timer,
  ThumbsUp
} from 'lucide-react'

export interface LeftoverItem {
  id: string
  name: string
  emoji: string
  quantity: string
  originalMeal?: string
  daysOld: number
  safeToUse: boolean
}

export interface TransformRecipe {
  id: string
  name: string
  emoji: string
  description: string
  usesLeftovers: string[] // IDs of leftovers used
  additionalIngredients: Array<{
    name: string
    amount: string
    optional?: boolean
  }>
  prepTime: string
  cookTime: string
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  rating: number
  steps: string[]
  tips?: string[]
  tags: string[]
}

interface LeftoverRecipesProps {
  leftovers: LeftoverItem[]
  onSelectRecipe: (recipe: TransformRecipe, selectedLeftovers: LeftoverItem[]) => void
  onGenerateRecipes: (leftovers: LeftoverItem[]) => void
  onMarkUsed: (leftoverId: string) => void
}

// Sample transform recipes
const SAMPLE_TRANSFORM_RECIPES: TransformRecipe[] = [
  {
    id: 'fried-rice',
    name: 'Leftover Fried Rice',
    emoji: '🍳',
    description: 'Turn yesterday\'s rice and proteins into a delicious fried rice',
    usesLeftovers: [],
    additionalIngredients: [
      { name: 'Eggs', amount: '2' },
      { name: 'Soy sauce', amount: '2 tbsp' },
      { name: 'Sesame oil', amount: '1 tsp' },
      { name: 'Green onions', amount: '2 stalks', optional: true },
      { name: 'Frozen peas', amount: '1/2 cup', optional: true }
    ],
    prepTime: '5 min',
    cookTime: '10 min',
    servings: 2,
    difficulty: 'easy',
    rating: 4.8,
    steps: [
      'Heat oil in a large pan or wok over high heat',
      'Scramble eggs and set aside',
      'Add leftover rice and protein, break up any clumps',
      'Stir-fry for 3-4 minutes until rice is slightly crispy',
      'Add soy sauce and sesame oil, toss to combine',
      'Add back eggs and any vegetables',
      'Garnish with green onions and serve hot'
    ],
    tips: [
      'Day-old rice works best as it\'s drier',
      'High heat is key for that restaurant-style char',
      'Don\'t overcrowd the pan'
    ],
    tags: ['quick', 'one-pan', 'family-favorite']
  },
  {
    id: 'burrito-bowl',
    name: 'Leftover Burrito Bowl',
    emoji: '🌯',
    description: 'Transform leftover proteins and grains into a fresh burrito bowl',
    usesLeftovers: [],
    additionalIngredients: [
      { name: 'Salsa', amount: '1/4 cup' },
      { name: 'Sour cream', amount: '2 tbsp', optional: true },
      { name: 'Cheese', amount: '1/4 cup', optional: true },
      { name: 'Lettuce', amount: '1 cup' },
      { name: 'Avocado', amount: '1/2', optional: true }
    ],
    prepTime: '5 min',
    cookTime: '5 min',
    servings: 1,
    difficulty: 'easy',
    rating: 4.6,
    steps: [
      'Reheat leftover protein and grains',
      'Arrange lettuce in a bowl as base',
      'Add warmed protein and grains',
      'Top with salsa, cheese, sour cream',
      'Add sliced avocado',
      'Serve immediately'
    ],
    tips: [
      'Works great with leftover chicken, beef, or pork',
      'Add hot sauce for extra kick'
    ],
    tags: ['healthy', 'customizable', 'no-cook-option']
  },
  {
    id: 'pasta-frittata',
    name: 'Pasta Frittata',
    emoji: '🍝',
    description: 'Italian classic that turns leftover pasta into a crispy egg dish',
    usesLeftovers: [],
    additionalIngredients: [
      { name: 'Eggs', amount: '4' },
      { name: 'Parmesan cheese', amount: '1/4 cup' },
      { name: 'Italian herbs', amount: '1 tsp' },
      { name: 'Olive oil', amount: '2 tbsp' }
    ],
    prepTime: '5 min',
    cookTime: '15 min',
    servings: 4,
    difficulty: 'medium',
    rating: 4.5,
    steps: [
      'Preheat broiler',
      'Whisk eggs with cheese and herbs',
      'Mix in leftover pasta',
      'Heat oil in oven-safe skillet',
      'Pour mixture into pan, cook until bottom sets (5 min)',
      'Place under broiler until top is golden (3-4 min)',
      'Let rest 5 minutes before slicing'
    ],
    tips: [
      'Any pasta shape works',
      'Add leftover vegetables for extra nutrition',
      'Great for meal prep - stores well'
    ],
    tags: ['italian', 'brunch', 'meal-prep']
  },
  {
    id: 'chicken-quesadilla',
    name: 'Leftover Chicken Quesadilla',
    emoji: '🧀',
    description: 'Crispy quesadillas filled with shredded leftover chicken',
    usesLeftovers: [],
    additionalIngredients: [
      { name: 'Flour tortillas', amount: '2' },
      { name: 'Shredded cheese', amount: '1 cup' },
      { name: 'Salsa', amount: 'for serving' },
      { name: 'Sour cream', amount: 'for serving', optional: true }
    ],
    prepTime: '5 min',
    cookTime: '8 min',
    servings: 2,
    difficulty: 'easy',
    rating: 4.7,
    steps: [
      'Shred leftover chicken if not already shredded',
      'Heat a large pan over medium heat',
      'Place tortilla in pan, add cheese and chicken to half',
      'Fold tortilla in half and press down',
      'Cook 3-4 minutes per side until golden and crispy',
      'Cut into wedges and serve with salsa'
    ],
    tips: [
      'Add leftover veggies for extra filling',
      'Use a panini press for perfect crispness'
    ],
    tags: ['kid-friendly', 'quick', 'cheesy']
  },
  {
    id: 'vegetable-soup',
    name: 'Clean-Out-The-Fridge Soup',
    emoji: '🥣',
    description: 'Turn any leftover vegetables into a hearty soup',
    usesLeftovers: [],
    additionalIngredients: [
      { name: 'Chicken or vegetable broth', amount: '4 cups' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Onion', amount: '1/2' },
      { name: 'Italian seasoning', amount: '1 tsp' },
      { name: 'Pasta or rice', amount: '1 cup', optional: true }
    ],
    prepTime: '10 min',
    cookTime: '20 min',
    servings: 4,
    difficulty: 'easy',
    rating: 4.4,
    steps: [
      'Sauté onion and garlic in a large pot',
      'Add broth and bring to a boil',
      'Add any raw vegetables first, cook 10 min',
      'Add cooked leftovers and seasonings',
      'Simmer until heated through',
      'Add pasta/rice in last 10 minutes if using',
      'Season to taste and serve'
    ],
    tips: [
      'Almost any vegetable works',
      'Blend half for creamier soup',
      'Freeze leftovers for quick future meals'
    ],
    tags: ['zero-waste', 'healthy', 'freezer-friendly']
  },
  {
    id: 'stir-fry',
    name: 'Quick Leftover Stir Fry',
    emoji: '🥘',
    description: 'Fast stir fry using whatever leftovers you have',
    usesLeftovers: [],
    additionalIngredients: [
      { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Ginger', amount: '1 tsp' },
      { name: 'Cornstarch', amount: '1 tsp', optional: true },
      { name: 'Rice or noodles', amount: 'for serving' }
    ],
    prepTime: '5 min',
    cookTime: '10 min',
    servings: 2,
    difficulty: 'easy',
    rating: 4.6,
    steps: [
      'Heat oil in wok or large pan over high heat',
      'Add garlic and ginger, cook 30 seconds',
      'Add leftover proteins and vegetables',
      'Stir-fry 3-4 minutes',
      'Add soy sauce and toss to coat',
      'Thicken with cornstarch slurry if desired',
      'Serve over rice or noodles'
    ],
    tips: [
      'Cut everything into similar sizes',
      'Add a splash of honey for sweetness',
      'Toasted sesame seeds add nice crunch'
    ],
    tags: ['asian', 'quick', 'versatile']
  }
]

export default function LeftoverRecipes({
  leftovers,
  onSelectRecipe,
  onGenerateRecipes,
  onMarkUsed
}: LeftoverRecipesProps) {
  const [selectedLeftovers, setSelectedLeftovers] = useState<Set<string>>(new Set())
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null)
  const [servingMultiplier, setServingMultiplier] = useState(1)

  // Filter safe leftovers
  const safeLeftovers = useMemo(() =>
    leftovers.filter(l => l.safeToUse),
    [leftovers]
  )

  const unsafeLeftovers = useMemo(() =>
    leftovers.filter(l => !l.safeToUse),
    [leftovers]
  )

  // Get matching recipes based on selected leftovers
  const matchingRecipes = useMemo(() => {
    if (selectedLeftovers.size === 0) return SAMPLE_TRANSFORM_RECIPES

    const selected = Array.from(selectedLeftovers)
    const selectedItems = leftovers.filter(l => selected.includes(l.id))

    // Score recipes based on how well they match selected ingredients
    return SAMPLE_TRANSFORM_RECIPES.map(recipe => {
      let score = 0
      const matchedItems: string[] = []

      selectedItems.forEach(item => {
        const itemName = item.name.toLowerCase()
        // Check if this leftover would work with the recipe
        if (recipe.name.toLowerCase().includes('rice') &&
            (itemName.includes('rice') || itemName.includes('grain'))) {
          score += 2
          matchedItems.push(item.id)
        }
        if (recipe.name.toLowerCase().includes('chicken') &&
            itemName.includes('chicken')) {
          score += 2
          matchedItems.push(item.id)
        }
        if (recipe.name.toLowerCase().includes('pasta') &&
            itemName.includes('pasta')) {
          score += 2
          matchedItems.push(item.id)
        }
        if (recipe.name.toLowerCase().includes('soup') ||
            recipe.name.toLowerCase().includes('stir fry')) {
          // These recipes work with almost anything
          score += 1
          matchedItems.push(item.id)
        }
        if (recipe.name.toLowerCase().includes('burrito') &&
            (itemName.includes('meat') || itemName.includes('chicken') ||
             itemName.includes('beans') || itemName.includes('rice'))) {
          score += 2
          matchedItems.push(item.id)
        }
      })

      return {
        ...recipe,
        usesLeftovers: [...new Set(matchedItems)],
        matchScore: score
      }
    }).sort((a, b) => b.matchScore - a.matchScore)
  }, [selectedLeftovers, leftovers])

  const toggleLeftover = (id: string) => {
    const newSelected = new Set(selectedLeftovers)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedLeftovers(newSelected)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-amber-100 text-amber-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDaysOldLabel = (days: number) => {
    if (days === 0) return 'Made today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  const getDaysOldColor = (days: number, safe: boolean) => {
    if (!safe) return 'text-red-600 bg-red-50'
    if (days <= 1) return 'text-green-600 bg-green-50'
    if (days <= 3) return 'text-amber-600 bg-amber-50'
    return 'text-orange-600 bg-orange-50'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-xl">Leftover Magic</h2>
            <p className="text-white/80 text-sm">Transform leftovers into new delicious meals</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="w-4 h-4 text-orange-200" />
              <span className="text-sm text-white/80">Available Leftovers</span>
            </div>
            <p className="text-3xl font-bold">{safeLeftovers.length}</p>
            <p className="text-xs text-white/60">ready to use</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-orange-200" />
              <span className="text-sm text-white/80">Recipe Ideas</span>
            </div>
            <p className="text-3xl font-bold">{matchingRecipes.length}</p>
            <p className="text-xs text-white/60">transformations</p>
          </div>
        </div>
      </div>

      {/* Available Leftovers */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Utensils className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Your Leftovers</h3>
              <p className="text-xs text-gray-500">Select items to find matching recipes</p>
            </div>
          </div>
          {selectedLeftovers.size > 0 && (
            <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              {selectedLeftovers.size} selected
            </span>
          )}
        </div>

        {safeLeftovers.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Utensils className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No leftovers available</p>
            <p className="text-sm text-gray-400 mt-1">Leftovers from cooked meals will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {safeLeftovers.map((leftover) => (
              <button
                key={leftover.id}
                onClick={() => toggleLeftover(leftover.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  selectedLeftovers.has(leftover.id)
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-gray-100 bg-gray-50 hover:border-orange-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedLeftovers.has(leftover.id)
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {selectedLeftovers.has(leftover.id) && <Check className="w-4 h-4" />}
                </div>
                <span className="text-2xl">{leftover.emoji}</span>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{leftover.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{leftover.quantity}</span>
                    {leftover.originalMeal && (
                      <>
                        <span>•</span>
                        <span>from {leftover.originalMeal}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getDaysOldColor(leftover.daysOld, leftover.safeToUse)}`}>
                  {getDaysOldLabel(leftover.daysOld)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Unsafe leftovers warning */}
        {unsafeLeftovers.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-medium text-red-800 mb-2">⚠️ These should be discarded:</p>
            <div className="flex flex-wrap gap-2">
              {unsafeLeftovers.map((item) => (
                <div key={item.id} className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-red-200">
                  <span>{item.emoji}</span>
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <button
                    onClick={() => onMarkUsed(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generate AI Recipes Button */}
      {selectedLeftovers.size > 0 && (
        <button
          onClick={() => onGenerateRecipes(
            leftovers.filter(l => selectedLeftovers.has(l.id))
          )}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
        >
          <Sparkles className="w-5 h-5" />
          <span>Get AI Recipe Ideas for {selectedLeftovers.size} Leftovers</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {/* Recipe Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <ChefHat className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">Recipe Ideas</h3>
        </div>

        {matchingRecipes.map((recipe) => {
          const isExpanded = expandedRecipe === recipe.id
          const matchedLeftovers = leftovers.filter(l =>
            recipe.usesLeftovers.includes(l.id)
          )

          return (
            <div
              key={recipe.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
            >
              {/* Recipe Header */}
              <button
                onClick={() => setExpandedRecipe(isExpanded ? null : recipe.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{recipe.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{recipe.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{recipe.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTime} prep
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {recipe.cookTime} cook
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {recipe.servings} servings
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {recipe.rating}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Matched leftovers indicator */}
                {matchedLeftovers.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-orange-50 rounded-lg">
                    <ThumbsUp className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-700">
                      Uses: {matchedLeftovers.map(l => l.name).join(', ')}
                    </span>
                  </div>
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  {/* Serving adjuster */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Servings</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))
                        }}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {Math.round(recipe.servings * servingMultiplier)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setServingMultiplier(servingMultiplier + 0.5)
                        }}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Additional ingredients */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Additional Ingredients Needed:</h5>
                    <div className="bg-white rounded-xl p-3">
                      <ul className="space-y-1">
                        {recipe.additionalIngredients.map((ing, idx) => (
                          <li key={idx} className="flex items-center justify-between text-sm">
                            <span className={ing.optional ? 'text-gray-500' : 'text-gray-900'}>
                              {ing.name} {ing.optional && '(optional)'}
                            </span>
                            <span className="text-gray-500">{ing.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h5>
                    <div className="bg-white rounded-xl p-3">
                      <ol className="space-y-2">
                        {recipe.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-3 text-sm">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-medium">
                              {idx + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Tips */}
                  {recipe.tips && recipe.tips.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">💡 Tips:</h5>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <ul className="space-y-1">
                          {recipe.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                              <span>•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Start cooking button */}
                  <button
                    onClick={() => onSelectRecipe(recipe, matchedLeftovers)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                  >
                    <ChefHat className="w-5 h-5" />
                    Start Cooking
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Zero Waste Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Recycle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Zero Waste Kitchen Tips</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Most cooked foods stay safe for 3-4 days in the fridge</li>
              <li>• Label leftovers with the date you made them</li>
              <li>• Transform leftovers within 2 days for best taste</li>
              <li>• When in doubt, freeze it for later!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
