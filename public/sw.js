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
      d = { module: { uri: t }, exports: n, require: r };
    s[t] = Promise.all(a.map(e => d[e] || r(e))).then(e => (i(...e), n));
  };
}
define(["./workbox-e9849328"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/_next/app-build-manifest.json", revision: "fc9f8aa91383207a09994fb9970aa9fe" },
        {
          url: "/_next/static/KLOO-jmlj-onhBXfDra-T/_buildManifest.js",
          revision: "9689a6d1bb4dc9c768ef24693a8e010a",
        },
        {
          url: "/_next/static/KLOO-jmlj-onhBXfDra-T/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/_next/static/chunks/1120-cb1b6c4781d0166e.js", revision: "cb1b6c4781d0166e" },
        { url: "/_next/static/chunks/1316-09ba8838eeb0fae4.js", revision: "09ba8838eeb0fae4" },
        { url: "/_next/static/chunks/1423-92d7071db713b6e4.js", revision: "92d7071db713b6e4" },
        { url: "/_next/static/chunks/1608-f0abd17e097b2b2e.js", revision: "f0abd17e097b2b2e" },
        { url: "/_next/static/chunks/1654-aef169d317251996.js", revision: "aef169d317251996" },
        { url: "/_next/static/chunks/217-572866400b7343ef.js", revision: "572866400b7343ef" },
        { url: "/_next/static/chunks/2849-11048791c0955a73.js", revision: "11048791c0955a73" },
        { url: "/_next/static/chunks/2853-a12315844335b505.js", revision: "a12315844335b505" },
        { url: "/_next/static/chunks/2960494e-accbe19a9bf68121.js", revision: "accbe19a9bf68121" },
        { url: "/_next/static/chunks/2a9a6835-1fc641f0e38ef723.js", revision: "1fc641f0e38ef723" },
        { url: "/_next/static/chunks/3693-f0224e3a7cb64ee2.js", revision: "f0224e3a7cb64ee2" },
        { url: "/_next/static/chunks/3866-412b426ecc11b029.js", revision: "412b426ecc11b029" },
        { url: "/_next/static/chunks/3c812832-c248547390ada745.js", revision: "c248547390ada745" },
        { url: "/_next/static/chunks/4744-27f5bf474b8ebf9c.js", revision: "27f5bf474b8ebf9c" },
        { url: "/_next/static/chunks/4adf0d75-062158bf818609dd.js", revision: "062158bf818609dd" },
        { url: "/_next/static/chunks/5206-e62a29b3685b7be8.js", revision: "e62a29b3685b7be8" },
        { url: "/_next/static/chunks/5481-da5e9e74ca43f1f8.js", revision: "da5e9e74ca43f1f8" },
        { url: "/_next/static/chunks/5497-1b2acc8031d83dba.js", revision: "1b2acc8031d83dba" },
        { url: "/_next/static/chunks/5626-20cf1601273e2472.js", revision: "20cf1601273e2472" },
        { url: "/_next/static/chunks/6426-9f667c2b5f472b26.js", revision: "9f667c2b5f472b26" },
        { url: "/_next/static/chunks/6646-12f6e6a7f4cc0cf4.js", revision: "12f6e6a7f4cc0cf4" },
        { url: "/_next/static/chunks/6960-c9fed837b436eb82.js", revision: "c9fed837b436eb82" },
        { url: "/_next/static/chunks/8054-2c72f4f2020862a7.js", revision: "2c72f4f2020862a7" },
        { url: "/_next/static/chunks/8495-d9a5e98c71dbabb9.js", revision: "d9a5e98c71dbabb9" },
        { url: "/_next/static/chunks/8559-89607ee1b7ec0fbd.js", revision: "89607ee1b7ec0fbd" },
        { url: "/_next/static/chunks/871-1520191367c215a8.js", revision: "1520191367c215a8" },
        { url: "/_next/static/chunks/9590-17c552e4011f0407.js", revision: "17c552e4011f0407" },
        { url: "/_next/static/chunks/9787-b7b10950f45bb4cd.js", revision: "b7b10950f45bb4cd" },
        { url: "/_next/static/chunks/9970-2cdfeb6ac278a0fa.js", revision: "2cdfeb6ac278a0fa" },
        {
          url: "/_next/static/chunks/app/_not-found/page-d5960b355aca6fc8.js",
          revision: "d5960b355aca6fc8",
        },
        {
          url: "/_next/static/chunks/app/about/page-4f952b64d96cd339.js",
          revision: "4f952b64d96cd339",
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
          url: "/_next/static/chunks/app/auth/signin/page-4c9636a49ab0ab2c.js",
          revision: "4c9636a49ab0ab2c",
        },
        {
          url: "/_next/static/chunks/app/auth/signup/page-49de160a68da6719.js",
          revision: "49de160a68da6719",
        },
        {
          url: "/_next/static/chunks/app/badges/page-d49cda79b5a38441.js",
          revision: "d49cda79b5a38441",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/loading-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/page-0cd0a639cf7ed63c.js",
          revision: "0cd0a639cf7ed63c",
        },
        {
          url: "/_next/static/chunks/app/blogs/error-b9da28801f62257b.js",
          revision: "b9da28801f62257b",
        },
        {
          url: "/_next/static/chunks/app/blogs/loading-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/blogs/new/page-880b543f52314963.js",
          revision: "880b543f52314963",
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
          url: "/_next/static/chunks/app/dashboard/page-3bec720124659c1b.js",
          revision: "3bec720124659c1b",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/error-216c8cba3b468f73.js",
          revision: "216c8cba3b468f73",
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
          url: "/_next/static/chunks/app/docs/layout-a6390a0dfbbf10ef.js",
          revision: "a6390a0dfbbf10ef",
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
          url: "/_next/static/chunks/app/layout-8aad2b8b3bfe8188.js",
          revision: "8aad2b8b3bfe8188",
        },
        { url: "/_next/static/chunks/app/page-598dcd51e817a7a6.js", revision: "598dcd51e817a7a6" },
        {
          url: "/_next/static/chunks/app/reading/layout-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/reading/loading-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/reading/page-79ba32e23be98d8b.js",
          revision: "79ba32e23be98d8b",
        },
        {
          url: "/_next/static/chunks/app/reading/stats/page-79103498f3cf48d7.js",
          revision: "79103498f3cf48d7",
        },
        {
          url: "/_next/static/chunks/app/test/page-3b9cd5f2633601c7.js",
          revision: "3b9cd5f2633601c7",
        },
        {
          url: "/_next/static/chunks/app/utils/calendar/page-3f250e422641e8ea.js",
          revision: "3f250e422641e8ea",
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
          url: "/_next/static/chunks/app/utils/theme/page-d48d1b18b3c674c7.js",
          revision: "d48d1b18b3c674c7",
        },
        {
          url: "/_next/static/chunks/app/utils/timeline/page-28dd0dd39af68f7a.js",
          revision: "28dd0dd39af68f7a",
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
        { url: "/_next/static/css/1fa12a432eebd2fe.css", revision: "1fa12a432eebd2fe" },
        { url: "/_next/static/css/973aa259beb3efb2.css", revision: "973aa259beb3efb2" },
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
        { url: "/images/HX-dark.svg", revision: "524f11c33290e3c8748b7aea91fcb69e" },
        { url: "/images/HX.svg", revision: "9e9ceac8c5389f5774962151f666e571" },
        { url: "/images/credly.svg", revision: "2acb0a185a1a83f2c7c8792c99ca3058" },
        { url: "/images/favor.svg", revision: "09c4c92df9cc061a52c42b3d35ceb1b3" },
        { url: "/images/span.svg", revision: "67d461640d384058d25c562400ee6700" },
        { url: "/manifest.json", revision: "924e2f8a57e1ee007d63bb6d279f2755" },
        { url: "/robots.txt", revision: "0fc71ac6389fed8aefd7d7924b0e9397" },
        { url: "/sitemap-0.xml", revision: "90f617f731616069795030e834130f7a" },
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
