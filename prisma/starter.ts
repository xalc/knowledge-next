import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getWRToken(): Promise<string> {
  const cookies = await prisma.wRMeta.findUnique({
    where: { keyName: "cookieToken" },
  });
  console.log(cookies.keyValue);
  return cookies.keyValue;
}

async function main() {
  const allPosts = await prisma.post.findMany({});
  console.dir(allPosts, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
