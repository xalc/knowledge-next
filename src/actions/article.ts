"use server";

import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

interface ResponseType {
  code: number;
  message: string;
  data?: object;
}

export async function saveArticleAction(
  jsonContent: string,
  metadata: string,
): Promise<ResponseType> {
  const user = await verifySession();
  if (!user || !user.isAuth) {
    return {
      code: 401,
      message: "未登录，请先登录",
    };
  }

  const { title, description, slug, tags, author, contentId, id, cover } = JSON.parse(metadata);

  if (contentId) {
    try {
      await prisma.postContent.update({
        where: { id: contentId },
        data: { content: JSON.parse(jsonContent) },
      });

      await prisma.post.update({
        where: { id },
        data: {
          slug,
          title,
          description,
          cover,
          metadata: {
            date: new Date().toISOString().split("T")[0],
            tags,
            author,
          },
          updatedAt: new Date(),
        },
      });

      revalidateTag("posts");
      return { code: 200, message: "更新成功" };
    } catch (error) {
      console.error("Update article failed:", error);
      return { code: 500, message: "更新失败，请重试" };
    }
  }

  try {
    const existSlug = await prisma.post.findUnique({ where: { slug } });
    if (existSlug) {
      return { code: 400, message: "URL 别名已被使用，请换一个" };
    }

    const content = await prisma.postContent.create({
      data: { content: JSON.parse(jsonContent) },
    });

    await prisma.post.create({
      data: {
        userId: user.id,
        contentId: content.id,
        slug,
        title,
        description,
        cover,
        metadata: {
          date: new Date().toISOString().split("T")[0],
          tags,
          author,
        },
        stats: { views: 0, likes: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    revalidateTag("posts");
    return { code: 200, message: "发布成功" };
  } catch (error) {
    console.error("Create article failed:", error);
    return { code: 500, message: "创建失败，请重试" };
  }
}

export async function deleteArticleAction(postId: string): Promise<ResponseType> {
  const user = await verifySession();
  if (!user || !user.isAuth) {
    return { code: 401, message: "未登录" };
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return { code: 404, message: "文章不存在" };
    }

    await prisma.postContent.delete({ where: { id: post.contentId } });
    await prisma.post.delete({ where: { id: postId } });

    revalidateTag("posts");
    return { code: 200, message: "删除成功" };
  } catch (error) {
    console.error("Delete article failed:", error);
    return { code: 500, message: "删除失败" };
  }
}
