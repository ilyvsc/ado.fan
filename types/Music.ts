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

export type SongsByYear = Record<number, Song[]>;

export type TimelineYear = {
  year: number;
  songs: Song[];
  categorized: {
    early: Song[];
    mid: Song[];
    late: Song[];
  };
  totalSongs: number;
  periods: [string, Song[]][];
  hasMultiplePeriods: boolean;
};

export type Period = "early" | "mid" | "late";

export type TimelineStep = {
  year: number;
  period: string;
  songs: Song[];
  periodIndex: number;
  songIndex?: number;
};
