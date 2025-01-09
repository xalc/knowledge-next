import Badge from "@/components/badge/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card, CardContent } from "@/components/ui/card";
import RecentReadingBooks from "@/components/wereader/recent-reading";
import { BookOpen, Code, Coffee, Wrench } from "lucide-react";

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

export default function AboutPage() {
  return (
    <div className="item-center flex min-h-screen w-full flex-col">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='currentColor' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-8 pt-8 text-center">
            <Avatar className="h-32 w-32 duration-700 animate-in zoom-in">
              <AvatarImage src="/placeholder.svg" alt="Blog Author" />
              <AvatarFallback>HunterX</AvatarFallback>
            </Avatar>
            <div className="space-y-2 delay-200 duration-700 animate-in slide-in-from-bottom-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">欢迎来到我的博客</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                在这里，我将分享我的技术笔记、技术文章、个人生活文章以及一些有趣的小功能。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
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

        {/* Contact Section */}
        {/* <Card className="mt-12">
          <CardHeader>
            <CardTitle>联系我</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Button asChild variant="outline" className="h-auto space-y-2 p-4 text-left">
                <Link href="mailto:[email protected]">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="font-semibold">电子邮件</span>
                  </div>
                  <span className="block text-sm text-muted-foreground">[email protected]</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto space-y-2 p-4 text-left">
                <Link href="https://github.com/your_github_username" target="_blank">
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <span className="font-semibold">GitHub</span>
                  </div>
                  <span className="block text-sm text-muted-foreground">your_github_username</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
      <RecentReadingBooks />
      <Badge />
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
