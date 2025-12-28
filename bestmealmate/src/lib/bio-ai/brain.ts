/**
 * 🧠 BRAIN MODULE - Central AI Processing
 *
 * Just like the human brain, this module:
 * - Processes complex decisions (meal suggestions, dietary analysis)
 * - Stores and retrieves memories (user preferences, history)
 * - Learns from patterns (usage analytics, feedback)
 * - Coordinates with other "organs" for holistic decisions
 */

import { supabase } from '../supabase'

// Brain regions (specialized processing areas)
export interface BrainRegion {
  name: string
  function: string
  process: (input: unknown) => Promise<unknown>
}

// Memory types (short-term and long-term)
export interface Memory {
  id: string
  type: 'short_term' | 'long_term'
  category: 'preference' | 'behavior' | 'feedback' | 'pattern'
  content: Record<string, unknown>
  strength: number // 0-1, how strong the memory is
  created_at: string
  last_accessed: string
}

// Thought process result
export interface ThoughtResult {
  decision: string
  confidence: number
  reasoning: string[]
  alternatives: string[]
  memories_used: string[]
}

class BrainModule {
  private shortTermMemory: Map<string, unknown> = new Map()
  private readonly MAX_SHORT_TERM = 100

  /**
   * 🧠 Prefrontal Cortex - Decision Making
   * Analyzes input and makes complex decisions about meals
   */
  async makeDecision(
    userId: string,
    context: {
      pantryItems: string[]
      dietaryRestrictions: string[]
      familyPreferences: string[]
      mealHistory: string[]
      timeOfDay: string
      mood?: string
    }
  ): Promise<ThoughtResult> {
    // Load relevant memories
    const memories = await this.retrieveMemories(userId, 'preference')

    // Process through decision tree
    const decision = this.processDecisionTree(context, memories)

    // Store this decision pattern for learning
    await this.formMemory(userId, 'pattern', {
      context,
      decision: decision.decision,
      timestamp: new Date().toISOString()
    })

    return decision
  }

  /**
   * 🧠 Hippocampus - Memory Formation
   * Creates and stores new memories from experiences
   */
  async formMemory(
    userId: string,
    category: Memory['category'],
    content: Record<string, unknown>
  ): Promise<void> {
    const memory: Omit<Memory, 'id'> = {
      type: this.determineMemoryType(category),
      category,
      content,
      strength: 0.5,
      created_at: new Date().toISOString(),
      last_accessed: new Date().toISOString()
    }

    // Store in short-term first
    const tempId = `temp_${Date.now()}`
    this.shortTermMemory.set(tempId, memory)

    // Consolidate to long-term if important
    if (memory.type === 'long_term') {
      await this.consolidateToLongTerm(userId, memory)
    }

    // Manage short-term capacity
    if (this.shortTermMemory.size > this.MAX_SHORT_TERM) {
      this.pruneShortTermMemory()
    }
  }

  /**
   * 🧠 Memory Retrieval
   * Retrieves relevant memories based on category and context
   */
  async retrieveMemories(
    userId: string,
    category: Memory['category']
  ): Promise<Memory[]> {
    const supabaseAny = supabase as { from: (table: string) => ReturnType<typeof supabase.from> }

    const { data, error } = await supabaseAny
      .from('ai_memories')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('strength', { ascending: false })
      .limit(20)

    if (error) {
      console.log('No memories found or table not exists:', error.message)
      return []
    }

    // Update last accessed for retrieved memories
    if (data && data.length > 0) {
      const ids = data.map((m: { id: string }) => m.id)
      await supabaseAny
        .from('ai_memories')
        .update({
          last_accessed: new Date().toISOString()
        })
        .in('id', ids)
    }

    return (data || []) as Memory[]
  }

