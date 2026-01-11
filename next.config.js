/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Disable image optimization for development
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 's3-us-west-2.amazonaws.com',
      },
    ],
  },
  transpilePackages: [
    'react-notion-x',
    'notion-utils',
    'prismjs',
    'pdfjs-dist',
  ],
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  webpack: (config, { isServer }) => {
    // Exclude react-pdf and pdfjs-dist which have SSR compatibility issues
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-pdf': false,
      'pdfjs-dist': false,
    };

    // Provide fallback for canvas module in client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      };
    }
    return config;
  },
  // Allow webpack config alongside Turbopack
  turbopack: {},
}

module.exports = nextConfig
