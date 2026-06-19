"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";

import type { Album } from "@/types/album";

export function RelatedAlbumSongs({
  albums,
  currentSongId,
}: {
  albums: Album[];
  currentSongId: string;
}) {
  const mainAlbum = albums[0];

  if (!mainAlbum) return null;

  const referenceAlbums = albums.filter((a) => a.id !== mainAlbum.id);
  const songs = mainAlbum.tracks.map((t) => ({
    song: t.song,
    trackNumber: t.trackNumber,
  }));

  return (
    <section aria-labelledby="related-album-heading" className="space-y-4 pt-4 pb-8">
      <div className="flex items-start gap-4">
        <div className="relative h-32 w-32 overflow-hidden sm:h-40 sm:w-40">
          <Image
            src={mainAlbum.coverArt}
            alt={`${mainAlbum.title.english} (${mainAlbum.title.japanese})`}
            fill
            sizes="(max-width: 640px) 128px, 160px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2
            id="related-album-heading"
            className="text-xl font-bold text-(--theme-contrast) sm:text-2xl"
          >
            {mainAlbum.title.english}
          </h2>
          <h3 className="text-lg text-(--theme-contrast)/80 sm:text-xl">
            {mainAlbum.title.japanese}
          </h3>
        </div>
      </div>

      <div
        className={cn(
          "max-w-fit gap-2",
          songs.length > 5 ? "columns-2" : "columns-1",
        )}
      >
        {songs.map(({ song, trackNumber }) => {
          const isCurrentSong = song.id === currentSongId;
          return (
            <Link
              key={song.id}
              href={`/lyrics/${song.id}`}
              aria-current={isCurrentSong ? "page" : undefined}
              className="group mb-1 flex items-center gap-2 rounded p-1 text-xs transition-all hover:bg-(--theme-contrast)/10 sm:text-sm md:px-2 lg:text-base"
              onClick={(e) => {
                if (isCurrentSong) e.preventDefault();
              }}
            >
              <span
                className={
                  isCurrentSong
                    ? "text-(--theme-contrast)"
                    : "text-(--theme-contrast)/50"
                }
              >
                {trackNumber}.
              </span>
              <span
                className={
                  isCurrentSong
                    ? "font-semibold text-(--theme-contrast)"
                    : "text-(--theme-contrast)/80 group-hover:text-(--theme-contrast)"
                }
              >
                {song.title.english}
              </span>
            </Link>
          );
        })}
      </div>

      {referenceAlbums.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-(--theme-contrast) sm:text-xl">
            Also appears in
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {referenceAlbums.map((album) => (
              <Link
                key={album.id}
                href={`/album/${album.id}`}
                className="group flex items-center gap-3 rounded-lg bg-(--theme-contrast)/5 p-3 transition-all hover:bg-(--theme-contrast)/10"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded shadow-md">
                  <Image
                    src={album.coverArt}
                    alt={`${album.title.english} (${album.title.japanese})`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-(--theme-contrast) group-hover:underline">
                    {album.title.english}
                  </p>
                  <p className="truncate text-xs text-(--theme-contrast)/70">
                    {album.title.japanese}
                  </p>
                  <p className="mt-1 text-xs font-medium text-(--theme-contrast)/50 uppercase">
                    {album.type}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
