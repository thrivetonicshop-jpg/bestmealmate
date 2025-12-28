/**
 * 🗄️ BIO-AI SUPABASE STORAGE
 *
 * Storage helpers for persisting bio-AI data to Supabase:
 * - Memory storage and retrieval
 * - Neural signal logging
 * - Synaptic connections
 * - Health metrics
 * - State snapshots
 */

import { supabase } from '../supabase'
import type { Memory } from './brain'
import type { NeuralSignal, Neuron } from './nervous-system'
import type { NutritionInfo } from './digestive'

// Type helper for tables and functions not in auto-generated types
const supabaseUntyped = supabase as unknown as {
  from: (table: string) => ReturnType<typeof supabase.from>
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: Error | null }>
}
const supabaseAny = supabaseUntyped

// ============================================
// 🧠 BRAIN STORAGE (Memories)
// ============================================

export async function storeMemory(
  userId: string,
  householdId: string,
  memory: Omit<Memory, 'id'>
): Promise<string | null> {
  const { data, error } = await supabaseAny.from('ai_memories').insert({
    user_id: userId,
    household_id: householdId,
    type: memory.type,
    category: memory.category,
    content: memory.content,
    strength: memory.strength,
    last_accessed: memory.last_accessed,
    created_at: memory.created_at
  }).select('id').single()

  if (error) {
    console.error('Failed to store memory:', error)
    return null
  }

  return data?.id || null
}

export async function getMemories(
  userId: string,
  category?: string,
  limit = 20
): Promise<Memory[]> {
  let query = supabaseAny
    .from('ai_memories')
    .select('*')
    .eq('user_id', userId)
    .order('strength', { ascending: false })
    .limit(limit)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to get memories:', error)
    return []
  }

  return (data || []) as Memory[]
}

export async function strengthenMemory(memoryId: string, boost = 0.1): Promise<boolean> {
  const { error } = await supabaseAny.rpc('strengthen_memory', {
    memory_id: memoryId,
    boost
  })

  return !error
}

export async function getStrongestMemories(
  userId: string,
  category?: string,
  limit = 10
): Promise<Memory[]> {
  const { data, error } = await supabaseAny.rpc('get_strongest_memories', {
    p_user_id: userId,
    p_category: category || null,
    p_limit: limit
  })

  if (error) {
    console.error('Failed to get strongest memories:', error)
    return []
  }

  return (data || []) as Memory[]
}

// ============================================
// 🧬 NERVOUS SYSTEM STORAGE (Signals)
// ============================================

export async function logNeuralSignal(
  userId: string,
  householdId: string,
  signal: NeuralSignal,
  neuron: Neuron
): Promise<string | null> {
  const { data, error } = await supabaseAny.from('neural_signals').insert({
    user_id: userId,
    household_id: householdId,
    signal_type: signal.type,
    priority: signal.priority,
    source: signal.source,
    payload: signal.payload,
    neuron_type: neuron.type,
    pathway: neuron.pathway,
    strength: neuron.strength
  }).select('id').single()

  if (error) {
    console.error('Failed to log neural signal:', error)
    return null
  }

  return data?.id || null
}

export async function markSignalProcessed(
  signalId: string,
  response?: Record<string, unknown>
): Promise<boolean> {
  const { error } = await supabaseAny
    .from('neural_signals')
    .update({
      was_processed: true,
      response,
      processed_at: new Date().toISOString()
    })
    .eq('id', signalId)

  return !error
}

export async function getRecentSignals(
  userId: string,
  hours = 24
): Promise<Array<{ signal_type: string; priority: string; source: string; created_at: string }>> {
  const since = new Date()
  since.setHours(since.getHours() - hours)

  const { data, error } = await supabaseAny
    .from('neural_signals')
    .select('signal_type, priority, source, created_at')
    .eq('user_id', userId)
    .gt('created_at', since.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to get recent signals:', error)
    return []
  }

  return data || []
}

