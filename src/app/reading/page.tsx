
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { BarChart2, Grid, List } from 'lucide-react'
export default function ReadingPage() {
  return (
    <div className="mx-8 py-10 space-y-8">
      {/* 页面标题和操作区 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">我的书架</h1>
          <p className="text-muted-foreground">
            记录读过的每一本书
          </p>
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

      {/* 书籍列表 */}
      {/* <BookList /> */}
    </div>
  )
}