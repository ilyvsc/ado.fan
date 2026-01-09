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

import { useState } from "react";

type ViewMode = "tabs" | "split";
type Language = "japanese" | "romaji" | "english";

export function SongLyricsModes({
  japanese,
  romaji,
  english,
}: {
  japanese: string;
  romaji: string;
  english: string;
}) {
  const [activeTab, setActiveTab] = useState<Language>("japanese");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [compareLeft, setCompareLeft] = useState<Language>("japanese");
  const [compareRight, setCompareRight] = useState<Language>("english");
  const [fontSize, setFontSize] = useState(14);

  const tabs = [
    { id: "japanese" as const, label: "日本語", content: japanese },
    { id: "romaji" as const, label: "Romaji", content: romaji },
    { id: "english" as const, label: "English", content: english },
  ];

  const handleLanguageChange = (value: Language, side: "left" | "right") => {
    if (side === "left") {
      if (value === compareRight) setCompareRight(compareLeft);
      setCompareLeft(value);
    } else {
      if (value === compareLeft) setCompareLeft(compareRight);
      setCompareRight(value);
    }
  };

  const swapLanguages = () => {
    setCompareLeft(compareRight);
    setCompareRight(compareLeft);
  };

  const LanguageSelect = ({
    value,
    onChange,
  }: {
    value: Language;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none rounded-full bg-foreground/5 py-1.5 pr-8 pl-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
      >
        {tabs.map((tab) => (
          <option key={tab.id} value={tab.id}>
            {tab.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 opacity-50">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-muted-foreground/60">
      <LayoutGrid className="h-12 w-12 opacity-50" />
      <p className="text-xl font-light tracking-widest uppercase">No lyrics</p>
    </div>
  );

  const LyricsContent = ({
    content,
    fontSize,
    className,
  }: {
    content: string;
    fontSize: number;
    className?: string;
  }) => {
    return (
      <p
        className={`font-sans leading-loose whitespace-pre-wrap text-foreground transition-all duration-300 ${className}`}
        style={{ fontSize: `${fontSize + 2}px` }}
      >
        {content}
      </p>
    );
  };

  return (
    <div className="relative">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-3xl font-bold tracking-tight text-foreground">
          Lyrics
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode === "split" && (
            <div className="group flex items-center gap-1 rounded-full border border-foreground/10 bg-background/50 p-1.5 transition-all hover:border-foreground/20 hover:bg-background/70">
              <LanguageSelect
                value={compareLeft}
                onChange={(e) =>
                  handleLanguageChange(e.target.value as Language, "left")
                }
              />

              <button
                onClick={swapLanguages}
                className="group/swap rounded-full p-2 text-muted-foreground transition-all hover:bg-foreground/10 hover:text-foreground"
                title="Swap languages"
              >
                <ArrowRightLeft className="h-4 w-4 transition-transform duration-300 group-hover/swap:rotate-180" />
              </button>

              <LanguageSelect
                value={compareRight}
                onChange={(e) =>
                  handleLanguageChange(e.target.value as Language, "right")
                }
              />
            </div>
          )}

          {viewMode === "tabs" && (
            <div className="flex items-center gap-1 rounded-full border border-foreground/10 bg-background/50 p-1.5 hover:border-foreground/20 hover:bg-background/70">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-1 rounded-full border border-foreground/10 bg-background/50 px-2 py-1.5 hover:border-foreground/20 hover:bg-background/70">
            {(["tabs", "split"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                  viewMode === mode
                    ? "bg-foreground/10 text-foreground shadow-lg shadow-background/2"
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
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${
                activeTab === tab.id
                  ? "relative z-10 opacity-100"
                  : "pointer-events-none absolute top-0 left-0 w-full opacity-0"
              }`}
            >
              {tab.content ? (
                <div className="mx-auto max-w-3xl text-center">
                  <div className="relative inline-block w-full">
                    <LyricsContent content={tab.content} fontSize={fontSize} />
                  </div>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          ))}
        </div>
      )}

      {viewMode === "split" && (
        <div className="relative grid grid-cols-2 gap-2 pb-32 md:gap-8">
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-muted-foreground/20" />

          {[compareLeft, compareRight].map((languageId, columnIndex) => {
            const selectedTab = tabs.find((tab) => tab.id === languageId)!;

            return (
              <div
                key={`${languageId}-${columnIndex}`}
                className="group relative"
              >
                <div className="mb-8 flex justify-center">
                  <span className="max-w-full truncate text-sm font-bold tracking-widest text-muted-foreground uppercase">
                    {selectedTab.label}
                  </span>
                </div>

                <div className="px-4 md:px-8">
                  {selectedTab.content ? (
                    <LyricsContent
                      content={selectedTab.content}
                      fontSize={fontSize}
                    />
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
