import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const basePath = "/portfolio";

export default function config(phase: string): NextConfig {
  const nextConfig: NextConfig = {
    output: "export",
    trailingSlash: true,
    basePath,
    env: {
      NEXT_PUBLIC_BASE_PATH: basePath,
    },
    images: {
      unoptimized: true,
    },
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    nextConfig.redirects = async () => [
      { source: "/", destination: `${basePath}/`, permanent: false, basePath: false },
    ];
  }

  return nextConfig;
}
