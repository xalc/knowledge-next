if (!self.define) {
  let e,
    s = {};
  const n = (n, a) => (
    (n = new URL(n + ".js", a).href),
    s[n] ||
      new Promise(s => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, i) => {
    const t = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (s[t]) return;
    let c = {};
    const u = e => n(e, t),
      r = { module: { uri: t }, exports: c, require: u };
    s[t] = Promise.all(a.map(e => r[e] || u(e))).then(e => (i(...e), c));
  };
}
define(["./workbox-e9849328"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/_next/app-build-manifest.json", revision: "49567f8bae9e9618c78552fea17712d7" },
        { url: "/_next/static/chunks/1786-722382837f5b91a6.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/1858-0a993eb246aebe9e.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/2158-e8f99b656cf49623.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/251-d9687b47686acd5a.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/2764-a76db2a9e2c3e371.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        {
          url: "/_next/static/chunks/2960494e-be369124a1c40bad.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        { url: "/_next/static/chunks/2999-78386a6349133d88.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        {
          url: "/_next/static/chunks/2d5e3988-058b13a1c99519df.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        { url: "/_next/static/chunks/3176-56eb86469d25b8d7.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/318-fd4f88d39ced8726.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/3187-f744d7709c2b6a24.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/4556-296ad88a4bd5d116.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        {
          url: "/_next/static/chunks/4adf0d75-641ac6f2618d9ce6.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        { url: "/_next/static/chunks/506-e462948eb78267a6.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/5535-67c59a5e1dad2417.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/5728-6f949179b873cf25.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/6738-d9aa689183df1bc6.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/7062-3ebe36f4ce6c4986.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/7808-bb50d1ec622cf9c2.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/8377-d4f4d3f20dc8e785.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/8413-596a8810215e9993.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/8723-8e1ad9a32a4f0509.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/876-6ed0f142507b696d.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/8942-aca2b9fc515aafb5.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/9061-38fb843c0f59a25a.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        { url: "/_next/static/chunks/9539-28b2586a17e6cb50.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        {
          url: "/_next/static/chunks/app/_not-found/page-1dcbdf95329de9a1.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/about/page-957ebdb1f4d56769.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/api/chat/route-d745c4ea080abcca.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/api/dashboard/route-333a0ab3f8f1fde4.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/api/greeting/route-ad9c6a2e3e2cc959.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/api/image/route-b6e245eef15147b2.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/api/tags/route-2df02e5db46282b3.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/api/upload/route-e81f3765b899f99a.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/auth/layout-fe3dd3e8dafa1f90.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/auth/signin/page-31e1dd3fbd2d46ca.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/auth/signup/page-b59b17d5cf2439cc.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/badges/page-13b2d1678e57605b.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/loading-bd64578507962710.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/page-68384419489f56c3.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/blogs/error-1524b2ff5d67f4d5.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/blogs/loading-405253c0a51beae2.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/blogs/new/page-3156b48a0fdaf731.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/blogs/page-78c4255e198f0c00.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/dashboard/layout-d3b9c4ecda547d25.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-1e8f7a623a01c29a.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/error-1fa5b1b9eb098c9e.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/loading-d9cab30457d45df7.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/not-found-e5798938bdae993c.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/page-f97253c53ac35527.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/docs/layout-e075091d81a765ca.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/docs/page-10bd67c3bb15ecfa.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/layout-c5a8921f6409bd3d.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/page-8bd6a2ffbcaab47c.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/reading/layout-3bd8c917808439df.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/reading/page-55426ff3a71fd681.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/reading/stats/page-a4f5adde93e060ac.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/test/page-15289ee588157703.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/utils/calendar/page-236bf66df8ff6266.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/utils/chat/page-8a07310346668f0c.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/utils/demo/page-76e68be2521ef0d3.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/utils/layout-bba0cfae1065738c.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/utils/page-94a39c6d9de8caac.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/utils/status/page-edcdd6daf39136c8.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/app/utils/theme/page-fd49126bb98a01be.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/b27dc69b-56aaa0c926d2a99c.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/framework-b67a55d574a26375.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/main-app-6cb915dea453ce6b.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        { url: "/_next/static/chunks/main-bfb4cc7c4acfb9ee.js", revision: "qP6ulETfeIOTTBCFdRZnZ" },
        {
          url: "/_next/static/chunks/pages/_app-2b60c804cfa48eb1.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/pages/_error-6916109e4aacbe79.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-a957daab748aab7b.js",
          revision: "qP6ulETfeIOTTBCFdRZnZ",
        },
        { url: "/_next/static/css/5219b370c4f90f92.css", revision: "5219b370c4f90f92" },
        {
          url: "/_next/static/media/HX-dark.88b1a7cc.svg",
          revision: "524f11c33290e3c8748b7aea91fcb69e",
        },
        {
          url: "/_next/static/media/HX.474effa7.svg",
          revision: "9e9ceac8c5389f5774962151f666e571",
        },
        {
          url: "/_next/static/media/credly.3f572fce.svg",
          revision: "2acb0a185a1a83f2c7c8792c99ca3058",
        },
        {
          url: "/_next/static/qP6ulETfeIOTTBCFdRZnZ/_buildManifest.js",
          revision: "5f03c9f26e54682000ac77d1dc3110e8",
        },
        {
          url: "/_next/static/qP6ulETfeIOTTBCFdRZnZ/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/favor/apple-touch-icon.png", revision: "7bfc2eb15c4e194d362a299268c797e9" },
        { url: "/favor/favicon-96x96.png", revision: "7d193cb73ca32c1bfc5e3fd485de3ad4" },
        { url: "/favor/favicon.ico", revision: "2a7c926ffed86cc301dbb8f5ae049015" },
        { url: "/favor/favicon.svg", revision: "7143a63ef623bf4ad2918a4b5cb157bf" },
        { url: "/favor/screenshot.png", revision: "0b0d29715de47d131a5dd37785327658" },
        { url: "/favor/site.webmanifest", revision: "cbdcc340466625a84c88bfc32c972c5f" },
        {
          url: "/favor/web-app-manifest-192x192.png",
          revision: "5415fbd9f145461ab9b199558964d895",
        },
        {
          url: "/favor/web-app-manifest-512x512.png",
          revision: "bf416384bfe5e420d313d256e9523b11",
        },
        { url: "/holidays/2025.json", revision: "1616f377cccdc827ba1a6f930ec5c29e" },
        { url: "/images/HX-dark.svg", revision: "524f11c33290e3c8748b7aea91fcb69e" },
        { url: "/images/HX.svg", revision: "9e9ceac8c5389f5774962151f666e571" },
        { url: "/images/credly.svg", revision: "2acb0a185a1a83f2c7c8792c99ca3058" },
        { url: "/images/favor.svg", revision: "09c4c92df9cc061a52c42b3d35ceb1b3" },
        { url: "/images/span.svg", revision: "67d461640d384058d25c562400ee6700" },
        { url: "/manifest.json", revision: "924e2f8a57e1ee007d63bb6d279f2755" },
        { url: "/robots.txt", revision: "0fc71ac6389fed8aefd7d7924b0e9397" },
        { url: "/sitemap-0.xml", revision: "0ec53d984fb8dd25654fc0ad684fd6fb" },
        { url: "/sitemap.xml", revision: "17d9b11dfb2cb607e8799524922a6957" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: n, state: a }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, { status: 200, statusText: "OK", headers: s.headers })
                : s,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      "GET",
    );
});
