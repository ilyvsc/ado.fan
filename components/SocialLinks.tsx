import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";

import Link from "next/link";
import React from "react";

import { SocialLink, categories } from "@/utils/lib/social-data";

export function SocialLinkGrid({ links }: { links: SocialLink[] }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLDivElement>("[data-social-card]");

      gsap.fromTo(
        cards,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block outline-none"
            data-social-card
          >
            <div className="relative flex items-start gap-3 rounded-md border border-foreground/5 bg-foreground/5 p-4 transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-foreground/70  ring-1 ring-foreground/5 transition-colors group-hover:text-foreground">
                {link.icon}
              </span>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground transition-colors">
                    {link.name}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-foreground/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <p className="text-sm text-foreground/50 transition-colors group-hover:text-foreground/70">
                  {link.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function SocialLinkList({
  links,
  className,
}: {
  links: ReadonlyArray<SocialLink>;
  className?: string;
}) {
  return (
    <>
      {links.map(({ url, description, icon, name }) => {
        return (
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
        );
      })}
    </>
  );
}

export const links = categories.flatMap((cat) => cat.data);

export const linksCategories = Object.fromEntries(
  categories.map((cat) => [cat.id, cat.data]),
) as Record<string, SocialLink[]>;
