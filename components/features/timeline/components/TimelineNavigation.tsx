"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import React from "react";

import { TimelinePeriod, TimelineYear } from "@/types/Music";

interface TimelineNavigationProps {
  readonly timelineYears: readonly TimelineYear[];
  readonly timelineSteps: readonly TimelinePeriod[];
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

      const element = navRef.current;
      const $ = gsap.utils.selector(element);
      const buttons = $("button");

      gsap.set(element, {
        autoAlpha: 0,
        yPercent: -10,
        willChange: "transform,opacity",
      });
      gsap.set(buttons, { autoAlpha: 0, yPercent: 10 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(element, { autoAlpha: 1, yPercent: 0, duration: 0.34 }, 0);

      if (buttons.length) {
        tl.to(
          buttons,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.28,
            stagger: { each: 0.02, from: "center" },
            onComplete: () => {
              gsap.set(buttons, { clearProps: "yPercent" });
            },
          },
          "-=0.16",
        );
      }

      tl.add(() => {
        gsap.set(element, { willChange: "auto", clearProps: "yPercent" });
      });
    },
    { scope: navRef },
  );

  const handleYearClick = (year: number) => {
    const firstStepIndex = timelineSteps.findIndex(
      (step) => step.year === year,
    );
    if (firstStepIndex !== -1) onYearClick(firstStepIndex);
  };

  return (
    <nav
      ref={navRef}
      className="absolute top-4 left-1/2 z-10 -translate-x-1/2"
      aria-label="Timeline years navigation"
    >
      <div className="max-w-screen px-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-3 backdrop-blur-sm sm:rounded-full sm:p-2">
          <div className="grid auto-cols-max grid-flow-col grid-rows-2 gap-2 sm:flex sm:flex-nowrap sm:gap-1">
            {timelineYears.map((timelineYear) => {
              const isActive = currentYear === timelineYear.year;
              return (
                <button
                  key={timelineYear.year}
                  onClick={() => handleYearClick(timelineYear.year)}
                  className={`rounded-full px-2 py-1 text-sm font-medium whitespace-nowrap transition-all duration-200 focus:ring-2 focus:ring-foreground/50 focus:outline-none sm:px-3 ${
                    isActive
                      ? "bg-white text-black shadow-lg"
                      : "text-foreground/60 hover:bg-foreground/10 hover:text-muted-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {timelineYear.year}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
});
