import { verifySession } from "@/lib/dal";
import { syncWRDataToDB } from "@/lib/wereader/wr-writer";

export async function GET() {
  const user = await verifySession();
  const stream = new ReadableStream({
    start: async controller => {
      if (!user || !user.isAuth) {
        controller.enqueue("[SYNC] Unauthorized\n");
      } else {
        const originalLog = console.log;
        const originalError = console.error;
        const pushLog = (prefix: string, args: unknown[]) => {
          const logMessage = `${prefix}${args.map(arg => (typeof arg === "string" ? arg : JSON.stringify(arg))).join(" ")}`;
          controller.enqueue(logMessage + "\n");
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
          const syncResult = await syncWRDataToDB();
          controller.enqueue("\n");
          controller.enqueue("[SYNC][RESULT] " + JSON.stringify(syncResult, null, 2) + "\n");
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          controller.enqueue(`[SYNC][FATAL] ${message}\n`);
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
