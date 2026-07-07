"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStream = async () => {
    setLoading(true);
    setData("");

    try {
      const response = await fetch("/api/dashboard");
      const reader = response.body?.getReader();

      if (!reader) {
        setData("No response stream returned from /api/dashboard.");
        return;
      }

      const decoder = new TextDecoder("utf-8");
      let accumulatedData = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedData += decoder.decode(value, { stream: true });
        setData(accumulatedData);
      }

      accumulatedData += decoder.decode();
      setData(accumulatedData);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setData(`[SYNC][FATAL] ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto space-y-8 p-4">
      <div className="rounded-lg border p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold">同步微信读书数据</h1>
        <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
          Dashboard 现在只通过 WeRead skill gateway
          同步数据，不再支持粘贴或保存微信读书认证信息。生产环境默认由{" "}
          <code>WEREAD_DASHBOARD_SYNC_ENABLED</code> 控制是否允许写库。
        </p>
        <Button onClick={handleStream} disabled={loading} className="w-full sm:w-auto">
          {loading ? "同步中..." : "立即同步"}
        </Button>
        {data && (
          <div className="mt-6">
            <h2 className="mb-2 text-lg font-medium">同步结果:</h2>
            <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-800">
              {data}
            </pre>
          </div>
        )}
      </div>

      <div className="rounded-lg border p-6 shadow-md">
        <h2 className="mb-3 text-xl font-semibold">当前同步策略</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            默认状态下，<code>GET /api/dashboard</code> 会跳过写库并输出{" "}
            <code>[SYNC][SKIPPED]</code>。只有设置 <code>WEREAD_DASHBOARD_SYNC_ENABLED=true</code>{" "}
            后才会调用 <code>syncWRDataToDB</code>。
          </p>
          <p>
            推荐在本地或长时任务环境运行 <code>pnpm backup:db</code>，再运行{" "}
            <code>pnpm sync:weread:gateway</code>。该路径只需要 <code>DATABASE_URL</code> 和{" "}
            <code>WEREAD_API_KEY</code>。
          </p>
          <p>
            如果在 Vercel Hobby 上启用 Dashboard 写库，需要确认同步能在 60
            秒内完成，否则应继续保持关闭。
          </p>
        </div>
      </div>
    </div>
  );
}
