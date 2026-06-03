import { cache } from "react";

import { prisma } from "@/prisma/client";
import {
  lyricsPrismaSelect,
  songListPrismaSelect,
  songPrismaSelect,
} from "@/prisma/select";
import {
  serializeLyrics,
  serializeSong,
  serializeSongListItem,
} from "@/prisma/serializer";

import type { Lyrics } from "@/types/lyrics";
import type { Song, SongListItem } from "@/types/song";

/**
 * Fetch a single song by its ID.
 *
 * @param id - Song ID to fetch
 * @returns Promise resolving to the song, or null if not found
 *
 * @example
 * ```typescript
 * const song = await getSongById("usseewa");
 * console.log(song.title.english);
 * ```
 */
export const getSongById = cache(async function getSongById(
  id: string,
): Promise<Song | null> {
  const song = await prisma.song.findUnique({
    where: { id },
    select: songPrismaSelect,
  });

  if (!song) return null;

  return serializeSong(song);
});

/**
 * Fetches all lyrics associated with a given song.
 *
 * @param songId - The ID of the song whose lyrics should be retrieved
 * @returns An array of lyrics for the song (empty if none exist)
 *
 * @note This function returns FULL LYRICS. Only use for lyrics pages.
 */
export async function getSongLyricsById(songId: string): Promise<Lyrics[]> {
  const lyrics = await prisma.lyrics.findMany({
    where: { songId },
    select: lyricsPrismaSelect,
  });

  return lyrics.map(serializeLyrics);
}

/**
 * Fetch all songs for listing.
 *
 * @returns Promise resolving to a tiny array of SongListItem
 */
export const getAllSongsForListing = cache(
  async function getAllSongsForListing(): Promise<SongListItem[]> {
    const songs = await prisma.song.findMany({
      orderBy: [{ titleEnglish: "asc" }, { titleJapanese: "asc" }],
      select: songListPrismaSelect,
    });
    return songs.map(serializeSongListItem);
  },
);
