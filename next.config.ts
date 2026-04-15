import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Formatos de imagen modernos para máxima compresión
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
    // Tamaños de dispositivo optimizados para los breakpoints comunes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
