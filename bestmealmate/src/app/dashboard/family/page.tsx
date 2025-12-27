'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChefHat,
  Calendar,
  ShoppingCart,
  Refrigerator,
  Users,
  Plus,
  Edit2,
  Trash2,
  X,
  Settings,
  LogOut,
  AlertCircle,
  Shield,
  User
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface FamilyMember {
  id: string
  name: string
  age: number | null
  role: 'admin' | 'member' | 'child'
  avatar: string
  dietary_restrictions: string[]
  allergies: { name: string; severity: 'mild' | 'moderate' | 'severe' }[]
  dislikes: string[]
  is_picky_eater: boolean
}

const mockFamily: FamilyMember[] = [
  {
    id: '1',
    name: 'You',
    age: 35,
    role: 'admin',
    avatar: '👨',
    dietary_restrictions: [],
    allergies: [],
    dislikes: ['Brussels Sprouts'],
    is_picky_eater: false
  },
  {
    id: '2',
    name: 'Sarah',
    age: 33,
    role: 'member',
    avatar: '👩',
    dietary_restrictions: ['Vegetarian'],
    allergies: [],
    dislikes: [],
    is_picky_eater: false
  },
  {
    id: '3',
    name: 'Jake',
    age: 10,
    role: 'child',
    avatar: '👦',
    dietary_restrictions: [],
    allergies: [{ name: 'Peanuts', severity: 'severe' }, { name: 'Tree Nuts', severity: 'moderate' }],
    dislikes: ['Mushrooms', 'Onions'],
    is_picky_eater: true
  },
  {
    id: '4',
    name: 'Emma',
    age: 7,
    role: 'child',
    avatar: '👧',
    dietary_restrictions: [],
    allergies: [],
    dislikes: ['Spicy food'],
    is_picky_eater: false
  }
]

const avatarOptions = ['👨', '👩', '👦', '👧', '👶', '🧑', '👴', '👵', '🧔', '👱']
const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Keto', 'Paleo', 'Halal', 'Kosher', 'Low Sodium', 'Low Sugar']
const commonAllergens = ['Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Shellfish', 'Fish', 'Soy', 'Wheat', 'Sesame']

