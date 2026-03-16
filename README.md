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

This project is designed for personal use. It may require a valid WeRead web cookie to fetch/sync data. Do not commit cookies or tokens into the repo.

## License

ISC (see `package.json`).
