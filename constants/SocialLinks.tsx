import {
  faDiscord,
  faInstagram,
  faReddit,
  faSpotify,
  faSquareXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Globe } from "lucide-react";
import React from "react";

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
}

export const officialLinks: SocialLink[] = [
  {
    name: "@ado_staff",
    url: "https://x.com/ado_staff",
    icon: <FontAwesomeIcon icon={faSquareXTwitter} className="h-5 w-5" />,
    description: "Official X (formely Twitter) account managed by Ado's staff",
  },
  {
    name: "@ado1024imokenp",
    url: "https://x.com/ado1024imokenp",
    icon: <FontAwesomeIcon icon={faSquareXTwitter} className="h-5 w-5" />,
    description: "Official X (formely Twitter) account managed by Ado",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@Ado1024",
    icon: <FontAwesomeIcon icon={faYoutube} className="h-5 w-5" />,
    description: "Official YouTube channel with music videos and announcements",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/ado_staff_official/",
    icon: <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />,
    description: "Official Instagram account with updates and photos",
  },
  {
    name: "Official Shop Website",
    url: "https://ado-shop.com/",
    icon: <Globe className="h-5 w-5" />,
    description: "Ado's official online store, the place to buy merchandise",
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/6mEQK9m2krja6X1cfsAjfl",
    icon: <FontAwesomeIcon icon={faSpotify} className="h-5 w-5" />,
    description: "Listen to Ado's music on Spotify",
  },
];

export const fanLinks: SocialLink[] = [
  {
    name: "Reddit",
    url: "https://www.reddit.com/r/Ado/",
    icon: <FontAwesomeIcon icon={faReddit} className="h-5 w-5" />,
    description: "Fan community to discuss Ado's music and news in Reddit",
  },
  {
    name: "Discord",
    url: "https://discord.gg/ado1024",
    icon: <FontAwesomeIcon icon={faDiscord} className="h-5 w-5" />,
    description:
      "Join the Ado Hangout server in Discord to connect with other Ado fans",
  },
];
