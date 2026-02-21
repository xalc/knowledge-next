import ReadingSummary from "@/components/wereader/stats/reading-summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocale, getMessages } from "@/lib/i18n";

export default async function ReadingSummarys() {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return (
    <div className="mx-8 mt-8 flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{messages.readingStats.title}</h1>
          <p className="text-muted-foreground">{messages.readingStats.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/reading" className="gap-2">
              <BookOpen className="h-4 w-4" />
              {messages.readingStats.backToShelf}
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{messages.readingStats.yearlyDuration}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReadingSummary />
        </CardContent>
      </Card>
    </div>
  );
}
