"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Grid, List } from "lucide-react";
import BookListItem from "./book-list-item";
import { useState } from "react";
import BookGridItem from "./book-grid-item";
import BooksSelector from "./books-view-selector";

export default function BooksView({ books }) {
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
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
      } else if (sort === "progress") {
        return b.readProgress?.progress - a.readProgress?.progress;
      }
      return true;
    });

  return (
    <div className="space-y-6">
      <BooksSelector filter={filter} sort={sort} setFilter={setFilter} setSort={setSort} />
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
              <CardContent>
                <div className="mt-6 grid gap-6 duration-1000 animate-in fade-in slide-in-from-bottom-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredBooks.map(book => {
                    return <BookGridItem book={book} key={book.id} />;
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="list" className="mt-0">
            <Card className="space-y-6">
              <CardContent>
                <div className="mt-6 space-y-4 duration-1000 animate-in fade-in slide-in-from-bottom-4">
                  {filteredBooks.map(book => {
                    return <BookListItem book={book} key={book.id} />;
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
