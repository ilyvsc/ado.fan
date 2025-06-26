import React from "react";

import type { Song } from "@/types/Music";

interface VideoPlayerProps {
  src: string;
  title: string;
  allow?: string;
}

const VideoPlayer = ({ src, title, allow }: Readonly<VideoPlayerProps>) => {
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
      className="border-0"
    />
  );
};

export function YouTubePlayer({ song }: Readonly<{ song: Song }>) {
  if (!song.youtubeId) {
    return null;
  }

  return (
    <VideoPlayer
      src={`https://www.youtube.com/embed/${song.youtubeId}`}
      title={`${song.title.english} by Ado`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    />
  );
}

export function NicoNicoPlayer({ song }: Readonly<{ song: Song }>) {
  if (!song.nicoId) {
    return null;
  }

  return (
    <VideoPlayer
      src={`https://embed.nicovideo.jp/watch/${song.nicoId}?autoplay=0`}
      title={`${song.title.english} by Ado`}
      allow="encrypted-media"
    />
  );
}
