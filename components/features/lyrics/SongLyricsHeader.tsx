import { SiNiconico, SiYoutube } from "@icons-pack/react-simple-icons";
import { ArrowLeft, Calendar, Clock, Mic, Music } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { Album, Song } from "@/types/Music";

export function SongLyricsHeader({
  song,
  albums,
}: {
  song: Song;
  albums: Album[];
}) {
  const themeColor = song.themeColor;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${themeColor} 0%)`,
      }}
    >
      <div className="relative container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/lyrics"
          className="mb-6 inline-flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Lyrics</span>
        </Link>

        <div className="flex flex-col gap-6 md:flex-row md:gap-8 lg:gap-12">
          {song.coverArt ? (
            <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-lg shadow-2xl md:h-56 md:w-56 lg:h-64 lg:w-64">
              <Image
                src={song.coverArt}
                alt={
                  song.title.japanese
                    ? `${song.title.english} (${song.title.japanese})`
                    : song.title.english
                }
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : null}

          <div className="flex flex-col justify-end pb-2 text-white">
            <h1 className="mb-2 font-gambarino text-4xl leading-tight font-black md:text-5xl lg:text-6xl">
              {song.title.english}
            </h1>
            {song.title.japanese && (
              <h2 className="mb-4 text-xl font-medium opacity-90 md:text-2xl">
                {song.title.japanese}
              </h2>
            )}

            {albums.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-medium text-white/90">
                <Music className="h-4 w-4" />
                <span className="text-white/70">
                  {albums.length === 1
                    ? `Track ${song.albumTrack?.trackNumber} on `
                    : "Featured on "}
                </span>

                <div className="flex flex-wrap items-center">
                  {albums.map((album, index) => (
                    <span key={album.id} className="max-w-[200px] truncate">
                      <Link
                        href={`/album/${album.id}`}
                        className="truncate underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60"
                        title={`${album.title.english} (${album.title.japanese})`}
                      >
                        {album.title.english} ({album.title.japanese})
                      </Link>

                      {index < albums.length - 1 && (
                        <span className="text-white/40 select-none">
                          &nbsp;•&nbsp;
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-medium opacity-90">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Ado</span>
              </div>

              <span className="opacity-60 select-none">•</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Intl.DateTimeFormat("en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(song.releaseDate))}
                </span>
              </div>

              <span className="opacity-60 select-none">•</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{song.length}</span>
              </div>
            </div>

            {(song.youtubeId || song.nicoId) && (
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {song.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                    target="_blank"
                    aria-label="Open on YouTube"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-white transition-all hover:bg-red-700"
                  >
                    <SiYoutube className="h-4 w-4" />
                    <span>YouTube</span>
                  </a>
                )}
                {song.nicoId && (
                  <a
                    href={`https://www.nicovideo.jp/watch/${song.nicoId}`}
                    target="_blank"
                    aria-label="Open on NicoNico"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-black transition-all hover:bg-gray-300"
                  >
                    <SiNiconico className="h-4 w-4" />
                    <span>NicoNico</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
