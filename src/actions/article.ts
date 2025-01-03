"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveArticleAction(jsonContnet: string, metadata: string) {
  //TODO user validation
  const { title, description, slug, tags, author, contentId, id } = JSON.parse(metadata);
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
    return;
  }

  try {
    const content = await prisma.postContent.create({
      data: {
        content: JSON.parse(jsonContnet),
      },
    });
    const postId = content.id;

    await prisma.post.create({
      data: {
        userId: "676d0d0cb2af57dd1dcdd3ca",
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
}
