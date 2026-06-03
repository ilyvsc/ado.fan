import type { NextConfig } from "next";

const cdn = process.env.NEXT_PUBLIC_CDN_URL;
if (!cdn) throw new Error("NEXT_PUBLIC_CDN_URL is not defined");
const r2 = new URL(cdn);

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.0.0.*", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: r2.protocol.replace(":", "") as "http" | "https",
        hostname: r2.hostname,
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 14,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
