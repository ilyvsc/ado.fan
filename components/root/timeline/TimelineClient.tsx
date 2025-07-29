"use client";

import { motion } from "framer-motion";

import React, { useMemo } from "react";

import { TimelineItem } from "./TimelineItem";
import { TimelineNavigation } from "./TimelineNavigation";

import { TimelineStep, TimelineYear } from "@/types/Music";
import { useIsMobile } from "@/utils/hooks/use-mobile";
import { useTimelineScroll } from "@/utils/hooks/use-timeline-scroll";

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

  const containerHeightClasses = isMobile
    ? "h-[calc(100vh-20rem)] max-sm:h-[calc(100vh-24rem)]"
    : "h-[calc(100vh-24rem)] 2xl:h-[calc(100vh-24rem)] max-3xl:h-[calc(100vh-30rem)] 3xl:h-[calc(100vh-35rem)]";

  return (
    <section
      className={`relative ${containerHeightClasses} w-full overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black`}
      aria-label={`Timeline with ${timelineSteps.length} steps across ${timelineYears.length} years. Currently viewing step ${currentIndex + 1}`}
    >
      <TimelineNavigation
        timelineYears={timelineYears}
        timelineSteps={timelineSteps}
        currentIndex={currentIndex}
        onYearClick={scrollToStep}
      />

      <motion.main
        ref={containerRef}
        className={`h-full w-full scroll-smooth ${isMobile ? "overflow-x-auto" : "overflow-y-auto"
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
        transition={{ duration: 0.6, ease: "easeOut" }}
        tabIndex={0}
        aria-live="polite"
      >
        <div className={`relative ${isMobile ? "flex h-full" : ""}`}>
          {timelineSteps.map((step, index) => (
            <motion.section
              key={`${step.year}-${step.period}-${step.songIndex ?? 0}`}
              className={`${isMobile
                  ? "relative h-full w-screen shrink-0 snap-start px-4 sm:px-6"
                  : "relative h-[calc(100vh-24rem)] w-full snap-start px-2 max-3xl:h-[calc(100vh-30rem)] 2xl:h-[calc(100vh-24rem)] 3xl:h-[calc(100vh-35rem)] sm:px-4 lg:px-6"
                }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              aria-label={`Timeline step ${index + 1} of ${timelineSteps.length}: ${step.period} ${step.year} with ${step.songs.length} song${step.songs.length > 1 ? "s" : ""}`}
              aria-current={index === currentIndex ? "step" : undefined}
            >
              <div className="absolute inset-0 flex items-start justify-center pt-18 2xl:pt-30 sm:pt-26 xl:pt-24">
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
            </motion.section>
          ))}
        </div>
      </motion.main>
    </section>
  );
}
