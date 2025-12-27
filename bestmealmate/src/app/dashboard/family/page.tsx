'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Check,
  UserCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { useFamilyStore, useAuthStore, type FamilyMemberWithDetails } from '@/lib/store'
import { cn, avatarEmojis, getInitials } from '@/lib/utils'

const ALLERGIES = [
  'Nuts', 'Peanuts', 'Dairy', 'Eggs', 'Shellfish',
  'Fish', 'Soy', 'Wheat/Gluten', 'Sesame'
]

const RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Keto',
  'Paleo', 'Low Sodium', 'Low Sugar', 'Diabetic-Friendly'
]

export default function FamilyPage() {
  const { household } = useAuthStore()
  const { members, setMembers, addMember, updateMember, removeMember, isLoading, setIsLoading } = useFamilyStore()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMemberWithDetails | null>(null)

  // Fetch family members
  useEffect(() => {
    const fetchFamily = async () => {
      if (!household?.id) return

      setIsLoading(true)
      try {
        const res = await fetch(`/api/family?householdId=${household.id}`)
        const data = await res.json()
        setMembers(data.members || [])
      } catch (error) {
        console.error('Failed to fetch family:', error)
        toast.error('Failed to load family members')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFamily()
  }, [household?.id, setMembers, setIsLoading])

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this family member?')) return

    try {
      const res = await fetch(`/api/family?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      removeMember(id)
      toast.success('Family member removed')
    } catch (error) {
      toast.error('Failed to remove family member')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Family Members</h1>
            <p className="text-gray-600">
              {members.length} {members.length === 1 ? 'member' : 'members'} in your household
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Member
          </button>
        </div>

        {/* Members List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading family members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No family members yet</h3>
            <p className="text-gray-500 mb-4">Add your family members to personalize meal planning</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
            >
              <Plus className="w-4 h-4" />
              Add First Member
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center text-2xl">
                      {member.avatar_url || avatarEmojis[members.indexOf(member) % avatarEmojis.length]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {member.age && <span>{member.age} years old</span>}
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          member.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          member.role === 'child' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        )}>
                          {member.role === 'admin' ? 'Admin' : member.role === 'child' ? 'Child' : 'Member'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingMember(member)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dietary Info */}
                <div className="space-y-3">
                  {member.is_picky_eater && (
                    <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span>Picky eater</span>
                    </div>
                  )}

                  {member.allergies && member.allergies.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Allergies</p>
                      <div className="flex flex-wrap gap-1">
                        {member.allergies.map((allergy) => (
                          <span
                            key={allergy.id}
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              allergy.severity === 'severe' ? 'bg-red-100 text-red-700' :
                              allergy.severity === 'moderate' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            )}
                          >
                            {allergy.allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.dietary_restrictions && member.dietary_restrictions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Dietary Restrictions</p>
                      <div className="flex flex-wrap gap-1">
                        {member.dietary_restrictions.map((restriction) => (
                          <span
                            key={restriction.id}
                            className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full text-xs font-medium"
                          >
                            {restriction.restriction_type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!member.allergies?.length && !member.dietary_restrictions?.length && !member.is_picky_eater && (
                    <p className="text-sm text-gray-400 italic">No dietary restrictions</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingMember) && (
        <FamilyMemberModal
          member={editingMember}
          householdId={household?.id || ''}
          onClose={() => {
            setShowAddModal(false)
            setEditingMember(null)
          }}
          onSave={(savedMember) => {
            if (editingMember) {
              updateMember(savedMember.id, savedMember)
            } else {
              addMember(savedMember)
            }
            setShowAddModal(false)
            setEditingMember(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}

// Add/Edit Modal Component
interface FamilyMemberModalProps {
  member: FamilyMemberWithDetails | null
  householdId: string
  onClose: () => void
  onSave: (member: FamilyMemberWithDetails) => void
}

function FamilyMemberModal({ member, householdId, onClose, onSave }: FamilyMemberModalProps) {
  const [name, setName] = useState(member?.name || '')
  const [age, setAge] = useState(member?.age?.toString() || '')
  const [role, setRole] = useState(member?.role || 'member')
  const [isPickyEater, setIsPickyEater] = useState(member?.is_picky_eater || false)
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(
    member?.allergies?.map((a) => a.allergen) || []
  )
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    member?.dietary_restrictions?.map((r) => r.restriction_type) || []
  )
  const [isLoading, setIsLoading] = useState(false)

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    )
  }

  const toggleRestriction = (restriction: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restriction) ? prev.filter((r) => r !== restriction) : [...prev, restriction]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a name')
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        householdId,
        name: name.trim(),
        age: parseInt(age) || null,
        role,
        isPickyEater,
        allergies: selectedAllergies,
        restrictions: selectedRestrictions,
      }

      if (member) {
        // Update
        const res = await fetch('/api/family', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: member.id, ...payload }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        onSave(data.member)
        toast.success('Member updated')
      } else {
        // Create
        const res = await fetch('/api/family', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        onSave(data.member)
        toast.success('Member added')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save member')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {member ? 'Edit Family Member' : 'Add Family Member'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
            />
          </div>

          {/* Age & Role */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 35"
                min="0"
                max="120"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="child">Child</option>
              </select>
            </div>
          </div>

          {/* Picky Eater */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPickyEater}
              onChange={(e) => setIsPickyEater(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700">This person is a picky eater</span>
          </label>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
            <div className="flex flex-wrap gap-2">
              {ALLERGIES.map((allergy) => (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => toggleAllergy(allergy)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border-2",
                    selectedAllergies.includes(allergy)
                      ? "bg-red-100 text-red-700 border-red-300"
                      : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
                  )}
                >
                  {allergy}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
            <div className="flex flex-wrap gap-2">
              {RESTRICTIONS.map((restriction) => (
                <button
                  key={restriction}
                  type="button"
                  onClick={() => toggleRestriction(restriction)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border-2",
                    selectedRestrictions.includes(restriction)
                      ? "bg-brand-100 text-brand-700 border-brand-300"
                      : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
                  )}
                >
                  {restriction}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {member ? 'Save Changes' : 'Add Member'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
