import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getPosts = unstable_cache(
  async () => {
    try {
      const allPosts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log("get posts from db without cache");
      return allPosts;
    } catch (e) {
      console.error(e);
    }
  },
  ["posts"],
  { revalidate: 60, tags: ["posts"] },
);

const getRecentPosts = unstable_cache(
  async () => {
    try {
      const allPosts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
      });
      console.log("get posts from db without cache");
      return allPosts;
    } catch (e) {
      console.error(e);
    }
  },
  ["recent-posts"],
  { revalidate: 60, tags: ["posts"] },
);

const getPost = unstable_cache(
  async (slug: string) => {
    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
      include: {
        postcontent: true,
      },
    });
    console.log("get post from db without cache");
    return post;
  },
  ["post-by-slug"],
  { revalidate: 60, tags: ["posts"] },
);

const getAllTags = unstable_cache(
  async () => {
    try {
      const posts = await prisma.post.findMany({
        select: {
          metadata: true,
        },
      });

      // 统计标签出现次数
      const tagCount = new Map<string, number>();
      posts.forEach(post => {
        const tags = post.metadata?.tags || [];
        tags.forEach(tag => {
          tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
        });
      });

      // 转换为所需格式并按数量排序
      const tags = Array.from(tagCount.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

      return tags;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  ["post-tags"],
  { revalidate: 300, tags: ["posts"] },
);
export const revalidate = 60;
export { getPosts, getPost, getRecentPosts, getAllTags };
