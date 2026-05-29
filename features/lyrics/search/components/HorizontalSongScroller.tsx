"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Music } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import type { SongListItem } from "@/types/song";

interface HorizontalSongScrollerProps {
  title: string;
  songs: SongListItem[];
}

export function HorizontalSongScroller({
  title,
  songs,
}: HorizontalSongScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || songs.length === 0) return;
      const items = containerRef.current.querySelectorAll("[data-animate]");
      if (!items.length) return;
      gsap.fromTo(
        items,
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: { each: 0.05, from: "start" },
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    },
    { scope: containerRef },
  );

  if (songs.length === 0) return null;

  return (
    <div ref={containerRef} className="mb-8">
      <div className="mb-3">
        <h3 className="text-sm font-semibold tracking-widest text-ado-primary uppercase">
          {title}
        </h3>
      </div>

      <div className="relative">
        <div className="flex scrollbar-none gap-4 overflow-x-auto pb-1">
          {songs.map((song) => (
            <Link
              key={song.id}
              href={`/lyrics/${song.id}`}
              data-animate
              className="group flex w-32 shrink-0 flex-col gap-2"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted-foreground/5">
                {song.coverArt ? (
                  <Image
                    src={song.coverArt}
                    alt={song.title.english}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Music className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-0.5 px-0.5">
                <p className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-ado-primary">
                  {song.title.english}
                </p>
                {song.title.japanese && (
                  <p className="line-clamp-1 font-jp-sans text-xs text-muted-foreground">
                    {song.title.japanese}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background to-transparent" />
      </div>
    </div>
  );
}
