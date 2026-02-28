import prisma from "@/lib/prisma";
import { cache } from "react";

const getPosts = cache(async () => {
  try {
    const allPosts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return allPosts;
  } catch (e) {
    console.error("Failed to fetch posts:", e);
    return [];
  }
});

const getRecentPosts = cache(async () => {
  try {
    const allPosts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    });
    return allPosts;
  } catch (e) {
    console.error("Failed to fetch recent posts:", e);
    return [];
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
  return post;
});

const getAllTags = cache(async () => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        metadata: true,
      },
    });

    const tagCount = new Map<string, number>();
    posts.forEach(post => {
      const tags = post.metadata?.tags || [];
      tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });

    const tags = Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    return tags;
  } catch (e) {
    console.error("Failed to fetch tags:", e);
    return [];
  }
});

export const revalidate = 60;
export { getPosts, getPost, getRecentPosts, getAllTags };
