import { syncWRDataToDB } from "@/lib/wereader/wr-writer";

export async function GET() {
  const stream = new ReadableStream({
    start: async controller => {
      const originalLog = console.log;
      console.log = (...args) => {
        const logMessage = `${args.join(" ")}`;
        controller.enqueue(logMessage + "\n"); // 推送日志到流
      };
      const syncResult = await syncWRDataToDB();
      console.log(syncResult);
      controller.close();
      console.log = originalLog;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
