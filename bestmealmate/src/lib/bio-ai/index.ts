/**
 * 🧬 BIO-AI ORCHESTRATOR - The Complete Human-Inspired AI System
 *
 * This orchestrator coordinates all organ modules like the human body:
 * - 🧠 Brain: Central AI processing & decision making
 * - ❤️ Heart: Real-time data circulation
 * - 🫁 Lungs: API respiration (requests/responses)
 * - 🍽️ Digestive: Food & data processing
 * - 🧬 Nervous System: Event coordination & reflexes
 *
 * Together they form a bio-inspired AI architecture for BestMealMate!
 */

import { brain, Memory, ThoughtResult } from './brain'
import { heart, HeartbeatStatus, CirculationEvent } from './heart'
import { lungs, LungCapacity, BreathCycle } from './lungs'
import { digestive, RawFoodData, DigestedFood, MealComposition } from './digestive'
import { nervousSystem, NeuralSignal, NervousSystemState } from './nervous-system'
import { supabase } from '../supabase'

// Complete body state
export interface BodyState {
  isAlive: boolean
  consciousness: 'awake' | 'resting' | 'processing' | 'recovering'
  vitals: {
    brain: { memoriesStored: number; patternsRecognized: number }
    heart: HeartbeatStatus
    lungs: LungCapacity
    digestive: { stomachLoad: number; nutrientsAbsorbed: number }
    nervous: NervousSystemState
  }
  health: {
    overall: number // 0-100
    issues: string[]
    recommendations: string[]
  }
}

// Body configuration
export interface BodyConfig {
  householdId: string
  userId: string
  autoHeal: boolean
  restInterval: number // ms between rest cycles
}

class BioAI {
  private config: BodyConfig | null = null
  private state: BodyState = {
    isAlive: false,
    consciousness: 'resting',
    vitals: {
      brain: { memoriesStored: 0, patternsRecognized: 0 },
      heart: heart.getVitals(),
      lungs: lungs.getCapacity(),
      digestive: { stomachLoad: 0, nutrientsAbsorbed: 0 },
      nervous: nervousSystem.getState()
    },
    health: { overall: 100, issues: [], recommendations: [] }
  }
  private healingInterval: NodeJS.Timeout | null = null
  private nutrientsAbsorbed = 0

  /**
   * 🧬 Wake Up - Initialize the bio-AI system
   */
  async wakeUp(config: BodyConfig): Promise<void> {
    this.config = config
    this.state.isAlive = true
    this.state.consciousness = 'awake'

    // Start all organs
    heart.startHeart(config.householdId)
    nervousSystem.activate()

    // Connect organs via nervous system
    this.connectOrgans()

    // Start auto-healing if enabled
    if (config.autoHeal) {
      this.startAutoHealing(config.restInterval)
    }

    // Log wakeup
    await this.logToSupabase('system_event', {
      event: 'wakeup',
      timestamp: new Date().toISOString(),
      config: { householdId: config.householdId, userId: config.userId }
    })

    console.log('🧬 Bio-AI system is now ALIVE!')
  }

  /**
   * 🧬 Sleep - Gracefully shut down the system
   */
  async sleep(): Promise<void> {
    this.state.consciousness = 'resting'

    // Stop auto-healing
    if (this.healingInterval) {
      clearInterval(this.healingInterval)
      this.healingInterval = null
    }

    // Stop organs
    heart.stopHeart()
    nervousSystem.deactivate()

    this.state.isAlive = false

    await this.logToSupabase('system_event', {
      event: 'sleep',
      timestamp: new Date().toISOString()
    })

    console.log('🧬 Bio-AI system is now sleeping')
  }

  /**
   * 🧬 Think - Use brain for AI decision making
   */
  async think(context: {
    pantryItems: string[]
    dietaryRestrictions: string[]
    familyPreferences: string[]
    mealHistory: string[]
    timeOfDay: string
    mood?: string
  }): Promise<ThoughtResult> {
    if (!this.config) throw new Error('Bio-AI not initialized')

    this.state.consciousness = 'processing'

    // Use lungs to breathe in the context (API call)
    const { data: enrichedContext } = await lungs.inhale(
      'think',
      async () => context
    )

    // Brain processes the thought
    const result = await brain.makeDecision(
      this.config.userId,
      enrichedContext || context
    )

    // Send signal through nervous system
    await nervousSystem.sendSignal({
      type: 'thought_complete',
      payload: result,
      priority: 'medium',
      source: 'brain',
      requiresResponse: false
    })

    this.state.consciousness = 'awake'
    this.state.vitals.brain.patternsRecognized++

    return result
  }

