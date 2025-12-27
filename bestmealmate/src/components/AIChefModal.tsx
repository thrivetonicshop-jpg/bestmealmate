'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X, Loader2, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePantryStore, useFamilyStore, useAuthStore } from '@/lib/store'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface AIChefModalProps {
  open: boolean
  onClose: () => void
}

const SUGGESTED_PROMPTS = [
  "What can I make with what's expiring soon?",
  "Quick dinner ideas for tonight?",
  "Something the kids will love?",
  "Healthy meal with chicken?",
]

export default function AIChefModal({ open, onClose }: AIChefModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { items: pantryItems } = usePantryStore()
  const { members: familyMembers } = useFamilyStore()
  const { household } = useAuthStore()

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Build context for AI
      const context = {
        household: household?.name || 'My Family',
        familyMembers: familyMembers.map((m) => ({
          name: m.name,
          age: m.age,
          isPicky: m.is_picky_eater,
          allergies: m.allergies?.map((a) => a.allergen) || [],
          restrictions: m.dietary_restrictions?.map((r) => r.restriction_type) || [],
        })),
        pantryItems: pantryItems.map((p) => ({
          name: p.ingredient?.name || 'Unknown',
          quantity: p.quantity,
          unit: p.unit,
          expiryDate: p.expiry_date,
          location: p.location,
        })),
        expiringItems: pantryItems
          .filter((p) => {
            if (!p.expiry_date) return false
            const days = Math.ceil(
              (new Date(p.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
            return days <= 3 && days >= 0
          })
          .map((p) => p.ingredient?.name || 'Unknown'),
      }

      const response = await fetch('/api/ai-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          context,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.error || 'I apologize, but I could not generate a response.',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Chef</h3>
              <p className="text-sm text-gray-500">Ask me anything about meals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Hi! I'm your AI Chef
              </h4>
              <p className="text-gray-500 text-sm mb-6">
                I know your family's preferences and what's in your pantry. Ask me anything!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === 'user'
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-brand-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
