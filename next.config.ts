import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/bridge/:path*",
        destination: "https://helm-pi-one.vercel.app/bridge/:path*",
      },
    ];
  },
};

export default nextConfig;
