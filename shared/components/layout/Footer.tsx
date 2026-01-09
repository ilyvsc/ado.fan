"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { usePathname } from "next/navigation";
import { useMemo, useRef } from "react";

import { useSocialLinks } from "@/hooks/useSocialLinks";
import { linksCategories } from "@/lib/socialLinks";

export function Footer() {
  const year = new Date().getFullYear();
  const rootRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const { socialMedia, musicPlatforms } = useMemo(() => {
    return {
      socialMedia: linksCategories["social-media"] ?? [],
      musicPlatforms: linksCategories["music-platforms"] ?? [],
    };
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
        },
      },
    );
  }, []);

  return (
    <footer
      ref={rootRef}
      className="relative w-full overflow-hidden border-y border-foreground/10 bg-background/60"
    >
      <div className="relative overflow-hidden bg-linear-to-b from-foreground/5 to-background/10">
        <div className="px-6 py-8 md:px-12 lg:px-16">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-foreground/10" />
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
              <span className="text-foreground/40">You're at</span>
              <span className="text-foreground">{pathname}</span>
            </div>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 lg:gap-32">
            {/* <nav aria-label="Sitemap" className="space-y-2">
                <h4 className="font-gambarino text-xl tracking-wide text-foreground/90">
                  Sitemap
                </h4>
              </nav> */}

            <nav aria-label="Socials" className="grid grid-cols-2 gap-10">
              <section aria-labelledby="footer-social-media">
                <h4 className="pb-2 font-gambarino text-xl tracking-wide text-foreground/90">
                  Social Media
                </h4>
                <div className="flex flex-wrap gap-x-4">
                  {useSocialLinks({
                    links: socialMedia,
                    className: `py-1 text-sm hover:underline hover:underline-offset-4 md:text-base`,
                  })}
                </div>
              </section>

              <section aria-labelledby="footer-music-platforms">
                <h4 className="pb-2 font-gambarino text-xl tracking-wide text-foreground/90">
                  Music Platforms
                </h4>
                <div className="flex flex-wrap gap-x-4">
                  {useSocialLinks({
                    links: musicPlatforms,
                    className: `py-1 text-sm hover:underline hover:underline-offset-4 md:text-base`,
                  })}
                </div>
              </section>
            </nav>
          </div>
        </div>

        <div className="border-t border-foreground/10 py-6 text-center text-xs text-foreground/40">
          <p className="mx-auto max-w-lg leading-relaxed lg:max-w-5xl">
            All content, media, lyrics, trademarks, and imagery on this site are
            the property of their respective owners; all rights remain with the
            original authors/rights holders.
          </p>
          <p className="pt-2">
            &copy; 2025-{year} Ado Fan Tribute — Powered by passion, not profit.
          </p>
        </div>
      </div>
    </footer>
  );
}
