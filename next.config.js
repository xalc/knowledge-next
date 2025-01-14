const { hostname } = require("os");

module.exports = {
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
