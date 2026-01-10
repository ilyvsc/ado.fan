import { songPrismaSelect } from "./songSelect";

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
      song: {
        select: songPrismaSelect,
      },
    },
    orderBy: { trackNumber: "asc" as const },
  },
};

export const albumMinimalPrismaSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  releaseDate: true,
  type: true,
  coverArt: true,
};
