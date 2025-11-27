import { Prisma } from "./generated/client";

import { Song } from "@/types/Music";

/**
 * Fields to fetch from the database for a Song.
 */
export const songPrismaSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  lyricsJapanese: true,
  lyricsRomaji: true,
  lyricsEnglish: true,
  length: true,
  year: true,
  releaseDate: true,
  description: true,
  nicoId: true,
  youtubeId: true,
  coverArt: true,
  themeColor: true,
};

/**
 * Transform a Prisma song object to the application's Song type.
 *
 * Converts the flat database structure into the nested object structure
 * expected by the application, with proper type safety and null handling.
 *
 * @param song - The raw song object from Prisma with selected fields
 * @returns The transformed song object matching the application's Song interface
 *
 * @example
 * ```typescript
 * const rawSong = await prisma.song.findFirst({ select: songSelect });
 * const transformedSong = transformSong(rawSong);
 * console.log(transformedSong.title.english); // "Song Title"
 * ```
 */
export function serializeSong(
  song: Prisma.SongGetPayload<{ select: typeof songPrismaSelect }>,
): Song {
  return {
    id: song.id,
    title: {
      english: song.titleEnglish,
      japanese: song.titleJapanese,
    },
    lyrics: {
      japanese: song.lyricsJapanese,
      romaji: song.lyricsRomaji,
      english: song.lyricsEnglish,
    },
    length: song.length,
    year: song.year,
    releaseDate: song.releaseDate.toISOString().slice(0, 10), // "YYYY-MM-DD"
    description: song.description,
    nicoId: song.nicoId,
    youtubeId: song.youtubeId,
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? undefined,
  };
}
