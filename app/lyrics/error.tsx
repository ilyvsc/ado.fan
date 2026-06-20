"use client";

import { useEffect } from "react";

export default function LyricsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <p className="text-sm text-muted-foreground">Failed to load lyrics</p>
      <button type="button"
        onClick={reset}
        className="rounded-lg bg-foreground/8 px-4 py-2 text-sm text-foreground transition-colors hover:bg-foreground/12"
      >
        Try again
      </button>
    </div>
  );
}
