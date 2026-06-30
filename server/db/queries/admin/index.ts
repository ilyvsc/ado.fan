import { prisma } from "@/prisma/client";

import type { Override, Resource } from "@/admin/lib/permissions";

export async function loadOverrides(userId: string): Promise<Override[]> {
  const rows = await prisma.userPermission.findMany({
    where: { userId },
    select: { resource: true, level: true },
  });
  return rows.map((r) => ({ resource: r.resource as Resource, level: r.level }));
}

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

export async function dbGetUserRole(userId: string) {
  return prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
}

export async function dbGetUserDisplayData(userIds: string[]) {
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true, image: true },
  });
  return new Map(users.map((u) => [u.id, u]));
}
