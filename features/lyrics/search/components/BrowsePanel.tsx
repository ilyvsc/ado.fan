"use client";

import { Music } from "lucide-react";

import { useEffect, useRef } from "react";

import { HorizontalSongScroller } from "./HorizontalSongScroller";
import { LyricsSongDisplay } from "./LyricsSongDisplay";
import { RecommendedSongs } from "./RecommendedSongs";

import type { SongListItem, SongSortOption } from "@/types/song";

interface BrowsePanelProps {
  recentSongs: SongListItem[];
  recommended: { latest: SongListItem[]; random: SongListItem[] };
  display: {
    visible: SongListItem[];
    hasMore: boolean;
    setupObserver: (element: HTMLElement | null) => void;
  };
  viewMode: "grid" | "list";
  sort: SongSortOption;
  selectedYear: number | null;
  showSaved: boolean;
  showLetterGroups: boolean;
  totalCount: number;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  enabled: boolean;
}

export function BrowsePanel({
  recentSongs,
  recommended,
  display,
  viewMode,
  sort,
  selectedYear,
  showSaved,
  showLetterGroups,
  totalCount,
  favorites,
  onToggleFavorite,
  enabled,
}: BrowsePanelProps) {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = loadingRef.current;
    if (!element || !display.hasMore || !enabled) return;
    display.setupObserver(element);
  }, [display, display.hasMore, enabled]);

  return (
    <>
      <HorizontalSongScroller title="Recently Viewed" songs={recentSongs} />
      <RecommendedSongs latest={recommended.latest} random={recommended.random} />

      {display.visible.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-muted-foreground">
          <Music aria-hidden="true" className="mb-4 h-10 w-10 opacity-20" />
          <p className="text-sm">
            {showSaved ? "No saved songs yet" : "No songs found"}
          </p>
        </div>
      ) : (
        <>
          <LyricsSongDisplay
            key={`${sort}-${selectedYear}-${showSaved}`}
            songs={display.visible}
            viewMode={viewMode}
            totalCount={totalCount}
            showLetterGroups={showLetterGroups}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />

          {display.hasMore && (
            <div ref={loadingRef} className="flex min-h-20 justify-center py-8" />
          )}
        </>
      )}
    </>
  );
}
