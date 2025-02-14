import { getPosts, getAllTags } from "@/lib/blogs/blogs";
import { Suspense } from "react";
import ClientTagFilter from "@/components/blogs/client-tag-filter";

export default async function BlogsPage() {
  const [posts, tags] = await Promise.all([getPosts(), getAllTags()]);

  return (
    <div className="container mx-auto flex max-w-[1024px] flex-col items-center gap-8">
      <h1 className="mt-8 text-3xl">Blogs</h1>

      <Suspense fallback={<div>Loading tags...</div>}>
        <ClientTagFilter initialPosts={posts} tags={tags} />
      </Suspense>
    </div>
  );
}
