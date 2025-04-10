import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { cache } from "react";

/**
 * 获取所有时间轴数据
 * 按时间排序，从早到晚
 */
export const getTimelines = cache(async () => {
  try {
    const timelines = await prisma.timeline.findMany({
      orderBy: {
        time: "asc",
      },
    });
    console.log("获取时间轴数据，无缓存");
    return timelines;
  } catch (e) {
    console.error(e);
    return [];
  } finally {
    await prisma.$disconnect();
  }
});

/**
 * 获取最近的时间轴数据
 * @param count 获取的数量
 */
export const getRecentTimelines = cache(async (count: number = 5) => {
  try {
    const timelines = await prisma.timeline.findMany({
      orderBy: {
        time: "desc",
      },
      take: count,
    });
    console.log("获取最近时间轴数据，无缓存");
    return timelines;
  } catch (e) {
    console.error(e);
    return [];
  } finally {
    await prisma.$disconnect();
  }
});

/**
 * 根据ID获取单个时间轴数据
 * @param id 时间轴ID
 */
export const getTimelineById = cache(async (id: string) => {
  try {
    const timeline = await prisma.timeline.findUnique({
      where: {
        id: id,
      },
    });
    console.log("获取单个时间轴数据，无缓存");
    return timeline;
  } catch (e) {
    console.error(e);
    return null;
  } finally {
    await prisma.$disconnect();
  }
});

/**
 * 按年份获取时间轴数据
 * @param year 年份，如2020
 */
export const getTimelinesByYear = cache(async (year: string) => {
  try {
    const timelines = await prisma.timeline.findMany({
      where: {
        time: {
          startsWith: year,
        },
      },
      orderBy: {
        time: "asc",
      },
    });
    console.log(`获取${year}年时间轴数据，无缓存`);
    return timelines;
  } catch (e) {
    console.error(e);
    return [];
  } finally {
    await prisma.$disconnect();
  }
});

export const revalidate = 60; // 缓存60秒
