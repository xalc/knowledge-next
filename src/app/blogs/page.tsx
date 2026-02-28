import { Metadata } from "next";

export const metadata: Metadata = {
  title: "技术博客",
  description: "分享前端开发、AI 应用和技术工具的实战经验",
};

import { getPosts, getAllTags } from "@/lib/blogs/blogs";
import ClientTagFilter from "@/components/blogs/client-tag-filter";

export default async function BlogsPage() {
  const [posts, tags] = await Promise.all([getPosts(), getAllTags()]);

  return (
    <div className="container mx-auto flex max-w-[1024px] flex-col items-center gap-8">
      <h1 className="mt-8 text-3xl font-bold tracking-tight">技术博客</h1>

      <ClientTagFilter initialPosts={posts} tags={tags} />
    </div>
  );
}
