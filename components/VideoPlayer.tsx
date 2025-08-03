"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import type { Song } from "@/types/Music";

interface VideoPlayerProps {
  src: string;
  title: string;
  allow?: string;
  isFullscreenBackground?: boolean;
}

const VideoPlayer = ({
  src,
  title,
  allow,
  isFullscreenBackground = false,
}: Readonly<VideoPlayerProps>) => {
  const [isVisible, setIsVisible] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(src);
            observer.disconnect();
          }
        },
        { rootMargin: "200px", threshold: 0.1 },
      );

      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [src]);

  const fullscreenClasses = isFullscreenBackground
    ? "absolute inset-0 w-full h-full object-cover"
    : "";

  const fullscreenBackground = useMemo<React.CSSProperties>(
    () =>
      isFullscreenBackground
        ? {
            minWidth: "100%",
            minHeight: "100%",
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(1.1)",
          }
        : {},
    [isFullscreenBackground],
  );

  if (!isVisible) return <div ref={containerRef} className="bg-inherit" />;

  return (
    <div ref={containerRef} className="h-full w-full">
      <iframe
        width="100%"
        height="100%"
        src={src}
        title={title}
        allow={allow}
        allowFullScreen
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        className={`border-0 ${fullscreenClasses}`}
        style={fullscreenBackground}
      />
    </div>
  );
};

interface YouTubePlayerProps {
  song?: Song;
  youtubeId?: string;
  title?: string;
  extraParams?: string;
  isFullscreenBackground?: boolean;
}

export function YouTubePlayer({
  song,
  youtubeId,
  title,
  extraParams,
  isFullscreenBackground = false,
}: Readonly<YouTubePlayerProps>) {
  const id = song?.youtubeId ?? youtubeId;
  const videoTitle = song
    ? `${song.title.english} by Ado`
    : (title ?? "YouTube Video");

  if (!id) {
    return null;
  }

  return (
    <VideoPlayer
      src={`https://www.youtube-nocookie.com/embed/${id}?${extraParams}`}
      title={videoTitle}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      isFullscreenBackground={isFullscreenBackground}
    />
  );
}

interface NicoNicoPlayerProps {
  song?: Song;
  nicoId?: string;
  title?: string;
}

export function NicoNicoPlayer({
  song,
  nicoId,
  title,
}: Readonly<NicoNicoPlayerProps>) {
  const id = song?.nicoId ?? nicoId;
  const videoTitle = song
    ? `${song.title.english} by Ado`
    : (title ?? "NicoNico Video");

  if (!id) {
    return null;
  }

  return (
    <VideoPlayer
      src={`https://embed.nicovideo.jp/watch/${id}?autoplay=0`}
      title={videoTitle}
      allow="encrypted-media"
    />
  );
}
