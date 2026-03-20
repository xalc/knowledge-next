import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getReadingBooks,
  getReadingNotes,
  getReadingOverview,
  getReadingPlan,
  getReadingTrend,
} from "@/lib/wereader/reading-insights";

const viewSchema = z.enum(["overview", "trend", "books", "notes", "plan"]);

const overviewSchema = z.object({
  year: z.coerce.number().int().min(2021).max(new Date().getFullYear()).optional(),
});

const trendSchema = z.object({
  year: z.coerce.number().int().min(2021).max(new Date().getFullYear()).optional(),
  granularity: z.enum(["day", "week", "month"]).optional(),
  periodDays: z.coerce.number().int().min(7).max(366).optional(),
});

const booksSchema = z.object({
  status: z.enum(["all", "reading", "finished"]).optional(),
  sort: z.enum(["recent", "progress", "title"]).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  keyword: z.string().optional(),
});

const notesSchema = z.object({
  bookId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const planSchema = z.object({
  year: z.coerce.number().int().min(2021).max(new Date().getFullYear()).optional(),
  targetHours: z.coerce.number().int().min(10).max(1000).optional(),
});

function toObject(searchParams: URLSearchParams) {
  const record: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

async function execute(view: z.infer<typeof viewSchema>, payload: Record<string, unknown>) {
  if (view === "overview") {
    const params = overviewSchema.parse(payload);
    return await getReadingOverview(params);
  }
  if (view === "trend") {
    const params = trendSchema.parse(payload);
    return await getReadingTrend(params);
  }
  if (view === "books") {
    const params = booksSchema.parse(payload);
    return await getReadingBooks(params);
  }
  if (view === "notes") {
    const params = notesSchema.parse(payload);
    return await getReadingNotes(params);
  }
  const params = planSchema.parse(payload);
  return await getReadingPlan(params);
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const payload = toObject(requestUrl.searchParams);
    const view = viewSchema.parse(payload.view);
    const result = await execute(view, payload);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const view = viewSchema.parse(body.view);
    const payload = body.payload && typeof body.payload === "object" ? body.payload : {};
    const result = await execute(view, payload as Record<string, unknown>);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
