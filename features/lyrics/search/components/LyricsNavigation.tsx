"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowUp01,
  CalendarDays,
  Check,
  Grid,
  Heart,
  List,
  Search,
  Shuffle,
  X,
  type LucideIcon,
} from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

import { ThemeSelectorButton } from "@/shared/components/themes/ThemeButton";
import { ThemeSelectorDialog } from "@/shared/components/themes/ThemeSelector";
import { cn } from "@/shared/lib/utils";

import type { SongSortOption } from "@/types/song";

const SORT_OPTIONS: {
  value: SongSortOption;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "az", label: "A → Z", icon: ArrowDownAZ },
  { value: "za", label: "Z → A", icon: ArrowDownZA },
  { value: "newest", label: "Newest", icon: ArrowDown01 },
  { value: "oldest", label: "Oldest", icon: ArrowUp01 },
];

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [ref, open, onClose]);
}

function ViewModeToggle({
  viewMode,
  onViewModeChange,
  className,
}: {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex rounded-lg border border-foreground/8 bg-foreground/4 p-0.5",
        className,
      )}
    >
      <button
        onClick={() => {
          onViewModeChange("grid");
        }}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-all",
          viewMode === "grid"
            ? "bg-ado-primary text-ado-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        title="Grid view"
      >
        <Grid className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => {
          onViewModeChange("list");
        }}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-all",
          viewMode === "list"
            ? "bg-ado-primary text-ado-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        title="List view"
      >
        <List className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface LyricsNavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onRandomClick: () => void;
  resultCount?: number;
  sort: SongSortOption;
  onSortChange: (sort: SongSortOption) => void;
  totalCount: number;
  availableYears: number[];
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
  showSaved: boolean;
  onToggleSaved: () => void;
  savedCount: number;
}

