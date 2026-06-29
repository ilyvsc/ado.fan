"use client";

import { Columns2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { adminGetSongLyrics } from "@/admin/actions/songs";
import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { getLanguageLabel, type LyricsEntry } from "@/types/lyrics";

import { LyricsEntryEditor } from "./lyrics/LyricsEntryEditor";
import { LanguageDialog } from "./lyrics/LyricsLanguageDialog";

export function SongLyricsEditor({ songId }: { songId: string }) {
  const [entries, setEntries] = useState<LyricsEntry[] | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [referenceLang, setReferenceLang] = useState<string | null>(null);

  useEffect(() => {
    void adminGetSongLyrics(songId).then((data) => {
      setEntries(data);
      if (data.length > 0 && data[0]) setActiveLanguage(data[0].language);
    });
  }, [songId]);

  const handleAdd = useCallback((language: string) => {
    setEntries((prev) => [
      ...(prev ?? []),
      { language, translator: null, lines: [] },
    ]);
    setActiveLanguage(language);
  }, []);

  const handleSaved = useCallback((updated: LyricsEntry) => {
    setEntries((prev) =>
      (prev ?? []).map((e) => (e.language === updated.language ? updated : e)),
    );
  }, []);

  const handleDeleted = useCallback((language: string) => {
    setEntries((prev) => {
      const next = (prev ?? []).filter((e) => e.language !== language);
      setActiveLanguage((cur) =>
        cur === language ? (next[0]?.language ?? null) : cur,
      );
      return next;
    });
  }, []);

  const toggleCompare = () => {
    const next = !compareMode;
    setCompareMode(next);
    if (next && referenceLang === null && entries) {
      const other = entries.find((e) => e.language !== activeLanguage);
      setReferenceLang(other?.language ?? null);
    }
  };

  const activeEntry = entries?.find((e) => e.language === activeLanguage);
  const compareEntry =
    compareMode && referenceLang
      ? entries?.find((e) => e.language === referenceLang)
      : undefined;
  const existingLanguages = useMemo(
    () => entries?.map((e) => e.language) ?? [],
    [entries],
  );

  if (entries === null) {
    return (
      <div className="flex min-h-64 w-full flex-col gap-4 rounded-lg border border-foreground/12 bg-foreground/2 p-4">
        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
          Lyrics
        </p>
        <TypographyMuted className="text-muted-foreground/50">
          Loading…
        </TypographyMuted>
      </div>
    );
  }

  return (
    <div className="flex min-h-64 w-full flex-col gap-4 rounded-lg border border-foreground/12 bg-foreground/2 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
          Lyrics
        </p>
        <div className="flex items-center gap-1.5">
          {entries.length >= 2 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleCompare}
              className={cn(
                "h-6 gap-1.5 rounded-md px-2 text-xs",
                compareMode
                  ? "bg-ado-primary/10 text-ado-primary hover:bg-ado-primary/20"
                  : "text-muted-foreground/50 hover:text-foreground",
              )}
            >
              <Columns2 className="size-3" />
              Compare
            </Button>
          )}
          <LanguageDialog existing={existingLanguages} onAdd={handleAdd} />
        </div>
      </div>

      {entries.length === 0 ? (
        <TypographyMuted className="text-muted-foreground/50">
          No lyrics yet. Add a language to get started.
        </TypographyMuted>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <div className="flex min-w-0 scrollbar-none items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {entries.map((entry) => (
                <button
                  key={entry.language}
                  type="button"
                  onClick={() => {
                    setActiveLanguage(entry.language);
                  }}
                  className={cn(
                    "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    activeLanguage === entry.language
                      ? "bg-ado-primary text-ado-primary-foreground"
                      : "text-muted-foreground hover:bg-foreground/8 hover:text-foreground",
                  )}
                >
                  {getLanguageLabel(entry.language)}
                </button>
              ))}
            </div>
            {compareMode && entries.length >= 2 && (
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-xs text-muted-foreground/40">
                  Compare with
                </span>
                <div className="flex gap-1">
                  {entries
                    .filter((e) => e.language !== activeLanguage)
                    .map((e) => (
                      <button
                        key={e.language}
                        type="button"
                        onClick={() => {
                          setReferenceLang(e.language);
                        }}
                        className={cn(
                          "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                          referenceLang === e.language
                            ? "bg-foreground/10 text-foreground ring-1 ring-foreground/20 ring-inset"
                            : "text-muted-foreground/50 hover:bg-foreground/5 hover:text-foreground",
                        )}
                      >
                        {getLanguageLabel(e.language)}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {activeEntry && (
            <LyricsEntryEditor
              key={activeEntry.language}
              entry={activeEntry}
              songId={songId}
              compareEntry={compareEntry}
              onSaved={handleSaved}
              onDeleted={handleDeleted}
            />
          )}
        </>
      )}
    </div>
  );
}
