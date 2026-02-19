"use client";

import {
  ArrowRightLeft,
  ChevronDown,
  Columns2,
  LayoutGrid,
  Minus,
  Plus,
  Type,
} from "lucide-react";

import { Suspense, useState } from "react";

import { useLyricsUrlState } from "../hooks/useLyricsUrlState";

import type { LyricsSearchParams } from "@/features/lyrics/types/states";
import type { Language } from "@/types/lyrics";

function LanguageSelect({
  value,
  onChange,
  languages,
}: {
  value: string;
  onChange: (code: string) => void;
  languages: Language[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full bg-foreground/5 py-1.5 pr-8 pl-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 opacity-50">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-muted-foreground/60">
      <LayoutGrid className="h-12 w-12 opacity-50" />
      <p className="text-xl font-light tracking-widest uppercase">No lyrics</p>
    </div>
  );
}

function LyricsContent({
  content,
  fontSize,
}: {
  content: string;
  fontSize: number;
}) {
  return (
    <p
      className="font-sans leading-loose whitespace-pre-wrap text-foreground transition-all duration-300"
      style={{ fontSize: `${fontSize + 2}px` }}
    >
      {content}
    </p>
  );
}

function SongLyricsModesInner({
  availableLanguages,
}: {
  availableLanguages: Language[];
}) {
  const { state, languages, setMode, setLeft, setRight, swapLanguages } =
    useLyricsUrlState({ availableLanguages });

  const [fontSize, setFontSize] = useState(14);

  const getLanguageByCode = (code: string) =>
    languages.find((l) => l.code === code);

  if (languages.length === 0) return <EmptyState />;

  const viewMode = languages.length === 1 ? "tabs" : state.mode;

  return (
    <div className="relative">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-3xl font-bold tracking-tight text-foreground">
          Lyrics
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode === "compare" && languages.length > 1 && (
            <div className="group flex items-center gap-1 rounded-full border border-foreground/10 bg-background/50 p-1.5 transition-all hover:border-foreground/20 hover:bg-background/70">
              <LanguageSelect
                value={state.left}
                onChange={setLeft}
                languages={languages}
              />
              <button
                onClick={swapLanguages}
                className="group/swap rounded-full p-2 text-muted-foreground transition-all hover:bg-foreground/10 hover:text-foreground"
                title="Swap languages"
              >
                <ArrowRightLeft className="h-4 w-4 transition-transform duration-300 group-hover/swap:rotate-180" />
              </button>
              <LanguageSelect
                value={state.right}
                onChange={setRight}
                languages={languages}
              />
            </div>
          )}

          {viewMode === "tabs" && (
            <div className="flex items-center gap-1 rounded-full border border-foreground/10 bg-background/50 p-1.5 hover:border-foreground/20 hover:bg-background/70">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLeft(lang.code)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                    state.left === lang.code
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}

          {languages.length > 1 && (
            <div className="flex gap-1 rounded-full border border-foreground/10 bg-background/50 px-2 py-1.5 hover:border-foreground/20 hover:bg-background/70">
              {(["tabs", "compare"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setMode(mode)}
                  className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                    viewMode === mode
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {mode === "tabs" ? (
                    <LayoutGrid className="h-4 w-4" />
                  ) : (
                    <Columns2 className="h-4 w-4" />
                  )}
                  <span>{mode === "tabs" ? "Tabs" : "Compare"}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 rounded-full border border-foreground/10 bg-background/50 px-2 py-1.5 hover:border-foreground/20 hover:bg-background/70">
            <button
              onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
              title="Decrease font size"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              <Type className="h-4 w-4 text-muted-foreground" />
              <span className="text-center text-sm font-medium text-muted-foreground">
                {fontSize}
              </span>
            </div>
            <button
              onClick={() => setFontSize(Math.min(32, fontSize + 2))}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
              title="Increase font size"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "tabs" && (
        <div className="relative">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={
                state.left === lang.code
                  ? "relative z-10 opacity-100"
                  : "pointer-events-none absolute top-0 left-0 w-full opacity-0"
              }
            >
              {lang.content ? (
                <div className="mx-auto max-w-3xl text-center">
                  <div className="relative inline-block w-full">
                    <LyricsContent content={lang.content} fontSize={fontSize} />
                  </div>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          ))}
        </div>
      )}

      {viewMode === "compare" && (
        <div className="relative grid grid-cols-2 gap-2 pb-32 md:gap-8">
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-muted-foreground/20" />

          {(["left", "right"] as const).map((side) => {
            const languageCode = side === "left" ? state.left : state.right;
            const lang = getLanguageByCode(languageCode);

            if (!lang)
              return (
                <div key={`empty-${side}`} className="group relative">
                  <EmptyState />
                </div>
              );

            return (
              <div key={`${side}-${languageCode}`} className="group relative">
                <div className="mb-8 flex justify-center">
                  <span className="max-w-full truncate text-sm font-bold tracking-widest text-muted-foreground uppercase">
                    {lang.label}
                  </span>
                </div>
                <div className="px-4 md:px-8">
                  {lang.content ? (
                    <LyricsContent content={lang.content} fontSize={fontSize} />
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SongLyricsModes({
  availableLanguages,
}: {
  availableLanguages: Language[];
  initialSearchParams?: LyricsSearchParams;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Loading lyrics...
          </div>
        </div>
      }
    >
      <SongLyricsModesInner availableLanguages={availableLanguages} />
    </Suspense>
  );
}
