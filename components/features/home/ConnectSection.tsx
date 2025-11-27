"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useMemo, useRef } from "react";

import { linksCategories, SocialLinkGrid } from "@/components/SocialLinks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

gsap.registerPlugin(ScrollTrigger);

export function ConnectSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const { socialMedia, shops, musicPlatforms, fanCommunities } = useMemo(() => {
    return {
      socialMedia: linksCategories["social-media"] ?? [],
      shops: linksCategories["shops"] ?? [],
      musicPlatforms: linksCategories["music-platforms"] ?? [],
      fanCommunities: linksCategories["fan-communities"] ?? [],
    };
  }, []);

  useGSAP(() => {
    if (!headingRef.current || !textRef.current || !tabsRef.current) return;

    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 80%" },
      },
    );

    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.15,
        ease: "power2.out",
        scrollTrigger: { trigger: textRef.current, start: "top 85%" },
      },
    );

    gsap.fromTo(
      tabsRef.current,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: { trigger: tabsRef.current, start: "top 90%" },
      },
    );
  }, []);

  return (
    <section className="relative flex w-full flex-col justify-center overflow-hidden bg-ado-secondary/15 py-20 sm:items-center">
      <div ref={containerRef} className="container mx-auto px-4">
        <h2
          ref={headingRef}
          className="mb-6 text-center font-gambarino text-5xl text-foreground uppercase md:text-6xl"
        >
          Adomination
        </h2>

        <p
          ref={textRef}
          className="text-md mx-auto mb-8 max-w-4xl text-center text-balance text-muted-foreground md:text-xl"
        >
          Follow official accounts, shop official merch, stream the music, or
          join vibrant communities to celebrate together while supporting Ado!
        </p>

        <Tabs defaultValue="social-media" className="mx-auto w-full max-w-5xl">
          <div ref={tabsRef} className="flex justify-center">
            <TabsList className="relative inline-flex h-14 items-center justify-center gap-1 rounded-lg bg-foreground/5 p-2">
              <TabsTrigger
                value="social-media"
                className="sm:text-md rounded px-2 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-card data-[state=active]:bg-ado-secondary/40 sm:px-4"
              >
                Social Media
              </TabsTrigger>
              <TabsTrigger
                value="shops"
                className="sm:text-md rounded px-2 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-card data-[state=active]:bg-ado-secondary/40 sm:px-4"
              >
                Shops
              </TabsTrigger>
              <TabsTrigger
                value="music-platforms"
                className="sm:text-md rounded px-2 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-card data-[state=active]:bg-ado-secondary/40 sm:px-4"
              >
                Music Platforms
              </TabsTrigger>
              <TabsTrigger
                value="fan-communities"
                className="sm:text-md rounded px-2 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-card data-[state=active]:bg-ado-secondary/40 sm:px-4"
              >
                Fandom
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="social-media">
            <SocialLinkGrid links={socialMedia} />
          </TabsContent>

          <TabsContent value="shops">
            <SocialLinkGrid links={shops} />
          </TabsContent>

          <TabsContent value="music-platforms">
            <SocialLinkGrid links={musicPlatforms} />
          </TabsContent>

          <TabsContent value="fan-communities">
            <SocialLinkGrid links={fanCommunities} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
