import { useEffect, useState } from "react";

import type { SongListItem } from "@/types/song";

const SEARCH_DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

async function fetchSongSearch(
  query: string,
  signal: AbortSignal,
): Promise<SongListItem[]> {
  const res = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`, {
    signal,
  });

  if (!res.ok) throw new Error(String(res.status));

  const data: unknown = await res.json();
  return Array.isArray(data) ? (data as SongListItem[]) : [];
}

export function useSongSearch(query: string) {
  const trimmedQuery = query.trim().toLowerCase();
  const tooShort = trimmedQuery.length < MIN_QUERY_LENGTH;

  const [state, setState] = useState<{
    results: SongListItem[];
    loading: boolean;
    error: string | null;
  }>({ results: [], loading: false, error: null });

  useEffect(() => {
    if (tooShort) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setState({ results: [], loading: true, error: null });

      fetchSongSearch(trimmedQuery, controller.signal)
        .then((results) => {
          setState({ results, loading: false, error: null });
        })
        .catch((err: unknown) => {
          if (err instanceof Error && err.name === "AbortError") return;
          setState({
            results: [],
            loading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery, tooShort]);

  return tooShort ? { results: [], loading: false, error: null } : state;
}
