import { prisma } from "@/prisma/client";

import type {
  ChangeAttribution,
  ChangeEditor,
  ContentEntityType,
  PendingEntity,
} from "./types";

/** Records one content edit, queued for the next sync. */
export async function recordChange(
  entity: ContentEntityType,
  entityId: string,
  userId: string,
) {
  await prisma.contentChange.create({ data: { entity, entityId, userId } });
}

/** Unsynced entities grouped with the change ids each one covers, so a sync touches only what changed. */
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

/** Marks change rows as synced under the given commit. */
export async function markSynced(changeIds: string[], commitSha: string) {
  if (!changeIds.length) return;
  await prisma.contentChange.updateMany({
    where: { id: { in: changeIds } },
    data: { syncedAt: new Date(), commitSha },
  });
}

/** Distinct commit shas ever marked as synced, for cross-checking against GitHub. */
export async function getSyncedCommitShas(): Promise<string[]> {
  const rows = await prisma.contentChange.findMany({
    where: { syncedAt: { not: null }, commitSha: { not: null } },
    select: { commitSha: true },
    distinct: ["commitSha"],
  });
  return rows.flatMap((row) => (row.commitSha ? [row.commitSha] : []));
}

/** Requeues changes committed under the given shas so the next sync recommits them. */
export async function resetSyncedByCommitShas(shas: string[]): Promise<number> {
  if (!shas.length) return 0;
  const result = await prisma.contentChange.updateMany({
    where: { commitSha: { in: shas } },
    data: { syncedAt: null, commitSha: null },
  });
  return result.count;
}

/** Deletes change rows outright, e.g. for an entity that no longer exists. */
export async function deleteChanges(changeIds: string[]) {
  if (!changeIds.length) return;
  await prisma.contentChange.deleteMany({ where: { id: { in: changeIds } } });
}

/** Requeues synced rows with no commit sha recorded — unverifiable, so treated as lost. */
export async function resetSyncedWithoutCommit(): Promise<number> {
  const result = await prisma.contentChange.updateMany({
    where: { syncedAt: { not: null }, commitSha: null },
    data: { syncedAt: null },
  });
  return result.count;
}

/** Editors per entity for the given change ids, for the PR description. */
export async function getChangeAttributions(
  changeIds: string[],
): Promise<ChangeAttribution[]> {
  if (!changeIds.length) return [];
  const rows = await prisma.contentChange.findMany({
    where: { id: { in: changeIds } },
    select: { entity: true, entityId: true, userId: true },
    orderBy: { createdAt: "asc" },
  });
  const userIds = [...new Set(rows.map((row) => row.userId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, username: true },
  });
  const usersByIdMap = new Map(users.map((user) => [user.id, user]));

  const grouped = new Map<string, ChangeAttribution & { editorIds: Set<string> }>();
  for (const row of rows) {
    const key = `${row.entity}:${row.entityId}`;
    const user = usersByIdMap.get(row.userId);
    const editor: ChangeEditor = {
      name: user?.name ?? "Unknown",
      username: user?.username ?? null,
    };
    const existing = grouped.get(key);
    if (existing) {
      existing.count += 1;
      if (!existing.editorIds.has(row.userId)) {
        existing.editorIds.add(row.userId);
        existing.editors.push(editor);
      }
    } else {
      grouped.set(key, {
        entity: row.entity,
        entityId: row.entityId,
        count: 1,
        editors: [editor],
        editorIds: new Set([row.userId]),
      });
    }
  }
  return [...grouped.values()].map(({ editorIds: _editorIds, ...rest }) => rest);
}

/** "Name <email>" per contributor, for `Co-Authored-By` trailers. */
export async function getDistinctCoAuthors(changeIds: string[]): Promise<string[]> {
  if (!changeIds.length) return [];
  const rows = await prisma.contentChange.findMany({
    where: { id: { in: changeIds } },
    select: { userId: true },
  });
  const userIds = [...new Set(rows.map((row) => row.userId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { name: true, email: true },
  });
  return users.map((user) => `${user.name} <${user.email}>`);
}
