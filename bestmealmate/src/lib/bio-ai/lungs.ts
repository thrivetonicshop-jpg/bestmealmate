/**
 * 🫁 LUNGS MODULE - API Respiration
 *
 * Just like human lungs, this module:
 * - Inhales fresh data (API requests)
 * - Exhales processed results (API responses)
 * - Filters toxins (validates/sanitizes data)
 * - Regulates breathing rate (rate limiting)
 * - Provides oxygen to the blood (enriches data)
 */

// Breath cycle (request/response)
export interface BreathCycle {
  id: string
  type: 'inhale' | 'exhale'
  endpoint: string
  data: unknown
  timestamp: string
  duration: number
  success: boolean
}

// Lung capacity status
export interface LungCapacity {
  currentBreaths: number
  maxBreaths: number // rate limit
  oxygenQuality: number // data quality 0-100
  breathingRate: number // requests per minute
  isHealthy: boolean
}

// Air filter (data validation)
export interface AirFilter {
  name: string
  validate: (data: unknown) => boolean
  sanitize: (data: unknown) => unknown
}

class LungsModule {
  private breathHistory: BreathCycle[] = []
  private readonly MAX_HISTORY = 100
  private breathCount = 0
  private lastMinuteStart = Date.now()
  private filters: Map<string, AirFilter> = new Map()

  private capacity: LungCapacity = {
    currentBreaths: 0,
    maxBreaths: 60, // 60 requests per minute
    oxygenQuality: 100,
    breathingRate: 0,
    isHealthy: true
  }

  constructor() {
    // Initialize default filters
    this.addFilter({
      name: 'xss',
      validate: (data) => {
        if (typeof data === 'string') {
          return !/<script/i.test(data)
        }
        return true
      },
      sanitize: (data) => {
        if (typeof data === 'string') {
          return data.replace(/<script.*?>.*?<\/script>/gi, '')
        }
        return data
      }
    })

    this.addFilter({
      name: 'sql',
      validate: (data) => {
        if (typeof data === 'string') {
          const sqlPatterns = /(\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b.*\bSET\b)/i
          return !sqlPatterns.test(data)
        }
        return true
      },
      sanitize: (data) => data // Don't modify, just validate
    })
  }

