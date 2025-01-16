import { verifySession } from "@/lib/dal";
import { syncWRDataToDB } from "@/lib/wereader/wr-writer";

export async function GET() {
  const user = await verifySession();
  const stream = new ReadableStream({
    start: async controller => {
      if (!user || !user.isAuth) {
        controller.enqueue("Unauthorized!!!" + "\n");
      } else {
        const originalLog = console.log;
        console.log = (...args) => {
          const logMessage = `${args.join(" ")}`;
          controller.enqueue(logMessage + "\n"); // 推送日志到流
        };
        const syncResult = await syncWRDataToDB();
        controller.enqueue("\n");
        console.log(syncResult);

        console.log = originalLog;
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
