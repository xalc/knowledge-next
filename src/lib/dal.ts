import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "./session";
import { cache } from "react";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return { isAuth: false };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });
  const { password, ...rest } = user;
  return { isAuth: true, ...rest };
});
