import { prisma } from "@/prisma/client";

export type ContentEntityType = "song" | "album";

export interface PendingEntity {
  entity: ContentEntityType;
  entityId: string;
  changeIds: string[];
}

export interface ChangeUser {
  id: string;
  name: string;
  image: string | null;
}

export interface LastChange {
  user: ChangeUser;
  createdAt: Date;
  synced: boolean;
}

export interface RecentChange {
  id: string;
  entity: ContentEntityType;
  entityId: string;
  createdAt: Date;
  synced: boolean;
  syncedAt: Date | null;
  user: ChangeUser;
}

export interface PendingPreview {
  entity: ContentEntityType;
  entityId: string;
  count: number;
  lastAt: Date;
  user: ChangeUser;
}

const UNKNOWN_USER: ChangeUser = { id: "", name: "Unknown", image: null };

export async function recordChange(
  entity: ContentEntityType,
  entityId: string,
  userId: string,
) {
  await prisma.contentChange.create({ data: { entity, entityId, userId } });
}

// Distinct unsynced entities + the change rows they cover, so a sync touches
// only what actually changed (3 entities, not 300).
export async function getPendingEntities(filter?: {
  entity: ContentEntityType;
  entityId: string;
}): Promise<PendingEntity[]> {
  const rows = await prisma.contentChange.findMany({
    where: { syncedAt: null, ...filter },
    select: { id: true, entity: true, entityId: true },
    orderBy: { createdAt: "asc" },
  });

  const grouped = new Map<string, PendingEntity>();
  for (const row of rows) {
    const key = `${row.entity}:${row.entityId}`;
    const existing = grouped.get(key);
    if (existing) existing.changeIds.push(row.id);
    else
      grouped.set(key, {
        entity: row.entity,
        entityId: row.entityId,
        changeIds: [row.id],
      });
  }
  return [...grouped.values()];
}

export async function markSynced(changeIds: string[], commitSha: string) {
  if (!changeIds.length) return;
  await prisma.contentChange.updateMany({
    where: { id: { in: changeIds } },
    data: { syncedAt: new Date(), commitSha },
  });
}

async function usersById(userIds: string[]): Promise<Map<string, ChangeUser>> {
  const ids = [...new Set(userIds)];
  if (!ids.length) return new Map();
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, image: true },
  });
  return new Map(users.map((u) => [u.id, u]));
}

export async function getLastChange(
  entity: ContentEntityType,
  entityId: string,
): Promise<LastChange | null> {
  const row = await prisma.contentChange.findFirst({
    where: { entity, entityId },
    orderBy: { createdAt: "desc" },
    select: { userId: true, createdAt: true, syncedAt: true },
  });
  if (!row) return null;

  const users = await usersById([row.userId]);
  return {
    user: users.get(row.userId) ?? UNKNOWN_USER,
    createdAt: row.createdAt,
    synced: row.syncedAt !== null,
  };
}

export async function getRecentChanges(limit = 100): Promise<RecentChange[]> {
  const rows = await prisma.contentChange.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      entity: true,
      entityId: true,
      createdAt: true,
      syncedAt: true,
      userId: true,
    },
  });
  const users = await usersById(rows.map((r) => r.userId));
  return rows.map((r) => ({
    id: r.id,
    entity: r.entity,
    entityId: r.entityId,
    createdAt: r.createdAt,
    synced: r.syncedAt !== null,
    syncedAt: r.syncedAt,
    user: users.get(r.userId) ?? UNKNOWN_USER,
  }));
}

// What a sync would commit right now: one row per distinct unsynced entity.
export async function getPendingPreview(): Promise<PendingPreview[]> {
  const rows = await prisma.contentChange.findMany({
    where: { syncedAt: null },
    orderBy: { createdAt: "desc" },
    select: { entity: true, entityId: true, createdAt: true, userId: true },
  });
  const users = await usersById(rows.map((r) => r.userId));

  const grouped = new Map<string, PendingPreview>();
  for (const row of rows) {
    const key = `${row.entity}:${row.entityId}`;
    const existing = grouped.get(key);
    if (existing) existing.count += 1;
    else
      grouped.set(key, {
        entity: row.entity,
        entityId: row.entityId,
        count: 1,
        lastAt: row.createdAt, // rows are desc -> first seen is newest
        user: users.get(row.userId) ?? UNKNOWN_USER,
      });
  }
  return [...grouped.values()];
}

export async function getDistinctUserNames(changeIds: string[]): Promise<string[]> {
  if (!changeIds.length) return [];
  const rows = await prisma.contentChange.findMany({
    where: { id: { in: changeIds } },
    select: { userId: true },
  });
  const userIds = [...new Set(rows.map((r) => r.userId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { name: true },
  });
  return users.map((u) => u.name);
}
