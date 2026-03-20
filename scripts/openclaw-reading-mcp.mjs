import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod";

const BASE_URL = (process.env.KNOWLEDGE_NEXT_BASE_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  "",
);

const server = new McpServer(
  {
    name: "knowledge-next-reading",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const overviewArgsSchema = z.object({
  year: z.coerce.number().int().min(2021).max(new Date().getFullYear()).optional(),
});

const trendArgsSchema = z.object({
  year: z.coerce.number().int().min(2021).max(new Date().getFullYear()).optional(),
  granularity: z.enum(["day", "week", "month"]).optional(),
  periodDays: z.coerce.number().int().min(7).max(366).optional(),
});

const booksArgsSchema = z.object({
  status: z.enum(["all", "reading", "finished"]).optional(),
  sort: z.enum(["recent", "progress", "title"]).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  keyword: z.string().optional(),
});

const notesArgsSchema = z.object({
  bookId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const planArgsSchema = z.object({
  year: z.coerce.number().int().min(2021).max(new Date().getFullYear()).optional(),
  targetHours: z.coerce.number().int().min(10).max(1000).optional(),
});

const outputSchema = z.object({}).passthrough();

async function callReadingInsights(view, args) {
  const url = new URL("/api/reading/insights", BASE_URL);
  url.searchParams.set("view", view);

  Object.entries(args ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok || data?.ok === false) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : `Reading insights request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

server.registerTool(
  "reading.overview",
  {
    title: "Reading Overview",
    description: "获取指定年份的阅读总览，包括总时长、活跃天数、最长连续阅读和月度汇总。",
    inputSchema: overviewArgsSchema,
    outputSchema,
  },
  async args => {
    const data = await callReadingInsights("overview", args);
    return {
      structuredContent: data,
    };
  },
);

server.registerTool(
  "reading.trend",
  {
    title: "Reading Trend",
    description: "获取阅读趋势，可按天/周/月返回结构化时间序列。",
    inputSchema: trendArgsSchema,
    outputSchema,
  },
  async args => {
    const data = await callReadingInsights("trend", args);
    return {
      structuredContent: data,
    };
  },
);

server.registerTool(
  "reading.books",
  {
    title: "Reading Books",
    description: "查询书架明细，支持状态、排序和关键词过滤。",
    inputSchema: booksArgsSchema,
    outputSchema,
  },
  async args => {
    const data = await callReadingInsights("books", args);
    return {
      structuredContent: data,
    };
  },
);

server.registerTool(
  "reading.notes",
  {
    title: "Reading Notes",
    description: "查询阅读笔记能力状态与占位结果。",
    inputSchema: notesArgsSchema,
    outputSchema,
  },
  async args => {
    const data = await callReadingInsights("notes", args);
    return {
      structuredContent: data,
    };
  },
);

server.registerTool(
  "reading.plan",
  {
    title: "Reading Plan",
    description: "根据当前进度和目标时长生成年度阅读计划指标。",
    inputSchema: planArgsSchema,
    outputSchema,
  },
  async args => {
    const data = await callReadingInsights("plan", args);
    return {
      structuredContent: data,
    };
  },
);

const transport = new StdioServerTransport();

await server.connect(transport);
