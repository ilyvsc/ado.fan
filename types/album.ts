import type { ExternalLinkDefinition } from "./externalLink";
import type { Song } from "./song";

import { AlbumCredits } from "@/shared/schemas/credits";

export type Album = {
  id: string;
  title: {
    english: string;
    japanese: string;
  };
  releaseDate: string;
  type: "single" | "ep" | "album";
  tracks: AlbumTrack[];
  coverArt: string;
  externalLinks?: ExternalLinkDefinition[];
};

export type AlbumTrack = {
  song: Song;
  trackNumber: number;
  isBonusTrack?: boolean;
};

export type AlbumDefinition = {
  id: string;
  titleEnglish: string;
  titleJapanese: string;
  releaseDate: string;
  type: string;
  coverArt: string;
  tracks: Array<{
    songId: string;
    trackNumber: number;
  }>;
  externalLinks: ExternalLinkDefinition[];
  credits?: AlbumCredits;
};

export type AlbumMinimal = Omit<Album, "tracks">;
