export type Song = {
  id: string;
  title: {
    english: string;
    japanese: string;
  };
  lyrics: {
    japanese: string;
    romaji: string;
    english: string;
  };
  length: string;
  year: number;
  releaseDate: string;
  description: string;
  nicoId?: string | null;
  youtubeId?: string | null;
  coverArt: string;
  themeColor?: string;
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
 * Used by the /api/songs endpoint to avoid exposing full lyrics!!!
 */
export type SongListItem = {
  id: string;
  title: {
    english: string;
    japanese: string;
  };
  length: string;
  year: number;
  releaseDate: string;
  coverArt: string;
  themeColor?: string;
};

/**
 * Search result with match context information.
 */
export type SearchResult = SongListItem & {
  matchType: "title" | "lyrics";
};

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
  tracks: Array<{ songId: string; trackNumber: number }>;
};

export type SongsByYear = Record<number, Song[]>;

export type Period = "early" | "mid" | "late";

export type TimelinePeriod = {
  period: Period;
  label: string;
  songs: Song[];
  year: number;
  periodIndex?: number;
  songIndex?: number;
};

export type TimelineYear = {
  year: number;
  songs: Song[];
  totalSongs: number;
  periods: TimelinePeriod[];
};

export type SectionDefinition = {
  id: string;
  items: string[];
};
