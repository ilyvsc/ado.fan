"use server";

import { requireResource, requireSuperadmin } from "@/admin/auth/guard";
import {
  getLastChange,
  getPendingPreview,
  getRecentChanges,
  type ContentEntityType,
  type LastChange,
  type PendingPreview,
  type RecentChange,
} from "@/db/queries/admin/changes";
import { runSync, type SyncRun } from "@/db/sync";

export async function getEntityLastChange(
  entity: ContentEntityType,
  id: string,
): Promise<LastChange | null> {
  await requireResource(entity === "song" ? "songs" : "albums", "read");
  return getLastChange(entity, id);
}

export async function listRecentChanges(): Promise<RecentChange[]> {
  await requireResource("songs", "read");
  return getRecentChanges();
}

export async function listPendingSync(): Promise<PendingPreview[]> {
  await requireSuperadmin();
  return getPendingPreview();
}

export async function syncPendingToGithub(): Promise<SyncRun> {
  await requireSuperadmin();
  return runSync();
}
