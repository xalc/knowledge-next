import moment from "moment";
import { Badge } from "../ui/badge";
import { Progress } from "@/components/ui/progress";
import { ReadingProgressType } from "@/types/bookshelf";

export default function BookItem({ book }) {
  return (
    <div key={book.title} className="group flex aspect-auto gap-6">
      <img
        src={book.cover}
        alt={book.title}
        className="max-w-24 rounded-sm object-contain transition-transform duration-300 group-hover:scale-110"
      />
      <div className="flex-1">
        <div className="space-y-2">
          <h4 className="font-semibold leading-none">{book.title}</h4>
          <p className="text-sm text-muted-foreground">{book.author}</p>
          <p className="text-xs text-muted-foreground">
            最近阅读：{moment(book.readUpdateTime * 1000).format("YYYY/MM/DD")}
          </p>
          <p className="text-sm">{book.category}</p>
        </div>
        {book.finishReading ? (
          <Badge>已经读完</Badge>
        ) : (
          <div className="flex items-center gap-4 space-y-1">
            <Progress
              className={"h-3"}
              value={(book.readProgress as unknown as ReadingProgressType).progress}
            />
            <p className="text-right text-xs text-muted-foreground">
              {(book.readProgress as unknown as ReadingProgressType).progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
