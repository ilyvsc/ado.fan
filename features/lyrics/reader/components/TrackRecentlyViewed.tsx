"use client";

import { useEffect } from "react";

import { useRecentlyViewed } from "@/features/lyrics/hooks/useRecentlyViewed";

export function TrackRecentlyViewed({ songId }: { songId: string }) {
  const { addRecentSong } = useRecentlyViewed();

  useEffect(() => {
    addRecentSong(songId);
  }, [songId, addRecentSong]);

  return null;
}
