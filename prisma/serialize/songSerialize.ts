import { Prisma } from "../generated/client";
import {
  songAlbumPrismaSelect,
  songListPrismaSelect,
  songLyricsPrismaSelect,
  songPrismaSelect,
} from "../select/songSelect";

import type { Song, SongListItem } from "@/types/song";

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
    releaseDate: song.releaseDate.toISOString().slice(0, 10),
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? undefined,
  };
}

export function serializeSong(
  song: Prisma.SongGetPayload<{ select: typeof songPrismaSelect }>,
): Song {
  return {
    id: song.id,
    title: {
      english: song.titleEnglish,
      japanese: song.titleJapanese,
    },
    lyrics: { japanese: "", romaji: "", english: "" },
    length: song.length,
    releaseDate: song.releaseDate.toISOString().slice(0, 10),
    description: song.description,
    nicoId: song.nicoId,
    youtubeId: song.youtubeId,
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? undefined,
    albumTrack: undefined,
  };
}

export function serializeSongWithAlbum(
  song: Prisma.SongGetPayload<{ select: typeof songAlbumPrismaSelect }>,
): Song {
  const albumTrack = song.albumTracks?.[0];

  return {
    id: song.id,
    title: {
      english: song.titleEnglish,
      japanese: song.titleJapanese,
    },
    lyrics: { japanese: "", romaji: "", english: "" },
    length: song.length,
    releaseDate: song.releaseDate.toISOString().slice(0, 10),
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

export function serializeSongWithLyrics(
  song: Prisma.SongGetPayload<{ select: typeof songLyricsPrismaSelect }>,
): Song {
  const lyrics = song.lyrics?.[0];

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
    releaseDate: song.releaseDate.toISOString().slice(0, 10),
    description: song.description,
    nicoId: song.nicoId,
    youtubeId: song.youtubeId,
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? undefined,
  };
}

export function serializeSongSeed(songs: Song[]): Prisma.SongCreateInput[] {
  return songs.map((song) => ({
    id: song.id,
    titleEnglish: song.title.english,
    titleJapanese: song.title.japanese,
    length: song.length,
    releaseDate: new Date(song.releaseDate),
    description: song.description,
    nicoId: song.nicoId ?? null,
    youtubeId: song.youtubeId ?? null,
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? null,
  }));
}
