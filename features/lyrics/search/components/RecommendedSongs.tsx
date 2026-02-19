"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Music, TrendingUp } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";

import type { SongListItem } from "@/types/song";

interface RecommendedSongsProps {
  latest: SongListItem[];
  random: SongListItem[];
}

export function RecommendedSongs({ latest, random }: RecommendedSongsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const recommendedSongs = useMemo(() => {
    const latestSong = new Set(latest.map((s) => s.id));
    const songs = random?.filter((song) => !latestSong.has(song.id)) || [];

    return [...latest, ...songs];
  }, [latest, random]);

  useGSAP(
    () => {
      if (!containerRef.current || recommendedSongs.length === 0) return;

      const items = containerRef.current.querySelectorAll("[data-animate]");
      if (!items.length) return;

      gsap.fromTo(
        items,
        {
          opacity: 0,
          x: -20,
          scale: 0.96,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          stagger: {
            each: 0.06,
            from: "start",
          },
          ease: "expo.out",
          clearProps: "transform",
        },
      );
    },
    { scope: containerRef },
  );

  if (recommendedSongs.length === 0) return null;

  return (
    <div ref={containerRef} className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-foreground" />
        <h3 className="text-lg font-semibold text-foreground">
          You Might Like
        </h3>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {recommendedSongs.map((song) => (
          <Link
            key={song.id}
            href={`/lyrics/${song.id}`}
            data-animate
            className="group"
          >
            <div className="w-38 overflow-hidden rounded-md border border-foreground/10 transition-all duration-200 hover:border-foreground/20">
              <div className="relative aspect-square overflow-hidden">
                {song.coverArt ? (
                  <Image
                    src={song.coverArt}
                    alt={song.title.english}
                    fill
                    sizes="152px"
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted-foreground/10">
                    <Music className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <h4 className="line-clamp-1 text-sm font-medium text-foreground">
                  {song.title.english}
                </h4>
                <p
                  className="line-clamp-1 text-xs"
                  style={{ color: song.themeColor }}
                >
                  {song.title.japanese}
                </p>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {new Date(song.releaseDate).getFullYear()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
