"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Grid, List } from "lucide-react";
import BookItem from "./book-item";
import { useState } from "react";
import BookGrid from "./book-grid";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function BooksView({ books }) {
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const filteredBooks = books
    .filter(book => {
      if (filter === "all") return true;
      if (filter === "reading") return book.finishReading === 0;
      if (filter === "finished") return book.finishReading === 1;
      return true;
    })
    .sort((a, b) => {
      if (sort === "recent") {
        return b.readUpdateTime - a.readUpdateTime;
      }
      return b.readProgress?.progress - a.readProgress?.progress;
    });
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>状态</SelectLabel>
              <SelectItem value="all">全部书籍</SelectItem>
              <SelectItem value="reading">在读</SelectItem>
              <SelectItem value="finished">已读完</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">最近阅读</SelectItem>
            <SelectItem value="progress">阅读进度</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Tabs value={view} onValueChange={v => setView(v as "grid" | "list")}>
          <TabsList className="mb-4">
            <TabsTrigger value="grid" className="gap-2">
              <Grid className="h-4 w-4" />
              卡片视图
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              列表视图
            </TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="mt-0">
            <Card className="space-y-6">
              <ScrollArea className="h-[800px]">
                <CardContent>
                  <div className="mt-6 grid gap-6 duration-1000 animate-in fade-in slide-in-from-bottom-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredBooks.map(book => {
                      return <BookGrid book={book} key={book.id} />;
                    })}
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </TabsContent>
          <TabsContent value="list" className="mt-0">
            <Card className="space-y-6">
              <ScrollArea className="h-[800px]">
                <CardContent>
                  <div className="mt-6 space-y-4 duration-1000 animate-in fade-in slide-in-from-bottom-4">
                    {filteredBooks.map(book => {
                      return <BookItem book={book} key={book.id} />;
                    })}
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
