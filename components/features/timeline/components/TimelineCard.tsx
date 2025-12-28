"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Music, Play, X } from "lucide-react";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { NicoNicoPlayer, YouTubePlayer } from "@/components/VideoPlayer";
import { Song } from "@/types/Music";

gsap.registerPlugin(ScrollTrigger);

export const SongCard = React.memo(function SongCard({ song }: { song: Song }) {
  const [isExpanded, setExpandedState] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const japaneseRef = useRef<HTMLSpanElement>(null);

  const themeColor = song.themeColor;

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      gsap.to(imageRef.current, {
        scale: isExpanded ? 0.95 : 1,
        opacity: isExpanded ? 0.8 : 1,
        duration: 0.4,
      });
    },
    { scope: containerRef, dependencies: [isExpanded] },
  );

  const toggleOpen = () => {
    if (!isExpanded) {
      window.dispatchEvent(
        new CustomEvent("timeline-play", { detail: song.id }),
      );
    }
    setExpandedState(!isExpanded);
  };

  useEffect(() => {
    const handlePlay = (e: Event) => {
      if ((e as CustomEvent).detail !== song.id) {
        setExpandedState(false);
      }
    };
    window.addEventListener("timeline-play", handlePlay);
    return () => {
      window.removeEventListener("timeline-play", handlePlay);
    };
  }, [song.id]);

  return (
    <>
      <div
        ref={containerRef}
        className="group relative isolate flex w-full flex-col items-start md:w-2xl"
      >
        <button
          onClick={toggleOpen}
          className="relative flex w-full items-center gap-6 p-2 text-left transition-colors"
        >
          <div className="relative shrink-0">
            <div
              ref={imageRef}
              className="relative h-20 w-20 overflow-hidden md:h-24 md:w-24"
            >
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
                  <Music className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Play className="h-8 w-8 fill-current text-foreground drop-shadow-md" />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <h3
              ref={titleRef}
              className="font-gambarino text-3xl leading-none font-bold tracking-tight text-foreground md:text-4xl"
            >
              {song.title.english}
            </h3>

            {song.title.japanese && (
              <span
                ref={japaneseRef}
                className="mt-1 truncate font-sans text-lg font-medium tracking-wide"
                style={{ color: themeColor }}
              >
                {song.title.japanese}
              </span>
            )}
          </div>
        </button>
      </div>

      {mounted &&
        isExpanded &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center p-4 md:p-12">
            <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-lg bg-background/40">
              <button
                onClick={() => setExpandedState(false)}
                className="absolute top-4 right-4 rounded-full p-2 text-white/70 backdrop-blur-md"
              >
                <X className="h-5 w-5" />
              </button>

              {song.youtubeId ? (
                <YouTubePlayer song={song} />
              ) : song.nicoId ? (
                <NicoNicoPlayer song={song} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-foreground/20 bg-background text-foreground/40">
                  <Music className="h-12 w-12" />
                  <span className="text-lg tracking-widest uppercase">
                    Song Unavailable
                  </span>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
});
