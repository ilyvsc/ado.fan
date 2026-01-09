import {
  SiApplemusic,
  SiDiscord,
  SiInstagram,
  SiLine,
  SiNiconico,
  SiReddit,
  SiSpotify,
  SiTiktok,
  SiX,
  SiYoutube,
  SiYoutubemusic,
} from "@icons-pack/react-simple-icons";
import {
  BadgeJapaneseYen,
  CircleQuestionMark,
  Cloud,
  Disc3,
  Music4,
} from "lucide-react";

import type { Category, SocialLink } from "@/types/social";

export const categories: Category[] = [
  {
    id: "social-media",
    label: "Social Media",
    description:
      "Official accounts for updates, announcements, and community updates.",
    data: [
      {
        name: "@ado_staff",
        url: "https://x.com/ado_staff",
        icon: <SiX className="h-4 w-4" />,
        description: "News, tour info, and announcements from Ado's staff",
      },
      {
        name: "@ado1024imokenp",
        url: "https://x.com/ado1024imokenp",
        icon: <SiX className="h-4 w-4" />,
        description: "Personal posts, thoughts, and updates directly from Ado",
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/ado_staff_official/",
        icon: <SiInstagram className="h-4 w-4" />,
        description: "Photo highlights, behind-the-scenes moments, and updates",
      },
      {
        name: "NicoNico",
        url: "https://www.nicovideo.jp/user/39170211",
        icon: <SiNiconico className="h-4 w-4" />,
        description: "Archive of Ado's early cover songs and video uploads",
      },
      {
        name: "Tiktok",
        url: "https://www.tiktok.com/@ado1024osenbei",
        icon: <SiTiktok className="h-4 w-4" />,
        description: "Epic concert clips, special moments, and video updates",
      },
      {
        name: "YouTube",
        url: "https://www.youtube.com/@Ado1024",
        icon: <SiYoutube className="h-4 w-4" />,
        description:
          "Official channel featuring music videos, live shows, and trailers",
      },
      {
        name: "LINE",
        url: "https://page.line.me/691gfnft",
        icon: <SiLine className="h-4 w-4" />,
        description: "Official LINE account with announcements and updates",
      },
    ],
  },
  {
    id: "official-links",
    label: "Official Links",
    description:
      "Verified official sites covering labels, management, and authorized merchandise.",
    data: [
      {
        name: "Ado Official Music Shop",
        url: "https://ado-shop.com/",
        icon: <Music4 className="h-4 w-4" />,
        description:
          "Official store for Ado's music releases, limited editions, and special drops",
      },
      {
        name: "Ado Official Shop",
        url: "https://ado-officialshop-friedpotato.com",
        icon: <BadgeJapaneseYen className="h-4 w-4" />,
        description:
          "Merchandise store with official goods, exclusives, and seasonal releases",
      },
      {
        name: "Cloud Nine Profile",
        url: "https://cloud9pro.co.jp/artist/profile/ado/",
        icon: <Cloud className="h-4 w-4" />,
        description:
          "Official artist profile hosted by Cloud Nine, including career details and announcements",
      },
      {
        name: "Universal Music Japan",
        url: "https://www.universal-music.co.jp/ado/",
        icon: <Disc3 className="h-4 w-4" />,
        description:
          "Universal Music Japan's official Ado page with releases, news, and label updates",
      },
      {
        name: "Doki Doki Secret Base",
        url: "https://ado-dokidokihimitsukichi-daigakuimo.com",
        icon: <CircleQuestionMark className="h-4 w-4" />,
        description:
          "Ado's membership fan club with exclusive content, behind-the-scenes stories, and tour vlogs",
      },
    ],
  },
  {
    id: "music-platforms",
    label: "Music Platforms",
    description: "Streaming services where Ado's music catalog is available.",
    data: [
      {
        name: "Apple Music",
        url: "https://music.apple.com/us/artist/ado/1492604670",
        icon: <SiApplemusic className="h-4 w-4" />,
        description: "Official releases and albums on Apple Music",
      },
      {
        name: "Amazon Music",
        url: "https://music.amazon.com/artists/B0010RVN6C/ado",
        icon: <Music4 className="h-4 w-4" />,
        description: "Official catalog available on Amazon Music",
      },
      {
        name: "Spotify",
        url: "https://open.spotify.com/artist/6mEQK9m2krja6X1cfsAjfl",
        icon: <SiSpotify className="h-4 w-4" />,
        description: "Global streaming platform with Ado's full catalog",
      },
      {
        name: "YouTube Music",
        url: "https://music.youtube.com/channel/UCln9P4Qm3-EAY4aiEPmRwEA",
        icon: <SiYoutubemusic className="h-4 w-4" />,
        description: "Music releases available through YouTube Music",
      },
      {
        name: "AWA",
        url: "https://s.awa.fm/artist/74809ad9e993b0030087",
        icon: <Music4 className="h-4 w-4" />,
        description:
          "Japan-focused streaming service with Ado's catalog and playlists",
      },
      {
        name: "LINE Music",
        url: "https://lin.ee/B9KXQgS",
        icon: <SiLine className="h-4 w-4" />,
        description: "Music streaming built into LINE, Japan's main social app",
      },
    ],
  },
  {
    id: "fan-communities",
    label: "Fan Communities",
    description:
      "Fan spaces for discussion, sharing, and community interaction.",
    data: [
      {
        name: "Reddit",
        url: "https://www.reddit.com/r/Ado/",
        icon: <SiReddit className="h-4 w-4" />,
        description: "Fan community to discuss Ado's music and news in Reddit",
      },
      {
        name: "Discord",
        url: "https://discord.gg/ado1024",
        icon: <SiDiscord className="h-4 w-4" />,
        description: "Join the Ado Hangout server to connect with other fans",
      },
    ],
  },
];

export const linksCategories = Object.fromEntries(
  categories.map((cat) => [cat.id, cat.data]),
) as Record<string, SocialLink[]>;
