import { PrismaClient } from "@prisma/client";
import { READING_TIME_SYNC_KEY } from "./constant";

import moment from "moment";

const prisma = new PrismaClient();
export async function getWRToken(): Promise<string> {
  try {
    const cookies = await prisma.wRMeta.findUnique({
      where: { keyName: "cookieToken" },
    });
    return cookies.keyValue;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getRecentBooks() {
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
  } finally {
    await prisma.$disconnect();
  }
}
export async function getAllBooks() {
  try {
    const bookShelf = await prisma.wRBookShelt.findMany({
      orderBy: {
        readUpdateTime: "desc",
      },
    });
    return bookShelf;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getReadingSummary() {
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
    const lastSyncTime = result.keyValue;
    return { summarys, lastSyncTime };
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
export async function getReadingSummaryByYear(year: number) {
  const firstDay = moment(String(year)).startOf("year");
  const lastDay = firstDay.subtract(1, "day").unix();

  const nextYearFirstDay = moment(String(year + 1))
    .startOf("year")
    .unix();
  const { summarys, lastSyncTime } = await getReadingSummary();
  const yearSummary = summarys.filter(summary => {
    const id = Number(summary.id);
    return id > lastDay && id < nextYearFirstDay;
  });
  return { yearSummary, lastSyncTime };
}
