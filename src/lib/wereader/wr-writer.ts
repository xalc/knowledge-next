import { getWrReadingTimes, getShelf } from "@/lib/wereader/wereader-api";
import { READING_TIME_SYNC_KEY, BOOKS_SYNC_KEY, REGISTER_TIME_KEY } from "@/lib/wereader/constant";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
/* eslint-disable */

type SyncLogger = (...args: unknown[]) => void;

const defaultLogger: SyncLogger = (...args) => console.log(...args);

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

const getShelfSyncId = async () => {
  const shelfResult = await prisma.wRMeta.findFirst({
    where: {
      keyName: BOOKS_SYNC_KEY,
    },
  });
  const syncId = shelfResult?.keyValue ?? "0";
  return syncId;
};
const updateSyncId = async (syncKey, logger: SyncLogger) => {
  const syncSyncKeyResult = await prisma.wRMeta.update({
    where: {
      keyName: BOOKS_SYNC_KEY,
    },
    data: {
      keyValue: String(syncKey),
    },
  });
  logger("update synckey successfully: " + syncSyncKeyResult.keyValue);
};

const creatManyBooks = async (books, bookProgress, logger: SyncLogger) => {
  const documents = [];
  books.forEach(b => {
    const bp = bookProgress.find(bp => bp.bookId === b.bookId);

    const readProgress = bp
      ? {
          id: bp.bookId,
          bookId: bp.bookId,
          progress: bp.progress,
          updateTime: bp.updateTime,
          readingTime: bp.readingTime,
        }
      : null;
    const {
      bookId,
      title,
      author,
      translator,
      cover,
      publishTime,
      category,
      categories,
      lPushName,
      readUpdateTime,
      finishReading,
    } = b;
    const ISODate = publishTime ? new Date(publishTime).toISOString() : null;
    documents.push({
      id: b.bookId,
      bookId,
      title,
      author,
      translator,
      cover,
      publishTime: ISODate,
      category,
      categories,
      lPushName,
      readUpdateTime,
      finishReading,
      readProgress: readProgress,
    });
  });
  const result = await prisma.wRBookShelt.createMany({
    data: documents,
  });
  logger(result.count + " is insert into db");
};
const updateOrInsertBooks = async (books, bookProgress, logger: SyncLogger) => {
  const documentsMap = new Map();

  books.forEach(b => {
    const {
      bookId,
      title,
      author,
      translator,
      cover,
      publishTime,
      category,
      categories,
      lPushName,
      readUpdateTime,
      finishReading,
    } = b;
    const ISODate = publishTime ? new Date(publishTime).toISOString() : null;
    documentsMap.set(bookId, {
      bookId,
      title,
      author,
      translator,
      cover,
      publishTime: ISODate,
      category,
      categories,
      lPushName,
      readUpdateTime,
      finishReading,
    });
  });

  bookProgress.forEach(bp => {
    const { bookId, progress, updateTime, readingTime } = bp;
    const existing = documentsMap.get(bookId) || { bookId };
    existing.readProgress = {
      id: bookId,
      progress,
      updateTime,
      readingTime,
    };
    documentsMap.set(bookId, existing);
  });

  const documents = Array.from(documentsMap.values());
  const dbResult = await Promise.all(
    documents.map(doc =>
      prisma.wRBookShelt.upsert({
        where: { id: doc.bookId },
        update: { ...doc },
        create: { id: doc.bookId, ...doc },
      }),
    ),
  );
  logger(dbResult.length + " is insert/updated into db");
};
const syncWRBookShelf = async (logger: SyncLogger) => {
  const syncId = await getShelfSyncId();

  const wrResponse = await getShelf(syncId);
  const { books, bookProgress, synckey } = wrResponse;

  if (!Array.isArray(books) || !Array.isArray(bookProgress)) {
    throw new Error("Invalid shelf response format");
  }

  if (syncId === "0") {
    //create many
    await creatManyBooks(books, bookProgress, logger);
  } else {
    // insert or update books not finished
    await updateOrInsertBooks(books, bookProgress, logger);
  }
  await updateSyncId(synckey, logger);

  return {
    bookCount: books.length,
    progressCount: bookProgress.length,
    synckey: String(synckey),
  };
};
const syncWRReadingtimeSummary = async (logger: SyncLogger) => {
  const result = await getWrReadingTimes(0);
  const { registTime, synckey, readTimes } = result;

  if (!readTimes || typeof readTimes !== "object") {
    throw new Error("Invalid reading summary response format");
  }

  const entries = Object.entries(readTimes);
  await Promise.all(
    entries.map(([key, value]) =>
      prisma.wRReadingSummary.upsert({
        where: { id: key },
        update: { readingSeconds: Number(value) },
        create: { id: key, readingSeconds: Number(value) },
      }),
    ),
  );
  logger(`upserted ${entries.length} reading summary records`);

  const bactchUpdated = await Promise.all([
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

  bactchUpdated.forEach(result => logger(`update ${result.keyName} with ${result.keyValue}`));

  return {
    total: entries.length,
    synckey: String(synckey),
    registTime: String(registTime),
  };
};

export const syncWRDataToDB = async (logger: SyncLogger = defaultLogger) => {
  const steps: SyncStepResult[] = [];

  logger("[SYNC] Start WeRead sync...");

  try {
    const shelfResult = await syncWRBookShelf(logger);
    const details = `books=${shelfResult.bookCount}, progress=${shelfResult.progressCount}, synckey=${shelfResult.synckey}`;
    logger(`[SYNC][bookshelf] success: ${details}`);
    steps.push({ step: "bookshelf", ok: true, details });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger(`[SYNC][bookshelf] failed: ${message}`);
    steps.push({ step: "bookshelf", ok: false, error: message });
  }

  try {
    const readingResult = await syncWRReadingtimeSummary(logger);
    const details = `total=${readingResult.total}, synckey=${readingResult.synckey}`;
    logger(`[SYNC][readingSummary] success: ${details}`);
    steps.push({ step: "readingSummary", ok: true, details });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger(`[SYNC][readingSummary] failed: ${message}`);
    steps.push({ step: "readingSummary", ok: false, error: message });
  }

  const allOk = steps.every(step => step.ok);
  if (steps.some(step => step.ok)) {
    revalidateTag("wereader");
  }

  const result: SyncWRResult = {
    ok: allOk,
    steps,
    message: allOk
      ? "successfully synced wechat reader data"
      : "wechat reader sync completed with partial failures",
  };

  logger(`[SYNC] Done. overall=${allOk ? "success" : "partial-failure"}`);
  return result;
};
