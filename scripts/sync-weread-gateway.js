const { execFileSync } = require("node:child_process");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const WEREAD_GATEWAY_URL = "https://i.weread.qq.com/api/agent/gateway";
const WEREAD_SKILL_VERSION = "1.0.4";
const DEFAULT_GATEWAY_TIMEOUT_MS = 20_000;
const BOOKS_SYNC_KEY = "lastSyncdBooksTime";
const READING_TIME_SYNC_KEY = "readingTime";
const REGISTER_TIME_KEY = "registerTime";
const READING_SUMMARY_START_YEAR = Number(process.env.WEREAD_SUMMARY_START_YEAR || 2021);
const READING_SUMMARY_END_YEAR = Number(
  process.env.WEREAD_SUMMARY_END_YEAR || new Date().getFullYear(),
);
const PROGRESS_CONCURRENCY = Number(process.env.WEREAD_PROGRESS_CONCURRENCY || 5);
const BOOK_UPSERT_CONCURRENCY = Number(process.env.WEREAD_BOOK_UPSERT_CONCURRENCY || 10);

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

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function toNumberOrNull(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function monthStartUnix(year, month) {
  const paddedMonth = String(month).padStart(2, "0");
  return Math.floor(new Date(`${year}-${paddedMonth}-01T00:00:00+08:00`).getTime() / 1000);
}

function getGatewayTimeoutMs() {
  const configured = Number(process.env.WEREAD_GATEWAY_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_GATEWAY_TIMEOUT_MS;
}

async function callWeReadGateway(apiName, payload = {}) {
  const timeoutMs = getGatewayTimeoutMs();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  let text;

  try {
    response = await fetch(WEREAD_GATEWAY_URL, {
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
    text = await response.text();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`WeRead gateway request timed out after ${timeoutMs}ms: ${apiName}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`WeRead gateway returned non-JSON response: HTTP ${response.status}`);
  }

  if (!response.ok) {
    throw new Error(
      `WeRead gateway request failed: HTTP ${response.status}, ${data.errmsg || response.statusText}`,
    );
  }

  if (data.upgrade_info) {
    const error = new Error(data.upgrade_info.message || "WeRead skill requires an upgrade.");
    error.name = "WeReadGatewayUpgradeError";
    error.upgradeRequired = true;
    throw error;
  }

  if (data.errcode !== undefined && Number(data.errcode) !== 0) {
    throw new Error(
      data.errmsg || data.errlog || `WeRead gateway returned errcode ${data.errcode}`,
    );
  }

  return data;
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = [];
  let nextIndex = 0;
  const workerCount = Math.max(1, Math.min(concurrency, items.length));

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (nextIndex < items.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        results[currentIndex] = await mapper(items[currentIndex], currentIndex);
      }
    }),
  );

  return results;
}

function shouldRefreshProgress(book, existing) {
  if (!existing) return true;
  if (Number(existing.readUpdateTime || 0) !== Number(book.readUpdateTime || 0)) return true;
  if (Number(book.finishReading ?? existing.finishReading) !== 1) return true;
  if (!existing.readProgress) return true;
  return false;
}

function normalizeProgress(bookId, response) {
  if (!response.book) return null;
  return {
    id: bookId,
    bookId,
    progress: toNumber(response.book.progress),
    updateTime: toNumber(response.book.updateTime),
    readingTime: toNumber(response.book.recordReadingTime),
  };
}

async function fetchProgressForBooks(books) {
  const progressByBookId = new Map();
  let failed = 0;
  let completed = 0;

  await mapWithConcurrency(books, PROGRESS_CONCURRENCY, async book => {
    try {
      const response = await callWeReadGateway("/book/getprogress", { bookId: book.bookId });
      const progress = normalizeProgress(book.bookId, response);
      if (progress) progressByBookId.set(book.bookId, progress);
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.log(
        `[sync][bookshelf(gateway)] progress failed for bookId=${book.bookId}: ${message}`,
      );
      if (error && error.upgradeRequired) throw error;
    } finally {
      completed += 1;
      if (books.length > 0 && (completed % 25 === 0 || completed === books.length)) {
        console.log(`[sync][bookshelf(gateway)] progress completed ${completed}/${books.length}`);
      }
    }
  });

  return { progressByBookId, failed };
}

function buildBookDocument(book, existing, progress) {
  return {
    id: book.bookId,
    bookId: book.bookId,
    title: book.title || "",
    author: book.author || "",
    translator: existing?.translator ?? null,
    cover: book.cover || "",
    publishTime: existing?.publishTime ?? null,
    category: book.category ?? null,
    categories: existing?.categories ?? null,
    lPushName: existing?.lPushName ?? null,
    readUpdateTime: toNumberOrNull(book.readUpdateTime),
    finishReading: toNumber(book.finishReading),
    readProgress: progress ?? existing?.readProgress ?? null,
  };
}

async function upsertBooks(books, existingByBookId, progressByBookId) {
  let created = 0;
  let updated = 0;
  let completed = 0;

  await mapWithConcurrency(books, BOOK_UPSERT_CONCURRENCY, async book => {
    try {
      const existing = existingByBookId.get(book.bookId);
      const doc = buildBookDocument(book, existing, progressByBookId.get(book.bookId));
      const updateData = {
        bookId: doc.bookId,
        title: doc.title,
        author: doc.author,
        translator: doc.translator,
        cover: doc.cover,
        publishTime: doc.publishTime,
        category: doc.category,
        categories: doc.categories,
        lPushName: doc.lPushName,
        readUpdateTime: doc.readUpdateTime,
        finishReading: doc.finishReading,
        readProgress: doc.readProgress,
      };

      if (existing) {
        updated += 1;
      } else {
        created += 1;
      }

      await prisma.wRBookShelt.upsert({
        where: { id: doc.id },
        update: updateData,
        create: doc,
      });
    } finally {
      completed += 1;
      if (books.length > 0 && (completed % 50 === 0 || completed === books.length)) {
        console.log(`[sync][bookshelf(gateway)] upsert completed ${completed}/${books.length}`);
      }
    }
  });

  return { created, updated };
}

async function syncBookshelf() {
  const shelf = await callWeReadGateway("/shelf/sync");
  if (!Array.isArray(shelf.books)) {
    throw new Error("Invalid gateway shelf response: books is missing.");
  }

  const books = shelf.books.filter(book => book && book.bookId);
  const albumCount = Array.isArray(shelf.albums) ? shelf.albums.length : 0;
  const hasMp = Boolean(shelf.mp);
  const existingBooks = await prisma.wRBookShelt.findMany({
    select: {
      id: true,
      bookId: true,
      translator: true,
      publishTime: true,
      categories: true,
      lPushName: true,
      readUpdateTime: true,
      finishReading: true,
      readProgress: true,
    },
  });
  const existingByBookId = new Map(existingBooks.map(book => [book.bookId, book]));
  const progressTargets = books.filter(book =>
    shouldRefreshProgress(book, existingByBookId.get(book.bookId)),
  );

  console.log(
    `[sync][bookshelf(gateway)] visible books=${books.length}, albums=${albumCount}, mp=${hasMp ? 1 : 0}, progressTargets=${progressTargets.length}`,
  );

  const { progressByBookId, failed: progressFailed } = await fetchProgressForBooks(progressTargets);
  const upsertResult = await upsertBooks(books, existingByBookId, progressByBookId);
  const syncTime = String(Math.floor(Date.now() / 1000));

  await prisma.wRMeta.upsert({
    where: { keyName: BOOKS_SYNC_KEY },
    update: { keyValue: syncTime },
    create: { keyName: BOOKS_SYNC_KEY, keyValue: syncTime },
  });

  return {
    bookCount: books.length,
    albumCount,
    hasMp,
    progressTargets: progressTargets.length,
    progressUpdated: progressByBookId.size,
    progressFailed,
    created: upsertResult.created,
    updated: upsertResult.updated,
    syncTime,
  };
}

async function syncReadingSummary() {
  const existingRecords = await prisma.wRReadingSummary.findMany();
  const existingById = new Map(existingRecords.map(record => [record.id, record.readingSeconds]));
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let total = 0;
  let monthCount = 0;
  let registerTime = "";

  for (let year = READING_SUMMARY_START_YEAR; year <= READING_SUMMARY_END_YEAR; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      const detail = await callWeReadGateway("/readdata/detail", {
        mode: "monthly",
        baseTime: monthStartUnix(year, month),
      });
      monthCount += 1;

      if (detail.registTime) registerTime = String(detail.registTime);

      const readTimes =
        detail.readTimes && typeof detail.readTimes === "object" ? detail.readTimes : {};
      const entries = Object.entries(readTimes);
      total += entries.length;

      for (const [dayId, seconds] of entries) {
        const readingSeconds = Math.trunc(Number(seconds) || 0);
        const existing = existingById.get(dayId);
        if (existing === undefined) {
          created += 1;
          existingById.set(dayId, readingSeconds);
          await prisma.wRReadingSummary.upsert({
            where: { id: dayId },
            update: { readingSeconds },
            create: { id: dayId, readingSeconds },
          });
        } else if (existing !== readingSeconds) {
          updated += 1;
          existingById.set(dayId, readingSeconds);
          await prisma.wRReadingSummary.upsert({
            where: { id: dayId },
            update: { readingSeconds },
            create: { id: dayId, readingSeconds },
          });
        } else {
          skipped += 1;
        }
      }
    }
    console.log(`[sync][readingSummary(gateway-monthly)] year=${year} processed`);
  }

  const syncTime = String(Math.floor(Date.now() / 1000));
  await prisma.wRMeta.upsert({
    where: { keyName: READING_TIME_SYNC_KEY },
    update: { keyValue: syncTime },
    create: { keyName: READING_TIME_SYNC_KEY, keyValue: syncTime },
  });

  if (registerTime) {
    await prisma.wRMeta.upsert({
      where: { keyName: REGISTER_TIME_KEY },
      update: { keyValue: registerTime },
      create: { keyName: REGISTER_TIME_KEY, keyValue: registerTime },
    });
  }

  return {
    years: `${READING_SUMMARY_START_YEAR}-${READING_SUMMARY_END_YEAR}`,
    months: monthCount,
    total,
    created,
    updated,
    skipped,
    syncTime,
    registerTime,
  };
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

async function main() {
  const steps = [];
  console.log(`[sync] Start WeRead gateway sync, skill_version=${WEREAD_SKILL_VERSION}`);
  console.log(
    "[sync] Backup reminder: keep a fresh raw export under .db-backups/ before data-changing syncs.",
  );

  try {
    const result = await syncBookshelf();
    const details = `books=${result.bookCount}, albums=${result.albumCount}, mp=${result.hasMp ? 1 : 0}, created=${result.created}, updated=${result.updated}, progressTargets=${result.progressTargets}, progressUpdated=${result.progressUpdated}, progressFailed=${result.progressFailed}, syncTime=${result.syncTime}`;
    console.log(`[sync][bookshelf(gateway)] success: ${details}`);
    steps.push({ step: "bookshelf", ok: true, details });
  } catch (error) {
    const message = formatError(error);
    console.log(`[sync][bookshelf(gateway)] failed: ${message}`);
    steps.push({ step: "bookshelf", ok: false, error: message });
    if (error && error.upgradeRequired) {
      console.log("[sync] Stopped because the WeRead skill gateway requires an upgrade.");
      process.exitCode = 1;
      return;
    }
  }

  try {
    const result = await syncReadingSummary();
    const details = `years=${result.years}, months=${result.months}, total=${result.total}, created=${result.created}, updated=${result.updated}, skipped=${result.skipped}, syncTime=${result.syncTime}`;
    console.log(`[sync][readingSummary(gateway-monthly)] success: ${details}`);
    steps.push({ step: "readingSummary", ok: true, details });
  } catch (error) {
    const message = formatError(error);
    console.log(`[sync][readingSummary(gateway-monthly)] failed: ${message}`);
    steps.push({ step: "readingSummary", ok: false, error: message });
    if (error && error.upgradeRequired) {
      console.log("[sync] Stopped because the WeRead skill gateway requires an upgrade.");
    }
  }

  const ok = steps.every(step => step.ok);
  console.log(`[sync] Done. overall=${ok ? "success" : "partial-failure"}`);
  if (!ok) process.exitCode = 1;
}

main()
  .catch(error => {
    console.error(`[sync] fatal: ${formatError(error)}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
