/**
 * 🍽️ DIGESTIVE MODULE - Food & Data Processing
 *
 * Just like the human digestive system, this module:
 * - Ingests raw food data (pantry items, recipes)
 * - Breaks down into nutrients (extracts useful info)
 * - Absorbs nutrition (transforms for AI processing)
 * - Eliminates waste (removes unusable data)
 * - Produces energy (actionable insights)
 *
 * Perfect for a meal planning app! 🍳
 */

import { supabase } from '../supabase'

// Food item (raw input)
export interface RawFoodData {
  id?: string
  name: string
  quantity?: number
  unit?: string
  category?: string
  expiryDate?: string
  nutritionInfo?: NutritionInfo
  allergens?: string[]
}

// Nutrition info (extracted nutrients)
export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  vitamins: string[]
  minerals: string[]
}

// Digested food (processed output)
export interface DigestedFood {
  original: RawFoodData
  nutrients: NutritionInfo
  freshness: number // 0-100
  compatibility: string[] // dietary restrictions it works with
  mealSuggestions: string[]
  storageAdvice: string
  wasteRisk: number // 0-100, how likely to expire soon
}

// Meal composition
export interface MealComposition {
  ingredients: DigestedFood[]
  totalNutrition: NutritionInfo
  balanceScore: number // how nutritionally balanced
  allergenWarnings: string[]
  dietaryCompliance: Record<string, boolean>
}

// Stomach state
export interface StomachState {
  currentLoad: number // items being processed
  maxCapacity: number
  acidLevel: number // processing intensity
  motility: number // processing speed
  isDigesting: boolean
}

class DigestiveModule {
  private stomach: StomachState = {
    currentLoad: 0,
    maxCapacity: 50,
    acidLevel: 5, // 1-10 scale
    motility: 5, // 1-10 scale
    isDigesting: false
  }

  private digestiveEnzymes: Map<string, (food: RawFoodData) => Partial<DigestedFood>> = new Map()

  constructor() {
    // Register default enzymes for different food categories
    this.registerEnzyme('protein', this.digestProtein.bind(this))
    this.registerEnzyme('carb', this.digestCarb.bind(this))
    this.registerEnzyme('vegetable', this.digestVegetable.bind(this))
    this.registerEnzyme('fruit', this.digestFruit.bind(this))
    this.registerEnzyme('dairy', this.digestDairy.bind(this))
  }

  /**
   * 🍽️ Ingest - Take in raw food data
   * First step of digestion
   */
  ingest(foods: RawFoodData[]): { accepted: RawFoodData[]; rejected: RawFoodData[] } {
    const accepted: RawFoodData[] = []
    const rejected: RawFoodData[] = []

    foods.forEach(food => {
      if (this.stomach.currentLoad < this.stomach.maxCapacity) {
        // Basic validation (mouth/chewing)
        if (this.chew(food)) {
          accepted.push(food)
          this.stomach.currentLoad++
        } else {
          rejected.push(food)
        }
      } else {
        // Stomach full
        rejected.push(food)
      }
    })

    return { accepted, rejected }
  }

  /**
   * 🍽️ Digest - Process food into usable nutrients
   * Main digestion process
   */
  async digest(foods: RawFoodData[]): Promise<DigestedFood[]> {
    this.stomach.isDigesting = true
    const digested: DigestedFood[] = []

    for (const food of foods) {
      // Apply stomach acid (basic processing)
      const processedFood = this.applyAcid(food)

      // Apply specific enzyme for food category
      const category = food.category?.toLowerCase() || 'general'
      const enzyme = this.digestiveEnzymes.get(category)

      let enzymeResult: Partial<DigestedFood> = {}
      if (enzyme) {
        enzymeResult = enzyme(processedFood)
      }

      // Create digested result
      const result: DigestedFood = {
        original: food,
        nutrients: enzymeResult.nutrients || this.extractNutrients(food),
        freshness: this.calculateFreshness(food),
        compatibility: enzymeResult.compatibility || this.determineCompatibility(food),
        mealSuggestions: enzymeResult.mealSuggestions || this.generateMealSuggestions(food),
        storageAdvice: enzymeResult.storageAdvice || this.getStorageAdvice(food),
        wasteRisk: this.calculateWasteRisk(food)
      }

      digested.push(result)
      this.stomach.currentLoad--
    }

    this.stomach.isDigesting = false
    return digested
  }

