"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { cn } from "@/shared/lib/utils";

gsap.registerPlugin(ScrollToPlugin);

const ALL_KEYS = [
  "#",
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
];

function doScroll(letter: string) {
  const target = document.getElementById(`letter-${letter}`);
  if (!target) return;
  const nav = document.getElementById("lyrics-nav");
  const navHeight = nav?.getBoundingClientRect().height ?? 0;
  const y = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
  gsap.to(window, {
    scrollTo: { y, autoKill: false },
    duration: 0.5,
    ease: "power3.out",
  });
}

export function AlphabetStrip({
  activeLetters,
  onShowAll,
}: {
  activeLetters: Set<string>;
  onShowAll: () => void;
}) {
  function handleClick(letter: string) {
    if (document.getElementById(`letter-${letter}`)) {
      doScroll(letter);
    } else {
      onShowAll();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          doScroll(letter);
        }),
      );
    }
  }

  return (
    <nav
      aria-label="Jump to letter"
      className="fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 flex-col gap-px sm:flex"
    >
      {ALL_KEYS.map((letter) => {
        const active = activeLetters.has(letter);
        return (
          <button
            type="button"
            key={letter}
            disabled={!active}
            aria-label={`Jump to songs starting with ${letter}`}
            onClick={() => {
              handleClick(letter);
            }}
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded text-xs font-medium transition-colors",
              active
                ? "text-muted-foreground hover:bg-foreground/6 hover:text-foreground"
                : "cursor-default text-muted-foreground/15",
            )}
          >
            {letter}
          </button>
        );
      })}
    </nav>
  );
}
