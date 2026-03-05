import clsx from "clsx";
import { useMemo } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReadingSummaryType } from "@/types/reading-summary";
import { getGridCellClasses, getReadingLevel, getReadingText, groupDataByMonth } from "../utils";

const monthFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
});
const dayFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "long",
});
const weekDayLabels = ["日", "一", "二", "三", "四", "五", "六"];

export default function MonthHeatmap({
  summarys,
  year,
}: {
  summarys: ReadingSummaryType[];
  year: number;
}) {
  const currentDate = new Date();
  const visibleMonthCount = year === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 12;
  const months = groupDataByMonth(year).slice(0, visibleMonthCount);
  const maxSeconds = summarys.reduce((acc, item) => Math.max(acc, item.readingSeconds), 0);
  const summaryMap = useMemo(
    () => new Map(summarys.map(item => [Number(item.id), item])),
    [summarys],
  );

  return (
    <>
      {months.map((month, index) => {
        const monthFirstDay =
          month.find(day => day !== null) ?? `${year}-${String(index + 1).padStart(2, "0")}-01`;
        return (
          <Card key={`month_${index}`} className="overflow-hidden rounded-2xl border-border/70">
            <CardHeader className="border-b border-border/60 bg-secondary/20 py-3">
              <h3 className="font-geek text-sm tracking-wide text-muted-foreground">
                {monthFormatter.format(new Date(`${monthFirstDay}T00:00:00`))}
              </h3>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-1 text-center text-[10px] text-muted-foreground/80">
                {weekDayLabels.map(day => (
                  <div key={`${index}_${day}`}>{day}</div>
                ))}
              </div>
              <TooltipProvider delayDuration={120}>
                <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-1.5">
                  {month.map((day, dayIndex) => {
                    if (day === null)
                      return <div key={`empty_${index}_${dayIndex}`} className="aspect-square" />;

                    const dayUnix = Math.floor(new Date(`${day}T00:00:00`).getTime() / 1000);
                    const summary =
                      summaryMap.get(dayUnix) ??
                      ({ id: String(dayUnix), readingSeconds: 0 } as const);
                    const level = getReadingLevel(summary.readingSeconds, maxSeconds);

                    return (
                      <HeatmapCell
                        key={`cell_${index}_${summary.id}`}
                        day={day}
                        level={level}
                        summary={summary}
                      />
                    );
                  })}
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

const HeatmapCell = ({
  day,
  summary,
  level,
}: {
  day: string;
  summary: ReadingSummaryType;
  level: number;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={clsx("aspect-square rounded-sm", getGridCellClasses(level))} />
      </TooltipTrigger>
      <TooltipContent>
        <CellTooltip day={day} readingSeconds={summary.readingSeconds} level={level} />
      </TooltipContent>
    </Tooltip>
  );
};

const CellTooltip = ({
  day,
  readingSeconds,
  level,
}: {
  day: string;
  readingSeconds: number;
  level: number;
}) => (
  <div className="space-y-1.5">
    <p className="font-medium">{dayFormatter.format(new Date(`${day}T00:00:00`))}</p>
    <p className="flex items-center gap-2">
      <Clock className="h-4 w-4" />
      <span>{(readingSeconds / 60).toFixed(0)} 分钟</span>
    </p>
    <p className="text-sm text-muted-foreground">{getReadingText(level)}</p>
  </div>
);
