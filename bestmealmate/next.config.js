/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Improve build performance
  swcMinify: true,
  // Handle missing env vars during build
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  },
  // Experimental features for better Vercel compatibility
  experimental: {
    serverComponentsExternalPackages: ['stripe', '@anthropic-ai/sdk'],
  },
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle external packages properly
    if (isServer) {
      config.externals = config.externals || []
    }
    return config
  },
}

module.exports = nextConfig
