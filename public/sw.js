if (!self.define) {
  let s,
    e = {};
  const i = (i, a) => (
    (i = new URL(i + ".js", a).href),
    e[i] ||
      new Promise(e => {
        if ("document" in self) {
          const s = document.createElement("script");
          (s.src = i), (s.onload = e), document.head.appendChild(s);
        } else (s = i), importScripts(i), e();
      }).then(() => {
        let s = e[i];
        if (!s) throw new Error(`Module ${i} didn’t register its module`);
        return s;
      })
  );
  self.define = (a, n) => {
    const t = s || ("document" in self ? document.currentScript.src : "") || location.href;
    if (e[t]) return;
    let c = {};
    const r = s => i(s, t),
      u = { module: { uri: t }, exports: c, require: r };
    e[t] = Promise.all(a.map(s => u[s] || r(s))).then(s => (n(...s), c));
  };
}
define(["./workbox-e9849328"], function (s) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    s.clientsClaim(),
    s.precacheAndRoute(
      [
        { url: "/_next/app-build-manifest.json", revision: "d14152a004460c4de5f42f7334d0ef1a" },
        { url: "/_next/static/chunks/1858-0a993eb246aebe9e.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/2356-aebfa8f6563a6597.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/251-d9687b47686acd5a.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/2764-a76db2a9e2c3e371.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        {
          url: "/_next/static/chunks/2960494e-be369124a1c40bad.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/2a9a6835-7933ca7df658ec06.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/2d5e3988-058b13a1c99519df.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        { url: "/_next/static/chunks/3073-aad260792d1ecf07.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/3187-f744d7709c2b6a24.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/3434-0eb2f83265bb1a17.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/4386-6d7f136f82f8f6b7.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/4556-296ad88a4bd5d116.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/4788-ac5f19dcd6652147.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        {
          url: "/_next/static/chunks/4adf0d75-641ac6f2618d9ce6.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        { url: "/_next/static/chunks/506-e462948eb78267a6.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/5535-67c59a5e1dad2417.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/5728-6f949179b873cf25.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/6738-d9aa689183df1bc6.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/6893-d19da7426228fc13.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/7456-4e619955b27a3641.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/7630-58bb6066036a5885.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/7808-bb50d1ec622cf9c2.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/7832-6253c4b6625b6b80.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/8249-b37559263aad7b64.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/8413-596a8810215e9993.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/8658-835f922f1d4ca9fd.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/8723-8e1ad9a32a4f0509.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/876-6ed0f142507b696d.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        { url: "/_next/static/chunks/8942-c5e1945f51e81b57.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        {
          url: "/_next/static/chunks/app/_not-found/page-1dcbdf95329de9a1.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/about/page-957ebdb1f4d56769.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/api/chat/route-96b129791714b3a5.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/api/dashboard/route-de142e30dd0f5ca2.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/api/greeting/route-8fee5567b969ff2b.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/api/image/route-a306f13b44dc76d4.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/api/tags/route-da0853be0ad7f909.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/api/update-cookies/route-d3b281d18e000740.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/api/upload/route-025210adc3da1b6f.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/api/wereader/summary/route-fbcd0288bb80aa90.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/api/wereader/validate/route-1bbd78b77edb9bae.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/auth/layout-33f132e86535f503.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/auth/signin/page-50296002867f31ef.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/auth/signup/page-d53cf2b4078e2119.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/badges/page-04bd53f9050c4ac4.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/loading-790bf705eedff72e.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/page-cfc30fefaf9b9ecc.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/blogs/error-1524b2ff5d67f4d5.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/blogs/loading-299402b9cc37cab5.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/blogs/new/page-a8197bdbaa84ae95.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/blogs/page-775f8e75ce7ec28d.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/dashboard/layout-4de50ec453b7b0ef.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-81fd7ac96426fde3.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/error-1fa5b1b9eb098c9e.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/loading-471bea882e0a96a6.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/not-found-e5798938bdae993c.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/page-f97253c53ac35527.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/docs/layout-0bfc148f8ccebcc4.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/docs/loading-dc9fdc9e04999e3d.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/docs/page-10bd67c3bb15ecfa.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/layout-c7252a5d6b3fee2b.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/page-e2688187713e851f.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/reading/layout-8d4c88b04c0f6fb3.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/reading/loading-4325b3e04ca3325d.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/reading/page-c65c29fc69c702d1.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/reading/stats/page-3d7a011e3931e871.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/test/page-e4d810ebb254e199.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/utils/calendar/page-542bac9b8e360642.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/utils/chat/page-8a07310346668f0c.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/utils/demo/page-4571103a0f7d058e.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/utils/layout-bdf058a0dd45fa3a.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/utils/page-94a39c6d9de8caac.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/utils/status/page-7593eade261432c7.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/utils/theme/page-5a09800f5a7c3f13.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/app/utils/timeline/page-9e1edc96879b9ca5.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/b27dc69b-56aaa0c926d2a99c.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/e6502385-3e6d654904bfbe44.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/framework-b67a55d574a26375.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/main-app-6cb915dea453ce6b.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        { url: "/_next/static/chunks/main-bfb4cc7c4acfb9ee.js", revision: "s2q2XBAB1Gz1IDGyMFiGQ" },
        {
          url: "/_next/static/chunks/pages/_app-2b60c804cfa48eb1.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/pages/_error-6916109e4aacbe79.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-9395551c957a08c1.js",
          revision: "s2q2XBAB1Gz1IDGyMFiGQ",
        },
        { url: "/_next/static/css/610086ccbc200982.css", revision: "610086ccbc200982" },
        { url: "/_next/static/css/73b7979eeb0358ee.css", revision: "73b7979eeb0358ee" },
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
          url: "/_next/static/s2q2XBAB1Gz1IDGyMFiGQ/_buildManifest.js",
          revision: "78dfa7a6ced6ca5d75ebd3df32405834",
        },
        {
          url: "/_next/static/s2q2XBAB1Gz1IDGyMFiGQ/_ssgManifest.js",
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
        { url: "/sitemap-0.xml", revision: "43a49c38ff93f53e6b6e91979117c2bd" },
        { url: "/sitemap.xml", revision: "17d9b11dfb2cb607e8799524922a6957" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    s.cleanupOutdatedCaches(),
    s.registerRoute(
      "/",
      new s.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ request: s, response: e, event: i, state: a }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, { status: 200, statusText: "OK", headers: e.headers })
                : e,
          },
        ],
      }),
      "GET",
    ),
    s.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new s.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [new s.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new s.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [new s.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new s.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [new s.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new s.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [new s.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new s.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [new s.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new s.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new s.RangeRequestsPlugin(),
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    s.registerRoute(
      /\.(?:mp4)$/i,
      new s.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new s.RangeRequestsPlugin(),
          new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    s.registerRoute(
      /\.(?:js)$/i,
      new s.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /\.(?:css|less)$/i,
      new s.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new s.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new s.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    s.registerRoute(
      ({ url: s }) => {
        if (!(self.origin === s.origin)) return !1;
        const e = s.pathname;
        return !e.startsWith("/api/auth/") && !!e.startsWith("/api/");
      },
      new s.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [new s.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    s.registerRoute(
      ({ url: s }) => {
        if (!(self.origin === s.origin)) return !1;
        return !s.pathname.startsWith("/api/");
      },
      new s.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ),
    s.registerRoute(
      ({ url: s }) => !(self.origin === s.origin),
      new s.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      "GET",
    );
});
