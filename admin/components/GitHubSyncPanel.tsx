"use client";

import {
  Album,
  CircleCheck,
  Clock,
  CloudUpload,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  Music,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import {
  listPendingSync,
  requeueUnverifiedChanges,
  syncPendingToGithub,
} from "@/admin/actions/sync";
import { CoverCell } from "@/admin/data-table/cells";
import { Button } from "@/components/ui/button";

import { timeAgo } from "@/lib/relative-time";
import { cn } from "@/lib/utils";

import type { PendingPreview } from "@/db/queries/admin/changes";
import type { ContentPrInfo, SyncRun } from "@/db/sync";

const PR_STATE_META = {
  open: { icon: GitPullRequest, className: "text-ado-primary" },
  merged: { icon: GitMerge, className: "text-muted-foreground" },
  closed: { icon: XCircle, className: "text-muted-foreground/60" },
} as const;

export function GitHubSyncPanel({
  unverifiedCount = 0,
  lastPr = null,
}: {
  unverifiedCount?: number;
  lastPr?: ContentPrInfo | null;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<PendingPreview[] | null>(null);
  const [result, setResult] = useState<{ run?: SyncRun; error?: string } | null>(
    null,
  );
  const [refreshTick, setRefreshTick] = useState(0);
  const [busy, startTransition] = useTransition();

  const refresh = () => void listPendingSync().then(setPending);
  useEffect(refresh, []);

  useEffect(() => {
    if (refreshTick > 0) router.refresh();
  }, [refreshTick, router]);

  const onSync = () => {
    startTransition(async () => {
      try {
        const run = await syncPendingToGithub();
        setResult({ run });
        refresh();
        setRefreshTick((tick) => tick + 1);
      } catch (e) {
        setResult({ error: e instanceof Error ? e.message : "Sync failed." });
      }
    });
  };

  const onRequeue = () => {
    startTransition(async () => {
      try {
        await requeueUnverifiedChanges();
        refresh();
        setRefreshTick((tick) => tick + 1);
      } catch (e) {
        setResult({ error: e instanceof Error ? e.message : "Re-queue failed." });
      }
    });
  };

  const count = pending?.length ?? 0;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-foreground/12 bg-foreground/2 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md border",
              count === 0
                ? "border-foreground/10 bg-foreground/5 text-muted-foreground"
                : "border-ado-primary/30 bg-ado-primary/10 text-ado-primary",
            )}
          >
            {count === 0 ? (
              <CircleCheck className="size-4" />
            ) : (
              <CloudUpload className="size-4" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Pending sync</p>
            <p className="text-xs text-muted-foreground">
              {count === 0
                ? "Everything is synced."
                : `${count} entit${count === 1 ? "y" : "ies"} will be committed to the content branch.`}
            </p>
          </div>
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

      {unverifiedCount > 0 && (
        <div className="border-destructive/30 bg-destructive/5 flex items-center justify-between gap-3 rounded-md border px-3 py-2">
          <p className="text-destructive text-xs">
            {unverifiedCount} change{unverifiedCount === 1 ? "" : "s"} marked as
            synced but the commit is missing on GitHub.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={onRequeue}
            className="border-destructive/30 text-destructive hover:bg-destructive/10 h-7 shrink-0 gap-1.5 rounded-md px-2.5 text-xs"
          >
            <RotateCcw className="size-3" />
            Re-queue
          </Button>
        </div>
      )}

      {count > 0 && (
        <ul className="flex flex-col gap-1.5">
          {pending?.map((p) => {
            const EntityIcon = p.entity === "song" ? Music : Album;
            return (
              <li
                key={`${p.entity}:${p.entityId}`}
                className="flex items-center justify-between gap-3 rounded-md border border-foreground/8 bg-background px-3 py-1.5 text-xs"
              >
                <span className="flex min-w-0 items-center gap-2 text-foreground">
                  <CoverCell url={p.entityInfo.coverArt ?? ""} />
                  <span className="flex min-w-0 flex-col">
                    <span className="flex items-center gap-1.5 truncate font-medium">
                      {p.entityInfo.title ?? p.entityId}
                      <span className="shrink-0 rounded-full bg-foreground/6 px-1.5 py-0.5 text-[11px] font-normal text-muted-foreground/70 tabular-nums">
                        {p.count} change{p.count === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                      <EntityIcon className="size-3 shrink-0" />
                      {p.entity}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-muted-foreground/60">
                  {p.user.name} - {timeAgo(p.lastAt)}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {lastPr && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-muted-foreground/60 uppercase">
            Last PR
          </p>
          <a
            href={lastPr.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between gap-3 rounded-md border border-foreground/8 bg-background px-3 py-2 text-xs transition-colors hover:border-foreground/15"
          >
            <span className="flex min-w-0 items-center gap-2">
              {(() => {
                const { icon: Icon, className } = PR_STATE_META[lastPr.state];
                return <Icon className={cn("size-3.5 shrink-0", className)} />;
              })()}
              <span className="truncate font-medium text-foreground group-hover:underline">
                {lastPr.title}
              </span>
              <span className="shrink-0 text-muted-foreground/50">
                #{lastPr.number}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-muted-foreground/60">
              <Clock className="size-3" />
              {lastPr.state} - {timeAgo(new Date(lastPr.updatedAt))}
            </span>
          </a>
        </div>
      )}

      {result?.error && (
        <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-3 py-2 text-xs">
          {result.error}
        </p>
      )}
      {result?.run && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-foreground/8 bg-background px-3 py-2 text-xs">
          <CircleCheck className="size-3.5 shrink-0 text-ado-primary" />
          <span className="text-foreground">
            Synced {result.run.synced} change{result.run.synced === 1 ? "" : "s"}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            {result.run.commit && (
              <a
                href={result.run.commit}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-md bg-foreground/6 px-2 py-1 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                <GitCommitHorizontal className="size-3" /> Commit
              </a>
            )}
            {result.run.pr && (
              <a
                href={result.run.pr}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-md bg-foreground/6 px-2 py-1 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                <GitPullRequest className="size-3" /> PR
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
