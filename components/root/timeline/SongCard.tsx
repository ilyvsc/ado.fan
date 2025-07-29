"use client";

import { motion } from "framer-motion";

import React from "react";

import { Song } from "@/types/Music";
import { NicoNicoPlayer, YouTubePlayer } from "@/utils/VideoEmbed";

interface SongCardProps {
  song: Song;
  position: { left: string; top: string };
  animationDelay: number;
  themeColor: string;
}

export const SongCard = React.memo(function SongCard({
  song,
  position,
  animationDelay,
  themeColor,
}: SongCardProps) {
  const cardThemeColor = song.themeColor ?? themeColor;

  return (
    <motion.div
      className="absolute"
      style={{
        left: position.left,
        top: position.top,
        width: "320px",
        maxWidth: "85vw",
      }}
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
      <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-white/30">
        <div
          className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/song:opacity-20`}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${cardThemeColor}, transparent)`,
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-10"
          style={{
            background: `linear-gradient(45deg, ${cardThemeColor}, transparent)`,
          }}
        />

        <div className="relative p-4">
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

          {song.youtubeId && (
            <div className="mb-3 overflow-hidden rounded-lg">
              <div className="relative aspect-video">
                <YouTubePlayer song={song} />
              </div>
            </div>
          )}

          {!song.youtubeId && song.nicoId && (
            <div className="mb-3 overflow-hidden rounded-lg">
              <div className="relative aspect-video">
                <NicoNicoPlayer song={song} />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
