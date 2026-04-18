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

  const vid = cookieMap["wr_vid"] || "";
  const authToken = cookieMap["wr_access_token"] || cookieMap["wr_skey"] || "";
  const basever = cookieMap["wr_basever"] || "";
  const channelid = cookieMap["wr_channelid"] || "";
  const appver = cookieMap["wr_appver"] || basever || "";

  const headers: Record<string, string> = {
    Accept: "*/*",
    // UA 版本必须是 3 段 (X.Y.Z)，4 段会被服务端 401
    "User-Agent": `WeRead/${(appver || "10.0.3").split(".").slice(0, 3).join(".")} (iPhone; iOS 26.3.1; Scale/3.00)`,
    cookie: `wr_pf=ios, wr_skey=${authToken}, wr_vid=${vid}`,
  };
  // i.weread.qq.com 移动端 API 使用 vid + skey + basever + channelid + v 作为 HTTP Headers 认证
  if (vid) headers["vid"] = vid;
  if (authToken) headers["skey"] = authToken;
  if (basever) {
    headers["basever"] = basever;
    headers["v"] = basever;
  }
  if (channelid) headers["channelid"] = channelid;

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
