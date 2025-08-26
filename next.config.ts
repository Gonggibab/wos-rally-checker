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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });
    return config;
  },
  // `experimental.turbo`를 `turbopack`으로 변경합니다.
  turbopack: {
    rules: {
      "**/*.md": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
