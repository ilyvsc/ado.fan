"use client";

import React, { lazy } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Song } from "@/types/Music";

const YouTubePlayer = lazy(() =>
  import("@/utils/VideoEmbed").then((module) => ({
    default: module.YouTubePlayer,
  })),
);
const NicoNicoPlayer = lazy(() =>
  import("@/utils/VideoEmbed").then((module) => ({
    default: module.NicoNicoPlayer,
  })),
);

interface FeaturedSongsClientProps {
  songs: Song[];
}

function FeaturedSongCard({
  song,
}: Readonly<{
  song: Song;
}>) {
  const themeColor = song.themeColor || "var(--ado-key)";

  return (
    <div className="group relative w-full">
      <Card className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-card/90 to-card/50 shadow-md hover:shadow-ado-key/40 backdrop-blur-xl transition-all duration-300 group-hover:shadow-2xl p-0 gap-0">
        <div className="relative overflow-hidden h-56 w-full">
          {song.youtubeId ? (
            <YouTubePlayer song={song} />
          ) : song.nicoId ? (
            <NicoNicoPlayer song={song} />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-muted-foreground">
              No preview available
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent pointer-events-none" />
        </div>

        <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-xl font-black tracking-tight text-white uppercase sm:text-2xl">
              {song.title.english}
            </h3>
            {song.title.japanese && (
              <h4
                className="line-clamp-1 text-lg font-bold tracking-wide sm:text-xl"
                style={{ color: themeColor }}
              >
                {song.title.japanese}
              </h4>
            )}
          </div>

          <p className="line-clamp-4 text-xs leading-relaxed text-gray-300 sm:text-sm">
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
}

export function FeaturedSongsClient({
  songs,
}: Readonly<FeaturedSongsClientProps>) {
  return (
    <section className="relative w-full overflow-x-hidden py-12 sm:py-16">
      <div className="absolute top-1/3 left-1/3 h-72 w-72 animate-[spin_40s_linear_infinite] rounded-full bg-ado-blue/20 blur-3xl filter sm:h-96 sm:w-96" />
      <div className="absolute right-1/3 bottom-1/3 h-64 w-64 animate-[spin_35s_reverse_linear_infinite] rounded-full bg-ado-red/20 blur-3xl filter sm:h-80 sm:w-80" />

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

            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-foreground/80 sm:text-2xl">
              Interactive cards showcasing Ado's most iconic tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {songs.map((song) => (
              <FeaturedSongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
