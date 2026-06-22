"use client";

import {
  AlignLeft,
  ArrowRightLeft,
  ChevronDown,
  Columns2,
  LayoutGrid,
  Languages,
  Minus,
  Plus,
  Type,
} from "lucide-react";

import { Suspense, useMemo, useState } from "react";

import { Locale } from "@/i18n/types";
import { cn } from "@/lib/utils";

import { useLyricsUrlState } from "../hooks/useLyricsUrlState";

import type { LyricsViewMode } from "@/features/lyrics/reader/types/states";
import type { LyricsLanguage } from "@/types/lyrics";

const MODE_CONFIG: {
  mode: LyricsViewMode;
  label: string;
  icon: typeof LayoutGrid;
}[] = [
  { mode: "tabs", label: "Tabs", icon: LayoutGrid },
  { mode: "compare", label: "Compare", icon: Columns2 },
  { mode: "lined", label: "Lined", icon: AlignLeft },
];

function ControlPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-foreground/10 bg-background/80",
        "p-1 backdrop-blur-sm transition-colors hover:border-foreground/20",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-200",
        active
          ? "bg-(--theme-color)/80 text-(--theme-contrast)"
          : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function LanguageSelect({
  value,
  onChange,
  languages,
  label,
}: {
  value: string;
  onChange: (code: string) => void;
  languages: LyricsLanguage[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        aria-label={label}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="cursor-pointer appearance-none rounded-full bg-transparent py-2 pr-7 pl-3 text-xs font-semibold text-foreground transition-colors hover:bg-(--theme-color)/10"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      <div
        className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      >
        <ChevronDown className="h-3 w-3" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-muted-foreground/70">
      <LayoutGrid className="h-10 w-10" aria-hidden="true" />
      <p className="text-sm font-medium tracking-widest uppercase">No lyrics</p>
    </div>
  );
}

function LyricsContent({
  language,
  fontSize,
}: {
  language: LyricsLanguage;
  fontSize: number;
}) {
  return (
    <p
      aria-live="polite"
      className={cn(
        language.code === Locale.JAPANESE.code ? "font-jp-sans" : "",
        "leading-loose whitespace-pre-wrap text-foreground transition-all duration-300",
      )}
      style={{ fontSize: fontSize + 2 }}
    >
      {language.content}
    </p>
  );
}

function TabsView({
  activeLang,
  fontSize,
}: {
  activeLang?: LyricsLanguage;
  fontSize: number;
}) {
  if (!activeLang?.content) return <EmptyState />;

  return (
    <div className="mx-auto max-w-3xl text-center">
      <LyricsContent language={activeLang} fontSize={fontSize} />
    </div>
  );
}

function LanguageChip({ label }: { label: string }) {
  return (
    <div className="mb-6 flex justify-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-(--theme-color) px-4 py-1.5 text-xs font-bold tracking-widest text-(--theme-contrast) uppercase shadow-sm ring-1 ring-(--theme-color)/40">
        <Languages className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </span>
    </div>
  );
}

function CompareView({
  leftLang,
  rightLang,
  fontSize,
}: {
  leftLang?: LyricsLanguage;
  rightLang?: LyricsLanguage;
  fontSize: number;
}) {
  return (
    <div className="flex flex-col gap-10 pb-20 sm:grid sm:grid-cols-2 sm:gap-8">
      <div className="border-b border-(--theme-color)/40 pb-8 sm:border-r sm:border-b-0 sm:pr-6 sm:pb-0">
        {leftLang?.content ? (
          <>
            <LanguageChip label={leftLang.label} />
            <LyricsContent language={leftLang} fontSize={fontSize} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      <div className="sm:px-2">
        {rightLang?.content ? (
          <>
            <LanguageChip label={rightLang.label} />
            <LyricsContent language={rightLang} fontSize={fontSize} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function LinedView({
  leftLang,
  rightLang,
  fontSize,
}: {
  leftLang?: LyricsLanguage;
  rightLang?: LyricsLanguage;
  fontSize: number;
}) {
  const pairs = useMemo(() => {
    if (!leftLang?.lines.length || !rightLang?.lines.length) return [];
    const max = Math.max(leftLang.lines.length, rightLang.lines.length);
    return Array.from({ length: max }, (_, i) => ({
      left: leftLang.lines[i] ?? "",
      right: rightLang.lines[i] ?? "",
    }));
  }, [leftLang, rightLang]);

  if (!leftLang || !rightLang || !pairs.length) return <EmptyState />;

  const leftCode = leftLang.code.slice(0, 2).toUpperCase();
  const rightCode = rightLang.code.slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {pairs
        .map((pair, i) => ({ pair, i }))
        .filter(({ pair }) => pair.left || pair.right)
        .map(({ pair, i }) => (
          <div key={`${leftCode}-${rightCode}-${i}`} className="space-y-1">
            {pair.left && (
              <div className="flex items-baseline gap-4">
                <span className="w-6 shrink-0 text-right text-xs font-bold tracking-widest text-(--theme-color)/90 uppercase select-none sm:w-7">
                  {leftCode}
                </span>
                <p
                  className="leading-relaxed text-foreground"
                  style={{ fontSize: fontSize + 2 }}
                >
                  {pair.left}
                </p>
              </div>
            )}
            {pair.right && (
              <div className="flex items-baseline gap-4">
                <span className="w-6 shrink-0 text-right text-xs font-bold tracking-widest text-(--theme-color)/90 uppercase select-none sm:w-7">
                  {rightCode}
                </span>
                <p
                  className="leading-relaxed text-muted-foreground"
                  style={{ fontSize: fontSize + 2 }}
                >
                  {pair.right}
                </p>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

function LyricsModes({
  availableLanguages,
}: {
  availableLanguages: LyricsLanguage[];
}) {
  const [fontSize, setFontSize] = useState(16);
  const { state, languages, setMode, setLeft, setRight, swapLanguages } =
    useLyricsUrlState({ availableLanguages });

  if (!languages.length) return <EmptyState />;

  const viewMode: LyricsViewMode = languages.length === 1 ? "tabs" : state.mode;

  const leftLang = languages.find((l) => l.code === state.left);
  const rightLang = languages.find((l) => l.code === state.right);

  return (
    <section aria-labelledby="lyrics-heading" className="relative">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-foreground/20 pb-6">
        <h3
          id="lyrics-heading"
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Lyrics
        </h3>

        <div
          className="flex flex-wrap items-center gap-2"
          role="toolbar"
          aria-label="Lyrics view controls"
        >
          {languages.length > 1 && (
            <ControlPill>
              {MODE_CONFIG.map(({ mode, label, icon: Icon }) => (
                <PillButton
                  key={mode}
                  active={viewMode === mode}
                  title={label}
                  onClick={() => {
                    setMode(mode);
                  }}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className={viewMode === mode ? undefined : "sr-only"}>
                    {label}
                  </span>
                </PillButton>
              ))}
            </ControlPill>
          )}

          <ControlPill>
            <button
              type="button"
              onClick={() => {
                setFontSize((s) => Math.max(12, s - 2));
              }}
              aria-label="Decrease font size"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--theme-color)/50 focus-visible:outline-none"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1 px-1">
              <Type className="h-3 w-3 text-muted-foreground" />
              <span className="min-w-6 text-center text-xs font-medium text-muted-foreground tabular-nums select-none">
                {fontSize}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setFontSize((s) => Math.min(32, s + 2));
              }}
              aria-label="Increase font size"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--theme-color)/50 focus-visible:outline-none"
            >
              <Plus className="h-4 w-4" />
            </button>
          </ControlPill>

          {viewMode !== "tabs" && languages.length > 1 && (
            <ControlPill>
              <LanguageSelect
                value={state.left}
                onChange={setLeft}
                languages={languages}
                label="Left language"
              />
              <button
                type="button"
                onClick={swapLanguages}
                aria-label="Swap languages"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-(--theme-color)/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-(--theme-color)/50 focus-visible:outline-none"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 transition-transform duration-200 active:rotate-180" />
              </button>
              <LanguageSelect
                value={state.right}
                onChange={setRight}
                languages={languages}
                label="Right language"
              />
            </ControlPill>
          )}

          {viewMode === "tabs" && (
            <ControlPill>
              {languages.map((lang) => (
                <PillButton
                  key={lang.code}
                  active={state.left === lang.code}
                  onClick={() => {
                    setLeft(lang.code);
                  }}
                >
                  {lang.label}
                </PillButton>
              ))}
            </ControlPill>
          )}
        </div>
      </div>

      <div key={viewMode} className="transition-opacity duration-300">
        {viewMode === "tabs" && (
          <TabsView activeLang={leftLang} fontSize={fontSize} />
        )}
        {viewMode === "compare" && (
          <CompareView
            leftLang={leftLang}
            rightLang={rightLang}
            fontSize={fontSize}
          />
        )}
        {viewMode === "lined" && (
          <LinedView leftLang={leftLang} rightLang={rightLang} fontSize={fontSize} />
        )}
      </div>
    </section>
  );
}

export function SongLyricsModes({
  availableLanguages,
}: {
  availableLanguages: LyricsLanguage[];
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-80 items-center justify-center text-muted-foreground/70">
          Loading lyrics...
        </div>
      }
    >
      <LyricsModes availableLanguages={availableLanguages} />
    </Suspense>
  );
}
