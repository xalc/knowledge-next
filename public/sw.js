if (!self.define) {
  let e,
    t = {};
  const s = (s, a) => (
    (s = new URL(s + ".js", a).href),
    t[s] ||
      new Promise(t => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = s), (e.onload = t), document.head.appendChild(e);
        } else (e = s), importScripts(s), t();
      }).then(() => {
        let e = t[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, i) => {
    const n = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (t[n]) return;
    let c = {};
    const o = e => s(e, n),
      r = { module: { uri: n }, exports: c, require: o };
    t[n] = Promise.all(a.map(e => r[e] || o(e))).then(e => (i(...e), c));
  };
}
define(["./workbox-e9849328"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/_next/app-build-manifest.json", revision: "87e8c1c94562a0e572ce01539635ad81" },
        {
          url: "/_next/static/KYlzh2p0tyfoAMtw9ZkJX/_buildManifest.js",
          revision: "cc41bb05cef79f31893a83e499eca0c6",
        },
        {
          url: "/_next/static/KYlzh2p0tyfoAMtw9ZkJX/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/_next/static/chunks/1578-6309af08f49a134f.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/2002-c3d69e65f2101318.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/2905-b2e86deb0d9f7bf5.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        {
          url: "/_next/static/chunks/2960494e-2e837d4d1a124b43.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        { url: "/_next/static/chunks/3346-60eea0c9935cbed4.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/3758-bfbe35bc719d9ffd.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/3770-81c63afbe4fb8a0e.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/468-b90669d32cac2e86.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        {
          url: "/_next/static/chunks/4adf0d75-9725f38e415a0b46.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        { url: "/_next/static/chunks/5016-7215306243164b86.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/518-1b22ff295305772c.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/6511-b47398519b236dda.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/7115-6a95f778c501dd2b.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/7341-53c3e5e85971b198.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/7793-cabc98ca497f14d6.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/8367-13d430984b3c3545.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/8421-4f21ccd62f0f29e8.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/865-2713ff76af28a608.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/8957-7d79ee03c1c9cc96.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/923-5a6923506d5cd2f9.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/9334-9e025e90a4000ed4.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/9531-5b9e64bb8f96fa10.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        { url: "/_next/static/chunks/958-d419c4fb6376780d.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        {
          url: "/_next/static/chunks/app/_not-found/page-7544c2193c8953b4.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/about/page-9d733b3ae0444c44.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/api/dashboard/route-ba178192933f20fe.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/api/image/route-f9337e7f4dc373b8.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/api/upload/route-2eda0533e7dc9f51.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/auth/layout-0440a168af6ebf5d.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/auth/signin/page-4db7c3c23d520409.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/auth/signup/page-00cf081bdc0ae678.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/badges/page-fe122752db5c2418.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/loading-33d1edbf2c1c8f0a.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/page-08e3f76f5c1c425a.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/blogs/error-ba81488c2fd55456.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/blogs/loading-a22fad10b16dcf01.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/blogs/new/page-b324410aa1548179.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/blogs/page-b7f345d943fec413.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/dashboard/layout-2a93ddf7d7d9e7e2.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-5f9f536be865268d.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/error-903324146700a334.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/loading-45bdca441b1db593.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/not-found-3563e334d747e4d3.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/page-75aa891db3760ba0.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/docs/layout-4fb320de27b46c1b.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/docs/page-21b5cb9079269c0d.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/layout-f03a7f634d0728e3.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/page-6a2f7f8dade73692.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/reading/layout-2346730fbd2d4334.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/reading/page-c0845590237250d4.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/reading/stats/page-8748700937ed213d.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/test/page-3e391eb41c7c964c.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/utils/calendar/page-995ae5f65380f34c.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/utils/demo/page-e2a2095aa29bd961.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/utils/layout-dd6fdf31ddf2c993.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/utils/page-2ad872f57990780d.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/utils/status/page-4111142560542041.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/app/utils/theme/page-cbe570f304e308d2.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/b27dc69b-912941c5f1fa89a2.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/e47dbe21-8c6fce69ce3abe3d.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/framework-4f16cf9911d0e023.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        { url: "/_next/static/chunks/main-2399ec165ebdbd6c.js", revision: "KYlzh2p0tyfoAMtw9ZkJX" },
        {
          url: "/_next/static/chunks/main-app-cd0d6f3f8c5e78cf.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/pages/_app-e985763b58f5bfdb.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/pages/_error-cd8de3545983245c.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-1320b094d3c3b958.js",
          revision: "KYlzh2p0tyfoAMtw9ZkJX",
        },
        { url: "/_next/static/css/481e20896749391f.css", revision: "481e20896749391f" },
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
        { url: "/manifest.json", revision: "aaa87069961d6cf70a216bc53ca259b8" },
        { url: "/robots.txt", revision: "0fc71ac6389fed8aefd7d7924b0e9397" },
        { url: "/sitemap-0.xml", revision: "4ea94e444233d8d56dbea3e70160087d" },
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
            cacheWillUpdate: async ({ request: e, response: t, event: s, state: a }) =>
              t && "opaqueredirect" === t.type
                ? new Response(t.body, { status: 200, statusText: "OK", headers: t.headers })
                : t,
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
        const t = e.pathname;
        return !t.startsWith("/api/auth/") && !!t.startsWith("/api/");
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
