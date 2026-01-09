import { useEffect, useRef, useState } from "react";

import type { SongListItem } from "@/types/Music";

const SEARCH_DEBOUNCE_MS = 300;

export function useSongSearch(query: string) {
  const [results, setResults] = useState<SongListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/songs/search?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      void performSearch();
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  return { results, loading };
}
