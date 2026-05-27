import { prisma } from "@/prisma/client";
import { songListPrismaSelect } from "@/prisma/select";
import { serializeSongListItem } from "@/prisma/serializer";

import type { SongListItem } from "@/types/song";

/**
 * Fetch the latest songs by release date.
 *
 * @param count - Number of latest songs to fetch (default: 3)
 * @returns Promise resolving to an array of the most recent songs
 */
export async function getLatestSongs(count = 3): Promise<SongListItem[]> {
  const songs = await prisma.song.findMany({
    orderBy: { releaseDate: "desc" },
    select: songListPrismaSelect,
    take: count,
  });
  return songs.map(serializeSongListItem);
}

/**
 * Fetch random songs from the catalog.
 *
 * Uses PostgreSQL's RANDOM() function for true randomization with a random skip offset
 * to ensure diverse results across calls.
 *
 * @param count - Number of random songs to fetch (default: 3, max: 10)
 * @returns Promise resolving to an array of random songs
 */
export async function getRandomSongs(count = 3): Promise<SongListItem[]> {
  const safeCount = Math.min(Math.max(1, Math.floor(count)), 10);

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
}

/**
 * Fetch recommended songs (latest releases + random picks).
 *
 * @returns Promise resolving to object with latest and random song arrays
 */
export async function getRecommendedSongs(): Promise<{
  latest: SongListItem[];
  random: SongListItem[];
}> {
  const [latest, random] = await Promise.all([
    getLatestSongs(1),
    getRandomSongs(5),
  ]);

  return { latest, random };
}
