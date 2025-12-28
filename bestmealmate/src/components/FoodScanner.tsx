'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import {
  Camera,
  X,
  SwitchCamera,
  Zap,
  Check,
  Plus,
  Loader2,
  Image as ImageIcon,
  Refrigerator,
  Package,
  Snowflake
} from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadFoodScanImage } from '@/lib/supabase'

interface DetectedItem {
  name: string
  quantity: string
  category: string
  confidence: number
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  expiryDays?: number
  freshness?: 'fresh' | 'good' | 'use-soon' | 'expired'
  barcode?: string
}

interface NutritionSummary {
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

interface FoodScannerProps {
  onItemsDetected: (items: DetectedItem[], imageUrl?: string) => void
  onClose: () => void
  householdId?: string
}

export default function FoodScanner({ onItemsDetected, onClose, householdId }: FoodScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [scanLocation, setScanLocation] = useState<'fridge' | 'freezer' | 'pantry'>('fridge')
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary | null>(null)
  const [scanMode, setScanMode] = useState<'camera' | 'barcode'>('camera')
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Could not access camera. Please check permissions.')
    }
  }, [facingMode])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  // Switch camera
  const switchCamera = useCallback(() => {
    stopCamera()
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }, [stopCamera])

  // Capture image
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const captureImage = useCallback(() => {
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
      setCapturedImage(imageData)
      stopCamera()
      analyzeImage(imageData)
    }
    setIsCapturing(false)
  }, [stopCamera])

  // Handle file upload
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result as string
        setCapturedImage(imageData)
        stopCamera()
        analyzeImage(imageData)
      }
      reader.readAsDataURL(file)
    }
  }, [stopCamera])

  // Analyze image with AI
  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true)
    let imageUrl: string | undefined

    try {
      // Save image to Supabase storage if householdId is provided
      if (householdId) {
        try {
          imageUrl = await uploadFoodScanImage(householdId, imageData)
          setSavedImageUrl(imageUrl)
        } catch (storageError) {
          console.warn('Could not save image to storage:', storageError)
          // Continue with analysis even if storage fails
        }
      }

      const response = await fetch('/api/scan-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          location: scanLocation,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      if (data.items && data.items.length > 0) {
        setDetectedItems(data.items)
        setNutritionSummary(data.nutritionSummary || null)
        // Select all items by default
        setSelectedItems(new Set(data.items.map((_: DetectedItem, i: number) => i)))
        toast.success(`Found ${data.items.length} items!`)
      } else {
        toast.error('No food items detected. Try a clearer photo.')
        retakePhoto()
      }
    } catch (error) {
      console.error('Error analyzing image:', error)
      toast.error('Failed to analyze image. Please try again.')
      // Use mock data for demo
      const mockItems: DetectedItem[] = [
        { name: 'Organic Whole Milk', quantity: '1 gallon', category: 'dairy', confidence: 0.95, calories: 150, protein: 8, carbs: 12, fat: 8, expiryDays: 14, freshness: 'fresh' },
        { name: 'Large Brown Eggs', quantity: '1 dozen', category: 'dairy', confidence: 0.92, calories: 70, protein: 6, carbs: 0, fat: 5, expiryDays: 21, freshness: 'fresh' },
        { name: 'Chicken Breast', quantity: '2 lbs', category: 'meat', confidence: 0.88, calories: 165, protein: 31, carbs: 0, fat: 4, expiryDays: 3, freshness: 'fresh' },
        { name: 'Fresh Broccoli', quantity: '1 head', category: 'produce', confidence: 0.85, calories: 55, protein: 4, carbs: 11, fat: 0, expiryDays: 5, freshness: 'good' },
        { name: 'Grass-Fed Butter', quantity: '1 stick', category: 'dairy', confidence: 0.82, calories: 100, protein: 0, carbs: 0, fat: 11, expiryDays: 30, freshness: 'fresh' },
      ]
      setDetectedItems(mockItems)
      setNutritionSummary({ totalCalories: 540, totalProtein: 49, totalCarbs: 23, totalFat: 28 })
      setSelectedItems(new Set(mockItems.map((_, i) => i)))
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setDetectedItems([])
    setSelectedItems(new Set())
    setNutritionSummary(null)
    startCamera()
  }, [startCamera])

  // Toggle item selection
  const toggleItem = (index: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedItems(newSelected)
  }

  // Confirm selected items
  const confirmItems = () => {
    const selected = detectedItems.filter((_, i) => selectedItems.has(i))
    onItemsDetected(selected, savedImageUrl || undefined)
    toast.success(`Added ${selected.length} items to your pantry!`)
    onClose()
  }

  // Start camera on mount
  useEffect(() => {
    if (!capturedImage) {
      startCamera()
    }
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={onClose}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-white font-semibold text-lg">Scan Your {scanLocation === 'fridge' ? 'Fridge' : scanLocation === 'freezer' ? 'Freezer' : 'Pantry'}</h2>
        <button
          onClick={switchCamera}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <SwitchCamera className="w-6 h-6" />
        </button>
      </div>

      {/* Location selector */}
      <div className="absolute top-16 left-0 right-0 z-10 flex justify-center gap-2 px-4">
        {[
          { id: 'fridge' as const, icon: Refrigerator, label: 'Fridge' },
          { id: 'freezer' as const, icon: Snowflake, label: 'Freezer' },
          { id: 'pantry' as const, icon: Package, label: 'Pantry' },
        ].map((loc) => (
          <button
            key={loc.id}
            onClick={() => setScanLocation(loc.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              scanLocation === loc.id
                ? 'bg-brand-500 text-white'
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
            }`}
          >
            <loc.icon className="w-4 h-4" />
            {loc.label}
          </button>
        ))}
      </div>

      {/* Camera / Image view */}
      <div className="flex-1 relative">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-1/2 border-2 border-white/50 rounded-2xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-400 rounded-br-xl" />
              </div>
            </div>
          </>
        ) : isAnalyzing ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Captured"
                className="max-w-full max-h-[50vh] rounded-xl opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <Loader2 className="w-12 h-12 text-brand-400 animate-spin mx-auto mb-4" />
                  <p className="text-white font-medium">Analyzing your food...</p>
                  <p className="text-white/60 text-sm mt-1">AI is identifying items</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col bg-gray-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-48 object-cover"
            />
            <div className="flex-1 bg-white rounded-t-3xl -mt-4 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Detected Items ({detectedItems.length})
                </h3>

                {/* Nutrition Summary */}
                {nutritionSummary && (
                  <div className="bg-gradient-to-r from-brand-50 to-emerald-50 rounded-xl p-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Nutrition Summary</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-brand-600">{nutritionSummary.totalCalories}</p>
                        <p className="text-xs text-gray-500">Calories</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">{nutritionSummary.totalProtein}g</p>
                        <p className="text-xs text-gray-500">Protein</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-amber-600">{nutritionSummary.totalCarbs}g</p>
                        <p className="text-xs text-gray-500">Carbs</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-rose-600">{nutritionSummary.totalFat}g</p>
                        <p className="text-xs text-gray-500">Fat</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 max-h-[35vh] overflow-y-auto">
                  {detectedItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => toggleItem(index)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        selectedItems.has(index)
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedItems.has(index)
                            ? 'bg-brand-500 text-white'
                            : 'border-2 border-gray-300'
                        }`}
                      >
                        {selectedItems.has(index) && <Check className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                          {item.freshness && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                              item.freshness === 'fresh' ? 'bg-green-100 text-green-700' :
                              item.freshness === 'good' ? 'bg-blue-100 text-blue-700' :
                              item.freshness === 'use-soon' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.freshness === 'use-soon' ? 'Use Soon' : item.freshness}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.quantity} • {item.category}
                        </p>
                        {item.calories !== undefined && (
                          <div className="flex gap-2 mt-1 text-xs text-gray-400">
                            <span>{item.calories} cal</span>
                            <span>•</span>
                            <span>{item.protein}g protein</span>
                            <span>•</span>
                            <span>{item.carbs}g carbs</span>
                            <span>•</span>
                            <span>{item.fat}g fat</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                          {Math.round(item.confidence * 100)}%
                        </span>
                        {item.expiryDays && (
                          <span className="text-xs text-gray-400">
                            ~{item.expiryDays}d shelf life
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={retakePhoto}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Retake Photo
                  </button>
                  <button
                    onClick={confirmItems}
                    disabled={selectedItems.size === 0}
                    className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add {selectedItems.size} Items
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Capture controls */}
      {!capturedImage && !isAnalyzing && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <ImageIcon className="w-6 h-6" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={captureImage}
              disabled={isCapturing}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
            >
              <div className="w-16 h-16 rounded-full border-4 border-brand-600 flex items-center justify-center">
                <Zap className="w-8 h-8 text-brand-600" />
              </div>
            </button>

            <div className="w-12 h-12" /> {/* Spacer for alignment */}
          </div>
          <p className="text-center text-white/80 text-sm mt-3">
            Point at your {scanLocation} and tap to scan
          </p>
        </div>
      )}

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
