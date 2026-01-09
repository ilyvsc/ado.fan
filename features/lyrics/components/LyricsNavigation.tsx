"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Grid, List, Search, Shuffle, X } from "lucide-react";

import { useEffect, useRef } from "react";

interface LyricsNavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onRandomClick: () => void;
  resultCount?: number;
}

export function LyricsNavigation({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onRandomClick,
  resultCount,
}: LyricsNavigationProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

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
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchQuery, onSearchChange]);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 border-b border-foreground/5 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="group relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search songs..."
              className="h-10 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-9 text-sm text-foreground transition-all placeholder:text-muted-foreground/70 hover:border-foreground/15 focus:border-foreground/20 focus:bg-background focus:ring-2 focus:ring-foreground/5 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {resultCount !== undefined && searchQuery && (
            <div className="hidden rounded-md bg-foreground/5 px-2.5 py-2 text-xs font-medium text-muted-foreground sm:block">
              {resultCount} {resultCount === 1 ? "result" : "results"}
            </div>
          )}

          <button
            onClick={onRandomClick}
            className="flex h-10 items-center gap-2 rounded-lg bg-foreground/5 px-3 text-sm font-medium text-foreground transition-all hover:bg-foreground/10"
            title="Random song"
          >
            <Shuffle className="h-4 w-4" />
            <span className="hidden sm:inline">Random</span>
          </button>

          <div className="flex rounded-lg border border-foreground/10 bg-foreground/5">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`flex h-10 w-10 items-center justify-center rounded-l-lg transition-all ${
                viewMode === "grid"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`flex h-10 w-10 items-center justify-center rounded-r-lg transition-all ${
                viewMode === "list"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
