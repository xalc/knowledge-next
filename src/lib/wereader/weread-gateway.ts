const WEREAD_GATEWAY_URL = "https://i.weread.qq.com/api/agent/gateway";
export const WEREAD_SKILL_VERSION = "1.0.4";
const DEFAULT_GATEWAY_TIMEOUT_MS = 20_000;

type GatewayEnvelope = {
  errcode?: number;
  errmsg?: string;
  errlog?: string;
  upgrade_info?: {
    message?: string;
  };
};

export class WeReadGatewayUpgradeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WeReadGatewayUpgradeError";
  }
}

export type GatewayShelfBook = {
  bookId: string;
  title?: string;
  author?: string;
  cover?: string;
  category?: string;
  readUpdateTime?: number;
  finishReading?: number;
  updateTime?: number;
  secret?: number;
  deepLink?: string;
};

export type GatewayShelfResponse = GatewayEnvelope & {
  books?: GatewayShelfBook[];
  albums?: unknown[];
  mp?: unknown;
  bookCount?: number;
};

export type GatewayBookProgressResponse = GatewayEnvelope & {
  bookId?: string;
  book?: {
    progress?: number;
    updateTime?: number;
    readingTime?: number;
    recordReadingTime?: number;
    finishTime?: number;
    isStartReading?: number;
  };
  timestamp?: number;
};

export type GatewayReadingDetailResponse = GatewayEnvelope & {
  baseTime?: number;
  readTimes?: Record<string, number>;
  registTime?: number;
  totalReadTime?: number;
  readDays?: number;
};

function getGatewayTimeoutMs() {
  const configured = Number(process.env.WEREAD_GATEWAY_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_GATEWAY_TIMEOUT_MS;
}

export async function callWeReadGateway<T extends GatewayEnvelope>(
  apiName: string,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const apiKey = process.env.WEREAD_API_KEY;
  if (!apiKey) {
    throw new Error("WEREAD_API_KEY is not configured.");
  }

  const timeoutMs = getGatewayTimeoutMs();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  let text: string;

  try {
    response = await fetch(WEREAD_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_name: apiName,
        ...payload,
        skill_version: WEREAD_SKILL_VERSION,
      }),
      signal: controller.signal,
    });
    text = await response.text();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`WeRead gateway request timed out after ${timeoutMs}ms: ${apiName}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new Error(`WeRead gateway returned non-JSON response: HTTP ${response.status}`);
  }

  if (!response.ok) {
    throw new Error(
      `WeRead gateway request failed: HTTP ${response.status}, ${data.errmsg ?? response.statusText}`,
    );
  }

  if (data.upgrade_info) {
    throw new WeReadGatewayUpgradeError(
      data.upgrade_info.message ?? "WeRead skill requires an upgrade.",
    );
  }

  if (data.errcode !== undefined && Number(data.errcode) !== 0) {
    throw new Error(
      data.errmsg ?? data.errlog ?? `WeRead gateway returned errcode ${data.errcode}`,
    );
  }

  return data;
}

export async function getGatewayShelf() {
  return await callWeReadGateway<GatewayShelfResponse>("/shelf/sync");
}

export async function getGatewayBookProgress(bookId: string) {
  return await callWeReadGateway<GatewayBookProgressResponse>("/book/getprogress", { bookId });
}

export async function getGatewayReadingDetail(options: {
  mode: "weekly" | "monthly" | "annually" | "overall";
  baseTime?: number;
}) {
  return await callWeReadGateway<GatewayReadingDetailResponse>("/readdata/detail", options);
}
