import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";
import { Progress } from "@/components/ui/progress";
import { getBookShelf } from "@/lib/wereader/wr-db";
import { ReadingProgressType } from "@/types/bookshelf";
import { Button } from "../ui/button";
import moment from "moment";
export default async function RecentReadingBooks() {
  const bookShelf = await getBookShelf();
  return (
    <div className="container mx-auto mt-12 lg:max-w-[1024px]">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>最近在读的书</CardTitle>
            <Button variant="outline" disabled>
              查看更多
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {bookShelf.map(book => (
              <div key={book.title} className="group flex aspect-auto gap-6">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="rounded-sm object-contain transition-transform duration-300 group-hover:scale-110"
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
                  <div className="flex items-center gap-4 space-y-1">
                    <Progress
                      className={"h-4"}
                      value={(book.readProgress as unknown as ReadingProgressType).progress}
                    />
                    <p className="text-right text-xs text-muted-foreground">
                      {(book.readProgress as unknown as ReadingProgressType).progress}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
