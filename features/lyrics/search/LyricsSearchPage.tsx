"use client";

import { useRouter } from "next/navigation";
import { Activity, useCallback, useDeferredValue, useMemo, useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

import { cn } from "@/lib/utils";

import { getRandomSongId } from "./actions";

import { AlphabetStrip } from "./components/AlphabetStrip";
import { BrowsePanel } from "./components/BrowsePanel";
import { LyricsNavigation } from "./components/LyricsNavigation";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { SearchResultsPanel } from "./components/SearchResultsPanel";

import { useDisplayPagination } from "./hooks/useDisplayPagination";
import { useSearchFilters } from "./hooks/useSearchFilters";
import { useSongSearch } from "./hooks/useSongSearch";
import { useFavorites } from "../hooks/useFavorites";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

import { applySortAndFilter, sortSongs } from "./utils/sort";

import type { SongListItem } from "@/types/song";

interface LyricsSearchPageProps {
  recommended: {
    latest: SongListItem[];
    random: SongListItem[];
  };
  allSongs: SongListItem[];
}

export function LyricsSearchPage({ recommended, allSongs }: LyricsSearchPageProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [viewModeOverride, setViewMode] = useState<"grid" | "list" | null>(null);
  const [randomError, setRandomError] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    sort,
    setSort,
    selectedYear,
    setSelectedYear,
    showSaved,
    setShowSaved,
  } = useSearchFilters();

  const { favoriteIds, toggleFavorite } = useFavorites();
  const { recentIds } = useRecentlyViewed();

  const deferredQuery = useDeferredValue(searchQuery);
  const search = useSongSearch(deferredQuery);
  const viewMode = viewModeOverride ?? (isMobile ? "list" : "grid");

  const availableYears = useMemo(
    () =>
      [
        ...new Set(allSongs.map((s) => new Date(s.releaseDate).getFullYear())),
      ].toSorted((a, b) => a - b),
    [allSongs],
  );

  const recentSongs = useMemo(
    () =>
      recentIds
        .map((id) => allSongs.find((s) => s.id === id))
        .filter((s): s is SongListItem => s !== undefined),
    [recentIds, allSongs],
  );

  const baseList = useMemo(
    () => (showSaved ? allSongs.filter((s) => favoriteIds.has(s.id)) : allSongs),
    [allSongs, showSaved, favoriteIds],
  );

  const filteredSongs = useMemo(
    () => applySortAndFilter(baseList, sort, selectedYear),
    [baseList, sort, selectedYear],
  );

  const sortedSearchResults = useMemo(
    () => sortSongs(search.results, sort),
    [search.results, sort],
  );

  const display = useDisplayPagination(filteredSongs);

  const showLetterGroups = !deferredQuery && sort === "az";

  const activeLetters = useMemo(() => {
    const set = new Set<string>();
    for (const s of filteredSongs) {
      const first = s.title.english[0];
      if (!first) continue;
      set.add(/\d/.test(first) ? "#" : first.toUpperCase());
    }
    return set;
  }, [filteredSongs]);

  const handleRandomClick = useCallback(async () => {
    setRandomError(false);
    try {
      const songId = await getRandomSongId();
      if (songId) router.push(`/lyrics/${songId}`);
    } catch {
      setRandomError(true);
      setTimeout(() => {
        setRandomError(false);
      }, 3000);
    }
  }, [router]);

  const browseTotalCount =
    selectedYear || showSaved ? filteredSongs.length : allSongs.length;

  return (
    <div className="min-h-screen bg-background">
      <h1 className="sr-only">Ado Song Lyrics</h1>
      <div aria-live="polite" className="sr-only">
        {deferredQuery
          ? `${sortedSearchResults.length} result${sortedSearchResults.length === 1 ? "" : "s"} for ${deferredQuery}`
          : undefined}
      </div>
      <LyricsNavigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRandomClick={() => {
          void handleRandomClick();
        }}
        resultCount={deferredQuery ? sortedSearchResults.length : undefined}
        sort={sort}
        onSortChange={setSort}
        totalCount={allSongs.length}
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        showSaved={showSaved}
        onToggleSaved={() => {
          setShowSaved((v) => !v);
        }}
        savedCount={favoriteIds.size}
      />

      {showLetterGroups && (
        <AlphabetStrip activeLetters={activeLetters} onShowAll={display.showAll} />
      )}

      <main
        className={cn(
          "mx-auto max-w-7xl px-4 py-6",
          showLetterGroups ? "sm:pr-14 sm:pl-6" : "sm:px-6",
        )}
      >
        <Activity mode={deferredQuery ? "hidden" : "visible"}>
          <BrowsePanel
            recentSongs={recentSongs}
            recommended={recommended}
            display={display}
            viewMode={viewMode}
            sort={sort}
            selectedYear={selectedYear}
            showSaved={showSaved}
            showLetterGroups={showLetterGroups}
            totalCount={browseTotalCount}
            favorites={favoriteIds}
            onToggleFavorite={toggleFavorite}
            enabled={!deferredQuery}
          />
        </Activity>

        <Activity mode={deferredQuery ? "visible" : "hidden"}>
          <SearchResultsPanel
            loading={search.loading || deferredQuery !== searchQuery}
            query={deferredQuery}
            results={sortedSearchResults}
            sort={sort}
            viewMode={viewMode}
            favorites={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onClear={() => {
              setSearchQuery("");
            }}
          />
        </Activity>
      </main>

      {randomError && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-foreground/10 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
        >
          Couldn&apos;t load a random song. Try again.
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
}
