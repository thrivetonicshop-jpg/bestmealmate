import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    )
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    })

    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
        )
      }

      if (data.session) {
        // Set cookies for the session
        const cookieStore = await cookies()

        // Set access token cookie
        cookieStore.set('sb-access-token', data.session.access_token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: data.session.expires_in || 3600,
        })

        // Set refresh token cookie
        cookieStore.set('sb-refresh-token', data.session.refresh_token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        })
      }
    } catch (err) {
      console.error('Session exchange failed:', err)
      return NextResponse.redirect(
        new URL('/login?error=session_exchange_failed', request.url)
      )
    }
  }

  // Check if this is a password reset callback
  const type = requestUrl.searchParams.get('type')
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/reset-password', request.url))
  }

  // Check if this is an email confirmation
  if (type === 'signup' || type === 'email_change') {
    return NextResponse.redirect(new URL('/dashboard?verified=true', request.url))
  }

  // Default redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
