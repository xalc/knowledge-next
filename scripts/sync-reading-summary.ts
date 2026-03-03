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

type LogMeta = Record<string, unknown>;

function writeLog(level: "INFO" | "WARN" | "ERROR", message: string, meta?: LogMeta) {
  const prefix = `[sync-reading-summary] [${level}]`;
  if (!meta) {
    console.log(`${prefix} ${message}`);
    return;
  }
  console.log(`${prefix} ${message} ${JSON.stringify(meta)}`);
}

function maskToken(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "***";
  return `${value.slice(0, 4)}***${value.slice(-4)}`;
}

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
    writeLog("ERROR", "Missing required token in database.", { keyName: COOKIES_TOKENS });
    throw new Error("Missing required token in database.");
  }

  const { vid, skey } = parseMobileAuth(cookieStr);
  if (!vid || !skey) {
    writeLog("ERROR", "Mobile auth headers are missing in cookie token.", {
      hasWrVid: Boolean(vid),
      hasWrSkey: Boolean(skey),
      cookieLength: cookieStr.length,
    });
    throw new Error("Mobile auth headers are missing in cookie token.");
  }

  writeLog("INFO", "Requesting reading summary from mobile API.", {
    vid: maskToken(vid),
    endpoint: READING_TIMES_URL,
  });

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
    writeLog("ERROR", "Reading summary request failed.", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error(`Reading summary request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.errcode) {
    writeLog("ERROR", "Reading summary API returned an error.", {
      errcode: data.errcode,
      errmsg: data.errmsg,
    });
    if (data.errcode === -2010) {
      writeLog("WARN", "Token may be expired. Refresh cookie token from capture.");
    }
    throw new Error(`Reading summary API returned errcode ${data.errcode}`);
  }

  const { registTime, synckey, readTimes } = data;

  if (!readTimes || typeof readTimes !== "object") {
    writeLog("ERROR", "Invalid API payload: readTimes is missing.");
    throw new Error("Invalid API payload: readTimes is missing.");
  }

  const entries = Object.entries(readTimes) as [string, number][];
  writeLog("INFO", "Reading summary payload parsed.", { records: entries.length });

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

  writeLog("INFO", "Synchronization completed.", {
    created,
    updated,
    skipped,
    synckey: String(synckey),
    registTime: String(registTime),
  });
}

main()
  .catch(err => {
    writeLog("ERROR", "Script execution failed.", {
      message: err instanceof Error ? err.message : String(err),
    });
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
