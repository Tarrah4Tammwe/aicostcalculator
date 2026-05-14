/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    unoptimized: false,
    domains: [],
  },

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow'
          }
        ],
      },
    ];
  },

  // Redirects for www/non-www consistency and HTTPS enforcement
  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: '/:path*',
        destination: 'https://aicostcalculator.dev/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'www.aicostcalculator.dev'
          }
        ]
      },
      // Force HTTPS
      {
        source: '/:path*',
        destination: 'https://aicostcalculator.dev/:path*',
        permanent: true,
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http'
          }
        ]
      }
    ];
  },

  // Rewrites (for future use)
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
