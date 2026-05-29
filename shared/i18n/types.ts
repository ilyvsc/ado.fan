export const Locale = {
  ENGLISH: { code: "en", label: "English", locale: true },
  JAPANESE: { code: "ja", label: "日本語", locale: true },
  ROMAJI: { code: "romaji", label: "Romaji", locale: false },
} as const;

export type LanguageCode = (typeof Locale)[keyof typeof Locale]["code"];
export const locales = Object.values(Locale)
  .filter((language) => language.locale)
  .map((language) => language.code) as readonly LanguageCode[];

export const defaultLocale = Locale.ENGLISH;
