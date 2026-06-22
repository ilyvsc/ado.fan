"use client";

import { Loader2, Search } from "lucide-react";

import { LyricsSongDisplay } from "./LyricsSongDisplay";

import type { SongListItem, SongSortOption } from "@/types/song";

interface SearchResultsPanelProps {
  loading: boolean;
  query: string;
  results: SongListItem[];
  sort: SongSortOption;
  viewMode: "grid" | "list";
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onClear: () => void;
}

export function SearchResultsPanel({
  loading,
  query,
  results,
  sort,
  viewMode,
  favorites,
  onToggleFavorite,
  onClear,
}: SearchResultsPanelProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center py-20 text-muted-foreground">
        <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin" />
        <p className="mt-3 text-sm">Searching...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-muted-foreground">
        <Search aria-hidden="true" className="mb-4 h-10 w-10 opacity-20" />
        <p className="text-sm">No results for &quot;{query}&quot;</p>
        <button
          type="button"
          onClick={onClear}
          className="mt-3 text-xs text-ado-primary hover:underline"
        >
          Clear search
        </button>
      </div>
    );
  }

  return (
    <LyricsSongDisplay
      key={`search-${sort}`}
      songs={results}
      viewMode={viewMode}
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
    />
  );
}
