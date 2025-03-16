/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_OPENWEATHER_API_KEY: '7b4a766ffb18c999689c79b166a6d446',
    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
  },
  images: {
    domains: ['openweathermap.org', 'maps.googleapis.com', 'maps.gstatic.com', 'openweathermap.co.uk', 'images.unsplash.com', 'api.openweathermap.org'],
  },
  // Configure Content Security Policy for Google Maps and allow localhost for Puppeteer
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.gstatic.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: *.openweathermap.org *.googleapis.com *.gstatic.com; font-src 'self' data: *.googleapis.com *.gstatic.com; connect-src 'self' *.openweathermap.org *.googleapis.com localhost:3025 localhost:8080; frame-src 'self' *.googleapis.com; object-src 'none'"
          }
        ]
      }
    ]
  },
  // Update for better error handling
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  // Disable source maps in production for better performance
  productionBrowserSourceMaps: false,
  // Add custom webpack config
  webpack: (config, { dev, isServer }) => {
    // Optimize in production
    if (!dev) {
      config.optimization.minimize = true;
    }
    return config;
  },
  // Added for MCP compatibility
  experimental: {
    // Allow remote patterns for image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Improve stability with MCP tools
    optimizeCss: true,
    scrollRestoration: true,
  },
}

module.exports = nextConfig 