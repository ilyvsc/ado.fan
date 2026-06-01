import { defaultLocale, locales } from "../i18n/types";

import type { Metadata } from "next";

export const SEO_BASE_URL = "https://ado.fan";

export const SITE_KEYWORDS: string[] = [
  "Ado",
  "Ado singer",
  "Ado fan site",
  "Ado music",
  "Ado lyrics",
  "Ado discography",
  "Ado world tour",
  "Ado Usseewa",
  "Ado New Genesis",
  "Ado One Piece",
  "Ado utaite",
  "Japanese singer",
  "utaite",
  "Japanese pop",
  "anime music",
  "Ado anonymous singer",
];

/**
 * Builds an absolute URL for the given pathname.
 *
 * The pathname may be provided with or without a leading slash.
 *
 * Example:
 *
 * ```ts
 * buildUrl("/") // https://ado.fan/
 * ```
 *
 * @param pathname - Route pathname.
 * @returns Absolute URL for the route.
 */
export function buildUrl(pathname = ""): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SEO_BASE_URL}${normalized}`;
}

/**
 * Generates canonical and localized URLs for a route.
 *
 * The default locale is served without a locale prefix, while
 * all other locales are prefixed with their locale code.
 *
 * Example:
 *
 * ```ts
 * buildLocalizedUrls("/lyrics/show")
 * // {
 * //   canonical: "https://ado.fan/lyrics/show",
 * //   languages: {
 * //     en: "https://ado.fan/lyrics/show",
 * //     es: "https://ado.fan/es/lyrics/show"
 * //   }
 * // }
 * ```
 *
 * @param pathname - Route pathname. May be provided with or without a leading slash.
 * @returns Canonical URL and locale-specific alternate URLs.
 */
export function buildLocalizedUrls(pathname = ""): {
  canonical: string;
  languages: Record<string, string>;
} {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const canonical = buildUrl(normalized);

  const languages = Object.fromEntries(
    locales.map((locale) => [
      locale,
      locale === defaultLocale.code ? canonical : buildUrl(`/${locale}${normalized}`),
    ]),
  );

  return { canonical, languages };
}

/**
 * Builds the Next.js metadata alternates configuration for a route.
 *
 * Generates:
 * - A canonical URL for the current pathname.
 * - Localized alternate URLs for all configured locales.
 *
 * This helper is intended for use inside page metadata definitions.
 * For sitemap generation and other SEO utilities, prefer using
 * {@link buildLocalizedUrls} directly.
 *
 * Example:
 *
 * ```ts
 * export const metadata: Metadata = {
 *   alternates: buildAlternates("/lyrics"),
 * };
 * ```
 *
 * @param pathname - Route pathname. May be provided with or without a leading slash.
 * @returns Next.js Metadata alternates configuration.
 */
export function buildAlternates(pathname = ""): Metadata["alternates"] {
  const { canonical, languages } = buildLocalizedUrls(pathname);
  return { canonical, languages };
}

/**
 * Parses a duration string in `MM:SS` format.
 *
 * @param duration - Duration string (e.g. `"03:45"`).
 * @returns The parsed minutes and seconds.
 */
function parseDuration(
  duration: string,
): Readonly<{ minutes: number; seconds: number }> {
  const [minutes = 0, seconds = 0] = duration.split(":").map(Number);
  return { minutes, seconds };
}

/**
 * Converts a duration string in `MM:SS` format to an ISO 8601 duration.
 *
 * @param duration - Duration string (e.g. `"03:45"`).
 * @returns ISO 8601 duration string (e.g. `"PT3M45S"`).
 */
export function durationToIso8601(duration: string): string {
  const { minutes, seconds } = parseDuration(duration);
  return `PT${minutes}M${seconds}S`;
}

/**
 * Converts a duration string in `MM:SS` format to total seconds.
 *
 * @param duration - Duration string (e.g. `"03:45"`).
 * @returns Total duration in seconds.
 */
export function durationToSeconds(duration: string): number {
  const { minutes, seconds } = parseDuration(duration);
  return minutes * 60 + seconds;
}
