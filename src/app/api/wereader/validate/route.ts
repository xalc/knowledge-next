import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { getWRToken } from "@/lib/wereader/wr-db";

const SUMMARY_VALIDATE_URL = "https://i.weread.qq.com/readdata/summary?synckey=0";

async function validateCookie(cookieStr: string) {
  if (!cookieStr) {
    return { ok: false, error: "Missing cookie token", status: 400 };
  }

  // 解析 cookie 字符串提取 vid 和 skey 用于移动端 API 认证
  const cookiePairs = cookieStr
    .split(/[;,]/)
    .map((p: string) => p.trim())
    .filter(Boolean);
  const cookieMap: Record<string, string> = {};
  for (const pair of cookiePairs) {
    const [k, ...rest] = pair.split("=");
    if (k) cookieMap[k.trim()] = rest.join("=").trim();
  }

  const headers: Record<string, string> = {
    cookie: cookieStr,
    Accept: "application/json",
    "User-Agent": "WeRead/10.0.3 (iPhone; iOS 26.3; Scale/3.00)",
  };
  // i.weread.qq.com 移动端 API 使用 vid + skey 作为 HTTP Headers 认证
  if (cookieMap["wr_vid"]) headers["vid"] = cookieMap["wr_vid"];
  if (cookieMap["wr_skey"]) headers["skey"] = cookieMap["wr_skey"];

  const response = await fetch(SUMMARY_VALIDATE_URL, {
    method: "GET",
    headers,
    redirect: "follow",
  });

  const rawText = await response.text();
  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    parsed = null;
  }

  const errcode = parsed?.errcode;
  const isLoggedIn = response.ok && (errcode === undefined || Number(errcode) === 0);

  if (isLoggedIn) {
    return {
      ok: true,
      status: response.status,
      endpoint: response.url,
      errcode: errcode ?? 0,
    };
  }

  const isTimeout = Number(errcode) === -2012 || parsed?.errmsg === "登录超时";
  return {
    ok: false,
    status: response.status || 401,
    endpoint: response.url,
    errcode: errcode ?? null,
    error: isTimeout ? "Cookie 已过期（登录超时）" : String(parsed?.errmsg || "Cookie 无效"),
    rawSample: rawText.slice(0, 200),
  };
}

export async function GET() {
  const user = await verifySession();
  if (!user || !user.isAuth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cookieStr = await getWRToken();
    const result = await validateCookie(cookieStr);
    return NextResponse.json(result, { status: result.ok ? 200 : result.status || 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await verifySession();
  if (!user || !user.isAuth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { cookies } = body ?? {};
    if (typeof cookies !== "string") {
      return NextResponse.json({ ok: false, error: "Cookies are required." }, { status: 400 });
    }

    const result = await validateCookie(cookies.trim());
    return NextResponse.json(result, { status: result.ok ? 200 : result.status || 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
