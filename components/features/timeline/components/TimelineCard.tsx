"use client";

import { motion } from "framer-motion";

import React from "react";

import { NicoNicoPlayer, YouTubePlayer } from "@/components/VideoPlayer";
import { Song } from "@/types/Music";

interface SongCardProps {
  song: Song;
  animationDelay: number;
  themeColor: string;
  useHorizontalLayout?: boolean;
}

export const SongCard = React.memo(function SongCard({
  song,
  animationDelay,
  themeColor,
  useHorizontalLayout = false,
}: SongCardProps) {
  const cardThemeColor = song.themeColor ?? themeColor;
  const videoContainer = `mb-3 overflow-hidden rounded-lg ${
    useHorizontalLayout ? "md:w-80 lg:w-full" : ""
  }`;

  return (
    <motion.div
      className="w-full max-w-80 md:max-w-full"
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      }}
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
    </motion.div>
  );
});
