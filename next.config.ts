import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF, fall back to WebP, then the source format. Sits on top of the
    // pre-optimized raster sources (see scripts/optimize-images.mjs).
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tree-shake motion's barrel so only the used exports ship (complements the
    // LazyMotion + `m` setup in EnvelopeGate).
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
