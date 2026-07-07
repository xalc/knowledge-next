# 微信读书数据接入与同步指南

本文档说明本项目中微信读书（WeRead）相关能力，包括：

- 网页端如何使用
- API 如何调用
- 如何从手机抓取认证信息（`wr_vid` / `wr_skey`）
- 如何把 reading summary 同步到数据库

---

## 1. 核心结论（先看）

1. Dashboard 的 `GET /api/dashboard` 目前默认不会执行 `syncWRDataToDB` 写库。
2. 写库同步由 feature flag `WEREAD_DASHBOARD_SYNC_ENABLED` 控制，只有值为 `true`、`1`、`yes` 或 `on` 时才会启用。
3. 默认禁用原因：Vercel Hobby Serverless Function 当前最多只能配置 60 秒执行时长，完整 WeRead gateway 同步可能超时。
4. 如需手动写库，优先在本地或长时任务环境执行 `pnpm sync:weread:gateway`，并先运行 `pnpm backup:db`。
5. 旧移动端接口认证依赖 `vid` + `skey`；skill gateway 写库依赖 `WEREAD_API_KEY`。

---

## 2. 相关文件索引

- API

  - `src/app/api/wereader/validate/route.ts`：验证 token 是否可用
  - `src/app/api/wereader/summary/route.ts`：代理调用 summary 接口并返回详情
  - `src/app/api/update-cookies/route.ts`：保存 token 到数据库
  - `src/app/api/dashboard/route.ts`：网页“立即同步”触发入口，受 `WEREAD_DASHBOARD_SYNC_ENABLED` 控制

- WeRead 逻辑

  - `src/lib/wereader/constant.js`：WeRead 相关 URL 常量
  - `src/lib/wereader/singleton-fetch.js`：请求封装（自动识别移动端接口并附带 `vid/skey`）
  - `src/lib/wereader/wr-writer.ts`：同步书架/阅读数据到 DB 的主逻辑
  - `src/lib/wereader/weread-gateway.ts`：skill gateway 请求封装
  - `src/lib/wereader/wr-db.ts`：读取与更新 `cookieToken`

- 脚本

  - `scripts/backup-database.js`：导出全库原始备份到 `.db-backups/`
  - `scripts/sync-weread-gateway.js`：通过 skill gateway 同步书架、进度、日级阅读数据
  - `scripts/weread_cookie_capture.py`：mitmproxy 抓包脚本
  - `scripts/sync-reading-summary.ts`：同步 reading summary 到 DB

- 文档
  - `docs/technical/weread-dashboard-sync-feature-flag.md`：Dashboard 写库开关与部署策略

---

## 2.1 Dashboard 写库 feature flag

环境变量：

```bash
WEREAD_DASHBOARD_SYNC_ENABLED=true
```

默认行为：

- 未设置该变量时，`GET /api/dashboard` 会完成登录校验并输出 `[SYNC][SKIPPED]` 日志。
- 跳过时不会导入或调用 `syncWRDataToDB`，也不会写入 `WRBookShelt`、`WRReadingSummary` 或 `WRMeta`。
- 返回的 `[SYNC][RESULT]` 中会包含 `skipped: true` 和 `featureFlag: "WEREAD_DASHBOARD_SYNC_ENABLED"`。

启用条件：

- `WEREAD_DASHBOARD_SYNC_ENABLED` 设置为 `true`、`1`、`yes` 或 `on`。
- 同时需要配置 `WEREAD_API_KEY`，否则 gateway 同步会失败。
- 在 Vercel Hobby 上启用前必须确认同步能在 60 秒内完成；否则应改用脚本、队列、Vercel Workflows 或外部 worker。

推荐操作：

1. 生产环境保持默认禁用。
2. 需要刷新数据时，在本地或长时任务环境运行 `pnpm backup:db`。
3. 备份确认后运行 `pnpm sync:weread:gateway`。
4. 确认 `/reading`、`/reading/stats` 和 `/api/skills/reading?view=overview` 数据正常。

---

## 3. 数据库存储约定

`WR_meta` 表中 key 为 `cookieToken` 的值，建议格式：

```text
wr_vid=<VID>; wr_skey=<SKEY>; wr_fp=<WR_FP>; wr_theme=white
```

至少要有：

- `wr_vid`
- `wr_skey`

---

## 3.1 隐私与安全约束

1. 不要在日志、Issue、聊天记录中粘贴完整 `cookieToken`。
2. 只允许在本地受控环境保存 `scripts/weread_cookie.txt`，并按需清理。
3. 调试输出统一使用脱敏格式（仅长度或掩码），禁止打印原始认证值。

---

## 4. 网页端使用流程

页面：Dashboard（组件在 `src/components/dashboard/board.tsx`）

1. 在“更新 Cookies”输入框粘贴 `cookieToken` 字符串
2. 先点“验证 Cookies”
   - 调用：`POST /api/wereader/validate`
3. 验证通过后点“更新 Cookies”
   - 调用：`POST /api/update-cookies`
4. 点“立即同步”
   - 调用：`GET /api/dashboard`

