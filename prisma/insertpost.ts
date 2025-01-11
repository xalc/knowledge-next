import { PrismaClient } from "@prisma/client";
import { initialContent } from "./initcontent";
const prisma = new PrismaClient();

async function main() {
  const content = await prisma.postContent.create({
    data: {
      content: initialContent,
    },
  });
  const postId = content.id;

  const newPost = await prisma.post.create({
    data: {
      userId: "676d0d0cb2af57dd1dcdd3ca",
      contentId: postId,
      slug: "the-first-post",
      title: "测试文章",
      description: "思考技术上的，功能上的，主要是测试用",
      content:
        "This post covers how to use dynamic imports in Next.js to optimize your application.",
      metadata: {
        date: "2024-12-02",
        tags: ["nextjs", "dynamic-import", "performance"],
        author: "HunterX",
        excerpt: "Optimize your Next.js application using dynamic imports.",
      },
      stats: {
        views: 200,
        likes: 50,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.dir(newPost.id, { depth: null });
}
