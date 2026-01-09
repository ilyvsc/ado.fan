"use client";

import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { useIsMobile } from "@/components/ui/use-mobile";
import { LyricsNavigation } from "@/features/lyrics/components/LyricsNavigation";
import { LyricsSongDisplay } from "@/features/lyrics/components/LyricsSongDisplay";
import { RecommendedSongs } from "@/features/lyrics/components/RecommendedSongs";
import { useInfiniteScroll } from "@/features/lyrics/hooks/useInfiniteScroll";
import { useSongSearch } from "@/features/lyrics/hooks/useSongSearch";
import type { SongListItem } from "@/types/song";

export default function LyricsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const loadingRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [recommended, setRecommended] = useState<{
    latest: SongListItem[];
    random: SongListItem[];
  } | null>(null);

  const search = useSongSearch(searchQuery);
  const scroll = useInfiniteScroll(!searchQuery);

  useEffect(() => {
    if (isMobile !== undefined) {
      setViewMode(isMobile ? "list" : "grid");
    }
  }, [isMobile]);

  useEffect(() => {
    async function loadRecommended() {
      try {
        const res = await fetch("/api/songs/recommended");
        const data = await res.json();
        setRecommended(data);
      } catch (error) {
        console.error("Failed to load recommended songs:", error);
      }
    }
    void loadRecommended();
  }, []);

  useEffect(() => {
    const element = loadingRef.current;
    if (!element || !scroll.hasMore || searchQuery) return;

    return scroll.setupObserver(element);
  }, [scroll.setupObserver, searchQuery, scroll]);

  const displaySongs = useMemo(() => {
    return searchQuery ? search.results : scroll.songs;
  }, [searchQuery, search.results, scroll.songs]);

  function handleRandomClick() {
    if (!scroll.songs.length) return;
    const randomSong =
      scroll.songs[Math.floor(Math.random() * scroll.songs.length)];
    router.push(`/lyrics/${randomSong.id}`);
  }

  const isLoading = scroll.loading || search.loading;
  const showRecommended = !searchQuery && recommended;

  return (
    <div className="min-h-screen bg-background">
      <LyricsNavigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRandomClick={handleRandomClick}
        resultCount={searchQuery ? displaySongs.length : undefined}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {showRecommended && (
          <RecommendedSongs
            latest={recommended.latest}
            random={recommended.random}
          />
        )}

        {isLoading ? (
          <div className="flex flex-col items-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="mt-3 text-sm">
              {searchQuery ? "Searching..." : "Loading songs..."}
            </p>
          </div>
        ) : displaySongs.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            {searchQuery ? `No results for "${searchQuery}"` : "No songs"}
          </div>
        ) : (
          <>
            <LyricsSongDisplay songs={displaySongs} viewMode={viewMode} />

            {!searchQuery && scroll.hasMore && (
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
      </main>
    </div>
  );
}
