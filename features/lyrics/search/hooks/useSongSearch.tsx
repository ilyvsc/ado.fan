import { useEffect, useReducer, useRef } from "react";

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

  if (!res.ok) throw new Error(`Search request failed with ${res.status}`);

  const data: unknown = await res.json();
  return Array.isArray(data) ? (data as SongListItem[]) : [];
}

interface State {
  results: SongListItem[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "SEARCH_START" }
  | { type: "SEARCH_SUCCESS"; results: SongListItem[] }
  | { type: "SEARCH_ERROR"; error: string }
  | { type: "SEARCH_RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SEARCH_START":
      return { ...state, loading: true, error: null };
    case "SEARCH_SUCCESS":
      return { results: action.results, loading: false, error: null };
    case "SEARCH_ERROR":
      return { ...state, loading: false, error: action.error };
    case "SEARCH_RESET":
      return { results: [], loading: false, error: null };
    default:
      return state;
  }
}

export function useSongSearch(query: string) {
  const [state, dispatch] = useReducer(reducer, {
    results: [],
    loading: false,
    error: null,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const cacheRef = useRef<Map<string, SongListItem[]>>(new Map());

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    abortControllerRef.current?.abort();

    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      dispatch({ type: "SEARCH_RESET" });
      return;
    }

    const cached = cacheRef.current.get(trimmedQuery);
    if (cached) {
      dispatch({
        type: "SEARCH_SUCCESS",
        results: cached,
      });
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    timeoutRef.current = setTimeout(() => {
      dispatch({ type: "SEARCH_START" });

      const controller = new AbortController();
      abortControllerRef.current = controller;

      fetchSongSearch(trimmedQuery, controller.signal)
        .then((results) => {
          if (requestIdRef.current !== currentRequestId) return results;

          cacheRef.current.set(trimmedQuery, results);
          dispatch({ type: "SEARCH_SUCCESS", results });

          return results;
        })
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === "AbortError") return;
          if (requestIdRef.current !== currentRequestId) return;

          dispatch({
            type: "SEARCH_ERROR",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      abortControllerRef.current?.abort();
    };
  }, [query]);

  return {
    results: state.results,
    loading: state.loading,
    error: state.error,
  };
}
