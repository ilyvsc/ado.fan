"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ChevronUp, Loader2, Music, Search } from "lucide-react";

import { useRouter } from "next/navigation";
import {
  Activity,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
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
  const [isPending, startTransition] = useTransition();
  const [scrollY, setScrollY] = useState(0);

  const [viewModeOverride, setViewMode] = useState<"grid" | "list" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SongSortOption>("az");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const { favoriteIds, toggleFavorite } = useFavorites();
  const { recentIds } = useRecentlyViewed();

  const search = useSongSearch(searchQuery);
  const viewMode = viewModeOverride ?? (isMobile ? "list" : "grid");

  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const availableYears = useMemo(
    () =>
      [...new Set(allSongs.map((s) => new Date(s.releaseDate).getFullYear()))].sort(
        (a, b) => a - b,
      ),
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

  const showLetterGroups = !searchQuery && sort === "az";

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
    if (!element || !display.hasMore || searchQuery) return;
    display.setupObserver(element);
  }, [display, display.hasMore, searchQuery]);

  const handleSearchChange = useCallback((query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  }, []);

  const handleRandomClick = useCallback(async () => {
    const songId = await getRandomSongId();
    if (songId) router.push(`/lyrics/${songId}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <LyricsNavigation
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRandomClick={() => {
          void handleRandomClick();
        }}
        resultCount={searchQuery ? sortedSearchResults.length : undefined}
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
        <Activity mode={searchQuery ? "hidden" : "visible"}>
          <RecentlyViewed songs={recentSongs} />

          <RecommendedSongs latest={recommended.latest} random={recommended.random} />

          {display.visible.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-muted-foreground">
              <Music className="mb-4 h-10 w-10 opacity-20" />
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

        <Activity mode={searchQuery ? "visible" : "hidden"}>
          {search.loading || isPending ? (
            <div className="flex flex-col items-center py-20 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="mt-3 text-sm">Searching...</p>
            </div>
          ) : sortedSearchResults.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-muted-foreground">
              <Search className="mb-4 h-10 w-10 opacity-20" />
              <p className="text-sm">No results for &quot;{searchQuery}&quot;</p>
              <button
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

      {scrollY > 300 && (
        <button
          onClick={() => {
            gsap.to(window, {
              scrollTo: { y: 0, autoKill: false },
              duration: 0.6,
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
