const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // モノレポのため Turbopack のワークスペースルートを明示
  turbopack: {
    root: path.join(__dirname, "../..")
  },
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    // Next.js 16 で images.domains が非推奨になったため remotePatterns に統合
    remotePatterns: [
      { hostname: "cdn.sanity.io" },
      { hostname: "pub-3626123a908346a7a8be8d9295f44e26.r2.dev" },
      { hostname: "**.r2.dev" }
    ]
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === "production"
  },
  // ワークスペースパッケージは TS ソースのまま提供されるため Next 側で変換する
  // （旧設定の "type" はタイポでどのパッケージにも一致していなかった）
  transpilePackages: ["types", "ui", "utils"]
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
