import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { updateWRToken } from "@/lib/wereader/wr-db";

export async function POST(request: Request) {
  const user = await verifySession();

  if (!user || !user.isAuth) {
    // 用户未认证
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { cookies } = body;

    if (typeof cookies !== "string" || cookies.trim() === "") {
      return NextResponse.json(
        { error: "Cookies are required and must be a non-empty string." },
        { status: 400 },
      );
    }
    await updateWRToken(cookies);

    return NextResponse.json({ message: "Cookies updated successfully." });
  } catch (error) {
    console.error("API error in /api/update-cookies:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: "Failed to update cookies.", details: errorMessage },
      { status: 500 },
    );
  }
}
