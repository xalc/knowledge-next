import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { issueReadOnlyMcpToken, listUserMcpTokens, revokeMcpToken } from "@/lib/mcp-token";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const session = await verifySession();
  if (!session?.isAuth) return unauthorized();

  const tokens = await listUserMcpTokens(session.id);
  return NextResponse.json({ ok: true, tokens });
}

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session?.isAuth) return unauthorized();

  const body = (await request.json().catch(() => ({}))) as { name?: string };
  const issued = await issueReadOnlyMcpToken({
    userId: session.id,
    name: typeof body.name === "string" ? body.name : undefined,
  });

  return NextResponse.json({
    ok: true,
    token: issued.token,
    tokenInfo: issued.record,
  });
}

export async function DELETE(request: Request) {
  const session = await verifySession();
  if (!session?.isAuth) return unauthorized();

  const body = (await request.json().catch(() => ({}))) as { tokenId?: string };
  if (!body.tokenId) {
    return NextResponse.json({ ok: false, error: "tokenId is required." }, { status: 400 });
  }

  const result = await revokeMcpToken({
    userId: session.id,
    tokenId: body.tokenId,
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json({ ok: true, alreadyRevoked: result.alreadyRevoked });
}
