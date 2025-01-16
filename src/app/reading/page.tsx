import { Button } from "@/components/ui/button";

import Link from "next/link";
import { BarChart2 } from "lucide-react";
import { getAllBooks } from "@/lib/wereader/wr-db";
import BooksView from "@/components/wereader/books-view";
export default async function ReadingPage() {
  const allBooks = await getAllBooks();

  return (
    <div className="mx-8 space-y-8 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">我的书架</h1>
          <p className="text-muted-foreground">记录读过的每一本书</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/reading/stats" className="gap-2">
              <BarChart2 className="h-4 w-4" />
              阅读统计
            </Link>
          </Button>
        </div>
      </div>

      <BooksView books={allBooks} />
    </div>
  );
}
