import moment from "moment";
import { getAllBooks, getReadingSummaryByYear } from "@/lib/wereader/wr-db";
import { ReadingSummaryType } from "@/types/reading-summary";

const DEFAULT_TARGET_HOURS = 300;
const MIN_YEAR = 2021;

type TrendGranularity = "day" | "week" | "month";
type BookStatus = "all" | "reading" | "finished";
type BookSort = "recent" | "progress" | "title";

function normalizeYear(value?: number) {
  const currentYear = new Date().getFullYear();
  if (!value || Number.isNaN(value)) return currentYear;
  return Math.max(MIN_YEAR, Math.min(currentYear, Math.floor(value)));
}

function normalizeSummary(summary: ReadingSummaryType[]) {
  return summary
    .map(item => ({
      id: String(item.id),
      readingSeconds: Number(item.readingSeconds) || 0,
      day: moment.unix(Number(item.id)).format("YYYY-MM-DD"),
    }))
    .filter(item => Number(item.id) > 0);
}

function toHours(seconds: number) {
  return Number((seconds / 3600).toFixed(1));
}

function toMinutes(seconds: number) {
  return Math.round(seconds / 60);
}

function calculateLongestStreak(days: string[]) {
  if (days.length === 0) return 0;
  const sortedDays = [...new Set(days)].sort();
  let longest = 1;
  let current = 1;

  for (let index = 1; index < sortedDays.length; index += 1) {
    const previous = moment(sortedDays[index - 1], "YYYY-MM-DD");
    const next = moment(sortedDays[index], "YYYY-MM-DD");
    const diff = next.diff(previous, "days");

    if (diff === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

function getYearDayProgress(year: number) {
  const now = moment();
  const isCurrentYear = now.year() === year;
  const daysInYear = moment(`${year}-01-01`).isLeapYear() ? 366 : 365;
  const dayOfYear = isCurrentYear ? now.dayOfYear() : daysInYear;
  return { daysInYear, dayOfYear, isCurrentYear };
}

type RawBook = {
  id: string;
  bookId: string;
  title: string;
  author: string;
  category: string | null;
  cover: string;
  finishReading: number;
  readUpdateTime: number | null;
  readProgress: unknown;
};

function normalizeBooks(books: RawBook[]) {
  return books.map(book => {
    const progress = (book.readProgress ?? {}) as { progress?: number; readingTime?: number };
    const readingSeconds = Number(progress.readingTime) || 0;
    const readUpdateTime = Number(book.readUpdateTime) || 0;

    return {
      id: book.id,
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      category: book.category,
      cover: book.cover,
      finishReading: Number(book.finishReading) === 1,
      readProgress: Number(progress.progress) || 0,
      readUpdateTime,
      readUpdateDate: readUpdateTime > 0 ? moment.unix(readUpdateTime).format("YYYY-MM-DD") : null,
      readingSeconds,
      readingMinutes: toMinutes(readingSeconds),
    };
  });
}

function groupTrend(summary: ReturnType<typeof normalizeSummary>, granularity: TrendGranularity) {
  if (granularity === "day") {
    return summary.map(item => ({
      key: item.day,
      readingSeconds: item.readingSeconds,
      readingMinutes: toMinutes(item.readingSeconds),
    }));
  }

  const grouped = new Map<string, number>();
  summary.forEach(item => {
    const date = moment(item.day, "YYYY-MM-DD");
    const key =
      granularity === "week"
        ? date.startOf("isoWeek").format("YYYY-[W]WW")
        : date.format("YYYY-MM");
    grouped.set(key, (grouped.get(key) || 0) + item.readingSeconds);
  });

  return Array.from(grouped.entries())
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([key, readingSeconds]) => ({
      key,
      readingSeconds,
      readingMinutes: toMinutes(readingSeconds),
    }));
}

export async function getReadingOverview(payload: { year?: number }) {
  const year = normalizeYear(payload.year);
  const { yearSummary, lastSyncTime } = await getReadingSummaryByYear(year);
  const summary = normalizeSummary(yearSummary);
  const totalSeconds = summary.reduce((sum, item) => sum + item.readingSeconds, 0);
  const daysRead = summary.filter(item => item.readingSeconds > 0).length;
  const bestDay = summary.reduce(
    (current, item) => {
      if (item.readingSeconds > current.readingSeconds) {
        return { day: item.day, readingSeconds: item.readingSeconds };
      }
      return current;
    },
    { day: "", readingSeconds: 0 },
  );

  const monthBuckets = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    readingSeconds: 0,
  }));
  summary.forEach(item => {
    const monthIndex = Number(item.day.slice(5, 7)) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      monthBuckets[monthIndex].readingSeconds += item.readingSeconds;
    }
  });

  const { daysInYear, dayOfYear } = getYearDayProgress(year);

  return {
    ok: true,
    type: "overview",
    year,
    lastSyncTime: Number(lastSyncTime) || 0,
    summary: {
      totalSeconds,
      totalMinutes: toMinutes(totalSeconds),
      totalHours: toHours(totalSeconds),
      daysRead,
      averageMinutesPerReadDay: daysRead > 0 ? Math.round(toMinutes(totalSeconds) / daysRead) : 0,
      averageMinutesPerCalendarDay:
        dayOfYear > 0 ? Math.round(toMinutes(totalSeconds) / dayOfYear) : 0,
      longestStreakDays: calculateLongestStreak(summary.map(item => item.day)),
      bestDay: {
        date: bestDay.day || null,
        readingSeconds: bestDay.readingSeconds,
        readingMinutes: toMinutes(bestDay.readingSeconds),
      },
      progressInYear: {
        dayOfYear,
        daysInYear,
      },
    },
    monthBuckets: monthBuckets.map(item => ({
      month: item.month,
      readingSeconds: item.readingSeconds,
      readingMinutes: toMinutes(item.readingSeconds),
    })),
  };
}

