'use client'

import { useState, useEffect, useCallback } from 'react'
import { GeneratedRecipe } from '@/lib/recipe-generator'

interface UseRecipesOptions {
  initialPage?: number
  limit?: number
  query?: string
  cuisine?: string
  mealType?: string
  difficulty?: string
  maxTime?: number
  kidFriendly?: boolean
  tags?: string[]
}

interface UseRecipesReturn {
  recipes: GeneratedRecipe[]
  loading: boolean
  error: string | null
  hasMore: boolean
  page: number
  total: number
  isOffline: boolean
  loadMore: () => void
  refresh: () => void
  saveForOffline: (recipe: GeneratedRecipe) => void
  getOfflineRecipes: () => Promise<GeneratedRecipe[]>
}

export function useRecipes(options: UseRecipesOptions = {}): UseRecipesReturn {
  const [recipes, setRecipes] = useState<GeneratedRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(options.initialPage || 0)
  const [total, setTotal] = useState(0)
  const [isOffline, setIsOffline] = useState(false)

  const limit = options.limit || 50

  const buildUrl = useCallback((pageNum: number) => {
    const params = new URLSearchParams()
    params.set('page', pageNum.toString())
    params.set('limit', limit.toString())

    if (options.query) params.set('q', options.query)
    if (options.cuisine) params.set('cuisine', options.cuisine)
    if (options.mealType) params.set('mealType', options.mealType)
    if (options.difficulty) params.set('difficulty', options.difficulty)
    if (options.maxTime) params.set('maxTime', options.maxTime.toString())
    if (options.kidFriendly) params.set('kidFriendly', 'true')
    if (options.tags?.length) params.set('tags', options.tags.join(','))

    return `/api/recipes?${params.toString()}`
  }, [limit, options])

  const fetchRecipes = useCallback(async (pageNum: number, append: boolean = false) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(buildUrl(pageNum))
      const data = await response.json()

      if (data.offline) {
        setIsOffline(true)
      } else {
        setIsOffline(false)
      }

      if (data.error && !data.recipes) {
        throw new Error(data.error)
      }

      const newRecipes = data.recipes || []

      if (append) {
        setRecipes(prev => [...prev, ...newRecipes])
      } else {
        setRecipes(newRecipes)
      }

      setHasMore(data.hasMore ?? newRecipes.length === limit)
      setTotal(data.total || 0)
      setPage(pageNum)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes')

      // Try to get offline recipes
      if (!append) {
        const offlineRecipes = await getOfflineRecipes()
        if (offlineRecipes.length > 0) {
          setRecipes(offlineRecipes)
          setIsOffline(true)
          setError(null)
        }
      }
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildUrl, limit])

  const tagsKey = options.tags?.join(',') || ''

  useEffect(() => {
    fetchRecipes(0, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.query, options.cuisine, options.mealType, options.difficulty, options.maxTime, options.kidFriendly, tagsKey])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchRecipes(page + 1, true)
    }
  }, [fetchRecipes, loading, hasMore, page])

  const refresh = useCallback(() => {
    setRecipes([])
    fetchRecipes(0, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveForOffline = useCallback((recipe: GeneratedRecipe) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_RECIPE',
        recipeId: recipe.id,
        recipeData: recipe
      })
    }
  }, [])

  const getOfflineRecipes = useCallback(async (): Promise<GeneratedRecipe[]> => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return []
    }

    const controller = navigator.serviceWorker.controller
    if (!controller) {
      return []
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.recipes || [])
      }

      controller.postMessage(
        { type: 'GET_CACHED_RECIPES' },
        [messageChannel.port2]
      )

      // Timeout after 2 seconds
      setTimeout(() => resolve([]), 2000)
    })
  }, [])

  return {
    recipes,
    loading,
    error,
    hasMore,
    page,
    total,
    isOffline,
    loadMore,
    refresh,
    saveForOffline,
    getOfflineRecipes
  }
}

export function useRecipe(id: string) {
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecipe() {
      setLoading(true)
      try {
        const response = await fetch(`/api/recipes?id=${id}`)
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setRecipe(data.recipe)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipe')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRecipe()
    }
  }, [id])

  return { recipe, loading, error }
}
