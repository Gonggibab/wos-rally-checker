import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images 속성을 추가하여 외부 이미지 호스트를 등록합니다.
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
};

export default nextConfig;
