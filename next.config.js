/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  images: {
    // Notion blocks server-side image optimizer requests, while browser requests
    // continue to work. Notion-rendered images opt out at component level while
    // local assets keep Next.js image optimization enabled.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "s3-us-west-2.amazonaws.com",
      },
    ],
  },
  transpilePackages: [
    "react-notion-x",
    "notion-utils",
    "prismjs",
    "pdfjs-dist",
  ],
}

module.exports = nextConfig
