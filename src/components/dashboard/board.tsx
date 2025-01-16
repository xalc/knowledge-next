"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const handleStream = async () => {
    setLoading(true);
    const response = await fetch("/api/dashboard");
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let accumulatedData = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      accumulatedData += decoder.decode(value);
      setData(accumulatedData);
    }
    setLoading(false);
  };

  return (
    <>
      <div>
        <h1>同步微信读书数据</h1>
        <Button onClick={handleStream} disabled={loading}>
          {loading ? "SYNCing..." : "SYNC now"}
        </Button>
        <pre className="mt-8 space-y-6 whitespace-pre-line border-2 bg-primary/10">{data}</pre>
      </div>
    </>
  );
}
