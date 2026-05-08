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
        ],
      },
    ];
  },

  // Redirects for www/non-www consistency and canonical handling
  async redirects() {
    return [
      // Redirect www to non-www (or vice versa - adjust based on your canonical preference)
      {
        source: '/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },

  // Rewrites (for future use)
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
