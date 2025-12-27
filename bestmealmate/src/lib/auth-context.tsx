'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Household, FamilyMember } from './database.types'

interface AuthContextType {
  user: User | null
  session: Session | null
  household: Household | null
  familyMember: FamilyMember | null
  loading: boolean
  signOut: () => Promise<void>
  refreshHousehold: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  household: null,
  familyMember: null,
  loading: true,
  signOut: async () => {},
  refreshHousehold: async () => {},
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
