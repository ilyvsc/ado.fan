const songBaseSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  length: true,
  releaseDate: true,
  description: true,
  nicoId: true,
  youtubeId: true,
  coverArt: true,
  themeColor: true,
} as const;

export const songPrismaSelect = {
  ...songBaseSelect,
};

export const songListPrismaSelect = {
  id: true,
  titleEnglish: true,
  titleJapanese: true,
  length: true,
  releaseDate: true,
  coverArt: true,
  themeColor: true,
};

export const songAlbumPrismaSelect = {
  ...songBaseSelect,
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
