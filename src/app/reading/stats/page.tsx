import ReadingSummary from "@/components/wereader/stats/reading-summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function ReadingSummarys() {
  return (
    <div className="relative mx-4 mb-12 mt-6 overflow-hidden rounded-3xl border border-border/70 bg-background p-6 shadow-[0_18px_50px_-40px_hsl(var(--foreground)/0.45)] sm:mx-8 sm:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(hsl(var(--border))_0.8px,transparent_0.8px)] [background-size:18px_18px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <p className="font-geek text-xs uppercase tracking-[0.24em] text-muted-foreground">
              WeRead Analytics
            </p>
            <h1 className="font-literary text-3xl font-bold tracking-tight sm:text-4xl">
              阅读数据
            </h1>
            <p className="text-muted-foreground">从习惯到节奏，记录 2021 至今的阅读轨迹。</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              className="rounded-full bg-background/80 backdrop-blur"
            >
              <Link href="/reading" className="gap-2">
                <BookOpen className="h-4 w-4" />
                返回书架
              </Link>
            </Button>
          </div>
        </div>

        <ReadingSummary />
      </div>
    </div>
  );
}