  /**
   * 🍽️ Absorb - Extract and store nutritional value
   * Transfer nutrients to the body (database)
   */
  async absorb(
    householdId: string,
    digested: DigestedFood[]
  ): Promise<{ absorbed: number; stored: number }> {
    let absorbed = 0
    let stored = 0

    for (const food of digested) {
      // Store nutrition data for analytics
      const supabaseAny = supabase as { from: (table: string) => ReturnType<typeof supabase.from> }

      const { error } = await supabaseAny.from('nutrition_logs').insert({
        household_id: householdId,
        food_name: food.original.name,
        nutrients: food.nutrients,
        freshness: food.freshness,
        logged_at: new Date().toISOString()
      })

      if (!error) {
        absorbed++
        stored++
      }
    }

    return { absorbed, stored }
  }

  /**
   * 🍽️ Eliminate - Remove waste/expired items
   * Get rid of unusable data
   */
  async eliminate(householdId: string): Promise<{ eliminated: string[]; warnings: string[] }> {
    const eliminated: string[] = []
    const warnings: string[] = []

    // Find expired items with ingredient names
    const { data: expiredItems } = await supabase
      .from('pantry_items')
      .select('id, expiry_date, ingredients(name)')
      .eq('household_id', householdId)
      .lt('expiry_date', new Date().toISOString())

    if (expiredItems && expiredItems.length > 0) {
      for (const item of expiredItems) {
        // Get item name from joined ingredient or use fallback
        const itemName = (item.ingredients as { name: string } | null)?.name || 'Unknown item'

        // Move to waste log before deletion
        const supabaseAny = supabase as { from: (table: string) => ReturnType<typeof supabase.from> }
        await supabaseAny.from('food_waste_log').insert({
          household_id: householdId,
          item_name: itemName,
          reason: 'expired',
          eliminated_at: new Date().toISOString()
        })

        eliminated.push(itemName)
      }

      // Remove from pantry
      await supabase
        .from('pantry_items')
        .delete()
        .in('id', expiredItems.map(i => i.id))
    }

    // Find items about to expire (warnings)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

    const { data: soonExpiring } = await supabase
      .from('pantry_items')
      .select('expiry_date, ingredients(name)')
      .eq('household_id', householdId)
      .lt('expiry_date', threeDaysFromNow.toISOString())
      .gt('expiry_date', new Date().toISOString())

    if (soonExpiring) {
      soonExpiring.forEach(item => {
        const itemName = (item.ingredients as { name: string } | null)?.name || 'Item'
        warnings.push(`${itemName} expires soon!`)
      })
    }

    return { eliminated, warnings }
  }

  /**
   * 🍽️ Compose Meal - Combine digested foods into a meal
   * Like intestinal absorption - combining nutrients
   */
  composeMeal(
    ingredients: DigestedFood[],
    dietaryRestrictions: string[] = []
  ): MealComposition {
    // Combine all nutrition
    const totalNutrition: NutritionInfo = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      vitamins: [],
      minerals: []
    }

    const allergenWarnings: string[] = []
    const dietaryCompliance: Record<string, boolean> = {}

