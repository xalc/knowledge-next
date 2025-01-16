import { Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function BookGridItem({ book }) {
  const useBigImage = url => {
    if (!url) return null;
    const arr = url.split("/");
    const len = arr.length;
    arr[len - 1] = arr[len - 1].replace("s_", "t6_");
    return arr.join("/");
  };

  const formatReadingTime = (seconds: number) => {
    if (seconds / 60 / 60 > 1) {
      const extraMinute = seconds % 3600;
      return Math.floor(seconds / 3600) + "小时" + Math.floor(extraMinute / 60) + "分钟";
    }
    if (seconds / 60 >= 1) {
      return Math.floor(seconds / 60) + "分钟";
    }
    if (seconds / 60 < 1) {
      return "1分钟";
    }
  };
  const { readProgress } = book;
  return (
    <Card
      key={book.id}
      className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] w-full">
        <img
          src={useBigImage(book.cover)}
          alt={book.title}
          className="w-full rounded-sm object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold leading-none">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          {readProgress && (
            <>
              {book.finishReading === 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">阅读进度</span>
                    <span>{readProgress?.progress}%</span>
                  </div>
                  <Progress value={readProgress?.progress} />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{book.category}</Badge>
                {book.finishReading === 1 ? (
                  <Badge>已读完</Badge>
                ) : (
                  <Badge variant="secondary">在读</Badge>
                )}
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>上次阅读： {formatDate(readProgress.updateTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>已读时长： {formatReadingTime(readProgress?.readingTime)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
