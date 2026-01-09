import { prisma } from "@/prisma/client";
import {
  serializeSongListItem,
  songListPrismaSelect,
} from "@/prisma/serializer";
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
 * _This is a POSTGRESQL only query, ensures true random_
 *
 * @param count - Number of random songs to fetch (default: 3)
 * @returns Promise resolving to an array of random songs
 */
export async function getRandomSongs(count = 3): Promise<SongListItem[]> {
  const songs = await prisma.$queryRaw<
    any[]
  >`SELECT * FROM "Song" ORDER BY RANDOM() LIMIT ${count}`;

  return songs.map(serializeSongListItem);
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
