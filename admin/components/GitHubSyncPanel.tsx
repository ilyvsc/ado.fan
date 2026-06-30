"use client";

import { CloudUpload, GitPullRequest } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { listPendingSync, syncPendingToGithub } from "@/admin/actions/sync";
import { Button } from "@/components/ui/button";

import { timeAgo } from "@/lib/relative-time";

import type { PendingPreview } from "@/db/queries/admin/changes";
import type { SyncRun } from "@/db/sync";

export function GitHubSyncPanel() {
  const [pending, setPending] = useState<PendingPreview[] | null>(null);
  const [result, setResult] = useState<{ run?: SyncRun; error?: string } | null>(
    null,
  );
  const [busy, startTransition] = useTransition();

  const refresh = () => void listPendingSync().then(setPending);
  useEffect(refresh, []);

  const onSync = () => {
    startTransition(async () => {
      try {
        const run = await syncPendingToGithub();
        setResult({ run });
        refresh();
      } catch (e) {
        setResult({ error: e instanceof Error ? e.message : "Sync failed." });
      }
    });
  };

  const count = pending?.length ?? 0;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-foreground/12 bg-foreground/2 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Pending sync</p>
          <p className="text-xs text-muted-foreground">
            {count === 0
              ? "Everything is synced."
              : `${count} entit${count === 1 ? "y" : "ies"} will be committed to the content branch.`}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={busy || count === 0}
          onClick={onSync}
          className="h-8 shrink-0 gap-1.5 rounded-md bg-ado-primary px-3 text-xs font-medium text-ado-primary-foreground hover:bg-ado-primary/90 disabled:opacity-50"
        >
          <CloudUpload className="size-3.5" />
          {busy ? "Syncing…" : "Sync to GitHub"}
        </Button>
      </div>

      {count > 0 && (
        <ul className="flex flex-col gap-1.5">
          {pending?.map((p) => (
            <li
              key={`${p.entity}:${p.entityId}`}
              className="flex items-center justify-between gap-3 rounded-md bg-background px-3 py-1.5 text-xs"
            >
              <span className="truncate text-foreground">
                {p.entity} · {p.entityId}
                <span className="ml-2 text-muted-foreground/50">
                  {p.count} change{p.count === 1 ? "" : "s"}
                </span>
              </span>
              <span className="shrink-0 text-muted-foreground/60">
                {p.user.name} · {timeAgo(p.lastAt)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {result?.error && <p className="text-destructive text-xs">{result.error}</p>}
      {result?.run && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Synced {result.run.synced}.</span>
          {result.run.commit && (
            <a
              href={result.run.commit}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              View commit
            </a>
          )}
          {result.run.pr && (
            <a
              href={result.run.pr}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <GitPullRequest className="size-3" /> View PR
            </a>
          )}
        </div>
      )}
    </div>
  );
}
