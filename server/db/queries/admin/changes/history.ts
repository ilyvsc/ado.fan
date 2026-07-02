import { prisma } from "@/prisma/client";

import type {
  ChangeUser,
  ContentEntityType,
  EntityInfo,
  LastChange,
  PendingPreview,
  RecentChange,
} from "./types";

const UNKNOWN_USER: ChangeUser = { id: "", name: "Unknown", image: null };
const UNKNOWN_ENTITY: EntityInfo = { title: null, coverArt: null };

/** Id/name/image for a batch of users, keyed by id. */
async function usersById(userIds: string[]): Promise<Map<string, ChangeUser>> {
  const ids = [...new Set(userIds)];
  if (!ids.length) return new Map();
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, image: true },
  });
  return new Map(users.map((u) => [u.id, u]));
}

/** Title + cover per changed entity, so the UI shows a name instead of a raw cuid. */
async function entityInfoByRows(
  rows: { entity: ContentEntityType; entityId: string }[],
): Promise<Map<string, EntityInfo>> {
  const songIds = [
    ...new Set(rows.filter((r) => r.entity === "song").map((r) => r.entityId)),
  ];
  const albumIds = [
    ...new Set(rows.filter((r) => r.entity === "album").map((r) => r.entityId)),
  ];

  const [songs, albums] = await Promise.all([
    songIds.length
      ? prisma.song.findMany({
          where: { id: { in: songIds } },
          select: { id: true, titleEnglish: true, coverArt: true },
        })
      : [],
    albumIds.length
      ? prisma.album.findMany({
          where: { id: { in: albumIds } },
          select: { id: true, titleEnglish: true, coverArt: true },
        })
      : [],
  ]);

  const map = new Map<string, EntityInfo>();
  for (const song of songs) {
    map.set(`song:${song.id}`, { title: song.titleEnglish, coverArt: song.coverArt });
  }
  for (const album of albums) {
    map.set(`album:${album.id}`, {
      title: album.titleEnglish,
      coverArt: album.coverArt,
    });
  }
  return map;
}

/** Most recent change for one entity, with editor and sync status. */
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

/** Most recent changes across all entities, newest first. */
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
      commitSha: true,
      userId: true,
    },
  });
  const [users, entityInfo] = await Promise.all([
    usersById(rows.map((r) => r.userId)),
    entityInfoByRows(rows),
  ]);
  return rows.map((r) => ({
    id: r.id,
    entity: r.entity,
    entityId: r.entityId,
    createdAt: r.createdAt,
    synced: r.syncedAt !== null,
    syncedAt: r.syncedAt,
    commitSha: r.commitSha,
    user: users.get(r.userId) ?? UNKNOWN_USER,
    entityInfo: entityInfo.get(`${r.entity}:${r.entityId}`) ?? UNKNOWN_ENTITY,
  }));
}

/** What a sync would commit right now: one row per distinct unsynced entity. */
export async function getPendingPreview(): Promise<PendingPreview[]> {
  const rows = await prisma.contentChange.findMany({
    where: { syncedAt: null },
    orderBy: { createdAt: "desc" },
    select: { entity: true, entityId: true, createdAt: true, userId: true },
  });
  const [users, entityInfo] = await Promise.all([
    usersById(rows.map((r) => r.userId)),
    entityInfoByRows(rows),
  ]);

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
        entityInfo: entityInfo.get(key) ?? UNKNOWN_ENTITY,
      });
  }
  return [...grouped.values()];
}
