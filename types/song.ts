import type { SongCreateInput } from "@/prisma/generated/models";
import type { Credits } from "@/shared/schemas/credits";
import type { ExternalLinks } from "@/shared/schemas/externalLinks";

export type Song = {
  id: string;
  title: {
    english: string;
    japanese: string;
  };
  length: string;
  releaseDate: string;
  description: string;
  nicoId?: string | null;
  youtubeId?: string | null;
  coverArt: string;
  themeColor?: string;
  credits?: Credits | null;
  externalLinks?: ExternalLinks;
  albumTrack?: {
    trackNumber: number;
    album: {
      id: string;
      title: {
        english: string;
        japanese: string;
      };
    };
  };
};

export type SongListItem = {
  id: string;
  title: {
    english: string;
    japanese: string;
  };
  length: string;
  releaseDate: string;
  coverArt: string;
  themeColor?: string;
};

export type SongSeedInput = SongCreateInput;
