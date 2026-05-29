import type { SongCreateInput } from "@/prisma/generated/models";
import type { Credits } from "@/shared/schemas/credits";
import type { ExternalLinks } from "@/shared/schemas/externalLinks";

export interface Song {
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
}

export interface SongListItem {
  id: string;
  title: {
    english: string;
    japanese: string;
  };
  length: string;
  releaseDate: string;
  coverArt: string;
  themeColor?: string;
}

export type SongSeedInput = SongCreateInput;

export type SongSortOption = "az" | "za" | "newest" | "oldest";
