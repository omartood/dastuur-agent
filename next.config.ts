import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to acknowledge we're using Turbopack
  turbopack: {},
  // Mark Memvid SDK as external for server components (Next.js 16+)
  serverExternalPackages: ['@memvid/sdk'],
};

export default nextConfig;
