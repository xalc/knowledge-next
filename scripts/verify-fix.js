/**
 * 验证修复后的数据库状态
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function formatUnix(ts) {
  if (!ts || ts === 0) return "N/A";
  const num = Number(ts);
  if (!Number.isFinite(num) || num <= 0) return "N/A";
  return new Date(num * 1000).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
}

async function main() {
  console.log("=".repeat(70));
  console.log("  修复后验证");
  console.log("=".repeat(70));

  const allBooks = await prisma.wRBookShelt.findMany({
    select: { title: true, bookId: true, finishReading: true, readProgress: true },
  });

  let zeroCount = 0;
  let nonzeroCount = 0;
  const stillZero = [];

  for (const book of allBooks) {
    const rt = book.readProgress ? Number(book.readProgress.readingTime) || 0 : -1;
    if (rt === 0) {
      zeroCount++;
      stillZero.push(book);
    } else if (rt > 0) {
      nonzeroCount++;
    }
  }

  console.log(`\n总计: ${allBooks.length} 本`);
  console.log(`  readingTime > 0: ${nonzeroCount} 本 (修复前: 122 本)`);
  console.log(`  readingTime = 0: ${zeroCount} 本 (修复前: 160 本)`);

  if (stillZero.length > 0) {
    console.log(`\n仍然为 0 的书 (${stillZero.length} 本):`);
    for (const b of stillZero) {
      console.log(`  - 《${b.title}》 finish=${b.finishReading}, progress=${b.readProgress?.progress}%`);
    }
  } else {
    console.log("\n>>> 所有书都有阅读时长了！");
  }

  // 分布
  console.log("\n阅读时长分布:");
  const buckets = { "0秒": 0, "1~59秒": 0, "60秒~10分钟": 0, "10分钟~1小时": 0, "1~5小时": 0, "5小时以上": 0 };
  for (const book of allBooks) {
    const rt = book.readProgress ? Number(book.readProgress.readingTime) || 0 : 0;
    if (rt === 0) buckets["0秒"]++;
    else if (rt < 60) buckets["1~59秒"]++;
    else if (rt < 600) buckets["60秒~10分钟"]++;
    else if (rt < 3600) buckets["10分钟~1小时"]++;
    else if (rt < 18000) buckets["1~5小时"]++;
    else buckets["5小时以上"]++;
  }
  for (const [range, count] of Object.entries(buckets)) {
    const bar = "\u2588".repeat(Math.round(count / Math.max(1, allBooks.length) * 50));
    console.log(`  ${range.padEnd(14)} ${String(count).padStart(4)} 本  ${bar}`);
  }

  // 抽检几本之前为0的书
  console.log("\n抽检（修复前为0的书）:");
  const checks = ["深度学习", "影响力（全新升级版）", "原则", "孙子兵法", "挽救计划", "交易的世界"];
  for (const title of checks) {
    const book = allBooks.find(b => b.title.includes(title));
    if (book) {
      const rt = book.readProgress?.readingTime || 0;
      const mins = Math.floor(rt / 60);
      console.log(`  《${book.title}》 readingTime=${rt}s (${mins}分钟) finish=${book.finishReading}`);
    }
  }

  console.log("\n" + "=".repeat(70));
}

main()
  .catch(err => { console.error(err); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