- 默认不会写库，会显示 feature flag 跳过日志
- 如果设置 `WEREAD_DASHBOARD_SYNC_ENABLED=true`，会调用 `syncWRDataToDB` 执行 gateway 写库同步
- Vercel Hobby 环境不建议打开该开关，除非确认同步总耗时小于 60 秒
- 页面会流式显示日志，包含每一步的成功/失败信息及最终结构化结果

---

## 5. API 调用示例

### 5.1 验证 token

```bash
curl -X POST http://localhost:3000/api/wereader/validate \
  -H "Content-Type: application/json" \
  -d '{"cookies":"wr_vid=xxx; wr_skey=yyy; wr_fp=zzz; wr_theme=white"}'
```

### 5.2 更新数据库 token

```bash
curl -X POST http://localhost:3000/api/update-cookies \
  -H "Content-Type: application/json" \
  -d '{"cookies":"wr_vid=xxx; wr_skey=yyy; wr_fp=zzz; wr_theme=white"}'
```

### 5.3 透传调用 summary（调试用）

```bash
curl -X POST http://localhost:3000/api/wereader/summary \
  -H "Content-Type: application/json" \
  -d '{"cookies":"wr_vid=xxx; wr_skey=yyy; wr_fp=zzz; wr_theme=white","synckey":0}'
```

---

## 6. 同步 reading summary 到数据库（推荐）

当前推荐的完整写库路径是 skill gateway 脚本：

```bash
pnpm backup:db
pnpm sync:weread:gateway
```

该脚本会通过 `POST https://i.weread.qq.com/api/agent/gateway` 写入书架、阅读进度和日级阅读统计。需要先配置 `WEREAD_API_KEY`。

旧移动端 summary 脚本仍保留，主要用于调试或回退：

脚本：`scripts/sync-reading-summary.ts`

执行：

```bash
npx tsx scripts/sync-reading-summary.ts
```

脚本行为：

1. 从 DB 读取 `cookieToken`
2. 解析 `wr_vid` / `wr_skey`
3. 请求 `https://i.weread.qq.com/readdata/summary?synckey=0`
4. 将 `readTimes` 批量 upsert 到 `WR_reading_summary`
5. 更新 `WR_meta` 中 `readingTime` 与 `registerTime`

---

## 7. 手机抓取 `wr_vid/wr_skey`（mitmproxy）

### 7.1 准备

```bash
brew install mitmproxy
```

### 7.2 启动抓包脚本

```bash
cd <project-root>
mitmdump -s scripts/weread_cookie_capture.py --set block_global=false
```

> 脚本新行为：抓到完整 `vid + skey` 后会自动：
>
> 1. 写入 `scripts/weread_headers.json`（脱敏元数据）
> 2. 写入标准化 `scripts/weread_cookie.txt`
> 3. 复制标准化 cookie 到系统剪贴板
> 4. 自动结束抓包进程

### 7.3 手机设置代理

1. 手机与 Mac 在同一 Wi-Fi
2. 获取 Mac IP（示例命令）
   ```bash
   ifconfig en0 | grep "inet " | awk '{print $2}'
   ```
3. iPhone：设置 -> Wi-Fi -> 当前网络 -> HTTP 代理 -> 手动
   - 服务器：Mac IP
   - 端口：`8080`
4. 首次使用需安装并信任 mitm 证书（访问 `mitm.it`）

### 7.4 触发抓包

打开微信读书 App，进入书架/阅读页。抓包成功后会自动完成并退出，同时输出：

- `scripts/weread_headers.json`
- `scripts/weread_cookie.txt`

控制台关键成功标志（结构化日志）：

- `[weread-cookie-capture] [INFO] Standardized cookie copied to clipboard.`
- `[weread-cookie-capture] [INFO] First successful capture completed. Shutting down mitmproxy.`

### 7.5 写回数据库

- Dashboard 页面粘贴 `scripts/weread_cookie.txt` 内容
- 依次点“验证 Cookies”“更新 Cookies”

### 7.6 清理代理（重要）

抓完后务必关闭手机代理：

- iPhone：HTTP 代理 -> 关闭

---

## 7.7 一次性抓取命令（推荐）

```bash
cd <project-root> && mitmdump -s scripts/weread_cookie_capture.py --set block_global=false
```

执行后不用手动 Ctrl+C：脚本在首次成功抓取后会自动退出。

---

## 8. 常见问题

### Q1: 返回 `errcode = -2010` / 用户不存在

通常是 `vid/skey` 不匹配或已失效，重新抓包并更新 `cookieToken`。

### Q2: 返回登录超时

重新抓包获取新的认证信息。

### Q3: 有 `wr_fp` 但没有 `wr_vid/wr_skey`

说明只拿到普通 Cookie，未抓到关键认证头；继续在 App 内操作，直到命中 `i.weread.qq.com` 的认证请求。

---

## 9. 快速最短路径（建议日常）

1. 手机抓包得到最新 `scripts/weread_cookie.txt`
2. Dashboard 验证并更新 Cookies
3. 执行：
   ```bash
   npx tsx scripts/sync-reading-summary.ts
   ```
4. 如需书架同步，再在 Dashboard 点“立即同步”
