export type Lyrics = {
  songId: string;
  language: string;
  translator: string | null;
  lines: string[];
};

export type Language = {
  code: string;
  label: string;
  content: string;
};

const LANGUAGE_LABELS: Record<string, { label: string }> = {
  ja: { label: "日本語" },
  en: { label: "English" },
  romaji: { label: "Romaji" },
  ko: { label: "한국어" },
  zh: { label: "中文" },
  es: { label: "Español" },
  fr: { label: "Français" },
  de: { label: "Deutsch" },
  ru: { label: "Русский" },
};

export function getLanguageLabel(code: string): string {
  return LANGUAGE_LABELS[code.toLowerCase()]?.label ?? code.toUpperCase();
}
