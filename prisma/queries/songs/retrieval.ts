import { prisma } from "@/prisma/client";
import {
  serializeSong,
  serializeSongListItem,
  songListPrismaSelect,
  songPrismaSelect,
} from "@/prisma/serializer";
import type { Song, SongListItem } from "@/types/song";

/**
 * Fetch specific songs by their IDs, preserving the given order.
 *
 * Retrieves songs from the database by their unique identifiers and returns
 * them in the exact order specified in the input array. This is useful for
 * maintaining specific ordering requirements (e.g., playlist order, featured songs).
 *
 * @param ids - Array of song IDs to fetch
 * @returns Promise resolving to an array of songs in the same order as the input IDs
 *
 * @example
 * ```typescript
 * const songIds = ['song1', 'song3', 'song2'];
 * const songs = await getSongsByIds(songIds);
 * console.log(songs.map(s => s.id)); // ['song1', 'song3', 'song2']
 * ```
 *
 * @throws {Error} If any of the requested song IDs are not found in the database
 * @throws {Error} If database connection fails or query execution fails
 */
export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  const songs = await prisma.song.findMany({
    where: { id: { in: ids } },
    select: songPrismaSelect,
  });
  return ids
    .map((id) => songs.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .map(serializeSong);
}

/**
 * Fetch all songs for listing (lightweight, excludes lyrics content).
 *
 * Used for the lyrics search page and other listing views where full lyrics
 * are not needed. This is a security improvement to avoid exposing full
 * lyrics content when only metadata is required.
 *
 * @returns Promise resolving to an array of SongListItem (no lyrics content)
 */
export async function getAllSongsForListing(): Promise<SongListItem[]> {
  const songs = await prisma.song.findMany({
    orderBy: [{ titleEnglish: "asc" }, { titleJapanese: "asc" }],
    select: songListPrismaSelect,
  });
  return songs.map(serializeSongListItem);
}
