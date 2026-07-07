const { mkdirSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const MODELS = [
  ["User", "user"],
  ["PostContent", "postContent"],
  ["Post", "post"],
  ["WRMeta", "wRMeta"],
  ["WRReadingSummary", "wRReadingSummary"],
  ["WRBookShelt", "wRBookShelt"],
  ["Timeline", "timeline"],
  ["FeatureFlag", "featureFlag"],
];

function timestamp() {
  const now = new Date();
  const pad = value => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

async function exportModel(outputDir, modelName, clientName) {
  const client = prisma[clientName];
  if (!client || typeof client.findMany !== "function") {
    throw new Error(`Unknown Prisma client model: ${clientName}`);
  }

  const records = await client.findMany();
  const fileName = `${modelName}.json`;
  const filePath = path.join(outputDir, fileName);
  writeFileSync(filePath, JSON.stringify(records, null, 2), "utf8");

  return {
    model: modelName,
    file: fileName,
    count: records.length,
    ok: true,
  };
}

async function main() {
  const generatedAt = new Date().toISOString();
  const outputDir = path.join(process.cwd(), ".db-backups", timestamp());
  mkdirSync(outputDir, { recursive: true });

  const manifest = {
    generatedAt,
    outputDir,
    format: "prisma-json-v1",
    rawBackup: true,
    note: "Contains raw database values, including sensitive fields. Keep .db-backups/ untracked.",
    models: [],
  };

  for (const [modelName, clientName] of MODELS) {
    try {
      const result = await exportModel(outputDir, modelName, clientName);
      manifest.models.push(result);
      console.log(`[backup] ${modelName}: ${result.count} records`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      manifest.models.push({
        model: modelName,
        file: `${modelName}.json`,
        count: 0,
        ok: false,
        error: message,
      });
      console.error(`[backup] ${modelName}: failed (${message})`);
    }
  }

  writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(`[backup] complete: ${outputDir}`);

  if (manifest.models.some(model => !model.ok)) {
    process.exitCode = 1;
  }
}

main()
  .catch(error => {
    console.error(`[backup] fatal: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
