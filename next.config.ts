import type { NextConfig } from "next";

// Static export so the site can be served from GitHub Pages or Vercel.
// For GitHub Pages under /my-website set NEXT_PUBLIC_BASE_PATH=/my-website at build time.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
