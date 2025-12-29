'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Camera,
  X,
  Plus,
  Loader2,
  ChefHat,
  Refrigerator,
  Package,
  Sparkles,
  Clock,
  Users,
  Flame,
  Check,
  Trash2,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ScannedImage {
  id: string
  image: string
  location: 'fridge' | 'pantry' | 'cabinet' | 'spices' | 'other'
  label: string
}

interface Ingredient {
  name: string
  quantity: string
  category: string
}

interface MealSuggestion {
  name: string
  description: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  ingredients: string[]
  instructions: string[]
  matchedIngredients: string[]
  missingIngredients: string[]
  calories: number
  tags: string[]
}

interface ScanAndCookProps {
  onClose: () => void
  onSelectMeal?: (meal: MealSuggestion) => void
}

const SCAN_LOCATIONS = [
  { id: 'fridge' as const, icon: Refrigerator, label: 'Fridge', color: 'from-blue-500 to-cyan-500' },
  { id: 'pantry' as const, icon: Package, label: 'Pantry', color: 'from-amber-500 to-orange-500' },
  { id: 'cabinet' as const, icon: Package, label: 'Cabinet', color: 'from-emerald-500 to-green-500' },
  { id: 'spices' as const, icon: Sparkles, label: 'Spices', color: 'from-purple-500 to-pink-500' },
  { id: 'other' as const, icon: ImageIcon, label: 'Other', color: 'from-gray-500 to-slate-500' },
]

