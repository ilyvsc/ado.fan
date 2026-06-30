"use server";

import { getSessionIdentity, requireSuperadmin } from "@/admin/auth/guard";
import {
  effectiveLevel,
  OVERRIDABLE,
  RESOURCES,
  Role,
} from "@/admin/lib/permissions";

import { dbListAllSessions, loadOverrides } from "@/db/queries/admin";
import { prisma } from "@/prisma/client";

import type { Level, Override, Resource } from "@/admin/lib/permissions";

export interface Member {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  sessionCount: number;
  levels: Record<Resource, Level>;
  createdAt: Date;
  updatedAt: Date;
}

export async function listMembers(): Promise<Member[]> {
  await requireSuperadmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { sessions: true } },
    },
  });

  const perms = await prisma.userPermission.findMany({
    where: { userId: { in: users.map((u) => u.id) } },
    select: { userId: true, resource: true, level: true },
  });
  const overridesByUser = new Map<string, Override[]>();
  for (const p of perms) {
    const list = overridesByUser.get(p.userId) ?? [];
    list.push({ resource: p.resource as Resource, level: p.level });
    overridesByUser.set(p.userId, list);
  }

  return users.map((u) => {
    const overrides = overridesByUser.get(u.id) ?? [];
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      sessionCount: (u as unknown as { _count: { sessions: number } })._count
        .sessions,
      levels: Object.fromEntries(
        RESOURCES.map((r) => [r, effectiveLevel(u.role, overrides, r)]),
      ) as Record<Resource, Level>,
    };
  });
}

export async function setMemberRole(userId: string, role: Role) {
  const me = await requireSuperadmin();
  if (userId === me.id) throw new Error("You can't change your own role.");
  if (role !== Role.admin && role !== Role.contributor) {
    throw new Error("Only admin or contributor can be assigned.");
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
}

export async function revokeMemberSessions(userId: string) {
  await requireSuperadmin();
  await prisma.session.deleteMany({ where: { userId } });
}

export async function listMemberSessions(userId: string) {
  await requireSuperadmin();
  return dbListAllSessions(userId);
}

export async function revokeMemberSession(sessionId: string) {
  await requireSuperadmin();
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function revokeAllSessions() {
  const me = await requireSuperadmin();
  const { count } = await prisma.session.deleteMany({
    where: { userId: { not: me.id } },
  });
  return count;
}

export async function getMemberOverrides(userId: string): Promise<Override[]> {
  await requireSuperadmin();
  return loadOverrides(userId);
}

export async function setMemberOverride(
  userId: string,
  resource: Resource,
  level: Level | null,
) {
  await requireSuperadmin();
  if (!OVERRIDABLE.includes(resource)) {
    throw new Error("This section isn't override-able.");
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!target) throw new Error("Unknown user.");
  if (target.role === Role.superadmin) {
    throw new Error("Superadmin permissions can't be overridden.");
  }

  if (level === null) {
    await prisma.userPermission.deleteMany({ where: { userId, resource } });
    return;
  }
  await prisma.userPermission.upsert({
    where: { userId_resource: { userId, resource } },
    create: { userId, resource, level },
    update: { level },
  });
}

export async function getMyResourceLevels(): Promise<Record<Resource, Level>> {
  const user = await getSessionIdentity();
  if (!user) throw new Error("Not signed in.");
  const overrides = await loadOverrides(user.id);
  const role = user.role ?? Role.contributor;
  return Object.fromEntries(
    RESOURCES.map((resource) => [
      resource,
      effectiveLevel(role, overrides, resource),
    ]),
  ) as Record<Resource, Level>;
}

export async function deleteMyAccount() {
  const user = await getSessionIdentity();
  if (!user) throw new Error("Not signed in.");
  if (user.role === Role.superadmin)
    throw new Error("Superadmin account cannot be deleted.");
  await prisma.user.delete({ where: { id: user.id } });
}
