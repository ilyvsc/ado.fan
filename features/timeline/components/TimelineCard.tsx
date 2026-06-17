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

function ImmersivePlayer({
  song,
  showControls,
  onClose,
  onMouseMove,
  dialogRef,
}: {
  song: Song;
  showControls: boolean;
  onClose: () => void;
  onMouseMove: () => void;
  dialogRef: React.RefObject<HTMLDivElement | null>;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const backdrop = q(".player-backdrop")[0];
      const titleLines = q(".player-title-line");
      const panel = q(".player-panel")[0];

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      if (backdrop) {
        tl.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0);
      }

      if (panel) {
        tl.fromTo(
          panel,
          { clipPath: "inset(100% 0 0 0)", y: 60 },
          { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.9 },
          0.15,
        );
      }

      tl.fromTo(
        titleLines,
        { yPercent: 120 },
        { yPercent: 0, stagger: 0.1, duration: 0.8 },
        0.25,
      );
    },
    { scope: scopeRef },
  );

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${song.title.english} video player`}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      onMouseMove={onMouseMove}
      className="fixed inset-0 z-50 overflow-hidden outline-none"
      style={{ "--theme-color": song.themeColor } as CSSProperties}
    >
      <div
        ref={scopeRef}
        className="relative flex h-full w-full items-center justify-center p-4 md:p-10"
      >
        <div className="player-backdrop absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <div
          role="presentation"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="relative z-10 w-full max-w-4xl space-y-5"
        >
          <div className="flex items-end justify-between gap-6">
            <div className="space-y-1">
              <span className="block overflow-hidden">
                <span className="player-title-line block font-serif text-3xl leading-none font-bold text-white md:text-5xl">
                  {song.title.english}
                </span>
              </span>
              {song.title.japanese && (
                <span className="block overflow-hidden">
                  <span className="player-title-line block font-jp-serif text-lg font-medium text-(--theme-color) md:text-xl">
                    {song.title.japanese}
                  </span>
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close player"
              className={cn(
                "rounded-full border border-white/20 p-3 text-white/70 transition-all duration-300 hover:border-white/50 hover:text-white",
                showControls ? "opacity-100" : "opacity-0",
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="player-panel relative aspect-video w-full overflow-hidden bg-black">
            {song.youtubeId ? (
              <YouTubePlayer song={song} />
            ) : song.nicoId ? (
              <NicoNicoPlayer song={song} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-white/40">
                <Music className="h-12 w-12" />
                <span className="text-lg uppercase">Song Unavailable</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
          className="relative flex w-full items-center gap-6 rounded-lg p-2 text-left transition-colors duration-300 hover:bg-(--theme-color)/10"
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
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
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
              <span className="mt-1 truncate font-jp-serif text-lg font-medium text-(--theme-color) md:text-xl">
                {song.title.japanese}
              </span>
            )}
          </div>
        </button>
      </div>

      {isExpanded &&
        createPortal(
          <ImmersivePlayer
            song={song}
            showControls={showControls}
            onClose={() => {
              setExpandedState(false);
            }}
            onMouseMove={handleMouseMove}
            dialogRef={dialogRef}
          />,
          document.body,
        )}
    </>
  );
}
