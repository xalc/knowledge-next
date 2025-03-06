import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "../ui/card";
import { getRecentPosts } from "@/lib/blogs/blogs";
import BlogItem from "./blog-item";
import { MotionButton } from "../ui/motion-button";
import { Rss } from "lucide-react";

export default async function RecentPosts() {
  const posts = await getRecentPosts();
  return (
    <div className="container mx-auto mt-12 lg:max-w-[1024px]">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">最新思考</CardTitle>
              <CardDescription>分享技术见解，探讨开发心得</CardDescription>
            </div>

            <MotionButton href="/blogs" icon={<Rss className="h-5 w-5" />}>
              查看全部文章
            </MotionButton>
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
