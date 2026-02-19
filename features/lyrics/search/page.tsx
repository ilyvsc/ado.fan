"use client";

import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import {
  Activity,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { getRandomSongId } from "./actions";

import { useIsMobile } from "@/components/ui/use-mobile";
import { LyricsNavigation } from "@/features/lyrics/search/components/LyricsNavigation";
import { LyricsSongDisplay } from "@/features/lyrics/search/components/LyricsSongDisplay";
import { RecommendedSongs } from "@/features/lyrics/search/components/RecommendedSongs";
import { useInfiniteScroll } from "@/features/lyrics/search/hooks/useInfiniteScroll";
import { useSongSearch } from "@/features/lyrics/search/hooks/useSongSearch";
import type { SongListItem } from "@/types/song";

interface LyricsPageClientProps {
  recommended: {
    latest: SongListItem[];
    random: SongListItem[];
  };
}

export function LyricsPageClient({ recommended }: LyricsPageClientProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const loadingRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const [viewModeOverride, setViewModeOverride] = useState<
    "grid" | "list" | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const viewMode = viewModeOverride ?? (isMobile ? "list" : "grid");

  const search = useSongSearch(searchQuery);
  const scroll = useInfiniteScroll(!searchQuery);

  useEffect(() => {
    const element = loadingRef.current;
    if (!element || !scroll.hasMore || searchQuery) return;

    scroll.setupObserver(element);
  }, [scroll, scroll.setupObserver, scroll.hasMore, searchQuery]);

  const handleSearchChange = useCallback((query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  }, []);

  const handleRandomClick = useCallback(async () => {
    const songId = await getRandomSongId();
    if (songId) {
      router.push(`/lyrics/${songId}`);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <LyricsNavigation
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewModeOverride}
        onRandomClick={handleRandomClick}
        resultCount={searchQuery ? search.results.length : undefined}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Activity mode={searchQuery ? "hidden" : "visible"}>
          <RecommendedSongs
            latest={recommended.latest}
            random={recommended.random}
          />

          {scroll.loading ? (
            <div className="flex flex-col items-center py-20 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="mt-3 text-sm">Loading songs...</p>
            </div>
          ) : scroll.songs.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No songs
            </div>
          ) : (
            <>
              <LyricsSongDisplay songs={scroll.songs} viewMode={viewMode} />

              {scroll.hasMore && (
                <div
                  ref={loadingRef}
                  className="flex min-h-20 justify-center py-8"
                >
                  {scroll.loadingMore && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more...
                    </div>
                  )}
                </div>
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
          ) : search.results.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No results for &quot;{searchQuery}&quot;
            </div>
          ) : (
            <LyricsSongDisplay songs={search.results} viewMode={viewMode} />
          )}
        </Activity>
      </main>
    </div>
  );
}
