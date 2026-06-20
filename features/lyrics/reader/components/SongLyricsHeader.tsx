import { ArrowLeft, Calendar, Clock, Mic, Music } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { SongHeaderActions } from "@/features/lyrics/reader/components/SongHeaderActions";

import type { Album } from "@/types/album";
import type { Song } from "@/types/song";

const releaseDateFormat = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function getCreditNames(credits: Song["credits"], roles: string[]) {
  if (!credits?.credits.length) return null;

  const normalizedRoles = roles.map((r) => r.toLowerCase());
  const names = credits.credits.flatMap((credit) =>
    normalizedRoles.some((role) => credit.role.toLowerCase().includes(role))
      ? credit.entities.map((e) => e.romanizedName ?? e.name)
      : [],
  );
  return names.length ? [...new Set(names)].join(", ") : null;
}

export function SongLyricsHeader({ song, albums }: { song: Song; albums: Album[] }) {
  const mainAlbum = albums[0];
  const trackNumber = mainAlbum?.tracks.find(
    (t) => t.song.id === song.id,
  )?.trackNumber;

  const featuredNames = getCreditNames(song.credits, ["feat", "featuring"]);
  const releaseLabel = releaseDateFormat.format(new Date(song.releaseDate));

  return (
    <div className="relative overflow-hidden bg-(--theme-surface)">
      <div className="relative container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          href="/lyrics"
          className="mb-6 inline-flex items-center gap-2 text-(--theme-contrast)/75 transition-colors hover:text-(--theme-contrast)"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Lyrics</span>
        </Link>

        <div className="flex flex-col gap-6 md:flex-row md:gap-8 lg:gap-12">
          {song.coverArt ? (
            <div className="relative h-48 w-48 max-w-full shrink-0 overflow-hidden rounded-lg md:h-56 md:w-56 lg:h-64 lg:w-64">
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
            <h1 className="mb-2 font-serif text-3xl leading-tight font-black xs:text-4xl md:text-5xl lg:text-6xl">
              {song.title.english}
            </h1>
            {song.title.japanese && (
              <h2 className="mb-4 font-jp-sans text-xl font-semibold text-(--theme-contrast)/85 md:text-2xl">
                {song.title.japanese}
              </h2>
            )}

            {mainAlbum && (
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-(--theme-contrast)/85">
                <Music className="h-4 w-4 shrink-0" />
                <span className="text-(--theme-contrast)/75">
                  {trackNumber ? `Track ${trackNumber} on ` : "Featured on "}
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  {albums.map((album, index) => (
                    <span key={album.id} className="flex items-center gap-1">
                      <Link
                        href={`/album/${album.id}`}
                        className="underline decoration-(--theme-contrast)/55 underline-offset-2 transition-colors hover:text-(--theme-contrast) hover:decoration-(--theme-contrast)"
                        title={`${album.title.english} (${album.title.japanese})`}
                      >
                        {album.title.english}
                      </Link>
                      {index < albums.length - 1 && (
                        <span className="text-(--theme-contrast)/60 select-none">
                          •
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <dl className="mb-4 flex flex-col gap-2 text-sm font-medium sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Mic className="h-4 w-4 shrink-0" />
                <dt className="text-(--theme-contrast)/70">Vocals</dt>
                <dd className="text-(--theme-contrast)">Ado</dd>
                {featuredNames && (
                  <>
                    <span className="text-(--theme-contrast)/70">feat.</span>
                    <span className="text-(--theme-contrast)">{featuredNames}</span>
                  </>
                )}
              </div>
              <span
                aria-hidden="true"
                className="hidden text-(--theme-contrast)/60 select-none sm:inline"
              >
                •
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <dt className="text-(--theme-contrast)/70">Released</dt>
                <dd className="text-(--theme-contrast)">{releaseLabel}</dd>
              </div>
              <span
                aria-hidden="true"
                className="hidden text-(--theme-contrast)/60 select-none sm:inline"
              >
                •
              </span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <dt className="text-(--theme-contrast)/70">Runtime</dt>
                <dd className="text-(--theme-contrast)">{song.length}</dd>
              </div>
            </dl>

            <SongHeaderActions
              songId={song.id}
              songTitle={song.title}
              description={song.description}
              youtubeId={song.youtubeId}
              nicoId={song.nicoId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
