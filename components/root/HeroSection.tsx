"use client";

import { useEffect } from "react";
import { YouTubePlayer } from "@/utils/VideoEmbed";

export function HeroSection() {
  const videoId = "A7FRtZXoXlQ";
  const backgroundParams = "autoplay=1&controls=0&mute=1&loop=1&playlist=" + videoId;

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const overlay = document.getElementById('hero-overlay');

      if (overlay) {
        const opacity = Math.min(scrolled / 800, 1);
        overlay.style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden fullscreen-video-container pointer-events-none select-none">
        <YouTubePlayer
          youtubeId={videoId}
          title="Hero Background Video"
          extraParams={backgroundParams}
          isFullscreenBackground={true}
        />
      </div>

      <div
        id="hero-overlay"
        className="absolute inset-0 w-full h-full bg-black pointer-events-none"
        style={{ opacity: 0 }}
      />
    </section>
  );
}
