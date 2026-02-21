import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";

import { getRecentBooks } from "@/lib/wereader/wr-db";

import { MotionButton } from "../ui/motion-button";
import { BookOpen } from "lucide-react";
import BookItem from "./book-list-item";
import { getLocale, getMessages } from "@/lib/i18n";

export default async function RecentReadingBooks() {
  const [bookShelf, locale] = await Promise.all([getRecentBooks(), getLocale()]);
  const messages = getMessages(locale);
  return (
    <div className="container mx-auto mt-12 lg:max-w-[1024px]">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{messages.recentReading.title}</CardTitle>
            <MotionButton href="/reading" icon={<BookOpen className="mr-2 h-4 w-4" />}>
              {messages.recentReading.viewMore}
            </MotionButton>
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
