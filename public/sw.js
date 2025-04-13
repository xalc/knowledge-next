if (!self.define) {
  let e,
    s = {};
  const a = (a, i) => (
    (a = new URL(a + ".js", i).href),
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
  self.define = (i, n) => {
    const t = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (s[t]) return;
    let c = {};
    const h = e => a(e, t),
      u = { module: { uri: t }, exports: c, require: h };
    s[t] = Promise.all(i.map(e => u[e] || h(e))).then(e => (n(...e), c));
  };
}
define(["./workbox-e9849328"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/_next/app-build-manifest.json", revision: "e6818f75da286949d422e874a97cbe4b" },
        { url: "/_next/static/chunks/1303-8ab68f1d4584eacb.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/1858-0a993eb246aebe9e.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/251-d9687b47686acd5a.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/2764-a76db2a9e2c3e371.js", revision: "omhupva9DhxODhjv5p9fJ" },
        {
          url: "/_next/static/chunks/2960494e-be369124a1c40bad.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        { url: "/_next/static/chunks/2999-78386a6349133d88.js", revision: "omhupva9DhxODhjv5p9fJ" },
        {
          url: "/_next/static/chunks/2a9a6835-7933ca7df658ec06.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/2d5e3988-058b13a1c99519df.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        { url: "/_next/static/chunks/3072-2970d7aa3894e58a.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/3187-f744d7709c2b6a24.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/3434-0eb2f83265bb1a17.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/4050-1748fd8f15377931.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/4556-296ad88a4bd5d116.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/4788-ac5f19dcd6652147.js", revision: "omhupva9DhxODhjv5p9fJ" },
        {
          url: "/_next/static/chunks/4adf0d75-641ac6f2618d9ce6.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        { url: "/_next/static/chunks/506-e462948eb78267a6.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/5535-67c59a5e1dad2417.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/5728-6f949179b873cf25.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/6738-d9aa689183df1bc6.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/7062-3ebe36f4ce6c4986.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/7670-408438fa7b84df57.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/7832-6253c4b6625b6b80.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/8249-b37559263aad7b64.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/8413-596a8810215e9993.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/8658-835f922f1d4ca9fd.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/8723-8e1ad9a32a4f0509.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/876-6ed0f142507b696d.js", revision: "omhupva9DhxODhjv5p9fJ" },
        { url: "/_next/static/chunks/8942-c5e1945f51e81b57.js", revision: "omhupva9DhxODhjv5p9fJ" },
        {
          url: "/_next/static/chunks/app/_not-found/page-1dcbdf95329de9a1.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/about/page-957ebdb1f4d56769.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/api/chat/route-d745c4ea080abcca.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/api/dashboard/route-333a0ab3f8f1fde4.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/api/greeting/route-ad9c6a2e3e2cc959.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/api/image/route-b6e245eef15147b2.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/api/tags/route-2df02e5db46282b3.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/api/upload/route-e81f3765b899f99a.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/auth/layout-fe3dd3e8dafa1f90.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/auth/signin/page-4d1259fc997b6c4d.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/auth/signup/page-4ab20f93dde1b8fc.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/badges/page-b5e70d78bc539337.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/loading-bd64578507962710.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/page-f232221293c8610f.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/blogs/error-1524b2ff5d67f4d5.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/blogs/loading-405253c0a51beae2.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/blogs/new/page-905ec272f31a5699.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/blogs/page-eb95ad686abf01bd.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/dashboard/layout-d3b9c4ecda547d25.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-1e8f7a623a01c29a.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/error-1fa5b1b9eb098c9e.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/loading-d9cab30457d45df7.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/not-found-e5798938bdae993c.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/page-f97253c53ac35527.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/docs/layout-7766d9bf7ddd736f.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/docs/page-10bd67c3bb15ecfa.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/layout-48113345b399810e.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/page-e8ac775ad91e1c5c.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/reading/layout-3bd8c917808439df.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/reading/page-55426ff3a71fd681.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/reading/stats/page-8f04b3a023de6af3.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/test/page-15289ee588157703.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/utils/calendar/page-236bf66df8ff6266.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/utils/chat/page-8a07310346668f0c.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/utils/demo/page-76e68be2521ef0d3.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/utils/layout-bba0cfae1065738c.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/utils/page-94a39c6d9de8caac.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/utils/status/page-edcdd6daf39136c8.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/utils/theme/page-ff429d59f6c9abd0.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/app/utils/timeline/page-9e1edc96879b9ca5.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/b27dc69b-56aaa0c926d2a99c.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/e6502385-3e6d654904bfbe44.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/framework-b67a55d574a26375.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/main-app-6cb915dea453ce6b.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        { url: "/_next/static/chunks/main-bfb4cc7c4acfb9ee.js", revision: "omhupva9DhxODhjv5p9fJ" },
        {
          url: "/_next/static/chunks/pages/_app-2b60c804cfa48eb1.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/pages/_error-6916109e4aacbe79.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-a957daab748aab7b.js",
          revision: "omhupva9DhxODhjv5p9fJ",
        },
        { url: "/_next/static/css/3f4a008f182b84b3.css", revision: "3f4a008f182b84b3" },
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
          url: "/_next/static/omhupva9DhxODhjv5p9fJ/_buildManifest.js",
          revision: "499ade4c87fea8a29b1d4352590352c9",
        },
        {
          url: "/_next/static/omhupva9DhxODhjv5p9fJ/_ssgManifest.js",
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
        { url: "/sitemap-0.xml", revision: "47c86e4ebb38be8930ecc2bc7033cbd0" },
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
            cacheWillUpdate: async ({ request: e, response: s, event: a, state: i }) =>
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
