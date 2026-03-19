import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Silence the multiple-lockfiles workspace root warning
  outputFileTracingRoot: path.join(import.meta.dirname, './'),
}

export default nextConfig