/**
 * 🧬 NERVOUS SYSTEM MODULE - Event Coordination & Communication
 *
 * Just like the human nervous system, this module:
 * - Central Nervous System: Coordinates all organ responses
 * - Peripheral Nervous System: Detects and transmits signals
 * - Autonomic System: Handles automatic processes
 * - Reflexes: Quick responses without brain involvement
 * - Neurotransmitters: Messages between components
 */

// Neuron (event carrier)
export interface Neuron {
  id: string
  type: 'sensory' | 'motor' | 'interneuron'
  signal: NeuralSignal
  pathway: string[]
  strength: number
  timestamp: string
}

// Neural signal (event data)
export interface NeuralSignal {
  type: string
  payload: unknown
  priority: 'low' | 'medium' | 'high' | 'critical'
  source: string
  requiresResponse: boolean
}

// Synapse (connection between handlers)
export interface Synapse {
  id: string
  preNeuron: string
  postNeuron: string
  strength: number // 0-1, affects signal transmission
  type: 'excitatory' | 'inhibitory'
}

// Reflex arc (automatic response)
export interface ReflexArc {
  trigger: string
  condition: (signal: NeuralSignal) => boolean
  response: (signal: NeuralSignal) => Promise<void>
  cooldown: number // ms between triggers
  lastTriggered?: number
}

// Nervous system state
export interface NervousSystemState {
  isActive: boolean
  signalsProcessed: number
  activeReflexes: number
  synapticHealth: number // 0-100
  neurotransmitterLevels: Record<string, number>
}

type SignalHandler = (signal: NeuralSignal, neuron: Neuron) => Promise<void>

class NervousSystemModule {
  private state: NervousSystemState = {
    isActive: false,
    signalsProcessed: 0,
    activeReflexes: 0,
    synapticHealth: 100,
    neurotransmitterLevels: {
      dopamine: 100, // Reward/motivation
      serotonin: 100, // Mood/satisfaction
      norepinephrine: 100, // Alert/attention
      acetylcholine: 100 // Learning/memory
    }
  }

  private handlers: Map<string, SignalHandler[]> = new Map()
  private reflexes: Map<string, ReflexArc> = new Map()
  private synapses: Map<string, Synapse> = new Map()
  private signalQueue: Neuron[] = []
  private processing = false

  constructor() {
    // Register default reflexes
    this.registerReflex({
      trigger: 'error',
      condition: (signal) => signal.priority === 'critical',
      response: async (signal) => {
        console.error('🧬 CRITICAL ERROR REFLEX:', signal.payload)
        // Automatic error logging
        await this.sendSignal({
          type: 'error_logged',
          payload: signal.payload,
          priority: 'high',
          source: 'reflex_arc',
          requiresResponse: false
        })
      },
      cooldown: 1000
    })

    this.registerReflex({
      trigger: 'low_resources',
      condition: (signal) => {
        const payload = signal.payload as { level?: number }
        return (payload?.level || 100) < 20
      },
      response: async () => {
        console.warn('🧬 LOW RESOURCES REFLEX: Triggering cleanup')
        await this.sendSignal({
          type: 'cleanup_requested',
          payload: { reason: 'low_resources' },
          priority: 'high',
          source: 'reflex_arc',
          requiresResponse: false
        })
      },
      cooldown: 30000
    })
  }

  /**
   * 🧬 Activate Nervous System
   */
  activate(): void {
    this.state.isActive = true
    this.processSignalQueue()
    console.log('🧬 Nervous system activated')
  }

  /**
   * 🧬 Deactivate Nervous System
   */
  deactivate(): void {
    this.state.isActive = false
    console.log('🧬 Nervous system deactivated')
  }

