'use client'

import { useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Household, FamilyMember } from '@/lib/database.types'

interface AuthState {
  user: User | null
  session: Session | null
  household: Household | null
  familyMember: FamilyMember | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    household: null,
    familyMember: null,
    loading: true,
    error: null
  })

  const fetchUserData = useCallback(async (user: User) => {
    try {
      // Find family member for this user
      const { data: member, error: memberError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (memberError && memberError.code !== 'PGRST116') {
        console.error('Error fetching family member:', memberError)
      }

      let household = null
      if (member?.household_id) {
        const { data: householdData, error: householdError } = await supabase
          .from('households')
          .select('*')
          .eq('id', member.household_id)
          .single()

        if (householdError) {
          console.error('Error fetching household:', householdError)
        } else {
          household = householdData
        }
      }

      setState(prev => ({
        ...prev,
        familyMember: member || null,
        household,
        loading: false
      }))
    } catch (error) {
      console.error('Error fetching user data:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load user data'
      }))
    }
  }, [])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return
      }

      setState(prev => ({
        ...prev,
        user: session?.user || null,
        session
      }))

      if (session?.user) {
        fetchUserData(session.user)
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user || null,
          session
        }))

        if (session?.user) {
          fetchUserData(session.user)
        } else {
          setState(prev => ({
            ...prev,
            household: null,
            familyMember: null,
            loading: false
          }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUserData])

  const signOut = async () => {
    await supabase.auth.signOut()
    setState({
      user: null,
      session: null,
      household: null,
      familyMember: null,
      loading: false,
      error: null
    })
  }

  const refreshHousehold = async () => {
    if (state.user) {
      await fetchUserData(state.user)
    }
  }

  return {
    ...state,
    signOut,
    refreshHousehold,
    isAuthenticated: !!state.user
  }
}
