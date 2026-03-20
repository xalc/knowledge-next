import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { prisma } from "@/lib/prisma";

const MCP_ISSUER = "knowledge-next:mcp";
const MCP_AUDIENCE = "knowledge-next:openclaw";
const MCP_SCOPE_READ = "read";

type McpJwtPayload = JWTPayload & {
  scope?: string;
};

function getJwtKey() {
  const secret = process.env.MCP_TOKEN_SECRET || process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing MCP_TOKEN_SECRET or SESSION_SECRET");
  }
  return new TextEncoder().encode(secret);
}

function buildTokenPreview(token: string) {
  return `${token.slice(0, 16)}...${token.slice(-8)}`;
}

function sha256(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

export async function issueReadOnlyMcpToken(params: { userId: string; name?: string }) {
  const key = getJwtKey();
  const jti = randomUUID();
  const token = await new SignJWT({ scope: MCP_SCOPE_READ })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(MCP_ISSUER)
    .setAudience(MCP_AUDIENCE)
    .setSubject(params.userId)
    .setJti(jti)
    .setIssuedAt()
    .sign(key);

  const created = await prisma.mcpToken.create({
    data: {
      userId: params.userId,
      name: params.name?.trim() || "OpenClaw",
      jti,
      scope: MCP_SCOPE_READ,
      tokenPreview: buildTokenPreview(token),
      tokenDigest: sha256(token),
    },
    select: {
      id: true,
      name: true,
      scope: true,
      tokenPreview: true,
      createdAt: true,
      revokedAt: true,
      lastUsedAt: true,
    },
  });

  return { token, record: created };
}

export async function listUserMcpTokens(userId: string) {
  return await prisma.mcpToken.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      scope: true,
      tokenPreview: true,
      createdAt: true,
      revokedAt: true,
      lastUsedAt: true,
    },
  });
}

export async function revokeMcpToken(params: { userId: string; tokenId: string }) {
  const token = await prisma.mcpToken.findFirst({
    where: {
      id: params.tokenId,
      userId: params.userId,
    },
    select: { id: true, revokedAt: true },
  });

  if (!token) {
    return { ok: false as const, error: "Token not found." };
  }

  if (token.revokedAt) {
    return { ok: true as const, alreadyRevoked: true };
  }

  await prisma.mcpToken.update({
    where: { id: token.id },
    data: { revokedAt: new Date() },
  });

  return { ok: true as const, alreadyRevoked: false };
}

function extractBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader) return null;
  const [type, token] = authorizationHeader.split(" ");
  if (!type || !token) return null;
  if (type.toLowerCase() !== "bearer") return null;
  return token.trim();
}

export async function verifyReadOnlyMcpBearerToken(authorizationHeader: string | null) {
  const rawToken = extractBearerToken(authorizationHeader);
  if (!rawToken) return null;

  const key = getJwtKey();
  let payload: McpJwtPayload;

  try {
    const verified = await jwtVerify(rawToken, key, {
      algorithms: ["HS256"],
      issuer: MCP_ISSUER,
      audience: MCP_AUDIENCE,
    });
    payload = verified.payload as McpJwtPayload;
  } catch {
    return null;
  }

  const userId = payload.sub;
  const jti = payload.jti;
  if (!userId || !jti) return null;
  if (payload.scope !== MCP_SCOPE_READ) return null;

  const record = await prisma.mcpToken.findUnique({
    where: { jti },
    select: {
      id: true,
      userId: true,
      name: true,
      scope: true,
      revokedAt: true,
      tokenDigest: true,
    },
  });

  if (!record || record.revokedAt) return null;
  if (record.userId !== userId) return null;
  if (record.scope !== MCP_SCOPE_READ) return null;
  if (record.tokenDigest !== sha256(rawToken)) return null;

  await prisma.mcpToken.update({
    where: { id: record.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    tokenId: record.id,
    userId: record.userId,
    scope: record.scope,
    tokenName: record.name,
  };
}
