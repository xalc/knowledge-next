import moment from "moment";
import clsx from "clsx";
import { Clock } from "lucide-react";
import { ReadingSummaryType } from "@/types/reading-summary";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getWeeksOfYear, getPrimaryBGcolorClassName } from "../utils";
export default function Heatmap({
  summarys,
  year,
  lastSyncTime,
}: {
  summarys: ReadingSummaryType[];
  year: number;
  lastSyncTime: number;
}) {
  const maxMinutes = summarys.reduce((acc, ac) => Math.max(acc, ac.readingSeconds), 0);
  const weeks = getWeeksOfYear(year);

  return (
    <div className="mt-16">
      <div className="ml-14 grid grid-cols-[repeat(12,1fr)]">
        {moment.months().map((month, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground">
            {month}
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <div className="grid w-10 grid-rows-7 gap-2 pt-2 text-xs text-muted-foreground">
          {moment.weekdays().map(day => (
            <div key={day} className="flex h-[10px] items-center justify-end">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(53,1fr)] gap-1 pt-2">
          {weeks.map((week, weekIndex) => {
            return (
              <div key={weekIndex} className="grid grid-rows-7 gap-1">
                {week.map((day, dayIndex) => {
                  if (!day) return <div key={`empty-${dayIndex}`} />;
                  let summary = summarys.find(s => Number(s.id) === moment(day).unix());
                  if (!summary) {
                    summary = { id: String(day.unix()), readingSeconds: 0 };
                  }
                  const classes = clsx(
                    getPrimaryBGcolorClassName(summary.readingSeconds, maxMinutes),
                    "h-3 w-3",
                    "transition-all duration-200",
                    "hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:ring-offset-background",
                    "border border-border/50",
                  );
                  return (
                    <GridCell
                      key={summary.id}
                      summary={summary}
                      classes={classes}
                      lastSyncTime={lastSyncTime}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">阅读程度：</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4, 5].map(level => (
            <TooltipProvider key={level}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={clsx("h-3 w-3", getPrimaryBGcolorClassName(level, 5))} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {["未阅读", "短时阅读", "适度阅读", "良好阅读", "深度阅读", "专注阅读"][level]}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
const GridCell = ({ summary, classes, lastSyncTime }) => {
  if (lastSyncTime < summary.id) return <div key={summary.id} className={classes}></div>;
  return (
    <TooltipProvider key={summary.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div key={summary.id} className={classes}></div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{moment.unix(summary.id).format("YYYY年MM月DD日 dddd")}</p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{(summary.readingSeconds / 60).toFixed(2)} 分钟</span>
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
