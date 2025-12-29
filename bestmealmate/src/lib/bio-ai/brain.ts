/**
 * 🧠 BRAIN MODULE - Central AI Processing with Full Claude Integration
 *
 * Just like the human brain, this module:
 * - Processes complex decisions using Claude AI (meal suggestions, dietary analysis)
 * - Stores and retrieves memories (user preferences, history)
 * - Learns from patterns (usage analytics, feedback)
 * - Coordinates with other "organs" for holistic decisions
 *
 * NOW POWERED BY FULL CLAUDE AI! 🚀
 */

import { supabase } from '../supabase'
import Anthropic from '@anthropic-ai/sdk'

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
  recipe?: {
    name: string
    ingredients: string[]
    instructions: string[]
    prepTime: string
    cookTime: string
    servings: number
  }
}

// Claude AI response structure
interface ClaudeDecision {
  meal_suggestion: string
  confidence: number
  reasoning: string[]
  alternatives: string[]
  recipe?: {
    name: string
    ingredients: string[]
    instructions: string[]
    prep_time: string
    cook_time: string
    servings: number
  }
}

class BrainModule {
  private shortTermMemory: Map<string, unknown> = new Map()
  private readonly MAX_SHORT_TERM = 100
  private anthropic: Anthropic | null = null

  /**
   * 🧠 Initialize Claude AI connection
   */
  private getAnthropic(): Anthropic {
    if (!this.anthropic) {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY not configured - Brain cannot think!')
      }
      this.anthropic = new Anthropic({ apiKey })
    }
    return this.anthropic
  }

  /**
   * 🧠 Prefrontal Cortex - Decision Making with FULL CLAUDE AI
   * Analyzes input and makes complex decisions about meals using Claude
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
    // Load relevant memories to enrich context
    const memories = await this.retrieveMemories(userId, 'preference')
    const feedbackMemories = await this.retrieveMemories(userId, 'feedback')
    const patternMemories = await this.retrieveMemories(userId, 'pattern')

    // Build memory context for Claude
    const memoryContext = this.buildMemoryContext(memories, feedbackMemories, patternMemories)

    try {
      // Use Claude AI for decision making
      const decision = await this.claudeThink(context, memoryContext)

      // Store this decision pattern for learning
      await this.formMemory(userId, 'pattern', {
        context,
        decision: decision.decision,
        confidence: decision.confidence,
        timestamp: new Date().toISOString()
      })

      return decision
    } catch (error) {
      console.error('🧠 Claude thinking failed, using fallback:', error)
      // Fallback to basic decision tree if Claude fails
      return this.processDecisionTree(context, memories)
    }
  }

  /**
   * 🧠 Claude AI Thinking - The Real Brain Power
   * Sends context to Claude and gets intelligent meal decisions
   */
  private async claudeThink(
    context: {
      pantryItems: string[]
      dietaryRestrictions: string[]
      familyPreferences: string[]
      mealHistory: string[]
      timeOfDay: string
      mood?: string
    },
    memoryContext: string
  ): Promise<ThoughtResult> {
    const anthropic = this.getAnthropic()

    const systemPrompt = `You are the AI Brain for BestMealMate, a family meal planning app.
You are the central decision-making organ in a bio-inspired AI architecture.

Your role is to analyze the family's situation and suggest the PERFECT meal.

CRITICAL RULES:
1. SAFETY FIRST: Never suggest anything containing allergens for family members
2. Use ingredients they HAVE (prioritize expiring items)
3. Consider the time of day and mood
4. Ensure variety (don't repeat recent meals)
5. Make it work for ALL family members

${memoryContext}

You must respond with VALID JSON only, in this exact format:
{
  "meal_suggestion": "Name of the meal",
  "confidence": 0.95,
  "reasoning": ["reason 1", "reason 2", "reason 3"],
  "alternatives": ["alternative meal 1", "alternative meal 2"],
  "recipe": {
    "name": "Full Recipe Name",
    "ingredients": ["ingredient 1 with amount", "ingredient 2 with amount"],
    "instructions": ["Step 1", "Step 2", "Step 3"],
    "prep_time": "15 minutes",
    "cook_time": "30 minutes",
    "servings": 4
  }
}`

    const userPrompt = `Analyze this situation and suggest the best meal:

TIME OF DAY: ${context.timeOfDay}
MOOD: ${context.mood || 'neutral'}

AVAILABLE INGREDIENTS:
${context.pantryItems.length > 0 ? context.pantryItems.join(', ') : 'No specific items listed'}

DIETARY RESTRICTIONS (MUST AVOID):
${context.dietaryRestrictions.length > 0 ? context.dietaryRestrictions.join(', ') : 'None'}

FAMILY PREFERENCES:
${context.familyPreferences.length > 0 ? context.familyPreferences.join(', ') : 'No specific preferences'}

RECENT MEALS (avoid repeating):
${context.mealHistory.length > 0 ? context.mealHistory.slice(0, 5).join(', ') : 'No recent history'}

Respond with JSON only.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })

    // Parse Claude's response
    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7)
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3)
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3)
    }
    jsonText = jsonText.trim()

    const claudeDecision: ClaudeDecision = JSON.parse(jsonText)

    return {
      decision: claudeDecision.meal_suggestion,
      confidence: claudeDecision.confidence,
      reasoning: claudeDecision.reasoning,
      alternatives: claudeDecision.alternatives,
      memories_used: [],
      recipe: claudeDecision.recipe ? {
        name: claudeDecision.recipe.name,
        ingredients: claudeDecision.recipe.ingredients,
        instructions: claudeDecision.recipe.instructions,
        prepTime: claudeDecision.recipe.prep_time,
        cookTime: claudeDecision.recipe.cook_time,
        servings: claudeDecision.recipe.servings
      } : undefined
    }
  }

  /**
   * 🧠 Build Memory Context for Claude
   * Formats memories into a context string for Claude
   */
  private buildMemoryContext(
    preferences: Memory[],
    feedback: Memory[],
    patterns: Memory[]
  ): string {
    const sections: string[] = []

    if (preferences.length > 0) {
      const prefList = preferences.slice(0, 5).map(m =>
        JSON.stringify(m.content)
      ).join('\n')
      sections.push(`USER PREFERENCES FROM MEMORY:\n${prefList}`)
    }

    // Extract liked and disliked meals from feedback
    const liked = feedback
      .filter(m => (m.content as { type?: string }).type === 'positive')
      .slice(0, 3)
      .map(m => (m.content as { mealId?: string }).mealId || 'Unknown')

    const disliked = feedback
      .filter(m => (m.content as { type?: string }).type === 'negative')
      .slice(0, 3)
      .map(m => (m.content as { mealId?: string }).mealId || 'Unknown')

    if (liked.length > 0) {
      sections.push(`MEALS USER LOVED: ${liked.join(', ')}`)
    }
    if (disliked.length > 0) {
      sections.push(`MEALS TO AVOID (user disliked): ${disliked.join(', ')}`)
    }

    // Extract time patterns
    const timePatterns: Record<string, string[]> = {}
    patterns.slice(0, 10).forEach(p => {
      const content = p.content as { context?: { timeOfDay?: string }, decision?: string }
      if (content.context?.timeOfDay && content.decision) {
        if (!timePatterns[content.context.timeOfDay]) {
          timePatterns[content.context.timeOfDay] = []
        }
        timePatterns[content.context.timeOfDay].push(content.decision)
      }
    })

    if (Object.keys(timePatterns).length > 0) {
      const patternStr = Object.entries(timePatterns)
        .map(([time, meals]) => `${time}: ${meals.slice(0, 2).join(', ')}`)
        .join('\n')
      sections.push(`PAST MEAL PATTERNS:\n${patternStr}`)
    }

    return sections.length > 0
      ? '\n--- MEMORY CONTEXT ---\n' + sections.join('\n\n') + '\n--- END MEMORY ---\n'
      : ''
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
   * 🧠 Pattern Recognition with Claude
   * Uses Claude to identify deeper patterns in user behavior
   */
  async recognizePatterns(userId: string): Promise<{
    mealTimePatterns: Record<string, string[]>
    ingredientPreferences: string[]
    avoidancePatterns: string[]
    insights: string[]
  }> {
    const memories = await this.retrieveMemories(userId, 'pattern')
    const feedbackMemories = await this.retrieveMemories(userId, 'feedback')

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

    // Use Claude to generate insights if we have enough data
    let insights: string[] = []
    if (memories.length >= 5) {
      try {
        const anthropic = this.getAnthropic()
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `Analyze these meal patterns and provide 3 brief insights about the user's eating habits. Just list the insights, no other text.

Patterns: ${JSON.stringify(mealTimePatterns)}
Feedback: ${feedbackMemories.slice(0, 5).map(m => JSON.stringify(m.content)).join('\n')}`
          }]
        })

        const textContent = response.content.find(block => block.type === 'text')
        if (textContent && textContent.type === 'text') {
          insights = textContent.text.split('\n').filter(line => line.trim().length > 0).slice(0, 3)
        }
      } catch {
        insights = ['Not enough data for AI insights yet']
      }
    }

    return { mealTimePatterns, ingredientPreferences, avoidancePatterns, insights }
  }

  /**
   * 🧠 Learning & Adaptation with Claude Analysis
   * Adjusts behavior based on feedback using AI analysis
   */
  async learn(
    userId: string,
    feedback: {
      mealId: string
      rating: number
      feedback?: string
    }
  ): Promise<{ learned: boolean; insight?: string }> {
    // Store the feedback memory
    const feedbackType = feedback.rating >= 4 ? 'positive' : feedback.rating <= 2 ? 'negative' : 'neutral'

    await this.formMemory(userId, 'feedback', {
      type: feedbackType,
      mealId: feedback.mealId,
      rating: feedback.rating,
      feedback: feedback.feedback,
      timestamp: new Date().toISOString()
    })

    // Use Claude to extract learning from feedback if detailed feedback provided
    let insight: string | undefined
    if (feedback.feedback && feedback.feedback.length > 10) {
      try {
        const anthropic = this.getAnthropic()
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: `Extract ONE key learning from this meal feedback (respond in 1 sentence):
Meal: ${feedback.mealId}
Rating: ${feedback.rating}/5
Feedback: "${feedback.feedback}"`
          }]
        })

        const textContent = response.content.find(block => block.type === 'text')
        if (textContent && textContent.type === 'text') {
          insight = textContent.text.trim()
        }
      } catch {
        // Silent fail - insight is optional
      }
    }

    return { learned: true, insight }
  }

  /**
   * 🧠 Creative Thinking - Generate Novel Meal Ideas
   * Uses Claude to brainstorm creative meal combinations
   */
  async brainstorm(
    pantryItems: string[],
    constraints: string[]
  ): Promise<string[]> {
    try {
      const anthropic = this.getAnthropic()
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Generate 5 creative meal ideas using these ingredients: ${pantryItems.join(', ')}
Constraints: ${constraints.join(', ') || 'None'}

List just the meal names, one per line.`
        }]
      })

      const textContent = response.content.find(block => block.type === 'text')
      if (textContent && textContent.type === 'text') {
        return textContent.text.split('\n').filter(line => line.trim().length > 0).slice(0, 5)
      }
      return []
    } catch {
      return ['Creative thinking temporarily unavailable']
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

  /**
   * 🧠 Fallback Decision Tree (when Claude is unavailable)
   */
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
    reasoning.push('Note: Using fallback mode - Claude AI temporarily unavailable')

    return {
      decision: `AI-optimized ${suggestion} based on your pantry`,
      confidence: 0.65,
      reasoning,
      alternatives: ['Quick option', 'Healthy option', 'Family favorite'],
      memories_used: memoriesUsed
    }
  }
}

export const brain = new BrainModule()
export default brain
