import { useEffect, useRef, useState } from "react";

import type { SongListItem } from "@/types/song";

const SEARCH_DEBOUNCE_MS = 300;

export function useSongSearch(query: string) {
  const [results, setResults] = useState<SongListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    timeoutRef.current = setTimeout(() => {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      fetch(`/api/songs/search?q=${encodeURIComponent(trimmedQuery)}`, {
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          setResults(Array.isArray(data) ? data : []);
          setLoading(false);
          return data;
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Search failed:", error);
            setResults([]);
            setLoading(false);
          }
          return [];
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [query]);

  return { results, loading };
}
