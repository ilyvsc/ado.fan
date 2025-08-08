"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import React from "react";

import { SongCard } from "./TimelineCard";

import { Period, TimelineYear } from "@/types/Music";

gsap.registerPlugin(ScrollTrigger);

function getPeriodLabel(period: Period, year: number): string {
  const labels = {
    early: `EARLY ${year}`,
    mid: `MID ${year}`,
    late: `LATE ${year}`,
  } as const;

  return labels[period] || "";
}

interface TimelineItemProps {
  readonly timelineYear: TimelineYear;
  readonly index?: number;
}

export const TimelineItem = React.memo(function TimelineItem({
  timelineYear,
  index = 0,
}: TimelineItemProps) {
  const { year, songs, periods } = timelineYear;
  const themeColor = songs[0]?.themeColor ?? "var(--ado-key)";
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.2,
        ease: "power2.out",
      });
    },
    { dependencies: [index] },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl px-2 sm:px-4 lg:px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="space-y-6">
          {periods.map(([period, periodSongs], periodIndex) => {
            return (
              <div
                key={period}
                className="relative"
                aria-labelledby={`period-${year}-${period}`}
              >
                <header className="mb-4 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-gray-400/20 to-gray-600/20" />
                  <h3
                    id={`period-${year}-${period}`}
                    className="text-sm font-semibold tracking-wider text-white/80 uppercase"
                  >
                    {getPeriodLabel(period as Period, year)}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-gray-400/20 to-gray-600/20" />
                </header>

                <div
                  className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                  aria-label={`${periodSongs.length} songs from ${getPeriodLabel(period as Period, year)}`}
                >
                  {periodSongs.map((song, songIndex) => {
                    const isLastCard =
                      periodSongs.length === 3 && songIndex === 2;

                    return (
                      <div
                        key={song.id}
                        className={`flex justify-center ${
                          isLastCard ? "md:col-span-2 lg:col-span-1" : ""
                        }`}
                      >
                        <SongCard
                          song={song}
                          themeColor={themeColor}
                          useHorizontalLayout={isLastCard}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
