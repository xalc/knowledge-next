import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";
import { Progress } from "@/components/ui/progress";
import { getBookShelf } from "@/lib/wereader/wr-db";
import { ReadingProgressType } from "@/types/bookshelf";
import moment from "moment";
export default async function RecentReadingBooks() {
  const bookShelf = await getBookShelf();
  return (
    <>
      <Card className="container mx-auto mt-12 lg:max-w-[1024px]">
        <CardHeader>
          <CardTitle>最近在读</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookShelf.map(book => (
              <div key={book.title} className="flex gap-4">
                <img
                  src={book.cover}
                  alt={book.title}
                  width={60}
                  height={90}
                  className="rounded-sm"
                />
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-semibold leading-none">{book.title}</h4>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <p className="text-xs text-muted-foreground">
                      最近阅读：{moment(book.readUpdateTime * 1000).format("YYYY/MM/DD")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Progress
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
    </>
  );
}
