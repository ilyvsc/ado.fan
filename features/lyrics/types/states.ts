export type LyricsUrlState = {
  mode: "tabs" | "compare";
  left: string;
  right: string;
};

export type LyricsSearchParams = {
  lang?: string;
  left?: string;
  right?: string;
};
