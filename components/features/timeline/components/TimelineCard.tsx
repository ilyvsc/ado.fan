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
  themeColor: string;
  useHorizontalLayout?: boolean;
}

export const SongCard = React.memo(function SongCard({
  song,
  themeColor,
  useHorizontalLayout = false,
}: SongCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const cardThemeColor = song.themeColor ?? themeColor;

  useGSAP(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      {
        autoAlpha: 0,
        y: 30,
        scale: 0.95,
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
          invalidateOnRefresh: true,
        },
      },
    );
  }, []);

  const videoContainer = `mb-3 overflow-hidden rounded-lg ${
    useHorizontalLayout ? "md:w-80 lg:w-full" : ""
  }`;

  return (
    <div
      ref={cardRef}
      className="w-full max-w-80 transform transition duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] md:max-w-full"
    >
      <div
        className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:shadow-xl"
        style={
          {
            "--theme-color": cardThemeColor,
          } as React.CSSProperties
        }
      >
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${cardThemeColor}, transparent)`,
          }}
        />

        <div
          className={`relative p-4 ${
            useHorizontalLayout ? "md:flex md:gap-4 lg:block" : ""
          }`}
        >
          {song.youtubeId && (
            <div className={videoContainer}>
              <div className="relative aspect-video">
                <YouTubePlayer song={song} />
              </div>
            </div>
          )}

          {!song.youtubeId && song.nicoId && (
            <div className={videoContainer}>
              <div className="relative aspect-video">
                <NicoNicoPlayer song={song} />
              </div>
            </div>
          )}

          <div className={useHorizontalLayout ? "md:flex-1" : ""}>
            <h5 className="mb-2 text-sm font-bold text-white">
              {song.title.english}
              {song.title.japanese && (
                <span
                  className="mt-1 block text-xs"
                  style={{ color: cardThemeColor }}
                >
                  {song.title.japanese}
                </span>
              )}
            </h5>

            <p className="mb-3 text-xs text-white/80">{song.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
});
