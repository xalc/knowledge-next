import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { cache } from 'react'
const getPosts = cache(async () => {
  try {
    const allPosts = await prisma.post.findMany({});
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

export { getPosts, getPost };
