import { useGSAP } from "@gsap/react";
import {
  SiApplemusic,
  SiDiscord,
  SiInstagram,
  SiNiconico,
  SiReddit,
  SiSpotify,
  SiTiktok,
  SiX,
  SiYoutube,
  SiYoutubemusic,
} from "@icons-pack/react-simple-icons";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BadgeJapaneseYen, CircleQuestionMark, Music4 } from "lucide-react";

import Link from "next/link";
import React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SocialCategory =
  | "social-media"
  | "shops"
  | "music-platforms"
  | "fan-communities";

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
}

export const linksCategories: Record<SocialCategory, SocialLink[]> = {
  "social-media": [
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
  ],

  shops: [
    {
      name: "Music Shop",
      url: "https://ado-shop.com/",
      icon: <Music4 className="h-4 w-4" />,
      description: "Browse Ado's official music shop, limited drops, and goods",
    },
    {
      name: "Merchandise Shop",
      url: "https://ado-officialshop-friedpotato.com",
      icon: <BadgeJapaneseYen className="h-4 w-4" />,
      description:
        "Browse Ado's official merchandise, limited drops, and goods",
    },
  ],

  "music-platforms": [
    {
      name: "Apple Music",
      url: "https://music.apple.com/us/artist/ado/1492604670",
      icon: <SiApplemusic className="h-4 w-4" />,
      description: "Listen to Ado's albums, singles, and collaborations",
    },
    {
      name: "Amazon Music",
      url: "https://music.amazon.com/artists/B0010RVN6C/ado",
      icon: <Music4 className="h-4 w-4" />,
      description: "Listen to Ado's albums, singles, and collaborations",
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/artist/6mEQK9m2krja6X1cfsAjfl",
      icon: <SiSpotify className="h-4 w-4" />,
      description: "Listen to Ado's albums, singles, and collaborations",
    },
    {
      name: "YouTube Music",
      url: "https://music.youtube.com/channel/UCln9P4Qm3-EAY4aiEPmRwEA",
      icon: <SiYoutubemusic className="h-4 w-4" />,
      description: "Listen to Ado's albums, singles, and collaborations",
    },
  ],

  "fan-communities": [
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
      description:
        "Join the Ado Hangout server in Discord to connect with other Ado fans",
    },
    {
      name: "Doki Doki Secret Base",
      url: "https://ado-dokidokihimitsukichi-daigakuimo.com",
      icon: <CircleQuestionMark className="h-4 w-4" />,
      description:
        "Ado's membership fan club with exclusive content, behind-the-scenes stories, and tour vlogs",
    },
  ],
};

export const links: SocialLink[] = Object.values(linksCategories).flat();

export const SocialLinkGrid = React.memo(function SocialLinkGrid({
  links,
}: {
  links: SocialLink[];
}) {
  const cardRefs = React.useRef<HTMLDivElement[]>([]);

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.5,
            delay: i * 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              once: true,
            },
          },
        );

        card.addEventListener("mouseenter", () => {
          gsap.to(card, { scale: 1.05, duration: 0.2, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
      }, card);

      return () => ctx.revert();
    });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link, i) => (
        <div
          key={link.name}
          ref={(el) => {
            cardRefs.current[i] = el!;
          }}
        >
          <Link
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <Card className="flex h-full flex-col justify-between overflow-hidden border-ado-key/20 bg-card shadow-sm transition-colors hover:border-ado-key/40 hover:bg-card/90 hover:shadow-md">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {link.icon}
                  {link.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {link.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
});

export const SocialLinkList = React.memo(function SocialLinkList({
  links,
  className,
}: {
  links: ReadonlyArray<SocialLink>;
  className?: string;
}) {
  return (
    <>
      {links.map(({ url, description, icon, name }) => (
        <Link
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={description}
          title={description}
          className={clsx("flex items-center gap-2", className)}
        >
          {icon}
          <span>{name}</span>
        </Link>
      ))}
    </>
  );
});
