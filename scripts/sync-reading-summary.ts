/**
 * 同步微信读书阅读时长数据到数据库
 *
 * 用法: npx tsx scripts/sync-reading-summary.ts
 *
 * 前提: 数据库中 WR_meta.cookieToken 已包含有效的 wr_vid 和 wr_skey
 *       (通过 mitmproxy 抓包获取，详见 weread_cookie_capture.py)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const READING_TIMES_URL = "https://i.weread.qq.com/readdata/summary";
const COOKIES_TOKENS = "cookieToken";
const READING_TIME_SYNC_KEY = "readingTime";
const REGISTER_TIME_KEY = "registerTime";

/** 从数据库读取 cookie 字符串并解析出 vid/skey */
function parseMobileAuth(cookieStr: string) {
  const map: Record<string, string> = {};
  cookieStr.split(";").forEach(pair => {
    const [key, ...vals] = pair.trim().split("=");
    if (key) map[key.trim()] = vals.join("=").trim();
  });
  return { vid: map["wr_vid"] || "", skey: map["wr_skey"] || "" };
}

async function main() {
  // 1. 从数据库获取 Token
  const tokenRow = await prisma.wRMeta.findUnique({
    where: { keyName: COOKIES_TOKENS },
  });
  const cookieStr = tokenRow?.keyValue ?? "";
  if (!cookieStr) {
    console.error("❌ 数据库中没有 cookieToken，请先运行抓包并更新 Token");
    process.exit(1);
  }

  const { vid, skey } = parseMobileAuth(cookieStr);
  if (!vid || !skey) {
    console.error("❌ cookieToken 中缺少 wr_vid 或 wr_skey");
    console.error("   当前值:", cookieStr);
    process.exit(1);
  }

  console.log(`📖 使用 vid=${vid} 请求阅读时长数据...`);

  // 2. 调用微信读书移动端 API
  const response = await fetch(`${READING_TIMES_URL}?synckey=0`, {
    headers: {
      vid,
      skey,
      cookie: cookieStr,
      "User-Agent": "WeRead/10.0.3 (iPhone; iOS 26.3; Scale/3.00)",
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(`❌ API 请求失败: ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const data = await response.json();

  if (data.errcode) {
    console.error(`❌ API 返回错误: ${data.errcode} - ${data.errmsg}`);
    if (data.errcode === -2010) {
      console.error("   Token 可能已过期，请重新抓包获取");
    }
    process.exit(1);
  }

  const { registTime, synckey, readTimes } = data;

  if (!readTimes || typeof readTimes !== "object") {
    console.error("❌ 返回数据中没有 readTimes 字段");
    process.exit(1);
  }

  const entries = Object.entries(readTimes) as [string, number][];
  console.log(`✅ 获取到 ${entries.length} 条阅读记录`);

  // 3. 读取数据库中已有的记录
  const existingRecords = await prisma.wRReadingSummary.findMany();
  const existingMap = new Map(existingRecords.map(r => [r.id, r.readingSeconds]));

  let created = 0;
  let updated = 0;
  let skipped = 0;

  // 4. 批量 upsert（并发控制，每批 50 条）
  const BATCH_SIZE = 50;
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const operations = batch
      .map(([dayKey, seconds]) => {
        const existing = existingMap.get(dayKey);
        if (existing === undefined) {
          created++;
        } else if (existing !== Number(seconds)) {
          updated++;
        } else {
          skipped++;
          return null;
        }
        return prisma.wRReadingSummary.upsert({
          where: { id: dayKey },
          update: { readingSeconds: Number(seconds) },
          create: { id: dayKey, readingSeconds: Number(seconds) },
        });
      })
      .filter(Boolean);

    if (operations.length > 0) {
      await Promise.all(operations);
    }
    process.stdout.write(
      `\r   进度: ${Math.min(i + BATCH_SIZE, entries.length)}/${entries.length}`,
    );
  }
  console.log();

  // 5. 更新元数据 (synckey, registTime)
  await Promise.all([
    prisma.wRMeta.upsert({
      where: { keyName: READING_TIME_SYNC_KEY },
      update: { keyValue: String(synckey) },
      create: { keyName: READING_TIME_SYNC_KEY, keyValue: String(synckey) },
    }),
    prisma.wRMeta.upsert({
      where: { keyName: REGISTER_TIME_KEY },
      update: { keyValue: String(registTime) },
      create: { keyName: REGISTER_TIME_KEY, keyValue: String(registTime) },
    }),
  ]);

  console.log(`\n📊 同步完成:`);
  console.log(`   新增: ${created} 条`);
  console.log(`   更新: ${updated} 条`);
  console.log(`   跳过: ${skipped} 条 (无变化)`);
  console.log(`   synckey: ${synckey}`);
  console.log(`   registTime: ${registTime}`);
}

main()
  .catch(err => {
    console.error("❌ 脚本执行失败:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
