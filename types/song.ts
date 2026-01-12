import type { ExternalLinkDefinition } from "./externalLink";

import type { SongCreateInput } from "@/prisma/generated/models";

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
  externalLinks?: ExternalLinkDefinition[];
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

/**
 * Lightweight song type for listings (excludes lyrics content).
 * Used by the /api/songs endpoint to avoid exposing full lyrics.
 */
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

export type SectionDefinition = {
  id: string;
  items: string[];
};

export type SongsByYear = Record<number, Song[]>;

export type SongSeedInput = SongCreateInput & {
  externalLinks?: ExternalLinkDefinition[];
};
