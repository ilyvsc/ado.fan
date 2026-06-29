import { Locale, type LanguageCode } from "@/i18n/types";

export interface Lyrics {
  songId: string;
  language: LanguageCode;
  translator: string | null;
  lines: string[];
}

export interface LyricsEntry {
  language: string;
  translator: string | null;
  lines: string[];
}

export interface LyricsLanguage {
  code: LanguageCode;
  label: string;
  lines: string[];
}

export function getLanguageLabel(code: string): string {
  return Object.values(Locale).find((locale) => locale.code === code)?.label ?? code;
}

export const KNOWN_LANGUAGES = Object.values(Locale).map((l) => ({
  code: l.code,
  label: l.label,
}));
