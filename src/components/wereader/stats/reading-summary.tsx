"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ReadingStats from "@/components/wereader/stats/reading-stats";
import { readingSummaryAction } from "@/actions/wereader";
import Heatmap from "@/components/wereader/stats/heatmap/heatmap";
import { formatDateTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
      <div>数据同步时间: {formatDateTime(Number(lastSyncTime))}</div>
      <div className="my-2 flex flex-col flex-wrap justify-end gap-4 sm:flex-row">
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
          <p>Loading...</p>
        </div>
      ) : (
        <div className="w-full">
          <ReadingStats summarys={summary} year={year} />
          <ScrollArea className="hidden h-[400px] w-full sm:block">
            <Heatmap summarys={summary} year={year} lastSyncTime={Number(lastSyncTime)} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