export default function FamilyPage() {
  const [family, setFamily] = useState<FamilyMember[]>(mockFamily)
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    role: 'member' as 'admin' | 'member' | 'child',
    avatar: '🧑',
    dietary_restrictions: [] as string[],
    allergies: [] as { name: string; severity: 'mild' | 'moderate' | 'severe' }[],
    dislikes: '',
    is_picky_eater: false
  })

  function openAddModal() {
    setEditingMember(null)
    setFormData({
      name: '',
      age: '',
      role: 'member',
      avatar: '🧑',
      dietary_restrictions: [],
      allergies: [],
      dislikes: '',
      is_picky_eater: false
    })
    setShowModal(true)
  }

  function openEditModal(member: FamilyMember) {
    setEditingMember(member)
    setFormData({
      name: member.name,
      age: member.age?.toString() || '',
      role: member.role,
      avatar: member.avatar,
      dietary_restrictions: member.dietary_restrictions,
      allergies: member.allergies,
      dislikes: member.dislikes.join(', '),
      is_picky_eater: member.is_picky_eater
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Please enter a name')
      return
    }

    const memberData: FamilyMember = {
      id: editingMember?.id || `member-${Date.now()}`,
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : null,
      role: formData.role,
      avatar: formData.avatar,
      dietary_restrictions: formData.dietary_restrictions,
      allergies: formData.allergies,
      dislikes: formData.dislikes.split(',').map(d => d.trim()).filter(Boolean),
      is_picky_eater: formData.is_picky_eater
    }

    if (editingMember) {
      setFamily(family.map(m => m.id === editingMember.id ? memberData : m))
      toast.success('Member updated')
    } else {
      setFamily([...family, memberData])
      toast.success('Member added')
    }

    setShowModal(false)
  }

  function deleteMember(member: FamilyMember) {
    if (!confirm(`Remove ${member.name} from your family?`)) return
    setFamily(family.filter(m => m.id !== member.id))
    toast.success('Member removed')
  }

  function toggleDietaryRestriction(restriction: string) {
    if (formData.dietary_restrictions.includes(restriction)) {
      setFormData({
        ...formData,
        dietary_restrictions: formData.dietary_restrictions.filter(r => r !== restriction)
      })
    } else {
      setFormData({
        ...formData,
        dietary_restrictions: [...formData.dietary_restrictions, restriction]
      })
    }
  }

  function addAllergy(allergen: string) {
    if (formData.allergies.find(a => a.name === allergen)) return
    setFormData({
      ...formData,
      allergies: [...formData.allergies, { name: allergen, severity: 'moderate' }]
    })
  }

  function removeAllergy(allergen: string) {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter(a => a.name !== allergen)
    })
  }

  function updateAllergySeverity(allergen: string, severity: 'mild' | 'moderate' | 'severe') {
    setFormData({
      ...formData,
      allergies: formData.allergies.map(a =>
        a.name === allergen ? { ...a, severity } : a
      )
    })
  }

  const severityColors = {
    mild: 'bg-yellow-100 text-yellow-800',
    moderate: 'bg-orange-100 text-orange-800',
    severe: 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold text-gray-900">BestMealMate</span>
        </div>

        <nav className="space-y-1">
          {[
            { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: false },
            { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries', active: false },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
            { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: false },
            { icon: Users, label: 'Family', href: '/dashboard/family', active: true },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="border-t border-gray-200 pt-4 space-y-1">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Family</h1>
            <p className="text-gray-600">Manage family members and their dietary needs</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Member
          </button>
        </header>

        {/* Family Members Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {family.map(member => (
            <div key={member.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <div className="flex items-center gap-2">
                        {member.age && <span className="text-sm text-gray-500">{member.age} years old</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          member.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          member.role === 'child' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {member.role === 'admin' && <Shield className="w-3 h-3 inline mr-1" />}
                          {member.role === 'child' && <User className="w-3 h-3 inline mr-1" />}
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {member.role !== 'admin' && (
                      <button
                        onClick={() => deleteMember(member)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {member.is_picky_eater && (
                  <div className="mb-3 text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full inline-block">
                    Picky Eater
                  </div>
                )}

                {member.dietary_restrictions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Dietary Restrictions</p>
                    <div className="flex flex-wrap gap-1">
                      {member.dietary_restrictions.map(restriction => (
                        <span key={restriction} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {member.allergies.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Allergies
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {member.allergies.map(allergy => (
                        <span key={allergy.name} className={`text-xs px-2 py-1 rounded-full ${severityColors[allergy.severity]}`}>
                          {allergy.name} ({allergy.severity})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {member.dislikes.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Dislikes</p>
                    <div className="flex flex-wrap gap-1">
                      {member.dislikes.map(dislike => (
                        <span key={dislike} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {dislike}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {member.dietary_restrictions.length === 0 && member.allergies.length === 0 && member.dislikes.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No dietary requirements</p>
                )}
              </div>
            </div>
          ))}

          {/* Add Member Card */}
          <button
            onClick={openAddModal}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors min-h-[200px]"
          >
            <Plus className="w-8 h-8" />
            <span className="font-medium">Add Family Member</span>
          </button>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingMember ? 'Edit Member' : 'Add Family Member'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avatar Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.map(avatar => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar })}
                        className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all ${
                          formData.avatar === avatar
                            ? 'bg-brand-100 ring-2 ring-brand-600'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'member' | 'child' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="child">Child</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleDietaryRestriction(option)}
                        className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                          formData.dietary_restrictions.includes(option)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {commonAllergens.filter(a => !formData.allergies.find(x => x.name === a)).map(allergen => (
                      <button
                        key={allergen}
                        type="button"
                        onClick={() => addAllergy(allergen)}
                        className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        + {allergen}
                      </button>
                    ))}
                  </div>
                  {formData.allergies.length > 0 && (
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      {formData.allergies.map(allergy => (
                        <div key={allergy.name} className="flex items-center gap-2">
                          <span className="flex-1 text-sm font-medium">{allergy.name}</span>
                          <select
                            value={allergy.severity}
                            onChange={(e) => updateAllergySeverity(allergy.name, e.target.value as 'mild' | 'moderate' | 'severe')}
                            className="text-xs px-2 py-1 rounded border border-gray-300"
                          >
                            <option value="mild">Mild</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeAllergy(allergy.name)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dislikes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Dislikes</label>
                  <input
                    type="text"
                    value={formData.dislikes}
                    onChange={(e) => setFormData({ ...formData, dislikes: e.target.value })}
                    placeholder="e.g., Mushrooms, Onions, Spicy food"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_picky_eater}
                    onChange={(e) => setFormData({ ...formData, is_picky_eater: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Picky eater (AI Chef will suggest simpler meals)</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
                  >
                    {editingMember ? 'Save Changes' : 'Add Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Calendar, label: 'Plan', href: '/dashboard', active: false },
            { icon: ShoppingCart, label: 'Groceries', href: '/dashboard/groceries', active: false },
            { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
            { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: false },
            { icon: Users, label: 'Family', href: '/dashboard/family', active: true },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                item.active ? 'text-brand-600' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
