import React from "react";

import { Song } from "@/types/Music";

export function YouTubePlayer({ song }: Readonly<{ song: Song }>) {
  if (!song.youtubeId) return null;

  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${song.youtubeId}`}
      title={`${song.title.english} by Ado`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="border-0"
    />
  );
}

export function NicoNicoPlayer({ song }: Readonly<{ song: Song }>) {
  if (!song.nicoId) return null;

  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://embed.nicovideo.jp/watch/${song.nicoId}?autoplay=0`}
      title={`${song.title.english} by Ado`}
      allow="encrypted-media;"
      className="border-0"
      allowFullScreen
    />
  );
}
