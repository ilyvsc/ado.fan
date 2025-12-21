import { Prisma } from "./generated/client";

import { Album, Song, SongListItem } from "@/types/Music";

/**
 * Fields to fetch from the database for a Song.
 */
export const songPrismaSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  lyrics: {
    select: {
      lyricsJapanese: true,
      lyricsRomaji: true,
      lyricsEnglish: true,
    },
  },
  length: true,
  year: true,
  releaseDate: true,
  description: true,
  nicoId: true,
  youtubeId: true,
  coverArt: true,
  themeColor: true,
  albumTracks: {
    select: {
      trackNumber: true,
      album: {
        select: {
          id: true,
          titleEnglish: true,
          titleJapanese: true,
        },
      },
    },
    take: 1,
  },
};

/**
 * Lightweight fields for song listings (excludes lyrics content).
 * Used for search results and listing pages where full lyrics are not needed.
 */
export const songListPrismaSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  length: true,
  year: true,
  releaseDate: true,
  coverArt: true,
  themeColor: true,
};

/**
 * Transform a Prisma song object to a lightweight SongListItem.
 */
export function serializeSongListItem(
  song: Prisma.SongGetPayload<{ select: typeof songListPrismaSelect }>,
): SongListItem {
  return {
    id: song.id,
    title: {
      english: song.titleEnglish,
      japanese: song.titleJapanese,
    },
    length: song.length,
    year: song.year,
    releaseDate: song.releaseDate.toISOString().slice(0, 10),
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? undefined,
  };
}

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
  const lyrics = song.lyrics?.[0];
  const albumTrack = song.albumTracks?.[0];

  return {
    id: song.id,
    title: {
      english: song.titleEnglish,
      japanese: song.titleJapanese,
    },
    lyrics: {
      japanese: lyrics?.lyricsJapanese ?? "",
      romaji: lyrics?.lyricsRomaji ?? "",
      english: lyrics?.lyricsEnglish ?? "",
    },
    length: song.length,
    year: song.year,
    releaseDate: song.releaseDate.toISOString().slice(0, 10), // "YYYY-MM-DD"
    description: song.description,
    nicoId: song.nicoId,
    youtubeId: song.youtubeId,
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? undefined,
    albumTrack: albumTrack
      ? {
          trackNumber: albumTrack.trackNumber,
          album: {
            id: albumTrack.album.id,
            title: {
              english: albumTrack.album.titleEnglish,
              japanese: albumTrack.album.titleJapanese,
            },
          },
        }
      : undefined,
  };
}

/**
 * Transform an array of Song objects to Prisma.SongCreateInput objects for database seeding.
 *
 * Converts the nested application Song structure to the flat database structure
 * required by Prisma for creating records.
 *
 * @param songs - Array of Song objects from fixture files
 * @returns Array of Prisma.SongCreateInput objects ready for database insertion
 */
export function serializeSongInput(songs: Song[]): Prisma.SongCreateInput[] {
  return songs.map((s) => ({
    id: s.id,
    titleEnglish: s.title.english,
    titleJapanese: s.title.japanese,
    length: s.length,
    year: s.year,
    releaseDate: new Date(s.releaseDate),
    description: s.description ?? "",
    nicoId: s.nicoId ?? null,
    youtubeId: s.youtubeId ?? null,
    coverArt: s.coverArt,
    themeColor: s.themeColor,
    lyrics: {
      create: {
        lyricsJapanese: s.lyrics?.japanese ?? "",
        lyricsRomaji: s.lyrics?.romaji ?? "",
        lyricsEnglish: s.lyrics?.english ?? "",
      },
    },
  }));
}

/**
 * Fields to fetch from the database for an Album.
 */
export const albumPrismaSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  releaseDate: true,
  type: true,
  coverArt: true,
  tracks: {
    select: {
      trackNumber: true,
      isBonusTrack: true,
      song: {
        select: songPrismaSelect,
      },
    },
    orderBy: { trackNumber: "asc" as const },
  },
};

/**
 * Transform a Prisma album object to the application's Album type.
 *
 * @param album - The raw album object from Prisma
 * @returns The transformed album object matching the application's Album interface
 */
export function serializeAlbum(
  album: Prisma.AlbumGetPayload<{ select: typeof albumPrismaSelect }>,
): Album {
  const tracks = album.tracks.map((track) => ({
    song: serializeSong(track.song),
    trackNumber: track.trackNumber,
    isBonusTrack: track.isBonusTrack ?? undefined,
  }));

  return {
    id: album.id,
    title: {
      english: album.titleEnglish,
      japanese: album.titleJapanese,
    },
    releaseDate: album.releaseDate.toISOString().slice(0, 10), // YYYY-MM-DD
    type: album.type,
    coverArt: album.coverArt,
    tracks,
  };
}
