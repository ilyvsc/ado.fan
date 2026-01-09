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
  return (
    <div className="h-full w-full">
      <iframe
        src={src}
        title={title}
        allow={allow}
        allowFullScreen
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        className={
          isFullscreenBackground
            ? `absolute top-1/2 left-1/2 aspect-video min-h-full min-w-full -translate-1/2`
            : "h-full w-full border-0"
        }
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
      src={`https://www.youtube-nocookie.com/embed/${id}?playlist=${id}&rel=0&loop=1&${extraParams}`}
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
