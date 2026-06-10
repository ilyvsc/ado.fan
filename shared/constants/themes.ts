import { getAssetUrl } from "@/components/ui/image";

export interface SongTheme {
  id: string;
  songTitle: {
    english: string;
    japanese?: string;
  };
  coverArt: string;
}

export const SONG_THEMES: readonly SongTheme[] = [
  {
    id: "default",
    songTitle: { english: "Ado" },
    coverArt: getAssetUrl("/avatar/ado-chando-avatar"),
  },
  {
    id: "shoka",
    songTitle: { english: "Shoka", japanese: "初夏" },
    coverArt: getAssetUrl("songs/shoka"),
  },
  {
    id: "himawari",
    songTitle: { english: "Himawari", japanese: "向日葵" },
    coverArt: getAssetUrl("songs/himawari"),
  },
  {
    id: "uta",
    songTitle: { english: "New Genesis", japanese: "新時代" },
    coverArt: getAssetUrl("songs/new-genesis"),
  },
  {
    id: "sakura-biyori-time-machine",
    songTitle: {
      english: "Sakura Biyori and Time Machine",
      japanese: "桜日和とタイムマシン",
    },
    coverArt: getAssetUrl("songs/sakura-biyori-time-machine"),
  },
] as const;
