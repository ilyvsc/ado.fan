"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Heart, Music } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { cn } from "@/shared/lib/utils";

import type { SearchResult } from "@/types/search";
import type { SongListItem } from "@/types/song";

type ViewMode = "grid" | "list";

export function LyricsSongDisplay({
  songs,
  viewMode,
  totalCount,
  showLetterGroups,
  favorites,
  onToggleFavorite,
}: {
  songs: (SongListItem | SearchResult)[];
  viewMode?: ViewMode;
  totalCount?: number;
  showLetterGroups?: boolean;
  favorites?: Set<string>;
  onToggleFavorite?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedIds = useRef<Set<string>>(new Set());
  const animatedLetters = useRef<Set<string>>(new Set());

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const allItems = container.querySelectorAll<HTMLElement>("[data-song-id]");
      const allHeadings = container.querySelectorAll<HTMLElement>(
        "[data-letter-heading]",
      );

      const newItems: HTMLElement[] = [];
      const newHeadings: HTMLElement[] = [];

      allItems.forEach((item) => {
        const id = item.dataset.songId;
        if (!id || animatedIds.current.has(id)) return;
        animatedIds.current.add(id);
        newItems.push(item);
      });

      allHeadings.forEach((el) => {
        const letter = el.dataset.letterHeading;
        if (!letter || animatedLetters.current.has(letter)) return;
        animatedLetters.current.add(letter);
        newHeadings.push(el);
      });

      if (prefersReduced) {
        if (newHeadings.length) gsap.set(newHeadings, { opacity: 1 });
        if (newItems.length)
          gsap.set(newItems, { opacity: 1, y: 0, clearProps: "all" });
        return;
      }

      if (newHeadings.length) {
        gsap.set(newHeadings, { opacity: 0 });
        gsap.to(newHeadings, {
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
        });
      }

      if (newItems.length) {
        gsap.set(newItems, { opacity: 0, y: 20 });
        gsap.to(newItems, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: "power3.out",
          clearProps: "all",
        });
      }
    },
    {
      scope: containerRef,
      dependencies: [songs.map((s) => s.id).join()],
    },
  );

  if (songs.length === 0) return null;

  const displayCount = totalCount ?? songs.length;

  const heading = (
    <div className="mb-4 flex items-center gap-2">
      <h2 className="text-sm font-semibold tracking-widest text-ado-primary uppercase">
        All Songs
      </h2>
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-muted-foreground" />
      <span className="font-mono text-sm text-muted-foreground">{displayCount}</span>
    </div>
  );

  if (showLetterGroups) {
    const groups = songs.reduce<Record<string, (SongListItem | SearchResult)[]>>(
      (acc, song) => {
        const firstChar = song.title.english.trim().charAt(0).toUpperCase();
        const groupKey = /^\d$/.test(firstChar) ? "#" : firstChar || "#";

        acc[groupKey] ??= [];
        acc[groupKey].push(song);

        return acc;
      },
      {},
    );

    if (viewMode === "list") {
      return (
        <div ref={containerRef}>
          {heading}
          {Object.entries(groups).map(([letter, grouped], groupIndex) => (
            <div key={letter} className={groupIndex > 0 ? "mt-2" : undefined}>
              <div
                id={`letter-${letter}`}
                data-letter-heading={letter}
                className="mb-2 text-xs font-bold tracking-widest text-muted-foreground/30 uppercase"
              >
                {letter}
              </div>
              <div className="flex flex-col divide-y divide-foreground/5">
                {grouped.map((song, itemIndex) => (
                  <ListRow
                    key={song.id}
                    song={song}
                    priority={groupIndex === 0 && itemIndex < 6}
                    isFavorite={favorites?.has(song.id) ?? false}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div ref={containerRef}>
        {heading}
        {Object.entries(groups).map(([letter, grouped], groupIndex) => (
          <div key={letter} className={groupIndex > 0 ? "mt-6" : undefined}>
            <div
              id={`letter-${letter}`}
              data-letter-heading={letter}
              className="mb-3 text-xs font-bold tracking-widest text-muted-foreground/30 uppercase"
            >
              {letter}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {grouped.map((song, itemIndex) => (
                <GridCard
                  key={song.id}
                  song={song}
                  priority={groupIndex === 0 && itemIndex < 6}
                  isFavorite={favorites?.has(song.id) ?? false}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div ref={containerRef}>
        {heading}
        <div className="flex flex-col divide-y divide-foreground/5">
          {songs.map((song, index) => (
            <ListRow
              key={song.id}
              song={song}
              priority={index < 6}
              isFavorite={favorites?.has(song.id) ?? false}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      {heading}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {songs.map((song, index) => (
          <GridCard
            key={song.id}
            song={song}
            priority={index < 6}
            isFavorite={favorites?.has(song.id) ?? false}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

function GridCard({
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
          <button type="button"
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

function ListRow({
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
          <button type="button"
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
