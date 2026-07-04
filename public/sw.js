if (!self.define) {
  let e,
    s = {};
  const a = (a, c) => (
    (a = new URL(a + ".js", c).href),
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
  self.define = (c, i) => {
    const t = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (s[t]) return;
    let n = {};
    const r = e => a(e, t),
      d = { module: { uri: t }, exports: n, require: r };
    s[t] = Promise.all(c.map(e => d[e] || r(e))).then(e => (i(...e), n));
  };
}
define(["./workbox-e9849328"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/Z_BWLTbaW05una5zBEhbC/_buildManifest.js",
          revision: "6a223956e1971b704a419e7b6d35d8e7",
        },
        {
          url: "/_next/static/Z_BWLTbaW05una5zBEhbC/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/_next/static/chunks/1423-92d7071db713b6e4.js", revision: "92d7071db713b6e4" },
        { url: "/_next/static/chunks/217-d4b417768f83f03f.js", revision: "d4b417768f83f03f" },
        { url: "/_next/static/chunks/2960494e-4d999b4ba8a38844.js", revision: "4d999b4ba8a38844" },
        { url: "/_next/static/chunks/2a9a6835-1fc641f0e38ef723.js", revision: "1fc641f0e38ef723" },
        { url: "/_next/static/chunks/3347-f09091809f3f3b19.js", revision: "f09091809f3f3b19" },
        { url: "/_next/static/chunks/3538-d41b8063a68ec7cf.js", revision: "d41b8063a68ec7cf" },
        { url: "/_next/static/chunks/3693-f0224e3a7cb64ee2.js", revision: "f0224e3a7cb64ee2" },
        { url: "/_next/static/chunks/3751-4aa1927349167f1e.js", revision: "4aa1927349167f1e" },
        { url: "/_next/static/chunks/3c812832-c248547390ada745.js", revision: "c248547390ada745" },
        { url: "/_next/static/chunks/4255-40d143b142978c43.js", revision: "40d143b142978c43" },
        { url: "/_next/static/chunks/4272-72c7308d6f8da21d.js", revision: "72c7308d6f8da21d" },
        { url: "/_next/static/chunks/441-798dc5795ed4c277.js", revision: "798dc5795ed4c277" },
        { url: "/_next/static/chunks/4744-27f5bf474b8ebf9c.js", revision: "27f5bf474b8ebf9c" },
        { url: "/_next/static/chunks/4adf0d75-062158bf818609dd.js", revision: "062158bf818609dd" },
        { url: "/_next/static/chunks/5206-e62a29b3685b7be8.js", revision: "e62a29b3685b7be8" },
        { url: "/_next/static/chunks/5290-dda31cdb3f77edb3.js", revision: "dda31cdb3f77edb3" },
        { url: "/_next/static/chunks/5291-dd4a948bba0a3544.js", revision: "dd4a948bba0a3544" },
        { url: "/_next/static/chunks/5481-fcd244c39852cee6.js", revision: "fcd244c39852cee6" },
        { url: "/_next/static/chunks/5626-8f38316d06545413.js", revision: "8f38316d06545413" },
        { url: "/_next/static/chunks/5759-2b3124e0be42dcf2.js", revision: "2b3124e0be42dcf2" },
        { url: "/_next/static/chunks/6027-ec03632aa3c4160a.js", revision: "ec03632aa3c4160a" },
        { url: "/_next/static/chunks/6574-067a7183e4b487af.js", revision: "067a7183e4b487af" },
        { url: "/_next/static/chunks/6613-2b11475ed01c8324.js", revision: "2b11475ed01c8324" },
        { url: "/_next/static/chunks/7715-6cf8fc3b74015336.js", revision: "6cf8fc3b74015336" },
        { url: "/_next/static/chunks/7891-9f61d2f573241b84.js", revision: "9f61d2f573241b84" },
        { url: "/_next/static/chunks/8013-1e1ac5e781b3d04f.js", revision: "1e1ac5e781b3d04f" },
        { url: "/_next/static/chunks/8054-2c72f4f2020862a7.js", revision: "2c72f4f2020862a7" },
        { url: "/_next/static/chunks/8947-70fe03d8b2fb13c6.js", revision: "70fe03d8b2fb13c6" },
        { url: "/_next/static/chunks/9221-dc87ad6deb78ae0d.js", revision: "dc87ad6deb78ae0d" },
        { url: "/_next/static/chunks/9412-c958f3e0121435ff.js", revision: "c958f3e0121435ff" },
        { url: "/_next/static/chunks/9787-b7b10950f45bb4cd.js", revision: "b7b10950f45bb4cd" },
        {
          url: "/_next/static/chunks/app/_not-found/page-d5960b355aca6fc8.js",
          revision: "d5960b355aca6fc8",
        },
        {
          url: "/_next/static/chunks/app/about/page-eac975443c07de0e.js",
          revision: "eac975443c07de0e",
        },
        {
          url: "/_next/static/chunks/app/api/chat/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/dashboard/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/greeting/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/image/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/reading/insights/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/skills-agent/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/skills/reading/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/tags/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/update-cookies/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/upload/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/wereader/summary/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/api/wereader/validate/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/auth/layout-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/auth/signin/page-c7e4e2955b02bedb.js",
          revision: "c7e4e2955b02bedb",
        },
        {
          url: "/_next/static/chunks/app/auth/signup/page-8b7aeeea09a1f357.js",
          revision: "8b7aeeea09a1f357",
        },
        {
          url: "/_next/static/chunks/app/badges/page-41c81605705f1076.js",
          revision: "41c81605705f1076",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/loading-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/blogs/%5Bslug%5D/page-637c17055da72095.js",
          revision: "637c17055da72095",
        },
        {
          url: "/_next/static/chunks/app/blogs/error-559ff04d4ced2827.js",
          revision: "559ff04d4ced2827",
        },
        {
          url: "/_next/static/chunks/app/blogs/loading-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/blogs/new/page-b25c313733b92218.js",
          revision: "b25c313733b92218",
        },
        {
          url: "/_next/static/chunks/app/blogs/page-6ef37e81a7a370fc.js",
          revision: "6ef37e81a7a370fc",
        },
        {
          url: "/_next/static/chunks/app/blogs/sitemap/%5B__metadata_id__%5D/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/dashboard/layout-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-6139614eab32674e.js",
          revision: "6139614eab32674e",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/error-330fadcf113e93ac.js",
          revision: "330fadcf113e93ac",
        },
        {
          url: "/_next/static/chunks/app/docs/%5Bslug%5D/loading-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
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
          url: "/_next/static/chunks/app/docs/layout-81530d8de6795811.js",
          revision: "81530d8de6795811",
        },
        {
          url: "/_next/static/chunks/app/docs/loading-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/docs/page-3355a8d45bd92829.js",
          revision: "3355a8d45bd92829",
        },
        {
          url: "/_next/static/chunks/app/docs/sitemap/%5B__metadata_id__%5D/route-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/layout-ef6d62c66db0086d.js",
          revision: "ef6d62c66db0086d",
        },
        { url: "/_next/static/chunks/app/page-70dc2825e50c2035.js", revision: "70dc2825e50c2035" },
        {
          url: "/_next/static/chunks/app/reading/layout-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/reading/loading-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/reading/page-3fabc43b55cd5c32.js",
          revision: "3fabc43b55cd5c32",
        },
        {
          url: "/_next/static/chunks/app/reading/stats/page-ffaf993b82d1152d.js",
          revision: "ffaf993b82d1152d",
        },
        {
          url: "/_next/static/chunks/app/test/page-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/utils/calendar/page-72edb8e73afccebd.js",
          revision: "72edb8e73afccebd",
        },
        {
          url: "/_next/static/chunks/app/utils/chat/page-2077c743dd3b3f40.js",
          revision: "2077c743dd3b3f40",
        },
        {
          url: "/_next/static/chunks/app/utils/demo/page-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/utils/layout-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/utils/page-2542a3148d103c37.js",
          revision: "2542a3148d103c37",
        },
        {
          url: "/_next/static/chunks/app/utils/skills-reading/page-16c5320892e66b98.js",
          revision: "16c5320892e66b98",
        },
        {
          url: "/_next/static/chunks/app/utils/skills/page-d46e021ecd215369.js",
          revision: "d46e021ecd215369",
        },
        {
          url: "/_next/static/chunks/app/utils/status/page-0e44493f505d9ce1.js",
          revision: "0e44493f505d9ce1",
        },
        {
          url: "/_next/static/chunks/app/utils/theme/page-5a7748a19c2a7bb1.js",
          revision: "5a7748a19c2a7bb1",
        },
        {
          url: "/_next/static/chunks/app/utils/timeline/page-c1f5da83062fd985.js",
          revision: "c1f5da83062fd985",
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
        { url: "/_next/static/css/7b5e77224990aa55.css", revision: "7b5e77224990aa55" },
        { url: "/_next/static/css/d96ed30287942a7b.css", revision: "d96ed30287942a7b" },
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
        { url: "/sitemap-0.xml", revision: "918a44567696232c13dac1f5dc3d07fb" },
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
            cacheWillUpdate: async ({ request: e, response: s, event: a, state: c }) =>
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
