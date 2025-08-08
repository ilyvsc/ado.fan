"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";

import {
  fanLinks,
  officialLinks,
  SocialLinkGrid,
} from "@/components/SocialLinks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

gsap.registerPlugin(ScrollTrigger);

export function ConnectSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
      },
    );

    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 85%",
        },
      },
    );

    gsap.fromTo(
      tabsRef.current,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: tabsRef.current,
          start: "top 90%",
        },
      },
    );
  }, []);

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-ado-key/5 py-20 sm:items-center">
      <div ref={containerRef} className="container mx-auto px-4">
        <h2
          ref={headingRef}
          className="mb-6 text-center text-4xl leading-tight font-black text-foreground uppercase md:text-6xl"
        >
          Adomination
        </h2>

        <p
          ref={textRef}
          className="mx-auto mb-8 max-w-2xl text-center text-lg text-muted-foreground md:text-2xl"
        >
          Follow official accounts or join vibrant fan communities to celebrate
          together while supporting Ado's music!
        </p>

        <Tabs defaultValue="official" className="mx-auto w-full max-w-4xl">
          <div ref={tabsRef} className="flex justify-center">
            <TabsList className="inline-flex h-14 items-center justify-center p-2">
              <TabsTrigger
                value="official"
                className="text-md rounded-lg px-5 py-2 font-semibold transition-all data-[state=active]:bg-ado-key/80 data-[state=active]:text-white"
              >
                Official
              </TabsTrigger>
              <TabsTrigger
                value="fan"
                className="text-md rounded-lg px-5 py-2 font-semibold transition-all data-[state=active]:bg-ado-key/80 data-[state=active]:text-white"
              >
                Fan Communities
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="official" className="mt-8">
            <SocialLinkGrid links={officialLinks} />
          </TabsContent>

          <TabsContent value="fan" className="mt-8">
            <SocialLinkGrid links={fanLinks} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