  /**
   * 🧬 Remember - Store information in brain memory
   */
  async remember(
    category: Memory['category'],
    content: Record<string, unknown>
  ): Promise<void> {
    if (!this.config) throw new Error('Bio-AI not initialized')

    await brain.formMemory(this.config.userId, category, content)
    this.state.vitals.brain.memoriesStored++

    // Release dopamine for successful memory formation
    nervousSystem.releaseNeurotransmitter('acetylcholine', 10)
  }

  /**
   * 🧬 Learn - Process feedback and adapt
   */
  async learn(feedback: {
    mealId: string
    rating: number
    feedback?: string
  }): Promise<void> {
    if (!this.config) throw new Error('Bio-AI not initialized')

    await brain.learn(this.config.userId, feedback)

    // Release dopamine for positive feedback
    if (feedback.rating >= 4) {
      nervousSystem.releaseNeurotransmitter('dopamine', 20)
    }
  }

  /**
   * 🧬 Digest - Process food data
   */
  async digest(foods: RawFoodData[]): Promise<DigestedFood[]> {
    if (!this.config) throw new Error('Bio-AI not initialized')

    // Ingest foods
    const { accepted, rejected } = digestive.ingest(foods)

    if (rejected.length > 0) {
      console.log(`🍽️ Rejected ${rejected.length} items (stomach full or invalid)`)
    }

    // Digest accepted foods
    const digested = await digestive.digest(accepted)

    // Update vitals
    this.state.vitals.digestive.stomachLoad = digestive.getStomachState().currentLoad

    // Absorb nutrients to Supabase
    const { absorbed } = await digestive.absorb(this.config.householdId, digested)
    this.nutrientsAbsorbed += absorbed
    this.state.vitals.digestive.nutrientsAbsorbed = this.nutrientsAbsorbed

    return digested
  }

  /**
   * 🧬 Compose Meal - Create balanced meal from ingredients
   */
  composeMeal(
    ingredients: DigestedFood[],
    dietaryRestrictions: string[] = []
  ): MealComposition {
    const composition = digestive.composeMeal(ingredients, dietaryRestrictions)

    // Send satisfaction signal
    if (composition.balanceScore > 70) {
      nervousSystem.releaseNeurotransmitter('serotonin', 15)
    }

    return composition
  }

  /**
   * 🧬 Cleanup - Remove waste/expired data
   */
  async cleanup(): Promise<{ eliminated: string[]; warnings: string[] }> {
    if (!this.config) throw new Error('Bio-AI not initialized')

    const result = await digestive.eliminate(this.config.householdId)

    // Send nervous signal for warnings
    if (result.warnings.length > 0) {
      await nervousSystem.sendSignal({
        type: 'expiry_warning',
        payload: result.warnings,
        priority: 'medium',
        source: 'digestive',
        requiresResponse: true
      })
    }

    return result
  }

  /**
   * 🧬 Subscribe to Events - Listen to body events via heart
   */
  onEvent(
    eventType: CirculationEvent['type'],
    callback: (event: CirculationEvent) => void
  ): () => void {
    return heart.subscribe(eventType, callback)
  }

  /**
   * 🧬 Send Signal - Transmit through nervous system
   */
  async signal(signal: Omit<NeuralSignal, 'source'>): Promise<void> {
    await nervousSystem.sendSignal({
      ...signal,
      source: 'user'
    })
  }

  /**
   * 🧬 API Call - Breathe in/out through lungs
   */
  async fetch<T>(
    endpoint: string,
    requestFn: () => Promise<T>
  ): Promise<T | null> {
    const result = await lungs.deepBreath(endpoint, requestFn)
    return result
  }

  /**
   * 🧬 Get Vitals - Complete body status
   */
  getVitals(): BodyState {
    this.updateVitals()
    return { ...this.state }
  }

  /**
   * 🧬 Health Check - Diagnose all organs
   */
  async checkHealth(): Promise<BodyState['health']> {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check each organ
    const lungDiagnosis = lungs.diagnose()
    issues.push(...lungDiagnosis.issues)
    recommendations.push(...lungDiagnosis.recommendations)

    const nervousDiagnosis = nervousSystem.diagnose()
    issues.push(...nervousDiagnosis.issues)
    recommendations.push(...nervousDiagnosis.recommendations)

    const heartVitals = heart.getVitals()
    if (!heartVitals.isAlive) {
      issues.push('Heart not beating')
      recommendations.push('Restart circulation system')
    }
    if (heartVitals.oxygenLevel < 50) {
      issues.push('Low oxygen in blood')
      recommendations.push('Check data channel connections')
    }

    // Calculate overall health
    const healthFactors = [
      lungDiagnosis.isHealthy ? 100 : 50,
      nervousDiagnosis.isHealthy ? 100 : 50,
      heartVitals.isAlive ? 100 : 0,
      heartVitals.oxygenLevel
    ]
    const overall = Math.round(
      healthFactors.reduce((a, b) => a + b, 0) / healthFactors.length
    )

    this.state.health = { overall, issues, recommendations }

    // Log health check to Supabase
    await this.logToSupabase('health_check', this.state.health)

    return this.state.health
  }

