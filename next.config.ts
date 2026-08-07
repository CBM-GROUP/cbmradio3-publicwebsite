import type { NextConfig } from "next";

const mediaHostname = process.env.MEDIA_HOSTNAME?.trim();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9002",
        pathname: "/**",
      },
      ...(mediaHostname
        ? [{ protocol: "https" as const, hostname: mediaHostname, pathname: "/**" }]
        : []),
    ],
  },
};

export default nextConfig;
