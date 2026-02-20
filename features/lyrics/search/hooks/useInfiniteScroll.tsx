import { useCallback, useEffect, useReducer, useRef } from "react";

import { useIsMobile } from "@/components/ui/use-mobile";
import type { SongListItem } from "@/types/song";

const BATCH_SIZE = 4;

type InitialData = {
  songs: SongListItem[];
  hasMore: boolean;
};

type State = {
  songs: SongListItem[];
  loadingMore: boolean;
  hasMore: boolean;
};

type Action =
  | { type: "LOAD_MORE_START" }
  | { type: "LOAD_MORE_SUCCESS"; newSongs: SongListItem[]; hasMore: boolean }
  | { type: "LOAD_MORE_DONE" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD_MORE_START":
      return { ...state, loadingMore: true };
    case "LOAD_MORE_SUCCESS":
      return {
        ...state,
        songs: [...state.songs, ...action.newSongs],
        hasMore: action.hasMore,
      };
    case "LOAD_MORE_DONE":
      return { ...state, loadingMore: false };
    default:
      return state;
  }
}

export function useInfiniteScroll(enabled: boolean, initialData: InitialData) {
  const isMobile = useIsMobile();

  const [state, dispatch] = useReducer(reducer, {
    songs: initialData.songs,
    loadingMore: false,
    hasMore: initialData.hasMore,
  });

  const offsetRef = useRef(initialData.songs.length);
  const isLoadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const songIdsRef = useRef<Set<string | number>>(
    new Set(initialData.songs.map((s) => s.id)),
  );

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !enabled || !state.hasMore) return;

    isLoadingRef.current = true;
    dispatch({ type: "LOAD_MORE_START" });

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(
        `/api/songs?limit=${BATCH_SIZE}&offset=${offsetRef.current}`,
        { signal: abortRef.current.signal },
      );

      if (!res.ok) throw new Error(`Request failed with ${res.status}`);

      const data = await res.json();
      const incoming = data.songs as SongListItem[];
      const newSongs = incoming.filter((s) => !songIdsRef.current.has(s.id));

      offsetRef.current += newSongs.length;
      newSongs.forEach((s) => songIdsRef.current.add(s.id));

      dispatch({ type: "LOAD_MORE_SUCCESS", newSongs, hasMore: data.hasMore });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Failed to load more songs:", err);
      }
    } finally {
      isLoadingRef.current = false;
      dispatch({ type: "LOAD_MORE_DONE" });
    }
  }, [enabled, state.hasMore]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!state.hasMore) {
      observerRef.current?.disconnect();
    }
  }, [state.hasMore]);

  const setupObserver = useCallback(
    (element: HTMLElement | null) => {
      if (!element || !enabled || !state.hasMore) return;

      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            void loadMore();
          }
        },
        {
          rootMargin: isMobile ? "150px" : "400px",
          threshold: 0.1,
        },
      );
      observerRef.current.observe(element);
    },
    [enabled, state.hasMore, isMobile, loadMore],
  );

  return {
    songs: state.songs,
    loadingMore: state.loadingMore,
    hasMore: state.hasMore,
    setupObserver,
  };
}
