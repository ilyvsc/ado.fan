import { SiNiconico, SiYoutube } from "@icons-pack/react-simple-icons";
import { ArrowLeft, Calendar, Clock, Mic, Music } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import type { Album } from "@/types/album";
import type { Song } from "@/types/song";

function getCreditsForRoles(credits: Song["credits"], roles: string[]) {
  if (!credits?.credits.length) return [];
  return credits.credits.filter((c) =>
    roles.some((r) => c.role.toLowerCase().includes(r)),
  );
}

export function SongLyricsHeader({
  song,
  albums,
}: {
  song: Song;
  albums: Album[];
}) {
  const mainAlbum = albums[0];
  const trackNumber = mainAlbum?.tracks.find(
    (t) => t.song.id === song.id,
  )?.trackNumber;

  const featured = getCreditsForRoles(song.credits, ["feat", "featuring"]);
  const featuredNames = featured
    .flatMap((c) => c.entities)
    .map((e) => e.romanizedName ?? e.name)
    .join(", ");

  return (
    <div className="relative overflow-hidden bg-(--theme-color)">
      <div className="relative container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/lyrics"
          className="mb-6 inline-flex items-center gap-2 text-(--theme-contrast)/60 transition-colors hover:text-(--theme-contrast)/90"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Lyrics</span>
        </Link>

        <div className="flex flex-col gap-6 md:flex-row md:gap-8 lg:gap-12">
          {song.coverArt ? (
            <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-lg md:h-56 md:w-56 lg:h-64 lg:w-64">
              <Image
                src={song.coverArt}
                alt={
                  song.title.japanese
                    ? `${song.title.english} (${song.title.japanese})`
                    : song.title.english
                }
                fill
                sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                className="object-cover"
                priority
              />
            </div>
          ) : null}

          <div className="flex flex-col justify-end pb-2 text-(--theme-contrast)">
            <h1 className="mb-2 font-gambarino text-4xl leading-tight font-black md:text-5xl lg:text-6xl">
              {song.title.english}
            </h1>
            {song.title.japanese && (
              <h2 className="mb-4 text-xl font-medium opacity-75 md:text-2xl">
                {song.title.japanese}
              </h2>
            )}

            {mainAlbum && (
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-(--theme-contrast)/80">
                <Music className="h-4 w-4 shrink-0" />
                <span className="text-(--theme-contrast)/60">
                  {trackNumber ? `Track ${trackNumber} on ` : "Featured on "}
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  {albums.map((album, index) => (
                    <span key={album.id} className="flex items-center gap-1">
                      <Link
                        href={`/album/${album.id}`}
                        className="underline decoration-(--theme-contrast)/30 underline-offset-2 transition-colors hover:text-(--theme-contrast) hover:decoration-(--theme-contrast)/60"
                        title={`${album.title.english} (${album.title.japanese})`}
                      >
                        {album.title.english}
                      </Link>
                      {index < albums.length - 1 && (
                        <span className="text-(--theme-contrast)/40 select-none">
                          •
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 shrink-0" />
                <span className="text-(--theme-contrast)/50">Vocals</span>
                <span className="text-(--theme-contrast)">Ado</span>
                {featuredNames && (
                  <>
                    <span className="text-(--theme-contrast)/50">feat.</span>
                    <span>{featuredNames}</span>
                  </>
                )}
              </div>
              <span className="select-nowne opacity-40">•</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="text-(--theme-contrast)/50">Released</span>
                <span>
                  {new Intl.DateTimeFormat("en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(song.releaseDate))}
                </span>
              </div>
              <span className="opacity-40 select-none">•</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="text-(--theme-contrast)/50">Runtime</span>
                <span>{song.length}</span>
              </div>
            </div>

            {(song.youtubeId ?? song.nicoId) && (
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {song.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                    target="_blank"
                    aria-label="Open on YouTube"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-white transition-colors hover:bg-red-700"
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
                    className="inline-flex items-center gap-2 rounded-md border border-(--theme-contrast)/20 bg-(--theme-contrast)/10 px-3 py-1.5 text-(--theme-contrast) transition-colors hover:bg-(--theme-contrast)/20"
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
