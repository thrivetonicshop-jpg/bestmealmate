'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChefHat, Lock, Eye, EyeOff, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const [isProcessingToken, setIsProcessingToken] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Handle the hash fragment from Supabase password reset email
    const handleHashParams = async () => {
      // Get hash parameters (Supabase puts tokens in hash for password reset)
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)

      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const type = params.get('type')

      // If we have tokens from the hash (password recovery link)
      if (accessToken && type === 'recovery') {
        try {
          // Set the session using the tokens from the hash
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          })

          if (sessionError) {
            console.error('Session error:', sessionError)
            setError(sessionError.message)
            setIsValidSession(false)
          } else {
            setIsValidSession(true)
            // Clear the hash from URL for security
            window.history.replaceState(null, '', window.location.pathname)
          }
        } catch (err) {
          console.error('Error setting session:', err)
          setIsValidSession(false)
        }
      } else {
        // No hash tokens, check for existing session
        const { data: { session } } = await supabase.auth.getSession()
        setIsValidSession(!!session)
      }

      setIsProcessingToken(false)
    }

    handleHashParams()
  }, [])

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8
    const hasUppercase = /[A-Z]/.test(pwd)
    const hasLowercase = /[a-z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    return { minLength, hasUppercase, hasLowercase, hasNumber, isValid: minLength && hasUppercase && hasLowercase && hasNumber }
  }

  const passwordValidation = validatePassword(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!passwordValidation.isValid) {
      setError('Password does not meet requirements')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
      } else {
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Password update error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while processing the token
  if (isProcessingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your reset link...</p>
        </div>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <header className="p-4 sm:p-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BestMealMate</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid or Expired Link
            </h1>
            <p className="text-gray-600 mb-8">
              This password reset link is invalid or has expired. Please request a new one.
            </p>

            <Link
              href="/forgot-password"
              className="inline-block w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:shadow-glow transition-all text-center"
            >
              Request New Link
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">BestMealMate</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {!isSuccess ? (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create new password
              </h1>
              <p className="text-gray-600 mb-8">
                Your new password must be different from previously used passwords.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    New password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password requirements */}
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500 mb-2">Password must contain:</p>
                    {[
                      { check: passwordValidation.minLength, label: 'At least 8 characters' },
                      { check: passwordValidation.hasUppercase, label: 'One uppercase letter' },
                      { check: passwordValidation.hasLowercase, label: 'One lowercase letter' },
                      { check: passwordValidation.hasNumber, label: 'One number' },
                    ].map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          req.check ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {req.check && <CheckCircle className="w-3 h-3" />}
                        </div>
                        <span className={req.check ? 'text-green-600' : 'text-gray-500'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-2 text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !passwordValidation.isValid || password !== confirmPassword}
                  className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Password updated!
              </h1>
              <p className="text-gray-600 mb-8">
                Your password has been successfully reset. You&apos;ll be redirected to the login page shortly.
              </p>

              <Link
                href="/login"
                className="inline-block w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:shadow-glow transition-all text-center"
              >
                Sign In Now
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© 2025 BestMealMate. All rights reserved.</p>
      </footer>
    </div>
  )
}
