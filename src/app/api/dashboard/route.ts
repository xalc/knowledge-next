import { verifySession } from "@/lib/dal";
import { syncWRDataToDB } from "@/lib/wereader/wr-writer";

export async function GET() {
  const user = await verifySession();
  const stream = new ReadableStream({
    start: async controller => {
      if (!user || !user.isAuth) {
        controller.enqueue("[SYNC] Unauthorized\n");
      } else {
        const logger = (...args: unknown[]) => {
          const logMessage = args
            .map(arg => (typeof arg === "string" ? arg : JSON.stringify(arg)))
            .join(" ");
          console.log(...args);
          controller.enqueue(logMessage + "\n");
        };

        try {
          const syncResult = await syncWRDataToDB(logger);
          controller.enqueue("\n");
          controller.enqueue("[SYNC][RESULT] " + JSON.stringify(syncResult, null, 2) + "\n");
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          controller.enqueue(`[SYNC][FATAL] ${message}\n`);
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