// ============================================
// 🧬 SYNAPTIC CONNECTIONS (Learning)
// ============================================

export async function strengthenSynapse(
  userId: string,
  preConcept: string,
  postConcept: string,
  boost = 0.05
): Promise<boolean> {
  const { error } = await supabaseAny.rpc('strengthen_synapse', {
    p_user_id: userId,
    p_pre_concept: preConcept,
    p_post_concept: postConcept,
    p_boost: boost
  })

  return !error
}

export async function getRelatedConcepts(
  userId: string,
  concept: string,
  minStrength = 0.3
): Promise<Array<{ related_concept: string; connection_strength: number; times_used: number }>> {
  const { data, error } = await supabaseAny.rpc('get_related_concepts', {
    p_user_id: userId,
    p_concept: concept,
    p_min_strength: minStrength
  })

  if (error) {
    console.error('Failed to get related concepts:', error)
    return []
  }

  return (data || []) as Array<{ related_concept: string; connection_strength: number; times_used: number }>
}

// ============================================
// 🍽️ DIGESTIVE STORAGE (Nutrition)
// ============================================

export async function logNutrition(
  householdId: string,
  userId: string,
  foodName: string,
  nutrients: NutritionInfo,
  freshness: number,
  category?: string,
  quantity?: number,
  unit?: string
): Promise<string | null> {
  const { data, error } = await supabaseAny.from('nutrition_logs').insert({
    household_id: householdId,
    user_id: userId,
    food_name: foodName,
    category,
    quantity,
    unit,
    nutrients,
    freshness,
    logged_at: new Date().toISOString()
  }).select('id').single()

  if (error) {
    console.error('Failed to log nutrition:', error)
    return null
  }

  return data?.id || null
}

export async function getDailyNutrition(
  householdId: string,
  date?: Date
): Promise<{
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  total_fiber: number
  food_count: number
  avg_freshness: number
} | null> {
  const targetDate = date || new Date()
  const dateStr = targetDate.toISOString().split('T')[0]

  const { data, error } = await supabaseAny.rpc('calculate_daily_nutrition', {
    p_household_id: householdId,
    p_date: dateStr
  })

  if (error) {
    console.error('Failed to get daily nutrition:', error)
    return null
  }

  const result = data as Array<{
    total_calories: number
    total_protein: number
    total_carbs: number
    total_fat: number
    total_fiber: number
    food_count: number
    avg_freshness: number
  }> | null
  return result?.[0] || null
}

export async function logFoodWaste(
  householdId: string,
  itemName: string,
  reason: 'expired' | 'spoiled' | 'too_much' | 'didnt_like' | 'other',
  quantity?: number,
  unit?: string,
  estimatedCost?: number
): Promise<string | null> {
  const { data, error } = await supabaseAny.from('food_waste_log').insert({
    household_id: householdId,
    item_name: itemName,
    quantity,
    unit,
    reason,
    estimated_cost: estimatedCost,
    eliminated_at: new Date().toISOString()
  }).select('id').single()

  if (error) {
    console.error('Failed to log food waste:', error)
    return null
  }

  return data?.id || null
}

export async function getWasteInsights(
  householdId: string,
  days = 30
): Promise<Array<{
  item_name: string
  waste_count: number
  total_wasted: number
  common_reason: string
  estimated_loss: number
}>> {
  const { data, error } = await supabaseAny.rpc('get_waste_insights', {
    p_household_id: householdId,
    p_days: days
  })

  if (error) {
    console.error('Failed to get waste insights:', error)
    return []
  }

  return (data || []) as Array<{
    item_name: string
    waste_count: number
    total_wasted: number
    common_reason: string
    estimated_loss: number
  }>
}

// ============================================
// ❤️ CIRCULATION STORAGE (Events)
// ============================================

