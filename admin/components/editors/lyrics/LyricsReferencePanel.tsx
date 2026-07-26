"use client";

import { cn } from "@/lib/utils";
import { Locale } from "@/shared/i18n/types";

export function LyricsReferencePanel({
  lines,
  language,
}: {
  lines: string[];
  language?: string;
}) {
  const isJapaneseLanguage = language === Locale.JAPANESE.code;

  if (lines.length === 0)
    return (
      <span className="text-sm leading-6 text-foreground">No lines saved yet</span>
    );

  return (
    <div className="flex overflow-hidden rounded-md border bg-background/80">
      <div
        aria-hidden
        className="shrink-0 border-r border-ado-secondary p-3 text-right font-mono text-xs leading-6 text-muted-foreground select-none"
      >
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="min-w-0 flex-1 overflow-x-auto p-3">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "text-sm leading-6 whitespace-pre text-foreground",
              isJapaneseLanguage ? "font-jp-sans" : "font-sans",
            )}
          >
            {line || <span className="invisible select-none">{"\u00A0"}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
