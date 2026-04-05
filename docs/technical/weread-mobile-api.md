# WeRead Mobile API 接入文档

更新时间：2026-03-23
数据来源：

- 抓包探针: scripts/weread_endpoint_probe.jsonl
- 本地回放验证: curl + Node fetch

## 1. 当前必需参数

针对 i.weread.qq.com，当前验证结论如下。

请求头必需项：

- vid: 用户 vid，例如 16110108
- skey: 鉴权 token（wr_skey 或 wr_access_token）
- basever: 4 段版本号，例如 10.0.3.79
- channelid: 渠道，例如 AppStore
- v: 与 basever 一致，例如 10.0.3.79
- User-Agent: 必须是 3 段版本号格式，例如 WeRead/10.0.3 (iPhone; iOS 26.3.1; Scale/3.00)

Cookie 头：

- 可用格式: wr_pf=ios, wr_skey=<token>, wr_vid=<vid>
- 注意：当前实测下，部分接口即使不带 cookie 也可 200；但为了兼容性建议保持携带。

版本号关键约束：

- basever/v 可用 4 段（10.0.3.79）
- User-Agent 版本必须 3 段（10.0.3）
- 如果把 User-Agent 写成 WeRead/10.0.3.79，会出现 401 + errcode=-2012（登录超时）

## 2. 标准 token 存储字段

建议在存储字符串中至少包含：

- wr_vid
- wr_skey
- wr_access_token
- wr_basever
- wr_channelid
- wr_appver
- wr_pf

当前示例：
wr_vid=16110108; wr_skey=x2VikBWx; wr_access_token=x2VikBWx; wr_appver=10.0.3.79; wr_basever=10.0.3.79; wr_channelid=AppStore; wr_pf=ios

## 3. API 清单（抓包实证）

以下接口来自当前会话抓包，并确认返回 200。

### 3.1 GET /book/chapterReview

- 观测次数: 2
- 状态码: 200
- 典型 query:
  - bookId
  - chapterUid
  - getShareCount
  - synckey
- 响应字段（观测）:
  - review
  - reviewCount
  - shareCount
  - synckey

### 3.2 POST /ai/readbook

- 观测次数: 1
- 状态码: 200
- 响应字段（观测）:
  - items

### 3.3 POST /book/read

- 观测次数: 1
- 状态码: 200
- 响应字段（观测）:
  - succ

### 3.4 POST /store/titlesearch

- 观测次数: 1
- 状态码: 200
- 响应字段（观测）:
  - books

## 4. API 清单（手工验证通过）

以下接口在本地 curl/Node fetch 回放中验证 200。

### 4.1 GET /readdata/summary

- 示例: /readdata/summary?synckey=0
- 结果: 200
- 响应字段（观测）:
  - readTimes
  - readTimeGears
  - readTimeGearsExplain
  - synckey
  - registTime

### 4.2 GET /shelf/sync

- 示例: /shelf/sync?synckey=0&teenmode=0&album=1&onlyBookid=0
- 结果: 200
- 用途: 书架同步基础数据

## 5. 最小可用请求模板

curl 示例（summary）：

curl -s \
 -H "vid: <wr_vid>" \
 -H "skey: <wr_skey_or_wr_access_token>" \
 -H "basever: <wr_basever>" \
 -H "channelid: <wr_channelid>" \
 -H "v: <wr_basever>" \
 -H "user-agent: WeRead/<X.Y.Z> (iPhone; iOS 26.3.1; Scale/3.00)" \
 -H "cookie: wr_pf=ios, wr_skey=<token>, wr_vid=<vid>" \
 "https://i.weread.qq.com/readdata/summary?synckey=0"

其中 X.Y.Z 需由 wr_appver 或 wr_basever 截断得到前 3 段版本号。

## 6. 维护建议

- 抓包脚本继续保留对以下 header 的捕获：vid, skey/accesstoken, basever, channelid, v。
- 每次 App 升级后，先验证 User-Agent 与 basever 的组合是否仍可用。
- 当接口 401 且 errcode=-2012 时，优先检查 User-Agent 版本段数和 basever/channelid/v 是否齐全。
