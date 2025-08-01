"use client";

import { useEffect } from "react";

import { YouTubePlayer } from "@/utils/VideoEmbed";

export function HeroSection() {
  const videoId = "A7FRtZXoXlQ";
  const backgroundParams =
    "autoplay=1&controls=0&mute=1&loop=1&playlist=" + videoId;

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const overlay = document.getElementById("hero-overlay");

      if (overlay) {
        const opacity = Math.min(scrolled / 800, 1);
        overlay.style.opacity = opacity.toString();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="fullscreen-video-container pointer-events-none absolute inset-0 h-full w-full overflow-hidden select-none">
        <YouTubePlayer
          youtubeId={videoId}
          title="Hero Background Video"
          extraParams={backgroundParams}
          isFullscreenBackground={true}
        />
      </div>

      <div
        id="hero-overlay"
        className="pointer-events-none absolute inset-0 h-full w-full bg-black"
        style={{ opacity: 0 }}
      />
    </section>
  );
}
