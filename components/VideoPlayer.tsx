import React from "react";

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
  const baseClasses = "border-0";
  const fullscreenClasses = isFullscreenBackground
    ? "absolute inset-0 w-full h-full object-cover"
    : "";

  return (
    <iframe
      width="100%"
      height="100%"
      src={src}
      title={title}
      allow={allow}
      allowFullScreen
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-presentation"
      className={`${baseClasses} ${fullscreenClasses}`}
      style={
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
            transform: "translate(-50%, -50%) scale(1.1)", // scale to ensure no YT interface
          }
          : {}
      }
    />
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
