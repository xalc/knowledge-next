"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useLocale } from "@/context/locale-provider";

export default function DashboardPage() {
  const { toast } = useToast();
  const { t } = useLocale();
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
          title: t("dashboard.successTitle"),
          description: t("dashboard.successDesc"),
        });
      } else {
        console.error("Failed to update cookies");
        toast({
          variant: "destructive",
          title: t("dashboard.failTitle"),
          description: t("dashboard.failDesc"),
        });
      }
    } catch (error) {
      console.error("Error updating cookies:", error);
      toast({
        variant: "destructive",
        title: t("dashboard.errorTitle"),
        description: t("dashboard.errorDesc"),
      });
    }
    setUpdatingCookies(false);
  };

  return (
    <div className="container mx-auto space-y-8 p-4">
      <div className="rounded-lg border p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold">{t("dashboard.syncTitle")}</h1>
        <Button onClick={handleStream} disabled={loading} className="w-full sm:w-auto">
          {loading ? t("dashboard.syncing") : t("dashboard.syncButton")}
        </Button>
        {data && (
          <div className="mt-6">
            <h2 className="mb-2 text-lg font-medium">{t("dashboard.syncResult")}</h2>
            <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-800">
              {data}
            </pre>
          </div>
        )}
      </div>

      <div className="rounded-lg border p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">{t("dashboard.updateCookies")}</h2>
        <Textarea
          placeholder={t("dashboard.cookiesPlaceholder")}
          value={cookies}
          onChange={e => setCookies(e.target.value)}
          className="mb-4 min-h-[100px]"
        />
        <Button
          onClick={handleUpdateCookies}
          disabled={updatingCookies || !cookies}
          className="w-full sm:w-auto"
        >
          {updatingCookies ? t("dashboard.updatingCookies") : t("dashboard.updateCookiesButton")}
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