export function LyricsNavigation({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onRandomClick,
  resultCount,
  sort,
  onSortChange,
  totalCount,
  availableYears,
  selectedYear,
  onYearChange,
  showSaved,
  onToggleSaved,
  savedCount,
}: LyricsNavigationProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const closeSortMenu = useCallback(() => {
    setSortOpen(false);
  }, []);
  const closeYearMenu = useCallback(() => {
    setYearOpen(false);
  }, []);

  useGSAP(
    () => {
      if (!navRef.current) return;
      gsap.fromTo(
        navRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    },
    { scope: navRef },
  );

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && searchQuery) {
        onSearchChange("");
        inputRef.current?.blur();
      }
      if (
        e.key === "r" &&
        !e.metaKey &&
        !e.ctrlKey &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        e.preventDefault();
        onRandomClick();
      }
    }
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [searchQuery, onSearchChange, onRandomClick]);

  useClickOutside(sortRef, sortOpen, closeSortMenu);
  useClickOutside(yearRef, yearOpen, closeYearMenu);

  const currentSort = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0];

  if (!currentSort) return null;

  const SortIcon = currentSort.icon;

  return (
    <nav
      ref={navRef}
      id="lyrics-nav"
      className="sticky top-0 z-50 border-b border-foreground/5 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-2 py-3">
          <div className="group relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              placeholder="Search songs…"
              className="h-8 w-full rounded-lg border border-foreground/8 bg-foreground/4 px-10 text-sm text-foreground transition-all placeholder:text-muted-foreground/40 hover:border-foreground/12 focus:border-foreground/20 focus:bg-background focus:ring-2 focus:ring-ado-primary/10 focus:outline-none md:h-10"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  onSearchChange("");
                }}
                className="absolute top-1/2 right-2.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/8 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-foreground/10 px-1.5 py-0.5 font-mono text-xs text-muted-foreground/30 select-none sm:block">
                /
              </kbd>
            )}
          </div>

          <div className="flex items-center gap-1 sm:hidden">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />

            <ThemeSelectorButton
              onClick={() => {
                setThemeDialogOpen(true);
              }}
              className="h-8 w-8 border-foreground/8 bg-foreground/4 hover:bg-foreground/8"
            />
          </div>
        </div>

        <div className="flex items-center justify-center border-t border-foreground/5 py-2 lg:justify-between">
          <div className="hidden items-center md:flex">
            {resultCount !== undefined && searchQuery ? (
              <span className="text-xs text-muted-foreground">
                {resultCount} {resultCount === 1 ? "result" : "results"}
              </span>
            ) : (
              <span className="text-xs font-medium tracking-widest text-foreground/25 uppercase">
                Lyrics · {totalCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleSaved}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors",
                showSaved
                  ? "bg-ado-primary/70 text-ado-primary-foreground"
                  : "text-muted-foreground hover:bg-foreground/6 hover:text-foreground",
              )}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5",
                  showSaved ? "fill-ado-primary-foreground" : "",
                )}
              />
              <span>Saved</span>
              {savedCount > 0 && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    showSaved
                      ? "bg-ado-primary"
                      : "bg-foreground/8 text-muted-foreground",
                  )}
                >
                  {savedCount}
                </span>
              )}
            </button>

            <div
              ref={yearRef}
              className="relative"
              onKeyDown={(e) => {
                if (e.key === "Escape" && yearOpen) {
                  e.stopPropagation();
                  setYearOpen(false);
                }
              }}
            >
              <button
                onClick={() => {
                  setYearOpen((o) => !o);
                }}
                aria-expanded={yearOpen}
                aria-haspopup="listbox"
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors",
                  selectedYear !== null
                    ? "bg-ado-primary/70 text-ado-primary-foreground"
                    : "text-muted-foreground hover:bg-foreground/6 hover:text-foreground",
                )}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Year</span>
                {selectedYear !== null && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-ado-primary-foreground" />
                    <span>{selectedYear}</span>
                  </>
                )}
              </button>

              {yearOpen && (
                <div
                  role="listbox"
                  aria-label="Filter by year"
                  className="absolute top-full left-0 z-50 mt-1 max-h-56 w-18 overflow-y-auto rounded-lg border border-foreground/10 bg-background shadow-lg lg:w-20"
                >
                  <button
                    role="option"
                    aria-selected={selectedYear === null}
                    onClick={() => {
                      onYearChange(null);
                      setYearOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 p-2 text-left text-xs transition-colors hover:bg-foreground/5"
                  >
                    <span
                      className={
                        selectedYear === null
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      All
                    </span>
                    {selectedYear === null && (
                      <Check className="h-3 w-3 shrink-0 text-ado-primary" />
                    )}
                  </button>
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      role="option"
                      aria-selected={selectedYear === year}
                      onClick={() => {
                        onYearChange(year);
                        setYearOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-2 p-2 text-left text-xs transition-colors hover:bg-foreground/5"
                    >
                      <span
                        className={
                          selectedYear === year
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {year}
                      </span>
                      {selectedYear === year && (
                        <Check className="h-3 w-3 shrink-0 text-ado-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              ref={sortRef}
              className="relative"
              onKeyDown={(e) => {
                if (e.key === "Escape" && sortOpen) {
                  e.stopPropagation();
                  setSortOpen(false);
                }
              }}
            >
              <button
                onClick={() => {
                  setSortOpen((o) => !o);
                }}
                aria-expanded={sortOpen}
                aria-haspopup="listbox"
                className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
              >
                <SortIcon className="h-3.5 w-3.5" />
                <span>{currentSort.label}</span>
              </button>

              {sortOpen && (
                <div
                  role="listbox"
                  aria-label="Sort order"
                  className="absolute top-full right-0 z-50 mt-1 min-w-32 overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-lg"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      role="option"
                      aria-selected={sort === option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setSortOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-3 p-2 text-left text-xs transition-colors hover:bg-foreground/5"
                    >
                      <span className="flex items-center gap-2">
                        <option.icon
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            sort === option.value
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        />
                        <span
                          className={
                            sort === option.value
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {option.label}
                        </span>
                      </span>
                      {sort === option.value && (
                        <Check className="h-3 w-3 shrink-0 text-ado-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onRandomClick}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground md:px-2"
              title="Random song (R)"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span>Random</span>
            </button>

            <div className="hidden h-4 w-px bg-foreground/10 sm:block" />

            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              className="hidden sm:flex"
            />

            <ThemeSelectorButton
              onClick={() => {
                setThemeDialogOpen(true);
              }}
              className="hidden h-8 w-8 border-foreground/8 bg-foreground/4 hover:bg-foreground/8 sm:flex"
            />
          </div>
        </div>
      </div>

      <ThemeSelectorDialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen} />
    </nav>
  );
}
