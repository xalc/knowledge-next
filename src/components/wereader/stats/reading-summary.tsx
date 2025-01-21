"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ReadingStats from "@/components/wereader/stats/reading-stats";
import { readingSummaryAction } from "@/actions/wereader";
import Heatmap from "@/components/wereader/stats/heatmap/heatmap";
import { formatDateTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MonthHeatmap from "./heatmap/month-heatmap";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ReadingSummary() {
  // TODO refactor to parallel router
  const [year, setYear] = useState(2024);
  const [lastSyncTime, setLastSyncTime] = useState(0);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    readingSummaryAction(year).then(result => {
      setSummary(result.yearSummary);
      setLastSyncTime(Number(result.lastSyncTime));
      setLoading(false);
    });
  }, [year]);

  return (
    <div className="flex w-full flex-col">
      {!loading && <div>数据同步时间: {formatDateTime(Number(lastSyncTime))}</div>}
      <div className="my-2 flex flex-wrap justify-end gap-4">
        {[2021, 2022, 2023, 2024, 2025].map(eachEear => (
          <Button
            key={eachEear}
            variant={eachEear === year ? "default" : "outline"}
            size="sm"
            className="rounded-sm"
            onClick={() => setYear(eachEear)}
          >
            {eachEear}年
          </Button>
        ))}
      </div>
      {loading ? (
        <div className="h-[400px] w-full">
          <Card>
            <CardHeader>
              <Skeleton className="h-[40px] w-5/6 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
                <Skeleton className="h-[20px] w-5/6 rounded-full" />
                <Skeleton className="h-[20px] w-5/6 rounded-full" />
                <Skeleton className="h-[20px] w-5/6 rounded-full" />
                <Skeleton className="h-[20px] w-5/6 rounded-full" />
                <Skeleton className="h-[20px] w-5/6 rounded-full" />
                <Skeleton className="h-[20px] w-5/6 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="w-full">
          <ReadingStats summarys={summary} year={year} />
          <ScrollArea className="hidden h-[400px] w-full lg:block">
            <Heatmap summarys={summary} year={year} lastSyncTime={Number(lastSyncTime)} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
            <MonthHeatmap summarys={summary} year={year} />
          </div>
        </div>
      )}
    </div>
  );
}
