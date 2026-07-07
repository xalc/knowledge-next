# knowledge-next

Personal knowledge hub built with Next.js (App Router): blog, docs/notes, and WeRead (微信读书) bookshelf + reading stats.

[中文说明](./README.zh-CN.md)

## Features

- Blog editor (Tiptap) and blog list/detail pages
- Docs/notes rendered from Markdown/MDX
- WeRead bookshelf sync and reading stats (yearly heatmap + KPI cards)
- Dashboard utilities (auth-protected)
- PWA support (via `next-pwa`)

## Tech Stack

- Next.js (App Router) + React
- Tailwind CSS + shadcn/ui
- Prisma + MongoDB

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- MongoDB (local or hosted)

### Environment Variables

Create `.env` with at least:

- `DATABASE_URL`: MongoDB connection string for Prisma
- `SESSION_SECRET`: used to sign the session cookie
- `PRODUCT_DOMAIN`: base domain used for sitemap generation (e.g. `https://example.com`)

Optional:

- `DASHSCOPE_API_KEY`: required for `/api/greeting` (Qwen model)
- `WEREAD_API_KEY`: required by the WeRead skill gateway sync client
- `WEREAD_DASHBOARD_SYNC_ENABLED`: feature flag for dashboard-triggered WeRead writes; defaults to disabled and only runs when set to `true`, `1`, `yes`, or `on`

### Install & Run

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
```

## Notes on WeRead Sync

This project is designed for personal use. WeRead writes use the WeRead skill gateway and require `WEREAD_API_KEY`. Do not commit tokens into the repo.

Dashboard-triggered WeRead database writes are disabled by default to avoid long-running Vercel Hobby serverless executions. Set `WEREAD_DASHBOARD_SYNC_ENABLED=true` only when the deployment can safely finish the sync within the configured function duration.

## License

ISC (see `package.json`).
