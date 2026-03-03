"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useIsMobile } from "../ui/use-mobile";
import { ThemeToggleButton } from "./ThemeButton";

import { SONG_THEMES, type SongTheme } from "@/shared/constants/themes";
import { cn } from "@/shared/lib/utils";
import { useSongTheme } from "@/shared/providers/SongThemeProvider";

function StagePanel({ theme }: { theme: SongTheme }) {
  return (
    <div className="stage-panel relative hidden w-72 shrink-0 overflow-hidden md:block lg:min-h-96 lg:w-72">
      <Image
        src={theme.coverArt}
        alt={`${theme.songTitle.english} cover art`}
        fill
        sizes="288px"
        className="object-cover transition-all duration-700 ease-out"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-5">
        <span className="font-gambarino text-3xl leading-none text-white">
          {theme.songTitle.english}
        </span>
        <span className="text-xs tracking-widest text-white/50">
          {theme.songTitle.japanese}
        </span>
      </div>
    </div>
  );
}

function ThemeCard({
  theme,
  isSelected,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: {
  theme: SongTheme;
  isSelected: boolean;
  onSelect: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      aria-pressed={isSelected}
      aria-label={`${theme.songTitle.english} theme`}
      className={cn(
        "group relative w-full overflow-hidden rounded-md border transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-ado-primary focus-visible:outline-none",
        isSelected
          ? "border-ado-primary ring-2 ring-ado-primary"
          : "border-foreground/10 hover:border-ado-primary/50",
      )}
    >
      <div className="relative aspect-square overflow-hidden lg:aspect-2/3">
        <Image
          src={theme.coverArt}
          alt={`${theme.songTitle.english} cover art`}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col p-2">
          <span className="relative text-left font-gambarino text-sm leading-tight font-black text-white md:text-lg">
            {theme.songTitle.english}
          </span>
          <span className="relative text-left text-xs leading-tight text-white/50">
            {theme.songTitle.japanese}
          </span>
        </div>
      </div>
    </button>
  );
}

function ThemeSelectorContent({ onClose }: { onClose: () => void }) {
  const { currentTheme, setTheme, previewTheme } = useSongTheme();
  const isMobile = useIsMobile();
  const activeTheme =
    SONG_THEMES.find((t) => t.id === currentTheme) ?? SONG_THEMES[0];
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        ".stage-panel",
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
      )
        .fromTo(
          ".content-header",
          { y: -14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.6",
        )
        .fromTo(
          ".theme-card",
          { y: 22, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.055 },
          "-=0.5",
        )
        .fromTo(
          ".appearance-section",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2",
        );
    },
    { scope: containerRef, dependencies: [] },
  );

  useEffect(() => () => clearHoverTimer(), []);

  const visibleThemes = isMobile
    ? SONG_THEMES
    : SONG_THEMES.filter((t) => t.id !== currentTheme);

  function clearHoverTimer() {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }

  function handleHoverStart(theme: SongTheme) {
    if (isMobile) return;
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => {
      previewTheme(theme.id);
    }, 60);
  }

  function handleHoverEnd() {
    if (isMobile) return;
    clearHoverTimer();
    previewTheme(currentTheme);
  }

  return (
    <div ref={containerRef} className="flex h-full flex-col md:flex-row">
      <StagePanel theme={activeTheme} />

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="content-header flex flex-col gap-1">
          <span className="font-gambarino text-3xl leading-none text-foreground">
            Choose Your Theme
          </span>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            See the whole site dressed in your favorite Ado song palette.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-4">
          {visibleThemes.map((theme) => (
            <div key={theme.id} className="theme-card">
              <ThemeCard
                theme={theme}
                isSelected={currentTheme === theme.id}
                onSelect={() => {
                  setTheme(theme.id);
                  onClose();
                }}
                onHoverStart={() => handleHoverStart(theme)}
                onHoverEnd={handleHoverEnd}
              />
            </div>
          ))}
        </div>

        <div className="appearance-section mt-auto flex flex-col gap-2 sm:max-w-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-foreground">
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
      <DialogContent className="max-h-dvh max-w-2xl gap-0 overflow-hidden overflow-y-auto rounded-xl border border-foreground/10 bg-background p-0 sm:max-h-fit lg:max-w-5xl">
        <DialogTitle className="sr-only">Choose Your Theme</DialogTitle>
        <ThemeSelectorContent
          key={open ? "open" : "closed"}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
