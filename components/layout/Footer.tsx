"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Link from "next/link";
import React, { useRef } from "react";

import { InfiniteTextAnimation } from "@/animations/infiniteTextAnimation";
import {
  fanLinks,
  officialLinks,
  SocialLinkList,
} from "@/components/SocialLinks";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const year = new Date().getFullYear();
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const topCtaRef = useRef<HTMLAnchorElement>(null);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(() => {
    if (reducedMotion) return;
    gsap.from(panelRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: panelRef.current,
        start: "top 85%",
        once: true,
      },
    });
    gsap.from(topCtaRef.current, {
      opacity: 0,
      x: 12,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: panelRef.current,
        start: "top 80%",
        once: true,
      },
    });
  }, [reducedMotion]);

  return (
    <footer ref={rootRef} className="w-full bg-background text-foreground">
      <div ref={panelRef} className="w-full">
        <div className="relative overflow-hidden border-y border-foreground/10 bg-foreground/[0.04]">
          <div className="px-6 pt-8 pb-2 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
              {/* Sitemap */}
              <nav aria-label="Sitemap" className="space-y-5">
                <div className="text-xs font-semibold tracking-[0.2em] text-foreground/60 uppercase">
                  01/ Sitemap
                </div>
                <ul className="flex flex-wrap gap-4">
                  {["Home", "Home2", "a", "Home3"].map((label) => (
                    <li key={label}>
                      <Link
                        href={`/${label.toLowerCase()}`}
                        className="text-sm text-foreground/80 decoration-ado-key hover:text-muted-foreground hover:overline"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Socials */}
              <nav aria-label="Socials" className="space-y-5">
                <div className="text-xs font-semibold tracking-[0.2em] text-foreground/60 uppercase">
                  02/ Socials
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-3 text-xs font-semibold tracking-wide text-foreground/70 uppercase">
                      Official
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      <SocialLinkList links={officialLinks} />
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-3 text-xs font-semibold tracking-wide text-foreground/70 uppercase">
                      Fan Community
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      <SocialLinkList links={fanLinks} />
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>

          <div className="relative">
            <InfiniteTextAnimation direction="right" speed={2}>
              <div className="flex gap-6 text-6xl md:text-8xl">
                <span className="font-playfair font-thin">Ado</span>
              </div>
            </InfiniteTextAnimation>

            <div className="mx-6 mt-4 mb-4 flex items-center justify-between text-xs tracking-[0.2em] text-foreground/60 uppercase md:mx-12 lg:mx-16">
              <span className="pointer-events-none">Fan site / Tribute</span>
              <span className="pointer-events-none">{year}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 text-center text-xs text-foreground/60 md:px-12 lg:px-16">
          <p
            role="note"
            className="mx-auto max-w-3xl leading-relaxed lg:max-w-6xl"
          >
            All content, media, lyrics, trademarks, and imagery on this site are
            the property of their respective owners; all rights remain with the
            original authors/rights holders.
          </p>

          <p className="pt-2">
            &copy; {year} Ado Fan Tribute — Powered by passion, not profit.
          </p>
        </div>
      </div>
    </footer>
  );
}
