/** @type {import('next').NextConfig} */
const nextConfig = {
  // Properly handle static files at root level
  headers: async () => {
    return [
      {
        source: '/ads.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
