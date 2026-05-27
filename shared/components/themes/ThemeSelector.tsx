"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { SONG_THEMES, type SongTheme } from "@/shared/constants/themes";
import { cn } from "@/shared/lib/utils";
import { useSongTheme } from "@/shared/providers/SongThemeProvider";

import { ThemeToggleButton } from "./ThemeButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { useIsMobile } from "../ui/use-mobile";

function ThemeCard({
  theme,
  isSelected,
  onSelect,
  onHoverStart,
  onHoverEnd,
  className,
}: {
  theme: SongTheme;
  isSelected: boolean;
  onSelect: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={isSelected}
      aria-label={`${theme.songTitle.english} theme`}
      className={cn(
        "group relative w-full overflow-hidden rounded-md border transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-ado-primary focus-visible:outline-none",
        isSelected
          ? "border-ado-primary ring-2 ring-ado-primary"
          : "border-foreground/10 hover:border-ado-primary/50",
        className,
      )}
    >
      <div className="flex items-center gap-2 sm:block">
        <div className="relative size-18 shrink-0 overflow-hidden sm:aspect-square sm:size-auto lg:aspect-2/3">
          <Image
            src={theme.coverArt}
            alt={`${theme.songTitle.english} cover art`}
            fill
            sizes="(max-width: 640px) 56px, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 hidden bg-linear-to-t from-black/90 via-black/20 to-transparent sm:block" />
          <div className="absolute inset-x-0 bottom-0 hidden flex-col p-2 sm:flex">
            <span className="text-left font-gambarino text-sm leading-tight font-black text-white md:text-lg">
              {theme.songTitle.english}
            </span>
            <span className="text-left text-xs leading-tight text-white/70">
              {theme.songTitle.japanese}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:hidden">
          <span className="text-left font-gambarino text-base leading-tight font-black text-foreground">
            {theme.songTitle.english}
          </span>
          {theme.songTitle.japanese && (
            <span className="text-left text-xs leading-tight text-muted-foreground">
              {theme.songTitle.japanese}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function ThemeSelectorContent({ onClose }: { onClose: () => void }) {
  const { currentTheme, setTheme, previewTheme } = useSongTheme();
  const isMobile = useIsMobile();

  const hoverTimer = useRef<number | null>(null);
  useEffect(() => () => { clearHoverTimer(); }, []);

  function clearHoverTimer() {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }

  function handleHoverStart(theme: SongTheme) {
    if (isMobile || theme.id === currentTheme) return;
    clearHoverTimer();
    hoverTimer.current = window.setTimeout(() => {
      previewTheme(theme.id);
    }, 120);
  }

  function handleHoverEnd() {
    if (isMobile) return;
    clearHoverTimer();
    hoverTimer.current = window.setTimeout(() => {
      previewTheme(currentTheme);
    }, 100);
  }

  const activeTheme =
    SONG_THEMES.find((t) => t.id === currentTheme) ?? SONG_THEMES[0];

  const visibleThemes = isMobile
    ? SONG_THEMES
    : SONG_THEMES.filter((t) => t.id !== activeTheme.id);

  return (
    <div className="flex h-full flex-col md:flex-row">
      <div className="relative hidden w-72 shrink-0 overflow-hidden md:block lg:min-h-96 lg:w-72">
        <Image
          src={activeTheme.coverArt}
          alt={`${activeTheme.songTitle.english} cover art`}
          fill
          sizes="288px"
          priority
          className="object-cover transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-5">
          <span className="font-gambarino text-3xl leading-none text-white">
            {activeTheme.songTitle.english}
          </span>
          <span className="text-sm tracking-widest text-white/70">
            {activeTheme.songTitle.japanese}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-6">
        <div className="flex flex-col gap-1">
          <span className="font-gambarino text-2xl leading-none text-foreground sm:text-3xl">
            Choose Your Theme
          </span>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-base">
            See the whole site dressed in your favorite Ado song palette.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-2 lg:grid-cols-4">
          {visibleThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isSelected={currentTheme === theme.id}
              onSelect={() => {
                setTheme(theme.id);
                onClose();
              }}
              onHoverStart={() => { handleHoverStart(theme); }}
              onHoverEnd={handleHoverEnd}
              className="last:odd:col-span-2 sm:last:odd:col-span-1"
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:max-w-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              Appearance
            </span>
            <span className="text-xs text-muted-foreground">
              Switch between light, dark, or your system default.
            </span>
          </div>
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  );
}

export function ThemeSelectorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-xl border border-foreground/10 bg-background p-0 sm:max-h-fit lg:max-w-5xl">
        <DialogTitle className="sr-only">Choose Your Theme</DialogTitle>
        <DialogDescription className="sr-only">
          See the whole site dressed in your favorite Ado song palette.
        </DialogDescription>
        <ThemeSelectorContent onClose={() => { onOpenChange(false); }} />
      </DialogContent>
    </Dialog>
  );
}
