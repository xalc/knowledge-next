import { BookOpen, Code, Coffee, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getLocale, getMessages } from "@/lib/i18n";

export default async function ContentCard() {
  const locale = await getLocale();
  const messages = getMessages(locale);

  const SECTIONS = [
    {
      icon: Code,
      title: messages.sections.techArticles,
      description: messages.sections.techArticlesDesc,
      color: "text-green-500 dark:text-green-400",
      href: "/blogs",
    },
    {
      icon: BookOpen,
      title: messages.sections.noteArchive,
      description: messages.sections.noteArchiveDesc,
      color: "text-blue-500 dark:text-blue-400",
      href: "/docs",
    },

    {
      icon: Coffee,
      title: messages.sections.thoughtExperiments,
      description: messages.sections.thoughtExperimentsDesc,
      color: "text-amber-500 dark:text-amber-400",
      href: "/reading",
    },
    {
      icon: Wrench,
      title: messages.sections.moreExplorations,
      description: messages.sections.moreExplorationsDesc,
      color: "text-purple-500 dark:text-purple-400",
      href: "/utils",
    },
  ];

  return (
    <div id="contentCard" className="container mx-auto lg:max-w-[1024px]">
      <div className="mx-6 grid gap-6 sm:grid-cols-2">
        {SECTIONS.map(section => (
          <Card key={section.title} className="group relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "rounded-lg bg-background/50 p-2 ring-1 ring-background/10 backdrop-blur",
                    section.color,
                  )}
                >
                  <section.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold leading-none tracking-tight">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </CardContent>

            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <Link href={section.href} className="absolute inset-0"></Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
