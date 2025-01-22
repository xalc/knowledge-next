import { ReadingSummaryType } from "@/types/reading-summary";
import { groupDataByMonth } from "../utils";
import moment from "moment";
import { Clock } from "lucide-react";
import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPrimaryBGcolorClassName } from "../utils";
export default function MonthHeatmap({
  summarys,
  year,
}: {
  summarys: ReadingSummaryType[];
  year: number;
}) {
  const months = groupDataByMonth(year);
  const maxMinutes = summarys.reduce((acc, ac) => Math.max(acc, ac.readingSeconds), 0);
  return (
    <>
      {months.map((month, index) => {
        return (
          <Card key={`month_${index}`}>
            <CardHeader>
              <h3 className="font-medium">{moment(month[10]).format("YYYY年MM月")}</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[repeat(7,1fr)] gap-2 pt-2 text-xs text-muted-foreground">
                {moment.weekdays().map(day => (
                  <div key={day} className="flex h-12 items-center justify-end">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-[repeat(7,1fr)] gap-1">
                {month.map((day, dayIndex) => {
                  if (day === null) return <div key={`empty-${dayIndex}`} />;
                  let summary = summarys.find(s => Number(s.id) === moment(day).unix());
                  if (!summary) {
                    summary = { id: String(moment(day).unix()), readingSeconds: 0 };
                  }
                  return (
                    <TooltipProvider key={day}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={clsx(
                              "aspect-square rounded-sm transition-all duration-200",
                              "hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:ring-offset-background",
                              "border border-border/50",
                              getPrimaryBGcolorClassName(summary.readingSeconds, maxMinutes),
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {moment(day).format("YYYY年MM月DD日 dddd")}
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{(summary.readingSeconds / 60).toFixed(0)} 分钟</span>
                            </p>
                            <p className="text-sm text-muted-foreground"></p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
