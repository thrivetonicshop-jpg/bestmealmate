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
  AlertCircle,
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
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const totalSteps = 6

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
      case 1: return true // Problem screen
      case 2: return true // Empathy screen
      case 3: return true // Solution screen
      case 4: return email && password && password.length >= 6 // Account
      case 5: return familyMembers.every(m => m.name.trim()) // Family names
      case 6: return true // Details (optional)
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
          {step > 3 && (
            <div className="flex items-center gap-2">
              {[4, 5, 6].map(s => (
                <div 
                  key={s}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    s <= step ? 'bg-brand-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="pt-20 pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: The Problem */}
            {step === 1 && (
              <motion.div
                key="problem"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center pt-16"
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                  Feeding a family is <span className="text-red-500">exhausting.</span>
                </h1>
                <div className="space-y-4 text-left max-w-md mx-auto mb-12">
                  {[
                    "Different tastes, allergies, picky eaters",
                    "Food rotting in the fridge",
                    "The endless \"what's for dinner?\" question",
                    "Grocery runs that miss half the stuff you need"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-lg text-gray-600">
                      <AlertCircle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: The Empathy */}
            {step === 2 && (
              <motion.div
                key="empathy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center pt-16"
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                  You're not a bad cook.<br />
                  <span className="text-brand-600">You're just juggling too much.</span>
                </h1>
                <div className="space-y-4 text-left max-w-md mx-auto mb-12">
                  {[
                    "Planning meals for multiple people with different needs",
                    "Remembering what's in your fridge",
                    "Staying on budget",
                    "Keeping everyone happy"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-lg text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-brand-600 text-sm font-medium">{i + 1}</span>
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xl text-gray-500 italic">It shouldn't be this hard.</p>
              </motion.div>
            )}

            {/* Step 3: The Solution */}
            {step === 3 && (
              <motion.div
                key="solution"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center pt-16"
              >
                <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-brand-600" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                  BestMealMate plans around<br />
                  <span className="text-brand-600">your family — and your fridge.</span>
                </h1>
                <div className="space-y-3 text-left max-w-md mx-auto my-12">
                  {[
                    "One plan that works for everyone",
                    "Uses what you already have",
                    "Knows who can eat what",
                    "Builds your grocery list automatically"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-lg text-gray-700">
                      <Check className="w-6 h-6 text-brand-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-2xl font-semibold text-brand-600">
                  Dinner solved. For the whole family.
                </p>
              </motion.div>
            )}

            {/* Step 4: Create Account */}
            {step === 4 && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pt-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                  Let's get you set up
                </h2>
                <p className="text-gray-600 mb-8 text-center">Create your account to save your family's preferences</p>
                
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Household name (optional)</label>
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

            {/* Step 5: Add Family Members */}
            {step === 5 && (
              <motion.div
                key="family"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pt-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                  Who's in your family?
                </h2>
                <p className="text-gray-600 mb-8 text-center">Add everyone who eats dinner together</p>
                
                <div className="space-y-4 max-w-md mx-auto">
                  {familyMembers.map((member, index) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="flex-1 flex gap-3">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                          placeholder="Name"
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        />
                        <input
                          type="number"
                          value={member.age}
                          onChange={(e) => updateMember(member.id, 'age', e.target.value)}
                          placeholder="Age"
                          className="w-20 px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                        />
                      </div>
                      {familyMembers.length > 1 && (
                        <button
                          onClick={() => removeFamilyMember(member.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
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

            {/* Step 6: Dietary Details */}
            {step === 6 && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pt-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                  Any dietary needs?
                </h2>
                <p className="text-gray-600 mb-8 text-center">Select all that apply for each person</p>
                
                <div className="space-y-8 max-w-lg mx-auto">
                  {familyMembers.filter(m => m.name.trim()).map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={member.isPicky}
                            onChange={(e) => updateMember(member.id, 'isPicky', e.target.checked)}
                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-gray-600">Picky eater</span>
                        </label>
                      </div>
                      
                      {/* Allergies */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {ALLERGIES.map(allergy => (
                            <button
                              key={allergy}
                              onClick={() => toggleArrayItem(member.id, 'allergies', allergy)}
                              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                member.allergies.includes(allergy)
                                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                              }`}
                            >
                              {allergy}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Dietary Restrictions */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Dietary restrictions</p>
                        <div className="flex flex-wrap gap-2">
                          {RESTRICTIONS.map(restriction => (
                            <button
                              key={restriction}
                              onClick={() => toggleArrayItem(member.id, 'restrictions', restriction)}
                              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                member.restrictions.includes(restriction)
                                  ? 'bg-brand-100 text-brand-700 border-2 border-brand-300'
                                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
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
              {step < 4 ? 'Continue' : 'Next'}
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
