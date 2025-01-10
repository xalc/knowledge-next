import { BookOpen, Code, Coffee, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
const SECTIONS = [
  {
    icon: BookOpen,
    title: "技术笔记",
    description: "记录学习和使用各种技术时遇到的问题和解决方案，帮助更好地理解和记忆这些技术。",
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    icon: Code,
    title: "技术文章",
    description: "分享对各种技术和工具的见解和经验，涵盖从编程语言到软件开发方法论的各个方面。",
    color: "text-green-500 dark:text-green-400",
  },
  {
    icon: Coffee,
    title: "个人生活",
    description: "分享个人经历和感悟，涵盖从旅行到读书、从电影到音乐的各个方面。",
    color: "text-amber-500 dark:text-amber-400",
  },
  {
    icon: Wrench,
    title: "有趣功能",
    description: "分享开发的小工具和脚本，帮助提高工作效率或让生活更加有趣。",
    color: "text-purple-500 dark:text-purple-400",
  },
];

export default function ContentCard() {
  return (
    <div className="container mx-auto mt-20 lg:max-w-[1024px]">
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
