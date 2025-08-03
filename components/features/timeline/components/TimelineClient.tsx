"use client";

import { motion } from "framer-motion";

import React, { useMemo } from "react";

import { TimelineItem } from "./TimelineItem";
import { TimelineNavigation } from "./TimelineNavigation";

import { useIsMobile } from "@/components/ui/use-mobile";
import { useTimelineScroll } from "@/features/timeline/hooks/use-timeline-scroll";
import { TimelineStep, TimelineYear } from "@/types/Music";

function createTimelineSteps(
  timelineYears: readonly TimelineYear[],
): TimelineStep[] {
  const steps: TimelineStep[] = [];

  timelineYears.forEach((yearData) => {
    yearData.periods.forEach(([period, songs], periodIndex) => {
      steps.push({
        year: yearData.year,
        period: period,
        songs,
        periodIndex,
      });
    });
  });

  return steps;
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

  const { containerRef, currentIndex, scrollToStep } = useTimelineScroll({
    stepsLength: timelineSteps.length,
    isMobile,
  });

  const currentStep = timelineSteps[currentIndex];
  return (
    <section
      className="relative bg-gradient-to-b from-black via-gray-900 to-black"
      aria-label={`Music timeline with ${timelineSteps.length} steps from ${timelineYears.length} years`}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <TimelineNavigation
          timelineYears={timelineYears}
          timelineSteps={timelineSteps}
          currentIndex={currentIndex}
          onYearClick={scrollToStep}
        />
      </motion.div>

      <motion.main
        ref={containerRef}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        tabIndex={0}
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
              key={`${step.year}-${step.period}-${step.songIndex ?? 0}`}
              className={`relative snap-start pt-6 md:pt-10 ${
                isMobile ? "w-screen shrink-0" : "h-screen lg:h-[36rem]"
              }`}
              aria-label={`${step.period} ${step.year}: ${step.songs.length} song${step.songs.length > 1 ? "s" : ""}`}
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
      </motion.main>
    </section>
  );
}
