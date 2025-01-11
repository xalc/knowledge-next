import BlogItem from "@/components/blogs/BlogItem";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const getPosts = async () => {
  try {
    const allPosts = await prisma.post.findMany({});
    return allPosts;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

export default async function BlogsPage() {
  const posts = await getPosts();
  return (
    <div className="container mx-auto max-w-[1024px] flex flex-col items-center gap-8">
      <h1 className='text-3xl mt-8'>Blogs</h1>
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
