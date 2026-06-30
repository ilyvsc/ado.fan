"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-3xl font-bold text-ado-primary uppercase md:text-4xl">
        Something broke
      </h1>
      <p className="max-w-sm text-base text-muted-foreground">
        We couldn't load the lyrics. Try again in a minute.
      </p>
      <Button
        className="h-11 bg-ado-primary text-base font-semibold text-foreground hover:bg-ado-primary/80"
        onClick={reset}
      >
        Try again
      </Button>
    </div>
  );
}
