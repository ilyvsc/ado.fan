import adoAvatar from "@/public/images/avatar/ado-chando-avatar.jpg";

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
    coverArt: adoAvatar.src,
  },
  {
    id: "shoka",
    songTitle: { english: "Shoka", japanese: "初夏" },
    coverArt: "https://i.scdn.co/image/ab67616d0000b273283a117f2bc39bc4122692c0",
  },
  {
    id: "himawari",
    songTitle: { english: "Himawari", japanese: "向日葵" },
    coverArt: "https://i.scdn.co/image/ab67616d0000b273fbc9c66916b491d9e3b27c74",
  },
  {
    id: "uta",
    songTitle: { english: "New Genesis", japanese: "新時代" },
    coverArt: "https://i.scdn.co/image/ab67616d0000b273f24f7db074ee5a9042ecb9a2",
  },
  {
    id: "sakura-biyori-time-machine",
    songTitle: {
      english: "Sakura Biyori and Time Machine",
      japanese: "桜日和とタイムマシン",
    },
    coverArt: "https://i.scdn.co/image/ab67616d0000b273ed2e5fe9927f70863934c134",
  },
] as const;
