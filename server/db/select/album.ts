import { Prisma } from "@/prisma/client";

import { songListPrismaSelect } from "./song";

export const albumListPrismaSelect = {
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
      song: { select: songListPrismaSelect },
    },
    orderBy: { trackNumber: "asc" as const },
  },
} satisfies Prisma.AlbumSelect;

export const albumMinimalPrismaSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  releaseDate: true,
  type: true,
  coverArt: true,
};
