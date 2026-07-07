# 微信读书数据接入与同步指南

本文档说明当前项目中的微信读书（WeRead）同步路径。项目已移除旧的手工认证抓包链路，统一使用 WeRead skill gateway。

---

## 1. 核心结论

1. 当前写库路径只支持 WeRead skill gateway。
2. 必需环境变量是 `WEREAD_API_KEY`。
3. Dashboard 写库默认关闭，由 `WEREAD_DASHBOARD_SYNC_ENABLED` 控制。
4. 生产环境建议用脚本或长时任务执行同步，不建议在 Vercel Hobby 的 60 秒 Serverless Function 内跑完整同步。
5. 旧的手工认证验证、认证保存、summary 代理和抓包脚本已移除。

---

## 2. 相关文件

- API

  - `src/app/api/dashboard/route.ts`：Dashboard 同步入口，受 `WEREAD_DASHBOARD_SYNC_ENABLED` 控制
  - `src/app/api/reading/insights/route.ts`：阅读页/统计页数据读取入口
  - `src/app/api/skills/reading/route.ts`：reading skills API

- WeRead 逻辑

  - `src/lib/wereader/weread-gateway.ts`：skill gateway 请求封装
  - `src/lib/wereader/wr-writer.ts`：书架、进度、日级阅读统计写库逻辑
  - `src/lib/wereader/wr-db.ts`：从数据库读取书架和统计数据
  - `src/lib/wereader/reading-insights.ts`：overview/trend/books/plan 聚合逻辑

- 脚本

  - `scripts/backup-database.js`：导出全库原始备份到 `.db-backups/`
  - `scripts/sync-weread-gateway.js`：通过 skill gateway 同步书架、进度、日级阅读数据

- 文档

  - `docs/technical/weread-dashboard-sync-feature-flag.md`：Dashboard 写库开关与部署策略

---

## 3. 环境变量

```bash
DATABASE_URL=<mongodb connection string>
WEREAD_API_KEY=<weread skill gateway key>
```

可选：

```bash
WEREAD_DASHBOARD_SYNC_ENABLED=true
WEREAD_GATEWAY_TIMEOUT_MS=30000
WEREAD_SUMMARY_START_YEAR=2021
WEREAD_SUMMARY_END_YEAR=2026
WEREAD_PROGRESS_CONCURRENCY=5
WEREAD_BOOK_UPSERT_CONCURRENCY=10
```

`WEREAD_DASHBOARD_SYNC_ENABLED` 的启用值：

- `true`
- `1`
- `yes`
- `on`

未设置时，Dashboard 只返回 `[SYNC][SKIPPED]`，不会调用 `syncWRDataToDB`，也不会写库。

---

## 4. 推荐同步流程

完整写库前先备份数据库：

```bash
pnpm backup:db
pnpm sync:weread:gateway
```

同步脚本会执行：

1. 调用 `/shelf/sync` 同步书架到 `WRBookShelt`。
2. 对新增、变化、未读完或缺少进度的书调用 `/book/getprogress`。
3. 从 `WEREAD_SUMMARY_START_YEAR` 到当前年逐月调用 `/readdata/detail`，写入 `WRReadingSummary`。
4. 更新 `WRMeta.readingTime`、`WRMeta.registerTime` 和 `WRMeta.lastSyncdBooksTime`。

---

## 5. Dashboard 同步

Dashboard 页面仍保留“立即同步”按钮，但默认不写库。

默认行为：

```text
[SYNC][SKIPPED] syncWRDataToDB is disabled by feature flag WEREAD_DASHBOARD_SYNC_ENABLED.
```

如果要临时允许 Dashboard 触发写库：

```bash
WEREAD_DASHBOARD_SYNC_ENABLED=true
```

注意：Vercel Hobby 当前配置为 `maxDuration = 60`。完整同步可能超过 60 秒，超时会中断请求。因此生产推荐继续使用脚本、队列、Vercel Workflows 或外部 worker。

---

## 6. 数据读取

页面和 API 继续读取同一套数据库表：

- `/reading`
- `/reading/stats`
- `/api/reading/insights`
- `/api/skills/reading`

这些读取路径不依赖外部认证信息，也不直接调用 WeRead gateway。它们只读取已同步到 MongoDB 的 `WRBookShelt`、`WRReadingSummary` 和 `WRMeta`。

---

## 7. 安全约束

1. 不要提交 `WEREAD_API_KEY`、`.env` 或 `.db-backups/`。
2. `.db-backups/` 是原始数据库备份，可能包含敏感数据，必须保持 untracked。
3. 同步日志不要打印原始 API key。
4. 旧手工认证抓包链路已删除，不再通过 Dashboard 保存 WeRead 认证信息。
