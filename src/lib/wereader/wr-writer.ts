import {
  GatewayShelfBook,
  WeReadGatewayUpgradeError,
  getGatewayBookProgress,
  getGatewayReadingDetail,
  getGatewayShelf,
} from "@/lib/wereader/weread-gateway";
import { BOOKS_SYNC_KEY, READING_TIME_SYNC_KEY, REGISTER_TIME_KEY } from "@/lib/wereader/constant";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";

type SyncLogger = (...args: unknown[]) => void;

const defaultLogger: SyncLogger = (...args) => console.log(...args);
const READING_SUMMARY_START_YEAR = 2021;
const PROGRESS_CONCURRENCY = 5;
const BOOK_UPSERT_CONCURRENCY = 10;

type SyncStepResult = {
  step: "bookshelf" | "readingSummary";
  ok: boolean;
  details?: string;
  error?: string;
};

type SyncWRResult = {
  ok: boolean;
  steps: SyncStepResult[];
  message: string;
};

type SyncOptions = {
  summaryStartYear?: number;
  summaryEndYear?: number;
  progressConcurrency?: number;
};

function buildSyncResult(steps: SyncStepResult[]): SyncWRResult {
  const allOk = steps.every(step => step.ok);
  return {
    ok: allOk,
    steps,
    message: allOk
      ? "successfully synced wechat reader data"
      : "wechat reader sync completed with partial failures",
  };
}

type ExistingBook = {
  id: string;
  bookId: string;
  translator: string | null;
  publishTime: Date | null;
  categories: unknown;
  lPushName: string | null;
  readUpdateTime: number | null;
  finishReading: number;
  readProgress: unknown;
};

type NormalizedProgress = {
  id: string;
  bookId: string;
  progress: number;
  updateTime: number;
  readingTime: number;
};

type BookDocument = {
  id: string;
  bookId: string;
  title: string;
  author: string;
  translator: string | null;
  cover: string;
  publishTime: Date | null;
  category: string | null;
  categories: Prisma.InputJsonValue | null;
  lPushName: string | null;
  readUpdateTime: number | null;
  finishReading: number;
  readProgress: Prisma.InputJsonValue | null;
};

function toNumberOrNull(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function toNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function monthStartUnix(year: number, month: number) {
  const paddedMonth = String(month).padStart(2, "0");
  return Math.floor(new Date(`${year}-${paddedMonth}-01T00:00:00+08:00`).getTime() / 1000);
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
) {
  const results: R[] = [];
  let nextIndex = 0;
  const workerCount = Math.max(1, Math.min(concurrency, items.length));

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (nextIndex < items.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        results[currentIndex] = await mapper(items[currentIndex]);
      }
    }),
  );

  return results;
}

function shouldRefreshProgress(book: GatewayShelfBook, existing?: ExistingBook) {
  if (!existing) return true;
  if (Number(existing.readUpdateTime ?? 0) !== Number(book.readUpdateTime ?? 0)) return true;
  if (!existing.readProgress) return true;
  // Refresh legacy rows that were synced before the gateway readingTime field was mapped.
  const existingProgress = existing.readProgress as { readingTime?: number } | null;
  if (
    !existingProgress ||
    !Number(existingProgress.readingTime) ||
    Number(existingProgress.readingTime) <= 0
  ) {
    return true;
  }
  if (Number(book.finishReading ?? existing.finishReading) !== 1) return true;
  return false;
}

function normalizeProgress(
  bookId: string,
  response: Awaited<ReturnType<typeof getGatewayBookProgress>>,
) {
  const book = response.book;
  if (!book) return null;

  return {
    id: bookId,
    bookId,
    progress: toNumber(book.progress),
    updateTime: toNumber(book.updateTime),
    readingTime: toNumber(book.readingTime ?? book.recordReadingTime),
  };
}

