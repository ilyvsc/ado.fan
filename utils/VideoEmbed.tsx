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

interface YouTubePlayerProps {
  song?: Song;
  youtubeId?: string;
  title?: string;
}

export function YouTubePlayer({ song, youtubeId, title }: Readonly<YouTubePlayerProps>) {
  const id = song?.youtubeId ?? youtubeId;
  const videoTitle = song ? `${song.title.english} by Ado` : (title ?? "YouTube Video");

  if (!id) {
    return null;
  }

  return (
    <VideoPlayer
      src={`https://www.youtube.com/embed/${id}`}
      title={videoTitle}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    />
  );
}

interface NicoNicoPlayerProps {
  song?: Song;
  nicoId?: string;
  title?: string;
}

export function NicoNicoPlayer({ song, nicoId, title }: Readonly<NicoNicoPlayerProps>) {
  const id = song?.nicoId ?? nicoId;
  const videoTitle = song ? `${song.title.english} by Ado` : (title ?? "NicoNico Video");

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
