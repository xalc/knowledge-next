import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, Wrench } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const START_ITEMS = [
  {
    title: "从博客开始",
    description: "最新的技术文章与思考",
    href: "/blogs",
    icon: FileText,
    accent: "text-emerald-500",
    bg: "from-emerald-500/10 via-transparent to-transparent",
  },
  {
    title: "知识笔记",
    description: "持续整理的主题笔记",
    href: "/docs",
    icon: BookOpen,
    accent: "text-sky-500",
    bg: "from-sky-500/10 via-transparent to-transparent",
  },
  {
    title: "工具与实验",
    description: "小工具与玩法合集",
    href: "/utils",
    icon: Wrench,
    accent: "text-amber-500",
    bg: "from-amber-500/10 via-transparent to-transparent",
  },
];

export default function StartHere() {
  return (
    <section className="container mx-auto mt-12 lg:max-w-[1024px]">
      <div className="mx-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="font-geek text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Start Here
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">从这里开始</h2>
            <p className="max-w-[520px] text-sm text-muted-foreground">
              三个入口，快速了解我在写什么、做什么、在研究什么。
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {START_ITEMS.map(item => (
            <Link key={item.title} href={item.href} className="group">
              <Card className="relative h-full overflow-hidden border-border/60 bg-background/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    item.bg,
                  )}
                />
                <CardContent className="relative flex h-full flex-col gap-4 p-6">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-background",
                      item.accent,
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-sm text-primary">
                    <span>进入</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
