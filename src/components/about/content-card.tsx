import { BookOpen, Code, Coffee, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
const SECTIONS = [
  {
    icon: Code,
    title: "技术文章",
    description: "分享对技术和工具的使用踩坑记录，也包括一些DIY过程",
    color: "text-green-500 dark:text-green-400",
  },
  {
    icon: BookOpen,
    title: "笔记归档",
    description: "持续同比个人Notion笔记中的内容，归档和备忘，为个人私有大模型提供训练数据",
    color: "text-blue-500 dark:text-blue-400",
  },

  {
    icon: Coffee,
    title: "思维实验",
    description: "分享个人的想法和灵感，涵盖从旅行到读书，个人三观的方方面面。",
    color: "text-amber-500 dark:text-amber-400",
  },
  {
    icon: Wrench,
    title: "更多尝试",
    description:
      "分享开发的小工具和脚本，帮助提高工作效率或让生活更加有趣。探索个人既服务的模式（PAAS）",
    color: "text-purple-500 dark:text-purple-400",
  },
];

export default function ContentCard() {
  return (
    <div id="content-card" className="container mx-auto mt-20 lg:max-w-[1024px]">
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
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </Card>
        ))}
      </div>
    </div>
  );
}
