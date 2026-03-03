"use client";

import {
  AlignLeft,
  ArrowRightLeft,
  ChevronDown,
  Columns2,
  LayoutGrid,
} from "lucide-react";

import { Suspense, useMemo, useState } from "react";

import { useLyricsUrlState } from "../hooks/useLyricsUrlState";

import type { LyricsViewMode } from "@/features/lyrics/types/states";
import { cn } from "@/lib/utils";
import type { Language } from "@/types/lyrics";

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
        "flex items-center rounded-full border border-(--theme-color)/25 bg-background/80",
        "p-1 backdrop-blur-sm transition-colors hover:border-(--theme-color)/40",
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
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200",
        active
          ? "bg-(--theme-color) text-(--theme-contrast)"
          : "text-muted-foreground hover:bg-(--theme-color)/10 hover:text-foreground",
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
        className="cursor-pointer appearance-none rounded-full bg-transparent py-1.5 pr-7 pl-3 text-xs font-semibold text-foreground transition-colors hover:bg-(--theme-color)/10"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 opacity-40">
        <ChevronDown className="h-3 w-3" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-muted-foreground/40">
      <LayoutGrid className="h-10 w-10" />
      <p className="text-sm font-medium tracking-widest uppercase">No lyrics</p>
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
      aria-live="polite"
      className="font-sans leading-loose whitespace-pre-wrap text-foreground transition-all duration-300"
      style={{ fontSize: `${fontSize + 2}px` }}
    >
      {content}
    </p>
  );
}

function TabsView({
  activeLang,
  fontSize,
}: {
  activeLang?: Language;
  fontSize: number;
}) {
  if (!activeLang?.content) return <EmptyState />;

  return (
    <div className="mx-auto max-w-3xl text-center">
      <LyricsContent content={activeLang.content} fontSize={fontSize} />
    </div>
  );
}

function CompareView({
  leftLang,
  rightLang,
  fontSize,
}: {
  leftLang?: Language;
  rightLang?: Language;
  fontSize: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-8 pb-20">
      <div className="border-r border-(--theme-color)/25 px-6">
        {leftLang?.content ? (
          <>
            <div className="mb-8 flex items-center gap-2">
              <span className="h-px flex-1 bg-(--theme-color)/20" />
              <span className="text-xs font-semibold tracking-widest text-(--theme-color)/70 uppercase">
                {leftLang.label}
              </span>
              <span className="h-px flex-1 bg-(--theme-color)/20" />
            </div>
            <LyricsContent content={leftLang.content} fontSize={fontSize} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      <div className="px-6">
        {rightLang?.content ? (
          <>
            <div className="mb-8 flex items-center gap-2">
              <span className="h-px flex-1 bg-(--theme-color)/20" />
              <span className="text-xs font-semibold tracking-widest text-(--theme-color)/70 uppercase">
                {rightLang.label}
              </span>
              <span className="h-px flex-1 bg-(--theme-color)/20" />
            </div>
            <LyricsContent content={rightLang.content} fontSize={fontSize} />
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
  leftLang?: Language;
  rightLang?: Language;
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
        .filter((pair) => pair.left || pair.right)
        .map((pair, i) => (
          <div key={i} className="space-y-1">
            {pair.left && (
              <div className="flex items-baseline gap-4">
                <span className="w-7 shrink-0 text-right text-xs font-bold tracking-widest text-(--theme-color)/60 uppercase select-none">
                  {leftCode}
                </span>
                <p
                  className="leading-relaxed text-foreground"
                  style={{ fontSize: `${fontSize + 2}px` }}
                >
                  {pair.left}
                </p>
              </div>
            )}
            {pair.right && (
              <div className="flex items-baseline gap-4">
                <span className="w-7 shrink-0 text-right text-xs font-bold tracking-widest text-(--theme-color)/60 uppercase select-none">
                  {rightCode}
                </span>
                <p
                  className="leading-relaxed text-muted-foreground"
                  style={{ fontSize: `${fontSize + 2}px` }}
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
  availableLanguages: Language[];
}) {
  const [fontSize, setFontSize] = useState(14);
  const { state, languages, setMode, setLeft, setRight, swapLanguages } =
    useLyricsUrlState({ availableLanguages });

  if (!languages.length) return <EmptyState />;

  const viewMode: LyricsViewMode = languages.length === 1 ? "tabs" : state.mode;

  const leftLang = languages.find((l) => l.code === state.left);
  const rightLang = languages.find((l) => l.code === state.right);
  const activeLang = leftLang;

  const ModeComponent = {
    tabs: <TabsView activeLang={activeLang} fontSize={fontSize} />,
    compare: (
      <CompareView
        leftLang={leftLang}
        rightLang={rightLang}
        fontSize={fontSize}
      />
    ),
    lined: (
      <LinedView
        leftLang={leftLang}
        rightLang={rightLang}
        fontSize={fontSize}
      />
    ),
  }[viewMode];

  return (
    <div className="relative">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-(--theme-color)/25 pb-6">
        <h3 className="text-3xl font-bold tracking-tight text-foreground">
          Lyrics
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {languages.length > 1 && (
            <ControlPill>
              {MODE_CONFIG.map(({ mode, label, icon: Icon }) => (
                <PillButton
                  key={mode}
                  active={viewMode === mode}
                  onClick={() => setMode(mode)}
                >
                  <Icon className="h-4 w-4" />
                  {viewMode === mode && <span>{label}</span>}
                </PillButton>
              ))}
            </ControlPill>
          )}

          <ControlPill>
            <button
              onClick={() => setFontSize((s) => Math.max(10, s - 2))}
              aria-label="Decrease font size"
              className="rounded-full px-2 py-1 text-sm font-bold text-muted-foreground transition-colors hover:bg-(--theme-color)/10 hover:text-foreground"
            >
              A-
            </button>
            <span className="min-w-6 text-center text-xs font-medium text-muted-foreground tabular-nums select-none">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize((s) => Math.min(32, s + 2))}
              aria-label="Increase font size"
              className="rounded-full px-2 py-1 text-sm font-bold text-muted-foreground transition-colors hover:bg-(--theme-color)/10 hover:text-foreground"
            >
              A+
            </button>
          </ControlPill>

          {viewMode !== "tabs" && languages.length > 1 && (
            <ControlPill>
              <LanguageSelect
                value={state.left}
                onChange={setLeft}
                languages={languages}
              />
              <button
                onClick={swapLanguages}
                aria-label="Swap languages"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-(--theme-color)/10 hover:text-foreground"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
              </button>
              <LanguageSelect
                value={state.right}
                onChange={setRight}
                languages={languages}
              />
            </ControlPill>
          )}

          {viewMode === "tabs" && (
            <ControlPill>
              {languages.map((lang) => (
                <PillButton
                  key={lang.code}
                  active={state.left === lang.code}
                  onClick={() => setLeft(lang.code)}
                >
                  {lang.label}
                </PillButton>
              ))}
            </ControlPill>
          )}
        </div>
      </div>

      <div key={viewMode} className="transition-opacity duration-300">
        {ModeComponent}
      </div>
    </div>
  );
}

export function SongLyricsModes({
  availableLanguages,
}: {
  availableLanguages: Language[];
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground/40">
          Loading lyrics...
        </div>
      }
    >
      <LyricsModes availableLanguages={availableLanguages} />
    </Suspense>
  );
}
