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
  readonly isLeft: boolean;
  readonly index?: number;
}

export const TimelineItem = React.memo(function TimelineItem({
  timelineYear,
  isLeft,
  index = 0,
}: TimelineItemProps) {
  const { year, songs, periods } = timelineYear;
  const themeColor = songs[0]?.themeColor ?? "var(--ado-key)";

  return (
    <div className="relative w-full max-w-7xl px-2 sm:px-4 lg:px-6">
      <motion.div
        className={`flex w-full items-center ${isLeft ? "justify-start" : "justify-end"}`}
        initial={{ opacity: 0, x: isLeft ? -100 : 100, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{
          duration: 0.8,
          delay: index * 0.2,
          ease: "easeOut",
        }}
      >
        <motion.div
          className={`w-full max-w-6xl ${isLeft ? "mr-auto" : "ml-auto"}`}
          whileHover={{
            scale: 1.02,
            y: -5,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="space-y-8">
              {periods.map(([period, periodSongs], periodIndex) => {
                return (
                  <motion.section
                    key={period}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + periodIndex * 0.1,
                    }}
                    aria-labelledby={`period-${year}-${period}`}
                  >
                    <header className="mb-3 flex items-center gap-4">
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
                      className="relative isolate min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]"
                      role="grid"
                      aria-label={`${periodSongs.length} songs from ${getPeriodLabel(period as Period, year)}`}
                    >
                      {periodSongs.map((song, songIndex) => {
                        const position = songIndex % 3; // 0, 1, or 2
                        const gridPosition = {
                          left: `${position * 33.33}%`,
                          top: `${Math.floor(songIndex / 3) * 100 + 20}px`,
                        };

                        return (
                          <div
                            key={song.id}
                            className="absolute"
                            style={{
                              left: gridPosition.left,
                              top: gridPosition.top,
                              width: "340px",
                              maxWidth: "90vw",
                              height: "320px",
                              zIndex: 1,
                            }}
                          >
                            <SongCard
                              song={song}
                              isLeft={isLeft}
                              position={{ left: "0px", top: "0px" }}
                              animationDelay={
                                0.7 +
                                periodIndex * 0.1 +
                                position * 0.05 +
                                songIndex * 0.02
                              }
                              themeColor={themeColor}
                              stackIndex={0}
                              isVisible={true}
                              isHovered={false}
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
