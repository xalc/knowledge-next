import { Button } from "@/components/ui/button";

import Link from "next/link";
import { BarChart2 } from "lucide-react";
import { getAllBooks } from "@/lib/wereader/wr-db";
import BooksView from "@/components/wereader/books-view";
import { getLocale, getMessages } from "@/lib/i18n";

export default async function ReadingPage() {
  const [allBooks, locale] = await Promise.all([getAllBooks(), getLocale()]);
  const messages = getMessages(locale);

  return (
    <div className="mx-8 mt-8 flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{messages.bookshelf.title}</h1>
          <p className="text-muted-foreground">{messages.bookshelf.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/reading/stats" className="gap-2">
              <BarChart2 className="h-4 w-4" />
              {messages.bookshelf.stats}
            </Link>
          </Button>
        </div>
      </div>

      <BooksView books={allBooks} />
    </div>
  );
}
