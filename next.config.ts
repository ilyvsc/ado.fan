import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "r2.ado.fan",
    //     pathname: "/images/**",
    //   },
    // ],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
