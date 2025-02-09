/* eslint-disable @typescript-eslint/no-require-imports */
const withPWA = require("next-pwa")({
  dest: "public", // Service Worker 和 manifest 文件输出目录，通常是 public 文件夹
  disable: process.env.NODE_ENV === "development", // 开发环境下禁用 PWA，避免干扰开发
  register: true, // 自动注册 Service Worker
  skipWaiting: true, //  Service Worker 更新时，跳过 waiting 状态立即生效
  // ... 其他 next-pwa 配置选项 (可选)
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bing.biturl.top",
      },
      {
        hostname: "images.credly.com",
        protocol: "https",
      },
      {
        hostname: "res.weread.qq.com",
        protocol: "https",
      },

      {
        hostname: "cdn.weread.qq.com",
        protocol: "https",
      },
      {
        protocol: "https",
        hostname: "*.image.myqcloud.com",
      },
      {
        protocol: "https",
        hostname: "wdi971y1e0f2loaa.public.blob.vercel-storage.com",
        port: "",
        pathname: "/tt_images/**",
        search: "",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
