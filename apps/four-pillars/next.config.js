/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {},
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    remotePatterns: [{ hostname: "cdn.sanity.io" }],
    domains: [
      "pub-3626123a908346a7a8be8d9295f44e26.r2.dev",
      "**.r2.dev",
    ]
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === "production"
  },
  eslint: {
    /// Set this to false if you want production builds to abort if there's lint errors
    ignoreDuringBuilds: process.env.VERCEL_ENV === "production"
  },
  transpilePackages: ["type", "utils"],
  webpack: (config, { isServer }) => {
    // デバッグ時にはfalseに設定する
    config.optimization.minimize = true;

    return config;
  }
  // 本番運用を開始したら以下は必ずコメントアウト
  /*
  async headers() {
    const headers = [];
    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview") {
      headers.push({
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex"
          }
        ],
        source: "/:path*"
      });
    }
    return headers;
  }
  */
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

// module.exports = nextConfig;
module.exports = withBundleAnalyzer(nextConfig);
