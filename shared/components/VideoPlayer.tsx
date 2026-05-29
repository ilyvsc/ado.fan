"use client";

import { forwardRef, useEffect, useRef } from "react";

import type { Song } from "@/types/song";

interface VideoPlayerProps {
  src: string;
  title: string;
  allow?: string;
  className?: string;
}

const VideoPlayer = forwardRef<HTMLIFrameElement, VideoPlayerProps>(
  ({ src, title, allow, className }, ref) => {
    return (
      <div className="h-full w-full">
        <iframe
          ref={ref}
          src={src}
          title={title}
          allow={allow}
          allowFullScreen
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
          className={className ?? "h-full w-full border-0"}
        />
      </div>
    );
  },
);

interface YouTubePlayerProps {
  song?: Song;
  youtubeId?: string;
  title?: string;
  extraParams?: string;
  isFullscreenBackground?: boolean;
  isPaused?: boolean;
  loop?: { start: number; end: number };
}

function postCommand(
  iframe: HTMLIFrameElement | null,
  func: string,
  args: unknown[] = [],
) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args }),
    "*",
  );
}

export function YouTubePlayer({
  song,
  youtubeId = "",
  title,
  extraParams = "",
  isFullscreenBackground = false,
  isPaused = false,
  loop,
}: Readonly<YouTubePlayerProps>) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    postCommand(ref.current, isPaused ? "pauseVideo" : "playVideo");
  }, [isPaused]);

  useEffect(() => {
    if (!loop || isPaused) return;
    if (loop.end <= loop.start) return;

    const duration = (loop.end - loop.start) * 1000;
    const interval = setInterval(() => {
      postCommand(ref.current, "seekTo", [loop.start, true]);
    }, duration);

    return () => {
      clearInterval(interval);
    };
  }, [loop, isPaused]);

  const id = song?.youtubeId ?? youtubeId;
  if (!id) return null;

  const videoTitle = song
    ? `${song.title.english} by Ado`
    : (title ?? "YouTube Video");

  const params = new URLSearchParams(extraParams);
  params.set("enablejsapi", "1");
  params.set("rel", "0");
  params.set("playlist", id);
  if (loop) params.set("start", String(loop.start));

  return (
    <VideoPlayer
      ref={ref}
      src={`https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`}
      title={videoTitle}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      className={
        isFullscreenBackground
          ? "absolute top-1/2 left-1/2 aspect-video min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
          : "h-full w-full border-0"
      }
    />
  );
}

export function NicoNicoPlayer({
  song,
  nicoId,
  title,
}: Readonly<{
  song?: Song;
  nicoId?: string;
  title?: string;
}>) {
  const id = song?.nicoId ?? nicoId;
  if (!id) return null;

  const videoTitle = song
    ? `${song.title.english} by Ado`
    : (title ?? "NicoNico Video");

  return (
    <VideoPlayer
      src={`https://embed.nicovideo.jp/watch/${id}?autoplay=0`}
      title={videoTitle}
      allow="encrypted-media"
    />
  );
}
