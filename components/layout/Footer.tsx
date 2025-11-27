"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Link from "next/link";
import React, { useMemo, useRef } from "react";

import { linksCategories, SocialLinkList } from "@/components/SocialLinks";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const year = new Date().getFullYear();
  const rootRef = useRef<HTMLElement>(null);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { socialMedia, musicPlatforms } = useMemo(() => {
    return {
      socialMedia: linksCategories["social-media"] ?? [],
      musicPlatforms: linksCategories["music-platforms"] ?? [],
    };
  }, []);

  useGSAP(() => {
    if (reducedMotion || !rootRef.current) return;

    gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 95%",
        },
      },
    );
  }, [reducedMotion]);

  return (
    <footer ref={rootRef} className="w-full bg-background text-foreground">
      <div className="w-full">
        <div className="relative overflow-hidden border-y border-foreground/10 bg-foreground/5">
          <div className="px-6 pt-8 pb-2 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
              {/* Sitemap */}
              <nav aria-label="Sitemap" className="space-y-5">
                <div className="text-xs font-semibold tracking-[0.2em] text-foreground/60 uppercase">
                  01/ Sitemap
                </div>
                <ul className="flex flex-wrap gap-4">
                  {["Home", "Songs", "Albums"].map((label) => (
                    <li key={label}>
                      <Link
                        href={`/${label.toLowerCase()}`}
                        className="text-sm text-muted-foreground decoration-ado-key hover:overline"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Socials */}
              <nav aria-label="Socials" className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <section aria-labelledby="footer-social-media">
                    <h4 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:text-sm">
                      Social Media
                    </h4>
                    <SocialLinkList links={socialMedia} />
                  </section>

                  <section aria-labelledby="footer-music-platforms">
                    <h4 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:text-sm">
                      Music Platforms
                    </h4>
                    <SocialLinkList links={musicPlatforms} />
                  </section>
                </div>
              </nav>
            </div>
          </div>

          <div className="relative">
            <div className="mx-6 mt-4 mb-4 flex items-center justify-between text-xs tracking-[0.2em] text-foreground/60 uppercase md:mx-12 lg:mx-16">
              <span className="pointer-events-none">Fan site / Tribute</span>
              <span className="pointer-events-none">{year}</span>
            </div>
          </div>

          <div className="bg-background px-6 py-6 text-center text-xs text-foreground/60 md:px-12 lg:px-16">
            <p
              role="note"
              className="mx-auto max-w-3xl leading-relaxed lg:max-w-6xl"
            >
              All content, media, lyrics, trademarks, and imagery on this site
              are the property of their respective owners; all rights remain
              with the original authors/rights holders.
            </p>
            <p className="pt-2">
              &copy; {year} Ado Fan Tribute — Powered by passion, not profit.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
