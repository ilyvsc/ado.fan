"use client";

import { motion } from "framer-motion";

import React from "react";

import { SongCard } from "./SongCard";

import { Period, TimelineYear } from "@/types/Music";

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

  return (
    <div className="relative w-full max-w-6xl px-2 sm:px-4 lg:px-6">
      <motion.div
        className="flex w-full items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{
          duration: 0.8,
          delay: index * 0.2,
          ease: "easeOut",
        }}
      >
        <motion.div
          className="mx-auto w-full max-w-5xl"
          whileHover={{
            scale: 1.01,
            y: -3,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-6">
              {periods.map(([period, periodSongs], periodIndex) => {
                return (
                  <motion.section
                    key={period}
                    className="relative"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5 + periodIndex * 0.1,
                    }}
                    aria-labelledby={`period-${year}-${period}`}
                  >
                    <header className="mb-4 flex items-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-gray-400/20 to-gray-600/20" />
                      <div className="flex items-center gap-3">
                        <h3
                          id={`period-${year}-${period}`}
                          className="text-sm font-semibold tracking-wider text-white/80 uppercase"
                        >
                          {getPeriodLabel(period as Period, year)}
                        </h3>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-l from-gray-400/20 to-gray-600/20" />
                    </header>

                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
                      aria-label={`${periodSongs.length} songs from ${getPeriodLabel(period as Period, year)}`}
                    >
                      {periodSongs.map((song, songIndex) => {
                        return (
                          <div
                            key={song.id}
                            className="flex justify-center"
                          >
                            <SongCard
                              song={song}
                              animationDelay={
                                0.6 +
                                periodIndex * 0.1 +
                                songIndex * 0.02
                              }
                              themeColor={themeColor}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
});
