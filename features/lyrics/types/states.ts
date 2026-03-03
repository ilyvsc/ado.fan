export type LyricsViewMode = "tabs" | "compare" | "lined";

export type LyricsUrlState = {
  mode: LyricsViewMode;
  left: string;
  right: string;
};