export async function getReadingTrend(payload: {
  year?: number;
  granularity?: TrendGranularity;
  periodDays?: number;
}) {
  const year = normalizeYear(payload.year);
  const granularity = payload.granularity ?? "day";
  const periodDays = Math.max(7, Math.min(366, Number(payload.periodDays) || 90));
  const { yearSummary, lastSyncTime } = await getReadingSummaryByYear(year);
  const normalized = normalizeSummary(yearSummary);

  const trendStartUnix = moment(`${year}-12-31`).endOf("day").unix() - periodDays * 24 * 3600;
  const scoped =
    granularity === "day"
      ? normalized.filter(item => Number(item.id) >= trendStartUnix)
      : normalized;
  const points = groupTrend(scoped, granularity);

  return {
    ok: true,
    type: "trend",
    year,
    granularity,
    periodDays,
    lastSyncTime: Number(lastSyncTime) || 0,
    points,
  };
}

export async function getReadingBooks(payload: {
  status?: BookStatus;
  sort?: BookSort;
  limit?: number;
  keyword?: string;
}) {
  const status = payload.status ?? "all";
  const sort = payload.sort ?? "recent";
  const limit = Math.max(1, Math.min(200, Number(payload.limit) || 30));
  const keyword = (payload.keyword ?? "").trim().toLowerCase();

  const books = normalizeBooks((await getAllBooks()) ?? []);
  const filtered = books
    .filter(item => {
      if (status === "reading") return !item.finishReading;
      if (status === "finished") return item.finishReading;
      return true;
    })
    .filter(item => {
      if (!keyword) return true;
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.author.toLowerCase().includes(keyword) ||
        String(item.bookId).toLowerCase().includes(keyword)
      );
    })
    .sort((left, right) => {
      if (sort === "progress") return right.readProgress - left.readProgress;
      if (sort === "title") return left.title.localeCompare(right.title, "zh-Hans-CN");
      return (right.readUpdateTime || 0) - (left.readUpdateTime || 0);
    });

  const totalCount = books.length;
  const readingCount = books.filter(item => !item.finishReading).length;
  const finishedCount = books.filter(item => item.finishReading).length;

  return {
    ok: true,
    type: "books",
    filter: { status, sort, limit, keyword },
    stats: {
      totalCount,
      readingCount,
      finishedCount,
    },
    items: filtered.slice(0, limit),
  };
}

export async function getReadingNotes(payload: { bookId?: string; limit?: number }) {
  const limit = Math.max(1, Math.min(100, Number(payload.limit) || 20));
  const books = normalizeBooks((await getAllBooks()) ?? []);
  const bookId = (payload.bookId ?? "").trim();
  const matchedBook = bookId ? books.find(item => item.bookId === bookId) : null;

  return {
    ok: true,
    type: "notes",
    supported: false,
    reason: "当前数据库未同步微信读书划线/笔记明细，仅保留阅读时长与书架进度。",
    requested: {
      bookId: bookId || null,
      limit,
    },
    targetBook: matchedBook,
    items: [],
  };
}

export async function getReadingPlan(payload: { year?: number; targetHours?: number }) {
  const year = normalizeYear(payload.year);
  const targetHours = Math.max(
    10,
    Math.min(1000, Number(payload.targetHours) || DEFAULT_TARGET_HOURS),
  );
  const { yearSummary, lastSyncTime } = await getReadingSummaryByYear(year);
  const normalized = normalizeSummary(yearSummary);

  const totalSeconds = normalized.reduce((sum, item) => sum + item.readingSeconds, 0);
  const { daysInYear, dayOfYear, isCurrentYear } = getYearDayProgress(year);
  const targetSeconds = targetHours * 3600;
  const remainingSeconds = Math.max(0, targetSeconds - totalSeconds);
  const remainingDays = isCurrentYear ? Math.max(0, daysInYear - dayOfYear) : 0;
  const currentDailyMinutes = dayOfYear > 0 ? Math.round(toMinutes(totalSeconds) / dayOfYear) : 0;
  const requiredDailyMinutes =
    remainingDays > 0 ? Math.max(1, Math.ceil(remainingSeconds / remainingDays / 60)) : 0;

  let riskLevel: "on_track" | "needs_attention" | "behind";
  if (requiredDailyMinutes === 0 || requiredDailyMinutes <= currentDailyMinutes + 10) {
    riskLevel = "on_track";
  } else if (requiredDailyMinutes <= currentDailyMinutes + 30) {
    riskLevel = "needs_attention";
  } else {
    riskLevel = "behind";
  }

  return {
    ok: true,
    type: "plan",
    year,
    targetHours,
    lastSyncTime: Number(lastSyncTime) || 0,
    progress: {
      currentHours: toHours(totalSeconds),
      currentMinutes: toMinutes(totalSeconds),
      completionRate:
        targetSeconds > 0 ? Number(((totalSeconds / targetSeconds) * 100).toFixed(1)) : 0,
      remainingHours: toHours(remainingSeconds),
      remainingDays,
      currentDailyMinutes,
      requiredDailyMinutes,
      suggestedWeeklyMinutes: requiredDailyMinutes * 7,
      riskLevel,
    },
  };
}
