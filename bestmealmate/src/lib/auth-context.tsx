'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, trackLogin, saveUserPreferences, createProfileBackup } from './supabase'
import type { Household, FamilyMember } from './database.types'

interface AuthContextType {
  user: User | null
  session: Session | null
  household: Household | null
  familyMember: FamilyMember | null
  loading: boolean
  signOut: () => Promise<void>
  refreshHousehold: () => Promise<void>
  exportUserData: () => Promise<string>
  createBackup: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  household: null,
  familyMember: null,
  loading: true,
  signOut: async () => {},
  refreshHousehold: async () => {},
  exportUserData: async () => '',
  createBackup: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [household, setHousehold] = useState<Household | null>(null)
  const [familyMember, setFamilyMember] = useState<FamilyMember | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Get family member record for user
      const { data: member, error: memberError } = await supabase
        .from('family_members')
        .select('*, households(*)')
        .eq('user_id', userId)
        .single()

      if (memberError) {
        console.log('No family member found for user:', memberError.message)
        return
      }

      if (member) {
        setFamilyMember(member as FamilyMember)
        if (member.households) {
          setHousehold(member.households as Household)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }, [])

  const refreshHousehold = useCallback(async () => {
    if (user) {
      await fetchUserData(user.id)
    }
  }, [user, fetchUserData])

  // Export all user data as JSON
  const exportUserData = useCallback(async (): Promise<string> => {
    if (!user || !household) return ''

    try {
      // Use type assertions for tables not in auto-generated types
      const supabaseAny = supabase as { from: (table: string) => ReturnType<typeof supabase.from> }
      const [householdData, familyMembers, preferences, savedMeals, pantryItems, groceryLists] = await Promise.all([
        supabase.from('households').select('*').eq('id', household.id).single(),
        supabase.from('family_members').select('*, dietary_restrictions(*), allergies(*)').eq('household_id', household.id),
        supabaseAny.from('user_preferences').select('*').eq('user_id', user.id).single(),
        supabaseAny.from('ai_generated_meals').select('*').eq('household_id', household.id),
        supabase.from('pantry_items').select('*').eq('household_id', household.id),
        supabase.from('grocery_lists').select('*').eq('household_id', household.id),
      ])

      const exportData = {
        exported_at: new Date().toISOString(),
        user_email: user.email,
        household: householdData.data,
        family_members: familyMembers.data,
        preferences: preferences.data,
        saved_meals: savedMeals.data,
        pantry_items: pantryItems.data,
        grocery_lists: groceryLists.data,
      }

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error('Error exporting user data:', error)
      return ''
    }
  }, [user, household])

  // Create a backup of user profile
  const createBackup = useCallback(async () => {
    if (!user || !household) return

    try {
      await createProfileBackup(user.id, household.id, 'manual')
    } catch (error) {
      console.error('Error creating backup:', error)
    }
  }, [user, household])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserData(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchUserData(session.user.id)

          // Track login on sign in
          if (event === 'SIGNED_IN') {
            trackLogin({
              user_id: session.user.id,
              email: session.user.email || '',
              login_method: session.user.app_metadata?.provider === 'google' ? 'google' : 'email',
              user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
              is_successful: true,
            })

            // Initialize user preferences if needed
            // Use type assertion for tables not in auto-generated types
            const supabaseAny = supabase as { from: (table: string) => ReturnType<typeof supabase.from> }
            const { data: existingPrefs } = await supabaseAny
              .from('user_preferences')
              .select('id')
              .eq('user_id', session.user.id)
              .single()

            if (!existingPrefs) {
              // Get household ID
              const { data: member } = await supabase
                .from('family_members')
                .select('household_id')
                .eq('user_id', session.user.id)
                .single()

              if (member?.household_id) {
                await saveUserPreferences(session.user.id, member.household_id, {
                  theme: 'system',
                  email_notifications: true,
                  push_notifications: true,
                })
              }
            }

            // Update last login
            await supabaseAny
              .from('user_preferences')
              .update({ last_login_at: new Date().toISOString() })
              .eq('user_id', session.user.id)
          }
        } else {
          setHousehold(null)
          setFamilyMember(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchUserData])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setHousehold(null)
    setFamilyMember(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        household,
        familyMember,
        loading,
        signOut,
        refreshHousehold,
        exportUserData,
        createBackup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
