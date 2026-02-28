# 微信读书数据接入与同步指南

本文档说明本项目中微信读书（WeRead）相关能力，包括：

- 网页端如何使用
- API 如何调用
- 如何从手机抓取认证信息（`wr_vid` / `wr_skey`）
- 如何把 reading summary 同步到数据库

---

## 1. 核心结论（先看）

1. `i.weread.qq.com`（移动端接口）认证依赖请求头 `vid` + `skey`。
2. 单纯网页 Cookie 通常不够，需要从手机 App 抓到认证信息。
3. 项目内已支持从 `cookieToken` 中解析 `wr_vid` / `wr_skey` 并注入请求头。
4. `reading summary` 建议用脚本同步（见第 6 节）。

---

## 2. 相关文件索引

- API

  - `src/app/api/wereader/validate/route.ts`：验证 token 是否可用
  - `src/app/api/wereader/summary/route.ts`：代理调用 summary 接口并返回详情
  - `src/app/api/update-cookies/route.ts`：保存 token 到数据库
  - `src/app/api/dashboard/route.ts`：网页“立即同步”触发入口

- WeRead 逻辑

  - `src/lib/wereader/constant.js`：WeRead 相关 URL 常量
  - `src/lib/wereader/singleton-fetch.js`：请求封装（自动识别移动端接口并附带 `vid/skey`）
  - `src/lib/wereader/wr-writer.ts`：同步书架/阅读数据到 DB 的主逻辑
  - `src/lib/wereader/wr-db.ts`：读取与更新 `cookieToken`

- 脚本
  - `scripts/weread_cookie_capture.py`：mitmproxy 抓包脚本
  - `scripts/sync-reading-summary.ts`：同步 reading summary 到 DB
  - `scripts/update-token.ts`：手动更新 DB 里的 `cookieToken`

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

## 4. 网页端使用流程

页面：Dashboard（组件在 `src/components/dashboard/board.tsx`）

1. 在“更新 Cookies”输入框粘贴 `cookieToken` 字符串
2. 先点“验证 Cookies”
   - 调用：`POST /api/wereader/validate`
3. 验证通过后点“更新 Cookies”
   - 调用：`POST /api/update-cookies`
4. 点“立即同步”
   - 调用：`GET /api/dashboard`

- 同步书架 + 阅读统计（reading summary）
- 页面会流式显示日志，包含每一步的成功/失败信息及最终结构化结果

> 说明：`/api/dashboard` 现在会依次执行 `bookshelf` 和 `readingSummary` 两个步骤；即使某一步失败，也会继续输出完整日志并给出汇总结果。

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
cd /Users/chao/Documents/coding/knowledge-next
mitmdump -s scripts/weread_cookie_capture.py --set block_global=false
```

> 脚本新行为：抓到完整 `vid + skey` 后会自动：
>
> 1. 写入 `scripts/weread_headers.json`
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

打开微信读书 App，进入书架/阅读页，脚本会在控制台打印认证信息。抓包成功后会自动完成并退出，同时输出：

- `scripts/weread_headers.json`
- `scripts/weread_cookie.txt`

控制台关键成功标志：

- `📋 已复制标准化 Cookie 到剪贴板`
- `🎉 首次成功捕获认证信息！已自动复制并准备退出抓包`

### 7.5 写回数据库

可选方式 A（网页）：

- Dashboard 页面粘贴 `scripts/weread_cookie.txt` 内容
- 依次点“验证 Cookies”“更新 Cookies”

可选方式 B（脚本）：

- 修改 `scripts/update-token.ts` 的 `newToken`
- 执行：
  ```bash
  npx tsx scripts/update-token.ts
  ```

### 7.6 清理代理（重要）

抓完后务必关闭手机代理：

- iPhone：HTTP 代理 -> 关闭

---

## 7.7 一次性抓取命令（推荐）

```bash
cd /Users/chao/Documents/coding/knowledge-next && mitmdump -s scripts/weread_cookie_capture.py --set block_global=false
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
