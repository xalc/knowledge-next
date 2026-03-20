# knowledge-next

一个基于 Next.js（App Router）的个人知识站点：包含博客、文档/笔记，以及微信读书（WeRead）书架与阅读统计。

[English](./README.md)

## 功能

- 博客：Tiptap 编辑器，文章列表与详情页
- 文档/笔记：Markdown/MDX 渲染
- 微信读书：书架同步与阅读统计（年度热力图 + KPI 卡片）
- Dashboard 工具页（需登录）
- PWA 支持（`next-pwa`）

## 技术栈

- Next.js（App Router）+ React
- Tailwind CSS + shadcn/ui
- Prisma + MongoDB

## 快速开始

### 依赖

- Node.js 22+
- pnpm
- MongoDB（本地或托管）

### 环境变量

在项目根目录创建 `.env`，至少包含：

- `DATABASE_URL`：Prisma 使用的 MongoDB 连接串
- `SESSION_SECRET`：用于签发会话 cookie
- `PRODUCT_DOMAIN`：用于生成 sitemap 的站点域名（例如 `https://example.com`）

可选：

- `DASHSCOPE_API_KEY`：`/api/greeting`（Qwen）接口需要

### 安装与运行

```bash
pnpm install
pnpm dev
```

然后访问 `http://localhost:3000`。

## 常用命令

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
```

## 关于微信读书同步

本项目定位为个人使用，获取/同步微信读书数据可能依赖有效的 Web Cookie。请不要把 cookie 或 token 提交到仓库里。

## License

ISC（见 `package.json`）。
