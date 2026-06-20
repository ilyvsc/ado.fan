"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ChevronUp, Loader2, Music, Search } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AlphabetStrip } from "@/features/lyrics/search/components/AlphabetStrip";
import { LyricsNavigation } from "@/features/lyrics/search/components/LyricsNavigation";
import { LyricsSongDisplay } from "@/features/lyrics/search/components/LyricsSongDisplay";
import { RecentlyViewed } from "@/features/lyrics/search/components/RecentlyViewed";
import { RecommendedSongs } from "@/features/lyrics/search/components/RecommendedSongs";
import { useDisplayPagination } from "@/features/lyrics/search/hooks/useDisplayPagination";
import { useFavorites } from "@/features/lyrics/search/hooks/useFavorites";
import { useRecentlyViewed } from "@/features/lyrics/search/hooks/useRecentlyViewed";
import { useSongSearch } from "@/features/lyrics/search/hooks/useSongSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";

import { getRandomSongId } from "./actions";

import type { SongListItem, SongSortOption } from "@/types/song";

gsap.registerPlugin(ScrollToPlugin);

interface LyricsPageClientProps {
  recommended: {
    latest: SongListItem[];
    random: SongListItem[];
  };
  allSongs: SongListItem[];
}

function sortSongs<T extends { title: { english: string }; releaseDate: string }>(
  songs: T[],
  sort: SongSortOption,
): T[] {
  const copy = [...songs];
  switch (sort) {
    case "za":
      return copy.sort((a, b) => b.title.english.localeCompare(a.title.english));
    case "newest":
      return copy.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      );
    case "oldest":
      return copy.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );
    default:
      return copy.sort((a, b) => a.title.english.localeCompare(b.title.english));
  }
}

function applySortAndFilter(
  songs: SongListItem[],
  sort: SongSortOption,
  year: number | null,
): SongListItem[] {
  const filtered = year
    ? songs.filter((s) => new Date(s.releaseDate).getFullYear() === year)
    : songs;
  return sortSongs(filtered, sort);
}

export function LyricsPageClient({ recommended, allSongs }: LyricsPageClientProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const loadingRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [randomError, setRandomError] = useState(false);

  const searchParams = useSearchParams();

  const [viewModeOverride, setViewMode] = useState<"grid" | "list" | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");

  const [sort, setSort] = useState<SongSortOption>(() => {
    const sort = searchParams.get("sort");
    return sort === "za" || sort === "newest" || sort === "oldest" ? sort : "az";
  });

  const [selectedYear, setSelectedYear] = useState<number | null>(() => {
    const year = searchParams.get("year");
    const number = year ? Number(year) : null;
    return number && !isNaN(number) ? number : null;
  });

  const [showSaved, setShowSaved] = useState(() => searchParams.get("saved") === "1");

  const { favoriteIds, toggleFavorite } = useFavorites();
  const { recentIds } = useRecentlyViewed();

  const deferredQuery = useDeferredValue(searchQuery);
  const search = useSongSearch(deferredQuery);
  const viewMode = viewModeOverride ?? (isMobile ? "list" : "grid");

  useEffect(() => {
    let frame: number;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setShowScrollTop(window.scrollY > 300);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (sort !== "az") params.set("sort", sort);
      if (selectedYear !== null) params.set("year", String(selectedYear));
      if (showSaved) params.set("saved", "1");
      const search = params.toString();
      const current = window.location.search.replace(/^\?/, "");
      if (search !== current) {
        window.history.replaceState(
          null,
          "",
          search ? `/lyrics?${search}` : "/lyrics",
        );
      }
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, sort, selectedYear, showSaved]);

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

  useEffect(() => {
    const element = loadingRef.current;
    if (!element || !display.hasMore || deferredQuery) return;
    display.setupObserver(element);
  }, [display, display.hasMore, deferredQuery]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

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
        onSearchChange={handleSearchChange}
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
          <RecentlyViewed songs={recentSongs} />

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
                totalCount={
                  selectedYear || showSaved ? filteredSongs.length : allSongs.length
                }
                showLetterGroups={showLetterGroups}
                favorites={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />

              {display.hasMore && (
                <div ref={loadingRef} className="flex min-h-20 justify-center py-8" />
              )}
            </>
          )}
        </Activity>

        <Activity mode={deferredQuery ? "visible" : "hidden"}>
          {search.loading || deferredQuery !== searchQuery ? (
            <div className="flex flex-col items-center py-20 text-muted-foreground">
              <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin" />
              <p className="mt-3 text-sm">Searching...</p>
            </div>
          ) : sortedSearchResults.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-muted-foreground">
              <Search aria-hidden="true" className="mb-4 h-10 w-10 opacity-20" />
              <p className="text-sm">No results for &quot;{deferredQuery}&quot;</p>
              <button
                type="button"
                onClick={() => {
                  handleSearchChange("");
                }}
                className="mt-3 text-xs text-ado-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <LyricsSongDisplay
              key={`search-${sort}`}
              songs={sortedSearchResults}
              viewMode={viewMode}
              favorites={favoriteIds}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </Activity>
      </main>

      {randomError && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-foreground/10 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
        >
          Couldn't load a random song. Try again.
        </div>
      )}

      {showScrollTop && (
        <button
          type="button"
          onClick={() => {
            const prefersReduced = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;
            gsap.to(window, {
              scrollTo: { y: 0, autoKill: false },
              duration: prefersReduced ? 0 : 0.6,
              ease: "power3.out",
            });
          }}
          aria-label="Scroll to top"
          className="fixed right-6 bottom-6 flex h-9 w-9 items-center justify-center rounded-full bg-foreground/8 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-foreground/12 hover:text-foreground"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
