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
    <div className="flex flex-col items-center gap-8">
      <h1>Blogs</h1>
      {posts.map(post => (
        <BlogItem key={post.slug} blog={post} />
      ))}
    </div>
  );
}
