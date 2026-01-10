import { prisma } from "@/prisma/client";
import { songListPrismaSelect, songLyricsPrismaSelect } from "@/prisma/select";
import {
  serializeSongListItem,
  serializeSongWithLyrics,
} from "@/prisma/serializer";
import type { Song, SongListItem } from "@/types/song";

/**
 * Fetch a single song with lyrics by its ID.
 *
 * @param id - Song ID to fetch
 * @returns Promise resolving to the song with lyrics, or null if not found
 *
 * @example
 * ```typescript
 * const song = await getSongWithLyrics("usseewa");
 * console.log(song.lyrics.english);
 * ```
 *
 * @throws {Error} If database connection fails or query execution fails
 * @note This function returns FULL LYRICS. Only use for lyrics pages.
 */
export async function getSongWithLyrics(id: string): Promise<Song | null> {
  const song = await prisma.song.findUnique({
    where: { id },
    select: songLyricsPrismaSelect,
  });

  if (!song) return null;

  return serializeSongWithLyrics(song);
}

/**
 * Fetch all songs for listing.
 *
 * @returns Promise resolving to a tiny array of SongListItem
 */
export async function getAllSongsForListing(): Promise<SongListItem[]> {
  const songs = await prisma.song.findMany({
    orderBy: [{ titleEnglish: "asc" }, { titleJapanese: "asc" }],
    select: songListPrismaSelect,
  });
  return songs.map(serializeSongListItem);
}
