"use client";

import { useMemo } from "react";

import { HorizontalSongScroller } from "@/features/lyrics/search/components/HorizontalSongScroller";

import type { SongListItem } from "@/types/song";

interface RecommendedSongsProps {
  latest: SongListItem[];
  random: SongListItem[];
}

export function RecommendedSongs({ latest, random }: RecommendedSongsProps) {
  const songs = useMemo(() => {
    const latestIds = new Set(latest.map((s) => s.id));
    return [...latest, ...random.filter((s) => !latestIds.has(s.id))];
  }, [latest, random]);
  return <HorizontalSongScroller title="You Might Like" songs={songs} />;
}
