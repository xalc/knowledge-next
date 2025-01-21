import ReadingSummary from "@/components/wereader/stats/reading-summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function ReadingSummarys() {
  return (
    <div className="mx-8 mt-8 flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">阅读数据</h1>
          <p className="text-muted-foreground">读书KPI</p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/reading" className="gap-2">
              <BookOpen className="h-4 w-4" />
              返回书架
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>当年读书时长</CardTitle>
        </CardHeader>
        <CardContent>
          <ReadingSummary />
        </CardContent>
      </Card>
    </div>
  );
}
