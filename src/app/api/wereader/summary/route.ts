import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";

const SUMMARY_API_URL = "https://i.weread.qq.com/readdata/summary";

export async function POST(request: Request) {
  const user = await verifySession();
  if (!user || !user.isAuth) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const cookies = typeof body?.cookies === "string" ? body.cookies.trim() : "";
    const synckey =
      typeof body?.synckey === "number" || typeof body?.synckey === "string"
        ? String(body.synckey)
        : "0";

    if (!cookies) {
      return NextResponse.json({ ok: false, error: "Cookies are required." }, { status: 400 });
    }

    const endpoint = `${SUMMARY_API_URL}?synckey=${encodeURIComponent(synckey)}`;

    // 解析 cookies 字符串，提取 vid 和 skey 用于移动端 API 认证
    const cookiePairs = cookies
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

    const fetchHeaders: Record<string, string> = {
      Accept: "*/*",
      // UA 版本必须是 3 段 (X.Y.Z)，4 段会被服务端 401
      "User-Agent": `WeRead/${(appver || "10.0.3").split(".").slice(0, 3).join(".")} (iPhone; iOS 26.3.1; Scale/3.00)`,
      cookie: `wr_pf=ios, wr_skey=${authToken}, wr_vid=${vid}`,
    };
    // i.weread.qq.com 移动端 API 使用 vid + skey + basever + channelid + v
    if (vid) fetchHeaders["vid"] = vid;
    if (authToken) fetchHeaders["skey"] = authToken;
    if (basever) {
      fetchHeaders["basever"] = basever;
      fetchHeaders["v"] = basever;
    }
    if (channelid) fetchHeaders["channelid"] = channelid;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: fetchHeaders,
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
    const isApiSuccess = response.ok && (errcode === undefined || Number(errcode) === 0);
    const readTimes =
      parsed?.readTimes && typeof parsed.readTimes === "object"
        ? (parsed.readTimes as Record<string, unknown>)
        : null;
    const readTimesEntries = readTimes ? Object.entries(readTimes) : [];
    const readTimesPreview = readTimes ? Object.fromEntries(readTimesEntries.slice(0, 20)) : null;
    const readTimesTailPreview = readTimes ? Object.fromEntries(readTimesEntries.slice(-20)) : null;

    return NextResponse.json({
      ok: isApiSuccess,
      requestedSynckey: synckey,
      endpoint: response.url,
      httpStatus: response.status,
      statusText: response.statusText,
      responseOk: response.ok,
      contentType: response.headers.get("content-type"),
      responseHeaders: {
        date: response.headers.get("date"),
        server: response.headers.get("server"),
        cacheControl: response.headers.get("cache-control"),
        contentLength: response.headers.get("content-length"),
      },
      isJson: Boolean(parsed),
      keys: parsed ? Object.keys(parsed).slice(0, 20) : [],
      errcode: parsed?.errcode ?? null,
      errmsg: parsed?.errmsg ?? null,
      synckey: parsed?.synckey ?? null,
      registTime: parsed?.registTime ?? null,
      readTimesCount: readTimes ? Object.keys(readTimes).length : 0,
      readTimesPreview,
      readTimesTailPreview,
      parsedBody: parsed,
      rawLength: rawText.length,
      rawSample: rawText.slice(0, 2000),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
