"use client";

import { Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { ThemeSelectorDialog } from "./ThemeSelector";

export function ThemeSelectorButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5 text-foreground transition-all hover:bg-foreground/10",
        className,
      )}
      aria-label="Open theme selector"
      title="Theme selector"
    >
      <Palette className="size-4" />
    </button>
  );
}

export function FloatingThemeButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 md:bottom-8 md:left-8">
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="relative flex h-10 w-10 items-center justify-center rounded-md border border-foreground/10 bg-background text-foreground transition-colors hover:border-ado-primary/70"
          aria-label="Open theme selector"
          title="Theme selector"
        >
          <Palette className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-ado-primary" />
        </button>
      </div>
      <ThemeSelectorDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export function ThemeToggleButton() {
  const THEMES = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "Auto" },
  ];
  const { theme, setTheme } = useTheme();
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-foreground/10">
      {THEMES.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            onClick={() => {
              setTheme(value);
            }}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 border-r border-foreground/10 px-3 py-2 text-xs font-medium transition-colors duration-200 last:border-r-0",
              isActive
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )}
            aria-label={`Switch to ${label} mode`}
            aria-pressed={isActive}
          >
            <Icon className="size-3.5 shrink-0" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
