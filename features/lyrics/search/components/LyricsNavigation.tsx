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

import { useEffect, useRef, useState } from "react";

import { ThemeSelectorButton } from "@/components/themes/ThemeButton";
import { ThemeSelectorDialog } from "@/components/themes/ThemeSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
        type="button"
        onClick={() => {
          onViewModeChange("grid");
        }}
        aria-label="Grid view"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-all",
          viewMode === "grid"
            ? "bg-ado-primary text-ado-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Grid aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => {
          onViewModeChange("list");
        }}
        aria-label="List view"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-all",
          viewMode === "list"
            ? "bg-ado-primary text-ado-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <List aria-hidden="true" className="h-3.5 w-3.5" />
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
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);

  useGSAP(
    () => {
      if (!navRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        navRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    },
    { scope: navRef, dependencies: [] },
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
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              aria-label="Search songs"
              placeholder="Search songs…"
              className="h-8 w-full rounded-lg border border-foreground/8 bg-foreground/4 px-10 text-sm text-foreground transition-all placeholder:text-muted-foreground/40 hover:border-foreground/12 focus:border-foreground/20 focus:bg-background focus:ring-2 focus:ring-ado-primary/10 focus:outline-none md:h-10"
            />
            {searchQuery ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  onSearchChange("");
                }}
                className="absolute top-1/2 right-2.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/8 hover:text-foreground"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
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
              type="button"
              onClick={onToggleSaved}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors",
                showSaved
                  ? "bg-ado-primary/70 text-ado-primary-foreground"
                  : "text-muted-foreground hover:bg-foreground/6 hover:text-foreground",
              )}
            >
              <Heart
                aria-hidden="true"
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors",
                    selectedYear !== null
                      ? "bg-ado-primary/70 text-ado-primary-foreground"
                      : "text-muted-foreground hover:bg-foreground/6 hover:text-foreground",
                  )}
                  aria-label="Filter by year"
                >
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Year</span>
                  {selectedYear !== null && (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-ado-primary-foreground"
                      />
                      <span>{selectedYear}</span>
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-56 w-20 overflow-y-auto"
              >
                <DropdownMenuItem
                  onSelect={() => {
                    onYearChange(null);
                  }}
                  className="justify-between"
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
                    <Check
                      aria-hidden="true"
                      className="h-3 w-3 shrink-0 text-ado-primary"
                    />
                  )}
                </DropdownMenuItem>
                {availableYears.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onSelect={() => {
                      onYearChange(year);
                    }}
                    className="justify-between"
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
                      <Check
                        aria-hidden="true"
                        className="h-3 w-3 shrink-0 text-ado-primary"
                      />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground"
                  aria-label="Sort order"
                >
                  <SortIcon aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{currentSort.label}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-32">
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onSelect={() => {
                      onSortChange(option.value);
                    }}
                    className="justify-between gap-3"
                  >
                    <span className="flex items-center gap-2">
                      <option.icon
                        aria-hidden="true"
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
                      <Check
                        aria-hidden="true"
                        className="h-3 w-3 shrink-0 text-ado-primary"
                      />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              type="button"
              onClick={onRandomClick}
              aria-label="Random song (keyboard shortcut: R)"
              className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground md:px-2"
            >
              <Shuffle aria-hidden="true" className="h-3.5 w-3.5" />
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
