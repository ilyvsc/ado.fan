"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useRef } from "react";

import { GridCard } from "./GridCard";
import { ListRow } from "./ListRow";

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
