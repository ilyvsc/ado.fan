import type { Song } from "./song";

type Period = "early" | "mid" | "late";

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
