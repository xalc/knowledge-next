"use server";
import { PrismaClient } from "@prisma/client";
import { verifySession } from "@/lib/dal";

const prisma = new PrismaClient();
interface ResponseType {
  code: number;
  message: string;
  data?: object;
}
export async function saveArticleAction(
  jsonContnet: string,
  metadata: string,
): Promise<ResponseType> {
  //TODO user validation
  const user = await verifySession();
  if (!user || !user.isAuth) {
    return {
      code: 401,
      message: "Unauthorized",
    };
  }
  const { title, description, slug, tags, author, contentId, id } = JSON.parse(metadata);
  const existSlug = await prisma.post.findUnique({
    where: {
      slug: slug,
    },
  });

  if (contentId) {
    try {
      await prisma.postContent.update({
        where: {
          id: contentId,
        },
        data: {
          content: JSON.parse(jsonContnet),
        },
      });
      await prisma.post.update({
        where: {
          id: id,
        },
        data: {
          slug: slug,
          title: title,
          description: description,
          metadata: {
            date: "2024-12-27",
            tags: tags,
            author: author,
          },
          updatedAt: new Date(),
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      await prisma.$disconnect();
    }
    return {
      code: 200,
      message: "update success",
    };
  }

  try {
    if (existSlug) {
      return {
        code: 400,
        message: "slug already in use,change one",
      };
    }
    const content = await prisma.postContent.create({
      data: {
        content: JSON.parse(jsonContnet),
      },
    });
    const postId = content.id;

    await prisma.post.create({
      data: {
        userId: user.id,
        contentId: postId,
        slug: slug,
        title: title,
        description: description,
        metadata: {
          date: "2024-12-27",
          tags: tags,
          author: author,
        },
        stats: {
          views: 0,
          likes: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
  return {
    code: 200,
    message: "create success",
  };
}
