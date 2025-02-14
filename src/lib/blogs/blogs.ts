import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { cache } from "react";
const getPosts = cache(async () => {
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
  } finally {
    await prisma.$disconnect();
  }
});
const getRecentPosts = cache(async () => {
  try {
    const allPosts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
    });
    console.log("get posts from db without cache");
    return allPosts;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
});

const getPost = cache(async (slug: string) => {
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
});

const getAllTags = cache(async () => {
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
  } finally {
    await prisma.$disconnect();
  }
});
export const revalidate = 60;
export { getPosts, getPost, getRecentPosts, getAllTags };