  /**
   * 🫁 Inhale - Process incoming API request
   * Validates and prepares data for the system
   */
  async inhale<T>(
    endpoint: string,
    requestFn: () => Promise<T>
  ): Promise<{ data: T | null; error: string | null; cycle: BreathCycle }> {
    const startTime = Date.now()
    const cycleId = `breath_${startTime}`

    // Check if we can breathe (rate limiting)
    if (!this.canBreathe()) {
      const cycle: BreathCycle = {
        id: cycleId,
        type: 'inhale',
        endpoint,
        data: null,
        timestamp: new Date().toISOString(),
        duration: 0,
        success: false
      }

      return {
        data: null,
        error: 'Rate limit exceeded - lungs need rest',
        cycle
      }
    }

    try {
      // Take the breath (make the request)
      this.breathCount++
      this.capacity.currentBreaths++

      const data = await requestFn()

      const cycle: BreathCycle = {
        id: cycleId,
        type: 'inhale',
        endpoint,
        data,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        success: true
      }

      this.recordBreath(cycle)

      // Filter the air (validate response)
      const filteredData = this.filterAir(data)

      return { data: filteredData as T, error: null, cycle }
    } catch (error) {
      const cycle: BreathCycle = {
        id: cycleId,
        type: 'inhale',
        endpoint,
        data: null,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        success: false
      }

      this.recordBreath(cycle)
      this.capacity.oxygenQuality = Math.max(0, this.capacity.oxygenQuality - 5)

      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown breathing difficulty',
        cycle
      }
    }
  }

  /**
   * 🫁 Exhale - Send processed data out
   * Prepares and sends response data
   */
  async exhale<T, R>(
    endpoint: string,
    data: T,
    sendFn: (data: T) => Promise<R>
  ): Promise<{ result: R | null; error: string | null; cycle: BreathCycle }> {
    const startTime = Date.now()
    const cycleId = `breath_${startTime}`

    // Filter before exhaling
    const cleanData = this.filterAir(data)

    try {
      const result = await sendFn(cleanData as T)

      const cycle: BreathCycle = {
        id: cycleId,
        type: 'exhale',
        endpoint,
        data: cleanData,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        success: true
      }

      this.recordBreath(cycle)

      return { result, error: null, cycle }
    } catch (error) {
      const cycle: BreathCycle = {
        id: cycleId,
        type: 'exhale',
        endpoint,
        data: cleanData,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        success: false
      }

      this.recordBreath(cycle)

      return {
        result: null,
        error: error instanceof Error ? error.message : 'Exhale failed',
        cycle
      }
    }
  }

  /**
   * 🫁 Deep Breath - High-priority request with extra processing
   */
  async deepBreath<T>(
    endpoint: string,
    requestFn: () => Promise<T>,
    retries = 3
  ): Promise<T | null> {
    for (let attempt = 0; attempt < retries; attempt++) {
      const { data, error } = await this.inhale(endpoint, requestFn)

      if (data !== null) {
        return data
      }

      // Rest between attempts
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
      console.log(`🫁 Breath attempt ${attempt + 1} failed: ${error}. Retrying...`)
    }

    console.error('🫁 Deep breath failed after all retries')
    return null
  }

  /**
   * 🫁 Add Air Filter
   * Register a new data validation/sanitization filter
   */
  addFilter(filter: AirFilter): void {
    this.filters.set(filter.name, filter)
  }

  /**
   * 🫁 Get Lung Capacity
   * Check breathing status
   */
  getCapacity(): LungCapacity {
    this.updateBreathingRate()
    return { ...this.capacity }
  }

  /**
   * 🫁 Get Breathing History
   * Review past breath cycles
   */
  getHistory(limit = 10): BreathCycle[] {
    return this.breathHistory.slice(-limit)
  }

  /**
   * 🫁 Check Health
   * Diagnose lung health
   */
  diagnose(): {
    isHealthy: boolean
    issues: string[]
    recommendations: string[]
  } {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check rate limiting
    if (this.capacity.currentBreaths > this.capacity.maxBreaths * 0.8) {
      issues.push('Approaching rate limit')
      recommendations.push('Reduce request frequency')
    }

    // Check oxygen quality
    if (this.capacity.oxygenQuality < 80) {
      issues.push('Low oxygen quality - many failed requests')
      recommendations.push('Check API endpoints and network connectivity')
    }

    // Check recent failures
    const recentBreaths = this.breathHistory.slice(-10)
    const failures = recentBreaths.filter(b => !b.success).length
    if (failures > 3) {
      issues.push('High failure rate in recent breaths')
      recommendations.push('Investigate failing endpoints')
    }

    const isHealthy = issues.length === 0
    this.capacity.isHealthy = isHealthy

    return { isHealthy, issues, recommendations }
  }

  /**
   * 🫁 Rest - Reset breathing state
   */
  rest(): void {
    this.capacity.currentBreaths = 0
    this.capacity.oxygenQuality = Math.min(100, this.capacity.oxygenQuality + 20)
    console.log('🫁 Lungs rested and recovered')
  }

  // Private methods
  private canBreathe(): boolean {
    this.updateBreathingRate()

    // Reset counter every minute
    const now = Date.now()
    if (now - this.lastMinuteStart > 60000) {
      this.lastMinuteStart = now
      this.capacity.currentBreaths = 0
    }

    return this.capacity.currentBreaths < this.capacity.maxBreaths
  }

  private recordBreath(cycle: BreathCycle): void {
    this.breathHistory.push(cycle)

    // Trim history
    if (this.breathHistory.length > this.MAX_HISTORY) {
      this.breathHistory = this.breathHistory.slice(-this.MAX_HISTORY)
    }

    // Update oxygen quality based on success rate
    if (cycle.success) {
      this.capacity.oxygenQuality = Math.min(100, this.capacity.oxygenQuality + 1)
    } else {
      this.capacity.oxygenQuality = Math.max(0, this.capacity.oxygenQuality - 5)
    }
  }

  private updateBreathingRate(): void {
    const oneMinuteAgo = Date.now() - 60000
    const recentBreaths = this.breathHistory.filter(
      b => new Date(b.timestamp).getTime() > oneMinuteAgo
    )
    this.capacity.breathingRate = recentBreaths.length
  }

  private filterAir<T>(data: T): T {
    let filtered = data

    this.filters.forEach((filter) => {
      if (!filter.validate(filtered)) {
        console.warn(`🫁 Air filter "${filter.name}" detected contaminant`)
        filtered = filter.sanitize(filtered) as T
      }
    })

    return filtered
  }
}

export const lungs = new LungsModule()
export default lungs
