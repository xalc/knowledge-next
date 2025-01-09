"use server";
import { getWrReadingTimes, getShelf } from "@/lib/wereader/wereader-api";
import { PrismaClient } from "@prisma/client";
import { READING_TIME_SYNC_KEY, BOOKS_SYNC_KEY } from "@/lib/wereader/constant";
/* eslint-disable */
const prisma = new PrismaClient();
const syncWRReadingtimeSummary = async () => {
  const result = await getWrReadingTimes(0);
  const { registTime, synckey, readTimes } = result;
  const operations = [];
  for (let [key, value] of Object.entries(readTimes)) {
    operations.push({
      id: key,
      value: value,
    });
  }
  // need refactor it's less effective
  const dbResult = await Promise.all(
    operations.map(op =>
      prisma.wRReadingSummary.upsert({
        where: { id: op.id },
        update: { readingSeconds: op.value },
        create: { id: op.id, readingSeconds: op.value },
      }),
    ),
  );
  prisma.wRMeta.upsert({
    where: { keyName: READING_TIME_SYNC_KEY },
    update: { keyValue: synckey },
    create: { keyName: READING_TIME_SYNC_KEY, keyValue: synckey },
  });

  // prisma.wRMeta.upsert({
  //   where: { keyName: REGISTER_TIME_KEY },
  //   update: { keyValue: registTime },
  //   create: { keyName: REGISTER_TIME_KEY, keyValue: registTime }
  // })

  console.log(dbResult);
};

const getShelfSyncId = async () => {
  const shelfResult = await prisma.wRMeta.findFirst({
    where: {
      keyName: BOOKS_SYNC_KEY,
    },
  });
  const syncId = shelfResult.keyValue;
  return syncId;
};
const updateSyncId = async syncKey => {
  const syncSyncKeyResult = await prisma.wRMeta.update({
    where: {
      keyName: BOOKS_SYNC_KEY,
    },
    data: {
      keyValue: String(syncKey),
    },
  });
  console.log("update synckey successfully: " + syncSyncKeyResult.keyValue);
};

const creatManyBooks = async (books, bookProgress) => {
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
  console.log(result.count + " is insert into db");
};
const updateOrInsertBooks = async (books, bookProgress) => {
  let documents = [];
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
    documents.push({
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
    let doc = documents.find(d => d.bookId === bookId);
    if (doc.bookId) {
      doc.readProgress = {
        progress,
        updateTime,
        readingTime,
      };
    } else {
      doc = {
        bookId,
        readProgress: {
          id: bookId,
          progress,
          updateTime,
          readingTime,
        },
      };
    }
    documents.push(doc);
  });
  const dbResult = await Promise.all(
    documents.map(doc =>
      prisma.wRBookShelt.upsert({
        where: { id: doc.bookId },
        update: { ...doc },
        create: { id: doc.bookId, ...doc },
      }),
    ),
  );
  console.log(dbResult.length + " is insert/updated into db");
};
const syncWRBookShelf = async () => {
  try {
    const syncId = await getShelfSyncId();

    const wrResponse = await getShelf(syncId);
    const { books, bookProgress, synckey } = wrResponse;
    if (syncId === "0") {
      //create many
      await creatManyBooks(books, bookProgress);
    } else {
      // insert or update books not finished
      await updateOrInsertBooks(books, bookProgress);
    }
    await updateSyncId(synckey);
  } catch (error) {
    console.log("Sync book shelf failed" + error);
  }
};

//TODO 尝试流式返回结果 research
export const syncWRDataToDB = async () => {
  try {
    await syncWRBookShelf();
  } catch (error) {
    console.log(`sync weread date error: ${error}`);
  }
  return "successfully";
};
