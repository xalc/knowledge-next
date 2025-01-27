"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">发生错误</CardTitle>
          <CardDescription>抱歉，加载文档时出现了问题。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-full rounded-lg bg-muted p-4">
            <p className="break-all font-mono text-sm">
              {error.message || "未知错误"}
              {error.digest && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  错误ID: {error.digest}
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-4">
            <Button asChild>
              <Link href="/docs">返回文档首页</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
