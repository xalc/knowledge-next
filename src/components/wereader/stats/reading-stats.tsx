import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookMarked, CalendarRange, Flame, Hourglass } from "lucide-react";
import { ReadingSummaryType } from "@/types/reading-summary";
import { getCurrentDayofYear } from "./utils";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default function ReadingStats({
  summarys,
  year,
}: {
  summarys: ReadingSummaryType[];
  year: number;
}) {
  const totalSeconds = summarys.reduce((acc, current) => acc + current.readingSeconds, 0);
  const averageSeconds =
    totalSeconds > 0 ? Math.round(totalSeconds / getCurrentDayofYear(year)) : 0;
  const daysRead = summarys.filter(summary => summary.readingSeconds > 0).length;
  const maxSeconds = summarys.reduce(
    (acc, current) => ({
      max: Math.max(acc.max, current.readingSeconds),
      timeStamp: acc.max > current.readingSeconds ? acc.timeStamp : current.id,
    }),
    {
      max: 0,
      timeStamp: "",
    },
  );

  const stats = [
    {
      label: "年度总阅读时长",
      value: `${Math.round(totalSeconds / 60 / 60)}小时`,
      subtitle: `约 ${(totalSeconds / 3600).toFixed(1)}h`,
      icon: BookMarked,
      className: "border-sky-500/25 bg-sky-500/[0.07]",
    },
    {
      label: "平均每日阅读",
      value: `${Math.round(averageSeconds / 60)}分钟`,
      subtitle: "按自然日计算",
      icon: CalendarRange,
      className: "border-emerald-500/25 bg-emerald-500/[0.07]",
    },
    {
      label: "最长阅读时间",
      value: `${Math.round(maxSeconds.max / 60)}分钟`,
      subtitle: maxSeconds.timeStamp
        ? dateFormatter.format(new Date(Number(maxSeconds.timeStamp) * 1000))
        : "暂无记录",
      icon: Flame,
      className: "border-amber-500/25 bg-amber-500/[0.07]",
      highlightDate: !!maxSeconds.timeStamp,
    },
    {
      label: "累计阅读天数",
      value: `${daysRead}天`,
      subtitle: `${((daysRead / getCurrentDayofYear(year)) * 100).toFixed(1)}% 活跃率`,
      icon: Hourglass,
      className: "border-indigo-500/25 bg-indigo-500/[0.07]",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className={`rounded-2xl border border-border/70 p-5 shadow-sm ${stat.className}`}
          >
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="font-geek text-3xl font-semibold tracking-tight [font-variant-numeric:tabular-nums]">
                    {stat.value}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 p-2.5">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {stat.highlightDate ? (
                <Badge
                  variant="secondary"
                  className="font-geek h-7 w-fit rounded-full border border-border/60 px-3 text-xs font-medium [font-variant-numeric:tabular-nums]"
                >
                  {stat.subtitle}
                </Badge>
              ) : (
                <p className="font-geek text-xs uppercase tracking-wide text-muted-foreground/90">
                  {stat.subtitle}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
