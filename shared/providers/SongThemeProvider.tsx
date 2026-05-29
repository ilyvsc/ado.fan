"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ThemeContext {
  currentTheme: string | null;
  setTheme: (themeId: string | null) => void;
  previewTheme: (themeId: string | null) => void;
}

const SongThemeContext = createContext<ThemeContext | undefined>(undefined);

const SONG_THEME_KEY = "song-theme";

function applyTheme(themeId: string | null) {
  const root = document.documentElement;

  if (themeId) {
    root.setAttribute("data-theme", themeId);
  } else {
    root.removeAttribute("data-theme");
  }
}

function readSavedTheme(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SONG_THEME_KEY);
}

export function SongThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<string | null>(() => {
    const saved = readSavedTheme();
    if (saved) applyTheme(saved);
    return saved;
  });

  const setTheme = useCallback((themeId: string | null) => {
    applyTheme(themeId);
    if (themeId) {
      localStorage.setItem(SONG_THEME_KEY, themeId);
    } else {
      localStorage.removeItem(SONG_THEME_KEY);
    }
    setCurrentTheme(themeId);
  }, []);

  const previewTheme = useCallback(
    (themeId: string | null) => {
      applyTheme(themeId ?? currentTheme);
    },
    [currentTheme],
  );

  return (
    <SongThemeContext.Provider value={{ currentTheme, setTheme, previewTheme }}>
      {children}
    </SongThemeContext.Provider>
  );
}

export function useSongTheme() {
  const context = useContext(SongThemeContext);
  if (!context) throw new Error();
  return context;
}
