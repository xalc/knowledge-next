import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "./session";
import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { UserType } from "@/context/user-provider";
const prisma = new PrismaClient();
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return { isAuth: false };
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return { isAuth: false };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });
  if (!user) {
    return { isAuth: false } as UserType;
  }
  return { isAuth: true, ...user, password: undefined } as UserType;
}) as () => Promise<UserType>;
