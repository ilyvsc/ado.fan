"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Music, Play, X } from "lucide-react";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

import { NicoNicoPlayer, YouTubePlayer } from "@/components/VideoPlayer";
import { cn } from "@/lib/utils";

import type { Song } from "@/types/song";

export function SongCard({
  song,
  isPastMiddle = false,
}: {
  song: Song;
  isPastMiddle?: boolean;
}) {
  const [isExpanded, setExpandedState] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  useGSAP(
    () => {
      if (!imageRef.current) return;
      gsap.to(imageRef.current, {
        scale: isExpanded ? 0.95 : 1,
        opacity: isExpanded ? 0.8 : 1,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    { scope: containerRef, dependencies: [isExpanded] },
  );

  const toggleOpen = () => {
    if (!isExpanded) {
      window.dispatchEvent(new CustomEvent("timeline-play", { detail: song.id }));
      setShowControls(true);
    }
    setExpandedState((prev) => !prev);
  };

  useEffect(() => {
    if (!isExpanded || !showControls) return;

    const timeoutId = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isExpanded, showControls]);

  useLayoutEffect(() => {
    if (!isExpanded) return;
    dialogRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isExpanded]);

  useEffect(() => {
    const handlePlay = (e: Event) => {
      if ((e as CustomEvent).detail !== song.id) setExpandedState(false);
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
        data-song-card
        className="group relative isolate flex w-full flex-col items-start md:w-2xl"
        style={{ "--theme-color": song.themeColor } as CSSProperties}
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
                  sizes="96px"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted-foreground/10">
                  <Music className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  isPastMiddle ? "bg-foreground/40" : "bg-background/40",
                )}
              >
                <Play
                  className={cn(
                    "h-8 w-8 fill-current transition-colors duration-700",
                    isPastMiddle ? "text-background" : "text-foreground",
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <h3
              className={cn(
                "font-serif text-3xl leading-none font-bold tracking-tight transition-colors duration-700 md:text-4xl",
                isPastMiddle ? "text-background" : "text-foreground",
              )}
            >
              {song.title.english}
            </h3>

            {song.title.japanese && (
              <span className="mt-1 truncate font-jp-serif text-lg font-medium tracking-wide text-(--theme-color) md:text-xl">
                {song.title.japanese}
              </span>
            )}
          </div>
        </button>
      </div>

      {isExpanded &&
        createPortal(
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`${song.title.english} video player`}
            onClick={() => {
              setExpandedState(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setExpandedState(false);
            }}
            onMouseMove={handleMouseMove}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/60 p-4 backdrop-blur-sm outline-none md:p-12"
          >
            <div
              role="presentation"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-lg bg-background/40"
            >
              <button
                onClick={() => {
                  setExpandedState(false);
                }}
                className={cn(
                  "absolute top-4 right-4 z-10 rounded-full p-2 text-white/70 backdrop-blur-sm transition-opacity duration-300 hover:text-white",
                  showControls ? "opacity-100" : "opacity-0",
                )}
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
}
