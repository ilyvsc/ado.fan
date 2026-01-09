import { useCallback, useEffect, useRef, useState } from "react";

import { useIsMobile } from "@/components/ui/use-mobile";
import type { SongListItem } from "@/types/song";

const INITIAL_SIZE = 12;
const BATCH_SIZE = 4;

export function useInfiniteScroll(enabled: boolean) {
  const isMobile = useIsMobile();

  const [songs, setSongs] = useState<SongListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const isLoadingRef = useRef(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<(() => Promise<void>) | undefined>(undefined);

  loadMoreRef.current = async () => {
    if (isLoadingRef.current || !hasMore || !enabled) return;

    isLoadingRef.current = true;
    setLoadingMore(true);

    try {
      const res = await fetch(
        `/api/songs?limit=${BATCH_SIZE}&offset=${offsetRef.current}`,
      );
      const data = await res.json();

      setSongs((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const newSongs = data.songs.filter(
          (s: SongListItem) => !existingIds.has(s.id),
        );
        offsetRef.current = prev.length + newSongs.length;
        return [...prev, ...newSongs];
      });

      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Failed to load more songs:", err);
    } finally {
      isLoadingRef.current = false;
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`/api/songs?limit=${INITIAL_SIZE}&offset=0`);
        const data = await res.json();

        setSongs(data.songs);
        offsetRef.current = data.songs.length;
        setHasMore(data.hasMore);
      } catch (err) {
        console.error("Failed to load songs:", err);
      } finally {
        setLoading(false);
      }
    }

    void init();
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const setupObserver = useCallback(
    (element: HTMLElement) => {
      if (!enabled || !hasMore) return;

      observerRef.current?.disconnect();

      const rootMargin = isMobile ? "100px" : "50px";
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && loadMoreRef.current) {
            void loadMoreRef.current();
          }
        },
        { rootMargin, threshold: 0.1 },
      );

      observerRef.current.observe(element);
    },
    [enabled, hasMore, isMobile],
  );

  return {
    songs,
    loading,
    loadingMore,
    hasMore,
    setupObserver,
  };
}
