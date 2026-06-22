"use client";

import { SiNiconico, SiYoutube } from "@icons-pack/react-simple-icons";
import { Check, Heart, Share2 } from "lucide-react";

import { useState } from "react";

import { useFavorites } from "@/features/lyrics/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface SongHeaderActionsProps {
  songId: string;
  songTitle: { english: string; japanese?: string };
  description?: string;
  youtubeId?: string | null;
  nicoId?: string | null;
}

const ACTION_BASE =
  "inline-flex items-center gap-2 rounded-md border border-(--theme-contrast)/25 bg-(--theme-contrast)/10 px-3 py-1.5 text-xs font-semibold text-(--theme-contrast) transition-colors hover:bg-(--theme-contrast)/20 focus-visible:ring-2 focus-visible:ring-(--theme-contrast)/50 focus-visible:ring-offset-2 focus-visible:ring-offset-(--theme-surface) focus-visible:outline-none";

export function SongHeaderActions({
  songId,
  songTitle,
  description,
  youtubeId,
  nicoId,
}: SongHeaderActionsProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  const isFavorite = favoriteIds.has(songId);

  async function handleShare() {
    const url = window.location.href;
    const titleDisplay = songTitle.japanese
      ? `${songTitle.english} (${songTitle.japanese})`
      : songTitle.english;
    const shareData = {
      title: `${titleDisplay} Lyrics — ado.fan`,
      text: description ?? `${titleDisplay} lyrics by Ado on ado.fan.`,
      url,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => {
        setShareState("idle");
      }, 1800);
    } catch {
      // clipboard unavailable (insecure context); silently no-op
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
      {youtubeId && (
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          aria-label="Open on YouTube"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-white transition-colors hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-(--theme-contrast)/50 focus-visible:ring-offset-2 focus-visible:ring-offset-(--theme-surface) focus-visible:outline-none"
        >
          <SiYoutube className="h-4 w-4" aria-hidden="true" />
          <span>YouTube</span>
        </a>
      )}

      {nicoId && (
        <a
          href={`https://www.nicovideo.jp/watch/${nicoId}`}
          target="_blank"
          aria-label="Open on NicoNico"
          rel="noopener noreferrer"
          className={ACTION_BASE}
        >
          <SiNiconico className="h-4 w-4" aria-hidden="true" />
          <span>NicoNico</span>
        </a>
      )}

      <button
        type="button"
        onClick={() => {
          toggleFavorite(songId);
        }}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className={cn(
          ACTION_BASE,
          isFavorite && "bg-(--theme-contrast)/25 hover:bg-(--theme-contrast)/30",
        )}
      >
        <Heart
          className={cn("h-4 w-4 transition-all", isFavorite && "fill-current")}
          aria-hidden="true"
        />
        <span>{isFavorite ? "Saved" : "Save"}</span>
      </button>

      <button
        type="button"
        onClick={() => {
          void handleShare();
        }}
        aria-label="Share this song"
        className={ACTION_BASE}
      >
        {shareState === "copied" ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  );
}