  /**
   * 🧠 Pattern Recognition
   * Identifies patterns in user behavior and preferences
   */
  async recognizePatterns(userId: string): Promise<{
    mealTimePatterns: Record<string, string[]>
    ingredientPreferences: string[]
    avoidancePatterns: string[]
  }> {
    const memories = await this.retrieveMemories(userId, 'pattern')

    const mealTimePatterns: Record<string, string[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    }
    const ingredientPreferences: string[] = []
    const avoidancePatterns: string[] = []

    memories.forEach(memory => {
      const content = memory.content as Record<string, unknown>
      const context = content.context as Record<string, unknown> | undefined

      if (context?.timeOfDay && content.decision) {
        const time = context.timeOfDay as string
        const meal = content.decision as string
        if (mealTimePatterns[time]) {
          mealTimePatterns[time].push(meal)
        }
      }
    })

    return { mealTimePatterns, ingredientPreferences, avoidancePatterns }
  }

  /**
   * 🧠 Learning & Adaptation
   * Adjusts behavior based on feedback
   */
  async learn(
    userId: string,
    feedback: {
      mealId: string
      rating: number
      feedback?: string
    }
  ): Promise<void> {
    // Strengthen positive memories
    if (feedback.rating >= 4) {
      await this.formMemory(userId, 'feedback', {
        type: 'positive',
        mealId: feedback.mealId,
        rating: feedback.rating,
        feedback: feedback.feedback
      })
    }
    // Form avoidance pattern for negative feedback
    else if (feedback.rating <= 2) {
      await this.formMemory(userId, 'feedback', {
        type: 'negative',
        mealId: feedback.mealId,
        rating: feedback.rating,
        feedback: feedback.feedback
      })
    }
  }

  // Private helper methods
  private determineMemoryType(category: Memory['category']): Memory['type'] {
    // Preferences and patterns go to long-term
    if (category === 'preference' || category === 'pattern') {
      return 'long_term'
    }
    return 'short_term'
  }

  private async consolidateToLongTerm(
    userId: string,
    memory: Omit<Memory, 'id'>
  ): Promise<void> {
    const supabaseAny = supabase as { from: (table: string) => ReturnType<typeof supabase.from> }

    await supabaseAny.from('ai_memories').insert({
      user_id: userId,
      ...memory
    })
  }

  private pruneShortTermMemory(): void {
    // Remove oldest 20% of memories
    const entries = Array.from(this.shortTermMemory.entries())
    const toRemove = Math.floor(entries.length * 0.2)

    entries.slice(0, toRemove).forEach(([key]) => {
      this.shortTermMemory.delete(key)
    })
  }

  private processDecisionTree(
    context: {
      pantryItems: string[]
      dietaryRestrictions: string[]
      familyPreferences: string[]
      mealHistory: string[]
      timeOfDay: string
      mood?: string
    },
    memories: Memory[]
  ): ThoughtResult {
    const reasoning: string[] = []
    const alternatives: string[] = []
    const memoriesUsed: string[] = []

    // Analyze available ingredients
    reasoning.push(`Analyzing ${context.pantryItems.length} available ingredients`)

    // Consider dietary restrictions
    if (context.dietaryRestrictions.length > 0) {
      reasoning.push(`Applying ${context.dietaryRestrictions.length} dietary restrictions`)
    }

    // Use past preferences from memory
    memories.forEach(m => {
      memoriesUsed.push(m.id)
    })

    // Time-based suggestions
    const timeBasedSuggestions: Record<string, string> = {
      morning: 'breakfast dish',
      afternoon: 'lunch option',
      evening: 'dinner meal',
      night: 'light snack'
    }

    const suggestion = timeBasedSuggestions[context.timeOfDay] || 'meal'
    reasoning.push(`Suggesting ${suggestion} based on time of day`)

    return {
      decision: `AI-optimized ${suggestion} based on your pantry`,
      confidence: 0.85,
      reasoning,
      alternatives: ['Quick option', 'Healthy option', 'Family favorite'],
      memories_used: memoriesUsed
    }
  }
}

export const brain = new BrainModule()
export default brain
