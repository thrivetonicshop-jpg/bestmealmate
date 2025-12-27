import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Household,
  FamilyMember,
  PantryItem,
  Recipe,
  GroceryList,
  GroceryListItem,
  MealPlan,
  PlannedMeal,
  Ingredient,
  Allergy,
  DietaryRestriction
} from './database.types'

// Extended types with relations
export interface PantryItemWithIngredient extends PantryItem {
  ingredient?: Ingredient
}

export interface GroceryListItemWithIngredient extends GroceryListItem {
  ingredient?: Ingredient
}

export interface PlannedMealWithRecipe extends PlannedMeal {
  recipe?: Recipe
}

export interface FamilyMemberWithDetails extends FamilyMember {
  allergies?: Allergy[]
  dietary_restrictions?: DietaryRestriction[]
}

// Auth Store
interface AuthState {
  user: { id: string; email: string } | null
  household: Household | null
  isLoading: boolean
  setUser: (user: { id: string; email: string } | null) => void
  setHousehold: (household: Household | null) => void
  setIsLoading: (loading: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      household: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setHousehold: (household) => set({ household }),
      setIsLoading: (isLoading) => set({ isLoading }),
      signOut: () => set({ user: null, household: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, household: state.household }),
    }
  )
)

// Family Store
interface FamilyState {
  members: FamilyMemberWithDetails[]
  isLoading: boolean
  setMembers: (members: FamilyMemberWithDetails[]) => void
  addMember: (member: FamilyMemberWithDetails) => void
  updateMember: (id: string, updates: Partial<FamilyMemberWithDetails>) => void
  removeMember: (id: string) => void
  setIsLoading: (loading: boolean) => void
}

export const useFamilyStore = create<FamilyState>((set) => ({
  members: [],
  isLoading: false,
  setMembers: (members) => set({ members }),
  addMember: (member) => set((state) => ({ members: [...state.members, member] })),
  updateMember: (id, updates) => set((state) => ({
    members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
  })),
  removeMember: (id) => set((state) => ({
    members: state.members.filter((m) => m.id !== id),
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
}))

// Pantry Store
interface PantryState {
  items: PantryItemWithIngredient[]
  ingredients: Ingredient[]
  isLoading: boolean
  setItems: (items: PantryItemWithIngredient[]) => void
  setIngredients: (ingredients: Ingredient[]) => void
  addItem: (item: PantryItemWithIngredient) => void
  updateItem: (id: string, updates: Partial<PantryItemWithIngredient>) => void
  removeItem: (id: string) => void
  setIsLoading: (loading: boolean) => void
}

export const usePantryStore = create<PantryState>((set) => ({
  items: [],
  ingredients: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  setIngredients: (ingredients) => set({ ingredients }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
}))

// Recipes Store
interface RecipesState {
  recipes: Recipe[]
  isLoading: boolean
  setRecipes: (recipes: Recipe[]) => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (id: string, updates: Partial<Recipe>) => void
  removeRecipe: (id: string) => void
  setIsLoading: (loading: boolean) => void
}

export const useRecipesStore = create<RecipesState>((set) => ({
  recipes: [],
  isLoading: false,
  setRecipes: (recipes) => set({ recipes }),
  addRecipe: (recipe) => set((state) => ({ recipes: [...state.recipes, recipe] })),
  updateRecipe: (id, updates) => set((state) => ({
    recipes: state.recipes.map((r) => (r.id === id ? { ...r, ...updates } : r)),
  })),
  removeRecipe: (id) => set((state) => ({
    recipes: state.recipes.filter((r) => r.id !== id),
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
}))

// Grocery Store
interface GroceryState {
  lists: GroceryList[]
  currentList: GroceryList | null
  items: GroceryListItemWithIngredient[]
  isLoading: boolean
  setLists: (lists: GroceryList[]) => void
  setCurrentList: (list: GroceryList | null) => void
  setItems: (items: GroceryListItemWithIngredient[]) => void
  addItem: (item: GroceryListItemWithIngredient) => void
  updateItem: (id: string, updates: Partial<GroceryListItemWithIngredient>) => void
  removeItem: (id: string) => void
  togglePurchased: (id: string) => void
  setIsLoading: (loading: boolean) => void
}

export const useGroceryStore = create<GroceryState>((set) => ({
  lists: [],
  currentList: null,
  items: [],
  isLoading: false,
  setLists: (lists) => set({ lists }),
  setCurrentList: (currentList) => set({ currentList }),
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  togglePurchased: (id) => set((state) => ({
    items: state.items.map((i) =>
      i.id === id ? { ...i, is_purchased: !i.is_purchased } : i
    ),
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
}))

// Meal Plan Store
interface MealPlanState {
  currentPlan: MealPlan | null
  plannedMeals: PlannedMealWithRecipe[]
  isLoading: boolean
  setCurrentPlan: (plan: MealPlan | null) => void
  setPlannedMeals: (meals: PlannedMealWithRecipe[]) => void
  addPlannedMeal: (meal: PlannedMealWithRecipe) => void
  updatePlannedMeal: (id: string, updates: Partial<PlannedMealWithRecipe>) => void
  removePlannedMeal: (id: string) => void
  setIsLoading: (loading: boolean) => void
}

export const useMealPlanStore = create<MealPlanState>((set) => ({
  currentPlan: null,
  plannedMeals: [],
  isLoading: false,
  setCurrentPlan: (currentPlan) => set({ currentPlan }),
  setPlannedMeals: (plannedMeals) => set({ plannedMeals }),
  addPlannedMeal: (meal) => set((state) => ({ plannedMeals: [...state.plannedMeals, meal] })),
  updatePlannedMeal: (id, updates) => set((state) => ({
    plannedMeals: state.plannedMeals.map((m) => (m.id === id ? { ...m, ...updates } : m)),
  })),
  removePlannedMeal: (id) => set((state) => ({
    plannedMeals: state.plannedMeals.filter((m) => m.id !== id),
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
}))

// UI Store
interface UIState {
  sidebarOpen: boolean
  aiChefOpen: boolean
  currentModal: string | null
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setAIChefOpen: (open: boolean) => void
  setCurrentModal: (modal: string | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  aiChefOpen: false,
  currentModal: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setAIChefOpen: (aiChefOpen) => set({ aiChefOpen }),
  setCurrentModal: (currentModal) => set({ currentModal }),
}))
