import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Backend-hosted uploads (logos, car images, hero images)
      { protocol: "http", hostname: "212.47.70.100", port: "8088" },
      { protocol: "https", hostname: "**.vercel.app" },
      // Allow common image CDNs used in seed content
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
