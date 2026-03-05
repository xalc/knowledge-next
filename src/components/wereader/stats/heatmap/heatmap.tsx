import clsx from "clsx";
import { useMemo } from "react";
import { Clock } from "lucide-react";
import { ReadingSummaryType } from "@/types/reading-summary";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  getWeeksOfYear,
  getReadingLevel,
  getReadingText,
  getGridCellClasses,
  getReadingIcon,
} from "../utils";

const monthLabels = Array.from({ length: 12 }, (_, index) => `${index + 1}月`);
const weekDayLabels = ["日", "一", "二", "三", "四", "五", "六"];
const fullDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "long",
});

export default function Heatmap({
  summarys,
  year,
  lastSyncTime,
}: {
  summarys: ReadingSummaryType[];
  year: number;
  lastSyncTime: number;
}) {
  const maxSeconds = summarys.reduce((acc, item) => Math.max(acc, item.readingSeconds), 0);
  const weeks = getWeeksOfYear(year);
  const summaryMap = useMemo(
    () => new Map(summarys.map(item => [Number(item.id), item])),
    [summarys],
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className="min-w-[900px] space-y-4 pb-2">
        <div className="pl-14">
          <div className="grid grid-cols-[repeat(12,minmax(0,1fr))] text-center text-xs text-muted-foreground/80">
            {monthLabels.map(label => (
              <div key={label}>{label}</div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="grid w-10 grid-rows-7 gap-1 pt-1 text-xs text-muted-foreground/80">
            {weekDayLabels.map(day => (
              <div key={day} className="flex h-3.5 items-center justify-end">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-1.5">
            {weeks.map((week, weekIndex) => (
              <div key={`week_${weekIndex}`} className="grid grid-rows-7 gap-1.5">
                {week.map((day, dayIndex) => {
                  if (!day)
                    return <div key={`empty_${weekIndex}_${dayIndex}`} className="h-3.5 w-3.5" />;

                  const summary =
                    summaryMap.get(day.unix()) ??
                    ({ id: String(day.unix()), readingSeconds: 0 } as const);
                  const level = getReadingLevel(summary.readingSeconds, maxSeconds);

                  return (
                    <GridCell
                      key={summary.id}
                      summary={summary}
                      level={level}
                      lastSyncTime={lastSyncTime}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">阅读强度</span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4, 5].map(level => {
                const Icon = getReadingIcon(level);
                return (
                  <Tooltip key={level}>
                    <TooltipTrigger asChild>
                      <div className={clsx(getGridCellClasses(level), "h-3.5 w-3.5 rounded-sm")} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="flex items-center text-sm">
                        <Icon className="mr-2 h-4 w-4" />
                        {getReadingText(level)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
          <span className="font-geek text-xs uppercase tracking-wide text-muted-foreground/80">
            {year} Reading Pulse
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
}

const GridCell = ({
  summary,
  lastSyncTime,
  level,
}: {
  summary: ReadingSummaryType;
  lastSyncTime: number;
  level: number;
}) => {
  const isFuture = lastSyncTime > 0 && Number(summary.id) > lastSyncTime;
  const baseClass = clsx(getGridCellClasses(level), "h-3.5 w-3.5 rounded-sm");

  if (isFuture) {
    return <div className={clsx(baseClass, "opacity-35")} />;
  }

  const Icon = getReadingIcon(level);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={baseClass} />
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <p className="font-medium">
            {fullDateFormatter.format(new Date(Number(summary.id) * 1000))}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{(summary.readingSeconds / 60).toFixed(0)} 分钟</span>
          </p>
          <p className="flex items-center text-sm">
            <Icon className="mr-2 h-4 w-4" />
            {getReadingText(level)}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
