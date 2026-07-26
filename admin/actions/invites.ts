"use server";

import { randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { requireSuperadmin } from "@/admin/auth/guard";
import { INVITE_COOKIE } from "@/admin/auth/server";
import { OVERRIDABLE, PermissionLevel, Role } from "@/admin/lib/permissions";

import { prisma } from "@/prisma/client";

import type { InviteRole, Level, Resource } from "@/admin/lib/permissions";

export type InvitePermissions = Partial<Record<Resource, Level>>;

export type InviteStatus = "active" | "used" | "revoked" | "expired";

export interface InviteRecord {
  id: string;
  token: string;
  role: InviteRole;
  email: string | null;
  createdById: string;
  createdByName: string;
  createdByImage: string | null;
  createdAt: Date;
  expiresAt: Date;
  status: InviteStatus;
  usedAt: Date | null;
  usedById: string | null;
  usedByName: string | null;
  usedByImage: string | null;
  permissions: Partial<Record<Resource, Level>> | null;
}

function inviteStatus(i: {
  usedAt: Date | null;
  revokedAt: Date | null;
  expiresAt: Date;
}): InviteStatus {
  if (i.revokedAt) return "revoked";
  if (i.usedAt) return "used";
  if (i.expiresAt < new Date()) return "expired";
  return "active";
}

export async function createInvite(
  role: InviteRole = Role.contributor,
  permissions?: InvitePermissions,
) {
  const user = await requireSuperadmin();

  const clean: Record<string, Level> = {};
  for (const resource of OVERRIDABLE) {
    const level = permissions?.[resource];
    if (level && Object.values(PermissionLevel).includes(level)) {
      clean[resource] = level;
    }
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);

  await prisma.invite.create({
    data: {
      token,
      role,
      invitedBy: user.id,
      expiresAt,
      permissions: Object.keys(clean).length ? clean : undefined,
    },
  });

  return `/admin/join/${token}`;
}

export async function listInvites(): Promise<InviteRecord[]> {
  await requireSuperadmin();
  const invites = await prisma.invite.findMany({ orderBy: { createdAt: "desc" } });

  const userIds = [
    ...new Set([
      ...invites.map((i) => i.invitedBy),
      ...invites.flatMap((i) => (i.usedBy ? [i.usedBy] : [])),
    ]),
  ];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true },
  });
  const userById = new Map(users.map((u) => [u.id, u]));

  return invites.map((i) => {
    const creator = userById.get(i.invitedBy);
    const usedByUser = i.usedBy ? userById.get(i.usedBy) : undefined;
    return {
      id: i.id,
      token: i.token,
      role: i.role as InviteRole,
      email: i.email,
      createdById: i.invitedBy,
      createdByName: creator?.name ?? "-",
      createdByImage: creator?.image ?? null,
      createdAt: i.createdAt,
      expiresAt: i.expiresAt,
      status: inviteStatus(i),
      usedAt: i.usedAt,
      usedById: i.usedBy ?? null,
      usedByName: usedByUser?.name ?? null,
      usedByImage: usedByUser?.image ?? null,
      permissions: i.permissions as Partial<Record<Resource, Level>> | null,
    };
  });
}

export async function revokeInvite(id: string) {
  await requireSuperadmin();
  await prisma.invite.update({ where: { id }, data: { revokedAt: new Date() } });
}

export async function bulkRevokeInvites(ids: string[]) {
  await requireSuperadmin();
  await prisma.invite.updateMany({
    where: { id: { in: ids } },
    data: { revokedAt: new Date() },
  });
}

export async function stashInviteToken(token: string) {
  (await cookies()).set(INVITE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
}
