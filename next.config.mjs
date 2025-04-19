// testing-edge/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // !! IMPORTANT: Replace this with your ACTUAL Testing Edge Vercel deployment URL !!
  assetPrefix: 'https://testingedge-peter-souzas-projects.vercel.app',

  // Tell Next.js the app lives under this path prefix
  basePath: '/testing-edge',

  // Required for Vercel deployment with rewrites/server actions
  output: 'standalone',

  images: {
    // Add any remote patterns you might need for images here
    // Example:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'images.example.com',
    //   },
    // ],
  },
  experimental: {
    // Server Actions are used (contact form)
    serverActions: {
      // Allow requests originating from the master domain via rewrites
      allowedOrigins: ['www.petermsouzajr.com', 'petermsouzajr.com'],
    },
  },
};

export default nextConfig;
