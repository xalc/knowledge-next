import { NextResponse } from "next/server";
import { z } from "zod";

const overviewArgsSchema = z.object({
  year: z.number().int().min(2021).max(new Date().getFullYear()).optional(),
});

const trendArgsSchema = z.object({
  year: z.number().int().min(2021).max(new Date().getFullYear()).optional(),
  granularity: z.enum(["day", "week", "month"]).optional(),
  periodDays: z.number().int().min(7).max(366).optional(),
});

const booksArgsSchema = z.object({
  status: z.enum(["all", "reading", "finished"]).optional(),
  sort: z.enum(["recent", "progress", "title"]).optional(),
  limit: z.number().int().min(1).max(200).optional(),
  keyword: z.string().optional(),
});

const notesArgsSchema = z.object({
  bookId: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

const planArgsSchema = z.object({
  year: z.number().int().min(2021).max(new Date().getFullYear()).optional(),
  targetHours: z.number().int().min(10).max(1000).optional(),
});

const toolNameSchema = z.enum([
  "reading.overview",
  "reading.trend",
  "reading.books",
  "reading.notes",
  "reading.plan",
]);

const tools = [
  {
    name: "reading.overview",
    description: "获取指定年份的阅读总览，包括总时长、活跃天数、最长连续阅读和月度汇总。",
    inputSchema: {
      type: "object",
      properties: {
        year: { type: "number", description: "目标年份，默认当前年，范围 2021~当前年" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "reading.trend",
    description: "获取阅读趋势，可按天/周/月返回结构化时间序列。",
    inputSchema: {
      type: "object",
      properties: {
        year: { type: "number", description: "目标年份，默认当前年" },
        granularity: {
          type: "string",
          enum: ["day", "week", "month"],
          description: "时间粒度，默认 day",
        },
        periodDays: { type: "number", description: "按天模式下返回最近 N 天，范围 7~366" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "reading.books",
    description: "查询书架明细，支持状态、排序和关键词过滤。",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["all", "reading", "finished"] },
        sort: { type: "string", enum: ["recent", "progress", "title"] },
        limit: { type: "number", description: "返回条数，范围 1~200" },
        keyword: { type: "string", description: "按标题、作者或 bookId 模糊匹配" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "reading.notes",
    description: "查询阅读笔记能力状态与占位结果（当前仅返回是否支持和书籍上下文）。",
    inputSchema: {
      type: "object",
      properties: {
        bookId: { type: "string", description: "可选，指定目标书籍 bookId" },
        limit: { type: "number", description: "返回数量上限，范围 1~100" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "reading.plan",
    description: "根据当前进度和目标时长生成年度阅读计划指标。",
    inputSchema: {
      type: "object",
      properties: {
        year: { type: "number", description: "目标年份，默认当前年" },
        targetHours: { type: "number", description: "年度目标小时数，默认 300" },
      },
      additionalProperties: false,
    },
  },
] as const;

type ToolName = z.infer<typeof toolNameSchema>;

function createResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function mapToolToView(name: ToolName) {
  if (name === "reading.overview") return "overview";
  if (name === "reading.trend") return "trend";
  if (name === "reading.books") return "books";
  if (name === "reading.notes") return "notes";
  return "plan";
}

function validateArgs(name: ToolName, value: unknown) {
  const args = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  if (name === "reading.overview") return overviewArgsSchema.parse(args);
  if (name === "reading.trend") return trendArgsSchema.parse(args);
  if (name === "reading.books") return booksArgsSchema.parse(args);
  if (name === "reading.notes") return notesArgsSchema.parse(args);
  return planArgsSchema.parse(args);
}

async function callReadingApi(req: Request, view: string, args: Record<string, unknown>) {
  const requestUrl = new URL(req.url);
  const endpoint = new URL("/api/reading/insights", requestUrl.origin);
  endpoint.searchParams.set("view", view);

  Object.entries(args).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    endpoint.searchParams.set(key, String(value));
  });

  const response = await fetch(endpoint.toString(), {
    method: "GET",
    cache: "no-store",
    headers: { accept: "application/json" },
  });
  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok || data.ok === false) {
    const message =
      typeof data.error === "string"
        ? data.error
        : `Reading API request failed with status ${response.status}`;
    throw new Error(message);
  }
  return data;
}

function listResult(id?: string | number | null) {
  if (id !== undefined) {
    return {
      jsonrpc: "2.0",
      id,
      result: { tools },
    };
  }
  return { ok: true, protocol: "tools/v1", tools };
}

export async function OPTIONS() {
  return createResponse({ ok: true });
}

export async function GET() {
  return createResponse(listResult());
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      id?: string | number;
      method?: string;
      params?: { name?: string; arguments?: unknown };
      action?: string;
      name?: string;
      arguments?: unknown;
    };

    const method = body.method || (body.action === "list" ? "tools/list" : "tools/call");

    if (method === "tools/list") {
      return createResponse(listResult(body.id));
    }

    if (method !== "tools/call") {
      return createResponse({ ok: false, error: `Unsupported method: ${method}` }, 400);
    }

    const toolName = toolNameSchema.parse(body.params?.name ?? body.name);
    const args = validateArgs(toolName, body.params?.arguments ?? body.arguments);
    const view = mapToolToView(toolName);
    const data = await callReadingApi(req, view, args as Record<string, unknown>);

    if (body.id !== undefined) {
      return createResponse({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [{ type: "json", json: data }],
          structuredContent: data,
          isError: false,
        },
      });
    }

    return createResponse({
      ok: true,
      protocol: "tools/v1",
      name: toolName,
      arguments: args,
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return createResponse({ ok: false, error: message }, 400);
  }
}
