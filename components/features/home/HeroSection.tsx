"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef } from "react";

import { YouTubePlayer } from "@/components/VideoPlayer";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const videoId = "GORsp0gc2Nc";
  const backgroundParams =
    "autoplay=1&controls=0&mute=1&loop=1&playlist=" + videoId;

  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !overlayRef.current) return;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=800",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div className="fullscreen-video-container pointer-events-none absolute inset-0 h-full w-full overflow-hidden select-none">
        <YouTubePlayer
          youtubeId={videoId}
          title="Hero Background Video"
          extraParams={backgroundParams}
          isFullscreenBackground={true}
        />
      </div>

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 h-full w-full bg-background"
      />
    </section>
  );
}
