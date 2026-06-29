"use client";

import { cn } from "@/lib/utils";
import { Locale } from "@/shared/i18n/types";

export function LyricsTextarea({
  value,
  onChange,
  placeholder,
  language,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  language?: string;
}) {
  const lineCount = value.split("\n").length;
  const isJapaneseLanguage = language === Locale.JAPANESE.code;

  return (
    <div className="flex overflow-hidden rounded-md border bg-background/80 focus-within:border-ado-primary/60 focus-within:ring-1 focus-within:ring-ado-primary/30">
      <div
        aria-hidden
        className="shrink-0 border-r border-ado-secondary px-3 py-3 text-right font-mono text-xs leading-6 text-muted-foreground select-none"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      <textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        rows={Math.max(14, lineCount + 2)}
        spellCheck={false}
        wrap="off"
        placeholder={placeholder}
        className={cn(
          "min-w-0 flex-1 resize-none overflow-x-auto bg-transparent px-4 py-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground/60",
          isJapaneseLanguage ? "font-jp-sans" : "font-sans",
        )}
      />
    </div>
  );
}
