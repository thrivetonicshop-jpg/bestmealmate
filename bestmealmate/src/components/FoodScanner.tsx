'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
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

interface DetectedItem {
  name: string
  quantity: string
  category: string
  confidence: number
}

interface FoodScannerProps {
  onItemsDetected: (items: DetectedItem[]) => void
  onClose: () => void
}

export default function FoodScanner({ onItemsDetected, onClose }: FoodScannerProps) {
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
    try {
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
        { name: 'Milk', quantity: '1 gallon', category: 'dairy', confidence: 0.95 },
        { name: 'Eggs', quantity: '12 count', category: 'dairy', confidence: 0.92 },
        { name: 'Chicken Breast', quantity: '2 lbs', category: 'meat', confidence: 0.88 },
        { name: 'Broccoli', quantity: '1 head', category: 'produce', confidence: 0.85 },
        { name: 'Butter', quantity: '1 stick', category: 'dairy', confidence: 0.82 },
      ]
      setDetectedItems(mockItems)
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
    onItemsDetected(selected)
    toast.success(`Added ${selected.length} items to your pantry!`)
    onClose()
  }

  // Start camera on mount
  useEffect(() => {
    if (!capturedImage) {
      startCamera()
    }
    return () => stopCamera()
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
                <div className="space-y-3 max-h-[40vh] overflow-y-auto">
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
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          selectedItems.has(index)
                            ? 'bg-brand-500 text-white'
                            : 'border-2 border-gray-300'
                        }`}
                      >
                        {selectedItems.has(index) && <Check className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} • {item.category}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {Math.round(item.confidence * 100)}%
                      </span>
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
