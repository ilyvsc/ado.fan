import { Credits } from "@/shared/schemas/credits";

import type { Song } from "./song";

import type { ExternalLinks } from "@/shared/schemas/externalLinks";

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
  externalLinks?: ExternalLinks;
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
  externalLinks?: ExternalLinks;
  credits?: Credits;
};

export type AlbumMinimal = Omit<Album, "tracks">;
