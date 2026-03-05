"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, AlertTriangle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { readingSummaryAction } from "@/actions/wereader";
import ReadingStats from "@/components/wereader/stats/reading-stats";
import Heatmap from "@/components/wereader/stats/heatmap/heatmap";
import MonthHeatmap from "./heatmap/month-heatmap";
import { ReadingSummaryType } from "@/types/reading-summary";

const START_YEAR = 2021;
const syncDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export default function ReadingSummary() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [lastSyncTime, setLastSyncTime] = useState(0);
  const [summary, setSummary] = useState<ReadingSummaryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const yearOptions = useMemo(() => {
    const endYear = Math.max(currentYear, START_YEAR);
    const years = Array.from(
      { length: endYear - START_YEAR + 1 },
      (_, index) => START_YEAR + index,
    );
    return years.reverse();
  }, [currentYear]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrorMessage("");

    readingSummaryAction(year)
      .then(result => {
        if (cancelled) return;
        setSummary(result?.yearSummary ?? []);
        setLastSyncTime(Number(result?.lastSyncTime ?? 0));
      })
      .catch(error => {
        if (cancelled) return;
        console.error("[reading-summary] failed to load reading summary", error);
        setSummary([]);
        setLastSyncTime(0);
        setErrorMessage("读取阅读统计失败，请稍后重试。");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  const syncText =
    lastSyncTime > 0 ? syncDateFormatter.format(new Date(lastSyncTime * 1000)) : "暂无同步记录";
  const hasReadableData = summary.some(item => item.readingSeconds > 0);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur"
          aria-live="polite"
        >
          <Clock3 className="h-4 w-4" />
          <span>同步时间：{loading ? "读取中..." : syncText}</span>
        </div>
        <div className="w-full overflow-x-auto pb-1 lg:w-auto">
          <div className="flex min-w-max items-center gap-2">
            {yearOptions.map(option => (
              <Button
                key={option}
                variant={option === year ? "default" : "outline"}
                size="sm"
                className="rounded-full px-4"
                onClick={() => setYear(option)}
                aria-pressed={option === year}
              >
                {option}年
              </Button>
            ))}
          </div>
        </div>
      </div>

      {errorMessage ? (
        <Card className="border-destructive/30 bg-destructive/5" role="alert" aria-live="assertive">
          <CardContent className="flex items-start gap-3 pt-6 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{errorMessage}</p>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <Card className="border-border/70 bg-background/90">
          <CardHeader className="space-y-3">
            <Skeleton className="h-6 w-48 rounded-full" />
            <Skeleton className="h-4 w-64 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`stats_skeleton_${index}`} className="h-36 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-[320px] rounded-2xl" />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <ReadingStats summarys={summary} year={year} />

          <Card className="border-border/70 bg-background/90 shadow-sm">
            <CardHeader className="space-y-2 pb-2">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-literary text-xl font-semibold tracking-tight">年度热力图</h3>
                <span className="font-geek text-xs text-muted-foreground [font-variant-numeric:tabular-nums]">
                  {year}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                颜色越深表示阅读时长越长，共记录 {summary.length} 天。
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="hidden w-full lg:block">
                <Heatmap summarys={summary} year={year} lastSyncTime={Number(lastSyncTime)} />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <Accordion type="single" defaultValue="summary" collapsible className="lg:hidden">
                <AccordionItem value="summary">
                  <AccordionTrigger className="py-2 text-left text-sm no-underline hover:no-underline">
                    查看按月热力图
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2">
                      <MonthHeatmap summarys={summary} year={year} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {!hasReadableData && (
                <div className="rounded-xl border border-dashed border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground">
                  该年度暂无有效阅读时长数据，尝试在 Dashboard 重新同步后再查看。
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
