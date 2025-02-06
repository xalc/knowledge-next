import BlogItem from "@/components/blogs/blog-item";
import { getPosts } from "@/lib/blogs/blogs";

export default async function BlogsPage() {
  const posts = await getPosts();
  return (
    <div className="container mx-auto flex max-w-[1024px] flex-col items-center gap-8">
      <h1 className="mt-8 text-3xl">Blogs</h1>
      <section className="container mx-auto p-4">
        <div className="space-y-12">
          <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3 [&>*]:break-inside-avoid-column">
            {posts.map(post => (
              <BlogItem
                key={post.slug}
                blog={post}
                className="duration-1000 animate-in fade-in slide-in-from-bottom-6"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
