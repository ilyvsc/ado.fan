"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef, useState } from "react";

import { SongCard } from "./TimelineCard";
import { TimelineHeader } from "./TimelineHeader";

import type { TimelineYear } from "@/types/Music";

gsap.registerPlugin(ScrollTrigger);

export function TimelineClient({
  timelineYears,
}: {
  timelineYears: TimelineYear[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeYear, setActiveYear] = useState(timelineYears[0]?.year ?? null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const content = contentRef.current;
      if (!wrapper || !content) return;

      const q = gsap.utils.selector(content);
      const sections = q("[data-year-section]");
      const centerX = window.innerWidth / 2;

      const updateActiveYear = () => {
        for (const el of sections) {
          const rect = el.getBoundingClientRect();
          if (rect.left <= centerX && rect.right >= centerX) {
            const year = parseInt(
              (el as HTMLElement).dataset.yearSection || "0",
            );
            if (year) {
              setActiveYear(year);
              break;
            }
          }
        }
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        wrapper.scrollLeft = 0;

        const getScrollDistance = () => content.offsetWidth - window.innerWidth;

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: updateActiveYear,
          },
        });

        gsap.set(content, { willChange: "transform" });

        scrollTl.to(content, {
          x: () => -getScrollDistance(),
          ease: "none",
        });

        const yearLabels = q("[data-year-section]");
        yearLabels.forEach((label) => {
          gsap.fromTo(
            label,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: label,
                containerAnimation: scrollTl,
                start: "left 85%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        const cards = q("[data-song-card]");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTl,
                start: "left 80%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        gsap.set([...yearLabels, ...cards], {
          willChange: "transform, opacity",
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(content, { x: 0 });

        ScrollTrigger.create({
          scroller: wrapper,
          horizontal: true,
          trigger: content,
          start: "top top",
          end: "max",
          onUpdate: updateActiveYear,
        });

        const cards = q("[data-song-card]");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, x: 30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                scroller: wrapper,
                horizontal: true,
                trigger: card,
                start: "left 100%",
                toggleActions: "play none none none",
              },
            },
          );
          gsap.set(card, { willChange: "transform, opacity" });
        });
      });

      return () => mm.revert();
    },
    { scope: wrapperRef, dependencies: [timelineYears] },
  );

  return (
    <>
      <TimelineHeader />

      <div
        ref={wrapperRef}
        className="relative w-full overflow-x-auto bg-background md:h-screen md:overflow-hidden"
      >
        <div
          ref={contentRef}
          className="flex w-max items-center px-4 pb-32 md:h-screen md:p-24"
        >
          {timelineYears.map((yearData) => {
            const isActive = activeYear === yearData.year;

            return (
              <div
                key={yearData.year}
                data-year-section={yearData.year}
                className="relative flex h-full flex-col justify-center gap-8 px-8 pt-12 md:flex-row md:items-center md:gap-16 md:px-12 md:pt-0"
              >
                <div className="pointer-events-none relative flex shrink-0 justify-center md:h-full md:flex-col md:justify-center">
                  <div
                    className={`font-gambarino text-7xl leading-none font-black tracking-tighter text-foreground transition-all duration-500 ease-out md:text-9xl md:[writing-mode:vertical-rl] ${
                      isActive ? "scale-100 opacity-100" : "scale-95 opacity-10"
                    }`}
                  >
                    {yearData.year}
                  </div>
                </div>

                <div className="grid grid-flow-col grid-rows-4 gap-x-2 gap-y-2">
                  {yearData.songs.map((song) => (
                    <div key={song.id} data-song-card>
                      <SongCard song={song} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
