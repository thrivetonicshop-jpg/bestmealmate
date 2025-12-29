import { NextResponse } from 'next/server'

// Serve ads.txt with proper headers for AdSense crawler
export async function GET() {
  const adsContent = `google.com, pub-3073911588578821, DIRECT, f08c47fec0942fa0`

  return new NextResponse(adsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'noindex',
    },
  })
}
