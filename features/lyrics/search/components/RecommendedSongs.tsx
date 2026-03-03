"use client";

import { useMemo } from "react";

import { HorizontalSongScroller } from "@/features/lyrics/search/components/HorizontalSongScroller";
import type { SongListItem } from "@/types/song";

interface RecommendedSongsProps {
  latest: SongListItem[];
  random: SongListItem[];
}

export function RecommendedSongs({ latest, random }: RecommendedSongsProps) {
  const recommendedSongs = useMemo(() => {
    const latestIds = new Set(latest.map((s) => s.id));
    const filtered = random?.filter((song) => !latestIds.has(song.id)) || [];
    return [...latest, ...filtered];
  }, [latest, random]);

  return (
    <HorizontalSongScroller title="You Might Like" songs={recommendedSongs} />
  );
}
