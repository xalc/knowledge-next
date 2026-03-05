if (!self.define) {
  let e,
    s = {};
  const c = (c, a) => (
    (c = new URL(c + ".js", a).href),
    s[c] ||
      new Promise(s => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = c), (e.onload = s), document.head.appendChild(e);
        } else (e = c), importScripts(c), s();
      }).then(() => {
        let e = s[c];
        if (!e) throw new Error(`Module ${c} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, i) => {
    const t = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (s[t]) return;
    let n = {};
    const r = e => c(e, t),
      u = { module: { uri: t }, exports: n, require: r };
    s[t] = Promise.all(a.map(e => u[e] || r(e))).then(e => (i(...e), n));
  };
}
define(["./workbox-e9849328"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/_next/static/chunks/1120-cb1b6c4781d0166e.js", revision: "cb1b6c4781d0166e" },
        { url: "/_next/static/chunks/1316-09ba8838eeb0fae4.js", revision: "09ba8838eeb0fae4" },
        { url: "/_next/static/chunks/1377-e366ece26d694e23.js", revision: "e366ece26d694e23" },
        { url: "/_next/static/chunks/1423-92d7071db713b6e4.js", revision: "92d7071db713b6e4" },
        { url: "/_next/static/chunks/1608-f0abd17e097b2b2e.js", revision: "f0abd17e097b2b2e" },
        { url: "/_next/static/chunks/1654-10bb53201b50b569.js", revision: "10bb53201b50b569" },
        { url: "/_next/static/chunks/1751-a681199937219ed5.js", revision: "a681199937219ed5" },
        { url: "/_next/static/chunks/217-7713b439bf8ebd97.js", revision: "7713b439bf8ebd97" },
        { url: "/_next/static/chunks/2849-11048791c0955a73.js", revision: "11048791c0955a73" },
        { url: "/_next/static/chunks/2853-a12315844335b505.js", revision: "a12315844335b505" },
        { url: "/_next/static/chunks/2960494e-accbe19a9bf68121.js", revision: "accbe19a9bf68121" },
        { url: "/_next/static/chunks/2a9a6835-1fc641f0e38ef723.js", revision: "1fc641f0e38ef723" },
        { url: "/_next/static/chunks/3351-b0960c8c0f1147ab.js", revision: "b0960c8c0f1147ab" },
        { url: "/_next/static/chunks/3693-f0224e3a7cb64ee2.js", revision: "f0224e3a7cb64ee2" },
        { url: "/_next/static/chunks/3866-412b426ecc11b029.js", revision: "412b426ecc11b029" },
        { url: "/_next/static/chunks/3c812832-c248547390ada745.js", revision: "c248547390ada745" },
        { url: "/_next/static/chunks/4744-27f5bf474b8ebf9c.js", revision: "27f5bf474b8ebf9c" },
        { url: "/_next/static/chunks/4adf0d75-062158bf818609dd.js", revision: "062158bf818609dd" },
        { url: "/_next/static/chunks/5206-e62a29b3685b7be8.js", revision: "e62a29b3685b7be8" },
        { url: "/_next/static/chunks/5481-b4231744a4b54343.js", revision: "b4231744a4b54343" },
        { url: "/_next/static/chunks/5497-1b2acc8031d83dba.js", revision: "1b2acc8031d83dba" },
        { url: "/_next/static/chunks/5626-20cf1601273e2472.js", revision: "20cf1601273e2472" },
        { url: "/_next/static/chunks/6426-9f667c2b5f472b26.js", revision: "9f667c2b5f472b26" },
        { url: "/_next/static/chunks/6583-3f35922980cbc970.js", revision: "3f35922980cbc970" },
        { url: "/_next/static/chunks/6646-12f6e6a7f4cc0cf4.js", revision: "12f6e6a7f4cc0cf4" },
        { url: "/_next/static/chunks/6960-72bcf3e568b231be.js", revision: "72bcf3e568b231be" },
        { url: "/_next/static/chunks/8054-2c72f4f2020862a7.js", revision: "2c72f4f2020862a7" },
        { url: "/_next/static/chunks/8495-60a88265a7a13c99.js", revision: "60a88265a7a13c99" },
        { url: "/_next/static/chunks/8559-60c8978065da8186.js", revision: "60c8978065da8186" },
        { url: "/_next/static/chunks/9787-b7b10950f45bb4cd.js", revision: "b7b10950f45bb4cd" },
        {
          url: "/_next/static/chunks/app/_not-found/page-d5960b355aca6fc8.js",
          revision: "d5960b355aca6fc8",
        },
        {
          url: "/_next/static/chunks/app/about/page-46afe88faf8da2b4.js",
          revision: "46afe88faf8da2b4",
        },
        {
          url: "/_next/static/chunks/app/api/chat/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/api/dashboard/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/api/greeting/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/api/image/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/api/tags/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/api/update-cookies/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/api/upload/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/api/wereader/summary/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/api/wereader/validate/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/auth/layout-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/auth/signin/page-bcf533bfec58ab25.js",
          revision: "bcf533bfec58ab25",
        },
        {
          url: "/_next/static/chunks/app/auth/signup/page-49de160a68da6719.js",
          revision: "49de160a68da6719",
        },
        {
          url: "/_next/static/chunks/app/badges/page-bb156a3b5705740a.js",
          revision: "bb156a3b5705740a",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/loading-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/page-44ca313e39251285.js",
          revision: "44ca313e39251285",
        },
        {
          url: "/_next/static/chunks/app/blogs/error-7a32fa90438831cd.js",
          revision: "7a32fa90438831cd",
        },
        {
          url: "/_next/static/chunks/app/blogs/loading-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/blogs/new/page-a9b25b8b95fad032.js",
          revision: "a9b25b8b95fad032",
        },
        {
          url: "/_next/static/chunks/app/blogs/page-9db9d7cc130f7e2a.js",
          revision: "9db9d7cc130f7e2a",
        },
        {
          url: "/_next/static/chunks/app/blogs/sitemap/%5B__metadata_id__%5D/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/dashboard/layout-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-b2dd9b8e8436aa65.js",
          revision: "b2dd9b8e8436aa65",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/error-8421fbaa3eee308a.js",
          revision: "8421fbaa3eee308a",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/loading-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/not-found-2542a3148d103c37.js",
          revision: "2542a3148d103c37",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/page-3355a8d45bd92829.js",
          revision: "3355a8d45bd92829",
        },
        {
          url: "/_next/static/chunks/app/docs/layout-b3c8d2958eda2a58.js",
          revision: "b3c8d2958eda2a58",
        },
        {
          url: "/_next/static/chunks/app/docs/loading-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/docs/page-3355a8d45bd92829.js",
          revision: "3355a8d45bd92829",
        },
        {
          url: "/_next/static/chunks/app/docs/sitemap/%5B__metadata_id__%5D/route-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/layout-c31c351790c26783.js",
          revision: "c31c351790c26783",
        },
        { url: "/_next/static/chunks/app/page-ab2241623fce1ee3.js", revision: "ab2241623fce1ee3" },
        {
          url: "/_next/static/chunks/app/reading/layout-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/reading/loading-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/reading/page-64b193e2dae51c52.js",
          revision: "64b193e2dae51c52",
        },
        {
          url: "/_next/static/chunks/app/reading/stats/page-29b5d78feaa022ef.js",
          revision: "29b5d78feaa022ef",
        },
        {
          url: "/_next/static/chunks/app/test/page-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/utils/calendar/page-88811d09ff96820e.js",
          revision: "88811d09ff96820e",
        },
        {
          url: "/_next/static/chunks/app/utils/chat/page-c5dfdf4a455c2b94.js",
          revision: "c5dfdf4a455c2b94",
        },
        {
          url: "/_next/static/chunks/app/utils/demo/page-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/utils/layout-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/utils/page-2542a3148d103c37.js",
          revision: "2542a3148d103c37",
        },
        {
          url: "/_next/static/chunks/app/utils/status/page-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/utils/theme/page-00e6d3c0938ce5f8.js",
          revision: "00e6d3c0938ce5f8",
        },
        {
          url: "/_next/static/chunks/app/utils/timeline/page-835cce4c8df38f5e.js",
          revision: "835cce4c8df38f5e",
        },
        { url: "/_next/static/chunks/b27dc69b-6e3acd1ab7ff18e6.js", revision: "6e3acd1ab7ff18e6" },
        { url: "/_next/static/chunks/e6502385-97b4f091cc7a0680.js", revision: "97b4f091cc7a0680" },
        { url: "/_next/static/chunks/framework-5f1defd2fcbea385.js", revision: "5f1defd2fcbea385" },
        { url: "/_next/static/chunks/main-1fbcd282e9a2e94a.js", revision: "1fbcd282e9a2e94a" },
        { url: "/_next/static/chunks/main-app-ddf8ab6bcf69dc21.js", revision: "ddf8ab6bcf69dc21" },
        {
          url: "/_next/static/chunks/pages/_app-d66a5be38ece37f5.js",
          revision: "d66a5be38ece37f5",
        },
        {
          url: "/_next/static/chunks/pages/_error-c84a28de3e5c5c19.js",
          revision: "c84a28de3e5c5c19",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        { url: "/_next/static/chunks/webpack-8bf9fd10cb4ae0be.js", revision: "8bf9fd10cb4ae0be" },
        { url: "/_next/static/css/3b50b6866aba2b78.css", revision: "3b50b6866aba2b78" },
        { url: "/_next/static/css/973aa259beb3efb2.css", revision: "973aa259beb3efb2" },
        {
          url: "/_next/static/gRTjZ1E43USruBZCYzKbP/_buildManifest.js",
          revision: "9689a6d1bb4dc9c768ef24693a8e010a",
        },
        {
          url: "/_next/static/gRTjZ1E43USruBZCYzKbP/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
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
        { url: "/holidays/2026.json", revision: "466089572ef3a209507aad82d91f4a75" },
        { url: "/images/HX-dark.svg", revision: "524f11c33290e3c8748b7aea91fcb69e" },
        { url: "/images/HX.svg", revision: "9e9ceac8c5389f5774962151f666e571" },
        { url: "/images/credly.svg", revision: "2acb0a185a1a83f2c7c8792c99ca3058" },
        { url: "/images/favor.svg", revision: "09c4c92df9cc061a52c42b3d35ceb1b3" },
        { url: "/images/span.svg", revision: "67d461640d384058d25c562400ee6700" },
        { url: "/manifest.json", revision: "77a6fd8b4a64c2b2bfa27a9dfe8e267e" },
        { url: "/robots.txt", revision: "0fc71ac6389fed8aefd7d7924b0e9397" },
        { url: "/sitemap-0.xml", revision: "862d5e09060a2f176ebf669d9efb0ad6" },
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
            cacheWillUpdate: async ({ request: e, response: s, event: c, state: a }) =>
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
