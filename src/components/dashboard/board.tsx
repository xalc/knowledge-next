"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardPage() {
  const { toast } = useToast();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookies] = useState("");
  const [updatingCookies, setUpdatingCookies] = useState(false);
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

  const handleUpdateCookies = async () => {
    setUpdatingCookies(true);
    // TODO: Implement cookie update logic, e.g., API call
    try {
      const response = await fetch("/api/update-cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookies }),
      });
      if (response.ok) {
        // Optionally, provide feedback to the user
        console.log("Cookies updated successfully");
        toast({
          title: "成功",
          description: "Cookies 更新成功！",
        });
      } else {
        console.error("Failed to update cookies");
        toast({
          variant: "destructive",
          title: "失败",
          description: "Cookies 更新失败，请查看控制台获取更多信息。",
        });
      }
    } catch (error) {
      console.error("Error updating cookies:", error);
      toast({
        variant: "destructive",
        title: "错误",
        description: "更新 Cookies 时发生错误，请查看控制台获取更多信息。",
      });
    }
    setUpdatingCookies(false);
  };

  return (
    <div className="container mx-auto space-y-8 p-4">
      <div className="rounded-lg border p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold">同步微信读书数据</h1>
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
        <h2 className="mb-4 text-xl font-semibold">更新 Cookies</h2>
        <Textarea
          placeholder="在此处粘贴您的 Cookie..."
          value={cookies}
          onChange={e => setCookies(e.target.value)}
          className="mb-4 min-h-[100px]"
        />
        <Button
          onClick={handleUpdateCookies}
          disabled={updatingCookies || !cookies}
          className="w-full sm:w-auto"
        >
          {updatingCookies ? "更新中..." : "更新 Cookies"}
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
