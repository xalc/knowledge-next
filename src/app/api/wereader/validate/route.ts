import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { getWRToken } from "@/lib/wereader/wr-db";
import { WEREAD_URL } from "@/lib/wereader/constant";

async function validateCookie(cookieStr: string) {
  if (!cookieStr) {
    return { ok: false, error: "Missing cookie token", status: 400 };
  }

  const response = await fetch(WEREAD_URL, {
    method: "GET",
    headers: {
      cookie: cookieStr,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    return { ok: false, error: `Request failed: ${response.status}`, status: 502 };
  }

  const text = await response.text();
  const isLoggedIn =
    text.includes("wr_name") || text.includes("wr_vid") || text.includes("weread.qq.com");

  return { ok: isLoggedIn, status: response.status };
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
