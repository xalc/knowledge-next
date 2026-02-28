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
  const [cookieStatus, setCookieStatus] = useState<"idle" | "checking" | "valid" | "invalid">(
    "idle",
  );
  const [cookieMessage, setCookieMessage] = useState("");
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

  const handleValidateCookies = async () => {
    if (!cookies) return;
    setCookieStatus("checking");
    setCookieMessage("");
    try {
      const response = await fetch("/api/wereader/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookies }),
      });
      const result = await response.json();
      if (result.ok) {
        setCookieStatus("valid");
        setCookieMessage("验证通过");
        toast({
          title: "验证通过",
          description: "Cookie 有效，可以更新。",
        });
      } else {
        setCookieStatus("invalid");
        setCookieMessage(result.error || "验证失败");
        toast({
          variant: "destructive",
          title: "验证失败",
          description: result.error || "Cookie 无效或已过期。",
        });
      }
    } catch (error) {
      setCookieStatus("invalid");
      setCookieMessage("验证请求失败");
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "验证请求失败，请查看控制台。",
      });
      console.error("Error validating cookies:", error);
    }
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
          onChange={e => {
            setCookies(e.target.value);
            setCookieStatus("idle");
            setCookieMessage("");
          }}
          className="mb-4 min-h-[100px]"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            onClick={handleValidateCookies}
            disabled={!cookies || cookieStatus === "checking"}
            className="w-full sm:w-auto"
            variant="outline"
          >
            {cookieStatus === "checking" ? "验证中..." : "验证 Cookies"}
          </Button>
          <Button
            onClick={handleUpdateCookies}
            disabled={updatingCookies || !cookies || cookieStatus !== "valid"}
            className="w-full sm:w-auto"
          >
            {updatingCookies ? "更新中..." : "更新 Cookies"}
          </Button>
          {cookieMessage && (
            <span
              className={`text-sm ${
                cookieStatus === "valid" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {cookieMessage}
            </span>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
