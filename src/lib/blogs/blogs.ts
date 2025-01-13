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

const getPost = async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
    },
    include: {
      postcontent: true,
    },
  });
  return post;
};

export { getPosts, getPost };
