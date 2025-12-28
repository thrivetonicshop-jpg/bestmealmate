/**
 * ❤️ HEART MODULE - Real-time Data Circulation
 *
 * Just like the human heart, this module:
 * - Pumps data throughout the system (real-time subscriptions)
 * - Maintains constant rhythm (heartbeat monitoring)
 * - Circulates nutrients (fresh data) to all organs
 * - Responds to system stress (load balancing)
 */

import { supabase } from '../supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

// Heartbeat status
export interface HeartbeatStatus {
  isAlive: boolean
  bpm: number // beats per minute (data pulses)
  lastBeat: string
  bloodPressure: {
    systolic: number // outgoing data rate
    diastolic: number // incoming data rate
  }
  oxygenLevel: number // data freshness 0-100
}

// Blood vessel (data channel)
export interface BloodVessel {
  id: string
  type: 'artery' | 'vein' // artery = outgoing, vein = incoming
  channel: RealtimeChannel
  destination: string
  isOpen: boolean
  flowRate: number
}

// Circulation event
export interface CirculationEvent {
  type: 'pantry_update' | 'family_change' | 'meal_plan' | 'grocery_update'
  payload: unknown
  timestamp: string
  source: string
}

type CirculationCallback = (event: CirculationEvent) => void

class HeartModule {
  private channels: Map<string, BloodVessel> = new Map()
  private heartbeatInterval: NodeJS.Timeout | null = null
  private status: HeartbeatStatus = {
    isAlive: false,
    bpm: 0,
    lastBeat: new Date().toISOString(),
    bloodPressure: { systolic: 0, diastolic: 0 },
    oxygenLevel: 100
  }
  private listeners: Map<string, CirculationCallback[]> = new Map()
  private beatCount = 0

  /**
   * ❤️ Start the Heart
   * Begin pumping data through the system
   */
  startHeart(householdId: string): void {
    if (this.status.isAlive) return

    this.status.isAlive = true
    this.status.lastBeat = new Date().toISOString()

    // Start heartbeat monitoring
    this.heartbeatInterval = setInterval(() => {
      this.beat()
    }, 1000) // Beat every second

    // Open main arteries (outgoing data channels)
    this.openArtery('pantry', householdId)
    this.openArtery('family', householdId)
    this.openArtery('meals', householdId)
    this.openArtery('groceries', householdId)

    console.log('❤️ Heart started - circulating data')
  }

  /**
   * ❤️ Stop the Heart
   * Gracefully shut down circulation
   */
  stopHeart(): void {
    if (!this.status.isAlive) return

    // Clear heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    // Close all vessels
    this.channels.forEach((vessel) => {
      vessel.channel.unsubscribe()
      vessel.isOpen = false
    })
    this.channels.clear()

    this.status.isAlive = false
    this.status.bpm = 0
    console.log('❤️ Heart stopped')
  }

  /**
   * ❤️ Get Heart Status
   * Check vital signs
   */
  getVitals(): HeartbeatStatus {
    return { ...this.status }
  }

  /**
   * ❤️ Subscribe to Circulation
   * Listen for data flowing through specific channels
   */
  subscribe(
    eventType: CirculationEvent['type'],
    callback: CirculationCallback
  ): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) callbacks.splice(index, 1)
      }
    }
  }

  /**
   * ❤️ Pump Data
   * Actively push data through the circulation system
   */
  pump(event: CirculationEvent): void {
    // Update blood pressure (data flow rate)
    this.status.bloodPressure.systolic++

    // Notify all listeners for this event type
    const callbacks = this.listeners.get(event.type)
    if (callbacks) {
      callbacks.forEach(cb => cb(event))
    }

    // Decay systolic over time
    setTimeout(() => {
      this.status.bloodPressure.systolic = Math.max(0, this.status.bloodPressure.systolic - 1)
    }, 5000)
  }

  /**
   * ❤️ Open Artery (Outgoing Data Channel)
   * Create a real-time subscription for data flow
   */
  private openArtery(type: string, householdId: string): void {
    const tableName = this.getTableName(type)

    const channel = supabase
      .channel(`${type}_${householdId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: `household_id=eq.${householdId}`
        },
        (payload) => {
          this.receiveBlood(type, payload)
        }
      )
      .subscribe()

    const vessel: BloodVessel = {
      id: `artery_${type}`,
      type: 'artery',
      channel,
      destination: tableName,
      isOpen: true,
      flowRate: 0
    }

    this.channels.set(vessel.id, vessel)
  }

  /**
   * ❤️ Receive Blood (Incoming Data)
   * Process data coming in through veins
   */
  private receiveBlood(type: string, payload: unknown): void {
    // Update blood pressure (incoming)
    this.status.bloodPressure.diastolic++

    // Map to circulation event type
    const eventTypeMap: Record<string, CirculationEvent['type']> = {
      pantry: 'pantry_update',
      family: 'family_change',
      meals: 'meal_plan',
      groceries: 'grocery_update'
    }

    const event: CirculationEvent = {
      type: eventTypeMap[type] || 'pantry_update',
      payload,
      timestamp: new Date().toISOString(),
      source: type
    }

    this.pump(event)

    // Decay diastolic over time
    setTimeout(() => {
      this.status.bloodPressure.diastolic = Math.max(0, this.status.bloodPressure.diastolic - 1)
    }, 5000)
  }

  /**
   * ❤️ Heartbeat
   * Regular pulse that monitors system health
   */
  private beat(): void {
    this.beatCount++
    this.status.lastBeat = new Date().toISOString()

    // Calculate BPM based on last minute
    if (this.beatCount >= 60) {
      this.status.bpm = this.beatCount
      this.beatCount = 0
    }

    // Check oxygen level (data freshness)
    this.checkOxygenLevel()
  }

  /**
   * ❤️ Check Oxygen Level
   * Monitor data freshness across the system
   */
  private checkOxygenLevel(): void {
    const openChannels = Array.from(this.channels.values()).filter(v => v.isOpen)
    const totalChannels = this.channels.size

    if (totalChannels === 0) {
      this.status.oxygenLevel = 0
    } else {
      this.status.oxygenLevel = (openChannels.length / totalChannels) * 100
    }

    // Alert if oxygen drops critically
    if (this.status.oxygenLevel < 50) {
      console.warn('❤️ WARNING: Low oxygen level - data circulation impaired')
    }
  }

  /**
   * Helper to get table name from type
   */
  private getTableName(type: string): string {
    const tableMap: Record<string, string> = {
      pantry: 'pantry_items',
      family: 'family_members',
      meals: 'meal_plans',
      groceries: 'grocery_lists'
    }
    return tableMap[type] || type
  }

  /**
   * ❤️ Defibrillate
   * Emergency restart of the heart system
   */
  async defibrillate(householdId: string): Promise<boolean> {
    console.log('❤️ DEFIBRILLATING...')

    // Stop heart
    this.stopHeart()

    // Wait for system to clear
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Restart
    this.startHeart(householdId)

    return this.status.isAlive
  }
}

export const heart = new HeartModule()
export default heart
