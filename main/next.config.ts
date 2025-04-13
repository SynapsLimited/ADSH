import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: false, // Disable CSS optimization that might cause preload
  },
};

export default nextConfig;