  /**
   * 🧬 Heal - Recovery and restoration
   */
  async heal(): Promise<void> {
    this.state.consciousness = 'recovering'

    // Rest the lungs
    lungs.rest()

    // Rest the nervous system
    await nervousSystem.rest(3000)

    // Restart heart if needed
    if (this.config && !heart.getVitals().isAlive) {
      await heart.defibrillate(this.config.householdId)
    }

    this.state.consciousness = 'awake'
    console.log('🧬 Bio-AI healed and recovered')
  }

  /**
   * 🧬 Save State to Supabase Storage
   */
  async saveState(): Promise<string | null> {
    if (!this.config) return null

    const stateData = JSON.stringify(this.getVitals(), null, 2)
    const fileName = `bio-ai-state-${this.config.userId}-${Date.now()}.json`

    const { error } = await supabase.storage
      .from('bio-ai-states')
      .upload(fileName, new Blob([stateData], { type: 'application/json' }), {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Failed to save bio-AI state:', error)
      return null
    }

    return fileName
  }

  /**
   * 🧬 Load State from Supabase Storage
   */
  async loadState(fileName: string): Promise<boolean> {
    const { data, error } = await supabase.storage
      .from('bio-ai-states')
      .download(fileName)

    if (error || !data) {
      console.error('Failed to load bio-AI state:', error)
      return false
    }

    try {
      const text = await data.text()
      const loadedState = JSON.parse(text) as BodyState
      this.state = loadedState
      return true
    } catch {
      console.error('Failed to parse bio-AI state')
      return false
    }
  }

  // Private methods
  private connectOrgans(): void {
    // Heart pumps to brain (blood carries oxygen/data)
    heart.subscribe('pantry_update', async (event) => {
      if (this.config) {
        await brain.formMemory(this.config.userId, 'pattern', {
          type: 'pantry_change',
          data: event.payload
        })
      }
    })

    // Nervous system coordinates responses
    nervousSystem.onSignal('error', async (signal) => {
      // Alert through heart (pump warning)
      heart.pump({
        type: 'grocery_update', // Use as alert channel
        payload: { error: signal.payload },
        timestamp: new Date().toISOString(),
        source: 'nervous_system'
      })
    })

    // Create synaptic connections
    nervousSystem.createSynapse('thought_complete', 'memory_store', 'excitatory')
    nervousSystem.createSynapse('meal_digested', 'satisfaction', 'excitatory')
    nervousSystem.createSynapse('error', 'alert', 'excitatory')
  }

  private startAutoHealing(interval: number): void {
    this.healingInterval = setInterval(async () => {
      const health = await this.checkHealth()
      if (health.overall < 70) {
        console.log('🧬 Auto-healing triggered due to low health')
        await this.heal()
      }
    }, interval)
  }

  private updateVitals(): void {
    this.state.vitals.heart = heart.getVitals()
    this.state.vitals.lungs = lungs.getCapacity()
    this.state.vitals.digestive.stomachLoad = digestive.getStomachState().currentLoad
    this.state.vitals.nervous = nervousSystem.getState()
  }

  private async logToSupabase(
    eventType: string,
    data: Record<string, unknown>
  ): Promise<void> {
    if (!this.config) return

    const supabaseAny = supabase as { from: (table: string) => ReturnType<typeof supabase.from> }

    await supabaseAny.from('bio_ai_logs').insert({
      user_id: this.config.userId,
      household_id: this.config.householdId,
      event_type: eventType,
      data,
      created_at: new Date().toISOString()
    })
  }
}

// Export singleton instance
export const bioAI = new BioAI()

// Export all organ modules
export { brain } from './brain'
export { heart } from './heart'
export { lungs } from './lungs'
export { digestive } from './digestive'
export { nervousSystem } from './nervous-system'

// Export storage helpers
export * as bioAIStorage from './storage'

// Export types
export type { Memory, ThoughtResult } from './brain'
export type { HeartbeatStatus, CirculationEvent, BloodVessel } from './heart'
export type { LungCapacity, BreathCycle, AirFilter } from './lungs'
export type { RawFoodData, DigestedFood, MealComposition, NutritionInfo } from './digestive'
export type { NeuralSignal, Neuron, Synapse, ReflexArc, NervousSystemState } from './nervous-system'

export default bioAI
