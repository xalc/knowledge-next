import { COOKIES_TOKENS, READING_TIME_SYNC_KEY } from "./constant";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

import moment from "moment";

type ReadingSummaryRow = {
  id: string;
  readingSeconds: number;
};

type ReadingSummaryResult = {
  summarys: ReadingSummaryRow[];
  lastSyncTime: string;
};

export async function getWRToken(): Promise<string> {
  try {
    const cookies = await prisma.wRMeta.findUnique({
      where: { keyName: COOKIES_TOKENS },
    });
    return cookies?.keyValue ?? "";
  } catch (e) {
    console.error(e);
    return "";
  }
}

export async function updateWRToken(token: string) {
  try {
    await prisma.wRMeta.update({
      where: { keyName: COOKIES_TOKENS },
      data: { keyValue: token },
    });
  } catch (e) {
    console.error(e);
  }
}
export const getRecentBooks = unstable_cache(
  async () => {
    try {
      const bookShelf = await prisma.wRBookShelt.findMany({
        orderBy: {
          readUpdateTime: "desc",
        },
        take: 8,
      });
      return bookShelf;
    } catch (e) {
      console.error(e);
    }
  },
  ["wereader-recent-books"],
  { revalidate: 300, tags: ["wereader"] },
);

export const getAllBooks = unstable_cache(
  async () => {
    try {
      const bookShelf = await prisma.wRBookShelt.findMany({
        orderBy: {
          readUpdateTime: "desc",
        },
      });
      return bookShelf;
    } catch (e) {
      console.error(e);
    }
  },
  ["wereader-all-books"],
  { revalidate: 300, tags: ["wereader"] },
);

export const getReadingSummary = unstable_cache(
  async (): Promise<ReadingSummaryResult> => {
    try {
      const summarys = await prisma.wRReadingSummary.findMany({
        orderBy: {
          id: "asc",
        },
      });
      const result = await prisma.wRMeta.findUnique({
        where: {
          keyName: READING_TIME_SYNC_KEY,
        },
      });
      const lastSyncTime = result?.keyValue ?? "0";
      return { summarys, lastSyncTime };
    } catch (e) {
      console.error(e);
      return { summarys: [], lastSyncTime: "0" };
    }
  },
  ["wereader-summary"],
  { revalidate: 600, tags: ["wereader"] },
);

const buildSummaryFromBooksByYear = async (year: number) => {
  const firstDayUnix = moment(String(year)).startOf("year").unix();
  const nextYearFirstDayUnix = moment(String(year + 1))
    .startOf("year")
    .unix();

  const books = await prisma.wRBookShelt.findMany({
    select: {
      readUpdateTime: true,
      readProgress: true,
    },
  });

  const dayMap = new Map<string, number>();
  let lastSyncTime = 0;

  books.forEach(book => {
    const progress = (book.readProgress ?? {}) as {
      updateTime?: number | string;
      readingTime?: number | string;
    };
    const updateTime =
      Number(progress.updateTime) > 0 ? Number(progress.updateTime) : Number(book.readUpdateTime);

    if (!Number.isFinite(updateTime) || updateTime <= 0) return;
    if (updateTime <= firstDayUnix || updateTime >= nextYearFirstDayUnix) return;

    const readingSeconds = Number(progress.readingTime) || 0;
    const dayId = String(moment.unix(updateTime).startOf("day").unix());
    dayMap.set(dayId, (dayMap.get(dayId) || 0) + Math.max(0, readingSeconds));
    lastSyncTime = Math.max(lastSyncTime, updateTime);
  });

  const yearSummary = Array.from(dayMap.entries())
    .map(([id, readingSeconds]) => ({ id, readingSeconds }))
    .sort((a, b) => Number(a.id) - Number(b.id));

  return { yearSummary, lastSyncTime: String(lastSyncTime || 0) };
};

export async function getReadingSummaryByYear(year: number) {
  const lastDay = moment(String(year)).startOf("year").subtract(1, "day").unix();
  const nextYearFirstDay = moment(String(year + 1))
    .startOf("year")
    .unix();
  const { summarys, lastSyncTime } = await getReadingSummary();
  const yearSummary = summarys.filter(summary => {
    const id = Number(summary.id);
    return id > lastDay && id < nextYearFirstDay;
  });

  if (yearSummary.length > 0) {
    return { yearSummary, lastSyncTime };
  }

  return await buildSummaryFromBooksByYear(year);
}
