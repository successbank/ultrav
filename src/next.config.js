/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ultrav.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'ultrav.co.kr',
      },
    ],
  },
}

module.exports = nextConfig
