import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";

import Link from "next/link";
import React from "react";

import type { SocialLink } from "@/types/social";

export function SocialIcons({ links }: { links: SocialLink[] }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-social-card]");

      gsap.fromTo(
        cards,
        { autoAlpha: 0, x: -10 },
        {
          autoAlpha: 1,
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
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
    >
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block outline-none"
          data-social-card
        >
          <div className="relative flex h-24 items-start gap-3 overflow-hidden rounded-md border border-foreground/5 bg-foreground/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-ado-primary/20 hover:bg-foreground/10">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-foreground/70 ring-1 ring-foreground/5 transition-all duration-300 group-hover:bg-ado-primary/10 group-hover:text-ado-primary group-hover:ring-ado-primary/20">
              {link.icon}
            </span>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground transition-colors">
                  {link.name}
                </span>
                <ArrowUpRight className="h-4 w-4 text-foreground/40 opacity-0 transition-all duration-300 group-hover:text-ado-primary/70 group-hover:opacity-100" />
              </div>
              <p className="line-clamp-2 text-sm text-foreground/50 transition-colors group-hover:text-foreground/70">
                {link.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
