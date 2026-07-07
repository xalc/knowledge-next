/**
 * 从 skill 源头验证：直接调用 WeRead gateway /book/getprogress
 * 检查 recordReadingTime 的原始返回值
 *
 * 只读检查，不写入数据库
 */
const { execFileSync } = require("node:child_process");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const WEREAD_GATEWAY_URL = "https://i.weread.qq.com/api/agent/gateway";
const WEREAD_SKILL_VERSION = "1.0.4";
const DEFAULT_GATEWAY_TIMEOUT_MS = 20_000;

let cachedApiKey;

function readApiKeyFromLaunchctl() {
  if (process.platform !== "darwin") return "";
  try {
    return execFileSync("launchctl", ["getenv", "WEREAD_API_KEY"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function getApiKey() {
  if (cachedApiKey) return cachedApiKey;
  cachedApiKey = (process.env.WEREAD_API_KEY || readApiKeyFromLaunchctl()).trim();
  if (!cachedApiKey) {
    throw new Error("WEREAD_API_KEY is not configured.");
  }
  return cachedApiKey;
}

async function callWeReadGateway(apiName, payload = {}) {
  const timeoutMs = DEFAULT_GATEWAY_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(WEREAD_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_name: apiName,
        ...payload,
        skill_version: WEREAD_SKILL_VERSION,
      }),
      signal: controller.signal,
    });
    const text = await response.text();
    const data = JSON.parse(text);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}, ${data.errmsg || response.statusText}`);
    }
    if (data.upgrade_info) {
      throw new Error(data.upgrade_info.message || "WeRead skill requires an upgrade.");
    }
    if (data.errcode !== undefined && Number(data.errcode) !== 0) {
      throw new Error(data.errmsg || data.errlog || `errcode ${data.errcode}`);
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

function formatUnix(ts) {
  if (!ts || ts === 0) return "N/A";
  const num = Number(ts);
  if (!Number.isFinite(num) || num <= 0) return "N/A";
  return new Date(num * 1000).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
}

async function main() {
  console.log("=".repeat(70));
  console.log("  从 skill 源头验证 /book/getprogress 的 recordReadingTime");
  console.log("=".repeat(70));

  // 1. 从数据库取几本 readingTime=0 的书（混合在读和已读完）
  const allBooks = await prisma.wRBookShelt.findMany({
    select: { bookId: true, title: true, finishReading: true, readUpdateTime: true, readProgress: true },
  });

  const zeroBooks = allBooks.filter(b => {
    const rt = b.readProgress ? Number(b.readProgress.readingTime) || 0 : -1;
    return rt === 0;
  });
  const nonzeroBooks = allBooks.filter(b => {
    const rt = b.readProgress ? Number(b.readProgress.readingTime) || 0 : 0;
    return rt > 0;
  });

  console.log(`\n数据库统计: readingTime=0 的书 ${zeroBooks.length} 本, readingTime>0 的书 ${nonzeroBooks.length} 本`);

  // 2. 选取测试样本
  // 在读 + readingTime=0 的书（取5本，有不同 progress 的）
  const zeroReading = zeroBooks.filter(b => b.finishReading === 0);
  const zeroFinished = zeroBooks.filter(b => b.finishReading === 1);
  // 对比组：readingTime>0 的书（取3本）
  const nonzeroSample = nonzeroBooks.slice(0, 3);

  // 选几本有代表性的0秒书
  const zeroSample = [
    zeroReading.find(b => b.title.includes("深度学习")),
    zeroReading.find(b => b.title.includes("影响力")),
    zeroReading.find(b => b.title.includes("原则")),
    zeroReading.find(b => b.title.includes("孙子兵法") && b.readProgress?.progress === 20),
    zeroFinished.find(b => b.title.includes("挽救计划")),
    zeroFinished.find(b => b.title.includes("交易的世界")),
  ].filter(Boolean);

  console.log(`\n选取 ${zeroSample.length} 本 0秒书 + ${nonzeroSample.length} 本 非0秒书 进行 API 验证`);

  // 3. 逐本调用 /book/getprogress 检查原始返回
  console.log("\n" + "=".repeat(70));
  console.log("  A 组: 数据库中 readingTime=0 的书（直接调 API 看原始值）");
  console.log("=".repeat(70));

  for (const book of zeroSample) {
    console.log(`\n--- 《${book.title}》 bookId=${book.bookId} ---`);
    console.log(`  DB: finishReading=${book.finishReading}, readProgress=${JSON.stringify(book.readProgress)}`);

    try {
      const resp = await callWeReadGateway("/book/getprogress", { bookId: book.bookId });
      console.log(`  API 原始返回: ${JSON.stringify(resp)}`);
      const apiBook = resp.book || {};
      console.log(`  >> recordReadingTime = ${apiBook.recordReadingTime}`);
      console.log(`  >> progress = ${apiBook.progress}`);
      console.log(`  >> updateTime = ${apiBook.updateTime} (${formatUnix(apiBook.updateTime)})`);
      console.log(`  >> isStartReading = ${apiBook.isStartReading}`);

      const dbRt = Number(book.readProgress?.readingTime) || 0;
      const apiRt = Number(apiBook.recordReadingTime) || 0;
      if (apiRt === 0 && dbRt === 0) {
        console.log(`  >> 结论: API 确实返回 0，数据库无误。问题在 WeRead 服务端。`);
      } else if (apiRt > 0 && dbRt === 0) {
        console.log(`  >> 结论: API 返回 ${apiRt} 但 DB 是 0！数据库未更新或 shouldRefreshProgress 跳过了。`);
      } else if (apiRt === 0 && dbRt > 0) {
        console.log(`  >> 结论: API 返回 0 但 DB 有值。DB 是历史数据。`);
      } else {
        console.log(`  >> 结论: 两者都有值: API=${apiRt}, DB=${dbRt}`);
      }
    } catch (error) {
      console.log(`  API 调用失败: ${error.message}`);
    }

    // 限速，避免请求过快
    await new Promise(r => setTimeout(r, 500));
  }

  // 4. 对比组
  console.log("\n" + "=".repeat(70));
  console.log("  B 组: 数据库中 readingTime>0 的书（验证 API 一致性）");
  console.log("=".repeat(70));

  for (const book of nonzeroSample) {
    console.log(`\n--- 《${book.title}》 bookId=${book.bookId} ---`);
    console.log(`  DB: readProgress=${JSON.stringify(book.readProgress)}`);

    try {
      const resp = await callWeReadGateway("/book/getprogress", { bookId: book.bookId });
      const apiBook = resp.book || {};
      console.log(`  API 原始返回: ${JSON.stringify(resp)}`);
      console.log(`  >> recordReadingTime = ${apiBook.recordReadingTime}`);
      const dbRt = Number(book.readProgress?.readingTime) || 0;
      const apiRt = Number(apiBook.recordReadingTime) || 0;
      console.log(`  >> DB=${dbRt}s vs API=${apiRt}s ${dbRt === apiRt ? "(一致)" : "(不一致!)"}`);
    } catch (error) {
      console.log(`  API 调用失败: ${error.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  // 5. 检查 shouldRefreshProgress 逻辑对这些 0 秒书的影响
  console.log("\n" + "=".repeat(70));
  console.log("  C 组: shouldRefreshProgress 逻辑分析");
  console.log("=".repeat(70));

  function shouldRefreshProgress(book, existing) {
    if (!existing) return true;
    if (Number(existing.readUpdateTime ?? 0) !== Number(book.readUpdateTime ?? 0)) return true;
    if (Number(book.finishReading ?? existing.finishReading) !== 1) return true;
    if (!existing.readProgress) return true;
    return false;
  }

  // 模拟：从 /shelf/sync 拿到 shelf 数据，对比 DB 判断是否会刷新
  console.log("\n  从 /shelf/sync 获取书架，对比 DB 判断 shouldRefreshProgress:");
  try {
    const shelf = await callWeReadGateway("/shelf/sync");
    const shelfBooks = (shelf.books || []).filter(b => b.bookId);

    let wouldRefresh = 0;
    let wouldSkip = 0;
    let zeroAndWouldSkip = 0;
    let zeroAndWouldRefresh = 0;

    const existingMap = new Map(allBooks.map(b => [b.bookId, b]));

    for (const shelfBook of shelfBooks) {
      const existing = existingMap.get(shelfBook.bookId);
      const refresh = shouldRefreshProgress(shelfBook, existing);
      const dbRt = existing?.readProgress ? Number(existing.readProgress.readingTime) || 0 : -1;

      if (refresh) {
        wouldRefresh++;
        if (dbRt === 0) zeroAndWouldRefresh++;
      } else {
        wouldSkip++;
        if (dbRt === 0) zeroAndWouldSkip++;
      }
    }

    console.log(`  书架总书数: ${shelfBooks.length}`);
    console.log(`  会刷新 progress: ${wouldRefresh} 本`);
    console.log(`  会跳过 progress: ${wouldSkip} 本`);
    console.log(`  其中 readingTime=0 且会刷新: ${zeroAndWouldRefresh} 本`);
    console.log(`  其中 readingTime=0 且会跳过: ${zeroAndWouldSkip} 本`);

    if (zeroAndWouldSkip > 0) {
      console.log(`\n  >>> 发现问题: ${zeroAndWouldSkip} 本 readingTime=0 的书被 shouldRefreshProgress 跳过！`);
      console.log(`  >>> 这些书永远不会重新获取 progress，除非 readUpdateTime 变化或 finishReading 变为 1。`);

      // 列出这些书
      const skippedZeroBooks = [];
      for (const shelfBook of shelfBooks) {
        const existing = existingMap.get(shelfBook.bookId);
        if (!shouldRefreshProgress(shelfBook, existing)) {
          const dbRt = existing?.readProgress ? Number(existing.readProgress.readingTime) || 0 : -1;
          if (dbRt === 0) {
            skippedZeroBooks.push({
              title: existing?.title || shelfBook.title,
              bookId: shelfBook.bookId,
              finishReading: existing?.finishReading,
              readUpdateTime: existing?.readUpdateTime,
              shelfReadUpdateTime: shelfBook.readUpdateTime,
              progress: existing?.readProgress?.progress,
            });
          }
        }
      }
      console.log(`\n  被 shouldRefreshProgress 跳过的 0 秒书（前20本）:`);
      for (const b of skippedZeroBooks.slice(0, 20)) {
        console.log(`    - 《${b.title}》 finish=${b.finishReading}, progress=${b.progress}%, DB_update=${b.readUpdateTime}, shelf_update=${b.shelfReadUpdateTime}`);
      }
      if (skippedZeroBooks.length > 20) {
        console.log(`    ... 还有 ${skippedZeroBooks.length - 20} 本`);
      }
    }

    if (zeroAndWouldRefresh > 0) {
      console.log(`\n  >>> ${zeroAndWouldRefresh} 本 readingTime=0 的书下次同步会刷新 progress。`);
      console.log(`  >>> 如果刷新后仍为 0，说明 WeRead API 确实不返回这些书的阅读时长。`);
    }
  } catch (error) {
    console.log(`  /shelf/sync 调用失败: ${error.message}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("  验证完毕");
  console.log("=".repeat(70));
}

main()
  .catch(err => {
    console.error("验证脚本执行失败:", err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
