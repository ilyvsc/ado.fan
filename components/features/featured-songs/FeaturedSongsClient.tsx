"use client";

import React, { useDeferredValue, useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { NicoNicoPlayer, YouTubePlayer } from "@/components/VideoPlayer";
import { Song } from "@/types/Music";

interface FeaturedSongsClientProps {
  songs: Song[];
}

const FeaturedSongCard = React.memo(function FeaturedSongCard({
  song,
}: Readonly<{
  song: Song;
}>) {
  const themeColor = song.themeColor ?? "var(--ado-key)";

  const dynamicStyles = useMemo(
    () => ({
      color: themeColor,
    }),
    [themeColor],
  );

  return (
    <div className="group relative w-full">
      <Card className="relative gap-0 overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-card/90 to-card/50 p-0 shadow-md backdrop-blur-xl transition-all duration-300 group-hover:shadow-2xl hover:shadow-ado-key/40">
        <div className="relative h-56 w-full overflow-hidden">
          {(() => {
            if (song.youtubeId) {
              return <YouTubePlayer song={song} />;
            }

            if (song.nicoId) {
              return <NicoNicoPlayer song={song} />;
            }

            return (
              <div className="flex h-full items-center justify-center bg-linear-to-br from-gray-800 to-gray-900 text-muted-foreground">
                No preview available
              </div>
            );
          })()}

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent" />
        </div>

        <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-xl font-black tracking-tight text-foreground uppercase sm:text-2xl">
              {song.title.english}
            </h3>
            {song.title.japanese && (
              <h4
                className="line-clamp-1 text-lg font-bold tracking-wide sm:text-xl"
                style={dynamicStyles}
              >
                {song.title.japanese}
              </h4>
            )}
          </div>

          <p className="line-clamp-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {song.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-gray-400">
              {song.releaseDate}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export function FeaturedSongsClient({
  songs,
}: Readonly<FeaturedSongsClientProps>) {
  const deferredSongs = useDeferredValue(songs, []);
  const backgroundElements = useMemo(
    () => (
      <>
        <div
          className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-ado-key/20 blur-3xl filter sm:h-96 sm:w-96"
          style={{
            animation: "spin 40s linear infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute right-1/3 bottom-1/3 h-64 w-64 rounded-full bg-ado-red-600/20 blur-3xl filter sm:h-80 sm:w-80"
          style={{
            animation: "spin 35s linear reverse infinite",
            willChange: "transform",
          }}
        />
      </>
    ),
    [],
  );

  return (
    <section className="relative w-full overflow-x-hidden py-12 sm:py-16">
      {backgroundElements}

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 text-center sm:mb-12 md:mb-16">
            <div className="mb-3 sm:mb-4">
              <span className="text-2xl font-bold tracking-widest text-ado-key/80 uppercase sm:text-3xl">
                Handpicked Selection
              </span>
            </div>

            <h2 className="mb-4 text-center text-3xl font-black tracking-tighter text-foreground uppercase sm:mb-6 sm:text-4xl md:text-6xl">
              Featured Songs
            </h2>

            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              Interactive cards showcasing Ado's most iconic tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {deferredSongs.map((song) => (
              <FeaturedSongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
