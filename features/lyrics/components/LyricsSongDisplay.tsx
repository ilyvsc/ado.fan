"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Music } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { SearchResult, SongListItem } from "@/types/Music";

type ViewMode = "grid" | "list";

export function LyricsSongDisplay({
  songs,
  viewMode,
}: {
  songs: (SongListItem | SearchResult)[];
  viewMode?: ViewMode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedIds = useRef<Set<string>>(new Set());

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      requestAnimationFrame(() => {
        const allItems =
          container.querySelectorAll<HTMLElement>("[data-song-id]");

        if (!allItems.length) return;

        const newItems: HTMLElement[] = [];

        allItems.forEach((item) => {
          const id = item.dataset.songId;
          if (!id) return;

          if (!animatedIds.current.has(id)) {
            animatedIds.current.add(id);
            newItems.push(item);
          }
        });

        if (!newItems.length) return;

        gsap.fromTo(
          newItems,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.04,
            ease: "power3.out",
            clearProps: "all",
          },
        );
      });
    },
    {
      scope: containerRef,
      dependencies: [songs.length],
    },
  );

  if (songs.length === 0) return null;

  if (viewMode === "list") {
    return (
      <div ref={containerRef} className="flex flex-col">
        <div className="mb-3 flex items-center gap-2">
          <Music className="h-5 w-5 text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">All Songs</h3>
        </div>

        {songs.map((song) => (
          <Link
            key={song.id}
            href={`/lyrics/${song.id}`}
            data-song-id={song.id}
            className="group"
          >
            <div className="flex items-center gap-4 rounded-md p-2 transition-all duration-200 hover:bg-foreground/5">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden">
                {song.coverArt ? (
                  <Image
                    src={song.coverArt}
                    alt={song.title.english}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted-foreground/10">
                    <Music className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 text-sm font-medium text-foreground">
                  {song.title.english}
                </h3>
                <p
                  className="line-clamp-1 text-xs"
                  style={{ color: song.themeColor }}
                >
                  {song.title.japanese}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground/60">
                {new Date(song.releaseDate).getFullYear()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Music className="h-5 w-5 text-foreground" />
        <h3 className="text-lg font-semibold text-foreground">All Songs</h3>
      </div>
      <div
        ref={containerRef}
        className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {songs.map((song) => (
          <Link
            key={song.id}
            href={`/lyrics/${song.id}`}
            data-song-id={song.id}
            className="group"
          >
            <div className="overflow-hidden rounded-md border border-foreground/10 transition-all duration-200 hover:scale-105 hover:border-foreground/20">
              <div className="relative aspect-square overflow-hidden">
                {song.coverArt ? (
                  <Image
                    src={song.coverArt}
                    alt={song.title.english}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted-foreground/10">
                    <Music className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="line-clamp-1 text-sm font-medium text-foreground">
                  {song.title.english}
                </h3>
                <span
                  className="line-clamp-1 text-xs"
                  style={{ color: song.themeColor }}
                >
                  {song.title.japanese}
                </span>
                <div className="mt-1">
                  <span className="text-xs text-muted-foreground/60">
                    {new Date(song.releaseDate).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
