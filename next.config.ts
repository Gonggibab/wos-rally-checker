import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gom-s3-user-avatar.s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  // 이 설정은 `next build` 시 Webpack을 위해 필요합니다.
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });
    return config;
  },
  // `next dev --turbopack`을 위한 실험적 기능 설정입니다.
  experimental: {
    turbo: {
      rules: {
        // .md 확장자를 가진 모든 파일에 대해
        "**/*.md": {
          // raw-loader를 사용하여
          loaders: ["raw-loader"],
          // JavaScript 모듈로 취급하도록 합니다.
          as: "*.js",
        },
      },
    },
  },
};

export default nextConfig;
