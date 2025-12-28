'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Users,
  Plus,
  X,
  Sparkles,
  Check
} from 'lucide-react'
import toast from 'react-hot-toast'

// Types
interface FamilyMember {
  id: string
  name: string
  age: string
  isPicky: boolean
  allergies: string[]
  restrictions: string[]
  dislikes: string[]
}

const ALLERGIES = [
  'Nuts', 'Peanuts', 'Dairy', 'Eggs', 'Shellfish',
  'Fish', 'Soy', 'Wheat/Gluten', 'Sesame'
]

const RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Keto',
  'Paleo', 'Low Sodium', 'Low Sugar', 'Diabetic-Friendly'
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [householdName, setHouseholdName] = useState('')
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: '', age: '', isPicky: false, allergies: [], restrictions: [], dislikes: [] }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const totalSteps = 3

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { id: Date.now().toString(), name: '', age: '', isPicky: false, allergies: [], restrictions: [], dislikes: [] }
    ])
  }

  const removeFamilyMember = (id: string) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter(m => m.id !== id))
    }
  }

  const updateMember = (id: string, field: keyof FamilyMember, value: any) => {
    setFamilyMembers(familyMembers.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  const toggleArrayItem = (id: string, field: 'allergies' | 'restrictions', item: string) => {
    setFamilyMembers(familyMembers.map(m => {
      if (m.id !== id) return m
      const arr = m[field]
      return {
        ...m,
        [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
      }
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Import Supabase
      const { supabase, createHouseholdWithMember } = await import('@/lib/supabase')

      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      // 2. Create household and family member
      const { household } = await createHouseholdWithMember(
        authData.user.id,
        householdName || 'My Household',
        familyMembers[0]?.name || email.split('@')[0],
        email
      )

      // 3. Add additional family members
      for (let i = 1; i < familyMembers.length; i++) {
        const member = familyMembers[i]
        if (!member.name.trim()) continue

        const { data: newMember, error: memberError } = await supabase
          .from('family_members')
          .insert({
            household_id: household.id,
            name: member.name,
            age: member.age ? parseInt(member.age) : null,
            is_picky_eater: member.isPicky,
            role: 'member',
          })
          .select()
          .single()

        if (memberError) {
          console.error('Error adding family member:', memberError)
          continue
        }

        // Add allergies for this member
        if (member.allergies.length > 0 && newMember) {
          const allergyInserts = member.allergies.map(allergen => ({
            family_member_id: newMember.id,
            allergen,
            severity: 'moderate' as const,
          }))
          await supabase.from('allergies').insert(allergyInserts)
        }

        // Add dietary restrictions for this member
        if (member.restrictions.length > 0 && newMember) {
          const restrictionInserts = member.restrictions.map(restriction_type => ({
            family_member_id: newMember.id,
            restriction_type,
          }))
          await supabase.from('dietary_restrictions').insert(restrictionInserts)
        }
      }

      // 4. Add allergies and restrictions for the first member (admin)
      const { data: adminMember } = await supabase
        .from('family_members')
        .select('id')
        .eq('household_id', household.id)
        .eq('role', 'admin')
        .single()

      if (adminMember && familyMembers[0]) {
        if (familyMembers[0].allergies.length > 0) {
          const allergyInserts = familyMembers[0].allergies.map(allergen => ({
            family_member_id: adminMember.id,
            allergen,
            severity: 'moderate' as const,
          }))
          await supabase.from('allergies').insert(allergyInserts)
        }

        if (familyMembers[0].restrictions.length > 0) {
          const restrictionInserts = familyMembers[0].restrictions.map(restriction_type => ({
            family_member_id: adminMember.id,
            restriction_type,
          }))
          await supabase.from('dietary_restrictions').insert(restrictionInserts)
        }

        // Update picky eater status
        if (familyMembers[0].isPicky) {
          await supabase
            .from('family_members')
            .update({ is_picky_eater: true })
            .eq('id', adminMember.id)
        }
      }

      toast.success('Welcome to BestMealMate! Check your email to confirm your account.')
      router.push('/dashboard')
    } catch (error: unknown) {
      console.error('Onboarding error:', error)
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return email && password && password.length >= 6 // Account
      case 2: return familyMembers.some(m => m.name.trim()) // At least one family member
      case 3: return true // Dietary details (optional)
      default: return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-7 h-7 text-brand-600" />
            <span className="text-lg font-bold text-gray-900">BestMealMate</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  s <= step ? 'bg-brand-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-20 pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Create Account */}
            {step === 1 && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pt-8"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-brand-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome to BestMealMate
                  </h2>
                  <p className="text-gray-600">Create your account in seconds</p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Household name <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="text"
                      value={householdName}
                      onChange={(e) => setHouseholdName(e.target.value)}
                      placeholder="The Smith Family"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Add Family Members */}
            {step === 2 && (
              <motion.div
                key="family"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pt-8"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-brand-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Who&apos;s eating?
                  </h2>
                  <p className="text-gray-600">Add everyone who eats dinner together</p>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                        placeholder="Name"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                      />
                      <input
                        type="number"
                        value={member.age}
                        onChange={(e) => updateMember(member.id, 'age', e.target.value)}
                        placeholder="Age"
                        className="w-16 px-3 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-center"
                      />
                      <label className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={member.isPicky}
                          onChange={(e) => updateMember(member.id, 'isPicky', e.target.checked)}
                          className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-gray-500">Picky</span>
                      </label>
                      {familyMembers.length > 1 && (
                        <button
                          onClick={() => removeFamilyMember(member.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={addFamilyMember}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add another person
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Dietary Details */}
            {step === 3 && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pt-8"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-brand-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Any dietary needs?
                  </h2>
                  <p className="text-gray-600">Optional - you can skip this step</p>
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                  {familyMembers.filter(m => m.name.trim()).map((member) => (
                    <div key={member.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">{member.name}</h3>

                      {/* Allergies */}
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">ALLERGIES</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ALLERGIES.map(allergy => (
                            <button
                              key={allergy}
                              onClick={() => toggleArrayItem(member.id, 'allergies', allergy)}
                              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                                member.allergies.includes(allergy)
                                  ? 'bg-red-100 text-red-700 border border-red-300'
                                  : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
                              }`}
                            >
                              {allergy}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dietary Restrictions */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">DIET</p>
                        <div className="flex flex-wrap gap-1.5">
                          {RESTRICTIONS.map(restriction => (
                            <button
                              key={restriction}
                              onClick={() => toggleArrayItem(member.id, 'restrictions', restriction)}
                              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                                member.restrictions.includes(restriction)
                                  ? 'bg-brand-100 text-brand-700 border border-brand-300'
                                  : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
                              }`}
                            >
                              {restriction}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          ) : (
            <div />
          )}
          
          {step < totalSteps ? (
            <button
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                canProceed()
                  ? 'bg-brand-600 text-white hover:bg-brand-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Meal Plan
                </>
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
