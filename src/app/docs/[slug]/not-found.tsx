import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-24rem)] items-center justify-center">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-muted p-3">
              <FileQuestion className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">页面未找到</CardTitle>
          <CardDescription>抱歉，您访问的文档页面不存在。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-muted-foreground">
            这可能是因为页面已被移动、删除或者链接错误。 您可以返回文档首页或浏览其他文档内容。
          </p>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/docs">返回文档首页</Link>
            </Button>
            <Button asChild>
              <Link href="/">返回网站首页</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
