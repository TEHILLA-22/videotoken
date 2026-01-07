import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        pathname: '/ipfs/*',
      },
      {
        protocol: 'https',
        hostname: 'amaranth-advanced-gerbil-6.mypinata.cloud',
        pathname: '/ipfs/*',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing/tokens',
        permanent: true, // set to false if you want it temporary
      },
    ];
  },
};

export default nextConfig;
