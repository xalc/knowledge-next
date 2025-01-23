/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.PRODUCT_DOMAIN || "https://blog.huntx.cn",
  generateRobotsTxt: true, // (optional)
  // ...other options
};
