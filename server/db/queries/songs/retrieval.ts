import { unstable_cache } from "next/cache";
import { cache } from "react";

import {
  lyricsPrismaSelect,
  songListPrismaSelect,
  songPrismaSelect,
} from "@/db/select";
import {
  serializeLyrics,
  serializeSong,
  serializeSongListItem,
} from "@/db/serialize";
import { prisma } from "@/prisma/client";

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
  return unstable_cache(
    async () => {
      const song = await prisma.song.findUnique({
        where: { id },
        select: songPrismaSelect,
      });

      if (!song) return null;

      return serializeSong(song);
    },
    ["song-by-id", id],
    { tags: [`song:${id}`], revalidate: false },
  )();
});

/**
 * Fetches all lyrics associated with a given song.
 *
 * @param songId - The ID of the song whose lyrics should be retrieved
 * @returns An array of lyrics for the song (empty if none exist)
 *
 * @note This function returns FULL LYRICS. Only use for lyrics pages.
 */
export const getSongLyricsById = cache(async function getSongLyricsById(
  songId: string,
): Promise<Lyrics[]> {
  return unstable_cache(
    async () => {
      const lyrics = await prisma.lyrics.findMany({
        where: { songId },
        select: lyricsPrismaSelect,
      });

      return lyrics.map(serializeLyrics);
    },
    ["song-lyrics", songId],
    { tags: [`song:${songId}`], revalidate: false },
  )();
});

/**
 * Fetch all songs for listing.
 *
 * @returns Promise resolving to a tiny array of SongListItem
 */
export const getAllSongsForListing = cache(
  async function getAllSongsForListing(): Promise<SongListItem[]> {
    return unstable_cache(
      async () => {
        const songs = await prisma.song.findMany({
          orderBy: [{ titleEnglish: "asc" }, { titleJapanese: "asc" }],
          select: songListPrismaSelect,
        });
        return songs.map(serializeSongListItem);
      },
      ["all-songs-listing"],
      { tags: ["songs:list"], revalidate: false },
    )();
  },
);

/**
 * Fetch all songs with the fields the sitemap needs (video metadata, dates).
 *
 * @returns Promise resolving to an array of songs shaped for `app/sitemap.ts`
 */
export const getAllSongsForSitemap = cache(async function getAllSongsForSitemap() {
  return unstable_cache(
    async () => {
      const songs = await prisma.song.findMany({ select: songBaseSelect });
      return songs.map((song) => ({
        ...song,
        releaseDate: song.releaseDate.toISOString(),
      }));
    },
    ["all-songs-sitemap"],
    { tags: ["songs:list"], revalidate: false },
  )();
});
