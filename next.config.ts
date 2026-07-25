import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF, fall back to WebP, then the source format. Sits on top of the
    // pre-optimized moments sources (see scripts/optimize-moments.mjs).
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
