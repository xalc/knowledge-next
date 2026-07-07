import { verifySession } from "@/lib/dal";

// Vercel Hobby only allows 1-60 seconds for Serverless Functions.
export const maxDuration = 60;

const WEREAD_SYNC_FEATURE_FLAG = "WEREAD_DASHBOARD_SYNC_ENABLED";

function isFeatureEnabled(value: string | undefined) {
  return ["1", "true", "yes", "on"].includes((value ?? "").trim().toLowerCase());
}

function buildSyncSkippedResult() {
  return {
    ok: true,
    skipped: true,
    featureFlag: WEREAD_SYNC_FEATURE_FLAG,
    message: "wechat reader sync skipped by feature flag",
    steps: [
      {
        step: "dashboardSyncFeatureFlag",
        ok: true,
        details: `${WEREAD_SYNC_FEATURE_FLAG} is not enabled; syncWRDataToDB was not called.`,
      },
    ],
  };
}

export async function GET() {
  const user = await verifySession();
  const stream = new ReadableStream({
    start: async controller => {
      const encoder = new TextEncoder();
      const enqueue = (message: string) => controller.enqueue(encoder.encode(message));

      if (!user || !user.isAuth) {
        enqueue("[SYNC] Unauthorized\n");
      } else {
        const originalLog = console.log;
        const originalError = console.error;
        const pushLog = (prefix: string, args: unknown[]) => {
          const logMessage = `${prefix}${args.map(arg => (typeof arg === "string" ? arg : JSON.stringify(arg))).join(" ")}`;
          enqueue(logMessage + "\n");
        };

        console.log = (...args) => {
          originalLog(...args);
          pushLog("", args);
        };

        console.error = (...args) => {
          originalError(...args);
          pushLog("[ERROR] ", args);
        };

        try {
          if (!isFeatureEnabled(process.env[WEREAD_SYNC_FEATURE_FLAG])) {
            enqueue(
              `[SYNC][SKIPPED] syncWRDataToDB is disabled by feature flag ${WEREAD_SYNC_FEATURE_FLAG}.\n`,
            );
            enqueue(
              `[SYNC][SKIPPED] Set ${WEREAD_SYNC_FEATURE_FLAG}=true to re-enable dashboard-triggered WeRead writes.\n`,
            );
            enqueue("\n");
            enqueue("[SYNC][RESULT] " + JSON.stringify(buildSyncSkippedResult(), null, 2) + "\n");
          } else {
            const { syncWRDataToDB } = await import("@/lib/wereader/wr-writer");
            const syncResult = await syncWRDataToDB();
            enqueue("\n");
            enqueue("[SYNC][RESULT] " + JSON.stringify(syncResult, null, 2) + "\n");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          enqueue(`[SYNC][FATAL] ${message}\n`);
        } finally {
          console.log = originalLog;
          console.error = originalError;
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
