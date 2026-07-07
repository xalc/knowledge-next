import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const prisma = {
    wRBookShelt: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    wRReadingSummary: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    wRMeta: {
      upsert: vi.fn(),
    },
  };

  return {
    prisma,
    revalidateTag: vi.fn(),
    getGatewayShelf: vi.fn(),
    getGatewayBookProgress: vi.fn(),
    getGatewayReadingDetail: vi.fn(),
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: mocks.prisma,
}));

vi.mock("next/cache", () => ({
  revalidateTag: mocks.revalidateTag,
}));

vi.mock("@/lib/wereader/weread-gateway", () => ({
  WeReadGatewayUpgradeError: class WeReadGatewayUpgradeError extends Error {},
  getGatewayShelf: mocks.getGatewayShelf,
  getGatewayBookProgress: mocks.getGatewayBookProgress,
  getGatewayReadingDetail: mocks.getGatewayReadingDetail,
}));

describe("syncWRDataToDB gateway sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.prisma.wRBookShelt.upsert.mockResolvedValue({});
    mocks.prisma.wRReadingSummary.upsert.mockResolvedValue({});
    mocks.prisma.wRMeta.upsert.mockResolvedValue({ keyName: "mock", keyValue: "1" });
    mocks.getGatewayReadingDetail.mockResolvedValue({
      readTimes: {},
      registTime: 123,
    });
  });

  it("preserves existing book fields that shelf gateway does not return", async () => {
    const { syncWRDataToDB } = await import("@/lib/wereader/wr-writer");
    const publishTime = new Date("2020-01-02T00:00:00.000Z");

    mocks.prisma.wRBookShelt.findMany.mockResolvedValue([
      {
        id: "book-1",
        bookId: "book-1",
        translator: "Existing Translator",
        publishTime,
        categories: [{ title: "Old Category" }],
        lPushName: "Existing Push",
        readUpdateTime: 100,
        finishReading: 1,
        readProgress: { progress: 100, updateTime: 100, readingTime: 3600 },
      },
    ]);
    mocks.prisma.wRReadingSummary.findMany.mockResolvedValue([]);
    mocks.getGatewayShelf.mockResolvedValue({
      books: [
        {
          bookId: "book-1",
          title: "Gateway Title",
          author: "Gateway Author",
          cover: "https://example.com/cover.jpg",
          category: "Gateway Category",
          readUpdateTime: 100,
          finishReading: 1,
        },
      ],
      albums: [],
      mp: null,
    });

    await syncWRDataToDB(() => {}, { summaryStartYear: 2026, summaryEndYear: 2026 });

    expect(mocks.getGatewayBookProgress).not.toHaveBeenCalled();
    expect(mocks.prisma.wRBookShelt.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          translator: "Existing Translator",
          publishTime,
          categories: [{ title: "Old Category" }],
          lPushName: "Existing Push",
        }),
      }),
    );
  });

  it("refreshes progress only for new, changed, unfinished, or missing-progress books", async () => {
    const { syncWRDataToDB } = await import("@/lib/wereader/wr-writer");

    mocks.prisma.wRBookShelt.findMany.mockResolvedValue([
      {
        id: "stable-finished",
        bookId: "stable-finished",
        translator: null,
        publishTime: null,
        categories: null,
        lPushName: null,
        readUpdateTime: 100,
        finishReading: 1,
        readProgress: { progress: 100, updateTime: 100, readingTime: 1000 },
      },
      {
        id: "changed-finished",
        bookId: "changed-finished",
        translator: null,
        publishTime: null,
        categories: null,
        lPushName: null,
        readUpdateTime: 100,
        finishReading: 1,
        readProgress: { progress: 100, updateTime: 100, readingTime: 1000 },
      },
      {
        id: "legacy-zero-time",
        bookId: "legacy-zero-time",
        translator: null,
        publishTime: null,
        categories: null,
        lPushName: null,
        readUpdateTime: 100,
        finishReading: 1,
        readProgress: { progress: 100, updateTime: 100, readingTime: 0 },
      },
      {
        id: "unfinished",
        bookId: "unfinished",
        translator: null,
        publishTime: null,
        categories: null,
        lPushName: null,
        readUpdateTime: 100,
        finishReading: 0,
        readProgress: { progress: 50, updateTime: 100, readingTime: 500 },
      },
    ]);
    mocks.prisma.wRReadingSummary.findMany.mockResolvedValue([]);
    mocks.getGatewayShelf.mockResolvedValue({
      books: [
        {
          bookId: "stable-finished",
          title: "A",
          author: "A",
          readUpdateTime: 100,
          finishReading: 1,
        },
        {
          bookId: "changed-finished",
          title: "B",
          author: "B",
          readUpdateTime: 200,
          finishReading: 1,
        },
        {
          bookId: "legacy-zero-time",
          title: "Z",
          author: "Z",
          readUpdateTime: 100,
          finishReading: 1,
        },
        { bookId: "unfinished", title: "C", author: "C", readUpdateTime: 100, finishReading: 0 },
        { bookId: "new-book", title: "D", author: "D", readUpdateTime: 300, finishReading: 0 },
      ],
      albums: [],
      mp: null,
    });
    mocks.getGatewayBookProgress.mockImplementation(async (bookId: string) => ({
      bookId,
      book: {
        progress: bookId === "changed-finished" ? 100 : 20,
        updateTime: 999,
        readingTime: 1234,
      },
    }));

    await syncWRDataToDB(() => {}, { summaryStartYear: 2026, summaryEndYear: 2026 });

    expect(mocks.getGatewayBookProgress.mock.calls.map(call => call[0]).sort()).toEqual([
      "changed-finished",
      "legacy-zero-time",
      "new-book",
      "unfinished",
    ]);
  });

  it("upserts daily reading buckets from monthly gateway detail responses", async () => {
    const { syncWRDataToDB } = await import("@/lib/wereader/wr-writer");

    mocks.prisma.wRBookShelt.findMany.mockResolvedValue([]);
    mocks.prisma.wRReadingSummary.findMany.mockResolvedValue([
      { id: "1767196800", readingSeconds: 60 },
      { id: "1767283200", readingSeconds: 120 },
    ]);
    mocks.getGatewayShelf.mockResolvedValue({
      books: [],
      albums: [],
      mp: null,
    });
    mocks.getGatewayReadingDetail.mockImplementation(async ({ baseTime }: { baseTime: number }) => {
      if (baseTime === 1767196800) {
        return {
          registTime: 111,
          readTimes: {
            "1767196800": 60,
            "1767283200": 240,
            "1767369600": 300,
          },
        };
      }
      return {
        registTime: 111,
        readTimes: {},
      };
    });

    await syncWRDataToDB(() => {}, { summaryStartYear: 2026, summaryEndYear: 2026 });

    expect(mocks.getGatewayReadingDetail).toHaveBeenCalledTimes(12);
    expect(mocks.prisma.wRReadingSummary.upsert).toHaveBeenCalledTimes(2);
    expect(mocks.prisma.wRReadingSummary.upsert).toHaveBeenCalledWith({
      where: { id: "1767283200" },
      update: { readingSeconds: 240 },
      create: { id: "1767283200", readingSeconds: 240 },
    });
    expect(mocks.prisma.wRReadingSummary.upsert).toHaveBeenCalledWith({
      where: { id: "1767369600" },
      update: { readingSeconds: 300 },
      create: { id: "1767369600", readingSeconds: 300 },
    });
    expect(mocks.prisma.wRMeta.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { keyName: "readingTime" },
      }),
    );
    expect(mocks.prisma.wRMeta.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { keyName: "registerTime" },
        update: { keyValue: "111" },
      }),
    );
  });
});
