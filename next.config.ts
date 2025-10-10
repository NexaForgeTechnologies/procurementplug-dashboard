import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "procurementplug.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
