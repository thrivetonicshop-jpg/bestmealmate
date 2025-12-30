/**
 * Free Scans Manager
 * Handles the 3 free food scans trial for new users
 */

const FREE_SCANS_KEY = 'freeScansRemaining'
const FREE_SCANS_TOTAL_KEY = 'freeScansTotal'
const DEFAULT_FREE_SCANS = 3

export interface FreeScanStatus {
  remaining: number
  total: number
  hasFreeScan: boolean
  isTrialUser: boolean
}

/**
 * Initialize free scans for new users
 */
export function initializeFreeScans(): void {
  if (typeof window === 'undefined') return

  const existing = localStorage.getItem(FREE_SCANS_KEY)
  if (!existing) {
    localStorage.setItem(FREE_SCANS_KEY, DEFAULT_FREE_SCANS.toString())
    localStorage.setItem(FREE_SCANS_TOTAL_KEY, DEFAULT_FREE_SCANS.toString())
  }
}

/**
 * Get current free scan status
 */
export function getFreeScanStatus(): FreeScanStatus {
  if (typeof window === 'undefined') {
    return { remaining: 0, total: DEFAULT_FREE_SCANS, hasFreeScan: false, isTrialUser: true }
  }

  const remaining = parseInt(localStorage.getItem(FREE_SCANS_KEY) || '0', 10)
  const total = parseInt(localStorage.getItem(FREE_SCANS_TOTAL_KEY) || DEFAULT_FREE_SCANS.toString(), 10)

  return {
    remaining,
    total,
    hasFreeScan: remaining > 0,
    isTrialUser: total === DEFAULT_FREE_SCANS && remaining < DEFAULT_FREE_SCANS,
  }
}

/**
 * Consume one free scan (decrements counter)
 * Returns true if scan was allowed, false if no scans remaining
 */
export function consumeFreeScan(): boolean {
  if (typeof window === 'undefined') return false

  const status = getFreeScanStatus()

  if (status.remaining <= 0) {
    return false
  }

  const newCount = status.remaining - 1
  localStorage.setItem(FREE_SCANS_KEY, newCount.toString())

  return true
}

/**
 * Check if user has active subscription (bypasses free scan limit)
 * This should be enhanced to check actual subscription status from database
 */
export function hasActiveSubscription(): boolean {
  if (typeof window === 'undefined') return false

  // Check localStorage flag that would be set after successful subscription
  const subscription = localStorage.getItem('subscriptionStatus')
  return subscription === 'active' || subscription === 'premium' || subscription === 'family'
}

/**
 * Check if user can perform a scan (has free scan OR subscription)
 */
export function canScan(): boolean {
  if (hasActiveSubscription()) return true
  return getFreeScanStatus().hasFreeScan
}

/**
 * Reset free scans (for testing or promotional purposes)
 */
export function resetFreeScans(count: number = DEFAULT_FREE_SCANS): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(FREE_SCANS_KEY, count.toString())
  localStorage.setItem(FREE_SCANS_TOTAL_KEY, count.toString())
}

/**
 * Grant bonus scans (promotional feature)
 */
export function grantBonusScans(count: number): void {
  if (typeof window === 'undefined') return

  const current = parseInt(localStorage.getItem(FREE_SCANS_KEY) || '0', 10)
  const newCount = current + count
  localStorage.setItem(FREE_SCANS_KEY, newCount.toString())
}
