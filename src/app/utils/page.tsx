import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  CalendarIcon,
  Home,
  LayoutGrid,
  Medal,
  FileText,
  User,
  ArrowRight,
  Lock,
  Palette,
} from "lucide-react";

const NAVIGATION_ITEMS = [
  {
    title: "首页",
    description: "博客首页，Hero srcreen",
    icon: Home,
    href: "/",
    color: "text-blue-500 dark:text-blue-400",
    pattern: "radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)",
  },
  {
    title: "博客",
    description: "技术博客文章列表，包含详细的技术分享和教程",
    icon: FileText,
    href: "/blogs",
    color: "text-green-500 dark:text-green-400",
    pattern: "radial-gradient(circle at 100% 100%, rgba(34, 197, 94, 0.08) 0%, transparent 50%)",
  },
  {
    title: "节假日日历",
    description: "2025年节假日安排，包含调休和高速免费等信息",
    icon: CalendarIcon,
    href: "/utils/calendar",
    color: "text-purple-500 dark:text-purple-400",
    pattern: "radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)",
  },
  {
    title: "阅读统计",
    description: "阅读进度追踪、阅读时长统计和读书笔记",
    icon: BookOpen,
    href: "/reading",
    color: "text-amber-500 dark:text-amber-400",
    pattern: "radial-gradient(circle at 100% 100%, rgba(251, 191, 36, 0.08) 0%, transparent 50%)",
  },
  {
    title: "技能认证",
    description: "展示获得的专业技能认证和成就徽章",
    icon: Medal,
    href: "/badges",
    color: "text-red-500 dark:text-red-400",
    pattern: "radial-gradient(circle at 100% 100%, rgba(239, 68, 68, 0.08) 0%, transparent 50%)",
  },
  {
    title: "AdminDashBoard",
    description: "后台数据(private)",
    icon: Lock,
    href: "/dashboard",
    color: "text-red-500 dark:text-red-400",
    pattern: "radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.08) 0%, transparent 50%)",
  },
  {
    title: "主题调试",
    description: "选择不同的主题，看看显示效果",
    icon: Palette,
    href: "/utils/theme",
    color: "text-red-500 dark:text-red-400",
    pattern: "radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.08) 0%, transparent 50%)",
  },
  {
    title: "关于",
    description: "个人介绍、联系方式和社交媒体链接",
    icon: User,
    href: "/about",
    color: "text-teal-500 dark:text-teal-400",
    pattern: "radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.08) 0%, transparent 50%)",
  },
];

export default function NavigationPage() {
  return (
    <div className="container mx-auto py-10 lg:max-w-[1024px]">
      <div className="mx-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6" />
            <h1 className="text-3xl font-bold tracking-tight">站点导航</h1>
          </div>
          <p className="text-muted-foreground">快速访问网站的所有主要页面和功能</p>
        </div>

        {/* Navigation Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {NAVIGATION_ITEMS.map(item => (
            <Link key={item.href} href={item.href}>
              <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div
                      className={`rounded-lg bg-background/50 p-2 ring-1 ring-background/10 backdrop-blur ${item.color}`}
                      style={{ backgroundImage: item.pattern }}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>快速链接</CardTitle>
            <CardDescription>常用页面的直接访问链接</CardDescription>
          </CardHeader>
          <CardContent>
            <nav className="flex flex-wrap gap-4">
              <a
                className="text-primary underline"
                href="https://note.huntx.cn"
                target="_blank"
                rel="noopener noreferrer"
              >
                站点历史版本
              </a>
            </nav>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
