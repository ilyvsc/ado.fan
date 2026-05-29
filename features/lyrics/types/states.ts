export type LyricsViewMode = "tabs" | "compare" | "lined";

export interface LyricsUrlState {
  mode: LyricsViewMode;
  left: string;
  right: string;
}
