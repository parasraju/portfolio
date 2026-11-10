import type { NextConfig } from "next";

const basePath = process.env.GITHUB_ACTIONS === "true" ? "/portfolio" : "";

const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
