"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { SongCard } from "./TimelineCard";
import { TimelineHeader } from "./TimelineHeader";

import type { TimelineGroups } from "@/types/timeline";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function TimelineClient({
  timelineGroups,
}: {
  timelineGroups: TimelineGroups[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeYear, setActiveYear] = useState(timelineGroups[0]?.year ?? null);
  const [showSkip, setShowSkip] = useState(true);
  const [isPastMiddle, setIsPastMiddle] = useState(false);

  const activeYearRef = useRef(activeYear);
  const showSkipRef = useRef(showSkip);
  const isPastMiddleRef = useRef(isPastMiddle);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const content = contentRef.current;
      if (!wrapper || !content) return;

      const sections = gsap.utils.toArray<HTMLElement>(
        content.querySelectorAll("[data-year-section]"),
      );

      const cards = gsap.utils.toArray<HTMLElement>(
        content.querySelectorAll("[data-song-card]"),
      );

      const updateActiveYear = () => {
        const wrapperCenter = wrapper.getBoundingClientRect().width / 2;

        const activeSection = sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.left <= wrapperCenter && rect.right >= wrapperCenter;
        });

        if (!activeSection) return;

        const year = Number(activeSection.dataset.yearSection);
        if (!year || year === activeYearRef.current) return;

        activeYearRef.current = year;
        setActiveYear(year);
      };

      const updateScrollState = (progress: number) => {
        const nextIsPastMiddle = progress >= 0.5;
        const nextShowSkip = progress < 0.95;

        if (nextIsPastMiddle !== isPastMiddleRef.current) {
          isPastMiddleRef.current = nextIsPastMiddle;
          setIsPastMiddle(nextIsPastMiddle);
        }

        if (nextShowSkip !== showSkipRef.current) {
          showSkipRef.current = nextShowSkip;
          setShowSkip(nextShowSkip);
        }
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const getScrollDistance = () => content.offsetWidth - window.innerWidth;

        gsap.set([content, ...sections, ...cards], {
          willChange: "transform, opacity",
        });

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            id: "timeline-scroll",
            trigger: wrapper,
            start: "top top",
            end: () => `+=${getScrollDistance() * 0.8}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              updateActiveYear();
              updateScrollState(self.progress);
            },
          },
        });

        scrollTl.to(content, {
          x: () => -getScrollDistance(),
          ease: "none",
        });

        sections.forEach((section) => {
          gsap.from(section, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollTl,
              start: "left 85%",
              toggleActions: "play none none none",
            },
          });
        });

        cards.forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTl,
              start: "left 80%",
              toggleActions: "play none none none",
            },
          });
        });
      });

      mm.add("(max-width: 767px)", () => {
        ScrollTrigger.create({
          scroller: wrapper,
          horizontal: true,
          trigger: content,
          start: "top top",
          end: "max",
          onUpdate: updateActiveYear,
        });

        gsap.set(cards, { willChange: "transform, opacity" });
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
        });
      });

      return () => {
        gsap.set([content, ...sections, ...cards], {
          clearProps: "willChange",
        });
        mm.revert();
      };
    },
    { scope: wrapperRef, dependencies: [timelineGroups] },
  );

  const handleSkip = () => {
    const scrollTrigger = ScrollTrigger.getById("timeline-scroll");
    if (!scrollTrigger) return;

    gsap.to(window, {
      scrollTo: scrollTrigger.end,
      duration: 1.5,
      ease: "power2.inOut",
    });
  };

  return (
    <>
      <TimelineHeader />

      <div
        ref={wrapperRef}
        className={cn(
          "relative w-full overflow-x-auto transition-colors duration-700 ease-in-out md:h-screen md:overflow-hidden",
          isPastMiddle ? "bg-foreground" : "bg-background",
        )}
      >
        {showSkip && (
          <button
            onClick={handleSkip}
            className={cn(
              "absolute right-8 bottom-8 z-50 hidden items-center gap-1 rounded-md p-2 transition-colors duration-300 md:flex",
              isPastMiddle
                ? "bg-background/90 text-foreground hover:bg-background"
                : "bg-foreground/90 text-background hover:bg-foreground",
            )}
          >
            <span className="text-sm font-medium">Skip Timeline</span>
            <ArrowDown className="h-4 w-4" />
          </button>
        )}

        <div
          ref={contentRef}
          className="flex w-max items-center px-4 pb-32 md:h-screen md:p-24"
        >
          {timelineGroups.map((yearData) => {
            const isActive = activeYear === yearData.year;

            return (
              <div
                key={yearData.year}
                data-year-section={yearData.year}
                className="relative flex h-full flex-col justify-center gap-8 px-8 pt-12 md:flex-row md:items-center md:gap-16 md:px-12 md:pt-0"
              >
                <div className="sticky top-4 left-1/2 z-10 flex shrink-0 -translate-x-1/2 justify-center self-start md:pointer-events-none md:static md:h-full md:translate-x-0 md:flex-col md:justify-center md:self-auto">
                  <div
                    className={cn(
                      "font-gambarino text-7xl leading-none font-black tracking-tight transition-all duration-500 ease-out md:text-9xl md:[writing-mode:vertical-rl]",
                      isActive ? "scale-100 opacity-100" : "scale-95 opacity-10",
                      isPastMiddle ? "text-background" : "text-foreground",
                    )}
                  >
                    {yearData.year}
                  </div>
                </div>

                <div className="grid grid-flow-col grid-rows-4 gap-x-2 gap-y-2">
                  {yearData.songs.map((song) => (
                    <SongCard key={song.id} song={song} isPastMiddle={isPastMiddle} />
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
