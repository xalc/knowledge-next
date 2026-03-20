import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import {
  getReadingBooks,
  getReadingNotes,
  getReadingOverview,
  getReadingPlan,
  getReadingTrend,
} from "@/lib/wereader/reading-insights";
import { verifyReadOnlyMcpBearerToken } from "@/lib/mcp-token";

export const runtime = "nodejs";

const outputSchema = z.object({}).passthrough();

function toMcpToolResult(data: Record<string, unknown>) {
  return {
    content: [
      {
        type: "text" as const,
        text: "OK",
      },
    ],
    structuredContent: data,
  };
}

function createReadingMcpServer() {
  const server = new McpServer(
    {
      name: "knowledge-next-reading-remote",
      version: "1.0.0",
    },
    {
      capabilities: { tools: {} },
    },
  );

  server.registerTool(
    "reading.overview",
    {
      title: "Reading Overview",
      description: "获取指定年份的阅读总览（总时长、活跃天数、月度汇总等）。",
      inputSchema: z.object({
        year: z.coerce.number().int().min(2021).max(new Date().getFullYear()).optional(),
      }),
      outputSchema,
    },
    async args => toMcpToolResult(await getReadingOverview(args)),
  );

  server.registerTool(
    "reading.trend",
    {
      title: "Reading Trend",
      description: "获取阅读趋势，支持 day/week/month 粒度。",
      inputSchema: z.object({
        year: z.coerce.number().int().min(2021).max(new Date().getFullYear()).optional(),
        granularity: z.enum(["day", "week", "month"]).optional(),
        periodDays: z.coerce.number().int().min(7).max(366).optional(),
      }),
      outputSchema,
    },
    async args => toMcpToolResult(await getReadingTrend(args)),
  );

  server.registerTool(
    "reading.books",
    {
      title: "Reading Books",
      description: "查询书架列表，支持状态、排序和关键词过滤。",
      inputSchema: z.object({
        status: z.enum(["all", "reading", "finished"]).optional(),
        sort: z.enum(["recent", "progress", "title"]).optional(),
        limit: z.coerce.number().int().min(1).max(200).optional(),
        keyword: z.string().optional(),
      }),
      outputSchema,
    },
    async args => toMcpToolResult(await getReadingBooks(args)),
  );

  server.registerTool(
    "reading.notes",
    {
      title: "Reading Notes",
      description: "查询阅读笔记能力状态（当前为占位能力）。",
      inputSchema: z.object({
        bookId: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
      }),
      outputSchema,
    },
    async args => toMcpToolResult(await getReadingNotes(args)),
  );

  server.registerTool(
    "reading.plan",
    {
      title: "Reading Plan",
      description: "根据当前进度和目标时长生成年度阅读计划。",
      inputSchema: z.object({
        year: z.coerce.number().int().min(2021).max(new Date().getFullYear()).optional(),
        targetHours: z.coerce.number().int().min(10).max(1000).optional(),
      }),
      outputSchema,
    },
    async args => toMcpToolResult(await getReadingPlan(args)),
  );

  return server;
}

function unauthorizedResponse() {
  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32001, message: "Unauthorized: missing or invalid Bearer token." },
      id: null,
    }),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "WWW-Authenticate": 'Bearer realm="knowledge-next-mcp"',
      },
    },
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, mcp-session-id, mcp-protocol-version, accept",
    },
  });
}

async function handleMcpRequest(request: Request) {
  const auth = await verifyReadOnlyMcpBearerToken(request.headers.get("authorization"));
  if (!auth) return unauthorizedResponse();

  const server = createReadingMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  try {
    return await transport.handleRequest(request);
  } finally {
    await server.close();
  }
}

export async function GET(request: Request) {
  return await handleMcpRequest(request);
}

export async function POST(request: Request) {
  return await handleMcpRequest(request);
}

export async function DELETE(request: Request) {
  return await handleMcpRequest(request);
}
