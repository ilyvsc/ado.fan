export type LyricsViewMode = "tabs" | "compare" | "lined";

export type LyricsUrlState = {
  mode: LyricsViewMode;
  left: string;
  right: string;
};

export type LyricsSearchParams = {
  lang?: string;
  left?: string;
  right?: string;
};
