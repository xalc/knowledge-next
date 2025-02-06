import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";

import { getRecentPosts } from "@/lib/blogs/blogs";
import BlogItem from "./blog-item";
import { Button } from "../ui/button";
import Link from "next/link";

export default async function RecentPosts() {
  const posts = await getRecentPosts();
  return (
    <div className="container mx-auto mt-12 lg:max-w-[1024px]">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>最新的博客</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/blogs">查看更多</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="columns-1 gap-6 space-y-6 md:columns-2 [&>*]:break-inside-avoid-column">
            {posts.map(post => (
              <BlogItem
                key={post.slug}
                blog={post}
                className="duration-1000 animate-in fade-in slide-in-from-bottom-6"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
