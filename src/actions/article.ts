'use server'
import { PrismaClient } from '@prisma/client'
import { formSchema } from '@/components/blogs/BlogmetaForm';
import { z } from "zod"
// import { JSONContent } from '@tiptap/core';
const prisma = new PrismaClient()
//z.infer<typeof formSchema>
export async function saveArticleAction(jsonContnet: string, metadata: string) {

  try {
    const content = await prisma.postContent.create({
      data: {
        content: JSON.parse(jsonContnet)

      }
    });
    const postId = content.id;

    const { title, description, slug, tags, author } = JSON.parse(metadata);
    await prisma.post.create({
      data: {
        userId: '676d0d0cb2af57dd1dcdd3ca',
        contentId: postId,
        "slug": slug,
        "title": title,
        "description": description,
        "metadata": {
          "date": "2024-12-27",
          "tags": tags,
          "author": author,
        },
        "stats": {
          "views": 0,
          "likes": 0
        },
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    })
  }
  catch (e) {
    console.error(e)
  }
  finally {
    await prisma.$disconnect()
  }
}