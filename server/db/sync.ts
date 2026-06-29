import { commitFixtureFiles, ensureContentPr } from "@/lib/github-sync";

import { exportEntity } from "./export";
import {
  getDistinctUserNames,
  getPendingEntities,
  markSynced,
} from "./queries/admin/changes";

import type { FixtureFile } from "./export/serialize-fixtures";

export interface SyncRun {
  synced: number;
  commit?: string;
  pr?: string | null;
}

// Commit every pending entity's fixtures to the content branch, mark them synced,
// and open/refresh the promotion PR. Shared by the cron route and the manual button.
export async function runSync(): Promise<SyncRun> {
  const pending = await getPendingEntities();
  if (pending.length === 0) return { synced: 0 };

  const files: FixtureFile[] = [];
  for (const { entity, entityId } of pending) {
    files.push(...(await exportEntity(entity, entityId)));
  }

  const changeIds = pending.flatMap((p) => p.changeIds);
  const coAuthors = await getDistinctUserNames(changeIds);
  const summary = pending.map((p) => `${p.entity} ${p.entityId}`).join(", ");
  const count = pending.length;

  const commit = await commitFixtureFiles(
    files,
    `content: sync ${count} entit${count === 1 ? "y" : "ies"}`,
    coAuthors,
  );
  await markSynced(changeIds, commit.sha);

  const pr = await ensureContentPr(`Sync of admin edits.\n\n${summary}`);
  return { synced: count, commit: commit.url, pr };
}
