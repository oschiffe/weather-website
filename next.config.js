/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_OPENWEATHER_API_KEY: '7b4a766ffb18c999689c79b166a6d446',
  },
  images: {
    domains: ['openweathermap.org', 'openweathermap.co.uk', 'images.unsplash.com', 'api.openweathermap.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Configure Content Security Policy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *.openweathermap.org *.openstreetmap.org *.tile.openstreetmap.org; font-src 'self' data:; connect-src 'self' *.openweathermap.org localhost:3025 localhost:8080 *.tile.openstreetmap.org; frame-src 'self'; object-src 'none'"
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
    // Improve stability with MCP tools
    optimizeCss: true,
    scrollRestoration: true,
  },
}

module.exports = nextConfig 