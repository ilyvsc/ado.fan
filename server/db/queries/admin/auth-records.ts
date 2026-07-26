import { prisma } from "@/prisma/client";

/** All sessions, or one user's, newest first. */
export async function dbListAllSessions(userId?: string) {
  const where = userId ? { userId } : {};
  return prisma.session.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      token: true,
      userId: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      expiresAt: true,
    },
  });
}

/** All linked provider accounts, or one user's, newest first. */
export async function dbListAllAccounts(userId?: string) {
  const where = userId ? { userId } : {};
  return prisma.account.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      providerId: true,
      accountId: true,
      scope: true,
      accessTokenExpiresAt: true,
      refreshTokenExpiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
