import type { SongListItem } from "./song";

export type SearchResult = SongListItem & {
  matchType: "title" | "lyrics";
};
