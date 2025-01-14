import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function getWRToken(): Promise<string> {
  try {
    const cookies = await prisma.wRMeta.findUnique({
      where: { keyName: "cookieToken" },
    });
    return cookies.keyValue;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getRecentBooks() {
  try {
    const bookShelf = await prisma.wRBookShelt.findMany({
      orderBy: {
        readUpdateTime: "desc",
      },
      take: 4,
    });
    return bookShelf;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
export async function getAllBooks() {
  try {
    const bookShelf = await prisma.wRBookShelt.findMany({
      orderBy: {
        readUpdateTime: "desc",
      },
    });
    return bookShelf;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
