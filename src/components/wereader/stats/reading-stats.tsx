import { Card } from "@/components/ui/card";

import { ReadingSummaryType } from "@/types/reading-summary";
import { getCurrentDayofYear } from "./utils";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function ReadingStats({
  summarys,
  year,
}: {
  summarys: ReadingSummaryType[];
  year: number;
}) {
  const totalSeconds = summarys.reduce((acc, cv): number => acc + cv.readingSeconds, 0);
  const averageSeconds = Math.round(totalSeconds / getCurrentDayofYear(year));
  const daysRead = summarys.filter(s => s.readingSeconds > 0).length;
  const maxSeconds = summarys.reduce(
    (acc, cv) => ({
      max: Math.max(acc.max, cv.readingSeconds),
      timeStamp: acc.max > cv.readingSeconds ? acc.timeStamp : cv.id,
    }),
    {
      max: 0,
      timeStamp: 0,
    },
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        {
          label: "年度总阅读时长",
          value: `${Math.round(totalSeconds / 60 / 60)}小时`,
        },
        {
          label: "平均每日阅读",
          value: `${(averageSeconds / 60).toFixed(0)}分钟`,
        },
        {
          label: "最长阅读时间",
          value: `${(maxSeconds.max / 60).toFixed(0)}分钟`,
          date: `${formatDate(Number(maxSeconds.timeStamp))}`,
        },
        {
          label: "累计阅读天数",
          value: `${daysRead}天`,
        },
      ].map(stat => (
        <Card key={stat.label} className="p-4">
          <div className="flex flex-col items-center">
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.date && (
              <Badge variant="secondary" className="h-6">
                {stat.date}
              </Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
