'use client'

import { useState } from 'react'
import { Link2, Loader2, Check, AlertCircle, X } from 'lucide-react'

interface ImportedRecipe {
  id: string
  name: string
  description: string
  cuisine: string
  meal_type: string
  prep_time: number
  cook_time: number
  servings: number
  difficulty: string
  ingredients: string[]
  instructions: string[]
  dietary: string[]
  calories: number
  image_url?: string
  source_url: string
}

interface RecipeImporterProps {
  onRecipeImported: (recipe: ImportedRecipe) => void
  onClose: () => void
}

export default function RecipeImporter({ onRecipeImported, onClose }: RecipeImporterProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [importedRecipe, setImportedRecipe] = useState<ImportedRecipe | null>(null)

  async function handleImport(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/import-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to import recipe')
      }

      setImportedRecipe(data.recipe)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import recipe')
    } finally {
      setLoading(false)
    }
  }

  function handleSave() {
    if (importedRecipe) {
      onRecipeImported(importedRecipe)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Import Recipe from URL
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!importedRecipe ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Paste a URL from any recipe website and we&apos;ll automatically extract the recipe details.
              </p>

              <form onSubmit={handleImport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipe URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/recipe/..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="w-full py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Importing Recipe...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-5 h-5" />
                      Import Recipe
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Supported Sites</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Works with most recipe websites including AllRecipes, Food Network, Epicurious,
                  Serious Eats, Bon Appétit, NYT Cooking, and many more.
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <Check className="w-5 h-5" />
                <p className="font-medium">Recipe imported successfully!</p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {importedRecipe.image_url && (
                  <img
                    src={importedRecipe.image_url}
                    alt={importedRecipe.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {importedRecipe.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {importedRecipe.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Cuisine:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{importedRecipe.cuisine}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Meal:</span>
                      <span className="ml-2 text-gray-900 dark:text-white capitalize">{importedRecipe.meal_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Prep:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{importedRecipe.prep_time} min</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Cook:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{importedRecipe.cook_time} min</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Servings:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{importedRecipe.servings}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Calories:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{importedRecipe.calories}</span>
                    </div>
                  </div>

                  {importedRecipe.dietary && importedRecipe.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {importedRecipe.dietary.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Ingredients ({importedRecipe.ingredients?.length || 0})
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                      {importedRecipe.ingredients?.slice(0, 5).map((ing, i) => (
                        <li key={i}>• {ing}</li>
                      ))}
                      {importedRecipe.ingredients?.length > 5 && (
                        <li className="text-gray-400">...and {importedRecipe.ingredients.length - 5} more</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Instructions ({importedRecipe.instructions?.length || 0} steps)
                    </h4>
                    <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                      {importedRecipe.instructions?.slice(0, 3).map((step, i) => (
                        <li key={i}>{i + 1}. {step.slice(0, 100)}...</li>
                      ))}
                      {importedRecipe.instructions?.length > 3 && (
                        <li className="text-gray-400">...and {importedRecipe.instructions.length - 3} more steps</li>
                      )}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {importedRecipe && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button
              onClick={() => setImportedRecipe(null)}
              className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Import Another
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save Recipe
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
