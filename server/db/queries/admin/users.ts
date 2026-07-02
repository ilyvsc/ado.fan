import { prisma } from "@/prisma/client";

/** A user's role, for permission checks. */
export async function dbGetUserRole(userId: string) {
  return prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
}

/** Name/email/avatar for a batch of user ids, keyed by id. */
export async function dbGetUserDisplayData(userIds: string[]) {
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true, image: true },
  });
  return new Map(users.map((u) => [u.id, u]));
}
