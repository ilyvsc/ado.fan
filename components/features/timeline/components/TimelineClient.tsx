"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import React, { useMemo, useRef } from "react";

import { TimelineItem } from "./TimelineItem";
import { TimelineNavigation } from "./TimelineNavigation";

import { useIsMobile } from "@/components/ui/use-mobile";
import { useTimelineScroll } from "@/features/timeline/hooks/use-timeline-scroll";
import { TimelineStep, TimelineYear } from "@/types/Music";

gsap.registerPlugin(ScrollTrigger);

function createTimelineSteps(
  timelineYears: readonly TimelineYear[],
  items: number = 3,
): TimelineStep[] {
  return timelineYears.flatMap(({ year, periods }) =>
    periods.flatMap(([period, songs], periodIndex) => {
      const length = Math.ceil(songs.length / items);
      return Array.from({ length }, (_, index) => {
        const start = index * items;
        return {
          year,
          period,
          songs: songs.slice(start, start + items),
          periodIndex: periodIndex * 10 + index,
        };
      });
    }),
  );
}

function createMobileTimelineSteps(
  timelineYears: readonly TimelineYear[],
): TimelineStep[] {
  const steps: TimelineStep[] = [];

  timelineYears.forEach((yearData) => {
    yearData.periods.forEach(([period, songs], periodIndex) => {
      songs.forEach((song, songIndex) => {
        steps.push({
          year: yearData.year,
          period: period,
          songs: [song],
          periodIndex,
          songIndex,
        });
      });
    });
  });

  return steps;
}

interface TimelineClientProps {
  readonly timelineYears: readonly TimelineYear[];
}

export function TimelineClient({ timelineYears }: TimelineClientProps) {
  const isMobile = useIsMobile();

  const timelineSteps = useMemo(() => {
    return isMobile
      ? createMobileTimelineSteps(timelineYears)
      : createTimelineSteps(timelineYears);
  }, [timelineYears, isMobile]);

  const { currentIndex, scrollToStep } = useTimelineScroll({
    stepsLength: timelineSteps.length,
    isMobile,
  });

  const currentStep = timelineSteps[currentIndex];
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      mainRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      },
    );
  }, []);

  return (
    <section
      className="relative bg-gradient-to-b from-black via-gray-900 to-black"
      aria-label={`Music timeline with ${timelineSteps.length} steps from ${timelineYears.length} years`}
    >
      <TimelineNavigation
        timelineYears={timelineYears}
        timelineSteps={timelineSteps}
        currentIndex={currentIndex}
        onYearClick={scrollToStep}
      />

      <main
        ref={mainRef}
        className={`w-full scroll-smooth ${
          isMobile ? "overflow-x-auto" : "overflow-y-auto"
        }`}
        style={{
          scrollSnapType: isMobile ? "x mandatory" : "y mandatory",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        aria-label={
          currentStep
            ? `Currently viewing ${currentStep.period} ${currentStep.year}`
            : "Timeline content"
        }
      >
        <div
          className={`relative m-12 ${isMobile ? "flex h-full" : "h-screen lg:h-[28rem]"}`}
        >
          {timelineSteps.map((step, index) => (
            <section
              key={`${step.year}-${step.period}-${step.periodIndex}-${index}`}
              className={`relative snap-start pt-6 md:pt-10 ${
                isMobile ? "w-screen shrink-0" : "h-screen lg:h-[36rem]"
              }`}
              aria-label={`${step.period} ${step.year} (Step ${index + 1}): ${step.songs.length} song${step.songs.length > 1 ? "s" : ""}`}
              aria-current={index === currentIndex ? "step" : undefined}
            >
              <div className="flex items-center justify-center md:pt-20">
                <TimelineItem
                  timelineYear={{
                    year: step.year,
                    songs: step.songs,
                    categorized: { early: [], mid: [], late: [] },
                    totalSongs: step.songs.length,
                    periods: [[step.period, step.songs]],
                    hasMultiplePeriods: false,
                  }}
                  index={index}
                />
              </div>
            </section>
          ))}
        </div>
      </main>
    </section>
  );
}
