import {
  SiDiscord,
  SiInstagram,
  SiReddit,
  SiSpotify,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { gsap } from "gsap";
import { Globe } from "lucide-react";

import Link from "next/link";
import React, { memo, useEffect, useRef } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    icon: <SiX className="h-5 w-5" />,
    description: "Official X (formerly Twitter) account managed by Ado's staff",
  },
  {
    name: "@ado1024imokenp",
    url: "https://x.com/ado1024imokenp",
    icon: <SiX className="h-5 w-5" />,
    description: "Official X (formerly Twitter) account managed by Ado",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@Ado1024",
    icon: <SiYoutube className="h-5 w-5" />,
    description: "Official YouTube channel with music videos and announcements",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/ado_staff_official/",
    icon: <SiInstagram className="h-5 w-5" />,
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
    icon: <SiSpotify className="h-5 w-5" />,
    description: "Listen to Ado's music on Spotify",
  },
];

export const fanLinks: SocialLink[] = [
  {
    name: "Reddit",
    url: "https://www.reddit.com/r/Ado/",
    icon: <SiReddit className="h-5 w-5" />,
    description: "Fan community to discuss Ado's music and news in Reddit",
  },
  {
    name: "Discord",
    url: "https://discord.gg/ado1024",
    icon: <SiDiscord className="h-5 w-5" />,
    description:
      "Join the Ado Hangout server in Discord to connect with other Ado fans",
  },
];

export const SocialLinkGrid = memo(function SocialLinkGrid({
  links,
}: {
  links: SocialLink[];
}) {
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.5,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              once: true,
            },
          },
        );
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link, i) => (
        <div
          key={link.name}
          ref={(el) => {
            cardRefs.current[i] = el!;
          }}
          className="h-full transform transition-transform duration-200 ease-out hover:scale-105"
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
                  <span className="break-words">{link.name}</span>
                </CardTitle>
                <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
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

export const SocialLinkList = memo(function SocialLinkList({
  links,
}: {
  links: ReadonlyArray<SocialLink>;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map(({ url, description, icon, name }) => (
        <Link
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={description}
          title={description}
          className="flex items-center space-x-2 rounded-lg px-3 py-2 transition hover:bg-ado-key/10 hover:text-white focus:ring-2 focus:ring-ado-key focus:outline-none"
        >
          {icon}
          <span className="text-sm md:text-lg">{name}</span>
        </Link>
      ))}
    </div>
  );
});
