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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function ReadingSummary() {
  // TODO refactor to parallel router
  const [year, setYear] = useState(2025);
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
      {!loading ? (
        <div>数据同步时间: {formatDateTime(Number(lastSyncTime))}</div>
      ) : (
        <Skeleton className="h-4 w-1/2 rounded-full" />
      )}
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
        <Card className="w-full">
          <CardHeader>
            <div className="mt-10 grid grid-cols-1 justify-items-center gap-8">
              <Skeleton className="h-[40px] w-5/6 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-10 grid justify-items-center gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
              <Skeleton className="h-[20px] w-5/6 rounded-full" />
              <Skeleton className="h-[20px] w-5/6 rounded-full" />
              <Skeleton className="h-[20px] w-5/6 rounded-full" />
              <Skeleton className="h-[20px] w-5/6 rounded-full" />
              <Skeleton className="h-[20px] w-5/6 rounded-full" />
              <Skeleton className="h-[20px] w-5/6 rounded-full" />
              <Skeleton className="h-[20px] w-5/6 rounded-full" />
              <Skeleton className="h-[20px] w-5/6 rounded-full" />
              <Skeleton className="h-[20px] w-5/6 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full">
          <ReadingStats summarys={summary} year={year} />
          <ScrollArea className="hidden h-[300px] w-full lg:block">
            <Heatmap summarys={summary} year={year} lastSyncTime={Number(lastSyncTime)} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <Accordion type="single" defaultValue="summary" collapsible className="lg:hidden">
            <AccordionItem value="summary">
              <AccordionTrigger className="no-underline">每日热力图</AccordionTrigger>
              <AccordionContent>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <MonthHeatmap summarys={summary} year={year} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}
