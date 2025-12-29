'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  X,
  SwitchCamera,
  Loader2,
  Check,
  Plus,
  Barcode,
  Search,
  Package
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ScannedProduct {
  barcode: string
  name: string
  brand?: string
  category?: string
  quantity?: string
  imageUrl?: string
  nutrition?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
}

interface BarcodeScannerProps {
  onProductScanned: (product: ScannedProduct) => void
  onClose: () => void
}

export default function BarcodeScanner({ onProductScanned, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [isScanning, setIsScanning] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null)
  const [manualBarcode, setManualBarcode] = useState('')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)

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
      setIsScanning(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Could not access camera. Please check permissions.')
      setShowManualEntry(true)
    }
  }, [facingMode])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }, [stream])

  // Switch camera
  const switchCamera = useCallback(() => {
    stopCamera()
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }, [stopCamera])

  // Look up barcode
  const lookupBarcode = async (barcode: string) => {
    if (barcode === lastScannedCode) return
    setLastScannedCode(barcode)
    setIsLookingUp(true)

    try {
      const response = await fetch('/api/barcode-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      })

      if (!response.ok) {
        throw new Error('Failed to lookup barcode')
      }

      const data = await response.json()

      if (data.product) {
        setScannedProduct(data.product)
        stopCamera()
        toast.success(`Found: ${data.product.name}`)
      } else {
        toast.error('Product not found. Try manual entry.')
        setShowManualEntry(true)
      }
    } catch (error) {
      console.error('Error looking up barcode:', error)
      // Use fallback product for demo
      const fallbackProduct: ScannedProduct = {
        barcode,
        name: 'Unknown Product',
        category: 'Other',
        quantity: '1',
      }
      setScannedProduct(fallbackProduct)
      stopCamera()
    } finally {
      setIsLookingUp(false)
    }
  }

  // Scan for barcodes using BarcodeDetector API
  const scanForBarcodes = useCallback(async () => {
    if (!videoRef.current || !isScanning) return

    // Check if BarcodeDetector is available
    if ('BarcodeDetector' in window) {
      try {
        // @ts-expect-error - BarcodeDetector is not in TypeScript types yet
        const barcodeDetector = new window.BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code']
        })

        const barcodes = await barcodeDetector.detect(videoRef.current)

        if (barcodes.length > 0) {
          const barcode = barcodes[0].rawValue
          console.log('Barcode detected:', barcode)
          lookupBarcode(barcode)
        }
      } catch (error) {
        console.error('Barcode detection error:', error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning])

  // Continuous scanning
  useEffect(() => {
    if (!isScanning || isLookingUp || scannedProduct) return

    const interval = setInterval(scanForBarcodes, 500)
    return () => clearInterval(interval)
  }, [isScanning, isLookingUp, scannedProduct, scanForBarcodes])

  // Handle manual barcode entry
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualBarcode.trim()) {
      lookupBarcode(manualBarcode.trim())
    }
  }

  // Confirm scanned product
  const confirmProduct = () => {
    if (scannedProduct) {
      onProductScanned(scannedProduct)
      toast.success(`Added ${scannedProduct.name} to pantry!`)
      onClose()
    }
  }

  // Scan another
  const scanAnother = () => {
    setScannedProduct(null)
    setLastScannedCode(null)
    setShowManualEntry(false)
    startCamera()
  }

  // Start camera on mount
  useEffect(() => {
    startCamera()
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
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Barcode className="w-5 h-5" />
          Scan Barcode
        </h2>
        <button
          onClick={switchCamera}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <SwitchCamera className="w-6 h-6" />
        </button>
      </div>

      {/* Camera / Result view */}
      <div className="flex-1 relative">
        {!scannedProduct && !showManualEntry ? (
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
              <div className="w-4/5 h-32 border-2 border-white/50 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-400 rounded-br-xl" />
                {/* Scanning line animation */}
                <div className="absolute inset-x-0 h-0.5 bg-brand-400 animate-pulse"
                  style={{
                    top: '50%',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
                  }}
                />
              </div>
            </div>
            {isLookingUp && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl p-6 text-center">
                  <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
                  <p className="font-medium text-gray-900">Looking up product...</p>
                </div>
              </div>
            )}
          </>
        ) : showManualEntry && !scannedProduct ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-6">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="text-center mb-6">
                <Search className="w-12 h-12 text-brand-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Enter Barcode Manually</h3>
                <p className="text-gray-500 mt-1">Type the barcode number below</p>
              </div>
              <form onSubmit={handleManualSubmit}>
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="e.g., 012345678901"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-500 outline-none text-lg text-center tracking-widest"
                  autoFocus
                />
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowManualEntry(false)
                      startCamera()
                    }}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back to Camera
                  </button>
                  <button
                    type="submit"
                    disabled={!manualBarcode.trim() || isLookingUp}
                    className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLookingUp ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Look Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : scannedProduct ? (
          <div className="w-full h-full flex flex-col bg-gray-900">
            {/* Product Image */}
            <div className="h-48 bg-gradient-to-b from-brand-500 to-brand-600 flex items-center justify-center">
              {scannedProduct.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={scannedProduct.imageUrl}
                  alt={scannedProduct.name}
                  className="w-32 h-32 object-contain bg-white rounded-xl p-2"
                />
              ) : (
                <div className="w-32 h-32 bg-white/20 rounded-xl flex items-center justify-center">
                  <Package className="w-16 h-16 text-white/60" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 bg-white rounded-t-3xl -mt-4 overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{scannedProduct.name}</h3>
                  {scannedProduct.brand && (
                    <p className="text-gray-500">{scannedProduct.brand}</p>
                  )}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                      {scannedProduct.barcode}
                    </span>
                    {scannedProduct.category && (
                      <span className="bg-brand-100 text-brand-700 text-sm px-3 py-1 rounded-full">
                        {scannedProduct.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Nutrition Info */}
                {scannedProduct.nutrition && (
                  <div className="bg-gradient-to-r from-brand-50 to-emerald-50 rounded-xl p-4 mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Nutrition per serving</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-brand-600">{scannedProduct.nutrition.calories || '-'}</p>
                        <p className="text-xs text-gray-500">Calories</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">{scannedProduct.nutrition.protein || '-'}g</p>
                        <p className="text-xs text-gray-500">Protein</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-amber-600">{scannedProduct.nutrition.carbs || '-'}g</p>
                        <p className="text-xs text-gray-500">Carbs</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-rose-600">{scannedProduct.nutrition.fat || '-'}g</p>
                        <p className="text-xs text-gray-500">Fat</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={scanAnother}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={confirmProduct}
                    className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Pantry
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom controls */}
      {!scannedProduct && !showManualEntry && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowManualEntry(true)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-colors"
            >
              Enter Barcode Manually
            </button>
            <p className="text-center text-white/80 text-sm mt-3">
              Point camera at barcode to scan
            </p>
          </div>
        </div>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
