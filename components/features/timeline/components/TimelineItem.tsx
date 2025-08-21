"use client";

import React from "react";

import { SongCard } from "./TimelineCard";

import { TimelineYear } from "@/types/Music";

export const TimelineItem = React.memo(function TimelineItem({
  timelineYear,
}: {
  readonly timelineYear: TimelineYear;
}) {
  const { year, periods } = timelineYear;

  return (
    <div className="relative w-full max-w-6xl px-2 sm:px-4 lg:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="space-y-6">
          {periods.map(({ period, label, songs }) => {
            const periodId = `period-${year}-${period}`;

            return (
              <div
                key={periodId}
                className="relative"
                aria-labelledby={periodId}
              >
                <header className="mb-4 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-gray-400/30 to-gray-600/30" />
                  <h3
                    id={periodId}
                    className="text-sm font-semibold tracking-wider text-muted-foreground uppercase"
                  >
                    {label}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-gray-400/30 to-gray-600/30" />
                </header>

                <div
                  className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                  aria-label={`${songs.length} songs from ${label}`}
                >
                  {songs.map((song, songIndex) => {
                    const isLastCard = songs.length === 3 && songIndex === 2;

                    return (
                      <div
                        key={song.id}
                        className={`flex justify-center ${isLastCard ? "md:col-span-2 lg:col-span-1" : ""}`}
                      >
                        <SongCard
                          song={song}
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
