import { Heart, Music } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { SearchResult } from "@/types/search";
import type { SongListItem } from "@/types/song";

export function GridCard({
  song,
  isFavorite,
  onToggleFavorite,
  priority = false,
}: {
  song: SongListItem | SearchResult;
  isFavorite: boolean;
  onToggleFavorite?: (id: string) => void;
  priority?: boolean;
}) {
  const year = new Date(song.releaseDate).getFullYear();

  return (
    <Link
      href={`/lyrics/${song.id}`}
      data-song-id={song.id}
      className="group flex flex-col gap-2"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted-foreground/5">
        {song.coverArt ? (
          <Image
            src={song.coverArt}
            alt={song.title.english}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            {...(priority ? { priority: true } : { loading: "lazy" })}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Music
              aria-hidden="true"
              className="h-10 w-10 text-muted-foreground/30"
            />
          </div>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(song.id);
            }}
            className={cn(
              "absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100",
              isFavorite && "opacity-100",
            )}
          >
            <Heart
              aria-hidden="true"
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite ? "fill-ado-primary text-ado-primary" : "text-ado-primary",
              )}
            />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-ado-primary">
          {song.title.english}
        </p>
        {song.title.japanese && (
          <p className="line-clamp-1 font-jp-sans text-xs text-muted-foreground">
            {song.title.japanese}
          </p>
        )}
        <p className="text-xs text-muted-foreground/50 tabular-nums">{year}</p>
      </div>
    </Link>
  );
}
