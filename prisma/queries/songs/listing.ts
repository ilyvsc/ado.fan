import { prisma } from "@/prisma/client";
import {
  serializeSongListItem,
  songListPrismaSelect,
} from "@/prisma/serializer";
import type { SongListItem } from "@/types/song";

/**
 * Fetch paginated songs for listing with total count.
 *
 * @param limit - Number of songs to fetch (default: 24)
 * @param offset - Number of songs to skip (default: 0)
 * @returns Promise resolving to songs array, total count, and hasMore flag
 */
export async function getPaginatedSongsForListing(
  limit = 24,
  offset = 0,
): Promise<{ songs: SongListItem[]; total: number; hasMore: boolean }> {
  const [songs, total] = await Promise.all([
    prisma.song.findMany({
      orderBy: [{ titleEnglish: "asc" }, { titleJapanese: "asc" }],
      select: songListPrismaSelect,
      take: limit,
      skip: offset,
    }),
    prisma.song.count(),
  ]);

  return {
    songs: songs.map(serializeSongListItem),
    total,
    hasMore: offset + songs.length < total,
  };
}
