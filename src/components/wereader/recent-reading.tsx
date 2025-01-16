import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";

import { getRecentBooks } from "@/lib/wereader/wr-db";

import { Button } from "../ui/button";
import Link from "next/link";
import BookItem from "./book-list-item";

export default async function RecentReadingBooks() {
  const bookShelf = await getRecentBooks();
  return (
    <div className="container mx-auto mt-12 lg:max-w-[1024px]">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>最近在读的书</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/reading">查看更多</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {bookShelf.map(book => (
              <BookItem key={book.id} book={book} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
