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

export default async function NotesPage() {
  const posts = await getPosts();
  return (
    <div className="flex flex-col items-center gap-8 mx-6">
      <h1>Blogs</h1>
      <section className="container px-4 py-4">
        <div className="space-y-12">
          {/* <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">精选文章</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              发现最新的技术趋势、深度教程和实用经验分享
            </p>
          </div> */}
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