async function fetchProgressForBooks(
  books: GatewayShelfBook[],
  concurrency: number,
  logger: SyncLogger,
) {
  const progressByBookId = new Map<string, NormalizedProgress>();
  let failed = 0;
  let completed = 0;

  await mapWithConcurrency(books, concurrency, async book => {
    try {
      const response = await getGatewayBookProgress(book.bookId);
      const progress = normalizeProgress(book.bookId, response);
      if (progress) {
        progressByBookId.set(book.bookId, progress);
      }
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      logger(`[SYNC][bookshelf(gateway)] progress failed for bookId=${book.bookId}: ${message}`);
      if (error instanceof WeReadGatewayUpgradeError) {
        throw error;
      }
    } finally {
      completed += 1;
      if (books.length > 0 && (completed % 25 === 0 || completed === books.length)) {
        logger(`[SYNC][bookshelf(gateway)] progress completed ${completed}/${books.length}`);
      }
    }
  });

  return { progressByBookId, failed };
}

function buildBookDocument(
  book: GatewayShelfBook,
  existing: ExistingBook | undefined,
  progress: NormalizedProgress | undefined,
): BookDocument {
  return {
    id: book.bookId,
    bookId: book.bookId,
    title: book.title ?? "",
    author: book.author ?? "",
    translator: existing?.translator ?? null,
    cover: book.cover ?? "",
    publishTime: existing?.publishTime ?? null,
    category: book.category ?? null,
    categories: (existing?.categories ?? null) as Prisma.InputJsonValue | null,
    lPushName: existing?.lPushName ?? null,
    readUpdateTime: toNumberOrNull(book.readUpdateTime),
    finishReading: toNumber(book.finishReading),
    readProgress: (progress ?? existing?.readProgress ?? null) as Prisma.InputJsonValue | null,
  };
}

async function upsertBooks(
  books: GatewayShelfBook[],
  existingByBookId: Map<string, ExistingBook>,
  progressByBookId: Map<string, NormalizedProgress>,
  logger: SyncLogger,
) {
  let created = 0;
  let updated = 0;
  let skipped = 0;
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

      if (!existing) {
        created += 1;
      } else {
        updated += 1;
      }

      const result = await prisma.wRBookShelt.upsert({
        where: { id: doc.id },
        update: updateData,
        create: doc,
      });

      if (result) return;
      skipped += 1;
    } finally {
      completed += 1;
      if (books.length > 0 && (completed % 50 === 0 || completed === books.length)) {
        logger(`[SYNC][bookshelf(gateway)] upsert completed ${completed}/${books.length}`);
      }
    }
  });

  return { created, updated, skipped };
}

const syncWRBookShelf = async (logger: SyncLogger, options: SyncOptions) => {
  const shelf = await getGatewayShelf();
  const books = Array.isArray(shelf.books) ? shelf.books.filter(book => book.bookId) : [];
  const albumCount = Array.isArray(shelf.albums) ? shelf.albums.length : 0;
  const hasMp = Boolean(shelf.mp);

  if (!Array.isArray(shelf.books)) {
    throw new Error("Invalid gateway shelf response: books is missing.");
  }

  const existingBooks = (await prisma.wRBookShelt.findMany({
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
  })) as ExistingBook[];
  const existingByBookId = new Map(existingBooks.map(book => [book.bookId, book]));
  const progressTargets = books.filter(book =>
    shouldRefreshProgress(book, existingByBookId.get(book.bookId)),
  );

  logger(
    `[SYNC][bookshelf(gateway)] visible books=${books.length}, albums=${albumCount}, mp=${hasMp ? 1 : 0}, progressTargets=${progressTargets.length}`,
  );

  const { progressByBookId, failed: progressFailed } = await fetchProgressForBooks(
    progressTargets,
    options.progressConcurrency ?? PROGRESS_CONCURRENCY,
    logger,
  );
  const upsertResult = await upsertBooks(books, existingByBookId, progressByBookId, logger);
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
};

