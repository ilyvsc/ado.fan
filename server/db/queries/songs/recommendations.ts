import { unstable_cache } from "next/cache";
import { cache } from "react";

import { songListPrismaSelect } from "@/db/select";
import { serializeSongListItem } from "@/db/serialize";
import { prisma } from "@/prisma/client";

import type { SongListItem } from "@/types/song";

/**
 * Fetch the latest songs by release date.
 *
 * @param count - Number of latest songs to fetch (default: 3)
 * @returns Promise resolving to an array of the most recent songs
 */
export async function getLatestSongs(count = 3): Promise<SongListItem[]> {
  return unstable_cache(
    async () => {
      const songs = await prisma.song.findMany({
        orderBy: { releaseDate: "desc" },
        select: songListPrismaSelect,
        take: count,
      });
      return songs.map(serializeSongListItem);
    },
    ["latest-songs", String(count)],
    { tags: ["songs:list"], revalidate: false },
  )();
}

/**
 * Fetch random songs from the catalog.
 *
 * Uses PostgreSQL's ORDER BY RANDOM(), a full-table sort that is fine at
 * catalog scale.
 *
 * @param count - Number of random songs to fetch (default: 3, max: 10)
 * @returns Promise resolving to an array of random songs
 */
export async function getRandomSongs(count = 3): Promise<SongListItem[]> {
  const safeCount = Math.min(Math.max(1, Math.floor(count)), 10);

  return unstable_cache(
    async () => {
      const songs = await prisma.$queryRaw<
        {
          id: string;
          titleEnglish: string;
          titleJapanese: string;
          length: string;
          releaseDate: Date;
          coverArt: string;
          themeColor: string | null;
        }[]
      >`
        SELECT
          id,
          "titleEnglish",
          "titleJapanese",
          "length",
          "releaseDate",
          "coverArt",
          "themeColor"
        FROM "Song"
        ORDER BY RANDOM()
        LIMIT ${safeCount};
      `;

      return songs.map((song) => ({
        id: song.id,
        title: {
          english: song.titleEnglish,
          japanese: song.titleJapanese,
        },
        length: song.length,
        releaseDate: song.releaseDate.toISOString().slice(0, 10),
        coverArt: song.coverArt,
        themeColor: song.themeColor ?? undefined,
      }));
    },
    ["random-songs", String(safeCount)],
    // Short TTL, not tag-invalidated: keeps the pick rotating instead of
    // freezing on the first roll after a deploy.
    { tags: ["songs:list"], revalidate: 300 },
  )();
}

/**
 * Fetch recommended songs (latest releases + random picks).
 *
 * @returns Promise resolving to object with latest and random song arrays
 */
export const getRecommendedSongs = cache(
  async function getRecommendedSongs(): Promise<{
    latest: SongListItem[];
    random: SongListItem[];
  }> {
    const [latest, random] = await Promise.all([
      getLatestSongs(1),
      getRandomSongs(5),
    ]);

    return { latest, random };
  },
);
