"use server";

import { requireSuperadmin } from "@/admin/auth/guard";
import {
  dbGetUserDisplayData,
  dbListAllAccounts,
  dbListAllSessions,
} from "@/db/queries/admin";
import { prisma } from "@/prisma/client";

import type { AdminAccount, AdminSession } from "../types/admin";

export async function listAllSessions(userId?: string): Promise<AdminSession[]> {
  await requireSuperadmin();
  const rows = await dbListAllSessions(userId);
  const users = await dbGetUserDisplayData([...new Set(rows.map((r) => r.userId))]);
  return rows.map((r) => {
    const u = users.get(r.userId);
    return {
      id: r.id,
      token: r.token,
      userId: r.userId,
      userName: u?.name ?? "-",
      userEmail: u?.email ?? "-",
      userImage: u?.image ?? null,
      ipAddress: r.ipAddress,
      userAgent: r.userAgent,
      createdAt: r.createdAt,
      expiresAt: r.expiresAt,
    };
  });
}

export async function listAllAccounts(userId?: string): Promise<AdminAccount[]> {
  await requireSuperadmin();
  const rows = await dbListAllAccounts(userId);
  const users = await dbGetUserDisplayData([...new Set(rows.map((r) => r.userId))]);
  return rows.map((r) => {
    const u = users.get(r.userId);
    return {
      id: r.id,
      userId: r.userId,
      userName: u?.name ?? "-",
      userEmail: u?.email ?? "-",
      userImage: u?.image ?? null,
      providerId: r.providerId,
      accountId: r.accountId,
      scope: r.scope,
      accessTokenExpiresAt: r.accessTokenExpiresAt,
      refreshTokenExpiresAt: r.refreshTokenExpiresAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  });
}

export async function deleteSession(id: string) {
  await requireSuperadmin();
  await prisma.session.delete({ where: { id } });
}

export async function bulkDeleteSessions(ids: string[]) {
  await requireSuperadmin();
  await prisma.session.deleteMany({ where: { id: { in: ids } } });
}

export async function bulkDeleteAccounts(ids: string[]) {
  await requireSuperadmin();
  await prisma.account.deleteMany({ where: { id: { in: ids } } });
}