async function syncWRReadingtimeSummary(logger: SyncLogger, options: SyncOptions) {
  const currentYear = new Date().getFullYear();
  const startYear = options.summaryStartYear ?? READING_SUMMARY_START_YEAR;
  const endYear = options.summaryEndYear ?? currentYear;
  const existingRecords = await prisma.wRReadingSummary.findMany({});
  const existingMap = new Map(existingRecords.map(record => [record.id, record.readingSeconds]));

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let total = 0;
  let monthCount = 0;
  let registerTime = "";

  for (let year = startYear; year <= endYear; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      const detail = await getGatewayReadingDetail({
        mode: "monthly",
        baseTime: monthStartUnix(year, month),
      });
      monthCount += 1;
      if (detail.registTime) {
        registerTime = String(detail.registTime);
      }

      const readTimes =
        detail.readTimes && typeof detail.readTimes === "object" ? detail.readTimes : {};
      const entries = Object.entries(readTimes);
      total += entries.length;

      for (const [dayId, seconds] of entries) {
        const readingSeconds = Number(seconds) || 0;
        const existing = existingMap.get(dayId);
        if (existing === undefined) {
          created += 1;
          existingMap.set(dayId, readingSeconds);
          await prisma.wRReadingSummary.upsert({
            where: { id: dayId },
            update: { readingSeconds },
            create: { id: dayId, readingSeconds },
          });
        } else if (existing !== readingSeconds) {
          updated += 1;
          existingMap.set(dayId, readingSeconds);
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
    logger(`[SYNC][readingSummary(gateway-monthly)] year=${year} processed`);
  }

  const syncTime = String(Math.floor(Date.now() / 1000));
  const metaUpdates = [
    prisma.wRMeta.upsert({
      where: { keyName: READING_TIME_SYNC_KEY },
      update: { keyValue: syncTime },
      create: { keyName: READING_TIME_SYNC_KEY, keyValue: syncTime },
    }),
  ];

  if (registerTime) {
    metaUpdates.push(
      prisma.wRMeta.upsert({
        where: { keyName: REGISTER_TIME_KEY },
        update: { keyValue: registerTime },
        create: { keyName: REGISTER_TIME_KEY, keyValue: registerTime },
      }),
    );
  }

  await Promise.all(metaUpdates);

  return {
    years: `${startYear}-${endYear}`,
    months: monthCount,
    total,
    created,
    updated,
    skipped,
    syncTime,
    registerTime,
  };
}

export const syncWRDataToDB = async (
  logger: SyncLogger = defaultLogger,
  options: SyncOptions = {},
) => {
  const steps: SyncStepResult[] = [];

  logger("[SYNC] Start WeRead sync...");
  logger(
    "[SYNC] Backup reminder: keep a fresh raw export under .db-backups/ before data-changing syncs.",
  );

  try {
    const shelfResult = await syncWRBookShelf(logger, options);
    const details = `books=${shelfResult.bookCount}, albums=${shelfResult.albumCount}, mp=${shelfResult.hasMp ? 1 : 0}, created=${shelfResult.created}, updated=${shelfResult.updated}, progressTargets=${shelfResult.progressTargets}, progressUpdated=${shelfResult.progressUpdated}, progressFailed=${shelfResult.progressFailed}, syncTime=${shelfResult.syncTime}`;
    logger(`[SYNC][bookshelf(gateway)] success: ${details}`);
    steps.push({ step: "bookshelf", ok: true, details });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger(`[SYNC][bookshelf(gateway)] failed: ${message}`);
    steps.push({ step: "bookshelf", ok: false, error: message });
    if (error instanceof WeReadGatewayUpgradeError) {
      logger("[SYNC] Stopped because the WeRead skill gateway requires an upgrade.");
      revalidateTag("wereader");
      return buildSyncResult(steps);
    }
  }

  try {
    const readingResult = await syncWRReadingtimeSummary(logger, options);
    const details = `years=${readingResult.years}, months=${readingResult.months}, total=${readingResult.total}, created=${readingResult.created}, updated=${readingResult.updated}, skipped=${readingResult.skipped}, syncTime=${readingResult.syncTime}`;
    logger(`[SYNC][readingSummary(gateway-monthly)] success: ${details}`);
    steps.push({ step: "readingSummary", ok: true, details });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger(`[SYNC][readingSummary(gateway-monthly)] failed: ${message}`);
    steps.push({ step: "readingSummary", ok: false, error: message });
    if (error instanceof WeReadGatewayUpgradeError) {
      logger("[SYNC] Stopped because the WeRead skill gateway requires an upgrade.");
    }
  }

  revalidateTag("wereader");
  const result = buildSyncResult(steps);

  logger(`[SYNC] Done. overall=${result.ok ? "success" : "partial-failure"}`);
  return result;
};
