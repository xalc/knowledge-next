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
    <div className="container mx-auto flex flex-col items-center gap-8 lg:max-w-[1024px]">
      <h1>Blogs</h1>
      <section className="container px-4 py-4">
        <div className="space-y-12">
          <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3 [&>*]:break-inside-avoid-column">
            {posts.map(post => (
              <BlogItem key={post.slug} blog={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
