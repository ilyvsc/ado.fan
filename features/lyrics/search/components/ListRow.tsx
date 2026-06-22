import { Heart, Music } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { SearchResult } from "@/types/search";
import type { SongListItem } from "@/types/song";

export function ListRow({
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
  return (
    <Link
      href={`/lyrics/${song.id}`}
      data-song-id={song.id}
      className="group flex items-center gap-4 px-2 py-3 transition-opacity hover:bg-foreground/3"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-none">
        {song.coverArt ? (
          <Image
            src={song.coverArt}
            alt={song.title.english}
            fill
            sizes="44px"
            className="object-cover"
            {...(priority ? { priority: true } : { loading: "lazy" })}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted-foreground/10">
            <Music aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-medium text-foreground">
          {song.title.english}
        </p>
        {song.title.japanese && (
          <p className="line-clamp-1 font-jp-sans text-xs text-muted-foreground">
            {song.title.japanese}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {onToggleFavorite && (
          <button
            type="button"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(song.id);
            }}
          >
            <Heart
              aria-hidden="true"
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite
                  ? "fill-ado-primary text-ado-primary opacity-100"
                  : "text-ado-primary opacity-0 group-hover:opacity-100",
              )}
            />
          </button>
        )}
        <span className="text-xs text-muted-foreground/50 tabular-nums">
          {new Date(song.releaseDate).getFullYear()}
        </span>
      </div>
    </Link>
  );
}
