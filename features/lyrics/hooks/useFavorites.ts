"use client";

import { useCallback, useMemo } from "react";

import { useLocalStorage } from "./useLocalStorage";

export function useFavorites() {
  const [ids, setIds] = useLocalStorage<string[]>("ado-favorites", []);

  const favoriteIds = useMemo(() => new Set(ids), [ids]);

  const toggleFavorite = useCallback(
    (id: string) => {
      setIds((prev) => {
        const set = new Set(prev);
        if (set.has(id)) {
          set.delete(id);
        } else {
          set.add(id);
        }
        return [...set];
      });
    },
    [setIds],
  );

  return { favoriteIds, toggleFavorite };
}
