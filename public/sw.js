if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + ".js", n).href),
    s[a] ||
      new Promise(s => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, t) => {
    const i = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (s[i]) return;
    let c = {};
    const u = e => a(e, i),
      o = { module: { uri: i }, exports: c, require: u };
    s[i] = Promise.all(n.map(e => o[e] || u(e))).then(e => (t(...e), c));
  };
}
define(["./workbox-e9849328"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/_next/app-build-manifest.json", revision: "bf9046749fe3e35e930057f395ee5dff" },
        { url: "/_next/static/chunks/1578-6309af08f49a134f.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/2002-c3d69e65f2101318.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/2905-b2e86deb0d9f7bf5.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        {
          url: "/_next/static/chunks/2960494e-2e837d4d1a124b43.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        { url: "/_next/static/chunks/3346-60eea0c9935cbed4.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/3758-bfbe35bc719d9ffd.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/3770-81c63afbe4fb8a0e.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/3796-ec443d90b302ebe5.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/468-b90669d32cac2e86.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        {
          url: "/_next/static/chunks/4adf0d75-9725f38e415a0b46.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        { url: "/_next/static/chunks/5016-7215306243164b86.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/518-1b22ff295305772c.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/6141-52366ac59fdef825.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/6511-b47398519b236dda.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/7341-53c3e5e85971b198.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/7793-cabc98ca497f14d6.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/8367-13d430984b3c3545.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/8421-4f21ccd62f0f29e8.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/865-2713ff76af28a608.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/923-5a6923506d5cd2f9.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/9334-9e025e90a4000ed4.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/9531-538a050eacfd0082.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        { url: "/_next/static/chunks/958-d419c4fb6376780d.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        {
          url: "/_next/static/chunks/app/_not-found/page-7544c2193c8953b4.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/about/page-eae4c8736fd071f8.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/api/dashboard/route-06eae43ef6b9373b.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/api/image/route-53ab26a2575c9e7e.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/api/tags/route-1ca8be8a76c75a79.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/api/upload/route-de01c4c79e6063a2.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/auth/layout-54b921a93e88039e.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/auth/signin/page-e1dabb6f06d49a6d.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/auth/signup/page-3c9940ef33045171.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/badges/page-78383d93592f86b9.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/loading-276a3c5709c9ff1b.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/page-f25dcde67875ee50.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/blogs/error-799635f8ea2528f1.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/blogs/loading-4c5c0cd59cab682d.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/blogs/new/page-60d5606044227bc3.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/blogs/page-c6a3f493a803496d.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/dashboard/layout-df6b84f48961f79c.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-7756588dbaf8e4d1.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/error-b40a6da53fd9f334.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/loading-145063a57fcd1179.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/not-found-7dd8427e37a226a6.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/page-8cc38352505d15d3.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/docs/layout-86c131dcd67c9125.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/docs/page-55c3f2ee1db24e33.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/layout-db4ec7aa0630acf2.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/page-0529638b7ab83308.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/reading/layout-7cb27ca79d042e67.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/reading/page-0198bb8ae4cb58ee.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/reading/stats/page-8ac5931aa1c89cc1.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/test/page-520d7678ffa1fcdd.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/utils/calendar/page-3b27d93926eda3c0.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/utils/demo/page-2c63332b4dcaf870.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/utils/layout-ef1a6767601da4ba.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/utils/page-1a51bd23a1b566cb.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/utils/status/page-2adfd6b30475b4c4.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/app/utils/theme/page-08980bb5ecf42bed.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/b27dc69b-912941c5f1fa89a2.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/e47dbe21-8c6fce69ce3abe3d.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/framework-4f16cf9911d0e023.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/main-app-c7dd3db3aa09f5ab.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        { url: "/_next/static/chunks/main-c3e5c3b045cae6a4.js", revision: "nx0tYN2FeoskuaKMEDyVR" },
        {
          url: "/_next/static/chunks/pages/_app-e985763b58f5bfdb.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/pages/_error-cd8de3545983245c.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-1320b094d3c3b958.js",
          revision: "nx0tYN2FeoskuaKMEDyVR",
        },
        { url: "/_next/static/css/60b2203366087110.css", revision: "60b2203366087110" },
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
          url: "/_next/static/nx0tYN2FeoskuaKMEDyVR/_buildManifest.js",
          revision: "ae45a8c0c68ccbe6afbba267cb949a90",
        },
        {
          url: "/_next/static/nx0tYN2FeoskuaKMEDyVR/_ssgManifest.js",
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
        { url: "/sitemap-0.xml", revision: "c0c47000b7bcfaef1b6c1a6d759e79b1" },
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
            cacheWillUpdate: async ({ request: e, response: s, event: a, state: n }) =>
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
