"use client";

import { useCallback } from "react";

import { useLocalStorage } from "./useLocalStorage";

const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useLocalStorage<string[]>(
    "ado-recently-viewed",
    [],
  );

  const addRecentSong = useCallback(
    (id: string) => {
      setRecentIds((prev) =>
        [id, ...prev.filter((i) => i !== id)].slice(0, MAX_ITEMS),
      );
    },
    [setRecentIds],
  );

  return { recentIds, addRecentSong };
}
