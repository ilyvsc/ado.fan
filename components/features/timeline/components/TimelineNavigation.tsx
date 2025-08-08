"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import React from "react";

import { TimelineStep, TimelineYear } from "@/types/Music";

gsap.registerPlugin(ScrollTrigger);

interface TimelineNavigationProps {
  readonly timelineYears: readonly TimelineYear[];
  readonly timelineSteps: readonly TimelineStep[];
  readonly currentIndex: number;
  readonly onYearClick: (stepIndex: number) => void;
}

export const TimelineNavigation = React.memo(function TimelineNavigation({
  timelineYears,
  timelineSteps,
  currentIndex,
  onYearClick,
}: TimelineNavigationProps) {
  const navRef = React.useRef<HTMLDivElement>(null);
  const currentYear = timelineSteps[currentIndex]?.year;

  useGSAP(
    () => {
      if (!navRef.current) return;
      gsap.from(navRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { dependencies: [navRef] },
  );

  const handleYearClick = (year: number) => {
    const firstStepIndex = timelineSteps.findIndex(
      (step) => step.year === year,
    );
    if (firstStepIndex !== -1) {
      onYearClick(firstStepIndex);
    }
  };

  return (
    <nav
      ref={navRef}
      className="absolute top-4 left-1/2 z-10 -translate-x-1/2"
      aria-label="Timeline years navigation"
    >
      <div className="max-w-screen overflow-x-auto">
        <div className="flex min-w-fit items-center gap-0 rounded-full border border-white/10 bg-black/20 px-2 py-1 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2">
          {timelineYears.map((timelineYear) => (
            <button
              key={timelineYear.year}
              onClick={() => handleYearClick(timelineYear.year)}
              className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap transition-all duration-200 focus:ring-2 focus:ring-white/50 focus:outline-none sm:px-3 sm:text-sm ${
                currentYear === timelineYear.year
                  ? "bg-white text-black shadow-lg"
                  : "text-white/60 hover:bg-white/10 hover:text-white/80"
              }`}
              aria-label={`Jump to year ${timelineYear.year} (${timelineYear.totalSongs} songs)`}
              aria-current={
                currentYear === timelineYear.year ? "page" : undefined
              }
            >
              {timelineYear.year}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
});
