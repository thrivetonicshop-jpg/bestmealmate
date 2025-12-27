'use client'

import { useState } from 'react'
import { Palette, Video, Layout, ExternalLink, Sparkles, ChevronRight, X } from 'lucide-react'

interface ContentCreationProps {
  recipeTitle?: string
  className?: string
}

// Canva icon
const CanvaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13v4H7v2h4v4h2v-4h4v-2h-4V7h-2z"/>
  </svg>
)

// InVideo icon
const InVideoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
)

// Marblism icon
const MarblismIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4"/>
  </svg>
)

export default function ContentCreation({ recipeTitle = '', className = '' }: ContentCreationProps) {
  const [showModal, setShowModal] = useState(false)

  const tools = [
    {
      name: 'Canva',
      description: 'Design stunning recipe cards, social posts & meal plan graphics',
      icon: Palette,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      url: `https://www.canva.com/create/recipe-cards/?q=${encodeURIComponent(recipeTitle || 'meal planning')}`,
      templates: ['Recipe Cards', 'Instagram Stories', 'Pinterest Pins', 'Meal Planners'],
    },
    {
      name: 'InVideo',
      description: 'Create cooking videos, tutorials & social media reels',
      icon: Video,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      url: `https://invideo.io/make/recipe-video-maker/?search=${encodeURIComponent(recipeTitle || 'cooking')}`,
      templates: ['Recipe Videos', 'Cooking Tutorials', 'TikTok/Reels', 'YouTube Shorts'],
    },
    {
      name: 'Marblism',
      description: 'Build custom meal planning apps & recipe websites',
      icon: Layout,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      url: 'https://www.marblism.com/?ref=bestmealmate',
      templates: ['Recipe Websites', 'Meal Planning Apps', 'Food Blogs', 'Restaurant Menus'],
    },
  ]

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all ${className}`}
      >
        <Sparkles className="w-4 h-4" />
        Create Content
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Create Content</h2>
                    <p className="text-white/80 text-sm">Design, video & website tools</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {tools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-5 ${tool.bgColor} rounded-2xl hover:shadow-lg transition-all group`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold ${tool.textColor}`}>{tool.name}</h3>
                        <ExternalLink className={`w-4 h-4 ${tool.textColor} opacity-50`} />
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {tool.templates.map((template) => (
                          <span
                            key={template}
                            className="px-2 py-1 bg-white/80 rounded-lg text-xs font-medium text-gray-600"
                          >
                            {template}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${tool.textColor} opacity-50 group-hover:translate-x-1 transition-transform`} />
                  </div>
                </a>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 text-center">
                  <Sparkles className="w-4 h-4 inline mr-1 text-purple-500" />
                  Create beautiful meal content to share with your family & friends!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Quick links bar for dashboard
export function ContentCreationBar({ className = '' }: { className?: string }) {
  const quickLinks = [
    {
      name: 'Canva',
      icon: Palette,
      url: 'https://www.canva.com/create/recipe-cards/',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      name: 'InVideo',
      icon: Video,
      url: 'https://invideo.io/make/recipe-video-maker/',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Marblism',
      icon: Layout,
      url: 'https://www.marblism.com/?ref=bestmealmate',
      color: 'from-orange-500 to-amber-500',
    },
  ]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-500 mr-2">Create with:</span>
      {quickLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${link.color} text-white rounded-lg text-xs font-medium hover:shadow-md transition-all`}
          title={link.name}
        >
          <link.icon className="w-3.5 h-3.5" />
          {link.name}
        </a>
      ))}
    </div>
  )
}
