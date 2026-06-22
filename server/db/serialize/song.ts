import { Prisma } from "@/prisma/client";

import { parseCredits } from "@/schemas/credits";

import { parseExternalLinks } from "@/schemas/externalLinks";

import { songListPrismaSelect, songPrismaSelect } from "../select/song";

import type { Song, SongListItem, SongSeedInput } from "@/types/song";

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
    length: song.length,
    releaseDate: song.releaseDate.toISOString().slice(0, 10),
    description: song.description,
    nicoId: song.nicoId,
    youtubeId: song.youtubeId,
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? undefined,
    credits: parseCredits(song.credits),
    externalLinks: parseExternalLinks(song.externalLinks),
    albumTrack: undefined,
  };
}

export function serializeSongSeed(songs: Song[]): SongSeedInput[] {
  return songs.map((song) => ({
    id: song.id,
    titleEnglish: song.title.english,
    titleJapanese: song.title.japanese,
    length: song.length,
    releaseDate: new Date(song.releaseDate),
    description: song.description ?? "",
    nicoId: song.nicoId ?? null,
    youtubeId: song.youtubeId ?? null,
    coverArt: song.coverArt,
    themeColor: song.themeColor ?? null,
    credits: song.credits ?? undefined,
    externalLinks: song.externalLinks ?? [],
  }));
}
