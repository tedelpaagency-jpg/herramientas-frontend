/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      {
        source: '/propiedad/:slug*',
        destination: '/properties/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