    ingredients.forEach(ing => {
      totalNutrition.calories += ing.nutrients.calories
      totalNutrition.protein += ing.nutrients.protein
      totalNutrition.carbs += ing.nutrients.carbs
      totalNutrition.fat += ing.nutrients.fat
      totalNutrition.fiber += ing.nutrients.fiber
      totalNutrition.vitamins.push(...ing.nutrients.vitamins)
      totalNutrition.minerals.push(...ing.nutrients.minerals)

      // Check allergens
      ing.original.allergens?.forEach(a => {
        if (!allergenWarnings.includes(a)) {
          allergenWarnings.push(a)
        }
      })
    })

    // Remove duplicate vitamins/minerals
    totalNutrition.vitamins = Array.from(new Set(totalNutrition.vitamins))
    totalNutrition.minerals = Array.from(new Set(totalNutrition.minerals))

    // Check dietary compliance
    dietaryRestrictions.forEach(restriction => {
      const compliant = ingredients.every(ing =>
        ing.compatibility.includes(restriction)
      )
      dietaryCompliance[restriction] = compliant
    })

    // Calculate balance score
    const balanceScore = this.calculateBalanceScore(totalNutrition)

    return {
      ingredients,
      totalNutrition,
      balanceScore,
      allergenWarnings,
      dietaryCompliance
    }
  }

  /**
   * 🍽️ Get Stomach State
   */
  getStomachState(): StomachState {
    return { ...this.stomach }
  }

  /**
   * 🍽️ Register Enzyme
   * Add custom processing for food categories
   */
  registerEnzyme(
    category: string,
    processor: (food: RawFoodData) => Partial<DigestedFood>
  ): void {
    this.digestiveEnzymes.set(category, processor)
  }

  // Private helper methods
  private chew(food: RawFoodData): boolean {
    // Basic validation
    return !!(food.name && food.name.length > 0)
  }

  private applyAcid(food: RawFoodData): RawFoodData {
    // Normalize the food data
    return {
      ...food,
      name: food.name.toLowerCase().trim(),
      category: food.category?.toLowerCase().trim()
    }
  }

  private extractNutrients(food: RawFoodData): NutritionInfo {
    // Default nutrition extraction
    return food.nutritionInfo || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      vitamins: [],
      minerals: []
    }
  }

  private calculateFreshness(food: RawFoodData): number {
    if (!food.expiryDate) return 100

    const now = new Date()
    const expiry = new Date(food.expiryDate)
    const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

    if (daysUntilExpiry <= 0) return 0
    if (daysUntilExpiry >= 14) return 100

    return Math.round((daysUntilExpiry / 14) * 100)
  }

  private calculateWasteRisk(food: RawFoodData): number {
    return 100 - this.calculateFreshness(food)
  }

  private determineCompatibility(food: RawFoodData): string[] {
    const compatibility: string[] = ['omnivore']

    // Check for common restrictions
    const meatProducts = ['chicken', 'beef', 'pork', 'fish', 'meat', 'bacon']
    const dairyProducts = ['milk', 'cheese', 'butter', 'cream', 'yogurt']
    const glutenProducts = ['bread', 'pasta', 'flour', 'wheat']

    const name = food.name.toLowerCase()

    if (!meatProducts.some(m => name.includes(m))) {
      compatibility.push('vegetarian')
      if (!dairyProducts.some(d => name.includes(d))) {
        compatibility.push('vegan')
      }
    }

    if (!glutenProducts.some(g => name.includes(g))) {
      compatibility.push('gluten-free')
    }

    return compatibility
  }

  private generateMealSuggestions(food: RawFoodData): string[] {
    const suggestions: string[] = []
    const category = food.category?.toLowerCase() || ''

    const suggestionMap: Record<string, string[]> = {
      protein: ['Grill with vegetables', 'Add to stir-fry', 'Make a salad bowl'],
      vegetable: ['Steam as a side', 'Roast with herbs', 'Add to soup'],
      fruit: ['Fresh snack', 'Smoothie ingredient', 'Dessert topping'],
      dairy: ['Breakfast parfait', 'Cooking ingredient', 'Snack with crackers'],
      grain: ['Base for bowl', 'Side dish', 'Breakfast porridge']
    }

    return suggestionMap[category] || suggestions
  }

  private getStorageAdvice(food: RawFoodData): string {
    const category = food.category?.toLowerCase() || ''

    const adviceMap: Record<string, string> = {
      protein: 'Store in refrigerator at 40°F or below. Freeze for longer storage.',
      vegetable: 'Keep in crisper drawer. Most last 5-7 days.',
      fruit: 'Store at room temperature until ripe, then refrigerate.',
      dairy: 'Keep refrigerated. Check expiry date regularly.',
      grain: 'Store in cool, dry place in airtight container.'
    }

    return adviceMap[category] || 'Store in a cool, dry place.'
  }

  private calculateBalanceScore(nutrition: NutritionInfo): number {
    // Simple balance calculation based on macros
    const { protein, carbs, fat, fiber } = nutrition

    // Ideal ratios (simplified)
    const hasProtein = protein > 0
    const hasCarbs = carbs > 0
    const hasFat = fat > 0
    const hasFiber = fiber > 0
    const hasVitamins = nutrition.vitamins.length > 0

    const factors = [hasProtein, hasCarbs, hasFat, hasFiber, hasVitamins]
    const score = factors.filter(Boolean).length / factors.length

    return Math.round(score * 100)
  }

  // Category-specific enzyme processors
  private digestProtein(food: RawFoodData): Partial<DigestedFood> {
    return {
      nutrients: {
        calories: 200,
        protein: 25,
        carbs: 0,
        fat: 10,
        fiber: 0,
        vitamins: ['B12', 'B6'],
        minerals: ['Iron', 'Zinc']
      },
      mealSuggestions: [
        'Grill with herbs and lemon',
        'Add to pasta or rice dish',
        'Make protein-rich salad'
      ],
      storageAdvice: 'Refrigerate immediately. Use within 2-3 days or freeze.'
    }
  }

  private digestCarb(food: RawFoodData): Partial<DigestedFood> {
    return {
      nutrients: {
        calories: 150,
        protein: 5,
        carbs: 30,
        fat: 2,
        fiber: 3,
        vitamins: ['B1', 'B3'],
        minerals: ['Magnesium']
      },
      mealSuggestions: [
        'Serve as base for bowl',
        'Side dish with protein',
        'Add to soup for heartiness'
      ]
    }
  }

  private digestVegetable(food: RawFoodData): Partial<DigestedFood> {
    return {
      nutrients: {
        calories: 50,
        protein: 2,
        carbs: 10,
        fat: 0,
        fiber: 4,
        vitamins: ['A', 'C', 'K'],
        minerals: ['Potassium', 'Folate']
      },
      compatibility: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
      mealSuggestions: [
        'Roast with olive oil',
        'Steam for side dish',
        'Add to stir-fry or salad'
      ]
    }
  }

  private digestFruit(food: RawFoodData): Partial<DigestedFood> {
    return {
      nutrients: {
        calories: 60,
        protein: 1,
        carbs: 15,
        fat: 0,
        fiber: 3,
        vitamins: ['C', 'A'],
        minerals: ['Potassium']
      },
      compatibility: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
      mealSuggestions: [
        'Fresh as snack',
        'Blend into smoothie',
        'Top on yogurt or oatmeal'
      ]
    }
  }

  private digestDairy(food: RawFoodData): Partial<DigestedFood> {
    return {
      nutrients: {
        calories: 100,
        protein: 8,
        carbs: 12,
        fat: 5,
        fiber: 0,
        vitamins: ['D', 'B12'],
        minerals: ['Calcium', 'Phosphorus']
      },
      compatibility: ['vegetarian', 'gluten-free'],
      mealSuggestions: [
        'Add to breakfast',
        'Use in cooking/baking',
        'Snack with fruit'
      ]
    }
  }
}

export const digestive = new DigestiveModule()
export default digestive