export async function logCirculationEvent(
  householdId: string,
  eventType: 'pantry_update' | 'family_change' | 'meal_plan' | 'grocery_update',
  source: string,
  payload: unknown
): Promise<string | null> {
  const { data, error } = await supabaseAny.from('circulation_events').insert({
    household_id: householdId,
    event_type: eventType,
    source,
    payload
  }).select('id').single()

  if (error) {
    console.error('Failed to log circulation event:', error)
    return null
  }

  return data?.id || null
}

// ============================================
// 🫁 API BREATH STORAGE (Logging)
// ============================================

export async function logApiBreath(
  userId: string,
  breathType: 'inhale' | 'exhale',
  endpoint: string,
  durationMs: number,
  success: boolean,
  errorMessage?: string
): Promise<void> {
  await supabaseAny.from('api_breath_logs').insert({
    user_id: userId,
    breath_type: breathType,
    endpoint,
    duration_ms: durationMs,
    success,
    error_message: errorMessage
  })
}

// ============================================
// 🧬 BIO-AI SYSTEM LOGS
// ============================================

export async function logBioAIEvent(
  userId: string,
  householdId: string,
  eventType: string,
  data: Record<string, unknown>
): Promise<string | null> {
  const { data: result, error } = await supabaseAny.from('bio_ai_logs').insert({
    user_id: userId,
    household_id: householdId,
    event_type: eventType,
    data
  }).select('id').single()

  if (error) {
    console.error('Failed to log bio-AI event:', error)
    return null
  }

  return result?.id || null
}

export async function logBioAIHealth(
  userId: string,
  householdId: string,
  healthData: Record<string, unknown>
): Promise<string | null> {
  const { data, error } = await supabaseAny.rpc('log_bio_ai_health', {
    p_user_id: userId,
    p_household_id: householdId,
    p_health_data: healthData
  })

  if (error) {
    console.error('Failed to log bio-AI health:', error)
    return null
  }

  return data as string | null
}

export async function getBioAIStats(userId: string): Promise<{
  total_memories: number
  strong_memories: number
  synapse_count: number
  recent_signals: number
  api_success_rate: number
} | null> {
  const { data, error } = await supabaseAny.rpc('get_bio_ai_stats', {
    p_user_id: userId
  })

  if (error) {
    console.error('Failed to get bio-AI stats:', error)
    return null
  }

  const result = data as Array<{
    total_memories: number
    strong_memories: number
    synapse_count: number
    recent_signals: number
    api_success_rate: number
  }> | null
  return result?.[0] || null
}

// ============================================
// 🗄️ STATE SNAPSHOT STORAGE
// ============================================

export async function saveStateSnapshot(
  userId: string,
  state: Record<string, unknown>
): Promise<string | null> {
  const fileName = `${userId}/${Date.now()}-state.json`
  const stateBlob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })

  const { error } = await supabase.storage
    .from('bio-ai-states')
    .upload(fileName, stateBlob, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    console.error('Failed to save state snapshot:', error)
    return null
  }

  return fileName
}

export async function loadStateSnapshot(fileName: string): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase.storage
    .from('bio-ai-states')
    .download(fileName)

  if (error || !data) {
    console.error('Failed to load state snapshot:', error)
    return null
  }

  try {
    const text = await data.text()
    return JSON.parse(text)
  } catch {
    console.error('Failed to parse state snapshot')
    return null
  }
}

export async function listStateSnapshots(userId: string): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from('bio-ai-states')
    .list(userId, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  if (error) {
    console.error('Failed to list state snapshots:', error)
    return []
  }

  return (data || []).map(file => `${userId}/${file.name}`)
}

export async function deleteStateSnapshot(fileName: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from('bio-ai-states')
    .remove([fileName])

  return !error
}

// ============================================
// MAINTENANCE FUNCTIONS
// ============================================

export async function runMemoryDecay(): Promise<number> {
  const { data, error } = await supabaseAny.rpc('decay_memories')

  if (error) {
    console.error('Failed to run memory decay:', error)
    return 0
  }

  return (data as number) || 0
}
