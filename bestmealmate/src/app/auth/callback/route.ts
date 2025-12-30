import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const type = requestUrl.searchParams.get('type') // recovery, signup, etc.

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error.message)
      // Redirect to login with error
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
    }

    // For password recovery, redirect to reset-password page
    if (type === 'recovery') {
      const response = NextResponse.redirect(new URL('/reset-password', request.url))
      // Set the session in cookies for the client
      if (data.session) {
        response.cookies.set('sb-auth-token', JSON.stringify(data.session), {
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        })
      }
      return response
    }

    // Set session cookies for authenticated requests
    const response = NextResponse.redirect(new URL(next, request.url))
    if (data.session) {
      response.cookies.set('sb-auth-token', JSON.stringify(data.session), {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
    }
    return response
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}
