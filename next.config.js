const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    if (!isProd) return []

    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://s3.tradingview.com https://s.tradingview.com https://js.stripe.com https://buy.moonpay.com https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://*.supabase.co https://assets.tradingview.com;
      frame-src https://js.stripe.com https://hooks.stripe.com https://buy.moonpay.com https://s.tradingview.com https://widget.coinbase.com;
      connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.moonpay.com https://api.commerce.coinbase.com https://s3.tradingview.com https://api.sentry.io;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