export default function ScanAndCook({ onClose, onSelectMeal }: ScanAndCookProps) {
  const [step, setStep] = useState<'scan' | 'analyzing' | 'results'>('scan')
  const [scannedImages, setScannedImages] = useState<ScannedImage[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [meals, setMeals] = useState<MealSuggestion[]>([])
  const [selectedLocation, setSelectedLocation] = useState<ScannedImage['location']>('fridge')
  const [isCapturing, setIsCapturing] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = mediaStream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setShowCamera(true)
    } catch (error) {
      console.error('Camera error:', error)
      toast.error('Could not access camera. Please use file upload.')
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }, [])

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg', 0.8)

      const newImage: ScannedImage = {
        id: Date.now().toString(),
        image: imageData,
        location: selectedLocation,
        label: SCAN_LOCATIONS.find(l => l.id === selectedLocation)?.label || 'Photo',
      }

      setScannedImages(prev => [...prev, newImage])
      toast.success(`${newImage.label} photo added!`)
    }

    setIsCapturing(false)
    stopCamera()
  }, [selectedLocation, stopCamera])

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImage: ScannedImage = {
          id: Date.now().toString() + Math.random(),
          image: reader.result as string,
          location: selectedLocation,
          label: SCAN_LOCATIONS.find(l => l.id === selectedLocation)?.label || 'Photo',
        }
        setScannedImages(prev => [...prev, newImage])
        toast.success(`${newImage.label} photo added!`)
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [selectedLocation])

  // Remove image
  const removeImage = (id: string) => {
    setScannedImages(prev => prev.filter(img => img.id !== id))
  }

  // Analyze and generate meals
  const analyzAndCook = async () => {
    if (scannedImages.length === 0) {
      toast.error('Please add at least one photo')
      return
    }

    setStep('analyzing')

    try {
      const response = await fetch('/api/scan-and-cook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: scannedImages.map(img => ({
            image: img.image,
            location: img.location,
          })),
          familySize: 4,
          mealType: 'dinner',
        }),
      })

      const data = await response.json()

      if (data.ingredients) {
        setIngredients(data.ingredients)
      }
      if (data.meals) {
        setMeals(data.meals)
      }

      setStep('results')
      toast.success(`Found ${data.totalIngredients} ingredients, ${data.totalMeals} meal ideas!`)
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze. Please try again.')
      setStep('scan')
    }
  }

  // Select a meal
  const handleSelectMeal = (meal: MealSuggestion, index: number) => {
    setSelectedMealIndex(index)
    if (onSelectMeal) {
      onSelectMeal(meal)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-emerald-600 p-4 flex items-center justify-between">
        <button onClick={onClose} className="p-2 text-white/80 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-white font-bold text-lg flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Scan & Cook
        </h1>
        <div className="w-10" />
      </div>

      {/* Step indicator */}
      <div className="bg-gray-800 px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          {['Scan Food', 'AI Analysis', 'Meal Ideas'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                (step === 'scan' && i === 0) || (step === 'analyzing' && i === 1) || (step === 'results' && i === 2)
                  ? 'bg-brand-500 text-white'
                  : i < (['scan', 'analyzing', 'results'].indexOf(step))
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-400'
              }`}>
                {i < (['scan', 'analyzing', 'results'].indexOf(step)) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{i + 1}</span>
                )}
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < 2 && <ArrowRight className="w-4 h-4 text-gray-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {step === 'scan' && (
          <div className="p-4 space-y-6">
            {/* Instructions */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <h2 className="text-white font-semibold mb-2">Take photos of your ingredients</h2>
              <p className="text-gray-400 text-sm">
                Snap pictures of your fridge, pantry, cabinets, and spices. Claude AI will identify
                all ingredients and suggest delicious meals you can make!
              </p>
            </div>

            {/* Location selector */}
            <div>
              <p className="text-gray-400 text-sm mb-3">What are you scanning?</p>
              <div className="flex flex-wrap gap-2">
                {SCAN_LOCATIONS.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedLocation === loc.id
                        ? `bg-gradient-to-r ${loc.color} text-white shadow-lg`
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <loc.icon className="w-4 h-4" />
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera view */}
            {showCamera && (
              <div className="relative rounded-2xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-3/4 border-2 border-white/50 rounded-xl" />
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={stopCamera}
                    className="px-6 py-3 bg-gray-800/80 text-white rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    disabled={isCapturing}
                    className="px-6 py-3 bg-brand-500 text-white rounded-xl font-medium flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Capture
                  </button>
                </div>
              </div>
            )}

            {/* Add photo buttons */}
            {!showCamera && (
              <div className="flex gap-3">
                <button
                  onClick={startCamera}
                  className="flex-1 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-4 bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-5 h-5" />
                  Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Scanned images */}
            {scannedImages.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm mb-3">
                  Scanned photos ({scannedImages.length})
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {scannedImages.map(img => (
                    <div key={img.id} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.image}
                        alt={img.label}
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-b-xl">
                        <p className="text-white text-xs font-medium">{img.label}</p>
                      </div>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-gray-800 rounded-xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-brand-500 hover:text-brand-400 transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs">Add more</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'analyzing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 flex items-center justify-center animate-pulse">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
              <Loader2 className="absolute -bottom-2 -right-2 w-8 h-8 text-brand-400 animate-spin" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Claude is analyzing your ingredients...</h2>
            <p className="text-gray-400 mb-4">
              Identifying items from {scannedImages.length} photo{scannedImages.length > 1 ? 's' : ''} and crafting meal ideas
            </p>
            <div className="flex gap-2">
              {scannedImages.slice(0, 4).map(img => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.image}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover opacity-50"
                />
              ))}
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="p-4 space-y-6">
            {/* Ingredients found */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                Ingredients Found ({ingredients.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-full text-sm"
                  >
                    {ing.quantity} {ing.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Meal suggestions */}
            <div>
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-brand-400" />
                Meal Ideas for You
              </h2>
              <div className="space-y-4">
                {meals.map((meal, index) => (
                  <div
                    key={index}
                    className={`bg-gray-800 rounded-2xl overflow-hidden transition-all ${
                      selectedMealIndex === index ? 'ring-2 ring-brand-500' : ''
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg">{meal.name}</h3>
                          <p className="text-gray-400 text-sm">{meal.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          meal.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          meal.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {meal.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {meal.prepTime + meal.cookTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {meal.servings} servings
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {meal.calories} cal
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {meal.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-brand-500/20 text-brand-400 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {meal.missingIngredients.length > 0 && (
                        <div className="bg-amber-500/10 rounded-xl p-3 mb-4">
                          <p className="text-amber-400 text-sm font-medium mb-1">You may need:</p>
                          <p className="text-gray-400 text-sm">{meal.missingIngredients.join(', ')}</p>
                        </div>
                      )}

                      <button
                        onClick={() => handleSelectMeal(meal, index)}
                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                          selectedMealIndex === index
                            ? 'bg-brand-500 text-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {selectedMealIndex === index ? (
                          <>
                            <Check className="w-5 h-5" />
                            Selected
                          </>
                        ) : (
                          <>
                            <ChefHat className="w-5 h-5" />
                            Cook This
                          </>
                        )}
                      </button>
                    </div>

                    {selectedMealIndex === index && (
                      <div className="border-t border-gray-700 p-4 bg-gray-900/50">
                        <h4 className="text-white font-semibold mb-3">Instructions</h4>
                        <ol className="space-y-2">
                          {meal.instructions.map((step, i) => (
                            <li key={i} className="flex gap-3 text-gray-300 text-sm">
                              <span className="w-6 h-6 bg-brand-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action */}
      {step === 'scan' && scannedImages.length > 0 && !showCamera && (
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <button
            onClick={analyzAndCook}
            className="w-full py-4 bg-gradient-to-r from-brand-500 to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <ChefHat className="w-5 h-5" />
            Analyze & Get Meal Ideas
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 'results' && (
        <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-3">
          <button
            onClick={() => {
              setStep('scan')
              setScannedImages([])
              setIngredients([])
              setMeals([])
              setSelectedMealIndex(null)
            }}
            className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-semibold"
          >
            Scan Again
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-brand-500 text-white rounded-xl font-semibold"
          >
            Done
          </button>
        </div>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