  /**
   * 🧬 Send Signal - Transmit neural signal through the system
   */
  async sendSignal(signal: NeuralSignal): Promise<Neuron> {
    const neuron: Neuron = {
      id: `neuron_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.determineNeuronType(signal),
      signal,
      pathway: [signal.source],
      strength: this.calculateSignalStrength(signal),
      timestamp: new Date().toISOString()
    }

    // Check for reflexes first (fastest response)
    const reflexTriggered = await this.checkReflexes(signal)
    if (reflexTriggered && !signal.requiresResponse) {
      return neuron
    }

    // Add to queue for processing
    this.signalQueue.push(neuron)
    this.state.signalsProcessed++

    // Process if not already processing
    if (!this.processing) {
      await this.processSignalQueue()
    }

    return neuron
  }

  /**
   * 🧬 Register Handler - Subscribe to signal types
   */
  onSignal(signalType: string, handler: SignalHandler): () => void {
    if (!this.handlers.has(signalType)) {
      this.handlers.set(signalType, [])
    }
    this.handlers.get(signalType)!.push(handler)

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(signalType)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) handlers.splice(index, 1)
      }
    }
  }

  /**
   * 🧬 Register Reflex - Automatic response without conscious processing
   */
  registerReflex(reflex: ReflexArc): void {
    this.reflexes.set(reflex.trigger, reflex)
    this.state.activeReflexes = this.reflexes.size
  }

  /**
   * 🧬 Create Synapse - Connect two signal pathways
   */
  createSynapse(
    preNeuron: string,
    postNeuron: string,
    type: Synapse['type'] = 'excitatory'
  ): Synapse {
    const synapse: Synapse = {
      id: `synapse_${preNeuron}_${postNeuron}`,
      preNeuron,
      postNeuron,
      strength: 0.5,
      type
    }

    this.synapses.set(synapse.id, synapse)
    return synapse
  }

  /**
   * 🧬 Strengthen Synapse - Learning through repetition
   */
  strengthenSynapse(synapseId: string, amount = 0.1): void {
    const synapse = this.synapses.get(synapseId)
    if (synapse) {
      synapse.strength = Math.min(1, synapse.strength + amount)
      // Increase acetylcholine (learning)
      this.adjustNeurotransmitter('acetylcholine', 5)
    }
  }

  /**
   * 🧬 Release Neurotransmitter - Trigger emotional/state changes
   */
  releaseNeurotransmitter(
    type: 'dopamine' | 'serotonin' | 'norepinephrine' | 'acetylcholine',
    amount: number
  ): void {
    this.adjustNeurotransmitter(type, amount)

    // Trigger associated behaviors
    switch (type) {
      case 'dopamine':
        this.sendSignal({
          type: 'reward_signal',
          payload: { level: amount },
          priority: 'low',
          source: 'neurotransmitter',
          requiresResponse: false
        })
        break
      case 'norepinephrine':
        if (amount > 20) {
          this.sendSignal({
            type: 'alert_mode',
            payload: { intensity: amount },
            priority: 'high',
            source: 'neurotransmitter',
            requiresResponse: false
          })
        }
        break
    }
  }

  /**
   * 🧬 Get State
   */
  getState(): NervousSystemState {
    return { ...this.state }
  }

  /**
   * 🧬 Health Check
   */
  diagnose(): {
    isHealthy: boolean
    issues: string[]
    recommendations: string[]
  } {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check neurotransmitter levels
    Object.entries(this.state.neurotransmitterLevels).forEach(([name, level]) => {
      if (level < 30) {
        issues.push(`Low ${name} levels`)
        recommendations.push(`Rest and recover to restore ${name}`)
      }
    })

    // Check synaptic health
    if (this.state.synapticHealth < 50) {
      issues.push('Poor synaptic health')
      recommendations.push('Reduce signal load and allow recovery')
    }

    // Check signal queue
    if (this.signalQueue.length > 100) {
      issues.push('Signal queue overload')
      recommendations.push('Process pending signals or reduce input')
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations
    }
  }

  /**
   * 🧬 Rest - Recovery mode
   */
  async rest(duration = 5000): Promise<void> {
    console.log('🧬 Nervous system entering rest mode...')

    // Gradually restore neurotransmitters
    const restInterval = setInterval(() => {
      Object.keys(this.state.neurotransmitterLevels).forEach(key => {
        this.adjustNeurotransmitter(
          key as keyof typeof this.state.neurotransmitterLevels,
          5
        )
      })
      this.state.synapticHealth = Math.min(100, this.state.synapticHealth + 5)
    }, 1000)

    await new Promise(resolve => setTimeout(resolve, duration))
    clearInterval(restInterval)

    console.log('🧬 Nervous system recovered')
  }

  // Private methods
  private async processSignalQueue(): Promise<void> {
    if (this.processing || !this.state.isActive) return

    this.processing = true

    while (this.signalQueue.length > 0) {
      const neuron = this.signalQueue.shift()!

      // Process based on priority
      if (neuron.signal.priority === 'critical') {
        await this.processNeuron(neuron)
      } else {
        // Batch non-critical signals
        setTimeout(() => this.processNeuron(neuron), 0)
      }

      // Slight degradation with each signal
      this.state.synapticHealth = Math.max(0, this.state.synapticHealth - 0.1)
    }

    this.processing = false
  }

  private async processNeuron(neuron: Neuron): Promise<void> {
    const handlers = this.handlers.get(neuron.signal.type)
    if (!handlers || handlers.length === 0) return

    // Apply synaptic connections
    const relatedSynapses = Array.from(this.synapses.values()).filter(
      s => s.preNeuron === neuron.signal.type
    )

    for (const synapse of relatedSynapses) {
      if (synapse.type === 'excitatory' && synapse.strength > 0.3) {
        // Forward signal to connected pathway
        neuron.pathway.push(synapse.postNeuron)
        neuron.strength *= synapse.strength
      }
    }

    // Call all handlers
    for (const handler of handlers) {
      try {
        await handler(neuron.signal, neuron)
      } catch (error) {
        console.error('🧬 Signal handler error:', error)
        this.adjustNeurotransmitter('norepinephrine', 10) // Stress response
      }
    }
  }

  private async checkReflexes(signal: NeuralSignal): Promise<boolean> {
    const reflexEntries = Array.from(this.reflexes.entries())
    for (const [, reflex] of reflexEntries) {
      if (reflex.condition(signal)) {
        // Check cooldown
        const now = Date.now()
        if (reflex.lastTriggered && now - reflex.lastTriggered < reflex.cooldown) {
          continue
        }

        reflex.lastTriggered = now
        await reflex.response(signal)
        return true
      }
    }
    return false
  }

  private determineNeuronType(signal: NeuralSignal): Neuron['type'] {
    if (signal.source === 'user' || signal.source === 'external') {
      return 'sensory' // Input from outside
    }
    if (signal.requiresResponse) {
      return 'motor' // Requires action
    }
    return 'interneuron' // Internal processing
  }

  private calculateSignalStrength(signal: NeuralSignal): number {
    const priorityStrength: Record<NeuralSignal['priority'], number> = {
      low: 0.25,
      medium: 0.5,
      high: 0.75,
      critical: 1.0
    }
    return priorityStrength[signal.priority]
  }

  private adjustNeurotransmitter(
    type: string,
    amount: number
  ): void {
    const current = this.state.neurotransmitterLevels[type] || 100
    this.state.neurotransmitterLevels[type] = Math.max(0, Math.min(100, current + amount))
  }
}

export const nervousSystem = new NervousSystemModule()
export default nervousSystem
