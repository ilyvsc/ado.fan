import { serializeSong } from "./songSerialize";
import { Prisma } from "../generated/client";
import {
  albumListPrismaSelect,
  albumMinimalPrismaSelect,
} from "../select/albumSelect";

import type { Album, AlbumMinimal } from "@/types/album";

export function serializeAlbumWithoutLyrics(
  album: Prisma.AlbumGetPayload<{ select: typeof albumListPrismaSelect }>,
): Album {
  return {
    id: album.id,
    title: {
      english: album.titleEnglish,
      japanese: album.titleJapanese,
    },
    releaseDate: album.releaseDate.toISOString().slice(0, 10),
    type: album.type,
    coverArt: album.coverArt,
    tracks: album.tracks.map((track) => ({
      song: serializeSong(track.song),
      trackNumber: track.trackNumber,
      isBonusTrack: track.isBonusTrack,
    })),
  };
}

export function serializeAlbumMinimal(
  album: Prisma.AlbumGetPayload<{ select: typeof albumMinimalPrismaSelect }>,
): AlbumMinimal {
  return {
    id: album.id,
    title: {
      english: album.titleEnglish,
      japanese: album.titleJapanese,
    },
    releaseDate: album.releaseDate.toISOString().slice(0, 10),
    type: album.type,
    coverArt: album.coverArt,
  };
}
