import { Locale, type LanguageCode } from "@/i18n/types";

export interface Lyrics {
  songId: string;
  language: LanguageCode;
  translator: string | null;
  lines: string[];
}

export interface LyricsLanguage {
  code: LanguageCode;
  label: string;
  content: string;
  lines: string[];
}

export function getLanguageLabel(code: string): string {
  return Object.values(Locale).find((locale) => locale.code === code)?.label ?? code;
}
