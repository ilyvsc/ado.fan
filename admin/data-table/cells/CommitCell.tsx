import { CircleCheck, TriangleAlert } from "lucide-react";

import type { VerifiedChange } from "@/server/db/sync";

export function CommitCell({ change }: { change: VerifiedChange }) {
  if (!change.commitSha) {
    return <span className="text-xs text-muted-foreground/50">—</span>;
  }
  const short = change.commitSha.slice(0, 7);
  return (
    <span className="flex items-center gap-1.5 font-mono text-xs">
      {change.commitUrl ? (
        <a
          href={change.commitUrl}
          target="_blank"
          rel="noreferrer"
          className="text-foreground hover:underline"
        >
          {short}
        </a>
      ) : (
        <span className="text-foreground">{short}</span>
      )}
      {change.verified === true && (
        <CircleCheck
          className="size-3.5 text-muted-foreground"
          aria-label="Confirmed on GitHub"
        />
      )}
      {change.verified === false && (
        <TriangleAlert
          className="text-destructive size-3.5"
          aria-label="Not found on GitHub"
        />
      )}
    </span>
  );
}
