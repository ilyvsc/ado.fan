"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import React from "react";

import { NicoNicoPlayer, YouTubePlayer } from "@/components/VideoPlayer";
import { Song } from "@/types/Music";

gsap.registerPlugin(ScrollTrigger);

interface SongCardProps {
  song: Song;
  useHorizontalLayout?: boolean;
}

export const SongCard = React.memo(function SongCard({
  song,
  useHorizontalLayout = false,
}: SongCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  const themeColor = song.themeColor;

  useGSAP(
    () => {
      if (!cardRef.current) return;
      const tl = gsap.timeline({ paused: true });

      tl.fromTo(
        cardRef.current,
        { autoAlpha: 0, y: 16, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
      );

      if (mediaRef.current) {
        tl.fromTo(
          mediaRef.current,
          { autoAlpha: 0, yPercent: 4, scale: 0.99 },
          {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.3",
        );
      }

      if (textRef.current) {
        tl.fromTo(
          textRef.current,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
          "-=0.25",
        );
      }
      setInView(true);
      tl.play();
    },
    { scope: cardRef, dependencies: [useHorizontalLayout] },
  );

  return (
    <div ref={cardRef} className="w-full max-w-80 md:max-w-full">
      <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-lg hover:border-white/30 hover:shadow-xl">
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${themeColor}, transparent)`,
          }}
        />

        <div
          className={`relative p-4 ${useHorizontalLayout ? "md:flex md:gap-4 lg:block" : ""}`}
        >
          {(song.youtubeId || song.nicoId) && (
            <div
              ref={mediaRef}
              className={`mb-3 overflow-hidden rounded-lg ${useHorizontalLayout ? "md:w-80 lg:w-full" : ""}`}
            >
              <div className="relative aspect-video">
                {inView && song.youtubeId && <YouTubePlayer song={song} />}
                {inView && !song.youtubeId && song.nicoId && (
                  <NicoNicoPlayer song={song} />
                )}
              </div>
            </div>
          )}

          <div ref={textRef} className={useHorizontalLayout ? "md:flex-1" : ""}>
            <h5 className="mb-2 text-sm font-bold text-foreground">
              {song.title.english}
              {song.title.japanese && (
                <span
                  className="mt-1 block text-xs"
                  style={{ color: themeColor }}
                >
                  {song.title.japanese}
                </span>
              )}
            </h5>

            <p className="mb-3 text-xs text-muted-foreground">
              {song.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
