import "server-only";

import { prisma } from "@/lib/prisma";

const MCP_ENABLED_KEY = "mcp.enabled";

export async function isMcpEnabled() {
  try {
    const record = await prisma.featureFlag.findUnique({
      where: { key: MCP_ENABLED_KEY },
      select: { enabled: true },
    });

    // Default to disabled so MCP stays off until explicitly enabled.
    return record?.enabled ?? false;
  } catch (error) {
    console.error("Failed to read feature flag:", error);
    return false;
  }
}

export async function setMcpEnabled(enabled: boolean) {
  await prisma.featureFlag.upsert({
    where: { key: MCP_ENABLED_KEY },
    update: { enabled },
    create: {
      key: MCP_ENABLED_KEY,
      enabled,
      description: "Controls whether remote MCP endpoints are available.",
    },
  });
}

export { MCP_ENABLED_KEY };
