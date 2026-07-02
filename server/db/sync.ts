import {
  commitFixtureFiles,
  ensureContentPr,
  getSyncConfig,
  verifyCommits,
} from "@/lib/github-sync";

import { exportEntity } from "./export";
import {
  deleteChanges,
  getChangeAttributions,
  getDistinctCoAuthors,
  getPendingEntities,
  getRecentChanges,
  getSyncedCommitShas,
  markSynced,
  resetSyncedByCommitShas,
  resetSyncedWithoutCommit,
  type RecentChange,
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

  if (pending.length === 0) {
    const pr = await ensureContentPr("Sync of admin edits.");
    return { synced: 0, pr };
  }

  const files: FixtureFile[] = [];
  const exportable: typeof pending = [];
  const orphanedChangeIds: string[] = [];

  for (const item of pending) {
    const exported = await exportEntity(item.entity, item.entityId);

    // Entity deleted since the change was recorded: nothing to commit.
    if (exported === null) {
      orphanedChangeIds.push(...item.changeIds);
      continue;
    }
    files.push(...exported);
    exportable.push(item);
  }

  await deleteChanges(orphanedChangeIds);
  if (exportable.length === 0) {
    const pr = await ensureContentPr("Sync of admin edits.");
    return { synced: 0, pr };
  }

  const changeIds = exportable.flatMap((p) => p.changeIds);
  const coAuthors = await getDistinctCoAuthors(changeIds);
  const attributions = await getChangeAttributions(changeIds);
  const count = exportable.length;

  const commit = await commitFixtureFiles(
    files,
    `content: sync ${count} entit${count === 1 ? "y" : "ies"}`,
    coAuthors,
  );
  await markSynced(changeIds, commit.sha);

  const mention = (editor: { name: string; username: string | null }) =>
    editor.username ? `@${editor.username}` : editor.name;

  const changeLines = attributions.map(
    (a) =>
      `- **${a.entity}** \`${a.entityId}\` — ${a.count} edit${a.count === 1 ? "" : "s"} by ${a.editors.map(mention).join(", ")}`,
  );
  const prBody = [
    `Sync of admin edits (${commit.sha.slice(0, 7)}).`,
    "",
    "### Changes",
    ...changeLines,
  ].join("\n");

  const pr = await ensureContentPr(prBody, true);
  return { synced: count, commit: commit.url, pr };
}

export interface RequeueRun {
  checked: number;
  requeued: number;
}

// Recovery path for the DB synced, GitHub unsynced edge case: any
// recorded commit sha that no longer exists on the repo (force push, deleted
// branch, historic failure) sends its changes back to pending.
export async function requeueMissingCommits(): Promise<RequeueRun> {
  const orphaned = await resetSyncedWithoutCommit();

  const recordedShas = await getSyncedCommitShas();
  if (!recordedShas.length) return { checked: 0, requeued: orphaned };

  const existsOnGithub = await verifyCommits(recordedShas);
  const missingShas = recordedShas.filter((sha) => existsOnGithub.get(sha) === false);
  const requeued = await resetSyncedByCommitShas(missingShas);
  return { checked: recordedShas.length, requeued: requeued + orphaned };
}

export interface VerifiedChange extends RecentChange {
  commitUrl: string | null;
  verified: boolean | null; // null = not checked
}

const VERIFY_CAP = 20; // verifies only the 20 newest distinct shas per load

// GitHub -> admin direction: confirm the shas we stored still exist on the repo.
export async function getVerifiedChanges(): Promise<VerifiedChange[]> {
  const changes = await getRecentChanges();
  const shas = [
    ...new Set(changes.flatMap((c) => (c.commitSha ? [c.commitSha] : []))),
  ].slice(0, VERIFY_CAP);

  let repoUrl: string | null = null;
  let checked = new Map<string, boolean>();

  try {
    const config = getSyncConfig();
    repoUrl = `https://github.com/${config.owner}/${config.repo}`;
  } catch {}

  if (repoUrl && shas.length) {
    try {
      checked = await verifyCommits(shas);
    } catch {}
  }

  return changes.map((change) => ({
    ...change,
    commitUrl:
      change.commitSha && repoUrl ? `${repoUrl}/commit/${change.commitSha}` : null,
    verified: change.commitSha
      ? (checked.get(change.commitSha) ?? null)
      : change.synced
        ? false
        : null,
  }));
}
